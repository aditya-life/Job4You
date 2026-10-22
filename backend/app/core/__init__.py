"""
Job4You Core Architecture Package.
Contains configuration, database connectivity, security, exceptions, and constants.
"""

from app.core.constants import UserRole, JobType, WorkplaceType, ExperienceLevel, ApplicationStatus, OTPPurpose
from app.core.exceptions import (
    AppException,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
    ForbiddenException,
    ConflictException
)
from app.core.security import verify_password, get_password_hash, create_access_token, decode_access_token

__all__ = [
    "UserRole",
    "JobType",
    "WorkplaceType",
    "ExperienceLevel",
    "ApplicationStatus",
    "OTPPurpose",
    "AppException",
    "NotFoundException",
    "BadRequestException",
    "UnauthorizedException",
    "ForbiddenException",
    "ConflictException",
    "verify_password",
    "get_password_hash",
    "create_access_token",
    "decode_access_token",
]
