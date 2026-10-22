from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.application import JobApplication, SavedJob
from app.models.user import User
from app.schemas.user import UserUpdate, UserResponse
from app.services.auth_service import require_role

router = APIRouter(prefix="/employee", tags=["Job Seeker / Candidate Management"])

@router.get("/dashboard")
def get_candidate_dashboard_stats(
    current_user: User = Depends(require_role(["job_seeker", "admin"])),
    db: Session = Depends(get_db)
):
    total_applied = db.query(JobApplication).filter(JobApplication.user_id == current_user.id).count()
    shortlisted = db.query(JobApplication).filter(
        JobApplication.user_id == current_user.id,
        JobApplication.status == "Shortlisted"
    ).count()
    saved_count = db.query(SavedJob).filter(SavedJob.user_id == current_user.id).count()

    return {
        "candidate_name": current_user.name,
        "headline": current_user.headline,
        "total_applied": total_applied,
        "shortlisted": shortlisted,
        "saved_jobs_count": saved_count
    }

@router.put("/profile", response_model=UserResponse)
def update_candidate_profile(
    payload: UserUpdate,
    current_user: User = Depends(require_role(["job_seeker", "admin"])),
    db: Session = Depends(get_db)
):
    data = payload.dict(exclude_unset=True)
    for field, val in data.items():
        setattr(current_user, field, val)

    db.commit()
    db.refresh(current_user)
    return current_user
