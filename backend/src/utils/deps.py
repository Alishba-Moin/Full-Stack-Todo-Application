"""
Dependency injection utilities for FastAPI endpoints.
"""

from fastapi import Depends, HTTPException, status, Cookie, Header
from sqlmodel import Session
from typing import Optional
from uuid import UUID
from src.database import get_session
from src.utils.security import decode_access_token
from src.models.user import User
from src.config import settings


async def get_current_user(
    authorization: Optional[str] = Header(default=None),
    access_token: Optional[str] = Cookie(default=None),
    session: Session = Depends(get_session)
) -> User:
    """
    Extract and validate current user from JWT token.

    This dependency supports TWO authentication methods:
    1. Authorization header: "Bearer <token>" (preferred for API clients)
    2. httpOnly cookie: "access_token" (for browser-based sessions)

    Flow:
    1. Try to extract token from Authorization header first
    2. Fall back to cookie if header not present
    3. Validate token signature and expiration
    4. Extract user_id from token payload
    5. Fetch user from database
    6. Return authenticated user

    Args:
        authorization: Authorization header (format: "Bearer <token>")
        access_token: JWT token from cookie
        session: Database session

    Returns:
        Authenticated user

    Raises:
        HTTPException 401: If token is missing, invalid, or user not found
    """
    # Try to extract token from Authorization header first
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
    elif access_token:
        token = access_token

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = decode_access_token(
            token,
            settings.JWT_SECRET_KEY,
            settings.JWT_ALGORITHM
        )
        user_id_str: Optional[str] = payload.get("sub")
        if user_id_str is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user_id = UUID(user_id_str)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user