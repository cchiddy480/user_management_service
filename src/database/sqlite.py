from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine("sqlite:///./database/users.db", echo=True) # Create a SQLite database engine for the "users.db" file in the current directory

Session = sessionmaker(bind=engine) # Create a session factory bound to the engine, which will be used to create sessions for interacting with the database
