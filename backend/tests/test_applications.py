def test_apply_to_job_success(client, candidate_token, test_job):
    headers = {"Authorization": f"Bearer {candidate_token}"}
    payload = {
        "job_id": test_job.id,
        "cover_letter": "I am deeply passionate about backend engineering with Python and FastAPI.",
        "resume_url": "https://job4you.local/resumes/candidate.pdf"
    }
    res = client.post("/api/applications/apply", json=payload, headers=headers)
    assert res.status_code == 201
    data = res.json()
    assert data["job_id"] == test_job.id
    assert data["status"] == "Applied"

def test_prevent_duplicate_application(client, candidate_token, test_job):
    headers = {"Authorization": f"Bearer {candidate_token}"}
    payload = {
        "job_id": test_job.id,
        "cover_letter": "Duplicate attempt"
    }
    res = client.post("/api/applications/apply", json=payload, headers=headers)
    assert res.status_code == 400
    assert "already applied" in res.json()["detail"].lower()

def test_get_my_applications(client, candidate_token):
    headers = {"Authorization": f"Bearer {candidate_token}"}
    res = client.get("/api/applications/my-applications", headers=headers)
    assert res.status_code == 200
    apps = res.json()
    assert len(apps) >= 1
    assert apps[0]["status"] in ["Applied", "Under Review", "Shortlisted"]

def test_employer_update_application_status(client, employer_token, test_job):
    # Fetch applicants for the job
    headers = {"Authorization": f"Bearer {employer_token}"}
    res = client.get(f"/api/applications/job/{test_job.id}", headers=headers)
    assert res.status_code == 200
    applicants = res.json()
    assert len(applicants) >= 1
    app_id = applicants[0]["id"]

    # Update status to Shortlisted
    status_payload = {
        "status": "Shortlisted",
        "employer_notes": "Strong Python candidate, moving to technical round."
    }
    update_res = client.put(f"/api/applications/{app_id}/status", json=status_payload, headers=headers)
    assert update_res.status_code == 200
    updated = update_res.json()
    assert updated["status"] == "Shortlisted"
    assert "technical round" in updated["employer_notes"]

def test_bookmark_and_retrieve_saved_jobs(client, candidate_token, test_job):
    headers = {"Authorization": f"Bearer {candidate_token}"}
    # Bookmark job
    save_res = client.post(f"/api/applications/save-job/{test_job.id}", headers=headers)
    assert save_res.status_code == 200
    assert save_res.json()["saved"] is True

    # Retrieve saved jobs
    list_res = client.get("/api/applications/saved-jobs", headers=headers)
    assert list_res.status_code == 200
    saved = list_res.json()
    assert any(j["id"] == test_job.id for j in saved)

    # Toggle un-bookmark
    unsave_res = client.post(f"/api/applications/save-job/{test_job.id}", headers=headers)
    assert unsave_res.status_code == 200
    assert unsave_res.json()["saved"] is False
