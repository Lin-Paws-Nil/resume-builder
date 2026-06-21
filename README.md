# createresume.co - Free AI-Powered Resume Builder

A modern, AI-powered resume builder that helps you create professional resumes in minutes.

## ✨ Features

- 🎨 **Multiple Templates** - Choose from Modern, Classic, or Creative designs
- 🤖 **AI-Powered Parsing** - Upload your existing resume and let AI extract all sections
- ✏️ **Easy Editing** - Intuitive interface to customize every section
- 📄 **PDF Export** - Download your resume as a professional PDF
- 💾 **Auto-Save** - Your progress is automatically saved
- 🔒 **Secure** - Protected builder with authentication

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your OPENAI_API_KEY

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🔐 Login Credentials

**Demo Account:**
- Username: `SwapnilD`
- Password: `SwapnilD`

## 📁 Project Structure

```
├── app/
│   ├── (auth)/login/     # Login page
│   ├── builder/          # Resume builder (protected)
│   ├── api/              # API routes
│   └── page.tsx          # Landing page
├── components/
│   ├── resume/           # Resume components
│   ├── templates/        # Template components
│   └── ui/               # UI components
├── lib/
│   ├── services/         # Business logic
│   └── utils/            # Utilities
└── store/                # State management
```

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **AI:** OpenAI API
- **PDF:** html2pdf.js

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🎨 Features Overview

### Landing Page
- Hero section with statistics
- Feature highlights
- Customer testimonials
- Step-by-step guide

### Resume Builder
- Upload existing resume (PDF/DOCX)
- Dynamic section editor
- Template selector
- Live preview
- Save & Download functionality

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for resume parsing | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | Optional |

## 📝 License

MIT

## 🤝 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js**
# Auto-deploy test
# Deployment Configuration
