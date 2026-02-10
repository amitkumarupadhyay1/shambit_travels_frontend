'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Filter, X, ChevronDown } from 'lucide-react';

interface FilterState {
  category: string[];
  difficulty: string[];
  priceRange: [number, number];
}

interface ExperienceFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

const CATEGORIES = [
  { value: 'CULTURAL', label: 'Cultural' },
  { value: 'ADVENTURE', label: 'Adventure' },
  { value: 'FOOD', label: 'Food & Culinary' },
  { value: 'SPIRITUAL', label: 'Spiritual' },
  { value: 'NATURE', label: 'Nature & Wildlife' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'EDUCATIONAL', label: 'Educational' },
];

const DIFFICULTY_LEVELS = [
  { value: 'EASY', label: 'Easy' },
  { value: 'MODERATE', label: 'Moderate' },
  { value: 'HARD', label: 'Hard' },
];

const PRICE_RANGES = [
  { min: 0, max: 1000, label: 'Under ₹1,000' },
  { min: 1000, max: 2500, label: '₹1,000 - ₹2,500' },
  { min: 2500, max: 5000, label: '₹2,500 - ₹5,000' },
  { min: 5000, max: 100000, label: 'Above ₹5,000' },
];

export default function ExperienceFilters({
  onFilterChange,
  totalCount,
  filteredCount,
}: ExperienceFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    category: [],
    difficulty: [],
    priceRange: [0, 100000],
  });

  // Load filters from URL on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const difficultyParam = searchParams.get('difficulty');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const newFilters: FilterState = {
      category: categoryParam ? categoryParam.split(',') : [],
      difficulty: difficultyParam ? difficultyParam.split(',') : [],
      priceRange: [
        minPrice ? parseInt(minPrice) : 0,
        maxPrice ? parseInt(maxPrice) : 100000,
      ],
    };

    setFilters(newFilters);
    // Call onFilterChange after state is set
    setTimeout(() => onFilterChange(newFilters), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Update URL when filters change
  const updateURL = (newFilters: FilterState) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newFilters.category.length > 0) {
      params.set('category', newFilters.category.join(','));
    } else {
      params.delete('category');
    }

    if (newFilters.difficulty.length > 0) {
      params.set('difficulty', newFilters.difficulty.join(','));
    } else {
      params.delete('difficulty');
    }

    if (newFilters.priceRange[0] !== 0) {
      params.set('minPrice', newFilters.priceRange[0].toString());
    } else {
      params.delete('minPrice');
    }

    if (newFilters.priceRange[1] !== 100000) {
      params.set('maxPrice', newFilters.priceRange[1].toString());
    } else {
      params.delete('maxPrice');
    }

    const newURL = params.toString() ? `?${params.toString()}` : '/experiences';
    router.push(newURL, { scroll: false });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.category.includes(category)
      ? filters.category.filter((c) => c !== category)
      : [...filters.category, category];

    const newFilters = { ...filters, category: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
    updateURL(newFilters);
  };

  const handleDifficultyToggle = (difficulty: string) => {
    const newDifficulty = filters.difficulty.includes(difficulty)
      ? filters.difficulty.filter((d) => d !== difficulty)
      : [...filters.difficulty, difficulty];

    const newFilters = { ...filters, difficulty: newDifficulty };
    setFilters(newFilters);
    onFilterChange(newFilters);
    updateURL(newFilters);
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    const newFilters = { ...filters, priceRange: [min, max] as [number, number] };
    setFilters(newFilters);
    onFilterChange(newFilters);
    updateURL(newFilters);
  };

  const handleClearAll = () => {
    const newFilters: FilterState = {
      category: [],
      difficulty: [],
      priceRange: [0, 100000],
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
    router.push('/experiences', { scroll: false });
  };

  const activeFilterCount =
    filters.category.length +
    filters.difficulty.length +
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 100000 ? 1 : 0);

  return (
    <div className="mb-8">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full flex items-center justify-between px-4 py-3 border-2 border-gray-200 rounded-lg',
            'hover:border-orange-300 transition-colors'
          )}
        >
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <ChevronDown
            className={cn('w-5 h-5 transition-transform', isOpen && 'rotate-180')}
          />
        </button>
      </div>

      {/* Filter Panel */}
      <div
        className={cn(
          'lg:block',
          !isOpen && 'hidden',
          'bg-white border-2 border-gray-200 rounded-lg p-6'
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredCount} of {totalCount} experiences
            </p>
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Category Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Category</h4>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <label
                  key={cat.value}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.category.includes(cat.value)}
                    onChange={() => handleCategoryToggle(cat.value)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {cat.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Difficulty Level</h4>
            <div className="space-y-2">
              {DIFFICULTY_LEVELS.map((level) => (
                <label
                  key={level.value}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.difficulty.includes(level.value)}
                    onChange={() => handleDifficultyToggle(level.value)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {level.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
            <div className="space-y-2">
              {PRICE_RANGES.map((range) => (
                <label
                  key={`${range.min}-${range.max}`}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    checked={
                      filters.priceRange[0] === range.min &&
                      filters.priceRange[1] === range.max
                    }
                    onChange={() => handlePriceRangeChange(range.min, range.max)}
                    className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters Chips */}
        {activeFilterCount > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {filters.category.map((cat) => (
                <FilterChip
                  key={cat}
                  label={CATEGORIES.find((c) => c.value === cat)?.label || cat}
                  onRemove={() => handleCategoryToggle(cat)}
                />
              ))}
              {filters.difficulty.map((diff) => (
                <FilterChip
                  key={diff}
                  label={DIFFICULTY_LEVELS.find((d) => d.value === diff)?.label || diff}
                  onRemove={() => handleDifficultyToggle(diff)}
                />
              ))}
              {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 100000) && (
                <FilterChip
                  label={
                    PRICE_RANGES.find(
                      (r) =>
                        r.min === filters.priceRange[0] && r.max === filters.priceRange[1]
                    )?.label || 'Custom Range'
                  }
                  onRemove={() => handlePriceRangeChange(0, 100000)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <div className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
