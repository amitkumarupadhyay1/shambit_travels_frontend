'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Package, apiService, PriceCalculation } from '@/lib/api';
import { getSelections, clearSelections } from '@/lib/package-selections';
import { cn, sacredStyles, formatCurrency } from '@/lib/utils';
import { Loader2, Calendar, Users, Mail, Phone, User, AlertCircle } from 'lucide-react';

interface TravellerInfo {
  name: string;
  age: string;
}

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { status } = useSession();
  const slug = params.slug as string;

  const [packageData, setPackageData] = useState<Package | null>(null);
  const [priceData, setPriceData] = useState<PriceCalculation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [numTravelers, setNumTravelers] = useState(1);
  const [travellers, setTravellers] = useState<TravellerInfo[]>([{ name: '', age: '' }]);
  const [bookingDate, setBookingDate] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Calculate minimum date once
  const minBookingDate = useMemo(() => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 3);
    return minDate.toISOString().split('T')[0];
  }, []);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if user is authenticated
        if (status === 'unauthenticated') {
          router.replace('/login');
          return;
        }

        if (status === 'loading') {
          return;
        }

        // Read selections from sessionStorage
        const selections = getSelections();
        if (!selections || selections.slug !== slug) {
          console.error('No valid selections found');
          router.replace('/packages');
          return;
        }

        // Fetch package details
        const pkg = await apiService.getPackage(slug);
        setPackageData(pkg);

        // Fetch price
        const price = await apiService.calculatePrice(slug, {
          experience_ids: selections.experienceIds,
          hotel_tier_id: selections.hotelTierId,
          transport_option_id: selections.transportOptionId,
        });
        setPriceData(price);

        // Set minimum booking date (today + 3 days)
        setBookingDate(minBookingDate);

        setLoading(false);
      } catch (err) {
        console.error('Failed to load review data:', err);
        setError('Failed to load booking details. Please try again.');
        setLoading(false);
      }
    };

    loadData();
  }, [slug, status, router, minBookingDate]);

  // Update travellers array when num_travelers changes
  const handleNumTravelersChange = (newNum: number) => {
    setNumTravelers(newNum);
    setTravellers(prev => {
      const newTravellers = [...prev];
      while (newTravellers.length < newNum) {
        newTravellers.push({ name: '', age: '' });
      }
      while (newTravellers.length > newNum) {
        newTravellers.pop();
      }
      return newTravellers;
    });
  };

  const handleTravellerChange = (index: number, field: 'name' | 'age', value: string) => {
    setTravellers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleProceedToPayment = async () => {
    try {
      setSubmitting(true);
      setError(null);

      // Validate form
      if (!contactName || !contactEmail || !contactPhone) {
        setError('Please fill in all contact details');
        setSubmitting(false);
        return;
      }

      if (travellers.some(t => !t.name || !t.age)) {
        setError('Please fill in all traveller details');
        setSubmitting(false);
        return;
      }

      const selections = getSelections();
      if (!selections) {
        setError('Session expired. Please start again.');
        setSubmitting(false);
        return;
      }

      // Create booking
      const bookingData = {
        package_id: selections.packageId,
        experience_ids: selections.experienceIds,
        hotel_tier_id: selections.hotelTierId,
        transport_option_id: selections.transportOptionId,
        booking_date: bookingDate,
        num_travelers: numTravelers,
        customer_name: contactName,
        customer_email: contactEmail,
        customer_phone: contactPhone,
        special_requests: '',
      };

      console.log('Creating booking:', bookingData);

      const response = await apiService.createBooking(bookingData, {
        headers: {
          'Idempotency-Key': selections.idempotencyKey,
        },
      });

      console.log('Booking created:', response);

      // Clear selections
      clearSelections();

      // Redirect to payment page (placeholder for now)
      router.push(`/dashboard/booking/${response.id}`);
    } catch (err) {
      console.error('Failed to create booking:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking. Please try again.';
      setError(errorMessage);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
      </div>
    );
  }

  if (error && !packageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <p className="text-lg text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(sacredStyles.container, 'pt-32 pb-24 md:pt-40 md:pb-32')}>
      <h1 className={cn(sacredStyles.heading.h1, 'mb-8')}>Review Your Booking</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Date */}
          <div className={sacredStyles.card}>
            <h2 className={cn(sacredStyles.heading.h4, 'mb-4')}>Booking Date</h2>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-orange-600" />
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={minBookingDate}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Minimum 3 days advance booking required</p>
          </div>

          {/* Number of Travelers */}
          <div className={sacredStyles.card}>
            <h2 className={cn(sacredStyles.heading.h4, 'mb-4')}>Number of Travelers</h2>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-orange-600" />
              <input
                type="number"
                min="1"
                max="20"
                value={numTravelers}
                onChange={(e) => handleNumTravelersChange(parseInt(e.target.value) || 1)}
                className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Traveller Details */}
          <div className={sacredStyles.card}>
            <h2 className={cn(sacredStyles.heading.h4, 'mb-4')}>Traveller Details</h2>
            <div className="space-y-4">
              {travellers.map((traveller, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Traveller {index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={traveller.name}
                        onChange={(e) => handleTravellerChange(index, 'name', e.target.value)}
                        placeholder="Enter full name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Age</label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={traveller.age}
                        onChange={(e) => handleTravellerChange(index, 'age', e.target.value)}
                        placeholder="Age"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className={sacredStyles.card}>
            <h2 className={cn(sacredStyles.heading.h4, 'mb-4')}>Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Contact Name
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Enter contact name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Package Summary */}
            <div className={sacredStyles.card}>
              <h2 className={cn(sacredStyles.heading.h4, 'mb-4')}>Package Summary</h2>
              {packageData && (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Package</p>
                    <p className="font-medium">{packageData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">City</p>
                    <p className="font-medium">{packageData.city_name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            {priceData && (
              <div className={sacredStyles.card}>
                <h2 className={cn(sacredStyles.heading.h4, 'mb-4')}>Price Breakdown</h2>
                <div className="space-y-3">
                  {/* Experiences */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Experiences ({priceData.breakdown.experiences.length})
                    </p>
                    {priceData.breakdown.experiences.map(exp => (
                      <div key={exp.id} className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{exp.name}</span>
                        <span>{formatCurrency(parseFloat(exp.price))}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">{priceData.breakdown.hotel_tier.name}</span>
                      <span>{priceData.breakdown.hotel_tier.price_multiplier}x</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{priceData.breakdown.transport.name}</span>
                      <span>{formatCurrency(parseFloat(priceData.breakdown.transport.price))}</span>
                    </div>
                  </div>

                  <div className="border-t-2 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total</span>
                      <span className="text-2xl font-bold text-orange-600">
                        {formatCurrency(parseFloat(priceData.total_price))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Proceed Button */}
            <button
              onClick={handleProceedToPayment}
              disabled={submitting}
              className={cn(
                sacredStyles.button.primary,
                'w-full flex items-center justify-center gap-2'
              )}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Booking...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
