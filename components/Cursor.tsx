'use client';
import { useEffect } from 'react';

export default function Cursor() {
  useEffect(() => {
    const cur = document.getElementById('cur');
    const ring = document.getElementById('cur-ring');
    if (!cur || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    document.addEventListener('mousemove', onMove);

    const hoverEls = document.querySelectorAll('a,button,.wcard,.svc,.step,.rvt__arr,.rvt__dot');
    const enter = () => ring.classList.add('big');
    const leave = () => ring.classList.remove('big');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
    });

    let raf: number;
    const tick = () => {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      cur.style.left = mx + 'px';
      cur.style.top = my + 'px';
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div id="cur" />
      <div id="cur-ring" />
    </>
  );
}
