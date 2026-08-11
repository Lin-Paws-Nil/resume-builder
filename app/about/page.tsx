import { FileText, Users, Target, Shield } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/marketing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about createresume.co by White Hill — our mission to help job seekers build professional, ATS-friendly resumes with AI-powered tools.',
  alternates: { canonical: 'https://createresume.co/about' },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="createresume.co logo" width="80" height="80" className="rounded-xl" />
            <span className="text-xl font-bold text-gray-900">createresume.co</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/templates" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Templates</Link>
            <Link href="/builder" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Builder</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About createresume.co</h1>
        <p className="text-xl text-gray-600 mb-12 leading-relaxed">
          We believe everyone deserves a professional resume — regardless of budget. createresume.co is a free, AI-powered resume builder that helps job seekers create ATS-friendly resumes in minutes.
        </p>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Job hunting is stressful enough without worrying about resume formatting and design. We built createresume.co to remove that barrier. Our mission is to give every job seeker access to professional resume tools that were previously only available through expensive services or career coaches.
          </p>
          <p className="text-gray-600 leading-relaxed">
            With 12+ professionally designed templates, AI-powered content suggestions, and instant PDF downloads, we help thousands of professionals land interviews and advance their careers every month.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-blue-50 rounded-2xl">
              <Target className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">ATS-Optimized Templates</h3>
              <p className="text-sm text-gray-600">Every template is designed to pass Applicant Tracking Systems used by 98% of Fortune 500 companies.</p>
            </div>
            <div className="p-6 bg-purple-50 rounded-2xl">
              <Users className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">AI-Powered Suggestions</h3>
              <p className="text-sm text-gray-600">Our AI helps you write compelling descriptions, highlight achievements, and optimize keywords for your target role.</p>
            </div>
            <div className="p-6 bg-green-50 rounded-2xl">
              <Shield className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Free to Use</h3>
              <p className="text-sm text-gray-600">Create and download professional resumes at no cost. Premium features are available for those who want extra AI capabilities.</p>
            </div>
            <div className="p-6 bg-orange-50 rounded-2xl">
              <FileText className="h-8 w-8 text-orange-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Instant PDF Download</h3>
              <p className="text-sm text-gray-600">Download your completed resume as a pixel-perfect PDF in seconds, ready to submit to any employer.</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            createresume.co is a product of <strong>White Hill</strong>, based in Mangalore, India. We are a team of developers and designers passionate about making career tools accessible to everyone.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Since our launch, we have helped thousands of job seekers create professional resumes and land roles at companies including Google, Amazon, Spotify, and more.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Have questions, feedback, or partnership inquiries? We would love to hear from you.
          </p>
          <ul className="text-gray-600 space-y-2">
            <li><strong>Email:</strong> <a href="mailto:whitehillpvt@gmail.com" className="text-blue-600 hover:underline">whitehillpvt@gmail.com</a></li>
            <li><strong>Company:</strong> White Hill</li>
            <li><strong>Location:</strong> Mangalore, India — 575005</li>
          </ul>
        </section>

        <section className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to build your resume?</h2>
          <p className="text-blue-100 mb-6">Join thousands of professionals who landed their dream jobs.</p>
          <Link href="/templates" className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors">
            Get Started Free
          </Link>
        </section>
      </main>

      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <Footer />
      </div>
    </div>
  );
}
