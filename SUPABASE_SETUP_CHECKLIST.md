# ✅ Supabase Setup Checklist

Quick reference checklist for setting up a new Supabase project.

---

## 🔑 Step 1: Get Credentials (2 minutes)

- [ ] Create new project at https://supabase.com/dashboard
- [ ] Go to **Settings** → **API**
- [ ] Copy **Project URL**: `https://xxxxx.supabase.co`
- [ ] Copy **anon/public key**: `eyJ...`
- [ ] Copy **service_role key**: `eyJ...` ⚠️ Keep secret!
- [ ] Update `.env.local` with new credentials

---

## 🗄️ Step 2: Database Schema (5 minutes)

- [ ] Go to **SQL Editor**
- [ ] Run `supabase/migrations/001_initial_schema.sql`
  - Click "New Query"
  - Copy entire file content
  - Paste and click "Run"
- [ ] Run `supabase/migrations/002_auth_triggers.sql`
  - Click "New Query" again
  - Copy entire file content
  - Paste and click "Run"
- [ ] Verify tables exist in **Table Editor**:
  - [ ] `profiles`
  - [ ] `subscriptions`
  - [ ] `resumes`
  - [ ] `payment_methods`
  - [ ] `payments`

---

## 📦 Step 3: Storage Buckets (5 minutes)

- [ ] Go to **Storage**
- [ ] Create bucket `resume-uploads`:
  - [ ] Name: `resume-uploads`
  - [ ] Public: ❌ No
  - [ ] File size: `10485760` (10MB)
  - [ ] MIME types: `application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- [ ] Create bucket `profile-pictures`:
  - [ ] Name: `profile-pictures`
  - [ ] Public: ✅ Yes
  - [ ] File size: `5242880` (5MB)
  - [ ] MIME types: `image/jpeg,image/png,image/webp`
- [ ] Set up storage policies for both buckets (see detailed guide)

---

## 🔐 Step 4: Authentication Settings (3 minutes)

- [ ] Go to **Authentication** → **Settings**
- [ ] Set **Site URL**: `http://localhost:3000`
- [ ] Add **Redirect URLs**:
  - [ ] `http://localhost:3000`
  - [ ] `http://localhost:3000/auth/callback`
  - [ ] `http://localhost:3000/login`
  - [ ] `http://localhost:3000/signup`
- [ ] Enable email confirmations (or disable for localhost testing)

---

## ✅ Step 5: Verification (2 minutes)

- [ ] Restart dev server: `npm run dev`
- [ ] Check for errors in terminal
- [ ] Check browser console for Supabase errors
- [ ] Test signup: Create a new user
- [ ] Verify in Supabase Dashboard:
  - [ ] User appears in **Authentication** → **Users**
  - [ ] Profile created in **Table Editor** → **profiles**
  - [ ] Subscription created in **Table Editor** → **subscriptions**

---

## 🎉 Done!

If all checkboxes are checked, your Supabase setup is complete!

**Next**: Test your app's authentication and file upload features.

---

**Detailed instructions**: See `SUPABASE_NEW_PROJECT_SETUP.md`


