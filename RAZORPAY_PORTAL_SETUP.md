# 🔧 RAZORPAY PORTAL SETUP - Required Actions

## ⚠️ ISSUE: Order Creation Failing (500 Error)

Your API is returning 500 error because **your Razorpay account needs activation steps completed**.

Based on [Razorpay documentation](https://razorpay.com/docs/payments/quickstart/), here's what you need to check:

---

## ✅ CHECKLIST - DO THESE IN RAZORPAY DASHBOARD

### **STEP 1: Check Account Activation Status** (2 min)

1. **Login to Razorpay Dashboard:**
   - Go to: https://dashboard.razorpay.com

2. **Check Account Status:**
   - Look at top-left: Should say **"Live Mode"** or **"Test Mode"**
   - Go to: **Account & Settings** → **Activation Details**
   - Check: **Account Status**
   
   **What you should see:**
   - ✅ Account Status: **Activated** (green)
   - ✅ KYC Status: **Completed**
   
   **If NOT activated:**
   - ❌ Status: **Pending** or **Under Review**
   - **Action:** Complete KYC first (see Step 2)

---

### **STEP 2: Complete KYC Verification** (15-30 min)

**If your account is not activated, you MUST complete KYC:**

1. **Go to:** Dashboard → **Account & Settings** → **KYC Details**

2. **Business Information:**
   - [ ] Business Type (Individual/Proprietor/Company/etc.)
   - [ ] Business PAN
   - [ ] Business Name
   - [ ] GST Number (if applicable)

3. **Personal Documents:**
   - [ ] Personal PAN card
   - [ ] Aadhaar card (front & back) OR Passport

4. **Bank Account:**
   - [ ] Bank account number
   - [ ] IFSC code
   - [ ] Cancelled cheque OR Bank statement

5. **Business Documents** (if registered):
   - [ ] Certificate of Incorporation
   - [ ] GST Certificate
   - [ ] Partnership Deed (if partnership)

6. **Submit & Wait:**
   - Approval time: **1-3 business days**
   - You'll receive email when approved
   - **Until then, use TEST MODE keys!**

---

### **STEP 3: Add & Verify Your Website** (5 min)

⚠️ **CRITICAL:** Live API keys don't work until website is verified!

1. **Go to:** Dashboard → **Account & Settings** → **Website Details**

2. **Add Website URL:**
   - [ ] Click **"Add Website"**
   - [ ] Enter: `https://resume-builder-platform.vercel.app`
   - [ ] Business Category: Select appropriate (e.g., "SaaS/Technology")
   - [ ] Click **"Submit"**

3. **Wait for Verification:**
   - Takes: **2-3 business days**
   - Razorpay verifies your website has:
     - [ ] Refund/Cancellation Policy
     - [ ] Privacy Policy
     - [ ] Terms & Conditions
     - [ ] Contact information

4. **Check Status:**
   - Go to: **Account & Settings** → **Website Details**
   - Should show: ✅ **Verified**

**Important:** Until website is verified, **LIVE keys won't work for creating orders!**

---

### **STEP 4: Switch to TEST MODE (Temporary Solution)**

While waiting for KYC/Website verification, **use TEST MODE**:

1. **In Razorpay Dashboard:**
   - Click toggle at top-left
   - Switch to **"Test Mode"**

2. **Generate Test Keys:**
   - Go to: **Settings** → **API Keys**
   - Click **"Generate Test Key"**
   - Copy: Key ID (starts with `rzp_test_`)
   - Copy: Key Secret

3. **Update Vercel Environment Variables:**
   - Replace live keys with test keys:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_test_secret
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   ```
   - Redeploy

4. **Test Payments Work Immediately:**
   - Test with card: `4111 1111 1111 1111`
   - Test with UPI: `success@razorpay`
   - No real money charged!

---

### **STEP 5: Enable Payment Methods** (2 min)

1. **Go to:** Dashboard → **Settings** → **Payment Methods**

2. **Ensure These are ENABLED:**
   - [ ] ✅ **Cards** - Domestic & International
   - [ ] ✅ **UPI**
   - [ ] ✅ **Net Banking**
   - [ ] ✅ **Wallets**

3. **For International Payments** (if needed):
   - Look for **"International Payments"** section
   - If not enabled, click **"Request Activation"**
   - Fill form and submit
   - Approval: 2-5 business days

---

### **STEP 6: Check Live Mode Requirements**

According to [Razorpay API Keys documentation](https://razorpay.com/docs/payments/dashboard/account-settings/api-keys/):

**Live Mode API Keys require:**
- ✅ Account fully activated (KYC complete)
- ✅ Website added and verified
- ✅ Bank account verified
- ✅ Business details complete

**If ANY of these are pending:**
- Live keys won't work
- Orders will fail with 500 error
- **Solution:** Use Test Mode until all steps complete

---

## 🎯 IMMEDIATE ACTION PLAN

### **Option A: Use Test Mode Now** (Recommended)

**Fastest way to test your payment system:**

1. Switch to Test Mode in Razorpay Dashboard
2. Generate test API keys
3. Update Vercel with test keys
4. Redeploy
5. Test immediately with test cards

**Advantages:**
- ✅ Works immediately
- ✅ No KYC wait time
- ✅ No real money involved
- ✅ Full payment flow testing

### **Option B: Wait for Live Mode Activation**

**If you want to use live keys:**

1. Complete KYC (if pending)
2. Add website URL
3. Wait 2-5 days for verification
4. Then live keys will work

---

## 🔍 HOW TO CHECK WHAT'S BLOCKING YOU

### **Quick Diagnostic:**

1. **Login:** https://dashboard.razorpay.com

2. **Check These Pages:**

   **a. Account Activation:**
   - **Account & Settings** → **Activation Details**
   - Should show: ✅ "Activated"
   - If not: Complete KYC

   **b. Website Verification:**
   - **Account & Settings** → **Website Details**
   - Should show: ✅ "Verified"
   - If not: Add website and wait for verification

   **c. API Keys:**
   - **Settings** → **API Keys**
   - In **Live Mode**: Can you generate keys?
   - If "Generate Key" is disabled: Website not verified yet

3. **If ANY is ❌ Not Complete:**
   - Your live keys won't work
   - Use Test Mode keys instead

---

## 🧪 TEST MODE vs LIVE MODE

| Feature | Test Mode | Live Mode |
|---------|-----------|-----------|
| **KYC Required** | ❌ No | ✅ Yes |
| **Website Verification** | ❌ No | ✅ Yes |
| **Real Money** | ❌ No | ✅ Yes |
| **Works Immediately** | ✅ Yes | ❌ No (needs approval) |
| **Keys Start With** | `rzp_test_` | `rzp_live_` |
| **Test Cards** | ✅ Yes | ❌ No (real cards only) |
| **Best For** | ✅ **Development & Testing** | Production |

**Recommendation:** Use **Test Mode** while waiting for activation!

---

## 📋 YOUR ACTION CHECKLIST

```
IMMEDIATE (Do Now):
[ ] Login to Razorpay Dashboard
[ ] Check Account Status (Account & Settings → Activation Details)
[ ] Is it "Activated"? 
    ├─ YES → Check website verification (Step 3)
    └─ NO → Complete KYC (Step 2)

IF NOT ACTIVATED:
[ ] Complete KYC with all documents
[ ] Submit for review
[ ] Wait 1-3 days for approval
[ ] Meanwhile, use TEST MODE keys

IF ACTIVATED BUT STILL FAILING:
[ ] Check website is added and verified
[ ] If not verified, add website URL
[ ] Wait 2-3 days for website verification
[ ] Meanwhile, use TEST MODE keys

QUICK FIX (Works Now):
[ ] Switch to Test Mode in dashboard
[ ] Generate test API keys (rzp_test_xxx)
[ ] Update Vercel with test keys
[ ] Redeploy
[ ] Test with: 4111 1111 1111 1111
[ ] ✅ Should work immediately!
```

---

## 🚀 RECOMMENDED APPROACH

**For Testing Right Now:**

```bash
1. Switch to TEST MODE in Razorpay Dashboard
2. Generate test keys: rzp_test_xxxxxxxxxxxx
3. Update Vercel Environment Variables:
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=test_secret_xxx
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
4. Redeploy on Vercel
5. Test at: https://resume-builder-platform.vercel.app/subscribe
6. Use test card: 4111 1111 1111 1111
7. ✅ Works immediately - no waiting!
```

**For Production (Later):**
- Complete KYC
- Verify website
- Switch back to live keys

---

## 📞 CHECK YOUR STATUS

**Run these checks in Razorpay Dashboard:**

### **1. Account Status:**
```
Dashboard → Account & Settings → Activation Details
Look for: Account Status: Activated ✅
```

### **2. Live Mode Access:**
```
Toggle to "Live Mode" (top-left)
Go to: Settings → API Keys
Can you click "Generate Key"?
  ├─ YES → Website is verified ✅
  └─ NO → Website pending verification ⏳
```

### **3. Payment Methods:**
```
Settings → Payment Methods
Check: Cards, UPI, Net Banking all enabled ✅
```

---

## 🎯 MOST LIKELY ISSUE

Based on the 500 error with **live keys**, one of these is true:

1. **KYC Not Complete** (most common)
   - Account shows "Under Review"
   - Solution: Complete KYC, wait for approval

2. **Website Not Verified** (very common)
   - Live keys exist but don't work
   - Solution: Add website URL, wait 2-3 days

3. **Account Just Created**
   - Everything is pending
   - Solution: Use test mode while waiting

---

## ✅ SOLUTION: Use Test Mode Now!

**This is the fastest way forward:**

1. Test Mode works **immediately** - no KYC needed
2. Test your entire payment flow
3. Switch to Live Mode when approved
4. Just change keys in Vercel and redeploy

**You can fully test and launch with Test Mode, then upgrade to Live Mode later!**

---

## 📞 NEED HELP?

**Razorpay Support:**
- Dashboard → Help → New Request
- Email: support@razorpay.com
- Phone: +91-80-6890-6200

**Ask them:**
- "Why are my live API keys failing to create orders?"
- "What activation steps are pending on my account?"
- They can check your account status and tell you exactly what's needed

---

**TL;DR: Switch to TEST MODE keys right now. Your payment system will work immediately while you wait for live mode activation!** 🚀
