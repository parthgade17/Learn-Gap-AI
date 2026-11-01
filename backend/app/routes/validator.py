from fastapi import APIRouter
from ..models import ValidationRequest, ValidationResponse
from ..engine.gap_engine import validate_score

router = APIRouter(prefix="/validator", tags=["Data Quality Validator"])

@router.post("/validate-score", response_model=ValidationResponse)
def validate_single_score(payload: ValidationRequest):
    """
    Module A: Data quality validator
    Flags missing, out-of-bounds, or inconsistent scores on teacher entry.
    """
    return validate_score(payload.score_obtained, payload.total_marks, payload.roll_number)
