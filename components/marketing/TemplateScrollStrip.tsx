'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { useResumeStore } from '@/store/resume-store';

const templates = [
  { id: 'aurora', name: 'Aurora', tags: ['Modern', 'ATS'], image: '/resume-examples/aurora/aurora.png', color: 'from-blue-500 to-purple-600' },
  { id: 'hyperion', name: 'Hyperion', tags: ['Professional', 'ATS'], image: '/resume-examples/hyperion/hyperion.png', color: 'from-gray-700 to-gray-900' },
  { id: 'lunar', name: 'Lunar', tags: ['Simple', 'ATS'], image: '/resume-examples/lunar/lunar.png', color: 'from-gray-400 to-gray-600' },
  { id: 'stellar', name: 'Stellar', tags: ['Professional', 'Two Columns'], image: '/resume-examples/stellar/stellar.png', color: 'from-blue-400 to-blue-600' },
  { id: 'zenith', name: 'Zenith', tags: ['Simple', 'ATS'], image: '/resume-examples/zenith/zenith.png', color: 'from-gray-800 to-black' },
  { id: 'aether', name: 'Aether', tags: ['Professional', 'ATS'], image: '/resume-examples/aether/aether.png', color: 'from-blue-500 to-blue-700' },
  { id: 'nebula', name: 'Nebula', tags: ['Modern', 'Two Columns'], image: '/resume-examples/nebula/nebula.png', color: 'from-gray-800 to-gray-900' },
  { id: 'eon', name: 'Eon', tags: ['Simple', 'ATS'], image: '/resume-examples/eon/eon.png', color: 'from-gray-600 to-gray-800' },
  { id: 'cosmos', name: 'Cosmos', tags: ['Professional', 'ATS', 'Two Columns'], image: '/resume-examples/cosmos/cosmos.png', color: 'from-gray-500 to-gray-700' },
  { id: 'modern', name: 'Modern', tags: ['Modern', 'ATS'], image: '/resume-examples/modern/modern.png', color: 'from-blue-500 to-purple-600' },
  { id: 'classic', name: 'Classic', tags: ['Professional', 'ATS'], image: '/resume-examples/classic/classic.png', color: 'from-gray-700 to-gray-900' },
  { id: 'creative', name: 'Creative', tags: ['Modern', 'Two Columns'], image: '/resume-examples/creative/creative.png', color: 'from-pink-500 to-orange-500' },
];

function TemplateCard({ template, onClick }: { template: typeof templates[0]; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-[180px] group cursor-pointer"
    >
      <div className="relative rounded-xl overflow-hidden border border-white/15 shadow-lg bg-white aspect-[8.5/11] mb-2 group-hover:scale-105 group-hover:shadow-2xl transition-all duration-300">
        {imgError ? (
          <div className={`absolute inset-0 bg-gradient-to-br ${template.color} flex items-center justify-center`}>
            <span className="text-white font-bold text-lg">{template.name}</span>
          </div>
        ) : (
          <Image
            src={template.image}
            alt={`${template.name} resume template`}
            fill
            className="object-contain"
            sizes="180px"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <span className="text-white text-xs font-semibold">{template.name}</span>
        {template.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="px-1.5 py-0.5 bg-white/10 border border-white/20 text-[10px] text-gray-300 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}

export function TemplateScrollStrip() {
  const router = useRouter();
  const { setSelectedTemplate, setResume } = useResumeStore();

  const handleTemplateClick = (templateId: string) => {
    setSelectedTemplate(templateId);
    const { resume: currentResume } = useResumeStore.getState();
    if (currentResume) {
      setResume({ ...currentResume, templateId });
    }
    router.push('/builder');
  };

  const allTemplates = [...templates, ...templates];

  return (
    <section className="relative z-10 py-10 overflow-hidden">
      <p className="text-center text-gray-400 text-sm font-medium mb-6 tracking-wide uppercase">
        12+ Professional Templates — Click to start building
      </p>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-scroll-left">
          {allTemplates.map((template, idx) => (
            <TemplateCard
              key={`${template.id}-${idx}`}
              template={template}
              onClick={() => handleTemplateClick(template.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
