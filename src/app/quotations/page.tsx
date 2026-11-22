import type { Metadata } from 'next';
import { QuotationBuilder } from './QuotationBuilder';

export const metadata: Metadata = {title:'Quotation builder',robots:{index:false,follow:false}};

export default function QuotationsPage() {
  return <QuotationBuilder />;
}
