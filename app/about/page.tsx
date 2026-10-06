import type { Metadata } from 'next';
import './about.css';
import AboutPage from '@/components/AboutPage';
import { getAboutContentData } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'About Rivuletduo | Software Development Company in New Zealand',
  description: 'Rivuletduo is a New Zealand software development company, founded in 2021, building custom software, websites, mobile apps and online stores for clients worldwide.',
  alternates: { canonical: '/about' },
};

export default async function AboutRoute() {
  const content = await getAboutContentData();
  return <AboutPage content={content} />;
}
