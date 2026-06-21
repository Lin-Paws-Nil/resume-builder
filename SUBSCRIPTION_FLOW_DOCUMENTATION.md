# Premium Subscription User Flow

## Complete User Journey

### Scenario 1: Guest User Tries Premium Feature
```
Guest User clicks "Fix Spelling" / "Fix Grammar" / "Enhance AI" / "Upload Resume" / "Download PDF"
    ↓
Alert: "Please log in to use [feature]"
    ↓
Redirect to: /login?redirect=/builder
    ↓
User logs in
    ↓
Return to /builder
    ↓
(Now treated as Free User - see Scenario 2)
```

### Scenario 2: Free User Tries Premium Feature
```
Free User clicks any premium feature
    ↓
Confirm dialog: "[Feature] requires a premium subscription. Would you like to upgrade your plan?"
    ↓
User clicks OK
    ↓
Redirect to: /subscribe?return=/builder
    ↓
[SUBSCRIPTION SELECTION PAGE]
```

### Scenario 3: Subscription Selection Page (`/subscribe`)
```
User lands on /subscribe page
    ↓
See hero section: "Choose Your Perfect Plan"
    ↓
See "What You'll Get with Premium" cards:
    - Unlimited Downloads
    - AI-Powered Tools
    - Smart Import
    ↓
View 3 pricing cards side-by-side:
    [Weekly]        [Monthly - MOST POPULAR]      [Annual]
    ₹150/7 days     ₹350/30 days                  ₹3,200/365 days
    ↓
User clicks "Select Plan" on any card
    ↓
Card highlights with blue border & ring
Selected plan shows "✓ Selected"
    ↓
"Order confirmation" section appears below cards
Shows: Selected plan, What happens next (3 steps)
    ↓
Two buttons:
    - "Choose Different Plan" (resets selection)
    - "Proceed to Payment →" (continues)
    ↓
User clicks "Proceed to Payment"
    ↓
Redirect to: /payment?plan=monthly&return=/builder
```

### Scenario 4: Payment Page (`/payment`)
```
User lands on /payment page
    ↓
See two-column layout:
    LEFT                        RIGHT
    Payment Form                Order Summary (sticky)
    ↓
Left Side - Payment Method Selection:
    [Card] or [UPI] toggle buttons
    ↓
If Card selected:
    - Card Number (auto-formatted: 1234 5678 9012 3456)
    - Cardholder Name
    - Expiry Date (MM/YY)
    - CVV
    ↓
If UPI selected:
    - UPI ID (yourname@paytm)
    ↓
Right Side - Order Summary shows:
    - Plan icon with gradient
    - Plan name & duration
    - Price breakdown
    - All features included
    - Total amount
    ↓
User fills payment details
    ↓
User clicks "Pay ₹XXX" button
    ↓
Validation runs:
    - Card: Check all fields filled & valid format
    - UPI: Check UPI ID contains @
    ↓
If validation fails:
    - Show error banner at top
    - Highlight problematic fields
    ↓
If validation passes:
    - Button shows "Processing Payment..." with spinner
    - Create subscription in Supabase:
        * user_id: current user
        * plan: selected plan
        * is_active: true
        * start_date: now
        * end_date: calculated based on plan
    - Simulate payment (2 second delay)
    ↓
Success!
    ↓
Show success screen:
    - Green checkmark icon
    - "Payment Successful!"
    - "Your [Plan] subscription is now active"
    - Loading spinner
    ↓
Auto-redirect after 2 seconds
    ↓
Return to: /builder (or custom return URL)
    ↓
Premium features NOW UNLOCKED
```

## Premium Features Display

### Upload Current Resume Section
```
[Section Header]
├── 📄 Upload Current Resume
├── ✅ Premium badge (if premium)
├── 🔒 Lock icon (if not premium)
└── ˅ Expand/Collapse

[When Expanded]
├── If Guest: Login prompt
├── If Free: Upgrade prompt → /subscribe
└── If Premium: File upload UI
```

### AI-Powered Features Box (in all text fields)
```
┌─────────────────────────────────────────────────────┐
│ [Purple gradient border with subtle background]     │
│                                                      │
│ ✨ AI-Powered Features          [Premium/🔒]       │
│ ────────────────────────────────────────────────    │
│                                                      │
│                    [Fix Spelling] [Fix Grammar]     │
│                                   [Enhance using AI] │
│                                                      │
└─────────────────────────────────────────────────────┘

ALWAYS VISIBLE - regardless of text content
Buttons disabled when no text (opacity-50)
```

### Button Behavior:
- **No text**: Buttons visible but disabled (grayed out)
- **Has text + Guest**: Click → Login alert + redirect
- **Has text + Free**: Click → Confirm dialog + redirect to /subscribe
- **Has text + Premium**: Click → Execute AI function

## Database Schema

### Subscriptions Table
```sql
subscriptions {
  id: UUID (primary key)
  user_id: UUID (foreign key → profiles.id)
  plan: TEXT (weekly/monthly/annual)
  is_active: BOOLEAN
  start_date: TIMESTAMP
  end_date: TIMESTAMP
  created_at: TIMESTAMP
}
```

