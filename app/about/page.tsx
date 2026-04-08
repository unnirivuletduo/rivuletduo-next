import type { Metadata } from 'next';
import './about.css';
import AboutPage from '@/components/AboutPage';
import { getAboutContentData } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'About — Rivuletduo',
  description: 'Learn about Rivuletduo, our story, principles, and the team behind our web experiences.',
};

export default async function AboutRoute() {
  const content = await getAboutContentData();
  return <AboutPage content={content} />;
}
