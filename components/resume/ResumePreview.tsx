'use client';

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
import { useEffect, useRef, useState } from 'react';

const templateComponents: Record<string, React.ComponentType<any>> = {
  aurora: AuroraTemplate,
  hyperion: HyperionTemplate,
  lunar: LunarTemplate,
  stellar: StellarTemplate,
  zenith: ZenithTemplate,
  aether: AetherTemplate,
  nebula: NebulaTemplate,
  eon: EonTemplate,
  cosmos: CosmosTemplate,
  modern: ModernTemplate,
  classic: ClassicTemplate,
  creative: CreativeTemplate,
};

// A4 dimensions
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PAGE_PADDING_MM = 20;

export function ResumePreview() {
  const { previewResume, selectedTemplate } = useResumeStore();
  const measureRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<number>(1);

  useEffect(() => {
    if (!measureRef.current || !previewResume) {
      setPages(1);
      return;
    }

    const measureContent = () => {
      const element = measureRef.current;
      if (!element) return;

      // Wait for content to render
      requestAnimationFrame(() => {
        if (!element) return;
        
        // Get the actual content height
        const contentHeight = element.scrollHeight;
        
        // Calculate available height per page
        // A4 height (297mm) - top padding (20mm) - bottom padding (20mm) = 257mm
        const availableHeightMM = A4_HEIGHT_MM - (PAGE_PADDING_MM * 2);
        
        // Convert mm to pixels (at 96 DPI: 1mm ≈ 3.7795px)
        const MM_TO_PX = 3.779527559;
        const availableHeightPx = availableHeightMM * MM_TO_PX;
        
        // Calculate number of pages needed
        const calculatedPages = Math.ceil(contentHeight / availableHeightPx);
        setPages(Math.max(1, calculatedPages));
      });
    };

    // Measure after a delay to ensure content is rendered
    const timeoutId = setTimeout(measureContent, 300);
    
    // Re-measure on window resize
    window.addEventListener('resize', measureContent);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', measureContent);
    };
  }, [previewResume, selectedTemplate]);

  if (!previewResume) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>No resume data. Start by uploading a resume or adding sections.</p>
      </div>
    );
  }

  const TemplateComponent =
    templateComponents[selectedTemplate || 'aurora'] || AuroraTemplate;

  // Calculate page dimensions
  const availableHeightMM = A4_HEIGHT_MM - (PAGE_PADDING_MM * 2);
  const MM_TO_PX = 3.779527559;
  const availableHeightPx = availableHeightMM * MM_TO_PX;

  return (
    <div className="h-full overflow-y-auto bg-gray-100 p-4">
      <div className="flex flex-col items-center gap-4" id="resume-preview-container">
        {/* Hidden measurement container - also used for PDF generation */}
        <div
          ref={measureRef}
          id="resume-preview-full-content"
          className="absolute opacity-0 pointer-events-none -z-10"
          style={{
            width: `${A4_WIDTH_MM}mm`,
            padding: `${PAGE_PADDING_MM}mm`,
            boxSizing: 'border-box',
            visibility: 'hidden',
          }}
        >
          <div className="bg-white">
            <TemplateComponent resume={previewResume} />
          </div>
        </div>

        {/* Render visible pages */}
        {Array.from({ length: pages }).map((_, pageIndex) => {
          const offsetY = pageIndex * availableHeightPx;

          return (
            <div
              key={pageIndex}
              className="bg-white shadow-lg relative resume-preview-page"
              data-page-index={pageIndex}
              style={{
                width: `${A4_WIDTH_MM}mm`,
                height: `${A4_HEIGHT_MM}mm`,
                padding: `${PAGE_PADDING_MM}mm`,
                boxSizing: 'border-box',
                overflow: 'hidden',
                marginBottom: pageIndex < pages - 1 ? '16px' : '0',
              }}
            >
              {/* Page content with clipping */}
              <div
                className="relative"
                style={{
                  height: `${availableHeightMM}mm`,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    transform: `translateY(-${offsetY}px)`,
                  }}
                >
                  <TemplateComponent resume={previewResume} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
