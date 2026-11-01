from fastapi import APIRouter, Query
from ..models import DashboardMetricsResponse
from ..supabase_client import local_store
from ..engine.gap_engine import compute_dashboard_metrics

router = APIRouter(prefix="/dashboard", tags=["Progress & Outcomes Dashboard"])

@router.get("/metrics", response_model=DashboardMetricsResponse)
def get_dashboard_metrics(role: str = Query(default="teacher", description="teacher | head_teacher | block_officer")):
    """
    Module D: Progress Dashboard & Closed-Loop Metrics
    Compares baseline diagnostic marks against post-remediation follow-up marks.
    For block_officer role, data is presented as high-level block aggregates.
    """
    return compute_dashboard_metrics(
        local_store.students,
        local_store.competencies,
        local_store.assessments,
        len(local_store.plans)
    )
