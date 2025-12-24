import { SOCIAL_LINKS } from '@/lib/constants';

/**
 * Structured data (JSON-LD) for SEO and rich snippets.
 * Provides schema.org markup for search engines to better understand the page content.
 */
export function StructuredData(): React.ReactElement {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Vaishak Menon',
    jobTitle: 'Software Engineer',
    url: 'https://www.vaishakmenon.com',
    sameAs: [
      SOCIAL_LINKS.linkedin,
      SOCIAL_LINKS.github,
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'University of Alabama at Birmingham',
    },
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Certified Kubernetes Administrator',
        credentialCategory: 'Professional Certification',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'AWS Certified Cloud Practitioner',
        credentialCategory: 'Professional Certification',
      },
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Vaishak Menon Portfolio',
    url: 'https://www.vaishakmenon.com',
    description: 'Professional portfolio showcasing software engineering experience, certifications, and education',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
