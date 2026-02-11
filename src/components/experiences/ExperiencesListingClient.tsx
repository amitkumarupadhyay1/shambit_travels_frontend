'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Experience, apiService } from '@/lib/api';
import { cn, sacredStyles, formatCurrency } from '@/lib/utils';
import { Clock, Users, MapPin, Search, X } from 'lucide-react';
import ExperienceDetailModal from '../packages/ExperienceDetailModal';
import ExperienceFilters from './ExperienceFilters';
import ExperienceSort, { SortOption } from './ExperienceSort';
import { SkeletonGrid } from '../common/SkeletonCard';
import { Badge, getExperienceBadge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

interface FilterState {
  category: string[];
  difficulty: string[];
  priceRange: [number, number];
}

export default function ExperiencesListingClient() {
  const searchParams = useSearchParams();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    difficulty: [],
    priceRange: [0, 100000],
  });
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Debounce search query (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load sort from URL on mount
  useEffect(() => {
    const sortParam = searchParams.get('sort') as SortOption;
    if (sortParam) {
      setSortBy(sortParam);
    }
  }, [searchParams]);

  // Load experiences
  useEffect(() => {
    const loadExperiences = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.getExperiences();
        setExperiences(data);
      } catch (err) {
        console.error('Failed to load experiences:', err);
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Failed to load experiences. Please try again.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadExperiences();
  }, []);

  // Filter and sort experiences
  const filteredAndSortedExperiences = useMemo(() => {
    let result = [...experiences];

    // Apply search filter with debounced query
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      result = result.filter(
        (exp) =>
          exp.name.toLowerCase().includes(query) ||
          exp.description.toLowerCase().includes(query) ||
          exp.city_name?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.category.length > 0) {
      result = result.filter((exp) => filters.category.includes(exp.category));
    }

    // Apply difficulty filter
    if (filters.difficulty.length > 0) {
      result = result.filter((exp) => filters.difficulty.includes(exp.difficulty_level));
    }

    // Apply price range filter
    result = result.filter(
      (exp) =>
        exp.base_price >= filters.priceRange[0] && exp.base_price <= filters.priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        result.sort((a, b) => Number(a.base_price) - Number(b.base_price));
        break;
      case 'price-desc':
        result.sort((a, b) => Number(b.base_price) - Number(a.base_price));
        break;
      case 'duration-asc':
        result.sort((a, b) => Number(a.duration_hours) - Number(b.duration_hours));
        break;
      case 'duration-desc':
        result.sort((a, b) => Number(b.duration_hours) - Number(a.duration_hours));
        break;
      case 'oldest':
        result.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case 'newest':
      default:
        result.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    return result;
  }, [experiences, debouncedSearchQuery, filters, sortBy]);

  const handleViewDetails = (experience: Experience) => {
    setSelectedExperience(experience);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExperience(null);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
  };

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category.length > 0) count += filters.category.length;
    if (filters.difficulty.length > 0) count += filters.difficulty.length;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) count += 1;
    if (debouncedSearchQuery) count += 1;
    return count;
  }, [filters, debouncedSearchQuery]);

  // Clear all filters
  const handleClearAllFilters = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setFilters({ category: [], difficulty: [], priceRange: [0, 100000] });
  }, []);

  // Remove individual filter
  const handleRemoveFilter = useCallback((type: string, value?: string) => {
    if (type === 'search') {
      setSearchQuery('');
      setDebouncedSearchQuery('');
    } else if (type === 'category' && value) {
      setFilters((prev) => ({
        ...prev,
        category: prev.category.filter((c) => c !== value),
      }));
    } else if (type === 'difficulty' && value) {
      setFilters((prev) => ({
        ...prev,
        difficulty: prev.difficulty.filter((d) => d !== value),
      }));
    } else if (type === 'price') {
      setFilters((prev) => ({
        ...prev,
        priceRange: [0, 100000],
      }));
    }
  }, []);

  // Format filter label
  const formatFilterLabel = (type: string, value: string) => {
    if (type === 'category') {
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
    if (type === 'difficulty') {
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
    return value;
  };

  return (
    <>
      <Header />
      <div className={cn(sacredStyles.container, 'py-24 md:py-32')}>
        {/* Header */}
        <div className="mb-12">
          <h1 className={cn(sacredStyles.heading.h1, 'mb-4')}>
            Explore <span className="sacred-gradient-text">Experiences</span>
          </h1>
          <p className={cn(sacredStyles.text.body, 'max-w-2xl')}>
            Discover unique spiritual and cultural experiences across India. Each experience
            is carefully curated to provide authentic and meaningful moments.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search experiences by name, description, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              aria-label="Search experiences"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDebouncedSearchQuery('');
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {searchQuery !== debouncedSearchQuery && (
            <p className="text-xs text-gray-500 mt-2 ml-1">Searching...</p>
          )}
        </div>

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Active Filters:</span>
              
              {/* Search chip */}
              {debouncedSearchQuery && (
                <FilterChip
                  label={`Search: "${debouncedSearchQuery}"`}
                  onRemove={() => handleRemoveFilter('search')}
                />
              )}

              {/* Category chips */}
              {filters.category.map((cat) => (
                <FilterChip
                  key={cat}
                  label={formatFilterLabel('category', cat)}
                  onRemove={() => handleRemoveFilter('category', cat)}
                />
              ))}

              {/* Difficulty chips */}
              {filters.difficulty.map((diff) => (
                <FilterChip
                  key={diff}
                  label={formatFilterLabel('difficulty', diff)}
                  onRemove={() => handleRemoveFilter('difficulty', diff)}
                />
              ))}

              {/* Price range chip */}
              {(filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) && (
                <FilterChip
                  label={`₹${filters.priceRange[0]} - ₹${filters.priceRange[1]}`}
                  onRemove={() => handleRemoveFilter('price')}
                />
              )}

              {/* Clear all button */}
              <button
                onClick={handleClearAllFilters}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors ml-2"
              >
                Clear All ({activeFilterCount})
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <ExperienceFilters
          onFilterChange={handleFilterChange}
          totalCount={experiences.length}
          filteredCount={filteredAndSortedExperiences.length}
        />

        {/* Sort and Results Count */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredAndSortedExperiences.length}</span>{' '}
            of <span className="font-semibold">{experiences.length}</span> experiences
          </p>
          <ExperienceSort currentSort={sortBy} onSortChange={handleSortChange} />
        </div>

        {/* Loading State */}
        {loading && <SkeletonGrid count={6} />}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-20">
            <div className={cn(sacredStyles.card, 'max-w-md mx-auto')}>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className={cn(sacredStyles.heading.h4, 'mb-3')}>
                Unable to Load Experiences
              </h3>
              <p className={cn(sacredStyles.text.body, 'mb-6 text-gray-600')}>
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className={sacredStyles.button.primary}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Experiences Grid */}
        {!loading && !error && filteredAndSortedExperiences.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredAndSortedExperiences.map((exp, index) => (
              <div
                key={exp.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ExperienceCard
                  experience={exp}
                  onViewDetails={() => handleViewDetails(exp)}
                  searchQuery={debouncedSearchQuery}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredAndSortedExperiences.length === 0 && (
          <EmptyState
            icon={<Search className="w-10 h-10" />}
            title="No experiences found"
            description="We couldn't find any experiences matching your criteria. Try adjusting your filters or search terms."
            action={
              activeFilterCount > 0
                ? {
                    label: 'Clear All Filters',
                    onClick: handleClearAllFilters,
                  }
                : undefined
            }
          />
        )}

        {/* Experience Detail Modal */}
        <ExperienceDetailModal
          experience={selectedExperience}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onToggle={() => {}} // No selection functionality on standalone page
          isSelected={false}
          isStandalone={true} // This is the standalone experiences page
        />
      </div>
      <Footer />
    </>
  );
}

// Filter Chip Component - Memoized for performance
interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

const FilterChip = memo(function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
      'bg-orange-50 text-orange-700 border border-orange-200',
      'transition-all duration-200 ease-out',
      'hover:bg-orange-100 hover:border-orange-300 hover:shadow-sm',
      'animate-in fade-in slide-in-from-left-2 duration-200'
    )}>
      <span>{label}</span>
      <button
        onClick={onRemove}
        className={cn(
          'rounded-full p-0.5 transition-all duration-200',
          'hover:bg-orange-200 hover:scale-110',
          'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1'
        )}
        aria-label={`Remove ${label} filter`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
});

interface ExperienceCardProps {
  experience: Experience;
  onViewDetails: () => void;
  searchQuery?: string;
}

// Memoized ExperienceCard to prevent unnecessary re-renders
const ExperienceCard = memo(function ExperienceCard({ 
  experience, 
  onViewDetails, 
  searchQuery = '' 
}: ExperienceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Memoize the highlight function to avoid recreating on every render
  const highlightText = useCallback((text: string, query: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 text-gray-900 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  }, []);

  // Memoize the highlighted name and description
  const highlightedName = useMemo(
    () => highlightText(experience.name, searchQuery),
    [experience.name, searchQuery, highlightText]
  );

  const highlightedDescription = useMemo(
    () => highlightText(experience.description, searchQuery),
    [experience.description, searchQuery, highlightText]
  );

  // Determine badge type - using getExperienceBadge helper
  const badgeType = useMemo(() => {
    return getExperienceBadge(experience);
  }, [experience]);
  return (
    <div
      className={cn(
        sacredStyles.card,
        'group cursor-pointer',
        'transition-all duration-300 ease-out',
        'hover:shadow-2xl hover:-translate-y-1',
        'p-4 sm:p-6',
        'focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onViewDetails}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewDetails();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${experience.name}`}
    >
      {/* Image */}
      <div className="relative h-40 sm:h-48 mb-3 sm:mb-4 rounded-xl overflow-hidden bg-gray-100">
        {experience.featured_image_url ? (
          <Image
            src={experience.featured_image_url}
            alt={`${experience.name} - ${experience.category} experience${experience.city_name ? ` in ${experience.city_name}` : ''}`}
            fill
            className={cn(
              'object-cover transition-all duration-500 ease-out',
              isHovered && 'scale-110 brightness-110'
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
          />
        ) : (
          <div className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 h-full flex items-center justify-center">
            <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-orange-600/40" />
          </div>
        )}

        {/* Badge */}
        {badgeType && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            <Badge type={badgeType} />
          </div>
        )}

        {/* Price Badge */}
        <div className={cn(
          'absolute top-2 sm:top-3 right-2 sm:right-3',
          'bg-white/95 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2',
          'shadow-lg transition-all duration-300',
          isHovered && 'scale-110 shadow-xl'
        )}>
          <span className="text-base sm:text-lg font-bold text-orange-600">
            {formatCurrency(experience.base_price)}
          </span>
        </div>

        {/* Hover Overlay */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent',
          'transition-opacity duration-300',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}>
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <p className="text-sm font-medium">Click to view details</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        <h3
          className={cn(
            sacredStyles.heading.h4,
            'mb-2 sm:mb-3 transition-colors duration-300',
            'text-base sm:text-lg',
            isHovered && 'text-orange-600'
          )}
        >
          {highlightedName}
        </h3>

        <p className={cn(sacredStyles.text.body, 'mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 text-sm')}>
          {highlightedDescription}
        </p>

        {/* Quick Info */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
          <div className="flex items-center gap-1" title={`Duration: ${experience.duration_hours} hours`}>
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
            <span>{experience.duration_hours}h</span>
          </div>
          <div className="flex items-center gap-1" title={`Maximum ${experience.max_participants} participants`}>
            <Users className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
            <span>Up to {experience.max_participants}</span>
          </div>
        </div>

        {/* Category & Difficulty */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-orange-50 text-orange-700 text-xs font-medium">
            {experience.category}
          </span>
          <span className={cn(
            'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium',
            experience.difficulty_level === 'EASY' && 'bg-green-50 text-green-700',
            experience.difficulty_level === 'MODERATE' && 'bg-yellow-50 text-yellow-700',
            experience.difficulty_level === 'HARD' && 'bg-red-50 text-red-700'
          )}>
            {experience.difficulty_level}
          </span>
        </div>
      </div>
    </div>
  );
});

// Add display name for better debugging
ExperienceCard.displayName = 'ExperienceCard';
