"""
Task schemas for CRUD operations.
"""

from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional


class TaskCreateRequest(BaseModel):
    """Request schema for creating a new task."""

    title: str = Field(min_length=1, max_length=200, description="Task title (1-200 characters)")
    description: Optional[str] = Field(default=None, max_length=1000, description="Optional task description (max 1000 characters)")


class TaskUpdateRequest(BaseModel):
    """Request schema for updating a task (full replacement)."""

    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool


class TaskPatchRequest(BaseModel):
    """Request schema for partial task update (e.g., toggle completion)."""

    completed: bool


class TaskResponse(BaseModel):
    """Response schema for a single task."""

    id: int
    user_id: UUID
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TaskListResponse(BaseModel):
    """Response schema for list of tasks."""

    tasks: list[TaskResponse]