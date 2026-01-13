"""
Security utilities for password hashing and JWT token management.
"""

import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from uuid import UUID


def hash_password(password: str) -> str:
    """
    Hash password using bcrypt.

    Args:
        password: Plain text password

    Returns:
        Hashed password (bcrypt)
    """
    # Encode password to bytes, hash it, return as string
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt(rounds=12)  # Cost factor 12
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password against bcrypt hash.

    Args:
        plain_password: Password to verify
        hashed_password: Bcrypt hash to verify against

    Returns:
        True if password matches hash, False otherwise
    """
    # Encode both password and hash to bytes for comparison
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)


def create_access_token(
    data: Dict[str, Any],
    secret_key: str,
    algorithm: str,
    expires_delta: timedelta
) -> str:
    """
    Create JWT access token.

    Args:
        data: Payload data (typically {"sub": user_id})
        secret_key: JWT secret key
        algorithm: JWT algorithm (e.g., HS256)
        expires_delta: Token expiration duration

    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm=algorithm)
    return encoded_jwt


def decode_access_token(
    token: str,
    secret_key: str,
    algorithm: str
) -> Dict[str, Any]:
    """
    Decode and validate JWT access token.

    Args:
        token: JWT token to decode
        secret_key: JWT secret key
        algorithm: JWT algorithm (e.g., HS256)

    Returns:
        Decoded payload

    Raises:
        JWTError: If token is invalid or expired
    """
    payload = jwt.decode(token, secret_key, algorithms=[algorithm])
    return payload