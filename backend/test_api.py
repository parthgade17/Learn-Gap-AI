import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_endpoints():
    print("Testing Root...")
    r = client.get("/")
    assert r.status_code == 200, f"Root failed: {r.text}"
    print("[PASS] Root endpoint:", r.json()["project"])

    print("Testing Health Check...")
    r = client.get("/health")
    assert r.status_code == 200, f"Health check failed: {r.text}"
    print("[PASS] Health check:", r.json())

    print("Testing Validator...")
    val_payload = {"score_obtained": 4.0, "total_marks": 10.0, "roll_number": 2}
    r = client.post("/api/validator/validate-score", json=val_payload)
    assert r.status_code == 200, f"Validator failed: {r.text}"
    val_res = r.json()
    assert val_res["percentage"] == 40.0
    print("[PASS] Validator output:", val_res)

    print("Testing Gap Diagnoses...")
    r = client.get("/api/gap-engine/diagnoses")
    assert r.status_code == 200, f"Diagnoses failed: {r.text}"
    diagnoses = r.json()
    assert len(diagnoses) > 0
    print(f"[PASS] Found {len(diagnoses)} student competency diagnoses")

    print("Testing Student Grouping...")
    r = client.get("/api/gap-engine/groups")
    assert r.status_code == 200, f"Groups failed: {r.text}"
    groups = r.json()
    assert len(groups) > 0
    print(f"[PASS] Formed {len(groups)} competency remedial groups")

    print("Testing AI Cohort Outcome Prediction...")
    r = client.get("/api/gap-engine/predict/cohort")
    assert r.status_code == 200, f"Cohort prediction failed: {r.text}"
    cp = r.json()
    assert "projected_class_pass_rate" in cp
    print(f"[PASS] AI Cohort: {cp['projected_class_pass_rate']}% projected pass, vulnerable: {cp['most_vulnerable_subject']}")

    print("Testing AI Individual Student Mastery Trajectory...")
    r = client.get("/api/gap-engine/predict/student/std-301")
    assert r.status_code == 200, f"Student prediction failed: {r.text}"
    sp = r.json()
    assert sp["student_id"] == "std-301"
    print(f"[PASS] AI Student: {sp['student_alias']} -> Pred {sp['predicted_mastery_pct']}%, Recov {sp['recovery_velocity_days']} days")

    print("Testing Remedial Plans...")
    r = client.get("/api/remedial-plans")
    assert r.status_code == 200, f"Plans failed: {r.text}"
    plans = r.json()
    assert len(plans) > 0
    print(f"[PASS] Found {len(plans)} teacher plans")

    print("Testing WhatsApp Text Generation...")
    r = client.get(f"/api/remedial-plans/{plans[0]['id']}/whatsapp-text")
    assert r.status_code == 200, f"WhatsApp text failed: {r.text}"
    print("[PASS] WhatsApp text generated successfully")

    print("Testing Head Teacher Class-wise Metrics (Class 5th)...")
    r = client.get("/api/dashboard/metrics?role=head_teacher&grade=5")
    assert r.status_code == 200, f"Dashboard failed: {r.text}"
    m_cls5 = r.json()
    assert m_cls5["total_students"] == 5
    print(f"[PASS] Class 5 metrics: 5 students, coverage: {m_cls5['coverage_pct']}%, pass: {m_cls5['avg_baseline_pass_pct']}%")

    print("Testing Head Teacher Entire School Metrics...")
    r = client.get("/api/dashboard/metrics?role=head_teacher")
    assert r.status_code == 200, f"Dashboard failed: {r.text}"
    m_school = r.json()
    assert m_school["total_students"] == 20
    print(f"[PASS] Entire school metrics: 20 students, coverage: {m_school['coverage_pct']}%, pass: {m_school['avg_baseline_pass_pct']}%")

    print("Testing CSV Template Download...")
    r = client.get("/api/csv/sample-template")
    assert r.status_code == 200, f"CSV sample failed: {r.text}"
    print("[PASS] CSV sample download working")

    print("\n[SUCCESS] ALL FASTAPI PYTHON BACKEND ENDPOINTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_endpoints()
