import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_endpoints():
    print("Testing Root...")
    r = client.get("/")
    assert r.status_code == 200, f"Root failed: {r.text}"
    print("✓ Root endpoint:", r.json()["project"])

    print("Testing Health Check...")
    r = client.get("/health")
    assert r.status_code == 200, f"Health check failed: {r.text}"
    print("✓ Health check:", r.json())

    print("Testing Validator...")
    val_payload = {"score_obtained": 4.0, "total_marks": 10.0, "roll_number": 2}
    r = client.post("/api/validator/validate-score", json=val_payload)
    assert r.status_code == 200, f"Validator failed: {r.text}"
    val_res = r.json()
    assert val_res["percentage"] == 40.0
    print("✓ Validator output:", val_res)

    print("Testing Gap Diagnoses...")
    r = client.get("/api/gap-engine/diagnoses")
    assert r.status_code == 200, f"Diagnoses failed: {r.text}"
    diagnoses = r.json()
    assert len(diagnoses) > 0
    print(f"✓ Found {len(diagnoses)} student competency diagnoses")

    print("Testing Student Grouping...")
    r = client.get("/api/gap-engine/groups")
    assert r.status_code == 200, f"Groups failed: {r.text}"
    groups = r.json()
    assert len(groups) > 0
    print(f"✓ Formed {len(groups)} competency remedial groups")

    print("Testing Remedial Plans...")
    r = client.get("/api/remedial-plans")
    assert r.status_code == 200, f"Plans failed: {r.text}"
    plans = r.json()
    assert len(plans) > 0
    print(f"✓ Found {len(plans)} teacher plans")

    print("Testing WhatsApp Text Generation...")
    r = client.get(f"/api/remedial-plans/{plans[0]['id']}/whatsapp-text")
    assert r.status_code == 200, f"WhatsApp text failed: {r.text}"
    print("✓ WhatsApp text generated successfully")

    print("Testing Progress Dashboard Metrics...")
    r = client.get("/api/dashboard/metrics")
    assert r.status_code == 200, f"Dashboard failed: {r.text}"
    metrics = r.json()
    print(f"✓ Dashboard coverage: {metrics['coverage_pct']}%, Avg Baseline Pass: {metrics['avg_baseline_pass_pct']}%")

    print("Testing CSV Template Download...")
    r = client.get("/api/csv/sample-template")
    assert r.status_code == 200, f"CSV sample failed: {r.text}"
    print("✓ CSV sample download working")

    print("\n🎉 ALL FASTAPI PYTHON BACKEND ENDPOINTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_endpoints()
