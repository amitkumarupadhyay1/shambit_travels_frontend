'use client';

import { Star, Quote } from 'lucide-react';
import { cn, sacredStyles } from '@/lib/utils';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  verified?: boolean;
}

interface TestimonialsProps {
  variant?: 'default' | 'compact' | 'carousel';
  limit?: number;
  className?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    text: 'Amazing experience! The spiritual journey to Varanasi was life-changing. Everything was well-organized and the team was very supportive.',
    date: 'January 2026',
    verified: true,
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    location: 'Delhi, NCR',
    rating: 5,
    text: 'Best travel agency for spiritual tours. The Ayodhya package was incredible. Highly recommend ShamBit for anyone seeking authentic experiences.',
    date: 'December 2025',
    verified: true,
  },
  {
    id: 3,
    name: 'Anita Patel',
    location: 'Ahmedabad, Gujarat',
    rating: 5,
    text: 'Professional service and great value for money. The hotel accommodations were excellent and the guides were very knowledgeable.',
    date: 'November 2025',
    verified: true,
  },
  {
    id: 4,
    name: 'Vikram Singh',
    location: 'Jaipur, Rajasthan',
    rating: 5,
    text: 'Seamless booking process and excellent customer support. The entire trip was hassle-free. Will definitely book again!',
    date: 'October 2025',
    verified: true,
  },
  {
    id: 5,
    name: 'Meera Reddy',
    location: 'Hyderabad, Telangana',
    rating: 5,
    text: 'The attention to detail was impressive. From booking to the actual trip, everything exceeded our expectations. Thank you ShamBit!',
    date: 'September 2025',
    verified: true,
  },
  {
    id: 6,
    name: 'Amit Verma',
    location: 'Bangalore, Karnataka',
    rating: 5,
    text: 'Wonderful spiritual journey with family. The kids enjoyed it too! Safe, secure, and spiritually enriching experience.',
    date: 'August 2025',
    verified: true,
  },
];

export default function Testimonials({ variant = 'default', limit, className }: TestimonialsProps) {
  const displayTestimonials = limit ? testimonials.slice(0, limit) : testimonials;

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              'w-4 h-4',
              i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
            )}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={cn('space-y-4', className)}>
        {displayTestimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-xs text-gray-500">{testimonial.location}</p>
              </div>
              {renderStars(testimonial.rating)}
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">{testimonial.text}</p>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-xs text-gray-500">{testimonial.date}</p>
              {testimonial.verified && (
                <span className="text-xs text-green-600 font-medium">✓ Verified</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('space-y-6', className)}>
      <div className="text-center mb-8">
        <h2 className={cn(sacredStyles.heading.h2, 'mb-2')}>
          What Our Travelers Say
        </h2>
        <p className={cn(sacredStyles.text.body, 'text-gray-600')}>
          Real experiences from real travelers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayTestimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className={cn(
              'relative p-6 bg-white rounded-xl border border-gray-200',
              'hover:shadow-lg transition-all duration-300',
              'hover:-translate-y-1'
            )}
          >
            {/* Quote Icon */}
            <div className="absolute top-4 right-4 opacity-10">
              <Quote className="w-12 h-12 text-orange-600" aria-hidden="true" />
            </div>

            {/* Rating */}
            <div className="mb-3">{renderStars(testimonial.rating)}</div>

            {/* Testimonial Text */}
            <p className="text-gray-700 mb-4 relative z-10">{testimonial.text}</p>

            {/* Author Info */}
            <div className="pt-4 border-t border-gray-100">
              <p className="font-semibold text-gray-900">{testimonial.name}</p>
              <p className="text-sm text-gray-500">{testimonial.location}</p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs text-gray-400">{testimonial.date}</p>
                {testimonial.verified && (
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                    ✓ Verified Booking
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Stats */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-orange-600">10,000+</p>
            <p className="text-sm text-gray-600 mt-1">Happy Travelers</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-orange-600">4.9/5</p>
            <p className="text-sm text-gray-600 mt-1">Average Rating</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-orange-600">98%</p>
            <p className="text-sm text-gray-600 mt-1">Satisfaction Rate</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-orange-600">24/7</p>
            <p className="text-sm text-gray-600 mt-1">Customer Support</p>
          </div>
        </div>
      </div>
    </div>
  );
}
