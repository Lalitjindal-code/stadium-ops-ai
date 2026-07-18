from datetime import datetime, timezone
from unittest.mock import patch

import pytest

from app.models.data import CrowdDataPayload, CrowdDataRow
from app.services.ai_service import run_ai_pipeline


def _make_row(gate: str, count: int) -> CrowdDataRow:
    return CrowdDataRow(gateId=gate, count=count, timestamp=datetime.now(timezone.utc))


def test_ai_pipeline_fallback_critical():
    """When Gemini fails, rule engine should return critical for 100% capacity."""
    payload = CrowdDataPayload(rows=[_make_row("Gate A", 5000)])

    with patch("app.services.ai_service.get_gemini_analysis", side_effect=Exception("API Error")):
        result = run_ai_pipeline(payload, "upload_test_1")

    assert result.riskLevel == "critical"
    assert result.uploadId == "upload_test_1"
    assert len(result.congestionAlerts) > 0
    assert result.congestionAlerts[0].severity == "critical"
    assert result.stale is True          # fallback must set stale=True
    assert len(result.reasoning) > 0     # reasoning must never be empty


def test_ai_pipeline_fallback_medium():
    """Rule engine should detect medium risk for 50-75% capacity."""
    payload = CrowdDataPayload(rows=[_make_row("Gate A", 3000)])  # 3000/5000 = 60%

    with patch("app.services.ai_service.get_gemini_analysis", side_effect=Exception("API Error")):
        result = run_ai_pipeline(payload, "upload_test_2")

    assert result.riskLevel == "medium"
    assert result.stale is True


def test_ai_pipeline_fallback_low():
    """Rule engine should return low risk for under-50% capacity."""
    payload = CrowdDataPayload(rows=[_make_row("Gate A", 1000)])  # 1000/5000 = 20%

    with patch("app.services.ai_service.get_gemini_analysis", side_effect=Exception("API Error")):
        result = run_ai_pipeline(payload, "upload_test_3")

    assert result.riskLevel == "low"


def test_ai_pipeline_fallback_uuid_analysisid():
    """Fallback analysis IDs must be unique (no more static 'FALLBACK-123')."""
    payload = CrowdDataPayload(rows=[_make_row("Gate A", 5000)])

    with patch("app.services.ai_service.get_gemini_analysis", side_effect=Exception("API Error")):
        result1 = run_ai_pipeline(payload, "upload_a")
        result2 = run_ai_pipeline(payload, "upload_b")

    assert result1.analysisId != result2.analysisId
    assert result1.analysisId.startswith("FALLBACK-")


def test_ai_pipeline_success_new_schema():
    """Gemini success path — use current array-based schema."""
    payload = CrowdDataPayload(rows=[_make_row("Gate A", 2000)])

    mock_output = {
        "aiSummary": "Gate A operating normally at 40% capacity.",
        "analysisId": "GEN-TEST-001",
        "riskLevel": "low",
        "confidence": 0.99,
        "reasoning": ["Gate A at 40% — below all alert thresholds."],
        "congestionAlerts": [],
        "predictedBottlenecks": [],
        "gateRecommendations": [],
        "volunteerSuggestions": [],
    }

    with patch("app.services.ai_service.get_gemini_analysis", return_value=mock_output):
        result = run_ai_pipeline(payload, "upload_test_success")

    assert result.riskLevel == "low"
    assert result.aiSummary == "Gate A operating normally at 40% capacity."
    assert result.analysisId == "GEN-TEST-001"
    assert result.stale is False
    assert len(result.reasoning) > 0


def test_ai_pipeline_input_row_limit():
    """CrowdDataPayload must reject more than 500 rows."""
    import pydantic
    with pytest.raises((pydantic.ValidationError, ValueError)):
        CrowdDataPayload(rows=[_make_row("Gate A", 100)] * 501)


def test_ai_pipeline_input_empty_rows():
    """CrowdDataPayload must reject empty rows list."""
    import pydantic
    with pytest.raises((pydantic.ValidationError, ValueError)):
        CrowdDataPayload(rows=[])
