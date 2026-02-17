import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { apiService } from '@/lib/api';
import BookingConfirmationClient from '@/components/bookings/BookingConfirmationClient';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface BookingConfirmationPageProps {
  params: Promise<{ reference: string }>;
}

export async function generateMetadata({ params }: BookingConfirmationPageProps): Promise<Metadata> {
  const { reference } = await params;
  return {
    title: `Booking Confirmation - ${reference} | ShamBit`,
    description: 'Your booking has been confirmed. Thank you for choosing ShamBit!',
  };
}

export default async function BookingConfirmationPage({ params }: BookingConfirmationPageProps) {
  // Check authentication
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  const { reference } = await params;
  
  // Try to parse as booking ID (for backward compatibility)
  const bookingId = parseInt(reference, 10);

  if (isNaN(bookingId)) {
    notFound();
  }

  // Fetch booking details
  let booking;
  try {
    booking = await apiService.getBooking(bookingId);
  } catch (error) {
    console.error('Failed to fetch booking:', error);
    notFound();
  }

  // Check if booking belongs to current user
  if (booking.user_email !== session.user?.email) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      <Header />
      <div className="pt-[120px] md:pt-[140px] pb-24">
        <BookingConfirmationClient booking={booking} />
      </div>
      <Footer />
    </main>
  );
}
