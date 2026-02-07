'use client';

import { useState } from 'react';
import BookingForm from './BookingForm';
import { BookingRequest, BookingResponse } from '@/lib/bookings';
import { apiService } from '@/lib/api';
import { X } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: number;
  packageName: string;
  selections: {
    experiences: number[];
    hotel: number;
    transport: number;
  };
  totalPrice: string;
  onBookingComplete: (booking: BookingResponse) => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  packageId,
  packageName,
  selections,
  totalPrice,
  onBookingComplete,
}: BookingModalProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: BookingRequest) => {
    setError(null);
    
    try {
      const response = await apiService.createBooking(data);
      onBookingComplete(response);
      onClose();
    } catch (err) {
      console.error('Booking failed:', err);
      setError('Failed to create booking. Please try again.');
      throw err;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Book {packageName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Content */}
          <div className="px-6 py-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {error}
              </div>
            )}
            
            <BookingForm
              packageId={packageId}
              selections={selections}
              totalPrice={totalPrice}
              onSubmit={handleSubmit}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
