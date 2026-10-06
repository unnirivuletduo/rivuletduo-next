'use client';

import { useEffect, useState } from 'react';
import Cursor from '@/components/Cursor';
import type { ServiceDetail as CmsServiceDetail } from '@/lib/cms';
import Footer from '@/components/Footer';
import { yearsInBusiness } from '@/lib/site';
import { fallbackServiceDetails as services } from '@/lib/details-data';
import { serviceContent, defaultServiceContent, type Heading } from '@/lib/service-content';

const FEATURE_ICONS = [
  <svg key="icon-0" viewBox="0 0 40 40"><rect x="3" y="6" width="34" height="24" rx="2" /></svg>,
  <svg key="icon-1" viewBox="0 0 40 40"><rect x="4" y="6" width="22" height="28" rx="2" /></svg>,
  <svg key="icon-2" viewBox="0 0 40 40"><circle cx="20" cy="20" r="12" /></svg>,
  <svg key="icon-3" viewBox="0 0 40 40"><path d="M8 32l8-10 6 6 8-12 6 8" /></svg>,
  <svg key="icon-4" viewBox="0 0 40 40"><path d="M12 28V16a8 8 0 0116 0v12" /></svg>,
  <svg key="icon-5" viewBox="0 0 40 40"><path d="M6 20L14 12 20 18 26 10 34 20" /></svg>,
];

function HeadingText({ h }: { h: Heading }) {
  return <>{h[0]}<i>{h[1]}</i>{h[2] ?? ''}</>;
}

type ServiceData = {
  slug: string;
  title: string;
  titleEm: string;
  badge: string;
  num: string;
  tagline: string;
};


function getService(slug: string, list: ServiceData[]) {
  return list.find((s) => s.slug === slug) || list[0];
}

type ServiceDetailPageProps = {
  slug: string;
  services?: CmsServiceDetail[];
};

