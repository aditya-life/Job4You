from app.services.auth_service import create_access_token
from datetime import timedelta

def test_tampered_jwt_token_rejected(client):
    headers = {"Authorization": "Bearer invalid.jwt.signature"}
    res = client.get("/api/auth/me", headers=headers)
    assert res.status_code == 401

def test_expired_jwt_token_rejected(client, test_candidate):
    expired_token = create_access_token(
        data={"sub": str(test_candidate.id), "role": test_candidate.role},
        expires_delta=timedelta(seconds=-1)
    )
    headers = {"Authorization": f"Bearer {expired_token}"}
    res = client.get("/api/auth/me", headers=headers)
    assert res.status_code == 401

def test_candidate_blocked_from_employer_dashboard(client, candidate_token):
    headers = {"Authorization": f"Bearer {candidate_token}"}
    res = client.get("/api/employer/dashboard", headers=headers)
    assert res.status_code == 403
    assert "not permitted" in res.json()["detail"].lower()

def test_employer_blocked_from_candidate_dashboard(client, employer_token):
    headers = {"Authorization": f"Bearer {employer_token}"}
    res = client.get("/api/employee/dashboard", headers=headers)
    assert res.status_code == 403
