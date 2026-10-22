"""
Job4You Job Applications & ATS API Router.

Handles job applications, recruiter candidate tracking, status updates,
and bookmarking saved jobs. Business logic is delegated to `app.services.application_service`.
"""

from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.application import ApplyRequest, StatusUpdateRequest, ApplicationResponse
from app.services.auth_service import require_role
from app.services.application_service import application_service

router = APIRouter(prefix="/applications", tags=["Applications & Saved Jobs"])


@router.post("/apply", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_to_job(
    payload: ApplyRequest,
    current_user: User = Depends(require_role(["job_seeker", "admin"])),
    db: Session = Depends(get_db)
):
    """Submits a candidate job application for an active vacancy."""
    return application_service.apply_to_job(db=db, user=current_user, payload=payload)


@router.get("/my-applications", response_model=List[ApplicationResponse])
def get_my_applications(
    current_user: User = Depends(require_role(["job_seeker", "admin"])),
    db: Session = Depends(get_db)
):
    """Returns candidate's submitted job applications list."""
    return application_service.get_my_applications(db=db, user_id=current_user.id)


@router.get("/job/{job_id}", response_model=List[ApplicationResponse])
def get_job_applicants(
    job_id: int,
    current_user: User = Depends(require_role(["employer", "admin"])),
    db: Session = Depends(get_db)
):
    """Returns applicants for a specific job (restricted to job owner employer or admin)."""
    return application_service.get_job_applicants(db=db, job_id=job_id, user=current_user)


@router.put("/{application_id}/status", response_model=ApplicationResponse)
def update_application_status(
    application_id: int,
    payload: StatusUpdateRequest,
    current_user: User = Depends(require_role(["employer", "admin"])),
    db: Session = Depends(get_db)
):
    """Updates candidate recruitment status in ATS."""
    return application_service.update_application_status(
        db=db,
        application_id=application_id,
        payload=payload,
        user=current_user
    )


@router.post("/save-job/{job_id}")
def toggle_save_job(
    job_id: int,
    current_user: User = Depends(require_role(["job_seeker", "admin"])),
    db: Session = Depends(get_db)
):
    """Toggles bookmarking a job for later reference."""
    return application_service.toggle_save_job(db=db, user_id=current_user.id, job_id=job_id)


@router.get("/saved-jobs")
def get_saved_jobs(
    current_user: User = Depends(require_role(["job_seeker", "admin"])),
    db: Session = Depends(get_db)
):
    """Returns all jobs saved / bookmarked by the authenticated candidate."""
    return application_service.get_saved_jobs(db=db, user_id=current_user.id)
