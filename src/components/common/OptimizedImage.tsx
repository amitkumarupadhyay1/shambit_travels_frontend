'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  sizes?: string;
}

/**
 * Optimized Image Component
 * 
 * Features:
 * - Uses Next.js Image for automatic optimization
 * - Handles loading states with skeleton
 * - Provides fallback for broken images
 * - Cloudinary URLs are automatically optimized
 * - Lazy loading by default (unless priority=true)
 * - Responsive images with srcset
 * 
 * Usage:
 * ```tsx
 * <OptimizedImage
 *   src="https://res.cloudinary.com/..."
 *   alt="Beautiful landscape"
 *   width={800}
 *   height={600}
 *   className="rounded-lg"
 * />
 * ```
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  objectFit = 'cover',
  sizes,
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fallback image - you can customize this
  const fallbackSrc = '/images/placeholder.jpg';

  // Determine if we should use fill mode
  const useFill = fill || (!width && !height);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading skeleton */}
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      
      {/* Image */}
      <Image
        src={error ? fallbackSrc : src}
        alt={alt}
        width={useFill ? undefined : width}
        height={useFill ? undefined : height}
        fill={useFill}
        priority={priority}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={useFill ? { objectFit } : undefined}
        sizes={sizes || (useFill ? '100vw' : undefined)}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        // Next.js will handle Cloudinary optimization automatically
        // if you configure it in next.config.ts
        quality={85}
      />
      
      {/* Error state indicator (optional) */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-sm">Image not available</p>
          </div>
        </div>
      )}
    </div>
  );
}
