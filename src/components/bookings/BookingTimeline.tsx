'use client';

import { CheckCircle, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineStage {
  id: string;
  title: string;
  description: string;
  date?: string;
  completed: boolean;
  current: boolean;
}

interface BookingTimelineProps {
  bookingDate: string;
  createdAt: string;
  status: string;
}

export default function BookingTimeline({ bookingDate, createdAt, status }: BookingTimelineProps) {
  const now = new Date();
  const travelDate = new Date(bookingDate);
  const createdDate = new Date(createdAt);
  const documentsDate = new Date(travelDate);
  documentsDate.setHours(documentsDate.getHours() - 48); // 48 hours before travel

  const isConfirmed = status === 'CONFIRMED';
  const isPending = status === 'PENDING_PAYMENT' || status === 'DRAFT';
  const isCancelled = status === 'CANCELLED';
  const isExpired = status === 'EXPIRED';
  const isCompleted = travelDate < now && isConfirmed;

  const stages: TimelineStage[] = [
    {
      id: 'created',
      title: 'Booking Created',
      description: 'Your booking request has been initiated',
      date: createdDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      completed: true,
      current: false
    },
    {
      id: 'confirmed',
      title: 'Payment Confirmed',
      description: isConfirmed 
        ? 'Payment received and booking confirmed' 
        : isPending 
        ? 'Awaiting payment confirmation'
        : isCancelled
        ? 'Booking was cancelled'
        : 'Payment not completed',
      date: isConfirmed ? createdDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : undefined,
      completed: isConfirmed,
      current: isPending && !isCancelled && !isExpired
    },
    {
      id: 'documents',
      title: 'Travel Documents Sent',
      description: now >= documentsDate && isConfirmed
        ? 'Documents have been sent to your email'
        : isConfirmed
        ? 'Documents will be sent 48 hours before travel'
        : 'Documents will be sent after payment confirmation',
      date: now >= documentsDate && isConfirmed ? documentsDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) : undefined,
      completed: now >= documentsDate && isConfirmed,
      current: now < documentsDate && now >= new Date(documentsDate.getTime() - 24 * 60 * 60 * 1000) && isConfirmed
    },
    {
      id: 'journey',
      title: 'Journey Starts',
      description: isCompleted
        ? 'Your journey has been completed'
        : now >= travelDate && isConfirmed
        ? 'Your journey is in progress'
        : isConfirmed
        ? 'Get ready for your spiritual journey'
        : 'Journey will start after confirmation',
      date: travelDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      completed: isCompleted,
      current: now >= travelDate && !isCompleted && isConfirmed
    },
    {
      id: 'completed',
      title: 'Journey Completed',
      description: isCompleted
        ? 'Thank you for traveling with us!'
        : 'Share your experience with us',
      completed: isCompleted,
      current: false
    }
  ];

  // If cancelled or expired, show different timeline
  if (isCancelled || isExpired) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <Circle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-red-900">
              Booking {isCancelled ? 'Cancelled' : 'Expired'}
            </h3>
            <p className="text-sm text-red-700">
              {isCancelled 
                ? 'This booking has been cancelled'
                : 'This booking has expired due to non-payment'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {stages.map((stage, index) => {
        const Icon = stage.completed ? CheckCircle : stage.current ? Clock : Circle;
        const isLast = index === stages.length - 1;

        return (
          <div key={stage.id} className="relative">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="relative flex-shrink-0">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  stage.completed 
                    ? "bg-green-100 ring-4 ring-green-50" 
                    : stage.current
                    ? "bg-orange-100 ring-4 ring-orange-50 animate-pulse"
                    : "bg-gray-100"
                )}>
                  <Icon className={cn(
                    "w-5 h-5",
                    stage.completed 
                      ? "text-green-600" 
                      : stage.current
                      ? "text-orange-600"
                      : "text-gray-400"
                  )} />
                </div>
                
                {/* Connecting Line */}
                {!isLast && (
                  <div className={cn(
                    "absolute left-5 top-10 w-0.5 h-12 -ml-px transition-all duration-300",
                    stage.completed ? "bg-green-300" : "bg-gray-200"
                  )} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <h4 className={cn(
                  "font-semibold mb-1 transition-colors",
                  stage.completed 
                    ? "text-gray-900" 
                    : stage.current
                    ? "text-orange-900"
                    : "text-gray-600"
                )}>
                  {stage.title}
                </h4>
                <p className={cn(
                  "text-sm mb-1",
                  stage.completed 
                    ? "text-gray-600" 
                    : stage.current
                    ? "text-orange-700"
                    : "text-gray-500"
                )}>
                  {stage.description}
                </p>
                {stage.date && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {stage.date}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
