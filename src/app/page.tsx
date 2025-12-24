// app/page.tsx
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { EducationSection } from '@/components/sections/EducationSection';
import { CertificationsSection } from '@/components/sections/CertificationsSection';
import { ResumeSection } from '@/components/sections/ResumeSection';

/**
 * Homepage - Main landing page with all sections.
 * Refactored for better maintainability and separation of concerns.
 */
export default function Home(): React.ReactElement {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <EducationSection />
      <CertificationsSection />
      <ResumeSection />
      <footer className="pb-12 text-center text-sm opacity-70">
        © {new Date().getFullYear()} Vaishak Menon
      </footer>
    </>
  );
}