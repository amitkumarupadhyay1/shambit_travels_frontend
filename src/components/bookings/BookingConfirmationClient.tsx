'use client';

import Link from 'next/link';
import { CheckCircle, Calendar, Users, Mail, Phone, Download, MapPin, Clock, AlertCircle, Package as PackageIcon, Share2 } from 'lucide-react';
import { cn, sacredStyles, formatCurrency } from '@/lib/utils';
import { BookingDetail } from '@/lib/api';
import BookingTimeline from './BookingTimeline';
import toast from 'react-hot-toast';

interface BookingConfirmationClientProps {
  booking: BookingDetail;
}

export default function BookingConfirmationClient({ booking }: BookingConfirmationClientProps) {
  const isConfirmed = booking.status === 'CONFIRMED';
  const isPending = booking.status === 'PENDING_PAYMENT' || booking.status === 'DRAFT';
  
  // ⚠️ SECURITY: ALL prices from backend - NO frontend calculations ⚠️
  const breakdown = booking.price_breakdown;
  const totalAmount = parseFloat(breakdown.total_amount);
  const perPersonPrice = parseFloat(breakdown.per_person_price);

  // WhatsApp share handler
  const handleWhatsAppShare = () => {
    const message = `🕉️ *ShamBit Travel Booking Confirmed!*

📦 *Package:* ${booking.package.name}
📍 *Destination:* ${booking.package.city_name}
📅 *Travel Date:* ${new Date(booking.booking_date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}
👥 *Travelers:* ${booking.num_travelers}
💰 *Amount:* ${formatCurrency(totalAmount)}

🎫 *Booking Reference:* ${booking.booking_reference || `#${booking.id}`}

✨ A Bit of Goodness in Every Deal
🌐 Visit: shambit.com`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp...');
  };
  
  return (
    <div className={cn(sacredStyles.container, "max-w-4xl pt-8")}>
      {/* Success/Status Icon */}
      <div className="text-center mb-8 mt-8">
        {isConfirmed ? (
          <>
            <div className="mb-6">
              <CheckCircle className="w-24 h-24 text-green-600 mx-auto animate-bounce drop-shadow-lg" />
            </div>
            <h1 className={cn(sacredStyles.heading.h1, "mb-4")}>
              Booking Confirmed!
            </h1>
            <p className={cn(sacredStyles.text.body, "text-lg text-gray-600")}>
              Thank you for booking with ShamBit. Your spiritual journey awaits!
            </p>
          </>
        ) : isPending ? (
          <>
            <div className="mb-6">
              <Clock className="w-24 h-24 text-orange-600 mx-auto" />
            </div>
            <h1 className={cn(sacredStyles.heading.h1, "mb-4")}>
              Payment Pending
            </h1>
            <p className={cn(sacredStyles.text.body, "text-lg text-gray-600")}>
              Your booking is created. Please complete the payment to confirm.
            </p>
          </>
        ) : (
          <>
            <div className="mb-6">
              <AlertCircle className="w-24 h-24 text-gray-600 mx-auto" />
            </div>
            <h1 className={cn(sacredStyles.heading.h1, "mb-4")}>
              Booking {booking.status}
            </h1>
          </>
        )}
      </div>

      {/* Booking Reference */}
      <div className={cn(sacredStyles.card, "mb-8 bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200")}>
        <div className="text-center">
          <p className="text-sm font-medium text-orange-800 mb-2">Booking Reference</p>
          <p className="text-4xl font-bold text-orange-600 tracking-wider">
            {booking.booking_reference || `#${booking.id}`}
          </p>
          <p className="text-sm text-orange-700 mt-2">
            Please save this reference number for your records
          </p>
        </div>
      </div>

      {/* Booking Details */}
      <div className={cn(sacredStyles.card, "mb-8")}>
        <h2 className={cn(sacredStyles.heading.h3, "mb-6")}>
          Booking Details
        </h2>

        {/* Package Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <PackageIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{booking.package.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{booking.package.city_name}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(totalAmount)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(perPersonPrice)} × {booking.num_travelers} traveler{booking.num_travelers > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Travel Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Travel Date</p>
              <p className="text-sm text-gray-900">
                {new Date(booking.booking_date).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Travelers</p>
              <p className="text-sm text-gray-900">{booking.num_travelers} person{booking.num_travelers > 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Email</p>
              <p className="text-sm text-gray-900">{booking.customer_email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Phone</p>
              <p className="text-sm text-gray-900">{booking.customer_phone}</p>
            </div>
          </div>
        </div>

        {/* Selected Experiences */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-medium text-sm text-gray-700 mb-3">Selected Experiences</h4>
          <div className="space-y-2">
            {booking.selected_experiences.map((exp) => (
              <div key={exp.id} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{exp.name}</p>
                  <p className="text-xs text-gray-500">
                    {exp.duration_hours}h • {exp.difficulty_level}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div className={cn(sacredStyles.card, "mb-8")}>
        <h2 className={cn(sacredStyles.heading.h3, "mb-6")}>
          Booking Progress
        </h2>
        
        <BookingTimeline 
          bookingDate={booking.booking_date}
          createdAt={booking.created_at}
          status={booking.status}
        />
      </div>

      {/* What's Next - Additional Info */}
      <div className={cn(sacredStyles.card, "mb-8")}>
        <h2 className={cn(sacredStyles.heading.h3, "mb-6")}>
          What Happens Next?
        </h2>
        
        <div className="space-y-4">
          {isPending && (
            <div className="flex items-start gap-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
              <div>
                <h3 className="font-semibold text-orange-900 mb-1">Complete Payment</h3>
                <p className="text-sm text-orange-800 mb-3">
                  Your booking is not confirmed yet. Please complete the payment to secure your spot.
                </p>
                <Link
                  href={`/checkout/${booking.id}`}
                  className={cn(sacredStyles.button.primary, "inline-flex")}
                >
                  Complete Payment Now
                </Link>
              </div>
            </div>
          )}

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">1</span>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Confirmation Email</h3>
              <p className="text-sm text-gray-600">
                {isConfirmed 
                  ? "A confirmation email has been sent to your registered email address."
                  : "You will receive a confirmation email once payment is completed."
                }
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">2</span>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Travel Documents</h3>
              <p className="text-sm text-gray-600">
                Your travel voucher and itinerary will be sent 48 hours before your journey.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">3</span>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Pre-Travel Support</h3>
              <p className="text-sm text-gray-600">
                Our team will contact you with final details and answer any questions you may have.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Support */}
      <div className={cn(sacredStyles.card, "mb-8")}>
        <h2 className={cn(sacredStyles.heading.h3, "mb-6")}>
          Need Help?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium">Email Support</p>
              <a href="mailto:support@shambit.com" className="text-sm text-orange-600 hover:underline">
                support@shambit.com
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium">Phone Support</p>
              <a href="tel:+911234567890" className="text-sm text-orange-600 hover:underline">
                +91 123 456 7890
              </a>
            </div>
          </div>
        </div>

        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-900">
            <strong>24/7 Support:</strong> Our customer support team is available round the clock to assist you with any questions or concerns.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Link
          href="/dashboard/bookings"
          className={cn(sacredStyles.button.secondary, "flex-1 text-center")}
        >
          View All Bookings
        </Link>
        <button
          onClick={handleWhatsAppShare}
          className="flex-1 bg-green-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          Share on WhatsApp
        </button>
        <Link
          href="/packages"
          className={cn(sacredStyles.button.primary, "flex-1 text-center")}
        >
          Browse More Packages
        </Link>
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-gray-50 rounded-lg">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-xs font-medium text-gray-700">Secure Booking</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <p className="text-xs font-medium text-gray-700">Flexible Dates</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <p className="text-xs font-medium text-gray-700">Expert Guides</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <Download className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <p className="text-xs font-medium text-gray-700">Digital Documents</p>
        </div>
      </div>
    </div>
  );
}
