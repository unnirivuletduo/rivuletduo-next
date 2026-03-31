'use client';
import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; decay: number;
  r: number; col: string;
}

export default function GlobalParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let W = 0, H = 0;
    let pts: Particle[] = [];

    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function burst(x: number, y: number, n: number, big: boolean) {
      for (let i = 0; i < n; i++) {
        pts.push({
          x, y,
          vx: (Math.random() - 0.5) * (big ? 5 : 3),
          vy: -Math.random() * (big ? 6 : 3.5) - 0.5,
          life: 1,
          decay: big ? 0.012 : 0.022,
          r: big ? Math.random() * 3.5 + 1.5 : Math.random() * 2 + 0.3,
          col: Math.random() > 0.3 ? '22,163,74' : '21,128,61',
        });
      }
    }
    (window as any).burst = burst;

    let raf: number;
    function loop() {
      ctx.clearRect(0, 0, W, H);
      pts = pts.filter(p => p.life > 0);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.08; p.vx *= 0.97;
        p.life -= p.decay;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.col},${p.life * 0.65})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 200 }}
    />
  );
}
