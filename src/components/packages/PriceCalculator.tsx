'use client';

import { useState, useEffect } from 'react';
import { PriceCalculation, apiService, Package } from '@/lib/api';
import { cn, sacredStyles, formatCurrency } from '@/lib/utils';
import { Loader2, ShoppingCart, AlertCircle, Users, CheckCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { storeSelections } from '@/lib/package-selections';
import toast from 'react-hot-toast';

interface PriceCalculatorProps {
  packageSlug: string;
  packageData: Package;
  selections: {
    experiences: number[];
    hotel: number | null;
    transport: number | null;
  };
  isValid: boolean;
}

export default function PriceCalculator({
  packageSlug,
  packageData,
  selections,
  isValid,
}: PriceCalculatorProps) {
  const router = useRouter();
  const { status } = useSession();
  const [price, setPrice] = useState<PriceCalculation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  // Debounce price calculation
  useEffect(() => {
    if (!isValid) {
      setPrice(null);
      setError(null);
      return;
    }

    const calculatePrice = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiService.calculatePrice(packageSlug, {
          experience_ids: selections.experiences,
          hotel_tier_id: selections.hotel!,
          transport_option_id: selections.transport!,
        });
        setPrice(result);
      } catch (err) {
        console.error('Price calculation failed:', err);
        setError('Failed to calculate price. Please try again.');
        setPrice(null);
      } finally {
        setLoading(false);
      }
    };

    // Debounce to avoid excessive API calls
    const timer = setTimeout(calculatePrice, 500);
    return () => clearTimeout(timer);
  }, [packageSlug, selections, isValid]);

  const handleBookNow = () => {
    setRedirecting(true);
    
    // Check authentication status
    if (status === 'unauthenticated') {
      // Save current package state to sessionStorage for post-login restoration
      sessionStorage.setItem('pendingBooking', JSON.stringify({
        packageSlug,
        packageId: packageData.id,
        packageName: packageData.name,
        selections,
        totalPrice: price?.total_price,
      }));

      toast.loading('Redirecting to login...', { duration: 2000 });
      
      // Redirect to login with return URL
      router.push(`/login?returnUrl=${encodeURIComponent(`/packages/${packageSlug}`)}`);
    } else if (status === 'authenticated') {
      // Store selections using the new utility
      storeSelections(
        packageData.id,
        packageSlug,
        selections.experiences,
        selections.hotel!,
        selections.transport!
      );

      console.log('Selections stored, redirecting with intent=book');

      toast.loading('Preparing your booking...', { duration: 2000 });

      // Redirect to same page with intent param to trigger PackageDetailClient logic
      router.push(`/packages/${packageSlug}?intent=book`);
    }
    // If status is 'loading', do nothing (button will be disabled)
  };

  return (
    <div className="sticky top-24">
      <div className={cn(sacredStyles.card, "space-y-6")}>
        <h3 className={sacredStyles.heading.h4}>Your Package Summary</h3>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isValid && !loading && !error && (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              Select experiences, hotel tier, and transport to see pricing
            </p>
          </div>
        )}

        {/* Price Display */}
        {price && !loading && !error && (
          <>
            {/* Breakdown */}
            <div className="space-y-3">
              {/* Experiences */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Selected Experiences ({price.breakdown.experiences.length})
                </div>
                <div className="space-y-1 pl-4">
                  {price.breakdown.experiences.map(exp => (
                    <div key={exp.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{exp.name}</span>
                      <span className="font-medium">
                        {formatCurrency(parseFloat(exp.price))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3">
                {/* Hotel */}
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">
                    {price.breakdown.hotel_tier.name}
                  </span>
                  <span className="font-medium text-blue-600">
                    ×{price.breakdown.hotel_tier.price_multiplier}
                  </span>
                </div>

                {/* Transport */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {price.breakdown.transport.name}
                  </span>
                  <span className="font-medium">
                    {formatCurrency(parseFloat(price.breakdown.transport.price))}
                  </span>
                </div>
              </div>

              {/* Subtotal */}
              {price.breakdown.subtotal_after_hotel && (
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="text-gray-900">
                      {formatCurrency(parseFloat(price.breakdown.subtotal_after_hotel))}
                    </span>
                  </div>
                </div>
              )}

              {/* Applied Rules (Taxes & Charges) */}
              {price.breakdown.applied_rules && price.breakdown.applied_rules.length > 0 && (
                <div className="space-y-1 pl-4 border-l-2 border-orange-200">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">
                    Taxes & Charges
                  </div>
                  {price.breakdown.applied_rules.map((rule, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {rule.type === 'MARKUP' ? '+' : '-'} {rule.name}
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
            </div>

            {/* Total */}
            <div className="border-t-2 border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-semibold text-gray-900">
                  Total Payable
                </span>
                <span className="text-3xl font-bold text-orange-600">
                  {formatCurrency(parseFloat(price.total_price))}
                </span>
              </div>

              {/* Badges */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                  <Users className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">
                    Price is per person
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    All taxes included • No hidden charges
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center">{price.pricing_note}</p>
            </div>

            {/* Book Now Button */}
            <button
              className={cn(
                sacredStyles.button.primary,
                "w-full flex items-center justify-center gap-2"
              )}
              onClick={handleBookNow}
              disabled={status === 'loading' || redirecting}
            >
              {redirecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Redirecting...
                </>
              ) : status === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Book Now
                </>
              )}
            </button>

            {/* Helper text for unauthenticated users */}
            {status === 'unauthenticated' && (
              <p className="text-xs text-center text-gray-500">
                You&apos;ll be asked to sign in to complete your booking
              </p>
            )}

            {/* Additional Info */}
            <div className="text-xs text-gray-500 text-center space-y-1">
              <p>✓ Secure payment</p>
              <p>✓ Instant confirmation</p>
              <p>✓ 24/7 customer support</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
