from typing import List, Optional
from fastapi import APIRouter
from ..models import GapDiagnosis, StudentGroup
from ..supabase_client import local_store, get_supabase_client
from ..engine.gap_engine import run_gap_diagnosis, cluster_students_by_competency

router = APIRouter(prefix="/gap-engine", tags=["Learning Gap Engine"])

@router.get("/diagnoses", response_model=List[GapDiagnosis])
def get_gap_diagnoses():
    """
    Module B: Learning Gap Engine (Deterministic Rule Engine)
    Evaluates students against competency passing thresholds (default 60%).
    """
    return run_gap_diagnosis(
        local_store.students,
        local_store.competencies,
        local_store.assessments
    )

@router.get("/groups", response_model=List[StudentGroup])
def get_competency_groups(subject: Optional[str] = None):
    """
    Module B: Student Clustering
    Groups students struggling with identical competencies for peer remediation.
    """
    diagnoses = run_gap_diagnosis(
        local_store.students,
        local_store.competencies,
        local_store.assessments
    )
    groups = cluster_students_by_competency(
        diagnoses,
        local_store.students,
        local_store.competencies,
        local_store.activities
    )
    if subject and subject.upper() != "ALL":
        groups = [g for g in groups if g.competency.subject.lower() == subject.lower()]
    return groups
