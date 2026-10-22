from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.job import JobResponse
from app.schemas.user import UserResponse

class ApplyRequest(BaseModel):
    job_id: int
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None

class StatusUpdateRequest(BaseModel):
    status: str  # Applied, Under Review, Shortlisted, Interview Scheduled, Rejected, Hired
    employer_notes: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    user_id: int
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    status: str
    employer_notes: Optional[str] = None
    created_at: datetime
    job: Optional[JobResponse] = None
    applicant: Optional[UserResponse] = None

    class Config:
        from_attributes = True
