'use client';

import { useState, useEffect, useMemo } from 'react';
import { City, apiService } from '@/lib/api';
import { cn, sacredStyles } from '@/lib/utils';
import { Loader2, MapPin, Search, X } from 'lucide-react';
import Link from 'next/link';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { NoSearchResultsState, ErrorState } from '../common/EmptyState';
import FilterSidebar, { FilterSection } from '../common/FilterSidebar';
import Image from 'next/image';

type SortOption = 'name-asc' | 'name-desc' | 'newest' | 'oldest';

interface CityWithMedia extends City {
  mediaUrl?: string;
}

export default function DestinationsListingClient() {
  const [cities, setCities] = useState<CityWithMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Load cities and their media
  useEffect(() => {
    const loadCities = async () => {
      setLoading(true);
      setError(null);
      try {
        const citiesData = await apiService.getCities();

        // Fetch media for each city
        const citiesWithMedia = await Promise.all(
          citiesData.map(async (city) => {
            try {
              const media = await apiService.getMediaForObject('cities.city', city.id);
              return {
                ...city,
                mediaUrl: media.length > 0 ? media[0].file_url : undefined,
              };
            } catch (err) {
              console.error(`Failed to fetch media for city ${city.id}:`, err);
              return city;
            }
          })
        );

        setCities(citiesWithMedia);
      } catch (err) {
        console.error('Failed to load cities:', err);
        setError(err instanceof Error ? err.message : 'Failed to load destinations');
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, []);

  // Filter and sort cities
  const filteredAndSortedCities = useMemo(() => {
    let result = [...cities];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (city) =>
          city.name.toLowerCase().includes(query) ||
          city.description.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return result;
  }, [cities, searchQuery, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSortBy('name-asc');
  };

  const hasActiveFilters = searchQuery !== '' || sortBy !== 'name-asc';

  return (
    <>
      <Header />
      <div className={cn(sacredStyles.container, 'pt-24 pb-24 md:pt-28 md:pb-32')}>
        {/* Header */}
        <div className="mb-12">
          <h1 className={cn(sacredStyles.heading.h1, 'mb-4')}>
            Explore <span className="sacred-gradient-text">Destinations</span>
          </h1>
          <p className={cn(sacredStyles.text.body, 'max-w-2xl')}>
            Discover India&apos;s most sacred and spiritual destinations. Each city offers unique
            experiences, rich cultural heritage, and divine connections.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search destinations by name or description..."
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
              title="Sort & Filter"
              subtitle={`Showing ${filteredAndSortedCities.length} of ${cities.length} destinations`}
            >
              <FilterSection title="Sort By">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm"
                >
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
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

            {/* Cities Grid */}
            {!loading && !error && filteredAndSortedCities.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedCities.map((city) => (
                  <CityCard key={city.id} city={city} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredAndSortedCities.length === 0 && (
              <NoSearchResultsState
                query={searchQuery}
                onReset={handleClearFilters}
              />
            )}

            {/* Results Count */}
            {!loading && !error && filteredAndSortedCities.length > 0 && (
              <div className="mt-8 text-center text-sm text-gray-600">
                Showing {filteredAndSortedCities.length} of {cities.length} destinations
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

interface CityCardProps {
  city: CityWithMedia;
}

function CityCard({ city }: CityCardProps) {
  const imageUrl = city.mediaUrl || city.hero_image;

  return (
    <Link href={`/cities/${city.slug}`}>
      <div
        className={cn(
          sacredStyles.card,
          'group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer h-full'
        )}
      >
        {/* Hero Image */}
        <div className="relative h-56 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-orange-600/20 to-yellow-600/20">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={city.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-20 h-20 text-orange-600/40" />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-sm font-medium">Explore {city.name}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <h3
            className={cn(
              sacredStyles.heading.h3,
              'mb-3 group-hover:text-orange-600 transition-colors'
            )}
          >
            {city.name}
          </h3>

          <p className={cn(sacredStyles.text.body, 'line-clamp-3 mb-4')}>
            {city.description}
          </p>

          {/* CTA */}
          <div className="flex items-center gap-2 text-orange-600 font-medium group-hover:gap-3 transition-all">
            <span>Discover More</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
