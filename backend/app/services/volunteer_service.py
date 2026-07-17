import json
import time
import logging
import os
from typing import Dict, Any, List

from app.models.assignment import VolunteerAssignmentRequest, VolunteerAssignmentResult, Volunteer
from app.config.ai_config import ai_config
from app.services.gemini_service import get_raw_gemini_response, load_prompt
from app.services.rule_engine import fallback_volunteer_assignment

logger = logging.getLogger("volunteer_service")
logger.setLevel(logging.INFO)
if not logger.handlers:
    ch = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    ch.setFormatter(formatter)
    logger.addHandler(ch)

def load_volunteers() -> List[Dict[str, Any]]:
    filepath = os.path.join(os.path.dirname(__file__), "..", "..", "mock_data", "volunteers.json")
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Failed to load mock volunteers: {e}")
        return []

def run_assignment_pipeline(payload: VolunteerAssignmentRequest) -> VolunteerAssignmentResult:
    start_time = time.time()
    
    volunteers = load_volunteers()
    
    template = load_prompt("volunteer_assignment_v1.md")
    task_prompt = template.replace("{SCENARIO}", payload.scenario)\
                          .replace("{STADIUM_STATUS}", payload.stadiumStatus)\
                          .replace("{CROWD_ANALYSIS}", payload.crowdAnalysisSummary)\
                          .replace("{SCENARIO_RESULT}", payload.scenarioResultSummary)\
                          .replace("{NOTES}", payload.notes or "None")\
                          .replace("{VOLUNTEERS}", json.dumps(volunteers))

    retries = ai_config.RETRY_COUNT
    for attempt in range(retries + 1):
        try:
            logger.info(f"Attempting Volunteer Assignment (Attempt {attempt+1}/{retries+1})")
            gemini_output = get_raw_gemini_response(task_prompt)
            
            result = VolunteerAssignmentResult(**gemini_output)
            
            elapsed = time.time() - start_time
            logger.info(f"Volunteer Assignment Successful. Time: {elapsed:.2f}s")
            return result
            
        except Exception as e:
            logger.error(f"Volunteer Assignment Failed (Attempt {attempt+1}): {e}")
            if attempt == retries:
                logger.warning("Max retries reached. Activating Assignment Rule Engine.")
                break
                
    # Fallback Execution
    fallback_start = time.time()
    fallback_output = fallback_volunteer_assignment(payload, volunteers)
    result = VolunteerAssignmentResult(**fallback_output)
    
    elapsed = time.time() - fallback_start
    logger.info(f"Assignment Rule Engine Fallback Successful. Time: {elapsed:.2f}s")
    
    return result
