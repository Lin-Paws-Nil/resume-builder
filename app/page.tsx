'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileText, Check, Sparkles, Shield, TrendingUp, Star, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [resumesCreated, setResumesCreated] = useState(48702);

  // Animate the counter
  useEffect(() => {
    const interval = setInterval(() => {
      setResumesCreated((prev) => {
        const increment = Math.floor(Math.random() * 3) + 1;
        return prev + increment;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    router.push('/templates');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">resumebuilder.io</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: 'ghost' }), 'text-gray-700 hover:text-gray-900')}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className={cn(buttonVariants(), 'bg-blue-600 hover:bg-blue-700 text-white')}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">
                {resumesCreated.toLocaleString()} resumes created today
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Build a <span className="text-blue-600">free</span> resume in a few clicks
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              The first step to a better job? A better resume. Only 2% of resumes win, and yours will be one of them. Create it now with our free resume builder!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
              >
                Create a New Resume
              </Button>
              <Button
                onClick={handleGetStarted}
                size="lg"
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg"
              >
                Improve My Resume
              </Button>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-1">48%</div>
                  <div className="text-sm text-gray-600">more likely to get hired</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-1">12%</div>
                  <div className="text-sm text-gray-600">better pay with your next job</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Example Resume */}
          <div className="relative">
            <div className="bg-white rounded-lg shadow-2xl p-8 border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">SW</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Samantha Williams</h3>
                  <p className="text-gray-600">Senior Marketing Manager</p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">SUMMARY</h4>
                  <p className="text-gray-600">Experienced marketing professional with 8+ years...</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">EXPERIENCE</h4>
                  <p className="text-gray-600">Marketing Manager at TechCorp (2020-Present)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">SKILLS</h4>
                  <p className="text-gray-600">Digital Marketing, SEO, Analytics...</p>
                </div>
              </div>

              <div className="mt-6 bg-green-100 border border-green-300 rounded-lg px-4 py-2 inline-block">
                <span className="text-sm font-semibold text-green-800">✓ ATS Perfect</span>
              </div>

              <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-xs font-semibold text-blue-900 mb-2">AI-powered ideas:</div>
                <ul className="space-y-1 text-xs text-gray-700">
                  <li>• Analyzed market trends to identify new growth opportunities.</li>
                  <li>• Reduced operational costs by 15% through process optimization.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="bg-white py-12 border-y border-blue-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-600 mb-8">Our customers have been hired at:</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">Google</div>
            <div className="text-2xl font-bold text-gray-400">DHL</div>
            <div className="text-2xl font-bold text-gray-400">Booking.com</div>
            <div className="text-2xl font-bold text-gray-400">Spotify</div>
            <div className="text-2xl font-bold text-gray-400">Facebook</div>
            <div className="text-2xl font-bold text-gray-400">Amazon</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          Why use resumebuilder.io&apos;s free resume builder?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-shadow">
            <div className="bg-white rounded-lg p-4 mb-4 h-48 flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <div className="text-xs text-gray-500">Resume Template</div>
              </div>
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Pre-written text & customization</h3>
            <p className="text-sm text-gray-600">
              Skip the writing struggle and save time on content, formatting, and design.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-shadow">
            <div className="bg-white rounded-lg p-4 mb-4 h-48 flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <div className="text-xs text-gray-500">AI Suggestions</div>
              </div>
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Get inspired by AI suggestions</h3>
            <p className="text-sm text-gray-600">
              AI suggests ideas and helps find the proper words to highlight your achievements.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-shadow">
            <div className="bg-white rounded-lg p-4 mb-4 h-48 flex items-center justify-center">
              <div className="text-center">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <div className="text-xs text-gray-500">ATS Friendly</div>
              </div>
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Reach recruiters every time</h3>
            <p className="text-sm text-gray-600">
              Get a readable, scannable, and impressive resume that passes the screening software.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-shadow">
            <div className="bg-white rounded-lg p-4 mb-4 h-48 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <div className="text-xs text-gray-500">Career Boost</div>
              </div>
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Level up your paycheck</h3>
            <p className="text-sm text-gray-600">
              AI frames your skills and accomplishments the right way to beat your competition.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Visual */}
            <div className="relative">
              <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold mb-4">Jessie Smith</h3>
                <p className="text-gray-600 mb-4">Human Resource Manager</p>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold">Professional Summary</h4>
                    <p className="text-gray-600">Experienced HR professional...</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Experience</h4>
                    <p className="text-gray-600">HR Manager at Company XYZ</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Steps */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Create a free, job-winning <span className="text-blue-600">resume</span> in 3 simple steps
              </h2>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="bg-blue-600 rounded-lg p-3 h-fit">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">STEP 1: Choose a stylish template</h3>
                    <p className="text-gray-600">
                      Select one of the recruiter-approved templates designed specifically to always make it past the screening stage.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-blue-600 rounded-lg p-3 h-fit">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">STEP 2: Customize each section</h3>
                    <p className="text-gray-600">
                      Add details about your experience, education, and skills with one click. Need more sections? We've got plenty.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-blue-600 rounded-lg p-3 h-fit">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">STEP 3: Download your resume in seconds</h3>
                    <p className="text-gray-600">
                      You&apos;ve saved hours on resume creation—now use that extra time to prepare for job interviews and shine on them.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGetStarted}
                size="lg"
                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                Create My Resume Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            What our customers are <span className="text-blue-600">saying about us</span>
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Join thousands of professionals who landed their dream jobs
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                &quot;I got 3 job offers within 2 weeks of using resumebuilder.io! The AI suggestions helped me highlight achievements I didn&apos;t even think were important.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-700">SM</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Martinez</div>
                  <div className="text-sm text-gray-600">Software Engineer at Google</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                &quot;The templates are professional and ATS-friendly. I landed my dream job at Amazon thanks to the resume I created here. Highly recommend!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-700">JD</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">James Davis</div>
                  <div className="text-sm text-gray-600">Product Manager at Amazon</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                &quot;Saved me so much time! The pre-written content suggestions were spot-on. I went from 0 interviews to 5 in just one month.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-700">EW</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Emily Wilson</div>
                  <div className="text-sm text-gray-600">Marketing Director at Spotify</div>
                </div>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                &quot;The best free resume builder I&apos;ve used. Clean interface, great templates, and the AI features are incredibly helpful. Got hired at Facebook!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-700">MR</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Michael Rodriguez</div>
                  <div className="text-sm text-gray-600">Data Scientist at Facebook</div>
                </div>
              </div>
            </div>

            {/* Testimonial 5 */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                &quot;I was struggling with my resume for months. This tool helped me create a professional resume in 30 minutes. Now I&apos;m at Booking.com!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-700">LT</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Lisa Thompson</div>
                  <div className="text-sm text-gray-600">UX Designer at Booking.com</div>
                </div>
              </div>
            </div>

            {/* Testimonial 6 */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                &quot;The ATS optimization feature is a game-changer. My resume now passes every screening. Thank you resumebuilder.io!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-700">AK</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Alex Kim</div>
                  <div className="text-sm text-gray-600">Operations Manager at DHL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to create your winning resume?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who landed their dream jobs
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold"
          >
            Create a Resume for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-semibold">resumebuilder.io</span>
          </div>
          <p className="text-center text-sm">
            © 2024 resumebuilder.io. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
