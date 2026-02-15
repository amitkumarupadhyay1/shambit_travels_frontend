'use client';

import { useState, useEffect } from 'react';
import UniversalSearchBoxWithSuggestions from '@/components/search/UniversalSearchBoxWithSuggestions';
import { useUniversalSearch } from '@/hooks/useUniversalSearch';

export default function SearchTestPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { results, loading, error, search } = useUniversalSearch({
    initialQuery: searchQuery,
    autoSearch: false,
  });

  // Trigger search when searchQuery changes
  useEffect(() => {
    if (searchQuery && searchQuery.length >= 2) {
      console.log('🔄 Triggering search for:', searchQuery);
      search(searchQuery);
    }
  }, [searchQuery, search]);

  const handleSearch = (query: string) => {
    console.log('🔍 Search box submitted:', query);
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Universal Search Test
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Type to see autocomplete suggestions, or press Enter to search
        </p>

        {/* Debug Info */}
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <p><strong>Current Query:</strong> {searchQuery || '(empty)'}</p>
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error || 'None'}</p>
          <p><strong>Results:</strong> {results ? `${results.total_count} found` : 'None'}</p>
          <p className="mt-2 text-xs text-gray-600">
            💡 Tip: Open browser console (F12) to see detailed logs
          </p>
        </div>

        {/* Search Box with Autocomplete */}
        <div className="mb-8">
          <UniversalSearchBoxWithSuggestions
            initialQuery={searchQuery}
            onSearch={handleSearch}
            variant="hero"
            showSuggestions={true}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
              <span>Searching...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Results */}
        {results && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Search Results for &quot;{results.query}&quot;
              </h2>
              <span className="text-sm text-gray-500">
                {results.total_count} results in {results.search_time_ms}ms
              </span>
            </div>

            {/* Packages */}
            {results.results.packages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  📦 Packages ({results.results.packages.length})
                </h3>
                <div className="space-y-3">
                  {results.results.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
                    >
                      <h4 className="font-semibold text-gray-900">{pkg.title}</h4>
                      <p
                        className="text-sm text-gray-600 mt-1"
                        dangerouslySetInnerHTML={{ __html: pkg.excerpt }}
                      />
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <span>{pkg.breadcrumb}</span>
                        <span>₹{pkg.price}</span>
                        {pkg.duration && <span>{pkg.duration}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cities */}
            {results.results.cities.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  🏙️ Cities ({results.results.cities.length})
                </h3>
                <div className="space-y-3">
                  {results.results.cities.map((city) => (
                    <div
                      key={city.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
                    >
                      <h4 className="font-semibold text-gray-900">{city.title}</h4>
                      <p
                        className="text-sm text-gray-600 mt-1"
                        dangerouslySetInnerHTML={{ __html: city.excerpt }}
                      />
                      <div className="mt-2 text-xs text-gray-500">
                        {city.breadcrumb}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Articles */}
            {results.results.articles.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  📰 Articles ({results.results.articles.length})
                </h3>
                <div className="space-y-3">
                  {results.results.articles.map((article) => (
                    <div
                      key={article.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
                    >
                      <h4 className="font-semibold text-gray-900">{article.title}</h4>
                      <p
                        className="text-sm text-gray-600 mt-1"
                        dangerouslySetInnerHTML={{ __html: article.excerpt }}
                      />
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <span>{article.breadcrumb}</span>
                        <span>By {article.author}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experiences */}
            {results.results.experiences.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  ✨ Experiences ({results.results.experiences.length})
                </h3>
                <div className="space-y-3">
                  {results.results.experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
                    >
                      <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                      <p
                        className="text-sm text-gray-600 mt-1"
                        dangerouslySetInnerHTML={{ __html: exp.excerpt }}
                      />
                      <div className="mt-2 text-xs text-gray-500">
                        {exp.breadcrumb}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {results.total_count === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No results found for &quot;{results.query}&quot;</p>
                <p className="text-sm mt-2">
                  Try searching for packages, cities, articles, or experiences
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
