

def create_board(client, title="Test Board"):
    response = client.post("/boards", json={"title": title})
    assert response.status_code == 201
    return response.get_json()


def test_add_task_success(client):
    board = create_board(client)
    response = client.post(
        "/tasks",
        json={
            "text": "Test task",
            "category": "Critical",
            "boardId": board["id"]
        }
    )
    print(response.get_json())

    assert response.status_code == 201
    data = response.get_json()
    assert data["text"] == "Test task"
    assert data["category"] == "Critical"
    assert data["completed"] is False
    assert "id" in data


def test_add_task_missing_body(client):
    response = client.post(
        "/tasks",
        data="",
        content_type="application/json"
    )
    assert response.status_code == 400


def test_add_task_empty_text(client):
    board = create_board(client)
    response = client.post("/tasks", json={
        "text": "",
        "category": "Critical",
        "boardId": board["id"]
    })
    assert response.status_code == 400


def test_add_task_missing_category(client):
    board = create_board(client)
    response = client.post("/tasks", json={
        "text": "Task",
        "boardId": board["id"]
    })
    assert response.status_code == 400


def test_add_task_missing_board_id(client):
    response = client.post("/tasks", json={
        "text": "Task",
        "category": "Critical"
    })
    assert response.status_code == 400


def test_update_task_success(client):
    board = create_board(client)
    create = client.post("/tasks", json={
        "text": "Task to update",
        "category": "Important",
        "boardId": board["id"]
    })
    task_id = create.get_json()["id"]

    response = client.put(f"/tasks/{task_id}", json={"completed": True})
    assert response.status_code == 200
    assert response.get_json()["message"] == "Task updated"


def test_update_task_missing_body(client):
    board = create_board(client)
    create = client.post("/tasks", json={
        "text": "Task to update",
        "category": "Important",
        "boardId": board["id"]
    })
    task_id = create.get_json()["id"]

    response = client.put(f"/tasks/{task_id}", json={})
    assert response.status_code == 400


def test_update_task_not_found(client):
    response = client.put("/tasks/9999", json={"completed": True})
    assert response.status_code == 404


def test_delete_task_success(client):
    board = create_board(client)
    create = client.post("/tasks", json={
        "text": "Task to delete",
        "category": "Moderate",
        "boardId": board["id"]
    })
    task_id = create.get_json()["id"]

    response = client.delete(f"/tasks/{task_id}")
    assert response.status_code == 200


def test_delete_task_not_found(client):
    response = client.delete("/tasks/9999")
    assert response.status_code == 404





    
