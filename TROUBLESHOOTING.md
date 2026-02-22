# Troubleshooting "Failed to parse resume" Error

## Quick Checks

### 1. **Restart Your Server** ⚠️ IMPORTANT
After adding the API key to `.env.local`, you **MUST restart** the development server:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

The server only reads `.env.local` when it starts, so changes won't take effect until restart.

### 2. **Check API Key Format**
Your API key should:
- Start with `sk-proj-` (project-scoped key) ✅
- Be in `.env.local` file ✅
- Have no extra spaces or quotes

### 3. **Check Server Console**
Look at the terminal where `npm run dev` is running. You should see:
- Any error messages
- API call logs
- Detailed error information

### 4. **Common Error Messages**

#### "OpenAI API key is missing or invalid"
- **Solution**: Restart the server after adding the key
- Check `.env.local` file exists and has the key
- Verify no typos in the key

#### "API rate limit exceeded"
- **Solution**: Wait a few minutes and try again
- Check your OpenAI usage dashboard

#### "API quota exceeded"
- **Solution**: Add credits to your OpenAI account
- Check billing on OpenAI dashboard

#### "Request timed out"
- **Solution**: Try with a smaller file
- Check your internet connection

## Debugging Steps

1. **Check if API key is loaded**:
   - Look for warning in server console: `⚠️ OPENAI_API_KEY is not set`
   - If you see this, the key isn't being read

2. **Check file upload**:
   - Ensure file is PDF or DOCX
   - File size under 10MB
   - File is not corrupted

3. **Check server logs**:
   - Look for detailed error messages
   - Check for OpenAI API errors
   - Look for file parsing errors

4. **Test API key directly**:
   ```bash
   # In terminal, test if key works:
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```

## Still Not Working?

1. **Verify API key is active**:
   - Go to OpenAI dashboard
   - Check if "ResumeParser" key shows "Active"
   - Check "Last Used" timestamp

2. **Check project settings**:
   - Ensure "ResumeBuilder" project is active
   - Check if there are any spending limits

3. **Try a simple test**:
   - Upload a very simple, well-formatted resume
   - Check if the error persists

4. **Check browser console**:
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for error messages
   - Check Network tab for API call details

## Need More Help?

Check the server terminal output for detailed error messages. The improved error handling will now show specific errors like:
- API key issues
- Rate limits
- Quota problems
- Timeout issues
- JSON parsing errors

