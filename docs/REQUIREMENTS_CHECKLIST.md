# Requirements Checklist - ShamBit Frontend

**Quick Reference Guide**  
**Date:** February 17, 2026

---

## Requirement 1: Login System ✅

### Status: COMPLETE

- [x] User can create account
- [x] User can log in (email/password)
- [x] User can log in (Google OAuth)
- [x] User can log in (Facebook OAuth - conditional)
- [x] User can log out
- [x] Session persists across page reloads
- [x] Protected routes redirect to login
- [x] Logged-in users redirected from auth pages
- [x] JWT tokens managed securely
- [x] Token refresh on expiry

### Files Involved
- `src/lib/auth.ts` - NextAuth configuration
- `src/middleware.ts` - Route protection
- `src/components/auth/LoginForm.tsx` - Login UI
- `src/components/auth/RegisterForm.tsx` - Registration UI

---

## Requirement 2: Browsing Without Login ✅

### Status: COMPLETE

- [x] Browse all packages without login
- [x] View package details without login
- [x] Customize experiences without login
- [x] Select hotel tier without login
- [x] Select transport option without login
- [x] See live price calculation without login
- [x] No booking created during browsing
- [x] Price updates in real-time

### Files Involved
- `src/app/packages/page.tsx` - Package listing
- `src/app/packages/[slug]/page.tsx` - Package detail
- `src/components/packages/PackageDetailClient.tsx` - Customization UI
- `src/components/packages/PriceCalculator.tsx` - Price display

---

## Requirement 3: Price Display Standards ⚠️

### Status: NEEDS ENHANCEMENT

#### What Works
- [x] Price calculation API integrated
- [x] Price breakdown shown
- [x] Experiences listed with prices
- [x] Hotel tier multiplier shown
- [x] Transport price shown
- [x] Total price calculated

#### What Needs Implementation
- [ ] **"Price is per person" badge** - MISSING
- [ ] **Taxes and charges breakdown** - NEEDS VERIFICATION
- [ ] **"No hidden charges" badge** - MISSING
- [ ] **Base package price display** - NEEDS ENHANCEMENT
- [ ] **Incremental price additions** - NEEDS ENHANCEMENT
- [ ] **Clear "Total Payable Amount" label** - PARTIAL

### Required Display Elements

```
✓ Base Package Price (Per Person)
✓ + Experience 1: ₹X,XXX
✓ + Experience 2: ₹X,XXX
✓ + Hotel Tier (Multiplier Effect)
✓ + Transport: ₹X,XXX
✓ = Subtotal: ₹XX,XXX
✓ + GST (18%): ₹X,XXX
✓ + Service Charges: ₹XXX
✓ = Total Payable Amount: ₹XX,XXX

[Badge] Price is per person
[Badge] No hidden charges
```

### Files to Modify
- `src/components/packages/PriceCalculator.tsx` - Main implementation

---

## Requirement 4: Click to Book Flow ⚠️

### Status: NEEDS REFINEMENT

#### What Works
- [x] "Book Now" button exists (labeled "Add to Package")
- [x] Unauthenticated users redirected to login
- [x] Selections stored in sessionStorage
- [x] Post-login redirect works
- [x] Review page exists and functional
- [x] Booking creation API integrated
- [x] Traveler details form works

#### What Needs Implementation
- [ ] **Button labeled "Book Now"** - NEEDS RENAME
- [ ] **Clear user feedback during flow** - NEEDS ENHANCEMENT
- [ ] **Loading states during transitions** - PARTIAL
- [ ] **Success feedback after booking** - MISSING
- [ ] **Better error handling** - NEEDS ENHANCEMENT

### Required Flow

```
1. User on /packages/[slug]
   ✓ Can customize package
   ✓ Can see live price

2. User clicks "Book Now"
   ⚠️ Button says "Add to Package" (needs rename)
   ✓ Selections stored

3. IF not logged in:
   ✓ Redirect to /login
   ✓ Selections preserved
   ✓ After login, redirect back
   ⚠️ Need better loading feedback

4. IF logged in:
   ✓ Redirect to /review/[slug]
   ⚠️ Need loading state

5. Review page:
   ✓ Shows package summary
   ✓ Shows price breakdown
   ✓ Collects traveler details
   ✓ Collects contact info

6. Submit booking:
   ✓ Creates booking via API
   ✓ Redirects to dashboard
   ⚠️ Need success feedback
   ⚠️ Need better error handling
```

### Files to Modify
- `src/components/packages/PriceCalculator.tsx` - Button and flow
- `src/app/review/[slug]/page.tsx` - Success feedback

---

## Priority Matrix

