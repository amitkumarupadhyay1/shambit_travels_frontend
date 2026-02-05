const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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
  created_at: string;
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

// API Functions
class ApiService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log(`🔗 API Call: ${url}`); // Debug log
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      console.log(`📡 Response Status: ${response.status} for ${endpoint}`); // Debug log

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Data received for ${endpoint}:`, data); // Debug log
      return data;
    } catch (error) {
      console.error(`❌ API call failed for ${endpoint}:`, error);
      throw error;
    }
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
}

export const apiService = new ApiService();