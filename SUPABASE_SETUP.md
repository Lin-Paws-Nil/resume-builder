# Supabase Setup Guide

## Step 1: Get Your Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this SECRET!

## Step 2: Create Environment Variables

Create/update `.env.local` file in your project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OpenAI (already have this)
OPENAI_API_KEY=your-openai-key-here

# Stripe (we'll add this later)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

## Step 3: Run Database Setup

We'll create the database tables and policies. See the SQL scripts below.

## Step 4: Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install next-auth @auth/supabase-adapter
npm install zod  # For input validation
```

## Step 5: Test Connection

Once setup is complete, we'll test the connection.

---

**Next Steps:**
1. Get your credentials from Supabase dashboard
2. Add them to `.env.local`
3. Run the database setup SQL
4. Continue with the implementation





