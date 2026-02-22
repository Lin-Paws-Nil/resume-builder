# Backend Infrastructure Plan for Resume Builder

## Current State Analysis

**Current Implementation:**
- ✅ Next.js 16 with App Router
- ✅ Client-side storage (localStorage/sessionStorage)
- ✅ Hardcoded authentication (SwapnilD/SwapnilD)
- ✅ Resume data stored in browser localStorage
- ✅ Profile pictures in localStorage
- ✅ Subscription data in localStorage
- ✅ OpenAI API integration for resume parsing & AI features

**What Needs Backend:**
1. User authentication & authorization
2. User profile data (name, email, profile picture)
3. Resume files storage (multiple resumes per user)
4. Resume metadata (created date, updated date, buckets/tags)
5. Subscription management (plan, expiry, payment history)
6. Payment processing (Stripe/Razorpay integration)
7. Financial credentials (payment methods, billing info)

---

## Recommended Tech Stack (Cost-Optimized with Startup Credits)

### 🏆 **Primary Recommendation: Supabase Stack**

**Why Supabase?**
- ✅ **Free tier**: 500MB database, 1GB file storage, 2GB bandwidth/month
- ✅ **PostgreSQL**: Industry-standard relational database
- ✅ **Built-in Auth**: Email/password, OAuth (Google, GitHub, etc.)
- ✅ **Real-time**: Built-in subscriptions for live updates
- ✅ **Storage**: File uploads with CDN
- ✅ **Row Level Security (RLS)**: Database-level security
- ✅ **No vendor lock-in**: Open source, can self-host later
- ✅ **Perfect for Next.js**: Great TypeScript support

**Cost**: Free tier covers early stage, then ~$25/month for Pro

---

### 🎯 **Alternative Stack Options**

#### Option 2: MongoDB Atlas + NextAuth.js + AWS S3
- **MongoDB Atlas**: Up to $50,000 credits via startup program
- **AWS S3**: Up to $100,000 credits via AWS Activate
- **NextAuth.js**: Free, open-source auth
- **Good for**: If you prefer NoSQL and want to leverage AWS credits

