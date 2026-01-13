"""
Tasks router for CRUD operations with user data isolation.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import Session, select
from uuid import UUID
from datetime import datetime
from src.schemas.tasks import (
    TaskCreateRequest,
    TaskUpdateRequest,
    TaskPatchRequest,
    TaskResponse,
    TaskListResponse
)
from src.models.task import Task
from src.models.user import User
from src.database import get_session
from src.utils.deps import get_current_user


router = APIRouter(prefix="/api/{user_id}/tasks", tags=["tasks"])


@router.get("", response_model=TaskListResponse)
def list_tasks(
    user_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    List all tasks for authenticated user.

    CRITICAL SECURITY: ALL queries filter by user_id for data isolation.
    Returns 404 (not 403) for unauthorized access to prevent information leakage.

    Acceptance Scenarios:
    - User with 5 tasks → See all 5 tasks sorted by creation date (newest first)
    - User with no tasks → Empty tasks list
    - User data isolation → Only see tasks where task.user_id == authenticated user.id
    - URL user_id mismatch → 404 error

    Args:
        user_id: User ID from URL path
        current_user: Authenticated user from JWT token
        session: Database session

    Returns:
        TaskListResponse with list of tasks

    Raises:
        HTTPException 404: If user_id doesn't match authenticated user
    """
    # CRITICAL: Verify user_id in URL matches authenticated user
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )

    # CRITICAL: Filter by user_id for data isolation
    tasks = session.exec(
        select(Task)
        .where(Task.user_id == current_user.id)
        .order_by(Task.created_at.desc())  # Newest first
    ).all()

    return TaskListResponse(tasks=tasks)


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    user_id: UUID,
    request: TaskCreateRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create new task for authenticated user.

    CRITICAL SECURITY: Task MUST be associated with authenticated user's ID.

    Acceptance Scenarios:
    - Valid title (1-200 chars) + description (0-1000 chars) → Task created
    - Empty title → 400 with validation error
    - Title >200 chars → 400 with validation error
    - Empty description → Task created successfully (description is optional)
    - Timestamps → created_at and updated_at set automatically

    Args:
        user_id: User ID from URL path
        request: TaskCreateRequest with title and optional description
        current_user: Authenticated user from JWT token
        session: Database session

    Returns:
        TaskResponse with created task

    Raises:
        HTTPException 404: If user_id doesn't match authenticated user
    """
    # CRITICAL: Verify user_id in URL matches authenticated user
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )

    # Create task with authenticated user's ID
    task = Task(
        user_id=current_user.id,
        title=request.title,
        description=request.description
    )
    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    user_id: UUID,
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get single task by ID.

    CRITICAL SECURITY: Verify task belongs to authenticated user.

    Args:
        user_id: User ID from URL path
        task_id: Task ID from URL path
        current_user: Authenticated user from JWT token
        session: Database session

    Returns:
        TaskResponse with task details

    Raises:
        HTTPException 404: If task not found or doesn't belong to user
    """
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )

    # CRITICAL: Filter by both task_id AND user_id
    task = session.exec(
        select(Task)
        .where(Task.id == task_id)
        .where(Task.user_id == current_user.id)
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )

    return task


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    user_id: UUID,
    task_id: int,
    request: TaskUpdateRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update task (full replacement).

    CRITICAL SECURITY: Verify task belongs to authenticated user.

    Acceptance Scenarios:
    - Edit title and/or description → Changes persisted, updated_at updated
    - Clear title and try to save → 400 with validation error
    - Enter title >200 chars → 400 with validation error
    - Edit task belonging to another user → 404 error

    Args:
        user_id: User ID from URL path
        task_id: Task ID from URL path
        request: TaskUpdateRequest with title, description, completed
        current_user: Authenticated user from JWT token
        session: Database session

    Returns:
        TaskResponse with updated task

    Raises:
        HTTPException 404: If task not found or doesn't belong to user
    """
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )

    task = session.exec(
        select(Task)
        .where(Task.id == task_id)
        .where(Task.user_id == current_user.id)
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )

    # Update task fields
    task.title = request.title
    task.description = request.description
    task.completed = request.completed
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.patch("/{task_id}", response_model=TaskResponse)
def patch_task(
    user_id: UUID,
    task_id: int,
    request: TaskPatchRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Partially update task (e.g., toggle completion status).

    CRITICAL SECURITY: Verify task belongs to authenticated user.

    Acceptance Scenarios:
    - Click toggle on incomplete task → Marked complete, updated_at updated
    - Click toggle on completed task → Marked incomplete, updated_at updated
    - Reload page after toggle → Completion status persists
    - Toggle task belonging to another user → 404 error

    Args:
        user_id: User ID from URL path
        task_id: Task ID from URL path
        request: TaskPatchRequest with completed boolean
        current_user: Authenticated user from JWT token
        session: Database session

    Returns:
        TaskResponse with updated task

    Raises:
        HTTPException 404: If task not found or doesn't belong to user
    """
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )

    task = session.exec(
        select(Task)
        .where(Task.id == task_id)
        .where(Task.user_id == current_user.id)
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )

    # Update completion status
    task.completed = request.completed
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    user_id: UUID,
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete task permanently.

    CRITICAL SECURITY: Verify task belongs to authenticated user.

    Acceptance Scenarios:
    - Confirm deletion → Task permanently removed, 204 response
    - Delete task belonging to another user → 404 error
    - Reload page after deletion → Task remains deleted

    Args:
        user_id: User ID from URL path
        task_id: Task ID from URL path
        current_user: Authenticated user from JWT token
        session: Database session

    Returns:
        204 No Content on success

    Raises:
        HTTPException 404: If task not found or doesn't belong to user
    """
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )

    task = session.exec(
        select(Task)
        .where(Task.id == task_id)
        .where(Task.user_id == current_user.id)
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )

    # Delete task
    session.delete(task)
    session.commit()

    return None