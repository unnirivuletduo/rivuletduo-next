import type { Metadata } from 'next';
import './service-detail.css';
import ServiceDetailPage from '@/components/ServiceDetailPage';

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props): Metadata {
  const title = params.slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
  return {
    title: `${title} — Rivuletduo`,
    description: `Detailed service page for ${title} by Rivuletduo.`,
  };
}

export default function ServiceDetailRoute({ params }: Props) {
  return <ServiceDetailPage slug={params.slug} />;
}
