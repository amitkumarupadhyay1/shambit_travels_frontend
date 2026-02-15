'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUniversalSearch } from '@/hooks/useUniversalSearch';
import type { SearchResult } from '@/types/search';

interface UniversalSearchBoxWithSuggestionsProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  variant?: 'default' | 'header' | 'hero';
  showSuggestions?: boolean;
}

export default function UniversalSearchBoxWithSuggestions({
  initialQuery = '',
  onSearch,
  placeholder = 'Search packages, cities, articles, experiences...',
  autoFocus = false,
  className,
  variant = 'default',
  showSuggestions = true,
}: UniversalSearchBoxWithSuggestionsProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Use the search hook for autocomplete - it manages its own query state
  const { query, setQuery, results, loading, clearSearch } = useUniversalSearch({
    initialQuery,
    autoSearch: showSuggestions,
    debounceMs: 300,
    options: { limit: 5 }, // Limit suggestions to 5 per category
  });

  // Compute dropdown visibility directly
  const showDropdown = 
    showSuggestions && 
    isFocused && 
    query.length >= 2 && 
    results !== null && 
    results.total_count > 0;

  // Debug logging for dropdown visibility
  useEffect(() => {
    console.log('🔍 Dropdown visibility check:', {
      showSuggestions,
      isFocused,
      queryLength: query.length,
      hasResults: results !== null,
      totalCount: results?.total_count,
      showDropdown,
    });
  }, [showSuggestions, isFocused, query.length, results, showDropdown]);

  // Auto-focus if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search submission
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery || trimmedQuery.length < 2) {
      return;
    }

    setIsFocused(false);

    if (onSearch) {
      onSearch(trimmedQuery);
    } else {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (result: SearchResult) => {
    setIsFocused(false);
    router.push(result.url);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    console.log('📝 Input changed:', newQuery);
    setQuery(newQuery);
  };

  // Handle clear
  const handleClear = () => {
    clearSearch();
    inputRef.current?.focus();
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Escape to close dropdown
      if (e.key === 'Escape') {
        setIsFocused(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Variant-specific styles
  const containerStyles = {
    default: 'w-full max-w-2xl',
    header: 'w-full max-w-md',
    hero: 'w-full max-w-3xl',
  };

  const inputStyles = {
    default: 'h-12 text-base',
    header: 'h-10 text-sm',
    hero: 'h-14 text-lg',
  };

  // Get all suggestions
  const allSuggestions: SearchResult[] = results
    ? [
        ...results.results.packages,
        ...results.results.cities,
        ...results.results.articles,
        ...results.results.experiences,
      ]
    : [];

  return (
    <div className={cn('relative', containerStyles[variant], className)}>
      <form onSubmit={handleSearch}>
        <div
          className={cn(
            'relative group',
            'bg-white rounded-full shadow-lg',
            'border-2 transition-all duration-200',
            isFocused
              ? 'border-orange-500 shadow-orange-200'
              : 'border-gray-200 hover:border-gray-300'
          )}
        >
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay to allow click on suggestions
              setTimeout(() => {
                console.log('⏰ Input blur - hiding dropdown after delay');
                setIsFocused(false);
              }, 300);
            }}
            placeholder={placeholder}
            className={cn(
              'w-full bg-transparent border-none outline-none',
              'pl-12 pr-24 py-3',
              'text-gray-800 placeholder:text-gray-400',
              'focus:outline-none focus:ring-0',
              inputStyles[variant]
            )}
            aria-label="Search"
            autoComplete="off"
            spellCheck="false"
          />

          {/* Right Actions */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Loading Spinner */}
            {loading && (
              <div className="text-orange-600">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}

            {/* Clear Button */}
            {query && !loading && (
              <button
                type="button"
                onClick={handleClear}
                className={cn(
                  'p-2 rounded-full',
                  'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
                  'transition-colors duration-200',
                  'touch-manipulation'
                )}
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Search Button */}
            <button
              type="submit"
              disabled={!query || query.trim().length < 2}
              className={cn(
                'px-4 py-2 rounded-full',
                'bg-orange-600 text-white font-medium',
                'hover:bg-orange-700 active:bg-orange-800',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-all duration-200',
                'touch-manipulation',
                'flex items-center gap-2'
              )}
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showDropdown && allSuggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className={cn(
              'absolute top-full left-0 right-0 mt-2',
              'bg-white rounded-2xl shadow-2xl border border-gray-200',
              'max-h-96 overflow-y-auto',
              'z-50'
            )}
          >
            <div className="p-2">
              {/* Group by type */}
              {results && results.results.packages.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                    Packages
                  </div>
                  {results.results.packages.map((pkg) => (
                    <button
                      key={`package-${pkg.id}`}
                      onClick={() => handleSuggestionClick(pkg)}
                      className={cn(
                        'w-full text-left p-3 rounded-lg',
                        'hover:bg-orange-50 transition-colors',
                        'flex items-start gap-3'
                      )}
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 text-sm">📦</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {pkg.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          ₹{pkg.price}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results && results.results.cities.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                    Cities
                  </div>
                  {results.results.cities.map((city) => (
                    <button
                      key={`city-${city.id}`}
                      onClick={() => handleSuggestionClick(city)}
                      className={cn(
                        'w-full text-left p-3 rounded-lg',
                        'hover:bg-orange-50 transition-colors',
                        'flex items-start gap-3'
                      )}
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">🏙️</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {city.title}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results && results.results.articles.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                    Articles
                  </div>
                  {results.results.articles.map((article) => (
                    <button
                      key={`article-${article.id}`}
                      onClick={() => handleSuggestionClick(article)}
                      className={cn(
                        'w-full text-left p-3 rounded-lg',
                        'hover:bg-orange-50 transition-colors',
                        'flex items-start gap-3'
                      )}
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">📰</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {article.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          By {article.author}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results && results.results.experiences.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                    Experiences
                  </div>
                  {results.results.experiences.map((exp) => (
                    <button
                      key={`experience-${exp.id}`}
                      onClick={() => handleSuggestionClick(exp)}
                      className={cn(
                        'w-full text-left p-3 rounded-lg',
                        'hover:bg-orange-50 transition-colors',
                        'flex items-start gap-3'
                      )}
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-sm">✨</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {exp.title}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* View All Results */}
              <button
                onClick={handleSearch}
                className={cn(
                  'w-full p-3 rounded-lg',
                  'text-center text-sm font-medium text-orange-600',
                  'hover:bg-orange-50 transition-colors'
                )}
              >
                View all {results?.total_count} results →
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Character Count (for long queries) */}
      {query.length > 80 && (
        <div className="mt-2 text-xs text-right">
          <span
            className={cn(
              query.length > 100 ? 'text-red-600' : 'text-gray-500'
            )}
          >
            {query.length}/100 characters
          </span>
        </div>
      )}
    </div>
  );
}
