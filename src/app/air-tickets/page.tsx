import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ComingSoon from '@/components/common/ComingSoon';
import { Plane } from 'lucide-react';
import { sacredStyles } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Flight Booking - Coming Soon | ShamBit',
  description: 'Book flights to spiritual destinations across India. Our flight booking service is launching soon with competitive prices and convenient schedules.',
};

export default function AirTicketsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      <Header />
      <div className="pt-[120px] md:pt-[140px]">
        <div className={sacredStyles.container}>
          <ComingSoon
            icon={<Plane className="w-12 h-12 text-white" />}
            title="Flight Booking Coming Soon"
            description="Reach your spiritual destination faster. We're launching a comprehensive flight booking service with the best deals, flexible options, and hassle-free reservations."
            estimatedLaunch="Q2 2026"
            relatedLinks={[
              { href: '/packages', label: 'Browse Packages' },
              { href: '/destinations', label: 'Explore Destinations' },
              { href: '/contact', label: 'Contact Us' },
            ]}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
}
