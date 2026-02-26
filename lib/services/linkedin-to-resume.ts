import type { ResumeData, Experience, Education, Skill } from '@/lib/types/resume';

/**
 * OpenID Connect UserInfo response from /v2/userinfo
 * @see https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2
 */
export interface OpenIDUserInfo {
  sub?: string; // User identifier (optional in response)
  name?: string; // Full name
  given_name?: string; // First name
  family_name?: string; // Last name
  picture?: string; // Profile picture URL
  locale?: string; // Locale (e.g., "en-US")
  email?: string; // Email address (optional)
  email_verified?: boolean; // Email verification status (optional)
}

const DEFAULT_SECTION_ORDER = ['personalInfo', 'summary', 'experiences', 'education', 'skills', 'projects', 'certifications', 'hobbies'];
const DEFAULT_SECTION_NAMES: Record<string, string> = {
  personalInfo: 'Personal Information',
  summary: 'Summary',
  experiences: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  hobbies: 'Hobbies',
};

/**
 * Map LinkedIn OpenID Connect userinfo to ResumeData.
 * Returns: name, email, profile picture URL. No experience, education, or skills
 * (user can add those manually or via LinkedIn data export ZIP).
 */
export function mapOpenIDToResume(userInfo: OpenIDUserInfo): ResumeData {
  const fullName = userInfo.name || 
    [userInfo.given_name, userInfo.family_name].filter(Boolean).join(' ') || 
    'Unknown';
  const email = userInfo.email || '';

  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: `Resume from LinkedIn - ${fullName}`,
    personalInfo: {
      fullName,
      email,
      phone: '',
      location: userInfo.locale ? userInfo.locale.split('-')[1] || '' : '',
      linkedin: undefined, // OpenID doesn't provide vanityName
    },
    summary: '',
    experiences: [] as Experience[],
    education: [] as Education[],
    skills: [] as Skill[],
    projects: [],
    certifications: [],
    hobbies: [],
    customSections: [],
    sectionOrder: DEFAULT_SECTION_ORDER,
    sectionNames: DEFAULT_SECTION_NAMES,
    templateId: 'aurora',
    createdAt: now,
    updatedAt: now,
  };
}

/** LinkedIn Verified on LinkedIn /identityMe API response (DEPRECATED - use OpenID Connect instead). */
export interface IdentityMeResponse {
  id?: string;
  lastRefreshedAt?: number;
  basicInfo?: {
    firstName?: { localized?: Record<string, string> };
    lastName?: { localized?: Record<string, string> };
    primaryEmailAddress?: string;
    profileUrl?: string;
    profilePicture?: { croppedImage?: { downloadUrl?: string } };
  };
}

function firstLocale(obj: { localized?: Record<string, string> } | undefined): string {
  if (!obj?.localized) return '';
  return obj.localized.en_US ?? obj.localized.en ?? (Object.values(obj.localized)[0] as string) ?? '';
}

/**
 * Map LinkedIn Verified on LinkedIn /identityMe (DEPRECATED) to ResumeData.
 * @deprecated Use mapOpenIDToResume with /v2/userinfo instead
 */
export function mapIdentityMeToResume(me: IdentityMeResponse, userEmail?: string): ResumeData {
  const first = firstLocale(me.basicInfo?.firstName);
  const last = firstLocale(me.basicInfo?.lastName);
  const fullName = [first, last].filter(Boolean).join(' ') || 'Unknown';
  const email = me.basicInfo?.primaryEmailAddress || userEmail || '';
  const linkedin = me.basicInfo?.profileUrl || undefined;

  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: `Resume from LinkedIn - ${fullName}`,
    personalInfo: {
      fullName,
      email,
      phone: '',
      location: '',
      linkedin,
    },
    summary: '',
    experiences: [] as Experience[],
    education: [] as Education[],
    skills: [] as Skill[],
    projects: [],
    certifications: [],
    hobbies: [],
    customSections: [],
    sectionOrder: DEFAULT_SECTION_ORDER,
    sectionNames: DEFAULT_SECTION_NAMES,
    templateId: 'aurora',
    createdAt: now,
    updatedAt: now,
  };
}

function descriptionToBullets(desc: string | null | undefined): string[] {
  if (!desc || typeof desc !== 'string') return [];
  return desc
    .split(/\n|\.\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 6);
}

