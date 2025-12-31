---
id: 1
title: Generate In-Memory Todo App Tasks Checklist
stage: tasks
date: 2025-12-31
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-in-memory-console-todo
branch: 001-in-memory-console-todo
user: user
command: /sp.tasks
labels: ["feature-development", "task-planning"]
links:
  spec: specs/001-in-memory-console-todo/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-in-memory-console-todo/tasks.md
tests:
  null
---

## Prompt

/sp.tasks

Generate a complete, atomic tasks checklist (tasks.md) for implementing Phase I In-Memory Console Todo App.

Base it strictly on:
- Specification: specs/001-in-memory-console-todo/spec.md
- Implementation Plan: specs/001-in-memory-console-todo/plan.md
- Project Constitution

Requirements for tasks.md:
- Use checklist format with unchecked boxes: [ ]
- Create exactly 14–18 small, sequential, atomic tasks
- Each task must be implementable in one code generation step by Claude Code
- Every task must reference the relevant section of spec.md if applicable
- Cover ALL acceptance criteria from spec.md
- Ensure full implementation of the 5 basic features with proper validation and UX

Logical sequence of tasks (follow this order):

1. [ ] Create src folder and initial empty src/todo.py file with module docstring
2. [ ] Initialize global tasks list: tasks = [] and current_id counter
3. [ ] Implement helper function: find_task_by_id(id) → returns task dict or None
4. [ ] Implement helper function: get_next_id() → returns len(tasks) + 1
5. [ ] Implement add_task() function — prompt for title (required) and description (optional), validate title not empty, create task dict, append to tasks, print confirmation with new ID
6. [ ] Implement list_tasks() function — print all tasks with format: ID. [ ] or [x] Title - Description (handle empty list gracefully)
7. [ ] Implement update_task(id) — find task, prompt for new title and/or description, update only if user provides input, skip if empty
8. [ ] Implement delete_task(id) — find task, remove from list, print confirmation or "not found"
9. [ ] Implement toggle_complete(id) — find task, toggle complete bool, print new status or "not found"
10. [ ] Implement basic command parser — split input, handle commands: add, list, update <id>, delete <id>, complete <id>, quit
11. [ ] Add comprehensive input validation — invalid commands, non-integer IDs, empty inputs
12. [ ] Add friendly error messages and help text (e.g., unknown command → show available commands)
13. [ ] Implement main application loop — while True, get input, process command, handle quit/exit
14. [ ] Add full docstrings to all functions with parameters, returns, and examples
15. [ ] Final code polish — PEP 8 compliance, consistent formatting, meaningful variable names
16. [ ] Generate complete README.md with:
    - Project title and phase
    - Setup: uv venv --python 3.13, source .venv/bin/activate
    - Run: python src/todo.py
    - Full list of supported commands with examples
    - Note about in-memory storage (data lost on exit)
17. [ ] Final manual simulation — provide end-to-end console transcript showing all 5 features working perfectly

Create tasks.md automatically in specs/001-in-memory-console-todo/tasks.md
Ensure every acceptance criteria item from spec.md is covered by at least one task.
Do not proceed to implementation yet — just generate the tasks checklist.

## Response snapshot

Generated `specs/001-in-memory-console-todo/tasks.md` with 17 atomic tasks for implementing the In-Memory Console Todo App. The tasks cover all functional and non-functional requirements from the specification.

## Outcome

- ✅ Impact: Tasks checklist generated successfully
- 🧪 Tests: No tests executed for this planning task.
- 📁 Files: Created one file: `specs/001-in-memory-console-todo/tasks.md`
- 🔁 Next prompts: Proceed with implementing the tasks in `specs/001-in-memory-console-todo/tasks.md`.
- 🧠 Reflection: Ensured all acceptance criteria from spec.md are covered and task count is within the specified range.

## Evaluation notes (flywheel)

- Failure modes observed: null
- Graders run and results (PASS/FAIL): null
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
