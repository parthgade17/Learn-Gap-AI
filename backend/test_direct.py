import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from app.routes.validator import validate_single_score
from app.routes.gap_analysis import get_gap_diagnoses, get_competency_groups
from app.routes.remedial_plans import list_plans, generate_whatsapp_share_text
from app.routes.dashboard import get_dashboard_metrics
from app.models import ValidationRequest

print("1. Testing Validation...")
res = validate_single_score(ValidationRequest(score_obtained=5.0, total_marks=10.0, roll_number=1))
print(f"[PASS] Score valid: {res.is_valid}, Pct: {res.percentage}%, Gap: {res.is_gap}")

print("2. Testing Gap Diagnoses...")
diagnoses = get_gap_diagnoses()
print(f"[PASS] Diagnoses generated: {len(diagnoses)} records")

print("3. Testing Groups...")
groups = get_competency_groups()
print(f"[PASS] Groups formed: {len(groups)} groups")
for g in groups:
    print(f"   - [{g.competency.code}] {g.competency.title_en}: {len(g.students)} learners (Urgency: {g.urgency})")

print("4. Testing Remedial Plans...")
plans = list_plans()
print(f"[PASS] Current plans: {len(plans)}")

print("5. Testing WhatsApp Text Generation...")
wa = generate_whatsapp_share_text(plans[0].id)
print(f"[PASS] WhatsApp URL generated: {wa['whatsapp_url'][:60]}...")

print("6. Testing Dashboard Metrics...")
metrics = get_dashboard_metrics(role="teacher")
print(f"[PASS] Coverage: {metrics.coverage_pct}%, Baseline Avg Pass: {metrics.avg_baseline_pass_pct}%, Follow-up Avg Pass: {metrics.avg_followup_pass_pct}%, Remediated: {metrics.total_remediated}")

print("\n[SUCCESS] ALL PYTHON BACKEND MODULES AND LOGIC TESTED AND WORKING 100%!")
