import Image from 'next/image';
import { Eyebrow, PageIntro, ProjectCta, ProjectGrid } from '@/components/Sections';
import { siteOrigin } from '@/content/site';

export const metadata = { title: 'Projects', description: 'See Prime Stallion’s home construction and renovation projects, with photos and the scope of work for each job.', alternates: { canonical: siteOrigin ? '/projects' : undefined } };

const localReview = process.env.LOCAL_PROJECT_REVIEW === 'true' && !process.env.VERCEL;
const reviewProjects = [
  { slug: 'amaia-scape-general-trias', name: 'Amaia Scape General Trias', alt: 'Home interior with staircase and kitchen', note: 'Confirm the renovation or extension scope and project status.' },
  { slug: 'caloocan', name: 'Caloocan Project', alt: 'Tiled bathroom with shower and toilet', note: 'Confirm Prime Stallion’s renovation scope. Keep renders and landscaping separate.' },
  { slug: 'darkberry', name: 'Darkberry Café', alt: 'Café interior with counter and seating', note: 'Existing records credit A.M. Builders. Confirm Prime Stallion’s role and the correct credit before listing it publicly.' },
  { slug: 'makati', name: 'Makati Project', alt: 'Kitchen with counter and cabinetry', note: 'Confirm the project type, Prime Stallion’s role, and completion status.' },
  { slug: 'ridgeview-nuvali', name: 'Ridgeview Nuvali', alt: 'Paved walkway beside a raised planter', note: 'Confirm which hardscape work Prime Stallion handled and separate that from landscaping.' },
];

export default function Projects() {
  return <><PageIntro label="See how we build" title="Selected projects." body="Explore real project photos and see what Prime Stallion worked on at each property." /><div className="section light"><div className="wrap portfolio-groups">
    {localReview && <nav aria-label="Project sections" className="actions"><a className="text-link" href="#build">Build</a><a className="text-link" href="#renovate">Renovate</a><a className="text-link" href="#project-review">Other projects · 5 to review</a></nav>}
    <section id="build" aria-labelledby="build-projects-title"><div className="section-heading"><div><Eyebrow>New construction</Eyebrow><h2 id="build-projects-title">Build projects</h2></div></div><ProjectGrid category="build" /></section>
    <section id="renovate" aria-labelledby="renovation-projects-title"><div className="section-heading"><div><Eyebrow>Existing properties</Eyebrow><h2 id="renovation-projects-title">Renovation projects</h2></div></div><ProjectGrid category="renovate" /></section>
    {localReview && <section id="project-review" aria-labelledby="project-review-title"><div className="section-heading"><div><Eyebrow>Local preview only</Eyebrow><h2 id="project-review-title">Other projects for review</h2></div></div>
      <p>These photos are for checking project scope and credits. They are not public case studies yet.</p>
      <ul className="project-grid review-projects">{reviewProjects.map(project => <li key={project.slug} className="project-card"><div className="project-image"><Image src={`/local-project-review/${project.slug}.webp`} alt={project.alt} fill sizes="(max-width:560px) 100vw, (max-width:850px) 50vw, 33vw" unoptimized /></div><div className="project-info"><h3>{project.name}</h3><p>{project.note}</p></div></li>)}</ul>
    </section>}
  </div></div><ProjectCta /></>;
}
