from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=True)
    phone = Column(String(30), unique=True, index=True, nullable=True)
    password_hash = Column(String(255), nullable=True)
    role = Column(String(50), default="job_seeker", nullable=False)  # job_seeker, employer, admin
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Candidate specific fields
    headline = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    resume_url = Column(String(500), nullable=True)
    skills = Column(Text, nullable=True)  # Comma separated or JSON string
    experience_years = Column(Integer, default=0)
    current_salary = Column(String(50), nullable=True)
    expected_salary = Column(String(50), nullable=True)
    
    # Employer specific fields
    company_name = Column(String(200), nullable=True)
    company_website = Column(String(255), nullable=True)
    company_size = Column(String(50), nullable=True)
    company_logo = Column(String(500), nullable=True)
    company_address = Column(Text, nullable=True)
    
    # Location
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    country = Column(String(100), default="India")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    posted_jobs = relationship("Job", back_populates="employer", cascade="all, delete-orphan")
    applications = relationship("JobApplication", back_populates="applicant", cascade="all, delete-orphan")
    saved_jobs = relationship("SavedJob", back_populates="user", cascade="all, delete-orphan")
