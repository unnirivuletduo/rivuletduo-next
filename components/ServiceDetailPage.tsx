'use client';

import { useEffect, useState } from 'react';
import Cursor from '@/components/Cursor';

type ServiceData = {
  slug: string;
  title: string;
  titleEm: string;
  badge: string;
  num: string;
  tagline: string;
};

const services: ServiceData[] = [
  { slug: 'webdesign', title: 'Web', titleEm: 'Designing', badge: 'Design & Interface', num: '01', tagline: 'Smart designs that complement your brand and help you realise your dreams — intuitive, engaging, and built for the web world.' },
  { slug: 'ui', title: 'UI', titleEm: 'Designing', badge: 'Design & Interface', num: '02', tagline: 'Flawless digital interfaces where every interaction is intentional and every screen earns its place.' },
  { slug: 'branding', title: 'Overall', titleEm: 'Branding', badge: 'Design & Identity', num: '03', tagline: 'Declare your identity to the world. Every touchpoint in your brand system, unified and memorable.' },
  { slug: 'logo', title: 'Logo', titleEm: 'Designing', badge: 'Design & Identity', num: '04', tagline: 'First impressions matter. Unique logos that set your brand apart and stay recognizable.' },
  { slug: 'webdev', title: 'Web', titleEm: 'Development', badge: 'Engineering', num: '05', tagline: 'Production-grade code built to scale, perform, and endure over time.' },
  { slug: 'mobile', title: 'Mobile App', titleEm: 'Development', badge: 'Engineering', num: '06', tagline: 'iOS, Android, and cross-platform apps that are functional, fast, and visually polished.' },
  { slug: 'ecommerce', title: 'E-Commerce', titleEm: 'Development', badge: 'Engineering', num: '07', tagline: 'Conversion-focused storefronts that look premium and sell reliably at scale.' },
  { slug: 'seo', title: 'SEO &', titleEm: 'Performance', badge: 'Growth', num: '08', tagline: 'Technical SEO and Core Web Vitals baked in from day one — maximum visibility and speed.' },
  { slug: 'animation', title: 'Animations &', titleEm: 'Motion', badge: 'Creative', num: '09', tagline: 'Motion systems that add clarity, emotion, and impact to your product story.' },
  { slug: '3d', title: '3D Animation', titleEm: '& Modeling', badge: 'Creative', num: '10', tagline: 'Immersive 3D experiences and product visuals that leave a lasting impression.' },
  { slug: 'whiteboard', title: 'Whiteboard', titleEm: 'Animation', badge: 'Creative', num: '11', tagline: 'Complex ideas explained through compelling whiteboard storytelling and voice-led flow.' },
  { slug: 'graphic', title: 'Graphic', titleEm: 'Designing', badge: 'Creative', num: '12', tagline: 'Unique, credible, and emotive graphics that reflect your brand with consistency.' },
  { slug: 'responsive', title: 'Responsive', titleEm: 'Web Design', badge: 'Design & Interface', num: '13', tagline: 'Screen size is never a blocker. Every layout adapts gracefully across devices.' },
  { slug: 'corporate', title: 'Corporate', titleEm: 'Websites', badge: 'Enterprise', num: '14', tagline: 'High-trust corporate web experiences aligned with business goals and governance needs.' },
];

function getService(slug: string) {
  return services.find((s) => s.slug === slug) || services[0];
}

