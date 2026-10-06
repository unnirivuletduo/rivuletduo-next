import Cursor from '@/components/Cursor';
import Loader from '@/components/Loader';
import GlobalParticles from '@/components/GlobalParticles';
import Navbar from '@/components/Navbar';
import Banner from '@/components/Banner';
import Services from '@/components/Services';
import Work from '@/components/Work';
import Process from '@/components/Process';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { getHomeContentData, getServicesPageData, getWorkPageData } from '@/lib/cms';
import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

const TITLE = 'Software Development Company in New Zealand | Rivuletduo';
const DESCRIPTION = 'Rivuletduo is a New Zealand software development company building custom software, websites, mobile apps and online stores, with SEO built in.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/', siteName: SITE.name, locale: 'en_NZ', type: 'website' },
  twitter: { card: 'summary', title: TITLE, description: DESCRIPTION },
};

// Tells search engines who the company is, where it's based and what it offers.
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/rivulet-logo.svg`,
  email: SITE.email,
  ...(SITE.phone ? { telephone: SITE.phone } : {}),
  foundingDate: String(SITE.foundedYear),
  description: DESCRIPTION,
  address: { '@type': 'PostalAddress', addressLocality: SITE.city, addressRegion: SITE.city, addressCountry: 'NZ' },
  areaServed: ['NZ', 'AU', 'US', 'GB'],
  knowsAbout: ['Custom software development', 'Web application development', 'Website design', 'Mobile app development', 'E-commerce development', 'Search engine optimisation', 'UI/UX design'],
};

export default async function Home() {
  const [homeContent, servicesContent, workContent] = await Promise.all([
    getHomeContentData(),
    getServicesPageData(),
    getWorkPageData(),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <Cursor />
      <Loader />
      <GlobalParticles />
      <div id="cin"><div id="cin-num"></div></div>
      <div id="counter">
        PHASE <b id="cnum">—</b>{' '}
        <span style={{ opacity: 0.35 }}>/ 04</span>
      </div>
      <Navbar />
      <Banner content={homeContent.banner} />
      <Services items={servicesContent ?? undefined} />
      <Work items={workContent ?? undefined} />
      <Process stepsData={homeContent.process} />
      <Testimonials items={homeContent.testimonials} />
      <Contact />
      <Footer />
    </>
  );
}
