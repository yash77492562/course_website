import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RefreshTokenResponse,
  User,
} from '@/types/auth/auth.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

class AuthApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('🔐 Calling login API...');
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const result = await response.json();

    // Check if the response indicates failure
    if (!response.ok || !result.success) {
      console.error('❌ Login API failed:', result.message);
      throw new Error(result.message || 'Login failed');
    }

    console.log('✅ Login API successful');
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
    });

    const result = await response.json();

    // Check if the response indicates failure
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Registration failed');
    }

    return result;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    console.log('🔄 Calling refresh token API...');
    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.error('❌ Refresh token API failed');
      throw new Error('Token refresh failed');
    }

    const result = await response.json();
    console.log('✅ Refresh token API successful');
    return result;
  }

  /**
   * Get current user profile
   */
  async getProfile(accessToken: string): Promise<any> {
    console.log('👤 Calling profile API with access token:', accessToken.substring(0, 20) + '...');
    const response = await fetch(`${this.baseURL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error('❌ Profile API failed');
      throw new Error('Failed to fetch profile');
    }

    const result = await response.json();
    console.log('✅ Profile API successful');
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
      });
    } catch (error) {
      // Logout locally even if backend call fails
      console.error('Logout API call failed:', error);
    }
  }
}

export const authApi = new AuthApiClient(API_BASE_URL);
