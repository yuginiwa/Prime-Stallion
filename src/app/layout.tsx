import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '@/components/SiteChrome';
import { canIndex, company, siteOrigin } from '@/content/site';
import './globals.css';

const description = 'Design-build, property renovations, and housing and site development. Explore Prime Stallion’s work and tell us what you’re planning.';
export const metadata: Metadata = {
  ...(siteOrigin ? { metadataBase: new URL(siteOrigin) } : {}),
  title: { default: 'Prime Stallion | Construction & Renovation in Cavite', template: '%s | Prime Stallion' },
  description,
  robots: { index: canIndex, follow: canIndex },
  openGraph: { type: 'website', locale: 'en_PH', siteName: company.name, description, ...(siteOrigin ? { images: ['/brand/share.webp'] } : {}) },
  icons: { icon: '/brand/prime-stallion.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en-PH"><body><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader /><main id="main-content">{children}</main><SiteFooter /></body></html>;
}
