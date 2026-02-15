'use client';

/**
 * Media Gallery Component
 * Displays a grid of images from the Media Library
 * Supports lightbox view for full-size images
 */

import { useState, useEffect } from 'react';
import { Media, getMediaForObject } from '@/lib/media';
import { OptimizedImage } from './OptimizedImage';
import { ImageSkeleton } from './ImageSkeleton';

interface MediaGalleryProps {
  contentType: string; // e.g., "cities.city", "packages.package"
  objectId: number;
  columns?: 2 | 3 | 4;
  showTitle?: boolean;
}

export function MediaGallery({
  contentType,
  objectId,
  columns = 3,
  showTitle = false,
}: MediaGalleryProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchMedia() {
      try {
        setLoading(true);
        setError(null);
        const data = await getMediaForObject(contentType, objectId);
        setMedia(data);
      } catch (err) {
        setError('Failed to load images');
        console.error('Error fetching media:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMedia();

    // Poll for updates every 30 seconds to reflect admin changes
    const pollInterval = setInterval(fetchMedia, 30000);

    return () => clearInterval(pollInterval);
  }, [contentType, objectId]);

  const gridColsClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columns];

  if (loading) {
    return (
      <div className={`grid ${gridColsClass} gap-4`}>
        {[...Array(6)].map((_, i) => (
          <ImageSkeleton key={i} aspectRatio="aspect-square" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        <p>No images available</p>
      </div>
    );
  }

  return (
    <>
      <div className={`grid ${gridColsClass} gap-4`}>
        {media.map((item, index) => (
          <div 
            key={item.id} 
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
            onClick={() => setSelectedIndex(index)}
          >
            <OptimizedImage
              src={item.file_url}
              alt={item.alt_text || item.title}
              width={400}
              height={400}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                View Full Size
              </span>
            </div>

            {/* Title overlay */}
            {showTitle && item.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-white text-sm font-medium truncate">
                  {item.title}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Simple lightbox */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors text-4xl"
            aria-label="Close"
          >
            ×
          </button>

          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <OptimizedImage
              src={media[selectedIndex].file_url}
              alt={media[selectedIndex].alt_text || media[selectedIndex].title}
              width={1920}
              height={1080}
              className="object-contain max-w-full max-h-full"
              priority
            />
          </div>

          {/* Navigation */}
          {media.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) => 
                    prev === 0 ? media.length - 1 : (prev ?? 0) - 1
                  );
                }}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors text-6xl"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) => 
                    prev === media.length - 1 ? 0 : (prev ?? 0) + 1
                  );
                }}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors text-6xl"
                aria-label="Next"
              >
                ›
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg">
            {selectedIndex + 1} / {media.length}
          </div>
        </div>
      )}
    </>
  );
}
