# 🌍 Razorpay International + Indian Payment Setup

## Complete Guide to Accept Payments from Worldwide Users

---

## 🎯 WHAT IS RAZORPAY?

Razorpay is India's leading payment gateway that supports **both domestic and international payments** through a single integration.

### Key Capabilities:
- 🌍 **180+ countries** supported
- 💱 **130+ currencies** (INR, USD, EUR, GBP, AUD, CAD, SGD, JPY, KRW, etc.)
- 💳 **International cards** (Visa, Mastercard, Amex, Discover)
- 📱 **Indian payment methods** (UPI, Cards, Net Banking, Wallets)
- 💰 **Competitive pricing**: 2% (domestic), 3% (international)
- 🏦 **All settlements in INR** - No need for foreign bank account
- 🔐 **PCI DSS Level 1** compliant

---

## 💡 WHY RAZORPAY ONLY?

### Single Gateway Benefits:
✅ **Simpler Setup** - One gateway, one dashboard, one KYC
✅ **Unified Reporting** - All payments in one place
✅ **Lower Maintenance** - Fewer integrations to manage
✅ **Cost Effective** - Competitive 3% for international (vs Stripe's 2.9% + $0.30)
✅ **Local Advantage** - Better support for Indian businesses
✅ **Global Reach** - Still serves 180+ countries

### Razorpay International Features:
- Accepts cards from foreign banks
- Supports 130+ currencies
- 3D Secure 2.0 for security
- Automatic currency conversion to INR
- No additional gateway needed
- Single API integration
- FIRC/FIRS compliance automated

---

## 🏗️ ARCHITECTURE

```
┌─────────────────────────────────────────────────┐
│         USER VISITS YOUR WEBSITE                │
│              /subscribe page                    │
│       (Selects Weekly/Monthly/Annual)           │
└────────────────────┬────────────────────────────┘
                     ↓
         Clicks "Proceed to Payment"
                     ↓
┌─────────────────────────────────────────────────┐
│             /payment Page Loads                  │
│                                                  │
│  1. Auto-detects user currency                  │
│  2. Shows currency selector                     │
│     (INR/USD/EUR/GBP/AUD/CAD/SGD/AED)          │
│  3. User can switch currency                    │
│  4. Displays converted price                    │
└────────────────────┬────────────────────────────┘
                     ↓
          User clicks "Pay Securely"
                     ↓
┌─────────────────────────────────────────────────┐
│           RAZORPAY CHECKOUT MODAL               │
│            (Opens on same page)                 │
│                                                  │
│  For INR (Indian Users):                        │
│    ├─ UPI (Google Pay, PhonePe, Paytm)        │
│    ├─ Cards (All Indian & International)       │
│    ├─ Net Banking                              │
│    └─ Wallets                                  │
│                                                  │
│  For USD/EUR/GBP (International Users):        │
│    ├─ International Credit Cards               │
│    ├─ International Debit Cards                │
│    └─ PayPal (optional)                        │
└────────────────────┬────────────────────────────┘
                     ↓
           User completes payment
                     ↓
┌─────────────────────────────────────────────────┐
│      CLIENT-SIDE VERIFICATION                   │
│  POST /api/payment/razorpay/verify             │
│  - Verifies signature                           │
│  - Creates subscription in database             │
└────────────────────┬────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│      WEBHOOK (BACKGROUND)                       │
│  POST /api/webhooks/razorpay                   │
│  - Double-confirmation                          │
│  - Creates subscription if not exists           │
└────────────────────┬────────────────────────────┘
                     ↓
           /payment/success page
                     ↓
      Premium features unlocked! 🎉
```

---

## 💰 PRICING & FEES

### Your Pricing (as configured):
| Plan    | INR     | USD     | EUR    | GBP    | AUD     | CAD     |
|---------|---------|---------|--------|--------|---------|---------|
| Weekly  | ₹150    | $1.80   | €1.65  | £1.43  | A$2.70  | C$2.40  |
| Monthly | ₹350    | $4.20   | €3.85  | £3.33  | A$6.30  | C$5.60  |
| Annual  | ₹3,200  | $38.40  | €35.20 | £30.40 | A$57.60 | C$51.20 |

### Razorpay Transaction Fees:
- **Domestic (India)**: 2% per transaction
  - Example: ₹350 plan = ₹7 fee, you get ₹343
- **International**: 3% per transaction
  - Example: $4.20 plan = $0.13 fee, you get $4.07 (~₹340)

### Settlement:
- **All payments → Converted to INR → Settled to your Indian bank account**
- **Domestic**: T+2 days (can request T+0 instant settlement)
- **International**: T+7 days
- **No foreign bank account needed** - everything in INR

---

## 🔐 SECURITY & COMPLIANCE

### Security Features:
✅ **PCI DSS Level 1** certified
✅ **3D Secure 2.0** for card authentication
✅ **AI-based fraud detection**
✅ **256-bit SSL encryption**
✅ **Tokenization** for saved cards
✅ **Address Verification System** (AVS)

### Compliance:
✅ **RBI Licensed** - Payment Aggregator license
✅ **Automated FIRS/FIRC** - One-click download every month
✅ **KYC Verified** - Complete verification process
✅ **Data Security** - ISO 27001 certified

---

## 🌏 INTERNATIONAL PAYMENT DETAILS

### How It Works:

1. **User in USA** wants to pay $4.20:
   - Selects USD currency
   - Sees price as $4.20
   - Pays with international Visa card
   - Payment processed in USD
   - Razorpay converts: $4.20 → ₹350 (at current rate)
   - Settled to your account: ₹340 (after 3% fee)

2. **User in UK** wants to pay £3.33:
   - Selects GBP currency
   - Sees price as £3.33
   - Pays with UK Mastercard
   - Payment processed in GBP
   - Razorpay converts: £3.33 → ₹350
   - Settled to your account: ₹340 (after fee)

### Supported Countries (180+):
- 🇺🇸 United States
- 🇬🇧 United Kingdom
- 🇨🇦 Canada
- 🇦🇺 Australia
- 🇸🇬 Singapore
- 🇦🇪 UAE
- 🇪🇺 All EU countries
- 🇯🇵 Japan
- 🇰🇷 South Korea
- ...and 170+ more!

---

## 📱 PAYMENT METHODS BY REGION

### 🇮🇳 **India (INR)**
**Most Popular:**
1. **UPI** (60%) - Google Pay, PhonePe, Paytm, BHIM
2. **Cards** (25%) - Debit/Credit cards
3. **Net Banking** (10%)
4. **Wallets** (5%)

**All supported!** User sees all options in Razorpay modal.

### 🌍 **International (USD/EUR/GBP/etc.)**
**Supported:**
1. **International Credit Cards** - Visa, Mastercard, Amex, Discover
2. **International Debit Cards** - From 180+ countries
3. **PayPal** - Optional, needs activation
4. **Local Methods** - Trustly (EU), Poli (AU/NZ), ACH (USA)

**Conversion:** All auto-converted to INR for settlement.

---

## 🧪 TESTING GUIDE

### Test in Local Development:

1. **Start Server:**
   ```bash
   npm run dev
   ```

2. **Test Indian Payment:**
   - Go to: http://localhost:3000/subscribe
   - Select Monthly plan
   - Currency: INR
   - Pay with:
     - **UPI**: `success@razorpay` → OTP: `0000`
     - **Card**: `4111 1111 1111 1111` → CVV: `123` → OTP: `0000`
   - Should succeed and redirect to success page

3. **Test International Payment:**
   - Go to: http://localhost:3000/payment?plan=monthly
   - Change currency to **USD**
   - Price updates to $4.20
   - Pay with:
     - **Card**: `4242 4242 4242 4242`
     - **Expiry**: `12/28`
     - **CVV**: `123`
     - **Name**: Any name
   - Should succeed

4. **Verify in Database:**
   - Open Supabase Dashboard
   - Check `subscriptions` table
   - Should see new entries with `payment_provider: razorpay`

### All Test Cards:
```
Success:        4111 1111 1111 1111
Success (Alt):  5555 5555 5555 4444  
3D Secure:      4000 0000 0000 3220 (OTP: 0000)
Failed:         4000 0000 0000 0002
Amex:           3782 822463 10005

Expiry: Any future date
CVV: Any 3 digits
OTP: Always 0000 in test mode
```

---

## 🔄 CURRENCY CONVERSION EXAMPLE

**Scenario:** International user pays in USD

```
1. User sees price: $4.20 (for Monthly plan)
2. User pays: $4.20 via Visa card
3. Razorpay processes in USD
4. Razorpay converts at current rate:
   $4.20 × ₹83.50 (example rate) = ₹350.70
5. Razorpay fee (3%): ₹10.52
6. You receive: ₹340.18 (settled in INR)
```

**Benefits:**
- ✅ User sees familiar currency
- ✅ No conversion fees on customer side
- ✅ You receive INR directly
- ✅ Razorpay handles all conversion
- ✅ Rate locked at payment time

---

## 📊 PAYMENT ANALYTICS

### Monitor in Razorpay Dashboard:

**Dashboard URL:** https://dashboard.razorpay.com/app/payments

**Key Metrics:**
- Total payments (domestic + international)
- Success rate
- Currency breakdown (INR vs USD vs EUR, etc.)
- Payment method distribution
- Failed payments (investigate these!)
- Settlement status

**Filters Available:**
- By date range
- By currency
- By payment method
- By status (success/failed/pending)

---

## 🚨 COMMON ISSUES & SOLUTIONS

### Issue: "Payment succeeded but subscription not created"
**Solution:**
- Check webhook logs in Razorpay Dashboard
- Verify `RAZORPAY_WEBHOOK_SECRET` is correct
- Check server logs for errors
- Manually verify payment ID in database

### Issue: "International card payment failed"
**Solution:**
- Ensure international payments are enabled in dashboard
- Check if card is 3D Secure enabled
- Try different test card
- Check Razorpay payment logs for detailed error

### Issue: "UPI not showing in payment options"
**Solution:**
- Only shows for INR currency
- Check Razorpay modal for UPI tab
- Try test UPI: `success@razorpay`

### Issue: "Currency not converting correctly"
**Solution:**
- Update exchange rates in `lib/payments/config.ts`
- Or Razorpay handles live conversion automatically

---

## 🎓 RAZORPAY RESOURCES

### Documentation:
- **Main Docs**: https://razorpay.com/docs
- **Payment Gateway**: https://razorpay.com/docs/payments
- **International Payments**: https://razorpay.com/docs/payments/payments/international-payments
- **Supported Currencies**: https://razorpay.com/docs/payments/international-payments/#supported-currencies
- **Webhooks**: https://razorpay.com/docs/webhooks
- **Test Cards**: https://razorpay.com/docs/payments/payments/test-card-details

### Interactive:
- **Try Demo**: https://razorpay.com/international-demo
- **Integration Code**: https://razorpay.com/docs/payment-gateway/integrations-guide

### Support:
- **Help Center**: https://razorpay.com/support
- **Raise Ticket**: Dashboard → Help → New Request
- **Email**: support@razorpay.com
- **Phone**: +91-80-6890-6200

---

## 📈 SUCCESS STORIES

Razorpay powers international payments for:
- **Unacademy** - Ed-tech serving global students
- **ICICI Lombard** - Insurance from worldwide customers
- **100,000+ Indian businesses** accepting global payments

---

## ✨ WHAT MAKES THIS IMPLEMENTATION SPECIAL

1. **Unified Gateway** - One solution for all countries
2. **Multi-Currency** - Shows prices in user's local currency
3. **Smart Detection** - Auto-detects based on browser locale
4. **User Choice** - Can manually switch currency
5. **Beautiful UX** - Modern, responsive checkout
6. **Type-Safe** - Full TypeScript implementation
7. **Well Tested** - Production-ready code
8. **Documented** - Complete setup guides

---

## 🎉 READY TO GO!

Follow the **SETUP_CHECKLIST.md** for step-by-step instructions.

**Total Setup Time: ~20 minutes**

Then you'll be accepting payments from users worldwide! 🌍

---

## 📞 NEED HELP?

1. **Setup Issues**: Check `SETUP_CHECKLIST.md`
2. **API Questions**: Read Razorpay docs
3. **Payment Issues**: Check Razorpay Dashboard logs
4. **General Support**: Contact Razorpay support

---

**Last Updated:** March 7, 2026
**Gateway:** Razorpay (Domestic + International)
**Status:** ✅ Ready to Configure
