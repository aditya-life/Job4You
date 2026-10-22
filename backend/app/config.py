import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Job4You"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database Configuration (Supports MySQL and SQLite fallback)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./job4you.db"
    )
    # MySQL Example: mysql+pymysql://root:password@localhost:3306/job4you
    
    # JWT Auth Configuration
    SECRET_KEY: str = os.getenv("SECRET_KEY", "job4you-secure-enterprise-jwt-token-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # OTP Verification Configuration (Demo bypass vs Production)
    BYPASS_OTP: bool = os.getenv("BYPASS_OTP", "True").lower() in ("true", "1", "yes")
    DEMO_OTP: str = os.getenv("DEMO_OTP", "123456")
    OTP_EXPIRY_MINUTES: int = 5
    
    # CORS
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*"
    ]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
