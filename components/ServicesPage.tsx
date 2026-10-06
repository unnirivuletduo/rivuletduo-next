'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Cursor from '@/components/Cursor';
import type { ServiceCategory as CmsServiceCategory } from '@/lib/cms';
import Footer from '@/components/Footer';
import { yearsInBusiness } from '@/lib/site';

type Service = {
  num: string;
  title: string;
  desc: string;
  tags: string[];
  href: string;
  icon?: ReactNode;
};

type Category = {
  id: string;
  num: string;
  titlePrefix: string;
  titleEm: string;
  desc: string;
  services: Service[];
};

const categories: Category[] = [
  {
    id: 'cat1',
    num: '01 —',
    titlePrefix: 'Design',
    titleEm: '& Interface',
    desc: 'Visual systems that communicate, convert and endure.',
    services: [
      {
        num: '01 / 10',
        title: 'Web Design',
        desc: 'Websites designed around your customers and goals — clear messaging, intuitive navigation and a strong first impression that turns visitors into enquiries.',
        tags: ['Figma', 'UX Strategy', 'SEO-ready'],
        href: '/services/webdesign',
        icon: <svg viewBox="0 0 52 52"><rect x="4" y="8" width="44" height="30" rx="2" /><path d="M4 18h44" /><circle cx="10" cy="13" r="2" /><circle cx="17" cy="13" r="2" /><circle cx="24" cy="13" r="2" /><path d="M12 38l4 6h20l4-6" /></svg>,
      },
      {
        num: '02 / 10',
        title: 'UI/UX Design',
        desc: 'Research-backed user experience and polished interfaces for web apps, software and mobile products — so people understand your product at a glance.',
        tags: ['User Research', 'Prototyping', 'Design Systems'],
        href: '/services/ui',
        icon: <svg viewBox="0 0 52 52"><rect x="8" y="8" width="36" height="36" rx="3" /><rect x="14" y="14" width="10" height="10" rx="1" /><rect x="28" y="14" width="10" height="10" rx="1" /><rect x="14" y="28" width="10" height="10" rx="1" /><rect x="28" y="28" width="10" height="10" rx="1" /></svg>,
      },
      {
        num: '03 / 10',
        title: 'Branding & Identity',
        desc: 'Complete identity systems — logo, colour, typography and guidelines — that keep your business consistent across web, apps, social and print.',
        tags: ['Brand Strategy', 'Identity', 'Guidelines'],
        href: '/services/branding',
        icon: <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="18" /><path d="M26 8v36M8 26h36" /><ellipse cx="26" cy="26" rx="10" ry="18" /></svg>,
      },
      {
        num: '04 / 10',
        title: 'Logo Design',
        desc: 'Distinctive, versatile logos delivered as a full suite of versions and file formats, ready for screens, signage and print.',
        tags: ['Concepts', 'Icon Design', 'All Formats'],
        href: '/services/logo',
        icon: <svg viewBox="0 0 52 52"><polygon points="26,6 32,20 48,20 36,30 40,46 26,36 12,46 16,30 4,20 20,20" /></svg>,
      },
      {
        num: '05 / 10',
        title: 'Responsive Web Design',
        desc: 'Mobile-first websites and web apps that adapt perfectly to every phone, tablet and desktop — and rank better on Google because of it.',
        tags: ['Mobile-first', 'Cross-device', 'Mobile SEO'],
        href: '/services/responsive',
        icon: <svg viewBox="0 0 52 52"><rect x="4" y="10" width="44" height="30" rx="2" /><rect x="12" y="16" width="14" height="18" rx="1" /><rect x="30" y="20" width="10" height="10" rx="1" /></svg>,
      },
    ],
  },
  {
    id: 'cat2',
    num: '02 —',
    titlePrefix: 'Development',
    titleEm: '& Engineering',
    desc: 'Production-grade code built to scale and endure.',
    services: [
      {
        num: '06 / 10',
        title: 'Custom Software & Web App Development',
        desc: 'Bespoke web applications, customer portals, dashboards, APIs and integrations — built around how your business works and owned by you.',
        tags: ['React / Next.js', 'Node.js', 'PostgreSQL'],
        href: '/services/webdev',
        icon: <svg viewBox="0 0 52 52"><polyline points="16,20 6,26 16,32" /><polyline points="36,20 46,26 36,32" /><line x1="22" y1="36" x2="30" y2="16" /></svg>,
      },
      {
        num: '07 / 10',
        title: 'Mobile App Development',
        desc: 'iOS and Android apps built from one React Native codebase — from UX design and back-end to App Store and Google Play launch.',
        tags: ['iOS', 'Android', 'React Native'],
        href: '/services/mobile',
        icon: <svg viewBox="0 0 52 52"><rect x="16" y="4" width="20" height="44" rx="3" /><line x1="16" y1="12" x2="36" y2="12" /><line x1="16" y1="40" x2="36" y2="40" /><circle cx="26" cy="44" r="1.5" /></svg>,
      },
      {
        num: '08 / 10',
        title: 'E-Commerce Development',
        desc: 'Online stores on Shopify, WooCommerce or custom platforms, with secure payments, shipping, inventory and analytics set up from day one.',
        tags: ['Shopify', 'WooCommerce', 'Custom'],
        href: '/services/ecommerce',
        icon: <svg viewBox="0 0 52 52"><path d="M8 10h4l5 20h24l4-14H16" /><circle cx="22" cy="38" r="3" /><circle cx="38" cy="38" r="3" /></svg>,
      },
      {
        num: '09 / 10',
        title: 'Search Engine Optimisation',
        desc: 'Technical SEO, keyword research, on-page optimisation, local search and Core Web Vitals — so the right customers find you on Google.',
        tags: ['Technical SEO', 'Local SEO', 'Core Web Vitals'],
        href: '/services/seo',
        icon: <svg viewBox="0 0 52 52"><circle cx="22" cy="22" r="14" /><line x1="32" y1="32" x2="46" y2="46" /><path d="M16 18l4 4 8-8" /></svg>,
      },
      {
        num: '10 / 10',
        title: 'Corporate Websites',
        desc: 'Professional, high-trust websites for established organisations, with role-based editing, accessibility, security and integrations built in.',
        tags: ['Enterprise CMS', 'Accessibility', 'Security'],
        href: '/services/corporate',
        icon: <svg viewBox="0 0 52 52"><rect x="8" y="16" width="36" height="30" rx="2" /><path d="M18 16V12a8 8 0 0116 0v4" /><path d="M26 28v6" /><circle cx="26" cy="26" r="3" /></svg>,
      },
    ],
  },
];

