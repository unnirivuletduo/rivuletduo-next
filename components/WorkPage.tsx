'use client';

import { useEffect, useMemo, useState } from 'react';
import Cursor from '@/components/Cursor';
import type { WorkListItem as CmsWorkListItem } from '@/lib/cms';
import Footer from '@/components/Footer';
import { yearsInBusiness } from '@/lib/site';

type WorkItem = {
  id: string;
  href: string;
  num: string;
  year: string;
  tag: string;
  title: string;
  desc: string;
  services: string[];
  category: string;
  featured?: boolean;
  canvasId: string;
  visualType: 'ecommerce' | 'dashboard' | 'brand' | 'webapp' | 'landing' | 'platform';
  image?: string;
};

const works: WorkItem[] = [
  {
    id: 'grab-a-rental-car',
    href: '/work/grab-a-rental-car',
    num: '01',
    year: '2025',
    tag: 'Car Rental · Booking Platform',
    title: 'Grab A Rental Car',
    desc: 'An online booking platform for an Auckland car rental company — vehicle listings, quotes, Stripe payments and a custom operations dashboard.',
    services: ['Web Design', 'Custom Software', 'E-Commerce', 'SEO'],
    category: 'Booking Platform',
    canvasId: 'wcgrabarental',
    visualType: 'platform',
    image: '/work/grab-a-rental-car/home.webp',
  },
  {
    id: 'event-display',
    href: '/work/event-display',
    num: '02',
    year: '2026',
    tag: 'LED Screen Hire · WooCommerce',
    title: 'Event Display',
    desc: 'A rental and quoting site for a NZ LED screen hire company — choose a display by size, pick rental dates and request a quote.',
    services: ['Web Design', 'E-Commerce', 'Custom Software', 'SEO'],
    category: 'Booking Platform',
    canvasId: 'wceventdisplay',
    visualType: 'platform',
    image: '/work/event-display/home.webp',
  },
  {
    id: 'baby-cart',
    href: '/work/baby-cart',
    num: '03',
    year: '2026',
    tag: 'E-Commerce · WooCommerce',
    title: 'Baby Cart',
    desc: 'A New Zealand online store for baby gear — 100+ products across 10+ categories, Stripe, Apple Pay and Afterpay, NZ-wide delivery and a custom management dashboard.',
    services: ['Web Design', 'E-Commerce', 'Custom Software', 'SEO'],
    category: 'E-Commerce',
    canvasId: 'wcbabycart',
    visualType: 'ecommerce',
    image: '/work/baby-cart/home.webp',
  },
  {
    id: 'bworth',
    href: '/work/bworth',
    num: '04',
    year: '2025',
    tag: 'Outdoor Living · Product Showcase',
    title: 'Bworth',
    desc: 'A product showcase and lead-generation site for a NZ outdoor living company — 18 products, a comparison tool and free onsite quote requests.',
    services: ['Web Design', 'Web Development', 'SEO'],
    category: 'Product Showcase',
    canvasId: 'wcbworth',
    visualType: 'landing',
    image: '/work/bworth/home.webp',
  },
  {
    id: 'brand-alchemy',
    href: '/work/brand-alchemy',
    num: '05',
    year: '2025',
    tag: 'Creative Agency · Next.js',
    title: 'Brand Alchemy',
    desc: 'A motion-led Next.js website for a NZ creative and brand agency — video storytelling, animated typography, and service and industry pages.',
    services: ['Web Development', 'UI/UX Design', 'SEO'],
    category: 'Creative Agency',
    canvasId: 'wcbrandalchemy',
    visualType: 'brand',
    image: '/work/brand-alchemy/home.webp',
  },
  {
    id: 'craft-shed',
    href: '/work/craft-shed',
    num: '06',
    year: '2026',
    tag: 'Blinds & Outdoor Living · WordPress',
    title: 'Craft Shed',
    desc: 'A lead-generation site for a NZ blinds, shutters and outdoor living company — 17 products in two collections with free in-home quote requests.',
    services: ['Web Design', 'Web Development', 'SEO'],
    category: 'Product Showcase',
    canvasId: 'wccraftshed',
    visualType: 'landing',
    image: '/work/craft-shed/home.webp',
  },
  {
    id: 'earthy',
    href: '/work/earthy',
    num: '07',
    year: '2025',
    tag: 'Eco Products · WordPress',
    title: 'Earthy',
    desc: 'A product catalogue site for a NZ eco-friendly cleaning brand — seven product categories, a sustainability blog and offices nationwide.',
    services: ['Web Development', 'SEO'],
    category: 'Product Showcase',
    canvasId: 'wcearthy',
    visualType: 'brand',
    image: '/work/earthy/home.webp',
  },
  {
    id: 'unicorn-accounting',
    href: '/work/unicorn-accounting',
    num: '08',
    year: '2026',
    tag: 'Accounting Firm · WordPress',
    title: 'Unicorn Accounting',
    desc: 'A trust-building site for Henderson chartered accountants — designed as a React prototype, built as a fully editable WordPress theme.',
    services: ['UI/UX Design', 'Web Development', 'SEO'],
    category: 'Professional Services',
    canvasId: 'wcunicorn',
    visualType: 'landing',
    image: '/work/unicorn-accounting/home.webp',
  },
  {
    id: 'the-concreator',
    href: '/work/the-concreator',
    num: '09',
    year: '2025',
    tag: 'Architecture Studio · WordPress',
    title: 'The Concreator',
    desc: 'A portfolio site for an architecture and interior design studio — animated project showcases, service pages and video media.',
    services: ['Web Development', 'UI/UX Design', 'SEO'],
    category: 'Professional Services',
    canvasId: 'wcconcreator',
    visualType: 'brand',
    image: '/work/the-concreator/home.webp',
  },
  {
    id: 'nz-motorcycle-movers',
    href: '/work/nz-motorcycle-movers',
    num: '10',
    year: '2024',
    tag: 'Transport & Logistics · WordPress',
    title: 'NZ Motorcycle Movers',
    desc: 'A website and online tracking system for a nationwide motorcycle transport company — quotes, delivery scheduling and rego tracking.',
    services: ['Web Design', 'Web Development', 'Custom Software'],
    category: 'Transport & Logistics',
    canvasId: 'wcnzmm',
    visualType: 'platform',
    image: '/work/nz-motorcycle-movers/home.webp',
  },
  {
    id: 'unique-movers',
    href: '/work/unique-movers',
    num: '11',
    year: '2024',
    tag: 'Removals · Custom PHP',
    title: 'Unique Movers',
    desc: 'A fast, custom PHP website for an Auckland moving company — five service pages and a detailed online enquiry form.',
    services: ['Web Design', 'Web Development', 'SEO'],
    category: 'Transport & Logistics',
    canvasId: 'wcuniquemovers',
    visualType: 'landing',
    image: '/work/unique-movers/home.webp',
  },
];

