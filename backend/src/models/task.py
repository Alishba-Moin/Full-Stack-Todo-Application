"""
Task SQLModel for todo items.
"""

from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID
from datetime import datetime
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.user import User


class Task(SQLModel, table=True):
    """
    Task entity belonging to a user.

    Attributes:
        id: Unique identifier (auto-increment integer)
        user_id: Owner reference (foreign key to users table)
        title: Task title (1-200 characters, required)
        description: Optional task description (max 1000 characters)
        completed: Completion status (default False)
        created_at: Task creation timestamp
        updated_at: Last update timestamp
        owner: Relationship to user (each task belongs to one user)
    """

    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship (not stored in database)
    owner: "User" = Relationship(back_populates="tasks")