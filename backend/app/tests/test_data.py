from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


@patch("app.routers.analysis.firestore.client")
@patch("app.core.auth.auth.verify_id_token")
@patch("app.core.auth.firestore.client")
def test_csv_analysis_endpoint(
    mock_auth_firestore, mock_verify_id_token, mock_router_firestore
):
    # Mock Auth
    mock_verify_id_token.return_value = {"uid": "test_org"}

    mock_db = MagicMock()
    mock_doc_ref = MagicMock()
    mock_doc_snapshot = MagicMock()

    mock_auth_firestore.return_value = mock_db
    mock_router_firestore.return_value = mock_db

    mock_db.collection.return_value.document.return_value = mock_doc_ref
    mock_doc_ref.get.return_value = mock_doc_snapshot
    mock_doc_snapshot.exists = True
    mock_doc_snapshot.to_dict.return_value = {"role": "organizer"}

    # Test Payload
    payload = {
        "rows": [
            {"gateId": "Gate A", "count": 4800, "timestamp": "2026-06-11T18:30:00Z"},
            {"gateId": "Gate B", "count": 1000, "timestamp": "2026-06-11T18:30:00Z"},
        ]
    }

    response = client.post(
        "/api/v1/analysis/csv",
        json=payload,
        headers={"Authorization": "Bearer fake_token"},
    )

    assert response.status_code == 200
    data = response.json()
    assert "analysisId" in data
    assert (
        data["riskLevel"] == "high"
    )  # Gate A is at 96% (4800/5000), wait, > 90 is high (I used high instead of critical in my last logic update)
    assert len(data["congestionAlerts"]) > 0
    assert "Analyzed 2 rows" in data["aiSummary"]
