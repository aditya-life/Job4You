from pydantic import BaseModel, EmailStr
from typing import Optional

class SendOtpRequest(BaseModel):
    identifier: str  # Phone (+919876543210) or Email (user@example.com)
    purpose: Optional[str] = "login"  # login, signup, password_reset

class SendOtpResponse(BaseModel):
    status: bool
    message: str
    identifier: str
    demo_mode: bool = False
    demo_otp: Optional[str] = None  # Exposed in demo/development mode for testing convenience

class VerifyOtpRequest(BaseModel):
    identifier: str
    otp: str
    name: Optional[str] = None
    role: Optional[str] = "job_seeker"  # job_seeker or employer

class EmailPasswordLoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str
    role: str = "job_seeker"  # job_seeker or employer
    company_name: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None
