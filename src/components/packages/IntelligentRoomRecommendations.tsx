'use client';

import { useState, useEffect } from 'react';
import { cn, sacredStyles } from '@/lib/utils';
import { Hotel, Users, Check, Info, TrendingDown, TrendingUp, Heart, Shield } from 'lucide-react';
import { apiService } from '@/lib/api';
import type { RoomRecommendation, TravelerComposition } from '@/lib/api';

interface TravelerDetail {
  name: string;
  age: number;
  gender?: string;
}

interface IntelligentRoomRecommendationsProps {
  hotelTierId: number;
  travelers: TravelerDetail[];
  onSelect: (recommendation: RoomRecommendation) => void;
  selectedNumRooms?: number;
}

export default function IntelligentRoomRecommendations({
  hotelTierId,
  travelers,
  onSelect,
  selectedNumRooms,
}: IntelligentRoomRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RoomRecommendation[]>([]);
  const [composition, setComposition] = useState<TravelerComposition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (travelers.length === 0 || !hotelTierId) {
      setRecommendations([]);
      setComposition(null);
      return;
    }

    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await apiService.getRoomRecommendations({
          hotel_tier_id: hotelTierId,
          traveler_details: travelers,
          preference: 'auto',
        });

        setRecommendations(data.recommendations || []);
        setComposition(data.composition || null);
      } catch (err) {
        console.error('Error fetching room recommendations:', err);
        setError(err instanceof Error ? err.message : 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [hotelTierId, travelers]);

  if (loading) {
    return (
      <div className={sacredStyles.card}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <span className="ml-3 text-gray-600">Analyzing your group...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={sacredStyles.card}>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'family':
        return <Heart className="w-5 h-5 text-pink-600" />;
      case 'gender_separated':
        return <Shield className="w-5 h-5 text-blue-600" />;
      case 'budget':
        return <TrendingDown className="w-5 h-5 text-green-600" />;
      case 'comfort':
        return <Users className="w-5 h-5 text-purple-600" />;
      case 'privacy':
        return <TrendingUp className="w-5 h-5 text-indigo-600" />;
      default:
        return <Hotel className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'family':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'gender_separated':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'budget':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'comfort':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'privacy':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={sacredStyles.card}>
      <div className="flex items-center gap-3 mb-6">
        <Hotel className="w-6 h-6 text-orange-600" />
        <h2 className={sacredStyles.heading.h3}>
          Intelligent Room Recommendations
        </h2>
      </div>

      {/* Composition Summary */}
      {composition && (
        <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Your Group</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Total:</span>
                  <span className="ml-2 font-medium">{composition.total}</span>
                </div>
                {composition.adults > 0 && (
                  <div>
                    <span className="text-gray-600">Adults:</span>
                    <span className="ml-2 font-medium">{composition.adults}</span>
                  </div>
                )}
                {composition.teens > 0 && (
                  <div>
                    <span className="text-gray-600">Teens:</span>
                    <span className="ml-2 font-medium">{composition.teens}</span>
                  </div>
                )}
                {composition.children > 0 && (
                  <div>
                    <span className="text-gray-600">Children:</span>
                    <span className="ml-2 font-medium">{composition.children}</span>
                  </div>
                )}
              </div>
              {composition.is_family && (
                <p className="mt-2 text-sm text-blue-700 font-medium">
                  ✨ Family group detected - showing family-friendly options
                </p>
              )}
              {composition.is_mixed_gender && !composition.is_family && (
                <p className="mt-2 text-sm text-blue-700 font-medium">
                  🔒 Mixed gender group - showing privacy-focused options
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <button
            key={rec.rank}
            onClick={() => onSelect(rec)}
            className={cn(
              "w-full p-5 rounded-xl border-2 transition-all duration-200 text-left",
              "hover:shadow-lg",
              selectedNumRooms === rec.num_rooms
                ? "border-orange-600 bg-orange-50 shadow-md"
                : rec.is_recommended
                ? "border-blue-400 bg-blue-50"
                : "border-gray-200 bg-white hover:border-orange-300"
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getTypeIcon(rec.type)}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-gray-900">
                      {rec.num_rooms} Room{rec.num_rooms > 1 ? 's' : ''}
                    </h3>
                    {rec.is_recommended && (
                      <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded-full">
                        Recommended
                      </span>
                    )}
                    <span className={cn(
                      "px-2 py-0.5 text-xs font-medium rounded-full border",
                      getTypeBadgeColor(rec.type)
                    )}>
                      {rec.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-600">
                  ₹{parseFloat(rec.cost_per_night).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">per night</p>
              </div>
            </div>

            {/* Reasoning */}
            <p className="text-sm text-gray-700 mb-3 italic">
              {rec.reasoning}
            </p>

            {/* Room Allocation */}
            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-700 mb-2">Room Allocation:</p>
              <div className="space-y-1">
                {rec.allocation.map((alloc) => (
                  <div key={alloc.room_number} className="flex items-center gap-2 text-xs">
                    <Hotel className="w-3 h-3 text-gray-400" />
                    <span className="font-medium">Room {alloc.room_number}:</span>
                    <span className="text-gray-600">{alloc.notes}</span>
                    <span className="text-gray-400">({alloc.occupants.length} people)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Pros */}
              <div>
                <p className="text-xs font-medium text-green-700 mb-1">Advantages:</p>
                <ul className="space-y-1">
                  {rec.pros.slice(0, 2).map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-1 text-xs text-gray-700">
                      <Check className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div>
                <p className="text-xs font-medium text-orange-700 mb-1">Considerations:</p>
                <ul className="space-y-1">
                  {rec.cons.slice(0, 2).map((con, idx) => (
                    <li key={idx} className="flex items-start gap-1 text-xs text-gray-600">
                      <span className="text-orange-500 flex-shrink-0">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Selection Indicator */}
            {selectedNumRooms === rec.num_rooms && (
              <div className="mt-3 pt-3 border-t border-orange-200">
                <p className="text-sm font-medium text-orange-600 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Selected
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Help Text */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 <span className="font-medium">Tip:</span> Our recommendations consider your group composition, 
          ages, and preferences to suggest the most suitable room arrangements. You can select any option 
          that works best for your group.
        </p>
      </div>
    </div>
  );
}