export default function ServiceDetailPage({ slug, services: cmsServices }: ServiceDetailPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const serviceCatalog = (cmsServices && cmsServices.length > 0 ? cmsServices : services) as ServiceData[];
  const service = getService(slug, serviceCatalog);
  const content = serviceContent[service.slug] ?? defaultServiceContent;
  const related = content.related
    .map((r) => serviceCatalog.find((x) => x.slug === r))
    .filter((x): x is ServiceData => Boolean(x));

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    const onScroll = () => {
      document.getElementById('sd-nav')?.classList.toggle('stuck', window.scrollY > 60);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const fill = document.getElementById('ppFill');
      if (fill) fill.style.height = `${(window.scrollY / (h || 1)) * 100}%`;
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    cleanups.push(() => window.removeEventListener('scroll', onScroll));

    const ioRv = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('on');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.rv').forEach((el) => ioRv.observe(el));
    cleanups.push(() => ioRv.disconnect());

    const stagger = (selector: string, cls: string, stepMs: number) => {
      const list = Array.from(document.querySelectorAll(selector));
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            list.forEach((el, i) => setTimeout(() => el.classList.add(cls), i * stepMs));
            io.disconnect();
          }
        });
      }, { threshold: 0.1 });
      const first = list[0];
      if (first) io.observe(first);
      cleanups.push(() => io.disconnect());
    };

    stagger('.feat-card', 'visible', 80);
    stagger('.tech-item', 'visible', 60);
    stagger('.proc-step-item', 'visible', 100);

    let disposed = false;
    const initThree = async () => {
      const THREE = await import('three');
      if (disposed) return;
      const section = document.querySelector('.service-hero') as HTMLElement | null;
      const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement | null;
      if (!section || !canvas) return;

      const W = () => section.clientWidth;
      const H = () => section.clientHeight;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setClearColor(0xffffff, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(58, W() / H(), 0.1, 200);
      camera.position.set(0, 8, 28);
      camera.lookAt(0, 0, 0);

      const resize = () => {
        renderer.setSize(W(), H());
        camera.aspect = W() / H();
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener('resize', resize);

      scene.add(new THREE.AmbientLight(0xffffff, 1));
      const dl = new THREE.DirectionalLight(0x16a34a, 2); dl.position.set(10, 14, 8); scene.add(dl);

      const gGeo = new THREE.PlaneGeometry(80, 50, 32, 20);
      const gMat = new THREE.MeshBasicMaterial({ color: 0xbbf7d0, wireframe: true, transparent: true, opacity: 0.45 });
      const grid = new THREE.Mesh(gGeo, gMat);
      grid.rotation.x = -Math.PI / 2.2;
      grid.position.y = -6;
      scene.add(grid);

      const knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(5, 1.2, 80, 8),
        new THREE.MeshPhongMaterial({ color: 0xd1fae5, emissive: 0xf0fdf4, wireframe: true, transparent: true, opacity: 0.3 }),
      );
      knot.position.set(16, -1, -4);
      scene.add(knot);

      const pCount = 120;
      const pPos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        pPos[i * 3] = (Math.random() - 0.5) * 70;
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 28;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 6;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x22c55e, size: 0.22, transparent: true, opacity: 0.5 })));

      const gPos = gGeo.attributes.position as any;
      const origY = new Float32Array(gPos.count);
      for (let i = 0; i < gPos.count; i++) origY[i] = gPos.getY(i);

      const clock = new THREE.Clock();
      let mx = 0, my = 0;
      const onMove = (e: MouseEvent) => {
        mx = (e.clientX / window.innerWidth) * 2 - 1;
        my = -((e.clientY / window.innerHeight) * 2 - 1);
      };
      document.addEventListener('mousemove', onMove);

      let raf = 0;
      const animate = () => {
        raf = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        for (let i = 0; i < gPos.count; i++) {
          const x = gPos.getX(i), z = gPos.getZ(i);
          gPos.setY(i, origY[i] + Math.sin(x * 0.18 + t * 0.4) * 0.8 + Math.sin(z * 0.24 + t * 0.35) * 0.6);
        }
        gPos.needsUpdate = true;
        gGeo.computeVertexNormals();
        knot.rotation.y = t * 0.07;
        knot.rotation.x = t * 0.04;
        camera.position.x += (mx * 3 - camera.position.x) * 0.04;
        camera.position.y += (my * 1.5 + 8 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      };
      animate();

      cleanups.push(() => {
        cancelAnimationFrame(raf);
        document.removeEventListener('mousemove', onMove);
        window.removeEventListener('resize', resize);
        renderer.dispose();
      });
    };

    initThree();

    return () => {
      disposed = true;
      cleanups.forEach((fn) => fn());
    };
  }, [slug]);

  return (
    <>
      <Cursor />
      <div className="page-progress"><div className="pp-fill" id="ppFill" /></div>

      <nav id="sd-nav">
        <a href="/" className="logo" aria-label="Rivuletduo home"><img src="/rivulet-logo.svg" alt="Rivuletduo" className="brand-logo" /></a>
        <ul className="nav-links">
          <li><a href="/services" className="active">Services</a></li>
          <li><a href="/work">Work</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        <a href="#project" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event("open-project-modal")); }} className="nav-btn">Start a Project</a>
        <button className={`nav-toggle ${menuOpen ? 'open' : ''}`} aria-label="Toggle menu" aria-expanded={menuOpen} aria-controls="service-detail-mobile-menu" onClick={() => setMenuOpen((v) => !v)}>
          <span />
          <span />
          <span />
        </button>
        <div id="service-detail-mobile-menu" className={`nav-mobile-menu ${menuOpen ? 'open' : ''}`}>
          <a href="/services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="/work" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="/about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="/contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <a href="#project" onClick={(e) => { e.preventDefault(); setMenuOpen(false); window.dispatchEvent(new Event("open-project-modal")); }}>Start a Project</a>
        </div>
      </nav>

      <div className="breadcrumb">
        <a href="/">Home</a>
        <span className="bc-sep">/</span>
        <a href="/services">Services</a>
        <span className="bc-sep">/</span>
        <span>{service.title} {service.titleEm}</span>
      </div>

      <section className="service-hero">
        <canvas id="hero-canvas" />
        <div className="hero-vignette" />
        <div className="hero-vignette-bottom" />
        <div className="hero-inner">
          <div className="hero-left">
            <div className="service-badge"><span className="service-badge-dot" />{service.badge} · {service.num}</div>
            <h1>{service.title}<br /><i>{service.titleEm}</i></h1>
            <p className="hero-tagline">{service.tagline}</p>
            <div className="hero-meta">
              <div className="hero-meta-item"><span className="hero-meta-num">{yearsInBusiness()}yr</span><span className="hero-meta-label">Experience</span></div>
              <div className="hero-divider" />
              <div className="hero-meta-item"><span className="hero-meta-num">4+</span><span className="hero-meta-label">Countries Served</span></div>
              <div className="hero-divider" />
              <div className="hero-meta-item"><span className="hero-meta-num">NZ</span><span className="hero-meta-label">Based</span></div>
            </div>
            <div className="hero-btns"><a href="#project" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event("open-project-modal")); }} className="btn-g">Start this project</a><a href="/services" className="btn-ghost">All services</a></div>
          </div>

          <div className="hero-visual">
            <div className="hero-visual-card">
              <div className="hvc-label">Service {service.num} — {service.badge}</div>
              <div className="hvc-icon"><svg viewBox="0 0 80 80"><rect x="6" y="12" width="68" height="46" rx="3" /><path d="M6 26h68" /><circle cx="15" cy="19" r="3" /><circle cx="24" cy="19" r="3" /><circle cx="33" cy="19" r="3" /><rect x="14" y="34" width="22" height="16" rx="1" /><line x1="44" y1="34" x2="66" y2="34" /><line x1="44" y1="40" x2="66" y2="40" /><line x1="44" y1="46" x2="58" y2="46" /><path d="M14 58l6 10h44l6-10" /></svg></div>
              <div className="hvc-name">{service.title} {service.titleEm}</div>
              <div className="hvc-desc">{content.cardDesc}</div>
              <div className="hvc-tags">{content.cardTags.map((t) => <span className="hvc-tag" key={t}>{t}</span>)}</div>
              <div className="hvc-num">{service.num}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="overview rv">
        <div><div className="ov-label">Overview</div><h2><HeadingText h={content.overviewHeading} /></h2></div>
        <div className="overview-body">
          {content.overview.map((para) => <p key={para}>{para}</p>)}
          <div className="overview-quote">&quot;{content.quote}&quot;</div>
        </div>
      </div>

      <section className="features-section">
        <div className="section-label rv">What&apos;s included</div>
        <h2 className="rv"><HeadingText h={content.featuresHeading} /></h2>
        <div className="feat-grid">
          {content.features.map((f, i) => (
            <div className="feat-card" key={f.title}><div className="feat-icon">{FEATURE_ICONS[i % FEATURE_ICONS.length]}</div><h4>{f.title}</h4><p>{f.desc}</p></div>
          ))}
        </div>
      </section>

      <section className="process-section">
        <div className="proc-inner">
          <div className="proc-head rv"><div className="label">How we work</div><h2><HeadingText h={content.processHeading} /></h2></div>
          <div className="proc-steps">
            {content.process.map((step) => (
              <div className="proc-step-item" key={step.title}><div className="psi-num"><div className="psi-dot" /></div><div className="psi-content"><h4>{step.title}</h4><p>{step.desc}</p></div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="tech-section">
        <div className="section-label rv">Technologies</div>
        <h2 className="rv">Tools we <i>build with</i></h2>
        <div className="tech-grid">
          {content.tech.map((t) => (
            <div className="tech-item" key={t.name}><div className="tech-dot" /><div className="tech-name">{t.name}</div><div className="tech-role">{t.role}</div></div>
          ))}
        </div>
      </section>

      <section className="related-section">
        <div className="section-label rv">Related services</div>
        <h2 className="rv">You might also <i>need</i></h2>
        <div className="related-grid">
          {related.map((r) => (
            <a href={`/services/${r.slug}`} className="rel-card rv" key={r.slug}><div className="rel-num">{r.num}</div><h4>{r.title} {r.titleEm}</h4><p>{(serviceContent[r.slug] ?? defaultServiceContent).cardDesc}</p><div className="rel-arrow">Explore <svg viewBox="0 0 12 12"><path d="M1 11L11 1M1 1h10v10" /></svg></div></a>
          ))}
        </div>
      </section>

      <div className="page-cta">
        <h2>{content.ctaHeading[0]}<br /><i>{content.ctaHeading[1]}</i></h2>
        <div className="cta-btns"><a href="#project" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event("open-project-modal")); }} className="btn-g">Start this project</a><a href="/services" className="btn-ghost">All services</a></div>
      </div>

      <Footer id="sd-footer" />
    </>
  );
}
