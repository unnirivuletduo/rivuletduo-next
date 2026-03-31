'use client';

import { useEffect, useState } from 'react';
import Cursor from '@/components/Cursor';

type Faq = { q: string; a: string };

const faqs: Faq[] = [
  {
    q: 'How long does a typical project take?',
    a: "It depends on scope, but as a guide: a branding identity takes 2–3 weeks, a marketing site 4–8 weeks, and a full-stack web application 8–16 weeks. After our discovery call, we'll give you a detailed timeline before any work begins.",
  },
  {
    q: "What's your minimum project size?",
    a: "We typically work on projects starting from $2,000. Smaller one-off tasks like logo design or a single landing page can sometimes fall below this — just reach out and we'll let you know if it's a good fit.",
  },
  {
    q: 'Do you work with clients internationally?',
    a: 'Absolutely. Our clients span India, the US, UK, Australia, and the Middle East. We work asynchronously and schedule calls at mutually convenient times — remote collaboration is second nature to us.',
  },
  {
    q: 'What does the payment structure look like?',
    a: 'We work on a milestone-based payment structure: typically 40% upfront, 40% at design approval, and 20% on final delivery. For larger projects, we can arrange a monthly billing schedule.',
  },
  {
    q: 'Will I own the code and designs after the project?',
    a: 'Yes. Upon final payment, full intellectual property — including all source code, design files, and assets — transfers entirely to you. No licensing fees, no lock-in, no strings attached.',
  },
  {
    q: 'Do you offer maintenance and support after launch?',
    a: 'Every project includes a 30-day post-launch support window at no extra cost. After that, we offer flexible monthly retainer plans for ongoing updates, monitoring, and support.',
  },
];

