# Phase II Data Model: Users and Tasks

This document defines the database schema and SQLModel representations for the `Users` and `Tasks` entities in Phase II of the Evolution of Todo application.

## Schema Diagram (Text-based)

```mermaid
erDiagram
    USERS {
        UUID id PK
        VARCHAR email UNIQUE
        VARCHAR name
        VARCHAR password_hash
        TIMESTAMP created_at
    }

    TASKS {
        INTEGER id PK, NN
        UUID user_id FK
        VARCHAR title NN
        TEXT description
        BOOLEAN complete DEFAULT false
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    USERS ||--o{ TASKS : "has"
```

## Table Definitions

### Users Table (Managed by Better Auth)

This table stores user information and is primarily managed by the Better Auth library. `id` serves as the foreign key for tasks to ensure user data isolation.

**Fields**:
- `id`: Unique identifier for the user (UUID).
- `email`: User's email address (unique, string).
- `name`: Optional display name for the user (string).
- `password_hash`: Hashed password using bcrypt (string, managed by Better Auth).
- `created_at`: Timestamp of user creation.

**SQLModel Snippet**:
```python
import datetime
from typing import Optional
import uuid

from sqlmodel import Field, SQLModel

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    email: str = Field(unique=True, index=True, nullable=False)
    name: Optional[str] = None
    password_hash: str = Field(nullable=False) # Store bcrypt hash
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow, nullable=False)

    # Note: Better Auth library will handle password management, we just store the hash.
```

### Tasks Table

This table stores individual todo tasks, linked to a specific user via `user_id`.

**Fields**:
- `id`: Unique identifier for the task (integer, auto-increment, primary key).
- `user_id`: Foreign key linking to the `Users` table (UUID, required).
- `title`: Short description of the task (string, required).
- `description`: Detailed text for the task (optional, string).
- `complete`: Boolean indicating if the task is completed (default False).
- `created_at`: Timestamp of task creation.
- `updated_at`: Timestamp of last task update (automatically updated).

**SQLModel Snippet**:
```python
import datetime
from typing import Optional
import uuid

from sqlmodel import Field, SQLModel

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True, nullable=False)
    title: str = Field(index=True, nullable=False)
    description: Optional[str] = None
    complete: bool = Field(default=False)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow, nullable=False)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow, nullable=False, sa_column_kwargs={"onupdate": datetime.datetime.utcnow})

    # Relationship to User can be added here if needed for ORM capabilities
    # user: User = Relationship(back_populates="tasks")
```
