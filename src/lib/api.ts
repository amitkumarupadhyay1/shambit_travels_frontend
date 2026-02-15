import { BookingRequest, BookingResponse } from './bookings';
import { tokenManager } from './tokenManager';
import type { SearchResponse, SearchStats } from '@/types/search';

// Determine API base URL with smart fallback for local network access
const getApiBaseUrl = (): string => {
  // If explicitly set, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Server-side rendering: use localhost
  if (typeof window === 'undefined') {
    return 'http://localhost:8000/api';
  }
  
  // Client-side: detect environment
  const hostname = window.location.hostname;
  
  // Production (Railway)
  if (hostname.includes('railway.app') || hostname.includes('vercel.app')) {
    return 'https://shambit.up.railway.app/api';
  }
  
  // Local network access (mobile testing)
  // If accessing via IP address (e.g., 192.168.x.x), use the same IP for backend
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return `http://${hostname}:8000/api`;
  }
  
  // Default: localhost
  return 'http://localhost:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Debug logging
if (typeof window !== 'undefined') {
  console.log('🌍 Environment:', process.env.NODE_ENV);
  console.log('🔗 API Base URL:', API_BASE_URL);
  console.log('🏠 Hostname:', window.location.hostname);
  console.log('📦 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
}

// API Response Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  error: string;
  detail?: string;
  status?: number;
}

