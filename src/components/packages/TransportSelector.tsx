'use client';

import { TransportOption } from '@/lib/api';
import { cn, sacredStyles, formatCurrency } from '@/lib/utils';
import { Bus, Train, Plane } from 'lucide-react';

interface TransportSelectorProps {
  transportOptions: TransportOption[];
  selected: number | null;
  onChange: (id: number) => void;
}

export default function TransportSelector({
  transportOptions,
  selected,
  onChange,
}: TransportSelectorProps) {
  const getTransportIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('bus')) return Bus;
    if (lowerName.includes('train')) return Train;
    if (lowerName.includes('flight') || lowerName.includes('plane')) return Plane;
    return Bus;
  };

  return (
    <div className={sacredStyles.card}>
      <div className="flex items-center gap-3 mb-6">
        <Bus className="w-6 h-6 text-orange-600" />
        <h2 className={sacredStyles.heading.h3}>
          Choose Transport
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {transportOptions.map(transport => {
          const Icon = getTransportIcon(transport.name);
          
          return (
            <button
              key={transport.id}
              onClick={() => onChange(transport.id)}
              className={cn(
                "relative p-4 rounded-xl border-2 transition-all duration-200 text-left",
                "hover:shadow-md",
                selected === transport.id
                  ? "border-orange-600 bg-orange-50/50"
                  : "border-gray-200 bg-white hover:border-orange-300"
              )}
            >
              {/* Radio indicator */}
              <div
                className={cn(
                  "absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  selected === transport.id
                    ? "border-orange-600"
                    : "border-gray-300"
                )}
              >
                {selected === transport.id && (
                  <div className="w-3 h-3 rounded-full bg-orange-600" />
                )}
              </div>

              <div className="pr-8">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-lg text-slate-900">
                    {transport.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {transport.description}
                </p>
                <div className="text-lg font-bold text-orange-600">
                  {formatCurrency(transport.base_price)}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {transportOptions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No transport options available for this package.
        </div>
      )}
    </div>
  );
}
