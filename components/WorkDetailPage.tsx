'use client';

import { useEffect, useState } from 'react';
import Cursor from '@/components/Cursor';
import type { WorkDetail as CmsWorkDetail } from '@/lib/cms';

type ProjectData = {
  slug: string;
  titleHtml: string;
  shortName: string;
  tag: string;
  num: string;
  tagline: string;
  client: string;
  year: string;
  duration: string;
  role: string;
  industry: string;
  tags: string[];
  metrics: string[];
  mLabels: string[];
  mChanges: string[];
  testQuote: string;
  testAv: string;
  testName: string;
  testRole: string;
};

const projects: ProjectData[] = [
  {
    slug: 'verdant-goods',
    titleHtml: 'Verdant<br><i>Goods</i>',
    shortName: 'Verdant Goods',
    tag: 'E-Commerce · Shopify',
    num: '01 / 09',
    tagline: 'A premium organic goods storefront — custom Liquid theme, 3D product viewer, and a 40% conversion uplift in the first month.',
    client: 'Verdant Goods Ltd.',
    year: '2024',
    duration: '8 weeks',
    role: 'Design + Development',
    industry: 'Organic Goods',
    tags: ['Shopify', 'Liquid', 'Three.js', 'GSAP', 'Figma'],
    metrics: ['+40%', '1.8s', '98', '8wk'],
    mLabels: ['Conversion Rate', 'Page Load Time', 'Lighthouse Score', 'Delivery Time'],
    mChanges: ['↑ vs previous site', '↓ from 5.2s', 'Performance', 'On schedule'],
    testQuote: 'Rivuletduo transformed our online presence. Beautiful, fast, and our conversions jumped 40% in the first month after launch.',
    testAv: 'AR',
    testName: 'Arjun Rajan',
    testRole: 'Founder, Verdant Goods',
  },
  {
    slug: 'flowmetrics',
    titleHtml: 'Flow<br><i>Metrics</i>',
    shortName: 'FlowMetrics',
    tag: 'SaaS · Dashboard',
    num: '02 / 09',
    tagline: 'A real-time analytics dashboard for product teams — live WebSocket data, 14+ custom chart types, and role-based access control.',
    client: 'FlowMetrics Inc.',
    year: '2024',
    duration: '12 weeks',
    role: 'Full-Stack Development',
    industry: 'SaaS / Analytics',
    tags: ['React', 'Node.js', 'D3.js', 'PostgreSQL', 'WebSockets'],
    metrics: ['14+', '<200ms', '99.9%', '12wk'],
    mLabels: ['Chart Types', 'Data Latency', 'Uptime', 'Delivery Time'],
    mChanges: ['Custom built', 'Real-time', 'SLA target', 'On schedule'],
    testQuote: 'A complex dashboard in two weeks, on budget, zero compromise on quality. Genuinely impressive duo.',
    testAv: 'SM',
    testName: 'Sofia Mercer',
    testRole: 'CTO, FlowMetrics',
  },
  {
    slug: 'celadon-studio',
    titleHtml: 'Celadon<br><i>Studio</i>',
    shortName: 'Celadon Studio',
    tag: 'Brand · Next.js',
    num: '03 / 09',
    tagline: 'Full brand identity and marketing site for a boutique architecture studio — editorial layout, WebGL fluid transitions, and a custom CMS.',
    client: 'Celadon Architecture',
    year: '2024',
    duration: '10 weeks',
    role: 'Brand + Design + Dev',
    industry: 'Architecture',
    tags: ['Next.js', 'WebGL', 'Sanity', 'GSAP', 'Figma'],
    metrics: ['100', '2.1s', '4k+', '10wk'],
    mLabels: ['Lighthouse Score', 'Load Time', 'Monthly Visitors', 'Delivered In'],
    mChanges: ['Performance', '↓ from 6s', 'First month', 'On time'],
    testQuote: 'Felt like having an in-house team. Communication was clear, feedback welcomed, and the result exceeded expectations.',
    testAv: 'DK',
    testName: 'Devika Kumar',
    testRole: 'Creative Director, Celadon',
  },
  {
    slug: 'heliostack',
    titleHtml: 'Helio<br><i>stack</i>',
    shortName: 'Heliostack',
    tag: 'Web App · React',
    num: '04 / 09',
    tagline: 'Solar energy monitoring platform with real-time grid visualisation, predictive analytics, and a mobile-first PWA for 12,000+ users.',
    client: 'Heliostack Energy',
    year: '2023',
    duration: '16 weeks',
    role: 'Product Design + Dev',
    industry: 'CleanTech',
    tags: ['React', 'PWA', 'GraphQL', 'D3.js', 'Firebase'],
    metrics: ['12k+', '98', '3.2x', '16wk'],
    mLabels: ['Active Users', 'Lighthouse', 'Performance Gain', 'Delivery Time'],
    mChanges: ['At launch', 'Performance', 'vs competitors', 'On schedule'],
    testQuote: "I've worked with bigger agencies — Rivuletduo care more. It shows in every single detail of the final site.",
    testAv: 'JT',
    testName: 'James Tan',
    testRole: 'Founder, Heliostack',
  },
  {
    slug: 'kova-finance',
    titleHtml: 'Kova<br><i>Finance</i>',
    shortName: 'Kova Finance',
    tag: 'Fintech · Next.js',
    num: '05 / 09',
    tagline: 'A fintech landing experience designed for trust and conversion, with performance-first architecture and rich interaction design.',
    client: 'Kova Finance',
    year: '2024',
    duration: '6 weeks',
    role: 'UI/UX + Frontend',
    industry: 'Fintech',
    tags: ['Next.js', 'GSAP', 'TypeScript', 'SEO', 'Figma'],
    metrics: ['+31%', '1.7s', '97', '6wk'],
    mLabels: ['Lead Conversion', 'Page Load Time', 'Lighthouse Score', 'Delivery Time'],
    mChanges: ['vs old page', '↓ from 4.9s', 'Performance', 'On schedule'],
    testQuote: 'Clean, credible and fast. This project materially improved our conversion funnel in less than a month.',
    testAv: 'KP',
    testName: 'Kiran Patel',
    testRole: 'Growth Lead, Kova',
  },
  {
    slug: 'arbor-platform',
    titleHtml: 'Arbor<br><i>Platform</i>',
    shortName: 'Arbor Platform',
    tag: 'Platform · Full-Stack',
    num: '06 / 09',
    tagline: 'A carbon tracking platform for mid-market businesses with robust data architecture and intuitive reporting workflows.',
    client: 'Arbor Platform',
    year: '2023',
    duration: '14 weeks',
    role: 'Full-Stack Product Development',
    industry: 'Climate SaaS',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Charts', 'DevOps'],
    metrics: ['+55%', '2.0s', '99.7%', '14wk'],
    mLabels: ['Adoption Rate', 'Dashboard Load', 'Uptime', 'Delivery Time'],
    mChanges: ['first quarter', 'median', 'SLA', 'On schedule'],
    testQuote: 'Rivuletduo helped us ship a complex platform with clarity, speed, and excellent product instincts.',
    testAv: 'MN',
    testName: 'Maya Nair',
    testRole: 'Product Director, Arbor',
  },
];

