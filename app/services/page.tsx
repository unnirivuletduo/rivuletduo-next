import type { Metadata } from 'next';
import './services.css';
import ServicesPage from '@/components/ServicesPage';
import { getServicesPageData } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Software Development, Web Design & SEO Services | Rivuletduo',
  description: 'Custom software, web and mobile app development, e-commerce, web design, branding and SEO from Rivuletduo, a New Zealand software development company.',
  alternates: { canonical: '/services' },
};

export default async function ServicesRoute() {
  const categories = await getServicesPageData();
  return <ServicesPage categories={categories ?? undefined} />;
}
