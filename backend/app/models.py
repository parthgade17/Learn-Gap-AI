from typing import List, Optional, Literal
from pydantic import BaseModel, Field

SubjectType = Literal[
    'English',
    'Mathematics',
    'Social Science',
    'Physics',
    'Chemistry',
    'Marathi',
    'Hindi'
]

UserRole = Literal['teacher', 'head_teacher']
AssessmentType = Literal['baseline', 'follow_up']
PlanStatus = Literal['draft', 'approved', 'completed']
RiskLevel = Literal['low', 'medium', 'high', 'critical']

class Student(BaseModel):
    id: str
    school_id: str
    grade: int
    section: str = 'A'
    roll_number: int
    student_alias: str
    parental_consent_verified: bool = True

class Competency(BaseModel):
    id: str
    code: str
    subject: SubjectType
    grade: int
    title_en: str
    title_mr: str
    description_en: str
    description_mr: str
    threshold_passing_pct: float = 60.0

class RemedialActivity(BaseModel):
    id: str
    competency_id: str
    title_en: str
    title_mr: str
    instructions_en: str
    instructions_mr: str
    materials_needed_en: str
    materials_needed_mr: str
    estimated_minutes: int = 20
    is_teacher_reviewed: bool = True
    pedagogical_reason_en: str
    pedagogical_reason_mr: str

class AssessmentRecord(BaseModel):
    id: Optional[str] = None
    student_id: str
    competency_id: str
    assessment_type: AssessmentType
    score_obtained: float
    total_marks: float
    percentage: Optional[float] = None
    assessed_at: str = Field(default_factory=lambda: "2026-10-15")

class ValidationRequest(BaseModel):
    score_obtained: float
    total_marks: float
    roll_number: Optional[int] = None

class ValidationResponse(BaseModel):
    is_valid: bool
    percentage: float
    errors: List[str]
    warnings: List[str]
    is_gap: bool

class GapDiagnosis(BaseModel):
    student_id: str
    student_alias: str
    roll_number: int
    grade: int
    competency_id: str
    competency_title: str
    subject: SubjectType
    baseline_pct: float
    followup_pct: Optional[float] = None
    threshold_pct: float
    needs_remediation: bool
    severity: Literal['high', 'moderate', 'mastered']
    reasoning: str

class GroupedStudent(BaseModel):
    student: Student
    score_pct: float

class StudentGroup(BaseModel):
    competency: Competency
    students: List[GroupedStudent]
    suggested_activity: RemedialActivity
    urgency: Literal['high', 'moderate']
    reasoning_en: str
    reasoning_mr: str

class RemedialPlanCreate(BaseModel):
    id: Optional[str] = None
    school_id: str = "ZP-KPG-01"
    teacher_id: Optional[str] = "teacher-01"
    grade: int = 6
    competency_id: str
    activity_id: str
    plan_date: str
    student_ids: List[str]
    status: PlanStatus = 'draft'
    teacher_notes: str = ""
    scheduled_day: Optional[str] = None

class RemedialPlan(RemedialPlanCreate):
    id: str
    created_at: str

class CompetencyMetric(BaseModel):
    competency_id: str
    competency_code: str
    competency_title: str
    subject: SubjectType
    threshold_passing_pct: float
    baseline_pass_rate: float
    followup_pass_rate: float
    net_gain_pct: float
    remediated_count: int
    persistent_gap_count: int
    has_followup: bool

class DashboardMetricsResponse(BaseModel):
    total_students: int
    assessed_students_count: int
    coverage_pct: float
    avg_baseline_pass_pct: float
    avg_followup_pass_pct: float
    total_remediated: int
    total_persistent: int
    action_on_gaps_pct: float
    competency_metrics: List[CompetencyMetric]

# Hybrid Rule + AI Prediction Models
class SubjectPrediction(BaseModel):
    subject: SubjectType
    current_pct: float
    predicted_pct: float
    risk: Literal['low', 'medium', 'high']

class StudentAIPrediction(BaseModel):
    student_id: str
    student_alias: str
    roll_number: int
    current_overall_pct: float
    predicted_mastery_pct: float
    predicted_gain_pct: float
    risk_level: RiskLevel
    recovery_velocity_days: int
    confidence_score: float
    learning_velocity: float
    recommended_action_en: str
    recommended_action_mr: str
    subject_predictions: List[SubjectPrediction]

class CohortAIPrediction(BaseModel):
    projected_class_pass_rate: float
    current_class_pass_rate: float
    stagnation_risk_pct: float
    estimated_weeks_to_goal: int
    most_vulnerable_subject: SubjectType
    strongest_subject: SubjectType
    high_impact_activity_title: str
    ai_insights_en: List[str]
    ai_insights_mr: List[str]
