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

async function getBrowser() {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    // Production on Vercel: use @sparticuz/chromium with puppeteer-core
    const chromium = (await import('@sparticuz/chromium')).default;
    const puppeteerCore = await import('puppeteer-core');

    return await puppeteerCore.default.launch({
      args: chromium.args,
      defaultViewport: { width: 794, height: 1123 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  } else {
    // Local development: try full puppeteer first, fall back to puppeteer-core
    try {
      const puppeteer = await import('puppeteer');
      return await puppeteer.default.launch({
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
    } catch {
      // If full puppeteer not installed, try puppeteer-core with system Chrome
      const puppeteerCore = await import('puppeteer-core');
      const possiblePaths = [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      ];
      
      let executablePath: string | undefined;
      const fs = await import('fs');
      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          executablePath = p;
          break;
        }
      }

      if (!executablePath) {
        throw new Error('No Chrome/Chromium found locally');
      }

      return await puppeteerCore.default.launch({
        headless: true,
        executablePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const resumeData: ResumeData = await request.json();

    let browser;
    try {
      browser = await getBrowser();
    } catch (error: any) {
      console.error('Browser launch failed:', error.message);
      return NextResponse.json(
        {
          error: 'Server-side PDF generation not available',
          fallback: true,
        },
        { status: 503 }
      );
    }

    try {
      const page = await browser.newPage();

      await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

      const htmlContent = renderTemplateToHTML(resumeData);

      await page.setContent(htmlContent, {
        waitUntil: 'domcontentloaded',
      });

      // Wait for fonts to fully load and Tailwind to compile
      await page.evaluate(() => document.fonts.ready);
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Apply same page break logic as the preview
      await page.evaluate(() => {
        const container = document.getElementById('resume-content');
        if (!container) return;

        const MM_TO_PX = 3.779527559;
        const CONTENT_HEIGHT_PX = (297 - 26) * MM_TO_PX;

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
          top: '10mm',
          right: '20mm',
          bottom: '10mm',
          left: '20mm',
        },
        preferCSSPageSize: false,
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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
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
      margin: 0;
    }

    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
      box-sizing: border-box;
    }

    html, body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: white;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      font-size: 16px;
      line-height: 1.5;
      letter-spacing: normal;
      word-spacing: normal;
    }

    #resume-content {
      width: 100%;
      max-width: 170mm;
      margin: 0 auto;
      padding: 0;
      box-sizing: border-box;
      overflow-wrap: break-word;
      word-wrap: break-word;
    }

    h1, h2, h3, h4, h5, h6, p, li, span, div, a {
      letter-spacing: normal;
      word-spacing: normal;
    }

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

    .grid {
      display: grid;
    }
    .grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .col-span-2 {
      grid-column: span 2 / span 2;
    }
    .gap-0 {
      gap: 0px;
    }

    .flex {
      display: flex;
    }
    .flex-wrap {
      flex-wrap: wrap;
    }
    .justify-between {
      justify-content: space-between;
    }
    .items-start {
      align-items: flex-start;
    }
    .items-center {
      align-items: center;
    }

    .space-y-2 > * + * {
      margin-top: 0.5rem;
    }
    .space-y-3 > * + * {
      margin-top: 0.75rem;
    }
    .space-y-4 > * + * {
      margin-top: 1rem;
    }
    .space-y-6 > * + * {
      margin-top: 1.5rem;
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
  <script>
    document.querySelectorAll('*').forEach(el => {
      getComputedStyle(el).getPropertyValue('display');
    });
  </script>
</body>
</html>`;
}

function getFilename(resume: ResumeData): string {
  const name = resume.personalInfo?.fullName || 'resume';
  const sanitizedName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  return `${sanitizedName}_resume.pdf`;
}
