from model.user import User
from database.sqlite import Session

def create_user(name, email):
    with Session() as session: # Create a new session for interacting with the database

        user = User(name=name, email=email)

        session.add(user) # Add the new user to the session's transaction
        session.commit() # Commit the transaction to save the new user to the database

    return user.id # Return the ID of the newly created user

