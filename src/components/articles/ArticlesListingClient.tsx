'use client';

import { useState, useEffect, useMemo } from 'react';
import { Article, City, apiService } from '@/lib/api';
import { cn, sacredStyles } from '@/lib/utils';
import { Loader2, Calendar, User, MapPin, Search, X, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { NoSearchResultsState, ErrorState } from '../common/EmptyState';
import FilterSidebar, { FilterSection } from '../common/FilterSidebar';
import Image from 'next/image';

type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc';

interface ArticleWithMedia extends Article {
  mediaUrl?: string;
}

export default function ArticlesListingClient() {
  const [articles, setArticles] = useState<ArticleWithMedia[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Load articles and cities with media
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [articlesData, citiesData] = await Promise.all([
          apiService.getArticles(),
          apiService.getCities(),
        ]);

        // Fetch media for each article
        const articlesWithMedia = await Promise.all(
          articlesData.map(async (article) => {
            try {
              const media = await apiService.getMediaForObject('articles.article', article.id);
              return {
                ...article,
                mediaUrl: media.length > 0 ? media[0].file_url : undefined,
              };
            } catch (err) {
              console.error(`Failed to fetch media for article ${article.id}:`, err);
              return article;
            }
          })
        );

        setArticles(articlesWithMedia);
        setCities(citiesData);
      } catch (err) {
        console.error('Failed to load articles:', err);
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and sort articles
  const filteredAndSortedArticles = useMemo(() => {
    let result = [...articles];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt?.toLowerCase().includes(query) ||
          article.author.toLowerCase().includes(query) ||
          article.city_name?.toLowerCase().includes(query)
      );
    }

    // City filter
    if (selectedCity) {
      result = result.filter((article) => {
        const city = cities.find((c) => c.name === article.city_name);
        return city?.id === selectedCity;
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return result;
  }, [articles, cities, searchQuery, selectedCity, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCity(null);
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery !== '' || selectedCity !== null || sortBy !== 'newest';
  const activeFilterCount = [searchQuery !== '', selectedCity !== null].filter(Boolean).length;

  return (
    <>
      <Header />
      <div className={cn(sacredStyles.container, 'pt-32 pb-24 md:pt-40 md:pb-32')}>
        {/* Header */}
        <div className="mb-12">
          <h1 className={cn(sacredStyles.heading.h1, 'mb-4')}>
            Articles & <span className="sacred-gradient-text">Travel Guides</span>
          </h1>
          <p className={cn(sacredStyles.text.body, 'max-w-2xl')}>
            Explore our collection of travel guides, spiritual insights, and cultural stories
            from India&apos;s most sacred destinations.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles by title, author, or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop: Sidebar Layout | Mobile: Stacked */}
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:block">
            <FilterSidebar
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
              onClear={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
              activeFilterCount={activeFilterCount}
              title="Filters"
              subtitle={`Showing ${filteredAndSortedArticles.length} of ${articles.length} articles`}
            >
              {/* City Filter */}
              <FilterSection title="Destination">
                <select
                  value={selectedCity || ''}
                  onChange={(e) => setSelectedCity(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm"
                >
                  <option value="">All Destinations</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </FilterSection>

              {/* Sort By */}
              <FilterSection title="Sort By">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title-asc">Title: A to Z</option>
                  <option value="title-desc">Title: Z to A</option>
                </select>
              </FilterSection>
            </FilterSidebar>
          </aside>

          {/* Main Content */}
          <div>
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="py-20">
                <ErrorState
                  message={error}
                  onRetry={() => window.location.reload()}
                />
              </div>
            )}

            {/* Articles Grid */}
            {!loading && !error && filteredAndSortedArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredAndSortedArticles.length === 0 && (
              <NoSearchResultsState
                query={searchQuery}
                onReset={handleClearFilters}
              />
            )}

            {/* Results Count */}
            {!loading && !error && filteredAndSortedArticles.length > 0 && (
              <div className="mt-8 text-center text-sm text-gray-600">
                Showing {filteredAndSortedArticles.length} of {articles.length} articles
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

interface ArticleCardProps {
  article: ArticleWithMedia;
}

function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate = new Date(article.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const imageUrl = article.mediaUrl || article.featured_image;

  return (
    <Link href={`/articles/${article.slug}`}>
      <div
        className={cn(
          sacredStyles.card,
          'group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer h-full flex flex-col'
        )}
      >
        {/* Featured Image */}
        <div className="relative h-48 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-orange-600/20 to-yellow-600/20">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-orange-600/40" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
            {article.city_name && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{article.city_name}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3
            className={cn(
              sacredStyles.heading.h4,
              'mb-2 group-hover:text-orange-600 transition-colors line-clamp-2'
            )}
          >
            {article.title}
          </h3>

          {/* Excerpt */}
          {article.excerpt && (
            <p className={cn(sacredStyles.text.body, 'mb-4 line-clamp-3 flex-1')}>
              {article.excerpt}
            </p>
          )}

          {/* Author */}
          <div className="flex items-center gap-2 text-sm text-gray-600 pt-4 border-t border-gray-100">
            <User className="w-4 h-4" />
            <span>By {article.author}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
