# Phase II Implementation Plan: Full-Stack Web Todo Application

---
title: Phase II Implementation Plan
version: 1.0.0
status: Draft
phase: II
feature: 002-fullstack-web-todo
---

This document outlines the architectural plan and implementation strategy for Phase II of the Evolution of Todo project, transforming the CLI application into a multi-user full-stack web application with authentication and persistent storage. This plan aligns with the [Project Constitution v2.0.0](../.specify/memory/constitution.md) and builds upon the detailed specifications in this directory.

## 1. Architecture Overview

### Monorepo Structure
The project will maintain a monorepo structure with distinct `frontend/` (Next.js) and `backend/` (FastAPI) directories, as defined in the [Constitution v2.0.0, Section V](../.specify/memory/constitution.md). This separation allows for independent development and deployment while maintaining a unified codebase.

### Authentication Flow
1.  **User Interaction (Frontend)**: Users interact with the Next.js frontend to sign up or sign in. The [Better Auth library](../specs/002-fullstack-web-todo/research.md) handles client-side authentication logic.
2.  **JWT Issuance**: Upon successful sign-in, Better Auth interacts with the backend's authentication endpoints (as described in [contracts/auth.openapi.yaml](../specs/002-fullstack-web-todo/contracts/auth.openapi.yaml)) to receive a JWT.
3.  **Token Storage**: The JWT is securely stored client-side (e.g., in an HTTP-only cookie by Better Auth).
4.  **API Requests**: For protected API calls, the frontend's type-safe API client (e.g., `lib/api.ts`) automatically includes the JWT in the `Authorization: Bearer` header.
5.  **FastAPI Middleware**: The FastAPI backend employs a JWT validation middleware (as researched in [research.md](../specs/002-fullstack-web-todo/research.md)) to intercept incoming requests.
6.  **`user_id` Extraction**: The middleware decodes and validates the JWT. Upon successful validation, it extracts the `user_id` from the token payload, making it available to downstream route handlers.

### Data Flow
1.  **Frontend Initiates**: The Next.js frontend dispatches API requests (e.g., to create a task).
2.  **API Gateway (Implicit)**: Requests are routed to the FastAPI backend, including the `Authorization: Bearer` header.
3.  **Backend Processing**: FastAPI endpoints receive the request. After JWT validation and `user_id` extraction, the route handler processes the request.
4.  **Database Interaction**: SQLModel is used to interact with the Neon PostgreSQL database. All queries for tasks include a `WHERE user_id = current_user.id` clause to enforce user data isolation, as detailed in [data-model.md](../specs/002-fullstack-web-todo/data-model.md).
5.  **Response**: The backend constructs a response and sends it back to the frontend.

### User Isolation Enforcement Points
-   **API Level**: All task-related API endpoints (as defined in [contracts/tasks.openapi.yaml](../specs/002-fullstack-web-todo/contracts/tasks.openapi.yaml)) will explicitly require authentication and perform `user_id` validation. Any attempt to access a task not owned by the authenticated `user_id` will result in a `404 Not Found` response.
-   **Database Level**: Every SQLModel query involving tasks will include a `WHERE user_id = current_user.id` clause to prevent accidental cross-user data access.

## 2. Implementation Phases & Order

This phased approach ensures a stable foundation before building higher-level features.

### Phase 1: Backend Foundation
-   Set up FastAPI project structure (`backend/src/`).
-   Configure Neon PostgreSQL connection using environment variables.
-   Define SQLModel `User` and `Task` models based on [data-model.md](../specs/002-fullstack-web-todo/data-model.md).
-   Implement basic database session management and initial schema creation.

### Phase 2: Authentication Integration (Backend First)
-   Implement JWT middleware/dependency in FastAPI to validate tokens and extract `user_id` (refer to [research.md](../specs/002-fullstack-web-todo/research.md)).
-   Create basic authentication endpoints (signup, signin) that interact with Better Auth's backend components or directly manage users if Better Auth has a Python integration.
-   Ensure `BETTER_AUTH_SECRET` is correctly configured and shared.

### Phase 3: Task CRUD API with User Filtering
-   Develop all 5 CRUD API endpoints for tasks (GET, POST, PUT, DELETE, PATCH /complete) as defined in [contracts/tasks.openapi.yaml](../specs/002-fullstack-web-todo/contracts/tasks.openapi.yaml).
-   Crucially, integrate `user_id` filtering in every database query to enforce user data isolation.
-   Implement appropriate error handling (e.g., 401 for unauthorized, 404 for not found/not owned).

### Phase 4: Frontend Setup
-   Initialize Next.js 16+ project (`frontend/`).
-   Configure TypeScript strict mode, Tailwind CSS.
-   Integrate and configure the Better Auth library with its JWT plugin (refer to [research.md](../specs/002-fullstack-web-todo/research.md)).
-   Develop a type-safe API client (`frontend/lib/api.ts`) for interacting with the backend, handling JWT inclusion.

### Phase 5: UI Pages & Components
-   Create authentication pages (e.g., `/login`, `/signup`) using Better Auth components.
-   Design and implement the main Dashboard page to display tasks.
-   Develop components for creating, editing, and deleting tasks.
-   Ensure responsive design and accessibility during component development.

### Phase 6: Integration, Testing, & Polish
-   Connect frontend UI with the backend API endpoints.
-   Implement comprehensive testing: Backend unit/integration, Frontend component, and E2E user journey tests, adhering to [Testing Requirements, Section VI](../.specify/memory/constitution.md).
-   Address any identified bugs or performance bottlenecks.
-   Refine UI/UX based on user feedback.

