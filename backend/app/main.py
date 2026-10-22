from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed import seed_initial_data
from app.routers import auth, jobs, applications, employer, employee, reference

# Initialize Database Schema
Base.metadata.create_all(bind=engine)

# Seed initial master & demo data
try:
    with SessionLocal() as db:
        seed_initial_data(db)
except Exception as e:
    print(f"Seed notice: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Enterprise Job Portal Platform API (Python FastAPI + MySQL / SQLite) with Demo OTP Bypass & Role-Based Access Control.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(jobs.router, prefix=settings.API_V1_STR)
app.include_router(applications.router, prefix=settings.API_V1_STR)
app.include_router(employer.router, prefix=settings.API_V1_STR)
app.include_router(employee.router, prefix=settings.API_V1_STR)
app.include_router(reference.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "docs": "/docs",
        "demo_otp_bypass": settings.BYPASS_OTP,
        "demo_otp_code": settings.DEMO_OTP if settings.BYPASS_OTP else None
    }

@app.get("/health")
def healthcheck():
    return {"status": "healthy", "service": settings.PROJECT_NAME}
