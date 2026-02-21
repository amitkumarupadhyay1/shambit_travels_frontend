import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ComingSoon from '@/components/common/ComingSoon';
import { Bus } from 'lucide-react';
import { getPageWrapper, getPageContent, getSection } from '@/lib/spacing';

export const metadata: Metadata = {
  title: 'Bus Ticket Booking - Coming Soon | ShamBit',
  description: 'Book bus tickets for your pilgrimage journey. Our bus booking service is launching soon with comfortable options and affordable prices.',
};

export default function BusTicketsPage() {
  return (
    <div className={getPageWrapper()}>
      <Header />
      <main className={getPageContent({ className: 'bg-gradient-to-b from-orange-50/30 to-white' })}>
        <div className={getSection({ spacing: 'large', padding: true })}>
          <ComingSoon
            icon={<Bus className="w-12 h-12 text-white" />}
            title="Bus Ticket Booking Coming Soon"
            description="Travel economically to sacred sites across India. We're developing a bus booking platform with comfortable coaches, multiple routes, and easy reservations."
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
