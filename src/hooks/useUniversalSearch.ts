/**
 * Custom hook for universal search functionality
 * Handles search state, debouncing, and API calls
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '@/lib/api';
import type { SearchResponse, SearchOptions } from '@/types/search';

interface UseUniversalSearchOptions {
  initialQuery?: string;
  debounceMs?: number;
  autoSearch?: boolean;
  options?: SearchOptions;
}

interface UseUniversalSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResponse | null;
  loading: boolean;
  error: string | null;
  search: (searchQuery?: string) => Promise<void>;
  clearSearch: () => void;
  clearError: () => void;
}

export function useUniversalSearch({
  initialQuery = '',
  debounceMs = 300,
  autoSearch = false,
  options,
}: UseUniversalSearchOptions = {}): UseUniversalSearchReturn {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const optionsRef = useRef(options);

  // Update options ref when options change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Debounce query changes
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, debounceMs]);

  // Perform search
  const search = useCallback(async (searchQuery?: string) => {
    const queryToSearch = searchQuery !== undefined ? searchQuery : debouncedQuery;
    
    console.log('🔍 Search called with query:', queryToSearch);
    
    // Validate query
    if (!queryToSearch || queryToSearch.trim().length < 2) {
      console.log('⚠️ Query too short or empty');
      setResults(null);
      setError(null);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      console.log('🚫 Cancelling previous request');
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    console.log('📡 Calling API with query:', queryToSearch, 'options:', optionsRef.current);

    try {
      const response = await apiService.universalSearch(queryToSearch, optionsRef.current);
      console.log('✅ Search response:', response);
      setResults(response);
      setError(null);
    } catch (err) {
      console.error('❌ Search error:', err);
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          // Request was cancelled, don't update state
          console.log('🚫 Request was aborted');
          return;
        }
        setError(err.message || 'Failed to perform search');
      } else {
        setError('An unexpected error occurred');
      }
      setResults(null);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [debouncedQuery]); // Removed options from dependencies

  // Auto-search when debounced query changes
  useEffect(() => {
    console.log('🔄 Auto-search effect triggered:', { autoSearch, debouncedQuery });
    if (autoSearch && debouncedQuery && debouncedQuery.length >= 2) {
      console.log('✅ Triggering auto-search with query:', debouncedQuery);
      search(debouncedQuery);
    }
  }, [debouncedQuery, autoSearch, search]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setResults(null);
    setError(null);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    search,
    clearSearch,
    clearError,
  };
}
