from fastapi import APIRouter, Depends, HTTPException
from app.core.auth import require_organizer
from app.models.scenario import ScenarioPayload, ScenarioResult
from app.services.scenario_service import run_scenario_pipeline

router = APIRouter(prefix="/scenario", tags=["scenario"])

@router.post("/simulate", response_model=ScenarioResult)
def simulate_scenario(
    payload: ScenarioPayload,
    user_uid: str = Depends(require_organizer)
):
    try:
        result = run_scenario_pipeline(payload)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
