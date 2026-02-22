# Quick Setup Guide

## Step 1: Install Node.js (if not already installed)

Visit [nodejs.org](https://nodejs.org/) and install Node.js 18 or higher.

## Step 2: Install Dependencies

Open terminal in the project directory and run:

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- Zustand (state management)
- OpenAI SDK
- PDF/DOCX parsers
- UI components

## Step 3: Set Up Environment Variables

1. Create a file named `.env.local` in the root directory
2. Add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**To get an OpenAI API key:**
1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it into `.env.local`

## Step 4: Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Step 5: Test the Application

1. **Upload a Resume:**
   - Click "Upload Current Resume" in the left panel
   - Select a PDF or DOCX file
   - Wait for AI to parse it (may take 10-30 seconds)

2. **Edit Sections:**
   - Click on any section header to expand
   - Edit the fields
   - Add new items with "Add Item" button

3. **Select Template:**
   - In the middle panel, choose a template
   - Preview updates automatically

4. **View Preview:**
   - Right panel shows live preview
   - Changes reflect immediately

## Troubleshooting

### "Module not found" errors
Run `npm install` again to ensure all dependencies are installed.

### OpenAI API errors
- Verify your API key is correct in `.env.local`
- Check you have credits in your OpenAI account
- Ensure the key starts with `sk-`

### Port 3000 already in use
Change the port:
```bash
PORT=3001 npm run dev
```

### PDF parsing fails
- Ensure the file is a valid PDF
- Try a different PDF file
- Check browser console for detailed errors

## Next Steps

- Customize templates in `components/templates/`
- Add more sections in `lib/types/resume.ts`
- Deploy to Vercel (see README.md)

## Production Build

To create a production build:

```bash
npm run build
npm start
```



