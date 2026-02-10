'use client';

import { useState } from 'react';
import { Experience } from '@/lib/api';
import { cn, sacredStyles, formatCurrency } from '@/lib/utils';
import { Check, Info, AlertCircle } from 'lucide-react';
import ExperienceDetailModal from './ExperienceDetailModal';

interface ExperienceSelectorProps {
  experiences: Experience[];
  selected: number[];
  onChange: (ids: number[]) => void;
}

export default function ExperienceSelector({
  experiences,
  selected,
  onChange,
}: ExperienceSelectorProps) {
  const [modalExperience, setModalExperience] = useState<Experience | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggle = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter(x => x !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const handleViewDetails = (experience: Experience, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalExperience(experience);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalExperience(null);
  };

  const handleToggleFromModal = () => {
    if (modalExperience) {
      handleToggle(modalExperience.id);
    }
  };

  const handleSelectAll = () => {
    onChange(experiences.map(exp => exp.id));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  // Validation states
  const MIN_EXPERIENCES = 1;
  const MAX_EXPERIENCES = 10;
  const selectedCount = selected.length;
  const isAtMax = selectedCount >= MAX_EXPERIENCES;
  const isNearMax = selectedCount >= MAX_EXPERIENCES - 1 && selectedCount < MAX_EXPERIENCES;
  const hasMinimum = selectedCount >= MIN_EXPERIENCES;

  return (
    <div className={sacredStyles.card}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={sacredStyles.heading.h3}>
            Select Your Experiences
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Choose between {MIN_EXPERIENCES} and {MAX_EXPERIENCES} experiences
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {/* Selection Counter */}
          <div
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              isAtMax
                ? "bg-red-100 text-red-700"
                : isNearMax
                  ? "bg-orange-100 text-orange-700"
                  : hasMinimum
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
            )}
          >
            Selected: {selectedCount}/{MAX_EXPERIENCES}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSelectAll}
              disabled={isAtMax}
              className={cn(
                "text-sm font-medium",
                isAtMax
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-orange-600 hover:text-orange-700"
              )}
            >
              Select All
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={handleClearAll}
              className="text-sm text-gray-600 hover:text-gray-700 font-medium"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Validation Messages */}
      {!hasMinimum && (
        <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">
            Please select at least {MIN_EXPERIENCES} experience to continue
          </p>
        </div>
      )}

      {isAtMax && (
        <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">
            Maximum {MAX_EXPERIENCES} experiences reached. Deselect an experience to choose another.
          </p>
        </div>
      )}

      {isNearMax && !isAtMax && (
        <div className="mb-4 flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-orange-700">
            You can select {MAX_EXPERIENCES - selectedCount} more experience{MAX_EXPERIENCES - selectedCount !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {experiences.map(exp => (
          <ExperienceCard
            key={exp.id}
            experience={exp}
            selected={selected.includes(exp.id)}
            onToggle={() => handleToggle(exp.id)}
            onViewDetails={(e) => handleViewDetails(exp, e)}
            disabled={isAtMax && !selected.includes(exp.id)}
          />
        ))}
      </div>

      {experiences.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No experiences available for this package.
        </div>
      )}

      {/* Experience Detail Modal */}
      <ExperienceDetailModal
        experience={modalExperience}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onToggle={handleToggleFromModal}
        isSelected={modalExperience ? selected.includes(modalExperience.id) : false}
      />
    </div>
  );
}

interface ExperienceCardProps {
  experience: Experience;
  selected: boolean;
  onToggle: () => void;
  onViewDetails: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

function ExperienceCard({ experience, selected, onToggle, onViewDetails, disabled = false }: ExperienceCardProps) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "relative p-4 rounded-xl border-2 transition-all duration-200 text-left",
        "hover:shadow-md",
        disabled && "opacity-50 cursor-not-allowed",
        selected
          ? "border-orange-600 bg-orange-50/50"
          : "border-gray-200 bg-white hover:border-orange-300"
      )}
      aria-pressed={selected}
      aria-disabled={disabled}
    >
      {/* Checkbox */}
      <div
        className={cn(
          "absolute top-4 right-4 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
          selected
            ? "bg-orange-600 border-orange-600"
            : "bg-white border-gray-300"
        )}
      >
        {selected && <Check className="w-4 h-4 text-white" />}
      </div>

      {/* Content */}
      <div className="pr-8">
        <h3 className="font-semibold text-lg text-slate-900 mb-2">
          {experience.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {experience.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-orange-600">
            {formatCurrency(experience.base_price)}
          </span>
          <button
            onClick={onViewDetails}
            className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium"
          >
            <Info className="w-4 h-4" />
            View Details
          </button>
        </div>
      </div>
    </button>
  );
}
