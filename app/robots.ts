import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/builder/', '/account/', '/payment/', '/api/', '/auth/'],
    },
    sitemap: 'https://createresume.co/sitemap.xml',
  };
}
