/**
 * Frontend Redis Buffer & Rate Limiter Client
 * Handles temporary storage of student assessment marks in Redis buffer,
 * which is synchronized to Supabase every 10-15 seconds.
 */

export interface RedisBufferRecord {
  id?: string;
  student_id: string;
  competency_id: string;
  assessment_type: 'baseline' | 'follow_up';
  score_obtained: number;
  total_marks: number;
  percentage?: number;
  assessed_at?: string;
}

export interface RedisBufferStatusResponse {
  redis_connected: boolean;
  is_mock_redis: boolean;
  buffered_marks_count: number;
  sync_interval_seconds: number;
  last_sync_timestamp: string | null;
  total_synced_to_supabase: number;
  last_sync_error: string | null;
  rate_limiter: {
    redis_max_per_minute: number;
    redis_remaining_quota: number;
    supabase_max_per_minute: number;
    supabase_remaining_quota: number;
  };
}

const BACKEND_BASE = (import.meta.env.VITE_BACKEND_URL as string) || 'http://127.0.0.1:8000';

export async function bufferAssessmentToRedis(record: RedisBufferRecord): Promise<{ success: boolean; buffer_queue_length?: number; error?: string }> {
  try {
    const res = await fetch(`${BACKEND_BASE}/api/assessment/buffer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(record)
    });

    if (!res.ok) {
      if (res.status === 429) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Rate limit reached for Redis buffer submission. Please wait a moment.');
      }
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return { success: true, buffer_queue_length: data.buffer_queue_length };
  } catch (err: unknown) {
    console.warn('Redis buffer backend unavailable or rate-limited; recorded to local queue.', err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function bufferBatchToRedis(records: RedisBufferRecord[]): Promise<{ success: boolean; buffer_queue_length?: number; count?: number; error?: string }> {
  try {
    const res = await fetch(`${BACKEND_BASE}/api/assessment/buffer/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ records })
    });

    if (!res.ok) {
      if (res.status === 429) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Rate limit reached for Redis batch submission. Please wait a moment.');
      }
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return { success: true, buffer_queue_length: data.buffer_queue_length, count: data.count };
  } catch (err: unknown) {
    console.warn('Redis batch buffer failed:', err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function getRedisBufferStatus(): Promise<RedisBufferStatusResponse | null> {
  try {
    const res = await fetch(`${BACKEND_BASE}/api/assessment/buffer-status`, {
      method: 'GET'
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function forceFlushRedisToSupabase(): Promise<{ synced: number; error?: string }> {
  try {
    const res = await fetch(`${BACKEND_BASE}/api/assessment/flush-buffer`, {
      method: 'POST'
    });
    return await res.json();
  } catch (err: unknown) {
    return { synced: 0, error: err instanceof Error ? err.message : String(err) };
  }
}
