/**
 * Legacy token storage cleanup.
 *
 * The JWT now lives ONLY in httpOnly cookies set by the backend
 * (`access_token` + `refresh_token`) — JavaScript never sees or stores it.
 * This module remains solely to purge tokens that older builds persisted in
 * sessionStorage/localStorage, and to keep old imports harmless.
 *
 * Do NOT reintroduce token get/set here: reading a JWT in JS defeats the
 * XSS-safety of the cookie migration.
 */

const REFRESH_TOKEN_KEY = 'refresh_token';
const ACCESS_TOKEN_KEY = 'access_token';

export const tokenManager = {
  /** Remove any tokens persisted by pre-cookie builds. */
  clearAll(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },
};
