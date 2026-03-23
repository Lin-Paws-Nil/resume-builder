export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
  achievements?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
}

export interface Skill {
  id: string;
  category: string;
  items: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
}

export interface Hobby {
  id: string;
  name: string;
  description?: string;
}

export interface CustomSection {
  id: string;
  name: string;
  type: 'text' | 'list' | 'items'; // text = single text, list = bullet list, items = key-value pairs
  content: string | string[] | Array<{ label: string; value: string }>;
  order: number;
}

export interface ResumeData {
  id: string;
  title: string;
  personalInfo: PersonalInfo;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  hobbies: Hobby[];
  customSections: CustomSection[];
  sectionOrder: string[]; // Array of section IDs in display order
  sectionNames: Record<string, string>; // Custom names for sections
  templateId: string;
  templateColor?: string; // Hex color code for template customization
  profileImage?: string; // Base64 encoded profile image
  showProfileImage?: boolean; // Whether to show profile image on resume
  createdAt: string;
  updatedAt: string;
}

export type ResumeSection = 
  | 'personalInfo'
  | 'summary'
  | 'experiences'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'hobbies'
  | string; // Allow custom section IDs


