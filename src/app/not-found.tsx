import Link from 'next/link';
import { Eyebrow } from '@/components/Sections';

export default function NotFound() {
  return <section className="page-intro"><div className="wrap"><Eyebrow>404 / Page not found</Eyebrow><h1>That page isn’t here.</h1><p className="lead">Return to the homepage or take a look at the projects in our portfolio.</p><div className="actions"><Link href="/" className="button primary">Back to Home</Link><Link href="/projects" className="button outline">View Projects</Link></div></div></section>;
}
