'use client';

import { useComparison } from '@/contexts/ComparisonContext';
import { cn, sacredStyles } from '@/lib/utils';
import { X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ComparisonBar() {
  const { packages, removePackage, clearAll } = useComparison();

  if (packages.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-orange-600 shadow-2xl z-40">
      <div className={cn(sacredStyles.container, "py-4")}>
        <div className="flex items-center justify-between gap-4">
          {/* Left: Package Count and Clear */}
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-gray-600">Comparing</p>
              <p className="text-lg font-bold text-orange-600">
                {packages.length} {packages.length === 1 ? 'Package' : 'Packages'}
              </p>
            </div>
            <button
              onClick={clearAll}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear All
            </button>
          </div>

          {/* Middle: Package Pills */}
          <div className="flex-1 flex items-center gap-2 overflow-x-auto">
            {packages.map(pkg => (
              <div
                key={pkg.id}
                className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg whitespace-nowrap"
              >
                <span className="text-sm font-medium text-gray-900">
                  {pkg.name}
                </span>
                <button
                  onClick={() => removePackage(pkg.id)}
                  className="text-gray-500 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Right: Compare Button */}
          <Link
            href="/packages/compare"
            className={cn(
              sacredStyles.button.primary,
              "flex items-center gap-2 whitespace-nowrap"
            )}
          >
            Compare Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
