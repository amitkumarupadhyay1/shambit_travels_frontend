'use client';

import { Experience } from '@/lib/api';
import { cn, sacredStyles, formatCurrency } from '@/lib/utils';
import { X, Check, Clock, Users, MapPin, AlertCircle } from 'lucide-react';

interface ExperienceDetailModalProps {
  experience: Experience | null;
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  isSelected: boolean;
}

export default function ExperienceDetailModal({
  experience,
  isOpen,
  onClose,
  onToggle,
  isSelected,
}: ExperienceDetailModalProps) {
  if (!experience || !isOpen) return null;

  const handleToggle = () => {
    onToggle();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between z-10">
            <div className="flex-1 pr-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {experience.name}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-orange-600">
                  {formatCurrency(experience.base_price)}
                </span>
                <span className="text-sm text-gray-500">per person</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600">Duration</p>
                  <p className="text-sm font-medium">{experience.duration_hours} hours</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Users className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600">Group Size</p>
                  <p className="text-sm font-medium">Up to {experience.max_participants} people</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600">Difficulty</p>
                  <p className="text-sm font-medium">{experience.difficulty_level.charAt(0) + experience.difficulty_level.slice(1).toLowerCase()}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className={cn(sacredStyles.heading.h4, "mb-3")}>
                About This Experience
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {experience.description}
              </p>
            </div>

            {/* What's Included */}
            <div>
              <h3 className={cn(sacredStyles.heading.h4, "mb-3")}>
                What&apos;s Included
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Professional guide</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Entry tickets</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Transportation</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Refreshments</span>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Important Information
                  </h4>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>• Please arrive 15 minutes before start time</li>
                    <li>• Modest clothing required (shoulders and knees covered)</li>
                    <li>• Photography allowed in designated areas only</li>
                    <li>• Not suitable for those with mobility issues</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* What to Bring */}
            <div>
              <h3 className={cn(sacredStyles.heading.h4, "mb-3")}>
                What to Bring
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  Comfortable shoes
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  Water bottle
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  Camera
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  Sunscreen
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  Hat
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-600">Price per person</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(experience.base_price)}
                </p>
              </div>
              <button
                onClick={handleToggle}
                className={cn(
                  "px-8 py-3 rounded-lg font-semibold transition-colors",
                  isSelected
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-orange-600 hover:bg-orange-700 text-white"
                )}
              >
                {isSelected ? 'Remove from Package' : 'Add to Package'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
