# Frontend Media Integration Guide

## Overview
This guide explains how to properly integrate media from the backend Media Library into the Next.js frontend.

## Current Implementation Status

### ✅ What's Working
- Media API service (`src/lib/media.ts`)
- Cloudinary URL configuration (`next.config.ts`)
- Image optimization helper functions
- Basic image display in components

### ❌ What's Missing
- Image galleries for packages/cities
- Loading skeletons
- Error fallbacks
- Lightbox for full-size viewing
- Lazy loading implementation
- Responsive images (srcSet)

## Best Practices

### 1. Always Use Optimized Images

```tsx
// ❌ BAD: Using original URL (wastes bandwidth)
<Image src={media.file_url} alt={media.alt_text} width={800} height={600} />

// ✅ GOOD: Using optimized URL
import { getOptimizedImageUrl } from '@/lib/media';

<Image 
  src={getOptimizedImageUrl(media.file_url, 800, 600)} 
  alt={media.alt_text} 
  width={800} 
  height={600} 
/>
```

### 2. Always Provide Alt Text

```tsx
// ❌ BAD: No alt text (bad for SEO and accessibility)
<Image src={url} alt="" width={800} height={600} />

// ✅ GOOD: Descriptive alt text
<Image 
  src={url} 
  alt="Evening Ganga Aarti ceremony at Dashashwamedh Ghat, Varanasi" 
  width={800} 
  height={600} 
/>
```

### 3. Always Add Loading States

```tsx
// ❌ BAD: No loading state
{media && <Image src={media.file_url} ... />}

// ✅ GOOD: With loading skeleton
{loading && <ImageSkeleton />}
{!loading && media && <Image src={media.file_url} ... />}
```

### 4. Always Add Error Fallbacks

```tsx
// ❌ BAD: No error handling
<Image src={url} alt={alt} width={800} height={600} />

// ✅ GOOD: With error fallback
<Image 
  src={url} 
  alt={alt} 
  width={800} 
  height={600}
  onError={(e) => {
    e.currentTarget.src = '/images/fallback.jpg';
  }}
/>
```

### 5. Use Lazy Loading

```tsx
// ❌ BAD: All images load immediately
<Image src={url} alt={alt} width={800} height={600} />

// ✅ GOOD: Lazy load below-the-fold images
<Image 
  src={url} 
  alt={alt} 
  width={800} 
  height={600}
  loading="lazy"
  placeholder="blur"
  blurDataURL="/images/blur.jpg"
/>
```

## Component Examples

### 1. Image Skeleton Loader

