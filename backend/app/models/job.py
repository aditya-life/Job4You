from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    employer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    title = Column(String(200), index=True, nullable=False)
    company_name = Column(String(200), nullable=False)
    category = Column(String(100), index=True, nullable=False)
    designation = Column(String(100), nullable=True)
    location = Column(String(150), index=True, nullable=False)
    
    workplace_type = Column(String(50), default="Remote")  # Remote, On-Site, Hybrid
    job_type = Column(String(50), default="Full-time")      # Full-time, Part-time, Contract, Internship
    experience_level = Column(String(50), default="Mid-Level") # Fresher, Junior, Mid-Level, Senior, Lead
    
    min_salary = Column(Float, nullable=True)
    max_salary = Column(Float, nullable=True)
    salary_currency = Column(String(10), default="INR")
    salary_period = Column(String(20), default="Per Annum")
    
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=True)
    benefits = Column(Text, nullable=True)
    skills_required = Column(String(500), nullable=True)
    vacancies = Column(Integer, default=1)
    
    is_active = Column(Boolean, default=True)
    views_count = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    employer = relationship("User", back_populates="posted_jobs")
    applications = relationship("JobApplication", back_populates="job", cascade="all, delete-orphan")
    saved_by = relationship("SavedJob", back_populates="job", cascade="all, delete-orphan")
