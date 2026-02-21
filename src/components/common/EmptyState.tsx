import React from 'react';
import Link from 'next/link';
import {
  NoBookingsIllustration,
  NoSearchResultsIllustration,
  NoTravelersIllustration,
  NotFoundIllustration,
  ErrorStateIllustration,
  NoDataIllustration,
  LoadingIllustration,
} from './EmptyStateIllustrations';

export type EmptyStateVariant =
  | 'no-bookings'
  | 'no-search-results'
  | 'no-travelers'
  | 'not-found'
  | 'error'
  | 'no-data'
  | 'loading'
  | 'custom';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const illustrationMap = {
  'no-bookings': NoBookingsIllustration,
  'no-search-results': NoSearchResultsIllustration,
  'no-travelers': NoTravelersIllustration,
  'not-found': NotFoundIllustration,
  'error': ErrorStateIllustration,
  'no-data': NoDataIllustration,
  'loading': LoadingIllustration,
};

export function EmptyState({
  variant = 'custom',
  icon,
  title,
  description,
  action,
  secondaryAction,
  className = '',
  size = 'md',
}: EmptyStateProps) {
  const Illustration = variant !== 'custom' ? illustrationMap[variant] : null;

  const sizeClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
  };

  const illustrationSizes = {
    sm: 'w-32 h-24',
    md: 'w-48 h-36',
    lg: 'w-64 h-48',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  const descriptionSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={`text-center ${sizeClasses[size]} ${className}`}>
      {/* Illustration or Icon */}
      <div className={`mx-auto ${illustrationSizes[size]} mb-6`}>
        {Illustration ? (
          <Illustration />
        ) : icon ? (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            {icon}
          </div>
        ) : null}
      </div>

      {/* Title */}
      <h3 className={`${titleSizes[size]} font-semibold text-gray-900 mb-2`}>
        {title}
      </h3>

      {/* Description */}
      <p className={`${descriptionSizes[size]} text-gray-600 mb-6 max-w-md mx-auto`}>
        {description}
      </p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          {action && (
            action.href ? (
              <Link
                href={action.href}
                className="px-6 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors inline-flex items-center"
              >
                {action.label}
              </Link>
            ) : (
              <button
                onClick={action.onClick}
                className="px-6 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
              >
                {action.label}
              </button>
            )
          )}
          {secondaryAction && (
            secondaryAction.href ? (
              <Link
                href={secondaryAction.href}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center"
              >
                {secondaryAction.label}
              </Link>
            ) : (
              <button
                onClick={secondaryAction.onClick}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                {secondaryAction.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

// Convenience components for common use cases
export function NoBookingsState({ action }: { action?: EmptyStateProps['action'] }) {
  return (
    <EmptyState
      variant="no-bookings"
      title="No bookings yet"
      description="You haven't made any bookings yet. Start your spiritual journey today!"
      action={action || { label: 'Explore Packages', href: '/packages' }}
    />
  );
}

export function NoSearchResultsState({ query, onReset }: { query?: string; onReset?: () => void }) {
  return (
    <EmptyState
      variant="no-search-results"
      title="No results found"
      description={
        query
          ? `We couldn't find any results for "${query}". Try adjusting your search or filters.`
          : "We couldn't find any results matching your criteria. Try adjusting your filters."
      }
      action={onReset ? { label: 'Clear Filters', onClick: onReset } : undefined}
    />
  );
}

export function NoTravelersState({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      variant="no-travelers"
      title="No saved travelers"
      description="Save traveler information for faster bookings in the future."
      action={onAdd ? { label: 'Add Traveler', onClick: onAdd } : undefined}
      size="sm"
    />
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <EmptyState
      variant="error"
      title="Something went wrong"
      description={message || "We encountered an error while loading this content. Please try again."}
      action={onRetry ? { label: 'Try Again', onClick: onRetry } : undefined}
      secondaryAction={{ label: 'Go Home', href: '/' }}
    />
  );
}
