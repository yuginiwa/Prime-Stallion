import type { MetadataRoute } from 'next';
import { canIndex, siteOrigin } from '@/content/site';
import { projects } from '@/content/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!canIndex) return [];
  return ['/', '/about', '/services', '/projects', '/contact', ...projects.map(p => `/projects/${p.slug}`)].map(path => ({ url: `${siteOrigin}${path}` }));
}
