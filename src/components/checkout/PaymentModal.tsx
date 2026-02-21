'use client';

import { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';
import { cn, sacredStyles } from '@/lib/utils';
import { Loader2, X, AlertCircle } from 'lucide-react';

// Razorpay types
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayError {
  error: {
    description: string;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: RazorpayError) => void) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

interface PaymentModalProps {
  bookingId: number;
  amount: number;
  onSuccess: (response: RazorpayResponse) => void;
  onFailure: (error: string) => void;
  onClose: () => void;
}

export default function PaymentModal({
  bookingId,
  amount,
  onSuccess,
  onFailure,
  onClose,
}: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Razorpay script
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    const initiatePayment = async () => {
      try {
        // Load Razorpay script
        const loaded = await loadRazorpay();
        if (!loaded) {
          throw new Error('Failed to load Razorpay SDK');
        }

        // Get payment details from backend
        const paymentData = await apiService.initiatePayment(bookingId);

        setIsLoading(false);

        // Debug: Log the Razorpay key
        const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        console.log('🔑 Razorpay Key:', razorpayKey ? `${razorpayKey.substring(0, 10)}...` : 'MISSING');
        
        if (!razorpayKey) {
          throw new Error('Razorpay key is not configured. Please check NEXT_PUBLIC_RAZORPAY_KEY_ID environment variable.');
        }

        // Configure Razorpay options
        const options = {
          key: razorpayKey,
          amount: paymentData.amount,
          currency: paymentData.currency,
          name: 'ShamBit',
          description: `Booking #${bookingId}`,
          order_id: paymentData.razorpay_order_id,
          handler: function (response: RazorpayResponse) {
            console.log('Payment successful:', response);
            onSuccess(response);
          },
          prefill: {
            name: '',
            email: '',
            contact: '',
          },
          theme: {
            color: '#EA580C', // Orange-600
          },
          modal: {
            ondismiss: function () {
              console.log('Payment modal closed');
              onClose();
            },
          },
        };

        // Open Razorpay checkout
        const razorpay = new window.Razorpay(options);
        razorpay.on('payment.failed', function (response: RazorpayError) {
          console.error('Payment failed:', response);
          onFailure(response.error.description || 'Payment failed');
        });
        razorpay.open();
      } catch (err) {
        console.error('Failed to initiate payment:', err);
        setError(err instanceof Error ? err.message : 'Failed to initiate payment');
        setIsLoading(false);
      }
    };

    initiatePayment();
  }, [bookingId, amount, onSuccess, onFailure, onClose]);

  if (error) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className={sacredStyles.heading.h3}>Payment Error</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Error Message */}
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Failed to Initialize Payment</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className={cn(sacredStyles.button.secondary, "flex-1")}
              >
                Close
              </button>
              <button
                onClick={() => window.location.reload()}
                className={cn(sacredStyles.button.primary, "flex-1")}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-8">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
              <h2 className={cn(sacredStyles.heading.h3, "mb-2")}>
                Initializing Payment
              </h2>
              <p className="text-sm text-gray-600">
                Please wait while we prepare your payment...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Razorpay modal will be shown, this component just handles loading/error states
  return null;
}
