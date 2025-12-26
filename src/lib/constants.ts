// Application constants

export const THEME = {
  STORAGE_KEY: 'theme',
  DARK: 'dark' as const,
  LIGHT: 'light' as const,
  SYSTEM: 'system' as const,
};

export const SOCIAL_LINKS = {
  linkedin: 'https://linkedin.com/in/vaishakkmenon',
  github: 'https://github.com/vaishakkmenon',
} as const;

export const ROUTES = {
  resume: '/resume/Resume-Vaishak_Menon.pdf',
  resumePreview: '/resume/resume_preview.png',
} as const;

export const LAYOUT = {
  header: {
    fadeStart: -200, // Offset from viewport height where fade begins
    fadeEnd: 0,      // Offset from viewport height where fade completes
    fadeTransition: 'opacity .3s ease',
  },
  spacing: {
    sectionY: 'py-24 md:py-32',
    container: 'max-w-5xl mx-auto px-4',
  },
} as const;

export const ANIMATION = {
  duration: {
    header: 0.3,
    section: 0.45,
  },
  stagger: {
    delayChildren: 0.05,
    staggerChildren: 0.06,
  },
} as const;

export const SECTION_IDS = {
  hero: 'hero',
  about: 'about',
  education: 'education',
  certs: 'certs',
  projects: 'projects',
  resume: 'resume',
} as const;
