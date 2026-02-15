/**
 * Type definitions for universal search functionality
 */

export interface SearchResult {
  id: number;
  type: 'package' | 'city' | 'article' | 'experience';
  title: string;
  description?: string;
  excerpt: string;
  slug: string;
  url: string;
  image: string | null;
  relevance_score: number;
  content_type: string;
  breadcrumb: string;
}

export interface PackageSearchResult extends SearchResult {
  type: 'package';
  price: number;
  duration?: string;
}

export interface CitySearchResult extends SearchResult {
  type: 'city';
}

export interface ArticleSearchResult extends SearchResult {
  type: 'article';
  author: string;
  published_date: string;
}

export interface ExperienceSearchResult extends SearchResult {
  type: 'experience';
}

export interface SearchResponse {
  query: string;
  parsed_query?: {
    original_query: string;
    location: string | null;
    intent: string | null;
    search_terms: string[];
  };
  results: {
    packages: PackageSearchResult[];
    cities: CitySearchResult[];
    articles: ArticleSearchResult[];
    experiences: ExperienceSearchResult[];
  };
  total_count: number;
  search_time_ms: number;
  metadata: {
    content_scope: string;
    indexed_content_types: string[];
    natural_language_enabled?: boolean;
  };
}

export interface SearchOptions {
  categories?: ('packages' | 'cities' | 'articles' | 'experiences')[];
  limit?: number;
}

export interface SearchError {
  query: string;
  error: string;
  message?: string;
}

export type SearchCategory = 'packages' | 'cities' | 'articles' | 'experiences' | 'all';

export interface SearchStats {
  content_counts: {
    packages: number;
    cities: number;
    articles: number;
    experiences: number;
  };
  total_searchable_items: number;
  status: string;
}
