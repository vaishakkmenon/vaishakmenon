import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

/**
 * Generates sitemap.xml for search engine crawlers.
 * Helps search engines discover and index all pages on the site.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.vaishakmenon.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
