import logging
from typing import Optional, List
from supabase import create_client, Client
from .config import settings
from .data.curriculum import FLN_COMPETENCIES, REMEDIAL_ACTIVITIES, INITIAL_STUDENTS
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

# In-Memory local fallback store (seeded with 40 students across 5th A, 6th A, 7th A, 8th A)
class LocalStore:
    def __init__(self):
        self.students = list(INITIAL_STUDENTS)
        self.competencies = list(FLN_COMPETENCIES)
        self.activities = list(REMEDIAL_ACTIVITIES)
        self.assessments: List[AssessmentRecord] = []
        self.plans: List[RemedialPlan] = []
        self._seed_default_assessments()

    def _seed_default_assessments(self):
        primary_comp_ids = [c.id for c in self.competencies]

        for s_idx, st in enumerate(self.students):
            for c_idx, comp_id in enumerate(primary_comp_ids):
                # Realistic score distribution based on subject
                base_score = 6.0
                if comp_id.startswith('MATH') or comp_id.startswith('PHY'):
                    base_score = float(((s_idx * 3 + c_idx * 7 + st.grade) % 6) + 3) # 3.0 to 8.0
                elif comp_id.startswith('MAR') or comp_id.startswith('HIN'):
                    base_score = float(((s_idx * 2 + c_idx * 5 + st.grade) % 5) + 5) # 5.0 to 9.0
                else:
                    base_score = float(((s_idx + c_idx * 3 + st.grade) % 6) + 4) # 4.0 to 9.0

                base_score = min(10.0, max(2.0, base_score))

                self.assessments.append(AssessmentRecord(
                    id=f"asmt-base-{st.id}-{comp_id}",
                    student_id=st.id,
                    competency_id=comp_id,
                    assessment_type="baseline",
                    score_obtained=base_score,
                    total_marks=10.0,
                    percentage=(base_score / 10.0) * 100.0,
                    assessed_at="2026-10-15"
                ))

                # Follow-up for ~75% of learners across classes
                if s_idx % 4 != 3:
                    fol_score = base_score + (1.0 if (s_idx + c_idx) % 3 == 0 else 2.5)
                    if st.roll_number == 3 and comp_id == 'MATH-01':
                        fol_score = base_score # persistent gap
                    fol_score = min(10.0, max(base_score, fol_score))

                    self.assessments.append(AssessmentRecord(
                        id=f"asmt-fol-{st.id}-{comp_id}",
                        student_id=st.id,
                        competency_id=comp_id,
                        assessment_type="follow_up",
                        score_obtained=fol_score,
                        total_marks=10.0,
                        percentage=(fol_score / 10.0) * 100.0,
                        assessed_at="2026-10-28"
                    ))

        # Sample approved plans across 5th A, 6th A, 7th A, and 8th A
        self.plans.append(RemedialPlan(
            id="plan-5th-01",
            school_id="ZP-KPG-01",
            teacher_id="teacher-5th",
            grade=5,
            competency_id="MATH-01",
            activity_id="ACT-MATH-01",
            plan_date="2026-10-18",
            student_ids=["std-503", "std-505", "std-507"],
            status="completed",
            teacher_notes="१० काड्यांचे दशक बंडल वापरून सराव घेतला. हातच्याची वजाबाकी समजली.",
            scheduled_day="सोमवार, बुधवार (सकाळी १०:३०)",
            created_at="2026-10-17T09:00:00Z"
        ))
        self.plans.append(RemedialPlan(
            id="plan-6th-01",
            school_id="ZP-KPG-01",
            teacher_id="teacher-6th",
            grade=6,
            competency_id="ENG-01",
            activity_id="ACT-ENG-01",
            plan_date="2026-10-22",
            student_ids=["std-602", "std-604", "std-607"],
            status="approved",
            teacher_notes="Bilingual flashcard drill scheduled.",
            scheduled_day="मंगळवार, गुरुवार (सकाळी ११:००)",
            created_at="2026-10-21T09:30:00Z"
        ))
        self.plans.append(RemedialPlan(
            id="plan-7th-01",
            school_id="ZP-KPG-01",
            teacher_id="teacher-7th",
            grade=7,
            competency_id="PHY-01",
            activity_id="ACT-PHY-01",
            plan_date="2026-10-25",
            student_ids=["std-701", "std-703", "std-707"],
            status="approved",
            teacher_notes="Ramp friction experiment conducted with toy cars.",
            scheduled_day="बुधवार (दुपारी २:००)",
            created_at="2026-10-24T10:00:00Z"
        ))
        self.plans.append(RemedialPlan(
            id="plan-8th-01",
            school_id="ZP-KPG-01",
            teacher_id="teacher-8th",
            grade=8,
            competency_id="CHEM-01",
            activity_id="ACT-PHY-01",
            plan_date="2026-10-27",
            student_ids=["std-803", "std-804", "std-807"],
            status="draft",
            teacher_notes="मेणबत्ती वितळणे (भौतिक) आणि लाकूड जळणे (रासायनिक) प्रात्यक्षिक.",
            scheduled_day="गुरुवार (दुपारी २:३०)",
            created_at="2026-10-26T14:30:00Z"
        ))

local_store = LocalStore()
