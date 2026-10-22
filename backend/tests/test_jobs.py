def test_list_jobs(client, test_job):
    res = client.get("/api/jobs")
    assert res.status_code == 200
    data = res.json()
    assert "total" in data
    assert "jobs" in data
    assert len(data["jobs"]) >= 1

def test_search_jobs_by_keyword(client, test_job):
    res = client.get("/api/jobs?q=Backend")
    assert res.status_code == 200
    data = res.json()
    titles = [j["title"] for j in data["jobs"]]
    assert any("Backend" in t for t in titles)

def test_filter_jobs_by_location_and_type(client, test_job):
    res = client.get("/api/jobs?location=Bengaluru&workplace_type=Remote")
    assert res.status_code == 200
    data = res.json()
    assert len(data["jobs"]) >= 1

def test_get_job_detail_and_view_count(client, test_job):
    initial_views = test_job.views_count or 0
    res = client.get(f"/api/jobs/{test_job.id}")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == test_job.id
    assert data["views_count"] == initial_views + 1

def test_create_job_as_employer(client, employer_token):
    headers = {"Authorization": f"Bearer {employer_token}"}
    payload = {
        "title": "React 19 Frontend Lead",
        "company_name": "InnovateTech Inc",
        "category": "Software & Technology",
        "designation": "Tech Lead",
        "location": "Remote",
        "workplace_type": "Remote",
        "job_type": "Full-time",
        "experience_level": "Lead",
        "min_salary": 2000000,
        "max_salary": 3200000,
        "salary_currency": "INR",
        "description": "Leading modern React web application architecture.",
        "skills_required": "React, TypeScript, Redux, Performance Optimization",
        "vacancies": 2
    }
    res = client.post("/api/jobs", json=payload, headers=headers)
    assert res.status_code == 201
    created = res.json()
    assert created["title"] == "React 19 Frontend Lead"
    assert created["id"] is not None

def test_candidate_cannot_create_job(client, candidate_token):
    headers = {"Authorization": f"Bearer {candidate_token}"}
    payload = {
        "title": "Unauthorized Job",
        "company_name": "Fake Corp",
        "category": "Tech",
        "location": "Delhi",
        "description": "Should fail"
    }
    res = client.post("/api/jobs", json=payload, headers=headers)
    assert res.status_code == 403
