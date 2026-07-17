import uuid
from datetime import datetime, timezone

from app.models.analysis import (
    AnalysisResult,
    CongestionAlert,
    GateRecommendation,
    PredictedBottleneck,
    VolunteerSuggestion,
)
from app.models.data import CrowdDataPayload

GATE_CAPACITY = {"Gate A": 5000, "Gate B": 3000, "Gate C": 4000, "Gate D": 2000}


def analyze_crowd_data(payload: CrowdDataPayload, upload_id: str) -> AnalysisResult:
    alerts = []
    recs = []
    volunteers = []
    bottlenecks = []

    total_crowd = 0
    max_risk = "low"

    for row in payload.rows:
        gate = row.gateId
        count = row.count
        capacity = GATE_CAPACITY.get(gate, 4000)

        ratio = count / capacity
        total_crowd += count

        if ratio >= 0.9:
            max_risk = "high"
            alerts.append(
                CongestionAlert(
                    gateId=gate,
                    severity="high",
                    reasoning=f"Crowd count ({count}) exceeds 90% of capacity ({capacity}).",
                )
            )
            recs.append(
                GateRecommendation(
                    fromGateId=gate,
                    toGateId="Gate C" if gate != "Gate C" else "Gate B",
                    reasoning=f"Divert traffic from {gate} to prevent overflow.",
                )
            )
            volunteers.append(
                VolunteerSuggestion(
                    volunteerId="user_082",
                    suggestedLocation=f"{gate} exterior",
                    reasoning=f"Need additional volunteers at {gate} for crowd control.",
                )
            )
        elif ratio > 0.75:
            if max_risk != "high":
                max_risk = "medium"
            alerts.append(
                CongestionAlert(
                    gateId=gate,
                    severity="medium",
                    reasoning=f"Crowd count ({count}) is approaching capacity ({capacity}).",
                )
            )
            bottlenecks.append(
                PredictedBottleneck(
                    location=f"{gate} concourse",
                    etaMinutes=15,
                    confidence=0.8,
                    reasoning="Current inflow trend indicates bottleneck formation soon.",
                )
            )

    # Ensure a summary if there are no major issues
    if not alerts:
        alerts.append(
            CongestionAlert(
                gateId="System",
                severity="low",
                reasoning="All gates are operating within normal parameters.",
            )
        )

    summary = (
        f"Analyzed {len(payload.rows)} rows. "
        f"Maximum risk level identified: {max_risk.upper()}. "
        f"{len(alerts)} alerts generated."
    )

    return AnalysisResult(
        analysisId=f"an_{uuid.uuid4().hex[:8]}",
        uploadId=upload_id,
        aiSummary=summary,
        congestionAlerts=alerts,
        predictedBottlenecks=bottlenecks,
        volunteerSuggestions=volunteers,
        gateRecommendations=recs,
        riskLevel=max_risk,
        createdAt=datetime.now(timezone.utc),
    )
