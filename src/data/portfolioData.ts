import type { Project, ExpertiseItem, ServiceItem, TechItem, NavItem, JourneyItem } from "../types";

export const PROJECTS: Project[] = [
  {
    number: "01",
    title: "EVRIDOR",
    subtitle: "A modern multi-platform delivery ecosystem.",
    description:
      "A high-performance logistics and delivery platform featuring real-time tracking, multi-vendor dashboards, customer mobile apps, and scalable microservices backend.",
    tags: ["React", "React Native", "Node.js", "NestJS", "PostgreSQL"],
    accent: "#2563EB",
    year: "2024 — PRESENT",
    isCurrent: true,
    stage: "CURRENT WORKING STAGE",
    image:
      "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=900&h=620&fit=crop&auto=format",
  },
  {
    number: "02",
    title: "SUNTRONIC POWER",
    subtitle: "Commercial & residential solar e-commerce platform.",
    description:
      "Complete high-converting e-commerce web platform for Suntronic Power, featuring interactive solar solutions catalog, real-time inverter & battery pricing, custom power requirement estimators, and secure transaction workflows.",
    tags: ["Next.js", "TypeScript", "E-Commerce", "Tailwind CSS", "Stripe"],
    accent: "#F97316",
    year: "2024 — 2025",
    image:
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=900&h=620&fit=crop&auto=format",
    liveUrl: "https://suntronicpower.com",
  },
  {
    number: "03",
    title: "NOTHING ACCESSORIES",
    subtitle: "Minimalist tech accessories and lifestyle gadget store.",
    description:
      "Ultra-clean, modern tech showcase and e-commerce destination for high-end mobile accessories and gadgets with rapid page rendering, sleek monochrome UI/UX, seamless checkout, and Pakistan-wide order fulfillment.",
    tags: ["React", "Next.js", "Tailwind CSS", "E-Commerce", "Headless CMS"],
    accent: "#06B6D4",
    year: "2024 — 2025",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&h=620&fit=crop&auto=format",
    liveUrl: "https://nothingaccessories.pk/",
  },
  {
    number: "04",
    title: "TECHTOUCH",
    subtitle: "Innovative technology agency and enterprise digital platform.",
    description:
      "Comprehensive corporate tech website and client platform for TechTouch, delivering responsive interactive service demonstrations, digital transformation case studies, and enterprise software service pipelines.",
    tags: ["React", "TypeScript", "Node.js", "UI/UX", "Tailwind CSS"],
    accent: "#7C3AED",
    year: "2024 — 2025",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=620&fit=crop&auto=format",
    liveUrl: "https://techtouch.com",
  },
  {
    number: "05",
    title: "SCHOOL MANAGEMENT",
    subtitle:
      "A complete digital school management ecosystem connecting students, teachers, and administrators.",
    description:
      "Comprehensive educational portal handling student attendance, gradebooks, fees management, real-time messaging, and multi-tier role-based administrative access.",
    tags: ["React", "Node.js", "PostgreSQL", "REST API"],
    accent: "#10B981",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&h=620&fit=crop&auto=format",
  },
];

export const EXPERTISE: ExpertiseItem[] = [
  {
    n: "01",
    title: "CREATIVE DEVELOPMENT",
    skills: ["React", "Next.js", "GSAP", "Three.js", "WebGL"],
    accent: "#2563EB",
    icon: "◆",
  },
  {
    n: "02",
    title: "FULL-STACK ENGINEERING",
    skills: ["Node.js", "NestJS", "PostgreSQL", "REST APIs", "Cloud"],
    accent: "#7C3AED",
    icon: "▲",
  },
  {
    n: "03",
    title: "UI / UX DEVELOPMENT",
    skills: ["Figma", "Design Systems", "Framer", "Prototyping", "Motion"],
    accent: "#F97316",
    icon: "●",
  },
  {
    n: "04",
    title: "MOBILE APPLICATIONS",
    skills: ["React Native", "Expo", "iOS", "Android", "App Store"],
    accent: "#F43F5E",
    icon: "■",
  },
  {
    n: "05",
    title: "AI & AUTOMATION",
    skills: ["OpenAI", "LangChain", "Python", "FastAPI", "ML Pipelines"],
    accent: "#A3E635",
    icon: "✦",
  },
  {
    n: "06",
    title: "INTERACTIVE EXPERIENCES",
    skills: ["WebGL", "Canvas API", "GSAP", "Lottie", "CSS Animation"],
    accent: "#06B6D4",
    icon: "◎",
  },
];

