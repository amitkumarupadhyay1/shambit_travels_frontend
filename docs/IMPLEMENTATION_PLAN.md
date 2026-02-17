# Implementation Plan - ShamBit Frontend Requirements

**Date:** February 17, 2026  
**Based on:** Gap Analysis v1.0  
**Status:** Ready for Implementation

---

## Executive Summary

After thorough analysis of the codebase, the following implementation plan addresses the four core requirements:

1. ✅ **Login System** - COMPLETE (No action needed)
2. ✅ **Browsing Without Login** - COMPLETE (Minor enhancements recommended)
3. ⚠️ **Price Display Standards** - NEEDS ENHANCEMENT
4. ⚠️ **Click to Book Flow** - NEEDS REFINEMENT

---

## Phase 1: Price Display Standards Enhancement

### Current Status
The `PriceCalculator` component exists and works, but doesn't fully meet the display standards.

### Required Changes

#### 1.1 Add "Price Per Person" Badge
**File:** `frontend/shambit-frontend/src/components/packages/PriceCalculator.tsx`

**Location:** After the total price display

**Implementation:**
```typescript
{/* Add after total price */}
<div className="flex items-center justify-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
  <Users className="w-4 h-4 text-orange-600" />
  <span className="text-sm font-medium text-orange-800">
    Price is per person
  </span>
</div>
```

#### 1.2 Add Taxes and Charges Breakdown
**Backend Verification Required:** Check if `/calculate_price/` endpoint returns tax breakdown

**If backend provides taxes:**
```typescript
{/* Add before total */}
<div className="space-y-2 py-3 border-t border-gray-200">
  <div className="flex justify-between text-sm">
    <span className="text-gray-600">Subtotal</span>
    <span className="font-medium">
      {formatCurrency(parseFloat(price.subtotal))}
    </span>
  </div>
  <div className="flex justify-between text-sm">
    <span className="text-gray-600">GST (18%)</span>
    <span className="font-medium">
      {formatCurrency(parseFloat(price.gst))}
    </span>
  </div>
  <div className="flex justify-between text-sm">
    <span className="text-gray-600">Service Charges</span>
    <span className="font-medium">
      {formatCurrency(parseFloat(price.service_charges))}
    </span>
  </div>
</div>
```

**If backend doesn't provide taxes:**
- Add note: "All taxes and charges included"
- Or request backend enhancement

#### 1.3 Add "No Hidden Charges" Badge
**Location:** In the additional info section

**Implementation:**
```typescript
{/* Update additional info section */}
<div className="text-xs text-gray-500 text-center space-y-1">
  <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
    <CheckCircle className="w-4 h-4" />
    <span>No hidden charges</span>
  </div>
  <p>✓ Secure payment</p>
  <p>✓ Instant confirmation</p>
  <p>✓ 24/7 customer support</p>
</div>
```

#### 1.4 Enhance Price Breakdown Display
**Current:** Shows experiences, hotel multiplier, transport  
**Required:** Show base price + incremental additions

**Implementation:**
```typescript
{/* Enhanced breakdown */}
<div className="space-y-3">
  {/* Base Package Price */}
  <div className="flex justify-between text-sm">
    <span className="text-gray-700 font-medium">Base Package</span>
    <span className="font-medium">
      {formatCurrency(calculateBasePrice())}
    </span>
  </div>

  {/* Experiences (show as additions) */}
  <div>
    <div className="text-sm font-medium text-gray-700 mb-2">
      Selected Experiences
    </div>
    <div className="space-y-1 pl-4">
      {price.breakdown.experiences.map(exp => (
        <div key={exp.id} className="flex justify-between text-sm">
          <span className="text-gray-600">+ {exp.name}</span>
          <span className="text-green-600">
            +{formatCurrency(parseFloat(exp.price))}
          </span>
        </div>
      ))}
    </div>
  </div>

  {/* Hotel Tier Effect */}
  <div className="flex justify-between text-sm">
    <span className="text-gray-600">
      + {price.breakdown.hotel_tier.name}
    </span>
    <span className="text-blue-600">
      ×{price.breakdown.hotel_tier.price_multiplier}
    </span>
  </div>

  {/* Transport */}
  <div className="flex justify-between text-sm">
    <span className="text-gray-600">
      + {price.breakdown.transport.name}
    </span>
    <span className="text-green-600">
      +{formatCurrency(parseFloat(price.breakdown.transport.price))}
    </span>
  </div>
</div>
```

