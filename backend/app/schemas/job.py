from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class JobBase(BaseModel):
    title: str
    company_name: str
    category: str
    designation: Optional[str] = None
    location: str
    workplace_type: str = "Remote"
    job_type: str = "Full-time"
    experience_level: str = "Mid-Level"
    min_salary: Optional[float] = None
    max_salary: Optional[float] = None
    salary_currency: str = "INR"
    description: str
    requirements: Optional[str] = None
    benefits: Optional[str] = None
    skills_required: Optional[str] = None
    vacancies: int = 1

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    workplace_type: Optional[str] = None
    job_type: Optional[str] = None
    experience_level: Optional[str] = None
    min_salary: Optional[float] = None
    max_salary: Optional[float] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    benefits: Optional[str] = None
    skills_required: Optional[str] = None
    vacancies: Optional[int] = None
    is_active: Optional[bool] = None

class JobResponse(JobBase):
    id: int
    employer_id: int
    is_active: bool
    views_count: int
    created_at: datetime
    updated_at: datetime
    applications_count: Optional[int] = 0

    class Config:
        from_attributes = True

class JobListResponse(BaseModel):
    total: int
    page: int
    limit: int
    jobs: List[JobResponse]
