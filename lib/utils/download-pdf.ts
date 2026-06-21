import type { ResumeData } from '@/lib/types/resume';

/**
 * Downloads resume as a text-based, searchable PDF
 * Uses server-side generation with Puppeteer for best results
 * Falls back to client-side image-based PDF if server-side is unavailable
 */
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
        return; // Success - text-based PDF downloaded
      } else {
        const errorData = await response.json();
        if (errorData.fallback) {
          console.warn('Server-side PDF generation not available, falling back to client-side');
          // Fall through to client-side generation
        } else {
          throw new Error(errorData.error || 'Failed to generate PDF on server');
        }
      }
    } catch (serverError: any) {
      console.warn('Server-side PDF generation failed, using client-side fallback:', serverError);
      // Fall through to client-side generation
    }

    // Fallback: Client-side image-based PDF generation
    // This is less ideal but works when server-side is unavailable
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');
    
    const A4_WIDTH_MM = 210;
    const A4_HEIGHT_MM = 297;

    const container = document.getElementById('resume-preview-container');
    if (!container) {
      throw new Error('Resume preview container not found');
    }

    const pageElements = container.querySelectorAll('.resume-preview-page');
    
    if (pageElements.length === 0) {
      throw new Error('No resume pages found');
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    for (let pageIndex = 0; pageIndex < pageElements.length; pageIndex++) {
      const pageElement = pageElements[pageIndex] as HTMLElement;
      
      if (pageIndex > 0) {
        pdf.addPage();
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      // Temporarily remove CSS transform scaling to avoid html2canvas distortion
      const originalTransform = pageElement.style.transform;
      const originalTransformOrigin = pageElement.style.transformOrigin;
      const originalWidth = pageElement.style.width;
      const originalHeight = pageElement.style.height;
      pageElement.style.transform = 'none';
      pageElement.style.transformOrigin = 'top left';

      await new Promise(resolve => setTimeout(resolve, 50));

      const canvas = await html2canvas(pageElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
        width: pageElement.scrollWidth,
        height: pageElement.scrollHeight,
        windowWidth: pageElement.scrollWidth,
        windowHeight: pageElement.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });

      // Restore original transforms
      pageElement.style.transform = originalTransform;
      pageElement.style.transformOrigin = originalTransformOrigin;
      pageElement.style.width = originalWidth;
      pageElement.style.height = originalHeight;

      const imgData = canvas.toDataURL('image/png', 1.0);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const canvasScale = 2;
      const actualWidthMM = (imgWidth / canvasScale) * (25.4 / 96);
      const actualHeightMM = (imgHeight / canvasScale) * (25.4 / 96);
      const widthScale = A4_WIDTH_MM / actualWidthMM;
      const scaledHeightMM = actualHeightMM * widthScale;
      const finalHeight = pageIndex === pageElements.length - 1 
        ? Math.min(scaledHeightMM, A4_HEIGHT_MM)
        : A4_HEIGHT_MM;
      
      pdf.addImage(imgData, 'PNG', 0, 0, A4_WIDTH_MM, finalHeight, undefined, 'FAST');
    }
    
    pdf.save(filename);
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    throw new Error(error.message || 'Failed to generate PDF. Please try again.');
  }
}
