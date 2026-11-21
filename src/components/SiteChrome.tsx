import Image from 'next/image';
import Link from 'next/link';
import { company, navigation } from '@/content/site';

function Brand({ eager = false }: { eager?: boolean }) {
  return <Link href="/" className="brand" aria-label="Prime Stallion home"><Image src="/brand/prime-stallion.png" alt="" width={400} height={136} loading={eager ? "eager" : "lazy"} /></Link>;
}

export function SiteHeader() {
  return <header className="site-header"><div className="wrap header-row">
    <Brand eager />
    <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(({href,label}) => <Link key={href} href={href}>{label}</Link>)}</nav>
    <Link className="button primary header-cta" href="/contact">Discuss Your Project <span aria-hidden="true">↗</span></Link>
    <details className="mobile-nav"><summary>Menu</summary><nav aria-label="Mobile navigation">{[{href:'/',label:'Home'},...navigation].map(({href,label}) => <Link key={href} href={href}>{label}</Link>)}</nav></details>
  </div></header>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="wrap footer-row">
    <div><Brand /><p>{company.name}</p><p className="muted">{company.tagline}</p></div>
    <nav aria-label="Footer navigation">{navigation.map(({href,label}) => <Link key={href} href={href}>{label}</Link>)}</nav>
    <a className="text-link" href={company.facebook}>Facebook <span aria-hidden="true">↗</span></a>
  </div></footer>;
}
