'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookingDetail, apiService } from '@/lib/api';
import { cn, sacredStyles, formatCurrency } from '@/lib/utils';
import {
  Calendar,
  Users,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Loader2,
  AlertCircle,
  CheckCircle,
  Edit,
} from 'lucide-react';
import PaymentModal from './PaymentModal';

interface CheckoutClientProps {
  booking: BookingDetail;
}

export default function CheckoutClient({ booking }: CheckoutClientProps) {
  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProceedToPayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Initiate payment
      const paymentData = await apiService.initiatePayment(booking.id);
      
      // Open payment modal
      setShowPaymentModal(true);
      setIsProcessing(false);

      // Payment modal will handle the Razorpay integration
      console.log('Payment initiated:', paymentData);
    } catch (err) {
      console.error('Failed to initiate payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment successful:', paymentId);
    // Navigate to confirmation page
    router.push(`/bookings/${booking.id}`);
  };

  const handlePaymentFailure = (error: string) => {
    console.error('Payment failed:', error);
    setError(error);
    setShowPaymentModal(false);
  };

  const totalAmount = parseFloat(booking.total_price) * booking.num_travelers;

  return (
    <div className={cn(sacredStyles.container, "max-w-5xl")}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={cn(sacredStyles.heading.h1, "mb-2")}>
          Checkout
        </h1>
        <p className={cn(sacredStyles.text.body, "text-gray-600")}>
          Review your booking details and complete payment
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-red-900">Payment Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Booking Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Package Information */}
          <div className={sacredStyles.card}>
            <div className="flex items-start justify-between mb-4">
              <h2 className={cn(sacredStyles.heading.h3, "mb-0")}>
                Package Details
              </h2>
              <button
                onClick={() => router.push(`/packages/${booking.package.slug}`)}
                className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">{booking.package.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{booking.package.city_name}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-sm text-gray-700 mb-3">Selected Experiences</h4>
                <div className="space-y-2">
                  {booking.selected_experiences.map((exp) => (
                    <div key={exp.id} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{exp.name}</p>
                        <p className="text-xs text-gray-500">
                          {exp.duration_hours}h • {exp.difficulty_level}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        {formatCurrency(exp.base_price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Hotel Tier</span>
                  <span className="text-sm font-medium">{booking.selected_hotel_tier.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Transport</span>
                  <span className="text-sm font-medium">{booking.selected_transport.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Traveler Information */}
          <div className={sacredStyles.card}>
            <h2 className={cn(sacredStyles.heading.h3, "mb-4")}>
              Traveler Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Number of Travelers</p>
                  <p className="text-sm text-gray-900">{booking.num_travelers}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Travel Date</p>
                  <p className="text-sm text-gray-900">
                    {new Date(booking.booking_date).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-900">{booking.customer_email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-sm text-gray-900">{booking.customer_phone}</p>
                </div>
              </div>

              <div className="md:col-span-2 flex items-start gap-3">
                <div className="w-5 h-5 flex-shrink-0" /> {/* Spacer */}
                <div>
                  <p className="text-sm font-medium text-gray-700">Contact Person</p>
                  <p className="text-sm text-gray-900">{booking.customer_name}</p>
                </div>
              </div>

              {booking.special_requests && (
                <div className="md:col-span-2 flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0" /> {/* Spacer */}
                  <div>
                    <p className="text-sm font-medium text-gray-700">Special Requests</p>
                    <p className="text-sm text-gray-900">{booking.special_requests}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Important Information */}
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="font-medium text-orange-900 mb-2">Important Information</h3>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Payment is secure and processed through Razorpay</li>
              <li>• You will receive a confirmation email after successful payment</li>
              <li>• Cancellation policy applies as per terms and conditions</li>
              <li>• Travel documents will be sent 48 hours before your journey</li>
            </ul>
          </div>
        </div>

        {/* Right Column - Price Summary (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className={sacredStyles.card}>
              <h2 className={cn(sacredStyles.heading.h3, "mb-4")}>
                Price Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Package Price (per person)</span>
                  <span className="font-medium">{formatCurrency(parseFloat(booking.total_price))}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Number of Travelers</span>
                  <span className="font-medium">× {booking.num_travelers}</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handleProceedToPayment}
                disabled={isProcessing}
                className={cn(
                  sacredStyles.button.primary,
                  "w-full flex items-center justify-center gap-2"
                )}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Proceed to Payment
                  </>
                )}
              </button>

              {/* Secu
rity Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          bookingId={booking.id}
          amount={totalAmount}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}
