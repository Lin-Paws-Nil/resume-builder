# 🚀 Go Live Checklist

Complete this checklist when deploying to production (Vercel).

Your Production URL: `https://resume-builder-platform.vercel.app`

---

## ✅ 1. Vercel Configuration

### Environment Variables

**Go to:** Vercel → Your Project → Settings → Environment Variables

**Update these for Production environment:**

```env
NEXTAUTH_URL=https://resume-builder-platform.vercel.app
```
⚠️ **Critical:** Must match your actual Vercel domain exactly (no trailing slash)

**All other variables (already configured):**
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `NEXTAUTH_SECRET`
- ✅ `OPENAI_API_KEY`
- ✅ `LINKEDIN_CLIENT_ID`
- ✅ `LINKEDIN_CLIENT_SECRET`

### After Updating:
- [ ] Click "Save"
- [ ] Redeploy: Go to Deployments → Click latest → "..." → "Redeploy"

---

## ✅ 2. Supabase Configuration

**Go to:** https://supabase.com/dashboard/project/uqluxzmmdsuejzjixido/auth/url-configuration

### Site URL

- [ ] **Change from:** `http://localhost:3000`
- [ ] **To:** `https://resume-builder-platform.vercel.app`
- [ ] Click "Save"

### Redirect URLs

**Keep all these (already configured):**
- [ ] `http://localhost:3000/**` (for local dev)
- [ ] `http://localhost:3000/api/auth/linkedin/callback`
- [ ] `https://resume-builder-platform.vercel.app/**`
- [ ] `https://resume-builder-platform.vercel.app/api/auth/linkedin/callback`
- [ ] `https://resume-builder-platform.vercel.app/builder`
- [ ] `https://resume-builder-platform.vercel.app/login`

### After Updating:
- [ ] Click "Save changes"
- [ ] Wait 1-2 minutes for changes to propagate

---

## ✅ 3. LinkedIn Developer App

**Go to:** https://www.linkedin.com/developers/apps

**Select your app:** Resume Builder (Client ID: `86o15lej2r7k0o`)

### Products Tab

- [ ] Verify **"Sign In with LinkedIn using OpenID Connect"** is added
- [ ] Status should show: "Approved" or "Active"
- [ ] Remove old "Verified on LinkedIn" if present

### Auth Tab → OAuth 2.0 Settings

**Authorized redirect URLs for your app:**

- [ ] `http://localhost:3000/api/auth/linkedin/callback` ← Local development
- [ ] `https://resume-builder-platform.vercel.app/api/auth/linkedin/callback` ← Production

### Verify Scopes:
- [ ] Should show: `openid`, `profile`, `email`
- [ ] NOT: `r_profile_basicinfo` (old/deprecated)

### After Updating:
- [ ] Click "Update"
- [ ] Wait 1-2 minutes for changes to propagate

---

## ✅ 4. Local Development (.env.local)

**File:** `/Users/swapnild/Documents/Project X/.env.local`

**For local development, keep:**
```env
NEXTAUTH_URL=http://localhost:3000
```

**All other values stay the same** (Supabase, OpenAI, LinkedIn credentials)

### After Updating:
- [ ] Save file
- [ ] Restart dev server: `npm run dev`

---

## ✅ 5. Git Configuration

**For future commits:**

```bash
git config user.email "swapnilblimale32@gmail.com"
git config user.name "Swapnil D"
```

⚠️ **Important:** Email must match your GitHub account for Vercel to deploy!

### Verify:
```bash
git config user.email  # Should show: swapnilblimale32@gmail.com
```

---

## ✅ 6. Testing Checklist

After all configurations are updated:

### Test on Production:
- [ ] Visit: `https://resume-builder-platform.vercel.app`
- [ ] Sign up with new account
- [ ] Log in
- [ ] Refresh page → Should stay logged in ✅
- [ ] Try LinkedIn import → Should work ✅
- [ ] Download PDF → Should work (for premium users)

### Test on Local:
- [ ] Run: `npm run dev`
- [ ] Visit: `http://localhost:3000`
- [ ] Log in
- [ ] Try LinkedIn import → Should work ✅

---

## 🔄 Quick Reference Table

| Service | Setting | Local Value | Production Value |
|---------|---------|-------------|------------------|
| **Vercel** | NEXTAUTH_URL | N/A | `https://resume-builder-platform.vercel.app` |
| **Supabase** | Site URL | N/A | `https://resume-builder-platform.vercel.app` |
| **Supabase** | Redirect URLs | `http://localhost:3000/**` | `https://resume-builder-platform.vercel.app/**` |
| **LinkedIn** | Callback URL | `http://localhost:3000/api/auth/linkedin/callback` | `https://resume-builder-platform.vercel.app/api/auth/linkedin/callback` |
| **.env.local** | NEXTAUTH_URL | `http://localhost:3000` | N/A (uses Vercel env vars) |

---

## 📋 Summary

**3 places to update when going live:**

1. **Vercel:** Environment Variables → `NEXTAUTH_URL`
2. **Supabase:** Authentication → URL Configuration → Site URL
3. **LinkedIn:** Products tab → Verify OpenID Connect; Auth tab → Verify callback URLs

**Local .env.local stays as:** `http://localhost:3000`

---

## ⚠️ Common Mistakes to Avoid:

- ❌ Don't put production URL in `.env.local` (breaks local dev)
- ❌ Don't forget trailing `/api/auth/linkedin/callback` for LinkedIn
- ❌ Don't add trailing slash to NEXTAUTH_URL or Site URL
- ❌ Don't forget to redeploy Vercel after changing env vars
- ❌ Don't commit `.env.local` to git (it's already gitignored)

---

## 🎯 Current Status:

Based on your screenshots:
- ✅ LinkedIn app has correct callback URLs
- ✅ Local .env.local updated to localhost
- ⏳ Need to verify Supabase Site URL is set to production URL
- ⏳ Need to verify Vercel NEXTAUTH_URL is set to production URL
- ⏳ Need to verify LinkedIn has "OpenID Connect" product

**Your localhost LinkedIn should work now! Restart your dev server and test.** 🚀