type WorkPageProps = {
  works?: CmsWorkListItem[];
};

export default function WorkPage({ works: cmsWorks }: WorkPageProps = {}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const worksData: WorkItem[] = useMemo(
    () => (cmsWorks && cmsWorks.length > 0 ? cmsWorks : works) as WorkItem[],
    [cmsWorks],
  );
  const filters = useMemo(
    () => ['all', ...Array.from(new Set(worksData.map((work) => work.category)))],
    [worksData],
  );

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  useEffect(() => {
    let disposed = false;
    const cleanups: Array<() => void> = [];
    document.body.classList.add('work-page-body');

    const onNavScroll = () => document.getElementById('work-nav')?.classList.toggle('stuck', window.scrollY > 60);
    window.addEventListener('scroll', onNavScroll);
    cleanups.push(() => window.removeEventListener('scroll', onNavScroll));

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('on');
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.rv').forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    document.querySelectorAll('.filter-btn').forEach((btn) => {
      const onClick = () => {
        document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const f = (btn as HTMLElement).dataset.filter;
        document.querySelectorAll('.wcard').forEach((card) => {
          const c = (card as HTMLElement).dataset.category;
          card.classList.toggle('hidden', !(f === 'all' || c === f));
        });
      };
      btn.addEventListener('click', onClick);
      cleanups.push(() => btn.removeEventListener('click', onClick));
    });

    const cardIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('on');
          cardIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.wcard').forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 0.08}s`;
      cardIO.observe(el);
    });
    cleanups.push(() => cardIO.disconnect());

    const initThree = async () => {
      const THREE = await import('three');
      if (disposed) return;

      {
        const hero = document.getElementById('hero');
        const canvas = document.getElementById('work-hero-canvas') as HTMLCanvasElement | null;
        if (hero && canvas) {
          const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
          r.setPixelRatio(Math.min(devicePixelRatio, 2));
          r.setClearColor(0xffffff, 0);
          const s = new THREE.Scene();
          const cam = new THREE.PerspectiveCamera(55, 1, 0.1, 300);
          cam.position.z = 36;

          const rsz = () => {
            const w = hero.clientWidth;
            const h = hero.clientHeight;
            r.setSize(w, h);
            cam.aspect = w / h;
            cam.updateProjectionMatrix();
          };
          rsz();
          window.addEventListener('resize', rsz);

          s.add(new THREE.AmbientLight(0xffffff, 1));
          const dl = new THREE.DirectionalLight(0x16a34a, 2.5);
          dl.position.set(8, 12, 10);
          s.add(dl);

          const cards: Array<{ m: any; wire: any; oy: number; phase: number; speed: number }> = [];
          for (let row = 0; row < 2; row++) for (let col = 0; col < 3; col++) {
            const x = (col - 1) * 10;
            const y = (row - 0.5) * 6.5;
            const z = (Math.random() - 0.5) * 4;
            const m = new THREE.Mesh(
              new THREE.BoxGeometry(8.5, 5.2, 0.12),
              new THREE.MeshPhongMaterial({ color: 0xf0fdf4, emissive: 0xf8fffe, transparent: true, opacity: 0.6 }),
            );
            m.position.set(x, y, z);
            s.add(m);
            const wire = new THREE.Mesh(
              new THREE.BoxGeometry(8.5, 5.2, 0.12),
              new THREE.MeshBasicMaterial({ color: 0x15803d, wireframe: true, transparent: true, opacity: 0.5 }),
            );
            wire.position.set(x, y, z);
            s.add(wire);
            for (let i = 0; i < 3; i++) {
              const lw = 2 + Math.random() * 4;
              const lm = new THREE.Mesh(
                new THREE.BoxGeometry(lw, 0.08, 0.01),
                new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.58 }),
              );
              lm.position.set(x - 2 + lw / 2 - 2 + Math.random(), y - 1 + i * 0.7, z + 0.08);
              s.add(lm);
            }
            cards.push({ m, wire, oy: y, phase: Math.random() * Math.PI * 2, speed: 0.2 + Math.random() * 0.3 });
          }

          const pp = new Float32Array(180 * 3);
          for (let i = 0; i < 180; i++) {
            pp[i * 3] = (Math.random() - 0.5) * 85;
            pp[i * 3 + 1] = (Math.random() - 0.5) * 55;
            pp[i * 3 + 2] = (Math.random() - 0.5) * 25 - 15;
          }
          const pg = new THREE.BufferGeometry();
          pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
          s.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x15803d, size: 0.12, transparent: true, opacity: 0.58 })));

          let tx = 0, ty = 0, cx = 0, cy = 0;
          const onMove = (e: MouseEvent) => {
            const rc = hero.getBoundingClientRect();
            tx = ((e.clientX - rc.left) / rc.width) * 2 - 1;
            ty = -(((e.clientY - rc.top) / rc.height) * 2 - 1);
          };
          hero.addEventListener('mousemove', onMove);

          const clk = new THREE.Clock();
          let raf = 0;
          const anim = () => {
            raf = requestAnimationFrame(anim);
            const t = clk.getElapsedTime();
            cards.forEach((c) => {
              c.m.position.y = c.oy + Math.sin(t * c.speed + c.phase) * 0.5;
              c.wire.position.y = c.m.position.y;
              c.m.rotation.y = Math.sin(t * 0.12 + c.phase) * 0.08;
              c.wire.rotation.y = c.m.rotation.y;
              c.m.rotation.x = Math.cos(t * 0.09 + c.phase) * 0.04;
              c.wire.rotation.x = c.m.rotation.x;
            });
            cx += (tx * 3.5 - cx) * 0.04;
            cy += (ty * 2 - cy) * 0.04;
            cam.position.set(cx, cy, 36);
            cam.lookAt(0, 0, 0);
            r.render(s, cam);
          };
          anim();

          cleanups.push(() => {
            cancelAnimationFrame(raf);
            hero.removeEventListener('mousemove', onMove);
            window.removeEventListener('resize', rsz);
            r.dispose();
          });
        }
      }

      const mkCard = (id: string, type: WorkItem['visualType']) => {
        const el = document.getElementById(id) as HTMLCanvasElement | null;
        if (!el || !el.parentElement) return;
        const parent = el.parentElement;
        const r = new THREE.WebGLRenderer({ canvas: el, antialias: true, alpha: true });
        r.setPixelRatio(Math.min(devicePixelRatio, 1.5));
        r.setClearColor(0xf0fdf4, 1);
        const s = new THREE.Scene();
        const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
        cam.position.z = 14;
        s.add(new THREE.AmbientLight(0xffffff, 1));
        const d = new THREE.DirectionalLight(0x16a34a, 2.5);
        d.position.set(5, 8, 6);
        s.add(d);

        const rsz = () => {
          const w = parent.clientWidth;
          const h = parent.clientHeight;
          r.setSize(w, h);
          cam.aspect = w / h;
          cam.updateProjectionMatrix();
        };
        rsz();
        const ro = new ResizeObserver(rsz);
        ro.observe(parent);

        const clk = new THREE.Clock();
        let raf = 0;

        if (type === 'ecommerce') {
          const fp = [[0, 4, 0], [0, 2, 0], [0, 0, 0], [0, -2, 0]];
          fp.forEach((p, i) => {
            const w = 6 - i * 0.9;
            const m = new THREE.Mesh(new THREE.BoxGeometry(w, 1.3, 0.3), new THREE.MeshPhongMaterial({ color: 0xf0fdf4, emissive: 0xf8fffe, transparent: true, opacity: 0.7 - i * 0.06 }));
            m.position.set(p[0], p[1], p[2]);
            s.add(m);
          });
          const pc = 50;
          const pp = new Float32Array(pc * 3);
          for (let i = 0; i < pc; i++) {
            pp[i * 3] = (Math.random() - 0.5) * 5;
            pp[i * 3 + 1] = 6 + Math.random() * 2;
            pp[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
          }
          const pg = new THREE.BufferGeometry();
          pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
          s.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x22c55e, size: 0.13, transparent: true, opacity: 0.6 })));

          const anim = () => {
            raf = requestAnimationFrame(anim);
            const t = clk.getElapsedTime();
            for (let i = 0; i < pc; i++) {
              pp[i * 3 + 1] -= 0.04;
              if (pp[i * 3 + 1] < -4) {
                pp[i * 3 + 1] = 6;
                pp[i * 3] = (Math.random() - 0.5) * 5;
              }
            }
            (pg.attributes.position as any).needsUpdate = true;
            cam.position.x = Math.sin(t * 0.07);
            cam.lookAt(0, 0, 0);
            r.render(s, cam);
          };
          anim();
        } else {
          const mesh = new THREE.Mesh(
            new THREE.IcosahedronGeometry(4, 1),
            new THREE.MeshBasicMaterial({ color: 0x86efac, wireframe: true, transparent: true, opacity: 0.45 }),
          );
          s.add(mesh);
          const anim = () => {
            raf = requestAnimationFrame(anim);
            const t = clk.getElapsedTime();
            mesh.rotation.y = t * 0.07;
            mesh.rotation.x = t * 0.04;
            r.render(s, cam);
          };
          anim();
        }

        cleanups.push(() => {
          cancelAnimationFrame(raf);
          ro.disconnect();
          r.dispose();
        });
      };

      worksData.forEach((w) => mkCard(w.canvasId, w.visualType));
    };

    initThree();

    return () => {
      disposed = true;
      cleanups.forEach((fn) => fn());
      document.body.classList.remove('work-page-body');
    };
  }, [worksData]);

  return (
    <>
      <Cursor />

      <nav id="work-nav">
        <a href="/" className="logo" aria-label="Rivuletduo home"><img src="/rivulet-logo.svg" alt="Rivuletduo" className="brand-logo" /></a>
        <ul className="nav-links">
          <li><a href="/services">Services</a></li>
          <li><a href="/work" className="active">Work</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        <a className="nav-btn" href="#project" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event("open-project-modal")); }}>Start a Project</a>
        <button className={`nav-toggle ${menuOpen ? 'open' : ''}`} aria-label="Toggle menu" aria-expanded={menuOpen} aria-controls="work-mobile-menu" onClick={() => setMenuOpen((v) => !v)}>
          <span />
          <span />
          <span />
        </button>
        <div id="work-mobile-menu" className={`nav-mobile-menu ${menuOpen ? 'open' : ''}`}>
          <a href="/services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="/work" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="/about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="/contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <a href="#project" onClick={(e) => { e.preventDefault(); setMenuOpen(false); window.dispatchEvent(new Event("open-project-modal")); }}>Start a Project</a>
        </div>
      </nav>

      <div className="hero" id="hero">
        <canvas id="work-hero-canvas" />
        <div className="hv1" /><div className="hv2" />
        <div className="hero-watermark">Work</div>
        <div className="hero-inner">
          <div>
            <div className="h-ey">Selected Projects</div>
            <h1>Work we&apos;re<br /><em>proud of</em></h1>
          </div>
          <div>
            <p className="h-sub">Websites, online stores and custom software we have designed and built for businesses in New Zealand and beyond.</p>
            <div className="hero-stats">
              <div className="hs-item"><div className="hs-n">{String(worksData.length).padStart(2, '0')}</div><div className="hs-l">Featured projects</div></div>
              <div className="hs-item"><div className="hs-n">{yearsInBusiness()}yr</div><div className="hs-l">Experience</div></div>
              <div className="hs-item"><div className="hs-n">NZ</div><div className="hs-l">Based</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="ticker-wrap">
        <div className="ticker">
          {[...worksData, ...worksData, ...worksData, ...worksData].map((w) => w.title).map((item, idx) => (
            <span className="ticker-item" key={idx}>{item}<span className="tdot" /></span>
          ))}
        </div>
      </div>

      <div className="filter-bar">
        {filters.map((f, i) => (
          <button key={f} className={`filter-btn ${i === 0 ? 'active' : ''}`} data-filter={f}>{f === 'all' ? 'All' : f}</button>
        ))}
      </div>

      <div className="work-grid" id="workGrid">
        {worksData.map((work) => (
          <a href={work.href} className={`wcard ${work.featured ? 'featured' : ''}`} key={work.id} data-category={work.category}>
            <div className="wcard-canvas-wrap">{work.image ? <img className="wcard-img" src={work.image} alt={`${work.title} website`} loading="lazy" /> : <canvas id={work.canvasId} />}<div className="wcard-canvas-overlay" /></div>
            <div className="wcard-num">{work.num}</div><div className="wcard-year">{work.year}</div>
            <div className="wcard-body">
              <div className="wcard-tag">{work.tag}</div>
              <div className="wcard-title">{work.title}</div>
              <p className="wcard-desc">{work.desc}</p>
              <div className="wcard-footer">
                <div className="wcard-services">{work.services.map((s) => <span className="wcard-svc" key={s}>{s}</span>)}</div>
                <div className="wcard-arrow"><svg viewBox="0 0 12 12"><path d="M1 11L11 1M1 1h10v10" /></svg></div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <section className="w-cta">
        <div className="wc-label rv">Start Something New</div>
        <h2 className="wc-h2 rv rv1">Your project<br />could be <em>next</em></h2>
        <p className="wc-sub rv rv2">Tell us about your website, app or software idea. We&apos;ll get back to you within 24 hours with honest advice and clear next steps.</p>
        <div className="wc-btns rv rv3"><a className="btn-g" href="#project" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event("open-project-modal")); }}>Start a Project</a><a className="btn-ghost" href="/services">View Services</a></div>
      </section>

      <Footer id="work-footer" />
    </>
  );
}
