from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime, timedelta
from app.database import Base
from app.config import settings

class OTP(Base):
    __tablename__ = "otps"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    identifier = Column(String(150), index=True, nullable=False)  # Phone number or email
    code = Column(String(10), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    @classmethod
    def create_otp(cls, identifier: str, code: str):
        expiry = datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRY_MINUTES)
        return cls(identifier=identifier, code=code, expires_at=expiry, is_used=False)

    def is_valid(self, input_code: str) -> bool:
        if self.is_used:
            return False
        if datetime.utcnow() > self.expires_at:
            return False
        return self.code == input_code
