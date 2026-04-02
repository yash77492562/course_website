/**
 * Token Manager
 * Handles secure storage of JWT tokens
 * - Refresh token: localStorage (7 days)
 * - Access token: memory only (1 day)
 */

const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenManager = {
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
   * Clear all tokens
   */
  clearAll(): void {
    this.clearRefreshToken();
  },
};
