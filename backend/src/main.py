"""
FastAPI main application for Task Management API.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routers import auth, tasks
from src.config import settings
from src.database import init_db

# Create FastAPI application
app = FastAPI(
    title="Task Management API",
    description="Full-stack task management application with user authentication",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js frontend (development - port 3000)
        "http://localhost:3001",  # Next.js frontend (development - port 3001)
        "http://frontend:3000",   # Docker frontend service
    ],
    allow_credentials=True,  # Allow cookies (JWT token)
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include routers
app.include_router(auth.router)
app.include_router(tasks.router)

@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/health")
def health_check():
    """Health check endpoint for Docker healthcheck."""
    return {"status": "healthy", "environment": settings.ENVIRONMENT}


@app.get("/")
def root():
    """Root endpoint with API information."""
    return {
        "message": "Task Management API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }