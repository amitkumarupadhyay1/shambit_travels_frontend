import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContactForm from '@/components/contact/ContactForm';
import { cn, sacredStyles } from '@/lib/utils';
import { getPageWrapper, getPageContent, getSection } from '@/lib/spacing';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | Get in Touch - ShamBit',
  description: 'Have questions about your spiritual journey? Contact ShamBit for personalized assistance, booking inquiries, and travel support.',
  keywords: 'contact shambit, travel inquiry, booking support, customer service',
};

export default function ContactPage() {
  return (
    <div className={getPageWrapper()}>
      <Header />
      <main className={getPageContent({ className: 'bg-gradient-to-b from-orange-50/30 to-white' })}>
        <div className={getSection({ spacing: 'large', padding: true })}>
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className={cn(sacredStyles.heading.h1, 'mb-6')}>
              Get in <span className="sacred-gradient-text">Touch</span>
            </h1>
            <p className={cn(sacredStyles.text.body, 'text-gray-700 text-lg')}>
              Have questions about your spiritual journey? We&apos;re here to help you plan the
              perfect pilgrimage experience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <div className={sacredStyles.card}>
                <h2 className={cn(sacredStyles.heading.h3, 'mb-6')}>Contact Information</h2>

                <div className="space-y-6">
                  <ContactInfo
                    icon={<Mail className="w-5 h-5" />}
                    title="Email"
                    content="support@shambit.com"
                    href="mailto:support@shambit.com"
                  />

                  <ContactInfo
                    icon={<Phone className="w-5 h-5" />}
                    title="Phone"
                    content="+91 9005457111"
                    href="tel:+919005457111"
                  />

                  <ContactInfo
                    icon={<MessageCircle className="w-5 h-5" />}
                    title="WhatsApp"
                    content="+91 9005457111"
                    href="https://wa.me/919005457111"
                  />

                  <ContactInfo
                    icon={<MapPin className="w-5 h-5" />}
                    title="Location"
                    content="Ayodhya, Uttar Pradesh, India"
                  />

                  <ContactInfo
                    icon={<Clock className="w-5 h-5" />}
                    title="Business Hours"
                    content="Mon - Sat: 9:00 AM - 6:00 PM IST"
                  />
                </div>
              </div>

              {/* Quick Links */}
              <div className={sacredStyles.card}>
                <h3 className={cn(sacredStyles.heading.h4, 'mb-4')}>Quick Links</h3>
                <div className="space-y-3">
                  <QuickLink href="/packages" text="Browse Packages" />
                  <QuickLink href="/destinations" text="Explore Destinations" />
                  <QuickLink href="/articles" text="Travel Guides" />
                  <QuickLink href="/about" text="About Us" />
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className={sacredStyles.card}>
                <h2 className={cn(sacredStyles.heading.h3, 'mb-6')}>Send Us a Message</h2>
                <ContactForm />
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className={cn(sacredStyles.card, 'max-w-4xl mx-auto')}>
            <h2 className={cn(sacredStyles.heading.h2, 'mb-8 text-center')}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <FAQItem
                question="How do I book a package?"
                answer="Browse our packages, select your preferred one, customize it with experiences and accommodations, and proceed to booking. Our team will contact you within 24 hours to confirm details."
              />
              <FAQItem
                question="Can I customize my package?"
                answer="Absolutely! All our packages are fully customizable. You can choose your experiences, hotel tier, transport options, and travel dates to create your perfect journey."
              />
              <FAQItem
                question="What is your cancellation policy?"
                answer="We offer flexible cancellation policies. Please refer to our terms and conditions or contact us for specific details about your booking."
              />
              <FAQItem
                question="Do you provide tour guides?"
                answer="Yes, all our packages include experienced local guides who are knowledgeable about the spiritual and cultural significance of each destination."
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

interface ContactInfoProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  href?: string;
}

function ContactInfo({ icon, title, content, href }: ContactInfoProps) {
  const Content = (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{content}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="block hover:bg-orange-50 -mx-4 px-4 py-2 rounded-lg transition-colors"
      >
        {Content}
      </a>
    );
  }

  return <div className="-mx-4 px-4 py-2">{Content}</div>;
}

interface QuickLinkProps {
  href: string;
  text: string;
}

function QuickLink({ href, text }: QuickLinkProps) {
  return (
    <a
      href={href}
      className="block text-gray-700 hover:text-orange-600 hover:translate-x-1 transition-all duration-200"
    >
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span>{text}</span>
      </div>
    </a>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
      <h3 className="font-semibold text-gray-900 mb-2">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  );
}
