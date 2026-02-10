// Authentication service for JWT-based auth

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname.includes('railway.app') 
    ? 'https://shambit.up.railway.app/api' 
    : 'http://localhost:8000/api');

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_active: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface GuestCheckoutData {
  email: string;
  first_name: string;
  last_name?: string;
  phone: string;
}

export interface RegisterData extends GuestCheckoutData {
  password: string;
  password_confirm: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user';

  // Token management
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setTokens(access: string, refresh: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.ACCESS_TOKEN_KEY, access);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refresh);
  }

  clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // User management
  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // API calls
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add custom headers from options
    if (options?.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (typeof value === 'string') {
          headers[key] = value;
        }
      });
    }

    // Add auth token if available
    const token = this.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Guest checkout - creates temporary user
  async guestCheckout(data: GuestCheckoutData): Promise<AuthResponse> {
    const response = await this.fetchApi<AuthResponse>('/auth/guest-checkout/', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    this.setTokens(response.access, response.refresh);
    this.setUser(response.user);

    return response;
  }

  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.fetchApi<AuthResponse>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    this.setTokens(response.access, response.refresh);
    this.setUser(response.user);

    return response;
  }

  // Login existing user
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.fetchApi<AuthResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    this.setTokens(response.access, response.refresh);
    this.setUser(response.user);

    return response;
  }

  // Logout
  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      try {
        await this.fetchApi('/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh: refreshToken }),
        });
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }
    this.clearTokens();
  }

  // Refresh access token
  async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.fetchApi<{ access: string }>('/auth/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });

    localStorage.setItem(this.ACCESS_TOKEN_KEY, response.access);
    return response.access;
  }

  // Get current user from API
  async getCurrentUser(): Promise<User> {
    const user = await this.fetchApi<User>('/auth/me/');
    this.setUser(user);
    return user;
  }
}

export const authService = new AuthService();
