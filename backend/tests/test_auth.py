from app.config import settings

def test_send_otp_success(client):
    payload = {"identifier": "+919876543210", "purpose": "login"}
    response = client.post("/api/auth/send-otp", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] is True
    assert data["identifier"] == "+919876543210"
    if settings.BYPASS_OTP:
        assert data["demo_mode"] is True
        assert data["demo_otp"] == settings.DEMO_OTP

def test_verify_otp_bypass_demo_mode(client):
    # Send OTP first
    client.post("/api/auth/send-otp", json={"identifier": "+919876500000"})
    
    # Verify using Demo OTP
    payload = {
        "identifier": "+919876500000",
        "otp": settings.DEMO_OTP,
        "name": "Demo Candidate",
        "role": "job_seeker"
    }
    response = client.post("/api/auth/verify-otp", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["phone"] == "+919876500000"
    assert data["user"]["role"] == "job_seeker"

def test_verify_otp_invalid_code(client):
    # When sending a bad code (not matching demo bypass)
    payload = {
        "identifier": "+919876599999",
        "otp": "000000"
    }
    # Turn off bypass temporarily if needed or test non-demo code
    if not settings.BYPASS_OTP:
        response = client.post("/api/auth/verify-otp", json=payload)
        assert response.status_code == 400

def test_email_signup_and_login(client):
    unique_email = "new_engineer@job4you.com"
    signup_data = {
        "name": "Aman Singh",
        "email": unique_email,
        "phone": "+919888877777",
        "password": "SecurePassword@123",
        "role": "job_seeker"
    }
    res = client.post("/api/auth/signup", json=signup_data)
    assert res.status_code == 200
    assert "access_token" in res.json()

    # Login with valid credentials
    login_data = {
        "email": unique_email,
        "password": "SecurePassword@123"
    }
    login_res = client.post("/api/auth/login", json=login_data)
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

    # Login with invalid password
    bad_login = {
        "email": unique_email,
        "password": "WrongPassword"
    }
    bad_res = client.post("/api/auth/login", json=bad_login)
    assert bad_res.status_code == 401

def test_get_current_user_profile(client, candidate_token):
    headers = {"Authorization": f"Bearer {candidate_token}"}
    res = client.get("/api/auth/me", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "test.candidate@job4you.com"
    assert data["role"] == "job_seeker"

def test_get_current_user_unauthorized(client):
    res = client.get("/api/auth/me")
    assert res.status_code == 401
