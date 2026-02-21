'use client';

import { useState, useEffect, useMemo } from 'react';
import { Package, apiService } from '@/lib/api';
import { cn, sacredStyles } from '@/lib/utils';
import { MapPin, Calendar, Users, Star, ShoppingCart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import ExperienceSelector from './ExperienceSelector';
import HotelTierSelector from './HotelTierSelector';
import TransportSelector from './TransportSelector';
import PriceCalculator from './PriceCalculator';
import TrustBadges from '../common/TrustBadges';
import RecommendationsSection from './RecommendationsSection';
import TripDurationCalculator from './TripDurationCalculator';
import DateRangeSelector from './DateRangeSelector';
import RoomCountSelector from './RoomCountSelector';
import TravelerCountSelector from './TravelerCountSelector';
import IntelligentRoomRecommendations from './IntelligentRoomRecommendations';

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
  const [recommendedNights, setRecommendedNights] = useState(1);
  
  // PHASE 2: Date range and room count state
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [numNights, setNumNights] = useState(0);
  const [numRooms, setNumRooms] = useState(1);
  const [numTravelers, setNumTravelers] = useState(1);
  
  // PHASE 3: Room recommendation state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedRoomRecommendation, setSelectedRoomRecommendation] = useState<any>(null);
  const [showRoomRecommendations, setShowRoomRecommendations] = useState(false);
  
  // Log selected recommendation for debugging (will be used in booking flow)
  useEffect(() => {
    if (selectedRoomRecommendation) {
      console.log('Selected room recommendation:', selectedRoomRecommendation);
    }
  }, [selectedRoomRecommendation]);

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
    // PHASE 2: Include date range and room count
    startDate,
    endDate,
    numRooms,
  }), [selectedExperiences, selectedHotel, selectedTransport, startDate, endDate, numRooms]);

  const isValidSelection =
    selectedExperiences.length > 0 &&
    selectedHotel !== null &&
    selectedTransport !== null &&
    startDate !== null &&
    endDate !== null &&
    numNights > 0;

  // Get selected experience objects for trip duration calculation
  const selectedExperienceObjects = useMemo(() => {
    return packageData.experiences.filter(exp => selectedExperiences.includes(exp.id));
  }, [packageData.experiences, selectedExperiences]);

  // Get selected hotel tier for max occupancy
  const selectedHotelTier = useMemo(() => {
    return packageData.hotel_tiers.find(tier => tier.id === selectedHotel);
  }, [packageData.hotel_tiers, selectedHotel]);

  return (
    <div id="main-content" className={cn(sacredStyles.container, "py-8 md:py-12")}>
      {/* Package Header */}
      <header className="mb-8 md:mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <MapPin className="w-4 h-4" aria-hidden="true" />
          <span>{packageData.city_name}</span>
        </div>

        <h1 className={cn(sacredStyles.heading.h1, "mb-4")}>
          {packageData.name}
        </h1>

        <p className={cn(sacredStyles.text.body, "max-w-3xl")}>
          {packageData.description}
        </p>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-6 mt-6" role="list" aria-label="Package features">
          <div className="flex items-center gap-2" role="listitem">
            <Calendar className="w-5 h-5 text-orange-600" aria-hidden="true" />
            <span className="text-sm text-gray-700">
              {packageData.experiences.length} Experiences Available
            </span>
          </div>
          <div className="flex items-center gap-2" role="listitem">
            <Users className="w-5 h-5 text-orange-600" aria-hidden="true" />
            <span className="text-sm text-gray-700">
              {packageData.hotel_tiers.length} Hotel Options
            </span>
          </div>
          <div className="flex items-center gap-2" role="listitem">
            <Star className="w-5 h-5 text-orange-600" aria-hidden="true" />
            <span className="text-sm text-gray-700">
              Customizable Package
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Selections */}
        <section className="lg:col-span-2 space-y-8" aria-label="Package customization options">
          {/* Experience Selection */}
          <ExperienceSelector
            experiences={packageData.experiences}
            selected={selectedExperiences}
            onChange={setSelectedExperiences}
          />

          {/* Trip Duration Calculator - Phase 2 */}
          {selectedExperienceObjects.length > 0 && (
            <TripDurationCalculator
              experiences={selectedExperienceObjects}
              onDurationCalculated={(duration) => setRecommendedNights(duration.recommendedNights)}
            />
          )}

          {/* Traveler Count Selector - PHASE 3 */}
          <TravelerCountSelector
            onCountChange={(count) => {
              setNumTravelers(count);
              // Show room recommendations when traveler count changes
              if (count > 0 && selectedHotel) {
                setShowRoomRecommendations(true);
              }
            }}
            initialCount={numTravelers}
            minCount={1}
            maxCount={20}
          />

          {/* Date Range Selector - PHASE 2 */}
          <DateRangeSelector
            recommendedNights={recommendedNights}
            onDatesChange={(start, end, nights) => {
              setStartDate(start);
              setEndDate(end);
              setNumNights(nights);
            }}
          />

          {/* Intelligent Room Recommendations - PHASE 3 */}
          {showRoomRecommendations && numTravelers > 0 && selectedHotel && (
            <IntelligentRoomRecommendations
              hotelTierId={selectedHotel}
              travelers={Array.from({ length: numTravelers }, (_, i) => ({
                name: `Traveler ${i + 1}`,
                age: 25, // Default age, will be updated in booking flow
                gender: undefined,
              }))}
              onSelect={(recommendation) => {
                setSelectedRoomRecommendation(recommendation);
                setNumRooms(recommendation.num_rooms);
              }}
              selectedNumRooms={numRooms}
            />
          )}

          {/* Room Count Selector - PHASE 2 (Manual Override) */}
          {numTravelers > 0 && selectedHotelTier && !showRoomRecommendations && (
            <RoomCountSelector
              numTravelers={numTravelers}
              maxOccupancyPerRoom={selectedHotelTier.max_occupancy_per_room}
              onRoomCountChange={setNumRooms}
              initialCount={numRooms}
            />
          )}

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
        </section>

        {/* Right Column - Price Calculator (Sticky) */}
        <aside className="lg:col-span-1" aria-label="Price summary and booking">
          <PriceCalculator
            packageSlug={packageData.slug}
            packageData={packageData}
            selections={selections}
            isValid={isValidSelection}
            selectedExperiences={selectedExperienceObjects}
            hotelTierMaxOccupancy={selectedHotelTier?.max_occupancy_per_room || 2}
            recommendedNights={recommendedNights}
            numNights={numNights}
          />
        </aside>
      </div>

      {/* Trust Badges */}
      <div className="mt-16">
        <TrustBadges variant="compact" />
      </div>
      
      {/* Social Proof */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
          <Users className="w-4 h-4 text-green-600" aria-hidden="true" />
          <span className="font-medium text-green-800">127 people booked this package this week</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <Star className="w-4 h-4 text-blue-600" aria-hidden="true" />
          <span className="font-medium text-blue-800">4.8/5 average rating</span>
        </div>
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

      {/* Mobile Sticky CTA */}
      {isValidSelection && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg lg:hidden z-40">
          <button
            onClick={() => {
              // Trigger the same action as PriceCalculator's Book Now button
              const bookButton = document.querySelector('[data-book-now-button]') as HTMLButtonElement;
              if (bookButton) bookButton.click();
            }}
            className={cn(sacredStyles.button.cta, "w-full")}
          >
            <ShoppingCart className="w-5 h-5 inline-block mr-2" />
            Continue to Booking
          </button>
        </div>
      )}
    </div>
  );
}
