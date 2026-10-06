import type { Metadata } from 'next';
import './work.css';
import WorkPage from '@/components/WorkPage';
import { getWorkPageData } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Our Work | Websites, E-Commerce & Software Projects | Rivuletduo',
  description: 'Selected projects by Rivuletduo, a New Zealand software development company — including the Grab A Rental Car and Event Display booking platforms, the NZ Motorcycle Movers tracking system, the Unique Movers website, the Baby Cart online store, the Bworth and Craft Shed outdoor living websites, the Earthy eco products catalogue, the Unicorn Accounting and The Concreator websites, and the Brand Alchemy agency website.',
  alternates: { canonical: '/work' },
};

export default async function WorkRoute() {
  const works = await getWorkPageData();
  return <WorkPage works={works ?? undefined} />;
}
