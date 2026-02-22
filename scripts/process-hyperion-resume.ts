/**
 * Script to process and fix the hyperion-resume.pdf file
 * 
 * Usage:
 *   npm exec tsx scripts/process-hyperion-resume.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import pdfParse from 'pdf-parse';

// Load environment variables manually
if (fs.existsSync(path.join(process.cwd(), '.env.local'))) {
  const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

// Import after env is loaded
const { extractResumeContent } = require('../lib/services/resume-parser');
import type { ResumeData } from '../lib/types/resume';

const PDF_PATH = path.join(process.cwd(), 'resume-examples', 'hyperion-resume.pdf');

interface Issue {
  section: string;
  problem: string;
  fix: string;
  severity: 'error' | 'warning' | 'info';
}

async function processPDF(): Promise<string> {
  console.log('📄 Reading PDF file:', PDF_PATH);
  
  if (!fs.existsSync(PDF_PATH)) {
    throw new Error(`PDF file not found: ${PDF_PATH}`);
  }

  const pdfBuffer = fs.readFileSync(PDF_PATH);
  const data = await pdfParse(pdfBuffer);
  
  if (!data || !data.text) {
    throw new Error('Failed to extract text from PDF');
  }

  console.log(`✅ Extracted ${data.text.length} characters from PDF`);
  return data.text;
}

function validateAndFixResumeData(parsed: any): { data: Partial<ResumeData>; issues: Issue[] } {
  const issues: Issue[] = [];
  const fixed: any = {};

  // Check personal info
  if (!parsed.personalInfo) {
    issues.push({
      section: 'personalInfo',
      problem: 'Missing personalInfo section',
      fix: 'Added empty personalInfo structure',
      severity: 'error',
    });
    fixed.personalInfo = {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: '',
    };
  } else {
    fixed.personalInfo = {
      fullName: parsed.personalInfo.fullName || '',
      email: parsed.personalInfo.email || '',
      phone: parsed.personalInfo.phone || '',
      location: parsed.personalInfo.location || '',
      linkedin: parsed.personalInfo.linkedin || '',
      github: parsed.personalInfo.github || '',
      website: parsed.personalInfo.website || '',
    };

    // Validate required fields
    if (!fixed.personalInfo.fullName) {
      issues.push({
        section: 'personalInfo',
        problem: 'Missing fullName',
        fix: 'Set to empty string (needs manual input)',
        severity: 'error',
      });
    }
    if (!fixed.personalInfo.email) {
      issues.push({
        section: 'personalInfo',
        problem: 'Missing email',
        fix: 'Set to empty string (needs manual input)',
        severity: 'warning',
      });
    }
  }

  // Check summary
  fixed.summary = parsed.summary || '';
  if (!fixed.summary) {
    issues.push({
      section: 'summary',
      problem: 'Missing summary',
      fix: 'Set to empty string',
      severity: 'warning',
    });
  }

  // Check experiences
  if (!Array.isArray(parsed.experiences)) {
    issues.push({
      section: 'experiences',
      problem: 'Experiences is not an array',
      fix: 'Set to empty array',
      severity: 'error',
    });
    fixed.experiences = [];
  } else {
    fixed.experiences = parsed.experiences.map((exp: any, index: number) => {
      const expIssues: Issue[] = [];
      
      // Ensure required fields
      const fixedExp: any = {
        id: exp.id || `exp-${index}`,
        company: exp.company || '',
        position: exp.position || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        current: exp.current || false,
        description: [],
      };

      // Fix description - should be array
      if (Array.isArray(exp.description)) {
        fixedExp.description = exp.description;
      } else if (typeof exp.description === 'string') {
        // Convert string to array by splitting on newlines or bullets
        const desc = exp.description
          .split(/\n+/)
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0)
          .map((line: string) => {
            // Remove bullet points if present
            return line.replace(/^[•\-\*]\s*/, '');
          });
        fixedExp.description = desc;
      } else {
        fixedExp.description = [];
        expIssues.push({
          section: `experiences[${index}].description`,
          problem: 'Description is missing or invalid',
          fix: 'Set to empty array',
          severity: 'warning',
        });
      }

      // Validate required fields
      if (!fixedExp.company) {
        expIssues.push({
          section: `experiences[${index}].company`,
          problem: 'Missing company name',
          fix: 'Set to empty string (needs manual input)',
          severity: 'error',
        });
      }
      if (!fixedExp.position) {
        expIssues.push({
          section: `experiences[${index}].position`,
          problem: 'Missing position',
          fix: 'Set to empty string (needs manual input)',
          severity: 'error',
        });
      }

      issues.push(...expIssues);
      return fixedExp;
    });
  }

  // Check education
  if (!Array.isArray(parsed.education)) {
    issues.push({
      section: 'education',
      problem: 'Education is not an array',
      fix: 'Set to empty array',
      severity: 'error',
    });
    fixed.education = [];
  } else {
    fixed.education = parsed.education.map((edu: any, index: number) => {
      const eduIssues: Issue[] = [];
      
      const fixedEdu: any = {
        id: edu.id || `edu-${index}`,
        institution: edu.institution || '',
        degree: edu.degree || '',
        field: edu.field || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        gpa: edu.gpa || '',
        honors: edu.honors || '',
      };

      if (!fixedEdu.institution) {
        eduIssues.push({
          section: `education[${index}].institution`,
          problem: 'Missing institution',
          fix: 'Set to empty string (needs manual input)',
          severity: 'error',
        });
      }
      if (!fixedEdu.degree) {
        eduIssues.push({
          section: `education[${index}].degree`,
          problem: 'Missing degree',
          fix: 'Set to empty string (needs manual input)',
          severity: 'error',
        });
      }

      issues.push(...eduIssues);
      return fixedEdu;
    });
  }

  // Check skills
  if (!Array.isArray(parsed.skills)) {
    issues.push({
      section: 'skills',
      problem: 'Skills is not an array',
      fix: 'Set to empty array',
      severity: 'error',
    });
    fixed.skills = [];
  } else {
    fixed.skills = parsed.skills.map((skill: any, index: number) => {
      const fixedSkill: any = {
        id: skill.id || `skill-${index}`,
        category: skill.category || 'General',
        items: Array.isArray(skill.items) ? skill.items.filter(Boolean) : [],
      };

      if (fixedSkill.items.length === 0) {
        issues.push({
          section: `skills[${index}]`,
          problem: 'Skill category has no items',
          fix: 'Set to empty array',
          severity: 'warning',
        });
      }

      return fixedSkill;
    });
  }

  // Check projects
  if (!Array.isArray(parsed.projects)) {
    fixed.projects = [];
  } else {
    fixed.projects = parsed.projects.map((proj: any, index: number) => ({
      id: proj.id || `proj-${index}`,
      name: proj.name || '',
      description: proj.description || '',
      technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
      link: proj.link || '',
      github: proj.github || '',
    }));
  }

  // Check certifications
  if (!Array.isArray(parsed.certifications)) {
    fixed.certifications = [];
  } else {
    fixed.certifications = parsed.certifications.map((cert: any, index: number) => ({
      id: cert.id || `cert-${index}`,
      name: cert.name || '',
      issuer: cert.issuer || '',
      date: cert.date || '',
      expiryDate: cert.expiryDate || '',
    }));
  }

  // Check hobbies
  if (!Array.isArray(parsed.hobbies)) {
    fixed.hobbies = [];
  } else {
    fixed.hobbies = parsed.hobbies.map((hobby: any, index: number) => ({
      id: hobby.id || `hobby-${index}`,
      name: hobby.name || '',
      description: hobby.description || '',
    }));
  }

  // Add required fields for ResumeData
  fixed.id = parsed.id || 'hyperion-resume';
  fixed.title = parsed.title || 'Hyperion Resume';
  fixed.customSections = parsed.customSections || [];
  fixed.sectionOrder = parsed.sectionOrder || [
    'personalInfo',
    'summary',
    'experiences',
    'education',
    'skills',
    'projects',
    'certifications',
    'hobbies',
  ];
  fixed.sectionNames = parsed.sectionNames || {};
  fixed.templateId = parsed.templateId || 'hyperion';
  fixed.templateColor = parsed.templateColor;
  fixed.createdAt = parsed.createdAt || new Date().toISOString();
  fixed.updatedAt = new Date().toISOString();

  return { data: fixed, issues };
}

