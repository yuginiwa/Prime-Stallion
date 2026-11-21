import { PageIntro, ProjectCta } from '@/components/Sections';
import { company, siteOrigin } from '@/content/site';

export const metadata = { title: 'About the Company', description: 'Get to know Prime Stallion Construction and Development Inc. and its residential focus in Cavite.', alternates: { canonical: siteOrigin ? '/about' : undefined } };

export default function About() {
  return <><PageIntro label="Company profile" title="About Prime Stallion." body={company.name} />
    <section className="wrap section body-copy"><h2>What we do</h2><p className="lead">Prime Stallion works with clients planning new homes, home and condo renovations, housing development, and site infrastructure.</p><p>Our portfolio describes our role and the scope of each job, from second-floor renovations to interior and exterior improvements.</p><p>When you get in touch, share your municipality, the work you have in mind, and whether you already have plans. We can then discuss whether the project is a fit and what information is needed next.</p></section><ProjectCta /></>;
}
