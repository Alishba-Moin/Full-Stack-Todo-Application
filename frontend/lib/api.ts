// Type-safe API client for communicating with FastAPI backend

import type {
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    LoginResponse,
    Task,
    TaskCreateRequest,
    TaskUpdateRequest,
    TaskPatchRequest,
    APIError,
  } from './types';
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  // Get JWT token from localStorage (Better Auth will manage this)
  export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }
  
  // Set JWT token in localStorage
  export function setAuthToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  }
  
  // Remove JWT token from localStorage
  export function removeAuthToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
  }
  
  // Get user ID from localStorage
  export function getUserId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('user_id');
  }
  
  // Set user ID in localStorage
  export function setUserId(userId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user_id', userId);
  }
  
  // Generic request handler with error handling
  async function request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };
  
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
  
      // Handle 401 Unauthorized - redirect to login
      if (response.status === 401) {
        removeAuthToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login?error=session_expired';
        }
        throw new Error('Session expired. Please log in again.');
      }
  
      // Handle 404 Not Found
      if (response.status === 404) {
        throw new Error('Resource not found');
      }
  
      // Handle other error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          detail: `API Error: ${response.statusText}`,
        }));
        throw new Error(errorData.detail || `API Error: ${response.statusText}`);
      }
  
      // Handle 204 No Content (e.g., DELETE responses)
      if (response.status === 204) {
        return {} as T;
      }
  
      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network request failed. Please try again.');
    }
  }
  
  // Authentication API methods
  export const api = {
    // Register new user
    async registerUser(data: RegisterRequest): Promise<RegisterResponse> {
      return request<RegisterResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  
    // Login user
    async loginUser(data: LoginRequest): Promise<LoginResponse> {
      const response = await request<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
  
      // Store token and user_id after successful login
      if (response.access_token) {
        setAuthToken(response.access_token);
        setUserId(response.user.id);
      }
  
      return response;
    },
  
    // Logout user (client-side only)
    logout(): void {
      removeAuthToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
  
    // Task CRUD operations
  
    // Get all tasks for a user
    async listTasks(userId: string): Promise<Task[]> {
      const response = await request<{ tasks: Task[] }>(`/api/${userId}/tasks`);
      return response.tasks;
    },
  
    // Get single task
    async getTask(userId: string, taskId: number): Promise<Task> {
      return request<Task>(`/api/${userId}/tasks/${taskId}`);
    },
  
    // Create new task
    async createTask(userId: string, data: TaskCreateRequest): Promise<Task> {
      return request<Task>(`/api/${userId}/tasks`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  
    // Update task (full replacement)
    async updateTask(
      userId: string,
      taskId: number,
      data: TaskUpdateRequest
    ): Promise<Task> {
      return request<Task>(`/api/${userId}/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
  
    // Patch task (partial update - for toggling completion)
    async patchTask(
      userId: string,
      taskId: number,
      data: TaskPatchRequest
    ): Promise<Task> {
      return request<Task>(`/api/${userId}/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
  
    // Toggle task completion
    async toggleTaskComplete(userId: string, taskId: number): Promise<Task> {
      // First get the current task to know its completion state
      const currentTask = await this.getTask(userId, taskId);
      return this.patchTask(userId, taskId, { completed: !currentTask.completed });
    },
  
    // Delete task
    async deleteTask(userId: string, taskId: number): Promise<void> {
      return request<void>(`/api/${userId}/tasks/${taskId}`, {
        method: 'DELETE',
      });
    },
  };