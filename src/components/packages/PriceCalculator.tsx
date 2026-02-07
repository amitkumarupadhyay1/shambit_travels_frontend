'use client';

import { useState, useEffect } from 'react';
import { PriceCalculation, apiService, Package } from '@/lib/api';
import { cn, sacredStyles, formatCurrency } from '@/lib/utils';
import { Loader2, ShoppingCart, AlertCircle } from 'lucide-react';
import BookingModal from '../bookings/BookingModal';
import { useRouter } from 'next/navigation';

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
  const [price, setPrice] = useState<PriceCalculation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

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
                  Experiences ({price.breakdown.experiences.length})
                </div>
                <div className="space-y-1">
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
                  <span className="font-medium">
                    {price.breakdown.hotel_tier.price_multiplier}x
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
            </div>

            {/* Total */}
            <div className="border-t-2 border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-gray-900">
                  Total Price
                </span>
                <span className="text-3xl font-bold text-orange-600">
                  {formatCurrency(parseFloat(price.total_price))}
                </span>
              </div>
              <p className="text-xs text-gray-500">{price.pricing_note}</p>
            </div>

            {/* Book Now Button */}
            <button
              className={cn(
                sacredStyles.button.primary,
                "w-full flex items-center justify-center gap-2"
              )}
              onClick={() => setShowBookingModal(true)}
            >
              <ShoppingCart className="w-5 h-5" />
              Book Now
            </button>

            {/* Additional Info */}
            <div className="text-xs text-gray-500 text-center">
              <p>✓ Secure payment</p>
              <p>✓ Instant confirmation</p>
              <p>✓ 24/7 customer support</p>
            </div>
          </>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && price && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          packageId={packageData.id}
          packageName={packageData.name}
          selections={{
            experiences: selections.experiences,
            hotel: selections.hotel!,
            transport: selections.transport!,
          }}
          totalPrice={price.total_price}
          onBookingComplete={(booking) => {
            console.log('Booking complete:', booking);
            router.push(`/bookings/${booking.booking_reference}`);
          }}
        />
      )}
    </div>
  );
}
