import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { apiService } from '@/lib/api';
import CheckoutClient from '@/components/checkout/CheckoutClient';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface CheckoutPageProps {
  params: Promise<{ bookingId: string }>;
}

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Checkout - ShamBit',
    description: 'Complete your booking payment',
    robots: 'noindex, nofollow', // Private page
  };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  // Check authentication
  const session = await auth();
  
  if (!session) {
    redirect('/login?returnUrl=/dashboard');
  }

  const { bookingId } = await params;
  const bookingIdNum = parseInt(bookingId, 10);

  if (isNaN(bookingIdNum)) {
    notFound();
  }

  // Fetch booking details
  let booking;
  try {
    booking = await apiService.getBooking(bookingIdNum);
  } catch (error) {
    console.error('Failed to fetch booking:', error);
    notFound();
  }

  // Check if booking belongs to current user
  if (booking.user_email !== session.user?.email) {
    redirect('/dashboard');
  }

  // Check if booking is in correct status
  if (booking.status !== 'DRAFT' && booking.status !== 'PENDING_PAYMENT') {
    redirect(`/bookings/${bookingId}`);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      <Header />
      <div className="pt-[120px] md:pt-[140px] pb-24">
        <CheckoutClient booking={booking} />
      </div>
      <Footer />
    </main>
  );
}
