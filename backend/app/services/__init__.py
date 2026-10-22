"""
Job4You Services Layer Package.

Provides high-level business logic, database operations, cryptography,
and external integration adapters.
"""

from app.services.auth_service import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
    require_role,
)
from app.services.otp_service import otp_service
from app.services.job_service import job_service, JobService
from app.services.application_service import application_service, ApplicationService
from app.services.user_service import user_service, UserService

__all__ = [
    "verify_password",
    "get_password_hash",
    "create_access_token",
    "get_current_user",
    "require_role",
    "otp_service",
    "job_service",
    "JobService",
    "application_service",
    "ApplicationService",
    "user_service",
    "UserService",
]
