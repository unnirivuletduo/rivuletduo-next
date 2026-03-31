'use client';

import { useEffect, useState } from 'react';
import Cursor from '@/components/Cursor';

export default function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  useEffect(() => {
    let disposed = false;
    const cleanups: Array<() => void> = [];
    document.body.classList.add('about-page-body');

    const init = async () => {
      const THREE = await import('three');
      if (disposed) return;

      const cur = document.getElementById('cur');
      const ring = document.getElementById('cur-ring');
      if (cur && ring) {
        let mx = 0, my = 0, rx = 0, ry = 0;
        const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
        document.addEventListener('mousemove', onMove);
        cleanups.push(() => document.removeEventListener('mousemove', onMove));

        const hoverEls = document.querySelectorAll('a,button,.tcard,.val,.stack-item,.tsoc');
        const enter = () => ring.classList.add('big');
        const leave = () => ring.classList.remove('big');
        hoverEls.forEach((el) => {
          el.addEventListener('mouseenter', enter);
          el.addEventListener('mouseleave', leave);
        });
        cleanups.push(() => {
          hoverEls.forEach((el) => {
            el.removeEventListener('mouseenter', enter);
            el.removeEventListener('mouseleave', leave);
          });
        });

        let raf = 0;
        const tick = () => {
          rx += (mx - rx) * 0.11;
          ry += (my - ry) * 0.11;
          (cur as HTMLElement).style.left = `${mx}px`;
          (cur as HTMLElement).style.top = `${my}px`;
          (ring as HTMLElement).style.left = `${rx}px`;
          (ring as HTMLElement).style.top = `${ry}px`;
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        cleanups.push(() => cancelAnimationFrame(raf));
      }

      const nav = document.getElementById('about-nav');
      const onScrollNav = () => nav?.classList.toggle('stuck', window.scrollY > 60);
      window.addEventListener('scroll', onScrollNav);
      cleanups.push(() => window.removeEventListener('scroll', onScrollNav));

      const revIO = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('on');
        });
      }, { threshold: 0.1 });
      document.querySelectorAll('.rv').forEach((el) => revIO.observe(el));
      cleanups.push(() => revIO.disconnect());

      {
        const hero = document.getElementById('about-hero');
        const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement | null;
        if (hero && canvas) {
          const W = () => hero.clientWidth;
          const H = () => hero.clientHeight;
          const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
          renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
          renderer.setClearColor(0xffffff, 1);
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(58, W() / H(), 0.1, 300);
          camera.position.set(0, 0, 42);

          const resize = () => {
            renderer.setSize(W(), H());
            camera.aspect = W() / H();
            camera.updateProjectionMatrix();
          };
          resize();
          window.addEventListener('resize', resize);
          cleanups.push(() => window.removeEventListener('resize', resize));

          scene.add(new THREE.AmbientLight(0xffffff, 1.5));
          const sun = new THREE.DirectionalLight(0x15803d, 3); sun.position.set(8, 14, 10); scene.add(sun);
          const rim = new THREE.DirectionalLight(0x86efac, 1.5); rim.position.set(-10, -5, 6); scene.add(rim);
          const mLight = new THREE.PointLight(0x22c55e, 0, 38); mLight.position.set(0, 0, 14); scene.add(mLight);

          const hc1: any[] = [], hc2: any[] = [];
          for (let i = 0; i < 60; i++) {
            const t = i / 59, a = t * Math.PI * 6, y = (t - 0.5) * 28;
            hc1.push(new THREE.Vector3(Math.cos(a) * 7, y, Math.sin(a) * 7));
            hc2.push(new THREE.Vector3(Math.cos(a + Math.PI) * 7, y, Math.sin(a + Math.PI) * 7));
          }
          const makeTube = (pts: any[], col: number, op: number) => {
            const g = new THREE.BufferGeometry().setFromPoints(pts);
            return new THREE.Line(g, new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: op }));
          };
          const h1 = makeTube(hc1, 0x16a34a, 0.45); scene.add(h1);
          const h2 = makeTube(hc2, 0x86efac, 0.25); scene.add(h2);

          for (let i = 0; i < 60; i += 3) {
            if (i < hc1.length && i < hc2.length) {
              const rG = new THREE.BufferGeometry().setFromPoints([hc1[i], hc2[i]]);
              scene.add(new THREE.Line(rG, new THREE.LineBasicMaterial({ color: 0xbbf7d0, transparent: true, opacity: 0.35 })));
            }
          }

          const nGeo = new THREE.SphereGeometry(0.22, 8, 8);
          const nMat = new THREE.MeshBasicMaterial({ color: 0x16a34a, transparent: true, opacity: 0.6 });
          hc1.concat(hc2).forEach((p) => { const n = new THREE.Mesh(nGeo, nMat); n.position.copy(p); scene.add(n); });

          for (let i = 0; i < 4; i++) {
            const r = new THREE.Mesh(
              new THREE.TorusGeometry(10 + i * 3, 0.015, 6, 120),
              new THREE.MeshBasicMaterial({ color: 0xbbf7d0, transparent: true, opacity: 0.18 - i * 0.03 }),
            );
            r.rotation.x = Math.PI / 2 + i * 0.3;
            r.rotation.z = i * 0.5;
            scene.add(r);
          }

          const PC = 180;
          const pp = new Float32Array(PC * 3);
          for (let i = 0; i < PC; i++) {
            pp[i * 3] = (Math.random() - 0.5) * 60;
            pp[i * 3 + 1] = (Math.random() - 0.5) * 40;
            pp[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10;
          }
          const pGeo = new THREE.BufferGeometry();
          pGeo.setAttribute('position', new THREE.BufferAttribute(pp, 3));
          scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x22c55e, size: 0.13, transparent: true, opacity: 0.55 })));

          let mouseX = 0, mouseY = 0, camX = 0, camY = 0;
          const onHeroMove = (e: MouseEvent) => {
            const r = hero.getBoundingClientRect();
            mouseX = ((e.clientX - r.left) / r.width) * 2 - 1;
            mouseY = -(((e.clientY - r.top) / r.height) * 2 - 1);
            mLight.position.set(mouseX * 18, mouseY * 11, 15);
            mLight.intensity = 3.5;
          };
          const onHeroLeave = () => { mLight.intensity = 0; };
          hero.addEventListener('mousemove', onHeroMove);
          hero.addEventListener('mouseleave', onHeroLeave);
          cleanups.push(() => {
            hero.removeEventListener('mousemove', onHeroMove);
            hero.removeEventListener('mouseleave', onHeroLeave);
          });

          const clock = new THREE.Clock();
          let raf = 0;
          const animate = () => {
            raf = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            h1.rotation.y = t * 0.09;
            h2.rotation.y = t * 0.09;
            scene.children.forEach((c: any) => {
              if (c.isMesh && c.geometry?.type === 'TorusGeometry') c.rotation.z += 0.003;
            });
            camX += (mouseX * 2.5 - camX) * 0.04;
            camY += (mouseY * 1.5 - camY) * 0.04;
            camera.position.set(camX, camY, 42);
            camera.lookAt(0, 0, 0);
            renderer.render(scene, camera);
          };
          animate();
          cleanups.push(() => {
            cancelAnimationFrame(raf);
            renderer.dispose();
          });
        }
      }

      {
        const el = document.getElementById('story-canvas') as HTMLCanvasElement | null;
        const parent = el?.parentElement;
        if (el && parent) {
          const renderer = new THREE.WebGLRenderer({ canvas: el, antialias: true, alpha: true });
          renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
          renderer.setClearColor(0xffffff, 1);
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
          camera.position.z = 22;
          scene.add(new THREE.AmbientLight(0xffffff, 1.5));
          const d = new THREE.DirectionalLight(0x16a34a, 2.5); d.position.set(5, 8, 6); scene.add(d);
          const d2 = new THREE.DirectionalLight(0x86efac, 1.2); d2.position.set(-6, -4, 4); scene.add(d2);

          const resize = () => {
            const w = parent.clientWidth, h = parent.clientHeight;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
          };
          resize();
          const ro = new ResizeObserver(resize);
          ro.observe(parent);

          const bGeo = new THREE.SphereGeometry(6, 48, 48);
          const bPos = (bGeo.attributes.position.array as Float32Array).slice();
          const workPos = new Float32Array(bPos.length);
          const bGeoW = new THREE.BufferGeometry();
          bGeoW.setAttribute('position', new THREE.BufferAttribute(workPos, 3));
          bGeoW.setIndex(bGeo.index);
          bGeoW.computeVertexNormals();
          scene.add(new THREE.Mesh(bGeoW, new THREE.MeshPhongMaterial({ color: 0xbbf7d0, emissive: 0xf0fdf4, wireframe: true, transparent: true, opacity: 0.5 })));

          const iGeo = new THREE.SphereGeometry(5, 32, 32);
          scene.add(new THREE.Mesh(iGeo, new THREE.MeshPhongMaterial({ color: 0xf0fdf4, emissive: 0xf8fffe, transparent: true, opacity: 0.6 })));

          const gridGeo = new THREE.PlaneGeometry(28, 28, 18, 18);
          const grid = new THREE.Mesh(gridGeo, new THREE.MeshBasicMaterial({ color: 0xd1fae5, wireframe: true, transparent: true, opacity: 0.3 }));
          grid.position.z = -8;
          grid.rotation.x = 0.3;
          scene.add(grid);

          const PC2 = 120;
          const pP = new Float32Array(PC2 * 3);
          for (let i = 0; i < PC2; i++) {
            const a = Math.random() * Math.PI * 2;
            const b = Math.acos(2 * Math.random() - 1);
            const r = 7 + Math.random() * 5;
            pP[i * 3] = r * Math.sin(b) * Math.cos(a);
            pP[i * 3 + 1] = r * Math.sin(b) * Math.sin(a);
            pP[i * 3 + 2] = r * Math.cos(b);
          }
          const sG = new THREE.BufferGeometry();
          sG.setAttribute('position', new THREE.BufferAttribute(pP, 3));
          scene.add(new THREE.Points(sG, new THREE.PointsMaterial({ color: 0x16a34a, size: 0.18, transparent: true, opacity: 0.6 })));

          const VC = bGeo.attributes.position.count;
          const clock = new THREE.Clock();
          let raf = 0;
          const animate = () => {
            raf = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            for (let i = 0; i < VC; i++) {
              const x = bPos[i * 3], y = bPos[i * 3 + 1], z = bPos[i * 3 + 2];
              const n = Math.sin(x * 0.4 + t * 0.5) * Math.cos(y * 0.4 + t * 0.38) * Math.sin(z * 0.3 + t * 0.45) * 1.6;
              const len = Math.sqrt(x * x + y * y + z * z) || 1;
              workPos[i * 3] = (x / len) * (6 + n);
              workPos[i * 3 + 1] = (y / len) * (6 + n);
              workPos[i * 3 + 2] = (z / len) * (6 + n);
            }
            (bGeoW.attributes.position as any).needsUpdate = true;
            bGeoW.computeVertexNormals();
            (scene.children[0] as any).rotation.y = t * 0.06;
            (scene.children[0] as any).rotation.x = t * 0.04;
            (scene.children[1] as any).rotation.y = -t * 0.05;
            renderer.render(scene, camera);
          };
          animate();
          cleanups.push(() => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            renderer.dispose();
          });
        }
      }

      const makeTeamCanvas = (id: string, hue: number) => {
        const el = document.getElementById(id) as HTMLCanvasElement | null;
        const parent = el?.parentElement;
        if (!el || !parent) return;
        const renderer = new THREE.WebGLRenderer({ canvas: el, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
        renderer.setClearColor(0xfafffe, 1);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
        camera.position.z = 18;
        const resize = () => {
          const w = parent.clientWidth, h = parent.clientHeight;
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(parent);

        scene.add(new THREE.AmbientLight(0xffffff, 1.8));
        const d = new THREE.DirectionalLight(hue === 1 ? 0x22c55e : 0x16a34a, 2.5);
        d.position.set(6, 8, 5);
        scene.add(d);

        let raf = 0;
        if (hue === 1) {
          const ico = new THREE.Mesh(
            new THREE.IcosahedronGeometry(5, 1),
            new THREE.MeshBasicMaterial({ color: 0xbbf7d0, wireframe: true, transparent: true, opacity: 0.5 }),
          );
          scene.add(ico);
          for (let i = 0; i < 3; i++) {
            const r = new THREE.Mesh(
              new THREE.TorusGeometry(6 + i * 1.5, 0.025, 6, 80),
              new THREE.MeshBasicMaterial({ color: 0x86efac, transparent: true, opacity: 0.3 - i * 0.06 }),
            );
            r.rotation.x = Math.PI / 3 + i * Math.PI / 5;
            r.rotation.z = i * Math.PI / 4;
            scene.add(r);
          }
          const PC = 80, pp = new Float32Array(PC * 3);
          for (let i = 0; i < PC; i++) {
            const a = Math.random() * Math.PI * 2, b = Math.acos(2 * Math.random() - 1), r = 8 + Math.random() * 4;
            pp[i * 3] = r * Math.sin(b) * Math.cos(a);
            pp[i * 3 + 1] = r * Math.sin(b) * Math.sin(a);
            pp[i * 3 + 2] = r * Math.cos(b);
          }
          const pg = new THREE.BufferGeometry();
          pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
          scene.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x16a34a, size: 0.16, transparent: true, opacity: 0.65 })));
          const clock = new THREE.Clock();
          const animate = () => {
            raf = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            ico.rotation.y = t * 0.08;
            ico.rotation.x = t * 0.05;
            scene.children.forEach((c: any, i: number) => {
              if (c.isMesh && c.geometry?.type === 'TorusGeometry') c.rotation.z += 0.004 + i * 0.001;
            });
            renderer.render(scene, camera);
          };
          animate();
        } else {
          const gG = new THREE.PlaneGeometry(24, 24, 14, 14);
          const gM = new THREE.Mesh(gG, new THREE.MeshBasicMaterial({ color: 0xd1fae5, wireframe: true, transparent: true, opacity: 0.45 }));
          gM.rotation.x = -Math.PI / 2.5;
          scene.add(gM);

          const floaters: Array<{ m: any; speed: number; off: number }> = [];
          for (let i = 0; i < 8; i++) {
            const m = new THREE.Mesh(
              new THREE.OctahedronGeometry(0.5 + Math.random() * 0.8, 0),
              new THREE.MeshBasicMaterial({ color: 0x86efac, wireframe: true, transparent: true, opacity: 0.45 + Math.random() * 0.3 }),
            );
            m.position.set((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6 - 2);
            scene.add(m);
            floaters.push({ m, speed: 0.3 + Math.random() * 0.4, off: Math.random() * Math.PI * 2 });
          }
          const clock = new THREE.Clock();
          const animate = () => {
            raf = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            gM.rotation.z = t * 0.03;
            floaters.forEach((f) => {
              f.m.rotation.x += 0.012;
              f.m.rotation.y += 0.008;
              f.m.position.y += Math.sin(t * f.speed + f.off) * 0.008;
            });
            renderer.render(scene, camera);
          };
          animate();
        }

        cleanups.push(() => {
          cancelAnimationFrame(raf);
          ro.disconnect();
          renderer.dispose();
        });
      };
      makeTeamCanvas('tc1', 1);
      makeTeamCanvas('tc2', 2);

      {
        const el = document.getElementById('cta-canvas') as HTMLCanvasElement | null;
        const parent = el?.parentElement;
        if (el && parent) {
          const renderer = new THREE.WebGLRenderer({ canvas: el, antialias: true, alpha: true });
          renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
          renderer.setClearColor(0, 0);
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
          camera.position.set(0, 6, 22);
          camera.lookAt(0, 0, 0);
          const resize = () => {
            const w = parent.clientWidth, h = parent.clientHeight;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
          };
          resize();
          window.addEventListener('resize', resize);

          scene.add(new THREE.AmbientLight(0xffffff, 1.2));
          const d = new THREE.DirectionalLight(0x22c55e, 1.8); d.position.set(0, 10, 5); scene.add(d);

          const GRID_W = 60, GRID_H = 40;
          const wGeo = new THREE.PlaneGeometry(44, 28, GRID_W, GRID_H);
          const origY = new Float32Array(wGeo.attributes.position.count);
          for (let i = 0; i < wGeo.attributes.position.count; i++) origY[i] = wGeo.attributes.position.getY(i);
          scene.add(new THREE.Mesh(wGeo, new THREE.MeshPhongMaterial({ color: 0xbbf7d0, wireframe: true, transparent: true, opacity: 0.4 })));

          const PC = 100;
          const pp = new Float32Array(PC * 3);
          for (let i = 0; i < PC; i++) {
            pp[i * 3] = (Math.random() - 0.5) * 44;
            pp[i * 3 + 1] = Math.random() * 6;
            pp[i * 3 + 2] = (Math.random() - 0.5) * 28;
          }
          const pg = new THREE.BufferGeometry();
          pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
          scene.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x16a34a, size: 0.14, transparent: true, opacity: 0.5 })));

          const clock = new THREE.Clock();
          let raf = 0;
          const animate = () => {
            raf = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            for (let i = 0; i < wGeo.attributes.position.count; i++) {
              const x = wGeo.attributes.position.getX(i), z = wGeo.attributes.position.getZ(i);
              wGeo.attributes.position.setY(i, origY[i] + Math.sin(x * 0.3 + t * 0.5) * 0.9 + Math.sin(z * 0.35 + t * 0.38) * 0.7);
            }
            (wGeo.attributes.position as any).needsUpdate = true;
            wGeo.computeVertexNormals();
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

      {
        const track = document.getElementById('tl-track');
        const items = Array.from(document.querySelectorAll('.tl-item'));
        if (track) {
          const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) track.classList.add('on');
            });
          }, { threshold: 0.1 });
          io.observe(track);
          cleanups.push(() => io.disconnect());
        }
        items.forEach((item) => {
          const io2 = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                item.classList.add('on');
                io2.disconnect();
              }
            });
          }, { threshold: 0.4 });
          io2.observe(item);
          cleanups.push(() => io2.disconnect());
        });
      }

      {
        const vals = document.querySelectorAll('.val');
        vals.forEach((v) => {
          v.querySelectorAll('svg path, svg circle, svg line, svg rect, svg polygon').forEach((el) => {
            try {
              const l = Math.ceil((el as SVGPathElement).getTotalLength()) + 4;
              el.setAttribute('stroke-dasharray', `${l}`);
              el.setAttribute('stroke-dashoffset', `${l}`);
              (el as HTMLElement).style.transition = 'none';
            } catch {}
          });
        });
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.querySelectorAll('svg path, svg circle, svg line, svg rect, svg polygon').forEach((el, i) => {
                setTimeout(() => {
                  const l = parseFloat(el.getAttribute('stroke-dasharray') || '200');
                  (el as HTMLElement).style.transition = `stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`;
                  el.setAttribute('stroke-dashoffset', '0');
                }, 100);
              });
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.3 });
        const to = setTimeout(() => vals.forEach((v) => io.observe(v)), 600);
        cleanups.push(() => {
          clearTimeout(to);
          io.disconnect();
        });
      }

      {
        const items = document.querySelectorAll('.stack-item');
        items.forEach((item) => {
          (item as HTMLElement).style.opacity = '0';
          (item as HTMLElement).style.transform = 'translateX(-12px)';
          (item as HTMLElement).style.transition = 'none';
        });
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.target.parentElement) {
              const siblings = Array.from(entry.target.parentElement.querySelectorAll('.stack-item'));
              siblings.forEach((s, i) => {
                setTimeout(() => {
                  (s as HTMLElement).style.transition = 'opacity .5s ease, transform .5s ease';
                  (s as HTMLElement).style.opacity = '1';
                  (s as HTMLElement).style.transform = 'none';
                }, i * 80);
              });
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.2 });
        document.querySelectorAll('.stack-cat').forEach((c) => io.observe(c));
        cleanups.push(() => io.disconnect());
      }
    };

    init();

    return () => {
      disposed = true;
      cleanups.forEach((fn) => fn());
      document.body.classList.remove('about-page-body');
    };
  }, []);

  return (
    <>
      <Cursor />
      <nav id="about-nav">
        <a href="/" className="logo">rivulet<b>duo</b></a>
        <ul className="nav-links">
          <li><a href="/services">Services</a></li>
          <li><a href="/work">Work</a></li>
          <li><a href="/about" className="active">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        <a className="nav-btn" href="/contact">Start a Project</a>
        <button className={`nav-toggle ${menuOpen ? 'open' : ''}`} aria-label="Toggle menu" aria-expanded={menuOpen} aria-controls="about-mobile-menu" onClick={() => setMenuOpen((v) => !v)}>
          <span />
          <span />
          <span />
        </button>
        <div id="about-mobile-menu" className={`nav-mobile-menu ${menuOpen ? 'open' : ''}`}>
          <a href="/services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="/work" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="/about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="/contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <a href="/contact" onClick={() => setMenuOpen(false)}>Start a Project</a>
        </div>
      </nav>

      <div className="about-hero" id="about-hero">
        <canvas id="hero-canvas" />
        <div className="hero-vignette" />
        <div className="hero-vignette2" />

        <div className="hero-copy">
          <div className="h-eyebrow">About the Studio</div>
          <h1>Two minds,<br />one <i>vision</i></h1>
          <p className="h-sub">We are Rivuletduo — a tight-knit studio where engineering precision meets design intuition. We build the web experiences people remember.</p>
        </div>

        <div className="h-scroll">
          <div className="h-scroll-line" />
          <span>Scroll</span>
        </div>

        <div className="hero-stats">
          <div className="hs"><span className="hs-n">48+</span><span className="hs-l">Projects</span></div>
          <div className="hs"><span className="hs-n">6yr</span><span className="hs-l">Experience</span></div>
          <div className="hs"><span className="hs-n">100%</span><span className="hs-l">Satisfaction</span></div>
        </div>
      </div>

      <div className="ticker-wrap">
        <div className="ticker">
          {['Two Person Studio', 'Kerala, India', 'Remote Friendly', 'Founded 2019', 'Open to Collaboration', 'Full-Stack Craft', 'Two Person Studio', 'Kerala, India', 'Remote Friendly', 'Founded 2019', 'Open to Collaboration', 'Full-Stack Craft'].map((item, idx) => (
            <span key={idx} className="ticker-item">{item}<span className="tdot" /></span>
          ))}
        </div>
      </div>

      <section id="story">
        <div className="label rv">Our Story</div>
        <h2 className="rv rv1">Where we <i>began</i></h2>
        <div className="story-inner">
          <div className="story-left rv rv2">
            <p>Rivuletduo was born from a shared obsession — the belief that a website is never just a website. It is a living thing: it breathes, it moves, it <i>speaks</i> before a word is read.</p>
            <p>We met building side projects late into the night, each bringing a different half of the equation. One thinking in pixels and space, the other in systems and logic. The result was something neither could build alone.</p>
            <p>Since 2019 we have partnered with startups, creative agencies, and ambitious founders who refuse to settle for ordinary. Every project we take on becomes a reflection of that ethos — deliberate, precise, and made to last.</p>
          </div>
          <div className="story-right rv rv3">
            <div className="story-visual">
              <canvas id="story-canvas" />
              <div className="story-badge">
                <div className="story-badge-n">2019</div>
                <div className="story-badge-l">Founded</div>
              </div>
              <div className="story-tag">Est. Kerala</div>
            </div>
          </div>
        </div>
      </section>

      <section id="values">
        <div className="label rv">What We Stand For</div>
        <h2 className="rv rv1">Our <i>principles</i></h2>
        <div className="values-grid">
          <div className="val rv rv1">
            <div className="val-n">01</div>
            <div className="val-ico"><svg viewBox="0 0 44 44"><path d="M22 6 L38 14 L38 30 L22 38 L6 30 L6 14 Z" /><circle cx="22" cy="22" r="5" /><line x1="22" y1="6" x2="22" y2="17" /><line x1="22" y1="27" x2="22" y2="38" /><line x1="6" y1="14" x2="17" y2="19" /><line x1="27" y1="25" x2="38" y2="30" /></svg></div>
            <h3>Craft over speed</h3>
            <p>We would rather take an extra day and deliver something extraordinary than rush a mediocre product. Quality is non-negotiable — every line of code, every spacing decision earns its place.</p>
          </div>
          <div className="val rv rv2">
            <div className="val-n">02</div>
            <div className="val-ico"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="16" /><path d="M14 22 C14 17 17.5 13 22 13 C26.5 13 30 17 30 22" /><path d="M18 22 C18 19 19.8 16.5 22 16.5" /><circle cx="22" cy="22" r="3" /></svg></div>
            <h3>Radical transparency</h3>
            <p>No black boxes, no magic tricks. We communicate every decision, every constraint, every trade-off — so you always know exactly where your project stands and why.</p>
          </div>
          <div className="val rv rv3">
            <div className="val-n">03</div>
            <div className="val-ico"><svg viewBox="0 0 44 44"><path d="M10 34 L22 8 L34 34" /><path d="M14.5 26 L29.5 26" /><path d="M22 8 L22 34" /></svg></div>
            <h3>Performance is design</h3>
            <p>A slow website is a broken website. We treat Core Web Vitals and load time as design constraints from day one — not an afterthought patched on before launch.</p>
          </div>
          <div className="val rv rv1">
            <div className="val-n">04</div>
            <div className="val-ico"><svg viewBox="0 0 44 44"><rect x="8" y="20" width="10" height="16" rx="2" /><rect x="17" y="12" width="10" height="24" rx="2" /><rect x="26" y="16" width="10" height="20" rx="2" /><line x1="8" y1="36" x2="36" y2="36" /></svg></div>
            <h3>Data-informed decisions</h3>
            <p>Every layout choice, every CTA placement, every interaction is grounded in real user behaviour and business metrics. We design with purpose, not guesswork.</p>
          </div>
          <div className="val rv rv2">
            <div className="val-n">05</div>
            <div className="val-ico"><svg viewBox="0 0 44 44"><path d="M22 8 C14 8 8 14 8 22 C8 30 14 36 22 36" /><path d="M22 8 C30 8 36 14 36 22 C36 30 30 36 22 36" /><line x1="8" y1="22" x2="36" y2="22" /><path d="M15 13 Q22 18 29 13" /><path d="M15 31 Q22 26 29 31" /></svg></div>
            <h3>Long-term thinking</h3>
            <p>We build for the next five years, not the next sprint. Scalable architecture, clean handoffs, and comprehensive documentation are not optional extras — they are our standard.</p>
          </div>
          <div className="val rv rv3">
            <div className="val-n">06</div>
            <div className="val-ico"><svg viewBox="0 0 44 44"><circle cx="22" cy="16" r="7" /><path d="M10 36 C10 29.4 15.4 24 22 24 C28.6 24 34 29.4 34 36" /><path d="M32 10 C33.5 12 34 14.5 33 17" /><path d="M36 8 C38.5 11.5 39 16 37 20" /></svg></div>
            <h3>Partnership, not service</h3>
            <p>We do not hand you a finished file and disappear. We become embedded in your product&apos;s story — advisors, builders, and advocates for the long haul.</p>
          </div>
        </div>
      </section>

      <section id="team">
        <div className="label rv">The People</div>
        <h2 className="rv rv1">Meet the <i>duo</i></h2>
        <div className="team-intro rv rv2"><p>Two people. Complementary strengths. A shared standard of care that runs through every project we touch.</p></div>
        <div className="team-grid">
          <div className="tcard rv rv1">
            <div className="tcard-vis"><canvas className="tcard-canvas" id="tc1" /><div className="tcard-overlay" /></div>
            <div className="tcard-info">
              <div className="tcard-role">Co-Founder · Design & Frontend</div>
              <div className="tcard-name">Aryan Mehta</div>
              <p className="tcard-bio">Aryan leads visual direction and frontend architecture. He obsesses over type, motion, and the invisible moments between interactions that make an interface feel <em>alive</em>.</p>
              <div className="tcard-skills"><span className="tskill">Figma</span><span className="tskill">React</span><span className="tskill">Three.js</span><span className="tskill">CSS Animation</span><span className="tskill">UI Systems</span></div>
            </div>
            <div className="tcard-social">
              <div className="tsoc"><svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg></div>
              <div className="tsoc"><svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" /></svg></div>
            </div>
          </div>
          <div className="tcard rv rv2">
            <div className="tcard-vis"><canvas className="tcard-canvas" id="tc2" /><div className="tcard-overlay" /></div>
            <div className="tcard-info">
              <div className="tcard-role">Co-Founder · Engineering & Strategy</div>
              <div className="tcard-name">Rahul Nair</div>
              <p className="tcard-bio">Rahul architects the systems that make everything run. He lives in the spaces between database query and rendered pixel — finding the optimisation no-one else thought to look for.</p>
              <div className="tcard-skills"><span className="tskill">Next.js</span><span className="tskill">Node.js</span><span className="tskill">PostgreSQL</span><span className="tskill">GraphQL</span><span className="tskill">DevOps</span></div>
            </div>
            <div className="tcard-social">
              <div className="tsoc"><svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg></div>
              <div className="tsoc"><svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" /></svg></div>
            </div>
          </div>
        </div>
      </section>

      <section id="timeline">
        <div className="label rv">Our Journey</div>
        <h2 className="rv rv1">Built <i>over time</i></h2>
        <div className="tl-track" id="tl-track">
          <div className="tl-line" />
          <div className="tl-item"><div className="tl-left"><div className="tl-year">2019</div><div className="tl-content"><div className="tl-title">The beginning</div><p className="tl-desc">Two developers, one shared Notion doc, and a stubborn conviction that small studios could outperform large agencies. Rivuletduo takes its first client project.</p></div></div><div className="tl-center"><div className="tl-dot" /></div><div className="tl-right" /></div>
          <div className="tl-item"><div className="tl-left" /><div className="tl-center"><div className="tl-dot" /></div><div className="tl-right"><div className="tl-year">2020</div><div className="tl-content"><div className="tl-title">Going fully remote</div><p className="tl-desc">We formalise a fully remote workflow and onboard our first international clients. The studio doubles its project count in twelve months.</p></div></div></div>
          <div className="tl-item"><div className="tl-left"><div className="tl-year">2021</div><div className="tl-content"><div className="tl-title">First e-commerce milestone</div><p className="tl-desc">Verdant Goods launches — our most ambitious Shopify build to date. Conversion rates jump 40% within the first quarter, setting a new benchmark for our e-commerce practice.</p></div></div><div className="tl-center"><div className="tl-dot" /></div><div className="tl-right" /></div>
          <div className="tl-item"><div className="tl-left" /><div className="tl-center"><div className="tl-dot" /></div><div className="tl-right"><div className="tl-year">2022</div><div className="tl-content"><div className="tl-title">Three.js & immersive web</div><p className="tl-desc">We invest deeply in WebGL and immersive interfaces. FlowMetrics launches with a fully 3D data dashboard — a project featured in three design publications.</p></div></div></div>
          <div className="tl-item"><div className="tl-left"><div className="tl-year">2024</div><div className="tl-content"><div className="tl-title">48 projects shipped</div><p className="tl-desc">We reach 48 shipped projects, zero compromised deadlines, and a client satisfaction rate we are quietly proud of. Every one of those clients has our direct number.</p></div></div><div className="tl-center"><div className="tl-dot" /></div><div className="tl-right" /></div>
        </div>
      </section>

      <section id="philosophy">
        <span className="phil-mark rv">&quot;</span>
        <p className="phil-text rv rv1">The web is the most <em>intimate</em> canvas ever invented. It can see you, respond to you, change for you. We think that demands more than most studios are willing to give.</p>
        <div className="phil-attr rv rv2">Aryan & Rahul — Rivuletduo</div>
      </section>

      <section id="stack">
        <div className="label rv">How We Build</div>
        <h2 className="rv rv1">Our <i>stack</i></h2>
        <div className="stack-grid rv rv2">
          <div className="stack-cat"><div className="stack-cat-label">Design</div><div className="stack-items"><div className="stack-item">Figma</div><div className="stack-item">Framer</div><div className="stack-item">Adobe Illustrator</div><div className="stack-item">Lottie / Rive</div><div className="stack-item">Spline</div></div></div>
          <div className="stack-cat"><div className="stack-cat-label">Frontend</div><div className="stack-items"><div className="stack-item">React / Next.js</div><div className="stack-item">Three.js / GSAP</div><div className="stack-item">TypeScript</div><div className="stack-item">Tailwind CSS</div><div className="stack-item">Framer Motion</div></div></div>
          <div className="stack-cat"><div className="stack-cat-label">Backend</div><div className="stack-items"><div className="stack-item">Node.js / Express</div><div className="stack-item">PostgreSQL</div><div className="stack-item">GraphQL</div><div className="stack-item">Prisma ORM</div><div className="stack-item">Supabase</div></div></div>
          <div className="stack-cat"><div className="stack-cat-label">CMS & Infra</div><div className="stack-items"><div className="stack-item">Sanity.io</div><div className="stack-item">Contentful</div><div className="stack-item">Vercel / Netlify</div><div className="stack-item">Shopify / WooCommerce</div><div className="stack-item">AWS S3 / CloudFront</div></div></div>
        </div>
      </section>

      <section id="cta">
        <canvas id="cta-canvas" />
        <div className="cta-inner">
          <div className="label rv" style={{ justifyContent: 'center' }}>Work With Us</div>
          <h2 className="rv rv1">Ready to <i>build</i><br />something real?</h2>
          <p className="rv rv2">Tell us about your project. We take on a small number of clients at a time — so when you work with Rivuletduo, you get our full attention.</p>
          <div className="cta-btns rv rv3">
            <a className="btn-g" href="/contact">Start a Project</a>
            <a className="btn-ghost" href="/work">See Our Work</a>
          </div>
        </div>
      </section>

      <footer id="about-footer">
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
