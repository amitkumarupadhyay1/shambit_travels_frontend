'use client';

import { useState, useEffect } from 'react';
import { Package } from '@/lib/api';
import { cn, sacredStyles } from '@/lib/utils';
import { MapPin, Calendar, Users, Star } from 'lucide-react';
import ExperienceSelector from './ExperienceSelector';
import HotelTierSelector from './HotelTierSelector';
import TransportSelector from './TransportSelector';
import PriceCalculator from './PriceCalculator';

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

  // Auto-select first 2 experiences as default
  useEffect(() => {
    if (packageData.experiences.length > 0 && selectedExperiences.length === 0) {
      const defaultExperiences = packageData.experiences
        .slice(0, 2)
        .map(exp => exp.id);
      
      // Use a timeout to avoid setState in effect warning
      const timer = setTimeout(() => {
        setSelectedExperiences(defaultExperiences);
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [packageData.experiences, selectedExperiences.length]);

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
    <div className={cn(sacredStyles.container, "py-12")}>
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
            selections={selections}
            isValid={isValidSelection}
          />
        </div>
      </div>
    </div>
  );
}
