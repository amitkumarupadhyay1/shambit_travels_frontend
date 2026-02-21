'use client';

import { Shield, Lock, CheckCircle, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecurityBadgesProps {
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
}

export default function SecurityBadges({ variant = 'default', className }: SecurityBadgesProps) {
  if (variant === 'inline') {
    return (
      <div className={cn("flex items-center gap-3 text-sm", className)}>
        <div className="flex items-center gap-1.5 text-green-700">
          <Shield className="w-4 h-4" aria-hidden="true" />
          <span className="font-medium">Secure Checkout</span>
        </div>
        <span className="text-gray-400">•</span>
        <div className="flex items-center gap-1.5 text-gray-600">
          <Lock className="w-4 h-4" aria-hidden="true" />
          <span>SSL Encrypted</span>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn("space-y-3", className)}>
        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2.5 rounded-lg border border-green-200">
          <Shield className="w-5 h-5" aria-hidden="true" />
          <span className="font-semibold">100% Secure Payment</span>
        </div>

        {/* Payment Methods */}
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-2">We accept</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="px-3 py-1.5 bg-white rounded border border-gray-200 text-xs font-medium text-gray-700 shadow-sm">
              💳 Visa
            </div>
            <div className="px-3 py-1.5 bg-white rounded border border-gray-200 text-xs font-medium text-gray-700 shadow-sm">
              💳 Mastercard
            </div>
            <div className="px-3 py-1.5 bg-white rounded border border-gray-200 text-xs font-medium text-gray-700 shadow-sm">
              📱 UPI
            </div>
            <div className="px-3 py-1.5 bg-white rounded border border-gray-200 text-xs font-medium text-gray-700 shadow-sm">
              🏦 NetBanking
            </div>
          </div>
        </div>

        {/* Powered by Razorpay */}
        <div className="text-center pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-1.5">Powered by Razorpay</p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Lock className="w-3 h-3" aria-hidden="true" />
            <span>256-bit SSL</span>
            <span>•</span>
            <span>PCI DSS Compliant</span>
          </div>
        </div>
      </div>
    );
  }

  // Default variant - full display
  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Security Badge */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-green-900 mb-1">
              100% Secure Payment
            </h3>
            <p className="text-sm text-green-700 mb-3">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-xs text-green-800 bg-white px-3 py-1.5 rounded-full border border-green-200">
                <Lock className="w-3 h-3" aria-hidden="true" />
                <span className="font-medium">256-bit SSL</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-green-800 bg-white px-3 py-1.5 rounded-full border border-green-200">
                <CheckCircle className="w-3 h-3" aria-hidden="true" />
                <span className="font-medium">PCI DSS Compliant</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-green-800 bg-white px-3 py-1.5 rounded-full border border-green-200">
                <Shield className="w-3 h-3" aria-hidden="true" />
                <span className="font-medium">Money-Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-orange-600" aria-hidden="true" />
          Accepted Payment Methods
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
            <div className="text-2xl mb-1">💳</div>
            <span className="text-xs font-medium text-gray-700">Credit Cards</span>
            <span className="text-xs text-gray-500">Visa, Mastercard</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
            <div className="text-2xl mb-1">💳</div>
            <span className="text-xs font-medium text-gray-700">Debit Cards</span>
            <span className="text-xs text-gray-500">All major banks</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
            <div className="text-2xl mb-1">📱</div>
            <span className="text-xs font-medium text-gray-700">UPI</span>
            <span className="text-xs text-gray-500">GPay, PhonePe</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
            <div className="text-2xl mb-1">🏦</div>
            <span className="text-xs font-medium text-gray-700">Net Banking</span>
            <span className="text-xs text-gray-500">All banks</span>
          </div>
        </div>
      </div>

      {/* Powered by Razorpay */}
      <div className="text-center py-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Payments powered by</p>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="px-4 py-2 bg-blue-600 text-white font-bold rounded text-sm">
            Razorpay
          </div>
        </div>
        <p className="text-xs text-gray-500">
          India&apos;s most trusted payment gateway
        </p>
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" aria-hidden="true" />
          <span>Instant Confirmation</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" aria-hidden="true" />
          <span>No Hidden Charges</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" aria-hidden="true" />
          <span>24/7 Support</span>
        </div>
      </div>
    </div>
  );
}
