'use client';

/**
 * AuthProvider — single source of truth for auth state.
 *
 * Previously `useAuth` was a plain useState hook called in ~14 components, so
 * each mount created its own auth state, its own init `getProfile()` fetch, and
 * its own 5-minute refresh interval. This provider centralizes all of that:
 * one state, one init fetch, one refresh timer for the whole app. `useAuth`
 * (see hooks/auth/useAuth.ts) is now a thin consumer of this context.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { authApi } from '@/lib/api/auth/authApi';
import { tokenManager } from '@/lib/utils/tokenManager/tokenManager';
import { logger } from '@/lib/utils/logger';
import type { User, LoginRequest, RegisterRequest } from '@/types/auth/auth.types';

export interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Module-level mutex so concurrent callers share a single in-flight refresh.
let refreshPromise: Promise<void> | null = null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Refresh the access token. The refresh token is sent automatically via the
   * httpOnly cookie (credentials: 'include' in authApi), so there is nothing to
   * read from storage here. Concurrent callers dedupe onto one request.
   */
  const refreshAccessToken = useCallback(async () => {
    if (refreshPromise) {
      await refreshPromise;
      return;
    }

    try {
      refreshPromise = (async () => {
        const response = await authApi.refreshToken();

        if (response.success && response.data?.access_token) {
          const newAccessToken = response.data.access_token;
          setAccessToken(newAccessToken);
          tokenManager.setAccessToken(newAccessToken);
          // Refresh token rotation is handled server-side via the httpOnly cookie.

          const profileResponse = await authApi.getProfile(newAccessToken);
          if (profileResponse.success && profileResponse.data) {
            setUser(profileResponse.data);
          }
        } else {
          // No active session (anonymous visitor or expired refresh cookie).
          // This is a normal state, not an error — just settle into logged-out.
          tokenManager.clearAll();
          setUser(null);
          setAccessToken(null);
        }
      })();

      await refreshPromise;
    } catch (error) {
      // Only genuine failures (network down, 5xx) reach here now.
      logger.error('Token refresh failed:', error);
      tokenManager.clearAll();
      setUser(null);
      setAccessToken(null);
    } finally {
      refreshPromise = null;
    }
  }, []);

  /** Initialize auth state once on mount. */
  useEffect(() => {
    const initAuth = async () => {
      const storedAccessToken = tokenManager.getAccessToken();

      // Valid stored access token → use it directly.
      if (storedAccessToken && !tokenManager.isTokenExpired(storedAccessToken)) {
        setAccessToken(storedAccessToken);
        try {
          const profileResponse = await authApi.getProfile(storedAccessToken);
          if (profileResponse.success && profileResponse.data) {
            setUser(profileResponse.data);
          }
        } catch (error) {
          logger.error('Failed to load profile with stored token:', error);
        }
        setIsLoading(false);
        return;
      }

      // No valid access token: attempt a cookie-based refresh. We can't read the
      // httpOnly refresh cookie from JS, so we just try — if there's no valid
      // cookie the backend returns 401 and refreshAccessToken clears state.
      try {
        await refreshAccessToken();
      } catch {
        // refreshAccessToken already resets state on failure.
      }

      setIsLoading(false);
    };

    initAuth();
  }, [refreshAccessToken]);

  /**
   * Auto-refresh the access token before expiry.
   * Access token lifetime is ~1h; we refresh when <10min remain.
   * One interval for the whole app (previously one per useAuth caller).
   */
  useEffect(() => {
    if (!accessToken) return;

    const REFRESH_THRESHOLD = 10 * 60 * 1000; // 10 minutes

    const checkInterval = setInterval(() => {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const timeUntilExpiry = payload.exp * 1000 - Date.now();
        if (timeUntilExpiry < REFRESH_THRESHOLD) {
          refreshAccessToken();
        }
      } catch (error) {
        logger.error('Token check failed:', error);
      }
    }, 5 * 60 * 1000); // every 5 minutes

    return () => clearInterval(checkInterval);
  }, [accessToken, refreshAccessToken]);

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials);
    if (!response.success) {
      throw new Error(response.message || 'Login failed');
    }

    // Refresh token now lives in an httpOnly cookie set by the backend; only the
    // access token is returned in the body.
    const { access_token } = response.data;
    setAccessToken(access_token);
    tokenManager.setAccessToken(access_token);

    const profileResponse = await authApi.getProfile(access_token);
    if (profileResponse.success && profileResponse.data) {
      setUser(profileResponse.data);
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await authApi.register(data);
    if (!response.success) {
      throw new Error(response.message || 'Registration failed');
    }

    const { access_token } = response.data;
    setAccessToken(access_token);
    tokenManager.setAccessToken(access_token);

    const profileResponse = await authApi.getProfile(access_token);
    if (profileResponse.success && profileResponse.data) {
      setUser(profileResponse.data);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (accessToken) {
        await authApi.logout(accessToken);
      }
    } catch (error) {
      logger.error('Logout error:', error);
    } finally {
      tokenManager.clearAll();
      setUser(null);
      setAccessToken(null);
    }
  }, [accessToken]);

  const value: AuthContextValue = {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    login,
    register,
    logout,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Internal accessor used by the `useAuth` hook. Throws if used outside provider. */
export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}
