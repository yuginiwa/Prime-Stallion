import Image from 'next/image';
import Link from 'next/link';
import { type Service } from '@/content/site';
import { photoPath, projects } from '@/content/projects';

export function Eyebrow({ children }: {children: React.ReactNode}) { return <p className="eyebrow">{children}</p>; }

export function PageIntro({ label, title, body }: {label:string; title:string; body:string}) {
  return <section className="page-intro"><div className="wrap"><Eyebrow>{label}</Eyebrow><h1>{title}</h1><p className="lead">{body}</p></div></section>;
}

export function ServiceCard({service}: {service:Service}) {
  return <article className="service-card"><span className="service-no" aria-hidden="true">{service.number}</span><Eyebrow>{service.name}</Eyebrow><h3>{service.title}</h3><p>{service.summary}</p><Link className="text-link" href={`/services#${service.id}`}>Explore {service.name} <span aria-hidden="true">↗</span></Link></article>;
}

export function ProjectGrid({ limit, category }: { limit?: number; category?: Service['id'] }) {
  const matching = category ? projects.filter(project => project.category === category) : projects;
  return <div className="project-grid">{matching.slice(0, limit ?? matching.length).map(project => <article className="project-card" key={project.slug}><Link href={`/projects/${project.slug}`}>
    <div className="project-image"><Image src={photoPath(project.slug, project.photos[0].file)} alt={project.photos[0].alt} fill sizes="(max-width: 700px) 100vw, (max-width: 980px) 50vw, 33vw" /></div>
    <div className="project-info"><p className="project-location">{project.location} <span aria-hidden="true">/</span> {project.category === 'build' ? 'Build' : 'Renovate'}</p><h3>{project.title}</h3><span className="project-arrow" aria-hidden="true">↗</span></div>
  </Link></article>)}</div>;
}

export function ProjectCta() {
  return <section className="closing"><div className="wrap closing-row"><div><Eyebrow>Start with your project</Eyebrow><h2>What are you planning?</h2><p>Tell us where the property is and what you’d like to build or change.</p></div><Link className="button primary" href="/contact">Discuss Your Project <span aria-hidden="true">↗</span></Link></div></section>;
}
