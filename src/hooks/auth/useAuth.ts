'use client';

import { useState, useEffect, useCallback } from 'react';
import { authApi } from '@/lib/api/auth/authApi';
import { tokenManager } from '@/lib/utils/tokenManager/tokenManager';
import type { User, LoginRequest, RegisterRequest } from '@/types/auth/auth.types';

interface UseAuthReturn {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Refresh access token using refresh token
   */
  const refreshAccessToken = useCallback(async () => {
    const refreshToken = tokenManager.getRefreshToken();
    
    if (!refreshToken) {
      setUser(null);
      setAccessToken(null);
      return;
    }

    // Check if refresh token is expired
    if (tokenManager.isTokenExpired(refreshToken)) {
      tokenManager.clearAll();
      setUser(null);
      setAccessToken(null);
      return;
    }

    try {
      const response = await authApi.refreshToken(refreshToken);
      
      if (response.success && response.data?.access_token) {
        setAccessToken(response.data.access_token);
        
        // Fetch user profile with new access token
        const profileResponse = await authApi.getProfile(response.data.access_token);
        if (profileResponse.success && profileResponse.data) {
          setUser(profileResponse.data);
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      tokenManager.clearAll();
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      const refreshToken = tokenManager.getRefreshToken();
      
      if (refreshToken && !tokenManager.isTokenExpired(refreshToken)) {
        await refreshAccessToken();
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, [refreshAccessToken]);

  /**
   * Auto-refresh access token before expiry
   */
  useEffect(() => {
    if (!accessToken) return;

    // Refresh 5 minutes before expiry
    const checkInterval = setInterval(() => {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const exp = payload.exp * 1000;
        const timeUntilExpiry = exp - Date.now();
        
        // Refresh if less than 5 minutes remaining
        if (timeUntilExpiry < 5 * 60 * 1000) {
          refreshAccessToken();
        }
      } catch (error) {
        console.error('Token check failed:', error);
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [accessToken, refreshAccessToken]);

  /**
   * Login user
   */
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = await authApi.login(credentials);
      
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const { user: userData, access_token, refresh_token } = response.data;

      // Store tokens
      setAccessToken(access_token);
      tokenManager.setRefreshToken(refresh_token);
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  /**
   * Register new user
   */
  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const response = await authApi.register(data);
      
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }

      const { user: userData, access_token, refresh_token } = response.data;

      // Store tokens
      setAccessToken(access_token);
      tokenManager.setRefreshToken(refresh_token);
      setUser(userData);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      if (accessToken) {
        await authApi.logout(accessToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state regardless of API call result
      tokenManager.clearAll();
      setUser(null);
      setAccessToken(null);
    }
  }, [accessToken]);

  return {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    login,
    register,
    logout,
    refreshAccessToken,
  };
}
