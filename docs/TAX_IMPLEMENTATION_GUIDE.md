# Tax Implementation Guide - ShamBit Platform

**Date:** February 17, 2026  
**Status:** Current Implementation Analysis

---

## How Taxes Are Currently Added

### TL;DR

**Taxes are NOT explicitly separated in the current implementation.** Instead, they are included as **Pricing Rules** (markups) in the backend pricing engine. The system uses a flexible pricing rule system that can add markups (including taxes) or discounts to the base price.

---

## Current Architecture

### 1. Price Calculation Flow

```
Base Price Calculation:
1. Sum of selected experiences base prices
2. + Transport option base price
3. = Subtotal before hotel
4. × Hotel tier multiplier
5. = Subtotal after hotel
6. + Apply pricing rules (markups/discounts)
7. = Final total
```

### 2. Backend Implementation

#### Location: `backend/apps/pricing_engine/services/pricing_service.py`

```python
def get_price_breakdown(package, experiences, hotel_tier, transport_option):
    # 1. Base experiences price
    base_experience_total = sum(exp.base_price for exp in experiences)
    
    # 2. Transport cost
    transport_cost = transport_option.base_price
    
    # 3. Subtotal before hotel multiplier
    subtotal_before_hotel = base_experience_total + transport_cost
    
    # 4. Apply Hotel Multiplier
    subtotal_after_hotel = subtotal_before_hotel * hotel_tier.price_multiplier
    
    # 5. Apply Pricing Rules (THIS IS WHERE TAXES ARE ADDED)
    applicable_rules = PricingService.get_applicable_rules(package)
    
    for rule in applicable_rules:
        if rule.rule_type == "MARKUP":
            if rule.is_percentage:
                rule_amount = current_total * (rule.value / 100)
            else:
                rule_amount = rule.value
            current_total += rule_amount
        elif rule.rule_type == "DISCOUNT":
            # Apply discounts
            current_total -= rule_amount
    
    return final_total
```

### 3. Pricing Rule Model

#### Location: `backend/apps/pricing_engine/models.py`

```python
class PricingRule(models.Model):
    RULE_TYPES = [
        ("MARKUP", "Markup"),      # Used for taxes, service charges, etc.
        ("DISCOUNT", "Discount"),  # Used for promotions
    ]
    
    name = models.CharField(max_length=100)  # e.g., "GST 18%", "Service Charge"
    rule_type = models.CharField(max_length=50, choices=RULE_TYPES)
    value = models.DecimalField(max_digits=10, decimal_places=2)  # e.g., 18.00 for 18%
    is_percentage = models.BooleanField(default=True)  # True for %, False for fixed amount
    
    # Optional: Apply to specific package or all packages
    target_package = models.ForeignKey(Package, null=True, blank=True)
    
    # Date range for rule validity
    active_from = models.DateTimeField()
    active_to = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
```

---

## Current API Response

### Endpoint: `POST /api/packages/packages/{slug}/calculate_price/`

**Current Response Structure:**
```json
{
  "total_price": "28500.00",
  "currency": "INR",
  "breakdown": {
    "experiences": [
      {
        "id": 1,
        "name": "Gateway of India Tour",
        "price": "2500.00"
      }
    ],
    "hotel_tier": {
      "id": 2,
      "name": "4-Star Hotels",
      "price_multiplier": "2.5"
    },
    "transport": {
      "id": 1,
      "name": "AC Cab",
      "price": "3000.00"
    }
  },
  "pricing_note": "This is an estimate. Final price calculated at checkout."
}
```

**What's Missing:**
- ❌ No `subtotal` field
- ❌ No `taxes` or `gst` field
- ❌ No `service_charges` field
- ❌ No `applied_rules` field in response (exists in backend but not exposed)

---

## Problem: Taxes Not Visible to Frontend

### Current Situation

1. **Backend calculates taxes** via pricing rules
2. **Backend includes taxes** in `total_price`
3. **Frontend receives only** the final total
4. **Frontend cannot display** tax breakdown

### Example Scenario

**Backend Calculation:**
```
Base experiences: ₹10,000
Transport: ₹3,000
Subtotal before hotel: ₹13,000
Hotel multiplier (2.5x): ₹32,500
Subtotal after hotel: ₹32,500

Pricing Rules Applied:
+ GST (18%): ₹5,850
+ Service Charge (₹500): ₹500

Final Total: ₹38,850
```

**Frontend Receives:**
```json
{
  "total_price": "38850.00",
  "breakdown": {
    "experiences": [...],
    "hotel_tier": {...},
    "transport": {...}
  }
}
```

**Frontend Cannot Show:**
- Where did the extra ₹6,350 come from?
- What is GST amount?
- What is service charge?

---

## Solution Options

### Option 1: Enhance Backend API Response (RECOMMENDED)

