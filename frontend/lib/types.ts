// TypeScript interfaces for the Todo application

export interface User {
    id: string; // UUID
    email: string;
    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
  }
  
  export interface Task {
    id: number;
    user_id: string; // UUID
    title: string;
    description: string | null;
    completed: boolean;
    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
  }
  
  // Authentication types
  export interface RegisterRequest {
    email: string;
    password: string;
  }
  
  export interface RegisterResponse {
    message: string;
    user_id: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    access_token: string;
    token_type: string;
    user: User;
  }
  
  // Task CRUD types
  export interface TaskCreateRequest {
    title: string;
    description?: string;
  }
  
  export interface TaskUpdateRequest {
    title: string;
    description: string | null;
    completed: boolean;
  }
  
  export interface TaskPatchRequest {
    completed?: boolean;
  }
  
  export interface TaskResponse {
    id: number;
    user_id: string;
    title: string;
    description: string | null;
    completed: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface TaskListResponse {
    tasks: Task[];
    total: number;
  }
  
  // Error types
  export interface APIError {
    detail: string;
    status?: number;
  }