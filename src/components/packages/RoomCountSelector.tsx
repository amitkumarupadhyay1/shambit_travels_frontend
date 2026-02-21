'use client';

import { useState } from 'react';
import { cn, sacredStyles } from '@/lib/utils';
import { Hotel, Users, Info, Plus, Minus } from 'lucide-react';

interface RoomCountSelectorProps {
  numTravelers: number;
  maxOccupancyPerRoom: number;
  onRoomCountChange: (count: number) => void;
  initialCount?: number;
}

export default function RoomCountSelector({
  numTravelers,
  maxOccupancyPerRoom,
  onRoomCountChange,
  initialCount,
}: RoomCountSelectorProps) {
  // Calculate minimum rooms needed
  const minRooms = Math.ceil(numTravelers / maxOccupancyPerRoom);
  
  // Calculate recommended rooms (more comfortable allocation)
  const recommendedRooms = Math.ceil(numTravelers / Math.max(2, maxOccupancyPerRoom - 1));
  
  // Initialize with the greater of initialCount or minRooms
  const [roomCount, setRoomCount] = useState(() => {
    const initial = initialCount || recommendedRooms;
    return Math.max(initial, minRooms);
  });

  const handleIncrement = () => {
    const newCount = roomCount + 1;
    setRoomCount(newCount);
    onRoomCountChange(newCount);
  };

  const handleDecrement = () => {
    if (roomCount > minRooms) {
      const newCount = roomCount - 1;
      setRoomCount(newCount);
      onRoomCountChange(newCount);
    }
  };

  const handleInputChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= minRooms) {
      setRoomCount(num);
      onRoomCountChange(num);
    } else if (!isNaN(num) && num < minRooms) {
      // If user enters below minimum, set to minimum
      setRoomCount(minRooms);
      onRoomCountChange(minRooms);
    }
  };

  if (numTravelers === 0) {
    return null;
  }

  return (
    <div className={sacredStyles.card}>
      <div className="flex items-center gap-3 mb-6">
        <Hotel className="w-6 h-6 text-orange-600" />
        <h2 className={sacredStyles.heading.h3}>
          Number of Rooms
        </h2>
      </div>

      {/* Info Box */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">
              Room Allocation Guide
            </p>
            <ul className="text-blue-700 space-y-1">
              <li>• {numTravelers} traveler{numTravelers > 1 ? 's' : ''} in your group</li>
              <li>• Maximum {maxOccupancyPerRoom} people per room</li>
              <li>• Minimum {minRooms} room{minRooms > 1 ? 's' : ''} required</li>
              {recommendedRooms > minRooms && (
                <li>• Recommended: {recommendedRooms} room{recommendedRooms > 1 ? 's' : ''} for comfort</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Room Counter */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">Rooms Required</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={roomCount <= minRooms}
            className={cn(
              "w-10 h-10 rounded-lg border-2 flex items-center justify-center",
              "transition-all duration-200",
              roomCount <= minRooms
                ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                : "border-orange-300 bg-white text-orange-600 hover:bg-orange-50 hover:border-orange-500"
            )}
            aria-label="Decrease room count"
          >
            <Minus className="w-5 h-5" />
          </button>

          <input
            type="number"
            value={roomCount}
            onChange={(e) => handleInputChange(e.target.value)}
            min={minRooms}
            className={cn(
              "w-16 text-center text-lg font-semibold",
              "border-2 border-gray-200 rounded-lg py-2",
              "focus:border-orange-500 focus:ring-2 focus:ring-orange-200",
              "transition-all duration-200"
            )}
            aria-label="Number of rooms"
          />

          <button
            type="button"
            onClick={handleIncrement}
            className={cn(
              "w-10 h-10 rounded-lg border-2 flex items-center justify-center",
              "border-orange-300 bg-white text-orange-600",
              "hover:bg-orange-50 hover:border-orange-500",
              "transition-all duration-200"
            )}
            aria-label="Increase room count"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Occupancy Display */}
      <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
        <p className="text-sm text-orange-900">
          <span className="font-semibold">
            ~{Math.ceil(numTravelers / roomCount)} people per room
          </span>
          {roomCount === recommendedRooms && recommendedRooms > minRooms && (
            <span className="text-orange-700 ml-2">(Recommended for comfort)</span>
          )}
          {roomCount === minRooms && minRooms < recommendedRooms && (
            <span className="text-orange-700 ml-2">(Budget option - rooms at capacity)</span>
          )}
        </p>
      </div>
    </div>
  );
}
