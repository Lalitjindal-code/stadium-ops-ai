from unittest.mock import patch, MagicMock
from app.models.data import CrowdDataPayload, CrowdDataRow
from app.services.ai_service import run_ai_pipeline
from datetime import datetime, timezone

def test_ai_pipeline_fallback():
    payload = CrowdDataPayload(
        rows=[
            CrowdDataRow(gateId="Gate A", count=5000, timestamp=datetime.now(timezone.utc))
        ]
    )
    
    # Mock Gemini to raise an exception, forcing the fallback rule engine
    with patch("app.services.ai_service.get_gemini_analysis", side_effect=Exception("API Error")):
        result = run_ai_pipeline(payload, "upload_123")
        
        # Rule engine logic: 5000/5000 is 100% (critical)
        assert result.riskLevel == "critical"
        assert result.uploadId == "upload_123"
        assert len(result.congestionAlerts) > 0
        assert result.congestionAlerts[0].severity == "critical"

def test_ai_pipeline_success():
    payload = CrowdDataPayload(
        rows=[
            CrowdDataRow(gateId="Gate A", count=2000, timestamp=datetime.now(timezone.utc))
        ]
    )
    
    # Mock Gemini to return valid JSON
    mock_gemini_output = {
        "summary": "Gemini Summary",
        "riskLevel": "low",
        "confidence": 0.99,
        "recommendedGate": None,
        "requiredVolunteers": 0,
        "reasoning": ["Everything is fine"]
    }
    
    with patch("app.services.ai_service.get_gemini_analysis", return_value=mock_gemini_output):
        result = run_ai_pipeline(payload, "upload_123")
        
        assert result.riskLevel == "low"
        assert result.aiSummary == "Gemini Summary"
