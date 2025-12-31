# Tasks for Phase I: In-Memory Console Todo App

This checklist outlines the atomic tasks for implementing the In-Memory Console Todo App, based on the `specs/001-in-memory-console-todo/spec.md` and Project Constitution.

- [ ] 1. Create `src` folder and initial empty `src/todo.py` file with module docstring.
- [ ] 2. Initialize global `tasks` list as an empty list and `current_id` counter within `src/todo.py`.
- [ ] 3. Implement helper function `find_task_by_id(task_id)` in `src/todo.py` to return a task dictionary or `None`.
- [ ] 4. Implement helper function `get_next_id()` in `src/todo.py` to return `len(tasks) + 1`.
- [ ] 5. Implement `add_task(title, description=None)` function in `src/todo.py` to prompt for title/description, validate title, create task dict, append to `tasks`, and print confirmation. (spec.md:9, 17, 38)
- [ ] 6. Implement `list_tasks()` function in `src/todo.py` to print all tasks with ID, status, title, and description, handling empty list and empty descriptions. (spec.md:10, 18, 39)
- [ ] 7. Implement `update_task(task_id)` function in `src/todo.py` to find task by ID, prompt for new title/description, and update only if input is provided.
- [ ] 8. Implement `delete_task(task_id)` function in `src/todo.py` to find and remove a task by ID, printing confirmation or "not found". (spec.md:12, 20, 41)
- [ ] 9. Implement `toggle_complete(task_id)` function in `src/todo.py` to find a task by ID, toggle its `completed` status, and print the new status or "not found". (spec.md:11, 19, 40)
- [ ] 10. Implement a `parse_command(user_input)` function in `src/todo.py` to split input into command and arguments, handling `add`, `list`, `update`, `delete`, `complete`, `quit`. (spec.md:38-42)
- [ ] 11. Enhance `parse_command` and related functions with comprehensive input validation for unknown commands, non-integer IDs, and missing required arguments.
- [ ] 12. Add friendly error messages and help text within `src/todo.py` (e.g., for unknown commands, invalid IDs). (spec.md:27)
- [ ] 13. Implement the main application loop in `src/todo.py` to continuously get user input, process commands, and handle the `quit`/`exit` command. (spec.md:13, 21, 42)
- [ ] 14. Add full docstrings for all functions (`add_task`, `list_tasks`, `update_task`, `delete_task`, `toggle_complete`, `find_task_by_id`, `get_next_id`, `parse_command`, `main` loop) in `src/todo.py`. (spec.md:28)
- [ ] 15. Perform final code polish on `src/todo.py` for PEP 8 compliance, consistent formatting, and meaningful variable names. (spec.md:28)
- [ ] 16. Generate a complete `README.md` in the project root with project title, phase, setup/run instructions, list of supported commands with examples, and a note about in-memory storage. (spec.md:22, 38-42)
- [ ] 17. Perform a final manual simulation, providing an end-to-end console transcript showing all 5 features working perfectly, demonstrating task adding, listing, updating, deleting, and toggling completion. (spec.md:9-13, 17-20)
