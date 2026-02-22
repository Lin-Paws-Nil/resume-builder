'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft, Check } from 'lucide-react';
import { useResumeStore } from '@/store/resume-store';
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
import { 
  getColorOptionsForTemplate, 
  supportsColorCustomization,
  type ColorOption,
  clearColor,
} from '@/lib/utils/template-colors';

const templates = [
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'An energetic and eye-catching design, ideal for showcasing fast-paced career achievements',
    category: 'Modern',
    preview: AuroraTemplate,
    color: 'from-blue-500 to-purple-600',
  },
  {
    id: 'hyperion',
    name: 'Hyperion',
    description: 'Strong typography and structured sections create a confident and polished look',
    category: 'Professional',
    preview: HyperionTemplate,
    color: 'from-gray-700 to-gray-900',
  },
  {
    id: 'lunar',
    name: 'Lunar',
    description: 'A minimalist and elegant resume template, reflecting clarity and precision in your career path',
    category: 'Minimalist',
    preview: LunarTemplate,
    color: 'from-gray-400 to-gray-600',
  },
  {
    id: 'stellar',
    name: 'Stellar',
    description: 'A sleek and polished CV template, emphasizing standout achievements and excellence',
    category: 'Professional',
    preview: StellarTemplate,
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 'zenith',
    name: 'Zenith',
    description: 'A bold and minimalistic resume template, emphasizing clarity and impact',
    category: 'Minimalist',
    preview: ZenithTemplate,
    color: 'from-gray-800 to-black',
  },
  {
    id: 'aether',
    name: 'Aether',
    description: 'A sharp and structured resume template that presents your expertise with professionalism',
    category: 'Professional',
    preview: AetherTemplate,
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 'nebula',
    name: 'Nebula',
    description: 'A creative and expansive CV template, ideal for showcasing diverse skills and experiences',
    category: 'Creative',
    preview: NebulaTemplate,
    color: 'from-gray-800 to-gray-900',
  },
  {
    id: 'eon',
    name: 'Eon',
    description: 'A clean, easy-to-read resume template, making your qualifications the center of attention',
    category: 'Simple',
    preview: EonTemplate,
    color: 'from-gray-600 to-gray-800',
  },
  {
    id: 'cosmos',
    name: 'Cosmos',
    description: 'A comprehensive CV template that provides a broad overview of your professional universe',
    category: 'Professional',
    preview: CosmosTemplate,
    color: 'from-gray-500 to-gray-700',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design perfect for tech and creative industries',
    category: 'Modern',
    preview: ModernTemplate,
    color: 'from-blue-500 to-purple-600',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional layout ideal for corporate and finance roles',
    category: 'Professional',
    preview: ClassicTemplate,
    color: 'from-gray-700 to-gray-900',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and expressive style great for design and marketing positions',
    category: 'Creative',
    preview: CreativeTemplate,
    color: 'from-pink-500 to-orange-500',
  },
];

