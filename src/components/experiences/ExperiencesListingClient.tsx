'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Experience, apiService } from '@/lib/api';
import { cn, sacredStyles, formatCurrency } from '@/lib/utils';
import { Loader2, Clock, Users, MapPin, Search } from 'lucide-react';
import ExperienceDetailModal from '../packages/ExperienceDetailModal';

export default function ExperiencesListingClient() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load experiences
  useEffect(() => {
    const loadExperiences = async () => {
      setLoading(true);
      try {
        const data = await apiService.getExperiences();
        setExperiences(data);
      } catch (error) {
        console.error('Failed to load experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExperiences();
  }, []);

  // Filter experiences by search
  const filteredExperiences = experiences.filter(exp =>
    exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (experience: Experience) => {
    setSelectedExperience(experience);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExperience(null);
  };

  return (
    <div className={cn(sacredStyles.container, "py-24 md:py-32")}>
      {/* Header */}
      <div className="mb-12">
        <h1 className={cn(sacredStyles.heading.h1, "mb-4")}>
          Explore <span className="sacred-gradient-text">Experiences</span>
        </h1>
        <p className={cn(sacredStyles.text.body, "max-w-2xl")}>
          Discover unique spiritual and cultural experiences across India. Each experience is carefully curated to provide authentic and meaningful moments.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search experiences..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
        </div>
      )}

      {/* Experiences Grid */}
      {!loading && filteredExperiences.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map(exp => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              onViewDetails={() => handleViewDetails(exp)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredExperiences.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-4">
            No experiences found matching your search.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className={sacredStyles.button.secondary}
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Results Count */}
      {!loading && filteredExperiences.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-600">
          Showing {filteredExperiences.length} of {experiences.length} experiences
        </div>
      )}

      {/* Experience Detail Modal */}
      <ExperienceDetailModal
        experience={selectedExperience}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onToggle={() => {}} // No selection functionality on standalone page
        isSelected={false}
      />
    </div>
  );
}

interface ExperienceCardProps {
  experience: Experience;
  onViewDetails: () => void;
}

function ExperienceCard({ experience, onViewDetails }: ExperienceCardProps) {
  return (
    <div className={cn(sacredStyles.card, "group hover:shadow-xl transition-all duration-300")}>
      {/* Image */}
      <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
        {experience.featured_image_url ? (
          <Image
            src={experience.featured_image_url}
            alt={`${experience.name} - ${experience.category} experience${experience.city_name ? ` in ${experience.city_name}` : ''}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 h-full flex items-center justify-center">
            <MapPin className="w-16 h-16 text-orange-600/40" />
          </div>
        )}
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
          <span className="text-lg font-bold text-orange-600">
            {formatCurrency(experience.base_price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div>
        <h3 className={cn(
          sacredStyles.heading.h4,
          "mb-3 group-hover:text-orange-600 transition-colors"
        )}>
          {experience.name}
        </h3>

        <p className={cn(sacredStyles.text.body, "mb-4 line-clamp-3")}>
          {experience.description}
        </p>

        {/* Quick Info */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{experience.duration_hours} hours</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Up to {experience.max_participants}</span>
          </div>
        </div>

        {/* View Details Button */}
        <button
          onClick={onViewDetails}
          aria-label={`View details for ${experience.name}`}
          className={cn(
            sacredStyles.button.primary,
            "w-full"
          )}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
