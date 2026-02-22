# 🚀 Complete Supabase Setup Guide for New Project

This guide walks you through setting up a new Supabase project from scratch for your Resume Builder application.

---

## 📋 Prerequisites

- A Supabase account (https://supabase.com)
- Your project's `.env.local` file ready to update

---

## Step 1: Create New Supabase Project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - **Organization**: Select or create one
   - **Project Name**: e.g., "Resume Builder"
   - **Database Password**: ⚠️ **Save this password!** You'll need it for direct database access
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine to start
4. Click **"Create new project"**
5. Wait 2-3 minutes for project to initialize

---

## Step 2: Get Your API Credentials

1. In your new project dashboard, go to **Settings** → **API**
2. Copy these values (you'll need them for `.env.local`):

   - **Project URL**: 
     ```
     https://xxxxx.supabase.co
     ```
   
   - **anon/public key**: 
     ```
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```
     (This is safe to expose in client-side code)
   
   - **service_role key**: 
     ```
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```
     ⚠️ **KEEP THIS SECRET!** Never expose in client-side code.

3. Update your `.env.local` file:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-new-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-new-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-new-service-role-key-here
   ```

---

## Step 3: Set Up Database Schema

### 3.1 Run Initial Schema Migration

1. Go to Supabase Dashboard → **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open the file: `supabase/migrations/001_initial_schema.sql` in your project
4. **Copy ALL the SQL code** from that file
5. **Paste it** into the SQL Editor
6. Click **"Run"** (or press `Cmd/Ctrl + Enter`)

✅ **Expected Result**: "Success. No rows returned"

**This creates:**
- ✅ `profiles` table (extends auth.users)
- ✅ `subscriptions` table
- ✅ `resumes` table
- ✅ `payment_methods` table
- ✅ `payments` table
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ Triggers for `updated_at` timestamps

### 3.2 Run Auth Triggers Migration

1. Still in **SQL Editor**, click **"New Query"** again
2. Open the file: `supabase/migrations/002_auth_triggers.sql` in your project
3. **Copy ALL the SQL code** from that file
4. **Paste it** into the SQL Editor
5. Click **"Run"**

✅ **Expected Result**: "Success. No rows returned"

**This creates:**
- ✅ `handle_new_user()` function
- ✅ Trigger that automatically creates a profile and free subscription when a user signs up

---

## Step 4: Create Storage Buckets

1. Go to Supabase Dashboard → **Storage** (left sidebar)
2. Click **"New bucket"**

### Bucket 1: `resume-uploads`

- **Name**: `resume-uploads`
- **Public**: ❌ **No** (leave unchecked - private bucket)
- **File size limit**: `10485760` (10MB in bytes)
- **Allowed MIME types**: 
  ```
  application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document
  ```
- Click **"Create bucket"**

### Bucket 2: `profile-pictures`

- **Name**: `profile-pictures`
- **Public**: ✅ **Yes** (check this box - for public profile pictures)
- **File size limit**: `5242880` (5MB in bytes)
- **Allowed MIME types**: 
  ```
  image/jpeg,image/png,image/webp
  ```
- Click **"Create bucket"**

### 4.1 Set Up Storage Policies (Important!)

After creating buckets, you need to set up policies so users can upload/read their own files.

1. Go to **Storage** → Click on `resume-uploads` bucket
2. Go to **"Policies"** tab
3. Click **"New Policy"**

⚠️ **IMPORTANT**: When copying the Policy Definition below, copy ONLY the SQL code (the text inside), NOT the markdown code fences (```sql and ```).

**Policy 1: Allow users to upload to their own folder**
- **Policy Name**: `Users can upload own resumes`
- **Allowed Operations**: `INSERT`
- **Policy Definition** (copy only the SQL, not the backticks):
  ```
  (bucket_id = 'resume-uploads'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])
  ```

**Policy 2: Allow users to read their own files**
- **Policy Name**: `Users can read own resumes`
- **Allowed Operations**: `SELECT`
- **Policy Definition** (copy only the SQL, not the backticks):
  ```
  (bucket_id = 'resume-uploads'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])
  ```

**Policy 3: Allow users to delete their own files**
- **Policy Name**: `Users can delete own resumes`
- **Allowed Operations**: `DELETE`
- **Policy Definition** (copy only the SQL, not the backticks):
  ```
  (bucket_id = 'resume-uploads'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])
  ```

4. Repeat for `profile-pictures` bucket with similar policies (or make it fully public if you want)

---

## Step 5: Configure Authentication Settings

1. Go to **Authentication** → **Settings** (left sidebar)

### 5.1 Email Settings

- **Enable Email Confirmations**: ✅ **Enabled** (recommended for production)
- **Enable Email Change Confirmations**: ✅ **Enabled**
- **Secure Email Change**: ✅ **Enabled**

### 5.2 Site URL

- **Site URL**: `http://localhost:3000` (for development)
- For production, update to your actual domain: `https://yourdomain.com`

