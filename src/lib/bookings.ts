// Booking types and interfaces

export interface TravelerDetail {
  name: string;
  age: number;
  gender?: string;
}

export interface BookingRequest {
  package_id: number;
  experience_ids: number[];
  hotel_tier_id: number;
  transport_option_id: number;
  // PHASE 2: Updated date fields
  booking_date: string; // Kept for backward compatibility (start date)
  booking_end_date?: string; // PHASE 2: Trip end date
  // PHASE 1: Room fields
  num_rooms?: number; // PHASE 1: Number of rooms required (default: 1)
  room_allocation?: Array<{
    room_type: string;
    occupants: number[];
  }>; // PHASE 1: Room allocation details
  room_preferences?: string; // PHASE 1: User's room preferences
  // Traveler fields
  num_travelers: number;
  traveler_details?: TravelerDetail[];
  // Customer fields
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  special_requests?: string;
  // Guest checkout fields (used internally, not sent to API)
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

export interface BookingResponse {
  id: number;
  booking_reference: string;
  status: 'DRAFT' | 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED';
  total_price: string;
  payment_url?: string | null;
  created_at: string;
}
