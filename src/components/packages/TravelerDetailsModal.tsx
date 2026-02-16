'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiService } from '@/lib/api';
import { cn, sacredStyles } from '@/lib/utils';
import { X, Loader2, Calendar, Users, User, Mail, Phone, MessageSquare } from 'lucide-react';

// Validation schema
const travelerDetailsSchema = z.object({
  num_travelers: z.number().min(1, 'At least 1 traveler required').max(10, 'Maximum 10 travelers allowed'),
  booking_date: z.string().min(1, 'Booking date is required'),
  customer_name: z.string().min(2, 'Name must be at least 2 characters').max(255, 'Name too long'),
  customer_email: z.string().email('Invalid email address'),
  customer_phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number (e.g., +919876543210)'),
  special_requests: z.string().max(500, 'Special requests too long').optional(),
});

type TravelerDetailsForm = z.infer<typeof travelerDetailsSchema>;

interface TravelerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: number;
  packageName: string;
  packageSlug?: string; // Optional, used for logging/tracking
  selections: {
    experiences: number[];
    hotel: number;
    transport: number;
  };
  totalPrice: string;
  onBookingComplete: (bookingId: number) => void;
}

export default function TravelerDetailsModal({
  isOpen,
  onClose,
  packageId,
  packageName,
  packageSlug, // eslint-disable-line @typescript-eslint/no-unused-vars
  selections,
  totalPrice,
  onBookingComplete,
}: TravelerDetailsModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate minimum booking date (3 days from now)
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0];
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TravelerDetailsForm>({
    resolver: zodResolver(travelerDetailsSchema),
    defaultValues: {
      num_travelers: 1,
      booking_date: getMinDate(),
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      special_requests: '',
    },
  });

  const numTravelers = watch('num_travelers');

  const onSubmit = async (data: TravelerDetailsForm) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Create booking using the API service
      const booking = await apiService.createBooking({
        package_id: packageId,
        experience_ids: selections.experiences,
        hotel_tier_id: selections.hotel,
        transport_option_id: selections.transport,
        booking_date: data.booking_date,
        num_travelers: data.num_travelers,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        special_requests: data.special_requests || '',
      });

      console.log('Booking created successfully:', booking);
      
      // Clear pending booking from sessionStorage
      sessionStorage.removeItem('pendingBooking');
      
      // Call completion handler with booking ID
      onBookingComplete(booking.id);
      
      // Close modal
      onClose();
    } catch (err) {
      console.error('Failed to create booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className={cn(sacredStyles.heading.h3, "mb-1")}>
                Traveler Details
              </h2>
              <p className="text-sm text-gray-600">{packageName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <div className="flex-1">
                  <p className="font-medium text-red-900">Booking Failed</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Number of Travelers */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4" />
                Number of Travelers
              </label>
              <input
                type="number"
                {...register('num_travelers', { valueAsNumber: true })}
                min={1}
                max={10}
                className={cn(
                  "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500",
                  errors.num_travelers ? "border-red-300" : "border-gray-300"
                )}
              />
              {errors.num_travelers && (
                <p className="text-xs text-red-600 mt-1">{errors.num_travelers.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Total price for {numTravelers} {numTravelers === 1 ? 'traveler' : 'travelers'}: ₹{(parseFloat(totalPrice) * numTravelers).toFixed(2)}
              </p>
            </div>

            {/* Booking Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Travel Date
              </label>
              <input
                type="date"
                {...register('booking_date')}
                min={getMinDate()}
                className={cn(
                  "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500",
                  errors.booking_date ? "border-red-300" : "border-gray-300"
                )}
              />
              {errors.booking_date && (
                <p className="text-xs text-red-600 mt-1">{errors.booking_date.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Bookings must be made at least 3 days in advance
              </p>
            </div>

            {/* Customer Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input
                type="text"
                {...register('customer_name')}
                placeholder="John Doe"
                className={cn(
                  "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500",
                  errors.customer_name ? "border-red-300" : "border-gray-300"
                )}
              />
              {errors.customer_name && (
                <p className="text-xs text-red-600 mt-1">{errors.customer_name.message}</p>
              )}
            </div>

            {/* Customer Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                {...register('customer_email')}
                placeholder="john@example.com"
                className={cn(
                  "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500",
                  errors.customer_email ? "border-red-300" : "border-gray-300"
                )}
              />
              {errors.customer_email && (
                <p className="text-xs text-red-600 mt-1">{errors.customer_email.message}</p>
              )}
            </div>

            {/* Customer Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <input
                type="tel"
                {...register('customer_phone')}
                placeholder="+919876543210"
                className={cn(
                  "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500",
                  errors.customer_phone ? "border-red-300" : "border-gray-300"
                )}
              />
              {errors.customer_phone && (
                <p className="text-xs text-red-600 mt-1">{errors.customer_phone.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Include country code (e.g., +91 for India)
              </p>
            </div>

            {/* Special Requests */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4" />
                Special Requests (Optional)
              </label>
              <textarea
                {...register('special_requests')}
                placeholder="Any special requirements or preferences..."
                rows={3}
                className={cn(
                  "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none",
                  errors.special_requests ? "border-red-300" : "border-gray-300"
                )}
              />
              {errors.special_requests && (
                <p className="text-xs text-red-600 mt-1">{errors.special_requests.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className={cn(
                  sacredStyles.button.secondary,
                  "flex-1"
                )}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  sacredStyles.button.primary,
                  "flex-1 flex items-center justify-center gap-2"
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Booking...
                  </>
                ) : (
                  'Continue to Checkout'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
