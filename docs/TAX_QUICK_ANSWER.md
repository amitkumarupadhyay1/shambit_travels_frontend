# How Taxes Are Added - Quick Answer

**Question:** How are taxes added in the ShamBit platform?

---

## Short Answer

Taxes are added through the **Pricing Rules system** in the backend. They are applied as **MARKUP rules** after the base price calculation, but the tax breakdown is **NOT currently exposed to the frontend**.

---

## Visual Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    PRICE CALCULATION FLOW                    │
└─────────────────────────────────────────────────────────────┘

Step 1: Base Calculation
┌──────────────────────────────────────┐
│ Experience 1: ₹2,500                 │
│ Experience 2: ₹1,500                 │
│ Transport:    ₹3,000                 │
├──────────────────────────────────────┤
│ Subtotal:     ₹7,000                 │
└──────────────────────────────────────┘
                 ↓
Step 2: Hotel Multiplier
┌──────────────────────────────────────┐
│ Subtotal × 2.5 (4-Star Hotel)       │
├──────────────────────────────────────┤
│ After Hotel:  ₹17,500                │
└──────────────────────────────────────┘
                 ↓
Step 3: Apply Pricing Rules (TAXES HERE!)
┌──────────────────────────────────────┐
│ + GST (18%):        ₹3,150           │
│ + Service Charge:   ₹500             │
├──────────────────────────────────────┤
│ FINAL TOTAL:        ₹21,150          │
└──────────────────────────────────────┘
```

---

## Current Problem

### What Backend Calculates:
```json
{
  "base_experience_total": "4000.00",
  "transport_cost": "3000.00",
  "subtotal_before_hotel": "7000.00",
  "subtotal_after_hotel": "17500.00",
  "applied_rules": [
    {
      "name": "GST (18%)",
      "type": "MARKUP",
      "amount_applied": "3150.00"
    },
    {
      "name": "Service Charge",
      "type": "MARKUP",
      "amount_applied": "500.00"
    }
  ],
  "final_total": "21150.00"
}
```

### What Frontend Receives:
```json
{
  "total_price": "21150.00",
  "breakdown": {
    "experiences": [...],
    "hotel_tier": {...},
    "transport": {...}
  }
}
```

### What Frontend Can't Show:
- ❌ Where did the extra ₹3,650 come from?
- ❌ What is the GST amount?
- ❌ What is the service charge?
- ❌ What is the subtotal before taxes?

---

## Solution

### Backend Change (2 hours)
**File:** `backend/apps/packages/views.py`

Add these fields to the API response:
```python
return Response({
    "total_price": str(breakdown["final_total"]),
    "breakdown": {
        # ... existing fields ...
        "subtotal_after_hotel": str(breakdown["subtotal_after_hotel"]),
        "applied_rules": breakdown["applied_rules"],  # NEW!
        "total_markup": str(breakdown["total_markup"]),  # NEW!
    }
})
```

### Frontend Change (2 hours)
**File:** `frontend/shambit-frontend/src/components/packages/PriceCalculator.tsx`

Display the tax breakdown:
```tsx
{/* Subtotal */}
<div className="flex justify-between">
  <span>Subtotal</span>
  <span>₹17,500</span>
</div>

{/* Taxes & Charges */}
{price.breakdown.applied_rules?.map(rule => (
  <div className="flex justify-between text-sm">
    <span>+ {rule.name}</span>
    <span>₹{rule.amount_applied}</span>
  </div>
))}

{/* Total */}
<div className="flex justify-between font-bold">
  <span>Total Payable</span>
  <span>₹21,150</span>
</div>
```

---

## How to Add Tax Rules

### Option 1: Django Admin
1. Go to `/admin/pricing_engine/pricingrule/`
2. Click "Add Pricing Rule"
3. Create GST rule:
   - Name: "GST (18%)"
   - Type: Markup
   - Value: 18.00
   - Is Percentage: ✓

### Option 2: Django Shell
```python
python manage.py shell

from pricing_engine.models import PricingRule
from django.utils import timezone

PricingRule.objects.create(
    name="GST (18%)",
    rule_type="MARKUP",
    value=18.00,
    is_percentage=True,
    active_from=timezone.now(),
    is_active=True
)
```

---

## Key Points

1. **Taxes are NOT hardcoded** - they're flexible pricing rules
2. **Backend already calculates taxes** - just not exposed to frontend
3. **Frontend should NEVER calculate taxes** - always trust backend
4. **Solution is simple** - just expose existing backend data
5. **Estimated time: 4-5 hours** total (backend + frontend)

---

## Next Steps

1. ✅ Read full guide: `TAX_IMPLEMENTATION_GUIDE.md`
2. ⚠️ Create tax pricing rules in backend
3. ⚠️ Modify backend API response
4. ⚠️ Update frontend TypeScript types
5. ⚠️ Update PriceCalculator component
6. ⚠️ Test thoroughly

---

**For detailed implementation steps, see:** `TAX_IMPLEMENTATION_GUIDE.md`
