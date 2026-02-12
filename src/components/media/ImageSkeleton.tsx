/**
 * Image Skeleton Loader Component
 * Displays animated placeholder while images are loading
 */

interface ImageSkeletonProps {
  aspectRatio?: string;
  className?: string;
}

export function ImageSkeleton({ 
  aspectRatio = 'aspect-video',
  className = '' 
}: ImageSkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg ${aspectRatio} ${className}`}
      style={{
        backgroundSize: '200% 100%',
      }}
      role="status"
      aria-label="Loading image"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
