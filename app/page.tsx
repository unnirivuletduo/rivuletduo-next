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

export default function Home() {
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
      <Banner />
      <Services />
      <Work />
      <Process />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}