```tsx
// components/media/ImageSkeleton.tsx
export function ImageSkeleton({ 
  aspectRatio = 'aspect-video' 
}: { 
  aspectRatio?: string 
}) {
  return (
    <div 
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg ${aspectRatio}`}
      style={{
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  );
}
```

### 2. Optimized Image Component

```tsx
// components/media/OptimizedImage.tsx
'use client';

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
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const optimizedSrc = getOptimizedImageUrl(src, width, height);

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500">Image not available</span>
      </div>
    );
  }

  return (
    <>
      {loading && <ImageSkeleton />}
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${loading ? 'hidden' : 'block'}`}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </>
  );
}
```

### 3. Media Gallery Component

```tsx
// components/media/MediaGallery.tsx
'use client';

import { useState, useEffect } from 'react';
import { Media, getMediaForObject } from '@/lib/media';
import { OptimizedImage } from './OptimizedImage';
import { ImageSkeleton } from './ImageSkeleton';

interface MediaGalleryProps {
  contentType: string; // e.g., "cities.city"
  objectId: number;
  columns?: number;
}

export function MediaGallery({
  contentType,
  objectId,
  columns = 3,
}: MediaGalleryProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMedia() {
      try {
        setLoading(true);
        const data = await getMediaForObject(contentType, objectId);
        setMedia(data);
      } catch (err) {
        setError('Failed to load images');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMedia();
  }, [contentType, objectId]);

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
        {[...Array(6)].map((_, i) => (
          <ImageSkeleton key={i} aspectRatio="aspect-square" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-gray-500">
        {error}
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No images available
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
      {media.map((item) => (
        <div key={item.id} className="relative aspect-square overflow-hidden rounded-lg">
          <OptimizedImage
            src={item.file_url}
            alt={item.alt_text || item.title}
            width={400}
            height={400}
            className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  );
}
```

### 4. Featured Image Component

```tsx
// components/media/FeaturedImage.tsx
'use client';

import { OptimizedImage } from './OptimizedImage';

interface FeaturedImageProps {
  src: string | null;
  alt: string;
  title: string;
  priority?: boolean;
}

export function FeaturedImage({
  src,
  alt,
  title,
  priority = false,
}: FeaturedImageProps) {
  // Fallback image if no src provided
  const imageSrc = src || '/images/placeholder.jpg';

  return (
    <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden rounded-xl">
      <OptimizedImage
        src={imageSrc}
        alt={alt || `Featured image for ${title}`}
        width={1920}
        height={1080}
        className="object-cover w-full h-full"
        priority={priority}
      />
      
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      
      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          {title}
        </h1>
      </div>
    </div>
  );
}
```

### 5. Lightbox Component

```tsx
// components/media/Lightbox.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Media } from '@/lib/media';

interface LightboxProps {
  media: Media[];
  initialIndex?: number;
  onClose: () => void;
}

export function Lightbox({ media, initialIndex = 0, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  const currentMedia = media[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
        aria-label="Close lightbox"
      >
        <X size={32} />
      </button>

      {/* Previous button */}
      {media.length > 1 && (
        <button
          onClick={goToPrevious}
          className="absolute left-4 text-white hover:text-gray-300 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft size={48} />
        </button>
      )}

      {/* Image */}
      <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
        <Image
          src={currentMedia.file_url}
          alt={currentMedia.alt_text || currentMedia.title}
          width={1920}
          height={1080}
          className="object-contain max-w-full max-h-full"
          priority
        />
      </div>

      {/* Next button */}
      {media.length > 1 && (
        <button
          onClick={goToNext}
          className="absolute right-4 text-white hover:text-gray-300 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight size={48} />
        </button>
      )}

      {/* Image counter */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
        {currentIndex + 1} / {media.length}
      </div>

      {/* Image title */}
      {currentMedia.title && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white text-center max-w-2xl">
          <p className="text-lg">{currentMedia.title}</p>
        </div>
      )}
    </div>
  );
}
```

## Usage Examples

### City Detail Page

```tsx
// app/cities/[slug]/page.tsx
import { MediaGallery } from '@/components/media/MediaGallery';
import { FeaturedImage } from '@/components/media/FeaturedImage';

export default async function CityDetailPage({ params }: { params: { slug: string } }) {
  const city = await getCity(params.slug);

  return (
    <div>
      {/* Hero image */}
      <FeaturedImage
        src={city.hero_image_url}
        alt={`${city.name} - ${city.description}`}
        title={city.name}
        priority
      />

      {/* City content */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Gallery</h2>
        
        {/* Media gallery */}
        <MediaGallery
          contentType="cities.city"
          objectId={city.id}
          columns={3}
        />
      </div>
    </div>
  );
}
```

### Package Detail Page

```tsx
// app/packages/[slug]/page.tsx
import { MediaGallery } from '@/components/media/MediaGallery';
import { OptimizedImage } from '@/components/media/OptimizedImage';

export default async function PackageDetailPage({ params }: { params: { slug: string } }) {
  const pkg = await getPackage(params.slug);

  return (
    <div>
      {/* Featured image */}
      {pkg.featured_image_url && (
        <div className="relative h-[500px] mb-8">
          <OptimizedImage
            src={pkg.featured_image_url}
            alt={pkg.name}
            width={1920}
            height={1080}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      )}

      {/* Package content */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Package Gallery</h2>
        
        <MediaGallery
          contentType="packages.package"
          objectId={pkg.id}
          columns={4}
        />
      </div>
    </div>
  );
}
```

### Experience Card

```tsx
// components/experiences/ExperienceCard.tsx
import { OptimizedImage } from '@/components/media/OptimizedImage';
import { Experience } from '@/lib/api';

export function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {/* Image */}
      <div className="relative h-48">
        {experience.featured_image_url ? (
          <OptimizedImage
            src={experience.featured_image_url}
            alt={`${experience.name} - ${experience.category} experience`}
            width={400}
            height={300}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-600/20 to-yellow-600/20 flex items-center justify-center">
            <span className="text-gray-500">No image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{experience.name}</h3>
        <p className="text-gray-600 mb-4">{experience.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-orange-600">
            ₹{experience.base_price}
          </span>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Performance Optimization

### 1. Image Sizes

```tsx
// Use appropriate sizes for different contexts

// Thumbnails (listings)
<OptimizedImage src={url} alt={alt} width={400} height={300} />

// Medium (detail pages)
<OptimizedImage src={url} alt={alt} width={800} height={600} />

// Hero images
<OptimizedImage src={url} alt={alt} width={1920} height={1080} />
```

### 2. Lazy Loading

```tsx
// Above the fold (hero images)
<Image src={url} alt={alt} width={1920} height={1080} priority />

// Below the fold (galleries)
<Image src={url} alt={alt} width={800} height={600} loading="lazy" />
```

### 3. Responsive Images

```tsx
// Use Next.js Image component's built-in responsive features
<Image
  src={url}
  alt={alt}
  width={1920}
  height={1080}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

## Testing Checklist

- [ ] Images load correctly on all pages
- [ ] Loading skeletons appear while images load
- [ ] Error fallbacks work for broken images
- [ ] Images are optimized (check Network tab)
- [ ] Lazy loading works (images load as you scroll)
- [ ] Alt text is present on all images
- [ ] Images are responsive (test on mobile)
- [ ] Lightbox works for galleries
- [ ] Performance is good (Lighthouse score >90)

## Common Issues

### Issue: Images not loading

**Solution:**
1. Check `next.config.ts` has correct Cloudinary domain
2. Verify API URL is correct in `.env.local`
3. Check browser console for errors
4. Verify backend is running

### Issue: Images load slowly

**Solution:**
1. Use `getOptimizedImageUrl()` helper
2. Reduce image dimensions
3. Enable lazy loading
4. Check Cloudinary transformations are applied

### Issue: 404 errors after deployment

**Solution:**
1. Ensure Cloudinary is enabled in backend
2. Check environment variables in production
3. Verify images were uploaded to Cloudinary (not local storage)

## Next Steps

1. ✅ Implement MediaGallery component
2. ✅ Add loading skeletons everywhere
3. ✅ Implement lightbox for full-size viewing
4. ✅ Add error fallbacks
5. ✅ Test on mobile devices
6. ✅ Run Lighthouse audit
7. ✅ Optimize based on results
