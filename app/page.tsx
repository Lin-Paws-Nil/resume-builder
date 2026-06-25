'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { GradientButton } from '@/components/ui/gradient-button';
import { cn } from '@/lib/utils';
import { FileText, Check, Sparkles, Shield, TrendingUp, Star, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const [resumesCreated, setResumesCreated] = useState(48702);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] opacity-20"></div>
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">createresume.co</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <GradientButton variant="secondary" className="px-6 py-2.5 text-sm min-w-[100px]">
                Login
              </GradientButton>
            </Link>
            <Link href="/signup">
              <GradientButton variant="green" className="px-6 py-2.5 text-sm min-w-[100px]">
                Sign Up
              </GradientButton>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">
                {resumesCreated.toLocaleString()} resumes created today
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Build a <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">professional</span> resume in minutes
            </h1>

            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              The first step to a better job? A better resume. Only 2% of resumes win, and yours will be one of them. Create it now with our free resume builder!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <GradientButton
                onClick={handleGetStarted}
                className="px-8 py-6 text-lg"
              >
                Create a New Resume
                <ArrowRight className="ml-2 h-5 w-5" />
              </GradientButton>
              <GradientButton
                onClick={handleGetStarted}
                variant="green"
                className="px-8 py-6 text-lg"
              >
                Improve My Resume
              </GradientButton>
            </div>

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
              {/* Resume Preview */}
              <div className="relative aspect-[8.5/11] bg-white rounded-lg shadow-2xl">
                <Image
                  src="/resume-examples/aurora/aurora.png"
                  alt="Professional resume example"
                  fill
                  className="object-contain"
                  unoptimized
                  priority
                />
              </div>
              
              {/* ATS Badge */}
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
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-4 mb-4 h-16 w-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Pre-written text & customization</h3>
              <p className="text-sm text-gray-600">
                Skip the writing struggle and save time on content, formatting, and design.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 mb-4 h-16 w-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Get inspired by AI suggestions</h3>
              <p className="text-sm text-gray-600">
                AI suggests ideas and helps find the proper words to highlight your achievements.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-4 mb-4 h-16 w-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Reach recruiters every time</h3>
              <p className="text-sm text-gray-600">
                Get a readable, scannable, and impressive resume that passes the screening software.
              </p>
            </div>

            {/* Feature 4 */}
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
            <GradientButton
              onClick={handleGetStarted}
              className="px-8 py-6 text-lg"
            >
              Create My Resume Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </GradientButton>
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
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                &quot;I got 3 job offers within 2 weeks of using createresume.co! The AI suggestions helped me highlight achievements I didn&apos;t even think were important.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-700">SM</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Martinez</div>
                  <div className="text-sm text-gray-600">Software Engineer at Google</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                &quot;The templates are professional and ATS-friendly. I landed my dream job at Amazon thanks to the resume I created here. Highly recommend!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-purple-700">JD</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">James Davis</div>
                  <div className="text-sm text-gray-600">Product Manager at Amazon</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                &quot;Saved me so much time! The pre-written content suggestions were spot-on. I went from 0 interviews to 5 in just one month.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-pink-700">EW</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Emily Wilson</div>
                  <div className="text-sm text-gray-600">Marketing Director at Spotify</div>
                </div>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                &quot;The best free resume builder I&apos;ve used. Clean interface, great templates, and the AI features are incredibly helpful. Got hired at Facebook!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-green-700">MR</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Michael Rodriguez</div>
                  <div className="text-sm text-gray-600">Data Scientist at Facebook</div>
                </div>
              </div>
            </div>

            {/* Testimonial 5 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                &quot;I was struggling with my resume for months. This tool helped me create a professional resume in 30 minutes. Now I&apos;m at Booking.com!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-orange-700">LT</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Lisa Thompson</div>
                  <div className="text-sm text-gray-600">UX Designer at Booking.com</div>
                </div>
              </div>
            </div>

            {/* Testimonial 6 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                &quot;The ATS optimization feature is a game-changer. My resume now passes every screening. Thank you createresume.co!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-red-700">AK</span>
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
      <section className="bg-white/10 backdrop-blur-md py-16 border-y border-white/10 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to create your winning resume?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of professionals who landed their dream jobs
          </p>
          <GradientButton
            onClick={handleGetStarted}
            className="px-10 py-6 text-lg"
          >
            Create a Resume for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </GradientButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-semibold text-lg">createresume.co</span>
          </div>
          <p className="text-center text-sm text-gray-400 mb-2">
            © 2026 createresume.co. All rights reserved.
          </p>
          <p className="text-center text-sm text-gray-500">
            Contact us: <a href="mailto:whitehillpvt@gmail.com" className="text-blue-400 hover:text-blue-300">whitehillpvt@gmail.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
