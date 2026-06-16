from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String

class Base(DeclarativeBase): # Base class for SQLAlchemy models
    pass

class User(Base): # SQLAlchemy model for the "users" table

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True) # Primary key column for the "users" table
    name: Mapped[str] = mapped_column(String) # Name column for the "users" table
    email: Mapped[str] = mapped_column(String) # Email column for the "users" table

Base.metadata.create_all(engine) # Create the "users" table in the database 
