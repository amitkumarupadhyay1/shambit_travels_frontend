'use client';

import { useState } from 'react';
import { City } from '@/lib/api';
import FilterSidebar, { FilterSection } from '@/components/common/FilterSidebar';

export interface FilterState {
  cityId: number | null;
  priceRange: [number, number];
  minExperiences: number;
  sortBy: 'price-asc' | 'price-desc' | 'experiences' | 'newest';
}

interface PackageFiltersProps {
  cities: City[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
  totalCount?: number;
  filteredCount?: number;
}

export default function PackageFilters({
  cities,
  filters,
  onChange,
  onClear,
  totalCount,
  filteredCount,
}: PackageFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCityChange = (cityId: number | null) => {
    onChange({ ...filters, cityId });
  };

  const handlePriceChange = (min: number, max: number) => {
    onChange({ ...filters, priceRange: [min, max] });
  };

  const handleMinExperiencesChange = (min: number) => {
    onChange({ ...filters, minExperiences: min });
  };

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    onChange({ ...filters, sortBy });
  };

  const hasActiveFilters = 
    filters.cityId !== null || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 100000 ||
    filters.minExperiences > 0;

  const activeFilterCount = [
    filters.cityId !== null,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 100000,
    filters.minExperiences > 0,
  ].filter(Boolean).length;

  const subtitle = totalCount && filteredCount 
    ? `Showing ${filteredCount} of ${totalCount} packages`
    : undefined;

  return (
    <FilterSidebar
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      onClear={onClear}
      hasActiveFilters={hasActiveFilters}
      activeFilterCount={activeFilterCount}
      title="Filters"
      subtitle={subtitle}
    >
      {/* City Filter */}
      <FilterSection title="Destination">
        <select
          value={filters.cityId || ''}
          onChange={(e) => handleCityChange(e.target.value ? parseInt(e.target.value) : null)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm"
        >
          <option value="">All Cities</option>
          {cities.map(city => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range (₹)">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange(parseInt(e.target.value) || 0, filters.priceRange[1])}
              placeholder="Min"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
            <span className="text-gray-400 text-sm">-</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange(filters.priceRange[0], parseInt(e.target.value) || 100000)}
              placeholder="Max"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
          </div>
          <input
            type="range"
            min="0"
            max="100000"
            step="1000"
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange(filters.priceRange[0], parseInt(e.target.value))}
            className="w-full accent-orange-600 h-2 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>₹0</span>
            <span>₹1L+</span>
          </div>
        </div>
      </FilterSection>

      {/* Minimum Experiences */}
      <FilterSection title="Minimum Experiences">
        <select
          value={filters.minExperiences}
          onChange={(e) => handleMinExperiencesChange(parseInt(e.target.value))}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm"
        >
          <option value="0">Any</option>
          <option value="3">3+ experiences</option>
          <option value="5">5+ experiences</option>
          <option value="8">8+ experiences</option>
        </select>
      </FilterSection>

      {/* Sort By */}
      <FilterSection title="Sort By">
        <select
          value={filters.sortBy}
          onChange={(e) => handleSortChange(e.target.value as FilterState['sortBy'])}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="experiences">Most Experiences</option>
        </select>
      </FilterSection>
    </FilterSidebar>
  );
}
