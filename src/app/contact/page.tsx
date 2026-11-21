import { Suspense } from 'react';
import { InquiryMessage } from '@/components/InquiryMessage';
import { PageIntro } from '@/components/Sections';
import { company, siteOrigin } from '@/content/site';

export const metadata = { title: 'Discuss Your Project', description: 'Contact Prime Stallion about construction, renovation, or development. Share your municipality and scope to get started.', alternates: { canonical: siteOrigin ? '/contact' : undefined } };

export default function Contact() {
  return <><PageIntro label="Contact" title="Discuss your project." body="Planning a new build, renovation, or development project? Tell us where the property is and what you have in mind so we can discuss the next step." />
    <section className="section wrap contact-grid"><div><h2>What to send</h2><ol><li><strong>Service:</strong> BUILD for a new home, RENOVATE for an existing property, or DEVELOP for housing or site infrastructure.</li><li><strong>Location:</strong> Your city or municipality is enough to start.</li><li><strong>Scope:</strong> Tell us what you want to build, renovate, or develop. Add your target start and whether plans are ready, if known.</li></ol></div>
    <div className="contact-panel"><h2>Message the team</h2><p>Copy the template, then edit and send it in Messenger.</p><Suspense fallback={<a className="button primary" href={company.messenger}>Open Messenger</a>}><InquiryMessage /></Suspense><br/><a className="text-link" href={company.facebook}>Visit our Facebook Page <span aria-hidden="true">↗</span></a></div></section></>;
}
