import { NextRequest, NextResponse } from 'next/server';
import type { ResumeData } from '@/lib/types/resume';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Server-side PDF generation using Puppeteer
 * This generates text-based, searchable PDFs instead of image-based PDFs
 */
export async function POST(request: NextRequest) {
  try {
    const resumeData: ResumeData = await request.json();

    // Dynamically import puppeteer only when needed
    let puppeteer: any;
    try {
      puppeteer = await import('puppeteer');
    } catch (error) {
      // If puppeteer is not installed, fall back to client-side generation
      return NextResponse.json(
        { 
          error: 'Server-side PDF generation not available. Please install puppeteer: npm install puppeteer',
          fallback: true 
        },
        { status: 503 }
      );
    }

    // Launch browser
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

      // Create HTML content for the resume
      // We'll render it using the same template components
      const htmlContent = generateResumeHTML(resumeData);

      // Set content and wait for fonts/styles to load
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
      });

      // Generate PDF with text support
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm',
        },
        preferCSSPageSize: false,
      });

      await browser.close();

      // Return PDF as response
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

function generateResumeHTML(resume: ResumeData): string {
  const templateId = resume.templateId || 'hyperion';
  const personalInfo = resume.personalInfo || {};
  const experiences = resume.experiences || [];
  const education = resume.education || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];
  const hobbies = resume.hobbies || [];
  const sectionOrder = resume.sectionOrder || ['summary', 'experiences', 'education', 'skills', 'projects', 'certifications', 'hobbies'];
  const sectionNames = resume.sectionNames || {};

  if (templateId === 'aurora') {
    return generateAuroraHTML(resume);
  }

  const templateStyles = getTemplateStyles(templateId);

  const getSectionHTML = (sectionId: string): string => {
    const displayName = sectionNames[sectionId] || getSectionDefaultName(sectionId);
    
    switch (sectionId) {
      case 'summary':
        return resume.summary ? `
    <div class="section">
      <h2>${escapeHtml(displayName)}</h2>
      <div class="description">${formatText(resume.summary)}</div>
    </div>
    ` : '';

      case 'experiences':
        return experiences.length > 0 ? `
    <div class="section">
      <h2>${escapeHtml(displayName)}</h2>
      ${experiences.map(exp => `
        <div class="experience-item">
          <div class="experience-header" style="page-break-inside: avoid; break-inside: avoid; page-break-after: avoid; break-after: avoid;">
            <div style="flex: 1; min-width: 0;">
              <div class="company">${escapeHtml(exp.position || '')}</div>
              <div class="position">${escapeHtml(exp.company || '')}</div>
            </div>
            <div class="date" style="white-space: nowrap; flex-shrink: 0;">
              ${escapeHtml(exp.startDate || '')} – ${exp.current ? 'Current' : escapeHtml(exp.endDate || '')}
            </div>
          </div>
          ${exp.description && exp.description.length > 0 ? `
            <div class="description">
              ${Array.isArray(exp.description) 
                ? `<ul style="list-style: none; padding-left: 0; margin: 5pt 0;">${exp.description.map(d => `<li style="margin: 3pt 0; padding-left: 12pt; text-indent: -12pt; page-break-inside: avoid; break-inside: avoid;">• ${escapeHtml(d)}</li>`).join('')}</ul>`
                : formatText(exp.description)}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : '';

      case 'education':
        return education.length > 0 ? `
    <div class="section">
      <h2>${escapeHtml(displayName)}</h2>
      ${education.map(edu => `
        <div class="education-item" style="page-break-inside: avoid; break-inside: avoid;">
          <div class="institution" style="font-weight: bold; font-size: 11pt; margin-bottom: 2pt;">
            ${escapeHtml(edu.degree || '')}${edu.field ? ` in ${escapeHtml(edu.field)}` : ''}
          </div>
          ${edu.institution ? `
          <div class="degree" style="font-size: 10pt; color: #444; margin-bottom: 2pt; font-weight: 500;">
            ${escapeHtml(edu.institution)}
          </div>
          ` : ''}
          <div style="display: flex; align-items: center; gap: 8pt; font-size: 10pt; color: #666;">
            <span>${escapeHtml(edu.startDate || '')} – ${escapeHtml(edu.endDate || '')}</span>
            ${edu.gpa ? `<span>• ${escapeHtml(edu.gpa)}</span>` : ''}
          </div>
          ${edu.honors ? `<div class="description" style="font-style: italic; margin-top: 2pt;">${escapeHtml(edu.honors)}</div>` : ''}
        </div>
      `).join('')}
    </div>
    ` : '';

      case 'skills':
        return skills.length > 0 ? `
    <div class="section">
      <h2>${escapeHtml(displayName)}</h2>
      <div class="skills-list">
        ${skills.map(skill => `
          <div style="margin-bottom: 4pt;">
            ${skill.category ? `<span style="font-weight: bold; font-size: 10pt;">${escapeHtml(skill.category)}: </span>` : ''}
            <span style="font-size: 10pt; color: #444;">${skill.items.map(item => escapeHtml(item)).join(', ')}</span>
          </div>
        `).join('')}
      </div>
    </div>
    ` : '';

      case 'projects':
        return projects.length > 0 ? `
    <div class="section">
      <h2>${escapeHtml(displayName)}</h2>
      ${projects.map(proj => `
        <div class="experience-item">
          <h3>${escapeHtml(proj.name || '')}</h3>
          <div class="description">${formatText(proj.description || '')}</div>
          ${proj.technologies && proj.technologies.length > 0 
            ? `<div class="description"><strong>Technologies:</strong> ${proj.technologies.map(t => escapeHtml(t)).join(', ')}</div>`
            : ''}
        </div>
      `).join('')}
    </div>
    ` : '';

      case 'certifications':
        return certifications.length > 0 ? `
    <div class="section">
      <h2>${escapeHtml(displayName)}</h2>
      ${certifications.map(cert => `
        <div style="margin-bottom: 4pt;">
          <span style="font-weight: bold; font-size: 10pt;">${escapeHtml(cert.name || '')}</span>
          ${cert.issuer ? `<span style="font-size: 10pt; color: #444; margin-left: 4pt;">– ${escapeHtml(cert.issuer)}${cert.date ? ` (${escapeHtml(cert.date)})` : ''}</span>` : ''}
        </div>
      `).join('')}
    </div>
    ` : '';

      case 'hobbies':
        return hobbies.length > 0 ? `
    <div class="section">
      <h2>${escapeHtml(displayName)}</h2>
      <div class="description">${hobbies.map(h => escapeHtml(h.name || '')).join(', ')}</div>
    </div>
    ` : '';

      default:
        const customSection = resume.customSections?.find(s => s.id === sectionId);
        if (customSection) {
          const contentHTML = typeof customSection.content === 'string' 
            ? formatText(customSection.content)
            : Array.isArray(customSection.content) && customSection.content.length > 0
              ? typeof customSection.content[0] === 'string'
                ? `<ul style="list-style: none; padding-left: 0; margin: 5pt 0;">${(customSection.content as string[]).map(item => `<li style="margin: 3pt 0; padding-left: 12pt; text-indent: -12pt;">• ${escapeHtml(item)}</li>`).join('')}</ul>`
                : (customSection.content as Array<{ label: string; value: string }>).map(item => `<div style="margin-bottom: 4pt;"><strong>${escapeHtml(item.label)}:</strong> ${escapeHtml(item.value)}</div>`).join('')
              : '';
          
          return `
    <div class="section">
      <h2>${escapeHtml(customSection.name)}</h2>
      <div class="description">${contentHTML}</div>
    </div>
    `;
        }
        return '';
    }
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background: white;
      orphans: 3;
      widows: 3;
    }
    .resume-container {
      max-width: 100%;
      margin: 0 auto;
    }
    h1 {
      font-size: 24pt;
      font-weight: bold;
      margin: 0 0 5pt 0;
      color: #000;
    }
    h2 {
      font-size: 14pt;
      font-weight: bold;
      margin: 15pt 0 8pt 0;
      color: #000;
      border-bottom: 1pt solid #000;
      padding-bottom: 3pt;
      text-transform: uppercase;
    }
    h3 {
      font-size: 12pt;
      font-weight: bold;
      margin: 10pt 0 5pt 0;
      color: #000;
    }
    .header {
      margin-bottom: 15pt;
    }
    .contact-info {
      font-size: 10pt;
      color: #666;
      margin-top: 5pt;
    }
    .section {
      margin-bottom: 15pt;
    }
    .experience-item, .education-item {
      margin-bottom: 12pt;
    }
    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16pt;
      margin-bottom: 5pt;
    }
    .company, .institution {
      font-weight: bold;
      font-size: 11pt;
    }
    .position, .degree {
      font-size: 11pt;
      color: #555;
    }
    .date {
      font-size: 10pt;
      color: #666;
    }
    .description {
      font-size: 10pt;
      margin-top: 5pt;
      color: #444;
    }
    .description ul {
      margin: 5pt 0;
      padding-left: 20pt;
    }
    .description li {
      margin: 3pt 0;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .experience-header {
      page-break-inside: avoid;
      break-inside: avoid;
      page-break-after: avoid;
      break-after: avoid;
    }
    .education-item {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .section {
      page-break-inside: auto;
      break-inside: auto;
    }
    section {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .skills-list {
      font-size: 10pt;
    }
    .skill-category {
      font-weight: bold;
      margin-top: 5pt;
    }
    .skill-items {
      margin-left: 10pt;
    }
    ${templateStyles}
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="resume-container">
    <!-- Header -->
    <div class="header">
      <div style="display: flex; justify-content: space-between; align-items: start; border-bottom: 2pt solid #000; padding-bottom: 8pt; margin-bottom: 15pt;">
        <div>
          <h1>${escapeHtml(personalInfo.fullName || 'Your Name')}</h1>
          <p style="font-size: 10pt; text-transform: uppercase; color: #666; margin-top: 3pt;">
            ${escapeHtml(experiences[0]?.position || 'Your Title')}
          </p>
        </div>
        <div style="text-align: right; font-size: 10pt; color: #666;">
          ${personalInfo.phone ? `<div>${escapeHtml(personalInfo.phone)}</div>` : ''}
          ${personalInfo.email ? `<div>${escapeHtml(personalInfo.email)}</div>` : ''}
          ${personalInfo.location ? `<div>${escapeHtml(personalInfo.location)}</div>` : ''}
        </div>
      </div>
    </div>

    ${sectionOrder.map(sectionId => getSectionHTML(sectionId)).join('')}
  </div>
</body>
</html>
  `;
}

function getSectionDefaultName(sectionId: string): string {
  const defaultNames: Record<string, string> = {
    summary: 'Summary',
    experiences: 'Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    certifications: 'Certifications',
    hobbies: 'Hobbies',
  };
  return defaultNames[sectionId] || sectionId;
}

function escapeHtml(text: string): string {
  if (!text) return '';
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function formatText(text: string): string {
  if (!text) return '';
  // Convert newlines to <br> and preserve basic formatting
  return escapeHtml(text)
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

function generateAuroraHTML(resume: ResumeData): string {
  const personalInfo = resume.personalInfo || {};
  const experiences = resume.experiences || [];
  const education = resume.education || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];
  const hobbies = resume.hobbies || [];
  
  const headerColor = resume.templateColor || '#1F2937';
  const sidebarColor = resume.templateColor || '#F3F4F6';
  
  // Calculate text colors
  const headerTextColor = getTextColorForBackground(headerColor);
  const sidebarTextColor = getTextColorForBackground(sidebarColor);
  
  const headerBg = headerColor === 'transparent' ? '#1F2937' : headerColor;
  const sidebarBg = sidebarColor === 'transparent' ? '#F3F4F6' : sidebarColor;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background: white;
      orphans: 3;
      widows: 3;
    }
    .aurora-header {
      padding: 24pt;
      background-color: ${headerBg};
      color: ${headerTextColor};
    }
    .aurora-header h1 {
      font-size: 22.5pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0 0 4pt 0;
    }
    .aurora-header p {
      font-size: 14pt;
      text-transform: uppercase;
      letter-spacing: 0.5pt;
      margin: 0;
    }
    .aurora-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 0;
    }
    .aurora-left {
      padding: 24pt;
      background: white;
    }
    .aurora-right {
      padding: 24pt;
      background-color: ${sidebarBg};
      color: ${sidebarTextColor};
    }
    h2 {
      font-size: 13.5pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0 0 12pt 0;
      color: #000;
    }
    .aurora-right h2 {
      color: ${sidebarTextColor};
    }
    h3 {
      font-size: 12pt;
      font-weight: bold;
      margin: 6pt 0 4pt 0;
      color: #000;
    }
    .section {
      margin-bottom: 18pt;
    }
    .experience-item {
      margin-bottom: 12pt;
    }
    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 3pt;
    }
    .experience-position {
      font-weight: bold;
      font-size: 12pt;
      text-transform: uppercase;
      color: #000;
    }
    .experience-company {
      font-size: 9pt;
      color: #666;
      font-weight: 500;
    }
    .experience-date {
      font-size: 9pt;
      color: #666;
      white-space: nowrap;
    }
    .experience-description {
      font-size: 9pt;
      color: #444;
      margin-top: 6pt;
      line-height: 1.5;
    }
    .experience-description ul {
      list-style: none;
      padding-left: 0;
      margin: 4pt 0;
    }
    .experience-description li {
      margin: 2pt 0;
      padding-left: 12pt;
      text-indent: -12pt;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .experience-header {
      page-break-inside: avoid;
      break-inside: avoid;
      page-break-after: avoid;
      break-after: avoid;
    }
    .education-item {
      margin-bottom: 9pt;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .section {
      page-break-inside: auto;
      break-inside: auto;
    }
    .education-dates {
      font-weight: 600;
      font-size: 9pt;
      color: #000;
      margin-bottom: 2pt;
    }
    .education-degree {
      font-size: 14pt;
      color: #666;
    }
    .contact-info {
      font-size: 9pt;
      margin-bottom: 6pt;
    }
    .skills-item {
      margin-bottom: 6pt;
    }
    .skill-category {
      font-weight: 600;
      font-size: 9pt;
      margin-bottom: 2pt;
    }
    .skill-items {
      font-size: 9pt;
    }
    .cert-item {
      font-size: 9pt;
      margin-bottom: 4pt;
    }
    .cert-name {
      font-weight: 600;
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
  <!-- Header -->
  <div class="aurora-header">
    <h1>${escapeHtml(personalInfo.fullName || 'Your Name')}</h1>
    <p>${escapeHtml(experiences[0]?.position || 'Your Title')}</p>
  </div>

  <!-- Main Content Grid -->
  <div class="aurora-grid">
    <!-- Left Column -->
    <div class="aurora-left">
      ${resume.summary ? `
      <div class="section">
        <h2>Summary</h2>
        <div style="font-size: 9pt; color: #444; line-height: 1.6;">
          ${formatText(resume.summary)}
        </div>
      </div>
      ` : ''}

      ${experiences.length > 0 ? `
      <div class="section">
        <h2>Experience</h2>
        ${experiences.map(exp => `
          <div class="experience-item">
            <div class="experience-header" style="page-break-inside: avoid; break-inside: avoid; page-break-after: avoid; break-after: avoid;">
              <div>
                <div class="experience-position">${escapeHtml(exp.position || '')}</div>
                <div class="experience-company">${escapeHtml(exp.company || '')}</div>
              </div>
              <div class="experience-date">
                ${escapeHtml(exp.startDate || '')} – ${exp.current ? 'Current' : escapeHtml(exp.endDate || '')}
              </div>
            </div>
            ${exp.description && exp.description.length > 0 ? `
              <div class="experience-description">
                ${Array.isArray(exp.description) 
                  ? `<ul>${exp.description.map(d => `<li style="page-break-inside: avoid; break-inside: avoid;">• ${escapeHtml(d)}</li>`).join('')}</ul>`
                  : formatText(exp.description)}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${education.length > 0 ? `
      <div class="section">
        <h2>Education</h2>
        ${education.map(edu => `
          <div class="education-item" style="page-break-inside: avoid; break-inside: avoid;">
            <div class="education-dates">
              ${escapeHtml(edu.startDate || '')} – ${escapeHtml(edu.endDate || '')}
              ${edu.gpa ? ` • ${escapeHtml(edu.gpa)}` : ''}
              ${edu.institution ? `: ${escapeHtml(edu.institution)}` : ''}
            </div>
            <div class="education-degree">
              ${edu.degree 
                ? (edu.field ? `${escapeHtml(edu.degree)} - ${escapeHtml(edu.field)}` : escapeHtml(edu.degree))
                : (edu.field ? escapeHtml(edu.field) : 'Education')
              }
            </div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${projects.length > 0 ? `
      <div class="section">
        <h2>Projects</h2>
        ${projects.map(proj => `
          <div class="experience-item">
            <h3>${escapeHtml(proj.name || '')}</h3>
            <div class="experience-description">${formatText(proj.description || '')}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${certifications.length > 0 ? `
      <div class="section">
        <h2>Certifications</h2>
        ${certifications.map(cert => `
          <div class="cert-item">
            <span class="cert-name">${escapeHtml(cert.name || '')}</span>
            ${cert.issuer ? ` – ${escapeHtml(cert.issuer)}` : ''}
            ${cert.date ? ` (${escapeHtml(cert.date)})` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${hobbies.length > 0 ? `
      <div class="section">
        <h2>Hobbies</h2>
        <div style="font-size: 9pt; color: #444;">
          ${hobbies.map(h => escapeHtml(h.name || '')).join(', ')}
        </div>
      </div>
      ` : ''}
    </div>

    <!-- Right Column -->
    <div class="aurora-right">
      <div class="section">
        <h2>Contact</h2>
        <div class="contact-info">
          ${personalInfo.email ? `<div>${escapeHtml(personalInfo.email)}</div>` : ''}
          ${personalInfo.phone ? `<div>${escapeHtml(personalInfo.phone)}</div>` : ''}
          ${personalInfo.location ? `<div>${escapeHtml(personalInfo.location)}</div>` : ''}
        </div>
      </div>

      ${skills.length > 0 ? `
      <div class="section">
        <h2>Skills</h2>
        ${skills.map(skill => `
          <div class="skills-item">
            ${skill.category ? `<div class="skill-category">${escapeHtml(skill.category)}</div>` : ''}
            <div class="skill-items">${skill.items.map(item => escapeHtml(item)).join(', ')}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}
    </div>
  </div>
</body>
</html>
  `;
}

function getTextColorForBackground(hexColor: string | undefined): string {
  if (!hexColor || hexColor === 'transparent') {
    return '#000000';
  }
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

function getTemplateStyles(templateId: string): string {
  // Return template-specific CSS based on templateId
  // This ensures the PDF matches the template styling
  switch (templateId) {
    case 'hyperion':
      return `
        .header h1 {
          font-size: 24pt;
          font-weight: bold;
          margin: 0;
        }
        h2 {
          font-size: 14pt;
          font-weight: bold;
          text-transform: uppercase;
          border-bottom: 1pt solid #000;
          padding-bottom: 3pt;
          margin: 15pt 0 8pt 0;
        }
        .experience-item {
          border-left: 4pt solid #000;
          padding-left: 8pt;
          padding-bottom: 4pt;
          margin-bottom: 12pt;
        }
        .experience-header > div:first-child {
          flex: 1;
          min-width: 0;
        }
        .experience-header .date {
          white-space: nowrap;
          flex-shrink: 0;
        }
      `;
    default:
      return '';
  }
}

function getFilename(resume: ResumeData): string {
  const name = resume.personalInfo?.fullName || 'resume';
  const sanitizedName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  return `${sanitizedName}_resume.pdf`;
}

