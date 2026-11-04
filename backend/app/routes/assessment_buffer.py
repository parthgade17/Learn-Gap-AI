from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from ..redis_client import redis_buffer_manager

router = APIRouter(prefix="/assessment", tags=["Redis Assessment Buffer"])

class AssessmentBufferPayload(BaseModel):
    id: Optional[str] = None
    student_id: str
    competency_id: str
    assessment_type: str = "baseline"
    score_obtained: float
    total_marks: float = 10.0
    percentage: Optional[float] = None
    assessed_at: Optional[str] = None

class BatchBufferPayload(BaseModel):
    records: List[AssessmentBufferPayload]

@router.post("/buffer")
async def buffer_single_assessment(payload: AssessmentBufferPayload, request: Request):
    """
    Submits student marks to the temporary Redis buffer.
    Rate-limited to protect the database and server.
    Every 10-15 seconds, a background worker flushes this buffer to Supabase.
    """
    client_ip = request.client.host if request.client else "global"
    try:
        res = redis_buffer_manager.buffer_assessment(payload.model_dump(), client_id=client_ip)
        return res
    except ValueError as e:
        raise HTTPException(status_code=429, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to buffer assessment: {str(e)}")

@router.post("/buffer/batch")
async def buffer_batch_assessment(payload: BatchBufferPayload, request: Request):
    """
    Submits a batch of marks into the Redis buffer in a single atomic transaction.
    """
    client_ip = request.client.host if request.client else "global"
    try:
        dict_records = [r.model_dump() for r in payload.records]
        res = redis_buffer_manager.buffer_batch_assessments(dict_records, client_id=client_ip)
        return res
    except ValueError as e:
        raise HTTPException(status_code=429, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to buffer batch: {str(e)}")

@router.get("/buffer-status")
async def get_buffer_status():
    """
    Returns live statistics on the Redis buffer queue length,
    the timestamp of the last Supabase sync, and rate-limiter quotas.
    """
    return redis_buffer_manager.get_status()

@router.post("/flush-buffer")
async def trigger_buffer_flush():
    """
    Triggers an immediate flush of pending marks from Redis to Supabase,
    and clears the cache from Redis once updated.
    """
    return await redis_buffer_manager.flush_buffer_to_supabase()
