import type { Metadata } from 'next';
import './contact.css';
import ContactPage from '@/components/ContactPage';
import { getContactPageData } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Contact — Rivuletduo',
  description: 'Get in touch with Rivuletduo about your next web, design, or product project.',
};

export default async function ContactRoute() {
  const content = await getContactPageData();
  return <ContactPage content={content} />;
}
