from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from model.user import Base

engine = create_engine("sqlite:///src/database/users.db", echo=True) # Create a SQLite database engine for the "users.db" file in the current directory

Session = sessionmaker(bind=engine) # Create a session factory bound to the engine, which will be used to create sessions for interacting with the database

Base.metadata.create_all(engine) # Create the "users" table in the database 