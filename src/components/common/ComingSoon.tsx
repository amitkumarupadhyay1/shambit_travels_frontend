'use client';

import { cn, sacredStyles } from '@/lib/utils';
import Link from 'next/link';
import { ReactNode } from 'react';

interface ComingSoonProps {
  icon: ReactNode;
  title: string;
  description: string;
  estimatedLaunch?: string;
  relatedLinks?: Array<{
    href: string;
    label: string;
  }>;
}

export default function ComingSoon({
  icon,
  title,
  description,
  estimatedLaunch,
  relatedLinks,
}: ComingSoonProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated Icon */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-orange-200 rounded-full blur-2xl opacity-50 animate-pulse" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-xl">
            {icon}
          </div>
        </div>

        {/* Title */}
        <h1 className={cn(sacredStyles.heading.h1, 'mb-4')}>
          {title}
        </h1>

        {/* Description */}
        <p className={cn(sacredStyles.text.body, 'mb-8 text-gray-600 text-lg')}>
          {description}
        </p>

        {/* Estimated Launch */}
        {estimatedLaunch && (
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-orange-50 border-2 border-orange-200 rounded-full mb-8">
            <svg
              className="w-5 h-5 text-orange-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium text-orange-700">
              Estimated Launch: {estimatedLaunch}
            </span>
          </div>
        )}

        {/* Email Notification (Optional - can be implemented later) */}
        <div className={cn(sacredStyles.card, 'max-w-md mx-auto mb-8')}>
          <h3 className={cn(sacredStyles.heading.h4, 'mb-4')}>Get Notified</h3>
          <p className={cn(sacredStyles.text.body, 'mb-4 text-sm')}>
            Want to be the first to know when this service launches? Leave your email below.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your.email@example.com"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
            <button className={cn(sacredStyles.button.primary, 'whitespace-nowrap')}>
              Notify Me
            </button>
          </div>
        </div>

        {/* Related Links */}
        {relatedLinks && relatedLinks.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-4">In the meantime, explore:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    sacredStyles.button.secondary,
                    'text-sm'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Decorative Elements */}
        <div className="mt-12 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
