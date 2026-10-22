from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.job import Job
from app.models.user import User

router = APIRouter(prefix="/reference", tags=["Reference & Master Data"])

CATEGORIES = [
    {"id": 1, "name": "Software & Technology", "icon": "💻", "count": 120},
    {"id": 2, "name": "Finance & Banking", "icon": "💳", "count": 45},
    {"id": 3, "name": "Healthcare & Medicine", "icon": "🏥", "count": 38},
    {"id": 4, "name": "Marketing & Sales", "icon": "📈", "count": 62},
    {"id": 5, "name": "Human Resources (HR)", "icon": "👥", "count": 29},
    {"id": 6, "name": "Design & Creative", "icon": "🎨", "count": 34},
    {"id": 7, "name": "Operations & Logistics", "icon": "📦", "count": 51},
    {"id": 8, "name": "Customer Support", "icon": "🎧", "count": 40}
]

CITIES = [
    "Bengaluru", "Mumbai", "Delhi NCR", "Hyderabad", 
    "Pune", "Chennai", "Kolkata", "Ahmedabad", "Remote"
]

@router.get("/categories")
def get_categories():
    return CATEGORIES

@router.get("/cities")
def get_cities():
    return CITIES

@router.get("/stats")
def get_public_stats(db: Session = Depends(get_db)):
    active_jobs = db.query(Job).filter(Job.is_active == True).count()
    companies = db.query(User).filter(User.role == "employer").count()
    candidates = db.query(User).filter(User.role == "job_seeker").count()
    
    return {
        "active_jobs": max(active_jobs, 15),
        "companies": max(companies, 8),
        "candidates": max(candidates, 50),
        "placement_rate": "94%"
    }