**Modify:** `backend/apps/packages/views.py` - `calculate_price` action

**Change the response to include detailed breakdown:**

```python
@action(detail=True, methods=["post"], permission_classes=[AllowAny])
def calculate_price(self, request, slug=None):
    # ... existing validation code ...
    
    # Get detailed breakdown from PricingService
    breakdown = PricingService.get_price_breakdown(
        package, experiences, hotel_tier, transport_option
    )
    
    # Return enhanced response
    return Response({
        "total_price": str(breakdown["final_total"]),
        "currency": "INR",
        "breakdown": {
            "experiences": [
                {
                    "id": exp.id,
                    "name": exp.name,
                    "price": str(exp.base_price),
                }
                for exp in experiences
            ],
            "hotel_tier": {
                "id": hotel_tier.id,
                "name": hotel_tier.name,
                "price_multiplier": str(hotel_tier.price_multiplier),
            },
            "transport": {
                "id": transport_option.id,
                "name": transport_option.name,
                "price": str(transport_option.base_price),
            },
            # NEW: Add detailed pricing breakdown
            "subtotal_before_hotel": str(breakdown["subtotal_before_hotel"]),
            "subtotal_after_hotel": str(breakdown["subtotal_after_hotel"]),
            "applied_rules": breakdown["applied_rules"],  # Includes GST, service charges
            "total_markup": str(breakdown["total_markup"]),
            "total_discount": str(breakdown["total_discount"]),
        },
        "pricing_note": "Price includes all taxes and charges. No hidden fees.",
    })
```

**New Response Structure:**
```json
{
  "total_price": "38850.00",
  "currency": "INR",
  "breakdown": {
    "experiences": [...],
    "hotel_tier": {...},
    "transport": {...},
    "subtotal_before_hotel": "13000.00",
    "subtotal_after_hotel": "32500.00",
    "applied_rules": [
      {
        "name": "GST (18%)",
        "type": "MARKUP",
        "value": "18.00",
        "is_percentage": true,
        "amount_applied": "5850.00"
      },
      {
        "name": "Service Charge",
        "type": "MARKUP",
        "value": "500.00",
        "is_percentage": false,
        "amount_applied": "500.00"
      }
    ],
    "total_markup": "6350.00",
    "total_discount": "0.00"
  },
  "pricing_note": "Price includes all taxes and charges. No hidden fees."
}
```

**Pros:**
- ✅ Complete transparency
- ✅ Frontend can display detailed breakdown
- ✅ Flexible (works with any pricing rules)
- ✅ No hardcoded tax rates

**Cons:**
- ⚠️ Requires backend changes
- ⚠️ Need to update API documentation
- ⚠️ Need to update frontend TypeScript types

---

### Option 2: Create Specific Tax Fields (Alternative)

**If you want explicit tax fields instead of generic rules:**

**Backend Response:**
```json
{
  "total_price": "38850.00",
  "currency": "INR",
  "breakdown": {
    "experiences": [...],
    "hotel_tier": {...},
    "transport": {...},
    "subtotal": "32500.00",
    "gst": {
      "rate": "18",
      "amount": "5850.00"
    },
    "service_charges": "500.00",
    "other_charges": "0.00"
  }
}
```

**Implementation:**
```python
# In calculate_price action
def calculate_price(self, request, slug=None):
    # ... existing code ...
    
    breakdown = PricingService.get_price_breakdown(...)
    
    # Extract tax-specific rules
    gst_rule = next(
        (r for r in breakdown["applied_rules"] if "GST" in r["name"]),
        None
    )
    service_charge_rule = next(
        (r for r in breakdown["applied_rules"] if "Service" in r["name"]),
        None
    )
    
    return Response({
        "total_price": str(breakdown["final_total"]),
        "currency": "INR",
        "breakdown": {
            # ... existing fields ...
            "subtotal": str(breakdown["subtotal_after_hotel"]),
            "gst": {
                "rate": str(gst_rule["value"]) if gst_rule else "0",
                "amount": str(gst_rule["amount_applied"]) if gst_rule else "0.00"
            },
            "service_charges": str(service_charge_rule["amount_applied"]) if service_charge_rule else "0.00",
        }
    })
```

**Pros:**
- ✅ Explicit tax fields
- ✅ Easy for frontend to display
- ✅ Clear separation of concerns

**Cons:**
- ⚠️ Less flexible (hardcoded field names)
- ⚠️ Requires backend changes
- ⚠️ Assumes specific rule names

---

### Option 3: Frontend Estimation (NOT RECOMMENDED)

**Calculate taxes on frontend based on assumptions:**

```typescript
// DON'T DO THIS - Just for illustration
const estimatedGST = subtotal * 0.18;
const estimatedServiceCharge = 500;
const estimatedTotal = subtotal + estimatedGST + estimatedServiceCharge;
```

