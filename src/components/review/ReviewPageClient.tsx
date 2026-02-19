'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Package, apiService, BookingPreview } from '@/lib/api';
import { getSelections, clearSelections, validateSelections } from '@/lib/package-selections';
import { cn, sacredStyles, formatCurrency } from '@/lib/utils';
import {
  Loader2,
  Calendar,
  Users,
  Mail,
  Phone,
  User,
  AlertCircle,
  CheckCircle,
  Shield,
  Plus,
  ArrowRight,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';
import TravelerCard from './TravelerCard';
import TrustBadges from '../common/TrustBadges';

interface TravellerInfo {
  name: string;
  age: string;
  gender: string;
}

interface ReviewPageClientProps {
  packageData: Package;
  slug: string;
}

export default function ReviewPageClient({ packageData, slug }: ReviewPageClientProps) {
  const router = useRouter();
  const { status } = useSession();

  const [pricePreview, setPricePreview] = useState<BookingPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [numTravelers, setNumTravelers] = useState(1);
  const [travellers, setTravellers] = useState<TravellerInfo[]>([
    { name: '', age: '', gender: '' },
  ]);
  const [bookingDate, setBookingDate] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Calculate minimum date once
  const minBookingDate = useMemo(() => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 3);
    return minDate.toISOString().split('T')[0];
  }, []);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Preview endpoint is public, so we don't need to check auth status
        // Only check auth when user tries to create booking
        
        const selections = getSelections();
        if (!selections || selections.slug !== slug) {
          console.error('No valid selections found');
          toast.error('Session expired. Please start your booking again.');
          router.replace('/packages');
          return;
        }

        if (!validateSelections(selections)) {
          console.error('Invalid selections found');
          toast.error('Invalid booking data. Please start again.');
          clearSelections();
          router.replace('/packages');
          return;
        }

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
  }, [slug, router, minBookingDate]);

  // Preview price when traveler details change
  const previewPrice = useCallback(async () => {
    const selections = getSelections();
    if (!selections) return;

    // Only preview if we have complete traveler data
    const completeTravelers = travellers.filter((t) => t.name && t.age && parseInt(t.age) >= 0);
    
    // Skip preview if traveler count doesn't match or no complete travelers
    if (completeTravelers.length === 0 || completeTravelers.length !== numTravelers) {
      setPricePreview(null);
      return;
    }

    setPreviewLoading(true);
    try {
      const preview = await apiService.previewBooking({
        package_id: selections.packageId,
        experience_ids: selections.experienceIds,
        hotel_tier_id: selections.hotelTierId,
        transport_option_id: selections.transportOptionId,
        num_travelers: numTravelers,
        traveler_details: completeTravelers.map((t) => ({
          name: t.name,
          age: parseInt(t.age),
          gender: t.gender || '',
        })),
      });

      setPricePreview(preview);
    } catch (err) {
      console.error('Failed to preview price:', err);
      // Don't show error toast for preview failures
      setPricePreview(null);
    } finally {
      setPreviewLoading(false);
    }
  }, [travellers, numTravelers]);

  // Debounced price preview
  useEffect(() => {
    const timer = setTimeout(() => {
      previewPrice();
    }, 500);

    return () => clearTimeout(timer);
  }, [previewPrice]);

  const handleAddTraveler = () => {
    if (numTravelers >= 20) {
      toast.error('Maximum 20 travelers allowed');
      return;
    }
    const newNum = numTravelers + 1;
    setNumTravelers(newNum);
    setTravellers([...travellers, { name: '', age: '', gender: '' }]);
  };

  const handleRemoveTraveler = (index: number) => {
    if (numTravelers <= 1) {
      toast.error('At least 1 traveler required');
      return;
    }
    const newNum = numTravelers - 1;
    setNumTravelers(newNum);
    setTravellers(travellers.filter((_, i) => i !== index));
  };

  const handleTravellerChange = (
    index: number,
    field: 'name' | 'age' | 'gender',
    value: string
  ) => {
    setTravellers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });

    // Clear validation error for this field
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`traveler_${index}_${field}`];
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Contact validation
    if (!contactName.trim()) {
      errors.contactName = 'Contact name is required';
    }
    if (!contactEmail.trim()) {
      errors.contactEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      errors.contactEmail = 'Invalid email format';
    }
    if (!contactPhone.trim()) {
      errors.contactPhone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(contactPhone.replace(/\D/g, ''))) {
      errors.contactPhone = 'Invalid phone number (10 digits required)';
    }

    // Traveler validation
    travellers.forEach((t, i) => {
      if (!t.name.trim()) {
        errors[`traveler_${i}_name`] = 'Name is required';
      }
      if (!t.age) {
        errors[`traveler_${i}_age`] = 'Age is required';
      } else {
        const age = parseInt(t.age);
        if (isNaN(age) || age < 0 || age > 120) {
          errors[`traveler_${i}_age`] = 'Invalid age';
        }
      }
    });

    if (!acceptTerms) {
      errors.terms = 'You must accept the terms and conditions';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const selections = getSelections();
      if (!selections) {
        throw new Error('Session expired. Please start again.');
      }

      const toastId = toast.loading('Creating your booking...');

      const bookingData = {
        package_id: selections.packageId,
        experience_ids: selections.experienceIds,
        hotel_tier_id: selections.hotelTierId,
        transport_option_id: selections.transportOptionId,
        booking_date: bookingDate,
        num_travelers: numTravelers,
        traveler_details: travellers.map((t) => ({
          name: t.name,
          age: parseInt(t.age),
          gender: t.gender || '',
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

      clearSelections();
      toast.success('Booking created successfully!', { id: toastId });
      router.push(`/checkout/${response.id}`);
    } catch (err) {
      console.error('Failed to create booking:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create booking. Please try again.';
      
      // Check if it's an authentication error
      if (errorMessage.includes('logged in') || errorMessage.includes('token')) {
        setError('Your session has expired. Please logout and login again to continue.');
        toast.error('Session expired. Please logout and login again.', { duration: 6000 });
      } else {
        setError(errorMessage);
        toast.error(errorMessage);
      }
      
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

  const chargeableTravelers = pricePreview?.chargeable_travelers || numTravelers;
  const freeTravelers = numTravelers - chargeableTravelers;

  return (
    <div className={cn(sacredStyles.container, 'max-w-7xl')}>
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-gray-400">Select Package</span>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-orange-600">Review Booking</span>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400">Payment</span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className={cn(sacredStyles.heading.h1, 'mb-4')}>Review Your Booking</h1>
        <p className={cn(sacredStyles.text.body, 'text-gray-600 max-w-2xl mx-auto')}>
          Please review your travel details and provide traveler information to proceed with
          payment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Package Summary */}
          <div className={sacredStyles.card}>
            <h2 className={cn(sacredStyles.heading.h3, 'mb-4')}>Package Summary</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Package</p>
                <p className="font-semibold text-lg">{packageData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Destination</p>
                <p className="font-medium">{packageData.city_name}</p>
              </div>
            </div>
          </div>

          {/* Booking Date */}
          <div className={sacredStyles.card}>
            <h2 className={cn(sacredStyles.heading.h3, 'mb-4')}>Travel Date</h2>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-orange-600" />
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={minBookingDate}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Minimum 3 days advance booking required
            </p>
          </div>

          {/* Traveler Details */}
          <div className={sacredStyles.card}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={cn(sacredStyles.heading.h3, 'mb-0')}>Traveler Details</h2>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-orange-600" />
                <span className="font-medium">
                  {numTravelers} {numTravelers === 1 ? 'Traveler' : 'Travelers'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
              <p className="text-sm text-blue-900 flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Age-based Pricing:</strong> Children under 5 years travel free. Full
                  charge applies for ages 5 and above.
                </span>
              </p>
            </div>

            <div className="space-y-4">
              {travellers.map((traveller, index) => (
                <TravelerCard
                  key={index}
                  index={index}
                  traveler={traveller}
                  onChange={handleTravellerChange}
                  onRemove={handleRemoveTraveler}
                  canRemove={numTravelers > 1}
                  errors={{
                    name: validationErrors[`traveler_${index}_name`],
                    age: validationErrors[`traveler_${index}_age`],
                  }}
                />
              ))}
            </div>

            {numTravelers < 20 && (
              <button
                type="button"
                onClick={handleAddTraveler}
                className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Another Traveler
              </button>
            )}
          </div>

          {/* Contact Information */}
          <div className={sacredStyles.card}>
            <h2 className={cn(sacredStyles.heading.h3, 'mb-4')}>Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => {
                    setContactName(e.target.value);
                    setValidationErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.contactName;
                      return newErrors;
                    });
                  }}
                  placeholder="Enter contact name"
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent',
                    validationErrors.contactName ? 'border-red-300' : 'border-gray-300'
                  )}
                />
                {validationErrors.contactName && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.contactName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => {
                    setContactEmail(e.target.value);
                    setValidationErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.contactEmail;
                      return newErrors;
                    });
                  }}
                  placeholder="Enter email address"
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent',
                    validationErrors.contactEmail ? 'border-red-300' : 'border-gray-300'
                  )}
                />
                {validationErrors.contactEmail && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.contactEmail}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => {
                    setContactPhone(e.target.value);
                    setValidationErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.contactPhone;
                      return newErrors;
                    });
                  }}
                  placeholder="Enter 10-digit phone number"
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent',
                    validationErrors.contactPhone ? 'border-red-300' : 'border-gray-300'
                  )}
                />
                {validationErrors.contactPhone && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.contactPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className={sacredStyles.card}>
            <h2 className={cn(sacredStyles.heading.h3, 'mb-4')}>
              Special Requests <span className="text-sm font-normal text-gray-500">(Optional)</span>
            </h2>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any dietary requirements, accessibility needs, or special occasions?"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Terms and Conditions */}
          <div className={sacredStyles.card}>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  setValidationErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.terms;
                    return newErrors;
                  });
                }}
                className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-700 flex-1">
                I accept the{' '}
                <a href="/terms" target="_blank" className="text-orange-600 hover:underline font-medium">
                  terms and conditions
                </a>
                {' '}and{' '}
                <a
                  href="/cancellation-policy"
                  target="_blank"
                  className="text-orange-600 hover:underline font-medium"
                >
                  cancellation policy
                </a>
              </label>
            </div>
            {validationErrors.terms && (
              <p className="text-xs text-red-600 mt-2 flex items-center gap-1 ml-7">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.terms}
              </p>
            )}
          </div>
        </div>

        {/* Right Column - Price Summary (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Price Summary */}
            <div className={sacredStyles.card}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={cn(sacredStyles.heading.h3, 'mb-0')}>Price Summary</h2>
                <Shield className="w-5 h-5 text-green-600" aria-label="Secure pricing" />
              </div>

              {previewLoading ? (
                <div className="py-8 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-orange-600 animate-spin mb-2" />
                  <p className="text-sm text-gray-600">Calculating price...</p>
                </div>
              ) : pricePreview ? (
                <div className="space-y-3">
                  {/* Experiences Breakdown - ALL FROM BACKEND */}
                  <div className="pb-3 border-b border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Selected Experiences</p>
                    {pricePreview.price_breakdown.experiences.map((exp) => (
                      <div key={exp.id} className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{exp.name}</span>
                        <span className="font-medium">{formatCurrency(parseFloat(exp.price))}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm mt-2 pt-2 border-t border-gray-100">
                      <span className="text-gray-700 font-medium">Experiences Total</span>
                      <span className="font-semibold">{formatCurrency(parseFloat(pricePreview.price_breakdown.base_experience_total))}</span>
                    </div>
                  </div>

                  {/* Hotel & Transport - ALL FROM BACKEND */}
                  <div className="pb-3 border-b border-gray-200">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Transport: {pricePreview.price_breakdown.transport.name}</span>
                      <span className="font-medium">{formatCurrency(parseFloat(pricePreview.price_breakdown.transport.price))}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700 font-medium">Subtotal before hotel</span>
                      <span className="font-semibold">{formatCurrency(parseFloat(pricePreview.price_breakdown.subtotal_before_hotel))}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Hotel: {pricePreview.price_breakdown.hotel_tier.name}</span>
                      <span className="font-medium text-blue-600">
                        ×{pricePreview.price_breakdown.hotel_tier.multiplier}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-2 pt-2 border-t border-gray-100">
                      <span className="text-gray-700 font-medium">After Hotel Multiplier</span>
                      <span className="font-semibold">{formatCurrency(parseFloat(pricePreview.price_breakdown.subtotal_after_hotel))}</span>
                    </div>
                  </div>

                  {/* Applied Rules (Taxes, Discounts) - ALL FROM BACKEND */}
                  {pricePreview.price_breakdown.applied_rules && pricePreview.price_breakdown.applied_rules.length > 0 && (
                    <div className="pb-3 border-b border-gray-200">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-2">Taxes & Charges</p>
                      {pricePreview.price_breakdown.applied_rules.map((rule, index) => (
                        <div key={index} className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">
                            {rule.name}
                            {rule.is_percentage && ` (${rule.value}%)`}
                          </span>
                          <span className={rule.type === 'MARKUP' ? 'text-orange-600 font-medium' : 'text-green-600 font-medium'}>
                            {rule.type === 'MARKUP' ? '+' : '-'}
                            {formatCurrency(parseFloat(rule.amount_applied))}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Per Person & Traveler Breakdown - ALL FROM BACKEND */}
                  <div className="pb-3 border-b-2 border-gray-300">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700 font-medium">Price per person</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(parseFloat(pricePreview.per_person_price))}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700">Chargeable travelers (age ≥ 5)</span>
                      <span className="font-semibold text-gray-900">× {chargeableTravelers}</span>
                    </div>
                    {freeTravelers > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700">Free travelers (under 5)</span>
                        <span className="font-semibold text-green-700">× {freeTravelers} (Free)</span>
                      </div>
                    )}
                  </div>

                  {/* Total Amount - FROM BACKEND */}
                  <div className="pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                      <span className="text-3xl font-bold text-orange-600">
                        {formatCurrency(parseFloat(pricePreview.total_amount))}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                      <CheckCircle className="w-4 h-4" />
                      <span>All taxes included • No hidden charges</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center flex items-center justify-center gap-1">
                      <Shield className="w-3 h-3" />
                      All prices calculated securely on our servers
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-600">
                    Enter traveler ages to see accurate pricing
                  </p>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800">{error}</p>
                  {(error.includes('session') || error.includes('logged in') || error.includes('token')) && (
                    <button
                      onClick={() => {
                        // Use signOut from next-auth
                        import('next-auth/react').then(({ signOut }) => {
                          signOut({ callbackUrl: '/login' });
                        });
                      }}
                      className="mt-2 text-sm font-medium text-red-700 hover:text-red-900 underline"
                    >
                      Click here to logout and login again
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Proceed Button */}
            <button
              onClick={() => {
                // Check if user is authenticated before proceeding
                if (status === 'unauthenticated') {
                  toast.error('Please login to complete your booking');
                  router.push('/login');
                  return;
                }
                handleProceedToPayment();
              }}
              disabled={submitting || !pricePreview || status === 'loading'}
              className={cn(
                sacredStyles.button.primary,
                'w-full flex items-center justify-center gap-2 text-lg py-4',
                (!pricePreview || submitting || status === 'loading') && 'opacity-50 cursor-not-allowed'
              )}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Booking...
                </>
              ) : status === 'unauthenticated' ? (
                <>
                  Login to Continue
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  Proceed to Payment
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {status === 'unauthenticated' && (
              <p className="text-xs text-center text-orange-600 mt-2">
                You need to be logged in to create a booking
              </p>
            )}

            {/* Security Info */}
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h3 className="font-medium text-orange-900 mb-2 text-sm">What happens next?</h3>
              <ul className="text-xs text-orange-800 space-y-1.5">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>Secure payment via Razorpay</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>Instant booking confirmation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>Travel documents 48hrs before trip</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-16">
        <TrustBadges variant="compact" />
      </div>
    </div>
  );
}
