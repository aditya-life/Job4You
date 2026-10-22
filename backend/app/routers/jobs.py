"""
Job4You Job Vacancies API Router.

Provides HTTP controllers for listing, filtering, reading, creating,
updating, and deleting job postings. Business logic and database queries
are delegated to `app.services.job_service`.
"""

from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.job import JobCreate, JobUpdate, JobResponse, JobListResponse
from app.services.auth_service import require_role
from app.services.job_service import job_service

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("", response_model=JobListResponse)
def list_jobs(
    q: Optional[str] = Query(None, description="Search keyword in title, company, skills or description"),
    category: Optional[str] = Query(None, description="Filter by category"),
    location: Optional[str] = Query(None, description="Filter by city/state/location"),
    workplace_type: Optional[str] = Query(None, description="Remote, On-Site, Hybrid"),
    job_type: Optional[str] = Query(None, description="Full-time, Part-time, Contract, Internship"),
    experience_level: Optional[str] = Query(None, description="Fresher, Junior, Mid-Level, Senior, Lead"),
    min_salary: Optional[float] = Query(None, description="Minimum salary filter"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Retrieves paginated job listings with multi-attribute filtering."""
    return job_service.get_jobs(
        db=db,
        q=q,
        category=category,
        location=location,
        workplace_type=workplace_type,
        job_type=job_type,
        experience_level=experience_level,
        min_salary=min_salary,
        page=page,
        limit=limit,
    )


@router.get("/{job_id}", response_model=JobResponse)
def get_job_detail(job_id: int, db: Session = Depends(get_db)):
    """Fetches full job specifications and increments view count."""
    return job_service.get_job_by_id(db=db, job_id=job_id, increment_views=True)


@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    payload: JobCreate,
    current_user: User = Depends(require_role(["employer", "admin"])),
    db: Session = Depends(get_db)
):
    """Creates a new job listing posted by an authenticated employer or admin."""
    return job_service.create_job(
        db=db,
        employer_id=current_user.id,
        payload=payload,
        current_user=current_user
    )


@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    payload: JobUpdate,
    current_user: User = Depends(require_role(["employer", "admin"])),
    db: Session = Depends(get_db)
):
    """Updates an existing job listing (restricted to post owner or admin)."""
    return job_service.update_job(
        db=db,
        job_id=job_id,
        user=current_user,
        payload=payload
    )


@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    current_user: User = Depends(require_role(["employer", "admin"])),
    db: Session = Depends(get_db)
):
    """Deletes a job listing (restricted to post owner or admin)."""
    return job_service.delete_job(
        db=db,
        job_id=job_id,
        user=current_user
    )
