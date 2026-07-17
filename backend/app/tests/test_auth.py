from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@patch("app.core.auth.auth.verify_id_token")
@patch("app.core.auth.firestore.client")
def test_organizer_access_success(mock_firestore_client, mock_verify_id_token):
    # Mock token verification
    mock_verify_id_token.return_value = {"uid": "test_organizer_uid"}

    # Mock Firestore user doc
    mock_db = MagicMock()
    mock_doc_ref = MagicMock()
    mock_doc_snapshot = MagicMock()

    mock_firestore_client.return_value = mock_db
    mock_db.collection.return_value.document.return_value = mock_doc_ref
    mock_doc_ref.get.return_value = mock_doc_snapshot
    mock_doc_snapshot.exists = True
    mock_doc_snapshot.to_dict.return_value = {"role": "organizer"}

    response = client.get(
        "/api/v1/test/organizer", headers={"Authorization": "Bearer fake_token"}
    )
    assert response.status_code == 200
    assert response.json() == {"message": "You have organizer access"}


@patch("app.core.auth.auth.verify_id_token")
@patch("app.core.auth.firestore.client")
def test_volunteer_access_denied_for_organizer_route(
    mock_firestore_client, mock_verify_id_token
):
    # Mock token verification
    mock_verify_id_token.return_value = {"uid": "test_volunteer_uid"}

    # Mock Firestore user doc
    mock_db = MagicMock()
    mock_doc_ref = MagicMock()
    mock_doc_snapshot = MagicMock()

    mock_firestore_client.return_value = mock_db
    mock_db.collection.return_value.document.return_value = mock_doc_ref
    mock_doc_ref.get.return_value = mock_doc_snapshot
    mock_doc_snapshot.exists = True
    mock_doc_snapshot.to_dict.return_value = {"role": "volunteer"}

    response = client.get(
        "/api/v1/test/organizer", headers={"Authorization": "Bearer fake_token"}
    )
    assert response.status_code == 403
    assert response.json() == {"detail": "Forbidden: insufficient permissions"}


def test_missing_auth_header():
    response = client.get("/api/v1/test/organizer")
    assert response.status_code == 403  # HTTPBearer returns 403 when missing header
