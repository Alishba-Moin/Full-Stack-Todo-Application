// Authentication utilities for JWT token management
// Note: Using manual JWT token management instead of Better Auth for Phase II MVP

import { api, setAuthToken, setUserId, removeAuthToken, getUserId, getAuthToken } from './api';
import type { LoginRequest, RegisterRequest } from './types';

// Check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('auth_token');
  const userId = localStorage.getItem('user_id');
  return !!(token && userId);
}

// Get current user ID
export function getCurrentUserId(): string | null {
  return getUserId();
}

// Register new user
export async function register(email: string, password: string): Promise<{ success: boolean; message: string; userId?: string }> {
  try {
    const response = await api.registerUser({ email, password });
    return {
      success: true,
      message: response.message,
      userId: response.user_id,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Registration failed',
    };
  }
}

// Login user
export async function login(email: string, password: string): Promise<{ success: boolean; message: string; userId?: string }> {
  try {
    const response = await api.loginUser({ email, password });
    return {
      success: true,
      message: 'Login successful',
      userId: response.user.id,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Login failed',
    };
  }
}

// Logout user
export function logout(): void {
  api.logout();
}

// Redirect to login if not authenticated (for client-side route protection)
export function requireAuth(): void {
  if (typeof window === 'undefined') return;

  if (!isAuthenticated()) {
    window.location.href = '/login';
  }
}

// Get auth token (for debugging/testing)
export function getToken(): string | null {
  return getAuthToken();
}