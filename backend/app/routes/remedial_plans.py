import urllib.parse
from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException
from ..models import RemedialPlan, RemedialPlanCreate
from ..supabase_client import local_store

router = APIRouter(prefix="/remedial-plans", tags=["Remedial Action Planner"])

@router.get("", response_model=List[RemedialPlan])
def list_plans():
    """
    Module C: List all teacher remedial action plans.
    """
    return local_store.plans

@router.post("", response_model=RemedialPlan)
def create_or_approve_plan(payload: RemedialPlanCreate):
    """
    Module C: Remedial Action Planner
    Teacher reviews, customizes, and approves a remedial action plan.
    """
    new_id = payload.id or f"plan-{int(datetime.now().timestamp())}"
    plan = RemedialPlan(
        id=new_id,
        school_id=payload.school_id,
        teacher_id=payload.teacher_id,
        grade=payload.grade,
        competency_id=payload.competency_id,
        activity_id=payload.activity_id,
        plan_date=payload.plan_date,
        student_ids=payload.student_ids,
        status=payload.status,
        teacher_notes=payload.teacher_notes,
        scheduled_day=payload.scheduled_day,
        created_at=datetime.utcnow().isoformat() + "Z"
    )
    
    # Update or insert
    existing_idx = next((i for i, p in enumerate(local_store.plans) if p.id == plan.id), -1)
    if existing_idx >= 0:
        local_store.plans[existing_idx] = plan
    else:
        local_store.plans.append(plan)
        
    return plan

@router.get("/{plan_id}/whatsapp-text")
def generate_whatsapp_share_text(plan_id: str):
    """
    Module C: 1-Page Light Output
    Generates a WhatsApp-shareable remedial summary in Marathi.
    """
    plan = next((p for p in local_store.plans if p.id == plan_id), None)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    comp = next((c for c in local_store.competencies if c.id == plan.competency_id), None)
    act = next((a for a in local_store.activities if a.id == plan.activity_id), None)

    comp_title = comp.title_mr if comp else "क्षमता"
    act_title = act.title_mr if act else "उपचारात्मक कृती"
    student_count = len(plan.student_ids)

    text = (
        f"*LearnGap AI - उपचारात्मक कृती आराखडा*\n"
        f"शाळा: जि. प. प्राथमिक शाळा, कोपरगाव\n"
        f"इयत्ता: ३ री | विषय: {comp.subject if comp else ''}\n"
        f"क्षमता: {comp_title} ({comp.code if comp else ''})\n"
        f"गटातील विद्यार्थी: {student_count} मुले\n"
        f"सुचवलेली कृती: {act_title}\n"
        f"वेळ: {act.estimated_minutes if act else 20} मिनिटे\n"
        f"वेळापत्रक: {plan.scheduled_day or 'चालू आठवडा'}\n"
        f"स्थिती: ✅ वर्ग शिक्षकांनी मंजूर केले\n\n"
        f"_निपुण भारत व FLN उद्दिष्टपूर्तीसाठी वर्ग कृती आराखडा_"
    )

    encoded_url = f"https://api.whatsapp.com/send?text={urllib.parse.quote(text)}"
    return {
        "text": text,
        "whatsapp_url": encoded_url
    }
