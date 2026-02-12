'use client';

/**
 * Optimized Image Component
 * Handles loading states, errors, and Cloudinary optimization
 */

import Image from 'next/image';
import { useState } from 'react';
import { getOptimizedImageUrl } from '@/lib/media';
import { ImageSkeleton } from './ImageSkeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fallbackSrc = '/images/placeholder.jpg',
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const optimizedSrc = getOptimizedImageUrl(currentSrc, width, height);

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setError(false); // Reset error to try fallback
    } else {
      setError(true);
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && <ImageSkeleton className={className} />}
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setLoading(false)}
        onError={handleError}
        priority={priority}
      />
    </div>
  );
}
