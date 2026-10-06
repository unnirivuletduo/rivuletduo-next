import type { Metadata } from 'next';
import './contact.css';
import ContactPage from '@/components/ContactPage';
import { getContactPageData } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Contact Rivuletduo | Software Development in Auckland, New Zealand',
  description: 'Talk to Rivuletduo about custom software, websites, mobile apps, e-commerce or SEO. Based in Auckland, New Zealand, working with clients worldwide. Reply within 24 hours.',
  alternates: { canonical: '/contact' },
};

export default async function ContactRoute() {
  const content = await getContactPageData();
  return <ContactPage content={content} />;
}
