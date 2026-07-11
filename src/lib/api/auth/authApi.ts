import { logger } from '@/lib/utils/logger';
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RefreshTokenResponse,
  User,
} from '@/types/auth/auth.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

class AuthApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    logger.debug('🔐 Calling login API...');
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include', // receive the httpOnly refresh-token cookie
      cache: 'no-store', // Disable caching
    });

    const result = await response.json();

    // Check if the response indicates failure
    if (!response.ok || !result.success) {
      logger.error('❌ Login API failed:', result.message);
      throw new Error(result.message || 'Login failed');
    }

    logger.debug('✅ Login API successful');
    return result;
  }

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include', // receive the httpOnly refresh-token cookie
    });

    const result = await response.json();

    // Check if the response indicates failure
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Registration failed');
    }

    return result;
  }

  /**
   * Refresh the access token.
   *
   * The refresh token lives in an httpOnly cookie (set by the backend on login),
   * so we send no token in the body — `credentials: 'include'` ships the cookie
   * automatically. The optional arg remains only for non-browser/legacy callers.
   */
  async refreshToken(refreshToken?: string): Promise<RefreshTokenResponse> {
    logger.debug('🔄 Calling refresh token API...');

    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Body only for legacy/non-cookie callers; browser relies on the cookie.
      body: JSON.stringify(refreshToken ? { refresh_token: refreshToken } : {}),
      credentials: 'include', // send the httpOnly refresh-token cookie
      cache: 'no-store',
    });

    // 401 = there is no valid refresh session. For an anonymous visitor (no
    // login cookie) this is the normal, expected state — the whole site is
    // usable logged out — so it is NOT an error. Return a clean "not
    // authenticated" result instead of logging/throwing.
    if (response.status === 401) {
      logger.debug('ℹ️ No active session to refresh (anonymous visitor)');
      return { success: false, status_code: 401, message: 'Not authenticated' };
    }

    // Any other non-OK status is a genuine failure worth surfacing.
    if (!response.ok) {
      logger.error('❌ Refresh token API failed - status:', response.status);
      throw new Error('Token refresh failed');
    }

    const result = await response.json();
    logger.debug('✅ Refresh token API successful');
    return result;
  }

  /**
   * Get current user profile
   */
  async getProfile(accessToken: string): Promise<any> {
    logger.debug('👤 Calling profile API...');
    
    // Decode token to show info
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      logger.debug('📝 Using access token JTI:', payload.jti);
    } catch (e) {}
    
    const response = await fetch(`${this.baseURL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      cache: 'no-store', // Disable caching
    });

    if (!response.ok) {
      logger.error('❌ Profile API failed - Status:', response.status);
      throw new Error('Failed to fetch profile');
    }

    const result = await response.json();
    logger.debug('✅ Profile API successful');
    return result;
  }

  /**
   * Logout (optional backend call if you track sessions)
   */
  async logout(accessToken: string): Promise<void> {
    try {
      await fetch(`${this.baseURL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include', // let the backend clear the httpOnly cookie
      });
    } catch (error) {
      // Logout locally even if backend call fails
      logger.error('Logout API call failed:', error);
    }
  }
}

export const authApi = new AuthApiClient(API_BASE_URL);
