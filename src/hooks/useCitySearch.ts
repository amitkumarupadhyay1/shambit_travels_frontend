import { useState, useEffect, useCallback, useRef } from 'react';
import { City, apiService } from '@/lib/api';

interface UseCitySearchOptions {
  debounceMs?: number;
  maxResults?: number;
  onCitySelect?: (city: City) => void;
}

interface UseCitySearchReturn {
  cities: City[];
  filteredCities: City[];
  searchQuery: string;
  selectedCity: City | null;
  isDropdownOpen: boolean;
  loading: boolean;
  error: string | null;
  highlightedIndex: number;
  setSearchQuery: (query: string) => void;
  setSelectedCity: (city: City | null) => void;
  setIsDropdownOpen: (open: boolean) => void;
  handleCitySelect: (city: City) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  clearSearch: () => void;
}

export function useCitySearch(options: UseCitySearchOptions = {}): UseCitySearchReturn {
  const {
    debounceMs = 300,
    maxResults = 10,
    onCitySelect,
  } = options;

  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<string>('');

  // Fetch all cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        setError(null);
        const citiesData = await apiService.getCities();
        setCities(citiesData || []);
      } catch (err) {
        console.error('Failed to fetch cities:', err);
        setError('Failed to load cities. Please try again.');
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Debounced search filter
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Store current search query
    searchInputRef.current = searchQuery;

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      const query = searchInputRef.current.trim().toLowerCase();

      if (query === '') {
        // Show limited results when not searching
        setFilteredCities(cities.slice(0, maxResults));
      } else {
        // Filter cities based on search query
        const filtered = cities.filter(city =>
          city.name.toLowerCase().includes(query) ||
          city.slug.toLowerCase().includes(query) ||
          city.description?.toLowerCase().includes(query)
        );
        setFilteredCities(filtered.slice(0, maxResults));
      }

      // Reset highlighted index when results change
      setHighlightedIndex(-1);
    }, debounceMs);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, cities, debounceMs, maxResults]);

  // Handle city selection
  const handleCitySelect = useCallback((city: City) => {
    setSelectedCity(city);
    setSearchQuery(city.name); // Keep the city name in search box
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    onCitySelect?.(city);
  }, [onCitySelect]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsDropdownOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredCities.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;

      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredCities.length) {
          handleCitySelect(filteredCities[highlightedIndex]);
        } else if (filteredCities.length === 1) {
          handleCitySelect(filteredCities[0]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
        break;

      case 'Tab':
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
        break;

      default:
        break;
    }
  }, [isDropdownOpen, filteredCities, highlightedIndex, handleCitySelect]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSelectedCity(null);
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
  }, []);

  return {
    cities,
    filteredCities,
    searchQuery,
    selectedCity,
    isDropdownOpen,
    loading,
    error,
    highlightedIndex,
    setSearchQuery,
    setSelectedCity,
    setIsDropdownOpen,
    handleCitySelect,
    handleKeyDown,
    clearSearch,
  };
}
