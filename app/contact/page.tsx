import type { Metadata } from 'next';
import './contact.css';
import ContactPage from '@/components/ContactPage';

export const metadata: Metadata = {
  title: 'Contact — Rivuletduo',
  description: 'Get in touch with Rivuletduo about your next web, design, or product project.',
};

export default function ContactRoute() {
  return <ContactPage />;
}
