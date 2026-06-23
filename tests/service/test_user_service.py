import pytest
from service.user_service import validate_create_user, create_user_service

def test_returns_errors_when_name_and_email_are_invalid():
    assert validate_create_user(name="", email=" ") == ["Name is required.", "Email must contain @"]

def test_returns_empty_list_when_name_and_email_are_valid():
    assert validate_create_user(name="Test User", email="test@example.com") == []

def test_create_user_service_returns_id_on_success(mocker):
    mocker.patch("service.user_service.create_user", return_value=1)

    result = create_user_service(name="Test User", email="test@example.com")

    assert result == {"id": 1}
