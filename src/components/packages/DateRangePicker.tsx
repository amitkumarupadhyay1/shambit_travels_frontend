'use client';

import { useState, useEffect, useMemo } from 'react';
import { cn, sacredStyles } from '@/lib/utils';
import { Calendar, Info } from 'lucide-react';

interface DateRangePickerProps {
  startDate: string | null;
  endDate: string | null;
  recommendedNights?: number;
  minDate?: string;
  onChange: (startDate: string, endDate: string, numNights: number) => void;
  disabled?: boolean;
}

export default function DateRangePicker({
  startDate,
  endDate,
  recommendedNights = 1,
  minDate,
  onChange,
  disabled = false,
}: DateRangePickerProps) {
  const [localStartDate, setLocalStartDate] = useState(startDate || '');
  const [localEndDate, setLocalEndDate] = useState(endDate || '');

  // Calculate minimum booking date (3 days from now)
  const getMinDate = () => {
    if (minDate) return minDate;
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0];
  };

  const minBookingDate = getMinDate();

  // Calculate number of nights using useMemo instead of useEffect
  const numNights = useMemo(() => {
    if (localStartDate && localEndDate) {
      const start = new Date(localStartDate);
      const end = new Date(localEndDate);
      return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    }
    return 1;
  }, [localStartDate, localEndDate]);

  // Call onChange when dates or nights change
  useEffect(() => {
    if (localStartDate && localEndDate && numNights > 0) {
      onChange(localStartDate, localEndDate, numNights);
    }
  }, [localStartDate, localEndDate, numNights, onChange]);

  // Auto-set end date when start date changes
  const handleStartDateChange = (newStartDate: string) => {
    setLocalStartDate(newStartDate);
    
    // Auto-calculate end date based on recommended nights
    if (newStartDate && !localEndDate) {
      const start = new Date(newStartDate);
      start.setDate(start.getDate() + recommendedNights);
      const autoEndDate = start.toISOString().split('T')[0];
      setLocalEndDate(autoEndDate);
    }
    
    // Validate end date is after start date
    if (newStartDate && localEndDate) {
      const start = new Date(newStartDate);
      const end = new Date(localEndDate);
      if (end <= start) {
        // Auto-adjust end date
        start.setDate(start.getDate() + 1);
        setLocalEndDate(start.toISOString().split('T')[0]);
      }
    }
  };

  const handleEndDateChange = (newEndDate: string) => {
    setLocalEndDate(newEndDate);
    
    // Validate end date is after start date
    if (localStartDate && newEndDate) {
      const start = new Date(localStartDate);
      const end = new Date(newEndDate);
      if (end <= start) {
        // Show error or auto-adjust
        const adjustedEnd = new Date(start);
        adjustedEnd.setDate(adjustedEnd.getDate() + 1);
        setLocalEndDate(adjustedEnd.toISOString().split('T')[0]);
      }
    }
  };

  // Get minimum end date (start date + 1 day)
  const getMinEndDate = () => {
    if (!localStartDate) return minBookingDate;
    const start = new Date(localStartDate);
    start.setDate(start.getDate() + 1);
    return start.toISOString().split('T')[0];
  };

  return (
    <div className={sacredStyles.card}>
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-orange-600" />
        <h2 className={sacredStyles.heading.h3}>
          Select Travel Dates
        </h2>
      </div>

      {/* Recommended Duration Info */}
      {recommendedNights > 1 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Recommended Duration</p>
            <p className="mt-1">
              Based on your selected experiences, we recommend {recommendedNights} {recommendedNights === 1 ? 'night' : 'nights'} for this trip.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={localStartDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            min={minBookingDate}
            disabled={disabled}
            className={cn(
              "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500",
              disabled ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
            )}
          />
          <p className="text-xs text-gray-500 mt-1">
            Bookings must be made at least 3 days in advance
          </p>
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={localEndDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            min={getMinEndDate()}
            disabled={disabled || !localStartDate}
            className={cn(
              "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500",
              disabled || !localStartDate ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
            )}
          />
          <p className="text-xs text-gray-500 mt-1">
            {!localStartDate ? 'Select start date first' : 'Must be after start date'}
          </p>
        </div>
      </div>

      {/* Duration Summary */}
      {localStartDate && localEndDate && numNights > 0 && (
        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Trip Duration</p>
              <p className="text-lg font-bold text-orange-600">
                {numNights} {numNights === 1 ? 'Night' : 'Nights'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">
                {new Date(localStartDate).toLocaleDateString('en-IN', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
              <p className="text-xs text-gray-400">to</p>
              <p className="text-xs text-gray-600">
                {new Date(localEndDate).toLocaleDateString('en-IN', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
