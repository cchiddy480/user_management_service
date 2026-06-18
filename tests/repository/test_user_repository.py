# testing user repository
import pytest

def test_create_user_calls_add(mocker):
    mock_session = mocker.MagicMock() 
    
    mocker.patch('repository.user_repository.Session', return_value=mock_session) 

    from repository.user_repository import create_user

    user = create_user(name = "Test User", email = "test_user@example.com")

    