#### Option 3: Google Cloud + Firebase
- **Google Cloud**: Up to $200,000 credits via Google for Startups
- **Firebase Auth**: Free tier
- **Cloud Storage**: Included in credits
- **Good for**: AI-heavy features (you're using OpenAI, but could add Gemini)

---

## Detailed Architecture: Supabase Stack

### 1. Database Schema (PostgreSQL)

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  profile_picture_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan VARCHAR(20) NOT NULL CHECK (plan IN ('free', 'weekly', 'monthly', 'annual')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resumes table
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL DEFAULT 'My Resume',
  resume_data JSONB NOT NULL, -- Full resume JSON structure
  template_id VARCHAR(50) DEFAULT 'aurora',
  bucket_name VARCHAR(100), -- For organizing resumes (e.g., 'Company A', 'Accepted', etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  saved_at TIMESTAMP WITH TIME ZONE
);

-- Resume files (PDF/DOCX uploads) - stored in Supabase Storage
-- Metadata in database, actual files in storage bucket

-- Payment methods (Stripe)
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_payment_method_id VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'card', 'upi', etc.
  last4 VARCHAR(4), -- Last 4 digits of card
  brand VARCHAR(50), -- 'visa', 'mastercard', etc.
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment history
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  stripe_payment_intent_id VARCHAR(255),
  status VARCHAR(50) NOT NULL, -- 'succeeded', 'failed', 'pending'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Resumes: Users can only access their own resumes
CREATE POLICY "Users can manage own resumes"
  ON public.resumes FOR ALL
  USING (auth.uid() = user_id);

-- Subscriptions: Users can only view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Payment methods: Users can only access their own payment methods
CREATE POLICY "Users can manage own payment methods"
  ON public.payment_methods FOR ALL
  USING (auth.uid() = user_id);

-- Payments: Users can only view their own payments
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);
```

### 3. Storage Buckets (Supabase Storage)

```
resume-uploads/
  ├── {user_id}/
      ├── {resume_id}/
          ├── original.pdf (or .docx)
          └── metadata.json

profile-pictures/
  └── {user_id}/
      └── profile.jpg
```

**Storage Policies:**
- Users can upload to their own folder
- Users can read their own files
- Public read for profile pictures (optional)

---

## Implementation Plan

### Phase 1: Setup & Migration (Week 1-2)

#### 1.1 Supabase Setup
```bash
# Install Supabase client
npm install @supabase/supabase-js
npm install @supabase/ssr  # For Next.js SSR
```

**Steps:**
1. Create Supabase project at https://supabase.com
2. Get API keys (anon key, service role key)
3. Run database migrations (create tables, RLS policies)
4. Create storage buckets
5. Set up environment variables

**Environment Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### 1.2 Authentication Migration
- Replace localStorage auth with NextAuth.js + Supabase
- Support email/password + OAuth (Google, GitHub)
- Migrate existing users (SwapnilD) to database

**NextAuth.js Configuration:**
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { SupabaseAdapter } from '@auth/supabase-adapter';

export const authOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    // Email/password
    // Google OAuth
    // GitHub OAuth
  ],
};
```

#### 1.3 Data Migration Script
- Create script to migrate localStorage data to Supabase
- Migrate resumes, profile data, subscriptions

### Phase 2: Core Features (Week 3-4)

#### 2.1 User Management API
```typescript
// app/api/users/route.ts
// GET /api/users/me - Get current user profile
// PUT /api/users/me - Update profile
// POST /api/users/me/profile-picture - Upload profile picture
```

#### 2.2 Resume Management API
```typescript
// app/api/resumes/route.ts
// GET /api/resumes - List all user resumes
// POST /api/resumes - Create new resume
// GET /api/resumes/[id] - Get specific resume
// PUT /api/resumes/[id] - Update resume
// DELETE /api/resumes/[id] - Delete resume
// POST /api/resumes/[id]/upload - Upload PDF/DOCX file
```

#### 2.3 Subscription API
```typescript
// app/api/subscriptions/route.ts
// GET /api/subscriptions/current - Get current subscription
// POST /api/subscriptions/upgrade - Upgrade subscription
```

### Phase 3: Payment Integration (Week 5-6)

#### 3.1 Stripe Setup
```bash
npm install stripe @stripe/stripe-js
```

**Stripe Configuration:**
- Create Stripe account
- Get API keys (test + production)
- Set up webhooks for subscription events
- Use Stripe Atlas credits if applicable ($2,500)

**Environment Variables:**
```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### 3.2 Payment API
```typescript
// app/api/payments/route.ts
// POST /api/payments/create-checkout - Create checkout session
// POST /api/payments/webhook - Handle Stripe webhooks
// GET /api/payments/methods - List payment methods
// POST /api/payments/methods - Add payment method
```

#### 3.3 Subscription Management
- Handle subscription creation/updates via webhooks
- Update database when subscription changes
- Send email notifications (via Supabase or Resend)

### Phase 4: File Storage (Week 7)

#### 4.1 Resume File Upload
- Upload PDF/DOCX to Supabase Storage
- Store file metadata in database
- Generate signed URLs for downloads

#### 4.2 Profile Picture Upload
- Upload to Supabase Storage
- Generate optimized thumbnails (optional)
- Update profile record with URL

---

## Security Best Practices

### 1. Authentication
- ✅ Use NextAuth.js (industry standard)
- ✅ Store JWT tokens in httpOnly cookies
- ✅ Implement CSRF protection
- ✅ Rate limiting on auth endpoints

### 2. Database Security
- ✅ Row Level Security (RLS) on all tables
- ✅ Service role key only on server-side
- ✅ Never expose service role key to client
- ✅ Validate all inputs server-side

### 3. File Storage Security
- ✅ Signed URLs with expiration
- ✅ Validate file types and sizes
- ✅ Scan uploads for malware (optional, via Cloudflare)
- ✅ Private buckets by default

### 4. Payment Security
- ✅ Never store full card details
- ✅ Use Stripe Elements for card input
- ✅ PCI compliance via Stripe
- ✅ Webhook signature verification

### 5. API Security
- ✅ Rate limiting (via Vercel Edge Config or Upstash)
- ✅ Input validation (Zod schemas)
- ✅ CORS configuration
- ✅ Environment variable protection

---

## Cost Estimation (Using Startup Credits)

### Free Tier (0-1000 users)
- **Supabase**: Free (500MB DB, 1GB storage)
- **Vercel**: Free (100GB bandwidth)
- **Stripe**: Pay-as-you-go (2.9% + $0.30 per transaction)
- **Total**: ~$0-50/month (only Stripe fees)

### Growth Tier (1000-10,000 users)
- **Supabase Pro**: $25/month
- **Vercel Pro**: $20/month
- **Stripe**: Transaction fees
- **Total**: ~$45-200/month

### Scale Tier (10,000+ users)
- **Supabase**: $25-100/month (based on usage)
- **Vercel**: $20-100/month
- **AWS S3** (if needed): Use AWS Activate credits
- **Total**: ~$100-500/month

**With Startup Credits:**
- AWS Activate: $100,000 credits (covers S3, RDS if needed)
- Google Cloud: $200,000 credits (backup option)
- Stripe Atlas: $2,500 credits
- **Savings**: Significant reduction in early costs

---

## Migration Strategy

### Step 1: Parallel Run
- Keep localStorage working
- Add Supabase alongside
- Sync data bidirectionally

### Step 2: Gradual Migration
- New users → Supabase only
- Existing users → Migrate on next login
- Show migration banner for old users

### Step 3: Cutover
- Disable localStorage writes
- Migrate remaining users
- Remove localStorage code

---

## Alternative: If You Want to Use More Startup Credits

### Option: AWS Activate Stack
- **RDS PostgreSQL**: Database (covered by credits)
- **S3**: File storage (covered by credits)
- **Cognito**: Authentication (free tier)
- **Lambda**: Serverless functions (free tier)
- **API Gateway**: API management (free tier)

**Pros:**
- Leverage $100,000 AWS credits
- More control
- Enterprise-grade

**Cons:**
- More complex setup
- More services to manage
- Higher learning curve

---

## Recommended Next Steps

1. **Immediate (This Week)**:
   - [ ] Create Supabase account
   - [ ] Set up database schema
   - [ ] Install Supabase client
   - [ ] Create migration scripts

2. **Short Term (Next 2 Weeks)**:
   - [ ] Implement NextAuth.js
   - [ ] Migrate authentication
   - [ ] Create API routes for resumes
   - [ ] Migrate resume data

3. **Medium Term (Next Month)**:
   - [ ] Integrate Stripe
   - [ ] Set up payment flows
   - [ ] Implement file uploads
   - [ ] Add subscription management

4. **Long Term (Next Quarter)**:
   - [ ] Optimize database queries
   - [ ] Add caching (Redis via Upstash)
   - [ ] Implement analytics
   - [ ] Set up monitoring (Sentry)

---

## Resources & Documentation

- **Supabase Docs**: https://supabase.com/docs
- **NextAuth.js Docs**: https://next-auth.js.org
- **Stripe Docs**: https://stripe.com/docs
- **AWS Activate**: https://aws.amazon.com/activate/
- **Google for Startups**: https://cloud.google.com/startup

---

## Questions to Consider

1. **India vs Global**: 
   - If India-focused: Consider Razorpay alongside Stripe
   - Razorpay has ₹30L+ in startup perks

2. **File Size Limits**:
   - Supabase: 50MB per file (free tier)
   - For larger files: Use AWS S3 with credits

3. **Backup Strategy**:
   - Supabase: Automatic daily backups (Pro plan)
   - Or: Set up manual backups to S3

4. **Monitoring**:
   - Vercel Analytics (built-in)
   - Sentry (error tracking) - has startup program
   - PostHog (analytics) - has startup program

---

**Ready to start?** Let me know which stack you prefer, and I can help you implement it step by step! 🚀





