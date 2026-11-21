import type { MetadataRoute } from 'next';
import { canIndex, siteOrigin } from '@/content/site';

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/' }, ...(canIndex ? { sitemap: `${siteOrigin}/sitemap.xml` } : {}) };
}
