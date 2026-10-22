"""
Job4You Custom Domain & HTTP Exceptions.

Encapsulates standard HTTP error responses to provide clean, self-documenting,
and maintainable error handling throughout routers and services.
"""

from fastapi import HTTPException, status
from typing import Optional, Any


class AppException(HTTPException):
    """Base application exception."""
    def __init__(self, status_code: int, detail: str, headers: Optional[dict[str, Any]] = None):
        super().__init__(status_code=status_code, detail=detail, headers=headers)


class NotFoundException(AppException):
    """Raised when a requested resource (Job, User, Application) is not found."""
    def __init__(self, resource_name: str = "Resource", identifier: Any = None):
        detail = f"{resource_name} not found" if identifier is None else f"{resource_name} with ID '{identifier}' not found"
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class BadRequestException(AppException):
    """Raised on invalid client input or violation of business rules."""
    def __init__(self, detail: str):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)


class UnauthorizedException(AppException):
    """Raised when authentication credentials are missing, invalid, or expired."""
    def __init__(self, detail: str = "Could not validate credentials"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"}
        )


class ForbiddenException(AppException):
    """Raised when an authenticated user attempts an action outside their permissions (RBAC)."""
    def __init__(self, detail: str = "You do not have permission to perform this action"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class ConflictException(AppException):
    """Raised when an action conflicts with existing state (e.g., duplicate application, duplicate email)."""
    def __init__(self, detail: str):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)
