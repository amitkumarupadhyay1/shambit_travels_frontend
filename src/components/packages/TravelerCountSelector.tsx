'use client';

import { useState } from 'react';
import { cn, sacredStyles } from '@/lib/utils';
import { Users, Plus, Minus, Info } from 'lucide-react';

interface TravelerCountSelectorProps {
  onCountChange: (count: number) => void;
  initialCount?: number;
  minCount?: number;
  maxCount?: number;
}

export default function TravelerCountSelector({
  onCountChange,
  initialCount = 1,
  minCount = 1,
  maxCount = 20,
}: TravelerCountSelectorProps) {
  const [count, setCount] = useState(initialCount);

  const handleIncrement = () => {
    if (count < maxCount) {
      const newCount = count + 1;
      setCount(newCount);
      onCountChange(newCount);
    }
  };

  const handleDecrement = () => {
    if (count > minCount) {
      const newCount = count - 1;
      setCount(newCount);
      onCountChange(newCount);
    }
  };

  const handleInputChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= minCount && num <= maxCount) {
      setCount(num);
      onCountChange(num);
    }
  };

  return (
    <div className={sacredStyles.card}>
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-orange-600" />
        <h2 className={sacredStyles.heading.h3}>
          Number of Travelers
        </h2>
      </div>

      {/* Info Box */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">
              Group Size
            </p>
            <p className="text-blue-700">
              Select the total number of people traveling. This helps us recommend the right number of rooms and calculate accurate pricing.
            </p>
          </div>
        </div>
      </div>

      {/* Counter */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">Total Travelers</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={count <= minCount}
            className={cn(
              "w-10 h-10 rounded-lg border-2 flex items-center justify-center",
              "transition-all duration-200",
              count <= minCount
                ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                : "border-orange-300 bg-white text-orange-600 hover:bg-orange-50 hover:border-orange-500"
            )}
            aria-label="Decrease traveler count"
          >
            <Minus className="w-5 h-5" />
          </button>

          <input
            type="number"
            value={count}
            onChange={(e) => handleInputChange(e.target.value)}
            min={minCount}
            max={maxCount}
            className={cn(
              "w-16 text-center text-lg font-semibold",
              "border-2 border-gray-200 rounded-lg py-2",
              "focus:border-orange-500 focus:ring-2 focus:ring-orange-200",
              "transition-all duration-200"
            )}
            aria-label="Number of travelers"
          />

          <button
            type="button"
            onClick={handleIncrement}
            disabled={count >= maxCount}
            className={cn(
              "w-10 h-10 rounded-lg border-2 flex items-center justify-center",
              "transition-all duration-200",
              count >= maxCount
                ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                : "border-orange-300 bg-white text-orange-600 hover:bg-orange-50 hover:border-orange-500"
            )}
            aria-label="Increase traveler count"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Count Display */}
      <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
        <p className="text-sm text-orange-900 text-center">
          <span className="font-semibold">{count} traveler{count > 1 ? 's' : ''}</span> selected
        </p>
      </div>

      {/* Limits Info */}
      {(count === minCount || count === maxCount) && (
        <div className="mt-3 text-xs text-gray-500 text-center">
          {count === minCount && `Minimum ${minCount} traveler required`}
          {count === maxCount && `Maximum ${maxCount} travelers allowed`}
        </div>
      )}
    </div>
  );
}
