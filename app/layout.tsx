import type { Metadata } from 'next';
import ProjectBriefModal from '@/components/ProjectBriefModal';
import { SITE } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: 'Rivuletduo — Software Development Company',
  description: 'Rivuletduo is a New Zealand software development company building custom software, websites, mobile apps and online stores, with SEO built in.',
  openGraph: { siteName: SITE.name, locale: 'en_NZ', type: 'website' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NZ">
      <body>
        {children}
        <ProjectBriefModal />
      </body>
    </html>
  );
}
