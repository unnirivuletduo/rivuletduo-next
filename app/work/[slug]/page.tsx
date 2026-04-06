import type { Metadata } from 'next';
import './work-detail.css';
import WorkDetailPage from '@/components/WorkDetailPage';
import { getWorkDetailsData } from '@/lib/cms';

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

export default async function WorkDetailRoute({ params }: Props) {
  const projects = await getWorkDetailsData();
  return <WorkDetailPage slug={params.slug} projects={projects ?? undefined} />;
}
