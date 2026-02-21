'use client';

import { useState, useEffect, useMemo } from 'react';
import { Package, City, apiService } from '@/lib/api';
import { cn, sacredStyles, formatCurrency } from '@/lib/utils';
import { Loader2, MapPin, Calendar, GitCompare } from 'lucide-react';
import Link from 'next/link';
import { useComparison } from '@/contexts/ComparisonContext';
import PackageFilters, { FilterState } from './PackageFilters';
import SearchBar from './SearchBar';

export default function PackagesListingClient() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    cityId: null,
    priceRange: [0, 100000],
    minExperiences: 0,
    sortBy: 'newest',
  });

  // Load packages and cities
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [packagesData, citiesData] = await Promise.all([
          filters.cityId
            ? apiService.getPackagesByCity(filters.cityId)
            : apiService.getPackages(),
          apiService.getCities(),
        ]);
        setPackages(packagesData);
        setCities(citiesData);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error('Failed to load packages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters.cityId]);

  // Filter and sort packages
  const filteredPackages = useMemo(() => {
    let result = packages;

    // Search filter
    if (searchQuery) {
      result = result.filter(pkg =>
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.city_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    result = result.filter(pkg => {
      if (pkg.experiences.length === 0) return true;
      const minPrice = Math.min(...pkg.experiences.map(e => e.base_price));
      return minPrice >= filters.priceRange[0] && minPrice <= filters.priceRange[1];
    });

    // Minimum experiences filter
    if (filters.minExperiences > 0) {
      result = result.filter(pkg => pkg.experiences.length >= filters.minExperiences);
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc': {
          const aMin = a.experiences.length > 0 ? Math.min(...a.experiences.map(e => e.base_price)) : 0;
          const bMin = b.experiences.length > 0 ? Math.min(...b.experiences.map(e => e.base_price)) : 0;
          return aMin - bMin;
        }
        case 'price-desc': {
          const aMin = a.experiences.length > 0 ? Math.min(...a.experiences.map(e => e.base_price)) : 0;
          const bMin = b.experiences.length > 0 ? Math.min(...b.experiences.map(e => e.base_price)) : 0;
          return bMin - aMin;
        }
        case 'experiences':
          return b.experiences.length - a.experiences.length;
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return result;
  }, [packages, searchQuery, filters]);

  const handleClearFilters = () => {
    setFilters({
      cityId: null,
      priceRange: [0, 100000],
      minExperiences: 0,
      sortBy: 'newest',
    });
    setSearchQuery('');
  };

  return (
    <div className={cn(sacredStyles.container, "py-8 md:py-12")}>
      {/* Header */}
      <div className="mb-12">
        <h1 className={cn(sacredStyles.heading.h1, "mb-4")}>
          Explore Our <span className="sacred-gradient-text">Packages</span>
        </h1>
        <p className={cn(sacredStyles.text.body, "max-w-2xl")}>
          Discover handcrafted spiritual journeys across India. Each package is customizable with your choice of experiences, hotels, and transport.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {/* Desktop: Sidebar Layout | Mobile: Stacked */}
      <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:block">
          <PackageFilters
            cities={cities}
            filters={filters}
            onChange={setFilters}
            onClear={handleClearFilters}
            totalCount={packages.length}
            filteredCount={filteredPackages.length}
          />
        </aside>

        {/* Main Content */}
        <div>
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
            </div>
          )}

          {/* Packages Grid */}
          {!loading && filteredPackages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPackages.map(pkg => (
                <PackageCard key={pkg.id} package={pkg} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredPackages.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">
                No packages found matching your criteria.
              </p>
              <button
                onClick={handleClearFilters}
                className={sacredStyles.button.secondary}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Results Count */}
          {!loading && filteredPackages.length > 0 && (
            <div className="mt-8 text-center text-sm text-gray-600">
              Showing {filteredPackages.length} of {packages.length} packages
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface PackageCardProps {
  package: Package;
}

function PackageCard({ package: pkg }: PackageCardProps) {
  const { addPackage, isInComparison } = useComparison();
  const minPrice = pkg.experiences.length > 0
    ? Math.min(...pkg.experiences.map(e => e.base_price))
    : 0;

  const handleAddToCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addPackage(pkg);
  };

  const inComparison = isInComparison(pkg.id);

  return (
    <div className="relative">
      <Link href={`/packages/${pkg.slug}`}>
        <div className={cn(
          sacredStyles.card,
          "group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer h-full"
        )}>
          {/* Placeholder Image */}
          <div className="relative h-48 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-orange-600/20 to-yellow-600/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-16 h-16 text-orange-600/40" />
            </div>

            {/* Price Badge */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
              <span className="font-bold text-orange-600">
                From {formatCurrency(minPrice)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span>{pkg.city_name}</span>
            </div>

            <h3 className={cn(
              sacredStyles.heading.h4,
              "mb-2 group-hover:text-orange-600 transition-colors"
            )}>
              {pkg.name}
            </h3>

            <p className={cn(sacredStyles.text.body, "mb-4 line-clamp-3")}>
              {pkg.description}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{pkg.experiences.length} Experiences</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Compare Button */}
      <button
        onClick={handleAddToCompare}
        disabled={inComparison}
        className={cn(
          "absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
          "flex items-center gap-1.5",
          inComparison
            ? "bg-green-600 text-white cursor-not-allowed"
            : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-orange-600 hover:text-white"
        )}
      >
        <GitCompare className="w-4 h-4" />
        {inComparison ? 'Added' : 'Compare'}
      </button>
    </div>
  );
}
