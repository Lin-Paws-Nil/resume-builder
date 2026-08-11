import Link from 'next/link';
import { FileText, CheckCircle, XCircle, ArrowRight, Shield, AlertTriangle } from 'lucide-react';
import { Footer } from '@/components/marketing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ATS-Friendly Resume Guide 2026: Beat the Bots',
  description:
    'Learn how to create an ATS-friendly resume that passes Applicant Tracking Systems. Formatting rules, keyword tips, and common mistakes to avoid.',
  alternates: { canonical: 'https://createresume.co/ats-resume' },
};

export default function ATSResumePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="createresume.co logo" width="80" height="80" className="rounded-xl" />
            <span className="text-xl font-bold text-gray-900">createresume.co</span>
          </Link>
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
            <Link href="/resume-examples" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Examples</Link>
            <Link href="/resume-format" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Format Guide</Link>
            <Link href="/how-to-write-a-resume" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How to Write</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 mb-4 bg-green-500/20 px-4 py-2 rounded-full">
              <Shield className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-semibold text-sm">ATS Optimization Guide</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              ATS-Friendly Resume Guide 2026
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              75% of resumes are rejected by ATS before a human ever sees them. Learn exactly how to format your resume to pass these systems and land interviews.
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What is an ATS?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            An Applicant Tracking System (ATS) is software used by over 98% of Fortune 500 companies and 75% of all employers to filter, rank, and manage job applications. When you submit a resume online, it typically goes through an ATS before any human reads it.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
            The ATS parses your resume into structured data — extracting your name, contact info, work history, education, and skills. It then scores your application based on how well your resume matches the job description keywords and requirements. Resumes that score too low are automatically rejected.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-16">ATS Formatting Rules</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            ATS systems read resumes differently than humans. They cannot interpret images, complex layouts, or unusual formatting. Follow these rules to ensure your resume is parsed correctly:
          </p>

          <div className="space-y-6 mb-16">
            <div className="p-6 border border-green-200 bg-green-50 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-600" /> Do: Use standard section headings</h3>
              <p className="text-gray-600 text-sm mb-2">ATS looks for specific section titles. Use standard names:</p>
              <p className="text-gray-700 text-sm font-medium">&quot;Work Experience&quot;, &quot;Education&quot;, &quot;Skills&quot;, &quot;Summary&quot;, &quot;Certifications&quot;</p>
              <p className="text-gray-500 text-sm mt-2">Avoid creative names like &quot;My Journey&quot;, &quot;Toolbox&quot;, or &quot;Where I&apos;ve Been&quot;</p>
            </div>

            <div className="p-6 border border-green-200 bg-green-50 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-600" /> Do: Use standard fonts</h3>
              <p className="text-gray-600 text-sm">Stick to: Arial, Calibri, Helvetica, Inter, Times New Roman, Georgia. Size 10-12pt for body text, 14-16pt for headings.</p>
            </div>

            <div className="p-6 border border-green-200 bg-green-50 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-600" /> Do: Use simple bullet points</h3>
              <p className="text-gray-600 text-sm">Standard round bullets are parsed reliably. Avoid arrows, diamonds, or custom symbols that may render as gibberish in ATS.</p>
            </div>

            <div className="p-6 border border-green-200 bg-green-50 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-600" /> Do: Submit as PDF</h3>
              <p className="text-gray-600 text-sm">PDF preserves formatting and is accepted by 99% of modern ATS systems. Only use .docx if the job posting specifically requires it.</p>
            </div>

            <div className="p-6 border border-red-200 bg-red-50 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><XCircle className="h-5 w-5 text-red-600" /> Don&apos;t: Use tables or columns for layout</h3>
              <p className="text-gray-600 text-sm">Many ATS systems read tables row-by-row, jumbling multi-column content. Use a single-column or properly-coded two-column template (like our ATS-tested templates).</p>
            </div>

            <div className="p-6 border border-red-200 bg-red-50 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><XCircle className="h-5 w-5 text-red-600" /> Don&apos;t: Use images, charts, or graphics</h3>
              <p className="text-gray-600 text-sm">ATS cannot read text within images. Skill bars, infographics, and logos are invisible to the system. Use plain text for all content.</p>
            </div>

            <div className="p-6 border border-red-200 bg-red-50 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><XCircle className="h-5 w-5 text-red-600" /> Don&apos;t: Use headers or footers</h3>
              <p className="text-gray-600 text-sm">Content placed in document headers/footers is often ignored by ATS. Put your contact information in the main body of the document.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Keyword Optimization</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            ATS systems score resumes by matching keywords from the job description against your resume content. Here is how to optimize for keywords without keyword-stuffing:
          </p>

          <div className="space-y-4 mb-16">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-sm">1</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Copy the job posting into a document</h3>
                <p className="text-gray-600 text-sm">Identify the skills, tools, and qualifications mentioned. These are your target keywords.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-sm">2</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Use exact phrasing from the job description</h3>
                <p className="text-gray-600 text-sm">If the posting says &quot;project management&quot;, use that exact phrase — not &quot;managing projects&quot; or &quot;PM&quot;.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-sm">3</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Include keywords in context</h3>
                <p className="text-gray-600 text-sm">Place keywords within your achievements and descriptions naturally. Do not just list them — modern ATS can detect keyword stuffing.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-sm">4</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Include both acronyms and full terms</h3>
                <p className="text-gray-600 text-sm">Write &quot;Search Engine Optimization (SEO)&quot; the first time, then use &quot;SEO&quot; afterwards. This covers both versions the ATS might search for.</p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Common ATS Mistakes</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="p-5 border border-gray-200 rounded-xl">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <h3 className="font-bold text-gray-900">Creative file names</h3>
              </div>
              <p className="text-sm text-gray-600">Name your file &quot;FirstName_LastName_Resume.pdf&quot; — not &quot;final_v3_UPDATED.pdf&quot;</p>
            </div>
            <div className="p-5 border border-gray-200 rounded-xl">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <h3 className="font-bold text-gray-900">Missing dates</h3>
              </div>
              <p className="text-sm text-gray-600">Always include employment dates. ATS uses them to calculate experience duration.</p>
            </div>
            <div className="p-5 border border-gray-200 rounded-xl">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <h3 className="font-bold text-gray-900">Abbreviations without context</h3>
              </div>
              <p className="text-sm text-gray-600">Write full terms at least once. &quot;CRM&quot; might not match if the system searches for &quot;Customer Relationship Management&quot;.</p>
            </div>
            <div className="p-5 border border-gray-200 rounded-xl">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <h3 className="font-bold text-gray-900">Fancy templates from Canva</h3>
              </div>
              <p className="text-sm text-gray-600">Most visual templates use tables and text boxes that break ATS parsing. Use a tested ATS template instead.</p>
            </div>
          </div>
        </section>

        <section className="bg-green-50 py-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">All createresume.co Templates Are ATS-Tested</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">
              Every template on createresume.co has been tested against major ATS systems including Workday, Greenhouse, Lever, and iCIMS. Our templates use:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" /> Proper HTML heading hierarchy for section detection</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" /> Standard fonts (Inter) with web-safe fallbacks</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" /> Clean PDF output without embedded images or graphics</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" /> Proper date formatting for experience parsing</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" /> Standard section names that all ATS systems recognize</li>
            </ul>
          </div>
        </section>

        <section className="bg-gradient-to-br from-blue-600 to-purple-600 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Build an ATS-proof resume in minutes</h2>
            <p className="text-blue-100 mb-8 text-lg">Choose any of our 12+ tested templates and never worry about ATS rejection again.</p>
            <Link href="/templates" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-lg">
              View ATS Templates <ArrowRight className="h-5 w-5" />
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
