'use client';

import { useMemo, useEffect } from 'react';
import { Experience } from '@/lib/api';
import { Clock, Calendar } from 'lucide-react';

interface TripDuration {
  recommendedDays: number;
  recommendedNights: number;
  totalActivityHours: number;
  reasoning: string;
}

interface TripDurationCalculatorProps {
  experiences: Experience[];
  onDurationCalculated?: (duration: TripDuration) => void;
}

export function calculateTripDuration(experiences: Experience[]): TripDuration {
  if (!experiences || experiences.length === 0) {
    return {
      recommendedDays: 1,
      recommendedNights: 1,
      totalActivityHours: 0,
      reasoning: 'Select experiences to get duration recommendation',
    };
  }

  // Sum up all experience durations
  const totalHours = experiences.reduce((sum, exp) => {
    const hours = Number(exp.duration_hours) || 0;
    return sum + hours;
  }, 0);

  // Assume 8 hours of activities per day (accounting for travel, meals, rest)
  const hoursPerDay = 8;
  const daysNeeded = Math.ceil(totalHours / hoursPerDay);
  
  // At least 1 night, typically days - 1
  // If total hours is very high, might need extra buffer day
  const bufferDay = totalHours > 24 ? 1 : 0;
  const finalDays = daysNeeded + bufferDay;
  const finalNights = Math.max(1, finalDays - 1);

  return {
    recommendedDays: finalDays,
    recommendedNights: finalNights,
    totalActivityHours: totalHours,
    reasoning: `Based on ${totalHours.toFixed(1)} hours of activities across ${experiences.length} experience${experiences.length > 1 ? 's' : ''}, we recommend ${finalDays} day${finalDays > 1 ? 's' : ''} and ${finalNights} night${finalNights > 1 ? 's' : ''} for a comfortable pace.`,
  };
}

export default function TripDurationCalculator({
  experiences,
  onDurationCalculated,
}: TripDurationCalculatorProps) {
  const duration = useMemo(() => {
    return calculateTripDuration(experiences);
  }, [experiences]);

  // Call the callback in useEffect to avoid setState during render
  useEffect(() => {
    if (onDurationCalculated) {
      onDurationCalculated(duration);
    }
  }, [duration, onDurationCalculated]);

  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            Recommended Trip Duration
          </h3>
          <p className="text-sm text-gray-700 mb-3">
            {duration.reasoning}
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-gray-600">Days</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {duration.recommendedDays}
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-gray-600">Nights</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {duration.recommendedNights}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Total Activity Time:</span>
              <span className="font-medium">{duration.totalActivityHours.toFixed(1)} hours</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
              <span>Selected Experiences:</span>
              <span className="font-medium">{experiences.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
