import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from firebase_admin import firestore

from app.core.auth import require_organizer
from app.models.analysis import AnalysisResult
from app.models.data import CrowdDataPayload, UploadMetadata
from app.services.ai_service import run_ai_pipeline

router = APIRouter(prefix="/analysis", tags=["analysis"])


# ── POST /analysis/csv ────────────────────────────────────────────────────────
@router.post("/csv", response_model=AnalysisResult, status_code=status.HTTP_200_OK)
async def analyze_csv(
    payload: CrowdDataPayload,
    user: dict = Depends(require_organizer),
):
    """
    Trigger AI-powered crowd analysis for uploaded gate data.
    Accepts 1-500 rows. Calls Gemini with rule-engine fallback.
    """
    try:
        upload_id = f"up_{uuid.uuid4().hex[:8]}"

        # Store upload metadata (NOT raw data)
        db = firestore.client()
        metadata = UploadMetadata(
            uploadId=upload_id,
            uploadedBy=user.get("uid"),
            rowCount=len(payload.rows),
            status="processed",
            createdAt=datetime.now(timezone.utc),
        )
        db.collection("dataUploads").document(upload_id).set(
            metadata.model_dump(mode="json")
        )

        import asyncio

        # Run AI pipeline in a thread to avoid blocking the event loop
        analysis_result = await asyncio.to_thread(run_ai_pipeline, payload, upload_id)

        # Persist analysis result
        db.collection("analyses").document(analysis_result.analysisId).set(
            analysis_result.model_dump(mode="json")
        )

        # Broadcast to WebSocket clients (non-blocking — don't fail if no clients connected)
        try:
            import asyncio

            from app.routers.realtime import broadcast_crowd_update

            asyncio.create_task(
                broadcast_crowd_update(analysis_result.model_dump(mode="json"))
            )
        except Exception:
            pass  # WS broadcast failure must never affect the HTTP response

        return analysis_result

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process CSV analysis: {str(e)}",
        ) from e


# ── GET /analysis/latest ──────────────────────────────────────────────────────
@router.get("/latest", response_model=AnalysisResult)
async def get_latest_analysis(
    user: dict = Depends(require_organizer),
):
    """Fetch the most recent analysis result from Firestore."""
    try:
        db = firestore.client()
        docs = (
            db.collection("analyses")
            .order_by("createdAt", direction=firestore.Query.DESCENDING)
            .limit(1)
            .stream()
        )
        doc_list = list(docs)
        if not doc_list:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No analyses found. Upload crowd data first.",
            )
        return AnalysisResult(**doc_list[0].to_dict())
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch latest analysis: {str(e)}",
        ) from e


# ── GET /analysis/{analysisId} ────────────────────────────────────────────────
@router.get("/{analysis_id}", response_model=AnalysisResult)
async def get_analysis_by_id(
    analysis_id: str,
    user: dict = Depends(require_organizer),
):
    """Fetch a specific analysis result by ID."""
    try:
        db = firestore.client()
        doc = db.collection("analyses").document(analysis_id).get()
        if not doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Analysis '{analysis_id}' not found.",
            )
        return AnalysisResult(**doc.to_dict())
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch analysis: {str(e)}",
        ) from e
