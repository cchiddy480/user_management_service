from repository.user_repository import create_user, delete_user, list_users

# This function validates the input for creating a user and returns a list of error messages if any validation fails.
def validate_create_user(name: str, email: str) -> list[str]: 
    errors = []
    if not name or not name.strip():
        errors.append("Name is required.")
    if "@" not in email:
        errors.append("Email must contain @")
    return errors

# This function creates a user by first validating the input and then calling the create_user 
# function from the repository. If there are validation errors, it returns them instead of creating the user.
def create_user_service(name: str, email: str): 
    errors = validate_create_user(name, email)
    if errors:
        return {"errors": errors}
    
    user_id = create_user(name=name, email=email)
    return {"id": user_id}

# This function deletes a user by their ID by calling the delete_user function from the repository.
def delete_user_service(user_id: int):
    return delete_user(user_id)

# This function lists all users by calling the list_users function from the repository.
def list_users_service():
    users = list_users()
    return {"users": users}


