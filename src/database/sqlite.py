from sqlalchemy import create_engine

engine = create_engine("sqlite:///./database/users.db", echo=True) # Create a SQLite database engine for the "users.db" file in the current directory