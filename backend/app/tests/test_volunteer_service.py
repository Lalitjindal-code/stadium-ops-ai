from unittest.mock import patch

from app.models.assignment import VolunteerAssignmentRequest
from app.services.volunteer_service import run_assignment_pipeline


def test_volunteer_pipeline_fallback():
    payload = VolunteerAssignmentRequest(
        scenario="Fire Alert",
        crowdAnalysisSummary="High crowd at Gate 1",
        scenarioResultSummary="Evacuate to Gate 3",
        stadiumStatus="Normal",
        notes=""
    )
    
    with patch("app.services.volunteer_service.get_raw_gemini_response", side_effect=Exception("API Error")):
        result = run_assignment_pipeline(payload)
        
        # Rule engine should assign the lowest workload available volunteer (Alex Chen or Sarah Jones based on workload)
        assert len(result.assignments) > 0
        assert result.assignments[0].name in ["Alex Chen", "Sarah Jones", "Priya Patel", "Emma Wilson", "James Taylor", "Maria Garcia"]
        assert result.assignments[0].priority == "High"
        assert result.resourceSummary.volunteersAssigned > 0

def test_volunteer_pipeline_success():
    payload = VolunteerAssignmentRequest(
        scenario="Medical Emergency",
        crowdAnalysisSummary="Incident at Gate 4",
        scenarioResultSummary="Dispatch medical team.",
        stadiumStatus="Normal",
        notes=""
    )
    
    mock_output = {
        "summary": "AI Summary",
        "assignments": [
            {
                "volunteerId": "V002",
                "name": "Sarah Jones",
                "task": "Medical Response",
                "priority": "Critical",
                "eta": "1 min",
                "estimatedDuration": "30 min",
                "assignmentScore": 99,
                "reason": "Nearest medical volunteer",
                "evidence": ["First Aid"]
            }
        ],
        "resourceSummary": {
            "volunteersAssigned": 1,
            "medicalTeams": 1,
            "securityTeams": 0,
            "trafficTeams": 0
        },
        "reasoning": ["Dispatched nearest medical"]
    }
    
    with patch("app.services.volunteer_service.get_raw_gemini_response", return_value=mock_output):
        result = run_assignment_pipeline(payload)
        assert result.assignments[0].name == "Sarah Jones"
        assert result.resourceSummary.medicalTeams == 1
