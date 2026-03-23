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
import { useEffect, useRef, useState, useCallback } from 'react';

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

// A4 dimensions (scaled up for better readability in preview)
const SCALE_FACTOR = 1.3; // Increased from 1.2 to make preview larger
const A4_WIDTH_MM = 210 * SCALE_FACTOR;
const A4_HEIGHT_MM = 297 * SCALE_FACTOR;
const PAGE_PADDING_MM = 20 * SCALE_FACTOR;
const MM_TO_PX = 3.779527559;

// Content area dimensions (inside padding)
const CONTENT_WIDTH_PX = (A4_WIDTH_MM - PAGE_PADDING_MM * 2) * MM_TO_PX;
const CONTENT_HEIGHT_PX = (A4_HEIGHT_MM - PAGE_PADDING_MM * 2) * MM_TO_PX;

export function ResumePreview() {
  const { previewResume, selectedTemplate } = useResumeStore();
  const measureRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);

  const calculatePages = useCallback(() => {
    const element = measureRef.current;
    if (!element || !previewResume) {
      setPageCount(1);
      return;
    }

    requestAnimationFrame(() => {
      if (!element) return;
      const totalHeight = element.scrollHeight;
      const pages = Math.ceil(totalHeight / CONTENT_HEIGHT_PX);
      setPageCount(Math.max(1, pages));
    });
  }, [previewResume]);

  useEffect(() => {
    if (!measureRef.current || !previewResume) {
      setPageCount(1);
      return;
    }

    const timeoutId = setTimeout(calculatePages, 300);
    window.addEventListener('resize', calculatePages);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', calculatePages);
    };
  }, [previewResume, selectedTemplate, calculatePages]);

  if (!previewResume) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>No resume data. Start by uploading a resume or adding sections.</p>
      </div>
    );
  }

  const TemplateComponent =
    templateComponents[selectedTemplate || 'aurora'] || AuroraTemplate;

  return (
    <div className="h-full overflow-y-auto bg-gray-100 p-1">
      <div className="flex flex-col items-center gap-2" id="resume-preview-container">
        {/* Hidden measurement container - matches content area width exactly */}
        <div
          ref={measureRef}
          id="resume-preview-full-content"
          className="absolute opacity-0 pointer-events-none"
          style={{
            width: CONTENT_WIDTH_PX,
            left: '-9999px',
            top: 0,
          }}
        >
          <TemplateComponent resume={previewResume} />
        </div>

        {/* Render pages */}
        {Array.from({ length: pageCount }, (_, pageIndex) => {
          const contentStartY = pageIndex * CONTENT_HEIGHT_PX;

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
                marginBottom: pageIndex < pageCount - 1 ? '16px' : '0',
              }}
            >
              {/* Content area - clips to page height */}
              <div
                style={{
                  width: '100%',
                  height: CONTENT_HEIGHT_PX,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Content shifted to show this page's portion */}
                <div
                  style={{
                    transform: `translateY(-${contentStartY}px)`,
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
