# Phase 2 Quick Start Guide

**Ready to implement?** Follow this guide to start building Phase 2 features immediately.

---

## 🚀 Getting Started

### Prerequisites

✅ Phase 1 Complete:
- Package detail page working
- Price calculator functional
- Packages listing page live
- All quality checks passing

✅ Development Environment:
- Node.js 18+ installed
- Backend running on `localhost:8000`
- Frontend running on `localhost:3000`
- Git repository up to date

---

## 📋 Week 1: Booking Flow

### Day 1-2: Booking Form Component

**Step 1: Create booking types**

```bash
# Create new file
touch frontend/shambit-frontend/src/lib/bookings.ts
```

**Add TypeScript interfaces:**

```typescript
// frontend/shambit-frontend/src/lib/bookings.ts

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
```

**Step 2: Add booking API method**

```typescript
// Add to frontend/shambit-frontend/src/lib/api.ts

async createBooking(data: BookingRequest): Promise<BookingResponse> {
  return this.fetchApi<BookingResponse>('/bookings/', {
    method: 'POST',
    body: JSON.stringify(data),
    skipCache: true,
  });
}
```

**Step 3: Create booking form component**

```bash
mkdir -p frontend/shambit-frontend/src/components/bookings
touch frontend/shambit-frontend/src/components/bookings/BookingForm.tsx
```

**Minimal MVP implementation:**

```typescript
'use client';

import { useState } from 'react';
import { BookingRequest } from '@/lib/bookings';
import { cn, sacredStyles } from '@/lib/utils';

interface BookingFormProps {
  packageId: number;
  selections: {
    experiences: number[];
    hotel: number;
    transport: number;
  };
  totalPrice: string;
  onSubmit: (data: BookingRequest) => Promise<void>;
  onCancel: () => void;
}

export default function BookingForm({
  packageId,
  selections,
  totalPrice,
  onSubmit,
  onCancel,
}: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    booking_date: '',
    num_travelers: 1,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    special_requests: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        package_id: packageId,
        experience_ids: selections.experiences,
        hotel_tier_id: selections.hotel,
        transport_option_id: selections.transport,
        ...formData,
      });
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step 1: Travel Details */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className={sacredStyles.heading.h4}>Travel Details</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Travel Date
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={formData.booking_date}
              onChange={(e) => setFormData({...formData, booking_date: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Travelers
            </label>
            <input
              type="number"
              required
              min={1}
              max={20}
              value={formData.num_travelers}
              onChange={(e) => setFormData({...formData, num_travelers: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className={cn(sacredStyles.button.primary, "w-full")}
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Customer Information */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className={sacredStyles.heading.h4}>Your Information</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.customer_name}
              onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.customer_email}
              onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Phone
            </label>
            <input
              type="tel"
              required
              value={formData.customer_phone}
              onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              value={formData.special_requests}
              onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={cn(sacredStyles.button.secondary, "flex-1")}
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className={cn(sacredStyles.button.primary, "flex-1")}
            >
              Review
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className={sacredStyles.heading.h4}>Review Booking</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p><strong>Date:</strong> {formData.booking_date}</p>
            <p><strong>Travelers:</strong> {formData.num_travelers}</p>
            <p><strong>Name:</strong> {formData.customer_name}</p>
            <p><strong>Email:</strong> {formData.customer_email}</p>
            <p><strong>Phone:</strong> {formData.customer_phone}</p>
            <p className="text-2xl font-bold text-orange-600 mt-4">
              Total: ₹{totalPrice}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className={cn(sacredStyles.button.secondary, "flex-1")}
              disabled={loading}
            >
              Back
            </button>
            <button
              type="submit"
              className={cn(sacredStyles.button.primary, "flex-1")}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onCancel}
        className="w-full text-center text-sm text-gray-600 hover:text-gray-900"
      >
        Cancel
      </button>
    </form>
  );
}
```

**Step 4: Create booking modal**

```bash
touch frontend/shambit-frontend/src/components/bookings/BookingModal.tsx
```

```typescript
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BookingForm from './BookingForm';
import { BookingRequest, BookingResponse } from '@/lib/bookings';

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
  const handleSubmit = async (data: BookingRequest) => {
    // API call will be added here
    console.log('Booking data:', data);
    
    // Mock response for now
    const mockResponse: BookingResponse = {
      id: 1,
      booking_reference: 'SB' + Date.now(),
      status: 'PENDING',
      total_price: totalPrice,
      created_at: new Date().toISOString(),
    };
    
    onBookingComplete(mockResponse);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book {packageName}</DialogTitle>
        </DialogHeader>
        
        <BookingForm
          packageId={packageId}
          selections={selections}
          totalPrice={totalPrice}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
```

