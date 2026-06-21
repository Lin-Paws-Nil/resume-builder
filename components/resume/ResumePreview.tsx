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

// A4 dimensions - template renders at true A4 size, CSS scale used for visual zoom
const SCALE_FACTOR = 1.3;
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PAGE_PADDING_MM = 20;
const MM_TO_PX = 3.779527559;

// Content area at actual A4 size (matches PDF: 170mm wide x 277mm tall)
// PDF uses @page { margin: 10mm 20mm 10mm 20mm } = 10mm top + 10mm bottom = 20mm vertical
const CONTENT_WIDTH_PX = (A4_WIDTH_MM - PAGE_PADDING_MM * 2) * MM_TO_PX;
const CONTENT_HEIGHT_PX = (A4_HEIGHT_MM - 26) * MM_TO_PX; // 297 - 26 = 271mm (with 2mm safety buffer)

interface PageBreak {
  pageIndex: number;
  startY: number;
  endY: number;
}

export function ResumePreview() {
  const { previewResume, selectedTemplate } = useResumeStore();
  const measureRef = useRef<HTMLDivElement>(null);
  const [pageBreaks, setPageBreaks] = useState<PageBreak[]>([
    { pageIndex: 0, startY: 0, endY: CONTENT_HEIGHT_PX },
  ]);

  const calculatePageBreaks = useCallback(() => {
    const element = measureRef.current;
    if (!element || !previewResume) {
      setPageBreaks([{ pageIndex: 0, startY: 0, endY: CONTENT_HEIGHT_PX }]);
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!element) return;

        const totalHeight = element.scrollHeight;

        if (totalHeight <= CONTENT_HEIGHT_PX) {
          setPageBreaks([{ pageIndex: 0, startY: 0, endY: totalHeight }]);
          return;
        }

        // Page break detection: find line-level elements that cross the page boundary
        const lineSelectors = [
          'li',
          'p',
          'h2',
          'h3',
          '.whitespace-pre-line > div',
          '.rich-text-content > p',
          '.rich-text-content > ul > li',
          '.rich-text-content > ol > li',
          '.list-disc > li',
        ].join(', ');

        const items = element.querySelectorAll(lineSelectors);
        const containerRect = element.getBoundingClientRect();

        const itemBounds: { top: number; bottom: number }[] = [];
        items.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.height > 0 && rect.height < CONTENT_HEIGHT_PX * 0.5) {
            itemBounds.push({
              top: rect.top - containerRect.top,
              bottom: rect.bottom - containerRect.top,
            });
          }
        });

        // Keep small compact items together (education entries, cert entries)
        const compactItems = element.querySelectorAll('.space-y-3 > div, .space-y-2 > div');
        compactItems.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.height > 0 && rect.height < 80) {
            itemBounds.push({
              top: rect.top - containerRect.top,
              bottom: rect.bottom - containerRect.top,
            });
          }
        });

        itemBounds.sort((a, b) => a.top - b.top);

        const breaks: PageBreak[] = [];
        let currentStartY = 0;
        let pageIndex = 0;

        while (currentStartY < totalHeight) {
          let pageEndY = currentStartY + CONTENT_HEIGHT_PX;

          if (pageEndY >= totalHeight) {
            breaks.push({ pageIndex, startY: currentStartY, endY: totalHeight });
            break;
          }

          let breakY = pageEndY;

          for (let i = 0; i < itemBounds.length; i++) {
            const item = itemBounds[i];
            if (item.bottom <= currentStartY) continue;
            if (item.top > currentStartY && item.top < pageEndY && item.bottom > pageEndY) {
              breakY = item.top;
              break;
            }
          }

          if (breakY - currentStartY < CONTENT_HEIGHT_PX * 0.2) {
            breakY = currentStartY + CONTENT_HEIGHT_PX;
          }

          breaks.push({ pageIndex, startY: currentStartY, endY: breakY });
          currentStartY = breakY;
          pageIndex++;

          if (pageIndex > 20) break;
        }

        if (breaks.length === 0) {
          breaks.push({ pageIndex: 0, startY: 0, endY: totalHeight });
        }

        setPageBreaks(breaks);
      });
    });
  }, [previewResume]);

  useEffect(() => {
    if (!measureRef.current || !previewResume) {
      setPageBreaks([{ pageIndex: 0, startY: 0, endY: CONTENT_HEIGHT_PX }]);
      return;
    }

    const timeoutId = setTimeout(calculatePageBreaks, 300);
    window.addEventListener('resize', calculatePageBreaks);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', calculatePageBreaks);
    };
  }, [previewResume, selectedTemplate, calculatePageBreaks]);

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
    <div className="h-full overflow-y-auto" style={{ padding: 0 }}>
      <div className="flex flex-col items-center" style={{ paddingTop: 0, marginTop: 0 }} id="resume-preview-container">
        {/* Hidden measurement container - uses same mm units as page render for identical text rendering */}
        <div
          ref={measureRef}
          id="resume-preview-full-content"
          className="absolute opacity-0 pointer-events-none"
          style={{
            width: `${A4_WIDTH_MM - PAGE_PADDING_MM * 2}mm`,
            left: '-9999px',
            top: 0,
          }}
        >
          <TemplateComponent resume={previewResume} />
        </div>

        {/* Render pages using tracked page breaks */}
        {pageBreaks.map((pb) => {
          const clipHeight = pb.endY - pb.startY;

          return (
            <div
              key={pb.pageIndex}
              className="relative"
              style={{
                width: `${A4_WIDTH_MM * SCALE_FACTOR}mm`,
                height: `${A4_HEIGHT_MM * SCALE_FACTOR}mm`,
                marginBottom: pb.pageIndex < pageBreaks.length - 1 ? '8px' : '0',
              }}
            >
              <div
                className="bg-white shadow-lg absolute top-0 left-0 resume-preview-page"
                data-page-index={pb.pageIndex}
                style={{
                  width: `${A4_WIDTH_MM}mm`,
                  height: `${A4_HEIGHT_MM}mm`,
                  padding: `10mm ${PAGE_PADDING_MM}mm 10mm ${PAGE_PADDING_MM}mm`,
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  transform: `scale(${SCALE_FACTOR})`,
                  transformOrigin: 'top left',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: clipHeight,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      transform: `translateY(-${pb.startY}px)`,
                    }}
                  >
                    <TemplateComponent resume={previewResume} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
