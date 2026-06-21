# 🚀 createresume.co - Implementation Guide

## Project Overview

Build a modern, professional **resume builder web application** called **createresume.co** that helps users create ATS-friendly, beautifully designed resumes in minutes. The application should be intuitive, visually appealing, and support multiple subscription tiers with premium features.

**Tech Stack:**
- **Frontend Framework**: Next.js 16+ (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Custom component library with shadcn/ui patterns
- **Icons**: Lucide React
- **Backend**: Let Lovable handle authentication, database, and API routes automatically

---

## 🎨 Design System & Brand Identity

### Brand Colors
- **Primary**: Blue (#2563EB / `blue-600`)
- **Secondary**: Purple accents for premium features
- **Success**: Green (#10B981 / `green-600`)
- **Warning**: Amber/Yellow for premium gates
- **Background**: Light gradients (`from-blue-50 via-white to-blue-50`)

### Typography
- **Headings**: Bold, modern sans-serif
- **Body**: Clean, readable text
- **Brand Name**: "createresume.co" - always lowercase with .io

### Visual Style
- **Modern & Clean**: Minimalist design with plenty of white space
- **Professional**: Corporate-friendly aesthetic
- **Gradient Accents**: Subtle gradients for visual interest
- **Card-based Layouts**: Rounded corners, subtle shadows
- **Smooth Animations**: Hover effects, transitions, loading states

---

## 📄 Page 1: Home Page (`/`)

### Purpose
Landing page that converts visitors into users. Showcase value proposition, features, social proof, and clear CTAs.

### Layout Structure

#### **Header (Sticky)**
- **Left**: Logo (FileText icon + "createresume.co" text)
- **Right**: 
  - "Login" button (ghost style)
  - "Sign Up" button (primary blue)
- **Style**: White background with subtle border, backdrop blur

#### **Hero Section**
- **Left Column**:
  - Live counter: "X resumes created today" (animated, increments every 5 seconds)
  - Main headline: "Build a **free** resume in a few clicks"
  - Subheadline: Value proposition about job-winning resumes
  - Two CTAs:
    - Primary: "Create a New Resume" (blue button)
    - Secondary: "Improve My Resume" (outline button)
  - Stats box: 
    - "48% more likely to get hired"
    - "12% better pay with your next job"

- **Right Column**:
  - Example resume preview card:
    - Profile section (avatar, name, title)
    - Summary section
    - Experience section
    - Skills section
    - "✓ ATS Perfect" badge (green)
    - AI-powered suggestions box (blue background)

#### **Companies Section**
- Text: "Our customers have been hired at:"
- Logos/Names: Google, DHL, Booking.com, Spotify, Facebook, Amazon
- Style: Gray text, subtle opacity

#### **Features Section** (4-column grid)
1. **Pre-written text & customization**
   - Icon: FileText
   - Description about saving time

2. **Get inspired by AI suggestions**
   - Icon: Sparkles
   - Description about AI-powered content

3. **Reach recruiters every time**
   - Icon: Shield
   - Description about ATS-friendly resumes

4. **Level up your paycheck**
   - Icon: TrendingUp
   - Description about career boost

Each feature card: Blue background, white preview box, hover effects

#### **Steps Section** (2-column)
- **Left**: Example resume visual
- **Right**: 
  - Headline: "Create a free, job-winning **resume** in 3 simple steps"
  - Step 1: Choose a template (icon + description)
  - Step 2: Customize sections (icon + description)
  - Step 3: Download (icon + description)
  - CTA: "Create My Resume Now" button

#### **Testimonials Section** (3-column grid, 6 testimonials)
- Each card: 5-star rating, quote, avatar + name + company
- Background: Light blue
- Rotate/scroll testimonials

#### **Final CTA Section**
- Background: Blue gradient
- Headline: "Ready to create your winning resume?"
- Subheadline: Social proof
- Large CTA button: "Create a Resume for Free"

#### **Footer**
- Dark background
- Logo + copyright
- Minimal links

### Interactive Elements
- Animated counter for resumes created
- Hover effects on feature cards
- Smooth scroll animations
- Responsive design (mobile-friendly)

---

## 📋 Page 2: Templates Page (`/templates`)

### Purpose
Allow users to browse and select from 12+ professional resume templates before starting to build.

### Layout Structure

#### **Header**
- Same as home page (logo + Login/Sign Up)
- Breadcrumb: "Templates"

#### **Template Grid**
- **12 Templates** organized in a responsive grid (3-4 columns on desktop)
- Each template card shows:
  - **Preview**: Live template preview with sample data (scaled down, ~142% zoom to fit)
  - **Hover Overlay**: 
    - Dark overlay appears on hover
    - "Use This Template" button (large, prominent)
  - **Template Info**:
    - Template name (bold)
    - Category badge (Modern, Professional, Minimalist, Creative, Simple)
    - Description text
    - Color preview bar (gradient showing template's color scheme)

#### **Template Categories**
- **Modern**: Aurora, Modern
- **Professional**: Hyperion, Stellar, Aether, Cosmos
- **Minimalist**: Lunar, Zenith
- **Creative**: Nebula, Creative
- **Simple**: Eon

#### **Color Customization** (if applicable)
- Some templates support color themes
- Color picker/swatches when template supports it
- Preview updates in real-time

#### **Template Selection Flow**
1. User hovers over template → overlay appears
2. User clicks "Use This Template"
3. Redirect to `/builder?template={templateId}`
4. Builder loads with selected template

### Sample Resume Data for Previews
Use consistent sample data across all template previews:
- Name: "John Doe"
- Title: "Senior Software Engineer"
- Email, phone, location
- 1-2 experiences
- 1 education entry
- Skills list

---

## 🛠️ Page 3: Builder/Preview Page (`/builder`)

### Purpose
Main workspace where users create and edit their resumes with live preview.

### Layout Structure

#### **Top Header Bar**
- **Left**:
  - Profile picture button (or User icon) → opens account page
  - "createresume.co" logo
  - "| Resume Builder" text
  - "Guest Mode" badge (if not logged in)

- **Right**:
  - Undo/Redo buttons (with icons)
  - Download PDF button (locked icon if free plan)
  - Profile dropdown / Logout button

#### **Template Bar** (Below header)
- Horizontal scrollable row of template thumbnails
- Current template highlighted with checkmark
- Click to switch templates instantly
- Each thumbnail: Small preview (scaled down) with template name below

#### **Main Content Area** (Split View)

**Left Panel** (Resizable, default ~640px width):
- **Collapsible Sections**:
  1. **Resume Upload** (PDF/DOCX import)
  2. **LinkedIn Import** (Sign in with LinkedIn OR upload export ZIP)
  3. **"Preview and Save"** button (green, prominent)
  4. **Section Editor** (scrollable):
     - Personal Information
     - Summary
     - Experience (add/edit/delete entries)
     - Education (add/edit/delete entries)
     - Skills (categorized)
     - Projects
     - Certifications
     - Hobbies
     - Custom Sections (user-defined)

- **Resize Handle**: Vertical grip between left and right panels
- **Scrollable**: Left panel content scrolls independently

**Right Panel** (Preview):
- **Live Resume Preview**:
  - A4-sized preview (210mm width)
  - Real-time updates as user edits
  - Multiple pages if content is long
  - Page numbers if multi-page
  - Scrollable if content exceeds viewport

### Key Features

#### **Section Editor**
- **Collapsible sections** with expand/collapse icons
- **Drag-and-drop** to reorder sections
- **Inline editing** for all fields
- **Add/Remove** buttons for array items (experiences, education, etc.)
- **AI Enhancement** buttons (sparkle icon) for:
  - Text enhancement
  - Grammar fix
  - Spelling fix
- **Rich text fields** with bullet point support

#### **Resume Upload**
- File input (PDF or DOCX)
- Drag-and-drop zone
- Parsing status indicator
- Success notification

#### **LinkedIn Import**
- **Option 1**: "Sign in with LinkedIn to import" (OAuth flow)
  - Imports: name, email, profile link
  - Note: "For experience, education, and skills, add them below or upload a LinkedIn data export"
- **Option 2**: "Upload LinkedIn export (ZIP)"
  - Instructions link
  - File input for ZIP
  - Parses Profile.csv, Positions.csv, Education.csv, Skills.csv

#### **Preview and Save Button**
- Green, prominent button
- Saves current editor state to preview
- Shows notification on success
- If imported resume exists, shows: "Click to apply the imported resume to your editor"

### User States

#### **Guest Mode**
- Can use builder
- Cannot download PDF
- Cannot save to account
- "Guest Mode" badge visible
- Prompts to log in for premium features

#### **Free Plan**
- Can edit and preview
- Cannot download PDF
- Download button shows lock icon
- Clicking download → upgrade prompt

#### **Premium Plan** (Weekly/Monthly/Annual)
- Full access
- Unlimited PDF downloads
- All features unlocked

---

## 👤 Page 4: Account/Dashboard Page (`/account`)

### Purpose
User profile management, subscription management, and resume dashboard.

### Layout Structure

#### **Header**
- Logo + "Account" breadcrumb
- Current plan badge (if premium)
- "Back to Builder" button
- Logout button

#### **Tab Navigation** (3 tabs)
1. **Dashboard** (default)
2. **Account Settings**
3. **Payment Information**

#### **Left Sidebar** (All tabs)
- **Profile Picture**:
  - Large circular avatar (128px)
  - Camera icon button to change
  - Username/email below
- **Tab Navigation**:
  - Dashboard icon + label
  - Settings icon + label
  - Payment icon + label
- Active tab highlighted

### Tab 1: Dashboard

#### **Resume List**
- Grid or list view of all saved resumes
- Each resume card shows:
  - Resume title
  - Template preview thumbnail
  - Last updated date
  - "Edit" button
  - "Delete" button (with confirmation)
- **Empty State**: "No resumes yet. Create your first resume in the builder."
- **Create New Resume** button (prominent)

#### **Quick Stats** (Optional)
- Total resumes created
- Last resume updated date
- Most used template

### Tab 2: Account Settings

#### **Profile Information**
- Username (editable)
- First Name
- Last Name
- Email (read-only or editable)
- Save button

#### **Subscription Status**
- Current plan display
- Plan expiry date (if premium)
- "Upgrade" or "Manage Subscription" button
- Subscription history table (if applicable)

#### **Subscription Upgrade Section**
- **Plan Comparison Cards** (3 cards: Weekly, Monthly, Annual)
  - Each card shows:
    - Plan name + icon
    - Price (₹150, ₹350, ₹3,200)
    - Duration
    - Feature list with checkmarks
    - "Select Plan" button
  - "Most Popular" badge on Monthly plan
  - "Current" badge on active plan
  - Selected plan highlighted with border
- **Upgrade Flow**: Selected plan → redirect to payment

### Tab 3: Payment Information

#### **Payment Methods**
- **Card Payment**:
  - Card number input (formatted: 1234 5678 9012 3456)
  - Cardholder name
  - Expiry (MM/YY)
  - CVV
  - "Save Card" button
  - Security badge (Lock icon + "Secure and encrypted")

- **UPI Payment** (for Indian users):
  - UPI ID input (yourname@paytm, etc.)
  - "Save UPI ID" button
  - Security badge

- **Payment Method Toggle**: Switch between Card and UPI

#### **Saved Payment Methods** (if any)
- List of saved cards/UPI IDs
- Default payment method indicator
- Remove option

#### **Payment History**
- Table of past transactions
- Columns: Date, Plan, Amount, Status
- Receipt download (if available)

---

## 💳 Subscription Plans & Modes

### Plan Tiers

#### **Free Plan** (Default)
- **Price**: Free forever
- **Features**:
  - ✅ View and edit resumes
  - ✅ Generate resume preview
  - ✅ Use all templates
  - ✅ AI text enhancement (limited)
  - ❌ PDF downloads
  - ❌ LinkedIn import (OAuth)
- **Visual**: Gray badge, FileText icon

#### **Weekly Plan**
- **Price**: ₹150 / 7 days
- **Features**:
  - ✅ All free features
  - ✅ Unlimited PDF downloads
  - ✅ Priority support
  - ✅ Advanced editing tools
  - ✅ LinkedIn import
- **Visual**: Blue badge, Zap icon

#### **Monthly Plan** (Most Popular)
- **Price**: ₹350 / 30 days
- **Features**:
  - ✅ All weekly features
  - ✅ Resume analytics
- **Visual**: Purple badge, Star icon
- **Badge**: "Most Popular" on upgrade page

#### **Annual Plan**
- **Price**: ₹3,200 / 365 days
- **Features**:
  - ✅ All monthly features
  - ✅ Cover letter builder
  - ✅ Job application tracker
- **Visual**: Gold badge, Crown icon

### Subscription States & UI Behavior

#### **Free User**
- Download button: Locked icon, disabled
- Clicking download → Modal: "Upgrade to download PDFs"
- LinkedIn import: Locked, shows upgrade prompt
- Premium features: Gated with lock icons

#### **Premium User** (Active Subscription)
- Download button: Enabled, blue
- All features unlocked
- Plan badge visible in header
- Expiry countdown (optional)

#### **Expired Premium User**
- Falls back to free plan
- Shows "Subscription Expired" message
- "Renew" button in account page

### Upgrade Flow
1. User clicks "Upgrade" or locked feature
2. Redirect to `/account?tab=payment`
3. Shows plan comparison
4. User selects plan
5. Payment form appears
6. After payment → subscription activated
7. Redirect back to builder with success message

---

## 🎯 User Flows

### Flow 1: New User → Create Resume
1. Land on home page
2. Click "Create a New Resume"
3. Redirect to `/templates`
4. Browse templates, hover to see preview
5. Click "Use This Template"
6. Redirect to `/builder?template={id}`
7. Builder loads with selected template
8. User fills in sections
9. Preview updates in real-time
10. Click "Preview and Save"
11. (If free) Cannot download → upgrade prompt
12. (If premium) Can download PDF

### Flow 2: Import Existing Resume
1. In builder, click "Upload Resume" (PDF/DOCX)
2. File uploads, parsing starts
3. Success notification
4. Click "Preview and Save"
5. Imported data populates editor
6. User can edit and save

### Flow 3: LinkedIn Import
1. In builder, expand "Import from LinkedIn"
2. **Option A**: Click "Sign in with LinkedIn"
   - OAuth redirect
   - Returns with name, email, profile link
   - Shows in preview
3. **Option B**: Upload LinkedIn export ZIP
   - Instructions link
   - Upload ZIP
   - Parses and imports full data
4. Click "Preview and Save" to apply

### Flow 4: Upgrade to Premium
1. User tries to download PDF (free user)
2. Modal: "Upgrade required"
3. Click "Upgrade"
4. Redirect to `/account?tab=payment`
5. See plan comparison
6. Select plan (Weekly/Monthly/Annual)
7. Enter payment details (Card or UPI)
8. Complete payment
9. Subscription activated
10. Redirect to builder
11. Download button now enabled

### Flow 5: Manage Account
1. Click profile picture in builder header
2. Redirect to `/account` (Dashboard tab)
3. See list of saved resumes
4. Click "Edit" → opens builder with that resume
5. Switch to "Account Settings" → edit profile
6. Switch to "Payment" → manage payment methods, view history

---

## 🧩 Key Components Needed

### UI Components (Reusable)
- **Button**: Primary, secondary, ghost, outline variants
- **Input**: Text, email, password, textarea
- **Card**: Container with shadow and border
- **Modal/Dialog**: For confirmations, upgrades
- **Notification/Toast**: Success, error messages
- **Badge**: Plan badges, status indicators
- **Avatar**: Profile pictures with fallback
- **Tabs**: Tab navigation component
- **File Upload**: Drag-and-drop zone
- **Loading Spinner**: For async operations

### Feature Components
- **ResumeUpload**: PDF/DOCX upload with parsing
- **LinkedInImport**: OAuth + ZIP upload options
- **SectionEditor**: Collapsible form sections
- **ResumePreview**: Live preview renderer
- **TemplateBar**: Horizontal template selector
- **SubscriptionUpgrade**: Plan comparison cards
- **PaymentForm**: Card + UPI inputs
- **Dashboard**: Resume list view

### Template Components (12 templates)
Each template is a React component that receives `resume: ResumeData` prop and renders:
- Personal Info section
- Summary section
- Experience entries
- Education entries
- Skills (categorized)
- Projects
- Certifications
- Hobbies
- Custom sections

Templates should be:
- A4-sized (210mm × 297mm)
- Print-ready styling
- ATS-friendly (no complex layouts)
- Responsive to content length

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Adaptations
- **Home**: Stack hero columns, 2-column feature grid
- **Templates**: 2-column grid, larger cards
- **Builder**: 
  - Left panel: Full width, collapsible
  - Preview: Full width below editor
  - Or: Tabs to switch between editor and preview
- **Account**: Stack sidebar and content

---

## 🎨 Visual Polish & Animations

### Micro-interactions
- **Hover Effects**: Cards lift slightly, buttons darken
- **Loading States**: Spinners, skeleton loaders
- **Transitions**: Smooth color changes, fade-ins
- **Success States**: Green checkmarks, success messages
- **Error States**: Red borders, error messages

### Animations
- **Counter**: Smooth number increments
- **Template Hover**: Overlay fades in
- **Section Expand/Collapse**: Smooth height transitions
- **Page Transitions**: Fade between routes

---

## 🔐 Authentication & User States

### Let Lovable Handle:
- User authentication (email/password, OAuth)
- Session management
- User database
- Protected routes

### User States to Support:
1. **Unauthenticated**: Can browse templates, use builder in guest mode
2. **Authenticated (Free)**: Can save resumes, cannot download
3. **Authenticated (Premium)**: Full access

### Guest Mode
- Allow building resumes without account
- Save to localStorage
- Prompt to sign up for saving/downloading
- "Guest Mode" badge visible

---

## 💾 Data Structure

### Resume Data Model
```typescript
interface ResumeData {
  id: string;
  title: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  summary: string;
  experiences: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string[]; // Bullet points
    achievements?: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    honors?: string;
  }>;
  skills: Array<{
    id: string;
    category: string;
    items: string[];
  }>;
  projects: Array<{...}>;
  certifications: Array<{...}>;
  hobbies: Array<{...}>;
  customSections: Array<{...}>;
  sectionOrder: string[];
  sectionNames: Record<string, string>;
  templateId: string;
  templateColor?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 🚀 Implementation Notes for Lovable

### Backend/Auth
- **Let Lovable handle**: User authentication, database, API routes
- **Use Lovable's built-in**: Auth system, database tables, API generation
- **No need to specify**: Supabase, database schemas, auth providers (Lovable will set this up)

### State Management
- Use Zustand for client-side state (resume editor, preview, templates)
- Lovable can handle server state (user data, resumes, subscriptions)

### API Routes Needed (Lovable will generate)
- `/api/resumes` - CRUD for resumes
- `/api/auth/linkedin` - LinkedIn OAuth initiation
- `/api/auth/linkedin/callback` - OAuth callback
- `/api/linkedin/oauth-import-data` - Get imported data
- `/api/linkedin/import-from-export` - Parse ZIP export
- `/api/parse-resume` - Parse uploaded PDF/DOCX
- `/api/generate-pdf` - Generate PDF from resume
- `/api/enhance-text` - AI text enhancement
- `/api/fix-grammar` - AI grammar fix
- `/api/fix-spelling` - AI spelling fix

### Payment Integration
- **Let Lovable handle**: Stripe/Razorpay integration
- **Support**: Card payments and UPI (for Indian market)
- **Subscription management**: Automatic renewal, expiry handling

### Premium Feature Gating
- Check subscription status before allowing:
  - PDF downloads
  - LinkedIn OAuth import
  - Advanced AI features (if any)
- Show upgrade prompts with clear CTAs

---

## ✅ Success Criteria

### User Experience
- ✅ Intuitive navigation between pages
- ✅ Fast, responsive interface
- ✅ Clear visual feedback for all actions
- ✅ Mobile-friendly design
- ✅ Accessible (keyboard navigation, screen readers)

### Functionality
- ✅ All 12 templates render correctly
- ✅ Real-time preview updates
- ✅ Resume upload/parsing works
- ✅ LinkedIn import (both methods) works
- ✅ PDF generation works (premium)
- ✅ Subscription upgrade flow works
- ✅ Payment processing works

### Visual Quality
- ✅ Professional, modern design
- ✅ Consistent branding
- ✅ Smooth animations
- ✅ Print-ready resume output

---

## 📝 Additional Notes

### Content Guidelines
- Use professional, encouraging copy
- Emphasize "free" where applicable
- Highlight ATS-friendly nature
- Show social proof (testimonials, company logos)

### Performance
- Optimize images (use Next.js Image component)
- Lazy load template previews
- Efficient state updates
- Fast page transitions

### SEO
- Meta tags for each page
- Open Graph tags
- Semantic HTML
- Accessible markup

---

## 🎯 Priority Features (MVP)

1. **Home page** with hero, features, testimonials
2. **Templates page** with all 12 templates
3. **Builder page** with editor + preview
4. **Account page** with dashboard, settings, payment
5. **Subscription system** with 4 tiers
6. **PDF download** (premium)
7. **Resume upload/parsing**
8. **LinkedIn import** (OAuth + ZIP)

### Nice-to-Have (Future)
- Resume analytics
- Cover letter builder
- Job application tracker
- Resume sharing links
- Multiple resume versions

---

**Ready to build?** Use this document as your guide. Let Lovable handle the backend, authentication, and database automatically. Focus on creating a beautiful, intuitive frontend that delights users! 🚀
