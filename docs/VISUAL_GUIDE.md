# Visual Implementation Guide

**Date:** February 17, 2026  
**Purpose:** Visual reference for implemented features

---

## Price Calculator - Before & After

### BEFORE Implementation
```
┌─────────────────────────────────────┐
│ Your Package Summary                │
├─────────────────────────────────────┤
│                                     │
│ Selected Experiences (2)            │
│   Ganga Aarti          ₹500         │
│   Temple Tour          ₹800         │
│                                     │
│ Budget Hotel           ×1.0         │
│ Shared Cab             ₹1,000       │
│                                     │
│ Total                  ₹15,000      │
│                                     │
│ [Add to Package]                    │
│                                     │
└─────────────────────────────────────┘
```

### AFTER Implementation ✅
```
┌─────────────────────────────────────┐
│ Your Package Summary                │
├─────────────────────────────────────┤
│                                     │
│ Selected Experiences (2)            │
│   Ganga Aarti          ₹500         │
│   Temple Tour          ₹800         │
│                                     │
│ ─────────────────────────────────   │
│                                     │
│ Budget Hotel           ×1.0         │
│ Shared Cab             ₹1,000       │
│                                     │
│ ─────────────────────────────────   │
│                                     │
│ Subtotal              ₹14,000       │
│                                     │
│ Taxes & Charges                     │
│   + GST (18%)         +₹2,520       │
│   + Service Fee       +₹480         │
│                                     │
│ ═════════════════════════════════   │
│                                     │
│ Total Payable         ₹15,000       │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 👤 Price is per person          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ✓ All taxes included •          │ │
│ │   No hidden charges             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Price includes all taxes and fees   │
│                                     │
│ [🛒 Book Now]                       │
│                                     │
│ You'll be asked to sign in to       │
│ complete your booking               │
│                                     │
│ ✓ Secure payment                    │
│ ✓ Instant confirmation              │
│ ✓ 24/7 customer support             │
│                                     │
└─────────────────────────────────────┘
```

---

## Key Visual Changes

### 1. Price Per Person Badge 🟠

```
┌─────────────────────────────────────┐
│ 👤 Price is per person              │
└─────────────────────────────────────┘
```

