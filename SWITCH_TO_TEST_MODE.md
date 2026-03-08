# 🧪 SWITCH TO TEST MODE - Update Vercel

## ✅ Local Environment Updated

Your `.env.local` now has TEST mode keys:
- `rzp_test_SOjkZw0Y4tMjcK`

---

## 🎯 UPDATE VERCEL WITH TEST KEYS

### **Go to Vercel Dashboard:**

https://vercel.com/dashboard → **resume-builder-platform** → **Settings** → **Environment Variables**

### **Edit These 3 Variables:**

Click the **pencil icon** (Edit) on each and update:

#### **1. RAZORPAY_KEY_ID**
```
Click Edit → Change value to:
rzp_test_SOjkZw0Y4tMjcK
→ Save
```

#### **2. RAZORPAY_KEY_SECRET**
```
Click Edit → Change value to:
8clmAz05UKcgBCGiw3jsPO6L
→ Save
```

#### **3. NEXT_PUBLIC_RAZORPAY_KEY_ID**
```
Click Edit → Change value to:
rzp_test_SOjkZw0Y4tMjcK
→ Save
```

**Keep NEXT_PUBLIC_APP_URL as is** (don't change)

---

## 🔄 REDEPLOY VERCEL

After updating all 3 variables:

1. Go to **"Deployments"** tab
2. Click **••• (three dots)** on latest deployment
3. Click **"Redeploy"**
4. **Wait 2-3 minutes**

---

## 🧪 TEST WITH TEST CARDS (No Real Money!)

After redeployment:

### **Visit:**
https://resume-builder-platform.vercel.app/subscribe

### **Test with:**

**Credit Card:**
```
Card Number: 4111 1111 1111 1111
Expiry: 12/28 (any future date)
CVV: 123
Name: Test User
OTP: 0000 (always in test mode)
```

**UPI:**
```
UPI ID: success@razorpay
OTP: 0000
```

**Other test cards:**
```
4242 4242 4242 4242 (Success)
5555 5555 5555 4444 (Success)
4000 0000 0000 3220 (3D Secure - OTP: 0000)
4000 0000 0000 0002 (Will fail - for testing errors)
```

---

## ✅ BENEFITS OF TEST MODE

- ✅ **No real money charged** - All transactions are simulated
- ✅ **Test unlimited times** - No cost
- ✅ **Full payment flow** - Same as live mode
- ✅ **All payment methods** - UPI, Cards, Net Banking, Wallets
- ✅ **Instant testing** - No approval delays
- ✅ **Safe development** - Can't accidentally charge customers

---

## 🔄 SWITCH TO LIVE MODE LATER

When you're ready for real payments:

1. **Update Vercel** with live keys:
   ```
   RAZORPAY_KEY_ID = rzp_live_SOiTMAsb3l04FK
   RAZORPAY_KEY_SECRET = wgNdb78OhCJKui7J4LMOAg29
   NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_live_SOiTMAsb3l04FK
   ```

2. **Redeploy**

3. **Accept real payments!**

---

## 📋 QUICK CHECKLIST

```
✅ Local .env.local updated with test keys
⏳ Update 3 variables in Vercel (5 min)
⏳ Redeploy Vercel (2 min)
⏳ Test with: 4111 1111 1111 1111
✅ Payment works - no real money!
```

---

## 🎊 TEST CARDS CHEAT SHEET

Keep this handy:

| Card | Result | Use For |
|------|--------|---------|
| 4111 1111 1111 1111 | ✅ Success | General testing |
| 4242 4242 4242 4242 | ✅ Success | Alternative test |
| 4000 0000 0000 3220 | ✅ 3D Secure | Test OTP flow |
| 4000 0000 0000 0002 | ❌ Failed | Test error handling |

**Expiry:** Any future date (e.g., 12/28)  
**CVV:** Any 3 digits (e.g., 123)  
**OTP:** Always `0000` in test mode  
**UPI:** `success@razorpay` (OTP: 0000)

Full list: https://razorpay.com/docs/payments/payments/test-card-details

---

**🚀 Update Vercel with test keys now, redeploy, and test with no risk!**

**Copy-paste values for Vercel:**
```
rzp_test_SOjkZw0Y4tMjcK
8clmAz05UKcgBCGiw3jsPO6L
```
