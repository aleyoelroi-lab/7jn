export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  tools: string[];
  details: string[];
}

export interface PackageItem {
  id: string;
  name: string;
  price: string;
  priceNote: string;
  features: string[];
  note: string;
  featured?: boolean;
  timeline?: string;
  pricePHP?: string;
  scope?: string;
  deployment?: string;
}

export interface BlogItem {
  id: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  bgGradient: string;
  imageUrl?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

// Resume structure from Jeddah's HTML
export interface ExperienceItem {
  company: string;
  role: string;
  dates: string;
  bullets: string[];
  highlight?: boolean;
}

export interface EducationItem {
  school: string;
  detail: string;
}

export interface ProjectItem {
  title: string;
  desc: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
}

export interface ResumeData {
  name: string;
  title: string;
  summary: string;
  contact: {
    location: string;
    website: string;
    email1: string;
    email2: string;
    phone: string;
  };
  skills: {
    category: string;
    items: string[];
  }[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  honors: string[];
  certifications: string[];
  education: EducationItem[];
}

export interface HologramNode {
  id: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  ox: number; // Original x coordinates
  oy: number;
  oz: number;
  size: number;
  label: string;
  sectionLink: string;
  color: string;
  info: string;
}
