import time
import logging
from typing import Any
from app.models.scenario import ScenarioPayload, ScenarioResult
from app.config.ai_config import ai_config
from app.services.gemini_service import get_raw_gemini_response, load_prompt
from app.services.rule_engine import fallback_simulate_scenario

logger = logging.getLogger("scenario_service")
logger.setLevel(logging.INFO)
if not logger.handlers:
    ch = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    ch.setFormatter(formatter)
    logger.addHandler(ch)

def run_scenario_pipeline(payload: ScenarioPayload) -> ScenarioResult:
    start_time = time.time()
    
    # In a real app we'd fetch the latest crowd status here. We'll mock it for context.
    crowd_status = "All gates currently operating normally. Average capacity 40%."
    
    template = load_prompt("scenario_simulation_v1.md")
    task_prompt = template.replace("{CROWD_STATUS}", crowd_status)\
                          .replace("{SCENARIOS}", ", ".join(payload.scenarios))\
                          .replace("{SEVERITY}", payload.severity)\
                          .replace("{NOTES}", payload.notes or "None")

    retries = ai_config.RETRY_COUNT
    for attempt in range(retries + 1):
        try:
            logger.info(f"Attempting Scenario Gemini Analysis (Attempt {attempt+1}/{retries+1})")
            gemini_output = get_raw_gemini_response(task_prompt)
            
            # Validate output matches the Pydantic schema
            result = ScenarioResult(**gemini_output)
            
            elapsed = time.time() - start_time
            logger.info(f"Scenario Gemini Analysis Successful. Time: {elapsed:.2f}s, Confidence: {result.confidence}")
            return result
            
        except Exception as e:
            logger.error(f"Scenario Gemini Analysis Failed (Attempt {attempt+1}): {e}")
            if attempt == retries:
                logger.warning("Max retries reached. Activating Scenario Fallback Rule Engine.")
                break
                
    # Fallback Execution
    fallback_start = time.time()
    fallback_output = fallback_simulate_scenario(payload)
    result = ScenarioResult(**fallback_output)
    
    elapsed = time.time() - fallback_start
    logger.info(f"Scenario Rule Engine Fallback Successful. Time: {elapsed:.2f}s")
    
    return result
