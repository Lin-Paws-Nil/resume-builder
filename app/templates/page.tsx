import Link from 'next/link';
import { FileText, Sparkles } from 'lucide-react';
import { TemplateGallery } from '@/components/marketing/TemplateGallery';
import { Footer } from '@/components/marketing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free ATS-Friendly Resume Templates 2026',
  description:
    'Choose from 12+ professional, ATS-optimized resume templates. Modern, classic, and creative designs. Customize colors, fonts, and sections. Download as PDF instantly.',
  alternates: { canonical: 'https://createresume.co/templates' },
};

export default function TemplatesPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                &larr; Back
              </Link>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  createresume.co
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>

      {/* Hero Section - Server rendered for SEO */}
      <section className="relative min-h-[50vh] w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 grid place-content-center overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="relative z-10 text-center px-6 py-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-blue-400 animate-pulse" />
            <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">
              Professional Templates
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[110%]">
            Free ATS-Friendly
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Resume Templates
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            All 12+ templates are ATS-friendly and designed by professionals. Filter by style and find your perfect match.
          </p>
        </div>
      </section>

      {/* Client-side interactive gallery (tabs + grid) */}
      <TemplateGallery />

      {/* Info Section - Server rendered */}
      <section className="w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-10 border border-gray-200 shadow-xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              All Templates Are ATS-Friendly
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Every template is designed to pass Applicant Tracking Systems (ATS) and impress recruiters.
              You can customize colors, fonts, and sections to match your personal brand.
            </p>
          </div>
        </div>
      </section>

      </main>

      {/* Footer with internal links */}
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <Footer />
      </div>
    </div>
  );
}
