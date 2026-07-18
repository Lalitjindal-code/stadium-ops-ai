import uuid
from typing import Any, Dict, List

from app.models.data import CrowdDataPayload

GATE_CAPACITY = {
    "Gate A": 5000,
    "Gate B": 3000,
    "Gate C": 4000,
    "Gate D": 2000,
}


def _load_mock_volunteers() -> List[Dict[str, Any]]:
    """Load volunteer list from mock_data for fallback suggestions."""
    import json
    import os
    try:
        filepath = os.path.join(os.path.dirname(__file__), "..", "..", "mock_data", "volunteers.json")
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def fallback_analyze_crowd_data(payload: CrowdDataPayload) -> Dict[str, Any]:
    """
    Deterministic rule-based analysis acting as a fallback for Gemini.
    Returns a dictionary matching the expected Gemini JSON schema.
    """
    total_crowd = 0
    max_risk = "low"
    congestion_alerts = []
    gate_recommendations = []
    volunteer_suggestions = []
    reasoning = []

    # Identify under-capacity gate for diversion
    gate_counts = {row.gateId: row.count for row in payload.rows}

    for row in payload.rows:
        gate = row.gateId
        count = row.count
        capacity = GATE_CAPACITY.get(gate, 4000)
        ratio = count / capacity
        total_crowd += count

        if ratio >= 0.9:
            max_risk = "critical"
            reasoning.append(f"{gate} is at {ratio*100:.1f}% capacity (≥90% threshold — CRITICAL).")
            congestion_alerts.append({
                "gateId": gate,
                "severity": "critical",
                "reasoning": f"Crowd count {count} exceeds 90% of capacity {capacity}.",
                "confidence": 1.0,
            })
            # Recommend diversion to lowest-count alternative gate
            alt = _find_diversion_gate(gate, gate_counts, GATE_CAPACITY)
            if alt:
                gate_recommendations.append({
                    "fromGateId": gate,
                    "toGateId": alt,
                    "reasoning": f"Divert from {gate} (critical) to {alt} (lower occupancy).",
                    "confidence": 1.0,
                })

        elif ratio >= 0.75:
            if max_risk not in ("critical",):
                max_risk = "high"
            reasoning.append(f"{gate} is reaching high capacity ({ratio*100:.1f}% — ≥75% threshold).")
            congestion_alerts.append({
                "gateId": gate,
                "severity": "high",
                "reasoning": f"Crowd count {count} exceeds 75% of capacity {capacity}.",
                "confidence": 0.95,
            })

        elif ratio >= 0.5:
            if max_risk not in ("critical", "high"):
                max_risk = "medium"
            reasoning.append(f"{gate} is at moderate occupancy ({ratio*100:.1f}%).")

    if not reasoning:
        reasoning.append("All gates are operating within normal parameters.")

    # Add volunteer suggestions from mock pool for high/critical risk
    if max_risk in ("high", "critical"):
        volunteers = _load_mock_volunteers()
        available = [v for v in volunteers if v.get("status", "").lower() == "available"]
        available.sort(key=lambda v: v.get("workload", 100))
        for v in available[:3]:
            alert_gate = congestion_alerts[0]["gateId"] if congestion_alerts else "Gate A"
            volunteer_suggestions.append({
                "volunteerId": v["volunteerId"],
                "suggestedLocation": alert_gate,
                "reasoning": f"{v['name']} has {v['skills']} skills and {v['workload']}% workload.",
                "confidence": 0.85,
            })

    summary = (
        f"Rule Engine analyzed {len(payload.rows)} gate(s). "
        f"Total crowd: {total_crowd:,}. Overall risk: {max_risk.upper()}."
    )

    return {
        "analysisId": f"FALLBACK-{uuid.uuid4().hex[:8].upper()}",
        "aiSummary": summary,
        "riskLevel": max_risk,
        "confidence": 1.0,
        "reasoning": reasoning,
        "congestionAlerts": congestion_alerts,
        "predictedBottlenecks": [],
        "gateRecommendations": gate_recommendations,
        "volunteerSuggestions": volunteer_suggestions,
    }


def _find_diversion_gate(
    overloaded_gate: str,
    gate_counts: Dict[str, int],
    capacities: Dict[str, int],
) -> str | None:
    """Return the gate with the most spare capacity (excluding the overloaded one)."""
    best_gate = None
    best_spare = -1
    for gate, cap in capacities.items():
        if gate == overloaded_gate:
            continue
        count = gate_counts.get(gate, 0)
        spare = cap - count
        if spare > best_spare:
            best_spare = spare
            best_gate = gate
    return best_gate


def fallback_simulate_scenario(payload: Any) -> Dict[str, Any]:
    """
    Deterministic rule-based fallback for scenario simulation.
    Returns a dictionary matching the expected ScenarioResult schema.
    """
    scenarios_str = " + ".join(payload.scenarios)
    risk_level = payload.severity.lower()

    return {
        "scenario": scenarios_str,
        "riskLevel": risk_level,
        "confidence": 1.0,
        "summary": f"Fallback Rule Engine processed: {scenarios_str}.",
        "expectedImpact": "Static analysis — AI service temporarily unavailable.",
        "estimatedDelay": "Unknown",
        "affectedSpectators": 0,
        "requiredVolunteers": 10 if risk_level in ("high", "critical") else 5,
        "requiredMedicalTeams": 2 if "Medical" in scenarios_str else 0,
        "requiredSecurityTeams": 2 if "Security" in scenarios_str else 1,
        "timeline": {
            "immediate": [
                {
                    "action": "Assess situation and notify command centre",
                    "reason": "Standard FIFA protocol",
                    "evidence": "N/A",
                    "confidence": 1.0,
                    "reasonForConfidence": "Deterministic rule",
                }
            ],
            "shortTerm": [],
            "longTerm": [],
        },
        "gateRecommendations": [],
        "volunteerDeployment": [],
        "communicationPlan": [],
        "recoveryPlan": [],
        "reasoning": ["AI service offline — used deterministic fallback rules."],
        "evidence": ["AI service returned error or timed out."],
    }


def fallback_volunteer_assignment(payload: Any, volunteers: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Deterministic rule-based fallback for volunteer assignments.
    Prioritizes Available status, matching skills, and lowest workload.
    """
    assignments = []
    available_vols = [v for v in volunteers if v.get("status", "").lower() == "available"]
    available_vols.sort(key=lambda x: x.get("workload", 100))

    for vol in available_vols[:3]:
        assignments.append({
            "volunteerId": vol["volunteerId"],
            "name": vol["name"],
            "task": "Investigate and manage incident",
            "priority": "High",
            "eta": "5 min",
            "estimatedDuration": "30 min",
            "assignmentScore": max(0, 100 - vol.get("workload", 50)),
            "reason": f"Lowest-workload available volunteer ({vol.get('workload', 0)}% load).",
            "evidence": [
                f"Zone: {vol.get('currentZone', 'Unknown')}",
                f"Skills: {', '.join(vol.get('skills', []))}",
                f"Workload: {vol.get('workload', 0)}%",
            ],
        })

    return {
        "summary": "Rule Engine generated assignments — AI service unavailable.",
        "assignments": assignments,
        "resourceSummary": {
            "volunteersAssigned": len(assignments),
            "medicalTeams": 0,
            "securityTeams": 0,
            "trafficTeams": 0,
        },
        "reasoning": ["AI service offline. Used deterministic assignment logic prioritizing lowest workload."],
    }
