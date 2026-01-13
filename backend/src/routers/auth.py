"""
Authentication router for user registration and login.
"""

from fastapi import APIRouter, HTTPException, status, Response, Depends
from sqlmodel import Session, select
from datetime import timedelta
from src.schemas.auth import RegisterRequest, RegisterResponse, LoginRequest, AuthResponse
from src.models.user import User
from src.utils.security import hash_password, verify_password, create_access_token
from src.database import get_session
from src.config import settings


router = APIRouter(prefix="/api/auth", tags=["authentication"])


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register(
    request: RegisterRequest,
    session: Session = Depends(get_session)
):
    """
    Register a new user account.

    Validates email format and password length, checks for duplicate emails,
    hashes password with bcrypt, and creates user in database.

    Acceptance Scenarios:
    - Valid email + password (8+ chars) → Account created, 201 response
    - Invalid email format → 400 with validation error
    - Password <8 chars → 400 with validation error
    - Duplicate email → 409 with error message

    Args:
        request: RegisterRequest with email and password
        session: Database session

    Returns:
        RegisterResponse with user ID, email, and success message

    Raises:
        HTTPException 409: If email already exists
    """
    # Check if email already exists
    existing_user = session.exec(
        select(User).where(User.email == request.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists"
        )

    # Create new user with hashed password
    user = User(
        email=request.email,
        password_hash=hash_password(request.password)
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    return RegisterResponse(
        id=str(user.id),
        email=user.email
    )


@router.post("/login", response_model=AuthResponse)
def login(
    request: LoginRequest,
    response: Response,
    session: Session = Depends(get_session)
):
    """
    Authenticate user and issue JWT token.

    Verifies credentials, creates JWT token with 7-day expiration,
    stores token in httpOnly cookie for security.

    Acceptance Scenarios:
    - Valid credentials → JWT token issued, 200 response
    - Invalid credentials → 401 with generic error message
    - Non-existent email → 401 with same generic error (prevent enumeration)

    Args:
        request: LoginRequest with email and password
        response: Response object to set cookie
        session: Database session

    Returns:
        AuthResponse with access token and user info

    Raises:
        HTTPException 401: If credentials are invalid
    """
    # Get user by email
    user = session.exec(
        select(User).where(User.email == request.email)
    ).first()

    # Verify password (use generic error message to prevent email enumeration)
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Create access token
    access_token_expires = timedelta(days=settings.ACCESS_TOKEN_EXPIRE_DAYS)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        secret_key=settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
        expires_delta=access_token_expires
    )

    # Set httpOnly cookie (secure, XSS-protected)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,  # 7 days in seconds
        samesite="lax",
        secure=False  # Set to True in production with HTTPS
    )

    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user={"id": str(user.id), "email": user.email}
    )