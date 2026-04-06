import type { Metadata } from 'next';
import './work.css';
import WorkPage from '@/components/WorkPage';
import { getWorkPageData } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Work — Rivuletduo',
  description: 'Selected Rivuletduo projects across e-commerce, SaaS, brand, fintech, and platform products.',
};

export default async function WorkRoute() {
  const works = await getWorkPageData();
  return <WorkPage works={works ?? undefined} />;
}
