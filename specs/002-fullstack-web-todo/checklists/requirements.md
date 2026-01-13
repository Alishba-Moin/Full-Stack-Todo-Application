# Phase II Feature Requirements Checklist

This checklist outlines the key acceptance criteria for Phase II of the Evolution of Todo application. All items must be verified and pass before considering the phase complete.

## Core Functionality
- [ ] All 5 basic CRUD (Create, Read, Update, Delete, List) operations work correctly for authenticated users.
- [ ] Tasks can be marked as complete and incomplete.

## Authentication & Authorization
- [ ] User signup flow functions correctly, allowing new users to register.
- [ ] User signin flow functions correctly, issuing a JWT upon successful authentication.
- [ ] JWT token is correctly sent in the `Authorization: Bearer` header for all protected API requests.
- [ ] Backend API successfully validates JWT tokens for protected endpoints.
- [ ] User data isolation is strictly enforced: User A cannot see, modify, or delete tasks belonging to User B.
- [ ] Attempts to access unauthorized resources (e.g., another user's task by ID) return a `404 Not Found` response (not `403 Forbidden`).
- [ ] Unauthorized requests (e.g., missing or invalid JWT) return a `401 Unauthorized` response.
- [ ] Password hashing (via Better Auth) is correctly implemented (bcrypt).
- [ ] Shared `BETTER_AUTH_SECRET` is used for JWT signing/verification between frontend and backend.

## Frontend (Next.js & UI)
- [ ] The web application is responsive and displays correctly on various screen sizes (desktop, tablet, mobile).
- [ ] UI components are styled consistently using Tailwind CSS.
- [ ] Navigation and routing work as expected using Next.js App Router.
- [ ] Client Components are used only for interactivity where necessary.
- [ ] Type-safe API client (`lib/api.ts`) is correctly implemented and used.

## Backend (FastAPI & Database)
- [ ] FastAPI routes are correctly defined for all task CRUD operations.
- [ ] SQLModel is used for all database interactions (model definition, queries).
- [ ] Connection to Neon Serverless PostgreSQL database is stable and functional via `DATABASE_URL`.
- [ ] Database schema for Users and Tasks is created and migrations are handled (initial setup).
- [ ] Pydantic v2 is used for request and response model validation in FastAPI.
- [ ] All database queries filter by `user_id` to ensure data isolation.
- [ ] SQL injection prevention is in place through SQLModel's parameterized queries.

## General
- [ ] Application starts up without errors in both development and production-like (Docker Compose) environments.
- [ ] Relevant environment variables (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_API_BASE_URL`) are correctly read and utilized.
