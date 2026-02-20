import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn("bg-white rounded-xl p-6 border border-gray-200 animate-pulse", className)}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="flex gap-4 mt-4">
            <div className="h-3 bg-gray-200 rounded w-24"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonStat({ className }: SkeletonCardProps) {
  return (
    <div className={cn("bg-white rounded-xl p-5 border border-gray-200 animate-pulse", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-gray-200 rounded w-24"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}

export function SkeletonBooking({ className }: SkeletonCardProps) {
  return (
    <div className={cn("bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse", className)}>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1 flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            <div className="flex gap-4 mt-3">
              <div className="h-3 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
        <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-40"></div>
      </div>
    </div>
  );
}

export function SkeletonHero({ className }: SkeletonCardProps) {
  return (
    <div className={cn("bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 animate-pulse", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-3 flex-1">
          <div className="h-3 bg-orange-200 rounded w-24"></div>
          <div className="h-6 bg-orange-200 rounded w-2/3"></div>
          <div className="h-3 bg-orange-200 rounded w-1/3"></div>
        </div>
        <div className="h-6 bg-orange-200 rounded-full w-20"></div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <div className="h-3 bg-orange-200 rounded w-20"></div>
          <div className="h-4 bg-orange-200 rounded w-32"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-orange-200 rounded w-20"></div>
          <div className="h-4 bg-orange-200 rounded w-32"></div>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="h-10 bg-orange-200 rounded-lg flex-1"></div>
        <div className="h-10 bg-orange-200 rounded-lg flex-1"></div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
