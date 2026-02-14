/**
 * Token Manager
 * Handles JWT token storage, validation, and refresh
 */

interface JWTPayload {
  exp: number;
  [key: string]: unknown;
}

class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly TOKEN_EXPIRY_KEY = 'token_expiry';
  private static readonly REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry
  
  private refreshPromise: Promise<string> | null = null;

  /**
   * Store tokens in localStorage
   */
  setTokens(access: string, refresh: string): void {
    if (typeof window === 'undefined') return;

    try {
      // Decode JWT to get expiry time
      const payload = this.decodeToken(access);
      const expiresAt = payload.exp * 1000; // Convert to milliseconds

      localStorage.setItem(TokenManager.ACCESS_TOKEN_KEY, access);
      localStorage.setItem(TokenManager.REFRESH_TOKEN_KEY, refresh);
      localStorage.setItem(TokenManager.TOKEN_EXPIRY_KEY, expiresAt.toString());
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TokenManager.ACCESS_TOKEN_KEY);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TokenManager.REFRESH_TOKEN_KEY);
  }

  /**
   * Get token expiry time
   */
  getTokenExpiry(): number | null {
    if (typeof window === 'undefined') return null;
    const expiry = localStorage.getItem(TokenManager.TOKEN_EXPIRY_KEY);
    return expiry ? parseInt(expiry, 10) : null;
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;
    return Date.now() >= expiry;
  }

  /**
   * Check if token needs refresh (within threshold)
   */
  needsRefresh(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;
    return Date.now() >= (expiry - TokenManager.REFRESH_THRESHOLD);
  }

  /**
   * Decode JWT token (without verification)
   */
  private decodeToken(token: string): JWTPayload {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as JWTPayload;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return { exp: 0 };
    }
  }

  /**
   * Validate token format
   */
  isValidTokenFormat(token: string): boolean {
    if (!token) return false;
    const parts = token.split('.');
    return parts.length === 3;
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<string> {
    // If refresh is already in progress, return the existing promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performRefresh();
    
    try {
      const newAccessToken = await this.refreshPromise;
      return newAccessToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/auth/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      // Store new access token
      if (data.access) {
        const payload = this.decodeToken(data.access);
        const expiresAt = payload.exp * 1000;
        
        localStorage.setItem(TokenManager.ACCESS_TOKEN_KEY, data.access);
        localStorage.setItem(TokenManager.TOKEN_EXPIRY_KEY, expiresAt.toString());
        
        return data.access;
      }

      throw new Error('No access token in refresh response');
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear tokens on refresh failure
      this.clearTokens();
      throw error;
    }
  }

  /**
   * Get valid access token (refresh if needed)
   */
  async getValidAccessToken(): Promise<string | null> {
    const accessToken = this.getAccessToken();

    // No token available
    if (!accessToken) {
      return null;
    }

    // Token format invalid
    if (!this.isValidTokenFormat(accessToken)) {
      this.clearTokens();
      return null;
    }

    // Token expired or needs refresh
    if (this.needsRefresh()) {
      try {
        return await this.refreshAccessToken();
      } catch (error) {
        console.error('Failed to refresh token:', error);
        return null;
      }
    }

    return accessToken;
  }

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(TokenManager.ACCESS_TOKEN_KEY);
    localStorage.removeItem(TokenManager.REFRESH_TOKEN_KEY);
    localStorage.removeItem(TokenManager.TOKEN_EXPIRY_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    
    return !!(accessToken && refreshToken && !this.isTokenExpired());
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();
