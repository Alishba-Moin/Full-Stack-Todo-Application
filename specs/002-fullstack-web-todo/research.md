# Phase II Research & Implementation Notes

This document compiles research findings and key implementation considerations for Phase II, focusing on authentication, database interaction, and user isolation.

## 1. Better Auth JWT Plugin Configuration

**Overview**: Better Auth is chosen for frontend user session management and JWT issuance. The JWT plugin will handle token creation on successful login and provide mechanisms to include it in API requests.

**Configuration Details**:
-   Frontend needs to be configured with `BETTER_AUTH_SECRET` (same as backend) for signing/verifying JWTs locally if needed (though typically only backend verifies).
-   Client-side storage of JWT (e.g., HTTP-only cookies, local storage) will be handled by Better Auth, considering security best practices.
-   Integration with Next.js App Router for server-side and client-side authentication flows.

**Example (conceptual, actual config will depend on Better Auth docs)**:
```typescript
// frontend/lib/auth.ts (conceptual)
import { BetterAuth } from 'better-auth';
import { JWTPlugin } from 'better-auth/plugins/jwt';

export const auth = new BetterAuth({
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  plugins: [
    new JWTPlugin({
      secret: process.env.BETTER_AUTH_SECRET, // Used for client-side token management if applicable
      tokenExpiration: '7d',
    }),
  ],
});
```

## 2. FastAPI JWT Dependency/Middleware Example

**Overview**: The FastAPI backend will use a JWT validation middleware or dependency injection to protect endpoints. This ensures that only requests with a valid, unexpired JWT are processed.

**Implementation Strategy**:
-   A FastAPI `Depends` function will be created to decode and validate the JWT from the `Authorization: Bearer` header.
-   This dependency will extract the `user_id` from the JWT payload and make it available to route handlers.
-   `PyJWT` library will be used for token decoding and verification.

**Example (conceptual)**:
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2Bearer
from jose import jwt, JWTError
from pydantic import BaseModel
import os
import uuid

# Get secret from environment variables
BETTER_AUTH_SECRET = os.getenv("BETTER_AUTH_SECRET")
ALGORITHM = "HS256"

oauth2_scheme = OAuth2Bearer(tokenUrl="/auth/token")

class TokenData(BaseModel):
    user_id: Optional[uuid.UUID] = None

async def get_current_user_id(token: str = Depends(oauth2_scheme)) -> uuid.UUID:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, BETTER_AUTH_SECRET, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return uuid.UUID(user_id)
    except JWTError:
        raise credentials_exception

# Usage in a route:
# @app.get("/tasks/")
# async def read_tasks(current_user_id: uuid.UUID = Depends(get_current_user_id)):
#     # Logic to fetch tasks for current_user_id
#     pass
```

## 3. User Isolation Patterns in Queries

**Overview**: All database queries for tasks MUST include a `WHERE user_id = current_user_id` clause to enforce strict user data isolation. This prevents users from accessing or modifying tasks belonging to other users.

**SQLModel Query Example**:
```python
from sqlmodel import Session, select
from typing import List
import uuid

# Assuming `engine` is a configured SQLModel engine
# from app.db import engine

async def get_tasks_for_user(user_id: uuid.UUID) -> List[Task]:
    with Session(engine) as session:
        statement = select(Task).where(Task.user_id == user_id)
        tasks = session.exec(statement).all()
        return tasks

async def get_task_by_id_for_user(task_id: int, user_id: uuid.UUID) -> Optional[Task]:
    with Session(engine) as session:
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        task = session.exec(statement).first()
        return task
```

**Security Note**: For unauthorized resource access (e.g., a user tries to access `GET /tasks/{other_user_task_id}`), the API should return `404 Not Found` instead of `403 Forbidden` to prevent information leakage about the existence of other users' tasks.

## 4. Neon Connection Best Practices with SQLModel

**Overview**: Connecting FastAPI with SQLModel to Neon Serverless PostgreSQL requires careful management of connection pooling and session handling, especially in a serverless environment.

**Best Practices**:
-   **Connection String**: Use the provided `DATABASE_URL` from Neon. Ensure it's securely managed via environment variables.
-   **Asynchronous Operations**: SQLModel supports `asyncio` with `create_async_engine` and `AsyncSession`. All database interactions should be asynchronous to avoid blocking the FastAPI event loop.
-   **Session Management**: Use a dependency to provide a database session per request, ensuring proper session lifecycle (creation, commit/rollback, close).
-   **Connection Pooling**: Configure the engine's connection pool parameters (e.g., `pool_size`, `max_overflow`, `pool_recycle`) based on application load and Neon's recommendations to optimize performance and resource usage.

**Example (conceptual)**:
```python
# backend/src/db.py
from sqlmodel import create_engine, SQLModel, Session, select, Field
from typing import Generator
import os

DATABASE_URL = os.getenv("DATABASE_URL")

# For asynchronous operations (recommended for FastAPI)
# from sqlmodel.ext.asyncio import create_async_engine, AsyncSession
# async_engine = create_async_engine(DATABASE_URL, echo=True)

# For synchronous operations (simpler for initial setup, but async recommended)
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator:
    with Session(engine) as session:
        yield session

# In main.py:
# @app.on_event("startup")
# def on_startup():
#     create_db_and_tables()

# @app.post("/tasks/")
# def create_hero(*, session: Session = Depends(get_session), task: TaskCreate):
#     db_task = Task.from_orm(task)
#     session.add(db_task)
#     session.commit()
#     session.refresh(db_task)
#     return db_task
```
