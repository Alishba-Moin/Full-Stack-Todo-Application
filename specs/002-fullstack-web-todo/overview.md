---
title: Evolution of Todo – Phase II: Full-Stack Web Application Overview
version: 1.0.0
status: In progress
phase: II
feature: 002-fullstack-web-todo
---

# Evolution of Todo – Phase II: Full-Stack Web Application

## Metadata
- **Project Title**: Evolution of Todo – Phase II: Full-Stack Web Application
- **Purpose**: Transform Phase I console app into a multi-user web application with persistent storage and authentication.
- **Current Phase Status**: In progress
- **Version**: 1.0.0

## Purpose
The primary purpose of Phase II is to evolve the existing Phase I in-memory Python CLI Todo application into a robust, multi-user full-stack web application. This involves transitioning from a local, single-user experience to a cloud-native architecture with persistent data storage, user authentication, and a modern web-based user interface.

## Scope
This phase focuses on establishing the core full-stack infrastructure, implementing user management, and porting the basic CRUD task functionality to the new web platform.

## Features
- **Task Management**: All 5 basic CRUD (Create, Read, Update, Delete, List) operations for tasks.
- **User Authentication**:
  - User signup and signin functionality using the Better Auth library.
  - JWT (JSON Web Token)-based authentication for securing API endpoints.
- **User Data Isolation**: Each authenticated user will only be able to view, create, update, and delete their own tasks, ensuring data privacy and security.
- **Responsive Frontend**: A modern, responsive web user interface built with Next.js and styled using Tailwind CSS.
- **Persistent Storage**: Integration with a Neon Serverless PostgreSQL database for durable and scalable task storage.

## Technology Stack Summary
- **Frontend**:
  - **Framework**: Next.js 16+ (utilizing App Router for all routes).
  - **Language**: TypeScript (with strict mode enabled for full type safety).
  - **Styling**: Tailwind CSS (for utility-first styling).
  - **Authentication Client**: Better Auth library with JWT plugin enabled for client-side user sessions and token management.
  - **API Client**: Type-safe API client (e.g., in `lib/api.ts`) for interacting with backend endpoints, including automatic JWT header inclusion.
- **Backend**:
  - **Framework**: FastAPI (for building high-performance API routes).
  - **ORM/Database**: SQLModel (for defining database models and performing queries, leveraging Pydantic v2 for data validation).
  - **Database**: Neon Serverless PostgreSQL (connected via `DATABASE_URL` environment variable).
  - **Package Manager**: UV.
- **Authentication**:
  - **Mechanism**: JWT tokens for backend authorization.
  - **Secret Management**: Shared secret `BETTER_AUTH_SECRET` environment variable between frontend and backend for token signing and verification.
  - **Hashing**: `bcrypt` for secure password hashing (handled by Better Auth).
  - **Security**: All API endpoints protected by JWT validation middleware, except explicitly public ones (e.g., health checks).

## References
- **Project Constitution**: [Version 2.0.0](../.specify/memory/constitution.md)
- **Previous Phase**: Builds upon Phase I, which focused on the in-memory console application. (Reference specs/001-in-memory-console-todo if available)
