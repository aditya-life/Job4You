from sqlalchemy.orm import Session
from app.models.user import User
from app.models.job import Job
from app.services.auth_service import get_password_hash

def seed_initial_data(db: Session):
    # Check if admin exists
    admin = db.query(User).filter(User.email == "admin@job4you.com").first()
    if not admin:
        admin = User(
            name="Super Admin",
            email="admin@job4you.com",
            phone="+919999999999",
            password_hash=get_password_hash("Admin@123"),
            role="admin",
            is_verified=True,
            is_active=True
        )
        db.add(admin)

    # Check if demo employer exists
    employer = db.query(User).filter(User.email == "hr@techcorp.com").first()
    if not employer:
        employer = User(
            name="Priya Sharma",
            email="hr@techcorp.com",
            phone="+919876543210",
            password_hash=get_password_hash("Employer@123"),
            role="employer",
            company_name="TechCorp Solutions",
            company_website="https://techcorp.example.com",
            company_size="100-500",
            city="Bengaluru",
            is_verified=True,
            is_active=True
        )
        db.add(employer)
        db.commit()
        db.refresh(employer)

        # Seed sample jobs
        sample_jobs = [
            Job(
                employer_id=employer.id,
                title="Senior Full Stack Python Developer",
                company_name="TechCorp Solutions",
                category="Software & Technology",
                designation="Full Stack Engineer",
                location="Bengaluru",
                workplace_type="Hybrid",
                job_type="Full-time",
                experience_level="Senior",
                min_salary=1800000,
                max_salary=2800000,
                salary_currency="INR",
                description="We are seeking an experienced Full Stack Python/FastAPI and React developer to build high-scale web platforms.",
                requirements="5+ years in Python, FastAPI/Django, React, MySQL/PostgreSQL, Docker, and REST APIs.",
                benefits="Health Insurance, Flexible Hours, Stock Options, Learning Budget.",
                skills_required="Python, FastAPI, React, MySQL, Docker, Redis",
                vacancies=3
            ),
            Job(
                employer_id=employer.id,
                title="Frontend React Engineer (Next.js)",
                company_name="TechCorp Solutions",
                category="Software & Technology",
                designation="Frontend Developer",
                location="Remote",
                workplace_type="Remote",
                job_type="Full-time",
                experience_level="Mid-Level",
                min_salary=1200000,
                max_salary=1800000,
                salary_currency="INR",
                description="Join our core UI engineering team to build sleek, accessible, responsive dashboards using React 19 and Tailwind CSS.",
                requirements="3+ years in React, Tailwind CSS, TypeScript or JavaScript, State Management.",
                benefits="100% Remote, Home Office Stipend, Annual Team Retreats.",
                skills_required="React, Tailwind CSS, JavaScript, REST API, HTML5",
                vacancies=2
            ),
            Job(
                employer_id=employer.id,
                title="Data Analyst & SQL Specialist",
                company_name="TechCorp Solutions",
                category="Finance & Banking",
                designation="Data Analyst",
                location="Mumbai",
                workplace_type="On-Site",
                job_type="Full-time",
                experience_level="Junior",
                min_salary=600000,
                max_salary=900000,
                salary_currency="INR",
                description="Analyze large-scale transactional datasets, create executive dashboards, and optimize SQL querying pipelines.",
                requirements="1-2 years experience with MySQL, Python, Pandas, Tableau/PowerBI.",
                benefits="Quarterly Performance Bonus, Comprehensive Healthcare.",
                skills_required="SQL, Python, Excel, PowerBI, Data Visualization",
                vacancies=1
            )
        ]
        db.add_all(sample_jobs)

    # Check if demo candidate exists
    candidate = db.query(User).filter(User.email == "rahul.verma@example.com").first()
    if not candidate:
        candidate = User(
            name="Rahul Verma",
            email="rahul.verma@example.com",
            phone="+919812345678",
            password_hash=get_password_hash("Candidate@123"),
            role="job_seeker",
            headline="Software Engineer | Python & React Specialist",
            bio="Passionate engineer with experience building web applications and automation engines.",
            skills="Python, React, FastAPI, SQL, Git",
            experience_years=2,
            city="Delhi NCR",
            is_verified=True,
            is_active=True
        )
        db.add(candidate)

    db.commit()
