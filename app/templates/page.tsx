'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft, Sparkles, Star } from 'lucide-react';
import { useResumeStore } from '@/store/resume-store';
import StickyScroll from '@/components/ui/sticky-scroll';
import { TemplateImage } from '@/components/templates/TemplateImage';

type TemplateCategory = 'All templates' | 'Simple' | 'Professional' | 'Modern' | 'ATS' | 'Two columns';

const templates = [
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'An energetic and eye-catching design, ideal for showcasing fast-paced career achievements',
    categories: ['Modern', 'ATS', 'Two columns'] as TemplateCategory[],
    image: '/resume-examples/aurora/aurora.png',
    color: 'from-blue-500 to-purple-600',
  },
  {
    id: 'hyperion',
    name: 'Hyperion',
    description: 'Strong typography and structured sections create a confident and polished look',
    categories: ['Professional', 'ATS'] as TemplateCategory[],
    image: '/resume-examples/hyperion/hyperion.png',
    color: 'from-gray-700 to-gray-900',
  },
  {
    id: 'lunar',
    name: 'Lunar',
    description: 'A minimalist and elegant resume template, reflecting clarity and precision in your career path',
    categories: ['Simple', 'ATS'] as TemplateCategory[],
    image: '/resume-examples/lunar/lunar.png',
    color: 'from-gray-400 to-gray-600',
  },
  {
    id: 'stellar',
    name: 'Stellar',
    description: 'A sleek and polished CV template, emphasizing standout achievements and excellence',
    categories: ['Professional', 'ATS', 'Two columns'] as TemplateCategory[],
    image: '/resume-examples/stellar/stellar.png',
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 'zenith',
    name: 'Zenith',
    description: 'A bold and minimalistic resume template, emphasizing clarity and impact',
    categories: ['Simple', 'ATS'] as TemplateCategory[],
    image: '/resume-examples/zenith/zenith.png',
    color: 'from-gray-800 to-black',
  },
  {
    id: 'aether',
    name: 'Aether',
    description: 'A sharp and structured resume template that presents your expertise with professionalism',
    categories: ['Professional', 'ATS'] as TemplateCategory[],
    image: '/resume-examples/aether/aether.png',
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 'nebula',
    name: 'Nebula',
    description: 'A creative and expansive CV template, ideal for showcasing diverse skills and experiences',
    categories: ['Modern', 'Two columns'] as TemplateCategory[],
    image: '/resume-examples/nebula/nebula.png',
    color: 'from-gray-800 to-gray-900',
  },
  {
    id: 'eon',
    name: 'Eon',
    description: 'A clean, easy-to-read resume template, making your qualifications the center of attention',
    categories: ['Simple', 'ATS'] as TemplateCategory[],
    image: '/resume-examples/eon/eon.png',
    color: 'from-gray-600 to-gray-800',
  },
  {
    id: 'cosmos',
    name: 'Cosmos',
    description: 'A comprehensive CV template that provides a broad overview of your professional universe',
    categories: ['Professional', 'ATS', 'Two columns'] as TemplateCategory[],
    image: '/resume-examples/cosmos/cosmos.png',
    color: 'from-gray-500 to-gray-700',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design perfect for tech and creative industries',
    categories: ['Modern', 'ATS'] as TemplateCategory[],
    image: '/resume-examples/modern/modern.png',
    color: 'from-blue-500 to-purple-600',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional layout ideal for corporate and finance roles',
    categories: ['Professional', 'ATS'] as TemplateCategory[],
    image: '/resume-examples/classic/classic.png',
    color: 'from-gray-700 to-gray-900',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and expressive style great for design and marketing positions',
    categories: ['Modern', 'Two columns'] as TemplateCategory[],
    image: '/resume-examples/creative/creative.png',
    color: 'from-pink-500 to-orange-500',
  },
];

// Category-specific bestsellers - shows in sticky middle column for each filter
const categoryBestsellers: Record<TemplateCategory, string[]> = {
  'All templates': ['aurora', 'modern'],
  'Simple': ['lunar', 'zenith'],
  'Professional': ['hyperion', 'stellar'],
  'Modern': ['aurora', 'modern'],
  'ATS': ['aurora', 'hyperion'],
  'Two columns': ['aurora', 'stellar'],
};

