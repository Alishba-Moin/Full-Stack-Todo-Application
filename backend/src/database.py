"""
Database connection and session management.
Uses SQLModel with PostgreSQL.
"""

from sqlmodel import create_engine, Session, SQLModel
from typing import Generator
from src.config import settings


# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=True if settings.ENVIRONMENT == "development" else False,
    pool_pre_ping=True,  # Verify connections before using
    pool_size=5,  # Connection pool size
    max_overflow=10,  # Max overflow connections
)


def get_session() -> Generator[Session, None, None]:
    """
    Dependency for database session.
    Automatically commits or rolls back on exit.
    """
    with Session(engine) as session:
        yield session


def init_db() -> None:
    """
    Initialize database tables.
    This creates all SQLModel tables.
    For production, use Alembic migrations instead.
    """
    SQLModel.metadata.create_all(engine)