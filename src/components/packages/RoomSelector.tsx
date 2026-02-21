'use client';

import { cn, sacredStyles } from '@/lib/utils';
import { Hotel, Users, Info } from 'lucide-react';

interface RoomSelectorProps {
  numTravelers: number;
  maxOccupancyPerRoom: number;
  selectedRooms: number;
  onChange: (numRooms: number) => void;
  disabled?: boolean;
}

export default function RoomSelector({
  numTravelers,
  maxOccupancyPerRoom = 2,
  selectedRooms,
  onChange,
  disabled = false,
}: RoomSelectorProps) {
  // Calculate minimum and recommended rooms
  const minRooms = Math.ceil(numTravelers / maxOccupancyPerRoom);
  const maxRooms = numTravelers; // Maximum: 1 person per room

  // Generate room options
  const roomOptions = [];
  for (let i = minRooms; i <= Math.min(maxRooms, minRooms + 3); i++) {
    const peoplePerRoom = Math.ceil(numTravelers / i);
    roomOptions.push({
      numRooms: i,
      peoplePerRoom,
      description: i === minRooms 
        ? `${i} room${i > 1 ? 's' : ''} (${peoplePerRoom} per room) - Most economical`
        : i === numTravelers
        ? `${i} room${i > 1 ? 's' : ''} (1 per room) - Maximum privacy`
        : `${i} room${i > 1 ? 's' : ''} (${peoplePerRoom} per room)`,
    });
  }

  return (
    <div className={sacredStyles.card}>
      <div className="flex items-center gap-3 mb-6">
        <Hotel className="w-6 h-6 text-orange-600" />
        <h2 className={sacredStyles.heading.h3}>
          Select Number of Rooms
        </h2>
      </div>

      {/* Info Box */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">Room Allocation</p>
          <p className="mt-1">
            For {numTravelers} traveler{numTravelers > 1 ? 's' : ''}, you need at least {minRooms} room{minRooms > 1 ? 's' : ''} 
            (max {maxOccupancyPerRoom} people per room).
          </p>
        </div>
      </div>

      {/* Room Options */}
      <div className="space-y-3">
        {roomOptions.map((option) => (
          <button
            key={option.numRooms}
            onClick={() => onChange(option.numRooms)}
            disabled={disabled}
            className={cn(
              "w-full p-4 rounded-lg border-2 transition-all duration-200 text-left",
              "hover:shadow-md",
              selectedRooms === option.numRooms
                ? "border-orange-600 bg-orange-50"
                : "border-gray-200 bg-white hover:border-orange-300",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Radio indicator */}
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                    selectedRooms === option.numRooms
                      ? "border-orange-600"
                      : "border-gray-300"
                  )}
                >
                  {selectedRooms === option.numRooms && (
                    <div className="w-3 h-3 rounded-full bg-orange-600" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <Hotel className="w-4 h-4 text-gray-600" />
                    <span className="font-semibold text-gray-900">
                      {option.numRooms} Room{option.numRooms > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {option.description}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <Users className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">
                  {option.peoplePerRoom} per room
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Custom Room Input (for advanced users) */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Or enter custom number of rooms:
        </label>
        <input
          type="number"
          value={selectedRooms}
          onChange={(e) => onChange(Math.max(minRooms, Math.min(maxRooms, parseInt(e.target.value) || minRooms)))}
          min={minRooms}
          max={maxRooms}
          disabled={disabled}
          className={cn(
            "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500",
            disabled ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
          )}
        />
        <p className="text-xs text-gray-500 mt-1">
          Range: {minRooms} to {maxRooms} rooms
        </p>
      </div>
    </div>
  );
}
