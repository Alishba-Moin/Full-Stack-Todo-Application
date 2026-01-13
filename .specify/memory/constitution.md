# The Evolution of Todo - Project Constitution

## Preamble

This Constitution establishes the governing principles, standards, and invariants for **"The Evolution of Todo"** — a multi-phase educational software project demonstrating the evolution of a simple CLI todo application into a cloud-native, AI-powered, event-driven distributed system.

**Core Purpose**: To teach students modern software engineering through Spec-Driven Development (SDD) and AI-assisted implementation, where humans act as architects and AI (Claude Code) performs all coding work.

**Scope of Authority**: This Constitution applies to ALL phases, ALL features, ALL specifications, ALL plans, ALL tasks, and ALL implementations across the entire project lifecycle.

**Supremacy Clause**: If any specification, plan, task, or implementation conflicts with this Constitution, **THE CONSTITUTION WINS**. The conflicting artifact must be rewritten or regenerated.

---
---

## I. Core Principles (NON-NEGOTIABLE)

### 1. Spec-Driven Development Only

**Mandate**: All feature development must follow the strict SDD workflow:

/sp.constitution → /sp.specify → /sp.plan → /sp.tasks → /sp.implement

**Rules**:
- No feature may be implemented without a complete, approved specification
- Humans may NOT manually write feature code
- If generated code is incorrect, refine the SPEC, not the code
- All specifications are versioned and stored in `specs/`
- Every spec must include clear acceptance criteria and test scenarios

**Violations**: Any manually-written feature code is considered non-compliant and must be regenerated through the SDD workflow.

### 2. AI as Primary Developer

**Division of Responsibilities**:

**Humans Must**:
- Write and refine feature specifications
- Review architectural decisions
- Run and validate tests
- Approve changes before merge
- Make final decisions on tradeoffs

**AI (Claude Code) Must**:
- Generate architecture plans from specs
- Write all implementation code
- Create comprehensive test suites
- Perform refactoring and bug fixes
- Document all generated artifacts

**Accountability**: All AI-generated code is traceable to the human-written specification that authorized it.

### 3. Mandatory Traceability

**Requirement**: Every feature must maintain a complete audit trail:

1. **Architecture Decision Record (ADR)** — Why this approach?
2. **Specification** — What are we building?
3. **Architecture Plan** — How will we build it?
4. **Task Breakdown** — What are the specific implementation steps?
5. **Implementation** — The generated code
6. **Test Suite** — Verification of correctness

**Linkage**: All artifacts must cross-reference each other. ADRs link to specs, specs link to plans, plans link to tasks, tasks link to implementations.

**Storage**:
- ADRs → `history/adr/`
- Specs → `specs/<feature>/spec.md`
- Plans → `specs/<feature>/plan.md`
- Tasks → `specs/<feature>/tasks.md`
- PHRs → `history/prompts/`
- Code → `src/`
- Tests → `tests/`

### 4. Test-First Mandate

**Requirement**: Testing is NOT optional.

**Rules**:
- Tests must be generated before or immediately after implementation
- Every feature must have integration tests covering user journeys
- Unit tests required for complex business logic
- All tests must pass before marking a feature complete
- Test coverage must be maintained across refactoring

**Test Types by Phase**:
- **Phase I (CLI)**: Integration tests for command flows, unit tests for core logic
- **Phase II (Web)**: API integration tests, UI component tests, E2E user journeys
- **Phase III+ (Distributed)**: Contract tests, integration tests, chaos testing

### 5. Evolutionary Consistency

**Principle**: Later phases extend but never break earlier phases.

**Rules**:
- Phase II must support all Phase I functionality
- Phase III must preserve Phase I and II semantics
- Breaking changes require explicit ADR and migration plan
- Domain model extensions are additive only

**Verification**: Regression test suites from earlier phases must continue to pass.

## II. Domain Model Governance

### Global Todo Domain Rules

### Base Model (Phase I - Immutable):

**Todo**:
  - `id`: int, auto-increment, unique identifier
  - `title`: str, required, short description
  - `description`: str, optional, detailed text
  - `complete`: bool, default False, boolean status

### Phase II Extensions (Additive):

**Task** (extends Todo):
  - `user_id`: str/UUID, foreign key to users table, required for multi-user
  - `created_at`: timestamp, default now
  - `updated_at`: timestamp, on update now

**Users** (managed by Better Auth):
  - `id`: str/UUID, unique identifier
  - `email`: str, unique
  - `name`: str, optional
  - `password_hash`: str, bcrypt
  - `created_at`: timestamp

