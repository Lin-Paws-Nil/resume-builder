'use client';

import { useResumeStore } from '@/store/resume-store';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { ModernTemplate } from '@/components/templates/ModernTemplate';
import { ClassicTemplate } from '@/components/templates/ClassicTemplate';
import { CreativeTemplate } from '@/components/templates/CreativeTemplate';
import { AuroraTemplate } from '@/components/templates/AuroraTemplate';
import { HyperionTemplate } from '@/components/templates/HyperionTemplate';
import { LunarTemplate } from '@/components/templates/LunarTemplate';
import { StellarTemplate } from '@/components/templates/StellarTemplate';
import { ZenithTemplate } from '@/components/templates/ZenithTemplate';
import { AetherTemplate } from '@/components/templates/AetherTemplate';
import { NebulaTemplate } from '@/components/templates/NebulaTemplate';
import { EonTemplate } from '@/components/templates/EonTemplate';
import { CosmosTemplate } from '@/components/templates/CosmosTemplate';

const templates = [
  {
    id: 'aurora',
    name: 'Aurora',
    preview: AuroraTemplate,
    color: 'from-blue-500 to-purple-600',
  },
  {
    id: 'hyperion',
    name: 'Hyperion',
    preview: HyperionTemplate,
    color: 'from-gray-700 to-gray-900',
  },
  {
    id: 'lunar',
    name: 'Lunar',
    preview: LunarTemplate,
    color: 'from-gray-400 to-gray-600',
  },
  {
    id: 'stellar',
    name: 'Stellar',
    preview: StellarTemplate,
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 'zenith',
    name: 'Zenith',
    preview: ZenithTemplate,
    color: 'from-gray-800 to-black',
  },
  {
    id: 'aether',
    name: 'Aether',
    preview: AetherTemplate,
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 'nebula',
    name: 'Nebula',
    preview: NebulaTemplate,
    color: 'from-gray-800 to-gray-900',
  },
  {
    id: 'eon',
    name: 'Eon',
    preview: EonTemplate,
    color: 'from-gray-600 to-gray-800',
  },
  {
    id: 'cosmos',
    name: 'Cosmos',
    preview: CosmosTemplate,
    color: 'from-gray-500 to-gray-700',
  },
  {
    id: 'modern',
    name: 'Modern',
    preview: ModernTemplate,
    color: 'from-blue-500 to-purple-600',
  },
  {
    id: 'classic',
    name: 'Classic',
    preview: ClassicTemplate,
    color: 'from-gray-700 to-gray-900',
  },
  {
    id: 'creative',
    name: 'Creative',
    preview: CreativeTemplate,
    color: 'from-pink-500 to-orange-500',
  },
];

// Sample data for template previews
const sampleResume = {
  id: 'sample',
  title: 'Sample',
  personalInfo: {
    fullName: 'John Doe',
    email: 'john@email.com',
    phone: '555-1234',
    location: 'City, State',
  },
  summary: 'Professional summary...',
  experiences: [
    {
      id: '1',
      company: 'Company',
      position: 'Position',
      startDate: '2020',
      endDate: 'Present',
      current: true,
      description: ['Achievement 1', 'Achievement 2'],
    },
  ],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  hobbies: [],
  customSections: [],
  sectionOrder: ['personalInfo', 'summary', 'experiences', 'education', 'skills', 'projects', 'certifications', 'hobbies'],
  sectionNames: {
    personalInfo: 'Personal Information',
    summary: 'Summary',
    experiences: 'Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    certifications: 'Certifications',
    hobbies: 'Hobbies',
  },
  templateId: 'modern',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function TemplateBar() {
  const { selectedTemplate, setSelectedTemplate, resume } = useResumeStore();

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 relative z-20">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <span className="text-sm font-semibold text-gray-700 whitespace-nowrap mr-2">
          Templates:
        </span>
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id;
          const PreviewComponent = template.preview;

          return (
            <button
              key={template.id}
              onClick={() => {
                setSelectedTemplate(template.id);
              }}
              className={`
                relative flex-shrink-0 w-32 h-20 rounded-lg border-2 transition-all duration-200
                cursor-pointer z-10
                ${isSelected 
                  ? 'border-blue-600 shadow-md scale-105' 
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                }
              `}
              type="button"
            >
              <div className="absolute inset-0 rounded-lg overflow-hidden bg-gray-50">
                <div className="bg-white rounded shadow-sm h-full w-full" style={{ aspectRatio: '8.5/11' }}>
                  <div className="h-full overflow-hidden rounded">
                    <div className="transform scale-[0.22] origin-top-left" style={{ width: '454.5%', height: '454.5%' }}>
                      <PreviewComponent resume={sampleResume} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute -top-1 -right-1 bg-blue-600 rounded-full p-1">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}

              {/* Template Name */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg p-1">
                <span className="text-[8px] font-semibold text-white block text-center">
                  {template.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