export class ApiException extends Error {
  constructor(
    message: string,
    public status: number,
    public detail?: string
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

export interface City {
  id: number;
  name: string;
  slug: string;
  description: string;
  hero_image?: string;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  author: string;
  city_name?: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: number;
  name: string;
  slug: string;
  description: string;
  city_name: string;
  experiences: Experience[];
  hotel_tiers: HotelTier[];
  transport_options: TransportOption[];
  is_active: boolean;
  created_at: string;
}

export interface Experience {
  id: number;
  name: string;
  description: string;
  base_price: number;
  is_active: boolean;
  featured_image_url: string | null;
  duration_hours: number;
  max_participants: number;
  difficulty_level: "EASY" | "MODERATE" | "HARD";
  category:
    | "CULTURAL"
    | "ADVENTURE"
    | "FOOD"
    | "SPIRITUAL"
    | "NATURE"
    | "ENTERTAINMENT"
    | "EDUCATIONAL";
  city_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface HotelTier {
  id: number;
  name: string;
  description: string;
  price_multiplier: number;
}

export interface TransportOption {
  id: number;
  name: string;
  description: string;
  base_price: number;
}

// Cache configuration
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// API Functions
class ApiService {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private pendingRequests: Map<string, Promise<unknown>> = new Map();
  private abortControllers: Map<string, AbortController> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  private getCacheKey(endpoint: string): string {
    return endpoint;
  }

  private isCacheValid<T>(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp < this.CACHE_TTL;
  }

  private getFromCache<T>(endpoint: string): T | null {
    const cacheKey = this.getCacheKey(endpoint);
    const entry = this.cache.get(cacheKey) as CacheEntry<T> | undefined;
    
    if (entry && this.isCacheValid(entry)) {
      console.log(`💾 Cache hit for ${endpoint}`);
      return entry.data;
    }
    
    return null;
  }

  private setCache<T>(endpoint: string, data: T): void {
    const cacheKey = this.getCacheKey(endpoint);
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
  }

  public clearCache(): void {
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }

  public cancelRequest(endpoint: string): void {
    const controller = this.abortControllers.get(endpoint);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(endpoint);
      this.pendingRequests.delete(endpoint);
      console.log(`🚫 Request cancelled for ${endpoint}`);
    }
  }

  public cancelAllRequests(): void {
    this.abortControllers.forEach((controller) => controller.abort());
    this.abortControllers.clear();
    this.pendingRequests.clear();
    console.log('🚫 All requests cancelled');
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private isRetryableError(status: number): boolean {
    // Retry on network errors, server errors, and rate limiting
    return status >= 500 || status === 429 || status === 408;
  }

  private getUserFriendlyErrorMessage(status: number, errorData: ApiError): string {
    switch (status) {
      case 400:
        return errorData.error || errorData.detail || 'Invalid request. Please check your input.';
      case 401:
        return 'You need to be logged in to perform this action.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 408:
        return 'Request timeout. Please try again.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Our team has been notified. Please try again later.';
      case 502:
      case 503:
      case 504:
        return 'Service temporarily unavailable. Please try again in a few moments.';
      default:
        return errorData.error || errorData.detail || 'An unexpected error occurred. Please try again.';
    }
  }

  private async fetchApi<T>(endpoint: string, options?: RequestInit & { skipCache?: boolean }): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Check cache first (unless skipCache is true)
    if (!options?.skipCache) {
      const cachedData = this.getFromCache<T>(endpoint);
      if (cachedData !== null) {
        return cachedData;
      }
    }

    // Check if there's already a pending request for this endpoint
    const pendingRequest = this.pendingRequests.get(endpoint);
    if (pendingRequest) {
      console.log(`⏳ Reusing pending request for ${endpoint}`);
      return pendingRequest as Promise<T>;
    }

    console.log(`🔗 API Call: ${url}`);
    
    // Create abort controller for this request
    const controller = new AbortController();
    this.abortControllers.set(endpoint, controller);

    const requestPromise = (async () => {
      let lastError: Error | null = null;
      
      for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
        try {
          // Add delay for retries (exponential backoff)
          if (attempt > 0) {
            const delay = this.RETRY_DELAY * Math.pow(2, attempt - 1);
            console.log(`⏳ Retry attempt ${attempt + 1}/${this.MAX_RETRIES} after ${delay}ms for ${endpoint}`);
            await this.sleep(delay);
          }

          // Get auth token if available - use token manager for auto-refresh
          const token = await tokenManager.getValidAccessToken();
          
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

          // Add auth header if token exists
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const response = await fetch(url, {
            ...options,
            headers,
            signal: controller.signal,
          });

          console.log(`📡 Response Status: ${response.status} for ${endpoint}`);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' })) as ApiError;
            console.error(`❌ API Error Response for ${endpoint}:`, errorData);
            
            // Check if we should retry
            if (this.isRetryableError(response.status) && attempt < this.MAX_RETRIES - 1) {
              lastError = new ApiException(
                this.getUserFriendlyErrorMessage(response.status, errorData),
                response.status,
                errorData.detail
              );
              continue; // Retry
            }
            
            // No retry, throw user-friendly error
            throw new ApiException(
              this.getUserFriendlyErrorMessage(response.status, errorData),
              response.status,
              errorData.detail
            );
          }

          const data = await response.json();
          console.log(`✅ Data received for ${endpoint}:`, data);
          
          // Cache the response
          this.setCache(endpoint, data);
          
          return data;
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') {
            console.log(`🚫 Request aborted for ${endpoint}`);
            throw error;
          }
          
          // If it's already an ApiException, just store it
          if (error instanceof ApiException) {
            lastError = error;
            
            // Don't retry if it's not a retryable error
            if (!this.isRetryableError(error.status)) {
              throw error;
            }
          } else {
            // Network error or other error
            lastError = new Error(
              error instanceof Error 
                ? `Network error: ${error.message}` 
                : 'An unexpected error occurred'
            );
          }
          
          // If this was the last attempt, throw the error
          if (attempt === this.MAX_RETRIES - 1) {
            console.error(`❌ API call failed after ${this.MAX_RETRIES} attempts for ${endpoint}:`, lastError);
            throw lastError;
          }
        }
      }
      
      // This should never be reached, but TypeScript needs it
      throw lastError || new Error('Request failed');
    })();

    // Store the pending request
    this.pendingRequests.set(endpoint, requestPromise);