### P0 - Critical (Must Fix)
1. [ ] Add "Price is per person" badge
2. [ ] Add "No hidden charges" badge
3. [ ] Rename button to "Book Now"
4. [ ] Add loading states during booking flow
5. [ ] Add success feedback after booking
6. [ ] Verify and display taxes/charges

### P1 - High (Should Fix)
1. [ ] Add toast notification system
2. [ ] Improve error handling UI
3. [ ] Add error boundaries
4. [ ] Enhance price breakdown display

### P2 - Medium (Nice to Have)
1. [ ] Add loading skeletons
2. [ ] Add empty states
3. [ ] Improve mobile responsiveness
4. [ ] Add retry mechanisms

---

## Testing Checklist

### Functional Testing

#### Unauthenticated User
- [ ] Can browse packages
- [ ] Can view package details
- [ ] Can customize package
- [ ] Can see price updates
- [ ] Clicking "Book Now" redirects to login
- [ ] After login, selections preserved
- [ ] Redirected to review page

#### Authenticated User
- [ ] Can browse packages
- [ ] Can customize package
- [ ] Clicking "Book Now" goes to review
- [ ] Can fill traveler details
- [ ] Can submit booking
- [ ] Booking created successfully
- [ ] Redirected to dashboard
- [ ] Success message shown

#### Price Display
- [ ] Base price visible
- [ ] Experience prices shown
- [ ] Hotel tier effect shown
- [ ] Transport price shown
- [ ] Total calculated correctly
- [ ] "Per person" badge visible
- [ ] "No hidden charges" visible
- [ ] Taxes shown (if available)

#### Error Handling
- [ ] Invalid selections handled
- [ ] API errors shown
- [ ] Network errors handled
- [ ] Form validation works
- [ ] Session expiry handled

### Non-Functional Testing

#### Performance
- [ ] Page loads < 3 seconds
- [ ] Price calculation < 1 second
- [ ] No layout shift
- [ ] Smooth transitions

#### Responsiveness
- [ ] Works on mobile (320px+)
- [ ] Works on tablet (768px+)
- [ ] Works on desktop (1024px+)
- [ ] No horizontal scroll
- [ ] Touch targets adequate

#### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari
- [ ] Mobile Chrome

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Color contrast adequate
- [ ] Focus indicators visible

---

## Quality Gates

### Before Commit
```bash
# All must pass
npm run lint          # ✓ Zero errors
npm run type-check    # ✓ Zero errors
npm run build         # ✓ Success
```

### Before Deployment
- [ ] All P0 items complete
- [ ] All tests passing
- [ ] No console errors
- [ ] Manual testing complete
- [ ] Code reviewed
- [ ] Documentation updated

---

## Quick Commands

### Development
```bash
cd frontend/shambit-frontend
npm run dev                    # Start dev server
npm run lint                   # Run linter
npm run type-check             # Check types
npm run build                  # Build for production
```

### Testing Backend APIs
```bash
# Price calculation
curl -X POST "http://localhost:8000/api/packages/packages/SLUG/calculate_price/" \
  -H "Content-Type: application/json" \
  -d '{"experience_ids":[1,2],"hotel_tier_id":1,"transport_option_id":1}'

# Create booking
curl -X POST "http://localhost:8000/api/bookings/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"package_id":1,"experience_ids":[1,2],...}'
```

---

## Key Files Reference

### Authentication
- `src/lib/auth.ts` - NextAuth config
- `src/middleware.ts` - Route protection
- `src/lib/tokenManager.ts` - Token management

### API Integration
- `src/lib/api.ts` - API service layer
- `src/lib/package-selections.ts` - Selection storage

### Package Pages
- `src/app/packages/page.tsx` - Listing
- `src/app/packages/[slug]/page.tsx` - Detail
- `src/app/review/[slug]/page.tsx` - Review

### Components
- `src/components/packages/PriceCalculator.tsx` - Price display
- `src/components/packages/PackageDetailClient.tsx` - Customization
- `src/components/auth/LoginForm.tsx` - Login

---

## Contact & Support

### Documentation
- Gap Analysis: `docs/GAP_ANALYSIS.md`
- Implementation Plan: `docs/IMPLEMENTATION_PLAN.md`
- This Checklist: `docs/REQUIREMENTS_CHECKLIST.md`

### API Documentation
- Swagger UI: `http://localhost:8000/api/schema/swagger-ui/`
- ReDoc: `http://localhost:8000/api/schema/redoc/`
- Endpoints: `backend/all_endpoints.json`

---

**Last Updated:** February 17, 2026  
**Status:** Ready for Implementation
