import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PackagesListingClient from '@/components/packages/PackagesListingClient';

export const metadata: Metadata = {
  title: 'Travel Packages - ShamBit',
  description: 'Browse our curated collection of spiritual travel packages across India. Customize your journey with flexible experiences, hotels, and transport options.',
};

export default function PackagesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      <Header />
      <div className="pt-[120px] md:pt-[140px]">
        <PackagesListingClient />
      </div>
      <Footer />
    </main>
  );
}
