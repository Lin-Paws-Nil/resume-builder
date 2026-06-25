import type { ResumeData } from '@/lib/types/resume';

export async function downloadResumeAsPDF(
  resumeData: ResumeData,
  filename: string = 'resume.pdf'
) {
  if (typeof window === 'undefined') {
    throw new Error('PDF download is only available in the browser');
  }

  try {
    // Try server-side generation first (text-based PDF)
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('[PDF] Server-side generation failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData.error || 'Unknown error',
          fallback: errorData.fallback || false,
        });
        if (!errorData.fallback) {
          throw new Error(errorData.error || 'Failed to generate PDF on server');
        }
      }
    } catch (serverError: any) {
      if (serverError.message && !serverError.message.includes('Failed to generate PDF')) {
        console.error('[PDF] Server request failed:', serverError.message);
      }
    }

    console.log('[PDF] Using client-side fallback generation');

    // Fallback: capture the flat measurement container and slice into pages
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    const A4_WIDTH_MM = 210;
    const A4_HEIGHT_MM = 297;
    const PAGE_PADDING_MM = 20;
    const MM_TO_PX = 3.779527559;
    const CONTENT_HEIGHT_PX = (A4_HEIGHT_MM - 26) * MM_TO_PX; // ~1024px per page content area

    // Use the hidden flat measurement container (no transforms, no clipping)
    const measureContainer = document.getElementById('resume-preview-full-content');

    if (!measureContainer) {
      throw new Error('Resume content container not found');
    }

    // Temporarily make the measurement container visible for html2canvas
    const originalStyle = measureContainer.style.cssText;
    measureContainer.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      width: ${A4_WIDTH_MM - PAGE_PADDING_MM * 2}mm;
      opacity: 1;
      pointer-events: none;
      z-index: -1;
    `;

    await new Promise(resolve => setTimeout(resolve, 200));

    // Capture the FULL template as one tall canvas
    const fullCanvas = await html2canvas(measureContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
      width: measureContainer.scrollWidth,
      height: measureContainer.scrollHeight,
      windowWidth: measureContainer.scrollWidth,
      windowHeight: measureContainer.scrollHeight,
      scrollX: 0,
      scrollY: 0,
    });

    // Restore the measurement container
    measureContainer.style.cssText = originalStyle;

    const totalHeightPx = fullCanvas.height;
    const contentWidthPx = fullCanvas.width;
    const scaleFactor = 2; // matches html2canvas scale

    // Calculate page height in canvas pixels
    const pageHeightCanvasPx = CONTENT_HEIGHT_PX * scaleFactor;

    // Calculate number of pages
    const numPages = Math.ceil(totalHeightPx / pageHeightCanvasPx);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // Content area dimensions in mm (inside margins)
    const contentWidthMM = A4_WIDTH_MM - PAGE_PADDING_MM * 2; // 170mm
    const contentHeightMM = A4_HEIGHT_MM - 20; // 277mm (10mm top + 10mm bottom)

    for (let pageIndex = 0; pageIndex < numPages; pageIndex++) {
      if (pageIndex > 0) {
        pdf.addPage();
      }

      // Calculate source rectangle from the full canvas
      const sourceY = pageIndex * pageHeightCanvasPx;
      const sourceHeight = Math.min(pageHeightCanvasPx, totalHeightPx - sourceY);

      // Create a page-sized canvas and draw the slice
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = contentWidthPx;
      pageCanvas.height = Math.round(sourceHeight);

      const ctx = pageCanvas.getContext('2d');
      if (!ctx) continue;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(
        fullCanvas,
        0, sourceY, contentWidthPx, sourceHeight,
        0, 0, contentWidthPx, sourceHeight,
      );

      const imgData = pageCanvas.toDataURL('image/png', 1.0);

      // Scale the slice to fit within the content area
      const sliceAspectRatio = sourceHeight / contentWidthPx;
      const imgHeightMM = contentWidthMM * sliceAspectRatio;
      const finalHeightMM = Math.min(imgHeightMM, contentHeightMM);

      // Place image within margins (10mm top, 20mm left)
      pdf.addImage(imgData, 'PNG', PAGE_PADDING_MM, 10, contentWidthMM, finalHeightMM, undefined, 'FAST');
    }

    pdf.save(filename);
  } catch (error: any) {
    console.error('[PDF] Error generating PDF:', error);
    throw new Error(error.message || 'Failed to generate PDF. Please try again.');
  }
}
