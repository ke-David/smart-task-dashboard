import os
import tempfile
import pytest
from app.app import app, init_db


@pytest.fixture
def client():
    # this will create temporary DB file
    db_fd, db_path = tempfile.mkstemp()

    app.config["TESTING"] = True
    app.config["DATABASE"] = db_path

    with app.test_client() as client:
        # initialize schema inside test DB
        with app.app_context():
            init_db()

        yield client

    # cleanup
    os.close(db_fd)
    os.unlink(db_path)