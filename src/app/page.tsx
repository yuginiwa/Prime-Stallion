import Image from 'next/image';
import Link from 'next/link';
import { Eyebrow, ProjectCta, ProjectGrid, ServiceCard } from '@/components/Sections';
import { photoPath, projects } from '@/content/projects';
import { company, services, siteOrigin } from '@/content/site';

export const metadata = { alternates: { canonical: siteOrigin ? '/' : undefined } };

export default function Home() {
  const featured = projects.find(project => project.slug === 'carmona-renovation') ?? projects[0];
  return <div className="home-page">
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-photo">
        <Image src={photoPath(featured.slug, featured.photos[0].file)} alt={featured.photos[0].alt} fill sizes="100vw" preload />
      </div>
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <Eyebrow>Residential construction & renovation</Eyebrow>
          <h1 id="hero-title">Building Strength. <span>Creating Legacy.</span></h1>
          <p className="lead">Planning a new home or a major renovation in Cavite? See what we worked on, then tell us what you’re planning.</p>
          <div className="actions"><Link className="button primary" href="/contact">Discuss Your Project <span aria-hidden="true">↗</span></Link><Link className="button outline" href="/projects">View Our Work</Link></div>
        </div>
        <div className="hero-credit">
          <span>Featured project</span>
          <Link href={`/projects/${featured.slug}`}>{featured.title} · {featured.location} <b aria-hidden="true">↗</b></Link>
        </div>
      </div>
    </section>
    <section id="services" aria-labelledby="services-title" className="section wrap"><div className="section-heading"><div><Eyebrow>Our services</Eyebrow><h2 id="services-title">Build. Renovate. Develop.</h2></div><p>Choose the service that fits your project, from a new home or renovation to housing and site development.</p></div><div className="service-grid service-grid-three">{services.map(service => <ServiceCard service={service} key={service.id} />)}</div></section>
    <section className="section light"><div className="wrap"><div className="section-heading"><div><Eyebrow>See how we build</Eyebrow><h2>Selected projects.</h2></div><Link className="text-link" href="/projects">All Projects <span aria-hidden="true">↗</span></Link></div><ProjectGrid limit={3} />
      {process.env.LOCAL_PROJECT_REVIEW === 'true' && !process.env.VERCEL && <Link className="text-link home-review-link" href="/projects#project-review">Preview more projects from Materials for Posting <span aria-hidden="true">↗</span></Link>}
    </div></section>
    <section className="section wrap about-strip"><div><Eyebrow>Company profile</Eyebrow><h2>About Prime Stallion.</h2></div><div><p>{company.name} works with clients planning new homes, renovations, and site development. Our project profiles show the work we handled so you can see what’s relevant to your own plans.</p><Link className="text-link" href="/about">About the Company <span aria-hidden="true">↗</span></Link></div></section>
    <ProjectCta />
  </div>;
}
