import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Calendar, Users, Mail, Phone, Download } from 'lucide-react';
import { cn, sacredStyles } from '@/lib/utils';

interface BookingConfirmationPageProps {
  params: {
    reference: string;
  };
}

export async function generateMetadata({ params }: BookingConfirmationPageProps): Promise<Metadata> {
  return {
    title: `Booking Confirmation - ${params.reference} | ShamBit`,
    description: 'Your booking has been confirmed. Thank you for choosing ShamBit!',
  };
}

export default function BookingConfirmationPage({ params }: BookingConfirmationPageProps) {
  const { reference } = params;

  return (
    <main className={cn(sacredStyles.container, "py-24 md:py-32")}>
      <div className="max-w-3xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
          <h1 className={cn(sacredStyles.heading.h1, "mb-4")}>
            Booking Confirmed!
          </h1>
          <p className={cn(sacredStyles.text.body, "text-lg")}>
            Thank you for booking with ShamBit. Your spiritual journey awaits!
          </p>
        </div>

        {/* Booking Reference */}
        <div className={cn(sacredStyles.card, "mb-8")}>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Booking Reference</p>
            <p className="text-3xl font-bold text-orange-600">{reference}</p>
            <p className="text-sm text-gray-500 mt-2">
              Please save this reference number for your records
            </p>
          </div>
        </div>

        {/* What's Next */}
        <div className={cn(sacredStyles.card, "mb-8")}>
          <h2 className={cn(sacredStyles.heading.h3, "mb-6")}>
            What Happens Next?
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Confirmation Email</h3>
                <p className="text-sm text-gray-600">
                  You will receive a confirmation email with all booking details within 5 minutes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Payment Instructions</h3>
                <p className="text-sm text-gray-600">
                  Complete your payment using the link in the confirmation email.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Travel Documents</h3>
                <p className="text-sm text-gray-600">
                  Once payment is confirmed, you will receive your travel documents and itinerary.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Pre-Travel Support</h3>
                <p className="text-sm text-gray-600">
                  Our team will contact you 48 hours before your journey with final details.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className={cn(sacredStyles.card, "mb-8")}>
          <h2 className={cn(sacredStyles.heading.h3, "mb-6")}>
            Need Help?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <a href="mailto:support@shambit.com" className="text-sm text-orange-600 hover:underline">
                  support@shambit.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <a href="tel:+911234567890" className="text-sm text-orange-600 hover:underline">
                  +91 123 456 7890
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-900">
              <strong>24/7 Support:</strong> Our customer support team is available round the clock to assist you with any questions or concerns.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className={cn(sacredStyles.button.secondary, "flex-1 text-center")}
          >
            Back to Home
          </Link>
          <Link
            href="/packages"
            className={cn(sacredStyles.button.primary, "flex-1 text-center")}
          >
            Browse More Packages
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Secure Booking</p>
          </div>
          <div>
            <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Flexible Dates</p>
          </div>
          <div>
            <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Expert Guides</p>
          </div>
          <div>
            <Download className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Digital Documents</p>
          </div>
        </div>
      </div>
    </main>
  );
}
