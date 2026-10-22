from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.models.user import User
from app.schemas.auth import (
    SendOtpRequest, SendOtpResponse, VerifyOtpRequest,
    EmailPasswordLoginRequest, SignupRequest, TokenResponse
)
from app.schemas.user import UserResponse
from app.services.auth_service import (
    verify_password, get_password_hash, create_access_token, get_current_user
)
from app.services.otp_service import create_and_send_otp, verify_otp_code

router = APIRouter(prefix="/auth", tags=["Authentication & OTP"])

@router.post("/send-otp", response_model=SendOtpResponse)
def send_otp_endpoint(payload: SendOtpRequest, db: Session = Depends(get_db)):
    identifier = payload.identifier.strip()
    if not identifier:
        raise HTTPException(status_code=400, detail="Phone number or email is required")
    
    result = create_and_send_otp(db, identifier)
    return result

@router.post("/verify-otp", response_model=TokenResponse)
def verify_otp_endpoint(payload: VerifyOtpRequest, db: Session = Depends(get_db)):
    identifier = payload.identifier.strip()
    otp = payload.otp.strip()

    is_valid = verify_otp_code(db, identifier, otp)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Invalid or expired OTP. (Demo mode code: {settings.DEMO_OTP})"
        )

    # Check if user exists by phone or email
    user = db.query(User).filter(
        (User.phone == identifier) | (User.email == identifier)
    ).first()

    if not user:
        # Auto-create new user on initial phone/email OTP verification
        is_email = "@" in identifier
        default_name = payload.name or f"User_{identifier[-4:] if len(identifier) >= 4 else 'New'}"
        user = User(
            name=default_name,
            phone=identifier if not is_email else None,
            email=identifier if is_email else f"{identifier.replace('+', '')}@job4you.local",
            role=payload.role or "job_seeker",
            is_verified=True,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        user.is_verified = True
        db.commit()

    token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "company_name": user.company_name,
            "is_verified": user.is_verified
        }
    }

@router.post("/login", response_model=TokenResponse)
def login_email_password(payload: EmailPasswordLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "company_name": user.company_name,
            "is_verified": user.is_verified
        }
    }

@router.post("/signup", response_model=TokenResponse)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    # Check duplicate email
    if db.query(User).filter(User.email == payload.email.lower()).first():
        raise HTTPException(status_code=400, detail="Email is already registered")

    user = User(
        name=payload.name,
        email=payload.email.lower(),
        phone=payload.phone,
        password_hash=get_password_hash(payload.password),
        role=payload.role,
        company_name=payload.company_name if payload.role == "employer" else None,
        is_verified=True,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "company_name": user.company_name,
            "is_verified": user.is_verified
        }
    }

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user
