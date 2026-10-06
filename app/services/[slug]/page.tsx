import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import './service-detail.css';
import ServiceDetailPage from '@/components/ServiceDetailPage';
import { getServiceDetailsData } from '@/lib/cms';
import { fallbackServiceDetails } from '@/lib/details-data';

type Props = { params: { slug: string } };

async function findService(slug: string) {
  const services = await getServiceDetailsData();
  const list = services && services.length > 0 ? services : fallbackServiceDetails;
  return { services, service: list.find((s) => s.slug === slug) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service } = await findService(params.slug);
  if (!service) return {};
  return {
    title: `${service.title} ${service.titleEm} | Rivuletduo NZ`,
    description: service.tagline,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailRoute({ params }: Props) {
  const { services, service } = await findService(params.slug);
  if (!service) notFound();
  return <ServiceDetailPage slug={params.slug} services={services ?? undefined} />;
}
