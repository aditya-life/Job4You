"""
Job4You Employer Management API Router.

Provides recruiter dashboard statistics, employer's posted jobs,
and candidate talent search.
"""

from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models.job import Job
from app.models.application import JobApplication
from app.models.user import User
from app.schemas.job import JobResponse
from app.schemas.user import UserResponse
from app.services.auth_service import require_role
from app.services.user_service import user_service

router = APIRouter(prefix="/employer", tags=["Employer Management"])


@router.get("/dashboard")
def get_employer_dashboard_stats(
    current_user: User = Depends(require_role(["employer", "admin"])),
    db: Session = Depends(get_db)
):
    """Returns analytics for employer's posted jobs and applicant status metrics."""
    return user_service.get_employer_dashboard_stats(db=db, current_user=current_user)


@router.get("/my-jobs", response_model=List[JobResponse])
def get_my_posted_jobs(
    current_user: User = Depends(require_role(["employer", "admin"])),
    db: Session = Depends(get_db)
):
    """Returns all vacancies posted by the authenticated employer with live applicant counts."""
    jobs = (
        db.query(Job)
        .filter(Job.employer_id == current_user.id)
        .order_by(desc(Job.created_at))
        .all()
    )
    result = []
    for j in jobs:
        count = db.query(JobApplication).filter(JobApplication.job_id == j.id).count()
        j_dict = JobResponse.from_orm(j)
        j_dict.applications_count = count
        result.append(j_dict)
    return result


@router.get("/candidates", response_model=List[UserResponse])
def search_candidate_talent(
    q: Optional[str] = Query(None, description="Search skills, title, bio"),
    city: Optional[str] = Query(None),
    min_experience: Optional[int] = Query(None),
    current_user: User = Depends(require_role(["employer", "admin"])),
    db: Session = Depends(get_db)
):
    """Allows recruiters to discover and source active candidate profiles."""
    return user_service.search_candidates(
        db=db,
        q=q,
        city=city,
        min_experience=min_experience,
        limit=50
    )
