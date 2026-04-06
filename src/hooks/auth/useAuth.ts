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

// Global refresh promise to prevent race conditions
let refreshPromise: Promise<void> | null = null;

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Refresh access token using refresh token
   * Uses a global promise to prevent concurrent refresh requests
   */
  const refreshAccessToken = useCallback(async () => {
    // If refresh is already in progress, wait for it to complete
    if (refreshPromise) {
      console.log('⏸️ Refresh already in progress, waiting for it to complete...');
      await refreshPromise;
      return;
    }

    const refreshToken = tokenManager.getRefreshToken();
    
    if (!refreshToken) {
      console.log('⚠️ No refresh token found');
      setUser(null);
      setAccessToken(null);
      return;
    }

    // Check if refresh token is expired
    if (tokenManager.isTokenExpired(refreshToken)) {
      console.log('⚠️ Refresh token expired - user must login again');
      tokenManager.clearAll();
      setUser(null);
      setAccessToken(null);
      return;
    }

    try {
      // Create a new refresh promise
      refreshPromise = (async () => {
        // Store old token for comparison
        const oldToken = accessToken;
        console.log('🔄 Refreshing access token...');
        if (oldToken) {
          console.log('📝 Old access token:', oldToken.substring(0, 50) + '...');
          // Decode old token to see JTI
          try {
            const oldPayload = JSON.parse(atob(oldToken.split('.')[1]));
            console.log('🔑 Old JTI:', oldPayload.jti);
          } catch (e) {}
        }
        
        const response = await authApi.refreshToken(refreshToken);
        
        if (response.success && response.data?.access_token) {
          const newToken = response.data.access_token;
          console.log('✅ New access token received:', newToken.substring(0, 50) + '...');
          
          // Decode new token to see JTI
          let newJti = 'unknown';
          try {
            const newPayload = JSON.parse(atob(newToken.split('.')[1]));
            newJti = newPayload.jti;
            console.log('🔑 New JTI:', newJti);
          } catch (e) {}
          
          const tokensMatch = oldToken === newToken;
          console.log('🔄 Token changed:', tokensMatch ? 'NO ❌' : 'YES ✅');
          
          // Show last 10 chars of each token for comparison
          if (oldToken) {
            console.log('📊 Token comparison:');
            console.log('   Old token ends with:', oldToken.slice(-10));
            console.log('   New token ends with:', newToken.slice(-10));
            console.log('   Tokens are identical:', tokensMatch ? 'YES (BUG!)' : 'NO (CORRECT)');
          }
          
          setAccessToken(newToken);
          tokenManager.setAccessToken(newToken); // Store in tokenManager
          
          // Fetch user profile with new access token
          console.log('👤 Fetching user profile with new access token...');
          const profileResponse = await authApi.getProfile(newToken);
          if (profileResponse.success && profileResponse.data) {
            setUser(profileResponse.data);
            console.log('✅ User profile refreshed');
          }
        }
      })();

      await refreshPromise;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      tokenManager.clearAll();
      setUser(null);
      setAccessToken(null);
    } finally {
      refreshPromise = null; // Clear the promise
    }
  }, [accessToken]);

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
   * For 1-day tokens, refresh when less than 1 hour remaining
   * For shorter tokens (testing), refresh when less than 10 seconds remaining
   */
  useEffect(() => {
    if (!accessToken) return;

    const checkInterval = setInterval(() => {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const exp = payload.exp * 1000;
        const timeUntilExpiry = exp - Date.now();
        const secondsUntilExpiry = Math.floor(timeUntilExpiry / 1000);
        
        console.log('⏰ Token check - Time until expiry:', secondsUntilExpiry, 'seconds');
        console.log('📝 Current access token:', accessToken.substring(0, 20) + '...');
        
        // Determine refresh threshold based on token lifetime
        const tokenLifetime = exp - (payload.iat * 1000);
        let refreshThreshold;
        
        if (tokenLifetime > 60 * 60 * 1000) {
          // Token lifetime > 1 hour: refresh when 1 hour remaining
          refreshThreshold = 60 * 60 * 1000;
        } else if (tokenLifetime > 10 * 60 * 1000) {
          // Token lifetime > 10 minutes: refresh when 5 minutes remaining
          refreshThreshold = 5 * 60 * 1000;
        } else {
          // Short-lived token: refresh when 10 seconds remaining
          refreshThreshold = 10 * 1000;
        }
        
        // Refresh if within threshold or expired
        if (timeUntilExpiry < refreshThreshold && timeUntilExpiry > 0) {
          console.log(`⚠️ Access token expiring soon (${secondsUntilExpiry}s remaining) - auto-refreshing...`);
          refreshAccessToken();
        } else if (timeUntilExpiry <= 0) {
          console.log('❌ Access token expired - refreshing now...');
          refreshAccessToken();
        }
      } catch (error) {
        console.error('❌ Token check failed:', error);
      }
    }, 5 * 60 * 1000); // Check every 5 minutes for production (1-day tokens)

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

      const { access_token, refresh_token } = response.data;

      console.log('🔐 Login successful');
      console.log('📝 Access token received:', access_token.substring(0, 20) + '...');
      console.log('📝 Refresh token stored in localStorage');

      // Store tokens
      setAccessToken(access_token);
      tokenManager.setAccessToken(access_token); // Store in tokenManager
      tokenManager.setRefreshToken(refresh_token);

      // Fetch user profile with access token
      console.log('👤 Fetching user profile with access token...');
      const profileResponse = await authApi.getProfile(access_token);
      if (profileResponse.success && profileResponse.data) {
        setUser(profileResponse.data);
        console.log('✅ User profile loaded:', profileResponse.data.email);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
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

      const { access_token, refresh_token } = response.data;

      console.log('🔐 Registration successful');
      console.log('📝 Access token received:', access_token.substring(0, 20) + '...');
      console.log('📝 Refresh token stored in localStorage');

      // Store tokens
      setAccessToken(access_token);
      tokenManager.setAccessToken(access_token); // Store in tokenManager
      tokenManager.setRefreshToken(refresh_token);

      // Fetch user profile with access token
      console.log('👤 Fetching user profile with access token...');
      const profileResponse = await authApi.getProfile(access_token);
      if (profileResponse.success && profileResponse.data) {
        setUser(profileResponse.data);
        console.log('✅ User profile loaded:', profileResponse.data.email);
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
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
