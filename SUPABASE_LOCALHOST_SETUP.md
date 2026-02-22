# 🛠️ Supabase Localhost Email Confirmation Setup

## Problem
Supabase email confirmation links don't work with `localhost` URLs because:
- Email links point to `http://localhost:3000/...` which can't be accessed from email clients
- Supabase needs a publicly accessible URL for email callbacks

## Solution: Configure Supabase for Localhost Development

### Option 1: Disable Email Confirmation (Easiest for Development)

1. Go to **Supabase Dashboard** → **Authentication** → **Settings**
2. Scroll to **"Email Auth"** section
3. Find **"Enable email confirmations"**
4. **Turn it OFF** (toggle to disabled)
5. Click **Save**

**Result:** Users are automatically confirmed on signup, no email needed.

### Option 2: Use Auto-Confirm (Recommended for Testing)

1. Go to **Supabase Dashboard** → **Authentication** → **Settings**
2. Scroll to **"Email Auth"** section
3. Find **"Enable email confirmations"**
4. Keep it **ON**
5. Find **"Enable email confirmations"** → Set to **"Auto Confirm"**
6. Click **Save**

**Result:** Users are auto-confirmed but still receive welcome emails.

### Option 3: Use a Public URL with ngrok (For Real Testing)

1. Install ngrok: `brew install ngrok` (Mac) or download from ngrok.com
2. Start your dev server: `npm run dev`
3. In another terminal, run: `ngrok http 3000`
4. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
5. Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**
6. Set **Site URL** to: `https://abc123.ngrok.io`
7. Add to **Redirect URLs**: `https://abc123.ngrok.io/**`
8. Update email templates to use ngrok URL

**Result:** Email links work with the public ngrok URL.

### Option 4: Manual Confirmation (Current Implementation)

The app now includes:
- `/confirm` page - Handles confirmation tokens
- API route `/api/auth/confirm` - Processes confirmations

**How it works:**
1. User signs up
2. Gets confirmation email with token
3. Clicks link (or manually visits `/confirm?token=...`)
4. App verifies token and confirms email

**To test manually:**
1. Sign up with an email
2. Check Supabase Dashboard → **Authentication** → **Users**
3. Find your user
4. Copy the confirmation token from the database
5. Visit: `http://localhost:3000/confirm?token=YOUR_TOKEN&type=signup`

## Recommended Setup for Development

**Use Option 1 (Disable Email Confirmation):**
- Fastest development experience
- No email delays
- Users can immediately log in after signup
- Can enable later for production

## Current Implementation

The signup page now:
- Sets `emailRedirectTo` to `/confirm` page
- Handles both auto-confirmed and email-confirmed users
- Creates profile and subscription automatically (via database trigger)

## Testing the Flow

1. **With Email Confirmation Disabled:**
   - Sign up → Immediately logged in → Redirected to builder

2. **With Email Confirmation Enabled:**
   - Sign up → Email sent → Click link in email → Confirmed → Can log in
   - Or manually visit `/confirm?token=...`

## Production Setup

When deploying to production:
1. Set **Site URL** in Supabase to your production domain
2. Add production domain to **Redirect URLs**
3. Enable email confirmations
4. Customize email templates in Supabase Dashboard





