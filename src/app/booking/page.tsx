import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ComingSoon from '@/components/common/ComingSoon';
import { Calendar } from 'lucide-react';
import { getPageWrapper, getPageContent, getSection } from '@/lib/spacing';

export const metadata: Metadata = {
  title: 'Booking Services - Coming Soon | ShamBit',
  description: 'Book hotels, flights, trains, buses, and taxis for your spiritual journey. Our comprehensive booking services are launching soon.',
};

export default function BookingPage() {
  return (
    <div className={getPageWrapper()}>
      <Header />
      <main className={getPageContent({ className: 'bg-gradient-to-b from-orange-50/30 to-white' })}>
        <div className={getSection({ spacing: 'large', padding: true })}>
          <ComingSoon
            icon={<Calendar className="w-12 h-12 text-white" />}
            title="Booking Services Coming Soon"
            description="We're building a comprehensive booking platform for all your travel needs - hotels, flights, trains, buses, and taxis. Everything you need for your spiritual journey in one place."
            estimatedLaunch="Q2 2026"
            relatedLinks={[
              { href: '/packages', label: 'Browse Packages' },
              { href: '/destinations', label: 'Explore Destinations' },
              { href: '/experiences', label: 'View Experiences' },
            ]}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
