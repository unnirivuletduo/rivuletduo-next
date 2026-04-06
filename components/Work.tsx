'use client';
import { useEffect } from 'react';
import type { WorkListItem } from '@/lib/cms';

const ArrowIcon = () => (
  <svg viewBox="0 0 12 12"><path d="M1 11L11 1M1 1h10v10" /></svg>
);

const projects = [
  {
    num: '01', tag: 'E-commerce · Shopify', title: 'Verdant Goods',
    bgImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
  },
  {
    num: '02', tag: 'SaaS · Dashboard', title: 'FlowMetrics',
    bgImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
  },
  {
    num: '03', tag: 'Brand · Next.js', title: 'Celadon Studio',
    bgImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80',
  },
  {
    num: '04', tag: 'Web App · React', title: 'Heliostack',
    bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
  },
];

type WorkProps = {
  items?: WorkListItem[];
};

export default function Work({ items }: WorkProps = {}) {
  const projectsData = items && items.length > 0
    ? items.slice(0, 4).map((item, idx) => ({
      num: item.num || String(idx + 1).padStart(2, '0'),
      tag: item.tag,
      title: item.title,
      bgImage: projects[idx % projects.length].bgImage,
    }))
    : projects;

  useEffect(() => {
    const cards = document.querySelectorAll('.wcard');

    // Initial hidden state
    cards.forEach((card: any) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px) scale(0.97)';
      card.style.transition = 'none';
    });

    function revealCard(card: Element, idx: number) {
      setTimeout(() => {
        const c = card as HTMLElement;
        c.style.transition = 'opacity 0.65s cubic-bezier(0.16,1,0.3,1),transform 0.65s cubic-bezier(0.16,1,0.3,1)';
        c.style.opacity = '1';
        c.style.transform = 'translateY(0) scale(1)';
        const numEl = card.querySelector('.wcard-num') as HTMLElement;
        if (numEl) {
          const real = numEl.textContent, chars = '0123456789';
          let ticks = 0;
          const iv = setInterval(() => {
            numEl.textContent = '0' + chars[Math.floor(Math.random() * chars.length)];
            if (++ticks >= 8) { numEl.textContent = real; clearInterval(iv); }
          }, 50);
        }
      }, idx * 120);
    }

    setTimeout(() => {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            revealCard(e.target, Array.from(cards).indexOf(e.target));
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
      cards.forEach(card => io.observe(card));
    }, 500);

    // Tilt effect
    cards.forEach((card: any) => {
      const glow = document.createElement('div');
      glow.style.cssText = 'position:absolute;inset:0;pointer-events:none;border-radius:inherit;opacity:0;transition:opacity .3s;';
      card.style.position = 'relative';
      card.appendChild(glow);
      card.addEventListener('mousemove', (e: MouseEvent) => {
        const r = card.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        const cx = r.width / 2, cy = r.height / 2;
        card.style.transition = 'transform 0.1s ease';
        card.style.transform = `perspective(800px) rotateX(${(y - cy) / cy * 5}deg) rotateY(${-(x - cx) / cx * 5}deg) scale(1.02)`;
        glow.style.opacity = '1';
        glow.style.background = `radial-gradient(circle 130px at ${x}px ${y}px,rgba(22,163,74,.05),transparent 70%)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
        glow.style.opacity = '0';
      });
    });
  }, []);

  return (
    <section id="work">
      <div className="section-label rv">Selected Work</div>
      <h2 className="section-h2 rv rv1">Projects we&apos;re <em>proud of</em></h2>
      <div className="work-grid">
        {projectsData.map((p, i) => (
          <div className={`wcard rv rv${(i % 2) + 1}`} key={p.num}>
            <div className="wcard-bg" style={{ backgroundImage: `url(${p.bgImage})` }} />
            <span className="wcard-num">{p.num}</span>
            <div className="wtag">{p.tag}</div>
            <h3>{p.title}</h3>
            <div className="warr"><ArrowIcon /></div>
          </div>
        ))}
      </div>
    </section>
  );
}