// Sample resume data for preview
const sampleResume = {
  id: 'sample',
  title: 'Sample Resume',
  personalInfo: {
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe',
  },
  summary: 'Experienced software engineer with 5+ years of expertise in full-stack development. Passionate about building scalable applications and leading cross-functional teams.',
  experiences: [
    {
      id: '1',
      company: 'Tech Corp',
      position: 'Senior Software Engineer',
      startDate: '01/2020',
      endDate: 'Present',
      current: true,
      description: [
        'Led development of microservices architecture serving 1M+ users',
        'Mentored team of 5 junior developers',
        'Reduced system latency by 40% through optimization',
      ],
    },
  ],
  education: [
    {
      id: '1',
      institution: 'University of California',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '09/2014',
      endDate: '05/2018',
      gpa: '3.8',
    },
  ],
  skills: [
    {
      id: '1',
      category: 'Programming Languages',
      items: ['JavaScript', 'TypeScript', 'Python', 'Java'],
    },
    {
      id: '2',
      category: 'Frameworks',
      items: ['React', 'Next.js', 'Node.js', 'Express'],
    },
  ],
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

export default function TemplatesPage() {
  const router = useRouter();
  const { setSelectedTemplate, setResume } = useResumeStore();
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [hoveredColors, setHoveredColors] = useState<Record<string, string>>({});

  const handleColorSelect = (templateId: string, colorHex: string) => {
    setSelectedColors((prev) => ({
      ...prev,
      [templateId]: colorHex,
    }));
  };

  const handleUseTemplate = (templateId: string, selectedColor?: string) => {
    // Set selected template and color
    setSelectedTemplate(templateId);
    
    // Update resume with template and color if provided
    const { resume: currentResume } = useResumeStore.getState();
    if (currentResume) {
      const updatedResume = {
        ...currentResume,
        templateId,
        templateColor: selectedColor || selectedColors[templateId] || undefined,
      };
      setResume(updatedResume);
    }
    
    router.push('/builder');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">resumebuilder.io</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your <span className="text-blue-600">Resume Template</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a professional template that matches your industry and style. You can always change it later.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {templates.map((template) => {
            const PreviewComponent = template.preview;
            const isHovered = hoveredTemplate === template.id;
            const supportsColor = supportsColorCustomization(template.id);
            const colorOptions = supportsColor ? getColorOptionsForTemplate(template.id) : [];
            const selectedColor = selectedColors[template.id];
            const hoveredColor = hoveredColors[template.id];
            // Use hovered color for preview if available, otherwise use selected color
            const previewColor = hoveredColor || selectedColor;
            const previewResume = {
              ...sampleResume,
              templateId: template.id,
              templateColor: previewColor,
            };

            return (
              <div
                key={template.id}
                className="relative group bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300"
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
              >
                {/* Template Preview */}
                <div className="relative bg-gray-50 p-4 min-h-[500px] flex items-center justify-center overflow-hidden">
                  <div className="bg-white shadow-md rounded-lg w-full max-w-full" style={{ aspectRatio: '8.5/11', maxHeight: '450px' }}>
                    <div className="h-full overflow-hidden rounded-lg">
                      <div className="transform scale-[0.7] origin-top-left" style={{ width: '142.86%', height: '142.86%' }}>
                        <PreviewComponent resume={previewResume} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  {isHovered && (
                    <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 bg-white/98 backdrop-blur-none">
                      <Button
                        onClick={() => handleUseTemplate(template.id, selectedColor)}
                        size="lg"
                        className="bg-blue-600 text-white hover:bg-blue-700 font-semibold px-8 py-6 text-lg shadow-xl z-10"
                      >
                        Use This Template
                      </Button>
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{template.description}</p>
                  
                  {/* Color Picker (Always visible, not just on hover) */}
                  {supportsColor && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Color Theme</p>
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.slice(0, 10).map((color) => (
                          <button
                            key={color.hex}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleColorSelect(template.id, color.hex);
                            }}
                            onMouseEnter={() => {
                              setHoveredColors((prev) => ({
                                ...prev,
                                [template.id]: color.hex,
                              }));
                            }}
                            onMouseLeave={() => {
                              setHoveredColors((prev) => {
                                const updated = { ...prev };
                                delete updated[template.id];
                                return updated;
                              });
                            }}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              selectedColor === color.hex
                                ? 'border-gray-900 scale-110 shadow-md'
                                : hoveredColor === color.hex
                                ? 'border-gray-700 scale-105 shadow-sm'
                                : 'border-gray-300 hover:border-gray-500'
                            }`}
                            style={{
                              backgroundColor: color.hex === 'transparent' ? '#ffffff' : color.hex,
                              backgroundImage: color.hex === 'transparent' 
                                ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                                : 'none',
                              backgroundSize: color.hex === 'transparent' ? '6px 6px' : 'auto',
                              backgroundPosition: color.hex === 'transparent' ? '0 0, 0 3px, 3px -3px, -3px 0px' : '0 0',
                            }}
                            title={color.name}
                          >
                            {selectedColor === color.hex && (
                              <Check className="w-4 h-4 text-gray-900 mx-auto" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover Button (Mobile) */}
                <div className="p-4 border-t border-gray-200 md:hidden">
                  <Button
                    onClick={() => handleUseTemplate(template.id, selectedColor)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Use This Template
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 rounded-xl p-8 border border-blue-100 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            All Templates Are ATS-Friendly
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Every template is designed to pass Applicant Tracking Systems (ATS) and impress recruiters. 
            You can customize colors, fonts, and sections to match your personal brand.
          </p>
        </div>
      </div>
    </div>
  );
}

