import { FileText } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/marketing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for createresume.co — how we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://createresume.co/privacy-policy' },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="createresume.co logo" width="80" height="80" className="rounded-xl" />
            <span className="text-xl font-bold text-gray-900">createresume.co</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-12">Last updated: July 5, 2026</p>

        <article className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              createresume.co (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is operated by White Hill, located in Mangalore, India — 575005. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website createresume.co and use our resume builder service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Information</h3>
            <p className="text-gray-600 leading-relaxed mb-3">When you create an account or use our service, we may collect:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Name and email address (for account creation)</li>
              <li>Resume content you enter (work history, education, skills)</li>
              <li>Payment information (processed securely via Razorpay — we do not store card details)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-4">Automatically Collected Information</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Browser type and version</li>
              <li>Device type and operating system</li>
              <li>IP address and approximate location</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website URL</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Provide and maintain our resume builder service</li>
              <li>Generate and store your resumes</li>
              <li>Process payments for premium subscriptions</li>
              <li>Send you account-related notifications</li>
              <li>Improve our service and develop new features</li>
              <li>Display relevant advertisements to free-tier users</li>
              <li>Analyze usage patterns and website performance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cookies and Advertising</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We use cookies and similar tracking technologies to enhance your experience. Our site uses:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Essential cookies:</strong> Required for authentication and core functionality</li>
              <li><strong>Analytics cookies:</strong> Google Analytics (GA4) to understand how visitors use our site</li>
              <li><strong>Advertising cookies:</strong> Google AdSense to display relevant ads to free-tier users. These cookies may track your browsing activity across websites to show personalized ads.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              You can control cookies through your browser settings. Disabling cookies may limit some features of our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed mb-3">We use the following third-party services:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Supabase:</strong> Authentication and database storage</li>
              <li><strong>Google Analytics:</strong> Website analytics and usage tracking</li>
              <li><strong>Google AdSense:</strong> Advertising for free-tier users</li>
              <li><strong>Razorpay:</strong> Payment processing for premium subscriptions</li>
              <li><strong>OpenAI:</strong> AI-powered content suggestions (premium feature)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Each third-party service has its own privacy policy governing the use of your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement appropriate security measures to protect your personal information, including encrypted data transmission (HTTPS), secure authentication via Supabase, and access controls. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your resume data and account information for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us at whitehillpvt@gmail.com.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications</li>
              <li>Opt out of personalized advertising</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Children&apos;s Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Our service is not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will take steps to delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <ul className="list-none text-gray-600 space-y-1 mt-3">
              <li><strong>Email:</strong> <a href="mailto:whitehillpvt@gmail.com" className="text-blue-600 hover:underline">whitehillpvt@gmail.com</a></li>
              <li><strong>Company:</strong> White Hill</li>
              <li><strong>Address:</strong> Mangalore, India — 575005</li>
            </ul>
          </section>
        </article>
      </main>

      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <Footer />
      </div>
    </div>
  );
}