### Testing Checklist
- [ ] "Price per person" badge visible
- [ ] Taxes/charges shown (if available) or "included" note displayed
- [ ] "No hidden charges" badge visible
- [ ] Price breakdown shows incremental additions
- [ ] All prices formatted correctly
- [ ] Mobile responsive

---

## Phase 2: Click to Book Flow Refinement

### Current Status
Flow exists but needs better UX and clearer messaging.

### Required Changes

#### 2.1 Rename Button to "Book Now"
**File:** `frontend/shambit-frontend/src/components/packages/PriceCalculator.tsx`

**Current:** "Add to Package" / "Sign In to Book"  
**Required:** "Book Now"

**Implementation:**
```typescript
<button
  className={cn(
    sacredStyles.button.primary,
    "w-full flex items-center justify-center gap-2"
  )}
  onClick={handleAddToPackage}
  disabled={status === 'loading' || !isValid}
>
  {status === 'loading' ? (
    <Loader2 className="w-5 h-5 animate-spin" />
  ) : (
    <>
      <ShoppingCart className="w-5 h-5" />
      Book Now
    </>
  )}
</button>

{/* Add helper text below button */}
{status === 'unauthenticated' && (
  <p className="text-xs text-center text-gray-500 mt-2">
    You'll be asked to sign in to complete your booking
  </p>
)}
```

#### 2.2 Improve Selection Persistence
**Current:** Uses sessionStorage (works but fragile)  
**Recommendation:** Keep current implementation but add validation

**Enhancement:**
```typescript
// In package-selections.ts
export function validateSelections(selections: PackageSelections): boolean {
  return !!(
    selections.packageId &&
    selections.slug &&
    selections.experienceIds.length > 0 &&
    selections.hotelTierId &&
    selections.transportOptionId &&
    selections.idempotencyKey
  );
}

// Use in components
const selections = getSelections();
if (selections && validateSelections(selections)) {
  // Proceed
} else {
  // Clear invalid selections
  clearSelections();
  // Show error
}
```

#### 2.3 Add Loading State During Redirect
**File:** `frontend/shambit-frontend/src/components/packages/PriceCalculator.tsx`

**Implementation:**
```typescript
const [redirecting, setRedirecting] = useState(false);

const handleAddToPackage = () => {
  setRedirecting(true);
  
  if (status === 'unauthenticated') {
    sessionStorage.setItem('pendingBooking', JSON.stringify({
      packageSlug,
      packageId: packageData.id,
      packageName: packageData.name,
      selections,
      totalPrice: price?.total_price,
    }));
    router.push(`/login?returnUrl=${encodeURIComponent(`/packages/${packageSlug}`)}`);
  } else if (status === 'authenticated') {
    storeSelections(
      packageData.id,
      packageSlug,
      selections.experiences,
      selections.hotel!,
      selections.transport!
    );
    router.push(`/packages/${packageSlug}?intent=book`);
  }
};

// Update button
<button
  disabled={status === 'loading' || !isValid || redirecting}
>
  {redirecting ? (
    <>
      <Loader2 className="w-5 h-5 animate-spin" />
      Redirecting...
    </>
  ) : (
    // ... existing content
  )}
</button>
```

#### 2.4 Add Success Feedback After Booking
**File:** `frontend/shambit-frontend/src/app/review/[slug]/page.tsx`

**Current:** Redirects to `/dashboard/booking/${response.id}`  
**Enhancement:** Add toast notification or success page

**Option 1: Toast Notification (Recommended)**
```typescript
// Install: npm install react-hot-toast
import toast from 'react-hot-toast';

// After successful booking
toast.success('Booking created successfully!', {
  duration: 4000,
  position: 'top-center',
});

router.push(`/dashboard/bookings`);
```

**Option 2: Success Page**
Create `/booking/success/[id]/page.tsx` with:
- Booking confirmation
- Booking reference number
- Next steps
- Payment instructions

#### 2.5 Improve Error Handling
**Files:** All booking-related components

