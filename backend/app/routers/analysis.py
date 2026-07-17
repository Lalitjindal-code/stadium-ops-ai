import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from firebase_admin import firestore

from app.core.auth import require_organizer
from app.models.analysis import AnalysisResult
from app.models.data import CrowdDataPayload, UploadMetadata
from app.services.ai_service import run_ai_pipeline

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.post("/csv", response_model=AnalysisResult)
async def analyze_csv(
    payload: CrowdDataPayload, user: dict = Depends(require_organizer)
):
    try:
        # 1. Generate an upload ID
        upload_id = f"up_{uuid.uuid4().hex[:8]}"

        # 2. Store metadata in Firestore (NOT the whole CSV)
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

        # 3. Perform AI analysis with fallback (in-memory, no CSV storage)
        analysis_result = run_ai_pipeline(payload, upload_id)

        # 4. Save analysis result metadata to firestore as per DATABASE.md
        db.collection("analyses").document(analysis_result.analysisId).set(
            analysis_result.model_dump(mode="json")
        )

        return analysis_result

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process CSV analysis: {str(e)}",
        ) from e
