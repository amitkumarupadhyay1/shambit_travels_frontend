'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Filter, X } from 'lucide-react';

interface FilterSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onClear?: () => void;
  hasActiveFilters?: boolean;
  activeFilterCount?: number;
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function FilterSidebar({
  isOpen,
  onToggle,
  onClear,
  hasActiveFilters = false,
  activeFilterCount = 0,
  children,
  title = 'Filters',
  subtitle,
}: FilterSidebarProps) {
  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <button
        onClick={onToggle}
        className={cn(
          'lg:hidden w-full flex items-center justify-between px-4 py-3 mb-4',
          'border-2 rounded-lg transition-all duration-200',
          isOpen
            ? 'border-orange-500 bg-orange-50 shadow-sm'
            : 'border-gray-200 bg-white hover:border-orange-300'
        )}
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-700" />
          <span className="font-medium text-gray-900">{title}</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-orange-600 text-white text-xs font-medium rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && onClear && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Clear
            </span>
          )}
          <svg
            className={cn(
              'w-5 h-5 text-gray-500 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Filter Sidebar/Panel */}
      <div
        className={cn(
          // Mobile: Collapsible panel
          'lg:block',
          !isOpen && 'hidden',
          // Desktop: Fixed sidebar
          'lg:sticky lg:top-[140px] lg:h-[calc(100vh-160px)] lg:overflow-y-auto',
          // Styling
          'bg-white border-2 border-gray-200 rounded-lg p-6',
          // Scrollbar styling
          'lg:scrollbar-thin lg:scrollbar-thumb-gray-300 lg:scrollbar-track-gray-100'
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {hasActiveFilters && onClear && (
            <button
              onClick={onClear}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 transition-colors"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          )}
        </div>

        {/* Filter Content */}
        <div className="space-y-6">{children}</div>
      </div>
    </>
  );
}

// Filter Section Component
interface FilterSectionProps {
  title: string;
  children: ReactNode;
}

export function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900 text-sm">{title}</h4>
      {children}
    </div>
  );
}

// Filter Checkbox Component
interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
}

export function FilterCheckbox({ label, checked, onChange, count }: FilterCheckboxProps) {
  return (
    <label className="flex items-center justify-between gap-2 cursor-pointer group py-1">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
        />
        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className="text-xs text-gray-500 font-medium">({count})</span>
      )}
    </label>
  );
}

// Filter Radio Component
interface FilterRadioProps {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

export function FilterRadio({ name, label, checked, onChange }: FilterRadioProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group py-1">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500 focus:ring-2 cursor-pointer"
      />
      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
        {label}
      </span>
    </label>
  );
}
