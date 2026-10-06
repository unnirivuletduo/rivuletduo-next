import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import './work-detail.css';
import WorkDetailPage from '@/components/WorkDetailPage';
import { getWorkDetailsData } from '@/lib/cms';
import { fallbackWorkDetails } from '@/lib/details-data';

type Props = { params: { slug: string } };

async function findProject(slug: string) {
  const projects = await getWorkDetailsData();
  const list = projects && projects.length > 0 ? projects : fallbackWorkDetails;
  return { projects, project: list.find((p) => p.slug === slug) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { project } = await findProject(params.slug);
  if (!project) return {};
  return {
    title: `${project.shortName} Case Study | Rivuletduo`,
    description: project.tagline,
    alternates: { canonical: `/work/${project.slug}` },
  };
}

export default async function WorkDetailRoute({ params }: Props) {
  const { projects, project } = await findProject(params.slug);
  if (!project) notFound();
  return <WorkDetailPage slug={params.slug} projects={projects ?? undefined} />;
}
