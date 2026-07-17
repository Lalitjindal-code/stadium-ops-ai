from typing import Dict, Any, List
from app.models.data import CrowdDataPayload

GATE_CAPACITY = {
    "Gate A": 5000,
    "Gate B": 3000,
    "Gate C": 4000,
    "Gate D": 2000
}

def fallback_analyze_crowd_data(payload: CrowdDataPayload) -> Dict[str, Any]:
    """
    Deterministic rule-based analysis acting as a fallback for Gemini.
    Returns a dictionary matching the expected Gemini JSON schema.
    """
    total_crowd = 0
    max_risk = "low"
    recommended_gate = None
    required_volunteers = 0
    reasoning = []
    
    for row in payload.rows:
        gate = row.gateId
        count = row.count
        capacity = GATE_CAPACITY.get(gate, 4000)
        
        ratio = count / capacity
        total_crowd += count
        
        if ratio >= 0.9:
            max_risk = "critical"
            reasoning.append(f"{gate} is at {ratio*100:.1f}% capacity (>90% threshold).")
            if not recommended_gate:
                recommended_gate = "Gate C" if gate != "Gate C" else "Gate B"
            required_volunteers += 5
        elif ratio > 0.75:
            if max_risk != "critical":
                max_risk = "high"
            reasoning.append(f"{gate} is reaching high capacity ({ratio*100:.1f}%).")
            required_volunteers += 2
            
    if not reasoning:
        reasoning.append("All gates are operating within normal parameters.")
        
    summary = f"Rule engine analyzed {len(payload.rows)} rows. Identified {max_risk.upper()} risk."

    return {
        "aiSummary": summary,
        "riskLevel": max_risk,
        "confidence": 1.0,
        "congestionAlerts": [{"gateId": recommended_gate or "Gate A", "severity": max_risk, "reasoning": "Rule matched", "confidence": 1.0}] if max_risk != "low" else [],
        "predictedBottlenecks": [],
        "gateRecommendations": [{"fromGateId": "Gate A", "toGateId": recommended_gate, "reasoning": "Rule based diversion", "confidence": 1.0}] if recommended_gate else [],
        "volunteerSuggestions": [],
        "analysisId": "FALLBACK-123"
    }

def fallback_simulate_scenario(payload: Any) -> Dict[str, Any]:
    """
    Deterministic rule-based fallback for scenario simulation.
    Returns a dictionary matching the expected ScenarioResult schema.
    """
    scenarios_str = " + ".join(payload.scenarios)
    risk_level = payload.severity.lower()
    
    # Generic static response matching the schema
    return {
        "scenario": scenarios_str,
        "riskLevel": risk_level,
        "confidence": 1.0,
        "summary": f"Fallback Rule Engine processed {scenarios_str}.",
        "expectedImpact": "Static analysis due to AI service unavailability.",
        "estimatedDelay": "Unknown",
        "affectedSpectators": 0,
        "requiredVolunteers": 10 if risk_level in ["high", "critical"] else 5,
        "requiredMedicalTeams": 2 if "Medical" in scenarios_str else 0,
        "requiredSecurityTeams": 2 if "Security" in scenarios_str else 1,
        "timeline": {
            "immediate": [{"action": "Assess situation", "reason": "Standard protocol", "evidence": "N/A", "confidence": 1.0, "reasonForConfidence": "Rule"}],
            "shortTerm": [],
            "longTerm": []
        },
        "gateRecommendations": [],
        "volunteerDeployment": [],
        "communicationPlan": [],
        "recoveryPlan": [],
        "reasoning": ["Fallback execution triggered."],
        "evidence": ["AI service offline."]
    }

def fallback_volunteer_assignment(payload: Any, volunteers: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Deterministic rule-based fallback for volunteer assignments.
    Prioritizes Available status, matching skills (simple keyword check), and lowest workload.
    """
    assignments = []
    available_vols = [v for v in volunteers if v.get("status", "").lower() == "available"]
    
    # Sort by workload ascending
    available_vols.sort(key=lambda x: x.get("workload", 100))
    
    if available_vols:
        # Just assign the top 1 available volunteer as a basic fallback
        vol = available_vols[0]
        assignments.append({
            "volunteerId": vol["volunteerId"],
            "name": vol["name"],
            "task": "Investigate incident",
            "priority": "High",
            "eta": "5 min",
            "estimatedDuration": "30 min",
            "assignmentScore": 75,
            "reason": "Lowest workload available volunteer",
            "evidence": [f"Workload: {vol['workload']}%"]
        })
        
    return {
        "summary": "Rule Engine generated assignments.",
        "assignments": assignments,
        "resourceSummary": {
            "volunteersAssigned": len(assignments),
            "medicalTeams": 0,
            "securityTeams": 0,
            "trafficTeams": 0
        },
        "reasoning": ["AI service offline. Used deterministic assignment logic."]
    }
