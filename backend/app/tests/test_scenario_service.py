from unittest.mock import patch

from app.models.scenario import ScenarioPayload
from app.services.scenario_service import run_scenario_pipeline


def test_scenario_pipeline_fallback():
    payload = ScenarioPayload(
        scenarios=["Heavy Rain", "Gate Closure"],
        severity="High",
        notes="Testing fallback"
    )
    
    with patch("app.services.scenario_service.get_raw_gemini_response", side_effect=Exception("API Error")):
        result = run_scenario_pipeline(payload)
        
        # Rule engine logic should trigger
        assert result.riskLevel == "high"
        assert result.scenario == "Heavy Rain + Gate Closure"
        assert len(result.timeline.immediate) > 0

def test_scenario_pipeline_success():
    payload = ScenarioPayload(
        scenarios=["Medical Emergency"],
        severity="Critical",
        notes=""
    )
    
    mock_output = {
        "scenario": "Medical Emergency",
        "riskLevel": "critical",
        "confidence": 0.99,
        "summary": "AI Summary",
        "expectedImpact": "Impact",
        "estimatedDelay": "5m",
        "affectedSpectators": 100,
        "requiredVolunteers": 2,
        "requiredMedicalTeams": 1,
        "requiredSecurityTeams": 1,
        "timeline": {
            "immediate": [],
            "shortTerm": [],
            "longTerm": []
        },
        "gateRecommendations": [],
        "volunteerDeployment": [],
        "communicationPlan": [],
        "recoveryPlan": [],
        "reasoning": [],
        "evidence": []
    }
    
    with patch("app.services.scenario_service.get_raw_gemini_response", return_value=mock_output):
        result = run_scenario_pipeline(payload)
        assert result.riskLevel == "critical"
        assert result.summary == "AI Summary"
