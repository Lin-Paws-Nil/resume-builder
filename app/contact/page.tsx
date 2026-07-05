import { FileText, Mail, MapPin, Building2 } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/marketing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the createresume.co team. We are here to help with questions, feedback, and support for our free AI resume builder.',
  alternates: { canonical: 'https://createresume.co/contact' },
};

export default function ContactPage() {
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
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/templates" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Templates</Link>
            <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">About</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
        <p className="text-xl text-gray-600 mb-12 leading-relaxed">
          Have a question, suggestion, or need help with your resume? We would love to hear from you. Our team typically responds within 24 hours.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-blue-50 rounded-2xl text-center">
            <Mail className="h-10 w-10 text-blue-600 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Email</h3>
            <a href="mailto:whitehillpvt@gmail.com" className="text-blue-600 hover:underline text-sm">
              whitehillpvt@gmail.com
            </a>
          </div>
          <div className="p-6 bg-purple-50 rounded-2xl text-center">
            <Building2 className="h-10 w-10 text-purple-600 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Company</h3>
            <p className="text-sm text-gray-600">White Hill</p>
          </div>
          <div className="p-6 bg-green-50 rounded-2xl text-center">
            <MapPin className="h-10 w-10 text-green-600 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Location</h3>
            <p className="text-sm text-gray-600">Mangalore, India<br />575005</p>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How Can We Help?</h2>
          <div className="space-y-6">
            <div className="p-6 border border-gray-200 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Technical Support</h3>
              <p className="text-gray-600 text-sm">Having trouble with the resume builder, downloads, or your account? Email us with a description of the issue and we will help you resolve it.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Feedback &amp; Suggestions</h3>
              <p className="text-gray-600 text-sm">We are always looking to improve. Share your ideas for new features, templates, or improvements you would like to see.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Business &amp; Partnerships</h3>
              <p className="text-gray-600 text-sm">Interested in partnering with us or integrating our resume builder into your platform? Get in touch to discuss opportunities.</p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Build your resume while you wait</h2>
          <p className="text-blue-100 mb-6">Get started with our free resume builder — no sign-up required to preview templates.</p>
          <Link href="/templates" className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors">
            View Templates
          </Link>
        </section>
      </main>

      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <Footer />
      </div>
    </div>
  );
}
