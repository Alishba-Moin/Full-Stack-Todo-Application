# Phase II Tasks: Full-Stack Web Todo Application

---
title: Phase II Tasks
version: 1.0.0
status: Draft
phase: II
feature: 002-fullstack-web-todo
---

This document outlines the granular, atomic tasks required to implement Phase II of the Evolution of Todo project. These tasks are derived from the [Phase II Implementation Plan](./plan.md) and adhere to the [Project Constitution v2.0.0](../.specify/memory/constitution.md).

Each task is designed to be independently executable by an AI agent (Claude Code) and includes clear file paths for precise execution. This checklist format enables systematic tracking and completion.

## Implementation Strategy

The implementation will follow an MVP-first approach, focusing on delivering core functionality incrementally. Each user story phase will be completed and tested before moving to the next, ensuring a stable and verifiable build at each step.

## I. Environment & Project Setup (Phase 1)

These tasks establish the foundational project structure and environment configurations for the monorepo.

- [ ] T001 Create `frontend/` folder in monorepo root
- [ ] T002 Initialize Next.js 16+ App Router project in `frontend/` with TypeScript and Tailwind CSS
- [ ] T003 Create `backend/` folder in monorepo root
- [ ] T004 Initialize FastAPI project structure in `backend/` (e.g., `backend/src/main.py`, `backend/src/config.py`)
- [ ] T005 Create root `docker-compose.yml` with `frontend`, `backend`, and `db` services (PostgreSQL) in project root
- [ ] T006 Create `.env.example`, `.env.backend.example`, and `.env.frontend.example` files in the project root, referencing the [quickstart guide](./quickstart.md)
- [ ] T007 Generate `BETTER_AUTH_SECRET` and add placeholder to `.env.backend.example` and `.env.frontend.example` (refer to [research.md](./research.md))
- [ ] T008 Create `CLAUDE.md` in `frontend/` and `backend/` directories, aligning with project guidelines

## II. Database Foundation (Backend - Phase 2)

These tasks establish the database connection, define models, and set up migration capabilities for the backend.

- [ ] T009 Implement `backend/src/database.py` with SQLModel `create_async_engine` and `AsyncSession` dependency, referencing [research.md](./research.md)
- [ ] T010 Create `backend/src/models/user.py` with a minimal `User` SQLModel, compatible with Better Auth's user ID (UUID, primary key, email unique), referencing [data-model.md](./data-model.md)
- [ ] T011 Create `backend/src/models/task.py` with `Task` SQLModel, including `id`, `user_id` (Foreign Key to User), `title`, `description`, `complete`, `created_at`, `updated_at` fields, referencing [data-model.md](./data-model.md)
- [ ] T012 Add database indexes on `user_id` and `complete` columns in `backend/src/models/task.py`
- [ ] T013 Implement basic Alembic migration setup in `backend/` to manage schema changes
- [ ] T014 Test PostgreSQL database connection locally using Docker Compose to ensure `create_db_and_tables` works

## III. Authentication & JWT Security (Backend - Phase 3)

These tasks integrate JWT-based authentication and authorization into the backend API.

- [ ] T015 Implement JWT verification middleware/dependency (e.g., `backend/src/dependencies.py` `get_current_user_id`) in FastAPI, referencing [research.md](./research.md) and [contracts/auth.openapi.yaml](./contracts/auth.openapi.yaml)
- [ ] T016 Create `backend/src/auth_routes.py` for user signup (`/signup`) and signin (`/signin`) endpoints, compatible with Better Auth's flow, as defined in [contracts/auth.openapi.yaml](./contracts/auth.openapi.yaml)
- [ ] T017 Ensure `BETTER_AUTH_SECRET` is correctly loaded from environment variables and used for JWT signing/verification in `backend/src/config.py`
- [ ] T018 Implement user registration logic in `backend/src/auth_routes.py` to create new user entries in the database
- [ ] T019 Implement user login logic in `backend/src/auth_routes.py` to authenticate users and issue JWTs upon successful credentials validation
- [ ] T020 Write backend integration tests for JWT issuance on login and validation on protected endpoints using FastAPI's TestClient

## IV. Task CRUD API with User Isolation (Backend - Phase 4)

These tasks implement the core task management API endpoints with strict user data isolation.