## 3. Key Decisions

### JWT Placement
-   **Decision**: JWTs will primarily be transmitted via the `Authorization: Bearer` header for API requests. Better Auth will manage secure storage (e.g., HTTP-only cookies) on the client side, mitigating XSS risks.
-   **Rationale**: Using `Bearer` tokens in headers is standard for REST APIs and simplifies cross-origin requests. Relying on Better Auth for secure client-side storage is crucial for robustness against XSS.

### Error Handling Strategy
-   **Decision**: Standard HTTP status codes will be used for API responses (e.g., 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 404 Not Found, 422 Unprocessable Entity, 500 Internal Server Error). For unauthorized resource access, `404 Not Found` will be returned instead of `403 Forbidden` to prevent information leakage, as per [Security Requirements, Section IV](../.specify/memory/constitution.md).
-   **Rationale**: Consistent and clear error responses improve API usability and client-side error handling. Returning 404 for unauthorized access to non-existent resources enhances security by obscuring information about other users' data.

### Loading States in UI
-   **Decision**: Implement clear loading indicators (spinners, skeleton screens) for asynchronous operations (e.g., API calls, form submissions) to improve user experience.
-   **Rationale**: Provides visual feedback to users, indicating that the application is processing, and prevents frustrating delays or unresponsive interfaces.

### Responsive Design Approach
-   **Decision**: Implement a mobile-first responsive design using Tailwind CSS utility classes. Breakpoints will be defined and applied consistently across all components and pages.
-   **Rationale**: Ensures optimal user experience across a wide range of devices and screen sizes from the outset. Tailwind CSS facilitates rapid and consistent responsive styling.

## 4. Risks & Mitigation

### JWT Secret Synchronization
-   **Risk**: Mismatch or compromise of `BETTER_AUTH_SECRET` between frontend and backend.
-   **Mitigation**: The secret will be managed via environment variables (`.env.backend.example`, `.env.frontend.example`) and explicitly documented in the [quickstart guide](../specs/002-fullstack-web-todo/quickstart.md) and [research.md](../specs/002-fullstack-web-todo/research.md). Automated checks (e.g., CI/CD) could verify consistency in a production setup.

### User Isolation Bugs
-   **Risk**: A bug in query logic allows users to access or modify other users' data (IDOR vulnerability).
-   **Mitigation**: Strict enforcement of `WHERE user_id = current_user.id` in ALL database queries. Comprehensive [user isolation tests](../specs/002-fullstack-web-todo/checklists/requirements.md) will be written and continuously run as part of the testing strategy.

### Database Migration
-   **Risk**: Data loss or corruption during initial database schema creation or future updates.
-   **Mitigation**: Use SQLModel's schema generation capabilities. For production, leverage a dedicated migration tool (e.g., Alembic) for controlled schema evolution. Implement thorough testing of the data model and migration scripts.

### CORS Configuration
-   **Risk**: Cross-Origin Resource Sharing (CORS) issues blocking frontend-backend communication in development or production.
-   **Mitigation**: Explicitly configure CORS in the FastAPI backend to allow requests from the frontend's domain (e.g., `http://localhost:3000` for development). This will be part of the initial backend setup.

## 5. Testing Strategy

Adhering to the [Constitution v2.0.0, Section VI - Testing Requirements](../.specify/memory/constitution.md), the following testing strategy will be employed:

### Backend Testing (FastAPI + SQLModel)
-   **Unit Tests**: For individual functions, utility modules, and core business logic.
-   **API Integration Tests**: Using FastAPI's `TestClient` to test all API endpoints (GET, POST, PUT, DELETE, PATCH), ensuring correct request/response handling, data validation, and importantly, **user isolation** with different authenticated user contexts. Contract testing against `contracts/tasks.openapi.yaml` and `contracts/auth.openapi.yaml`.
-   **Coverage**: Target 80% code coverage using `pytest-cov`.

### Frontend Testing (Next.js + React Testing Library)
-   **Component Tests**: Using Jest and React Testing Library to ensure individual React components render correctly, respond to user interactions, and display data as expected.
-   **Snapshot Tests**: For critical UI components to detect unintentional UI changes.
-   **Coverage**: Target 80% code coverage using `jest coverage`.

### End-to-End (E2E) Testing
-   **Manual Multi-User Scenarios**: Initially, manual E2E tests will focus on critical user journeys like signup, signin, creating tasks, editing tasks, and crucially, verifying strict **user isolation** by logging in as different users and attempting cross-user data access.
-   **Automated E2E (Future)**: Integrate tools like Cypress or Playwright for automated E2E tests for full user flows (e.g., signup -> login -> create task -> complete task -> logout).

### Security Testing
-   **User Isolation Tests**: Specific tests will be designed to explicitly attempt to breach user data isolation, ensuring that the API correctly returns 404 responses for unauthorized resource access.
-   **Authentication Flow Tests**: Verify the robust functioning of login, logout, token refresh (if implemented), and handling of invalid/expired tokens.

## 6. Deliverables

Upon completion of Phase II, the following deliverables will be achieved:

-   A fully functional local development environment with:
    -   Next.js frontend running on `http://localhost:3000`.
    -   FastAPI backend running on `http://localhost:8000/api`.
    -   Persistent data storage in Neon PostgreSQL.
-   Interactive OpenAPI documentation available at the backend's `/docs` endpoint.
-   A demo application showcasing multi-user capabilities, allowing users to sign up, log in, and manage their personal todo tasks in isolation.
-   Comprehensive test suites for both frontend and backend, meeting code coverage targets.
