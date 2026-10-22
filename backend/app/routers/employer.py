from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_
from typing import Optional, List
from app.database import get_db
from app.models.job import Job
from app.models.application import JobApplication
from app.models.user import User
from app.schemas.job import JobResponse
from app.schemas.user import UserResponse
from app.services.auth_service import require_role

router = APIRouter(prefix="/employer", tags=["Employer Management"])

@router.get("/dashboard")
def get_employer_dashboard_stats(
    current_user: User = Depends(require_role(["employer", "admin"])),
    db: Session = Depends(get_db)
):
    my_job_ids = [j.id for j in db.query(Job.id).filter(Job.employer_id == current_user.id).all()]
    total_jobs = len(my_job_ids)
    active_jobs = db.query(Job).filter(Job.employer_id == current_user.id, Job.is_active == True).count()
    
    total_applicants = 0
    shortlisted_count = 0
    hired_count = 0

    if my_job_ids:
        total_applicants = db.query(JobApplication).filter(JobApplication.job_id.in_(my_job_ids)).count()
        shortlisted_count = db.query(JobApplication).filter(
            JobApplication.job_id.in_(my_job_ids),
            JobApplication.status == "Shortlisted"
        ).count()
        hired_count = db.query(JobApplication).filter(
            JobApplication.job_id.in_(my_job_ids),
            JobApplication.status == "Hired"
        ).count()

    return {
        "employer_name": current_user.name,
        "company_name": current_user.company_name,
        "total_jobs": total_jobs,
        "active_jobs": active_jobs,
        "total_applicants": total_applicants,
        "shortlisted_count": shortlisted_count,
        "hired_count": hired_count
    }

@router.get("/my-jobs", response_model=List[JobResponse])
def get_my_posted_jobs(
    current_user: User = Depends(require_role(["employer", "admin"])),
    db: Session = Depends(get_db)
):
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
    query = db.query(User).filter(User.role == "job_seeker", User.is_active == True)

    if q:
        query = query.filter(
            or_(
                User.name.ilike(f"%{q}%"),
                User.headline.ilike(f"%{q}%"),
                User.skills.ilike(f"%{q}%"),
                User.bio.ilike(f"%{q}%")
            )
        )
    if city:
        query = query.filter(User.city.ilike(f"%{city}%"))
    if min_experience is not None:
        query = query.filter(User.experience_years >= min_experience)

    candidates = query.limit(50).all()
    return candidates