**Why NOT Recommended:**
- ❌ Frontend should NEVER calculate prices
- ❌ Tax rates may change
- ❌ Pricing rules may vary by package
- ❌ Violates security principle (backend is source of truth)
- ❌ Can lead to discrepancies

---

## Recommended Implementation Plan

### Phase 1: Backend Enhancement (2-3 hours)

#### Step 1: Modify API Response
**File:** `backend/apps/packages/views.py`

```python
@action(detail=True, methods=["post"], permission_classes=[AllowAny])
def calculate_price(self, request, slug=None):
    # ... existing validation ...
    
    # Get detailed breakdown
    breakdown = PricingService.get_price_breakdown(
        package, experiences, hotel_tier, transport_option
    )
    
    # Enhanced response
    return Response({
        "total_price": str(breakdown["final_total"]),
        "currency": "INR",
        "breakdown": {
            "experiences": [
                {"id": exp.id, "name": exp.name, "price": str(exp.base_price)}
                for exp in experiences
            ],
            "hotel_tier": {
                "id": hotel_tier.id,
                "name": hotel_tier.name,
                "price_multiplier": str(hotel_tier.price_multiplier),
            },
            "transport": {
                "id": transport_option.id,
                "name": transport_option.name,
                "price": str(transport_option.base_price),
            },
            # NEW FIELDS
            "subtotal_before_hotel": str(breakdown["subtotal_before_hotel"]),
            "subtotal_after_hotel": str(breakdown["subtotal_after_hotel"]),
            "applied_rules": breakdown["applied_rules"],
            "total_markup": str(breakdown["total_markup"]),
            "total_discount": str(breakdown["total_discount"]),
        },
        "pricing_note": "Price includes all applicable taxes and charges.",
    })
```

#### Step 2: Update Swagger Documentation
**File:** `backend/apps/packages/views.py`

Update the `@extend_schema` decorator for `calculate_price` to include new fields.

#### Step 3: Test Backend Changes
```bash
curl -X POST "http://localhost:8000/api/packages/packages/SLUG/calculate_price/" \
  -H "Content-Type: application/json" \
  -d '{
    "experience_ids": [1, 2],
    "hotel_tier_id": 1,
    "transport_option_id": 1
  }'
```

Verify response includes new fields.

---

### Phase 2: Frontend Enhancement (2-3 hours)

#### Step 1: Update TypeScript Types
**File:** `frontend/shambit-frontend/src/lib/api.ts`

```typescript
export interface PriceCalculation {
  total_price: string;
  currency: string;
  breakdown: {
    experiences: Array<{
      id: number;
      name: string;
      price: string;
    }>;
    hotel_tier: {
      id: number;
      name: string;
      price_multiplier: string;
    };
    transport: {
      id: number;
      name: string;
      price: string;
    };
    // NEW FIELDS
    subtotal_before_hotel?: string;
    subtotal_after_hotel?: string;
    applied_rules?: Array<{
      name: string;
      type: 'MARKUP' | 'DISCOUNT';
      value: string;
      is_percentage: boolean;
      amount_applied: string;
    }>;
    total_markup?: string;
    total_discount?: string;
  };
  pricing_note: string;
}
```

#### Step 2: Update PriceCalculator Component
**File:** `frontend/shambit-frontend/src/components/packages/PriceCalculator.tsx`

```typescript
{/* Enhanced Price Display */}
{price && !loading && !error && (
  <>
    {/* Subtotal */}
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-medium">
          {formatCurrency(parseFloat(price.breakdown.subtotal_after_hotel || price.total_price))}
        </span>
      </div>
      
      {/* Applied Rules (Taxes & Charges) */}
      {price.breakdown.applied_rules && price.breakdown.applied_rules.length > 0 && (
        <div className="space-y-1 pl-4 border-l-2 border-gray-200">
          {price.breakdown.applied_rules.map((rule, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {rule.type === 'MARKUP' ? '+' : '-'} {rule.name}
                {rule.is_percentage && ` (${rule.value}%)`}
              </span>
              <span className={rule.type === 'MARKUP' ? 'text-orange-600' : 'text-green-600'}>
                {rule.type === 'MARKUP' ? '+' : '-'}
                {formatCurrency(parseFloat(rule.amount_applied))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Total */}
    <div className="border-t-2 border-gray-200 pt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-semibold text-gray-900">
          Total Payable
        </span>
        <span className="text-3xl font-bold text-orange-600">
          {formatCurrency(parseFloat(price.total_price))}
        </span>
      </div>
      
      {/* Badges */}
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
          <Users className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-medium text-orange-800">
            Price is per person
          </span>
        </div>
        
        <div className="flex items-center justify-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            All taxes included • No hidden charges
          </span>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-2">{price.pricing_note}</p>
    </div>
  </>
)}
```