### 5.3 Redirect URLs

Add these to **"Redirect URLs"** (one per line):
```
http://localhost:3000
http://localhost:3000/auth/callback
http://localhost:3000/login
```


below is pending since not live , remind me then
For production, also add:
```
https://yourdomain.com
https://yourdomain.com/auth/callback
https://yourdomain.com/login
https://yourdomain.com/signup
```

### 5.4 Email Templates (Optional)

You can customize email templates under **Authentication** → **Email Templates**:
- Confirm signup
- Magic Link
- Change Email Address
- Reset Password

---

## Step 6: Verify Setup

### 6.1 Check Database Tables

1. Go to **Table Editor** (left sidebar)
2. Verify these tables exist:
   - ✅ `profiles`
   - ✅ `subscriptions`
   - ✅ `resumes`
   - ✅ `payment_methods`
   - ✅ `payments`

### 6.2 Check Storage Buckets

1. Go to **Storage** (left sidebar)
2. Verify these buckets exist:
   - ✅ `resume-uploads`
   - ✅ `profile-pictures`

### 6.3 Check Triggers

1. Go to **Database** → **Functions** (left sidebar)
2. Verify `handle_new_user` function exists
3. Go to **Database** → **Triggers**
4. Verify `on_auth_user_created` trigger exists

### 6.4 Test Connection

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Check for errors in terminal
3. Open browser console and check for Supabase connection errors
4. Try signing up a new user to test the trigger

---

## Step 7: Test User Signup Flow

1. Go to your app's signup page: `http://localhost:3000/signup`
2. Create a test account
3. Check in Supabase Dashboard:
   - **Authentication** → **Users**: Should see new user
   - **Table Editor** → **profiles**: Should see profile created automatically
   - **Table Editor** → **subscriptions**: Should see free subscription created automatically

✅ If all three exist, your triggers are working correctly!

---

## 📝 Summary Checklist

- [ ] Created new Supabase project
- [ ] Copied API credentials (URL, anon key, service_role key)
- [ ] Updated `.env.local` with new credentials
- [ ] Ran `001_initial_schema.sql` migration
- [ ] Ran `002_auth_triggers.sql` migration
- [ ] Created `resume-uploads` storage bucket (private)
- [ ] Created `profile-pictures` storage bucket (public)
- [ ] Set up storage policies for both buckets
- [ ] Configured authentication settings (Site URL, Redirect URLs)
- [ ] Verified all tables exist
- [ ] Verified triggers and functions exist
- [ ] Tested user signup flow
- [ ] Restarted dev server and verified no errors

---

## 🆘 Troubleshooting

### "relation does not exist"
- **Solution**: Make sure you ran both SQL migration files in order

### "permission denied" when accessing tables
- **Solution**: Verify RLS policies were created (they're in `001_initial_schema.sql`)

### "permission denied" when uploading files
- **Solution**: Check storage bucket policies are set up correctly

### User signup doesn't create profile/subscription
- **Solution**: Verify `002_auth_triggers.sql` was run and trigger exists

### Email confirmation not working
- **Solution**: 
  - Check Site URL is set correctly
  - Verify Redirect URLs include your localhost URL
  - Check spam folder
  - For localhost, you may need to disable email confirmation temporarily or use a service like ngrok

### "Missing Supabase environment variables"
- **Solution**: 
  - Check `.env.local` exists and has all three Supabase variables
  - Restart dev server after updating `.env.local`

---

## 🎯 Next Steps

Once setup is complete:

1. **Test Authentication**: Sign up, log in, log out
2. **Test Profile Creation**: Verify profile is created on signup
3. **Test Subscription**: Verify free subscription is created
4. **Test File Upload**: Try uploading a resume PDF
5. **Test Resume Saving**: Save a resume and verify it's stored in database

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Need help?** Check the troubleshooting section above or refer to the Supabase documentation.