export const SERVICES: ServiceItem[] = [
  { title: "WEB APPLICATIONS", desc: "Full-stack web apps built to scale and perform at any load." },
  { title: "MOBILE APPS", desc: "Cross-platform React Native applications for iOS and Android." },
  { title: "AI PRODUCTS", desc: "Intelligent tools powered by modern AI and automation." },
  { title: "E-COMMERCE", desc: "Commerce experiences engineered for conversion and trust." },
  { title: "DESIGN SYSTEMS", desc: "Scalable component libraries that design teams love." },
  { title: "INTERACTIVE WEBSITES", desc: "Motion-rich, award-level experiences that capture attention." },
  { title: "FULL-STACK SYSTEMS", desc: "End-to-end digital product development from idea to launch." },
];

export const TECH: TechItem[] = [
  { name: "NEXT.JS", size: 16, accent: null },
  { name: "REACT", size: 20, accent: "#2563EB" },
  { name: "REACT NATIVE", size: 14, accent: null },
  { name: "TYPESCRIPT", size: 18, accent: null },
  { name: "NODE.JS", size: 19, accent: "#A3E635" },
  { name: "NESTJS", size: 13, accent: null },
  { name: "POSTGRESQL", size: 15, accent: null },
  { name: "GSAP", size: 17, accent: "#F97316" },
  { name: "THREE.JS", size: 18, accent: "#7C3AED" },
  { name: "FIGMA", size: 14, accent: null },
  { name: "AI", size: 22, accent: "#F43F5E" },
  { name: "PYTHON", size: 15, accent: null },
  { name: "DOCKER", size: 13, accent: "#06B6D4" },
];

export const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "HOME", num: "01", status: "INTRO", color: "#2563EB" },
  { id: "work", label: "WORK", num: "02", status: "WORK", color: "#7C3AED" },
  { id: "expertise", label: "EXPERTISE", num: "03", status: "EXPERTISE", color: "#F97316" },
  { id: "process", label: "PROCESS", num: "04", status: "PROCESS", color: "#A3E635" },
  { id: "about", label: "ABOUT", num: "05", status: "ABOUT", color: "#06B6D4" },
  { id: "contact", label: "CONTACT", num: "06", status: "CONTACT", color: "#F43F5E" },
];

export const JOURNEY: JourneyItem[] = [
  { year: "2024", word: "FOUNDATION", note: "Delivery systems, full-stack architecture, School Management.", accent: "#2563EB" },
  { year: "2025", word: "INNOVATION", note: "AI products, experimental WebGL, creative web experiences.", accent: "#7C3AED" },
  { year: "2026", word: "EXPAND", note: "Building EVRIDOR ecosystem and taking on international projects.", accent: "#F97316" },
];

export const PROCESS_STEPS = [
  { n: "01", title: "DISCOVER", desc: "Understanding the problem, the user, and the opportunity." },
  { n: "02", title: "DESIGN", desc: "Shaping the experience with intention and craft." },
  { n: "03", title: "BUILD", desc: "Turning designs into performant, production-ready code." },
  { n: "04", title: "REFINE", desc: "Optimizing every detail until it feels just right." },
];

export const PERSONAL_INFO = {
  name: "ASAD UR REHMAN",
  role: "CREATIVE DEVELOPER",
  secondaryRole: "FULL-STACK ENGINEER",
  location: "PAKISTAN",
  email: "hello@asadurrehman.com",
  currentWork: "EVRIDOR",
  timeline: "2024 — PRESENT",
  philosophy: "Great digital products happen when thoughtful design and clean architecture speak the same language.",
  socials: [
    { name: "GITHUB", url: "https://github.com/asadurrehman5005" },
    {
      name: "LINKEDIN",
      url: "https://www.linkedin.com/in/asad-ur-rehman-089bb93a2?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    },
  ],
};
