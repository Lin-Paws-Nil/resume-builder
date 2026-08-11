import { FileText } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/marketing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of Service for createresume.co — the rules and guidelines for using our free AI resume builder.',
  alternates: { canonical: 'https://createresume.co/terms' },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-12">Last updated: July 5, 2026</p>

        <article className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using createresume.co (&quot;the Service&quot;), operated by White Hill, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Description of Service</h2>
            <p className="text-gray-600 leading-relaxed">
              createresume.co is an online resume builder that allows users to create, edit, and download professional resumes. The Service includes free features (resume creation with ad-supported downloads) and premium features (AI-powered content suggestions, ad-free experience, unlimited downloads) available through paid subscriptions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. User Accounts</h2>
            <p className="text-gray-600 leading-relaxed mb-3">To use certain features, you must create an account. You agree to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Free and Premium Plans</h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Free Plan</h3>
            <p className="text-gray-600 leading-relaxed mb-3">
              The free plan allows you to create resumes, use all templates, and download PDFs after viewing a brief advertisement. Advertisements will be displayed within the application.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Premium Plan</h3>
            <p className="text-gray-600 leading-relaxed">
              Premium subscriptions remove advertisements, provide AI-powered content suggestions, and offer additional features. Subscriptions are billed according to the plan selected (weekly, monthly, or annual) and auto-renew unless cancelled.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Payments and Refunds</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Premium subscriptions are processed through Razorpay. By purchasing a subscription, you agree to Razorpay&apos;s terms of service. Refund requests may be made within 7 days of purchase by contacting us at whitehillpvt@gmail.com. Refunds are granted at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. User Content</h2>
            <p className="text-gray-600 leading-relaxed">
              You retain ownership of all content you create using our Service (resume text, uploaded images, etc.). By using the Service, you grant us a limited license to store and process your content solely for the purpose of providing the Service. We will not share, sell, or use your resume content for any other purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Prohibited Use</h2>
            <p className="text-gray-600 leading-relaxed mb-3">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to interfere with or disrupt the Service</li>
              <li>Circumvent advertising mechanisms or subscription requirements</li>
              <li>Create multiple accounts to abuse free features</li>
              <li>Scrape, copy, or redistribute our templates or content</li>
              <li>Upload malicious content or attempt to compromise security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              The Service, including its design, templates, code, and branding, is the property of White Hill. You may not copy, modify, distribute, or create derivative works from our intellectual property without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Disclaimer of Warranties</h2>
            <p className="text-gray-600 leading-relaxed">
              The Service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that the Service will be uninterrupted, error-free, or that resumes created will result in employment. We are not responsible for hiring decisions made by employers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              To the maximum extent permitted by law, White Hill shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Termination</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for violation of these terms. You may also delete your account at any time by contacting us. Upon termination, your stored data will be deleted within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the updated Terms. We will make reasonable efforts to notify you of significant changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">13. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mangalore, Karnataka, India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">14. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              For questions about these Terms of Service, please contact us:
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
