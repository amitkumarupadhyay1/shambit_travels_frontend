'use client';

/**
 * Featured Image Component
 * Displays a hero-style featured image with optional title overlay
 */

import { OptimizedImage } from './OptimizedImage';

interface FeaturedImageProps {
  src: string | null;
  alt: string;
  title?: string;
  subtitle?: string;
  priority?: boolean;
  height?: 'small' | 'medium' | 'large';
  overlay?: boolean;
}

export function FeaturedImage({
  src,
  alt,
  title,
  subtitle,
  priority = false,
  height = 'large',
  overlay = true,
}: FeaturedImageProps) {
  const imageSrc = src || '/images/placeholder.jpg';

  const heightClass = {
    small: 'h-[300px] md:h-[400px]',
    medium: 'h-[400px] md:h-[500px]',
    large: 'h-[500px] md:h-[600px]',
  }[height];

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden rounded-xl`}>
      <OptimizedImage
        src={imageSrc}
        alt={alt}
        width={1920}
        height={1080}
        className="object-cover w-full h-full"
        priority={priority}
      />
      
      {/* Gradient overlay for better text readability */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      )}
      
      {/* Title and subtitle overlay */}
      {(title || subtitle) && (
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12">
          {title && (
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 drop-shadow-lg">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg md:text-xl text-white/90 drop-shadow-lg">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
