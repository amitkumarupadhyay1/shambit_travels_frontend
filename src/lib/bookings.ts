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
}

export interface BookingResponse {
  id: number;
  booking_reference: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  total_price: string;
  payment_url?: string;
  created_at: string;
}
