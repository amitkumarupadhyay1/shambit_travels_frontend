'use client';

import { useState } from 'react';
import { City } from '@/lib/api';
import { cn, sacredStyles } from '@/lib/utils';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

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
}

export default function PackageFilters({
  cities,
  filters,
  onChange,
  onClear,
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

  return (
    <div className="mb-8">
      {/* Filter Toggle Button (Mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "md:hidden w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors",
          isOpen ? "border-orange-600 bg-orange-50" : "border-gray-200 bg-white"
        )}
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-orange-600 text-white text-xs rounded-full">
              Active
            </span>
          )}
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {/* Filters Panel */}
      <div className={cn(
        "mt-4 md:mt-0 space-y-6",
        isOpen ? "block" : "hidden md:block"
      )}>
        <div className={sacredStyles.card}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={sacredStyles.heading.h4}>Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={onClear}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination
              </label>
              <select
                value={filters.cityId || ''}
                onChange={(e) => handleCityChange(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range (₹)
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceChange(parseInt(e.target.value) || 0, filters.priceRange[1])}
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceChange(filters.priceRange[0], parseInt(e.target.value) || 100000)}
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(filters.priceRange[0], parseInt(e.target.value))}
                  className="w-full accent-orange-600"
                />
              </div>
            </div>

            {/* Minimum Experiences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Experiences
              </label>
              <select
                value={filters.minExperiences}
                onChange={(e) => handleMinExperiencesChange(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="0">Any</option>
                <option value="3">3+ experiences</option>
                <option value="5">5+ experiences</option>
                <option value="8">8+ experiences</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value as FilterState['sortBy'])}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="experiences">Most Experiences</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
