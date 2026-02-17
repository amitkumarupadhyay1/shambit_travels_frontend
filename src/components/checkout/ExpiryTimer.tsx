'use client';

import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpiryTimerProps {
  expiresAt: string | null; // ISO date string
  onExpire: () => void;
}

export default function ExpiryTimer({ expiresAt, onExpire }: ExpiryTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    // Initialize with calculated time to avoid setState in effect
    if (!expiresAt) return 0;
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const diff = expiry - now;
    return diff > 0 ? Math.floor(diff / 1000) : 0;
  });
  const [hasExpired, setHasExpired] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const diff = expiry - now;
      
      if (diff <= 0) {
        setHasExpired(true);
        setTimeLeft(0);
        onExpire();
        return 0;
      }
      
      return Math.floor(diff / 1000); // Convert to seconds
    };

    // Update every second
    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (!expiresAt) return null;

  if (hasExpired) {
    return (
      <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3 animate-pulse">
        <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-red-900 text-lg">Booking Expired</p>
          <p className="text-sm text-red-700 mt-1">
            This booking has expired. Redirecting you to start a new booking...
          </p>
        </div>
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft < 300; // Less than 5 minutes
  const isCritical = timeLeft < 120; // Less than 2 minutes

  return (
    <div className={cn(
      "p-4 rounded-lg border-2 transition-all",
      isCritical 
        ? "bg-red-50 border-red-300 animate-pulse" 
        : isUrgent 
        ? "bg-orange-50 border-orange-300" 
        : "bg-blue-50 border-blue-200"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          isCritical 
            ? "bg-red-100" 
            : isUrgent 
            ? "bg-orange-100" 
            : "bg-blue-100"
        )}>
          <Clock className={cn(
            "w-6 h-6",
            isCritical 
              ? "text-red-600" 
              : isUrgent 
              ? "text-orange-600" 
              : "text-blue-600"
          )} />
        </div>
        <div className="flex-1">
          <p className={cn(
            "font-semibold text-sm",
            isCritical 
              ? "text-red-900" 
              : isUrgent 
              ? "text-orange-900" 
              : "text-blue-900"
          )}>
            {isCritical 
              ? "⚠️ Complete payment immediately!" 
              : isUrgent 
              ? "Complete payment soon" 
              : "Time remaining to complete payment"
            }
          </p>
          <p className={cn(
            "text-3xl font-bold tabular-nums",
            isCritical 
              ? "text-red-600" 
              : isUrgent 
              ? "text-orange-600" 
              : "text-blue-600"
          )}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
          {isCritical && (
            <p className="text-xs text-red-700 mt-1 font-medium">
              Your booking will expire and you will need to start over
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
