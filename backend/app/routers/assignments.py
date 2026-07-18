from fastapi import APIRouter, Depends, HTTPException

from app.core.auth import require_organizer
from app.models.assignment import VolunteerAssignmentRequest, VolunteerAssignmentResult
from app.services.volunteer_service import run_assignment_pipeline

router = APIRouter(prefix="/assignments", tags=["assignments"])


@router.post("/optimize", response_model=VolunteerAssignmentResult)
async def optimize_assignments(
    payload: VolunteerAssignmentRequest,
    user: dict = Depends(require_organizer),   # Fixed: was `user_uid: str`
):
    """Trigger Gemini-powered volunteer assignment optimization."""
    try:
        result = run_assignment_pipeline(payload)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