    try {
      return await requestPromise as Promise<T>;
    } finally {
      // Clean up
      this.abortControllers.delete(endpoint);
      this.pendingRequests.delete(endpoint);
    }
  }

  // Cities
  async getCities(): Promise<City[]> {
    const response = await this.fetchApi<PaginatedResponse<City>>('/cities/', {
      skipCache: true,
    });
    return response.results;
  }

  async getCity(id: number): Promise<City> {
    return this.fetchApi<City>(`/cities/${id}/`, { skipCache: true });
  }

  // Articles
  async getArticles(): Promise<Article[]> {
    const response = await this.fetchApi<PaginatedResponse<Article>>('/articles/', {
      skipCache: true,
    });
    return response.results;
  }

  async getFeaturedArticles(): Promise<Article[]> {
    const response = await this.fetchApi<PaginatedResponse<Article>>('/articles/', {
      skipCache: true,
    });
    return response.results;
  }

  async getArticlesByCity(cityId: number): Promise<Article[]> {
    const response = await this.fetchApi<PaginatedResponse<Article>>(
      `/articles/?city=${cityId}`,
      { skipCache: true }
    );
    return response.results;
  }

  // Packages
  async getPackages(): Promise<Package[]> {
    const response = await this.fetchApi<PaginatedResponse<Package>>(
      '/packages/packages/',
      { skipCache: true }
    );
    return response.results;
  }

  async getFeaturedPackages(): Promise<Package[]> {
    const response = await this.fetchApi<PaginatedResponse<Package>>(
      '/packages/packages/',
      { skipCache: true }
    );
    return response.results;
  }

  async getPackagesByCity(cityId: number): Promise<Package[]> {
    const response = await this.fetchApi<PaginatedResponse<Package>>(
      `/packages/packages/?city=${cityId}`,
      { skipCache: true }
    );
    return response.results;
  }

  // Experiences
  async getExperiences(): Promise<Experience[]> {
    const response = await this.fetchApi<PaginatedResponse<Experience>>(
      '/packages/experiences/',
      { skipCache: true }
    );
    return response.results;
  }

  async getExperiencesByCity(cityId: number): Promise<Experience[]> {
    const response = await this.fetchApi<PaginatedResponse<Experience>>(
      `/packages/experiences/?city=${cityId}`,
      { skipCache: true }
    );
    return response.results;
  }

  // Hotel Tiers
  async getHotelTiers(): Promise<HotelTier[]> {
    const response = await this.fetchApi<PaginatedResponse<HotelTier>>('/packages/hotel-tiers/');
    return response.results;
  }

  async getHotelTiersByCity(cityId: number): Promise<HotelTier[]> {
    const response = await this.fetchApi<PaginatedResponse<HotelTier>>(`/packages/hotel-tiers/?city=${cityId}`);
    return response.results;
  }

  // Package Detail
  async getPackage(slug: string): Promise<Package> {
    return this.fetchApi<Package>(`/packages/packages/${slug}/`, {
      skipCache: true,
    });
  }

  // Price Calculation
  async calculatePrice(
    slug: string,
    selections: {
      experience_ids: number[];
      hotel_tier_id: number;
      transport_option_id: number;
    }
  ): Promise<PriceCalculation> {
    return this.fetchApi<PriceCalculation>(
      `/packages/packages/${slug}/calculate_price/`,
      {
        method: 'POST',
        body: JSON.stringify(selections),
        skipCache: true, // Never cache price calculations
      }
    );
  }

  // Price Range
  async getPriceRange(slug: string): Promise<PriceRange> {
    return this.fetchApi<PriceRange>(`/packages/packages/${slug}/price_range/`);
  }

  // Bookings
  async createBooking(data: BookingRequest): Promise<BookingResponse> {
    console.log('Creating booking with data:', data);
    return this.fetchApi<BookingResponse>('/bookings/', {
      method: 'POST',
      body: JSON.stringify(data),
      skipCache: true,
    });
  }

  // Universal Search
  async universalSearch(
    query: string,
    options?: {
      categories?: ('packages' | 'cities' | 'articles' | 'experiences')[];
      limit?: number;
    }
  ): Promise<SearchResponse> {
    if (!query || query.trim().length < 2) {
      throw new ApiException('Query must be at least 2 characters', 400);
    }

    if (query.length > 100) {
      throw new ApiException('Query must be less than 100 characters', 400);
    }

    const params = new URLSearchParams({
      q: query.trim(),
    });

    if (options?.categories && options.categories.length > 0) {
      params.append('categories', options.categories.join(','));
    }

    if (options?.limit) {
      params.append('limit', Math.min(options.limit, 50).toString());
    }

    const endpoint = `/search/?${params.toString()}`;
    
    console.log('🔍 universalSearch called:', { query, options, endpoint });

    const response = await this.fetchApi<SearchResponse>(endpoint, {
      skipCache: true, // Skip cache for now to debug
    });

    console.log('✅ universalSearch response:', response);

    return response;
  }

  async getSearchStats(): Promise<SearchStats> {
    return this.fetchApi<SearchStats>('/search/stats/', {
      skipCache: true,
    });
  }
}

// Price Calculation Response Types
export interface PriceCalculation {
  total_price: string;
  currency: string;
  breakdown: {
    experiences: Array<{
      id: number;
      name: string;
      price: string;
    }>;
    hotel_tier: {
      id: number;
      name: string;
      price_multiplier: string;
    };
    transport: {
      id: number;
      name: string;
      price: string;
    };
  };
  pricing_note: string;
}

export interface PriceRange {
  package: string;
  price_range: {
    min_price: string;
    max_price: string;
    currency: string;
  };
  note: string;
}

export const apiService = new ApiService();
