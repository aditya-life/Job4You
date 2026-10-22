"""
Job4You Job Seeker / Candidate API Router.

Handles candidate dashboard metrics and profile updates.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserUpdate, UserResponse
from app.services.auth_service import require_role
from app.services.user_service import user_service

router = APIRouter(prefix="/employee", tags=["Job Seeker / Candidate Management"])


@router.get("/dashboard")
def get_candidate_dashboard_stats(
    current_user: User = Depends(require_role(["job_seeker", "admin"])),
    db: Session = Depends(get_db)
):
    """Returns candidate's application metrics and saved bookmarks count."""
    return user_service.get_candidate_dashboard_stats(db=db, current_user=current_user)


@router.put("/profile", response_model=UserResponse)
def update_candidate_profile(
    payload: UserUpdate,
    current_user: User = Depends(require_role(["job_seeker", "admin"])),
    db: Session = Depends(get_db)
):
    """Updates candidate profile details (headline, bio, skills, experience, location)."""
    return user_service.update_profile(db=db, user=current_user, payload=payload)
