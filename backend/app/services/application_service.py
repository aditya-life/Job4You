"""
Job4You Job Application & ATS Service.

Encapsulates application submission, duplicate checks, applicant review,
ATS status transitions, and job bookmarking.
"""

from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.application import JobApplication, SavedJob
from app.models.job import Job
from app.models.user import User
from app.schemas.application import ApplyRequest, StatusUpdateRequest
from app.core.exceptions import NotFoundException, BadRequestException, ForbiddenException
from app.core.constants import UserRole


class ApplicationService:
    """Service class for candidate applications and recruiter ATS workflow."""

    @staticmethod
    def apply_to_job(db: Session, user: User, payload: ApplyRequest) -> JobApplication:
        """
        Submits a job application for a candidate.
        Ensures the job exists and is active, and prevents duplicate applications.
        """
        job = db.query(Job).filter(Job.id == payload.job_id, Job.is_active == True).first()
        if not job:
            raise NotFoundException("Job posting not found or no longer active")

        # Check for duplicate submission
        existing = db.query(JobApplication).filter(
            JobApplication.job_id == payload.job_id,
            JobApplication.user_id == user.id,
        ).first()

        if existing:
            raise BadRequestException("You have already applied for this position")

        resume_link = payload.resume_url or user.resume_url
        application = JobApplication(
            job_id=payload.job_id,
            user_id=user.id,
            cover_letter=payload.cover_letter,
            resume_url=resume_link,
            status="Applied",
        )
        db.add(application)
        db.commit()
        db.refresh(application)
        return application

    @staticmethod
    def get_my_applications(db: Session, user_id: int) -> List[JobApplication]:
        """Returns all applications submitted by a candidate, ordered chronologically."""
        return (
            db.query(JobApplication)
            .filter(JobApplication.user_id == user_id)
            .order_by(desc(JobApplication.created_at))
            .all()
        )

    @staticmethod
    def get_job_applicants(db: Session, job_id: int, user: User) -> List[JobApplication]:
        """
        Returns all applicants for a specific job. Enforces employer ownership or admin role.
        """
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise NotFoundException("Job not found")

        if job.employer_id != user.id and user.role != "admin" and user.role != UserRole.ADMIN:
            raise ForbiddenException("Permission denied")

        return (
            db.query(JobApplication)
            .filter(JobApplication.job_id == job_id)
            .order_by(desc(JobApplication.created_at))
            .all()
        )

    @staticmethod
    def update_application_status(
        db: Session,
        application_id: int,
        payload: StatusUpdateRequest,
        user: User,
    ) -> JobApplication:
        """
        Updates recruitment stage (reviewing, shortlisted, interview, rejected, hired).
        Enforces that the updater is the employer who posted the job or an administrator.
        """
        app_record = db.query(JobApplication).filter(JobApplication.id == application_id).first()
        if not app_record:
            raise NotFoundException("Application record not found")

        job = db.query(Job).filter(Job.id == app_record.job_id).first()
        if not job:
            raise NotFoundException("Associated job not found")

        if job.employer_id != user.id and user.role != "admin" and user.role != UserRole.ADMIN:
            raise ForbiddenException("Permission denied")

        app_record.status = payload.status
        if payload.employer_notes is not None:
            app_record.employer_notes = payload.employer_notes

        db.commit()
        db.refresh(app_record)
        return app_record

    @staticmethod
    def toggle_save_job(db: Session, user_id: int, job_id: int) -> Dict[str, Any]:
        """Toggles bookmark/saved status of a job for a user."""
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise NotFoundException("Job not found")

        saved = db.query(SavedJob).filter(
            SavedJob.user_id == user_id,
            SavedJob.job_id == job_id,
        ).first()

        if saved:
            db.delete(saved)
            db.commit()
            return {"status": True, "saved": False, "message": "Job removed from saved list"}
        else:
            new_save = SavedJob(user_id=user_id, job_id=job_id)
            db.add(new_save)
            db.commit()
            return {"status": True, "saved": True, "message": "Job bookmarked successfully"}

    @staticmethod
    def get_saved_jobs(db: Session, user_id: int) -> List[Job]:
        """Returns all jobs bookmarked by the user."""
        saved_records = (
            db.query(SavedJob)
            .filter(SavedJob.user_id == user_id)
            .order_by(desc(SavedJob.created_at))
            .all()
        )
        return [record.job for record in saved_records]


# Export singleton helper instance
application_service = ApplicationService()
