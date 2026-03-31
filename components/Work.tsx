'use client';
import { useEffect } from 'react';

const ArrowIcon = () => (
  <svg viewBox="0 0 12 12"><path d="M1 11L11 1M1 1h10v10" /></svg>
);

const projects = [
  {
    num: '01', tag: 'E-commerce · Shopify', title: 'Verdant Goods',
    bg: <svg viewBox="0 0 400 225" fill="none"><circle cx="200" cy="112" r="90" stroke="#15803d" strokeWidth=".5" /><circle cx="200" cy="112" r="55" stroke="#15803d" strokeWidth=".5" /><line x1="110" y1="112" x2="290" y2="112" stroke="#15803d" strokeWidth=".5" /><line x1="200" y1="22" x2="200" y2="202" stroke="#15803d" strokeWidth=".5" /></svg>,
  },
  {
    num: '02', tag: 'SaaS · Dashboard', title: 'FlowMetrics',
    bg: <svg viewBox="0 0 400 225" fill="none"><rect x="40" y="30" width="320" height="165" stroke="#15803d" strokeWidth=".5" rx="3" /><rect x="55" y="45" width="120" height="10" rx="1" fill="#15803d" opacity=".2" /><rect x="55" y="90" width="290" height="1" fill="#15803d" opacity=".15" /><rect x="55" y="105" width="90" height="70" rx="2" fill="#15803d" opacity=".08" /><rect x="160" y="105" width="90" height="70" rx="2" fill="#15803d" opacity=".08" /><rect x="265" y="105" width="80" height="70" rx="2" fill="#15803d" opacity=".08" /></svg>,
  },
  {
    num: '03', tag: 'Brand · Next.js', title: 'Celadon Studio',
    bg: <svg viewBox="0 0 400 225" fill="none"><path d="M80 112 Q200 30 320 112 Q200 194 80 112Z" stroke="#15803d" strokeWidth=".5" /><circle cx="200" cy="112" r="40" stroke="#15803d" strokeWidth=".5" /></svg>,
  },
  {
    num: '04', tag: 'Web App · React', title: 'Heliostack',
    bg: <svg viewBox="0 0 400 225" fill="none"><polygon points="200,30 340,130 270,200 130,200 60,130" stroke="#15803d" strokeWidth=".5" /><polygon points="200,65 305,135 255,185 145,185 95,135" stroke="#15803d" strokeWidth=".5" /></svg>,
  },
];

export default function Work() {
  useEffect(() => {
    const cards = document.querySelectorAll('.wcard');

    // Initial hidden state
    cards.forEach((card: any) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px) scale(0.97)';
      card.style.transition = 'none';
      card.querySelectorAll('.wcard-bg svg path,.wcard-bg svg circle,.wcard-bg svg line,.wcard-bg svg rect,.wcard-bg svg polygon').forEach((el: any) => {
        try { const l = Math.ceil(el.getTotalLength()) + 4; el.setAttribute('stroke-dasharray', l); el.setAttribute('stroke-dashoffset', l); el.style.transition = 'none'; } catch (e) {}
      });
    });

    function revealCard(card: Element, idx: number) {
      setTimeout(() => {
        const c = card as HTMLElement;
        c.style.transition = 'opacity 0.65s cubic-bezier(0.16,1,0.3,1),transform 0.65s cubic-bezier(0.16,1,0.3,1)';
        c.style.opacity = '1';
        c.style.transform = 'translateY(0) scale(1)';
        card.querySelectorAll('.wcard-bg svg path,.wcard-bg svg circle,.wcard-bg svg line,.wcard-bg svg rect,.wcard-bg svg polygon').forEach((el: any, i) => {
          setTimeout(() => {
            const l = parseFloat(el.getAttribute('stroke-dasharray')) || 300;
            el.setAttribute('stroke-dashoffset', String(l));
            void el.getBoundingClientRect();
            el.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)';
            el.setAttribute('stroke-dashoffset', '0');
          }, 200 + i * 180);
        });
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
        {projects.map((p, i) => (
          <div className={`wcard rv rv${(i % 2) + 1}`} key={p.num}>
            <div className="wcard-bg">{p.bg}</div>
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
