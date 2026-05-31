/**
 * Token Manager
 * Handles secure storage of JWT tokens
 * - Refresh token: localStorage (7 days)
 * - Access token: memory + sessionStorage (1 day)
 */

const REFRESH_TOKEN_KEY = 'refresh_token';
const ACCESS_TOKEN_KEY = 'access_token';

// In-memory storage for access token (more secure)
let accessTokenMemory: string | null = null;

export const tokenManager = {
  /**
   * Store access token in memory and sessionStorage
   */
  setAccessToken(token: string): void {
    accessTokenMemory = token;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  },

  /**
   * Get access token from memory or sessionStorage
   */
  getAccessToken(): string | null {
    // Try memory first (fastest)
    if (accessTokenMemory) {
      return accessTokenMemory;
    }
    
    // Fallback to sessionStorage
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
      if (token) {
        accessTokenMemory = token; // Cache in memory
        return token;
      }
    }
    
    return null;
  },

  /**
   * Clear access token from memory and sessionStorage
   */
  clearAccessToken(): void {
    accessTokenMemory = null;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  },

  /**
   * Store refresh token in localStorage
   */
  setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  },

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  },

  /**
   * Remove refresh token from localStorage
   */
  clearRefreshToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= exp;
    } catch {
      return true;
    }
  },

  /**
   * Get time until token expires (in milliseconds)
   */
  getTimeUntilExpiry(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return exp - Date.now();
    } catch {
      return 0;
    }
  },

  /**
   * Clear all tokens
   */
  clearAll(): void {
    this.clearAccessToken();
    this.clearRefreshToken();
  },
};
