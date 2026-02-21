/**
 * EmptyState Component Examples
 * 
 * This file demonstrates all the empty state variations available.
 * Use these examples as a reference when implementing empty states in your components.
 */

import React from 'react';
import {
  EmptyState,
  NoBookingsState,
  NoSearchResultsState,
  NoTravelersState,
  ErrorState,
} from './EmptyState';
import { Calendar } from 'lucide-react';

// Example 1: No Bookings (using convenience component)
export function NoBookingsExample() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <NoBookingsState />
    </div>
  );
}

// Example 2: No Search Results (using convenience component)
export function NoSearchResultsExample() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <NoSearchResultsState
        query="Varanasi temples"
        onReset={() => console.log('Clear filters')}
      />
    </div>
  );
}

// Example 3: No Travelers (using convenience component)
export function NoTravelersExample() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <NoTravelersState onAdd={() => console.log('Add traveler')} />
    </div>
  );
}

// Example 4: Error State (using convenience component)
export function ErrorStateExample() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <ErrorState
        message="Failed to load packages. Please check your internet connection."
        onRetry={() => console.log('Retry')}
      />
    </div>
  );
}

// Example 5: Custom Empty State with Icon
export function CustomEmptyStateWithIcon() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <EmptyState
        variant="custom"
        icon={<Calendar className="w-full h-full" />}
        title="No upcoming events"
        description="You don't have any events scheduled. Create your first event to get started."
        action={{
          label: 'Create Event',
          onClick: () => console.log('Create event'),
        }}
      />
    </div>
  );
}

// Example 6: Custom Empty State with Illustration
export function CustomEmptyStateWithIllustration() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <EmptyState
        variant="no-data"
        title="No data available"
        description="There's no data to display at the moment. Try refreshing or come back later."
        action={{
          label: 'Refresh',
          onClick: () => console.log('Refresh'),
        }}
      />
    </div>
  );
}

// Example 7: Empty State with Primary and Secondary Actions
export function EmptyStateWithTwoActions() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <EmptyState
        variant="no-search-results"
        title="No packages found"
        description="We couldn't find any packages matching your search criteria."
        action={{
          label: 'Clear Filters',
          onClick: () => console.log('Clear filters'),
        }}
        secondaryAction={{
          label: 'Browse All',
          href: '/packages',
        }}
      />
    </div>
  );
}

// Example 8: Small Size Empty State
export function SmallEmptyState() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <EmptyState
        variant="no-travelers"
        title="No travelers"
        description="Add travelers to continue."
        size="sm"
      />
    </div>
  );
}

// Example 9: Large Size Empty State
export function LargeEmptyState() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
      <EmptyState
        variant="not-found"
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has been moved to a different location."
        action={{
          label: 'Go Home',
          href: '/',
        }}
        size="lg"
      />
    </div>
  );
}

// Example 10: Loading State
export function LoadingEmptyState() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <EmptyState
        variant="loading"
        title="Loading..."
        description="Please wait while we fetch your data."
      />
    </div>
  );
}

/**
 * Usage Guide:
 * 
 * 1. Import the component:
 *    import { EmptyState, NoBookingsState, ErrorState } from '@/components/common/EmptyState';
 * 
 * 2. Use convenience components for common cases:
 *    <NoBookingsState />
 *    <NoSearchResultsState query="search term" onReset={handleReset} />
 *    <NoTravelersState onAdd={handleAdd} />
 *    <ErrorState message="Error message" onRetry={handleRetry} />
 * 
 * 3. Use EmptyState component for custom cases:
 *    <EmptyState
 *      variant="no-data"
 *      title="Custom Title"
 *      description="Custom description"
 *      action={{ label: "Action", onClick: handleClick }}
 *    />
 * 
 * 4. Available variants:
 *    - 'no-bookings': Calendar illustration
 *    - 'no-search-results': Magnifying glass with X
 *    - 'no-travelers': Person with plus sign
 *    - 'not-found': Map with location pin
 *    - 'error': Warning triangle
 *    - 'no-data': Empty folder
 *    - 'loading': Hourglass
 *    - 'custom': Use your own icon
 * 
 * 5. Sizes:
 *    - 'sm': Compact (32px illustration)
 *    - 'md': Default (48px illustration)
 *    - 'lg': Large (64px illustration)
 * 
 * 6. Actions:
 *    - Single action: action={{ label: "Text", onClick: fn }} or action={{ label: "Text", href: "/path" }}
 *    - Two actions: Add secondaryAction prop with same structure
 */
