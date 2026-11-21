import Link from 'next/link';
import { Eyebrow, PageIntro } from '@/components/Sections';
import { services, siteOrigin } from '@/content/site';
import { projects } from '@/content/projects';

export const metadata = { title: 'Build, Renovate & Develop', description: 'Explore Prime Stallion’s design-build, residential renovation, hardscaping, housing development and site infrastructure services.', alternates: { canonical: siteOrigin ? '/services' : undefined } };

export default function Services() {
  return <><PageIntro label="Our services" title="Build. Renovate. Develop." body="From a new home or condo renovation to roads and stormwater drainage, see where Prime Stallion can help and what to share when you inquire." />
    <div className="section wrap service-grid service-grid-three">{services.map(service => <section className="service-card service-detail" key={service.id} id={service.id}>
      <Eyebrow>{service.name}</Eyebrow><h2>{service.title}</h2><p>{service.summary}</p><h3>Services include</h3><ul>{service.scope.map(item => <li key={item}>{item}</li>)}</ul>{service.id === 'build' && <p>For design-build projects, confirm which drawings and disciplines are included. Plans are signed and sealed by the appropriate licensed professionals.</p>}<h3>What to share first</h3><ul>{service.points.map(point => <li key={point}>{point}</li>)}</ul><div className="service-actions">
        <Link className="button primary" href={`/contact?service=${service.id}`}>{service.cta} <span aria-hidden="true">↗</span></Link>
        {projects.some(project => project.category === service.id) && <Link className="text-link" href={`/projects#${service.id}`}>{service.id === 'renovate' ? 'View Renovation Projects' : `View ${service.name} Projects`} <span aria-hidden="true">↗</span></Link>}
      </div>
    </section>)}</div></>;
}
