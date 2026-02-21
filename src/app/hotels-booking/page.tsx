import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ComingSoon from '@/components/common/ComingSoon';
import { Hotel } from 'lucide-react';
import { getPageWrapper, getPageContent, getSection } from '@/lib/spacing';

export const metadata: Metadata = {
  title: 'Hotel Booking - Coming Soon | ShamBit',
  description: 'Book hotels near sacred destinations across India. Our hotel booking service is launching soon with exclusive deals and spiritual accommodations.',
};

export default function HotelsBookingPage() {
  return (
    <div className={getPageWrapper()}>
      <Header />
      <main className={getPageContent({ className: 'bg-gradient-to-b from-orange-50/30 to-white' })}>
        <div className={getSection({ spacing: 'large', padding: true })}>
          <ComingSoon
            icon={<Hotel className="w-12 h-12 text-white" />}
            title="Hotel Booking Coming Soon"
            description="We're working on bringing you the best hotel booking experience with handpicked accommodations near sacred sites, exclusive deals, and seamless reservations."
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
