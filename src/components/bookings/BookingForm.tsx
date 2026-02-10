'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookingRequest } from '@/lib/bookings';
import { cn, sacredStyles } from '@/lib/utils';
import { bookingFormSchema, BookingFormData } from '@/lib/validation';
import ErrorMessage from '@/components/common/ErrorMessage';

interface BookingFormProps {
  packageId: number;
  selections: {
    experiences: number[];
    hotel: number;
    transport: number;
  };
  totalPrice: string;
  onSubmit: (data: BookingRequest) => Promise<void>;
  onCancel: () => void;
  isProcessing?: boolean;
}

export default function BookingForm({
  packageId,
  selections,
  totalPrice,
  onSubmit,
  onCancel,
  isProcessing = false,
}: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Get minimum date (3 days from now)
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0];
  };

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    mode: 'onBlur', // Validate on blur for better UX
    defaultValues: {
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      travel_date: '',
      number_of_travelers: 1,
      special_requests: '',
    },
  });

  const formData = watch();

  const onFormSubmit = async (data: BookingFormData) => {
    setLoading(true);

    try {
      // Split customer name into first and last name for guest checkout
      const nameParts = data.customer_name.trim().split(' ');
      const first_name = nameParts[0] || '';
      const last_name = nameParts.slice(1).join(' ') || '';

      await onSubmit({
        package_id: packageId,
        experience_ids: selections.experiences,
        hotel_tier_id: selections.hotel,
        transport_option_id: selections.transport,
        booking_date: data.travel_date,
        num_travelers: data.number_of_travelers,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        special_requests: data.special_requests || '',
        // Add fields for guest checkout
        first_name,
        last_name,
        email: data.customer_email,
        phone: data.customer_phone,
      });
    } catch (error) {
      console.error('Booking failed:', error);
      // Error is handled in parent component
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    // Validate current step fields before proceeding
    if (step === 1) {
      const isStepValid = await trigger(['travel_date', 'number_of_travelers']);
      if (isStepValid) {
        setStep(2);
      }
    } else if (step === 2) {
      const isStepValid = await trigger([
        'customer_name',
        'customer_email',
        'customer_phone',
      ]);
      if (isStepValid) {
        setStep(3);
      }
    }
  };

  return (
    <form onSubmit={handleFormSubmit(onFormSubmit)} className="space-y-6">
      {/* Step 1: Travel Details */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className={sacredStyles.heading.h4}>Travel Details</h3>

          <div>
            <label className="block text-sm font-medium mb-2">
              Travel Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              min={getMinDate()}
              {...register('travel_date')}
              className={cn(
                "w-full px-4 py-2 border rounded-lg transition-colors",
                errors.travel_date
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
              )}
            />
            <ErrorMessage message={errors.travel_date?.message || ''} />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 3 days advance booking required
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Travelers <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={20}
              {...register('number_of_travelers', { valueAsNumber: true })}
              className={cn(
                "w-full px-4 py-2 border rounded-lg transition-colors",
                errors.number_of_travelers
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
              )}
            />
            <ErrorMessage message={errors.number_of_travelers?.message || ''} />
          </div>

          <button
            type="button"
            onClick={handleNextStep}
            className={cn(sacredStyles.button.primary, "w-full")}
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Customer Information */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className={sacredStyles.heading.h4}>Your Information</h3>

          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('customer_name')}
              className={cn(
                "w-full px-4 py-2 border rounded-lg transition-colors",
                errors.customer_name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
              )}
            />
            <ErrorMessage message={errors.customer_name?.message || ''} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register('customer_email')}
              className={cn(
                "w-full px-4 py-2 border rounded-lg transition-colors",
                errors.customer_email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
              )}
            />
            <ErrorMessage message={errors.customer_email?.message || ''} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="+919876543210"
              {...register('customer_phone')}
              className={cn(
                "w-full px-4 py-2 border rounded-lg transition-colors",
                errors.customer_phone
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
              )}
            />
            <ErrorMessage message={errors.customer_phone?.message || ''} />
            <p className="text-xs text-gray-500 mt-1">
              Format: +91XXXXXXXXXX
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              {...register('special_requests')}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={cn(sacredStyles.button.secondary, "flex-1")}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className={cn(sacredStyles.button.primary, "flex-1")}
            >
              Review
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className={sacredStyles.heading.h4}>Review Booking</h3>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p><strong>Date:</strong> {formData.travel_date}</p>
            <p><strong>Travelers:</strong> {formData.number_of_travelers}</p>
            <p><strong>Name:</strong> {formData.customer_name}</p>
            <p><strong>Email:</strong> {formData.customer_email}</p>
            <p><strong>Phone:</strong> {formData.customer_phone}</p>
            {formData.special_requests && (
              <p><strong>Special Requests:</strong> {formData.special_requests}</p>
            )}
            <p className="text-2xl font-bold text-orange-600 mt-4">
              Total: ₹{totalPrice}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className={cn(sacredStyles.button.secondary, "flex-1")}
              disabled={loading || isProcessing}
            >
              Back
            </button>
            <button
              type="submit"
              className={cn(sacredStyles.button.primary, "flex-1")}
              disabled={loading || isProcessing}
            >
              {loading || isProcessing ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onCancel}
        className="w-full text-center text-sm text-gray-600 hover:text-gray-900"
      >
        Cancel
      </button>
    </form>
  );
}
