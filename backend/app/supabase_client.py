import logging
from typing import Optional, List, Dict, Any
from supabase import create_client, Client
from .config import settings
from .data.curriculum import FLN_COMPETENCIES, REMEDIAL_ACTIVITIES, SYNTHETIC_STUDENTS
from .models import AssessmentRecord, RemedialPlan

logger = logging.getLogger("learngap.supabase")

_supabase_client: Optional[Client] = None

def get_supabase_client() -> Optional[Client]:
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client
    
    if settings.is_supabase_configured:
        try:
            _supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            logger.info("Connected successfully to Supabase backend: %s", settings.SUPABASE_URL)
            return _supabase_client
        except Exception as e:
            logger.warning("Failed to initialize Supabase client: %s. Using local store.", e)
            return None
    return None

# In-Memory local fallback store (seeded with synthetic baseline & follow-up assessments)
class LocalStore:
    def __init__(self):
        self.students = list(SYNTHETIC_STUDENTS)
        self.competencies = list(FLN_COMPETENCIES)
        self.activities = list(REMEDIAL_ACTIVITIES)
        self.assessments: List[AssessmentRecord] = []
        self.plans: List[RemedialPlan] = []
        self._seed_default_assessments()

    def _seed_default_assessments(self):
        # Seed baseline records reflecting ASER 2024 rural India findings (~33% pass subtraction)
        for i, st in enumerate(self.students):
            # Place Value
            score1 = 8.0 if i % 3 == 0 else (5.0 if i % 2 == 0 else 4.0)
            self.assessments.append(AssessmentRecord(
                id=f"asmt-b-1-{st.id}",
                student_id=st.id,
                competency_id="FLN-NUM-01",
                assessment_type="baseline",
                score_obtained=score1,
                total_marks=10.0,
                percentage=(score1 / 10.0) * 100.0,
                assessed_at="2026-10-15"
            ))

            # Subtraction with Borrowing (severe FLN gap)
            score2 = 7.0 if i % 4 == 0 else (4.0 if i % 3 == 0 else 2.0)
            self.assessments.append(AssessmentRecord(
                id=f"asmt-b-2-{st.id}",
                student_id=st.id,
                competency_id="FLN-NUM-02",
                assessment_type="baseline",
                score_obtained=score2,
                total_marks=10.0,
                percentage=(score2 / 10.0) * 100.0,
                assessed_at="2026-10-15"
            ))

            # Conjunct Letters
            score3 = 8.0 if i % 3 == 1 else 3.0
            self.assessments.append(AssessmentRecord(
                id=f"asmt-b-5-{st.id}",
                student_id=st.id,
                competency_id="FLN-LIT-01",
                assessment_type="baseline",
                score_obtained=score3,
                total_marks=10.0,
                percentage=(score3 / 10.0) * 100.0,
                assessed_at="2026-10-15"
            ))

            # Follow-up assessments for students who completed "Exchange Ten" drill
            if i < 10:
                fol_score2 = min(10.0, score2 + 4.0)
                self.assessments.append(AssessmentRecord(
                    id=f"asmt-f-2-{st.id}",
                    student_id=st.id,
                    competency_id="FLN-NUM-02",
                    assessment_type="follow_up",
                    score_obtained=fol_score2,
                    total_marks=10.0,
                    percentage=(fol_score2 / 10.0) * 100.0,
                    assessed_at="2026-10-28"
                ))

        # Sample approved plan
        self.plans.append(RemedialPlan(
            id="plan-001",
            school_id="ZP-KPG-01",
            teacher_id="teacher-01",
            grade=3,
            competency_id="FLN-NUM-02",
            activity_id="ACT-NUM-02-A",
            plan_date="2026-10-20",
            student_ids=["std-302", "std-303", "std-305", "std-306", "std-308", "std-309"],
            status="completed",
            teacher_notes="विद्यार्थ्यांनी दुकानदाराचा खेळ आवडीने खेळला. दशकाकडून सुटे घेण्याची संकल्पना स्पष्ट झाली.",
            scheduled_day="सप्ताह ४ (सोमवार ते बुधवार)",
            created_at="2026-10-18T10:00:00Z"
        ))

local_store = LocalStore()
