/**
 * EmptyState Demo Component
 * 
 * This component demonstrates all empty state variants in a single page.
 * Use this for visual testing and as a reference for implementation.
 * 
 * To view: Create a route that renders this component
 */

'use client';

import React from 'react';
import {
  EmptyState,
  NoBookingsState,
  NoSearchResultsState,
  NoTravelersState,
  ErrorState,
} from './EmptyState';

export default function EmptyStateDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Empty State Illustrations
          </h1>
          <p className="text-lg text-gray-600">
            All available empty state variants with custom illustrations
          </p>
        </div>

        {/* Grid of Empty States */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 1. No Bookings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="mb-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
              No Bookings
            </div>
            <NoBookingsState />
          </div>

          {/* 2. No Search Results */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="mb-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
              No Search Results
            </div>
            <NoSearchResultsState
              query="Varanasi temples"
              onReset={() => console.log('Clear filters')}
            />
          </div>

          {/* 3. No Travelers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="mb-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
              No Travelers
            </div>
            <NoTravelersState onAdd={() => console.log('Add traveler')} />
          </div>

          {/* 4. Error State */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="mb-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
              Error State
            </div>
            <ErrorState
              message="Failed to load packages. Please check your internet connection."
              onRetry={() => console.log('Retry')}
            />
          </div>

          {/* 5. Not Found */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="mb-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
              Not Found (404)
            </div>
            <EmptyState
              variant="not-found"
              title="Page Not Found"
              description="The page you're looking for doesn't exist or has been moved."
              action={{ label: 'Go Home', onClick: () => console.log('Go home') }}
            />
          </div>

          {/* 6. No Data */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="mb-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
              No Data
            </div>
            <EmptyState
              variant="no-data"
              title="No data available"
              description="There's no data to display at the moment. Try refreshing or come back later."
              action={{ label: 'Refresh', onClick: () => console.log('Refresh') }}
            />
          </div>

          {/* 7. Loading */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="mb-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
              Loading State
            </div>
            <EmptyState
              variant="loading"
              title="Processing..."
              description="Please wait while we process your request."
            />
          </div>

          {/* 8. Custom with Two Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="mb-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
              Two Actions Example
            </div>
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
                onClick: () => console.log('Browse all'),
              }}
            />
          </div>
        </div>

        {/* Size Variations */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Size Variations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Small */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="mb-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
                Small (sm)
              </div>
              <EmptyState
                variant="no-travelers"
                title="No travelers"
                description="Add travelers to continue."
                size="sm"
              />
            </div>

            {/* Medium */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="mb-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
                Medium (md) - Default
              </div>
              <EmptyState
                variant="no-bookings"
                title="No bookings yet"
                description="Start your journey today!"
                size="md"
              />
            </div>

            {/* Large */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
              <div className="mb-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
                Large (lg)
              </div>
              <EmptyState
                variant="not-found"
                title="Page Not Found"
                description="This page doesn't exist."
                size="lg"
              />
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            How to Use
          </h3>
          <div className="space-y-2 text-blue-800">
            <p>1. Import: <code className="bg-blue-100 px-2 py-1 rounded">import {`{ EmptyState }`} from &apos;@/components/common/EmptyState&apos;</code></p>
            <p>2. Use convenience components for common cases: <code className="bg-blue-100 px-2 py-1 rounded">{`<NoBookingsState />`}</code></p>
            <p>3. Or customize with variants: <code className="bg-blue-100 px-2 py-1 rounded">variant=&quot;no-search-results&quot;</code></p>
            <p>4. Add actions: <code className="bg-blue-100 px-2 py-1 rounded">action={`{{ label: "Text", onClick: fn }}`}</code></p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm">
          <p>See <code>EMPTY_STATE_IMPLEMENTATION.md</code> for full documentation</p>
        </div>
      </div>
    </div>
  );
}