- [ ] T021 Implement `GET /api/tasks` endpoint in `backend/src/routes/tasks.py` that retrieves all tasks for the `current_user.id`, returning a list of `TaskRead` (refer to [contracts/tasks.openapi.yaml](./contracts/tasks.openapi.yaml))
- [ ] T022 Implement `POST /api/tasks` endpoint in `backend/src/routes/tasks.py` that creates a new task associated with the `current_user.id`, returning `TaskRead`
- [ ] T023 Implement `GET /api/tasks/{task_id}` endpoint in `backend/src/routes/tasks.py` that retrieves a single task, ensuring `task_id` belongs to `current_user.id` (return 404 if not found or not owned), returning `TaskRead`
- [ ] T024 Implement `PUT /api/tasks/{task_id}` endpoint in `backend/src/routes/tasks.py` that updates an existing task, with ownership check for `current_user.id`, returning `TaskRead`
- [ ] T025 Implement `DELETE /api/tasks/{task_id}` endpoint in `backend/src/routes/tasks.py` that deletes a task, with ownership check for `current_user.id`, returning 204 No Content
- [ ] T026 Implement `PATCH /api/tasks/{task_id}/complete` endpoint in `backend/src/routes/tasks.py` that toggles task completion status, with ownership check for `current_user.id`, returning `TaskRead`
- [ ] T027 Add Pydantic v2-based request/response validation for all task endpoints (e.g., `TaskCreate`, `TaskUpdate`, `TaskRead`)
- [ ] T028 Ensure consistent error handling across all API endpoints, returning `404 Not Found` for unauthorized resource access and `401 Unauthorized` for missing/invalid JWT (refer to [security requirements](./checklists/requirements.md))
- [ ] T029 Auto-generate OpenAPI documentation (`/docs`) for all task and auth endpoints from FastAPI definitions
- [ ] T030 Write backend integration tests for all CRUD operations, including successful cases, validation errors, and crucial user isolation checks (e.g., attempt to access another user's task)

## V. Frontend UI Pages & Components (Phase 5)

These tasks build the user interface and integrate it with the backend API.

- [ ] T031 Create `frontend/app/login/page.tsx` and `frontend/app/register/page.tsx` for user authentication using Better Auth components
- [ ] T032 Create `frontend/app/dashboard/layout.tsx` with an authentication guard that redirects unauthenticated users to the login page
- [ ] T033 Create `frontend/app/dashboard/page.tsx` as a Next.js Server Component responsible for fetching tasks for the authenticated user
- [ ] T034 Create `frontend/components/TaskList.tsx` client component to display an interactive list of tasks, handling filters/sorts and state updates
- [ ] T035 Create `frontend/components/TaskItem.tsx` client component for individual tasks, including toggle complete, edit, and delete buttons
- [ ] T036 Create `frontend/components/TaskForm.tsx` modal or component for creating and editing tasks, handling form submission and validation
- [ ] T037 Implement loading states (spinners/skeletons), error boundaries, and toast notifications (e.g., using a UI library) for improved UX
- [ ] T038 Ensure all UI components and pages follow a responsive design using Tailwind CSS, adhering to mobile-first principles

## VI. Integration & Polish (Phase 6)

These final tasks focus on connecting the frontend and backend, comprehensive testing, and documentation.

- [ ] T039 Implement a type-safe API client in `frontend/lib/api.ts` that handles fetching data from the backend, including automatically attaching JWT `Authorization: Bearer` headers
- [ ] T040 Write frontend component tests for `TaskList`, `TaskItem`, and `TaskForm` using Jest/React Testing Library
- [ ] T041 Conduct manual multi-user E2E tests to simulate multiple users, ensuring strict user data isolation across login sessions (refer to [checklists/requirements.md](./checklists/requirements.md))
- [ ] T042 Update the root `README.md` and `specs/002-fullstack-web-todo/quickstart.md` with comprehensive setup, run, and demo instructions for the full-stack application
- [ ] T043 Generate `IMPLEMENTATION_SUMMARY.md` in the project root, summarizing key learnings, challenges, and architectural decisions from Phase II
- [ ] T044 Perform a final constitution compliance check against [constitution v2.0.0](../.specify/memory/constitution.md) to ensure all principles and requirements are met
