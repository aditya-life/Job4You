"""
Job4You OTP & Verification Service.

Manages one-time password generation, demo bypass verification,
and production SMS gateway integrations.
"""

import random
import string
from datetime import datetime
from sqlalchemy.orm import Session
from app.config import settings
from app.models.otp import OTP


def generate_random_otp(length: int = 6) -> str:
    """Generates a random numeric OTP string."""
    return "".join(random.choices(string.digits, k=length))


def create_and_send_otp(db: Session, identifier: str) -> dict:
    """Generates and stores OTP. Dispatches via SMS or demo bypass."""
    # In Demo Mode, use configured DEMO_OTP
    if settings.BYPASS_OTP:
        code = settings.DEMO_OTP
    else:
        code = generate_random_otp()

    # Invalidate previous unused OTPs for this identifier
    db.query(OTP).filter(
        OTP.identifier == identifier, 
        OTP.is_used == False
    ).update({"is_used": True})

    otp_record = OTP.create_otp(identifier=identifier, code=code)
    db.add(otp_record)
    db.commit()
    db.refresh(otp_record)

    # In production, dispatch SMS via Twilio / Fast2SMS / AWS SNS here:
    # dispatch_sms(identifier, f"Your Job4You OTP is {code}")

    response = {
        "status": True,
        "message": "OTP dispatched successfully" if not settings.BYPASS_OTP else "Demo OTP ready. Use code to login.",
        "identifier": identifier,
        "demo_mode": settings.BYPASS_OTP,
        "demo_otp": settings.DEMO_OTP if settings.BYPASS_OTP else None
    }
    return response


def verify_otp_code(db: Session, identifier: str, input_otp: str) -> bool:
    """Validates submitted OTP code against active database records or demo bypass."""
    # 1. Master Demo Bypass Check
    if settings.BYPASS_OTP:
        # Accept either configured DEMO_OTP or fallback '1111' or '123456'
        if input_otp in (settings.DEMO_OTP, "1111", "123456"):
            return True

    # 2. Database verification check
    record = (
        db.query(OTP)
        .filter(
            OTP.identifier == identifier,
            OTP.is_used == False,
            OTP.expires_at >= datetime.utcnow()
        )
        .order_by(OTP.id.desc())
        .first()
    )

    if not record:
        return False

    if record.code == input_otp.strip():
        record.is_used = True
        db.commit()
        return True

    return False


class OTPService:
    """Service wrapper for OTP operations."""
    generate_random_otp = staticmethod(generate_random_otp)
    create_and_send_otp = staticmethod(create_and_send_otp)
    verify_otp_code = staticmethod(verify_otp_code)


otp_service = OTPService()
