def test_get_categories(client):
    res = client.get("/api/reference/categories")
    assert res.status_code == 200
    categories = res.json()
    assert isinstance(categories, list)
    assert len(categories) >= 5
    assert any("Technology" in c["name"] for c in categories)

def test_get_cities(client):
    res = client.get("/api/reference/cities")
    assert res.status_code == 200
    cities = res.json()
    assert "Bengaluru" in cities
    assert "Remote" in cities

def test_get_public_stats(client):
    res = client.get("/api/reference/stats")
    assert res.status_code == 200
    stats = res.json()
    assert "active_jobs" in stats
    assert "companies" in stats
    assert "candidates" in stats

def test_root_and_health_endpoints(client):
    root_res = client.get("/")
    assert root_res.status_code == 200
    assert root_res.json()["app"] == "Job4You"

    health_res = client.get("/health")
    assert health_res.status_code == 200
    assert health_res.json()["status"] == "healthy"
