'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { User, Trash2, AlertCircle } from 'lucide-react';

interface TravelerInfo {
  name: string;
  age: string;
  gender: string;
}

interface TravelerCardProps {
  index: number;
  traveler: TravelerInfo;
  onChange: (index: number, field: 'name' | 'age' | 'gender', value: string) => void;
  onRemove?: (index: number) => void;
  canRemove: boolean;
  errors?: {
    name?: string;
    age?: string;
  };
}

export default function TravelerCard({
  index,
  traveler,
  onChange,
  onRemove,
  canRemove,
  errors,
}: TravelerCardProps) {
  const [touched, setTouched] = useState({ name: false, age: false });

  const age = parseInt(traveler.age);
  const isFree = age > 0 && age < 5;
  const hasErrors = errors && (errors.name || errors.age);

  return (
    <div
      className={cn(
        'p-6 rounded-xl border-2 transition-all duration-200',
        isFree
          ? 'bg-green-50 border-green-200 shadow-sm'
          : 'bg-white border-gray-200 shadow-sm hover:shadow-md',
        hasErrors && 'border-red-300 bg-red-50'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              isFree ? 'bg-green-100' : 'bg-orange-100'
            )}
          >
            <User className={cn('w-5 h-5', isFree ? 'text-green-600' : 'text-orange-600')} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Traveler {index + 1}
            </h3>
            {isFree && (
              <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full mt-1">
                Free (Under 5 years)
              </span>
            )}
          </div>
        </div>

        {canRemove && onRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label={`Remove traveler ${index + 1}`}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor={`traveler-${index}-name`}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id={`traveler-${index}-name`}
            type="text"
            value={traveler.name}
            onChange={(e) => onChange(index, 'name', e.target.value)}
            onBlur={() => setTouched({ ...touched, name: true })}
            placeholder="As per ID proof"
            className={cn(
              'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all',
              errors?.name && touched.name
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-white'
            )}
            required
          />
          {errors?.name && touched.name && (
            <div className="flex items-center gap-1 mt-1.5 text-xs text-red-600">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.name}</span>
            </div>
          )}
        </div>

        {/* Age and Gender Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Age */}
          <div>
            <label
              htmlFor={`traveler-${index}-age`}
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Age <span className="text-red-500">*</span>
            </label>
            <input
              id={`traveler-${index}-age`}
              type="number"
              min="0"
              max="120"
              value={traveler.age}
              onChange={(e) => onChange(index, 'age', e.target.value)}
              onBlur={() => setTouched({ ...touched, age: true })}
              placeholder="Age"
              className={cn(
                'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all',
                errors?.age && touched.age
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              )}
              required
            />
            {errors?.age && touched.age && (
              <div className="flex items-center gap-1 mt-1.5 text-xs text-red-600">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.age}</span>
              </div>
            )}
          </div>

          {/* Gender */}
          <div>
            <label
              htmlFor={`traveler-${index}-gender`}
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Gender
            </label>
            <select
              id={`traveler-${index}-gender`}
              value={traveler.gender}
              onChange={(e) => onChange(index, 'gender', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white transition-all"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