**Backward Compatibility**: Phase I in-memory list can migrate to DB with `user_id`.

### Advanced Extensions (Phase III+ - Additive):

  - `due_date`: optional deadline
  - `recurrence`: optional repeat pattern
  - `reminders`: list of reminder configs
  - `assigned_to`: user/agent reference
  - `parent_id`: for subtasks

### Invariants:

- `id` is immutable once assigned
- `complete` is boolean; no intermediate states
- State transitions are explicit and logged
- All timestamps use ISO 8601 format
- All field additions must maintain backward compatibility

### Semantic Consistency:

- "Creating a todo" has the same meaning in CLI, Web UI, API, and AI agent
- "Marking complete" follows identical rules across all interfaces
- Search/filter/sort behavior is consistent across all phases

## III. Technology Governance

### Python Backend Standards

**Requirements**:
- Python 3.13+ required
- Type hints for all public interfaces
- Modular, single-responsibility design
- Separation of concerns: domain logic ≠ infrastructure
- No global mutable state
- Dependency injection for testability

**Forbidden**:
- Mixing business logic with I/O operations
- Hardcoded configuration values
- Circular dependencies between modules
- Undocumented magic numbers or strings

### Phase II Stack Requirements

**Frontend (Next.js 16+)**:
- MUST use App Router (NOT Pages Router) for all routes
- Server Components by default for data fetching
- Client Components only for interactivity (use 'use client' directive sparingly)
- TypeScript strict mode enabled (no any types, full type safety)
- Tailwind CSS for styling (no inline styles, no CSS modules; use className only)
- Better Auth library with JWT plugin enabled for signup/signin
- Type-safe API client (e.g., in lib/api.ts) for calling backend endpoints with JWT headers

**Backend (FastAPI + SQLModel)**:
- FastAPI framework for API routes
- SQLModel ORM for database models and queries (NOT raw SQLAlchemy or SQL)
- Pydantic v2 for request/response validation
- UV package manager for dependencies
- Neon Serverless PostgreSQL as database (connection via DATABASE_URL env var)

**Authentication (CRITICAL NON-NEGOTIABLE)**:
- Better Auth on frontend for user sessions and JWT issuance on login
- JWT tokens for backend auth (include in Authorization: Bearer header)
- Shared secret BETTER_AUTH_SECRET env var between frontend and backend for signing/verification
- Token expiration: 7 days default
- Password hashing: bcrypt (via Better Auth)
- All endpoints protected except public ones (e.g., health check)

### AI Agent Standards (Phase III+)

**Requirements**:
- Natural language inputs must map to existing Todo operations
- Graceful handling of ambiguous commands
- Confirmation prompts for destructive actions
- All agent logic must be spec-driven
- Comprehensive intent recognition testing

**Forbidden**:
- Agents creating undocumented side effects
- Bypassing validation rules
- Silent failures on misunderstood commands

### Cloud & Kubernetes Standards (Phase IV+)

**Requirements**:
- 12-Factor App principles strictly enforced
- All configuration via environment variables
- Secrets stored in external secret managers (never in code/repos)
- Docker images must be reproducible and minimal
- Kubernetes manifests must be declarative (Helm/Kustomize)
- Health checks (liveness, readiness) required
- Resource limits defined for all containers
- Horizontal Pod Autoscaling configured where appropriate

**Forbidden**:
- Hard-coded credentials or API keys
- Imperative `kubectl` commands in production
- Mutable infrastructure
- Unversioned Docker images (no `latest` tag)

## IV. Security Requirements (NEW)

### User Data Isolation
- ALL database queries MUST filter by authenticated `user_id` (e.g., WHERE `user_id` = current_user.id)
- Authorization: ALWAYS verify `user_id` in URL/path matches decoded JWT `user_id` claim to prevent IDOR attacks
- JWT validation middleware on all protected endpoints (use PyJWT or FastAPI deps)
- No user can access/modify another user's data – enforce at API level

### Data Integrity & Protection
- SQL injection prevention: Use SQLModel parameterized queries only
- Return 404 (not 403) for unauthorized resource access to avoid info leaks
- Rate limiting and input validation on all endpoints

## V. Repository Structure (MANDATORY)

### Standard Layout (all phases must conform - Monorepo Evolution):

