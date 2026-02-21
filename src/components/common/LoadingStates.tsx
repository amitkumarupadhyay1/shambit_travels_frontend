'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { spinner, dots, pulse, skeletonPulse } from '@/lib/animations';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <motion.div
      variants={spinner}
      animate="animate"
      className={cn(
        'border-2 border-gray-300 border-t-orange-600 rounded-full',
        sizeClasses[size],
        className
      )}
    />
  );
}

interface LoadingDotsProps {
  className?: string;
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn('flex space-x-2', className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          variants={dots}
          animate="animate"
          style={{
            animationDelay: `${i * 0.2}s`,
          }}
          className="w-2 h-2 bg-orange-600 rounded-full"
        />
      ))}
    </div>
  );
}

interface LoadingPulseProps {
  className?: string;
}

export function LoadingPulse({ className }: LoadingPulseProps) {
  return (
    <motion.div
      variants={pulse}
      animate="animate"
      className={cn(
        'w-12 h-12 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-full',
        className
      )}
    />
  );
}

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <motion.div
      variants={skeletonPulse}
      animate="animate"
      className={cn(
        'bg-gray-200',
        variantClasses[variant],
        className
      )}
    />
  );
}

interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

export function LoadingOverlay({ message, className }: LoadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center',
        className
      )}
    >
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center space-y-4 shadow-2xl">
        <LoadingSpinner size="lg" />
        {message && (
          <p className="text-gray-700 font-medium">{message}</p>
        )}
      </div>
    </motion.div>
  );
}

interface ButtonLoadingProps {
  className?: string;
}

export function ButtonLoading({ className }: ButtonLoadingProps) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <LoadingSpinner size="sm" />
      <span>Loading...</span>
    </div>
  );
}
