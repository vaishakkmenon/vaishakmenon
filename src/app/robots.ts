import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

/**
 * Generates robots.txt for search engine crawler directives.
 * Instructs crawlers on which pages to index and where to find the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://www.vaishakmenon.com/sitemap.xml',
  };
}
