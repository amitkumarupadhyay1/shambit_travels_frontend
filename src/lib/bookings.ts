// Booking types and interfaces

export interface BookingRequest {
  package_id: number;
  experience_ids: number[];
  hotel_tier_id: number;
  transport_option_id: number;
  booking_date: string;
  num_travelers: number;
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
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  total_price: string;
  payment_url?: string;
  created_at: string;
}
