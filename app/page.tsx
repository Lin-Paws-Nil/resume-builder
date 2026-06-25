import Link from 'next/link';
import Image from 'next/image';
import { FileText, Sparkles, Shield, TrendingUp, Star, ArrowRight } from 'lucide-react';
import { LiveCounter } from '@/components/marketing/LiveCounter';
import { HeroCTAButtons, CTAButton } from '@/components/marketing/CTAButton';
import { Footer } from '@/components/marketing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free AI Resume Builder | Create Resumes Online',
  description:
    'Build a professional, ATS-friendly resume in minutes with AI assistance. 12+ free templates, smart content suggestions, and instant PDF download. Join 48,000+ professionals.',
  alternates: { canonical: 'https://createresume.co' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'createresume.co',
      url: 'https://createresume.co',
      description: 'AI-powered free resume builder with ATS-friendly templates',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://createresume.co/templates?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'WebApplication',
      name: 'createresume.co',
      url: 'https://createresume.co',
      description: 'AI-powered free resume builder with ATS-friendly templates',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '2847',
      },
    },
    {
      '@type': 'Organization',
      name: 'createresume.co',
      url: 'https://createresume.co',
      logo: 'https://createresume.co/icon.svg',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'whitehillpvt@gmail.com',
        contactType: 'customer service',
      },
    },
    {
      '@type': 'HowTo',
      name: 'How to Create a Professional Resume for Free',
      description: 'Create a job-winning resume in 3 simple steps using createresume.co free resume builder.',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Choose a stylish template',
          text: 'Select one of the recruiter-approved templates designed specifically to always make it past the ATS screening stage.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Customize each section',
          text: 'Add details about your experience, education, and skills. Use AI-powered suggestions to highlight your achievements.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Download in seconds',
          text: 'Download your completed resume as a high-quality PDF file instantly, ready to submit to employers.',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is createresume.co free to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, createresume.co offers a free plan that lets you create professional resumes with ATS-friendly templates. Premium features like AI-powered content suggestions and unlimited downloads are available with a paid subscription.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are the resume templates ATS-friendly?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, all 12+ resume templates on createresume.co are designed to pass Applicant Tracking Systems (ATS). They use clean formatting, proper heading hierarchies, and standard fonts that ATS software can easily parse.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the AI resume builder work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our AI suggests pre-written content for each section of your resume based on your job title and industry. It helps you highlight achievements, use action verbs, and optimize your resume for specific roles.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I download my resume as a PDF?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, you can download your completed resume as a high-quality PDF file instantly. The PDF preserves all formatting and is ready to submit to employers.',
          },
        },
      ],
    },
  ],
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] opacity-20"></div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">createresume.co</span>
          </div>
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6 mr-auto ml-12">
            <Link href="/templates" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Templates</Link>
            <Link href="/resume-examples" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Resume Examples</Link>
            <Link href="/resume-format" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Resume Format</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-6 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
              Login
            </Link>
            <Link href="/signup" className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:opacity-90 transition-opacity">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <LiveCounter />

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Free AI <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Resume Builder</span> — Create Professional Resumes in Minutes
            </h1>

            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              The first step to a better job? A better resume. Only 2% of resumes win, and yours will be one of them. Create it now with our free resume builder!
            </p>

            <HeroCTAButtons />

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-1">48%</div>
                  <div className="text-sm text-gray-300">more likely to get hired</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-1">12%</div>
                  <div className="text-sm text-gray-300">better pay with your next job</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Resume Preview Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black p-8 transform hover:scale-105 transition-transform duration-500">
              <div className="relative aspect-[8.5/11] bg-white rounded-lg shadow-2xl">
                <Image
                  src="/resume-examples/aurora/aurora.png"
                  alt="Free ATS-friendly resume template example — Aurora modern two-column design by createresume.co"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="absolute top-12 -right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-lg transform rotate-12 font-semibold text-sm z-10">
                ✓ ATS Perfect
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="bg-white/5 backdrop-blur-sm py-12 border-y border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-300 mb-8 text-lg font-medium">Our customers have been hired at:</p>
          <div className="flex flex-wrap items-center justify-center gap-12">
            <div className="text-2xl font-bold text-white/60 hover:text-white transition-colors">Google</div>
            <div className="text-2xl font-bold text-white/60 hover:text-white transition-colors">DHL</div>
            <div className="text-2xl font-bold text-white/60 hover:text-white transition-colors">Booking.com</div>
            <div className="text-2xl font-bold text-white/60 hover:text-white transition-colors">Spotify</div>
            <div className="text-2xl font-bold text-white/60 hover:text-white transition-colors">Facebook</div>
            <div className="text-2xl font-bold text-white/60 hover:text-white transition-colors">Amazon</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            Why use createresume.co&apos;s free resume builder?
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            Everything you need to create a winning resume
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-4 mb-4 h-16 w-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Pre-written text &amp; customization</h3>
              <p className="text-sm text-gray-600">
                Skip the writing struggle and save time on content, formatting, and design.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 mb-4 h-16 w-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Get inspired by AI suggestions</h3>
              <p className="text-sm text-gray-600">
                AI suggests ideas and helps find the proper words to highlight your achievements.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-4 mb-4 h-16 w-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Reach recruiters every time</h3>
              <p className="text-sm text-gray-600">
                Get a readable, scannable, and impressive resume that passes the screening software.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-4 mb-4 h-16 w-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Level up your paycheck</h3>
              <p className="text-sm text-gray-600">
                AI frames your skills and accomplishments the right way to beat your competition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="bg-white/5 backdrop-blur-sm py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
            Create a free, job-winning <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">resume</span> in 3 simple steps
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-4 h-16 w-16 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-white">Choose a stylish template</h3>
              <p className="text-gray-300">
                Select one of the recruiter-approved templates designed specifically to always make it past the screening stage.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 h-16 w-16 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-white">Customize each section</h3>
              <p className="text-gray-300">
                Add details about your experience, education, and skills with one click. Need more sections? We&apos;ve got plenty.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-4 h-16 w-16 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-white">Download in seconds</h3>
              <p className="text-gray-300">
                You&apos;ve saved hours on resume creation—now use that extra time to prepare for job interviews and shine on them.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <CTAButton className="px-8 py-6 text-lg">
              Create My Resume Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            What our customers are <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">saying about us</span>
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Join thousands of professionals who landed their dream jobs
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "I got 3 job offers within 2 weeks of using createresume.co! The AI suggestions helped me highlight achievements I didn't even think were important.", name: "Sarah Martinez", role: "Software Engineer at Google", initials: "SM", bgColor: "bg-blue-100", textColor: "text-blue-700" },
              { quote: "The templates are professional and ATS-friendly. I landed my dream job at Amazon thanks to the resume I created here. Highly recommend!", name: "James Davis", role: "Product Manager at Amazon", initials: "JD", bgColor: "bg-purple-100", textColor: "text-purple-700" },
              { quote: "Saved me so much time! The pre-written content suggestions were spot-on. I went from 0 interviews to 5 in just one month.", name: "Emily Wilson", role: "Marketing Director at Spotify", initials: "EW", bgColor: "bg-pink-100", textColor: "text-pink-700" },
              { quote: "The best free resume builder I've used. Clean interface, great templates, and the AI features are incredibly helpful. Got hired at Facebook!", name: "Michael Rodriguez", role: "Data Scientist at Facebook", initials: "MR", bgColor: "bg-green-100", textColor: "text-green-700" },
              { quote: "I was struggling with my resume for months. This tool helped me create a professional resume in 30 minutes. Now I'm at Booking.com!", name: "Lisa Thompson", role: "UX Designer at Booking.com", initials: "LT", bgColor: "bg-orange-100", textColor: "text-orange-700" },
              { quote: "The ATS optimization feature is a game-changer. My resume now passes every screening. Thank you createresume.co!", name: "Alex Kim", role: "Operations Manager at DHL", initials: "AK", bgColor: "bg-red-100", textColor: "text-red-700" },
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${testimonial.bgColor} rounded-full flex items-center justify-center`}>
                    <span className={`font-bold ${testimonial.textColor}`}>{testimonial.initials}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white/10 backdrop-blur-md py-16 border-y border-white/10 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to create your winning resume?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of professionals who landed their dream jobs
          </p>
          <CTAButton className="px-10 py-6 text-lg">
            Create a Resume for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </CTAButton>
        </div>
      </section>

      </main>

      <Footer />
    </div>
  );
}
