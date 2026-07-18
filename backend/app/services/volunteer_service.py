import json
import logging
import os
import time
from typing import Any, Dict, List, Optional

from app.config.ai_config import ai_config
from app.models.assignment import (
    VolunteerAssignmentRequest,
    VolunteerAssignmentResult,
)
from app.services.gemini_service import get_raw_gemini_response, load_prompt
from app.services.rule_engine import fallback_volunteer_assignment

logger = logging.getLogger("volunteer_service")
logger.setLevel(logging.INFO)
if not logger.handlers:
    ch = logging.StreamHandler()
    formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    ch.setFormatter(formatter)
    logger.addHandler(ch)

# Simple in-process cache
_volunteer_cache: Optional[List[Dict[str, Any]]] = None
_volunteer_cache_ts: Optional[float] = None
CACHE_TTL_SECONDS = 30


def load_volunteers() -> List[Dict[str, Any]]:
    """
    Load volunteers from Firestore with a 30-second in-memory cache.
    Falls back to mock JSON file if Firestore is unavailable.
    """
    global _volunteer_cache, _volunteer_cache_ts

    now = time.time()
    if _volunteer_cache is not None and _volunteer_cache_ts is not None:
        if now - _volunteer_cache_ts < CACHE_TTL_SECONDS:
            logger.debug("Returning cached volunteers.")
            return _volunteer_cache

    # Try Firestore first
    try:
        from firebase_admin import firestore
        db = firestore.client()
        docs = db.collection("volunteers").stream()
        vol_list = [doc.to_dict() for doc in docs]
        if vol_list:
            _volunteer_cache = vol_list
            _volunteer_cache_ts = now
            logger.info(f"Loaded {len(vol_list)} volunteers from Firestore.")
            return vol_list
        logger.warning("Firestore returned 0 volunteers — falling back to mock data.")
    except Exception as e:
        logger.warning(f"Firestore volunteer load failed: {e}. Using mock data.")

    # Fallback to mock JSON
    filepath = os.path.join(os.path.dirname(__file__), "..", "..", "mock_data", "volunteers.json")
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            vol_list = json.load(f)
        _volunteer_cache = vol_list
        _volunteer_cache_ts = now
        logger.info(f"Loaded {len(vol_list)} volunteers from mock JSON.")
        return vol_list
    except Exception as e:
        logger.error(f"Failed to load mock volunteers: {e}")
        return []


def get_available_volunteers() -> List[Dict[str, Any]]:
    """Return only volunteers with status 'Available'."""
    all_vols = load_volunteers()
    return [v for v in all_vols if v.get("status", "").lower() == "available"]


def invalidate_volunteer_cache() -> None:
    """Force a cache refresh on next load (call after volunteer status update)."""
    global _volunteer_cache, _volunteer_cache_ts
    _volunteer_cache = None
    _volunteer_cache_ts = None


def run_assignment_pipeline(payload: VolunteerAssignmentRequest) -> VolunteerAssignmentResult:
    start_time = time.time()
    volunteers = load_volunteers()

    template = load_prompt("volunteer_assignment_v1.md")
    task_prompt = (
        template
        .replace("{SCENARIO}", payload.scenario)
        .replace("{STADIUM_STATUS}", payload.stadiumStatus)
        .replace("{CROWD_ANALYSIS}", payload.crowdAnalysisSummary)
        .replace("{SCENARIO_RESULT}", payload.scenarioResultSummary)
        .replace("{NOTES}", payload.notes or "None")
        .replace("{VOLUNTEERS}", json.dumps(volunteers))
    )

    retries = ai_config.RETRY_COUNT
    for attempt in range(retries + 1):
        try:
            logger.info(f"Volunteer assignment attempt {attempt+1}/{retries+1}")
            gemini_output = get_raw_gemini_response(task_prompt)
            result = VolunteerAssignmentResult(**gemini_output)
            elapsed = time.time() - start_time
            logger.info(f"Volunteer assignment succeeded. Time: {elapsed:.2f}s")
            return result
        except Exception as e:
            logger.error(f"Volunteer assignment attempt {attempt+1} failed: {e}")
            if attempt == retries:
                logger.warning("Max retries reached — activating assignment rule engine.")
                break

    # Fallback
    fallback_start = time.time()
    fallback_output = fallback_volunteer_assignment(payload, volunteers)
    result = VolunteerAssignmentResult(**fallback_output)
    elapsed = time.time() - fallback_start
    logger.info(f"Assignment rule engine fallback done. Time: {elapsed:.2f}s")
    return result
