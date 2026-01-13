# Phase II Quickstart Guide

This guide provides step-by-step instructions to set up and run the Full-Stack Web Todo Application locally for Phase II development.

## Prerequisites
- Python 3.13+
- Node.js 18+
- Docker & Docker Compose (optional, for simplified setup)
- A Neon PostgreSQL account and database instance

## 1. Clone the Repository
```bash
git clone <your-repo-url>
cd evolution-of-todo/phase1-console-app # Or wherever your monorepo root is
```

## 2. Set up Environment Variables

Create `.env.example`, `.env.backend.example`, and `.env.frontend.example` files in the root directory (if they don't exist, you'll need to create these based on `*.example` files in the monorepo root and frontend/backend subdirectories).

### `.env.backend.example`
```ini
DATABASE_URL="postgresql://<user>:<password>@<host>/<database_name>"
BETTER_AUTH_SECRET="<a_strong_random_secret_key_for_JWT_signing>"
```

### `.env.frontend.example`
```ini
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api"
BETTER_AUTH_SECRET="<the_same_strong_random_secret_key_as_backend>"
```

**Generate `BETTER_AUTH_SECRET`**: Use a strong, random string. For example, in Python:
```python
import secrets
print(secrets.token_urlsafe(32))
```

## 3. Database Setup (Neon PostgreSQL)

1.  **Create a Neon Project**: If you don't have one, sign up at [Neon.tech](https://neon.tech/) and create a new project.
2.  **Create a Database**: Within your project, create a new database. Note down the connection string.
3.  **Update `DATABASE_URL`**: Replace the placeholder in `.env.backend.example` with your Neon connection string. Ensure it uses the `postgresql://` scheme.

## 4. Run the Backend (FastAPI)

Navigate to the `backend/` directory:

```bash
cd backend
# Install dependencies using UV
uv pip install -r requirements.txt

# Run database migrations (initial creation)
# You'll need to define this command in your backend setup, e.g., with Alembic or SQLModel CLI
# For now, manually ensure models are created on startup or via a script.

# Start the FastAPI application
uvicorn src.main:app --reload
```

This will start the backend API server, typically on `http://localhost:8000`.

## 5. Run the Frontend (Next.js)

Navigate to the `frontend/` directory:

```bash
cd frontend
# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```

This will start the Next.js development server, typically on `http://localhost:3000`.

## 6. Using Docker Compose (Recommended for Local Dev)

If you have Docker and Docker Compose installed, you can use the provided `docker-compose.yml` (in the monorepo root) to run both frontend and backend services:

```bash
# Ensure your .env files are correctly configured in the root directory
docker-compose up --build
```

This will build and start both services in their respective Docker containers, handling environment variables as configured.
