'use client';

import { useEffect, useState } from 'react';
import Cursor from '@/components/Cursor';

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
};

const works: WorkItem[] = [
  {
    id: 'verdant',
    href: '/work/verdant-goods',
    num: '01',
    year: '2023',
    tag: 'Shopify · Brand',
    title: 'Verdant Goods',
    desc: 'A sustainable goods store rebuilt from the ground up.',
    services: ['E-Commerce', 'UI / UX Design', 'SEO & Performance'],
    category: 'E-Commerce',
    featured: true,
    canvasId: 'wcverdant',
    visualType: 'ecommerce',
  },
  {
    id: 'flowmetrics',
    href: '/work/flowmetrics',
    num: '02',
    year: '2023',
    tag: 'Dashboard · React',
    title: 'FlowMetrics',
    desc: 'A real-time analytics dashboard nobody expected to love.',
    services: ['Frontend Dev', 'UI / UX Design', 'Full-Stack'],
    category: 'SaaS',
    canvasId: 'wcflowmetrics',
    visualType: 'dashboard',
  },
  {
    id: 'celadon',
    href: '/work/celadon-studio',
    num: '03',
    year: '2022',
    tag: 'Next.js · Motion',
    title: 'Celadon Studio',
    desc: 'A creative studio website that is itself a piece of craft.',
    services: ['UI / UX Design', 'Frontend Dev', 'CMS & Support'],
    category: 'Brand',
    canvasId: 'wcceladon',
    visualType: 'brand',
  },
  {
    id: 'heliostack',
    href: '/work/heliostack',
    num: '04',
    year: '2024',
    tag: 'Full-Stack · React',
    title: 'Heliostack',
    desc: 'A project management platform built for solar installation teams.',
    services: ['Full-Stack', 'UI / UX Design', 'DevOps'],
    category: 'Web App',
    canvasId: 'wcheliostack',
    visualType: 'webapp',
  },
  {
    id: 'kova',
    href: '/work/kova-finance',
    num: '05',
    year: '2024',
    tag: 'Landing · Next.js',
    title: 'Kova Finance',
    desc: 'A fintech landing page that converts like a sales team.',
    services: ['UI / UX Design', 'Frontend Dev', 'SEO & Performance'],
    category: 'Fintech',
    canvasId: 'wckova',
    visualType: 'landing',
  },
  {
    id: 'arbor',
    href: '/work/arbor-platform',
    num: '06',
    year: '2023',
    tag: 'Full-Stack · SaaS',
    title: 'Arbor Platform',
    desc: 'A carbon tracking platform for mid-market businesses.',
    services: ['Full-Stack', 'UI / UX Design', 'CMS & Support'],
    category: 'Platform',
    canvasId: 'wcarbor',
    visualType: 'platform',
  },
];

const filters = ['all', 'E-Commerce', 'SaaS', 'Brand', 'Web App', 'Fintech', 'Platform'];

export default function WorkPage() {
  const [menuOpen, setMenuOpen] = useState(false);

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

      works.forEach((w) => mkCard(w.canvasId, w.visualType));
    };

    initThree();

    return () => {
      disposed = true;
      cleanups.forEach((fn) => fn());
      document.body.classList.remove('work-page-body');
    };
  }, []);

  return (
    <>
      <Cursor />

      <nav id="work-nav">
        <a href="/" className="logo">rivulet<b>duo</b></a>
        <ul className="nav-links">
          <li><a href="/services">Services</a></li>
          <li><a href="/work" className="active">Work</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        <a className="nav-btn" href="/contact">Start a Project</a>
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
          <a href="/contact" onClick={() => setMenuOpen(false)}>Start a Project</a>
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
            <p className="h-sub">Six projects across e-commerce, SaaS, brand, and platform — each one a reflection of the same obsessive standard of craft.</p>
            <div className="hero-stats">
              <div className="hs-item"><div className="hs-n">06</div><div className="hs-l">Featured projects</div></div>
              <div className="hs-item"><div className="hs-n">48+</div><div className="hs-l">Total delivered</div></div>
              <div className="hs-item"><div className="hs-n">2022–24</div><div className="hs-l">Span</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="ticker-wrap">
        <div className="ticker">
          {['Verdant Goods', 'FlowMetrics', 'Celadon Studio', 'Heliostack', 'Kova Finance', 'Arbor Platform', 'Verdant Goods', 'FlowMetrics', 'Celadon Studio', 'Heliostack', 'Kova Finance', 'Arbor Platform'].map((item, idx) => (
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
        {works.map((work) => (
          <a href={work.href} className={`wcard ${work.featured ? 'featured' : ''}`} key={work.id} data-category={work.category}>
            <div className="wcard-canvas-wrap"><canvas id={work.canvasId} /><div className="wcard-canvas-overlay" /></div>
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
        <p className="wc-sub rv rv2">We take on a small number of projects at a time. When you work with Rivuletduo, you get our full attention.</p>
        <div className="wc-btns rv rv3"><a className="btn-g" href="/contact">Start a Project</a><a className="btn-ghost" href="/services">View Services</a></div>
      </section>

      <footer id="work-footer">
        <div className="flogo">rivulet<b>duo</b></div>
        <ul className="flinks">
          <li><a href="/services">Services</a></li>
          <li><a href="/work">Work</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        <div className="fcopy">© 2026 Rivuletduo. All rights reserved.</div>
      </footer>
    </>
  );
}