export default function ContactPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState<'project' | 'general'>('project');
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [desc, setDesc] = useState('');
  const [projectDone, setProjectDone] = useState(false);
  const [generalDone, setGeneralDone] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  useEffect(() => {
    let disposed = false;
    const cleanups: Array<() => void> = [];
    document.body.classList.add('contact-page-body');

    const onScroll = () => {
      document.getElementById('contact-nav')?.classList.toggle('stuck', window.scrollY > 60);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const fill = document.getElementById('ppFill');
      if (fill) fill.style.height = `${((window.scrollY / (h || 1)) * 100).toFixed(2)}%`;
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    cleanups.push(() => window.removeEventListener('scroll', onScroll));

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('on');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.rv').forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    const initThree = async () => {
      const THREE = await import('three');
      if (disposed) return;

      {
        const section = document.querySelector('.contact-hero') as HTMLElement | null;
        const canvas = document.getElementById('contact-hero-canvas') as HTMLCanvasElement | null;
        if (section && canvas) {
          const W = () => section.clientWidth;
          const H = () => section.clientHeight;
          const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
          renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
          renderer.setClearColor(0xffffff, 0);
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(60, W() / H(), 0.1, 200);
          camera.position.set(0, 6, 26);
          camera.lookAt(0, 0, 0);

          const resize = () => {
            renderer.setSize(W(), H());
            camera.aspect = W() / H();
            camera.updateProjectionMatrix();
          };
          resize();
          window.addEventListener('resize', resize);

          scene.add(new THREE.AmbientLight(0xffffff, 1));
          const dl = new THREE.DirectionalLight(0x15803d, 2.8);
          dl.position.set(8, 12, 8);
          scene.add(dl);
          const rim = new THREE.DirectionalLight(0x22c55e, 1.1);
          rim.position.set(-10, -6, 6);
          scene.add(rim);

          const rings: any[] = [];
          for (let i = 0; i < 5; i++) {
            const pts = [];
            for (let j = 0; j <= 120; j++) {
              const a = (j / 120) * Math.PI * 2;
              const rr = 14 + i * 3.5;
              pts.push(new THREE.Vector3(Math.cos(a) * rr, Math.sin(a * 3 + i) * 2, Math.sin(a) * rr));
            }
            const g = new THREE.BufferGeometry().setFromPoints(pts);
            const m = new THREE.LineLoop(g, new THREE.LineBasicMaterial({ color: 0x16a34a, transparent: true, opacity: 0.45 - i * 0.04 }));
            m.rotation.x = Math.PI / 3 + i * 0.15;
            rings.push(m);
            scene.add(m);
          }

          const PC = 180;
          const pP = new Float32Array(PC * 3);
          for (let i = 0; i < PC; i++) {
            pP[i * 3] = (Math.random() - 0.5) * 70;
            pP[i * 3 + 1] = (Math.random() - 0.5) * 26;
            pP[i * 3 + 2] = (Math.random() - 0.5) * 35 - 8;
          }
          const pGeo = new THREE.BufferGeometry();
          pGeo.setAttribute('position', new THREE.BufferAttribute(pP, 3));
          scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x15803d, size: 0.18, transparent: true, opacity: 0.62 })));

          const orb = new THREE.Mesh(
            new THREE.SphereGeometry(4.5, 32, 32),
            new THREE.MeshPhongMaterial({ color: 0xbbf7d0, emissive: 0xd1fae5, shininess: 6, transparent: true, opacity: 0.82 }),
          );
          orb.position.set(16, 0, -4);
          scene.add(orb);

          const orbWire = new THREE.Mesh(
            new THREE.SphereGeometry(4.6, 12, 12),
            new THREE.MeshBasicMaterial({ color: 0x15803d, wireframe: true, transparent: true, opacity: 0.48 }),
          );
          orbWire.position.copy(orb.position);
          scene.add(orbWire);

          const clock = new THREE.Clock();
          let tmx = 0;
          let tmy = 0;
          const onMove = (e: MouseEvent) => {
            tmx = (e.clientX / window.innerWidth) * 2 - 1;
            tmy = -((e.clientY / window.innerHeight) * 2 - 1);
          };
          document.addEventListener('mousemove', onMove);

          let raf = 0;
          const animate = () => {
            raf = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            rings.forEach((r, i) => {
              r.rotation.y = t * (0.03 + i * 0.008);
              r.rotation.z = t * (0.015 + i * 0.005);
            });
            orb.rotation.y = t * 0.06;
            orbWire.rotation.y = -t * 0.08;
            orbWire.rotation.x = t * 0.04;
            camera.position.x += (tmx * 3 - camera.position.x) * 0.04;
            camera.position.y += (tmy * 2 + 6 - camera.position.y) * 0.04;
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

      {
        const canvas = document.getElementById('map-canvas') as HTMLCanvasElement | null;
        const container = canvas?.parentElement as HTMLElement | null;
        if (canvas && container) {
          const W = () => container.clientWidth;
          const H = () => container.clientHeight;
          const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
          renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
          renderer.setClearColor(0xf0fdf4, 1);

          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(50, W() / H(), 0.1, 100);
          camera.position.set(0, 0, 18);

          const resize = () => {
            renderer.setSize(W(), H());
            camera.aspect = W() / H();
            camera.updateProjectionMatrix();
          };
          resize();
          window.addEventListener('resize', resize);

          scene.add(new THREE.AmbientLight(0xffffff, 1));
          const dl = new THREE.DirectionalLight(0x16a34a, 2);
          dl.position.set(5, 8, 6);
          scene.add(dl);

          const globe = new THREE.Mesh(
            new THREE.SphereGeometry(6, 32, 32),
            new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0xf8fffe, shininess: 5, transparent: true, opacity: 0.85 }),
          );
          scene.add(globe);
          const globeWire = new THREE.Mesh(
            new THREE.SphereGeometry(6.05, 18, 10),
            new THREE.MeshBasicMaterial({ color: 0xbbf7d0, wireframe: true, transparent: true, opacity: 0.5 }),
          );
          scene.add(globeWire);

          const lat = (10 * Math.PI) / 180;
          const lon = (76 * Math.PI) / 180;

          const pin = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), new THREE.MeshBasicMaterial({ color: 0x15803d }));
          scene.add(pin);

          const pulseGeo = new THREE.TorusGeometry(0.4, 0.03, 4, 32);
          const pulseMat = new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.6 });
          const pulseRing = new THREE.Mesh(pulseGeo, pulseMat);
          scene.add(pulseRing);

          const clock = new THREE.Clock();
          let raf = 0;
          const animate = () => {
            raf = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            globe.rotation.y = t * 0.12;
            globeWire.rotation.y = t * 0.12;
            pin.position.set(6 * Math.cos(lat) * Math.sin(lon + t * 0.12), 6 * Math.sin(lat), 6 * Math.cos(lat) * Math.cos(lon + t * 0.12));
            pulseRing.position.copy(pin.position);
            pulseRing.lookAt(0, 0, 0);
            const s = 1 + 0.4 * Math.abs(Math.sin(t * 1.8));
            pulseRing.scale.setScalar(s);
            pulseMat.opacity = 0.7 - s * 0.3;
            renderer.render(scene, camera);
          };
          animate();

          cleanups.push(() => {
            cancelAnimationFrame(raf);
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
      document.body.classList.remove('contact-page-body');
    };
  }, []);

  const validateStepOne = () => {
    const fn = (document.getElementById('fname') as HTMLInputElement | null)?.value.trim() || '';
    const ln = (document.getElementById('lname') as HTMLInputElement | null)?.value.trim() || '';
    const em = (document.getElementById('email') as HTMLInputElement | null)?.value.trim() || '';
    return !!fn && !!ln && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
  };

  const toggleService = (s: string) => {
    setSelectedServices((curr) => (curr.includes(s) ? curr.filter((x) => x !== s) : [...curr, s]));
  };

  return (
    <>
      <Cursor />
      <div className="page-progress"><div className="pp-fill" id="ppFill" /></div>

      <nav id="contact-nav">
        <a href="/" className="logo">rivulet<b>duo</b></a>
        <ul className="nav-links">
          <li><a href="/services">Services</a></li>
          <li><a href="/work">Work</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact" className="active">Contact</a></li>
        </ul>
        <a href="/contact" className="nav-btn">Start a Project</a>
        <button className={`nav-toggle ${menuOpen ? 'open' : ''}`} aria-label="Toggle menu" aria-expanded={menuOpen} aria-controls="contact-mobile-menu" onClick={() => setMenuOpen((v) => !v)}>
          <span />
          <span />
          <span />
        </button>
        <div id="contact-mobile-menu" className={`nav-mobile-menu ${menuOpen ? 'open' : ''}`}>
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
        <span>Contact</span>
      </div>

      <section className="contact-hero">
        <canvas id="contact-hero-canvas" />
        <div className="hero-vig" />
        <div className="hero-vig-bot" />
        <div className="hero-inner">
          <div className="hero-left">
            <div className="h-eyebrow">Get in touch</div>
            <h1><span>Let&apos;s build</span><span>something</span><span><i>worth feeling.</i></span></h1>
            <p className="hero-sub">Tell us about your project and we&apos;ll get back to you within 24 hours. No obligations, no hard sell — just an honest conversation.</p>
          </div>
          <div className="hero-right">
            <a href="mailto:hello@rivuletduo.com" className="hero-detail"><div className="hd-icon"><svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" /></svg></div><div className="hd-text"><span className="hd-label">Email us</span><span className="hd-value">hello@rivuletduo.com</span></div></a>
            <a href="tel:+15550000000" className="hero-detail"><div className="hd-icon"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg></div><div className="hd-text"><span className="hd-label">Call us</span><span className="hd-value">+1 (555) 000-0000</span></div></a>
            <div className="hero-detail"><div className="hd-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg></div><div className="hd-text"><span className="hd-label">Response time</span><span className="hd-value">Within 24 hours</span></div></div>
          </div>
        </div>
      </section>

      <div className="contact-main">
        <div className="left-panel rv">
          <div className="panel-label">Why reach out</div>
          <h2>Every great site starts with a <i>conversation</i></h2>
          <p>We&apos;d love to hear from you. Whether you have a fully-formed brief or just a rough idea, we&apos;re here to help you figure out the path forward — no jargon, no pressure.</p>
          <div className="avail-badge"><div className="avail-dot" /><span className="avail-text">Currently accepting new projects</span></div>
          <div className="contact-methods">
            <a href="mailto:hello@rivuletduo.com" className="cm-item"><div className="cm-ico"><svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" /></svg></div><div className="cm-body"><div className="cm-label">Email</div><div className="cm-value">hello@rivuletduo.com</div></div><div className="cm-arrow"><svg viewBox="0 0 12 12"><path d="M1 11L11 1M1 1h10v10" /></svg></div></a>
            <a href="tel:+15550000000" className="cm-item"><div className="cm-ico"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg></div><div className="cm-body"><div className="cm-label">Phone</div><div className="cm-value">+1 (555) 000-0000</div></div><div className="cm-arrow"><svg viewBox="0 0 12 12"><path d="M1 11L11 1M1 1h10v10" /></svg></div></a>
          </div>
        </div>

        <div className="form-card rv rv2">
          <div className="form-tabs">
            <button className={`ftab ${tab === 'project' ? 'active' : ''}`} onClick={() => setTab('project')}>Project Brief</button>
            <button className={`ftab ${tab === 'general' ? 'active' : ''}`} onClick={() => setTab('general')}>General Enquiry</button>
          </div>

          {tab === 'project' && !projectDone && (
            <div className="form-body">
              <div className="step-indicator">
                <div className={`si-step ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`}><div className="si-num">{step > 1 ? '✓' : '1'}</div>You</div>
                <div className="si-line" />
                <div className={`si-step ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}><div className="si-num">{step > 2 ? '✓' : '2'}</div>Project</div>
                <div className="si-line" />
                <div className={`si-step ${step === 3 ? 'active' : ''}`}><div className="si-num">3</div>Details</div>
              </div>

              {step === 1 && (
                <>
                  <div className="form-row">
                    <div className="field"><label>First name <span className="req">*</span></label><input id="fname" type="text" placeholder="Alex" /></div>
                    <div className="field"><label>Last name <span className="req">*</span></label><input id="lname" type="text" placeholder="Morgan" /></div>
                  </div>
                  <div className="field"><label>Email address <span className="req">*</span></label><input id="email" type="email" placeholder="alex@example.com" /></div>
                  <div className="field"><label>Phone</label><input type="tel" placeholder="+1 (555) 000-0000" /></div>
                  <div className="form-nav"><span className="step-count"><b>01</b> / 03</span><button className="btn-next" onClick={() => validateStepOne() && setStep(2)}>Next — Project Info →</button></div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="field"><label>Services you&apos;re interested in <span className="req">*</span></label></div>
                  <div className="svc-checks">
                    {['Web Design', 'UI/UX Design', 'Web Development', 'Mobile App', 'E-Commerce', 'Branding', 'SEO', 'Animation / 3D'].map((s) => (
                      <div key={s} className={`svc-check ${selectedServices.includes(s) ? 'checked' : ''}`} onClick={() => toggleService(s)}><div className="svc-check-box" />{s}</div>
                    ))}
                  </div>
                  <div className="field"><label>Estimated budget</label></div>
                  <div className="budget-grid">
                    {['< $2k', '$2k–$5k', '$5k–$10k', '$10k–$20k', '$20k+', "Let's discuss"].map((b) => (
                      <div key={b} className={`budget-opt ${budget === b ? 'sel' : ''}`} onClick={() => setBudget(b)}>{b}</div>
                    ))}
                  </div>
                  <div className="form-nav"><button className="btn-prev" onClick={() => setStep(1)}>← Back</button><span className="step-count"><b>02</b> / 03</span><button className="btn-next" onClick={() => setStep(3)}>Next — Tell us more →</button></div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="field"><label>Project description <span className="req">*</span></label><textarea value={desc} onChange={(e) => setDesc(e.target.value.slice(0, 600))} placeholder="Tell us about your project — what you're building, who it's for, and what success looks like for you…" /><div className="char-counter">{desc.length} / 600</div></div>
                  <button className="btn-submit-main" onClick={() => desc.trim() && setProjectDone(true)}>Send Project Brief ↗</button>
                  <div className="form-nav" style={{ borderTop: 'none', marginTop: '.8rem', paddingTop: 0, justifyContent: 'flex-start' }}><button className="btn-prev" onClick={() => setStep(2)}>← Back</button><span className="step-count" style={{ marginLeft: 'auto' }}><b>03</b> / 03</span></div>
                </>
              )}
            </div>
          )}

          {tab === 'project' && projectDone && (
            <div className="form-success show">
              <div className="success-icon"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg></div>
              <h3>Brief received!</h3>
              <p>Thank you. We&apos;ll review your project details and get back to you within 24 hours.</p>
            </div>
          )}

          {tab === 'general' && !generalDone && (
            <div className="form-body">
              <div className="form-row">
                <div className="field"><label>Name <span className="req">*</span></label><input type="text" placeholder="Your name" /></div>
                <div className="field"><label>Email <span className="req">*</span></label><input type="email" placeholder="you@example.com" /></div>
              </div>
              <div className="field"><label>Message <span className="req">*</span></label><textarea style={{ height: 130 }} placeholder="Your message…" /></div>
              <button className="btn-submit-main" onClick={() => setGeneralDone(true)}>Send Message ↗</button>
            </div>
          )}

          {tab === 'general' && generalDone && (
            <div className="form-success show">
              <div className="success-icon"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg></div>
              <h3>Message sent!</h3>
              <p>We&apos;ve received your message and will reply within 24 hours.</p>
            </div>
          )}
        </div>
      </div>

      <section className="faq-section">
        <div className="faq-inner">
          <div className="faq-head rv"><div className="faq-label">Common questions</div><h2>Things people <i>often ask</i></h2></div>
          <div className="faq-list rv rv1">
            {faqs.map((f, i) => (
              <div className={`faq-item ${openFaq === i ? 'open' : ''}`} key={f.q}>
                <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="faq-q-text">{f.q}</span>
                  <div className="faq-icon"><svg viewBox="0 0 12 12"><line x1="6" y1="2" x2="6" y2="10" /><line x1="2" y1="6" x2="10" y2="6" /></svg></div>
                </div>
                <div className="faq-a"><div className="faq-a-inner">{f.a}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="location-band">
        <div className="rv">
          <div className="loc-label">Where we are</div>
          <h2>Based in <i>India,</i><br />building for the world</h2>
          <p>We work remotely with clients across the globe. Our studio is rooted in Kerala, India — but our work reaches San Francisco, London, Dubai, and beyond.</p>
          <div className="loc-details">
            <div className="loc-row"><div className="loc-ico"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg></div><div className="loc-text"><span>Studio</span>Kerala, India</div></div>
            <div className="loc-row"><div className="loc-ico"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg></div><div className="loc-text"><span>Working hours</span>Monday – Friday, 9am – 6pm IST</div></div>
            <div className="loc-row"><div className="loc-ico"><svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" /></svg></div><div className="loc-text"><span>Email</span>hello@rivuletduo.com</div></div>
          </div>
        </div>
        <div className="map-visual rv rv2">
          <canvas id="map-canvas" />
          <div className="map-overlay" />
          <div className="map-pin"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg></div>
          <div className="map-label">Kerala · India</div>
          <div className="map-coords">10.8505° N, 76.2711° E</div>
        </div>
      </div>

      <footer id="contact-footer">
        <div className="flogo">rivulet<b>duo</b></div>
        <ul className="flinks"><li><a href="/services">Services</a></li><li><a href="/work">Work</a></li><li><a href="/about">About</a></li><li><a href="/contact">Contact</a></li></ul>
        <div className="fcopy">© 2026 Rivuletduo. All rights reserved.</div>
      </footer>
    </>
  );
}
