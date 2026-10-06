'use client';

import { useEffect, useState } from 'react';
import Cursor from '@/components/Cursor';
import type { WorkDetail as CmsWorkDetail } from '@/lib/cms';
import Footer from '@/components/Footer';
import { fallbackWorkDetails as projects } from '@/lib/details-data';

type ProjectData = CmsWorkDetail;


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
  const overviewHeading = project.overviewHeading ?? ['About the ', 'project'];
  const showcase = project.showcase?.length ? project.showcase : [
    { label: 'Design', text: 'Custom interface designed around the brand' },
    { label: 'Build', text: 'Fast, responsive and easy to manage' },
    { label: 'Launch', text: 'Tested across devices and browsers' },
  ];
  const hasScreens = showcase.some((item) => item.image);

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
        <a href="/" className="logo" aria-label="Rivuletduo home"><img src="/rivulet-logo.svg" alt="Rivuletduo" className="brand-logo" /></a>
        <ul className="nav-links">
          <li><a href="/services">Services</a></li>
          <li><a href="/work" className="active">Work</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        <a href="#project" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event("open-project-modal")); }} className="nav-btn">Start a Project</a>
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
          <a href="#project" onClick={(e) => { e.preventDefault(); setMenuOpen(false); window.dispatchEvent(new Event("open-project-modal")); }}>Start a Project</a>
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
            <div className="ph-btns">{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener" className="btn-g">View Live Site ↗</a>}<a href="/work" className="btn-ghost">← All Work</a></div>
          </div>
          <div className="ph-card">
            <div className="phc-head"><span className="phc-head-label">Project Brief</span><span className="phc-head-status"><span className="phc-dot" />Live</span></div>
            <div className="phc-rows">
              <div className="phc-row"><span className="phc-key">Client</span><span className="phc-val">{project.client}</span></div>
              <div className="phc-row"><span className="phc-key">Year</span><span className="phc-val">{project.year}</span></div>
              {project.duration && <div className="phc-row"><span className="phc-key">Duration</span><span className="phc-val">{project.duration}</span></div>}
              <div className="phc-row"><span className="phc-key">Role</span><span className="phc-val">{project.role}</span></div>
              {project.industry && <div className="phc-row"><span className="phc-key">Industry</span><span className="phc-val">{project.industry}</span></div>}
            </div>
            <div className="phc-tags-row">{project.tags.map((t) => <span className="phc-tag" key={t}>{t}</span>)}</div>
          </div>
        </div>
      </section>

      {project.metrics.length > 0 && (
        <div className="metrics-band rv">
          {project.metrics.map((m, i) => (
            <div className="metric" key={`${m}-${i}`}><span className="m-num">{m}</span><span className="m-label">{project.mLabels[i]}</span><span className="m-change">{project.mChanges[i]}</span></div>
          ))}
        </div>
      )}

      <div className="overview rv">
        <div><div className="ov-label">The project</div><h2>{overviewHeading[0]}<i>{overviewHeading[1]}</i>{overviewHeading[2] ?? ''}</h2></div>
        <div className="ov-body">
          {(project.overview?.length ? project.overview : [project.tagline]).map((para) => <p key={para}>{para}</p>)}
          {project.testQuote && <div className="ov-quote">{project.testQuote}</div>}
        </div>
      </div>

      <div className="showcase">
        <div className="showcase-label rv">Visual breakdown</div>
        <h2 className="rv">Inside the <i>build</i></h2>
        <div className={`sc-grid rv ${hasScreens ? 'has-screens' : ''}`}>
          {showcase.map((item, i) => (
            <div className={`sc-item ${i === 0 && !hasScreens ? 'tall' : ''}`} key={item.label}>
              {item.image
                ? <img className="sc-img" src={item.image} alt={`${project.shortName} — ${item.label}`} loading="lazy" />
                : <canvas className="sc-canvas" style={i === 0 && !hasScreens ? { height: 561 } : undefined} />}
              <div className="sc-caption"><div className="sc-cap-label">{item.label}</div><div className="sc-cap-text">{item.text}</div></div>
            </div>
          ))}
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

      {project.testQuote && (
        <div className="testimonial rv">
          <div className="test-inner">
            <p className="test-quote">{project.testQuote}</p>
            <div className="test-author"><div className="test-av">{project.testAv}</div><div><div className="test-name">{project.testName}</div><div className="test-role">{project.testRole}</div></div></div>
          </div>
        </div>
      )}

      <div className="project-nav">
        <a href={`/work/${prev.slug}`} className="pnav-item prev"><div className="pnav-arrow"><svg viewBox="0 0 12 12"><path d="M10 6H2M6 2L2 6l4 4" /></svg></div><div><div className="pnav-dir">Previous</div><div className="pnav-name">{prev.shortName}</div></div></a>
        <a href={`/work/${next.slug}`} className="pnav-item next"><div><div className="pnav-dir">Next Project</div><div className="pnav-name">{next.shortName}</div></div><div className="pnav-arrow"><svg viewBox="0 0 12 12"><path d="M2 6h8M6 2l4 4-4 4" /></svg></div></a>
      </div>

      <div className="back-to-work rv"><a href="/work" className="back-link"><svg viewBox="0 0 12 12"><path d="M10 6H2M6 2L2 6l4 4" /></svg>Back to all work</a></div>

      <Footer id="wd-footer" />
    </>
  );
}
