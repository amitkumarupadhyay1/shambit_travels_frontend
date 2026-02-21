'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiService } from '@/lib/api';
import { cn, sacredStyles } from '@/lib/utils';
import { X, Loader2, Users, User, Mail, Phone, MessageSquare, Hotel } from 'lucide-react';
import DateRangePicker from './DateRangePicker';
import RoomSelector from './RoomSelector';
import { Experience } from '@/lib/api';

// Validation schema - PHASE 2: Updated with date range
const travelerDetailsSchema = z.object({
  num_travelers: z.number().min(1, 'At least 1 traveler required').max(10, 'Maximum 10 travelers allowed'),
  booking_start_date: z.string().min(1, 'Start date is required'),
  booking_end_date: z.string().min(1, 'End date is required'),
  num_rooms: z.number().min(1, 'At least 1 room required').max(10, 'Maximum 10 rooms allowed'),
  customer_name: z.string().min(2, 'Name must be at least 2 characters').max(255, 'Name too long'),
  customer_email: z.string().email('Invalid email address'),
  customer_phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number (e.g., +919876543210)'),
  special_requests: z.string().max(500, 'Special requests too long').optional(),
  room_preferences: z.string().max(500, 'Room preferences too long').optional(),
}).refine((data) => {
  // Validate end date is after start date
  const start = new Date(data.booking_start_date);
  const end = new Date(data.booking_end_date);
  return end > start;
}, {
  message: 'End date must be after start date',
  path: ['booking_end_date'],
});

type TravelerDetailsForm = z.infer<typeof travelerDetailsSchema>;

interface TravelerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: number;
  packageName: string;
  packageSlug?: string;
  selections: {
    experiences: number[];
    hotel: number;
    transport: number;
  };
  // PHASE 2: New props
  selectedExperiences?: Experience[]; // For trip duration calculation
  hotelTierMaxOccupancy?: number; // For room calculation
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
  selectedExperiences = [],
  hotelTierMaxOccupancy = 2,
  totalPrice,
  onBookingComplete,
}: TravelerDetailsModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // PHASE 2: State for date range and rooms
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [numNights, setNumNights] = useState(1);
  const [recommendedNights, setRecommendedNights] = useState(1);

  // Calculate minimum booking date (3 days from now)
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0];
  };
  
  // PHASE 2: Calculate recommended trip duration from experiences
  useEffect(() => {
    if (selectedExperiences && selectedExperiences.length > 0) {
      const totalHours = selectedExperiences.reduce((sum, exp) => sum + exp.duration_hours, 0);
      const days = Math.ceil(totalHours / 8);
      const nights = Math.max(1, days - 1);
      setRecommendedNights(nights);
      
      // Auto-set dates if not already set
      if (!startDate) {
        const minDate = getMinDate();
        setStartDate(minDate);
        const start = new Date(minDate);
        start.setDate(start.getDate() + nights);
        setEndDate(start.toISOString().split('T')[0]);
      }
    }
  }, [selectedExperiences, startDate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<TravelerDetailsForm>({
    resolver: zodResolver(travelerDetailsSchema),
    defaultValues: {
      num_travelers: 1,
      booking_start_date: getMinDate(),
      booking_end_date: '',
      num_rooms: 1,
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      special_requests: '',
      room_preferences: '',
    },
  });

  const numTravelers = watch('num_travelers');
  const numRooms = watch('num_rooms');
  
  // PHASE 2: Auto-calculate minimum rooms based on travelers
  useEffect(() => {
    const minRooms = Math.ceil(numTravelers / hotelTierMaxOccupancy);
    if (numRooms < minRooms) {
      setValue('num_rooms', minRooms);
    }
  }, [numTravelers, hotelTierMaxOccupancy, numRooms, setValue]);

  const onSubmit = async (data: TravelerDetailsForm) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // PHASE 2: Create booking with date range and room info
      const booking = await apiService.createBooking({
        package_id: packageId,
        experience_ids: selections.experiences,
        hotel_tier_id: selections.hotel,
        transport_option_id: selections.transport,
        booking_date: data.booking_start_date, // Start date (backward compatible)
        booking_end_date: data.booking_end_date, // PHASE 2: End date
        num_rooms: data.num_rooms, // PHASE 1: Number of rooms
        room_preferences: data.room_preferences, // PHASE 1: Room preferences
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
            </div>

            {/* PHASE 2: Date Range Picker */}
            <div>
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                recommendedNights={recommendedNights}
                onChange={(start, end, nights) => {
                  setStartDate(start);
                  setEndDate(end);
                  setNumNights(nights);
                  setValue('booking_start_date', start);
                  setValue('booking_end_date', end);
                }}
                disabled={isSubmitting}
              />
              {errors.booking_start_date && (
                <p className="text-xs text-red-600 mt-1">{errors.booking_start_date.message}</p>
              )}
              {errors.booking_end_date && (
                <p className="text-xs text-red-600 mt-1">{errors.booking_end_date.message}</p>
              )}
            </div>

            {/* PHASE 1: Room Selector */}
            <div>
              <RoomSelector
                numTravelers={numTravelers}
                maxOccupancyPerRoom={hotelTierMaxOccupancy}
                selectedRooms={numRooms}
                onChange={(rooms) => setValue('num_rooms', rooms)}
                disabled={isSubmitting}
              />
              {errors.num_rooms && (
                <p className="text-xs text-red-600 mt-1">{errors.num_rooms.message}</p>
              )}
            </div>

            {/* Pricing Summary */}
            {startDate && endDate && numNights > 0 && (
              <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Pricing Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Per person price:</span>
                    <span className="font-medium">₹{parseFloat(totalPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of travelers:</span>
                    <span className="font-medium">×{numTravelers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trip duration:</span>
                    <span className="font-medium">{numNights} night{numNights > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rooms required:</span>
                    <span className="font-medium">{numRooms} room{numRooms > 1 ? 's' : ''}</span>
                  </div>
                  <div className="pt-2 border-t border-orange-300 flex justify-between">
                    <span className="font-semibold text-gray-900">Estimated Total:</span>
                    <span className="font-bold text-orange-600 text-lg">
                      ₹{(parseFloat(totalPrice) * numTravelers).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 italic mt-2">
                    * Final price will be calculated at checkout including hotel costs for {numNights} night{numNights > 1 ? 's' : ''} and {numRooms} room{numRooms > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}

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

            {/* PHASE 1: Room Preferences */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Hotel className="w-4 h-4" />
                Room Preferences (Optional)
              </label>
              <textarea
                {...register('room_preferences')}
                placeholder="E.g., connecting rooms, ground floor, away from elevator..."
                rows={2}
                className={cn(
                  "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none",
                  errors.room_preferences ? "border-red-300" : "border-gray-300"
                )}
              />
              {errors.room_preferences && (
                <p className="text-xs text-red-600 mt-1">{errors.room_preferences.message}</p>
              )}
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
