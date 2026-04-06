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

export default async function Home() {
  const [homeContent, servicesContent, workContent] = await Promise.all([
    getHomeContentData(),
    getServicesPageData(),
    getWorkPageData(),
  ]);

  return (
    <>
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