function getProject(slug: string, list: ProjectData[]) {
  return list.find((p) => p.slug === slug) || list[0];
}

function neighbors(list: ProjectData[], slug: string) {
  const idx = Math.max(0, list.findIndex((p) => p.slug === slug));
  const prev = list[(idx - 1 + list.length) % list.length];
  const next = list[(idx + 1) % list.length];
  return { prev, next };
}

type WorkDetailPageProps = {
  slug: string;
  projects?: CmsWorkDetail[];
};

export default function WorkDetailPage({ slug, projects: cmsProjects }: WorkDetailPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const projectCatalog = (cmsProjects && cmsProjects.length > 0 ? cmsProjects : projects) as ProjectData[];
  const project = getProject(slug, projectCatalog);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);
  const { prev, next } = neighbors(projectCatalog, project.slug);

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    const onScroll = () => {
      document.getElementById('wd-nav')?.classList.toggle('stuck', window.scrollY > 60);
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
    }, { threshold: 0.08 });
    document.querySelectorAll('.rv').forEach((el) => ioRv.observe(el));
    cleanups.push(() => ioRv.disconnect());

    setTimeout(() => {
      const tg = document.getElementById('techGrid');
      if (!tg) return;
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            Array.from(entry.target.querySelectorAll('.tech-item')).forEach((c, i) => {
              setTimeout(() => c.classList.add('vis'), i * 60);
            });
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      io.observe(tg);
      cleanups.push(() => io.disconnect());
    }, 300);

    let disposed = false;
    const initThree = async () => {
      const THREE = await import('three');
      if (disposed) return;

      {
        const section = document.querySelector('.project-hero') as HTMLElement | null;
        const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement | null;
        if (section && canvas) {
          const W = () => section.clientWidth;
          const H = () => section.clientHeight;
          const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
          renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
          renderer.setClearColor(0xffffff, 0);
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(58, W() / H(), 0.1, 200);
          camera.position.set(0, 4, 28);

          const resize = () => {
            renderer.setSize(W(), H());
            camera.aspect = W() / H();
            camera.updateProjectionMatrix();
          };
          resize();
          window.addEventListener('resize', resize);

          scene.add(new THREE.AmbientLight(0xffffff, 1));
          const dl = new THREE.DirectionalLight(0x16a34a, 2.5);
          dl.position.set(10, 14, 8);
          scene.add(dl);

          const gGeo = new THREE.PlaneGeometry(70, 45, 32, 18);
          const gMesh = new THREE.Mesh(gGeo, new THREE.MeshBasicMaterial({ color: 0xbbf7d0, wireframe: true, transparent: true, opacity: 0.35 }));
          gMesh.rotation.x = -Math.PI / 2.3;
          gMesh.position.y = -8;
          scene.add(gMesh);

          const gPos = gGeo.attributes.position as any;
          const gOrig = new Float32Array(gPos.count);
          for (let i = 0; i < gPos.count; i++) gOrig[i] = gPos.getY(i);

          const main = new THREE.Mesh(new THREE.IcosahedronGeometry(7, 2), new THREE.MeshPhongMaterial({ color: 0xd1fae5, emissive: 0xf0fdf4, wireframe: true, transparent: true, opacity: 0.3 }));
          main.position.set(16, 0, -6);
          scene.add(main);

          const orb = new THREE.Mesh(new THREE.TorusGeometry(11, 0.04, 6, 120), new THREE.MeshBasicMaterial({ color: 0xbbf7d0, transparent: true, opacity: 0.35 }));
          orb.rotation.x = Math.PI / 3;
          orb.position.copy(main.position);
          scene.add(orb);

          const clock = new THREE.Clock();
          let tmx = 0, tmy = 0;
          const onMove = (e: MouseEvent) => {
            tmx = (e.clientX / innerWidth) * 2 - 1;
            tmy = -((e.clientY / innerHeight) * 2 - 1);
          };
          document.addEventListener('mousemove', onMove);

          let raf = 0;
          const animate = () => {
            raf = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            for (let i = 0; i < gPos.count; i++) {
              const x = gPos.getX(i), z = gPos.getZ(i);
              gPos.setY(i, gOrig[i] + Math.sin(x * 0.2 + t * 0.45) * 0.85 + Math.sin(z * 0.28 + t * 0.38) * 0.6);
            }
            gPos.needsUpdate = true;
            gGeo.computeVertexNormals();
            main.rotation.y = t * 0.07;
            main.rotation.x = t * 0.04;
            orb.rotation.z = t * 0.06;
            camera.position.x += (tmx * 3 - camera.position.x) * 0.04;
            camera.position.y += (tmy * 1.5 + 4 - camera.position.y) * 0.04;
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
        }
      }
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
      <div className="pp"><div className="pp-fill" id="ppFill" /></div>

      <nav id="wd-nav">
        <a href="/" className="logo">rivulet<b>duo</b></a>
        <ul className="nav-links">
          <li><a href="/services">Services</a></li>
          <li><a href="/work" className="active">Work</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        <a href="/contact" className="nav-btn">Start a Project</a>
        <button className={`nav-toggle ${menuOpen ? 'open' : ''}`} aria-label="Toggle menu" aria-expanded={menuOpen} aria-controls="work-detail-mobile-menu" onClick={() => setMenuOpen((v) => !v)}>
          <span />
          <span />
          <span />
        </button>
        <div id="work-detail-mobile-menu" className={`nav-mobile-menu ${menuOpen ? 'open' : ''}`}>
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
        <a href="/work">Work</a>
        <span className="bc-sep">/</span>
        <span>{project.shortName}</span>
      </div>

      <section className="project-hero">
        <canvas id="hero-canvas" />
        <div className="ph-vig" />
        <div className="ph-vig2" />
        <div className="ph-inner">
          <div>
            <div className="ph-tag-row"><span className="ph-tag">{project.tag}</span><span className="ph-num">{project.num}</span></div>
            <h1 dangerouslySetInnerHTML={{ __html: project.titleHtml }} />
            <p className="ph-tagline">{project.tagline}</p>
            <div className="ph-btns"><a href="#" className="btn-g">View Live Site ↗</a><a href="/work" className="btn-ghost">← All Work</a></div>
          </div>
          <div className="ph-card">
            <div className="phc-head"><span className="phc-head-label">Project Brief</span><span className="phc-head-status"><span className="phc-dot" />Live</span></div>
            <div className="phc-rows">
              <div className="phc-row"><span className="phc-key">Client</span><span className="phc-val">{project.client}</span></div>
              <div className="phc-row"><span className="phc-key">Year</span><span className="phc-val">{project.year}</span></div>
              <div className="phc-row"><span className="phc-key">Duration</span><span className="phc-val">{project.duration}</span></div>
              <div className="phc-row"><span className="phc-key">Role</span><span className="phc-val">{project.role}</span></div>
              <div className="phc-row"><span className="phc-key">Industry</span><span className="phc-val">{project.industry}</span></div>
            </div>
            <div className="phc-tags-row">{project.tags.map((t) => <span className="phc-tag" key={t}>{t}</span>)}</div>
          </div>
        </div>
      </section>

      <div className="metrics-band rv">
        {project.metrics.map((m, i) => (
          <div className="metric" key={project.mLabels[i]}><span className="m-num">{m}</span><span className="m-label">{project.mLabels[i]}</span><span className="m-change">{project.mChanges[i]}</span></div>
        ))}
      </div>

      <div className="overview rv">
        <div><div className="ov-label">The challenge</div><h2>Turning an <i>underperforming</i> store into a conversion machine</h2></div>
        <div className="ov-body">
          <p>We inherited a product that needed stronger positioning, cleaner UX, and significantly better performance under real-world traffic conditions.</p>
          <p>Our approach combined visual system redesign, full frontend rebuild, and measurable performance engineering tuned for conversion-critical journeys.</p>
          <p>Post launch, the experience felt more premium, faster, and easier to navigate, with metrics improving across engagement and business outcomes.</p>
          <div className="ov-quote">{project.testQuote}</div>
        </div>
      </div>

      <div className="showcase">
        <div className="showcase-label rv">Visual breakdown</div>
        <h2 className="rv">Inside the <i>build</i></h2>
        <div className="sc-grid rv">
          <div className="sc-item tall"><canvas className="sc-canvas" style={{ height: 561 }} /><div className="sc-caption"><div className="sc-cap-label">3D Product Viewer</div><div className="sc-cap-text">Real-time visual system with fluid transitions</div></div></div>
          <div className="sc-item"><canvas className="sc-canvas" /><div className="sc-caption"><div className="sc-cap-label">Product Grid</div><div className="sc-cap-text">Staggered reveal animations on scroll</div></div></div>
          <div className="sc-item"><canvas className="sc-canvas" /><div className="sc-caption"><div className="sc-cap-label">Custom Checkout</div><div className="sc-cap-text">Streamlined conversion-focused flow</div></div></div>
        </div>
      </div>

      <div className="tech-section">
        <div className="tl rv">Technologies used</div>
        <h2 className="rv">Built <i>with precision</i></h2>
        <div className="tech-grid" id="techGrid">
          {project.tags.map((t) => (
            <div className="tech-item" key={t}><div className="tech-dot" /><div className="tech-name">{t}</div><div className="tech-role">Technology</div></div>
          ))}
        </div>
      </div>

      <div className="testimonial rv">
        <div className="test-inner">
          <p className="test-quote">{project.testQuote}</p>
          <div className="test-author"><div className="test-av">{project.testAv}</div><div><div className="test-name">{project.testName}</div><div className="test-role">{project.testRole}</div></div></div>
        </div>
      </div>

      <div className="project-nav">
        <a href={`/work/${prev.slug}`} className="pnav-item prev"><div className="pnav-arrow"><svg viewBox="0 0 12 12"><path d="M10 6H2M6 2L2 6l4 4" /></svg></div><div><div className="pnav-dir">Previous</div><div className="pnav-name">{prev.shortName}</div></div></a>
        <a href={`/work/${next.slug}`} className="pnav-item next"><div><div className="pnav-dir">Next Project</div><div className="pnav-name">{next.shortName}</div></div><div className="pnav-arrow"><svg viewBox="0 0 12 12"><path d="M2 6h8M6 2l4 4-4 4" /></svg></div></a>
      </div>

      <div className="back-to-work rv"><a href="/work" className="back-link"><svg viewBox="0 0 12 12"><path d="M10 6H2M6 2L2 6l4 4" /></svg>Back to all work</a></div>

      <footer id="wd-footer">
        <div className="flogo">rivulet<b>duo</b></div>
        <ul className="flinks"><li><a href="/services">Services</a></li><li><a href="/work">Work</a></li><li><a href="/about">About</a></li><li><a href="/contact">Contact</a></li></ul>
        <div className="fcopy">© 2026 Rivuletduo. All rights reserved.</div>
      </footer>
    </>
  );
}
