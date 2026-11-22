import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { QuotationBuilder } from './QuotationBuilder';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {title:'Quotation builder',robots:{index:false,follow:false}};

export default function QuotationsPage() {
  if (process.env.VERCEL || (process.env.NODE_ENV !== 'development' && process.env.ENABLE_QUOTATIONS_DEV !== '1')) notFound();
  return <QuotationBuilder />;
}
