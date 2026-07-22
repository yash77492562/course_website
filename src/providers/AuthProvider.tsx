'use client';

/**
 * AuthProvider — single source of truth for auth state.
 *
 * Previously `useAuth` was a plain useState hook called in ~14 components, so
 * each mount created its own auth state, its own init `getProfile()` fetch, and
 * its own 5-minute refresh interval. This provider centralizes all of that:
 * one state, one init fetch, one refresh timer for the whole app. `useAuth`
 * (see hooks/auth/useAuth.ts) is now a thin consumer of this context.
 *
 * Token storage: the JWT lives ONLY in httpOnly cookies set by the backend
 * (`access_token` 1h, `refresh_token` 7d). JS never reads or stores a token —
 * `isAuthenticated` derives from whether `getProfile()` (cookie-authed)
 * succeeds. Do NOT reintroduce token state or sessionStorage here.
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
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Refresh the session. The refresh token is sent automatically via the
   * httpOnly cookie (credentials: 'include' in authApi) and the new access
   * token comes back as a cookie — nothing to store in JS. Concurrent callers
   * dedupe onto one request.
   */
  const refreshAccessToken = useCallback(async () => {
    if (refreshPromise) {
      await refreshPromise;
      return;
    }

    try {
      refreshPromise = (async () => {
        const response = await authApi.refreshToken();

        if (response.success) {
          const profileResponse = await authApi.getProfile();
          if (profileResponse.success && profileResponse.data) {
            setUser(profileResponse.data);
          }
        } else {
          // No active session (anonymous visitor or expired refresh cookie).
          // This is a normal state, not an error — just settle into logged-out.
          setUser(null);
        }
      })();

      await refreshPromise;
    } catch (error) {
      // Only genuine failures (network down, 5xx) reach here now.
      logger.error('Token refresh failed:', error);
      setUser(null);
    } finally {
      refreshPromise = null;
    }
  }, []);

  /** Initialize auth state once on mount. */
  useEffect(() => {
    const initAuth = async () => {
      // Clear tokens persisted by pre-cookie builds (one-time hygiene).
      tokenManager.clearAll();

      // We can't read the httpOnly cookies from JS, so just ask the backend who
      // we are. Valid access cookie → profile. 401 → try a cookie refresh once.
      try {
        const profileResponse = await authApi.getProfile();
        if (profileResponse.success && profileResponse.data) {
          setUser(profileResponse.data);
          setIsLoading(false);
          return;
        }
      } catch {
        // Fall through to refresh.
      }

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
   * Auto-refresh the session before the access cookie (1h) expires.
   * The token is httpOnly so its expiry can't be read from JS — instead we
   * refresh unconditionally every 45 minutes while logged in. One interval for
   * the whole app (previously one per useAuth caller).
   */
  useEffect(() => {
    if (!user) return;

    const REFRESH_INTERVAL = 45 * 60 * 1000; // 45 min < 1h cookie lifetime

    const interval = setInterval(() => {
      refreshAccessToken();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [user, refreshAccessToken]);

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials);
    if (!response.success) {
      throw new Error(response.message || 'Login failed');
    }

    // Both tokens now live in httpOnly cookies set by the backend; nothing to
    // store here. The profile call authenticates via the fresh cookie.
    const profileResponse = await authApi.getProfile();
    if (profileResponse.success && profileResponse.data) {
      setUser(profileResponse.data);
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await authApi.register(data);
    if (!response.success) {
      throw new Error(response.message || 'Registration failed');
    }

    const profileResponse = await authApi.getProfile();
    if (profileResponse.success && profileResponse.data) {
      setUser(profileResponse.data);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      logger.error('Logout error:', error);
    } finally {
      tokenManager.clearAll();
      setUser(null);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
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
