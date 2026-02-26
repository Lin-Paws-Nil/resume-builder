# 🚀 Quick Start: Supabase Setup

## What I've Done

✅ Installed all required packages:
- `@supabase/supabase-js` - Supabase client
- `@supabase/ssr` - Server-side rendering support
- `next-auth` - Authentication
- `@auth/supabase-adapter` - NextAuth Supabase adapter
- `zod` - Input validation

✅ Created core files:
- `lib/supabase/client.ts` - Browser client
- `lib/supabase/server.ts` - Server client
- `lib/supabase/admin.ts` - Admin client (for migrations)
- `lib/types/database.ts` - TypeScript types
- `lib/utils/supabase-helpers.ts` - Helper functions
- `app/api/auth/[...nextauth]/route.ts` - Authentication API
- `supabase/migrations/001_initial_schema.sql` - Database schema

## What You Need to Do Now

### 1️⃣ Get Supabase Credentials (5 minutes)

1. Go to https://supabase.com/dashboard
2. Click on your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy these 3 values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)
   - **service_role key** (long string starting with `eyJ...`) ⚠️ Keep this secret!

### 2️⃣ Add Environment Variables (2 minutes)

1. Open `.env.local` in your project root
2. Add these lines (replace with your actual values):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-this-with-openssl-rand-base64-32
```

**To generate NEXTAUTH_SECRET**, run in terminal:
```bash
openssl rand -base64 32
```

**Optional – LinkedIn Import (Premium, no third-party):**  
Uses [Sign In with LinkedIn using OpenID Connect](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2) (official LinkedIn API). Import brings **name, email, profile picture, and locale**; for experience, education, and skills use the **Upload LinkedIn export (ZIP)** option (no API).

1. Create an app at [LinkedIn Developers](https://www.linkedin.com/developers/apps) and add the **"Sign In with LinkedIn using OpenID Connect"** product.
2. In the app, set the redirect URL to: `{NEXTAUTH_URL}/api/auth/linkedin/callback` (e.g. `http://localhost:3000/api/auth/linkedin/callback` for dev, `https://your-site.vercel.app/api/auth/linkedin/callback` for production).
3. In `.env.local`:
```env
LINKEDIN_CLIENT_ID=your-app-client-id
LINKEDIN_CLIENT_SECRET=your-app-client-secret
LINKEDIN_IMPORT_SECRET=random-secret-for-signing
```
Use `LINKEDIN_IMPORT_SECRET` or `NEXTAUTH_SECRET` for signing. **Upload LinkedIn export (ZIP)** works without any of these.

**Data Retrieved via OAuth:**
- ✅ Full name (given_name + family_name)
- ✅ Email address (with verification status)
- ✅ Profile picture URL
- ✅ Locale/region
- ❌ Experience, education, skills (use ZIP export)

**Optional – OpenAI (resume parse, enhance, grammar, spelling):**
```env
OPENAI_API_KEY=your-openai-api-key
```
For **corporate proxies / VPNs** that cause `SELF_SIGNED_CERT_IN_CHAIN` or "self-signed certificate" errors, you can disable TLS verification for OpenAI only (use only in development, behind trusted proxies):
```env
OPENAI_INSECURE_TLS=1
```

### 3️⃣ Set Up Database (5 minutes)

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Open the file: `supabase/migrations/001_initial_schema.sql`
4. Copy ALL the SQL code
5. Paste it into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

✅ You should see: "Success. No rows returned"

### 4️⃣ Create Storage Buckets (3 minutes)

1. Go to Supabase Dashboard → **Storage**
2. Click **New bucket**

**Bucket 1: `resume-uploads`**
- Name: `resume-uploads`
- Public: ❌ No (unchecked)
- File size limit: 10MB
- Allowed MIME types: `application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document`

**Bucket 2: `profile-pictures`**
- Name: `profile-pictures`
- Public: ✅ Yes (checked) - optional
- File size limit: 5MB
- Allowed MIME types: `image/jpeg, image/png, image/webp`

### 5️⃣ Test It! (2 minutes)

1. Restart your dev server:
```bash
npm run dev
```

2. Check for errors in the console
3. If you see "Missing Supabase environment variables", double-check your `.env.local` file

## ✅ Verification

After completing the steps above, verify:

- [ ] No errors in terminal when running `npm run dev`
- [ ] Can see tables in Supabase Dashboard → **Table Editor**:
  - `profiles`
  - `subscriptions`
  - `resumes`
  - `payment_methods`
  - `payments`
- [ ] Storage buckets exist in **Storage** section

## 🎯 What's Next?

Once you've completed the setup above, let me know and I'll help you:

1. **Migrate existing data** (SwapnilD user, resumes from localStorage)
2. **Update login system** to use Supabase
3. **Create API routes** for resume management
4. **Add file upload** functionality
5. **Integrate Stripe** for payments

---

## 🆘 Need Help?

If you encounter any issues:

1. **"Missing environment variables"**
   - Check `.env.local` exists and has all variables
   - Restart dev server after adding variables

2. **"relation does not exist"**
   - Make sure you ran the SQL migration script
   - Check tables exist in Supabase Dashboard

3. **"permission denied"**
   - Verify RLS policies were created (they're in the SQL script)
   - Check you're using the correct user context

4. **`(node:...) [DEP0169] DeprecationWarning: url.parse()`**
   - This comes from dependencies (e.g. pdf-parse, mammoth, Next.js), not from this project's code. It is safe to ignore. It will be resolved when those packages adopt the WHATWG URL API.

5. **"self-signed certificate in certificate chain" or "SELF_SIGNED_CERT_IN_CHAIN" when using OpenAI**
   - Usually caused by a corporate proxy or VPN that does SSL inspection. Add `OPENAI_INSECURE_TLS=1` to `.env.local` and restart. Use only in development behind trusted proxies.

---

**Ready?** Complete steps 1-5 above, then let me know! 🚀





