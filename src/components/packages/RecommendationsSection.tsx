'use client';

import { Package } from '@/lib/api';
import { cn, sacredStyles, formatCurrency } from '@/lib/utils';
import { TrendingUp, Users, Sparkles, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

interface RecommendationsSectionProps {
  currentPackage?: Package;
  allPackages: Package[];
  type: 'similar' | 'popular' | 'recommended';
}

export default function RecommendationsSection({
  currentPackage,
  allPackages,
  type,
}: RecommendationsSectionProps) {
  // Get recommendations based on type
  const getRecommendations = () => {
    let filtered = allPackages;

    if (currentPackage) {
      // Exclude current package
      filtered = filtered.filter(pkg => pkg.id !== currentPackage.id);

      if (type === 'similar') {
        // Same city packages
        filtered = filtered.filter(pkg => pkg.city_name === currentPackage.city_name);
      }
    }

    // Limit to 3 packages
    return filtered.slice(0, 3);
  };

  const recommendations = getRecommendations();

  if (recommendations.length === 0) return null;

  const getTitle = () => {
    switch (type) {
      case 'similar':
        return 'Similar Packages';
      case 'popular':
        return 'Popular Packages';
      case 'recommended':
        return 'Recommended for You';
      default:
        return 'You May Also Like';
    }
  };

  const IconComponent = type === 'similar' ? Sparkles : type === 'popular' ? TrendingUp : Users;

  return (
    <div className="py-12">
      <div className="flex items-center gap-3 mb-8">
        <IconComponent className="w-6 h-6 text-orange-600" />
        <h2 className={sacredStyles.heading.h2}>{getTitle()}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map(pkg => (
          <RecommendationCard key={pkg.id} package={pkg} />
        ))}
      </div>
    </div>
  );
}

interface RecommendationCardProps {
  package: Package;
}

function RecommendationCard({ package: pkg }: RecommendationCardProps) {
  const minPrice = pkg.experiences.length > 0
    ? Math.min(...pkg.experiences.map(e => e.base_price))
    : 0;

  return (
    <Link href={`/packages/${pkg.slug}`}>
      <div className={cn(
        sacredStyles.card,
        "group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer h-full"
      )}>
        {/* Image */}
        <div className="relative h-40 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-orange-600/20 to-yellow-600/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin className="w-12 h-12 text-orange-600/40" />
          </div>
          
          {/* Price Badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
            <span className="text-sm font-bold text-orange-600">
              From {formatCurrency(minPrice)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
            <MapPin className="w-3 h-3" />
            <span>{pkg.city_name}</span>
          </div>

          <h3 className={cn(
            "text-lg font-semibold mb-2 group-hover:text-orange-600 transition-colors line-clamp-2"
          )}>
            {pkg.name}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {pkg.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{pkg.experiences.length} Experiences</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