**Add Error Boundary:**
```typescript
// Create: src/components/common/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Wrap critical pages:**
```typescript
// In layout.tsx or page.tsx
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export default function Page() {
  return (
    <ErrorBoundary>
      {/* Page content */}
    </ErrorBoundary>
  );
}
```

### Testing Checklist
- [ ] "Book Now" button clearly labeled
- [ ] Unauthenticated users redirected to login
- [ ] Selections preserved during auth flow
- [ ] Authenticated users redirected to review page
- [ ] Loading states shown during transitions
- [ ] Success feedback after booking
- [ ] Error handling works correctly
- [ ] Mobile responsive

---

## Phase 3: Additional UX Enhancements (Optional but Recommended)

### 3.1 Add Toast Notification System
**Install:** `npm install react-hot-toast`

**Setup:**
```typescript
// In app/layout.tsx
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
```

**Usage:**
```typescript
import toast from 'react-hot-toast';

// Success
toast.success('Booking created successfully!');

// Error
toast.error('Failed to create booking. Please try again.');

// Loading
const toastId = toast.loading('Creating booking...');
// Later
toast.success('Booking created!', { id: toastId });
```

### 3.2 Add Loading Skeletons
**Create:** `src/components/common/PriceCalculatorSkeleton.tsx`

```typescript
export function PriceCalculatorSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="h-12 bg-gray-200 rounded"></div>
    </div>
  );
}
```

### 3.3 Add Empty States
**Create:** `src/components/common/EmptyState.tsx`

```typescript
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 text-gray-300 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
```

---

## Phase 4: Backend Verification (MANDATORY)

### 4.1 Test Price Calculation Endpoint
**Endpoint:** `POST /api/packages/packages/{slug}/calculate_price/`

**Test with curl:**
```bash
curl -X POST "http://localhost:8000/api/packages/packages/varanasi-spiritual-journey/calculate_price/" \
  -H "Content-Type: application/json" \
  -d '{
    "experience_ids": [1, 2],
    "hotel_tier_id": 1,
    "transport_option_id": 1
  }'
```

**Verify Response:**
- [ ] Contains `total_price`
- [ ] Contains `currency`
- [ ] Contains `breakdown` with experiences, hotel_tier, transport
- [ ] Check if `subtotal`, `gst`, `service_charges` exist
- [ ] Check if `pricing_note` mentions "per person"

**If taxes not in response:**
- Request backend enhancement OR
- Add frontend note: "All taxes included"

### 4.2 Test Booking Creation Endpoint
**Endpoint:** `POST /api/bookings/`

**Test with curl:**
```bash
curl -X POST "http://localhost:8000/api/bookings/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Idempotency-Key: test-key-123" \
  -d '{
    "package_id": 1,
    "experience_ids": [1, 2],
    "hotel_tier_id": 1,
    "transport_option_id": 1,
    "booking_date": "2026-02-25",
    "num_travelers": 2,
    "customer_name": "Test User",
    "customer_email": "test@example.com",
    "customer_phone": "+919876543210",
    "special_requests": ""
  }'
```

**Verify Response:**
- [ ] Returns booking ID
- [ ] Returns booking reference
- [ ] Returns status (DRAFT or PENDING_PAYMENT)
- [ ] Contains all submitted data

### 4.3 Verify Swagger Documentation
**Access:** `http://localhost:8000/api/schema/swagger-ui/`

**Check:**
- [ ] All endpoints documented
- [ ] Request/response schemas accurate
- [ ] Authentication requirements clear
- [ ] Error responses documented

---

## Phase 5: Quality Gates (MANDATORY BEFORE COMMIT)

### 5.1 Frontend Checks
```bash
# Navigate to frontend directory
cd frontend/shambit-frontend

# Run linter
npm run lint

# Run type checker
npm run type-check

# Build project
npm run build
```

**All must pass with zero errors.**

### 5.2 Manual Testing Checklist

#### Unauthenticated User Flow
- [ ] Browse packages without login
- [ ] View package details
- [ ] Customize package (experiences, hotel, transport)
- [ ] See live price updates
- [ ] Click "Book Now"
- [ ] Redirected to login
- [ ] After login, selections preserved
- [ ] Redirected to review page

#### Authenticated User Flow
- [ ] Login successful
- [ ] Browse packages
- [ ] Customize package
- [ ] See live price updates
- [ ] Click "Book Now"
- [ ] Redirected to review page
- [ ] Fill traveler details
- [ ] Submit booking
- [ ] Booking created successfully
- [ ] Redirected to bookings dashboard

