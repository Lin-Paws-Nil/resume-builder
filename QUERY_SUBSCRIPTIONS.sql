-- ============================================
-- QUERY ALL USERS' SUBSCRIPTIONS IN SUPABASE
-- ============================================
-- Run these queries in Supabase Dashboard > SQL Editor
-- (The SQL Editor bypasses RLS policies)

-- 1. Get ALL subscriptions for all users
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
  s.stripe_customer_id,
  s.created_at,
  s.updated_at,
  -- Calculate days remaining (if active and has end_date)
  CASE 
    WHEN s.is_active = true AND s.end_date IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (s.end_date - NOW())) / 86400
    ELSE NULL
  END AS days_remaining
FROM public.subscriptions s
LEFT JOIN public.profiles p ON s.user_id = p.id
ORDER BY s.created_at DESC;

-- 2. Get only ACTIVE subscriptions
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
  s.stripe_customer_id,
  s.created_at,
  s.updated_at,
  CASE 
    WHEN s.end_date IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (s.end_date - NOW())) / 86400
    ELSE NULL
  END AS days_remaining
FROM public.subscriptions s
LEFT JOIN public.profiles p ON s.user_id = p.id
WHERE s.is_active = true
ORDER BY s.end_date ASC;

-- 3. Get subscriptions grouped by plan type
SELECT 
  s.plan,
  COUNT(*) as total_subscriptions,
  COUNT(*) FILTER (WHERE s.is_active = true) as active_subscriptions,
  COUNT(*) FILTER (WHERE s.is_active = false) as inactive_subscriptions
FROM public.subscriptions s
GROUP BY s.plan
ORDER BY total_subscriptions DESC;

-- 4. Get subscriptions expiring soon (within next 7 days)
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
  EXTRACT(EPOCH FROM (s.end_date - NOW())) / 86400 AS days_remaining
FROM public.subscriptions s
LEFT JOIN public.profiles p ON s.user_id = p.id
WHERE s.is_active = true 
  AND s.end_date IS NOT NULL
  AND s.end_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
ORDER BY s.end_date ASC;

-- 5. Get subscriptions that have expired
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
  EXTRACT(EPOCH FROM (NOW() - s.end_date)) / 86400 AS days_expired
FROM public.subscriptions s
LEFT JOIN public.profiles p ON s.user_id = p.id
WHERE s.end_date IS NOT NULL 
  AND s.end_date < NOW()
ORDER BY s.end_date DESC;

-- 6. Get users with their latest subscription (one row per user)
SELECT DISTINCT ON (s.user_id)
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
  CASE 
    WHEN s.is_active = true AND s.end_date IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (s.end_date - NOW())) / 86400
    ELSE NULL
  END AS days_remaining
FROM public.subscriptions s
LEFT JOIN public.profiles p ON s.user_id = p.id
ORDER BY s.user_id, s.created_at DESC;

-- 7. Get subscription statistics summary
SELECT 
  COUNT(*) as total_subscriptions,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) FILTER (WHERE is_active = true) as active_count,
  COUNT(*) FILTER (WHERE is_active = false) as inactive_count,
  COUNT(*) FILTER (WHERE plan = 'free') as free_plan,
  COUNT(*) FILTER (WHERE plan = 'weekly') as weekly_plan,
  COUNT(*) FILTER (WHERE plan = 'monthly') as monthly_plan,
  COUNT(*) FILTER (WHERE plan = 'annual') as annual_plan,
  COUNT(*) FILTER (WHERE end_date < NOW() AND is_active = true) as expired_but_active
FROM public.subscriptions;

-- 8. Get users with multiple subscriptions
SELECT 
  s.user_id,
  p.email,
  p.first_name,
  p.last_name,
  COUNT(*) as subscription_count,
  ARRAY_AGG(s.plan) as plans,
  ARRAY_AGG(s.is_active::text) as active_statuses
FROM public.subscriptions s
LEFT JOIN public.profiles p ON s.user_id = p.id
GROUP BY s.user_id, p.email, p.first_name, p.last_name
HAVING COUNT(*) > 1
ORDER BY subscription_count DESC;

