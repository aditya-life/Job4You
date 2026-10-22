from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from typing import Optional
from app.database import get_db
from app.models.job import Job
from app.models.application import JobApplication
from app.models.user import User
from app.schemas.job import JobCreate, JobUpdate, JobResponse, JobListResponse
from app.services.auth_service import get_current_user, require_role

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
    query = db.query(Job).filter(Job.is_active == True)

    if q:
        search_filter = or_(
            Job.title.ilike(f"%{q}%"),
            Job.company_name.ilike(f"%{q}%"),
            Job.skills_required.ilike(f"%{q}%"),
            Job.description.ilike(f"%{q}%")
        )
        query = query.filter(search_filter)

    if category:
        query = query.filter(Job.category.ilike(f"%{category}%"))
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    if workplace_type:
        query = query.filter(Job.workplace_type.ilike(workplace_type))
    if job_type:
        query = query.filter(Job.job_type.ilike(job_type))
    if experience_level:
        query = query.filter(Job.experience_level.ilike(experience_level))
    if min_salary is not None:
        query = query.filter(Job.min_salary >= min_salary)

    total = query.count()
    offset = (page - 1) * limit
    jobs = query.order_by(desc(Job.created_at)).offset(offset).limit(limit).all()

    # Populate applications count
    result_jobs = []
    for job in jobs:
        count = db.query(JobApplication).filter(JobApplication.job_id == job.id).count()
        job_dict = JobResponse.from_orm(job)
        job_dict.applications_count = count
        result_jobs.append(job_dict)

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "jobs": result_jobs
    }

@router.get("/{job_id}", response_model=JobResponse)
def get_job_detail(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Increment view count
    job.views_count = (job.views_count or 0) + 1
    db.commit()

    count = db.query(JobApplication).filter(JobApplication.job_id == job.id).count()
    res = JobResponse.from_orm(job)
    res.applications_count = count
    return res

@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    payload: JobCreate,
    current_user: User = Depends(require_role(["employer", "admin"])),
    db: Session = Depends(get_db)
):
    job = Job(
        employer_id=current_user.id,
        title=payload.title,
        company_name=payload.company_name or current_user.company_name or "Confidential",
        category=payload.category,
        designation=payload.designation,
        location=payload.location,
        workplace_type=payload.workplace_type,
        job_type=payload.job_type,
        experience_level=payload.experience_level,
        min_salary=payload.min_salary,
        max_salary=payload.max_salary,
        salary_currency=payload.salary_currency,
        description=payload.description,
        requirements=payload.requirements,
        benefits=payload.benefits,
        skills_required=payload.skills_required,
        vacancies=payload.vacancies
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    payload: JobUpdate,
    current_user: User = Depends(require_role(["employer", "admin"])),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.employer_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Permission denied. You can only edit your own jobs.")

    update_data = payload.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(job, field, val)
    
    db.commit()
    db.refresh(job)
    return job

@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    current_user: User = Depends(require_role(["employer", "admin"])),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.employer_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")

    db.delete(job)
    db.commit()
    return {"status": True, "message": "Job deleted successfully"}
