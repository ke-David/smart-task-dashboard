
def test_get_boards(client):
    response = client.get("/boards")

    assert response.status_code == 200

    data = response.get_json()
    assert isinstance(data, list)

    if len(data) > 0:
        board = data[0]
        assert "id" in board
        assert "title" in board
        assert "position" in board

