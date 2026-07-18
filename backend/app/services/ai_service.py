import logging
import time
import uuid
from datetime import datetime, timezone
from typing import Any, Dict

from app.config.ai_config import ai_config
from app.models.analysis import (
    AnalysisResult,
    CongestionAlert,
    GateRecommendation,
    PredictedBottleneck,
    VolunteerSuggestion,
)
from app.models.data import CrowdDataPayload
from app.services.gemini_service import get_gemini_analysis
from app.services.rule_engine import fallback_analyze_crowd_data

# Setup structured logging
logger = logging.getLogger("ai_service")
logger.setLevel(logging.INFO)
if not logger.handlers:
    ch = logging.StreamHandler()
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    ch.setFormatter(formatter)
    logger.addHandler(ch)


def map_to_analysis_result(
    ai_output: Dict[str, Any],
    upload_id: str,
    stale: bool = False,
) -> AnalysisResult:
    """
    Maps the JSON output from Gemini or Rule Engine to the AnalysisResult schema.
    Handles both new schema (arrays) and old schema (flat fields) for backwards compat.
    """
    # ── Congestion Alerts ────────────────────────────────────────────────────
    alerts = []
    if "congestionAlerts" in ai_output:
        for a in ai_output["congestionAlerts"]:
            try:
                alerts.append(
                    CongestionAlert(
                        gateId=a.get("gateId", "Unknown"),
                        severity=a.get("severity", "low"),
                        reasoning=a.get("reasoning")
                        or f"Congestion detected at {a.get('gateId', 'gate')}.",
                        confidence=a.get("confidence", 0.9),
                    )
                )
            except Exception as e:
                logger.warning(f"Skipping malformed congestion alert: {e}")
    else:
        # Legacy flat-field fallback
        risk_level = ai_output.get("riskLevel", "low")
        if risk_level in ("high", "critical"):
            alerts.append(
                CongestionAlert(
                    gateId="System",
                    severity=risk_level,
                    reasoning=" | ".join(
                        ai_output.get("reasoning", ["High risk detected."])
                    ),
                    confidence=ai_output.get("confidence", 1.0),
                )
            )

    # ── Gate Recommendations ─────────────────────────────────────────────────
    recs = []
    if "gateRecommendations" in ai_output:
        for r in ai_output["gateRecommendations"]:
            recs.append(
                GateRecommendation(
                    fromGateId=r.get("fromGateId", "Unknown"),
                    toGateId=r.get("toGateId", "Unknown"),
                    reasoning=r.get("reasoning", "Recommended diversion."),
                    confidence=r.get("confidence", 0.9),
                )
            )
    else:
        recommended_gate = ai_output.get("recommendedGate")
        if recommended_gate:
            recs.append(
                GateRecommendation(
                    fromGateId="System",
                    toGateId=recommended_gate,
                    reasoning="Recommended by AI for crowd diversion.",
                    confidence=ai_output.get("confidence", 1.0),
                )
            )

    # ── Volunteer Suggestions ────────────────────────────────────────────────
    volunteers = []
    if "volunteerSuggestions" in ai_output:
        for v in ai_output["volunteerSuggestions"]:
            volunteers.append(
                VolunteerSuggestion(
                    volunteerId=v.get("volunteerId", "Unknown"),
                    suggestedLocation=v.get("suggestedLocation", "Unknown"),
                    reasoning=v.get("reasoning", "Deployment needed."),
                    confidence=v.get("confidence", 0.9),
                )
            )
    else:
        req_vols = ai_output.get("requiredVolunteers", 0)
        if req_vols > 0:
            volunteers.append(
                VolunteerSuggestion(
                    volunteerId=f"Need {req_vols} volunteers",
                    suggestedLocation="High Risk Area",
                    reasoning="Deployed based on crowd metrics.",
                    confidence=ai_output.get("confidence", 1.0),
                )
            )

    # ── Predicted Bottlenecks ────────────────────────────────────────────────
    bottlenecks = []
    for b in ai_output.get("predictedBottlenecks", []):
        bottlenecks.append(
            PredictedBottleneck(
                location=b.get("location", "Unknown"),
                etaMinutes=int(b.get("etaMinutes", 0)),
                confidence=b.get("confidence", 0.9),
                reasoning=b.get("reasoning", "Bottleneck predicted."),
            )
        )

    # ── Top-level reasoning ──────────────────────────────────────────────────
    top_reasoning = ai_output.get("reasoning", [])
    if isinstance(top_reasoning, str):
        top_reasoning = [top_reasoning]
    if not top_reasoning:
        top_reasoning = [
            f"Analysis complete. Risk level: {ai_output.get('riskLevel', 'low')}."
        ]

    return AnalysisResult(
        analysisId=ai_output.get("analysisId", f"an_{uuid.uuid4().hex[:8]}"),
        uploadId=upload_id,
        aiSummary=ai_output.get("aiSummary")
        or ai_output.get("summary", "Analysis complete."),
        riskLevel=ai_output.get("riskLevel", "low"),
        congestionAlerts=alerts,
        predictedBottlenecks=bottlenecks,
        volunteerSuggestions=volunteers,
        gateRecommendations=recs,
        reasoning=top_reasoning,
        confidence=ai_output.get("confidence", 0.9),
        stale=stale,
        createdAt=datetime.now(timezone.utc),
    )


def run_ai_pipeline(payload: CrowdDataPayload, upload_id: str) -> AnalysisResult:
    """
    Orchestrates the AI analysis pipeline:
    1. Attempt Gemini analysis (with retry)
    2. Validate required fields
    3. On failure → deterministic rule engine fallback
    """
    start_time = time.time()
    retries = ai_config.RETRY_COUNT

    for attempt in range(retries + 1):
        try:
            logger.info(
                f"Gemini analysis attempt {attempt + 1}/{retries + 1} for upload '{upload_id}'"
            )
            gemini_output = get_gemini_analysis(payload)

            # Validate required fields
            has_summary = "aiSummary" in gemini_output or "summary" in gemini_output
            if "riskLevel" not in gemini_output or not has_summary:
                raise ValueError(
                    f"Missing required fields in Gemini output. Keys: {list(gemini_output.keys())}"
                )

            elapsed = time.time() - start_time
            logger.info(
                f"Gemini analysis succeeded. Time: {elapsed:.2f}s, "
                f"Risk: {gemini_output.get('riskLevel')}, "
                f"Confidence: {gemini_output.get('confidence')}"
            )
            return map_to_analysis_result(gemini_output, upload_id, stale=False)

        except Exception as e:
            logger.error(f"Gemini attempt {attempt + 1} failed: {e}")
            if attempt == retries:
                logger.warning("Max retries reached. Activating Rule Engine fallback.")

    # ── Fallback ─────────────────────────────────────────────────────────────
    fallback_start = time.time()
    logger.warning(f"Running rule engine fallback for upload '{upload_id}'")
    fallback_output = fallback_analyze_crowd_data(payload)
    elapsed = time.time() - fallback_start
    logger.info(f"Rule engine fallback completed. Time: {elapsed:.2f}s")

    return map_to_analysis_result(fallback_output, upload_id, stale=True)
