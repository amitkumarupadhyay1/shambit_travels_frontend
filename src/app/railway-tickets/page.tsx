import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ComingSoon from '@/components/common/ComingSoon';
import { Train } from 'lucide-react';
import { getPageWrapper, getPageContent, getSection } from '@/lib/spacing';

export const metadata: Metadata = {
  title: 'Railway Ticket Booking - Coming Soon | ShamBit',
  description: 'Book railway tickets for your spiritual journey across India. Our railway booking service is launching soon with easy reservations and best prices.',
};

export default function RailwayTicketsPage() {
  return (
    <div className={getPageWrapper()}>
      <Header />
      <main className={getPageContent({ className: 'bg-gradient-to-b from-orange-50/30 to-white' })}>
        <div className={getSection({ spacing: 'large', padding: true })}>
          <ComingSoon
            icon={<Train className="w-12 h-12 text-white" />}
            title="Railway Ticket Booking Coming Soon"
            description="Travel comfortably to sacred destinations across India. We're building a seamless railway ticket booking experience with real-time availability and instant confirmations."
            estimatedLaunch="Q2 2026"
            relatedLinks={[
              { href: '/packages', label: 'Browse Packages' },
              { href: '/destinations', label: 'Explore Destinations' },
              { href: '/contact', label: 'Contact Us' },
            ]}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
