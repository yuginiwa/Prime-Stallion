import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Eyebrow } from '@/components/Sections';
import { projects, photoPath } from '@/content/projects';
import { siteOrigin } from '@/content/site';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => projects.map(({slug}) => ({slug}));

export async function generateMetadata({params}: Props) {
  const {slug} = await params;
  const selected = projects.find(p => p.slug === slug);
  if (!selected) return {};
  return { title: `${selected.title} — ${selected.location}`, description: selected.description, alternates: { canonical: siteOrigin ? `/projects/${slug}` : undefined }, ...(siteOrigin ? {openGraph:{title:selected.title,description:selected.description,images:[photoPath(slug,selected.photos[0].file)]}} : {}) };
}

export default async function CaseStudy({params}: Props) {
  const {slug} = await params;
  const project = projects.find(p => p.slug === slug);
  if (!project) notFound();
  const [cover, ...details] = project.photos;
  return <><section className="page-intro"><div className="wrap detail-layout"><div><Link className="text-link back-link" href="/projects">← All Projects</Link><Eyebrow>{project.location} / {project.category === 'build' ? 'Build' : 'Renovate'}</Eyebrow><h1>{project.title}</h1><p className="lead">{project.description}</p><p className="detail-meta">{project.status}</p></div><div className="detail-cover"><Image src={photoPath(slug,cover.file)} alt={cover.alt} fill sizes="(max-width:850px) 100vw, 50vw" preload /></div></div></section>
    <section className="section light"><div className="wrap"><h2>Project scope</h2><ul className="scope-list">{project.scope.map(scope => <li key={scope}>{scope}</li>)}</ul><div className="photo-grid">{details.map(photo => <figure key={photo.file}><div className="gallery-photo"><Image src={photoPath(slug,photo.file)} alt={photo.alt} fill sizes="(max-width:560px) 100vw, 50vw" /></div><figcaption>{photo.caption}</figcaption></figure>)}</div></div></section>
    <section className="closing"><div className="wrap closing-row"><div><Eyebrow>{project.category === 'build' ? 'Planning a new home?' : 'Planning your own renovation?'}</Eyebrow><h2>Tell us about it.</h2></div><Link className="button primary" href={`/contact?service=${project.category}`}>Discuss a Similar Project <span aria-hidden="true">↗</span></Link></div></section></>;
}
