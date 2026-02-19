'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
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
  Shield,
} from 'lucide-react';
import ExpiryTimer from './ExpiryTimer';
import toast from 'react-hot-toast';

// Lazy load PaymentModal for better performance
const PaymentModal = dynamic(() => import('./PaymentModal'), {
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6">
        <Loader2 className="w-8 h-8 text-orange-600 animate-spin mx-auto" />
        <p className="mt-4 text-gray-700">Loading payment gateway...</p>
      </div>
    </div>
  ),
  ssr: false, // Payment modal should only render on client
});

interface CheckoutClientProps {
  booking: BookingDetail;
}

export default function CheckoutClient({ booking }: CheckoutClientProps) {
  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExpire = () => {
    toast.error('Booking expired. Please start a new booking.');
    setTimeout(() => {
      router.push('/packages');
    }, 3000);
  };

  const handleProceedToPayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Validate payment amount with backend (source of truth)
      console.log('Step 1: Validating payment amount with backend...');
      const validation = await apiService.validateBookingPayment(booking.id);
      
      console.log('Payment validation response:', validation);
      
      // Step 2: Verify validation matches displayed amount
      const displayedAmount = parseFloat(breakdown.total_amount);
      const validatedAmount = parseFloat(validation.total_amount);
      
      if (Math.abs(displayedAmount - validatedAmount) > 0.01) {
        throw new Error(
          `Price mismatch detected. Displayed: ₹${displayedAmount.toFixed(2)}, ` +
          `Validated: ₹${validatedAmount.toFixed(2)}. Please refresh the page.`
        );
      }
      
      console.log('✅ Validation passed:', {
        displayed: displayedAmount,
        validated: validatedAmount,
        match: true
      });
      
      // Step 3: Initiate payment
      console.log('Step 2: Initiating payment...');
      const paymentData = await apiService.initiatePayment(booking.id);
      
      // Step 4: Verify payment amount matches validation
      if (paymentData.amount !== validation.amount_in_paise) {
        throw new Error(
          `Payment gateway amount mismatch. ` +
          `Expected: ${validation.amount_in_paise} paise, ` +
          `Received: ${paymentData.amount} paise. Please try again.`
        );
      }
      
      console.log('✅ Payment initiated successfully:', {
        razorpay_order_id: paymentData.razorpay_order_id,
        amount_in_paise: paymentData.amount,
        amount_in_rupees: (paymentData.amount / 100).toFixed(2),
        booking_id: paymentData.booking_id
      });
      
      // Step 5: Open payment modal
      setShowPaymentModal(true);
      setIsProcessing(false);
    } catch (err) {
      console.error('Failed to initiate payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment successful:', paymentId);
    setShowPaymentModal(false);
    
    // Start polling booking status
    toast.loading('Verifying payment...', { id: 'payment-verify' });
    pollBookingStatus();
  };

  const pollBookingStatus = async () => {
    const maxAttempts = 30; // 30 attempts * 2 seconds = 60 seconds max
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        // Wait 2 seconds before each poll
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Fetch latest booking status
        const updatedBooking = await apiService.getBooking(booking.id);
        
        if (updatedBooking.status === 'CONFIRMED') {
          toast.success('Payment confirmed!', { id: 'payment-verify' });
          // Navigate to confirmation page
          router.push(`/bookings/${updatedBooking.booking_reference || updatedBooking.id}`);
          return;
        }
        
        if (updatedBooking.status === 'CANCELLED') {
          toast.error('Payment was cancelled', { id: 'payment-verify' });
          setError('Payment was cancelled. Please try again.');
          return;
        }
        
        if (updatedBooking.status === 'EXPIRED') {
          toast.error('Booking expired', { id: 'payment-verify' });
          setError('Booking has expired. Please create a new booking.');
          return;
        }
        
        // Still pending, continue polling
        console.log(`Polling attempt ${attempt + 1}/${maxAttempts}: Status is ${updatedBooking.status}`);
        
      } catch (err) {
        console.error('Error polling booking status:', err);
        // Continue polling even on error
      }
    }
    
    // Timeout reached
    toast.dismiss('payment-verify');
    toast.error(
      'Payment verification is taking longer than expected. Please check your booking status in a few minutes.',
      { duration: 8000 }
    );
    setError(
      'Payment verification timeout. Your payment may still be processing. ' +
      'Please check your email or contact support if you don\'t receive confirmation within 10 minutes.'
    );
  };

  const handlePaymentFailure = (error: string) => {
    console.error('Payment failed:', error);
    setError(error);
    setShowPaymentModal(false);
  };

  // ⚠️ SECURITY ENFORCEMENT: ALL prices from backend - ZERO frontend calculations ⚠️
  // Backend provides complete price_breakdown with all calculated values
  const breakdown = booking.price_breakdown;
  const totalAmount = parseFloat(breakdown.total_amount);
  const perPersonPrice = parseFloat(breakdown.per_person_price);
  const numTravelers = breakdown.num_travelers;

  return (
    <div className={cn(sacredStyles.container, "max-w-5xl")}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={cn(sacredStyles.heading.h1, "mb-2")}>
          Checkout
        </h1>
        <p className={cn(sacredStyles.text.body, "text-gray-600 mb-4")}>
          Review your booking details and complete payment
        </p>
        
        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" aria-hidden="true" />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" aria-hidden="true" />
            <span>Money-Back Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-green-600" aria-hidden="true" />
            <span>24/7 Support</span>
          </div>
        </div>
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

      {/* Expiry Timer */}
      {booking.expires_at && (
        <div className="mb-6">
          <ExpiryTimer expiresAt={booking.expires_at} onExpire={handleExpire} />
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
                aria-label="Edit package selections"
              >
                <Edit className="w-4 h-4" aria-hidden="true" />
                <span>Edit</span>
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

            <div className="space-y-4">
              {/* Traveler Details List */}
              {booking.traveler_details && booking.traveler_details.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Travelers</h3>
                  {booking.traveler_details.map((traveler: { name: string; age: number; gender?: string }, index: number) => {
                    const isFree = traveler.age < 5;
                    return (
                      <div
                        key={index}
                        className={cn(
                          "p-3 rounded-lg border",
                          isFree ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                              isFree ? "bg-green-100" : "bg-orange-100"
                            )}>
                              <Users className={cn("w-4 h-4", isFree ? "text-green-600" : "text-orange-600")} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{traveler.name}</p>
                              <p className="text-sm text-gray-600">
                                {traveler.age} years
                                {traveler.gender && ` • ${traveler.gender.charAt(0).toUpperCase() + traveler.gender.slice(1)}`}
                              </p>
                            </div>
                          </div>
                          {isFree && (
                            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                              Free
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Number of Travelers</p>
                      <p className="text-sm text-gray-900">{booking.num_travelers}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Booking Date and Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
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

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Contact Person</p>
                    <p className="text-sm text-gray-900">{booking.customer_name}</p>
                  </div>
                </div>
              </div>

              {booking.special_requests && (
                <div className="flex items-start gap-3 pt-4 border-t border-gray-200">
                  <div className="w-5 h-5 flex-shrink-0" />
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
              <div className="flex items-center justify-between mb-4">
                <h2 className={cn(sacredStyles.heading.h3, "mb-0")}>
                  Price Summary
                </h2>
                <Shield className="w-5 h-5 text-green-600" aria-label="All prices calculated securely on backend" />
              </div>

              <div className="space-y-3 mb-4">
                {/* Experiences Breakdown - ALL FROM BACKEND */}
                <div className="pb-3 border-b border-gray-200">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">Selected Experiences</p>
                  {breakdown.experiences.map((exp) => (
                    <div key={exp.id} className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{exp.name}</span>
                      <span className="font-medium">{formatCurrency(parseFloat(exp.price))}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm mt-2 pt-2 border-t border-gray-100">
                    <span className="text-gray-700 font-medium">Experiences Total</span>
                    <span className="font-semibold">{formatCurrency(parseFloat(breakdown.base_experience_total))}</span>
                  </div>
                </div>

                {/* Hotel & Transport - ALL FROM BACKEND */}
                <div className="pb-3 border-b border-gray-200">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Hotel: {breakdown.hotel_tier.name}</span>
                    <span className="font-medium text-blue-600">
                      ×{breakdown.hotel_tier.multiplier}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Transport: {breakdown.transport.name}</span>
                    <span className="font-medium">{formatCurrency(parseFloat(breakdown.transport.price))}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2 pt-2 border-t border-gray-100">
                    <span className="text-gray-700 font-medium">After Hotel Multiplier</span>
                    <span className="font-semibold">{formatCurrency(parseFloat(breakdown.subtotal_after_hotel))}</span>
                  </div>
                </div>

                {/* Applied Rules (Taxes, Discounts) - ALL FROM BACKEND */}
                {breakdown.applied_rules && breakdown.applied_rules.length > 0 && (
                  <div className="pb-3 border-b border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Taxes & Charges</p>
                    {breakdown.applied_rules.map((rule, index) => (
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

                {/* Per Person & Total - ALL FROM BACKEND */}
                <div className="pb-3 border-b-2 border-gray-300">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700 font-medium">Price per person</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(perPersonPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 font-medium">Number of travelers</span>
                    <span className="font-semibold text-gray-900">× {numTravelers}</span>
                  </div>
                </div>

                {/* Total Amount - FROM BACKEND */}
                <div className="pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-3xl font-bold text-orange-600">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                    <CheckCircle className="w-3 h-3" />
                    <span>All taxes included • No hidden charges</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center flex items-center justify-center gap-1">
                    <Shield className="w-3 h-3" />
                    All prices calculated securely on our servers
                  </p>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handleProceedToPayment}
                disabled={isProcessing}
                className={cn(
                  sacredStyles.button.primary,
                  "w-full flex items-center justify-center gap-2 text-lg py-4"
                )}
                aria-label={`Pay ${formatCurrency(totalAmount)} for booking`}
                aria-busy={isProcessing}
                aria-describedby="payment-amount-info"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" aria-hidden="true" />
                    <span>Pay {formatCurrency(totalAmount)}</span>
                  </>
                )}
              </button>
              
              <div id="payment-amount-info" className="sr-only">
                Total payment amount is {formatCurrency(totalAmount)} for {numTravelers} traveler{numTravelers > 1 ? 's' : ''}. 
                {breakdown.chargeable_travelers && breakdown.chargeable_travelers !== numTravelers && (
                  <span>This includes {breakdown.chargeable_travelers} chargeable traveler{breakdown.chargeable_travelers > 1 ? 's' : ''}.</span>
                )}
              </div>

              {/* Payment Methods */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center mb-3">We accept</p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <div className="px-3 py-2 bg-gray-50 rounded border border-gray-200 text-xs font-medium text-gray-700">
                    💳 Cards
                  </div>
                  <div className="px-3 py-2 bg-gray-50 rounded border border-gray-200 text-xs font-medium text-gray-700">
                    📱 UPI
                  </div>
                  <div className="px-3 py-2 bg-gray-50 rounded border border-gray-200 text-xs font-medium text-gray-700">
                    🏦 Net Banking
                  </div>
                  <div className="px-3 py-2 bg-gray-50 rounded border border-gray-200 text-xs font-medium text-gray-700">
                    💰 Wallets
                  </div>
                </div>
              </div>
              
              {/* What Happens Next */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3 text-sm">What happens next?</h4>
                  <ul className="space-y-2 text-xs text-blue-800">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>Instant booking confirmation via email</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>Travel documents within 48 hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>24/7 customer support for your journey</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">100% Secure Payment</span>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">Powered by Razorpay</p>
                  <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
                    <span>🔒 256-bit SSL</span>
                    <span>•</span>
                    <span>PCI DSS Compliant</span>
                  </div>
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
