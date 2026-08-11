'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Sparkles, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { LiveCounter } from './LiveCounter';
import { HeroCTAButtons } from './CTAButton';

const STATIC_DISPLAY_MS = 8000;

export function HeroSection() {
  const [showVideo, setShowVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnded = useCallback(() => {
    setShowVideo(false);
    setTimeout(() => {
      setShowVideo(true);
      videoRef.current?.play();
    }, STATIC_DISPLAY_MS);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Text Content */}
        <div className="relative">
          {/* Phase 1: Upload feature text */}
          <div
            className={`transition-opacity duration-500 ${showVideo ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-full">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">AI-Powered</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Already Have a Resume?{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Let AI Rebuild It
              </span>
            </h1>

            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Upload your old resume and our AI instantly parses every detail — experience, skills, education — then restructures it into a modern, ATS-optimized format. No retyping. No starting over.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Upload any PDF or DOCX — AI extracts everything in seconds</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Automatically reformats into recruiter-preferred layouts</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Enhances bullet points with action verbs and metrics</span>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Go from outdated resume to interview-ready in under 2 minutes</span>
              </div>
            </div>

            <HeroCTAButtons />
          </div>

          {/* Phase 2: Original hero text */}
          <div
            className={`transition-opacity duration-500 ${!showVideo ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}
          >
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
        </div>

        {/* Right Side - Video / Resume Preview */}
        <div className="relative">
          {/* Phase 1: Video */}
          <div
            className={`transition-opacity duration-500 ${showVideo ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black aspect-video">
              <video
                ref={videoRef}
                src="/basepageAI.mp4"
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnded}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Phase 2: Static resume image */}
          <div
            className={`transition-opacity duration-500 ${!showVideo ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}
          >
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
      </div>
    </section>
  );
}
