'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Loader2, Package, MapPin, FileText, Sparkles, Clock, X } from 'lucide-react';
import Image from 'next/image';
import { useUniversalSearch } from '@/hooks/useUniversalSearch';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import UniversalSearchBoxWithSuggestions from '@/components/search/UniversalSearchBoxWithSuggestions';
import type { SearchResult } from '@/types/search';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [visibleResults, setVisibleResults] = useState({
    packages: 10,
    cities: 10,
    articles: 10,
    experiences: 10,
  });

  const { results, loading, error } = useUniversalSearch({
    initialQuery: query,
    autoSearch: true,
    debounceMs: 0, // No debounce for direct page load
  });

  const { history, addToHistory, clearHistory, removeFromHistory, getRecentSearches } = useSearchHistory();

  // Add to history when results are loaded
  useEffect(() => {
    if (query && results && !loading) {
      addToHistory(query, results.total_count);
    }
  }, [query, results, loading, addToHistory]);

  const handleSearch = (newQuery: string) => {
    router.push(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
  };

  const handleLoadMore = (category: keyof typeof visibleResults) => {
    setVisibleResults((prev) => ({
      ...prev,
      [category]: prev[category] + 10,
    }));
  };

  // Category labels
  const categoryLabels = {
    packages: 'Packages',
    cities: 'Cities',
    articles: 'Articles',
    experiences: 'Experiences',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <UniversalSearchBoxWithSuggestions
            initialQuery={query}
            onSearch={handleSearch}
            variant="header"
            showSuggestions={false}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Info */}
        {query && !loading && results && (
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Search Results for &quot;{query}&quot;
            </h1>
            <p className="text-sm text-gray-600">
              Found {results.total_count} results in {results.search_time_ms}ms
              {results.parsed_query?.location && (
                <span className="ml-2 text-orange-600">
                  • Location: {results.parsed_query.location}
                </span>
              )}
              {results.parsed_query?.intent && (
                <span className="ml-2 text-blue-600">
                  • Intent: {results.parsed_query.intent}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
            <p className="text-gray-600">Searching...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium mb-2">Search Error</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* No Query State */}
        {!query && !loading && (
          <div className="space-y-6">
            {/* Recent Searches */}
            {history.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Recent Searches
                    </h2>
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2">
                  {getRecentSearches(5).map((item) => (
                    <div
                      key={item.timestamp}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <button
                        onClick={() => handleSearch(item.query)}
                        className="flex-1 text-left flex items-center gap-3"
                      >
                        <Search className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{item.query}</span>
                        {item.resultCount !== undefined && (
                          <span className="text-xs text-gray-500">
                            ({item.resultCount} results)
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => removeFromHistory(item.query)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                        aria-label="Remove from history"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Suggestions */}
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Start Your Search
              </h2>
              <p className="text-gray-600 mb-6">
                Search for packages, cities, articles, and experiences
              </p>
              <div className="max-w-md mx-auto space-y-2 text-sm text-gray-500">
                <p>Try searching for:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['packages in ayodhya', 'hotels in mumbai', 'things to do in delhi', 'spiritual tours'].map((example) => (
                    <button
                      key={example}
                      onClick={() => handleSearch(example)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Results State */}
        {query && !loading && results && results.total_count === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Results Found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t find anything matching &quot;{query}&quot;
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Try:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Using different keywords</li>
                <li>Checking your spelling</li>
                <li>Using more general terms</li>
                <li>Trying natural language like &quot;packages in ayodhya&quot;</li>
              </ul>
            </div>
          </div>
        )}

        {/* Results */}
        {query && !loading && results && results.total_count > 0 && (
          <div className="space-y-8">
            {/* Packages */}
            {results.results.packages.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-orange-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {categoryLabels.packages} ({results.results.packages.length})
                  </h2>
                </div>
                <div className="space-y-4">
                  {results.results.packages.slice(0, visibleResults.packages).map((pkg) => (
                    <button
                      key={`package-${pkg.id}`}
                      onClick={() => handleResultClick(pkg)}
                      className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 text-left border border-gray-200 hover:border-orange-300"
                    >
                      <div className="flex gap-4">
                        {pkg.image && (
                          <div className="flex-shrink-0 w-32 h-32 bg-gray-200 rounded-lg overflow-hidden relative">
                            <Image
                              src={pkg.image}
                              alt={pkg.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {pkg.title}
                          </h3>
                          <p
                            className="text-sm text-gray-600 mb-3 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: pkg.excerpt }}
                          />
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="text-orange-600 font-semibold">
                              ₹{pkg.price}
                            </span>
                            {pkg.duration && <span>{pkg.duration}</span>}
                            <span className="text-xs">{pkg.breadcrumb}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {/* Load More Button */}
                {results.results.packages.length > visibleResults.packages && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => handleLoadMore('packages')}
                      className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                    >
                      Load More Packages ({results.results.packages.length - visibleResults.packages} more)
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Cities */}
            {results.results.cities.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {categoryLabels.cities} ({results.results.cities.length})
                  </h2>
                </div>
                <div className="space-y-4">
                  {results.results.cities.slice(0, visibleResults.cities).map((city) => (
                    <button
                      key={`city-${city.id}`}
                      onClick={() => handleResultClick(city)}
                      className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 text-left border border-gray-200 hover:border-blue-300"
                    >
                      <div className="flex gap-4">
                        {city.image && (
                          <div className="flex-shrink-0 w-32 h-32 bg-gray-200 rounded-lg overflow-hidden relative">
                            <Image
                              src={city.image}
                              alt={city.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {city.title}
                          </h3>
                          <p
                            className="text-sm text-gray-600 mb-3 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: city.excerpt }}
                          />
                          <div className="text-xs text-gray-500">
                            {city.breadcrumb}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {/* Load More Button */}
                {results.results.cities.length > visibleResults.cities && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => handleLoadMore('cities')}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Load More Cities ({results.results.cities.length - visibleResults.cities} more)
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Articles */}
            {results.results.articles.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {categoryLabels.articles} ({results.results.articles.length})
                  </h2>
                </div>
                <div className="space-y-4">
                  {results.results.articles.slice(0, visibleResults.articles).map((article) => (
                    <button
                      key={`article-${article.id}`}
                      onClick={() => handleResultClick(article)}
                      className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 text-left border border-gray-200 hover:border-green-300"
                    >
                      <div className="flex gap-4">
                        {article.image && (
                          <div className="flex-shrink-0 w-32 h-32 bg-gray-200 rounded-lg overflow-hidden relative">
                            <Image
                              src={article.image}
                              alt={article.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {article.title}
                          </h3>
                          <p
                            className="text-sm text-gray-600 mb-3 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: article.excerpt }}
                          />
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>By {article.author}</span>
                            <span>{new Date(article.published_date).toLocaleDateString()}</span>
                            <span>{article.breadcrumb}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {/* Load More Button */}
                {results.results.articles.length > visibleResults.articles && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => handleLoadMore('articles')}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Load More Articles ({results.results.articles.length - visibleResults.articles} more)
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Experiences */}
            {results.results.experiences.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {categoryLabels.experiences} ({results.results.experiences.length})
                  </h2>
                </div>
                <div className="space-y-4">
                  {results.results.experiences.slice(0, visibleResults.experiences).map((exp) => (
                    <button
                      key={`experience-${exp.id}`}
                      onClick={() => handleResultClick(exp)}
                      className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 text-left border border-gray-200 hover:border-purple-300"
                    >
                      <div className="flex gap-4">
                        {exp.image && (
                          <div className="flex-shrink-0 w-32 h-32 bg-gray-200 rounded-lg overflow-hidden relative">
                            <Image
                              src={exp.image}
                              alt={exp.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {exp.title}
                          </h3>
                          <p
                            className="text-sm text-gray-600 mb-3 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: exp.excerpt }}
                          />
                          <div className="text-xs text-gray-500">
                            {exp.breadcrumb}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {/* Load More Button */}
                {results.results.experiences.length > visibleResults.experiences && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => handleLoadMore('experiences')}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      Load More Experiences ({results.results.experiences.length - visibleResults.experiences} more)
                    </button>
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
