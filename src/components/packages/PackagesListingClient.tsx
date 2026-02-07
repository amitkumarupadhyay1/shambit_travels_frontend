'use client';

import { useState, useEffect } from 'react';
import { Package, City, apiService } from '@/lib/api';
import { cn, sacredStyles, formatCurrency } from '@/lib/utils';
import { Search, Filter, Loader2, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function PackagesListingClient() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load packages and cities
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [packagesData, citiesData] = await Promise.all([
          selectedCity 
            ? apiService.getPackagesByCity(selectedCity)
            : apiService.getPackages(),
          apiService.getCities(),
        ]);
        setPackages(packagesData);
        setCities(citiesData);
      } catch (error) {
        console.error('Failed to load packages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCity]);

  // Filter packages by search query
  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.city_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn(sacredStyles.container, "py-12")}>
      {/* Header */}
      <div className="mb-12">
        <h1 className={cn(sacredStyles.heading.h1, "mb-4")}>
          Explore Our <span className="sacred-gradient-text">Packages</span>
        </h1>
        <p className={cn(sacredStyles.text.body, "max-w-2xl")}>
          Discover handcrafted spiritual journeys across India. Each package is customizable with your choice of experiences, hotels, and transport.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-600 focus:outline-none transition-colors"
            />
          </div>

          {/* City Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedCity || ''}
              onChange={(e) => setSelectedCity(e.target.value ? Number(e.target.value) : null)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-600 focus:outline-none transition-colors appearance-none bg-white"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCity || searchQuery) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {selectedCity && (
              <button
                onClick={() => setSelectedCity(null)}
                className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200 transition-colors"
              >
                {cities.find(c => c.id === selectedCity)?.name} ✕
              </button>
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200 transition-colors"
              >
                &quot;{searchQuery}&quot; ✕
              </button>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
        </div>
      )}

      {/* Packages Grid */}
      {!loading && filteredPackages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            onClick={() => {
              setSelectedCity(null);
              setSearchQuery('');
            }}
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
  );
}

interface PackageCardProps {
  package: Package;
}

function PackageCard({ package: pkg }: PackageCardProps) {
  const minPrice = pkg.experiences.length > 0
    ? Math.min(...pkg.experiences.map(e => e.base_price))
    : 0;

  return (
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
  );
}
