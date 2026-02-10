'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Experience, apiService } from '@/lib/api';
import { cn, sacredStyles, formatCurrency } from '@/lib/utils';
import { Clock, Users, MapPin, Search } from 'lucide-react';
import ExperienceDetailModal from '../packages/ExperienceDetailModal';
import ExperienceFilters from './ExperienceFilters';
import ExperienceSort, { SortOption } from './ExperienceSort';
import { SkeletonGrid } from '../common/SkeletonCard';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    difficulty: [],
    priceRange: [0, 100000],
  });
  const [sortBy, setSortBy] = useState<SortOption>('newest');

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
      try {
        const data = await apiService.getExperiences();
        setExperiences(data);
      } catch (error) {
        console.error('Failed to load experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExperiences();
  }, []);

  // Filter and sort experiences
  const filteredAndSortedExperiences = useMemo(() => {
    let result = [...experiences];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (exp) =>
          exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exp.description.toLowerCase().includes(searchQuery.toLowerCase())
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
  }, [experiences, searchQuery, filters, sortBy]);

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
              placeholder="Search experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

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

        {/* Experiences Grid */}
        {!loading && filteredAndSortedExperiences.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredAndSortedExperiences.map((exp) => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                onViewDetails={() => handleViewDetails(exp)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredAndSortedExperiences.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">
              No experiences found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilters({ category: [], difficulty: [], priceRange: [0, 100000] });
              }}
              className={sacredStyles.button.secondary}
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Experience Detail Modal */}
        <ExperienceDetailModal
          experience={selectedExperience}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onToggle={() => {}} // No selection functionality on standalone page
          isSelected={false}
        />
      </div>
      <Footer />
    </>
  );
}

interface ExperienceCardProps {
  experience: Experience;
  onViewDetails: () => void;
}

function ExperienceCard({ experience, onViewDetails }: ExperienceCardProps) {
  return (
    <div
      className={cn(
        sacredStyles.card,
        'group hover:shadow-xl transition-all duration-300',
        'p-4 sm:p-6' // Reduced padding on mobile
      )}
    >
      {/* Image */}
      <div className="relative h-40 sm:h-48 mb-3 sm:mb-4 rounded-xl overflow-hidden">
        {experience.featured_image_url ? (
          <Image
            src={experience.featured_image_url}
            alt={`${experience.name} - ${experience.category} experience${experience.city_name ? ` in ${experience.city_name}` : ''}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 h-full flex items-center justify-center">
            <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-orange-600/40" />
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2">
          <span className="text-base sm:text-lg font-bold text-orange-600">
            {formatCurrency(experience.base_price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div>
        <h3
          className={cn(
            sacredStyles.heading.h4,
            'mb-2 sm:mb-3 group-hover:text-orange-600 transition-colors',
            'text-base sm:text-lg' // Smaller on mobile
          )}
        >
          {experience.name}
        </h3>

        <p className={cn(sacredStyles.text.body, 'mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 text-sm')}>
          {experience.description}
        </p>

        {/* Quick Info */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{experience.duration_hours}h</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Up to {experience.max_participants}</span>
          </div>
        </div>

        {/* View Details Button */}
        <button
          onClick={onViewDetails}
          aria-label={`View details for ${experience.name}`}
          className={cn(sacredStyles.button.primary, 'w-full text-sm sm:text-base py-2 sm:py-3')}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
