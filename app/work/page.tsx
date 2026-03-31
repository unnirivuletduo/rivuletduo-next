import type { Metadata } from 'next';
import './work.css';
import WorkPage from '@/components/WorkPage';

export const metadata: Metadata = {
  title: 'Work — Rivuletduo',
  description: 'Selected Rivuletduo projects across e-commerce, SaaS, brand, fintech, and platform products.',
};

export default function WorkRoute() {
  return <WorkPage />;
}
