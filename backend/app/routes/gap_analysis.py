from typing import List, Optional
from fastapi import APIRouter, HTTPException
from ..models import GapDiagnosis, StudentGroup, StudentAIPrediction, CohortAIPrediction
from ..supabase_client import local_store
from ..engine.gap_engine import (
    run_gap_diagnosis,
    group_learners,
    predict_student_mastery,
    predict_cohort_outcomes
)

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
    Groups students struggling with identical competencies for peer remediation across all 7 subjects.
    """
    diagnoses = run_gap_diagnosis(
        local_store.students,
        local_store.competencies,
        local_store.assessments
    )
    groups = group_learners(
        diagnoses,
        local_store.students,
        local_store.competencies,
        local_store.activities
    )
    if subject and subject.upper() != "ALL":
        groups = [g for g in groups if g.competency.subject.lower() == subject.lower()]
    return groups

@router.get("/predict/cohort", response_model=CohortAIPrediction)
def get_cohort_ai_prediction():
    """
    Hybrid Rule + AI Model: Overall Classroom / Cohort Outcome Forecasting
    """
    return predict_cohort_outcomes(
        local_store.students,
        local_store.assessments,
        local_store.competencies
    )

@router.get("/predict/student/{student_id}", response_model=StudentAIPrediction)
def get_student_ai_prediction(student_id: str):
    """
    Hybrid Rule + AI Model: Individual Student Mastery Trajectory & Next-Best Action
    """
    student = next((s for s in local_store.students if s.id == student_id), None)
    if not student:
        raise HTTPException(status_code=404, detail=f"Student {student_id} not found.")

    return predict_student_mastery(
        student,
        local_store.assessments,
        local_store.competencies
    )
