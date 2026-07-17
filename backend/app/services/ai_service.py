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
    Maps the JSON format from Gemini or Rule Engine to the exact AnalysisResult schema expected by the frontend.
    """
    # Parse arrays if they exist in the new schema, otherwise fallback to old schema logic
    alerts = []
    if "congestionAlerts" in ai_output:
        for a in ai_output["congestionAlerts"]:
            alerts.append(
                CongestionAlert(
                    gateId=a.get("gateId", "Unknown"),
                    severity=a.get("severity", "low"),
                    reasoning=a.get("reasoning", ""),
                    confidence=a.get("confidence", 0.9)
                )
            )
    else:
        risk_level = ai_output.get("riskLevel", "low")
        confidence = ai_output.get("confidence", 1.0)
        if risk_level in ["high", "critical"]:
            alerts.append(
                CongestionAlert(
                    gateId="System",
                    severity=risk_level,
                    reasoning=" | ".join(ai_output.get("reasoning", ["High risk detected."])),
                    confidence=confidence
                )
            )

    recs = []
    if "gateRecommendations" in ai_output:
        for r in ai_output["gateRecommendations"]:
            recs.append(
                GateRecommendation(
                    fromGateId=r.get("fromGateId", "Unknown"),
                    toGateId=r.get("toGateId", "Unknown"),
                    reasoning=r.get("reasoning", ""),
                    confidence=r.get("confidence", 0.9)
                )
            )
    else:
        recommended_gate = ai_output.get("recommendedGate")
        confidence = ai_output.get("confidence", 1.0)
        if recommended_gate:
            recs.append(
                GateRecommendation(
                    fromGateId="System",
                    toGateId=recommended_gate,
                    reasoning="Recommended by AI for diversion.",
                    confidence=confidence
                )
            )

    volunteers = []
    if "volunteerSuggestions" in ai_output:
        for v in ai_output["volunteerSuggestions"]:
            volunteers.append(
                VolunteerSuggestion(
                    volunteerId=v.get("volunteerId", "Unknown"),
                    suggestedLocation=v.get("suggestedLocation", "Unknown"),
                    reasoning=v.get("reasoning", ""),
                    confidence=v.get("confidence", 0.9)
                )
            )
    else:
        req_vols = ai_output.get("requiredVolunteers", 0)
        confidence = ai_output.get("confidence", 1.0)
        if req_vols > 0:
            volunteers.append(
                VolunteerSuggestion(
                    volunteerId=f"Need {req_vols} volunteers",
                    suggestedLocation="High Risk Area",
                    reasoning="Deployed based on crowd metrics.",
                    confidence=confidence
                )
            )

    bottlenecks = []
    if "predictedBottlenecks" in ai_output:
        for b in ai_output["predictedBottlenecks"]:
            bottlenecks.append(
                PredictedBottleneck(
                    location=b.get("location", "Unknown"),
                    etaMinutes=b.get("etaMinutes", 0),
                    confidence=b.get("confidence", 0.9),
                    reasoning=b.get("reasoning", "")
                )
            )

    return AnalysisResult(
        analysisId=ai_output.get("analysisId", f"an_{uuid.uuid4().hex[:8]}"),
        uploadId=upload_id,
        aiSummary=ai_output.get("aiSummary", ai_output.get("summary", "Analysis complete.")),
        riskLevel=ai_output.get("riskLevel", "low"),
        congestionAlerts=alerts,
        predictedBottlenecks=bottlenecks,
        volunteerSuggestions=volunteers,
        gateRecommendations=recs,
        confidence=ai_output.get("confidence", 0.9),
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
