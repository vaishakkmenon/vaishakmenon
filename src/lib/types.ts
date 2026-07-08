// Shared TypeScript types and interfaces

export interface Certification {
  id: string;
  name: string;
  file: string;
  image: string;
  earned: string;
  expires?: string; // ISO date (YYYY-MM-DD); omit if cert doesn't expire
  verifyUrl: string;
}