## Key Components Architecture

### Page Structure:
```
/app
├── /subscribe
│   └── page.tsx (Subscription selection)
├── /payment
│   └── page.tsx (Payment processing)
├── /builder
│   └── page.tsx (Updated with /subscribe redirect)
└── /account
    └── page.tsx (Existing account management)

/components
├── /resume
│   ├── ResumeUpload.tsx (Premium feature)
│   ├── EnhanceableTextField.tsx (Premium AI features)
│   └── LinkedInImport.tsx (Premium feature)
├── /ui
│   └── subscription-modal.tsx (Updated redirect)
└── /account
    ├── SubscriptionUpgrade.tsx (Existing)
    ├── AccountSettings.tsx (Existing)
    └── PaymentInfo.tsx (Existing)

/lib
├── /hooks
│   ├── use-auth.ts (User authentication)
│   └── use-subscription.ts (Subscription status)
└── /types
    └── subscription.ts (Updated plan features)
```

## Redirect Flow Map

```
Premium Feature Click
    ↓
┌─────────────────┐
│  Check Auth?    │
└────┬────────┬───┘
     │        │
 Guest?   Logged In?
     │        │
     ↓        ↓
  /login   Check Sub?
     │        │
     │    ┌───┴────┐
     │    │        │
     │  Free?  Premium?
     │    │        │
     │    ↓        ↓
     │ /subscribe  Execute
     │    │      Feature
     └────┴─────────→ /builder
              (after payment)
```

## Plan Comparison

| Feature | Free | Weekly | Monthly | Annual |
|---------|------|--------|---------|--------|
| **Price** | ₹0 | ₹150 | ₹350 | ₹3,200 |
| **Duration** | Forever | 7 days | 30 days | 365 days |
| **PDF Downloads** | ❌ | ✅ Unlimited | ✅ Unlimited | ✅ Unlimited |
| **AI Text Enhancement** | ❌ | ✅ | ✅ | ✅ |
| **Fix Spelling & Grammar** | ❌ | ✅ | ✅ | ✅ |
| **Upload Resume** | ❌ | ✅ | ✅ | ✅ |
| **LinkedIn Import** | ❌ | ✅ | ✅ | ✅ |
| **Priority Support** | ❌ | ✅ | ✅ | ✅ |
| **All Templates** | ✅ | ✅ | ✅ | ✅ |
| **Resume Analytics** | ❌ | ❌ | ✅ | ✅ |
| **Cover Letter Builder** | ❌ | ❌ | ❌ | ✅ |
| **Job Tracker** | ❌ | ❌ | ❌ | ✅ |

## Design Principles

### 1. Visual Hierarchy
- Premium features clearly marked with consistent badges
- Gradient backgrounds for premium content
- Always-visible UI for feature discovery

### 2. User Experience
- No surprises - features are visible before interaction
- Clear upgrade paths with contextual prompts
- Smooth transitions between pages
- Loading states for all async operations

### 3. Conversion Optimization
- "Most Popular" badge on recommended plan
- Trust indicators (secure, instant, cancel anytime)
- FAQ section to address concerns
- Clear feature comparison

### 4. Technical Excellence
- Proper authentication checks at every level
- Database-backed subscriptions
- Query parameter preservation for return navigation
- Suspense boundaries for SSR compatibility
- Error handling throughout

## Testing Recommendations

### Manual Testing:
1. Test as guest user - all premium features should prompt login
2. Test as free user - all premium features should show upgrade dialog
3. Test as premium user - all features should work
4. Test subscription selection - all cards should be interactive
5. Test payment forms - validation should work correctly
6. Test successful payment flow - subscription should be created
7. Test return URL - should redirect back to original location

### Edge Cases:
- User refreshes on payment page
- User goes back during payment
- Invalid plan ID in URL
- Expired subscription trying to use features
- Network errors during payment
- Database errors

## Next Steps (Future Enhancements)

1. **Real Payment Gateway Integration**:
   - Integrate Razorpay or Stripe
   - Webhook handling for payment confirmation
   - Automatic subscription activation

2. **Email Notifications**:
   - Welcome email after subscription
   - Payment receipts
   - Expiry reminders

3. **Admin Dashboard**:
   - View all subscriptions
   - Manual subscription management
   - Revenue analytics

4. **Subscription Management**:
   - Cancel subscription
   - Upgrade/downgrade plans
   - View payment history
   - Download invoices

5. **Trial Period**:
   - Offer 3-day free trial
   - No credit card required
   - Auto-convert to paid if user subscribes

## Security Considerations

1. ✅ Frontend premium checks (user experience)
2. ⚠️ TODO: Backend API checks (security)
   - Add middleware to verify subscription on API routes
   - Check subscription status in `/api/enhance-text`
   - Check subscription status in `/api/fix-spelling`
   - Check subscription status in `/api/fix-grammar`
   - Check subscription status in `/api/parse-resume`

3. ✅ Secure payment form handling
4. ✅ Authentication required for all premium flows
5. ⚠️ TODO: Rate limiting on API endpoints
6. ⚠️ TODO: PCI compliance for payment processing
