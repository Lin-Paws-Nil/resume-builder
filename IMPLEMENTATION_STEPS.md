# Supabase Implementation Steps

## ✅ Step 1: Get Your Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - ⚠️ Keep this SECRET!

## ✅ Step 2: Set Up Environment Variables

1. Open your `.env.local` file (create it if it doesn't exist)
2. Add these variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-random-secret-here

# OpenAI (you already have this)
OPENAI_API_KEY=your-openai-key-here
```

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

## ✅ Step 3: Set Up Database Schema

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL Editor
5. Click **Run** (or press Cmd/Ctrl + Enter)

This will create:
- ✅ `profiles` table
- ✅ `subscriptions` table
- ✅ `resumes` table
- ✅ `payment_methods` table
- ✅ `payments` table
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ Triggers for `updated_at` timestamps

## ✅ Step 4: Create Storage Buckets

1. Go to Supabase Dashboard → **Storage**
2. Create these buckets:

### Bucket 1: `resume-uploads`
- **Public**: No (private)
- **File size limit**: 10MB
- **Allowed MIME types**: `application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document`

### Bucket 2: `profile-pictures`
- **Public**: Yes (optional, for public profile pics)
- **File size limit**: 5MB
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`

## ✅ Step 5: Test the Connection

1. Restart your dev server:
```bash
npm run dev
```

2. Check the console for any errors
3. If you see connection errors, verify your environment variables

## ✅ Step 6: Migrate Existing User (SwapnilD)

We'll create a migration script to move your existing data. This will be done in the next phase.

## 🎯 Next Steps After Setup

Once the database is set up, we'll:
1. Update the login system to use Supabase
2. Migrate existing resume data
3. Update API routes to use Supabase
4. Add file upload functionality
5. Integrate Stripe for payments

---

## 🔍 Verification Checklist

- [ ] Supabase project created
- [ ] Environment variables added to `.env.local`
- [ ] Database schema created (all tables exist)
- [ ] Storage buckets created
- [ ] Dev server starts without errors
- [ ] Can connect to Supabase (check browser console)

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Check that `.env.local` exists and has all required variables
- Restart your dev server after adding variables

### "relation does not exist"
- Make sure you ran the SQL migration script
- Check that tables exist in Supabase Dashboard → Table Editor

### "permission denied"
- Check that RLS policies are created
- Verify you're using the correct user context

---

**Ready?** Once you've completed Steps 1-5, let me know and we'll proceed with the integration! 🚀





