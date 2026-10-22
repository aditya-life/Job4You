import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from app.main import app
from app.models.user import User
from app.models.job import Job
from app.services.auth_service import get_password_hash, create_access_token

# In-memory SQLite for isolated, fast, reproducible tests
TEST_DATABASE_URL = "sqlite:///./test_job4you.db"
test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)
    import os
    if os.path.exists("./test_job4you.db"):
        os.remove("./test_job4you.db")

@pytest.fixture
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture
def test_candidate(db_session):
    user = db_session.query(User).filter(User.email == "test.candidate@job4you.com").first()
    if not user:
        user = User(
            name="Test Candidate",
            email="test.candidate@job4you.com",
            phone="+919111122222",
            password_hash=get_password_hash("Candidate@123"),
            role="job_seeker",
            headline="Python & React Specialist",
            skills="Python, React, SQL",
            is_verified=True,
            is_active=True
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
    return user

@pytest.fixture
def candidate_token(test_candidate):
    return create_access_token({"sub": str(test_candidate.id), "role": test_candidate.role})

@pytest.fixture
def test_employer(db_session):
    user = db_session.query(User).filter(User.email == "test.employer@job4you.com").first()
    if not user:
        user = User(
            name="Test Recruiter",
            email="test.employer@job4you.com",
            phone="+919333344444",
            password_hash=get_password_hash("Employer@123"),
            role="employer",
            company_name="InnovateTech Inc",
            company_website="https://innovatetech.example.com",
            city="Bengaluru",
            is_verified=True,
            is_active=True
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
    return user

@pytest.fixture
def employer_token(test_employer):
    return create_access_token({"sub": str(test_employer.id), "role": test_employer.role})

@pytest.fixture
def test_job(db_session, test_employer):
    job = db_session.query(Job).filter(Job.employer_id == test_employer.id).first()
    if not job:
        job = Job(
            employer_id=test_employer.id,
            title="Senior Backend Python Engineer",
            company_name=test_employer.company_name,
            category="Software & Technology",
            location="Bengaluru",
            workplace_type="Remote",
            job_type="Full-time",
            experience_level="Senior",
            min_salary=1500000,
            max_salary=2500000,
            description="Build scalable microservices and APIs.",
            skills_required="Python, FastAPI, SQL, Docker",
            is_active=True
        )
        db_session.add(job)
        db_session.commit()
        db_session.refresh(job)
    return job
