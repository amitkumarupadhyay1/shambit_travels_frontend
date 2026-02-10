import { z } from 'zod';

/**
 * Validation schemas for ShamBit forms
 * Using Zod for type-safe validation
 */

// Email validation
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

// Indian phone number validation (+91XXXXXXXXXX)
export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(
    /^\+91[6-9]\d{9}$/,
    'Please enter a valid Indian phone number (e.g., +919876543210)'
  );

// Name validation
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

// Travel date validation (must be at least 3 days from now)
export const travelDateSchema = z
  .string()
  .min(1, 'Travel date is required')
  .refine(
    (date) => {
      const selectedDate = new Date(date);
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 3);
      return selectedDate >= minDate;
    },
    {
      message: 'Travel date must be at least 3 days from today',
    }
  );

// Number of travelers validation
export const travelersSchema = z
  .number()
  .min(1, 'At least 1 traveler is required')
  .max(20, 'Maximum 20 travelers allowed');

// Experience selection validation
export const experienceSelectionSchema = z
  .array(z.number())
  .min(1, 'Please select at least 1 experience')
  .max(10, 'Maximum 10 experiences can be selected');

// Booking form schema
export const bookingFormSchema = z.object({
  customer_name: nameSchema,
  customer_email: emailSchema,
  customer_phone: phoneSchema,
  travel_date: travelDateSchema,
  number_of_travelers: travelersSchema,
  special_requests: z.string().max(500, 'Special requests must be less than 500 characters').optional(),
});

// Package selection schema
export const packageSelectionSchema = z.object({
  experiences: experienceSelectionSchema,
  hotel_tier: z.number().min(1, 'Please select a hotel tier'),
  transport_option: z.number().min(1, 'Please select a transport option'),
});

// Combined booking validation
export const completeBookingSchema = bookingFormSchema.merge(packageSelectionSchema);

// Type exports
export type BookingFormData = z.infer<typeof bookingFormSchema>;
export type PackageSelectionData = z.infer<typeof packageSelectionSchema>;
export type CompleteBookingData = z.infer<typeof completeBookingSchema>;

// Validation helper functions
export const validateEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

export const validatePhone = (phone: string): boolean => {
  return phoneSchema.safeParse(phone).success;
};

export const validateTravelDate = (date: string): boolean => {
  return travelDateSchema.safeParse(date).success;
};

export const validateExperienceSelection = (experiences: number[]): boolean => {
  return experienceSelectionSchema.safeParse(experiences).success;
};

// Format error messages for display
export const formatValidationError = (error: z.ZodError): Record<string, string> => {
  const errors: Record<string, string> = {};
  error.issues.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  return errors;
};
