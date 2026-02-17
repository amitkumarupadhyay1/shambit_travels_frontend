'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Package, apiService, PriceCalculation } from '@/lib/api';
import { getSelections, clearSelections, validateSelections } from '@/lib/package-selections';
import { cn, sacredStyles, formatCurrency } from '@/lib/utils';
import { Loader2, Calendar, Users, Mail, Phone, User, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface TravellerInfo {
  name: string;
  age: string;
  gender: string;
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
  const [travellers, setTravellers] = useState<TravellerInfo[]>([{ name: '', age: '', gender: '' }]);
  const [bookingDate, setBookingDate] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

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
          toast.error('Session expired. Please start your booking again.');
          router.replace('/packages');
          return;
        }

        // Validate selections
        if (!validateSelections(selections)) {
          console.error('Invalid selections found');
          toast.error('Invalid booking data. Please start again.');
          clearSelections();
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
        const errorMessage = 'Failed to load booking details. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
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
        newTravellers.push({ name: '', age: '', gender: '' });
      }
      while (newTravellers.length > newNum) {
        newTravellers.pop();
      }
      return newTravellers;
    });
  };

  const handleTravellerChange = (index: number, field: 'name' | 'age' | 'gender', value: string) => {
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
        const errorMsg = 'Please fill in all contact details';
        setError(errorMsg);
        toast.error(errorMsg);
        setSubmitting(false);
        return;
      }

      if (travellers.some(t => !t.name || !t.age)) {
        const errorMsg = 'Please fill in all traveller details (name and age are required)';
        setError(errorMsg);
        toast.error(errorMsg);
        setSubmitting(false);
        return;
      }

      if (!acceptTerms) {
        const errorMsg = 'Please accept the terms and conditions to proceed';
        setError(errorMsg);
        toast.error(errorMsg);
        setSubmitting(false);
        return;
      }

      const selections = getSelections();
      if (!selections) {
        const errorMsg = 'Session expired. Please start again.';
        setError(errorMsg);
        toast.error(errorMsg);
        setSubmitting(false);
        return;
      }

      // Show loading toast
      const toastId = toast.loading('Creating your booking...');

      // Create booking with traveler details
      const bookingData = {
        package_id: selections.packageId,
        experience_ids: selections.experienceIds,
        hotel_tier_id: selections.hotelTierId,
        transport_option_id: selections.transportOptionId,
        booking_date: bookingDate,
        num_travelers: numTravelers,
        traveler_details: travellers.map(t => ({
          name: t.name,
          age: parseInt(t.age),
          gender: t.gender || ''
        })),
        customer_name: contactName,
        customer_email: contactEmail,
        customer_phone: contactPhone,
        special_requests: specialRequests,
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

      // Show success toast
      toast.success('Booking created successfully!', { id: toastId });

      // Redirect to checkout page for payment
      router.push(`/checkout/${response.id}`);
    } catch (err) {
      console.error('Failed to create booking:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
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
            <p className="text-sm text-gray-600 mb-4">
              <strong>Note:</strong> Children under 5 years travel free. Full charge applies for ages 5 and above.
            </p>
            <div className="space-y-4">
              {travellers.map((traveller, index) => {
                const age = parseInt(traveller.age);
                const isFree = age > 0 && age < 5;
                
                return (
                  <div key={index} className={cn(
                    "p-4 rounded-lg border-2",
                    isFree ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                  )}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-700">Traveller {index + 1}</h3>
                      {isFree && (
                        <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                          Free (Under 5)
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-600 mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={traveller.name}
                          onChange={(e) => handleTravellerChange(index, 'name', e.target.value)}
                          placeholder="As per ID proof"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Age *</label>
                        <input
                          type="number"
                          min="0"
                          max="120"
                          value={traveller.age}
                          onChange={(e) => handleTravellerChange(index, 'age', e.target.value)}
                          placeholder="Age"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-sm text-gray-600 mb-1">Gender</label>
                        <select
                          value={traveller.gender}
                          onChange={(e) => handleTravellerChange(index, 'gender', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Information */}
          <div className={sacredStyles.card}>
            <h2 className={cn(sacredStyles.heading.h4, 'mb-4')}>Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Contact Name *
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
                  Email *
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
                  Phone Number *
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

          {/* Special Requests */}
          <div className={sacredStyles.card}>
            <h2 className={cn(sacredStyles.heading.h4, 'mb-4')}>Special Requests (Optional)</h2>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any dietary requirements, accessibility needs, or special occasions?"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Terms and Conditions */}
          <div className={sacredStyles.card}>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                I accept the{' '}
                <a href="/terms" target="_blank" className="text-orange-600 hover:underline">
                  terms and conditions
                </a>
                {' '}and{' '}
                <a href="/cancellation-policy" target="_blank" className="text-orange-600 hover:underline">
                  cancellation policy
                </a>
              </label>
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

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Price per person</span>
                      <span className="font-medium">{formatCurrency(parseFloat(priceData.total_price))}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Total travelers</span>
                      <span className="font-medium">× {numTravelers}</span>
                    </div>
                    {travellers.length > 0 && travellers.every(t => t.age) && (
                      <>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Note</span>
                          <span className="text-xs text-gray-500">
                            Final price calculated on backend based on traveler ages
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="border-t-2 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Estimated Total</span>
                      <span className="text-2xl font-bold text-orange-600">
                        {formatCurrency(parseFloat(priceData.total_price) * numTravelers)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      All taxes included. Final price calculated based on traveler ages.
                    </p>
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
