from typing import Optional
from fastapi import APIRouter, Query
from ..models import DashboardMetricsResponse
from ..supabase_client import local_store
from ..engine.gap_engine import compute_dashboard_metrics

router = APIRouter(prefix="/dashboard", tags=["Progress & Outcomes Dashboard"])

@router.get("/metrics", response_model=DashboardMetricsResponse)
def get_dashboard_metrics(
    role: str = Query(default="teacher", description="teacher | head_teacher"),
    grade: Optional[int] = Query(default=None, description="Optional grade/class filter for Head Teacher (e.g. 5, 6, 7, 8)")
):
    """
    Module D: Progress Dashboard & Closed-Loop Metrics
    Compares baseline diagnostic marks against post-remediation follow-up marks.
    For head_teacher, can return either entire school aggregates or class-specific metrics.
    """
    students = local_store.students
    assessments = local_store.assessments
    plans = local_store.plans

    if grade is not None and isinstance(grade, int):
        students = [s for s in students if s.grade == grade]
        student_ids = set(s.id for s in students)
        assessments = [a for a in assessments if a.student_id in student_ids]
        plans = [p for p in plans if p.grade == grade]

    return compute_dashboard_metrics(
        students,
        local_store.competencies,
        assessments,
        len(plans)
    )
