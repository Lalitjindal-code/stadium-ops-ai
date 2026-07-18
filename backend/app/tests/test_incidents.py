from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _auth_headers(role: str = "organizer") -> dict:
    return {"Authorization": "Bearer fake_token"}


def _mock_firestore_for_incident(mock_db: MagicMock, doc_exists: bool = False):
    """Helper to set up Firestore mock chain for incidents."""
    collection_mock = MagicMock()
    doc_ref_mock = MagicMock()
    doc_snapshot_mock = MagicMock()
    doc_snapshot_mock.exists = doc_exists
    doc_ref_mock.get.return_value = doc_snapshot_mock
    collection_mock.document.return_value = doc_ref_mock
    mock_db.collection.return_value = collection_mock
    return doc_ref_mock, doc_snapshot_mock


# ── POST /incidents/report ─────────────────────────────────────────────────────


@patch("app.core.auth.auth.verify_id_token")
@patch("app.core.auth.firestore.client")
@patch("app.routers.incidents.firestore.client")
@patch("app.services.gemini_service.get_raw_gemini_response")
def test_report_incident_success(
    mock_gemini,
    mock_firestore_incidents,
    mock_firestore_auth,
    mock_verify_token,
):
    """Incident report should persist to Firestore and return AI summary."""
    mock_verify_token.return_value = {"uid": "vol_123"}

    # Auth Firestore mock
    auth_db = MagicMock()
    auth_doc = MagicMock()
    auth_doc.exists = True
    auth_doc.to_dict.return_value = {"role": "volunteer"}
    auth_db.collection.return_value.document.return_value.get.return_value = auth_doc
    mock_firestore_auth.return_value = auth_db

    # Incidents Firestore mock
    inc_db = MagicMock()
    mock_firestore_incidents.return_value = inc_db

    # Gemini returns AI summary
    mock_gemini.return_value = {
        "aiSummary": "Fan collapsed near Gate B merchandise stand, conscious.",
        "riskLevel": "high",
        "reasoning": "Medical emergency with conscious patient — high risk.",
    }

    response = client.post(
        "/api/v1/incidents/report",
        json={"location": "Gate B", "description": "Fan collapsed near merchandise."},
        headers=_auth_headers("volunteer"),
    )

    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["riskLevel"] == "high"
    assert "inc_" in data["incidentId"]
    assert data["aiSummary"] is not None


@patch("app.core.auth.auth.verify_id_token")
@patch("app.core.auth.firestore.client")
@patch("app.routers.incidents.firestore.client")
@patch("app.services.gemini_service.get_raw_gemini_response")
def test_report_incident_ai_fallback(
    mock_gemini,
    mock_firestore_incidents,
    mock_firestore_auth,
    mock_verify_token,
):
    """If Gemini fails, incident should still be created with unknown risk."""
    mock_verify_token.return_value = {"uid": "vol_123"}

    auth_db = MagicMock()
    auth_doc = MagicMock()
    auth_doc.exists = True
    auth_doc.to_dict.return_value = {"role": "volunteer"}
    auth_db.collection.return_value.document.return_value.get.return_value = auth_doc
    mock_firestore_auth.return_value = auth_db

    inc_db = MagicMock()
    mock_firestore_incidents.return_value = inc_db

    # AI fails
    mock_gemini.side_effect = Exception("Gemini unavailable")

    response = client.post(
        "/api/v1/incidents/report",
        json={
            "location": "Gate C",
            "description": "Suspicious package near turnstile.",
        },
        headers=_auth_headers("volunteer"),
    )

    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["riskLevel"] == "unknown"  # Graceful fallback


def test_report_incident_missing_fields():
    """Incidents with empty location or description should be rejected."""
    response = client.post(
        "/api/v1/incidents/report",
        json={"location": "", "description": ""},
        headers=_auth_headers("volunteer"),
    )
    assert response.status_code in (401, 403, 422)  # Auth or validation failure


# ── GET /incidents/{incidentId} ────────────────────────────────────────────────


@patch("app.core.auth.auth.verify_id_token")
@patch("firebase_admin.firestore.client")
def test_get_incident_not_found(
    mock_firestore_client,
    mock_verify_token,
):
    """Getting a non-existent incident should return 404."""
    from unittest.mock import PropertyMock

    mock_verify_token.return_value = {"uid": "org_123"}

    # Auth doc (organizer)
    auth_doc = MagicMock()
    type(auth_doc).exists = PropertyMock(return_value=True)
    auth_doc.to_dict.return_value = {"role": "organizer"}

    # Incident doc (not found)
    not_found_doc = MagicMock()
    type(not_found_doc).exists = PropertyMock(return_value=False)

    # Build two separate DB mocks
    auth_db = MagicMock()
    auth_db.collection.return_value.document.return_value.get.return_value = auth_doc

    inc_db = MagicMock()
    inc_doc_ref = MagicMock()
    inc_doc_ref.get.return_value = not_found_doc
    inc_db.collection.return_value.document.return_value = inc_doc_ref

    # First call → auth DB, second call → incidents DB
    mock_firestore_client.side_effect = [auth_db, inc_db]

    response = client.get(
        "/api/v1/incidents/inc_nonexistent",
        headers={"Authorization": "Bearer fake_token"},
    )
    assert response.status_code == 404, (
        f"Expected 404 but got {response.status_code}: {response.json()}"
    )
