'use client';

import { useState } from 'react';
import { BookingRequest } from '@/lib/bookings';
import { cn, sacredStyles } from '@/lib/utils';

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
}

export default function BookingForm({
  packageId,
  selections,
  totalPrice,
  onSubmit,
  onCancel,
}: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    booking_date: '',
    num_travelers: 1,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    special_requests: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        package_id: packageId,
        experience_ids: selections.experiences,
        hotel_tier_id: selections.hotel,
        transport_option_id: selections.transport,
        ...formData,
      });
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step 1: Travel Details */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className={sacredStyles.heading.h4}>Travel Details</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Travel Date
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={formData.booking_date}
              onChange={(e) => setFormData({...formData, booking_date: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Travelers
            </label>
            <input
              type="number"
              required
              min={1}
              max={20}
              value={formData.num_travelers}
              onChange={(e) => setFormData({...formData, num_travelers: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
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
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.customer_name}
              onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.customer_email}
              onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Phone
            </label>
            <input
              type="tel"
              required
              value={formData.customer_phone}
              onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              value={formData.special_requests}
              onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
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
              onClick={() => setStep(3)}
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
            <p><strong>Date:</strong> {formData.booking_date}</p>
            <p><strong>Travelers:</strong> {formData.num_travelers}</p>
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
              disabled={loading}
            >
              Back
            </button>
            <button
              type="submit"
              className={cn(sacredStyles.button.primary, "flex-1")}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
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
