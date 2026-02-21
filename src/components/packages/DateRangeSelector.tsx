'use client';

import { useState, useEffect, useMemo } from 'react';
import { cn, sacredStyles } from '@/lib/utils';
import { Calendar, Info } from 'lucide-react';

interface DateRangeSelectorProps {
  recommendedNights: number;
  onDatesChange: (startDate: string | null, endDate: string | null, nights: number) => void;
  minDate?: string;
}

export default function DateRangeSelector({
  recommendedNights,
  onDatesChange,
  minDate,
}: DateRangeSelectorProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const minimumDate = minDate || today;

  // Calculate nights between dates
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        onDatesChange(startDate, endDate, diffDays);
      } else {
        onDatesChange(null, null, 0);
      }
    } else {
      onDatesChange(null, null, 0);
    }
  }, [startDate, endDate, onDatesChange]);

  // Calculate nights for display
  const calculatedNights = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  }, [startDate, endDate]);

  // Auto-calculate end date when start date changes
  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    
    // Auto-set end date based on recommended nights
    if (date && recommendedNights > 0) {
      const start = new Date(date);
      start.setDate(start.getDate() + recommendedNights);
      const suggestedEndDate = start.toISOString().split('T')[0];
      setEndDate(suggestedEndDate);
    }
  };

  // Auto-suggest start date as tomorrow if not set and recommended nights exist
  // Only run once when component mounts and recommendedNights is available
  useEffect(() => {
    if (!startDate && recommendedNights > 0) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const suggestedStart = tomorrow.toISOString().split('T')[0];
      
      // Also calculate end date
      const end = new Date(tomorrow);
      end.setDate(end.getDate() + recommendedNights);
      const suggestedEnd = end.toISOString().split('T')[0];
      
      // Use setTimeout to avoid setState in effect
      setTimeout(() => {
        setStartDate(suggestedStart);
        setEndDate(suggestedEnd);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommendedNights]); // Only run when recommendedNights changes

  // Validate end date is after start date
  const handleEndDateChange = (date: string) => {
    if (startDate && date) {
      const start = new Date(startDate);
      const end = new Date(date);
      
      if (end > start) {
        setEndDate(date);
      }
    } else {
      setEndDate(date);
    }
  };

  return (
    <div className={sacredStyles.card}>
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-orange-600" />
        <h2 className={sacredStyles.heading.h3}>
          Select Travel Dates
        </h2>
      </div>

      {/* Recommendation Info */}
      {recommendedNights > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Recommended Duration
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Based on your selected experiences, we recommend {recommendedNights} night{recommendedNights > 1 ? 's' : ''} to fully enjoy your trip.
                {!startDate && ' Dates have been auto-suggested for your convenience.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Date Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date */}
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            min={minimumDate}
            className={cn(
              "w-full px-4 py-3 rounded-lg border-2 border-gray-200",
              "focus:border-orange-500 focus:ring-2 focus:ring-orange-200",
              "transition-all duration-200",
              "text-gray-900"
            )}
            required
          />
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            min={startDate || minimumDate}
            disabled={!startDate}
            className={cn(
              "w-full px-4 py-3 rounded-lg border-2 border-gray-200",
              "focus:border-orange-500 focus:ring-2 focus:ring-orange-200",
              "transition-all duration-200",
              "text-gray-900",
              !startDate && "bg-gray-100 cursor-not-allowed"
            )}
            required
          />
        </div>
      </div>

      {/* Nights Display */}
      {calculatedNights > 0 && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-900">
            <span className="font-semibold">{calculatedNights} night{calculatedNights > 1 ? 's' : ''}</span> selected
            {calculatedNights !== recommendedNights && recommendedNights > 0 && (
              <span className="text-orange-700 ml-2">
                (Recommended: {recommendedNights} night{recommendedNights > 1 ? 's' : ''})
              </span>
            )}
          </p>
        </div>
      )}

      {/* Validation Message */}
      {startDate && endDate && calculatedNights === 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            End date must be after start date
          </p>
        </div>
      )}
    </div>
  );
}
