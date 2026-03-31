import type { Metadata } from 'next';
import './services.css';
import ServicesPage from '@/components/ServicesPage';

export const metadata: Metadata = {
  title: 'Services — Rivuletduo',
  description: 'Explore Rivuletduo services across design, development, branding, SEO, animation, and 3D experiences.',
};

export default function ServicesRoute() {
  return <ServicesPage />;
}
