# testing user repository
import pytest

def test_create_user_calls_add(mocker): # Test that create_user calls the add method on the session
    mock_session = mocker.MagicMock() # Create a mock session object to simulate the database session
    mock_session.__enter__.return_value = mock_session # Mock the context manager's __enter__ method to return the mock session
    
    mocker.patch('repository.user_repository.Session', return_value=mock_session) # Patch the Session class in the user

    from repository.user_repository import create_user 
    user = create_user(name = "Test User", email = "test_user@example.com")

    mock_session.add.assert_called_once() # Assert that the add method was called once with the user 
    mock_session.commit.assert_called_once() # Assert that the commit method was called once to save the user to the database
    mock_session.__exit__.assert_called_once() # Assert that the exit method was called once to close the session
    