---

## Creating Tax Pricing Rules

### How to Add GST and Service Charges

#### Option 1: Django Admin
1. Go to `/admin/pricing_engine/pricingrule/`
2. Click "Add Pricing Rule"
3. Fill in:
   - **Name:** "GST (18%)"
   - **Rule Type:** "Markup"
   - **Value:** 18.00
   - **Is Percentage:** ✓ (checked)
   - **Target Package:** (leave blank for all packages)
   - **Active From:** Current date/time
   - **Active To:** (leave blank for indefinite)
   - **Is Active:** ✓ (checked)

#### Option 2: Django Shell
```python
python manage.py shell

from pricing_engine.models import PricingRule
from django.utils import timezone

# Create GST rule (18%)
PricingRule.objects.create(
    name="GST (18%)",
    rule_type="MARKUP",
    value=18.00,
    is_percentage=True,
    target_package=None,  # Apply to all packages
    active_from=timezone.now(),
    is_active=True
)

# Create Service Charge (fixed ₹500)
PricingRule.objects.create(
    name="Service Charge",
    rule_type="MARKUP",
    value=500.00,
    is_percentage=False,
    target_package=None,
    active_from=timezone.now(),
    is_active=True
)
```

#### Option 3: Management Command
**Create:** `backend/apps/pricing_engine/management/commands/create_tax_rules.py`

```python
from django.core.management.base import BaseCommand
from django.utils import timezone
from pricing_engine.models import PricingRule

class Command(BaseCommand):
    help = 'Create standard tax pricing rules'

    def handle(self, *args, **options):
        # GST
        gst, created = PricingRule.objects.get_or_create(
            name="GST (18%)",
            defaults={
                "rule_type": "MARKUP",
                "value": 18.00,
                "is_percentage": True,
                "active_from": timezone.now(),
                "is_active": True,
            }
        )
        self.stdout.write(
            self.style.SUCCESS(f"{'Created' if created else 'Found'} GST rule")
        )

        # Service Charge
        service, created = PricingRule.objects.get_or_create(
            name="Service Charge",
            defaults={
                "rule_type": "MARKUP",
                "value": 500.00,
                "is_percentage": False,
                "active_from": timezone.now(),
                "is_active": True,
            }
        )
        self.stdout.write(
            self.style.SUCCESS(f"{'Created' if created else 'Found'} Service Charge rule")
        )
```

**Run:**
```bash
python manage.py create_tax_rules
```

---

## Testing the Implementation

### Step 1: Create Tax Rules
```bash
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

### Step 2: Test Backend API
```bash
curl -X POST "http://localhost:8000/api/packages/packages/varanasi-spiritual-journey/calculate_price/" \
  -H "Content-Type: application/json" \
  -d '{
    "experience_ids": [1, 2],
    "hotel_tier_id": 1,
    "transport_option_id": 1
  }'
```

**Expected Response:**
```json
{
  "total_price": "23600.00",
  "breakdown": {
    "subtotal_after_hotel": "20000.00",
    "applied_rules": [
      {
        "name": "GST (18%)",
        "type": "MARKUP",
        "value": "18.00",
        "is_percentage": true,
        "amount_applied": "3600.00"
      }
    ],
    "total_markup": "3600.00"
  }
}
```

### Step 3: Test Frontend Display
1. Navigate to package detail page
2. Select experiences, hotel, transport
3. Verify price calculator shows:
   - Subtotal
   - GST (18%): ₹3,600
   - Total: ₹23,600
   - "All taxes included" badge

---

## Summary

### Current State
- ✅ Backend has flexible pricing rule system
- ✅ Taxes can be added as markup rules
- ❌ Tax breakdown not exposed to frontend
- ❌ Frontend cannot display tax details

### Recommended Solution
1. **Backend:** Enhance API response to include `applied_rules` and subtotals
2. **Frontend:** Update TypeScript types and PriceCalculator component
3. **Admin:** Create GST and service charge pricing rules

### Estimated Time
- Backend changes: 2-3 hours
- Frontend changes: 2-3 hours
- Testing: 1 hour
- **Total: 5-7 hours**

### Benefits
- ✅ Complete price transparency
- ✅ Flexible (works with any pricing rules)
- ✅ No hardcoded tax rates
- ✅ Easy to add/modify taxes via admin
- ✅ Meets requirement: "Taxes and charges must be shown separately"

---

**Next Steps:**
1. Review this document
2. Decide on implementation approach (Option 1 recommended)
3. Create tax pricing rules in backend
4. Implement backend API changes
5. Update frontend to display tax breakdown
6. Test thoroughly

---

**Document Version:** 1.0  
**Last Updated:** February 17, 2026  
**Status:** Ready for Implementation
