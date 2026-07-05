import Image from 'next/image';
import Link from 'next/link';
import { FileText, ArrowRight, Sparkles } from 'lucide-react';
import { Footer } from '@/components/marketing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume Examples for Every Job 2026',
  description:
    'Browse 12+ professional resume examples organized by industry. See real layouts, get inspired, and build your own resume with our free builder.',
  alternates: { canonical: 'https://createresume.co/resume-examples' },
};

const resumeExamples = [
  { id: 'aurora', name: 'Aurora', industry: 'Technology', role: 'Software Engineer', description: 'Modern two-column layout perfect for tech roles. Highlights technical skills, projects, and achievements.', categories: ['Modern', 'ATS', 'Two columns'] },
  { id: 'hyperion', name: 'Hyperion', industry: 'Corporate', role: 'Business Analyst', description: 'Strong typography and structured sections create a professional, confident look for corporate roles.', categories: ['Professional', 'ATS'] },
  { id: 'lunar', name: 'Lunar', industry: 'Finance', role: 'Financial Analyst', description: 'Minimalist and elegant design reflecting clarity and precision. Ideal for finance and accounting.', categories: ['Simple', 'ATS'] },
  { id: 'stellar', name: 'Stellar', industry: 'Management', role: 'Project Manager', description: 'Sleek, polished two-column CV emphasizing leadership achievements and team outcomes.', categories: ['Professional', 'Two columns'] },
  { id: 'zenith', name: 'Zenith', industry: 'Consulting', role: 'Management Consultant', description: 'Bold and minimalistic resume emphasizing clarity, impact, and measurable results.', categories: ['Simple', 'ATS'] },
  { id: 'aether', name: 'Aether', industry: 'Engineering', role: 'Mechanical Engineer', description: 'Sharp and structured template that presents technical expertise with professionalism.', categories: ['Professional', 'ATS'] },
  { id: 'nebula', name: 'Nebula', industry: 'Creative', role: 'Graphic Designer', description: 'Creative and expansive layout ideal for showcasing diverse skills, portfolios, and experiences.', categories: ['Modern', 'Two columns'] },
  { id: 'eon', name: 'Eon', industry: 'Education', role: 'Teacher', description: 'Clean, easy-to-read design making qualifications and certifications the center of attention.', categories: ['Simple', 'ATS'] },
  { id: 'cosmos', name: 'Cosmos', industry: 'Healthcare', role: 'Registered Nurse', description: 'Comprehensive two-column template providing a broad overview of clinical experience and certifications.', categories: ['Professional', 'ATS', 'Two columns'] },
  { id: 'modern', name: 'Modern', industry: 'Technology', role: 'Product Manager', description: 'Clean and contemporary design perfect for tech-forward roles in product and UX.', categories: ['Modern', 'ATS'] },
  { id: 'classic', name: 'Classic', industry: 'Legal', role: 'Attorney', description: 'Traditional professional layout ideal for law, corporate, and government positions.', categories: ['Professional', 'ATS'] },
  { id: 'creative', name: 'Creative', industry: 'Marketing', role: 'Marketing Manager', description: 'Bold and expressive style great for design, marketing, and communications positions.', categories: ['Modern', 'Two columns'] },
];

export default function ResumeExamplesPage() {
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
            <Link href="/templates" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Templates</Link>
            <Link href="/resume-format" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Resume Format</Link>
            <Link href="/how-to-write-a-resume" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How to Write</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Real Examples</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Resume Examples for Every Job in 2026
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Browse professional resume examples across 12 industries. Each example uses an ATS-friendly template you can customize and download for free.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Resume Examples by Industry</h2>
          <p className="text-gray-600 mb-12 max-w-3xl">
            Each resume example below shows a real template layout optimized for a specific industry. Click any example to start building your own resume with that template — it takes less than 5 minutes.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumeExamples.map((example) => (
              <article key={example.id} className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[8.5/11] bg-gray-50 overflow-hidden">
                  <Image
                    src={`/resume-examples/${example.id}/${example.id}.png`}
                    alt={`${example.role} resume example using ${example.name} template — ${example.industry} industry ATS-friendly layout`}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{example.industry}</span>
                    {example.categories.includes('ATS') && (
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">ATS-Friendly</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{example.role} Resume</h3>
                  <p className="text-sm text-gray-500 mb-3">Template: {example.name}</p>
                  <p className="text-sm text-gray-600 mb-4">{example.description}</p>
                  <Link
                    href={`/templates`}
                    className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Use this template <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">How to Use These Resume Examples</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">1</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Find your industry</h3>
                  <p className="text-gray-600">Browse the examples above and find one that matches your target role or industry. Each template is designed with specific fields in mind.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">2</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Study the layout and structure</h3>
                  <p className="text-gray-600">Notice how each resume organizes sections, uses white space, and highlights key achievements. Use this structure as inspiration for your own content.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">3</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Build your own version</h3>
                  <p className="text-gray-600">Click &quot;Use this template&quot; to open the builder with that layout pre-loaded. Replace the sample content with your own experience, skills, and achievements.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Resume Writing Tips by Industry</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Technology Resumes</h3>
                <p className="text-gray-600 leading-relaxed">Focus on technical skills, programming languages, and quantifiable project outcomes. Include links to your GitHub or portfolio. Use a modern two-column layout to maximize space for both skills and experience.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Business &amp; Finance Resumes</h3>
                <p className="text-gray-600 leading-relaxed">Emphasize revenue impact, cost savings, and leadership metrics. Use conservative, professional templates with clear section hierarchies. Numbers matter — quantify every achievement you can.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Creative &amp; Marketing Resumes</h3>
                <p className="text-gray-600 leading-relaxed">Showcase campaign results, brand growth, and creative output. A visually distinctive template can help you stand out, but ensure it still passes ATS screening for online applications.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Healthcare &amp; Education Resumes</h3>
                <p className="text-gray-600 leading-relaxed">Highlight certifications, licenses, and patient/student outcomes. Use clean, structured layouts that make credentials easy to scan. Include relevant continuing education and professional development.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-blue-600 to-purple-600 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to build your own resume?</h2>
            <p className="text-blue-100 mb-8 text-lg">Choose any template above and create a professional resume in under 5 minutes.</p>
            <Link href="/templates" className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-lg">
              Start Building — It&apos;s Free
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
