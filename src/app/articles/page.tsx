import { Metadata } from 'next';
import { Suspense } from 'react';
import ArticlesListingClient from '@/components/articles/ArticlesListingClient';
import { SkeletonGrid } from '@/components/common/SkeletonCard';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Articles & Travel Guides | ShamBit Blog',
  description: 'Read our latest articles, travel guides, and spiritual insights about India\'s sacred destinations. Expert tips for pilgrims and spiritual travelers.',
  keywords: 'travel articles, spiritual guides, India travel blog, pilgrimage tips, sacred destinations',
};

export default function ArticlesPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<SkeletonGrid count={9} />}>
        <ArticlesListingClient />
      </Suspense>
    </ErrorBoundary>
  );
}
