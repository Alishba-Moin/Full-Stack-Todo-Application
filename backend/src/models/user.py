"""
User SQLModel for authentication and task ownership.
"""

from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.task import Task


class User(SQLModel, table=True):
    """
    User entity for authentication.

    Attributes:
        id: Unique identifier (UUID)
        email: User email address (unique, indexed)
        password_hash: Bcrypt hashed password (NEVER plaintext)
        created_at: Account creation timestamp
        updated_at: Last update timestamp
        tasks: Relationship to tasks (one user has many tasks)
    """

    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    password_hash: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship (not stored in database)
    tasks: list["Task"] = Relationship(back_populates="owner", cascade_delete=True)