-- ============================================
-- UPDATE USER SUBSCRIPTIONS IN SUPABASE
-- ============================================
-- Run these queries in Supabase Dashboard > SQL Editor
-- (The SQL Editor bypasses RLS policies)

-- ============================================
-- 1. UPDATE BY USER EMAIL
-- ============================================

-- Update subscription plan for a specific user (by email)
UPDATE public.subscriptions s
SET 
  plan = 'monthly',  -- Change to: 'free', 'weekly', 'monthly', or 'annual'
  updated_at = NOW()
FROM public.profiles p
WHERE s.user_id = p.id 
  AND p.email = 'user@example.com'
  AND s.is_active = true;

-- ============================================
-- 2. UPDATE BY USER ID
-- ============================================

-- Update subscription plan for a specific user (by user_id UUID)
UPDATE public.subscriptions
SET 
  plan = 'monthly',
  updated_at = NOW()
WHERE user_id = 'USER_UUID_HERE'  -- Replace with actual UUID
  AND is_active = true;

-- ============================================
-- 3. EXTEND SUBSCRIPTION END DATE
-- ============================================

-- Extend subscription by adding days (e.g., add 30 days)
UPDATE public.subscriptions s
SET 
  end_date = end_date + INTERVAL '30 days',
  updated_at = NOW()
FROM public.profiles p
WHERE s.user_id = p.id 
  AND p.email = 'user@example.com'
  AND s.is_active = true;

-- Set specific end date
UPDATE public.subscriptions s
SET 
  end_date = '2024-12-31 23:59:59+00'::timestamptz,
  updated_at = NOW()
FROM public.profiles p
WHERE s.user_id = p.id 
  AND p.email = 'user@example.com'
  AND s.is_active = true;

-- ============================================
-- 4. ACTIVATE/DEACTIVATE SUBSCRIPTION
-- ============================================

-- Activate a subscription
UPDATE public.subscriptions s
SET 
  is_active = true,
  updated_at = NOW()
FROM public.profiles p
WHERE s.user_id = p.id 
  AND p.email = 'user@example.com';

-- Deactivate a subscription
UPDATE public.subscriptions s
SET 
  is_active = false,
  updated_at = NOW()
FROM public.profiles p
WHERE s.user_id = p.id 
  AND p.email = 'user@example.com';

-- ============================================
-- 5. CREATE NEW SUBSCRIPTION
-- ============================================

-- Insert a new subscription for a user
INSERT INTO public.subscriptions (
  user_id,
  plan,
  start_date,
  end_date,
  is_active
)
SELECT 
  p.id,
  'monthly',  -- Change to desired plan
  NOW(),
  NOW() + INTERVAL '30 days',  -- Adjust duration as needed
  true
FROM public.profiles p
WHERE p.email = 'user@example.com';

-- ============================================
-- 6. UPDATE MULTIPLE FIELDS AT ONCE
-- ============================================

-- Update plan, end date, and status together
UPDATE public.subscriptions s
SET 
  plan = 'annual',
  start_date = NOW(),
  end_date = NOW() + INTERVAL '365 days',
  is_active = true,
  updated_at = NOW()
FROM public.profiles p
WHERE s.user_id = p.id 
  AND p.email = 'user@example.com';

-- ============================================
-- 7. UPDATE STRIPE-RELATED FIELDS
-- ============================================

-- Update Stripe subscription and customer IDs
UPDATE public.subscriptions s
SET 
  stripe_subscription_id = 'sub_xxxxxxxxxxxxx',
  stripe_customer_id = 'cus_xxxxxxxxxxxxx',
  updated_at = NOW()
FROM public.profiles p
WHERE s.user_id = p.id 
  AND p.email = 'user@example.com'
  AND s.is_active = true;

-- ============================================
-- 8. BULK UPDATES
-- ============================================

-- Deactivate all expired subscriptions
UPDATE public.subscriptions
SET 
  is_active = false,
  updated_at = NOW()
WHERE end_date < NOW()
  AND is_active = true;

-- Extend all active monthly subscriptions by 7 days
UPDATE public.subscriptions
SET 
  end_date = end_date + INTERVAL '7 days',
  updated_at = NOW()
WHERE plan = 'monthly'
  AND is_active = true;

-- ============================================
-- 9. REPLACE SUBSCRIPTION (Deactivate old, create new)
-- ============================================

-- Step 1: Deactivate all existing subscriptions for user
UPDATE public.subscriptions s
SET 
  is_active = false,
  updated_at = NOW()
FROM public.profiles p
WHERE s.user_id = p.id 
  AND p.email = 'user@example.com';

-- Step 2: Create new subscription
INSERT INTO public.subscriptions (
  user_id,
  plan,
  start_date,
  end_date,
  is_active
)
SELECT 
  p.id,
  'annual',
  NOW(),
  NOW() + INTERVAL '365 days',
  true
FROM public.profiles p
WHERE p.email = 'user@example.com';

-- ============================================
-- 10. UPDATE WITH VERIFICATION (Check before update)
-- ============================================

-- Update only if subscription exists and is active
UPDATE public.subscriptions s
SET 
  plan = 'monthly',
  end_date = NOW() + INTERVAL '30 days',
  updated_at = NOW()
FROM public.profiles p
WHERE s.user_id = p.id 
  AND p.email = 'user@example.com'
  AND s.is_active = true
  AND EXISTS (
    SELECT 1 FROM public.subscriptions 
    WHERE user_id = p.id AND is_active = true
  );

-- ============================================
-- 11. VIEW CURRENT SUBSCRIPTION BEFORE UPDATING
-- ============================================

-- Check current subscription details
SELECT 
  s.id,
  s.user_id,
  p.email,
  p.first_name,
  p.last_name,
  s.plan,
  s.start_date,
  s.end_date,
  s.is_active,
  s.stripe_subscription_id,
  s.created_at,
  s.updated_at
FROM public.subscriptions s
LEFT JOIN public.profiles p ON s.user_id = p.id
WHERE p.email = 'user@example.com'
ORDER BY s.created_at DESC;

