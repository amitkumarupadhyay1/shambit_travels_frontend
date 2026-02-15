'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Loader2, Package, MapPin, FileText, Sparkles, Clock, X, TrendingUp, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useUniversalSearch } from '@/hooks/useUniversalSearch';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import UniversalSearchBoxWithSuggestions from '@/components/search/UniversalSearchBoxWithSuggestions';
import type { SearchResult } from '@/types/search';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [visibleResults, setVisibleResults] = useState({
    packages: 6,
    cities: 6,
    articles: 6,
    experiences: 6,
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
      [category]: prev[category] + 6,
    }));
  };

  // Category config
  const categoryConfig = {
    packages: {
      label: 'Travel Packages',
      icon: Package,
      color: 'orange',
      gradient: 'from-orange-500 to-amber-500',
      bgGradient: 'from-orange-50 to-amber-50',
      borderColor: 'border-orange-200 hover:border-orange-300',
    },
    cities: {
      label: 'Destinations',
      icon: MapPin,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200 hover:border-blue-300',
    },
    articles: {
      label: 'Travel Guides',
      icon: FileText,
      color: 'green',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200 hover:border-green-300',
    },
    experiences: {
      label: 'Experiences',
      icon: Sparkles,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200 hover:border-purple-300',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <Header />
      
      {/* Add padding-top to account for fixed header */}
      <div className="pt-[120px] md:pt-[140px]">
        {/* Search Header - Sticky */}
        <div className="bg-white border-b border-gray-200 sticky top-[120px] md:top-[140px] z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <UniversalSearchBoxWithSuggestions
              initialQuery={query}
              onSearch={handleSearch}
              variant="header"
              showSuggestions={false}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Info */}
        {query && !loading && results && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Search Results
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-gray-600">
                Found <span className="font-semibold text-gray-900">{results.total_count}</span> results for
                <span className="font-semibold text-orange-600 ml-1">&quot;{query}&quot;</span>
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">
                {results.search_time_ms}ms
              </span>
              {results.parsed_query?.location && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    <MapPin className="w-3 h-3" />
                    {results.parsed_query.location}
                  </span>
                </>
              )}
              {results.parsed_query?.intent && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    <TrendingUp className="w-3 h-3" />
                    {results.parsed_query.intent}
                  </span>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <Loader2 className="w-16 h-16 text-orange-600 animate-spin mb-4 mx-auto" />
              <p className="text-lg font-medium text-gray-900">Searching...</p>
              <p className="text-sm text-gray-500 mt-1">Finding the best results for you</p>
            </motion.div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-900 font-semibold text-lg mb-2">Search Error</p>
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {/* No Query State */}
        {!query && !loading && (
          <div className="space-y-8">
            {/* Recent Searches */}
            {history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Recent Searches
                    </h2>
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2">
                  {getRecentSearches(5).map((item) => (
                    <motion.div
                      key={item.timestamp}
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-200"
                    >
                      <button
                        onClick={() => handleSearch(item.query)}
                        className="flex-1 text-left flex items-center gap-3"
                      >
                        <Search className="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
                        <span className="text-gray-700 font-medium group-hover:text-gray-900">{item.query}</span>
                        {item.resultCount !== undefined && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {item.resultCount} results
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => removeFromHistory(item.query)}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-200 rounded-lg transition-all"
                        aria-label="Remove from history"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Search Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-orange-50 via-white to-amber-50 rounded-2xl shadow-sm border border-orange-100 p-12 text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Start Your Search Journey
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Discover packages, destinations, articles, and experiences across India
              </p>
              <div className="max-w-2xl mx-auto">
                <p className="text-sm font-medium text-gray-700 mb-4">Try searching for:</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {[
                    { text: 'packages in ayodhya', icon: Package },
                    { text: 'hotels in mumbai', icon: MapPin },
                    { text: 'things to do in delhi', icon: Sparkles },
                    { text: 'spiritual tours', icon: FileText },
                  ].map((example) => (
                    <button
                      key={example.text}
                      onClick={() => handleSearch(example.text)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-full text-gray-700 hover:text-orange-700 transition-all font-medium shadow-sm hover:shadow"
                    >
                      <example.icon className="w-4 h-4" />
                      {example.text}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* No Results State */}
        {query && !loading && results && results.total_count === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No Results Found
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn&apos;t find anything matching &quot;{query}&quot;
            </p>
            <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto">
              <p className="text-sm font-medium text-gray-700 mb-3">Try:</p>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <span>Using different keywords</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <span>Checking your spelling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <span>Using more general terms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <span>Trying natural language like &quot;packages in ayodhya&quot;</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {query && !loading && results && results.total_count > 0 && (
          <div className="space-y-12">
            {/* Render each category */}
            {(Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>).map((category) => {
              const categoryResults = results.results[category];
              if (categoryResults.length === 0) return null;

              const config = categoryConfig[category];
              const Icon = config.icon;

              return (
                <motion.section
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {config.label}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {categoryResults.length} {categoryResults.length === 1 ? 'result' : 'results'}
                      </p>
                    </div>
                  </div>

                  {/* Results Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryResults.slice(0, visibleResults[category]).map((result, index) => (
                      <motion.button
                        key={`${category}-${result.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -4 }}
                        onClick={() => handleResultClick(result)}
                        className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all p-6 text-left border ${config.borderColor} group`}
                      >
                        {/* Image */}
                        {result.image && (
                          <div className="relative h-48 bg-gradient-to-br ${config.bgGradient} rounded-xl overflow-hidden mb-4">
                            <Image
                              src={result.image}
                              alt={result.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-${config.color}-600 transition-colors">
                            {result.title}
                          </h3>
                          <p
                            className="text-sm text-gray-600 mb-4 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: result.excerpt }}
                          />

                          {/* Meta Info */}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="line-clamp-1">{result.breadcrumb}</span>
                            <ArrowRight className={`w-4 h-4 text-${config.color}-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
                          </div>

                          {/* Package specific info */}
                          {'price' in result && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-orange-600">
                                  ₹{result.price}
                                </span>
                                {'duration' in result && result.duration && (
                                  <span className="text-sm text-gray-500">
                                    {result.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Article specific info */}
                          {'author' in result && (
                            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                              <span>By {result.author}</span>
                              <span>•</span>
                              <span>{new Date(result.published_date).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Load More Button */}
                  {categoryResults.length > visibleResults[category] && (
                    <div className="mt-8 text-center">
                      <button
                        onClick={() => handleLoadMore(category)}
                        className={`inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r ${config.gradient} text-white rounded-xl hover:shadow-lg transition-all font-semibold`}
                      >
                        Load More {config.label}
                        <span className="text-sm opacity-90">
                          ({categoryResults.length - visibleResults[category]} more)
                        </span>
                      </button>
                    </div>
                  )}
                </motion.section>
              );
            })}
          </div>
        )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
