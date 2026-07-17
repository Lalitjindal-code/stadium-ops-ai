import uuid
import time
import logging
from datetime import datetime, timezone
from typing import Dict, Any

from app.models.data import CrowdDataPayload
from app.models.analysis import (
    AnalysisResult, 
    CongestionAlert, 
    GateRecommendation, 
    PredictedBottleneck, 
    VolunteerSuggestion
)
from app.config.ai_config import ai_config
from app.services.gemini_service import get_gemini_analysis
from app.services.rule_engine import fallback_analyze_crowd_data

# Setup structured logging
logger = logging.getLogger("ai_service")
logger.setLevel(logging.INFO)
if not logger.handlers:
    ch = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    ch.setFormatter(formatter)
    logger.addHandler(ch)

def map_to_analysis_result(ai_output: Dict[str, Any], upload_id: str) -> AnalysisResult:
    """
    Maps the simplified JSON format from Gemini or Rule Engine to the exact AnalysisResult schema expected by the frontend.
    """
    alerts = []
    recs = []
    volunteers = []
    
    risk_level = ai_output.get("riskLevel", "low")
    confidence = ai_output.get("confidence", 1.0)
    
    # Generate generic alert based on risk level
    if risk_level in ["high", "critical"]:
        alerts.append(
            CongestionAlert(
                gateId="System",
                severity=risk_level,
                reasoning=" | ".join(ai_output.get("reasoning", ["High risk detected."])),
                confidence=confidence
            )
        )
        
    recommended_gate = ai_output.get("recommendedGate")
    if recommended_gate:
        recs.append(
            GateRecommendation(
                fromGateId="System",
                toGateId=recommended_gate,
                reasoning="Recommended by AI for diversion.",
                confidence=confidence
            )
        )
        
    req_vols = ai_output.get("requiredVolunteers", 0)
    if req_vols > 0:
        volunteers.append(
            VolunteerSuggestion(
                volunteerId=f"Need {req_vols} volunteers",
                suggestedLocation="High Risk Area",
                reasoning="Deployed based on crowd metrics.",
                confidence=confidence
            )
        )
        
    return AnalysisResult(
        analysisId=f"an_{uuid.uuid4().hex[:8]}",
        uploadId=upload_id,
        aiSummary=ai_output.get("summary", "Analysis complete."),
        riskLevel=risk_level,
        congestionAlerts=alerts,
        predictedBottlenecks=[],
        volunteerSuggestions=volunteers,
        gateRecommendations=recs,
        createdAt=datetime.now(timezone.utc)
    )

def run_ai_pipeline(payload: CrowdDataPayload, upload_id: str) -> AnalysisResult:
    start_time = time.time()
    
    retries = ai_config.RETRY_COUNT
    for attempt in range(retries + 1):
        try:
            logger.info(f"Attempting Gemini Analysis (Attempt {attempt+1}/{retries+1}) for Upload ID: {upload_id}")
            gemini_output = get_gemini_analysis(payload)
            
            # Simple validation to ensure keys exist
            if "riskLevel" not in gemini_output or "summary" not in gemini_output:
                raise ValueError("Missing required fields in Gemini output")
                
            elapsed = time.time() - start_time
            logger.info(f"Gemini Analysis Successful. Time: {elapsed:.2f}s, Confidence: {gemini_output.get('confidence')}")
            
            return map_to_analysis_result(gemini_output, upload_id)
            
        except Exception as e:
            logger.error(f"Gemini Analysis Failed (Attempt {attempt+1}): {e}")
            if attempt == retries:
                logger.warning("Max retries reached. Activating Fallback Rule Engine.")
                break
                
    # Fallback Execution
    fallback_start = time.time()
    fallback_output = fallback_analyze_crowd_data(payload)
    elapsed = time.time() - fallback_start
    logger.info(f"Rule Engine Fallback Successful. Time: {elapsed:.2f}s")
    
    return map_to_analysis_result(fallback_output, upload_id)
