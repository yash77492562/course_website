export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  status_code: number;
  message: string;
  data?: T;
}

export interface LoginResponse extends ApiResponse {
  data: {
    access_token: string;
    refresh_token: string;
  };
}

export interface RefreshTokenResponse extends ApiResponse {
  // `data` is absent when there is no active session to refresh (401 for
  // anonymous visitors), so it is optional rather than guaranteed.
  data?: {
    access_token: string;
    refresh_token: string;
  };
}

export interface ProfileResponse extends ApiResponse {
  data: User;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
