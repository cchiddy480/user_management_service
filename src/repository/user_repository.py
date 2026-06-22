from sqlalchemy import select

from model.user import User
from database.sqlite import Session

def create_user(name, email):
    with Session() as session: # Create a new session for interacting with the database

        user = User(name=name, email=email)

        session.add(user) # Add the new user to the session's transaction
        session.commit() # Commit the transaction to save the new user to the database

    return user.id # Return the ID of the newly created user

# This function deletes a user by their ID. It first checks if the user exists in the database. 
# If the user is found, it deletes the user and commits the transaction. 
# If the user is not found, it returns an error message.
def delete_user(user_id):
    with Session() as session:

        user = session.get(User, user_id)

        if not user:
            return {"error": f"User with id {user_id} not found."}

        else:
            session.delete(user) 
            session.commit()
            return {"message": f"User with id {user_id} deleted successfully."}
            

# This function retrieves a list of all users from the database.
def list_users():
    with Session() as session:

        users = session.execute(select(User)).scalars().all()

        return [user.name for user in users]

