'use client';

import { useState, useEffect, useMemo } from 'react';
import { Package, apiService } from '@/lib/api';
import { cn, sacredStyles } from '@/lib/utils';
import { MapPin, Calendar, Users, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';
import ExperienceSelector from './ExperienceSelector';
import HotelTierSelector from './HotelTierSelector';
import TransportSelector from './TransportSelector';
import PriceCalculator from './PriceCalculator';
import TrustBadges from '../common/TrustBadges';
import RecommendationsSection from './RecommendationsSection';

import { useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getSelections } from '@/lib/package-selections';

interface PackageDetailClientProps {
  packageData: Package;
}

export default function PackageDetailClient({ packageData }: PackageDetailClientProps) {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const processingRef = useRef(false);
  const hasProcessedIntent = useRef(false);

  const [selectedExperiences, setSelectedExperiences] = useState<number[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<number | null>(
    packageData.hotel_tiers[0]?.id || null
  );
  const [selectedTransport, setSelectedTransport] = useState<number | null>(
    packageData.transport_options[0]?.id || null
  );
  const [allPackages, setAllPackages] = useState<Package[]>([]);

  // Intent Detection: Redirect to Review Page
  useEffect(() => {
    const intent = searchParams.get('intent');
    const isBookIntent = intent === 'book';

    // Early exit if already processed or not ready
    if (hasProcessedIntent.current || !isBookIntent || status !== 'authenticated' || processingRef.current) {
      return;
    }

    const selections = getSelections();
    // Ensure selections exist and match current package
    if (!selections || selections.packageId !== packageData.id) {
      console.log('⚠️ No valid selections found for booking intent. Clearing intent parameter.');
      // Remove the intent parameter since there are no selections
      router.replace(`/packages/${packageData.slug}`);
      return;
    }

    // Mark as processing to prevent duplicate execution
    processingRef.current = true;
    hasProcessedIntent.current = true;
    console.log('⚡ Redirecting to review page with selections:', selections);

    // Redirect to review page
    router.replace(`/review/${packageData.slug}`);
  }, [status, searchParams, packageData.id, packageData.slug, router]);

  // Restore pending booking state after login (Legacy/SessionStorage fallback)
  useEffect(() => {
    if (status === 'authenticated') {
      const pendingBooking = sessionStorage.getItem('pendingBooking');
      if (pendingBooking) {
        try {
          const booking = JSON.parse(pendingBooking);
          // Check if this is the same package
          if (booking.packageSlug === packageData.slug) {
            console.log('Restoring package selections after login:', booking);
            // Use a microtask to avoid synchronous setState in effect
            Promise.resolve().then(() => {
              setSelectedExperiences(booking.selections.experiences || []);
              setSelectedHotel(booking.selections.hotel || packageData.hotel_tiers[0]?.id || null);
              setSelectedTransport(booking.selections.transport || packageData.transport_options[0]?.id || null);
            });
            // Note: Don't clear sessionStorage here - let TravelerDetailsModal do it after booking creation
          }
        } catch (error) {
          console.error('Failed to restore pending booking:', error);
          sessionStorage.removeItem('pendingBooking');
        }
      }
    }
  }, [status, packageData.slug, packageData.hotel_tiers, packageData.transport_options]);

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

  // Memoize selections to prevent unnecessary re-renders
  const selections = useMemo(() => ({
    experiences: selectedExperiences,
    hotel: selectedHotel,
    transport: selectedTransport,
  }), [selectedExperiences, selectedHotel, selectedTransport]);

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
