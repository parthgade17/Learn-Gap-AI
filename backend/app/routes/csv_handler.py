import io
import csv
from typing import List, Dict, Any
from fastapi import APIRouter, UploadFile, File, Response
from ..models import AssessmentRecord
from ..supabase_client import local_store
from ..engine.gap_engine import validate_score

router = APIRouter(prefix="/csv", tags=["CSV Upload & Export"])

@router.get("/sample-template")
def get_sample_csv_template():
    """
    Downloads sample CSV template for teachers to batch import marks.
    """
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["roll_number", "student_alias", "grade", "competency_code", "assessment_type", "score_obtained", "total_marks"])
    writer.writerow([1, "विद्यार्थी १", 3, "NUM-01", "baseline", 8.0, 10.0])
    writer.writerow([2, "विद्यार्थी २", 3, "NUM-02", "baseline", 3.0, 10.0])
    writer.writerow([3, "विद्यार्थी ३", 3, "NUM-02", "baseline", 4.0, 10.0])
    writer.writerow([4, "विद्यार्थी ४", 3, "LIT-01", "baseline", 2.0, 10.0])
    writer.writerow([2, "विद्यार्थी २", 3, "NUM-02", "follow_up", 8.0, 10.0])
    
    csv_bytes = output.getvalue().encode("utf-8")
    return Response(
        content=csv_bytes,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=learngap_sample_marks.csv"}
    )

@router.post("/upload")
async def upload_csv_file(file: UploadFile = File(...)):
    """
    Module A: Assessment Data Manager
    Batch CSV upload with data validation. Flags missing or inconsistent scores.
    """
    content = await file.read()
    decoded = content.decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(decoded))
    
    student_by_roll = {s.roll_number: s for s in local_store.students}
    comp_by_code = {c.code: c for c in local_store.competencies}
    comp_by_id = {c.id: c for c in local_store.competencies}

    imported_records: List[Dict[str, Any]] = []
    skipped_records: List[Dict[str, Any]] = []

    for row_idx, row in enumerate(reader, start=2):
        try:
            roll_no = int(row.get("roll_number", 0))
            comp_identifier = row.get("competency_code", "").strip()
            asmt_type = row.get("assessment_type", "baseline").strip().lower()
            score_obt = float(row.get("score_obtained", 0.0))
            max_marks = float(row.get("total_marks", 10.0))

            student = student_by_roll.get(roll_no)
            comp = comp_by_code.get(comp_identifier) or comp_by_id.get(comp_identifier)

            if not student or not comp:
                skipped_records.append({
                    "row": row_idx,
                    "reason": f"Unknown student roll ({roll_no}) or competency code ({comp_identifier})"
                })
                continue

            val = validate_score(score_obt, max_marks, roll_no)
            if not val.is_valid:
                skipped_records.append({
                    "row": row_idx,
                    "reason": val.errors[0]
                })
                continue

            record = AssessmentRecord(
                id=f"asmt-csv-{row_idx}-{student.id}",
                student_id=student.id,
                competency_id=comp.id,
                assessment_type="follow_up" if asmt_type == "follow_up" else "baseline",
                score_obtained=score_obt,
                total_marks=max_marks,
                percentage=val.percentage,
                assessed_at="2026-10-30"
            )
            local_store.assessments.append(record)
            imported_records.append(record.model_dump())
        except Exception as e:
            skipped_records.append({"row": row_idx, "reason": str(e)})

    return {
        "status": "success",
        "imported_count": len(imported_records),
        "skipped_count": len(skipped_records),
        "skipped_details": skipped_records[:5]
    }