#### Price Display
- [ ] Base price shown
- [ ] Experience prices shown as additions
- [ ] Hotel tier effect shown
- [ ] Transport price shown
- [ ] Subtotal calculated correctly
- [ ] Taxes shown (if available)
- [ ] Total price correct
- [ ] "Price per person" badge visible
- [ ] "No hidden charges" badge visible

#### Error Scenarios
- [ ] Invalid selections handled
- [ ] API errors shown to user
- [ ] Network errors handled
- [ ] Session expiry handled
- [ ] Form validation works

#### Mobile Responsiveness
- [ ] All pages responsive
- [ ] Buttons accessible
- [ ] Forms usable
- [ ] Price calculator sticky on desktop
- [ ] No horizontal scroll

### 5.3 Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## Phase 6: Deployment Checklist

### 6.1 Pre-Deployment
- [ ] All quality gates passed
- [ ] Manual testing complete
- [ ] No console errors
- [ ] No console warnings (critical ones)
- [ ] Environment variables set
- [ ] API endpoints configured

### 6.2 Staging Deployment
```bash
npm run deploy:staging
```

- [ ] Staging deployment successful
- [ ] Smoke tests on staging
- [ ] Performance check
- [ ] Security check

### 6.3 Production Deployment
```bash
npm run deploy:production
```

- [ ] Production deployment successful
- [ ] Health check passed
- [ ] Monitor for errors
- [ ] Rollback plan ready

---

## Timeline Estimate

### Phase 1: Price Display (2-3 hours)
- Backend verification: 30 min
- Frontend implementation: 1.5 hours
- Testing: 1 hour

### Phase 2: Book Flow (3-4 hours)
- Button updates: 30 min
- Flow refinement: 1.5 hours
- Error handling: 1 hour
- Testing: 1 hour

### Phase 3: UX Enhancements (2-3 hours)
- Toast system: 1 hour
- Loading states: 1 hour
- Empty states: 1 hour

### Phase 4: Backend Verification (1 hour)
- API testing: 30 min
- Documentation review: 30 min

### Phase 5: Quality Gates (2-3 hours)
- Automated checks: 30 min
- Manual testing: 1.5 hours
- Browser testing: 1 hour

### Phase 6: Deployment (1-2 hours)
- Staging: 30 min
- Production: 30 min
- Monitoring: 30 min

**Total Estimated Time: 11-16 hours**

---

## Risk Mitigation

### High Risk Items
1. **Backend API Changes Required**
   - Mitigation: Verify APIs first, adjust plan if needed
   - Fallback: Frontend-only solutions where possible

2. **Session/Token Management Issues**
   - Mitigation: Thorough testing of auth flows
   - Fallback: Use existing tokenManager as backup

3. **Mobile Responsiveness**
   - Mitigation: Test on real devices early
   - Fallback: Progressive enhancement approach

### Medium Risk Items
1. **Browser Compatibility**
   - Mitigation: Use polyfills, test early
   - Fallback: Graceful degradation

2. **Performance Issues**
   - Mitigation: Monitor bundle size, lazy load
   - Fallback: Optimize critical path

---

## Success Criteria

### Must Have (P0)
- ✅ All four requirements fully implemented
- ✅ Zero build errors
- ✅ Zero critical bugs
- ✅ All quality gates passed

### Should Have (P1)
- ✅ Toast notifications working
- ✅ Error boundaries in place
- ✅ Loading states everywhere
- ✅ Mobile responsive

### Nice to Have (P2)
- ⚠️ Empty states
- ⚠️ Loading skeletons
- ⚠️ Performance optimizations

---

## Next Actions

1. **Immediate:**
   - [ ] Review this plan with team
   - [ ] Get approval to proceed
   - [ ] Set up development environment

2. **Phase 1 Start:**
   - [ ] Test backend price calculation endpoint
   - [ ] Implement price display enhancements
   - [ ] Test changes

3. **Continuous:**
   - [ ] Document changes
   - [ ] Update tests
   - [ ] Monitor for issues

---

**Document Version:** 1.0  
**Last Updated:** February 17, 2026  
**Next Review:** After Phase 1 completion
