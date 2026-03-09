'use client';

import { useResumeStore } from '@/store/resume-store';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useMemo } from 'react';
import { TemplateImage } from '@/components/templates/TemplateImage';
import { TextShimmer } from '@/components/ui/text-shimmer';

type TemplateCategory = 'All templates' | 'Simple' | 'Professional' | 'Modern' | 'ATS' | 'Two columns';

const templates = [
  {
    id: 'aurora',
    name: 'Aurora',
    image: '/resume-examples/aurora/aurora.png',
    categories: ['Modern', 'ATS', 'Two columns'] as TemplateCategory[],
    color: 'from-blue-500 to-purple-600',
  },
  {
    id: 'hyperion',
    name: 'Hyperion',
    image: '/resume-examples/hyperion/hyperion.png',
    categories: ['Professional', 'ATS'] as TemplateCategory[],
    color: 'from-gray-700 to-gray-900',
  },
  {
    id: 'lunar',
    name: 'Lunar',
    image: '/resume-examples/lunar/lunar.png',
    categories: ['Simple', 'ATS'] as TemplateCategory[],
    color: 'from-gray-400 to-gray-600',
  },
  {
    id: 'stellar',
    name: 'Stellar',
    image: '/resume-examples/stellar/stellar.png',
    categories: ['Professional', 'ATS', 'Two columns'] as TemplateCategory[],
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 'zenith',
    name: 'Zenith',
    image: '/resume-examples/zenith/zenith.png',
    categories: ['Simple', 'ATS'] as TemplateCategory[],
    color: 'from-gray-800 to-black',
  },
  {
    id: 'aether',
    name: 'Aether',
    image: '/resume-examples/aether/aether.png',
    categories: ['Professional', 'ATS'] as TemplateCategory[],
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 'nebula',
    name: 'Nebula',
    image: '/resume-examples/nebula/nebula.png',
    categories: ['Modern', 'Two columns'] as TemplateCategory[],
    color: 'from-gray-800 to-gray-900',
  },
  {
    id: 'eon',
    name: 'Eon',
    image: '/resume-examples/eon/eon.png',
    categories: ['Simple', 'ATS'] as TemplateCategory[],
    color: 'from-gray-600 to-gray-800',
  },
  {
    id: 'cosmos',
    name: 'Cosmos',
    image: '/resume-examples/cosmos/cosmos.png',
    categories: ['Professional', 'ATS', 'Two columns'] as TemplateCategory[],
    color: 'from-gray-500 to-gray-700',
  },
  {
    id: 'modern',
    name: 'Modern',
    image: '/resume-examples/modern/modern.png',
    categories: ['Modern', 'ATS'] as TemplateCategory[],
    color: 'from-blue-500 to-purple-600',
  },
  {
    id: 'classic',
    name: 'Classic',
    image: '/resume-examples/classic/classic.png',
    categories: ['Professional', 'ATS'] as TemplateCategory[],
    color: 'from-gray-700 to-gray-900',
  },
  {
    id: 'creative',
    name: 'Creative',
    image: '/resume-examples/creative/creative.png',
    categories: ['Modern', 'Two columns'] as TemplateCategory[],
    color: 'from-pink-500 to-orange-500',
  },
];

const tabs: TemplateCategory[] = ['All templates', 'Simple', 'Professional', 'Modern', 'ATS', 'Two columns'];

export function TemplateBar() {
  const { selectedTemplate, setSelectedTemplate } = useResumeStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TemplateCategory>('All templates');

  const filteredTemplates = useMemo(() => {
    if (activeTab === 'All templates') {
      return templates;
    }
    return templates.filter(template => template.categories.includes(activeTab));
  }, [activeTab]);

  return (
    <div 
      className="bg-gradient-to-br from-slate-900/80 via-blue-900/80 to-slate-900/80 backdrop-blur-md border-b border-white/10 relative z-20 transition-all duration-500 ease-in-out overflow-hidden shadow-lg"
      style={{ 
        maxHeight: isExpanded ? '400px' : '70px',
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Collapsed State - Always visible bar */}
      <div 
        className={`px-6 py-2.5 flex items-center justify-between transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none absolute inset-x-0 top-0' : 'opacity-100'}`}
      >
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-white drop-shadow-lg">
            Current Template:
          </span>
          {templates.map((template) => {
            if (selectedTemplate === template.id) {
              return (
                <div key={template.id} className="flex items-center gap-3">
                  <div className="w-10 h-14 bg-white rounded border-2 border-blue-400 overflow-hidden relative flex-shrink-0 shadow-lg">
                    <TemplateImage
                      src={template.image}
                      alt={template.name}
                      templateName={template.name}
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-blue-500/30 backdrop-blur-sm border border-blue-400/50 rounded-lg px-3 py-1.5">
                    <span className="text-sm font-semibold text-white">{template.name}</span>
                    <Check className="h-4 w-4 text-blue-300" />
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <TextShimmer 
            duration={1.5}
            className="text-sm font-semibold [--base-color:theme(colors.white)] [--base-gradient-color:theme(colors.cyan.300)]"
          >
            Hover to change template
          </TextShimmer>
          <ChevronDown className="h-4 w-4 animate-bounce text-cyan-300" />
        </div>
      </div>

      {/* Expanded State - Show all templates in horizontal scroll */}
      <div 
        className={`px-6 py-4 transition-all duration-500 ease-in-out ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none absolute'}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white drop-shadow-lg">
                Choose Template:
              </span>
              <ChevronUp className="h-4 w-4 text-blue-300" />
            </div>
            
            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-3 py-1.5 rounded-lg font-semibold text-xs whitespace-nowrap transition-all duration-200
                    ${activeTab === tab 
                      ? 'bg-white text-gray-900 shadow-lg' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 pt-2">
          {filteredTemplates.map((template) => {
            const isSelected = selectedTemplate === template.id;

            return (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`
                  relative flex-shrink-0 rounded-xl border-2 transition-all duration-200
                  cursor-pointer group
                  ${isSelected 
                    ? 'border-blue-500 shadow-lg shadow-blue-500/50 scale-105' 
                    : 'border-white/20 hover:border-blue-400 hover:shadow-md'
                  }
                `}
                style={{ width: '200px', height: '260px' }}
                type="button"
              >
                {/* Template Image */}
                <div className="absolute inset-0 rounded-xl overflow-hidden bg-white/95 backdrop-blur-sm p-2">
                  <div className="relative w-full h-full bg-gray-50 rounded-lg overflow-hidden">
                    <TemplateImage
                      src={template.image}
                      alt={`${template.name} template`}
                      templateName={template.name}
                    />
                  </div>
                </div>
                
                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-0 right-0 bg-blue-500 rounded-full p-1.5 shadow-lg shadow-blue-500/50 z-10">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}

                {/* Template Name */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl p-3">
                  <span className="text-sm font-semibold text-white block text-center">
                    {template.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

