import { BookingRequest, BookingResponse } from './bookings';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname.includes('railway.app') 
    ? 'https://shambit.up.railway.app/api' 
    : 'http://localhost:8000/api');

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
      try {
        // Get auth token if available
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        
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
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
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
        console.error(`❌ API call failed for ${endpoint}:`, error);
        throw error;
      } finally {
        // Clean up
        this.abortControllers.delete(endpoint);
        this.pendingRequests.delete(endpoint);
      }
    })();

    // Store the pending request
    this.pendingRequests.set(endpoint, requestPromise);

    return requestPromise as Promise<T>;
  }

  // Cities
  async getCities(): Promise<City[]> {
    const response = await this.fetchApi<PaginatedResponse<City>>('/cities/');
    return response.results;
  }

  async getCity(id: number): Promise<City> {
    return this.fetchApi<City>(`/cities/${id}/`);
  }

  // Articles
  async getArticles(): Promise<Article[]> {
    const response = await this.fetchApi<PaginatedResponse<Article>>('/articles/');
    return response.results;
  }

  async getFeaturedArticles(): Promise<Article[]> {
    const response = await this.fetchApi<PaginatedResponse<Article>>('/articles/');
    return response.results;
  }

  async getArticlesByCity(cityId: number): Promise<Article[]> {
    const response = await this.fetchApi<PaginatedResponse<Article>>(`/articles/?city=${cityId}`);
    return response.results;
  }

  // Packages
  async getPackages(): Promise<Package[]> {
    const response = await this.fetchApi<PaginatedResponse<Package>>('/packages/packages/');
    return response.results;
  }

  async getFeaturedPackages(): Promise<Package[]> {
    const response = await this.fetchApi<PaginatedResponse<Package>>('/packages/packages/');
    return response.results;
  }

  async getPackagesByCity(cityId: number): Promise<Package[]> {
    const response = await this.fetchApi<PaginatedResponse<Package>>(`/packages/packages/?city=${cityId}`);
    return response.results;
  }

  // Experiences
  async getExperiences(): Promise<Experience[]> {
    const response = await this.fetchApi<PaginatedResponse<Experience>>('/packages/experiences/');
    return response.results;
  }

  async getExperiencesByCity(cityId: number): Promise<Experience[]> {
    const response = await this.fetchApi<PaginatedResponse<Experience>>(`/packages/experiences/?city=${cityId}`);
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
    return this.fetchApi<Package>(`/packages/packages/${slug}/`);
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
    return this.fetchApi<BookingResponse>('/bookings/', {
      method: 'POST',
      body: JSON.stringify(data),
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