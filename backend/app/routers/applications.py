from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from app.database import get_db
from app.models.job import Job
from app.models.application import JobApplication, SavedJob
from app.models.user import User
from app.schemas.application import ApplyRequest, StatusUpdateRequest, ApplicationResponse
from app.services.auth_service import get_current_user, require_role

router = APIRouter(prefix="/applications", tags=["Applications & Saved Jobs"])

@router.post("/apply", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_to_job(
    payload: ApplyRequest,
    current_user: User = Depends(require_role(["job_seeker", "admin"])),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == payload.job_id, Job.is_active == True).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found or no longer active")

    # Check duplicate application
    existing = db.query(JobApplication).filter(
        JobApplication.job_id == payload.job_id,
        JobApplication.user_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied for this position")

    resume_link = payload.resume_url or current_user.resume_url
    app_record = JobApplication(
        job_id=payload.job_id,
        user_id=current_user.id,
        cover_letter=payload.cover_letter,
        resume_url=resume_link,
        status="Applied"
    )
    db.add(app_record)
    db.commit()
    db.refresh(app_record)
    return app_record

@router.get("/my-applications", response_model=List[ApplicationResponse])
def get_my_applications(
    current_user: User = Depends(require_role(["job_seeker", "admin"])),
    db: Session = Depends(get_db)
):
    apps = (
        db.query(JobApplication)
        .filter(JobApplication.user_id == current_user.id)
        .order_by(desc(JobApplication.created_at))
        .all()
    )
    return apps

@router.get("/job/{job_id}", response_model=List[ApplicationResponse])
def get_job_applicants(
    job_id: int,
    current_user: User = Depends(require_role(["employer", "admin"])),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.employer_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")

    apps = (
        db.query(JobApplication)
        .filter(JobApplication.job_id == job_id)
        .order_by(desc(JobApplication.created_at))
        .all()
    )
    return apps

@router.put("/{application_id}/status", response_model=ApplicationResponse)
def update_application_status(
    application_id: int,
    payload: StatusUpdateRequest,
    current_user: User = Depends(require_role(["employer", "admin"])),
    db: Session = Depends(get_db)
):
    app_record = db.query(JobApplication).filter(JobApplication.id == application_id).first()
    if not app_record:
        raise HTTPException(status_code=404, detail="Application record not found")

    job = db.query(Job).filter(Job.id == app_record.job_id).first()
    if job.employer_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")

    app_record.status = payload.status
    if payload.employer_notes is not None:
        app_record.employer_notes = payload.employer_notes

    db.commit()
    db.refresh(app_record)
    return app_record

@router.post("/save-job/{job_id}")
def toggle_save_job(
    job_id: int,
    current_user: User = Depends(require_role(["job_seeker", "admin"])),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    saved = db.query(SavedJob).filter(
        SavedJob.user_id == current_user.id,
        SavedJob.job_id == job_id
    ).first()

    if saved:
        db.delete(saved)
        db.commit()
        return {"status": True, "saved": False, "message": "Job removed from saved list"}
    else:
        new_save = SavedJob(user_id=current_user.id, job_id=job_id)
        db.add(new_save)
        db.commit()
        return {"status": True, "saved": True, "message": "Job bookmarked successfully"}

@router.get("/saved-jobs")
def get_saved_jobs(
    current_user: User = Depends(require_role(["job_seeker", "admin"])),
    db: Session = Depends(get_db)
):
    saved_records = (
        db.query(SavedJob)
        .filter(SavedJob.user_id == current_user.id)
        .order_by(desc(SavedJob.created_at))
        .all()
    )
    return [record.job for record in saved_records]
