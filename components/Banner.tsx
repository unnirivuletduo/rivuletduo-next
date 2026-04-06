'use client';
import { useEffect, useRef } from 'react';
import type { HomeBannerContent } from '@/lib/cms';

const TICKER_ITEMS = [
  'React & Next.js', 'Tailwind & Motion', 'Node & Express',
  'PostgreSQL & Supabase', 'UI / UX Design', 'API Architecture',
  'Performance Optimisation', 'SEO & Analytics',
];

type BannerProps = {
  content?: HomeBannerContent;
};

export default function Banner({ content }: BannerProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let THREE: any;
    let cleanupFn: (() => void) | null = null;

    async function init() {
      THREE = await import('three');
      const banner = bannerRef.current;
      const cvs = canvasRef.current;
      if (!banner || !cvs) return;

      const W = () => banner.clientWidth;
      const H = () => banner.clientHeight;
      const renderer = new THREE.WebGLRenderer({ canvas: cvs, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setClearColor(0xffffff, 1);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
      camera.position.z = 30;

      function onResize() {
        renderer.setSize(W(), H());
        camera.aspect = W() / H();
        camera.updateProjectionMatrix();
      }
      onResize();
      window.addEventListener('resize', onResize);

      // RD text pixels
      const CW = 1100, CH = 300, FS = 260, STEP = 4;
      const tc = document.createElement('canvas');
      tc.width = CW; tc.height = CH;
      const ctx = tc.getContext('2d')!;
      ctx.fillStyle = '#000';
      ctx.font = `bold ${FS}px "Bebas Neue",Impact,"Arial Black",sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('RD', CW / 2, CH / 2);
      const imgData = ctx.getImageData(0, 0, CW, CH).data;
      const PX: number[] = [];
      for (let y = 0; y < CH; y += STEP)
        for (let x = 0; x < CW; x += STEP)
          if (imgData[((y * CW) + x) * 4 + 3] > 60)
            PX.push((x / CW - 0.5) * 100, -(y / CH - 0.5) * 20);

      const N = PX.length >> 1;
      const NL = 5, LZ = [0, -0.5, -1, -1.55, -2.1], AMB = 800;
      const TOTAL = N * NL + AMB;
      const LC = [[0.133, 0.502, 0.239], [0.086, 0.392, 0.180], [0.055, 0.290, 0.130], [0.031, 0.196, 0.090], [0.016, 0.118, 0.055]];
      const AMBC = [0.55, 0.82, 0.62];
      const pos = new Float32Array(TOTAL * 3), vel = new Float32Array(TOTAL * 3);
      const tgt = new Float32Array(N * NL * 3), aCl = new Float32Array(TOTAL * 3);
      const aSz = new Float32Array(TOTAL), aPh = new Float32Array(TOTAL);

      const scat = (b: number) => {
        pos[b] = (Math.random() - 0.5) * 72;
        pos[b + 1] = (Math.random() - 0.5) * 44;
        pos[b + 2] = (Math.random() - 0.5) * 28;
      };

      for (let l = 0; l < NL; l++) {
        const [r, g, b] = LC[l];
        for (let p = 0; p < N; p++) {
          const i = l * N + p, b3 = i * 3;
          tgt[b3] = PX[p * 2]; tgt[b3 + 1] = PX[p * 2 + 1]; tgt[b3 + 2] = LZ[l];
          scat(b3);
          aCl[b3] = r; aCl[b3 + 1] = g; aCl[b3 + 2] = b;
          aSz[i] = l === 0 ? 0.32 + Math.random() * 0.13 : l === 1 ? 0.22 + Math.random() * 0.07 : 0.13 + Math.random() * 0.05;
          aPh[i] = Math.random() * Math.PI * 2;
        }
      }
      const [ar, ag, ab2] = AMBC;
      for (let i = 0; i < AMB; i++) {
        const idx = N * NL + i, b3 = idx * 3;
        pos[b3] = (Math.random() - 0.5) * 80;
        pos[b3 + 1] = (Math.random() - 0.5) * 50;
        pos[b3 + 2] = (Math.random() - 0.5) * 30 - 6;
        vel[b3] = (Math.random() - 0.5) * 0.014;
        vel[b3 + 1] = (Math.random() - 0.5) * 0.014;
        vel[b3 + 2] = (Math.random() - 0.5) * 0.004;
        aCl[b3] = ar; aCl[b3 + 1] = ag; aCl[b3 + 2] = ab2;
        aSz[idx] = 0.04 + Math.random() * 0.065;
        aPh[idx] = Math.random() * Math.PI * 2;
      }

      const geo = new THREE.BufferGeometry();
      const pAttr = new THREE.BufferAttribute(pos, 3);
      pAttr.setUsage(THREE.DynamicDrawUsage);
      geo.setAttribute('position', pAttr);
      geo.setAttribute('aCol', new THREE.BufferAttribute(aCl, 3));
      geo.setAttribute('aSz', new THREE.BufferAttribute(aSz, 1));

      const pMat = new THREE.ShaderMaterial({
        vertexShader: `attribute vec3 aCol;attribute float aSz;varying vec3 vC;varying float vAlpha;
        void main(){vC=aCol;vec4 mv=modelViewMatrix*vec4(position,1.0);float dist=-mv.z;
        gl_PointSize=aSz*(500.0/dist);vAlpha=smoothstep(0.0,3.5,dist)*(1.0-smoothstep(65.0,95.0,dist));
        gl_Position=projectionMatrix*mv;}`,
        fragmentShader: `varying vec3 vC;varying float vAlpha;
        void main(){vec2 uv=gl_PointCoord-.5;float d=length(uv);if(d>.5)discard;
        float core=1.0-smoothstep(.12,.42,d);float halo=(1.0-smoothstep(.32,.5,d))*.45;
        float alpha=(core+halo)*vAlpha*.95;gl_FragColor=vec4(vC,alpha);}`,
        transparent: true, depthTest: true, depthWrite: false,
      });

      const MAX_LINES = 700, lp = new Float32Array(MAX_LINES * 6);
      const lGeo = new THREE.BufferGeometry();
      const lAttr = new THREE.BufferAttribute(lp, 3);
      lAttr.setUsage(THREE.DynamicDrawUsage);
      lGeo.setAttribute('position', lAttr);
      lGeo.setDrawRange(0, 0);
      const lMat = new THREE.LineBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0 });

      const t1 = new THREE.Mesh(
        new THREE.TorusGeometry(12, 0.03, 6, 160),
        new THREE.MeshBasicMaterial({ color: 0x15803d, transparent: true, opacity: 0 })
      );
      const group = new THREE.Group();
      group.add(new THREE.Points(geo, pMat));
      group.add(new THREE.LineSegments(lGeo, lMat));
      group.add(t1);
      scene.add(group);

      // Ambient bg dots
      const DC = 300, dPos = new Float32Array(DC * 3), dVel = new Float32Array(DC * 3), dBase = new Float32Array(DC * 3);
      for (let i = 0; i < DC; i++) {
        const x = (Math.random() - 0.5) * 140, y = (Math.random() - 0.5) * 90, z = (Math.random() - 0.5) * 40 - 15;
        dPos[i * 3] = x; dPos[i * 3 + 1] = y; dPos[i * 3 + 2] = z;
        dBase[i * 3] = x; dBase[i * 3 + 1] = y; dBase[i * 3 + 2] = z;
      }
      const dGeo = new THREE.BufferGeometry();
      const dAttr = new THREE.BufferAttribute(dPos, 3);
      dAttr.setUsage(THREE.DynamicDrawUsage);
      dGeo.setAttribute('position', dAttr);
      const dMat = new THREE.ShaderMaterial({
        vertexShader: `void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);gl_PointSize=550.0/-mv.z;gl_Position=projectionMatrix*mv;}`,
        fragmentShader: `void main(){vec2 uv=gl_PointCoord-.5;if(length(uv)>.5)discard;gl_FragColor=vec4(.086,.392,.180,.1);}`,
        transparent: true, depthWrite: false,
      });
      scene.add(new THREE.Points(dGeo, dMat));

      const m3 = new THREE.Vector3(999, 999, 0);
      function setMouse(cx: number, cy: number) {
        const nx = (cx / W()) * 2 - 1, ny = -((cy / H()) * 2 - 1);
        const v = new THREE.Vector3(nx, ny, 0.5).unproject(camera);
        const dv = v.sub(camera.position).normalize();
        m3.copy(camera.position).addScaledVector(dv, -camera.position.z / dv.z);
      }

      const onMouseMove = (e: MouseEvent) => setMouse(e.clientX, e.clientY - banner.getBoundingClientRect().top);
      const onMouseLeave = () => m3.set(999, 999, 0);
      banner.addEventListener('mousemove', onMouseMove);
      banner.addEventListener('mouseleave', onMouseLeave);

      let exploding = false;
      const onClick = () => { exploding = true; setTimeout(() => { exploding = false; }, 140); };
      banner.addEventListener('click', onClick);

      let camTX = 0, camTY = 0, camCX = 0, camCY = 0;
      const onCamMove = (e: MouseEvent) => {
        camTX = ((e.clientX / W()) - 0.5) * 2;
        camTY = -(((e.clientY - banner.getBoundingClientRect().top) / H()) - 0.5) * 1.4;
      };
      banner.addEventListener('mousemove', onCamMove);

      const clock = new THREE.Clock();
      let fp = 0, currentScale = 1;
      const SPR = 0.06, DMP = 0.878, RR = 5, RF = 1.8, EF = 4.8, CD = 0.42;
      const WAVE_SPEED = 0.85, WAVE_FREQ = 0.24, WAVE_AMP_X = 0.12, WAVE_AMP_Y = 0.36, WAVE_AMP_Z = 0.2, WAVE_LAYER_SHIFT = 0.45;
      let rafId: number;

      function tick() {
        rafId = requestAnimationFrame(tick);
        const t = clock.getElapsedTime();
        fp = Math.min(1, fp + 0.0045);
        const spr = SPR * Math.pow(fp, 0.5), TXT = N * NL;

        for (let i = 0; i < TXT; i++) {
          const b = i * 3;
          const layer = (i / N) | 0;
          const phase = t * WAVE_SPEED + tgt[b] * WAVE_FREQ + layer * WAVE_LAYER_SHIFT + aPh[i] * 0.35;
          const tx = tgt[b] + Math.sin(phase * 0.7 + tgt[b + 1] * 0.04) * WAVE_AMP_X;
          const ty = tgt[b + 1] + Math.sin(phase) * WAVE_AMP_Y;
          const tz = tgt[b + 2] + Math.cos(phase * 0.82) * WAVE_AMP_Z;

          vel[b] += (tx - pos[b]) * spr;
          vel[b + 1] += (ty - pos[b + 1]) * spr;
          vel[b + 2] += (tz - pos[b + 2]) * spr;
          const dx = pos[b] - m3.x, dy = pos[b + 1] - m3.y, d2 = dx * dx + dy * dy;
          if (d2 < RR * RR && d2 > 0.0001) {
            const dist = Math.sqrt(d2), f = (1 - dist / RR) * RF;
            vel[b] += (dx / dist) * f; vel[b + 1] += (dy / dist) * f; vel[b + 2] -= f * 0.5;
          }
          if (exploding) { vel[b] += (Math.random() - 0.5) * EF; vel[b + 1] += (Math.random() - 0.5) * EF; vel[b + 2] += (Math.random() - 0.5) * EF * 0.6; }
          vel[b] += 0.0016 * Math.sin(t * 0.38 + aPh[i] * 1.1);
          vel[b + 1] += 0.0016 * Math.cos(t * 0.30 + aPh[i] * 0.85);
          vel[b] *= DMP; vel[b + 1] *= DMP; vel[b + 2] *= DMP;
          pos[b] += vel[b]; pos[b + 1] += vel[b + 1]; pos[b + 2] += vel[b + 2];
        }

        for (let i = 0; i < AMB; i++) {
          const idx = TXT + i, b = idx * 3;
          pos[b] += vel[b] + Math.sin(t * 0.15 + aPh[idx] * 1.2) * 0.0035;
          pos[b + 1] += vel[b + 1] + Math.cos(t * 0.11 + aPh[idx] * 0.8) * 0.003;
          pos[b + 2] += vel[b + 2];
          if (pos[b] > 40) pos[b] = -40; if (pos[b] < -40) pos[b] = 40;
          if (pos[b + 1] > 26) pos[b + 1] = -26; if (pos[b + 1] < -26) pos[b + 1] = 26;
        }
        pAttr.needsUpdate = true;

        let li = 0;
        if (fp > 0.45) {
          lMat.opacity = Math.min(0.07, (fp - 0.45) * 0.16);
          for (let s = 0; s < 8000 && li < MAX_LINES; s++) {
            const a = Math.floor(Math.random() * N), bb = Math.floor(Math.random() * N);
            if (a === bb) continue;
            const ax = pos[a * 3], ay = pos[a * 3 + 1], az = pos[a * 3 + 2];
            const bx = pos[bb * 3], by = pos[bb * 3 + 1], bz = pos[bb * 3 + 2];
            const ddx = ax - bx, ddy = ay - by, ddz = az - bz;
            if (ddx * ddx + ddy * ddy + ddz * ddz < CD * CD) {
              lp[li * 6] = ax; lp[li * 6 + 1] = ay; lp[li * 6 + 2] = az;
              lp[li * 6 + 3] = bx; lp[li * 6 + 4] = by; lp[li * 6 + 5] = bz; li++;
            }
          }
        }
        lAttr.needsUpdate = true; lGeo.setDrawRange(0, li * 2);

        const ro = Math.max(0, fp - 0.78) * 0.65;
        t1.material.opacity = ro * 0.55;
        t1.rotation.x = 1.4; t1.rotation.y = 0.3; t1.rotation.z = t * 0.2;
        group.rotation.y = Math.sin(t * 0.09) * 0.12 + camCX * 0.04;
        group.rotation.x = Math.sin(t * 0.065) * 0.05 + camCY * 0.025;
        camCX += (camTX - camCX) * 0.042; camCY += (camTY - camCY) * 0.042;
        camera.position.x = camCX; camera.position.y = camCY; camera.lookAt(0, 0, 0);

        for (let i = 0; i < DC; i++) {
          const b = i * 3;
          const dx2 = dPos[b] - m3.x, dy2 = dPos[b + 1] - m3.y, distSq = dx2 * dx2 + dy2 * dy2;
          if (distSq < 100 && m3.x !== 999) {
            const dist = Math.sqrt(distSq), force = (10 - dist) * 0.15;
            dVel[b] += (dx2 / dist) * force; dVel[b + 1] += (dy2 / dist) * force;
          }
          dVel[b] += (dBase[b] + Math.sin(t * 0.4 + i) * 4 - dPos[b]) * 0.006;
          dVel[b + 1] += (dBase[b + 1] + Math.cos(t * 0.3 + i) * 4 - dPos[b + 1]) * 0.006;
          dVel[b] *= 0.86; dVel[b + 1] *= 0.86;
          dPos[b] += dVel[b]; dPos[b + 1] += dVel[b + 1];
        }
        dAttr.needsUpdate = true;

        const sp = Math.min(1, (window.scrollY || 0) / window.innerHeight);
        currentScale += ((1 - sp * 0.65) - currentScale) * 0.1;
        group.scale.set(currentScale, currentScale, currentScale);
        renderer.render(scene, camera);
      }
      tick();

      cleanupFn = () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', onResize);
        banner.removeEventListener('mousemove', onMouseMove);
        banner.removeEventListener('mouseleave', onMouseLeave);
        banner.removeEventListener('click', onClick);
        banner.removeEventListener('mousemove', onCamMove);
        renderer.dispose();
      };
    }

    init();
    return () => { cleanupFn?.(); };
  }, []);

  const tickerSource = content?.tickerItems?.length ? content.tickerItems : TICKER_ITEMS;
  const tickerItems = [...tickerSource, ...tickerSource];

  return (
    <section id="banner" ref={bannerRef}>
      <canvas id="c" ref={canvasRef} />
      <div id="ov" />

      <div className="hero">
        <span className="badge">{content?.badge ?? 'Est. 2024 · Web Dev Studio'}</span>
        <h1 className="headline">
          {content?.headlineLine1 ?? 'We Build'}
          <br />
          <em>{content?.headlineEmphasis ?? 'Digital'}</em>
          <br />
          {content?.headlineLine3 ?? 'Experiences'}
        </h1>
        <p className="sub">{content?.subcopy ?? 'From pixel-perfect interfaces to scalable full-stack systems — we craft web products that feel as good as they perform.'}</p>
        <div className="cta-row">
          <a href="/work" className="btn-primary">See Our Work</a>
          <a href="/contact" className="btn-ghost">Get in Touch</a>
        </div>
      </div>

      <div className="stats">
        <div className="stat"><span className="stat-n">48+</span><span className="stat-l">Projects</span></div>
        <div className="stat-div" />
        <div className="stat"><span className="stat-n">5★</span><span className="stat-l">Avg Rating</span></div>
        <div className="stat-div" />
        <div className="stat"><span className="stat-n">3yr</span><span className="stat-l">Experience</span></div>
      </div>

      <a href="#services" className="scroll-btn">
        <span className="scroll-label">Scroll Down</span>
        <div className="scroll-track" />
      </a>

      <div className="ticker-wrap">
        <div className="ticker-inner">
          {tickerItems.map((item, i) => (
            <span key={i}>
              <span className="ticker-item">{item}</span>
              <span className="ticker-sep">◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
