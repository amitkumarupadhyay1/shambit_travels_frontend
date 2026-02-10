'use client';

import { useState } from 'react';
import BookingForm from './BookingForm';
import { BookingRequest, BookingResponse } from '@/lib/bookings';
import { apiService } from '@/lib/api';
import { authService } from '@/lib/auth';
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
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (data: BookingRequest) => {
    setError(null);
    setIsProcessing(true);
    
    try {
      // Check if user is authenticated
      if (!authService.isAuthenticated()) {
        // Create guest user with booking details
        console.log('Creating guest user for checkout...');
        await authService.guestCheckout({
          email: data.email || data.customer_email,
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || data.customer_phone,
        });
        console.log('Guest user created successfully');
      }

      // Remove guest checkout fields before sending to booking API
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { first_name, last_name, email, phone, ...bookingData } = data;

      // Now create the booking with authentication
      const response = await apiService.createBooking(bookingData);
      onBookingComplete(response);
      onClose();
    } catch (err) {
      console.error('Booking failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking. Please try again.';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
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
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-900">
              Book {packageName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isProcessing}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Content */}
          <div className="px-6 py-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                <p className="font-medium">Booking Failed</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}
            
            <BookingForm
              packageId={packageId}
              selections={selections}
              totalPrice={totalPrice}
              onSubmit={handleSubmit}
              onCancel={onClose}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
