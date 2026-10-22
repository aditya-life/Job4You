"""
Job4You Application Constants & Enums.

This module provides strongly-typed enumerations for user roles, job types,
workplace environments, and recruitment application statuses. Using these constants
prevents typo bugs and makes modifying or extending business workflows trivial.
"""

from enum import Enum


class UserRole(str, Enum):
    """Supported user roles in the Job4You platform."""
    JOB_SEEKER = "job_seeker"
    EMPLOYER = "employer"
    ADMIN = "admin"


class JobType(str, Enum):
    """Employment contract types."""
    FULL_TIME = "Full-time"
    PART_TIME = "Part-time"
    CONTRACT = "Contract"
    INTERNSHIP = "Internship"
    FREELANCE = "Freelance"


class WorkplaceType(str, Enum):
    """Workplace environment types."""
    REMOTE = "Remote"
    ON_SITE = "On-Site"
    HYBRID = "Hybrid"


class ExperienceLevel(str, Enum):
    """Candidate experience seniority levels."""
    FRESHER = "Fresher"
    JUNIOR = "Junior"
    MID_LEVEL = "Mid-Level"
    SENIOR = "Senior"
    LEAD = "Lead"


class ApplicationStatus(str, Enum):
    """Lifecycle statuses of a job application in the ATS."""
    APPLIED = "applied"
    REVIEWING = "reviewing"
    SHORTLISTED = "shortlisted"
    INTERVIEW = "interview"
    REJECTED = "rejected"
    HIRED = "hired"


class OTPPurpose(str, Enum):
    """Purposes for one-time password generation."""
    LOGIN = "login"
    REGISTER = "register"
    VERIFY_PHONE = "verify_phone"
    RESET_PASSWORD = "reset_password"
