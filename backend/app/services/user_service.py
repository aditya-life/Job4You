"""
Job4You User & Profile Service.

Handles user profile lookups, talent database querying for employers,
and dashboard metric computations.
"""

from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_
from app.models.user import User
from app.models.job import Job
from app.models.application import JobApplication, SavedJob
from app.schemas.user import UserUpdate
from app.core.exceptions import NotFoundException
from app.core.constants import UserRole


class UserService:
    """Service class for user profiles, dashboard metrics, and talent sourcing."""

    @staticmethod
    def get_by_id(db: Session, user_id: int) -> User:
        """Fetches user by primary key ID."""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise NotFoundException(resource_name="User", identifier=user_id)
        return user

    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        """Fetches user by email address."""
        return db.query(User).filter(User.email == email.strip().lower()).first()

    @staticmethod
    def get_by_phone(db: Session, phone: str) -> Optional[User]:
        """Fetches user by phone number."""
        return db.query(User).filter(User.phone == phone.strip()).first()

    @staticmethod
    def update_profile(db: Session, user: User, payload: UserUpdate) -> User:
        """Updates user profile attributes."""
        update_data = payload.dict(exclude_unset=True)
        for field, val in update_data.items():
            setattr(user, field, val)

        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def search_candidates(
        db: Session,
        q: Optional[str] = None,
        city: Optional[str] = None,
        min_experience: Optional[int] = None,
        limit: int = 50,
    ) -> List[User]:
        """Allows recruiters to search active candidates by keyword, city, or experience."""
        query = db.query(User).filter(User.role == "job_seeker", User.is_active == True)

        if q:
            search_pat = f"%{q.strip()}%"
            query = query.filter(
                or_(
                    User.name.ilike(search_pat),
                    User.headline.ilike(search_pat),
                    User.skills.ilike(search_pat),
                    User.bio.ilike(search_pat),
                )
            )
        if city:
            query = query.filter(User.city.ilike(f"%{city.strip()}%"))
        if min_experience is not None:
            query = query.filter(User.experience_years >= min_experience)

        return query.limit(limit).all()

    @staticmethod
    def get_employer_dashboard_stats(db: Session, current_user: User) -> Dict[str, Any]:
        """Computes aggregate analytics for the recruiter dashboard."""
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
                JobApplication.status == "Shortlisted",
            ).count()
            hired_count = db.query(JobApplication).filter(
                JobApplication.job_id.in_(my_job_ids),
                JobApplication.status == "Hired",
            ).count()

        return {
            "employer_name": current_user.name,
            "company_name": current_user.company_name,
            "total_jobs": total_jobs,
            "active_jobs": active_jobs,
            "total_applicants": total_applicants,
            "shortlisted_count": shortlisted_count,
            "hired_count": hired_count,
        }

    @staticmethod
    def get_candidate_dashboard_stats(db: Session, current_user: User) -> Dict[str, Any]:
        """Computes candidate application tracking statistics."""
        total_applied = db.query(JobApplication).filter(JobApplication.user_id == current_user.id).count()
        shortlisted = db.query(JobApplication).filter(
            JobApplication.user_id == current_user.id,
            JobApplication.status == "Shortlisted",
        ).count()
        saved_count = db.query(SavedJob).filter(SavedJob.user_id == current_user.id).count()

        return {
            "candidate_name": current_user.name,
            "headline": current_user.headline,
            "total_applied": total_applied,
            "shortlisted": shortlisted,
            "saved_jobs_count": saved_count,
        }


# Export singleton helper instance
user_service = UserService()
