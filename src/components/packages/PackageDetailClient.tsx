'use client';

import { useState, useEffect } from 'react';
import { Package, apiService } from '@/lib/api';
import { cn, sacredStyles } from '@/lib/utils';
import { MapPin, Calendar, Users, Star } from 'lucide-react';
import ExperienceSelector from './ExperienceSelector';
import HotelTierSelector from './HotelTierSelector';
import TransportSelector from './TransportSelector';
import PriceCalculator from './PriceCalculator';
import TrustBadges from '../common/TrustBadges';
import RecommendationsSection from './RecommendationsSection';

interface PackageDetailClientProps {
  packageData: Package;
}

export default function PackageDetailClient({ packageData }: PackageDetailClientProps) {
  const [selectedExperiences, setSelectedExperiences] = useState<number[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<number | null>(
    packageData.hotel_tiers[0]?.id || null
  );
  const [selectedTransport, setSelectedTransport] = useState<number | null>(
    packageData.transport_options[0]?.id || null
  );
  const [allPackages, setAllPackages] = useState<Package[]>([]);

  // Load all packages for recommendations
  useEffect(() => {
    const loadPackages = async () => {
      try {
        const packages = await apiService.getPackages();
        setAllPackages(packages);
      } catch (error) {
        console.error('Failed to load packages:', error);
      }
    };
    loadPackages();
  }, []);

  const selections = {
    experiences: selectedExperiences,
    hotel: selectedHotel,
    transport: selectedTransport,
  };

  const isValidSelection = 
    selectedExperiences.length > 0 && 
    selectedHotel !== null && 
    selectedTransport !== null;

  return (
    <div className={cn(sacredStyles.container, "pt-32 pb-24 md:pt-40 md:pb-32")}>
      {/* Package Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <MapPin className="w-4 h-4" />
          <span>{packageData.city_name}</span>
        </div>
        
        <h1 className={cn(sacredStyles.heading.h1, "mb-4")}>
          {packageData.name}
        </h1>
        
        <p className={cn(sacredStyles.text.body, "max-w-3xl")}>
          {packageData.description}
        </p>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-6 mt-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-700">
              {packageData.experiences.length} Experiences Available
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-700">
              {packageData.hotel_tiers.length} Hotel Options
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-700">
              Customizable Package
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Selections */}
        <div className="lg:col-span-2 space-y-8">
          {/* Experience Selection */}
          <ExperienceSelector
            experiences={packageData.experiences}
            selected={selectedExperiences}
            onChange={setSelectedExperiences}
          />

          {/* Hotel Tier Selection */}
          <HotelTierSelector
            hotelTiers={packageData.hotel_tiers}
            selected={selectedHotel}
            onChange={setSelectedHotel}
          />

          {/* Transport Selection */}
          <TransportSelector
            transportOptions={packageData.transport_options}
            selected={selectedTransport}
            onChange={setSelectedTransport}
          />
        </div>

        {/* Right Column - Price Calculator (Sticky) */}
        <div className="lg:col-span-1">
          <PriceCalculator
            packageSlug={packageData.slug}
            packageData={packageData}
            selections={selections}
            isValid={isValidSelection}
          />
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-16">
        <TrustBadges variant="compact" />
      </div>

      {/* Recommendations */}
      {allPackages.length > 0 && (
        <div className="mt-16">
          <RecommendationsSection
            currentPackage={packageData}
            allPackages={allPackages}
            type="similar"
          />
        </div>
      )}
    </div>
  );
}
