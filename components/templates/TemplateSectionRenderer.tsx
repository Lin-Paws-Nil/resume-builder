import type { ResumeData } from '@/lib/types/resume';
import { CustomSectionRenderer } from '@/lib/utils/render-custom-section';

interface TemplateSectionRendererProps {
  resume: ResumeData;
  renderSection: (sectionId: string, data: any, displayName: string) => React.ReactNode;
}

export function TemplateSectionRenderer({ resume, renderSection }: TemplateSectionRendererProps) {
  // Guard against undefined resume or missing properties
  if (!resume || !resume.sectionOrder) {
    return null;
  }

  // Get ordered sections based on sectionOrder
  const orderedSections = resume.sectionOrder.map((sectionId) => {
    const isCustom = sectionId.startsWith('custom_');
    let data: any = null;
    let displayName = resume.sectionNames?.[sectionId] || sectionId;

    if (isCustom) {
      const customSection = resume.customSections?.find(s => s.id === sectionId);
      if (customSection) {
        return { id: sectionId, type: 'custom', data: customSection, displayName };
      }
      return null;
    }

    // Get data for standard sections with safe property access using optional chaining
    switch (sectionId) {
      case 'personalInfo':
        data = resume?.personalInfo ?? null;
        break;
      case 'summary':
        data = resume?.summary ?? null;
        break;
      case 'experiences':
        data = resume?.experiences ?? [];
        break;
      case 'education':
        data = resume?.education ?? [];
        break;
      case 'skills':
        data = resume?.skills ?? [];
        break;
      case 'projects':
        data = resume?.projects ?? [];
        break;
      case 'certifications':
        data = resume?.certifications ?? [];
        break;
      case 'hobbies':
        data = resume?.hobbies ?? [];
        break;
      default:
        data = null;
        break;
    }

    // Only include sections with data (personalInfo is always shown in header, others only if they have content)
    if (sectionId === 'personalInfo') {
      return { id: sectionId, type: 'standard', data, displayName };
    }
    if (sectionId === 'summary' && data && data !== '') {
      return { id: sectionId, type: 'standard', data, displayName };
    }
    if (data && (Array.isArray(data) ? data.length > 0 : (typeof data === 'string' ? data !== '' : true))) {
      return { id: sectionId, type: 'standard', data, displayName };
    }

    return null;
  }).filter(Boolean);

  return (
    <>
      {orderedSections.map((section) => {
        if (!section) return null;

        if (section.type === 'custom') {
          return <CustomSectionRenderer key={section.id} section={section.data} />;
        }

        return (
          <div key={section.id}>
            {renderSection(section.id, section.data, section.displayName)}
          </div>
        );
      })}
    </>
  );
}