**Step 5: Update PriceCalculator**

```typescript
// Modify frontend/shambit-frontend/src/components/packages/PriceCalculator.tsx

// Add state for booking modal
const [showBookingModal, setShowBookingModal] = useState(false);

// Update Book Now button
<button
  onClick={() => setShowBookingModal(true)}
  className={cn(sacredStyles.button.primary, "w-full")}
  disabled={!isValid}
>
  <ShoppingCart className="w-5 h-5" />
  Book Now
</button>

// Add modal at the end of component
{showBookingModal && (
  <BookingModal
    isOpen={showBookingModal}
    onClose={() => setShowBookingModal(false)}
    packageId={packageData.id}
    packageName={packageData.name}
    selections={selections}
    totalPrice={price?.total_price || '0'}
    onBookingComplete={(booking) => {
      console.log('Booking complete:', booking);
      // Redirect to confirmation page
      window.location.href = `/bookings/${booking.booking_reference}`;
    }}
  />
)}
```

**Step 6: Test**

```bash
npm run lint
npm run type-check
npm run build
```

---

## 🎯 Quick Wins (Can Implement Today)

### 1. Experience Detail Modal (2-3 hours)

```bash
touch frontend/shambit-frontend/src/components/packages/ExperienceDetailModal.tsx
```

Simple implementation:

```typescript
'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Experience } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface ExperienceDetailModalProps {
  experience: Experience | null;
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  isSelected: boolean;
}

export default function ExperienceDetailModal({
  experience,
  isOpen,
  onClose,
  onToggle,
  isSelected,
}: ExperienceDetailModalProps) {
  if (!experience) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{experience.name}</h2>
          
          <div className="text-3xl font-bold text-orange-600">
            {formatCurrency(experience.base_price)}
          </div>
          
          <p className="text-gray-700">{experience.description}</p>
          
          <button
            onClick={() => {
              onToggle();
              onClose();
            }}
            className="w-full py-3 bg-orange-600 text-white rounded-lg"
          >
            {isSelected ? 'Remove from Package' : 'Add to Package'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

Update ExperienceSelector to add "View Details" button.

### 2. Search Bar (1-2 hours)

```bash
touch frontend/shambit-frontend/src/components/packages/SearchBar.tsx
```

```typescript
'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Search packages...' }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
      />
    </div>
  );
}
```

Add to PackagesListingClient.

### 3. Trust Badges (30 minutes)

```bash
touch frontend/shambit-frontend/src/components/common/TrustBadges.tsx
```

```typescript
import { Shield, Clock, Award, HeadphonesIcon } from 'lucide-react';

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
      <div className="text-center">
        <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
        <p className="text-sm font-medium">Secure Payment</p>
      </div>
      <div className="text-center">
        <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
        <p className="text-sm font-medium">Instant Confirmation</p>
      </div>
      <div className="text-center">
        <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
        <p className="text-sm font-medium">Verified Experiences</p>
      </div>
      <div className="text-center">
        <HeadphonesIcon className="w-8 h-8 text-orange-600 mx-auto mb-2" />
        <p className="text-sm font-medium">24/7 Support</p>
      </div>
    </div>
  );
}
```

Add to package detail page.

---

## 📝 Daily Checklist

### Before Starting Work

- [ ] Pull latest code from main
- [ ] Backend server running
- [ ] Frontend dev server running
- [ ] Check for any breaking changes

### During Development

- [ ] Follow TypeScript strictly
- [ ] Use existing components/patterns
- [ ] Test in browser frequently
- [ ] Check mobile responsiveness
- [ ] Console has no errors

### Before Committing

- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes
- [ ] `npm run build` succeeds
- [ ] Manual testing complete
- [ ] Git commit message clear

---

## 🆘 Troubleshooting

### Common Issues

**Issue:** TypeScript errors
**Solution:** Run `npm run type-check` and fix errors

**Issue:** Lint errors
**Solution:** Run `npm run lint -- --fix`

**Issue:** Build fails
**Solution:** Check console for specific errors, usually import issues

**Issue:** API calls fail
**Solution:** Check backend is running, check network tab in browser

**Issue:** Modal not showing
**Solution:** Check if Dialog component is installed, check z-index

---

## 📚 Resources

- **Phase 2 Full Plan:** `PHASE2_IMPLEMENTATION_PLAN.md`
- **API Documentation:** `backend/docs/API_TESTING_GUIDE.md`
- **Frontend Roadmap:** `backend/docs/FRONTEND_IMPLEMENTATION_ROADMAP.md`
- **Admin Guide:** `backend/docs/ADMIN_QUICK_GUIDE_EXPERIENCES.md`

---

**Ready to start?** Begin with Day 1-2 tasks above! 🚀

