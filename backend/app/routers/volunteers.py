import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from firebase_admin import firestore

from app.core.auth import require_organizer, require_volunteer
from app.models.assignment import Volunteer
from app.services.volunteer_service import get_available_volunteers, load_volunteers, invalidate_volunteer_cache

logger = logging.getLogger("volunteers_router")
router = APIRouter(prefix="/volunteers", tags=["volunteers"])

VOLUNTEERS_COLLECTION = "volunteers"
TASKS_COLLECTION = "volunteerTasks"


# ── GET /volunteers/available ─────────────────────────────────────────────────
@router.get("/available")
async def list_available_volunteers(
    zone: Optional[str] = Query(None, description="Filter by current zone"),
    skill: Optional[str] = Query(None, description="Filter by skill keyword"),
    user: dict = Depends(require_organizer),
):
    """
    List all available volunteers. Optionally filter by zone or skill.
    Used by organizer dashboard to see volunteer pool.
    """
    volunteers = get_available_volunteers()

    if zone:
        volunteers = [
            v for v in volunteers
            if zone.lower() in v.get("currentZone", "").lower()
        ]
    if skill:
        volunteers = [
            v for v in volunteers
            if any(skill.lower() in s.lower() for s in v.get("skills", []))
        ]

    return {
        "volunteers": volunteers,
        "total": len(volunteers),
        "filters": {"zone": zone, "skill": skill},
    }


# ── GET /volunteers/me/tasks ──────────────────────────────────────────────────
@router.get("/me/tasks")
async def get_my_tasks(
    user: dict = Depends(require_volunteer),
):
    """
    Return tasks assigned to the currently authenticated volunteer.
    Reads from Firestore `volunteerTasks` collection filtered by volunteerId.
    """
    uid = user.get("uid")
    if not uid:
        raise HTTPException(status_code=400, detail="Could not determine volunteer UID.")

    try:
        db = firestore.client()
        docs = (
            db.collection(TASKS_COLLECTION)
            .where("volunteerId", "==", uid)
            .order_by("createdAt", direction=firestore.Query.DESCENDING)
            .stream()
        )
        tasks = [doc.to_dict() for doc in docs]
        return {"tasks": tasks, "total": len(tasks)}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load tasks: {str(e)}",
        )


# ── PATCH /volunteers/tasks/{taskId} ─────────────────────────────────────────
@router.patch("/tasks/{task_id}")
async def update_task_status(
    task_id: str,
    status_update: dict,
    user: dict = Depends(require_volunteer),
):
    """
    Allow a volunteer to update their task status.
    Body: {"status": "in_progress" | "completed" | "cancelled"}
    """
    allowed_statuses = {"in_progress", "completed", "cancelled", "assigned"}
    new_status = status_update.get("status")

    if new_status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {allowed_statuses}",
        )

    try:
        db = firestore.client()
        ref = db.collection(TASKS_COLLECTION).document(task_id)
        doc = ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail=f"Task '{task_id}' not found.")

        task_data = doc.to_dict()
        if task_data.get("volunteerId") != user.get("uid"):
            raise HTTPException(status_code=403, detail="You can only update your own tasks.")

        from datetime import datetime, timezone
        ref.update({
            "status": new_status,
            "updatedAt": datetime.now(timezone.utc).isoformat(),
        })

        # If task completed, invalidate volunteer cache so workload reflects update
        if new_status == "completed":
            invalidate_volunteer_cache()

        updated = ref.get()
        return {"success": True, "task": updated.to_dict()}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
