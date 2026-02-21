import Link from 'next/link';
import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cn, sacredStyles } from '@/lib/utils';
import { getPageWrapper, getPageContent, getSection } from '@/lib/spacing';
import { Heart, Users, Globe, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | ShamBit - Your Spiritual Travel Companion',
  description: 'Learn about ShamBit, your trusted partner for spiritual journeys across India. Discover our mission, values, and commitment to authentic travel experiences.',
  keywords: 'about shambit, spiritual travel company, pilgrimage tours India, travel mission',
};

export default function AboutPage() {
  return (
    <div className={getPageWrapper()}>
      <Header />
      <main className={getPageContent({ className: 'bg-gradient-to-b from-orange-50/30 to-white' })}>
        <div className={getSection({ spacing: 'large', padding: true })}>
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className={cn(sacredStyles.heading.h1, 'mb-6')}>
              About <span className="sacred-gradient-text">ShamBit</span>
            </h1>
            <p className={cn(sacredStyles.text.body, 'text-gray-700 text-lg')}>
              Your trusted companion for spiritual journeys across India&apos;s most sacred
              destinations. We craft meaningful travel experiences that connect you with
              India&apos;s rich cultural and spiritual heritage.
            </p>
          </div>

          {/* Mission Section */}
          <div className={cn(sacredStyles.card, 'mb-12')}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className={cn(sacredStyles.heading.h2, 'mb-4')}>Our Mission</h2>
            </div>
            <p className={cn(sacredStyles.text.body, 'text-center max-w-3xl mx-auto')}>
              At ShamBit, we believe that travel is more than just visiting places—it&apos;s about
              experiencing transformation, connecting with ancient wisdom, and discovering the
              divine within. Our mission is to make spiritual travel accessible, authentic, and
              deeply meaningful for every seeker.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <ValueCard
              icon={<Users className="w-8 h-8" />}
              title="Authentic Experiences"
              description="We curate genuine spiritual experiences that honor local traditions and provide deep cultural immersion."
            />
            <ValueCard
              icon={<Globe className="w-8 h-8" />}
              title="Sustainable Travel"
              description="We&apos;re committed to responsible tourism that respects local communities and preserves sacred sites for future generations."
            />
            <ValueCard
              icon={<Award className="w-8 h-8" />}
              title="Expert Guidance"
              description="Our team of experienced guides and local experts ensure you get the most meaningful and safe travel experience."
            />
          </div>

          {/* Story Section */}
          <div className={cn(sacredStyles.card, 'mb-12')}>
            <h2 className={cn(sacredStyles.heading.h2, 'mb-6 text-center')}>Our Story</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              <p className={sacredStyles.text.body}>
                ShamBit was born from a deep love for India&apos;s spiritual heritage and a desire to
                share its transformative power with the world. Founded in Ayodhya, the sacred
                birthplace of Lord Ram, we understand the profound impact that spiritual travel
                can have on one&apos;s life.
              </p>
              <p className={sacredStyles.text.body}>
                What started as a small initiative to help pilgrims explore Ayodhya has grown
                into a comprehensive platform offering curated spiritual journeys across India&apos;s
                most revered destinations—from the ghats of Varanasi to the temples of South
                India, from the Himalayan ashrams to the coastal shrines.
              </p>
              <p className={sacredStyles.text.body}>
                Today, we&apos;re proud to serve thousands of travelers seeking authentic spiritual
                experiences, helping them create memories that last a lifetime and connections
                that transcend the physical journey.
              </p>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 md:p-12">
            <h2 className={cn(sacredStyles.heading.h2, 'mb-8 text-center')}>
              Why Choose ShamBit?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Feature text="Customizable packages tailored to your spiritual needs" />
              <Feature text="Expert local guides with deep cultural knowledge" />
              <Feature text="Carefully selected accommodations near sacred sites" />
              <Feature text="24/7 support throughout your journey" />
              <Feature text="Transparent pricing with no hidden costs" />
              <Feature text="Flexible booking and cancellation policies" />
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <h2 className={cn(sacredStyles.heading.h2, 'mb-4')}>
              Ready to Begin Your Journey?
            </h2>
            <p className={cn(sacredStyles.text.body, 'mb-8 max-w-2xl mx-auto')}>
              Explore our curated packages and start planning your spiritual adventure today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/packages" className={sacredStyles.button.primary}>
                Browse Packages
              </Link>
              <Link href="/contact" className={sacredStyles.button.secondary}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <div className={cn(sacredStyles.card, 'text-center')}>
      <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4 text-orange-600">
        {icon}
      </div>
      <h3 className={cn(sacredStyles.heading.h4, 'mb-3')}>{title}</h3>
      <p className={sacredStyles.text.body}>{description}</p>
    </div>
  );
}

interface FeatureProps {
  text: string;
}

function Feature({ text }: FeatureProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center mt-0.5">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className={sacredStyles.text.body}>{text}</p>
    </div>
  );
}
