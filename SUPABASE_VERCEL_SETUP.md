# Supabase Configuration for Vercel Deployment

## ✅ CRITICAL: Configure Supabase Redirect URLs

Your Vercel URL: `https://resume-builder-ruddy-xi.vercel.app/`

### Step 1: Update Supabase Authentication URLs

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Select your project: `uqluxzmmdsuejzjixido`

2. **Navigate to Authentication → URL Configuration:**
   - Left sidebar: Authentication → URL Configuration

3. **Update Site URL:**
   ```
   https://resume-builder-ruddy-xi.vercel.app
   ```
   (NO trailing slash)

4. **Add Redirect URLs (Add ALL of these):**
   ```
   https://resume-builder-ruddy-xi.vercel.app/**
   https://resume-builder-ruddy-xi.vercel.app/builder
   https://resume-builder-ruddy-xi.vercel.app/login
   https://resume-builder-ruddy-xi.vercel.app/signup
   https://resume-builder-ruddy-xi.vercel.app/confirm
   https://resume-builder-ruddy-xi.vercel.app/account
   http://localhost:3000/** (keep for local development)
   ```

5. **Click "Save"**

---

### Step 2: Update Vercel Environment Variables

**Go to Vercel → Your Project → Settings → Environment Variables**

**Update:**
```env
NEXTAUTH_URL=https://resume-builder-ruddy-xi.vercel.app
```
(Must match your Vercel domain exactly, no trailing slash)

**After updating, redeploy:**
- Settings → Git → Redeploy latest deployment

---

### Step 3: Update LinkedIn Redirect URI

**Go to LinkedIn Developers:**
- https://www.linkedin.com/developers/apps
- Select your app (Client ID: `86o15lej2r7k0o`)
- Auth tab → OAuth 2.0 settings → Redirect URLs

**Add:**
```
https://resume-builder-ruddy-xi.vercel.app/api/auth/linkedin/callback
```

**Keep for local:**
```
http://localhost:3000/api/auth/linkedin/callback
```

---

## Why This Matters:

### Without Proper Supabase URLs:
- ❌ Authentication redirects fail
- ❌ Cookies aren't set properly
- ❌ Session appears lost after OAuth
- ❌ "Log in" button shows even when logged in

### With Proper Configuration:
- ✅ Authentication works correctly
- ✅ Cookies persist through redirects
- ✅ OAuth flows complete successfully
- ✅ Session maintained after LinkedIn import

---

## Quick Summary:

**3 Places to Update:**

1. **Supabase** → Authentication → URL Configuration
   - Site URL: `https://resume-builder-ruddy-xi.vercel.app`
   - Redirect URLs: `https://resume-builder-ruddy-xi.vercel.app/**`

2. **Vercel** → Settings → Environment Variables
   - `NEXTAUTH_URL=https://resume-builder-ruddy-xi.vercel.app`

3. **LinkedIn** → App Settings → OAuth Redirect URLs
   - `https://resume-builder-ruddy-xi.vercel.app/api/auth/linkedin/callback`

---

**After configuring all three, the session should persist correctly!** 🎯
