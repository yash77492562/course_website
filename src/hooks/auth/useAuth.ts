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
        // Store old token for comparison (get from storage, not state)
        const oldToken = tokenManager.getAccessToken();
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔄 REFRESHING ACCESS TOKEN');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        if (oldToken) {
          try {
            const oldPayload = JSON.parse(atob(oldToken.split('.')[1]));
            const oldExp = new Date(oldPayload.exp * 1000);
            console.log('📝 Old token JTI:', oldPayload.jti);
            console.log('⏰ Old token expires:', oldExp.toLocaleString());
          } catch (e) {
            console.error('❌ Failed to decode old token');
          }
        }
        
        const response = await authApi.refreshToken(refreshToken);
        
        if (response.success && response.data?.access_token) {
          const newToken = response.data.access_token;
          
          try {
            const newPayload = JSON.parse(atob(newToken.split('.')[1]));
            const newIat = new Date(newPayload.iat * 1000);
            const newExp = new Date(newPayload.exp * 1000);
            const timeUntilExpiry = newExp.getTime() - Date.now();
            const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60000);
            
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('✅ NEW ACCESS TOKEN RECEIVED');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🔑 New token JTI:', newPayload.jti);
            console.log('📅 Issued at:', newIat.toLocaleString());
            console.log('⏰ Expires at:', newExp.toLocaleString());
            console.log('⏳ Valid for:', minutesUntilExpiry, 'minutes');
            
            const tokensMatch = oldToken === newToken;
            if (tokensMatch) {
              console.log('⚠️ WARNING: New token is identical to old token (BUG!)');
            } else {
              console.log('✅ Token successfully refreshed (tokens are different)');
            }
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          } catch (e) {
            console.error('❌ Failed to decode new token');
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
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ TOKEN REFRESH FAILED');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('Error:', error);
      console.error('User must login again');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      tokenManager.clearAll();
      setUser(null);
      setAccessToken(null);
    } finally {
      refreshPromise = null; // Clear the promise
    }
  }, []); // Remove accessToken dependency

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      console.log('🔄 Initializing auth state...');
      const refreshToken = tokenManager.getRefreshToken();
      const storedAccessToken = tokenManager.getAccessToken();
      
      // If we have a stored access token that's not expired, use it
      if (storedAccessToken && !tokenManager.isTokenExpired(storedAccessToken)) {
        console.log('✅ Found valid access token in storage');
        setAccessToken(storedAccessToken);
        
        // Fetch user profile
        try {
          const profileResponse = await authApi.getProfile(storedAccessToken);
          if (profileResponse.success && profileResponse.data) {
            setUser(profileResponse.data);
            console.log('✅ User profile loaded from stored token');
          }
        } catch (error) {
          console.error('❌ Failed to load profile with stored token');
        }
        
        setIsLoading(false);
        return;
      }
      
      // If access token is expired but we have a valid refresh token, refresh it
      if (refreshToken && !tokenManager.isTokenExpired(refreshToken)) {
        console.log('🔄 Access token expired, refreshing with refresh token...');
        try {
          await refreshAccessToken();
        } catch (error) {
          console.error('❌ Failed to refresh token on init');
        }
      } else {
        console.log('⚠️ No valid tokens found');
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []); // Empty dependency array - only run once on mount

  /**
   * Auto-refresh access token before expiry
   * Access token: 1 hour (refresh at 10 minutes before expiry)
   * Refresh token: 7 days (user must login again after 7 days)
   */
  useEffect(() => {
    if (!accessToken) return;

    // Log token info on mount
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const iat = new Date(payload.iat * 1000);
      const exp = new Date(payload.exp * 1000);
      const now = new Date();
      const timeUntilExpiry = exp.getTime() - now.getTime();
      const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60000);
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔐 ACCESS TOKEN INFO');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📅 Issued at:', iat.toLocaleString());
      console.log('⏰ Expires at:', exp.toLocaleString());
      console.log('⏳ Time until expiry:', minutesUntilExpiry, 'minutes');
      console.log('🔑 JTI:', payload.jti);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Check refresh token
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        try {
          const refreshPayload = JSON.parse(atob(refreshToken.split('.')[1]));
          const refreshExp = new Date(refreshPayload.exp * 1000);
          const timeUntilRefreshExpiry = refreshExp.getTime() - now.getTime();
          const daysUntilRefreshExpiry = Math.floor(timeUntilRefreshExpiry / 86400000);
          
          console.log('🔄 REFRESH TOKEN INFO');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('⏰ Expires at:', refreshExp.toLocaleString());
          console.log('⏳ Time until expiry:', daysUntilRefreshExpiry, 'days');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        } catch (e) {
          // Just log warning - don't clear tokens during info display
          // Tokens will be cleared when actually used if invalid
          console.warn('⚠️ Could not decode refresh token for display (non-critical)');
        }
      }
    } catch (error) {
      console.error('❌ Failed to decode access token:', error);
    }

    const checkInterval = setInterval(() => {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const exp = payload.exp * 1000;
        const now = Date.now();
        const timeUntilExpiry = exp - now;
        const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60000);
        const secondsUntilExpiry = Math.floor(timeUntilExpiry / 1000);
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⏰ TOKEN CHECK');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⏳ Time until expiry:', minutesUntilExpiry, 'minutes (', secondsUntilExpiry, 'seconds)');
        console.log('📝 Current token JTI:', payload.jti);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Refresh token 10 minutes before expiry (for 1-hour tokens)
        const REFRESH_THRESHOLD = 10 * 60 * 1000; // 10 minutes
        
        // Refresh if within threshold or expired
        if (timeUntilExpiry < REFRESH_THRESHOLD && timeUntilExpiry > 0) {
          console.log(`⚠️ Access token expiring in ${minutesUntilExpiry} minutes - auto-refreshing...`);
          refreshAccessToken();
        } else if (timeUntilExpiry <= 0) {
          console.log('❌ Access token expired - refreshing now...');
          refreshAccessToken();
        } else {
          console.log('✅ Token is valid - no refresh needed');
        }
      } catch (error) {
        console.error('❌ Token check failed:', error);
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

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

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔐 LOGIN SUCCESSFUL');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Decode and log access token info
      try {
        const accessPayload = JSON.parse(atob(access_token.split('.')[1]));
        const accessIat = new Date(accessPayload.iat * 1000);
        const accessExp = new Date(accessPayload.exp * 1000);
        const accessMinutes = Math.floor((accessExp.getTime() - accessIat.getTime()) / 60000);
        
        console.log('📝 ACCESS TOKEN:');
        console.log('   JTI:', accessPayload.jti);
        console.log('   Issued:', accessIat.toLocaleString());
        console.log('   Expires:', accessExp.toLocaleString());
        console.log('   Lifetime:', accessMinutes, 'minutes (1 hour)');
      } catch (e) {
        console.error('❌ Failed to decode access token');
      }
      
      // Decode and log refresh token info
      try {
        const refreshPayload = JSON.parse(atob(refresh_token.split('.')[1]));
        const refreshIat = new Date(refreshPayload.iat * 1000);
        const refreshExp = new Date(refreshPayload.exp * 1000);
        const refreshDays = Math.floor((refreshExp.getTime() - refreshIat.getTime()) / 86400000);
        
        console.log('🔄 REFRESH TOKEN:');
        console.log('   JTI:', refreshPayload.jti);
        console.log('   Issued:', refreshIat.toLocaleString());
        console.log('   Expires:', refreshExp.toLocaleString());
        console.log('   Lifetime:', refreshDays, 'days (7 days)');
      } catch (e) {
        console.warn('⚠️ Invalid refresh token (non-critical)');
      }
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('💾 Tokens stored:');
      console.log('   Access token: sessionStorage + memory');
      console.log('   Refresh token: localStorage');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // Store tokens
      setAccessToken(access_token);
      tokenManager.setAccessToken(access_token); // Store in tokenManager
      tokenManager.setRefreshToken(refresh_token);

      // Fetch user profile with access token
      console.log('👤 Fetching user profile...');
      const profileResponse = await authApi.getProfile(access_token);
      if (profileResponse.success && profileResponse.data) {
        setUser(profileResponse.data);
        console.log('✅ User profile loaded:', profileResponse.data.email);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
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

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔐 REGISTRATION SUCCESSFUL');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Decode and log access token info
      try {
        const accessPayload = JSON.parse(atob(access_token.split('.')[1]));
        const accessIat = new Date(accessPayload.iat * 1000);
        const accessExp = new Date(accessPayload.exp * 1000);
        const accessMinutes = Math.floor((accessExp.getTime() - accessIat.getTime()) / 60000);
        
        console.log('📝 ACCESS TOKEN:');
        console.log('   JTI:', accessPayload.jti);
        console.log('   Issued:', accessIat.toLocaleString());
        console.log('   Expires:', accessExp.toLocaleString());
        console.log('   Lifetime:', accessMinutes, 'minutes (1 hour)');
      } catch (e) {
        console.error('❌ Failed to decode access token');
      }
      
      // Decode and log refresh token info
      try {
        const refreshPayload = JSON.parse(atob(refresh_token.split('.')[1]));
        const refreshIat = new Date(refreshPayload.iat * 1000);
        const refreshExp = new Date(refreshPayload.exp * 1000);
        const refreshDays = Math.floor((refreshExp.getTime() - refreshIat.getTime()) / 86400000);
        
        console.log('🔄 REFRESH TOKEN:');
        console.log('   JTI:', refreshPayload.jti);
        console.log('   Issued:', refreshIat.toLocaleString());
        console.log('   Expires:', refreshExp.toLocaleString());
        console.log('   Lifetime:', refreshDays, 'days (7 days)');
      } catch (e) {
        console.warn('⚠️ Invalid refresh token (non-critical)');
      }
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('💾 Tokens stored:');
      console.log('   Access token: sessionStorage + memory');
      console.log('   Refresh token: localStorage');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // Store tokens
      setAccessToken(access_token);
      tokenManager.setAccessToken(access_token); // Store in tokenManager
      tokenManager.setRefreshToken(refresh_token);

      // Fetch user profile with access token
      console.log('👤 Fetching user profile...');
      const profileResponse = await authApi.getProfile(access_token);
      if (profileResponse.success && profileResponse.data) {
        setUser(profileResponse.data);
        console.log('✅ User profile loaded:', profileResponse.data.email);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
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
