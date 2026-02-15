'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FilterSidebar, { FilterSection, FilterCheckbox, FilterRadio } from '@/components/common/FilterSidebar';

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

  const hasActiveFilters = activeFilterCount > 0;
  const subtitle = `Showing ${filteredCount} of ${totalCount} experiences`;

  return (
    <FilterSidebar
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      onClear={handleClearAll}
      hasActiveFilters={hasActiveFilters}
      activeFilterCount={activeFilterCount}
      title="Filters"
      subtitle={subtitle}
    >
      {/* Category Filter */}
      <FilterSection title="Category">
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <FilterCheckbox
              key={cat.value}
              label={cat.label}
              checked={filters.category.includes(cat.value)}
              onChange={() => handleCategoryToggle(cat.value)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Difficulty Filter */}
      <FilterSection title="Difficulty Level">
        <div className="space-y-2">
          {DIFFICULTY_LEVELS.map((level) => (
            <FilterCheckbox
              key={level.value}
              label={level.label}
              checked={filters.difficulty.includes(level.value)}
              onChange={() => handleDifficultyToggle(level.value)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection title="Price Range">
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => (
            <FilterRadio
              key={`${range.min}-${range.max}`}
              name="priceRange"
              label={range.label}
              checked={
                filters.priceRange[0] === range.min &&
                filters.priceRange[1] === range.max
              }
              onChange={() => handlePriceRangeChange(range.min, range.max)}
            />
          ))}
        </div>
      </FilterSection>
    </FilterSidebar>
  );
}