```
/
├── .claude/commands/
├── .specify/
│   ├── memory/
│   │   └── constitution.md          # THIS FILE
│   ├── templates/                    # SDD templates
│   └── scripts/                      # Automation scripts
├── history/
│   ├── adr/                          # Architecture Decision Records
│   │   └── NNNN-decision-title.md
│   └── prompts/                      # Prompt History Records
│       ├── constitution/
│       ├── <feature-name>/
│       └── general/
├── specs/
│   ├── 002-fullstack-web-todo/       # New for Phase II specs (overview, plan, tasks, etc.)
│   │   ├── spec.md                   # Feature specification
│   │   ├── plan.md                   # Architecture plan
│   │   └── tasks.md                  # Task breakdown
│   └── <feature-name>/
├── frontend/                         # Next.js App
│   ├── CLAUDE.md
│   ├── app/                          # App Router
│   ├── components/
│   ├── lib/
│   └── ...
├── backend/                          # FastAPI App
│   ├── CLAUDE.md
│   ├── src/                          # main.py, models.py, routes/
│   ├── tests/
│   └── ...
├── src/                              # Phase I /src kept as reference
│   └── <phase-name>/
│       ├── core/
│       ├── interfaces/
│       └── infrastructure/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── infra/
│   ├── docker/
│   ├── kubernetes/
│   └── terraform/                    # Infrastructure as Code
├── docs/
│   └── <phase-name>/
│       └── README.md                 # Setup and usage per phase
├── .env.backend.example
├── .env.example
├── .env.frontend.example
├── .gitignore
├── CLAUDE.md                         # Root instructions
├── IMPLEMENTATION_SUMMARY.md
├── README.md                         # Project overview
└── docker-compose.yml
```

**Enforcement**: Evolve existing Phase I structure into monorepo; no new repos or folders for phases. All new phases MUST follow this layout.

## VI. Testing Requirements (UPDATE AND EXPAND)

### Universal Testing Principles
- Keep Phase I unit tests.
- Minimum 80% code coverage target (use `pytest-cov` for backend, `jest coverage` for frontend).

### Phase II Test Types (NEW)
- **API Integration Tests**: Contract testing with FastAPI TestClient.
- **Component Tests**: For React/Next.js components using Jest/React Testing Library.
- **E2E User Journey Tests**: E.g., Cypress or Playwright for full flows like signup + add task.
- **Authentication Flow Tests**: Login, token refresh, unauthorized access.
- **User Isolation Tests**: Security critical: multi-user scenarios, no data leak.

## VII. API-First Principles (NEW)

### API Contract Definition
- API contracts MUST be defined in `specs/api/` before implementation.
- Backend implements API contract first (REST endpoints with OpenAPI/Swagger auto-generated).
- Frontend consumes via type-safe client (e.g., fetch with types).
- Contract breaking changes require ADR (Architecture Decision Record).
- All endpoints include `user_id` in path for isolation.

## VIII. Workflow Enforcement

### SDD Workflow (Strictly Required)

**Step 1: Constitution (`/sp.constitution`)**
- Establish or verify governing principles
- Run ONCE per project or on major pivots

**Step 2: Specify (`/sp.specify`)**
- Write clear, testable feature specification
- Human-authored, AI-assisted refinement
- Stored in `specs/<feature-name>/spec.md`

**Step 3: Plan (`/sp.plan`)**
- AI generates architecture plan from spec
- Identifies significant decisions requiring ADRs
- Stored in `specs/<feature-name>/plan.md`

**Step 4: Tasks (`/sp.tasks`)**
- AI breaks plan into granular, testable tasks
- Each task has clear acceptance criteria
- Stored in `specs/<feature-name>/tasks.md`

**Step 5: Implement (`/sp.implement`)**
- AI generates code from tasks
- AI writes tests
- Human reviews and approves

**Step 6: Record (Automatic)**
- Prompt History Record (PHR) created for session
- ADRs created for significant decisions (on human approval)

**Violations**: Skipping steps or working out-of-order INVALIDATES the work.

### ADR Creation Rules

**When to Create ADRs (Three-Part Test)**:
- **Impact**: Does this have long-term consequences? (framework choice, data model, API design, security approach, platform selection)
- **Alternatives**: Were multiple viable options considered with tradeoffs?
- **Scope**: Is this cross-cutting or architecturally significant?

If ALL THREE = YES: Suggest ADR creation

**Format**: "📋 Architectural decision detected: [brief]. Document reasoning and tradeoffs? Run `/sp.adr [decision-title]`"

**Process**:
- Wait for human consent
- NEVER auto-create ADRs
- Group related decisions (e.g., "authentication stack") into one ADR when appropriate
- Store in `/history/adr/NNNN-decision-title.md`

## IX. Human-AI Collaboration Contract

