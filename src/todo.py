"""
Phase I: In-Memory Console Todo App

A clean, professional, and user-friendly command-line Todo application built strictly according to 
"Evolution of Todo" hackathon requirements. All data is stored in-memory only (lost on exit).

Features:
- Add Task (title + optional description)
- View Task List with clear status indicators
- Update Task
- Delete Task
- Toggle Complete/Incomplete

Enhanced with ANSI colors and bold formatting for a modern terminal experience.
"""

from typing import Optional

# In-memory storage
tasks: list[dict] = []
task_id_counter: int = 1

# ANSI Escape Codes for Professional Styling
class Style:
    RESET = "\033[0m"
    BOLD = "\033[1m"
    DIM = "\033[2m"
    
    # Colors
    CYAN = "\033[96m"
    GREEN = "\033[92m"
    RED = "\033[91m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    MAGENTA = "\033[95m"
    
    # Backgrounds (optional subtle use)
    BG_CYAN = "\033[46m"
    BG_GREEN = "\033[42m"

def print_header(title: str) -> None:
    """Prints a bold, cyan, centered header with padding."""
    print(f"\n{Style.CYAN}{Style.BOLD}╔{'═' * 50}╗{Style.RESET}")
    print(f"{Style.CYAN}{Style.BOLD}║{title.center(50)}║{Style.RESET}")
    print(f"{Style.CYAN}{Style.BOLD}╚{'═' * 50}╝{Style.RESET}\n")

def print_success(message: str) -> None:
    print(f"{Style.GREEN}{Style.BOLD}✓ {message}{Style.RESET}")

def print_error(message: str) -> None:
    print(f"{Style.RED}{Style.BOLD}✗ {message}{Style.RESET}")

def print_info(message: str) -> None:
    print(f"{Style.YELLOW}{Style.BOLD}ℹ {message}{Style.RESET}")

def find_task_by_id(task_id: int) -> Optional[dict]:
    """Return task dict if found, otherwise None."""
    for task in tasks:
        if task["id"] == task_id:
            return task
    return None

def add_task() -> None:
    """Add a new task with validation."""
    print_header("Add New Task")
    
    while True:
        title = input(f"{Style.BLUE}Title (required): {Style.RESET}").strip()
        if title:
            break
        print_error("Title cannot be empty. Please try again.")
    
    description = input(f"{Style.BLUE}Description (optional): {Style.RESET}").strip()
    
    global task_id_counter
    new_task = {
        "id": task_id_counter,
        "title": title,
        "description": description or "No description",
        "complete": False
    }
    tasks.append(new_task)
    print_success(f"Task added successfully! ID: {Style.BOLD}{task_id_counter}{Style.RESET}")
    task_id_counter += 1

def list_tasks() -> None:
    """Display all tasks in a clean table format."""
    print_header("Your Todo List")
    
    if not tasks:
        print_info("Your list is empty. Add a task to get started!")
        return
    
    # Table Header
    print(f"{Style.BOLD}{'ID':<4} {'Status':<12} {'Title':<35} Description{Style.RESET}")
    print(f"{Style.DIM}{'─' * 80}{Style.RESET}")
    
    for task in tasks:
        status = "Complete" if task["complete"] else "Pending"
        status_icon = "✓" if task["complete"] else "○"
        status_color = Style.GREEN if task["complete"] else Style.YELLOW
        
        print(f"{Style.BOLD}{task['id']:<4}{Style.RESET} "
              f"{status_color}{status_icon} {status:<10}{Style.RESET} "
              f"{Style.BOLD}{task['title']:<35}{Style.RESET} "
              f"{Style.DIM}{task['description']}{Style.RESET}")

def update_task() -> None:
    """Update title or description of an existing task."""
    print_header("Update Task")
    
    try:
        task_id = int(input(f"{Style.BLUE}Enter task ID: {Style.RESET}"))
        task = find_task_by_id(task_id)
        
        if not task:
            print_error(f"No task found with ID {task_id}.")
            return
        
        print(f"{Style.DIM}Current → {Style.BOLD}{task['title']}{Style.RESET} — {task['description']}")
        
        new_title = input(f"{Style.BLUE}New title (Enter to keep): {Style.RESET}").strip()
        new_desc = input(f"{Style.BLUE}New description (Enter to keep): {Style.RESET}").strip()
        
        if new_title:
            task["title"] = new_title
        if new_desc:
            task["description"] = new_desc or "No description"
        
        print_success(f"Task {task_id} updated successfully!")
    
    except ValueError:
        print_error("Invalid ID. Please enter a valid number.")

def delete_task() -> None:
    """Delete a task by ID."""
    print_header("Delete Task")
    
    try:
        task_id = int(input(f"{Style.BLUE}Enter task ID: {Style.RESET}"))
        task = find_task_by_id(task_id)
        
        if not task:
            print_error(f"No task found with ID {task_id}.")
            return
        
        tasks.remove(task)
        print_success(f"Task '{task['title']}' (ID {task_id}) deleted.")
    
    except ValueError:
        print_error("Invalid ID. Please enter a valid number.")

def toggle_complete() -> None:
    """Toggle completion status of a task."""
    print_header("Toggle Complete")
    
    try:
        task_id = int(input(f"{Style.BLUE}Enter task ID: {Style.RESET}"))
        task = find_task_by_id(task_id)
        
        if not task:
            print_error(f"No task found with ID {task_id}.")
            return
        
        task["complete"] = not task["complete"]
        status = "complete" if task["complete"] else "pending"
        print_success(f"Task '{task['title']}' marked as {status}.")
    
    except ValueError:
        print_error("Invalid ID. Please enter a valid number.")

def show_help() -> None:
    """Display available commands in a neat format."""
    print_header("Help – Available Commands")
    commands = [
        ("add", "Add a new task"),
        ("list", "View all tasks"),
        ("update", "Update a task by ID"),
        ("delete", "Delete a task by ID"),
        ("complete", "Toggle task completion"),
        ("help", "Show this help menu"),
        ("quit", "Exit the application")
    ]
    for cmd, desc in commands:
        print(f"  {Style.CYAN}{Style.BOLD}{cmd.ljust(10)}{Style.RESET} → {desc}")

def main() -> None:
    """Main application loop with command-line interface."""
    print(f"{Style.MAGENTA}{Style.BOLD}"
          r"""
   _____ _     _ _         _____         _       
  |_   _| |__ (_) | ___   |_   _|__   __| | ___  
    | | | '_ \| | |/ _ \    | |/ _ \ / _` |/ _ \ 
    | | | | | | | | (_) |   | | (_) | (_| | (_) |
    |_| |_| |_|_|_|\___/    |_|\___/ \__,_|\___/ 
          """ + f"{Style.RESET}")
    print(f"{Style.CYAN}{Style.BOLD}Phase I – In-Memory Console Todo App{Style.RESET}")
    print(f"{Style.DIM}Type 'help' for commands • Data is in-memory only{Style.RESET}\n")
    
    while True:
        try:
            cmd = input(f"{Style.BLUE}{Style.BOLD}> {Style.RESET}").strip().lower()
            
            if cmd in ["add", "a"]:
                add_task()
            elif cmd in ["list", "l", "view"]:
                list_tasks()
            elif cmd in ["update", "u"]:
                update_task()
            elif cmd in ["delete", "d"]:
                delete_task()
            elif cmd in ["complete", "c", "toggle"]:
                toggle_complete()
            elif cmd in ["help", "h", "?"]:
                show_help()
            elif cmd in ["quit", "q", "exit"]:
                print(f"\n{Style.GREEN}{Style.BOLD}Thank you for using Todo App. Goodbye! 👋{Style.RESET}\n")
                break
            elif cmd == "":
                continue
            else:
                print_error(f"Unknown command '{cmd}'. Type 'help' for options.")
                
        except KeyboardInterrupt:
            print(f"\n{Style.YELLOW}Application interrupted. Goodbye!{Style.RESET}")
            break
        except EOFError:
            print(f"\n{Style.GREEN}Goodbye!{Style.RESET}")
            break

if __name__ == "__main__":
    main()