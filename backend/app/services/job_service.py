"""
Job4You Job Domain Service.

Encapsulates all database querying, search filtering, and CRUD operations
for job vacancies. Separating business logic from HTTP route handlers ensures
that modifying search rules, pagination, or verification checks is straightforward
and does not risk breaking HTTP controller routing.
"""

from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from app.models.job import Job
from app.models.application import JobApplication
from app.models.user import User
from app.schemas.job import JobCreate, JobUpdate, JobResponse
from app.core.exceptions import NotFoundException, ForbiddenException
from app.core.constants import UserRole


class JobService:
    """Service class for job vacancies management."""

    @staticmethod
    def get_jobs(
        db: Session,
        q: Optional[str] = None,
        category: Optional[str] = None,
        location: Optional[str] = None,
        workplace_type: Optional[str] = None,
        job_type: Optional[str] = None,
        experience_level: Optional[str] = None,
        min_salary: Optional[float] = None,
        page: int = 1,
        limit: int = 10,
    ) -> Dict[str, Any]:
        """
        Retrieves a paginated list of active jobs with flexible search & filtering.
        """
        query = db.query(Job).filter(Job.is_active == True)

        if q:
            search_pattern = f"%{q.strip()}%"
            query = query.filter(
                or_(
                    Job.title.ilike(search_pattern),
                    Job.company_name.ilike(search_pattern),
                    Job.skills_required.ilike(search_pattern),
                    Job.description.ilike(search_pattern),
                )
            )

        if category:
            query = query.filter(Job.category.ilike(f"%{category.strip()}%"))
        if location:
            query = query.filter(Job.location.ilike(f"%{location.strip()}%"))
        if workplace_type:
            query = query.filter(Job.workplace_type.ilike(workplace_type.strip()))
        if job_type:
            query = query.filter(Job.job_type.ilike(job_type.strip()))
        if experience_level:
            query = query.filter(Job.experience_level.ilike(experience_level.strip()))
        if min_salary is not None:
            query = query.filter(Job.min_salary >= min_salary)

        total = query.count()
        offset = (page - 1) * limit
        jobs = query.order_by(desc(Job.created_at)).offset(offset).limit(limit).all()

        result_jobs = []
        for job in jobs:
            count = db.query(JobApplication).filter(JobApplication.job_id == job.id).count()
            job_dto = JobResponse.from_orm(job)
            job_dto.applications_count = count
            result_jobs.append(job_dto)

        return {
            "total": total,
            "page": page,
            "limit": limit,
            "jobs": result_jobs,
        }

    @staticmethod
    def get_job_by_id(db: Session, job_id: int, increment_views: bool = True) -> JobResponse:
        """
        Fetches a single job vacancy by ID.
        Raises NotFoundException if job does not exist.
        """
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise NotFoundException(resource_name="Job", identifier=job_id)

        if increment_views:
            job.views_count = (job.views_count or 0) + 1
            db.commit()
            db.refresh(job)

        count = db.query(JobApplication).filter(JobApplication.job_id == job.id).count()
        res = JobResponse.from_orm(job)
        res.applications_count = count
        return res

    @staticmethod
    def create_job(db: Session, employer_id: int, payload: JobCreate, current_user: Optional[User] = None) -> Job:
        """Creates a new job listing posted by an employer or admin."""
        company = payload.company_name
        if not company and current_user:
            company = current_user.company_name or "Confidential"

        job = Job(
            employer_id=employer_id,
            title=payload.title,
            company_name=company,
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
            vacancies=payload.vacancies,
            is_active=True,
        )
        db.add(job)
        db.commit()
        db.refresh(job)
        return job

    @staticmethod
    def update_job(db: Session, job_id: int, user: User, payload: JobUpdate) -> Job:
        """
        Updates an existing job listing. Enforces ownership: only the posting employer
        or a system administrator may modify the posting.
        """
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise NotFoundException(resource_name="Job", identifier=job_id)

        # RBAC ownership check
        if job.employer_id != user.id and user.role != "admin" and user.role != UserRole.ADMIN:
            raise ForbiddenException("Permission denied. You can only edit your own jobs.")

        update_data = payload.dict(exclude_unset=True)
        for field, val in update_data.items():
            setattr(job, field, val)

        db.commit()
        db.refresh(job)
        return job

    @staticmethod
    def delete_job(db: Session, job_id: int, user: User) -> Dict[str, Any]:
        """
        Deletes a job listing. Enforces ownership check.
        """
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise NotFoundException(resource_name="Job", identifier=job_id)

        # RBAC ownership check
        if job.employer_id != user.id and user.role != "admin" and user.role != UserRole.ADMIN:
            raise ForbiddenException("Permission denied")

        db.delete(job)
        db.commit()
        return {"status": True, "message": "Job deleted successfully"}


# Export singleton helper instance
job_service = JobService()
