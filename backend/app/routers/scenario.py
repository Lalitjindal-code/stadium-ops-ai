from fastapi import APIRouter, Depends, HTTPException

from app.core.auth import require_organizer
from app.models.scenario import ScenarioPayload, ScenarioResult
from app.services.scenario_service import run_scenario_pipeline

router = APIRouter(prefix="/scenario", tags=["scenario"])


@router.post("/simulate", response_model=ScenarioResult)
async def simulate_scenario(
    payload: ScenarioPayload,
    user: dict = Depends(require_organizer),  # Fixed: was `user_uid: str`
):
    """Trigger Gemini-powered scenario simulation for a given incident type."""
    try:
        import asyncio

        result = await asyncio.to_thread(run_scenario_pipeline, payload)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
