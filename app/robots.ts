import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/builder/', '/account/', '/payment/', '/confirm/', '/reset-password/', '/check-status/'],
    },
    sitemap: 'https://createresume.co/sitemap.xml',
  }
}
