# Deployment Guide - createresume.co

## ✅ Build Status
The application builds successfully and is ready for deployment!

## 🚀 Quick Deploy to Vercel (Recommended)

### Option 1: Deploy via Vercel Dashboard

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - createresume.co"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
# For production deployment:
vercel --prod
```

## 🔐 Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Required |
|----------|-------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `NEXT_PUBLIC_APP_URL` | Your Vercel deployment URL | Optional |

**To get OpenAI API Key:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in or create account
3. Navigate to API Keys section
4. Create new API key
5. Copy and paste into Vercel environment variables

## 📦 Build Configuration

The project is configured with:
- **Framework:** Next.js 16
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Node Version:** 18.x or higher

## 🌐 Other Deployment Options

### Netlify

1. Connect your GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Add environment variables
4. Deploy

### Railway

1. Connect GitHub repository
2. Add environment variables
3. Railway auto-detects Next.js and deploys

### Self-Hosted (VPS/Docker)

```bash
# Build the application
npm run build

# Start production server
npm start

# Or use PM2 for process management
npm install -g pm2
pm2 start npm --name "createresume-io" -- start
```

## 🔍 Post-Deployment Checklist

- [ ] Environment variables are set
- [ ] OpenAI API key is valid and has credits
- [ ] Test login (SwapnilD/SwapnilD)
- [ ] Test resume upload
- [ ] Test PDF download
- [ ] Verify all routes work:
  - `/` - Landing page
  - `/login` - Login page
  - `/builder` - Resume builder (protected)

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version (18+ required)
- Verify all dependencies are in package.json
- Check for TypeScript errors: `npm run build`

### PDF Download Doesn't Work
- Ensure html2pdf.js is installed: `npm install html2pdf.js`
- Check browser console for errors
- Verify resume preview element exists

### Authentication Issues
- Check sessionStorage is enabled in browser
- Verify login credentials match (SwapnilD/SwapnilD)

## 📊 Performance

- **Build Time:** ~5-10 seconds
- **Bundle Size:** Optimized with Next.js
- **First Load:** Fast with static generation

## 🔒 Security Notes

- Authentication is currently client-side only (sessionStorage)
- For production, consider implementing:
  - Server-side authentication
  - JWT tokens
  - Secure session management
  - Rate limiting on API routes

## 📝 Notes

- The application uses sessionStorage for authentication (demo purposes)
- For production, implement proper authentication
- OpenAI API key should be kept secure
- Consider adding rate limiting for API routes

---

**Ready to deploy!** 🚀


