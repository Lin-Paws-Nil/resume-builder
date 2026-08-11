import Link from 'next/link';
import Image from 'next/image';
import { FileText, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Footer } from '@/components/marketing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume Format Guide 2026: Choose the Right Layout',
  description:
    'Learn which resume format is best for you: chronological, functional, or combination. Includes visual examples, pros/cons, and a decision guide.',
  alternates: { canonical: 'https://createresume.co/resume-format' },
};

export default function ResumeFormatPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="createresume.co logo" width="80" height="80" className="rounded-xl" />
            <span className="text-xl font-bold text-gray-900">createresume.co</span>
          </Link>
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
            <Link href="/resume-examples" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Resume Examples</Link>
            <Link href="/how-to-write-a-resume" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How to Write</Link>
            <Link href="/ats-resume" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">ATS Guide</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Resume Format Guide 2026
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              The format you choose determines how recruiters read your resume. Pick the right layout for your experience level and career goals.
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">The 3 Resume Formats You Need to Know</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            There are three standard resume formats used worldwide. Each one presents your information differently, and choosing the right one depends on your career stage, industry, and employment history. Here is a direct breakdown of when to use each.
          </p>

          {/* Chronological */}
          <article className="mb-16 p-8 border border-gray-200 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold text-white bg-blue-600 px-3 py-1 rounded-full">MOST POPULAR</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Chronological Resume Format</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              The chronological format lists your work experience in reverse order — most recent job first. This is the most widely used format and is preferred by 90% of recruiters because it clearly shows career progression.
            </p>

            <h4 className="font-bold text-gray-900 mb-3">Best for:</h4>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> Professionals with a steady work history (no major gaps)</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> People staying in the same industry</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> Those with clear career progression (promotions, growing responsibilities)</li>
            </ul>

            <h4 className="font-bold text-gray-900 mb-3">Avoid if:</h4>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-gray-600"><XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" /> You have significant employment gaps</li>
              <li className="flex items-start gap-2 text-gray-600"><XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" /> You are changing careers completely</li>
              <li className="flex items-start gap-2 text-gray-600"><XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" /> You are a recent graduate with no work experience</li>
            </ul>

            <p className="text-sm text-gray-500">Templates that use this format: <Link href="/templates" className="text-blue-600 hover:underline">Hyperion, Classic, Eon</Link></p>
          </article>

          {/* Functional */}
          <article className="mb-16 p-8 border border-gray-200 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Functional (Skills-Based) Resume Format</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              The functional format organizes your resume by skills and competencies rather than by timeline. Work history is mentioned briefly at the bottom. This format draws attention to what you can do rather than when you did it.
            </p>

            <h4 className="font-bold text-gray-900 mb-3">Best for:</h4>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> Career changers transitioning to a new industry</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> People with employment gaps they want to de-emphasize</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> Recent graduates with strong skills but limited experience</li>
            </ul>

            <h4 className="font-bold text-gray-900 mb-3">Avoid if:</h4>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-gray-600"><XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" /> Applying to traditional or corporate companies (they prefer chronological)</li>
              <li className="flex items-start gap-2 text-gray-600"><XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" /> ATS systems may not parse this format well</li>
            </ul>

            <p className="text-sm text-gray-500">Templates that work for this: <Link href="/templates" className="text-blue-600 hover:underline">Zenith, Lunar</Link></p>
          </article>

          {/* Combination */}
          <article className="mb-16 p-8 border border-gray-200 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Combination (Hybrid) Resume Format</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              The combination format merges the best of both worlds: a prominent skills section at the top, followed by a detailed chronological work history. This format is gaining popularity in 2026 because it satisfies both ATS systems and human recruiters.
            </p>

            <h4 className="font-bold text-gray-900 mb-3">Best for:</h4>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> Experienced professionals with diverse skill sets</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> People targeting senior or leadership roles</li>
              <li className="flex items-start gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> Career changers who still have relevant experience to show</li>
            </ul>

            <h4 className="font-bold text-gray-900 mb-3">Avoid if:</h4>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-gray-600"><XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" /> You are entry-level with limited skills to highlight</li>
              <li className="flex items-start gap-2 text-gray-600"><XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" /> The job posting specifically asks for a chronological resume</li>
            </ul>

            <p className="text-sm text-gray-500">Templates that use this format: <Link href="/templates" className="text-blue-600 hover:underline">Aurora, Stellar, Cosmos, Modern</Link></p>
          </article>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Quick Decision Guide</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border border-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-bold text-gray-900">Your Situation</th>
                    <th className="px-6 py-4 font-bold text-gray-900">Recommended Format</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 text-gray-600">Steady career with promotions</td><td className="px-6 py-4 font-medium">Chronological</td></tr>
                  <tr><td className="px-6 py-4 text-gray-600">Switching industries</td><td className="px-6 py-4 font-medium">Functional or Combination</td></tr>
                  <tr><td className="px-6 py-4 text-gray-600">Employment gaps</td><td className="px-6 py-4 font-medium">Functional</td></tr>
                  <tr><td className="px-6 py-4 text-gray-600">Senior/leadership role</td><td className="px-6 py-4 font-medium">Combination</td></tr>
                  <tr><td className="px-6 py-4 text-gray-600">Recent graduate</td><td className="px-6 py-4 font-medium">Functional or Chronological</td></tr>
                  <tr><td className="px-6 py-4 text-gray-600">Applying to corporate/traditional company</td><td className="px-6 py-4 font-medium">Chronological</td></tr>
                  <tr><td className="px-6 py-4 text-gray-600">Freelancer with diverse clients</td><td className="px-6 py-4 font-medium">Combination</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Resume Format FAQs</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">What resume format do employers prefer in 2026?</h3>
                <p className="text-gray-600 leading-relaxed">The chronological format remains the most preferred by employers and ATS systems. Over 75% of recruiters prefer seeing work history in reverse chronological order. However, combination formats are increasingly accepted, especially in tech and creative industries.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Should my resume be one page or two pages?</h3>
                <p className="text-gray-600 leading-relaxed">One page is ideal for early to mid-career professionals (under 10 years of experience). Two pages are acceptable for senior professionals, academics, or those with extensive relevant experience. Never exceed two pages unless you are in academia or medicine.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Which format works best with ATS?</h3>
                <p className="text-gray-600 leading-relaxed">Chronological and combination formats work best with ATS. Functional resumes can confuse some ATS systems because they lack clear job titles tied to dates. If you are applying online, stick with chronological or combination and use an <Link href="/ats-resume" className="text-blue-600 hover:underline">ATS-friendly template</Link>.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-blue-600 to-purple-600 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Pick your format and start building</h2>
            <p className="text-blue-100 mb-8 text-lg">All our templates are pre-formatted for ATS compatibility. Just choose, fill in your details, and download.</p>
            <Link href="/templates" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-lg">
              Browse Templates <ArrowRight className="h-5 w-5" />
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
