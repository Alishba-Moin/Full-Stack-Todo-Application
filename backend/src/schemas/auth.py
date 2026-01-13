"""
Authentication schemas for user registration and login.
"""

from pydantic import BaseModel, EmailStr, Field
from uuid import UUID


class RegisterRequest(BaseModel):
    """Request schema for user registration."""

    email: EmailStr
    password: str = Field(min_length=8, description="Password must be at least 8 characters")


class RegisterResponse(BaseModel):
    """Response schema for successful registration."""

    id: str
    email: str
    message: str = "Account created successfully"


class LoginRequest(BaseModel):
    """Request schema for user login."""

    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    """Response schema for successful login."""

    access_token: str
    token_type: str = "bearer"
    user: dict


class UserResponse(BaseModel):
    """Response schema for user information."""

    id: UUID
    email: str

    class Config:
        from_attributes = True