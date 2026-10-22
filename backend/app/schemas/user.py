from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    role: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    headline: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[str] = None
    experience_years: Optional[int] = None
    current_salary: Optional[str] = None
    expected_salary: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = "India"
    
    # Employer specific
    company_name: Optional[str] = None
    company_website: Optional[str] = None
    company_size: Optional[str] = None
    company_address: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    role: str
    is_verified: bool
    headline: Optional[str] = None
    bio: Optional[str] = None
    resume_url: Optional[str] = None
    skills: Optional[str] = None
    experience_years: Optional[int] = 0
    city: Optional[str] = None
    company_name: Optional[str] = None
    company_website: Optional[str] = None
    company_logo: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
