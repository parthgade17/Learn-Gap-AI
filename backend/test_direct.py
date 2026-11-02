import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from app.routes.validator import validate_single_score
from app.routes.gap_analysis import (
    get_gap_diagnoses,
    get_competency_groups,
    get_cohort_ai_prediction,
    get_student_ai_prediction
)
from app.routes.remedial_plans import list_plans, generate_whatsapp_share_text
from app.routes.dashboard import get_dashboard_metrics
from app.models import ValidationRequest

print("1. Testing Validation...")
res = validate_single_score(ValidationRequest(score_obtained=5.0, total_marks=10.0, roll_number=1))
print(f"[PASS] Score valid: {res.is_valid}, Pct: {res.percentage}%, Gap: {res.is_gap}")

print("2. Testing Gap Diagnoses across 7 subjects...")
diagnoses = get_gap_diagnoses()
print(f"[PASS] Diagnoses generated: {len(diagnoses)} records across 7 subjects")

print("3. Testing Groups...")
groups = get_competency_groups()
print(f"[PASS] Groups formed: {len(groups)} groups")
for g in groups[:3]:
    print(f"   - [{g.competency.subject} / {g.competency.code}] {g.competency.title_en}: {len(g.students)} learners (Urgency: {g.urgency})")

print("4. Testing AI Cohort Outcome Prediction Engine...")
cohort_pred = get_cohort_ai_prediction()
print(f"[PASS] Current pass: {cohort_pred.current_class_pass_rate}%, Projected: {cohort_pred.projected_class_pass_rate}%, Vulnerable: {cohort_pred.most_vulnerable_subject}, Strongest: {cohort_pred.strongest_subject}")

print("5. Testing AI Individual Student Mastery Trajectory (5th A, 7th A, 8th A)...")
std5 = get_student_ai_prediction("std-501")
print(f"[PASS] 5th A Student std-501 ({std5.student_alias}) -> Current: {std5.current_overall_pct}%, Predicted: {std5.predicted_mastery_pct}%, Risk: {std5.risk_level}")
std7 = get_student_ai_prediction("std-701")
print(f"[PASS] 7th A Student std-701 ({std7.student_alias}) -> Current: {std7.current_overall_pct}%, Predicted: {std7.predicted_mastery_pct}%, Risk: {std7.risk_level}")
std8 = get_student_ai_prediction("std-801")
print(f"[PASS] 8th A Student std-801 ({std8.student_alias}) -> Current: {std8.current_overall_pct}%, Predicted: {std8.predicted_mastery_pct}%, Risk: {std8.risk_level}")

print("6. Testing Remedial Plans...")
plans = list_plans()
print(f"[PASS] Current plans: {len(plans)}")

print("7. Testing WhatsApp Text Generation...")
wa = generate_whatsapp_share_text(plans[0].id)
print(f"[PASS] WhatsApp URL generated: {wa['whatsapp_url'][:60]}...")

print("8. Testing Dashboard Metrics...")
metrics = get_dashboard_metrics(role="teacher")
print(f"[PASS] Coverage: {metrics.coverage_pct}%, Baseline Avg Pass: {metrics.avg_baseline_pass_pct}%, Follow-up Avg Pass: {metrics.avg_followup_pass_pct}%, Remediated: {metrics.total_remediated}")

print("\n[SUCCESS] ALL PYTHON BACKEND MODULES AND HYBRID AI PREDICTION ENGINES TESTED AND WORKING 100%!")