export default function ServiceDetailPage({ slug }: { slug: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const service = getService(slug);

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
        <a href="/" className="logo">rivulet<b>duo</b></a>
        <ul className="nav-links">
          <li><a href="/services" className="active">Services</a></li>
          <li><a href="/work">Work</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        <a href="/contact" className="nav-btn">Start a Project</a>
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
          <a href="/contact" onClick={() => setMenuOpen(false)}>Start a Project</a>
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
              <div className="hero-meta-item"><span className="hero-meta-num">48+</span><span className="hero-meta-label">Sites Delivered</span></div>
              <div className="hero-divider" />
              <div className="hero-meta-item"><span className="hero-meta-num">100%</span><span className="hero-meta-label">Satisfaction Rate</span></div>
              <div className="hero-divider" />
              <div className="hero-meta-item"><span className="hero-meta-num">6yr</span><span className="hero-meta-label">Studio Experience</span></div>
            </div>
            <div className="hero-btns"><a href="/contact" className="btn-g">Start this project</a><a href="/services" className="btn-ghost">All services</a></div>
          </div>

          <div className="hero-visual">
            <div className="hero-visual-card">
              <div className="hvc-label">Service {service.num} — {service.badge}</div>
              <div className="hvc-icon"><svg viewBox="0 0 80 80"><rect x="6" y="12" width="68" height="46" rx="3" /><path d="M6 26h68" /><circle cx="15" cy="19" r="3" /><circle cx="24" cy="19" r="3" /><circle cx="33" cy="19" r="3" /><rect x="14" y="34" width="22" height="16" rx="1" /><line x1="44" y1="34" x2="66" y2="34" /><line x1="44" y1="40" x2="66" y2="40" /><line x1="44" y1="46" x2="58" y2="46" /><path d="M14 58l6 10h44l6-10" /></svg></div>
              <div className="hvc-name">{service.title} {service.titleEm}</div>
              <div className="hvc-desc">Professional delivery with strong design logic and measurable outcomes.</div>
              <div className="hvc-tags"><span className="hvc-tag">Figma</span><span className="hvc-tag">React</span><span className="hvc-tag">Responsive</span><span className="hvc-tag">Performance</span></div>
              <div className="hvc-num">{service.num}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="overview rv">
        <div><div className="ov-label">Overview</div><h2>Where <i>brand</i> meets the web</h2></div>
        <div className="overview-body">
          <p>Looking for a team to build your next digital experience? You are at the right place. Rivuletduo creates high-quality, intuitive interfaces that complement your brand.</p>
          <p>Using modern technology and clear product thinking, we design and build experiences that are fast, maintainable, and conversion-oriented across every screen.</p>
          <p>We treat each assignment as an opportunity to grow your online prospects and deliver tangible business impact.</p>
          <div className="overview-quote">&quot;Capable of developing high-quality, user-friendly web experiences, our team is sure to leave you amazed.&quot;</div>
        </div>
      </div>

      <section className="features-section">
        <div className="section-label rv">What&apos;s included</div>
        <h2 className="rv">Everything your site <i>needs to succeed</i></h2>
        <div className="feat-grid">
          <div className="feat-card"><div className="feat-icon"><svg viewBox="0 0 40 40"><rect x="3" y="6" width="34" height="24" rx="2" /></svg></div><h4>Custom Page Design</h4><p>No templates. Every page crafted to your brand and goals.</p></div>
          <div className="feat-card"><div className="feat-icon"><svg viewBox="0 0 40 40"><rect x="4" y="6" width="22" height="28" rx="2" /></svg></div><h4>Fully Responsive</h4><p>Pixel-perfect on desktop, tablet, and mobile devices.</p></div>
          <div className="feat-card"><div className="feat-icon"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="12" /></svg></div><h4>Interactive Elements</h4><p>Motion and interactions that keep visitors engaged longer.</p></div>
          <div className="feat-card"><div className="feat-icon"><svg viewBox="0 0 40 40"><path d="M8 32l8-10 6 6 8-12 6 8" /></svg></div><h4>SEO-Ready Structure</h4><p>Semantic architecture and performance-first foundations.</p></div>
          <div className="feat-card"><div className="feat-icon"><svg viewBox="0 0 40 40"><path d="M12 28V16a8 8 0 0116 0v12" /></svg></div><h4>CMS Integration</h4><p>Content systems your team can manage confidently.</p></div>
          <div className="feat-card"><div className="feat-icon"><svg viewBox="0 0 40 40"><path d="M6 20L14 12 20 18 26 10 34 20" /></svg></div><h4>Performance Optimised</h4><p>Core Web Vitals and Lighthouse tuned from the start.</p></div>
        </div>
      </section>

      <section className="process-section">
        <div className="proc-inner">
          <div className="proc-head rv"><div className="label">How we work</div><h2>Our web design <i>process</i></h2></div>
          <div className="proc-steps">
            <div className="proc-step-item"><div className="psi-num"><div className="psi-dot" /></div><div className="psi-content"><h4>Discovery & Research</h4><p>Understanding business context, users, and constraints before execution.</p></div></div>
            <div className="proc-step-item"><div className="psi-num"><div className="psi-dot" /></div><div className="psi-content"><h4>Information Architecture</h4><p>Sitemaps and flows that help users find what they need quickly.</p></div></div>
            <div className="proc-step-item"><div className="psi-num"><div className="psi-dot" /></div><div className="psi-content"><h4>Wireframes & Prototype</h4><p>Interactive validation of structure and intent before development.</p></div></div>
            <div className="proc-step-item"><div className="psi-num"><div className="psi-dot" /></div><div className="psi-content"><h4>Visual Design</h4><p>Pixel-perfect interfaces, reusable systems, and motion guidelines.</p></div></div>
            <div className="proc-step-item"><div className="psi-num"><div className="psi-dot" /></div><div className="psi-content"><h4>Build & QA</h4><p>Production-grade implementation tested across devices and browsers.</p></div></div>
            <div className="proc-step-item"><div className="psi-num"><div className="psi-dot" /></div><div className="psi-content"><h4>Launch & Handoff</h4><p>Deployment, training, documentation, and post-launch support.</p></div></div>
          </div>
        </div>
      </section>

      <section className="tech-section">
        <div className="section-label rv">Technologies</div>
        <h2 className="rv">Tools we <i>build with</i></h2>
        <div className="tech-grid">
          {['Figma', 'React', 'Next.js', 'Three.js', 'GSAP', 'Sanity', 'Tailwind', 'Vercel'].map((t) => (
            <div className="tech-item" key={t}><div className="tech-dot" /><div className="tech-name">{t}</div><div className="tech-role">Technology</div></div>
          ))}
        </div>
      </section>

      <div className="testimonial-block rv">
        <div className="tblock-inner">
          <p className="tblock-quote">Rivuletduo transformed our online presence. Beautiful, fast, and our conversions jumped 40% in the first month after launch.</p>
          <div className="tblock-author"><div className="tblock-av">AR</div><div><div className="tblock-name">Arjun Rajan</div><div className="tblock-role">Founder, Verdant Goods</div></div></div>
        </div>
      </div>

      <section className="related-section">
        <div className="section-label rv">Related services</div>
        <h2 className="rv">You might also <i>need</i></h2>
        <div className="related-grid">
          <a href="/services/ui" className="rel-card rv"><div className="rel-num">02</div><h4>UI Designing</h4><p>Flawless digital interfaces where every interaction is intentional.</p><div className="rel-arrow">Explore <svg viewBox="0 0 12 12"><path d="M1 11L11 1M1 1h10v10" /></svg></div></a>
          <a href="/services/webdev" className="rel-card rv"><div className="rel-num">05</div><h4>Web Development</h4><p>From design to deployment — production-grade code built to scale.</p><div className="rel-arrow">Explore <svg viewBox="0 0 12 12"><path d="M1 11L11 1M1 1h10v10" /></svg></div></a>
          <a href="/services/seo" className="rel-card rv"><div className="rel-num">08</div><h4>SEO & Performance</h4><p>Core Web Vitals and technical SEO built in from day one.</p><div className="rel-arrow">Explore <svg viewBox="0 0 12 12"><path d="M1 11L11 1M1 1h10v10" /></svg></div></a>
        </div>
      </section>

      <div className="page-cta">
        <h2>Ready to build your<br />next <i>website?</i></h2>
        <div className="cta-btns"><a href="/contact" className="btn-g">Start this project</a><a href="/services" className="btn-ghost">All services</a></div>
      </div>

      <footer id="sd-footer">
        <div className="flogo">rivulet<b>duo</b></div>
        <ul className="flinks"><li><a href="/services">Services</a></li><li><a href="/work">Work</a></li><li><a href="/about">About</a></li><li><a href="/contact">Contact</a></li></ul>
        <div className="fcopy">© 2026 Rivuletduo. All rights reserved.</div>
      </footer>
    </>
  );
}