type ServicesPageProps = {
  categories?: CmsServiceCategory[];
};

export default function ServicesPage({ categories: cmsCategories }: ServicesPageProps = {}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const categoriesData: Category[] = (cmsCategories && cmsCategories.length > 0 ? cmsCategories : categories) as Category[];
  
  const fallbackIcon = (
    <svg viewBox="0 0 52 52">
      <rect x="6" y="8" width="40" height="28" rx="2" />
      <path d="M6 20h40" />
      <circle cx="14" cy="14" r="1.8" />
      <circle cx="21" cy="14" r="1.8" />
      <circle cx="28" cy="14" r="1.8" />
      <path d="M14 44l4-6h16l4 6" />
    </svg>
  );

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  useEffect(() => {
    let disposed = false;
    const cleanups: Array<() => void> = [];
    document.body.classList.add('services-page-body');

    const onScrollNav = () => {
      document.getElementById('services-nav')?.classList.toggle('stuck', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScrollNav);
    cleanups.push(() => window.removeEventListener('scroll', onScrollNav));

    const ioRv = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('on');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.rv').forEach((el) => ioRv.observe(el));
    cleanups.push(() => ioRv.disconnect());

    const ioCat = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('on');
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.cat-header').forEach((el) => ioCat.observe(el));
    cleanups.push(() => ioCat.disconnect());

    const ioCard = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.parentElement) {
          const cards = Array.from(entry.target.parentElement.querySelectorAll('.svc-card'));
          cards.forEach((card, i) => {
            setTimeout(() => card.classList.add('visible'), i * 100);
            card.querySelectorAll('.svc-icon svg path,.svc-icon svg rect,.svc-icon svg circle,.svc-icon svg line,.svc-icon svg polyline').forEach((el, j) => {
              let l = 300;
              try {
                l = Math.ceil((el as SVGPathElement).getTotalLength()) + 4;
              } catch {}
              el.setAttribute('stroke-dasharray', `${l}`);
              el.setAttribute('stroke-dashoffset', `${l}`);
              setTimeout(() => {
                (el as HTMLElement).style.transition = `stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1) ${j * 0.1}s`;
                el.setAttribute('stroke-dashoffset', '0');
              }, i * 100 + 200);
            });
          });
          ioCard.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.svc-grid').forEach((grid) => ioCard.observe(grid));
    cleanups.push(() => ioCard.disconnect());

    const initThree = async () => {
      const THREE = await import('three');
      if (disposed) return;

      const hero = document.querySelector('.page-hero') as HTMLElement | null;
      const canvas = document.getElementById('services-hero-canvas') as HTMLCanvasElement | null;
      if (!hero || !canvas) return;

      const W = () => hero.clientWidth;
      const H = () => hero.clientHeight;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setClearColor(0xffffff, 1);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(58, W() / H(), 0.1, 300);
      camera.position.set(0, 0, 40);

      const resize = () => {
        renderer.setSize(W(), H());
        camera.aspect = W() / H();
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener('resize', resize);

      scene.add(new THREE.AmbientLight(0xffffff, 1.5));
      const sun = new THREE.DirectionalLight(0x16a34a, 2.5); sun.position.set(8, 14, 10); scene.add(sun);
      const rim = new THREE.DirectionalLight(0x22c55e, 1.1); rim.position.set(-10, -5, 6); scene.add(rim);

      const gGeo = new THREE.PlaneGeometry(120, 60, 40, 20);
      const gMat = new THREE.MeshBasicMaterial({ color: 0x16a34a, wireframe: true, transparent: true, opacity: 0.42 });
      const grid = new THREE.Mesh(gGeo, gMat);
      grid.rotation.x = -Math.PI / 2.5;
      grid.position.y = -12;
      grid.position.z = -10;
      scene.add(grid);

      const PC = 200;
      const pP = new Float32Array(PC * 3);
      for (let i = 0; i < PC; i++) {
        pP[i * 3] = (Math.random() - 0.5) * 90;
        pP[i * 3 + 1] = (Math.random() - 0.5) * 30;
        pP[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pP, 3));
      scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x15803d, size: 0.22, transparent: true, opacity: 0.62 })));

      const icoMesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(8, 1),
        new THREE.MeshBasicMaterial({ color: 0x15803d, wireframe: true, transparent: true, opacity: 0.45 }),
      );
      icoMesh.position.set(22, -2, -5);
      scene.add(icoMesh);

      for (let i = 0; i < 3; i++) {
        const r = new THREE.Mesh(
          new THREE.TorusGeometry(14 + i * 3, 0.018, 6, 100),
          new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.24 - i * 0.05 }),
        );
        r.rotation.x = Math.PI / 2.2 + i * 0.25;
        r.rotation.z = i * 0.6;
        scene.add(r);
      }

      const clock = new THREE.Clock();
      let mx = 0;
      let my = 0;
      const onMove = (e: MouseEvent) => {
        const r = hero.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width) * 2 - 1;
        my = -(((e.clientY - r.top) / r.height) * 2 - 1);
      };
      hero.addEventListener('mousemove', onMove);

      let raf = 0;
      const animate = () => {
        raf = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        grid.position.z = -10 + Math.sin(t * 0.2) * 0.5;
        icoMesh.rotation.y = t * 0.08;
        icoMesh.rotation.x = t * 0.04;
        scene.children.forEach((child: any) => {
          if (child.isMesh && child.geometry?.type === 'TorusGeometry') child.rotation.z += 0.003;
        });
        camera.position.x += (mx * 3 - camera.position.x) * 0.04;
        camera.position.y += (my * 1.5 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      };
      animate();

      cleanups.push(() => {
        cancelAnimationFrame(raf);
        hero.removeEventListener('mousemove', onMove);
        window.removeEventListener('resize', resize);
        renderer.dispose();
      });
    };

    initThree();

    return () => {
      disposed = true;
      cleanups.forEach((fn) => fn());
      document.body.classList.remove('services-page-body');
    };
  }, []);

  return (
    <>
      <Cursor />

      <nav id="services-nav">
        <a href="/" className="logo" aria-label="Rivuletduo home"><img src="/rivulet-logo.svg" alt="Rivuletduo" className="brand-logo" /></a>
        <ul className="nav-links">
          <li><a href="/services" className="active">Services</a></li>
          <li><a href="/work">Work</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        <a className="nav-btn" href="#project" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event("open-project-modal")); }}>Start a Project</a>
        <button className={`nav-toggle ${menuOpen ? 'open' : ''}`} aria-label="Toggle menu" aria-expanded={menuOpen} aria-controls="services-mobile-menu" onClick={() => setMenuOpen((v) => !v)}>
          <span />
          <span />
          <span />
        </button>
        <div id="services-mobile-menu" className={`nav-mobile-menu ${menuOpen ? 'open' : ''}`}>
          <a href="/services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="/work" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="/about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="/contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <a href="#project" onClick={(e) => { e.preventDefault(); setMenuOpen(false); window.dispatchEvent(new Event("open-project-modal")); }}>Start a Project</a>
        </div>
      </nav>

      <div className="page-hero">
        <canvas id="services-hero-canvas" />
        <div className="hero-vignette" />
        <div className="hero-vignette2" />
        <div className="hero-content">
          <div className="h-eyebrow">What we offer</div>
          <h1>Our <i>Services</i></h1>
          <p className="hero-sub">From pixel-perfect interfaces to production-grade full-stack systems — every discipline, executed with precision.</p>
        </div>
      </div>

      <div className="ticker-wrap">
        <div className="ticker">
          {['Custom Software', 'Web Design', 'UI/UX', 'Mobile Apps', 'E-Commerce', 'SEO', 'Branding', 'Corporate Websites', 'Custom Software', 'Web Design', 'UI/UX', 'Mobile Apps', 'E-Commerce', 'SEO', 'Branding', 'Corporate Websites'].map((item, idx) => (
            <span className="ticker-item" key={idx}>{item}<span className="tdot" /></span>
          ))}
        </div>
      </div>

      <div className="intro-band">
        <div className="rv">
          <div className="label">About our work</div>
          <h2>End-to-end digital <i>craft</i> — nothing left to chance</h2>
          <p>Rivuletduo is a New Zealand software development company. From custom software and mobile apps to websites, online stores and SEO, every service is delivered by one team — from the first workshop through to launch and beyond.</p>
        </div>
        <div className="intro-stats rv rv2">
          <div className="istat"><span className="istat-num">{yearsInBusiness()}yr</span><span className="istat-label">Experience</span></div>
          <div className="istat"><span className="istat-num">10</span><span className="istat-label">Services</span></div>
          <div className="istat"><span className="istat-num">4+</span><span className="istat-label">Countries Served</span></div>
          <div className="istat"><span className="istat-num">NZ</span><span className="istat-label">Based</span></div>
        </div>
      </div>

      <section className="services-section">
        {categoriesData.map((category) => (
          <div className="category-block" key={category.id}>
            <div className="cat-header rv" id={category.id}>
              <span className="cat-num">{category.num}</span>
              <h2 className="cat-title">{category.titlePrefix} <i>{category.titleEm}</i></h2>
              <p className="cat-desc">{category.desc}</p>
            </div>
            <div className="svc-grid">
              {category.services.map((service) => (
                <a href={service.href} className="svc-card" key={`${category.id}-${service.title}`}>
                  <div className="svc-card-num">{service.num}</div>
                  <div className="svc-icon">{service.icon ?? fallbackIcon}</div>
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                  <div className="svc-tags">
                    {service.tags.map((tag) => <span className="svc-tag" key={tag}>{tag}</span>)}
                  </div>
                  <div className="svc-card-arrow">Explore service <svg viewBox="0 0 12 12"><path d="M1 11L11 1M1 1h10v10" /></svg></div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>

      <div className="feature-banner rv">
        <div>
          <p className="fb-eyebrow">Why Rivuletduo</p>
          <h2 className="fb-heading">One team.<br />One <i>standard</i>.</h2>
          <p className="fb-body">From the first workshop to launch and beyond, your project is handled by one dedicated team — designers, developers and SEO specialists working together. No hand-offs between agencies, no cookie-cutter solutions. Just focused, expert work from start to finish.</p>
          <a href="#project" className="fb-cta" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event("open-project-modal")); }}>Start a conversation <svg viewBox="0 0 12 12"><path d="M1 11L11 1M1 1h10v10" /></svg></a>
        </div>
        <div className="fb-list">
          <div className="fb-item"><div className="fb-dot" /><div><div className="fb-item-title">Direct access to your team</div><div className="fb-item-desc">You talk directly to the people designing and building your product — every time.</div></div></div>
          <div className="fb-item"><div className="fb-dot" /><div><div className="fb-item-title">No scope creep surprises</div><div className="fb-item-desc">Transparent scoping, fixed milestones, and clear deliverables from day one.</div></div></div>
          <div className="fb-item"><div className="fb-dot" /><div><div className="fb-item-title">Post-launch partnership</div><div className="fb-item-desc">We stay long after go-live — for training, support, and continued growth.</div></div></div>
          <div className="fb-item"><div className="fb-dot" /><div><div className="fb-item-title">Performance by default</div><div className="fb-item-desc">Speed, accessibility, and SEO are not add-ons — they&apos;re baked into every build.</div></div></div>
        </div>
      </div>

      <div className="process-strip">
        <div className="section-head rv">
          <div className="label">Our process</div>
          <h2>How every project <i>unfolds</i></h2>
        </div>
        <div className="proc-flow">
          <div className="proc-step rv"><div className="proc-num-wrap"><div className="proc-num">01</div></div><h4>Discovery</h4><p>Deep dives into goals, audience, and constraints before a pixel is placed.</p></div>
          <div className="proc-step rv rv1"><div className="proc-num-wrap"><div className="proc-num">02</div></div><h4>Design</h4><p>Wireframes to pixel-perfect mockups. You sign off at every stage.</p></div>
          <div className="proc-step rv rv2"><div className="proc-num-wrap"><div className="proc-num">03</div></div><h4>Build</h4><p>Production-grade code, rigorously tested across every device and edge case.</p></div>
          <div className="proc-step rv rv3"><div className="proc-num-wrap"><div className="proc-num">04</div></div><h4>Launch & Support</h4><p>Smooth handoff, comprehensive training, and support long after go-live.</p></div>
        </div>
      </div>

      <div className="cta-band">
        <h2>Ready to build something<br /><i>worth remembering?</i></h2>
        <div className="cta-btns">
          <a href="#project" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event("open-project-modal")); }} className="btn-g">Start a Project</a>
          <a href="/work" className="btn-ghost">View Our Work</a>
        </div>
      </div>

      <Footer id="services-footer" />
    </>
  );
}
