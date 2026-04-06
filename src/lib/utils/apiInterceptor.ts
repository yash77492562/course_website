/**
 * API Interceptor for automatic token refresh
 * Intercepts 401 errors and automatically refreshes the access token
 */

import { authApi } from '../api/auth/authApi';
import { tokenManager } from './tokenManager/tokenManager';

interface QueuedRequest {
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
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
  // Get current access token from memory or localStorage
  const accessToken = tokenManager.getAccessToken();
  
  // Add authorization header if token exists
  if (accessToken && !options.headers) {
    options.headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
  } else if (accessToken && options.headers) {
    (options.headers as any)['Authorization'] = `Bearer ${accessToken}`;
  }

  // Make the request
  let response = await fetch(url, options);

  // If 401, try to refresh token and retry
  if (response.status === 401) {
    console.log('🔄 Got 401, attempting token refresh...');

    if (isRefreshing) {
      // Wait for the current refresh to complete
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        // Retry with new token
        if (options.headers) {
          (options.headers as any)['Authorization'] = `Bearer ${token}`;
        }
        return fetch(url, options);
      });
    }

    isRefreshing = true;

    try {
      const refreshToken = tokenManager.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Refresh the token
      const refreshResponse = await authApi.refreshToken(refreshToken);
      
      if (!refreshResponse.success || !refreshResponse.data?.access_token) {
        throw new Error('Token refresh failed');
      }

      const newAccessToken = refreshResponse.data.access_token;
      tokenManager.setAccessToken(newAccessToken);
      
      console.log('✅ Token refreshed successfully');
      
      // Process queued requests
      processQueue(null, newAccessToken);
      
      // Retry original request with new token
      if (options.headers) {
        (options.headers as any)['Authorization'] = `Bearer ${newAccessToken}`;
      }
      response = await fetch(url, options);
      
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      processQueue(error, null);
      
      // Clear tokens and redirect to login
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
