/**
 * Script to validate and fix resume data structure
 * Works with JSON files containing resume data
 * 
 * Usage:
 *   npm exec tsx scripts/validate-and-fix-resume.ts <json-file-path>
 *   npm exec tsx scripts/validate-and-fix-resume.ts resume-examples/hyperion-resume.json
 */

import * as fs from 'fs';
import * as path from 'path';
import type { ResumeData, Experience, Education, Skill, Project, Certification, Hobby } from '../lib/types/resume';

interface Issue {
  section: string;
  problem: string;
  fix: string;
  severity: 'error' | 'warning' | 'info';
}

function generateId(prefix: string, index: number): string {
  return `${prefix}-${index}`;
}

function validateAndFixResumeData(data: any): { data: ResumeData; issues: Issue[] } {
  const issues: Issue[] = [];
  const fixed: any = {};

  // Validate and fix ID
  fixed.id = data.id || 'resume-' + Date.now();
  if (!data.id) {
    issues.push({
      section: 'id',
      problem: 'Missing id',
      fix: `Generated: ${fixed.id}`,
      severity: 'info',
    });
  }

  // Validate and fix title
  fixed.title = data.title || 'My Resume';
  if (!data.title) {
    issues.push({
      section: 'title',
      problem: 'Missing title',
      fix: `Set to: ${fixed.title}`,
      severity: 'info',
    });
  }

  // Validate and fix personalInfo
  if (!data.personalInfo) {
    issues.push({
      section: 'personalInfo',
      problem: 'Missing personalInfo section',
      fix: 'Created empty personalInfo structure',
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
      fullName: data.personalInfo.fullName || '',
      email: data.personalInfo.email || '',
      phone: data.personalInfo.phone || '',
      location: data.personalInfo.location || '',
      linkedin: data.personalInfo.linkedin || '',
      github: data.personalInfo.github || '',
      website: data.personalInfo.website || '',
    };

    if (!fixed.personalInfo.fullName) {
      issues.push({
        section: 'personalInfo.fullName',
        problem: 'Missing fullName',
        fix: 'Set to empty string (needs manual input)',
        severity: 'error',
      });
    }
    if (!fixed.personalInfo.email) {
      issues.push({
        section: 'personalInfo.email',
        problem: 'Missing email',
        fix: 'Set to empty string (needs manual input)',
        severity: 'warning',
      });
    }
  }

  // Validate and fix summary
  fixed.summary = data.summary || '';
  if (!data.summary) {
    issues.push({
      section: 'summary',
      problem: 'Missing summary',
      fix: 'Set to empty string',
      severity: 'warning',
    });
  }

  // Validate and fix experiences
  if (!Array.isArray(data.experiences)) {
    issues.push({
      section: 'experiences',
      problem: 'Experiences is not an array',
      fix: 'Set to empty array',
      severity: 'error',
    });
    fixed.experiences = [];
  } else {
    fixed.experiences = data.experiences.map((exp: any, index: number): Experience => {
      const expIssues: Issue[] = [];
      
      // Ensure ID
      const expId = exp.id || generateId('exp', index);
      if (!exp.id) {
        expIssues.push({
          section: `experiences[${index}].id`,
          problem: 'Missing id',
          fix: `Generated: ${expId}`,
          severity: 'info',
        });
      }

      // Fix description - should be array
      let description: string[] = [];
      if (Array.isArray(exp.description)) {
        description = exp.description.filter((d: any) => d && typeof d === 'string');
      } else if (typeof exp.description === 'string') {
        // Convert string to array by splitting on newlines or bullets
        description = exp.description
          .split(/\n+/)
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0)
          .map((line: string) => {
            // Remove bullet points if present
            return line.replace(/^[•\-\*]\s*/, '').trim();
          })
          .filter((line: string) => line.length > 0);
      }

      if (description.length === 0 && exp.description) {
        expIssues.push({
          section: `experiences[${index}].description`,
          problem: 'Description format issue',
          fix: 'Converted to array format',
          severity: 'info',
        });
      }

      const fixedExp: Experience = {
        id: expId,
        company: exp.company || '',
        position: exp.position || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        current: exp.current || exp.endDate === 'Present' || exp.endDate?.toLowerCase() === 'present',
        description: description,
        achievements: Array.isArray(exp.achievements) ? exp.achievements : undefined,
      };

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
      if (!fixedExp.startDate) {
        expIssues.push({
          section: `experiences[${index}].startDate`,
          problem: 'Missing startDate',
          fix: 'Set to empty string (needs manual input)',
          severity: 'warning',
        });
      }

      issues.push(...expIssues);
      return fixedExp;
    });
  }

  // Validate and fix education
  if (!Array.isArray(data.education)) {
    issues.push({
      section: 'education',
      problem: 'Education is not an array',
      fix: 'Set to empty array',
      severity: 'error',
    });
    fixed.education = [];
  } else {
    fixed.education = data.education.map((edu: any, index: number): Education => {
      const eduId = edu.id || generateId('edu', index);
      const fixedEdu: Education = {
        id: eduId,
        institution: edu.institution || '',
        degree: edu.degree || '',
        field: edu.field || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        gpa: edu.gpa || undefined,
        honors: edu.honors || undefined,
      };

      if (!fixedEdu.institution) {
        issues.push({
          section: `education[${index}].institution`,
          problem: 'Missing institution',
          fix: 'Set to empty string (needs manual input)',
          severity: 'error',
        });
      }
      if (!fixedEdu.degree) {
        issues.push({
          section: `education[${index}].degree`,
          problem: 'Missing degree',
          fix: 'Set to empty string (needs manual input)',
          severity: 'error',
        });
      }

      return fixedEdu;
    });
  }

  // Validate and fix skills
  if (!Array.isArray(data.skills)) {
    issues.push({
      section: 'skills',
      problem: 'Skills is not an array',
      fix: 'Set to empty array',
      severity: 'error',
    });
    fixed.skills = [];
  } else {
    fixed.skills = data.skills.map((skill: any, index: number): Skill => {
      const skillId = skill.id || generateId('skill', index);
      const fixedSkill: Skill = {
        id: skillId,
        category: skill.category || 'General',
        items: Array.isArray(skill.items) ? skill.items.filter((item: any) => item && typeof item === 'string') : [],
      };

      if (fixedSkill.items.length === 0 && skill.items) {
        issues.push({
          section: `skills[${index}]`,
          problem: 'Skill category has no valid items',
          fix: 'Filtered invalid items',
          severity: 'warning',
        });
      }

      return fixedSkill;
    });
  }

  // Validate and fix projects
  if (!Array.isArray(data.projects)) {
    fixed.projects = [];
  } else {
    fixed.projects = data.projects.map((proj: any, index: number): Project => ({
      id: proj.id || generateId('proj', index),
      name: proj.name || '',
      description: proj.description || '',
      technologies: Array.isArray(proj.technologies) ? proj.technologies.filter((t: any) => t && typeof t === 'string') : [],
      link: proj.link || undefined,
      github: proj.github || undefined,
    }));
  }

  // Validate and fix certifications
  if (!Array.isArray(data.certifications)) {
    fixed.certifications = [];
  } else {
    fixed.certifications = data.certifications.map((cert: any, index: number): Certification => ({
      id: cert.id || generateId('cert', index),
      name: cert.name || '',
      issuer: cert.issuer || '',
      date: cert.date || '',
      expiryDate: cert.expiryDate || undefined,
    }));
  }

  // Validate and fix hobbies
  if (!Array.isArray(data.hobbies)) {
    fixed.hobbies = [];
  } else {
    fixed.hobbies = data.hobbies.map((hobby: any, index: number): Hobby => ({
      id: hobby.id || generateId('hobby', index),
      name: hobby.name || '',
      description: hobby.description || undefined,
    }));
  }

  // Validate and fix customSections
  if (!Array.isArray(data.customSections)) {
    fixed.customSections = [];
  } else {
    fixed.customSections = data.customSections.map((section: any, index: number) => ({
      id: section.id || generateId('custom', index),
      name: section.name || '',
      type: section.type || 'text',
      content: section.content || '',
      order: typeof section.order === 'number' ? section.order : index,
    }));
  }

  // Validate and fix sectionOrder
  const defaultSectionOrder = [
    'personalInfo',
    'summary',
    'experiences',
    'education',
    'skills',
    'projects',
    'certifications',
    'hobbies',
  ];
  fixed.sectionOrder = Array.isArray(data.sectionOrder) && data.sectionOrder.length > 0
    ? data.sectionOrder
    : defaultSectionOrder;

  if (!Array.isArray(data.sectionOrder) || data.sectionOrder.length === 0) {
    issues.push({
      section: 'sectionOrder',
      problem: 'Missing or empty sectionOrder',
      fix: 'Set to default order',
      severity: 'info',
    });
  }

  // Validate and fix sectionNames
  const defaultSectionNames: Record<string, string> = {
    personalInfo: 'Personal Information',
    summary: 'Summary',
    experiences: 'Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    certifications: 'Certifications',
    hobbies: 'Hobbies',
  };
  fixed.sectionNames = data.sectionNames && typeof data.sectionNames === 'object'
    ? { ...defaultSectionNames, ...data.sectionNames }
    : defaultSectionNames;

  // Validate and fix templateId
  fixed.templateId = data.templateId || 'hyperion';
  if (!data.templateId || data.templateId !== 'hyperion') {
    issues.push({
      section: 'templateId',
      problem: `Template ID is '${data.templateId || 'missing'}'`,
      fix: `Set to 'hyperion' for Hyperion template`,
      severity: 'info',
    });
  }

  // Validate and fix templateColor
  fixed.templateColor = data.templateColor || undefined;

  // Validate and fix timestamps
  fixed.createdAt = data.createdAt || new Date().toISOString();
  fixed.updatedAt = new Date().toISOString();

  return { data: fixed as ResumeData, issues };
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npm exec tsx scripts/validate-and-fix-resume.ts <json-file-path>');
    console.log('Example: npm exec tsx scripts/validate-and-fix-resume.ts resume-examples/hyperion-resume.json');
    process.exit(1);
  }

  const jsonPath = path.resolve(process.cwd(), args[0]);

  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 Validating and Fixing Resume Data');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`📄 Reading file: ${jsonPath}\n`);

    if (!fs.existsSync(jsonPath)) {
      console.log('❌ File not found. Creating template JSON file...\n');
      // Create a template file
      const template: ResumeData = {
        id: 'hyperion-resume',
        title: 'Hyperion Resume',
        personalInfo: {
          fullName: '',
          email: '',
          phone: '',
          location: '',
          linkedin: '',
          github: '',
          website: '',
        },
        summary: '',
        experiences: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        hobbies: [],
        customSections: [],
        sectionOrder: ['personalInfo', 'summary', 'experiences', 'education', 'skills', 'projects', 'certifications', 'hobbies'],
        sectionNames: {
          personalInfo: 'Personal Information',
          summary: 'Summary',
          experiences: 'Experience',
          education: 'Education',
          skills: 'Skills',
          projects: 'Projects',
          certifications: 'Certifications',
          hobbies: 'Hobbies',
        },
        templateId: 'hyperion',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      fs.writeFileSync(jsonPath, JSON.stringify(template, null, 2));
      console.log(`✅ Created template file: ${jsonPath}`);
      console.log('   Please fill in the resume data and run this script again.\n');
      return;
    }

    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
    const jsonData = JSON.parse(fileContent);

    console.log('🔧 Validating and fixing data structure...\n');
    const { data: fixedData, issues } = validateAndFixResumeData(jsonData);

    // Report issues
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
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

    // Save fixed data
    const outputPath = jsonPath.replace('.json', '-fixed.json');
    fs.writeFileSync(outputPath, JSON.stringify(fixedData, null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💾 Fixed resume data saved to:');
    console.log(`   ${outputPath}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Summary
    console.log('📋 Summary:');
    console.log(`   Personal Info: ${fixedData.personalInfo.fullName ? '✅' : '❌'} ${fixedData.personalInfo.fullName || 'Missing name'}`);
    console.log(`   Email: ${fixedData.personalInfo.email ? '✅' : '❌'} ${fixedData.personalInfo.email || 'Missing'}`);
    console.log(`   Experiences: ${fixedData.experiences.length} found`);
    console.log(`   Education: ${fixedData.education.length} found`);
    console.log(`   Skills: ${fixedData.skills.length} categories`);
    console.log(`   Projects: ${fixedData.projects.length} found`);
    console.log(`   Certifications: ${fixedData.certifications.length} found`);
    console.log(`   Hobbies: ${fixedData.hobbies.length} found`);
    console.log(`   Issues Fixed: ${issues.length}`);
    console.log('');

  } catch (error: any) {
    console.error('❌ Error processing resume:', error.message);
    if (error.message.includes('JSON')) {
      console.error('   The file is not valid JSON. Please check the file format.');
    }
    process.exit(1);
  }
}

main();

