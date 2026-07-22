import { logger } from '@/lib/utils/logger';
/**
 * API Interceptor for automatic token refresh.
 *
 * Auth rides entirely on httpOnly cookies (`access_token`, `refresh_token`) —
 * every request is sent with `credentials: 'include'` and NO Authorization
 * header. On a 401 we call /auth/refresh (cookie-based, rotates both cookies)
 * once, replaying concurrent 401s from a queue, then retry the request.
 */

import { authApi } from '../api/auth/authApi';
import { tokenManager } from './tokenManager/tokenManager';

interface QueuedRequest {
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(null);
    }
  });

  failedQueue = [];
};

/**
 * Intercept fetch requests and handle 401 errors
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // The httpOnly access-token cookie carries auth; nothing to attach in JS.
  options.credentials = 'include';

  // Make the request
  let response = await fetch(url, options);

  // If 401, try to refresh token and retry
  if (response.status === 401) {
    logger.debug('🔄 Got 401, attempting token refresh...');

    if (isRefreshing) {
      // Wait for the current refresh to complete, then retry with fresh cookies.
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => fetch(url, options));
    }

    isRefreshing = true;

    try {
      // Refresh token is sent via the httpOnly cookie (authApi uses
      // credentials: 'include'); the new access token comes back as a cookie too.
      const refreshResponse = await authApi.refreshToken();

      if (!refreshResponse.success) {
        throw new Error('Token refresh failed');
      }

      logger.debug('✅ Token refreshed successfully');

      // Process queued requests
      processQueue(null);

      // Retry original request — the fresh access_token cookie rides along.
      response = await fetch(url, options);

    } catch (error) {
      logger.error('❌ Token refresh failed:', error);
      processQueue(error);

      // Clear legacy storage and redirect to login
      tokenManager.clearAll();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      throw error;
    } finally {
      isRefreshing = false;
    }
  }

  return response;
}

/**
 * Helper to make authenticated API calls with automatic token refresh
 */
export async function apiCall<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetchWithAuth(url, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}
