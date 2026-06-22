from repository.user_repository import create_user

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


   