async function main() {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 Processing Hyperion Resume PDF');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Step 1: Extract text from PDF
    const pdfText = await processPDF();
    console.log('\n📝 First 500 characters of extracted text:');
    console.log(pdfText.substring(0, 500));
    console.log('...\n');

    // Step 2: Parse resume content using OpenAI
    console.log('🤖 Parsing resume content with OpenAI...');
    const parsedData = await extractResumeContent(pdfText);
    console.log('✅ Resume parsed successfully\n');

    // Step 3: Validate and fix issues
    console.log('🔧 Validating and fixing data structure...');
    const { data: fixedData, issues } = validateAndFixResumeData(parsedData);

    // Step 4: Report issues
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Issues Found:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (issues.length === 0) {
      console.log('✅ No issues found! Resume data is valid.\n');
    } else {
      const errors = issues.filter(i => i.severity === 'error');
      const warnings = issues.filter(i => i.severity === 'warning');
      const infos = issues.filter(i => i.severity === 'info');

      if (errors.length > 0) {
        console.log(`❌ Errors (${errors.length}):`);
        errors.forEach(issue => {
          console.log(`   [${issue.section}] ${issue.problem}`);
          console.log(`      Fix: ${issue.fix}`);
        });
        console.log('');
      }

      if (warnings.length > 0) {
        console.log(`⚠️  Warnings (${warnings.length}):`);
        warnings.forEach(issue => {
          console.log(`   [${issue.section}] ${issue.problem}`);
          console.log(`      Fix: ${issue.fix}`);
        });
        console.log('');
      }

      if (infos.length > 0) {
        console.log(`ℹ️  Info (${infos.length}):`);
        infos.forEach(issue => {
          console.log(`   [${issue.section}] ${issue.problem}`);
          console.log(`      Fix: ${issue.fix}`);
        });
        console.log('');
      }
    }

    // Step 5: Save fixed data
    const outputPath = path.join(process.cwd(), 'resume-examples', 'hyperion-resume-fixed.json');
    fs.writeFileSync(outputPath, JSON.stringify(fixedData, null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💾 Fixed resume data saved to:');
    console.log(`   ${outputPath}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Step 6: Summary
    console.log('📋 Summary:');
    console.log(`   Personal Info: ${fixedData.personalInfo?.fullName ? '✅' : '❌'} ${fixedData.personalInfo?.fullName || 'Missing name'}`);
    console.log(`   Email: ${fixedData.personalInfo?.email ? '✅' : '❌'} ${fixedData.personalInfo?.email || 'Missing'}`);
    console.log(`   Experiences: ${fixedData.experiences?.length || 0} found`);
    console.log(`   Education: ${fixedData.education?.length || 0} found`);
    console.log(`   Skills: ${fixedData.skills?.length || 0} categories`);
    console.log(`   Projects: ${fixedData.projects?.length || 0} found`);
    console.log(`   Certifications: ${fixedData.certifications?.length || 0} found`);
    console.log(`   Hobbies: ${fixedData.hobbies?.length || 0} found`);
    console.log(`   Issues Fixed: ${issues.length}`);
    console.log('');

  } catch (error: any) {
    console.error('❌ Error processing resume:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

main();

