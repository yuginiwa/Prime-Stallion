"use client";

import { useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { company, services } from '@/content/site';

export function InquiryMessage() {
  const serviceId = useSearchParams().get('service');
  const service = services.find(({id}) => id === serviceId);
  const name = service?.name.toUpperCase() ?? 'BUILD, RENOVATE, or DEVELOP';
  const details = service?.inquiry ?? 'We’re planning [a short description of the work].';
  const message = `${name} — [City or municipality]. ${details} Our target start is [month, if known].`;
  const field = useRef<HTMLTextAreaElement>(null);
  const [feedback, setFeedback] = useState('');

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setFeedback('Message copied.');
    } catch {
      field.current?.focus();
      field.current?.select();
      setFeedback('Message selected. Use your device’s copy command.');
    }
  }

  return <><label htmlFor="inquiry-template">Message template</label><textarea id="inquiry-template" ref={field} value={message} readOnly rows={4} /><button className="button outline" type="button" onClick={copyMessage}>Copy Message</button><p role="status" className="feedback">{feedback}</p><a className="button primary" href={company.messenger}>Open Messenger <span aria-hidden="true">↗</span></a></>;
}
