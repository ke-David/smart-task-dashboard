
def test_get_stats(client):
    response = client.get("/stats")
    assert response.status_code == 200

    data = response.get_json()
    assert "tasks_by_category" in data
    assert "completed_vs_active" in data
    assert "timeline" in data


def test_get_summary(client):
    response = client.get("/sum")
    assert response.status_code == 200

    data = response.get_json()
    assert "total" in data
    assert "completed" in data
    assert "active" in data
    assert "critical" in data
    assert "completionRate" in data


def test_get_insights(client):
    response = client.get("/insights")
    assert response.status_code == 200

    data = response.get_json()
    assert "heavyBoard" in data
    assert "active_count" in data
    assert "dominantCategory" in data
    assert "percentage" in data
    assert "avg" in data