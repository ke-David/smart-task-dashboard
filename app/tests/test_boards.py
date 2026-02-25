
def test_add_board_success(client):
    response = client.post("/boards", json={"title": "Test Board"})
    assert response.status_code == 201


def test_add_board_empty_title(client):
    response = client.post("/boards", json={"title": ""})
    assert response.status_code == 400


def test_delete_board_not_found(client):
    response = client.delete("/boards/9999")
    assert response.status_code == 404


def test_get_boards_with_tasks(client):
    response = client.get("/boardTasks")

    assert response.status_code == 200

    boards = response.get_json()
    assert isinstance(boards, list)

    if len(boards) > 0:
        board = boards[0]
        assert "id" in board
        assert "title" in board
        assert "tasks" in board
        assert isinstance(board["tasks"], list)

