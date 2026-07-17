from typing import Dict, Any
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
        "summary": summary,
        "riskLevel": max_risk,
        "confidence": 1.0,  # Rule engine is deterministic
        "recommendedGate": recommended_gate,
        "requiredVolunteers": required_volunteers,
        "reasoning": reasoning
    }
