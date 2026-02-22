-- Check if a user exists in Supabase Auth
-- Replace 'your-email@example.com' with the email you want to check

-- Method 1: Check in auth.users table (requires admin access)
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at,
  raw_user_meta_data
FROM auth.users
WHERE email = 'your-email@example.com';

-- Method 2: Check if profile exists (public table)
SELECT 
  id,
  username,
  email,
  first_name,
  last_name,
  created_at
FROM public.profiles
WHERE email = 'your-email@example.com';

-- Method 3: Check subscription
SELECT 
  s.id,
  s.user_id,
  s.plan,
  s.is_active,
  s.start_date,
  s.end_date,
  p.email,
  p.username
FROM public.subscriptions s
JOIN public.profiles p ON s.user_id = p.id
WHERE p.email = 'your-email@example.com';

-- Method 4: Get all info for a user
SELECT 
  u.id as user_id,
  u.email,
  u.email_confirmed_at,
  u.created_at as user_created_at,
  p.username,
  p.first_name,
  p.last_name,
  s.plan,
  s.is_active as subscription_active
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.subscriptions s ON u.id = s.user_id AND s.is_active = true
WHERE u.email = 'your-email@example.com';





