'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cn, sacredStyles } from '@/lib/utils';
import { Home, Search, MapPin, Package, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      <Header />
      <div className="pt-[120px] md:pt-[140px]">
        <div className={cn(sacredStyles.container, 'py-16 md:py-24')}>
          <div className="max-w-4xl mx-auto text-center">
            {/* Animated 404 */}
            <div className="relative mb-8">
              <div className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 leading-none select-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-orange-200 rounded-full blur-3xl opacity-50 animate-pulse" />
              </div>
            </div>

            {/* Message */}
            <h1 className={cn(sacredStyles.heading.h1, 'mb-4')}>
              Page Not Found
            </h1>
            <p className={cn(sacredStyles.text.body, 'mb-8 text-gray-600 text-lg')}>
              Oops! It seems you've wandered off the spiritual path. The page you're looking
              for doesn't exist or has been moved.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.querySelector('input');
                    const query = input?.value;
                    if (query?.trim()) {
                      window.location.href = `/search?q=${encodeURIComponent(query)}`;
                    }
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search for packages, destinations, or articles..."
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </form>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              <QuickLinkCard
                icon={<Home className="w-6 h-6" />}
                title="Home"
                description="Return to homepage"
                href="/"
              />
              <QuickLinkCard
                icon={<MapPin className="w-6 h-6" />}
                title="Destinations"
                description="Explore sacred cities"
                href="/destinations"
              />
              <QuickLinkCard
                icon={<Package className="w-6 h-6" />}
                title="Packages"
                description="Browse travel packages"
                href="/packages"
              />
              <QuickLinkCard
                icon={<BookOpen className="w-6 h-6" />}
                title="Articles"
                description="Read travel guides"
                href="/articles"
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className={sacredStyles.button.primary}>
                <Home className="w-5 h-5 mr-2" />
                Go to Homepage
              </Link>
              <Link href="/contact" className={sacredStyles.button.secondary}>
                Contact Support
              </Link>
            </div>

            {/* Decorative Elements */}
            <div className="mt-16 flex items-center justify-center gap-3">
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

interface QuickLinkCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

function QuickLinkCard({ icon, title, description, href }: QuickLinkCardProps) {
  return (
    <Link href={href}>
      <div
        className={cn(
          sacredStyles.card,
          'group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer h-full text-center'
        )}
      >
        <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-3 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
          {icon}
        </div>
        <h3 className={cn(sacredStyles.heading.h4, 'mb-1 group-hover:text-orange-600 transition-colors')}>
          {title}
        </h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
}
