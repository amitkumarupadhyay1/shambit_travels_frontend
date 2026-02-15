import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search | ShamBit - Find Packages, Cities, Articles & Experiences',
  description: 'Search for spiritual tour packages, destinations, travel guides, and experiences across India. Find packages in Ayodhya, Mumbai, Delhi, and more.',
  keywords: 'search, tour packages, spiritual tours, india travel, destinations, travel guides',
  robots: 'noindex, follow', // Don't index search results pages
  openGraph: {
    title: 'Search | ShamBit',
    description: 'Find spiritual tour packages, destinations, and travel experiences',
    type: 'website',
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
