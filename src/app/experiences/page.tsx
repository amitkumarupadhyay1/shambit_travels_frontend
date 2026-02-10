import { Metadata } from 'next';
import { Suspense } from 'react';
import ExperiencesListingClient from '@/components/experiences/ExperiencesListingClient';
import { SkeletonGrid } from '@/components/common/SkeletonCard';

export const metadata: Metadata = {
  title: 'Browse Experiences | ShamBit',
  description: 'Explore our curated collection of spiritual and cultural experiences across India. From temple visits to cultural immersions.',
};

export default function ExperiencesPage() {
  return (
    <Suspense fallback={<SkeletonGrid count={6} />}>
      <ExperiencesListingClient />
    </Suspense>
  );
}
