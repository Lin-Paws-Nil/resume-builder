import Link from 'next/link';
import { FileText, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { Footer } from '@/components/marketing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Write a Resume in 2026: Step-by-Step',
  description:
    'Complete guide on how to write a resume that gets interviews. Covers every section: header, summary, experience, education, and skills with examples.',
  alternates: { canonical: 'https://createresume.co/how-to-write-a-resume' },
};

export default function HowToWriteResumePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">createresume.co</span>
          </Link>
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
            <Link href="/resume-examples" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Examples</Link>
            <Link href="/resume-format" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Format Guide</Link>
            <Link href="/ats-resume" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">ATS Guide</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              How to Write a Resume in 2026
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              A step-by-step guide to writing a resume that gets past ATS systems and impresses hiring managers. Includes examples and actionable tips for every section.
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-16">
          <p className="text-gray-600 leading-relaxed mb-8 text-lg">
            Your resume is the single most important document in your job search. Recruiters spend an average of 7 seconds scanning each resume before deciding to read further or move on. This guide will help you make those 7 seconds count by showing you exactly how to structure, write, and optimize each section of your resume.
          </p>

          {/* Step 1: Header */}
          <article className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 1: Write Your Contact Header</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Your header should be clean, professional, and easy to scan. It appears at the very top of your resume and contains your essential contact information.
            </p>
            <h3 className="font-bold text-gray-900 mb-3">Include:</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> Full name (slightly larger font than the rest)</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> Professional email address (not partyking99@gmail.com)</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> Phone number</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> City and state (full address is no longer necessary)</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> LinkedIn profile URL (optional but recommended)</li>
            </ul>
            <div className="flex items-start gap-2 p-4 bg-yellow-50 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">Do not include your photo, date of birth, or marital status unless specifically required in your country.</p>
            </div>
          </article>

          {/* Step 2: Summary */}
          <article className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 2: Write a Professional Summary</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              A professional summary is a 2-3 sentence overview at the top of your resume that tells the recruiter who you are and what value you bring. It should be tailored to the specific job you are applying for.
            </p>
            <h3 className="font-bold text-gray-900 mb-3">Formula for a strong summary:</h3>
            <div className="bg-blue-50 p-6 rounded-xl mb-4">
              <p className="text-blue-900 font-medium italic">&quot;[Job title] with [X years] of experience in [key skill/industry]. Proven track record of [top achievement with number]. Seeking to [what you bring to the new role].&quot;</p>
            </div>
            <p className="text-gray-600 leading-relaxed">
              <strong>Example:</strong> &quot;Full-stack software engineer with 5 years of experience building scalable web applications. Led a team of 4 to deliver a payment platform processing $2M monthly. Seeking to bring technical leadership to a high-growth fintech startup.&quot;
            </p>
          </article>

          {/* Step 3: Experience */}
          <article className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 3: List Your Work Experience</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              This is the most important section of your resume. List your roles in reverse chronological order. For each role, use bullet points that follow the PAR format: Problem, Action, Result.
            </p>
            <h3 className="font-bold text-gray-900 mb-3">For each role, include:</h3>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> Job title</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> Company name and location</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> Dates of employment (month/year)</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> 3-5 bullet points with achievements (not duties)</li>
            </ul>
            <h3 className="font-bold text-gray-900 mb-3">Write achievements, not job descriptions:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <span className="text-red-500 font-bold text-sm">BAD:</span>
                <p className="text-sm text-gray-600">&quot;Responsible for managing the sales team&quot;</p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <span className="text-green-600 font-bold text-sm">GOOD:</span>
                <p className="text-sm text-gray-600">&quot;Led a 12-person sales team to exceed Q3 targets by 34%, generating $1.2M in new revenue&quot;</p>
              </div>
            </div>
          </article>

          {/* Step 4: Education */}
          <article className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 4: Add Your Education</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              List your education in reverse chronological order. For recent graduates, this section should come before work experience. For experienced professionals, keep it brief and place it after experience.
            </p>
            <h3 className="font-bold text-gray-900 mb-3">Include:</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> Degree name and field of study</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> University/institution name</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> Graduation year (or expected graduation)</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> GPA (only if above 3.5 and you are a recent graduate)</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> Relevant coursework or honors (optional)</li>
            </ul>
          </article>

          {/* Step 5: Skills */}
          <article className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 5: Highlight Your Skills</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              A well-crafted skills section helps ATS systems match you to the job and gives recruiters a quick overview of your capabilities. Separate your skills into categories for readability.
            </p>
            <h3 className="font-bold text-gray-900 mb-3">Tips:</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> Match skills to the job posting keywords</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> Include both hard skills (tools, languages) and soft skills (leadership, communication)</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> List 8-12 skills maximum (quality over quantity)</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> Remove generic skills everyone has (Microsoft Word, email)</li>
            </ul>
          </article>

          {/* Step 6: Proofread */}
          <article className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 6: Proofread and Optimize</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Before submitting, run through this final checklist:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> Zero spelling and grammar errors (use our AI grammar checker)</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> Consistent formatting (same font, spacing, bullet style)</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> Keywords from the job posting appear naturally in your resume</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> File saved as PDF (preserves formatting across devices)</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> File name is professional: &quot;FirstName_LastName_Resume.pdf&quot;</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> Tested with an <Link href="/ats-resume" className="text-blue-600 hover:underline">ATS-friendly template</Link></li>
            </ul>
          </article>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Common Resume Mistakes to Avoid</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-5 bg-white border border-gray-200 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">Using one resume for every job</h3>
                <p className="text-sm text-gray-600">Tailor your resume to each position. Match the keywords, skills, and priorities from the job posting.</p>
              </div>
              <div className="p-5 bg-white border border-gray-200 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">Including irrelevant experience</h3>
                <p className="text-sm text-gray-600">Only include roles and achievements that are relevant to the job you are targeting. Quality over quantity.</p>
              </div>
              <div className="p-5 bg-white border border-gray-200 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">Writing duties instead of achievements</h3>
                <p className="text-sm text-gray-600">Recruiters want to see impact. Use numbers, percentages, and outcomes — not job description copy-paste.</p>
              </div>
              <div className="p-5 bg-white border border-gray-200 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">Overdesigning the layout</h3>
                <p className="text-sm text-gray-600">Fancy graphics and columns can break ATS parsing. Stick to <Link href="/ats-resume" className="text-blue-600 hover:underline">ATS-friendly formats</Link> for online applications.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-blue-600 to-purple-600 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Start writing your resume now</h2>
            <p className="text-blue-100 mb-8 text-lg">Our builder guides you through each section with AI-powered suggestions and professional templates.</p>
            <Link href="/templates" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-lg">
              Create My Resume <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <Footer />
      </div>
    </div>
  );
}
