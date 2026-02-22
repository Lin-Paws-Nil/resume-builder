import type { CustomSection } from '@/lib/types/resume';
import { renderHTML } from './render-html';

interface CustomSectionRendererProps {
  section: CustomSection;
}

export function CustomSectionRenderer({ section }: CustomSectionRendererProps) {
  if (section.type === 'text') {
    const content = typeof section.content === 'string' ? section.content : '';
    if (!content) return null;
    
    return (
      <section className="mb-6">
        <h2 className="text-lg font-bold uppercase mb-2 text-gray-900">{section.name}</h2>
        <div className="text-gray-700 leading-relaxed">{renderHTML(content)}</div>
      </section>
    );
  }

  if (section.type === 'list') {
    const items = Array.isArray(section.content) ? section.content.filter(Boolean) : [];
    if (items.length === 0) return null;

    return (
      <section className="mb-6">
        <h2 className="text-lg font-bold uppercase mb-2 text-gray-900">{section.name}</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {items.map((item, idx) => (
            <li key={idx}>{typeof item === 'string' ? item : String(item)}</li>
          ))}
        </ul>
      </section>
    );
  }

  if (section.type === 'items') {
    const items = Array.isArray(section.content) 
      ? section.content.filter((item: any) => item.label || item.value)
      : [];
    if (items.length === 0) return null;

    return (
      <section className="mb-6">
        <h2 className="text-lg font-bold uppercase mb-2 text-gray-900">{section.name}</h2>
        <div className="space-y-2">
          {items.map((item: any, idx: number) => (
            <div key={idx} className="flex gap-2">
              {item.label && (
                <span className="font-semibold text-gray-900">{item.label}:</span>
              )}
              <span className="text-gray-700">{item.value}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return null;
}

