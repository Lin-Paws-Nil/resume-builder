import { NextRequest, NextResponse } from 'next/server';
import type { ResumeData } from '@/lib/types/resume';
import React from 'react';

import { AuroraTemplate } from '@/components/templates/AuroraTemplate';
import { HyperionTemplate } from '@/components/templates/HyperionTemplate';
import { LunarTemplate } from '@/components/templates/LunarTemplate';
import { StellarTemplate } from '@/components/templates/StellarTemplate';
import { ZenithTemplate } from '@/components/templates/ZenithTemplate';
import { AetherTemplate } from '@/components/templates/AetherTemplate';
import { NebulaTemplate } from '@/components/templates/NebulaTemplate';
import { EonTemplate } from '@/components/templates/EonTemplate';
import { CosmosTemplate } from '@/components/templates/CosmosTemplate';
import { ModernTemplate } from '@/components/templates/ModernTemplate';
import { ClassicTemplate } from '@/components/templates/ClassicTemplate';
import { CreativeTemplate } from '@/components/templates/CreativeTemplate';

export const runtime = 'nodejs';
export const maxDuration = 60;

const templateComponents: Record<string, React.ComponentType<{ resume: ResumeData }>> = {
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

export async function POST(request: NextRequest) {
  try {
    const resumeData: ResumeData = await request.json();

    let puppeteer: any;
    try {
      puppeteer = await import('puppeteer');
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Server-side PDF generation not available. Please install puppeteer: npm install puppeteer',
          fallback: true,
        },
        { status: 503 }
      );
    }

    const browser = await puppeteer.default.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
      ],
    });

    try {
      const page = await browser.newPage();

      await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });

      const htmlContent = renderTemplateToHTML(resumeData);

      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Apply same page break logic as the preview
      await page.evaluate(() => {
        const container = document.getElementById('resume-content');
        if (!container) return;

        const MM_TO_PX = 3.779527559;
        const CONTENT_HEIGHT_PX = (297 - 26) * MM_TO_PX; // Must match preview

        const totalHeight = container.scrollHeight;
        if (totalHeight <= CONTENT_HEIGHT_PX) return;

        const lineSelectors = [
          'li', 'p', 'h2', 'h3',
          '.whitespace-pre-line > div',
          '.rich-text-content > p',
          '.rich-text-content > ul > li',
          '.rich-text-content > ol > li',
          '.list-disc > li',
        ].join(', ');

        const items = container.querySelectorAll(lineSelectors);
        const containerRect = container.getBoundingClientRect();

        const itemBounds: any[] = [];
        items.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.height > 0 && rect.height < CONTENT_HEIGHT_PX * 0.5) {
            itemBounds.push({ top: rect.top - containerRect.top, bottom: rect.bottom - containerRect.top, el });
          }
        });

        const compactItems = container.querySelectorAll('.space-y-3 > div, .space-y-2 > div');
        compactItems.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.height > 0 && rect.height < 80) {
            itemBounds.push({ top: rect.top - containerRect.top, bottom: rect.bottom - containerRect.top, el });
          }
        });

        itemBounds.sort((a: any, b: any) => a.top - b.top);

        let currentStartY = 0;
        let iterations = 0;

        while (currentStartY < totalHeight && iterations < 20) {
          const pageEndY = currentStartY + CONTENT_HEIGHT_PX;
          if (pageEndY >= totalHeight) break;

          let breakY = pageEndY;
          let breakElement = null;

          for (let i = 0; i < itemBounds.length; i++) {
            const item = itemBounds[i];
            if (item.bottom <= currentStartY) continue;
            if (item.top > currentStartY && item.top < pageEndY && item.bottom > pageEndY) {
              breakY = item.top;
              breakElement = item.el;
              break;
            }
          }

          if (breakY - currentStartY < CONTENT_HEIGHT_PX * 0.2) {
            currentStartY = currentStartY + CONTENT_HEIGHT_PX;
            iterations++;
            continue;
          }

          if (breakElement) {
            const marker = document.createElement('div');
            marker.style.cssText = 'height:0;margin:0;padding:0;page-break-before:always;break-before:page;';
            breakElement.parentNode?.insertBefore(marker, breakElement);
          }

          currentStartY = breakY;
          iterations++;
        }
      });

      await page.emulateMediaType('print');

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
        },
        preferCSSPageSize: true,
        displayHeaderFooter: false,
      });

      await browser.close();

      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${getFilename(resumeData)}"`,
        },
      });
    } catch (error: any) {
      await browser.close();
      throw error;
    }
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

function renderTemplateToHTML(resume: ResumeData): string {
  const templateId = resume.templateId || 'hyperion';
  const TemplateComponent = templateComponents[templateId] || templateComponents['hyperion'];

  const ReactDOMServer = require('react-dom/server');
  const templateMarkup = ReactDOMServer.renderToStaticMarkup(
    React.createElement(TemplateComponent, { resume })
  );

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
            serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
          },
        },
      },
    }
  </script>
  <style>
    @page {
      size: A4;
      margin: 10mm 20mm 10mm 20mm;
    }

    html, body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: white;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    #resume-content {
      width: 170mm;
      margin: 0 auto;
      padding: 0;
    }

    /* Rich text content styling */
    .rich-text-content {
      line-height: 1.6;
    }

    .rich-text-content p {
      margin: 0.5em 0;
    }

    .rich-text-content ul,
    .rich-text-content ol {
      margin: 0.5em 0;
      padding-left: 1.5em;
    }

    .rich-text-content li {
      margin: 0.25em 0;
    }

    .rich-text-content strong,
    .rich-text-content b {
      font-weight: bold;
    }

    .rich-text-content em,
    .rich-text-content i {
      font-style: italic;
    }

    .rich-text-content u {
      text-decoration: underline;
    }

    .rich-text-content hr {
      border: none;
      border-top: 1px solid #ccc;
      margin: 1em 0;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div id="resume-content">
    ${templateMarkup}
  </div>
</body>
</html>`;
}

function getFilename(resume: ResumeData): string {
  const name = resume.personalInfo?.fullName || 'resume';
  const sanitizedName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  return `${sanitizedName}_resume.pdf`;
}
