# tests for user model
from model.user import User 

def test_create_user():
    user = User(name = "Test User", email = "test_user@example.com")

    assert user.name == "Test User"
    assert user.email == "test_user@example.com"
    assert user.id is None  # Assuming id is None until saved to a database

def test_user_has_no_id_before_saving():
    user = User(name = "Test User", email = "test_user@example.com")

    assert user.id is None  # User should not have an id before being saved to the database