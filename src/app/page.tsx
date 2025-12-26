// app/page.tsx
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { EducationSection } from '@/components/sections/EducationSection';
import { CertificationsSection } from '@/components/sections/CertificationsSection';
import { ResumeSection } from '@/components/sections/ResumeSection';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

/**
 * Homepage - Main landing page with all sections.
 * Each section wrapped in error boundary for graceful degradation.
 */
export default function Home(): React.ReactElement {
  return (
    <>
      <HeroSection />
      <ErrorBoundary>
        <AboutSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <ProjectsSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <EducationSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <CertificationsSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <ResumeSection />
      </ErrorBoundary>
      <footer className="pb-12 text-center text-sm opacity-70">
        © {new Date().getFullYear()} Vaishak Menon
      </footer>
    </>
  );
}