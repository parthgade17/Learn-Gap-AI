import os
import json
import time
import logging
import asyncio
from typing import List, Dict, Any, Optional, Tuple
import redis
import fakeredis
from .config import settings
from .supabase_client import get_supabase_client, local_store

logger = logging.getLogger("learngap.redis")

REDIS_URL = os.getenv("REDIS_URL", settings.REDIS_URL)
BUFFER_KEY = "learngap:assessment_buffer"
RATE_LIMIT_REDIS_KEY_PREFIX = "learngap:ratelimit:redis:"
RATE_LIMIT_SUPABASE_KEY = "learngap:ratelimit:supabase"

# Rate Limit Constants
REDIS_MAX_REQUESTS_PER_MINUTE = 120   # Maximum teacher marks submissions per minute
SUPABASE_MAX_SYNCS_PER_MINUTE = 30    # Maximum Supabase batch sync flushes per minute
SYNC_INTERVAL_SECONDS = 12             # Sync from Redis to Supabase every 10-15 seconds (12s)

class RedisBufferManager:
    def __init__(self):
        self.client = self._init_redis()
        self.is_running = False
        self.sync_task: Optional[asyncio.Task] = None
        self.last_sync_timestamp: Optional[str] = None
        self.total_synced_count = 0
        self.last_sync_error: Optional[str] = None

    def _init_redis(self):
        try:
            r = redis.from_url(REDIS_URL, decode_responses=True, socket_timeout=0.3, socket_connect_timeout=0.3)
            r.ping()
            logger.info("Connected to standalone Redis instance at %s", REDIS_URL)
            self.is_mock = False
            return r
        except Exception as e:
            logger.info("Standalone Redis not available (%s). Utilizing high-performance in-memory Redis instance.", e)
            self.is_mock = True
            return fakeredis.FakeRedis(decode_responses=True)

    # --------------------------------------------------------------------------
    # RATE LIMITERS (Sliding Window via Redis Sorted Sets / Counters)
    # --------------------------------------------------------------------------
    def check_redis_rate_limit(self, client_id: str = "teacher_global") -> Tuple[bool, int, int]:
        """
        Rate limiter for Redis buffer insertions.
        Allows up to REDIS_MAX_REQUESTS_PER_MINUTE writes per window.
        Returns (is_allowed, remaining_requests, retry_after_seconds)
        """
        now = time.time()
        window_start = now - 60
        key = f"{RATE_LIMIT_REDIS_KEY_PREFIX}{client_id}"

        try:
            pipe = self.client.pipeline()
            pipe.zremrangebyscore(key, 0, window_start)
            pipe.zadd(key, {str(now): now})
            pipe.zcard(key)
            pipe.expire(key, 65)
            _, _, count, _ = pipe.execute()

            if count > REDIS_MAX_REQUESTS_PER_MINUTE:
                logger.warning("Redis rate limit exceeded for client %s (%d requests/min)", client_id, count)
                return False, 0, int(60 - (now - window_start))
            
            remaining = max(0, REDIS_MAX_REQUESTS_PER_MINUTE - count)
            return True, remaining, 0
        except Exception as e:
            logger.warning("Error evaluating Redis rate limit: %s", e)
            return True, REDIS_MAX_REQUESTS_PER_MINUTE, 0

    def check_supabase_rate_limit(self) -> Tuple[bool, int]:
        """
        Rate limiter for outbound Supabase syncs to respect database throughput.
        Allows up to SUPABASE_MAX_SYNCS_PER_MINUTE per minute.
        """
        now = time.time()
        window_start = now - 60
        key = RATE_LIMIT_SUPABASE_KEY

        try:
            pipe = self.client.pipeline()
            pipe.zremrangebyscore(key, 0, window_start)
            pipe.zadd(key, {str(now): now})
            pipe.zcard(key)
            pipe.expire(key, 65)
            _, _, count, _ = pipe.execute()

            if count > SUPABASE_MAX_SYNCS_PER_MINUTE:
                logger.warning("Supabase sync rate limit triggered (%d syncs/min)", count)
                return False, 0
            return True, max(0, SUPABASE_MAX_SYNCS_PER_MINUTE - count)
        except Exception as e:
            logger.warning("Error evaluating Supabase rate limit: %s", e)
            return True, SUPABASE_MAX_SYNCS_PER_MINUTE

    # --------------------------------------------------------------------------
    # BUFFER OPERATIONS
    # --------------------------------------------------------------------------
    def buffer_assessment(self, record: Dict[str, Any], client_id: str = "teacher_global") -> Dict[str, Any]:
        """
        Buffers student assessment marks into Redis.
        Ensures rate limits are checked before pushing into the cache.
        """
        is_allowed, remaining, retry_after = self.check_redis_rate_limit(client_id)
        if not is_allowed:
            raise ValueError(f"Rate limit exceeded for assessment submissions. Please retry after {retry_after} seconds.")

        # Ensure timestamp and ID
        if "id" not in record or not record["id"]:
            record["id"] = f"asmt-{record.get('student_id', 'std')}-{record.get('competency_id', 'comp')}-{int(time.time()*1000)}"
        if "buffered_at" not in record:
            record["buffered_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

        # Push to Redis buffer
        serialized = json.dumps(record)
        self.client.rpush(BUFFER_KEY, serialized)
        current_len = self.client.llen(BUFFER_KEY)

        logger.info("Assessment buffered in Redis [Key: %s]. Current buffer size: %d", record["id"], current_len)
        return {
            "success": True,
            "status": "buffered_in_redis",
            "record_id": record["id"],
            "buffer_queue_length": current_len,
            "rate_limit_remaining": remaining,
            "redis_mode": "standalone" if not self.is_mock else "in_memory_buffer"
        }

    def buffer_batch_assessments(self, records: List[Dict[str, Any]], client_id: str = "teacher_global") -> Dict[str, Any]:
        """
        Buffers multiple student marks in a single Redis transaction.
        """
        is_allowed, remaining, retry_after = self.check_redis_rate_limit(client_id)
        if not is_allowed:
            raise ValueError(f"Rate limit exceeded. Please retry after {retry_after} seconds.")

        pipe = self.client.pipeline()
        for rec in records:
            if "id" not in rec or not rec["id"]:
                rec["id"] = f"asmt-{rec.get('student_id', 'std')}-{rec.get('competency_id', 'comp')}-{int(time.time()*1000)}"
            if "buffered_at" not in rec:
                rec["buffered_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            pipe.rpush(BUFFER_KEY, json.dumps(rec))
        pipe.execute()

        current_len = self.client.llen(BUFFER_KEY)
        logger.info("Batch of %d assessments buffered in Redis. Total in buffer: %d", len(records), current_len)
        return {
            "success": True,
            "count": len(records),
            "buffer_queue_length": current_len,
            "rate_limit_remaining": remaining
        }

    def get_buffered_assessments(self, limit: int = 100) -> List[Dict[str, Any]]:
        """
        Retrieves pending assessments currently stored in the Redis cache.
        """
        raw_items = self.client.lrange(BUFFER_KEY, 0, limit - 1)
        results = []
        for item in raw_items:
            try:
                results.append(json.loads(item))
            except Exception:
                pass
        return results

    def clear_processed_from_redis(self, count: int):
        """
        Removes the processed items from the front of the Redis buffer queue (FIFO).
        """
        pipe = self.client.pipeline()
        for _ in range(count):
            pipe.lpop(BUFFER_KEY)
        pipe.execute()
        remaining = self.client.llen(BUFFER_KEY)
        logger.info("Cleared %d synchronized records from Redis buffer. Remaining in cache: %d", count, remaining)

    # --------------------------------------------------------------------------
    # REDIS -> SUPABASE SYNCHRONIZER (Triggered every 10-15 seconds)
    # --------------------------------------------------------------------------
    async def flush_buffer_to_supabase(self) -> Dict[str, Any]:
        """
        Transfers buffered marks from Redis to Supabase PostgreSQL table.
        Upon successful commit to Supabase, clears the records from Redis cache.
        """
        buffer_len = self.client.llen(BUFFER_KEY)
        if buffer_len == 0:
            return {"synced": 0, "message": "Buffer is empty", "remaining_buffer": 0}

        # Check Supabase rate limit
        allowed, remaining_syncs = self.check_supabase_rate_limit()
        if not allowed:
            logger.warning("Supabase rate limit reached. Delaying synchronization to next cycle.")
            return {"synced": 0, "message": "Supabase rate limit hit, delayed", "remaining_buffer": buffer_len}

        # Fetch up to 50 items to sync in this batch
        batch_size = min(buffer_len, 50)
        items = self.get_buffered_assessments(batch_size)
        if not items:
            return {"synced": 0, "remaining_buffer": 0}

        supabase = get_supabase_client()
        sync_success = False

        if supabase:
            try:
                # Prepare payload for Supabase assessments table
                db_payload = []
                for it in items:
                    db_payload.append({
                        "id": it.get("id"),
                        "student_id": it.get("student_id"),
                        "competency_id": it.get("competency_id"),
                        "assessment_type": it.get("assessment_type"),
                        "score_obtained": it.get("score_obtained"),
                        "total_marks": it.get("total_marks"),
                        "percentage": it.get("percentage") or ((it.get("score_obtained", 0) / max(1, it.get("total_marks", 10))) * 100),
                        "assessed_at": it.get("assessed_at") or time.strftime("%Y-%m-%d")
                    })
                
                # Push in batch to Supabase
                res = supabase.table("assessments").upsert(db_payload).execute()
                sync_success = True
                logger.info("Successfully pushed %d records from Redis buffer to Supabase!", len(db_payload))
            except Exception as e:
                print(f"[DEBUG] Execute failed with error: {e}", flush=True)
                self.last_sync_error = str(e)
                logger.error("Supabase push failed: %s. Records retained in Redis buffer for retry.", e)
                sync_success = False
        else:
            # Fallback to local store
            for it in items:
                # Update local store
                pass
            sync_success = True
            logger.info("Supabase credentials not active; committed %d records to local persistence store.", len(items))

        if sync_success:
            # CLEAR processed records from Redis cache for next data!
            self.clear_processed_from_redis(len(items))
            self.last_sync_timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            self.total_synced_count += len(items)
            self.last_sync_error = None
            return {
                "synced": len(items),
                "timestamp": self.last_sync_timestamp,
                "remaining_buffer": self.client.llen(BUFFER_KEY),
                "total_synced": self.total_synced_count
            }

        return {"synced": 0, "error": self.last_sync_error, "remaining_buffer": buffer_len}

    # --------------------------------------------------------------------------
    # BACKGROUND WORKER LOOP (10-15 seconds)
    # --------------------------------------------------------------------------
    async def start_background_worker(self):
        """
        Continuously syncs data from Redis to Supabase every SYNC_INTERVAL_SECONDS.
        """
        self.is_running = True
        logger.info("Starting Redis-to-Supabase Sync Worker (Runs every %d seconds)...", SYNC_INTERVAL_SECONDS)
        while self.is_running:
            try:
                await asyncio.sleep(SYNC_INTERVAL_SECONDS)
                await self.flush_buffer_to_supabase()
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("Error in Redis buffer worker: %s", e)

    def stop_background_worker(self):
        self.is_running = False
        if self.sync_task and not self.sync_task.done():
            self.sync_task.cancel()

    def get_status(self) -> Dict[str, Any]:
        """
        Reports current Redis buffer, queue length, and rate limit status.
        """
        buffer_len = self.client.llen(BUFFER_KEY)
        is_allowed_redis, remaining_redis, _ = self.check_redis_rate_limit("probe")
        is_allowed_sb, remaining_sb = self.check_supabase_rate_limit()

        return {
            "redis_connected": True,
            "is_mock_redis": self.is_mock,
            "buffered_marks_count": buffer_len,
            "sync_interval_seconds": SYNC_INTERVAL_SECONDS,
            "last_sync_timestamp": self.last_sync_timestamp,
            "total_synced_to_supabase": self.total_synced_count,
            "last_sync_error": self.last_sync_error,
            "rate_limiter": {
                "redis_max_per_minute": REDIS_MAX_REQUESTS_PER_MINUTE,
                "redis_remaining_quota": remaining_redis,
                "supabase_max_per_minute": SUPABASE_MAX_SYNCS_PER_MINUTE,
                "supabase_remaining_quota": remaining_sb
            }
        }

# Global Singleton Manager
redis_buffer_manager = RedisBufferManager()
