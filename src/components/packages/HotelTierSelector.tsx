'use client';

import { HotelTier } from '@/lib/api';
import { cn, sacredStyles } from '@/lib/utils';
import { Building2 } from 'lucide-react';

interface HotelTierSelectorProps {
  hotelTiers: HotelTier[];
  selected: number | null;
  onChange: (id: number) => void;
}

export default function HotelTierSelector({
  hotelTiers,
  selected,
  onChange,
}: HotelTierSelectorProps) {
  return (
    <div className={sacredStyles.card}>
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="w-6 h-6 text-orange-600" />
        <h2 className={sacredStyles.heading.h3}>
          Choose Hotel Tier
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hotelTiers.map(tier => (
          <button
            key={tier.id}
            onClick={() => onChange(tier.id)}
            className={cn(
              "relative p-4 rounded-xl border-2 transition-all duration-200 text-left",
              "hover:shadow-md",
              selected === tier.id
                ? "border-orange-600 bg-orange-50/50"
                : "border-gray-200 bg-white hover:border-orange-300"
            )}
          >
            {/* Radio indicator */}
            <div
              className={cn(
                "absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                selected === tier.id
                  ? "border-orange-600"
                  : "border-gray-300"
              )}
            >
              {selected === tier.id && (
                <div className="w-3 h-3 rounded-full bg-orange-600" />
              )}
            </div>

            <div className="pr-8">
              <h3 className="font-semibold text-lg text-slate-900 mb-2">
                {tier.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {tier.description}
              </p>
              {/* PHASE 1: Show actual price per night if available */}
              {tier.base_price_per_night ? (
                <div className="text-sm font-medium text-orange-600">
                  ₹{Number(tier.base_price_per_night).toLocaleString('en-IN')}/night
                </div>
              ) : (
                <div className="text-sm font-medium text-orange-600">
                  {tier.price_multiplier}x multiplier
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {hotelTiers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hotel tiers available for this package.
        </div>
      )}
    </div>
  );
}