### Human as Architect

**Humans are responsible for**:
- Strategic direction
- Requirement gathering
- Specification authoring
- Architecture review and approval
- Final decision-making on tradeoffs
- Quality assurance and acceptance testing

**Humans must NOT**:
- Write feature implementation code
- Skip the SDD workflow
- Override the Constitution without amendment
- Deploy untested or unreviewed code

### AI as Developer

**AI is responsible for**:
- Code generation from approved specs
- Test suite creation
- Refactoring and optimization
- Documentation generation
- Bug fixing (when spec is clarified)

**AI must NOT**:
- Make architectural decisions without human approval
- Proceed with ambiguous requirements (MUST ask for clarification)
- Skip testing or quality checks
- Auto-approve its own work

### Escalation Protocol

**When AI encounters**:
- Ambiguous requirements → Ask 2-3 targeted clarifying questions
- Conflicting constraints → Present options with tradeoffs, request decision
- Unforeseen dependencies → Surface them, ask for prioritization
- Technical blockers → Document the issue, suggest alternatives

**Human Response Time**: AI SHOULD wait for human input rather than making assumptions.

## X. Academic & Professional Integrity

### Honesty Requirements

**Commitments**:
- All code originates from AI, guided by human-authored specs
- No copy-paste from external sources without attribution
- No plagiarism of specifications or designs
- All work is reproducible by another developer or AI agent

### Attribution:

- AI-generated code clearly marked (e.g., commit messages, code comments)
- Third-party libraries and frameworks documented
- Inspiration or reference materials cited

### Educational Value:

- Students learn architecture and specification skills
- Students understand AI capabilities and limitations
- Students gain experience in human-AI collaboration
- Students develop systems thinking and design judgment

## XI. Versioning & Change Management

### Constitution Amendments

**Process**:
- Propose amendment with justification
- Document impact on existing phases
- Create ADR for the constitutional change
- Require explicit approval
- Update version number
- Communicate to all project stakeholders

**Versioning**: MAJOR.MINOR.PATCH
- **MAJOR**: Fundamental principle changes, breaking compatibility (e.g., 1.0.0 -> 2.0.0 for Phase II)
- **MINOR**: New principles or clarifications
- **PATCH**: Typo fixes, formatting improvements

### Specification Versioning

**Rules**:
- All specs are immutable once approved
- Changes require new version in `specs/`
- Version format: `spec-v2.md`, `spec-v3.md`
- Link to superseded versions for audit trail

## XII. Governance & Enforcement

### Constitution Supremacy

**Conflict Resolution Order**:
- **Constitution (this document)** — HIGHEST AUTHORITY
- Architecture Decision Records (ADRs)
- Feature Specifications
- Architecture Plans
- Task Breakdowns
- Implementation Code — LOWEST AUTHORITY

**Rule**: If any lower-level artifact conflicts with a higher-level one, the higher-level artifact WINS. The conflicting item MUST be rewritten.

### Compliance Verification

**Required Checks (before merging)**:
- Spec exists and is approved ✓
- Plan exists and links to spec ✓
- Tasks exist and link to plan ✓
- ADRs exist for significant decisions ✓
- Tests pass ✓
- Code review completed ✓
- PHR created ✓
- No Constitution violations ✓

### Enforcement Mechanisms:

- Pre-commit hooks validate structure
- CI/CD pipelines verify tests pass
- Code review checklist includes Constitution compliance
- AI agents REFUSE to proceed with non-compliant requests

### Review & Audit

**Regular Reviews**:
- Monthly audit of PHRs and ADRs for completeness
- Quarterly review of Constitution effectiveness
- Annual assessment of phase evolution progress

**Metrics**:
- Spec compliance rate
- Test coverage percentage
- ADR creation for significant decisions
- Time from spec approval to implementation

## XIII. Final Authority

This Constitution represents the governing law of The Evolution of Todo project.

**Ratification**: This Constitution is in effect immediately upon creation.

**Amendment Authority**: Amendments require documented justification, ADR, and explicit approval.

**Interpretation**: In case of ambiguity, the spirit of Spec-Driven Development and human-AI collaboration governs.

**Non-Compliance**: Work that violates this Constitution MUST be rejected and regenerated according to SDD principles.

**Version**: 2.0.0
**Rationale for MAJOR bump**: New stack, auth mandates, monorepo, schema extensions.
**Ratified**: 2026-01-02
**Last Amended**: 2026-01-02
**Status**: Active and Binding

---

*"Spec first, code second. Human architects, AI builds. Evolution through discipline."'*