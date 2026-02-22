# 📧 Troubleshooting: Not Receiving Supabase Emails

## Quick Checks

### 1. Check Supabase Email Settings

Go to **Supabase Dashboard** → **Authentication** → **Settings**:

**Email Auth Section:**
- ✅ **"Enable email confirmations"** - Should be ON if you want emails
- ✅ **"Enable email signup"** - Should be ON
- ✅ **"Enable email change"** - Optional

**URL Configuration:**
- ✅ **Site URL**: Should be set (even if `http://localhost:3000` for dev)
- ✅ **Redirect URLs**: Must include your redirect URL
  - Add: `http://localhost:3000/confirm`
  - Add: `http://localhost:3000/**` (wildcard for all routes)

### 2. Check Email Service Provider

Go to **Supabase Dashboard** → **Settings** → **Auth** → **Email Templates**:

**Default Provider:**
- Supabase uses their own email service by default
- Free tier has rate limits (4 emails/hour)
- Check if you've exceeded the limit

**Custom SMTP (Optional):**
- You can configure your own SMTP server
- Go to **Settings** → **Auth** → **SMTP Settings**
- Configure with your email provider (Gmail, SendGrid, etc.)

### 3. Check Spam Folder

- Emails might be going to spam/junk
- Check your email provider's spam folder
- Add `noreply@mail.app.supabase.io` to your contacts

### 4. Check Email Rate Limits

**Supabase Free Tier Limits:**
- 4 emails per hour per project
- If you've sent 4 signup emails, wait an hour

**Check Usage:**
- Go to **Supabase Dashboard** → **Settings** → **Usage**
- Check email sending statistics

### 5. Verify Email Configuration in Code

The signup code sets:
```typescript
emailRedirectTo: `${window.location.origin}/confirm?type=signup`
```

**Make sure:**
- This URL is added to **Redirect URLs** in Supabase
- The `/confirm` page exists (it does - we created it)

## Solutions

### Solution 1: Disable Email Confirmation (Fastest for Development)

1. Go to **Supabase Dashboard** → **Authentication** → **Settings**
2. Find **"Enable email confirmations"**
3. **Turn it OFF**
4. Click **Save**

**Result:** Users are auto-confirmed, no emails needed.

### Solution 2: Use Manual Confirmation Page

1. After signup, go to: `http://localhost:3000/manual-confirm`
2. Enter your email
3. Click **"Resend Confirmation Email"**
4. Check your email (and spam folder)

### Solution 3: Check Supabase Logs

1. Go to **Supabase Dashboard** → **Logs** → **Auth Logs**
2. Look for email sending errors
3. Check for rate limit errors
4. Check for configuration errors

### Solution 4: Configure Custom SMTP

If Supabase's email service isn't working:

1. Go to **Settings** → **Auth** → **SMTP Settings**
2. Enable **"Use custom SMTP"**
3. Configure with your email provider:
   - **Gmail**: Use App Password
   - **SendGrid**: Use API key
   - **AWS SES**: Use credentials
4. Test email sending

### Solution 5: Use ngrok for Public URL

If localhost redirects aren't working:

1. Install ngrok: `brew install ngrok`
2. Run: `ngrok http 3000`
3. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
4. In Supabase:
   - Set **Site URL** to ngrok URL
   - Add ngrok URL to **Redirect URLs**
5. Update signup code to use ngrok URL

## Testing Email Sending

### Test 1: Check Supabase Dashboard

1. Go to **Authentication** → **Users**
2. Find your user
3. Check if user exists but email is not confirmed
4. If user exists → Email might not have been sent
5. If user doesn't exist → Signup failed

### Test 2: Check Browser Console

After signup, check browser console for:
- `Signup successful:` log with user details
- `Email confirmation required` message
- Any error messages

### Test 3: Use Manual Confirmation

1. Visit: `http://localhost:3000/manual-confirm`
2. Enter your email
3. Click **"Resend Confirmation Email"**
4. Check if you receive it this time

## Common Issues

### Issue: "Email not sent" but no error

**Cause:** Email confirmation disabled in Supabase
**Fix:** Enable it in Settings, or disable it and use auto-confirm

### Issue: "Rate limit exceeded"

**Cause:** Sent too many emails (4/hour limit on free tier)
**Fix:** Wait an hour, or upgrade plan, or use custom SMTP

### Issue: "Redirect URL not allowed"

**Cause:** Redirect URL not whitelisted in Supabase
**Fix:** Add `http://localhost:3000/confirm` to Redirect URLs

### Issue: Emails go to spam

**Cause:** Email provider marking Supabase emails as spam
**Fix:** Check spam folder, add to contacts, or use custom SMTP

## Recommended Setup for Development

**Best Option:** Disable email confirmation
- Fastest development
- No email delays
- Users can immediately use the app
- Can enable later for production

**Steps:**
1. Supabase Dashboard → Authentication → Settings
2. Turn OFF "Enable email confirmations"
3. Save
4. Users are now auto-confirmed on signup





