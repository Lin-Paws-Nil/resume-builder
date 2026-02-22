# How to Check Your OpenAI API Key

## 📍 Location of Your API Key

Your API key is stored in: **`.env.local`** (in the project root)

## ✅ How to Verify Your API Key

### Method 1: View the File Directly

1. **In your file explorer/IDE:**
   - Navigate to: `/Users/swapnild/Documents/Project X/`
   - Look for file: `.env.local`
   - Open it with a text editor

2. **What you should see:**
   ```
   OPENAI_API_KEY=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
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Method 2: Check via Terminal

```bash
# View the entire file
cat .env.local

# Check if API key exists
grep "OPENAI_API_KEY" .env.local

# Count characters (should be around 164)
grep "OPENAI_API_KEY" .env.local | wc -c
```

### Method 3: Run Test Script

```bash
node test-api-key.js
```

## ✅ Current Status

**Your API Key:**
- ✅ Found in `.env.local`
- ✅ Format is correct (starts with `sk-proj-`)
- ✅ Length: 164 characters
- ❌ **Connection test failed** - Cannot connect to OpenAI API

## 🔧 Troubleshooting Connection Issues

### 1. **Check Internet Connection**
```bash
# Test connectivity to OpenAI
curl -I https://api.openai.com
```

### 2. **Check OpenAI Service Status**
Visit: https://status.openai.com/

### 3. **Verify API Key is Active**
1. Go to: https://platform.openai.com/api-keys
2. Find your key: "ResumeParser"
3. Check status: Should show "Active"
4. Check "Last Used": Should show recent timestamp

### 4. **Check for Firewall/Proxy**
- If you're behind a corporate firewall, it might block OpenAI API
- Try from a different network (mobile hotspot)
- Check if VPN is interfering

### 5. **Verify API Key Permissions**
- Go to OpenAI dashboard
- Check if the key has proper permissions
- Ensure it's not revoked or expired

### 6. **Test API Key Directly**
```bash
# Test with curl (replace YOUR_KEY with your actual key)
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer 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"
```

## 🚨 Common Issues

### Issue: "Connection error"
**Possible causes:**
- Internet connectivity problem
- Firewall blocking OpenAI API
- VPN interfering
- OpenAI API is down
- API key is invalid/revoked

### Issue: "API key not found"
**Solution:**
- Ensure `.env.local` file exists in project root
- Check file name is exactly `.env.local` (not `.env` or `.env.local.txt`)
- Restart the development server after adding the key

### Issue: "Invalid API key"
**Solution:**
- Generate a new API key from OpenAI dashboard
- Update `.env.local` with the new key
- Restart the server

## 📝 File Format Requirements

Your `.env.local` file should:
- ✅ Be in the project root directory
- ✅ Have no spaces around the `=` sign
- ✅ Have no quotes around the API key value
- ✅ Each variable on a new line
- ✅ No trailing spaces

**Correct format:**
```
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Wrong format:**
```
OPENAI_API_KEY = "sk-proj-..."  ❌ (spaces and quotes)
OPENAI_API_KEY=sk-proj-...  ❌ (trailing space)
```

## 🔄 After Making Changes

**IMPORTANT:** After updating `.env.local`, you **MUST** restart your server:

```bash
# Stop server (Ctrl+C or Cmd+C)
# Then restart:
npm run dev
```

## 📞 Still Having Issues?

1. Check server console for detailed error messages
2. Run `node test-api-key.js` to test connectivity
3. Verify API key on OpenAI dashboard
4. Check internet connection and firewall settings

