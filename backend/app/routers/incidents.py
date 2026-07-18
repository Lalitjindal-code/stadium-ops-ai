import logging
import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from firebase_admin import firestore

from app.core.auth import require_organizer, require_volunteer
from app.models.enums import IncidentStatus, RiskLevel
from app.models.incident import (
    IncidentListResponse,
    IncidentReport,
    IncidentReportPayload,
    IncidentReportResponse,
    IncidentUpdatePayload,
)

logger = logging.getLogger("incidents_router")
router = APIRouter(prefix="/incidents", tags=["incidents"])

COLLECTION = "incidents"


# ── POST /incidents/report ────────────────────────────────────────────────────
@router.post("/report", response_model=IncidentReportResponse, status_code=status.HTTP_201_CREATED)
async def report_incident(
    payload: IncidentReportPayload,
    user: dict = Depends(require_volunteer),
):
    """
    Accept an incident report from a volunteer or organizer.
    Calls Gemini to produce an AI summary, then persists to Firestore.
    """
    incident_id = f"inc_{uuid.uuid4().hex[:8]}"
    now = datetime.now(timezone.utc)

    # ── AI Summarization ─────────────────────────────────────────────────────
    ai_summary: Optional[str] = None
    risk_level: RiskLevel = RiskLevel.UNKNOWN
    try:
        from app.services.gemini_service import get_incident_ai_summary
        ai_result = get_incident_ai_summary(payload.location, payload.description)
        ai_summary = ai_result.get("aiSummary")
        risk_level = RiskLevel(ai_result.get("riskLevel", "unknown"))
        logger.info(f"[{incident_id}] AI summary generated. Risk: {risk_level.value}")
    except Exception as e:
        logger.warning(f"[{incident_id}] AI summarization failed — using raw description. Error: {e}")
        ai_summary = payload.description[:200]
        risk_level = RiskLevel.UNKNOWN

    # ── Firestore Persistence ─────────────────────────────────────────────────
    try:
        doc = IncidentReport(
            incidentId=incident_id,
            location=payload.location,
            description=payload.description,
            reportedBy=user.get("uid"),
            aiSummary=ai_summary,
            riskLevel=risk_level,
            status=IncidentStatus.OPEN,
            createdAt=now,
            updatedAt=now,
        )
        db = firestore.client()
        db.collection(COLLECTION).document(incident_id).set(doc.model_dump(mode="json"))
        logger.info(f"[{incident_id}] Persisted to Firestore.")
    except Exception as e:
        logger.error(f"[{incident_id}] Firestore write failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to persist incident: {str(e)}",
        ) from e

    return IncidentReportResponse(
        success=True,
        incidentId=incident_id,
        message=f"Incident at '{payload.location}' reported. Command centre notified.",
        aiSummary=ai_summary,
        riskLevel=risk_level,
        status=IncidentStatus.OPEN,
        createdAt=now,
    )


# ── GET /incidents ────────────────────────────────────────────────────────────
@router.get("/", response_model=IncidentListResponse)
async def list_incidents(
    status_filter: Optional[IncidentStatus] = Query(None, alias="status", description="Filter by status"),
    risk_filter: Optional[RiskLevel] = Query(None, alias="riskLevel", description="Filter by riskLevel"),
    limit: int = Query(50, ge=1, le=200, description="Max number of incidents to return"),
    user: dict = Depends(require_organizer),
):
    """List all incidents, optionally filtered by status or risk level."""
    try:
        db = firestore.client()
        query = db.collection(COLLECTION).order_by("createdAt", direction=firestore.Query.DESCENDING).limit(limit)

        if status_filter:
            query = query.where("status", "==", status_filter.value)
        if risk_filter:
            query = query.where("riskLevel", "==", risk_filter.value)

        docs = query.stream()
        incidents = [IncidentReport(**doc.to_dict()) for doc in docs]
        return IncidentListResponse(incidents=incidents, total=len(incidents))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch incidents: {str(e)}")


# ── GET /incidents/{incidentId} ───────────────────────────────────────────────
@router.get("/{incident_id}", response_model=IncidentReport)
async def get_incident(
    incident_id: str,
    user: dict = Depends(require_organizer),
):
    """Fetch a single incident by ID."""
    try:
        db = firestore.client()
        doc = db.collection(COLLECTION).document(incident_id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found.")
        return IncidentReport(**doc.to_dict())
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── PATCH /incidents/{incidentId} ─────────────────────────────────────────────
@router.patch("/{incident_id}", response_model=IncidentReport)
async def update_incident(
    incident_id: str,
    payload: IncidentUpdatePayload,
    user: dict = Depends(require_organizer),
):
    """Update incident status (open → in_progress → resolved → closed)."""
    # Pydantic validates Enum automatically, no manual allowed_statuses check needed.
    
    try:
        db = firestore.client()
        ref = db.collection(COLLECTION).document(incident_id)
        doc = ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found.")

        update_data = {
            "status": payload.status.value,
            "updatedAt": datetime.now(timezone.utc).isoformat(),
        }
        ref.update(update_data)

        updated = ref.get()
        return IncidentReport(**updated.to_dict())
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