const tabs: TemplateCategory[] = ['All templates', 'Simple', 'Professional', 'Modern', 'ATS', 'Two columns'];

export default function TemplatesPage() {
  const router = useRouter();
  const { setSelectedTemplate, setResume } = useResumeStore();
  const [activeTab, setActiveTab] = useState<TemplateCategory>('All templates');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => {
    if (activeTab === 'All templates') {
      return templates;
    }
    return templates.filter(template => template.categories.includes(activeTab));
  }, [activeTab]);

  // Get category-specific bestseller templates for middle column
  const bestsellerTemplates = useMemo(() => {
    const currentCategoryBestsellers = categoryBestsellers[activeTab] || [];
    
    // Get bestsellers that exist in filtered results
    const bestsellersInFiltered = filteredTemplates.filter(template => 
      currentCategoryBestsellers.includes(template.id)
    );
    
    // If we have enough bestsellers, use them
    if (bestsellersInFiltered.length >= 2) {
      return bestsellersInFiltered.slice(0, 2);
    }
    
    // If we have 1 bestseller, add one more from filtered results
    if (bestsellersInFiltered.length === 1) {
      const remaining = filteredTemplates.filter(t => !currentCategoryBestsellers.includes(t.id));
      return [...bestsellersInFiltered, ...remaining.slice(0, 1)];
    }
    
    // Otherwise, use first 2 templates from filtered results
    return filteredTemplates.slice(0, 2);
  }, [filteredTemplates, activeTab]);

  // Get templates for left and right columns (excluding the ones shown in middle)
  const regularTemplates = useMemo(() => {
    const bestsellerIdsInView = bestsellerTemplates.map(t => t.id);
    return filteredTemplates.filter(template => !bestsellerIdsInView.includes(template.id));
  }, [filteredTemplates, bestsellerTemplates]);

  const handleUseTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    const { resume: currentResume } = useResumeStore.getState();
    if (currentResume) {
      const updatedResume = {
        ...currentResume,
        templateId,
      };
      setResume(updatedResume);
    }
    
    router.push('/builder');
  };

  return (
    <StickyScroll>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  resumebuilder.io
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[50vh] w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 grid place-content-center overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        <div className="relative z-10 text-center px-6 py-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-blue-400 animate-pulse" />
            <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">
              Professional Templates
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[110%]">
            Choose Your Perfect
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Resume Template
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            All templates are ATS-friendly and designed by professionals.
            <br />
            Scroll down to explore! 👇
          </p>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200
                  ${activeTab === tab 
                    ? 'bg-white text-gray-900 shadow-xl scale-105' 
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Sticky Scroll Layout */}
      <section className="w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 py-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          {/* Split templates into three columns for sticky scroll effect */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Column - Scrolling */}
            <div className="md:col-span-4 grid gap-6">
              {regularTemplates.filter((_, i) => i % 2 === 0).map((template) => {
                const isHovered = hoveredTemplate === template.id;

                return (
                  <div
                    key={template.id}
                    className="relative group bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                    onMouseEnter={() => setHoveredTemplate(template.id)}
                    onMouseLeave={() => setHoveredTemplate(null)}
                  >
                    {/* Template Image */}
                    <div className="relative bg-white aspect-[8.5/11] overflow-hidden flex items-center justify-center p-4">
                      <TemplateImage
                        src={template.image}
                        alt={`${template.name} resume template preview`}
                        templateName={template.name}
                      />
                      
                      {/* Hover Overlay with Button */}
                      {isHovered && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 z-10">
                          <Button
                            onClick={() => handleUseTemplate(template.id)}
                            size="lg"
                            className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white hover:from-slate-900 hover:via-blue-900 hover:to-slate-900 font-semibold px-8 py-6 text-lg shadow-2xl border border-blue-800"
                          >
                            Use This Template
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Template Info */}
                    <div className="p-6 border-t border-gray-200 bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
                        <div className="flex flex-wrap gap-1 max-w-[120px]">
                          {template.categories.slice(0, 2).map((cat) => (
                            <span key={cat} className="px-2 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs font-semibold rounded-full whitespace-nowrap">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{template.description}</p>
                    </div>

                    {/* Mobile Button */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50 md:hidden">
                      <Button
                        onClick={() => handleUseTemplate(template.id)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                      >
                        Use This Template
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Middle Column - Sticky with Bestsellers */}
            <div className="hidden md:block md:col-span-4 sticky top-[100px] self-start">
              <div className="grid gap-6">
                {bestsellerTemplates.map((template) => {
                  const isHovered = hoveredTemplate === template.id;
                  // Show badge if template is in current category's bestsellers list
                  const isBestseller = categoryBestsellers[activeTab]?.includes(template.id) || false;

                  return (
                    <div
                      key={template.id}
                      className="relative group bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                      onMouseEnter={() => setHoveredTemplate(template.id)}
                      onMouseLeave={() => setHoveredTemplate(null)}
                    >
                      {/* Template Image */}
                      <div className="relative bg-white aspect-[8.5/11] overflow-hidden flex items-center justify-center p-4">
                        <TemplateImage
                          src={template.image}
                          alt={`${template.name} resume template preview`}
                          templateName={template.name}
                        />
                        
                        {/* Hover Overlay with Button */}
                        {isHovered && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 z-10">
                            <Button
                              onClick={() => handleUseTemplate(template.id)}
                              size="lg"
                              className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white hover:from-slate-900 hover:via-blue-900 hover:to-slate-900 font-semibold px-8 py-6 text-lg shadow-2xl border border-blue-800"
                            >
                              Use This Template
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Template Info */}
                      <div className="p-6 border-t border-gray-200 bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
                            {isBestseller && (
                              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 font-semibold text-xs whitespace-nowrap">
                                <Star className="h-3 w-3 fill-white" />
                                Bestseller
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 max-w-[120px]">
                            {template.categories.slice(0, 2).map((cat) => (
                              <span key={cat} className="px-2 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs font-semibold rounded-full whitespace-nowrap">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{template.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column - Scrolling */}
            <div className="md:col-span-4 grid gap-6">
              {regularTemplates.filter((_, i) => i % 2 === 1).map((template) => {
                const isHovered = hoveredTemplate === template.id;

                return (
                  <div
                    key={template.id}
                    className="relative group bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                    onMouseEnter={() => setHoveredTemplate(template.id)}
                    onMouseLeave={() => setHoveredTemplate(null)}
                  >
                    {/* Template Image */}
                    <div className="relative bg-white aspect-[8.5/11] overflow-hidden flex items-center justify-center p-4">
                      <TemplateImage
                        src={template.image}
                        alt={`${template.name} resume template preview`}
                        templateName={template.name}
                      />
                      
                      {/* Hover Overlay with Button */}
                      {isHovered && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 z-10">
                          <Button
                            onClick={() => handleUseTemplate(template.id)}
                            size="lg"
                            className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white hover:from-slate-900 hover:via-blue-900 hover:to-slate-900 font-semibold px-8 py-6 text-lg shadow-2xl border border-blue-800"
                          >
                            Use This Template
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Template Info */}
                    <div className="p-6 border-t border-gray-200 bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
                        <div className="flex flex-wrap gap-1 max-w-[120px]">
                          {template.categories.slice(0, 2).map((cat) => (
                            <span key={cat} className="px-2 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs font-semibold rounded-full whitespace-nowrap">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{template.description}</p>
                    </div>

                    {/* Mobile Button */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50 md:hidden">
                      <Button
                        onClick={() => handleUseTemplate(template.id)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                      >
                        Use This Template
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-10 border border-gray-200 shadow-xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              All Templates Are ATS-Friendly
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Every template is designed to pass Applicant Tracking Systems (ATS) and impress recruiters. 
              You can customize colors, fonts, and sections to match your personal brand.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">resumebuilder.io</h2>
          </div>
          <p className="text-gray-400 text-sm">
            Build your professional resume in minutes
          </p>
        </div>
      </footer>
    </StickyScroll>
  );
}