/** Parsed CSV data from LinkedIn "Get a copy of your data" export (Profile, Positions, Education, Skills). */
export interface LinkedInExportData {
  profile?: Record<string, string>;
  positions?: Record<string, string>[];
  education?: Record<string, string>[];
  skills?: Record<string, string>[];
}

function get(obj: Record<string, string> | undefined, ...keys: string[]): string {
  if (!obj) return '';
  for (const k of keys) {
    const v = obj[k];
    if (v != null && String(v).trim()) return String(v).trim();
  }
  return '';
}

/**
 * Map LinkedIn data export (CSV) to our ResumeData format.
 * Supports common column names from LinkedIn's "Get a copy of your data" (Profile.csv, Positions.csv, Education.csv, Skills.csv).
 */
export function mapLinkedInExportToResume(exportData: LinkedInExportData, userEmail?: string): ResumeData {
  const p = exportData.profile || {};
  const fullName = [get(p, 'First Name', 'FirstName'), get(p, 'Last Name', 'LastName')].filter(Boolean).join(' ') || 'Unknown';
  const location = [get(p, 'Geo Location', 'Geo Location', 'Location'), get(p, 'Country', 'Country')].filter(Boolean).join(', ');

  const experiences: Experience[] = (exportData.positions || []).map((pos, i) => {
    const finished = get(pos, 'Finished On', 'Finished On', 'End Date', 'FinishedOn');
    const isCurrent = /true|yes|1|present|current/i.test(get(pos, 'Currently Working Here', 'Currently Working Here', 'CurrentlyWorkingHere'));
    const desc = get(pos, 'Description', 'Description');
    const bullets = descriptionToBullets(desc);
    return {
      id: `exp-${i}-${crypto.randomUUID()}`,
      company: get(pos, 'Company Name', 'Company Name', 'Company', 'CompanyName') || 'Unknown',
      position: get(pos, 'Title', 'Title', 'Position') || 'Unknown',
      startDate: get(pos, 'Started On', 'Started On', 'Start Date', 'StartedOn') || 'Unknown',
      endDate: isCurrent || !finished ? 'Present' : finished,
      current: isCurrent,
      description: bullets.length > 0 ? bullets : (desc ? [desc] : []),
      achievements: [],
    };
  });

  const education = (exportData.education || []).map((edu, i) => ({
    id: `edu-${i}-${crypto.randomUUID()}`,
    institution: get(edu, 'School Name', 'School Name', 'School', 'SchoolName') || 'Unknown',
    degree: get(edu, 'Degree Name', 'Degree Name', 'Degree', 'DegreeName') || get(edu, 'Degree', 'Degree') || '',
    field: get(edu, 'Field of Study', 'Field of Study', 'FieldOfStudy') || '',
    startDate: get(edu, 'Start Date', 'Start Date', 'StartedOn') || 'Unknown',
    endDate: get(edu, 'End Date', 'End Date', 'Finished On', 'FinishedOn') || 'Unknown',
    gpa: undefined,
    honors: get(edu, 'Activities and Societies', 'Activities and Societies', 'ActivitiesAndSocieties') || undefined,
  }));

  const skillItems = (exportData.skills || []).map((s) => get(s, 'Skill', 'Skill', 'Name', 'Skills')).filter(Boolean);
  const skills: Skill[] = skillItems.length > 0 ? [{ id: crypto.randomUUID(), category: 'Skills', items: skillItems }] : [];

  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: `Resume from LinkedIn - ${fullName}`,
    personalInfo: {
      fullName,
      email: get(p, 'Email Address', 'Email Address', 'Email', 'EmailAddress') || userEmail || '',
      phone: '',
      location,
      linkedin: get(p, 'Public Profile URL', 'Public Profile URL', 'PublicProfileURL', 'LinkedIn') || undefined,
    },
    summary: get(p, 'Summary', 'Summary') || get(p, 'Headline', 'Headline') || '',
    experiences,
    education,
    skills,
    projects: [],
    certifications: [],
    hobbies: [],
    customSections: [],
    sectionOrder: DEFAULT_SECTION_ORDER,
    sectionNames: DEFAULT_SECTION_NAMES,
    templateId: 'aurora',
    createdAt: now,
    updatedAt: now,
  };
}