**Styling:**
- Background: Orange (#FFF7ED)
- Border: Orange (#FED7AA)
- Text: Orange (#9A3412)
- Icon: User icon
- Padding: 12px
- Border radius: 8px

### 2. No Hidden Charges Badge 🟢

```
┌─────────────────────────────────────┐
│ ✓ All taxes included •              │
│   No hidden charges                 │
└─────────────────────────────────────┘
```

**Styling:**
- Background: Green (#F0FDF4)
- Border: Green (#BBF7D0)
- Text: Green (#166534)
- Icon: Checkmark
- Padding: 12px
- Border radius: 8px

### 3. Enhanced Price Breakdown 📊

```
Selected Experiences (2)
  Ganga Aarti          ₹500
  Temple Tour          ₹800

─────────────────────────────────

Budget Hotel           ×1.0
Shared Cab             ₹1,000

─────────────────────────────────

Subtotal              ₹14,000

Taxes & Charges
  + GST (18%)         +₹2,520
  + Service Fee       +₹480

═════════════════════════════════

Total Payable         ₹15,000
```

**Features:**
- Clear sections with dividers
- Experiences listed individually
- Hotel tier multiplier shown
- Transport as addition
- Taxes broken down
- Color-coded amounts

### 4. Book Now Button 🛒

```
┌─────────────────────────────────────┐
│         🛒 Book Now                 │
└─────────────────────────────────────┘
```

**States:**

**Normal:**
```
[🛒 Book Now]
```

**Loading:**
```
[⏳ Loading...]
```

**Redirecting:**
```
[⏳ Redirecting...]
```

**Disabled:**
```
[🛒 Book Now] (grayed out)
```

---

## Toast Notifications

### Success Toast 🟢
```
┌─────────────────────────────────────┐
│ ✓ Booking created successfully!    │
└─────────────────────────────────────┘
```

### Error Toast 🔴
```
┌─────────────────────────────────────┐
│ ✗ Failed to create booking          │
└─────────────────────────────────────┘
```

### Loading Toast ⏳
```
┌─────────────────────────────────────┐
│ ⏳ Creating your booking...         │
└─────────────────────────────────────┘
```

**Position:** Top-center  
**Duration:** 4 seconds (auto-dismiss)  
**Animation:** Slide in from top

---

## User Flow Visualization

### Unauthenticated User Flow

```
┌─────────────┐
│   Browse    │
│  Packages   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Select    │
│  Package &  │
│  Customize  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Click       │
│ "Book Now"  │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌──────────────────┐
│   Toast:    │────▶│ Redirecting to   │
│ Redirecting │     │ login...         │
└──────┬──────┘     └──────────────────┘
       │
       ▼
┌─────────────┐
│   Login     │
│    Page     │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌──────────────────┐
│  Redirect   │────▶│ Selections       │
│    Back     │     │ Preserved!       │
└──────┬──────┘     └──────────────────┘
       │
       ▼
┌─────────────┐
│   Auto      │
│  Redirect   │
│  to Review  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Fill     │
│  Traveler   │
│   Details   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Submit    │
│   Booking   │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌──────────────────┐
│   Toast:    │────▶│ Booking created  │
│  Success!   │     │ successfully!    │
└──────┬──────┘     └──────────────────┘
       │
       ▼
┌─────────────┐
│  Bookings   │
│  Dashboard  │
└─────────────┘
```

### Authenticated User Flow

```
┌─────────────┐
│   Already   │
│  Logged In  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Browse    │
│  Packages   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Select    │
│  Package &  │
│  Customize  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Click       │
│ "Book Now"  │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌──────────────────┐
│   Toast:    │────▶│ Preparing your   │
│ Preparing   │     │ booking...       │
└──────┬──────┘     └──────────────────┘
       │
       ▼
┌─────────────┐
│  Immediate  │
│  Redirect   │
│  to Review  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Fill     │
│  Traveler   │
│   Details   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Submit    │
│   Booking   │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌──────────────────┐
│   Toast:    │────▶│ Booking created  │
│  Success!   │     │ successfully!    │
└──────┬──────┘     └──────────────────┘
       │
       ▼
┌─────────────┐
│  Bookings   │
│  Dashboard  │
└─────────────┘
```

---

## Mobile View

### Price Calculator (Mobile)

```
┌───────────────────────┐
│ Your Package Summary  │
├───────────────────────┤
│                       │
│ Experiences (2)       │
│  Ganga Aarti    ₹500  │
│  Temple Tour    ₹800  │
│                       │
│ Budget Hotel    ×1.0  │
│ Shared Cab    ₹1,000  │
│                       │
│ Subtotal     ₹14,000  │
│                       │
│ Taxes & Charges       │
│  + GST (18%) +₹2,520  │
│                       │
│ Total        ₹15,000  │
│                       │
│ ┌───────────────────┐ │
│ │ 👤 Per person     │ │
│ └───────────────────┘ │
│                       │
│ ┌───────────────────┐ │
│ │ ✓ No hidden       │ │
│ │   charges         │ │
│ └───────────────────┘ │
│                       │
│ [🛒 Book Now]         │
│                       │
│ Sign in to complete   │
│                       │
└───────────────────────┘
```

**Features:**
- Sticky on scroll
- Full width button
- Compact badges
- Touch-friendly

---

## Color Palette

### Primary Colors
- **Orange:** #EA580C (Primary actions)
- **Green:** #16A34A (Success states)
- **Red:** #DC2626 (Error states)
- **Blue:** #2563EB (Info states)

### Background Colors
- **Orange Light:** #FFF7ED
- **Green Light:** #F0FDF4
- **Red Light:** #FEF2F2
- **Gray Light:** #F9FAFB

### Border Colors
- **Orange:** #FED7AA
- **Green:** #BBF7D0
- **Red:** #FECACA
- **Gray:** #E5E7EB

### Text Colors
- **Orange Dark:** #9A3412
- **Green Dark:** #166534
- **Red Dark:** #991B1B
- **Gray Dark:** #111827

---

## Typography

### Headings
- **H1:** 36px, Bold, Playfair Display
- **H2:** 30px, Bold, Playfair Display
- **H3:** 24px, Semibold, Playfair Display
- **H4:** 20px, Semibold, Source Serif

### Body Text
- **Large:** 18px, Regular, Source Serif
- **Normal:** 16px, Regular, Source Serif
- **Small:** 14px, Regular, Source Serif
- **Tiny:** 12px, Regular, Source Serif

### Prices
- **Total:** 30px, Bold, Source Serif
- **Subtotal:** 20px, Semibold, Source Serif
- **Items:** 16px, Medium, Source Serif

---

## Spacing

### Padding
- **Large:** 24px
- **Medium:** 16px
- **Small:** 12px
- **Tiny:** 8px

### Margins
- **Section:** 32px
- **Component:** 24px
- **Element:** 16px
- **Item:** 8px

### Border Radius
- **Large:** 12px
- **Medium:** 8px
- **Small:** 6px
- **Tiny:** 4px

---

## Animations

### Toast Slide In
```
Duration: 300ms
Easing: ease-out
Transform: translateY(-100%) → translateY(0)
```

### Button Hover
```
Duration: 200ms
Easing: ease-in-out
Transform: scale(1) → scale(1.02)
```

### Loading Spinner
```
Duration: 1000ms
Easing: linear
Transform: rotate(0deg) → rotate(360deg)
Infinite loop
```

---

## Accessibility

### Keyboard Navigation
- **Tab:** Move to next element
- **Shift+Tab:** Move to previous element
- **Enter/Space:** Activate button
- **Escape:** Close modal/toast

### Screen Reader
- All images have alt text
- Form labels associated
- Error messages announced
- Loading states announced

### Color Contrast
- All text meets WCAG AA
- Focus indicators visible
- Interactive elements clear

---

## Responsive Breakpoints

```
Mobile:    320px - 767px
Tablet:    768px - 1023px
Desktop:   1024px - 1439px
Large:     1440px+
```

### Mobile (< 768px)
- Single column layout
- Full width buttons
- Compact badges
- Sticky price calculator

### Tablet (768px - 1023px)
- Two column layout
- Larger touch targets
- Expanded badges

### Desktop (1024px+)
- Three column layout
- Hover effects
- Sticky sidebar
- Optimal spacing

---

## Browser Support

### Supported Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Safari (iOS 14+)
- ✅ Mobile Chrome (Android 10+)

### Features Used
- CSS Grid
- Flexbox
- CSS Variables
- Modern JavaScript (ES2020)
- React 19
- Next.js 16

---

## Performance Targets

### Core Web Vitals
- **LCP:** < 2.5s (Largest Contentful Paint)
- **FID:** < 100ms (First Input Delay)
- **CLS:** < 0.1 (Cumulative Layout Shift)

### Load Times
- **FCP:** < 1.5s (First Contentful Paint)
- **TTI:** < 3.5s (Time to Interactive)
- **Speed Index:** < 3.0s

### Bundle Size
- **Initial JS:** < 200KB (gzipped)
- **Total JS:** < 500KB (gzipped)
- **CSS:** < 50KB (gzipped)

---

## Testing Scenarios

### Visual Testing
1. **Price Calculator**
   - [ ] Badges visible
   - [ ] Colors correct
   - [ ] Spacing consistent
   - [ ] Mobile responsive

2. **Toast Notifications**
   - [ ] Appear at top-center
   - [ ] Correct colors
   - [ ] Auto-dismiss
   - [ ] Stack correctly

3. **Buttons**
   - [ ] Correct labels
   - [ ] Icons visible
   - [ ] States work
   - [ ] Hover effects

### Interaction Testing
1. **Click "Book Now"**
   - [ ] Redirects correctly
   - [ ] Toast appears
   - [ ] Loading state shows
   - [ ] Selections preserved

2. **Submit Booking**
   - [ ] Validation works
   - [ ] Loading toast shows
   - [ ] Success toast shows
   - [ ] Redirects to dashboard

3. **Error Handling**
   - [ ] Error toast shows
   - [ ] Error message clear
   - [ ] Can retry
   - [ ] No crash

---

## Quick Reference

### Component Locations
```
PriceCalculator:
  src/components/packages/PriceCalculator.tsx

Review Page:
  src/app/review/[slug]/page.tsx

Error Boundary:
  src/components/common/ErrorBoundary.tsx

Toast Config:
  src/app/layout.tsx
```

### Key Functions
```typescript
// Validate selections
validateSelections(selections)

// Store selections
storeSelections(packageId, slug, experiences, hotel, transport)

// Get selections
getSelections()

// Clear selections
clearSelections()

// Show toast
toast.success('Message')
toast.error('Message')
toast.loading('Message')
```

---

**End of Visual Guide**

For implementation details, see:
- `IMPLEMENTATION_PLAN.md`
- `IMPLEMENTATION_SUMMARY.md`
- `IMPLEMENTATION_REPORT.md`
