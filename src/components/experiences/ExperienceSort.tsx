'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'duration-asc'
  | 'duration-desc'
  | 'newest'
  | 'oldest';

interface ExperienceSortProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'price-asc', label: 'Price (Low to High)' },
  { value: 'price-desc', label: 'Price (High to Low)' },
  { value: 'duration-asc', label: 'Duration (Short to Long)' },
  { value: 'duration-desc', label: 'Duration (Long to Short)' },
];

export default function ExperienceSort({ currentSort, onSortChange }: ExperienceSortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (sort: SortOption) => {
    onSortChange(sort);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (sort !== 'newest') {
      params.set('sort', sort);
    } else {
      params.delete('sort');
    }

    const newURL = params.toString() ? `?${params.toString()}` : '/experiences';
    router.push(newURL, { scroll: false });
  };

  const getSortIcon = () => {
    if (currentSort.includes('asc')) {
      return <ArrowUp className="w-4 h-4" />;
    } else if (currentSort.includes('desc')) {
      return <ArrowDown className="w-4 h-4" />;
    }
    return <ArrowUpDown className="w-4 h-4" />;
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 font-medium">Sort by:</span>
      <div className="relative">
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value as SortOption)}
          className={cn(
            'appearance-none pl-4 pr-10 py-2 border-2 border-gray-200 rounded-lg',
            'focus:ring-2 focus:ring-orange-500 focus:border-transparent',
            'text-sm font-medium text-gray-700 bg-white cursor-pointer',
            'hover:border-orange-300 transition-colors'
          )}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
          {getSortIcon()}
        </div>
      </div>
    </div>
  );
}
