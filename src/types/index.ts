export interface Project {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  accent: string;
  year: string;
  isCurrent?: boolean;
  stage?: string;
  image: string;
  liveUrl?: string;
}

export interface ExpertiseItem {
  n: string;
  title: string;
  skills: string[];
  accent: string;
  icon: string;
}

export interface ServiceItem {
  title: string;
  desc: string;
}

export interface TechItem {
  name: string;
  size: number;
  accent: string | null;
}

export interface NavItem {
  id: string;
  label: string;
  num: string;
  status: string;
  color: string;
}

export interface JourneyItem {
  year: string;
  word: string;
  note: string;
  accent: string;
}
