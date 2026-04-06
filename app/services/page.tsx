import type { Metadata } from 'next';
import './services.css';
import ServicesPage from '@/components/ServicesPage';
import { getServicesPageData } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Services — Rivuletduo',
  description: 'Explore Rivuletduo services across design, development, branding, SEO, animation, and 3D experiences.',
};

export default async function ServicesRoute() {
  const categories = await getServicesPageData();
  return <ServicesPage categories={categories ?? undefined} />;
}
