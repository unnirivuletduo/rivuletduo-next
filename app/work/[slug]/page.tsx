import type { Metadata } from 'next';
import './work-detail.css';
import WorkDetailPage from '@/components/WorkDetailPage';

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props): Metadata {
  const title = params.slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
  return {
    title: `${title} — Rivuletduo`,
    description: `Case study for ${title} by Rivuletduo.`,
  };
}

export default function WorkDetailRoute({ params }: Props) {
  return <WorkDetailPage slug={params.slug} />;
}
