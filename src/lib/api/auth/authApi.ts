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
      cache: 'no-store', // Disable caching
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
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔄 CALLING REFRESH TOKEN API');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Decode refresh token to show info
    try {
      const payload = JSON.parse(atob(refreshToken.split('.')[1]));
      const exp = new Date(payload.exp * 1000);
      console.log('📝 Refresh token JTI:', payload.jti);
      console.log('⏰ Refresh token expires:', exp.toLocaleString());
    } catch (e) {
      console.error('❌ Failed to decode refresh token');
    }
    
    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store', // Disable caching
    });

    if (!response.ok) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ REFRESH TOKEN API FAILED');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('Status:', response.status);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      throw new Error('Token refresh failed');
    }

    const result = await response.json();
    console.log('✅ Refresh token API successful');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return result;
  }

  /**
   * Get current user profile
   */
  async getProfile(accessToken: string): Promise<any> {
    console.log('👤 Calling profile API...');
    
    // Decode token to show info
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      console.log('📝 Using access token JTI:', payload.jti);
    } catch (e) {}
    
    const response = await fetch(`${this.baseURL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      cache: 'no-store', // Disable caching
    });

    if (!response.ok) {
      console.error('❌ Profile API failed - Status:', response.status);
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
