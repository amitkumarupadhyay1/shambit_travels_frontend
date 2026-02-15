import { Metadata } from 'next';
import { Suspense } from 'react';
import DestinationsListingClient from '@/components/destinations/DestinationsListingClient';
import { SkeletonGrid } from '@/components/common/SkeletonCard';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Destinations | Explore Sacred Cities of India - ShamBit',
  description: 'Discover spiritual destinations across India. From Ayodhya to Varanasi, explore sacred cities with rich cultural heritage and divine experiences.',
  keywords: 'spiritual destinations, sacred cities India, pilgrimage sites, Ayodhya, Varanasi, Haridwar, Rishikesh',
};

export default function DestinationsPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<SkeletonGrid count={8} />}>
        <DestinationsListingClient />
      </Suspense>
    </ErrorBoundary>
  );
}
