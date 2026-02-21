import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PackagesListingClient from '@/components/packages/PackagesListingClient';
import { getPageWrapper, getPageContent } from '@/lib/spacing';

export const metadata: Metadata = {
  title: 'Travel Packages - ShamBit',
  description: 'Browse our curated collection of spiritual travel packages across India. Customize your journey with flexible experiences, hotels, and transport options.',
};

export default function PackagesPage() {
  return (
    <div className={getPageWrapper()}>
      <Header />
      <main className={getPageContent({ className: 'bg-gradient-to-b from-orange-50/30 to-white' })}>
        <PackagesListingClient />
      </main>
      <Footer />
    </div>
  );
}
