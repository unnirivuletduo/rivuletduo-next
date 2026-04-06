'use client';
import { useEffect } from 'react';
import type { ServiceCategory } from '@/lib/cms';

const services = [
  {
    n: '01', title: 'UI / UX Design',
    desc: 'Interfaces crafted for clarity and flow. Every interaction is intentional, every screen earns its place.',
    tags: ['Figma', 'Prototyping', 'Systems'],
    icon: <svg viewBox="0 0 32 32"><rect x="3" y="6" width="26" height="20" rx="2" /><path d="M10 16l4 4 8-8" /></svg>,
  },
  {
    n: '02', title: 'Frontend Dev',
    desc: 'High-performance, accessible code in React and Next.js. Fast, semantic, and built to endure.',
    tags: ['React', 'Next.js', 'Three.js'],
    icon: <svg viewBox="0 0 32 32"><polyline points="5,22 11,11 17,17 23,7" /><circle cx="23" cy="7" r="2" /></svg>,
  },
  {
    n: '03', title: 'Full-Stack',
    desc: 'From APIs to databases, we handle the entire stack so you can focus entirely on your vision.',
    tags: ['Node.js', 'PostgreSQL', 'GraphQL'],
    icon: <svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="10" /><path d="M16 6v20M6 16h20" /></svg>,
  },
  {
    n: '04', title: 'E-Commerce',
    desc: 'Conversion-optimised storefronts on Shopify or custom platforms — built to scale.',
    tags: ['Shopify', 'WooCommerce'],
    icon: <svg viewBox="0 0 32 32"><rect x="5" y="12" width="22" height="16" rx="2" /><path d="M11 12V9a5 5 0 0110 0v3" /></svg>,
  },
  {
    n: '05', title: 'SEO & Performance',
    desc: 'Core Web Vitals and technical SEO baked in from day one — not patched on at the end.',
    tags: ['Lighthouse', 'Analytics'],
    icon: <svg viewBox="0 0 32 32"><path d="M6 24l7-7 5 5 9-12" /></svg>,
  },
  {
    n: '06', title: 'CMS & Support',
    desc: 'Sanity, Contentful, or WordPress — editorial systems your team will actually enjoy.',
    tags: ['Sanity', 'Contentful'],
    icon: <svg viewBox="0 0 32 32"><rect x="4" y="4" width="10" height="10" rx="1" /><rect x="18" y="4" width="10" height="10" rx="1" /><rect x="4" y="18" width="10" height="10" rx="1" /><rect x="18" y="18" width="10" height="10" rx="1" /></svg>,
  },
];

type ServicesProps = {
  items?: ServiceCategory[];
};

export default function Services({ items }: ServicesProps = {}) {
  const servicesData = items && items.length > 0
    ? items.flatMap((category) => category.services).slice(0, 6).map((service, index) => ({
      n: String(index + 1).padStart(2, '0'),
      title: service.title,
      desc: service.desc,
      tags: service.tags,
      icon: null,
    }))
    : services;

  useEffect(() => {
    // Reveal on scroll
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.rv').forEach(el => io.observe(el));

    // SVG draw animation
    const cards = document.querySelectorAll('.svc');
    function drawCard(card: Element) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.querySelectorAll('.svc-ico svg path,.svc-ico svg rect,.svc-ico svg circle,.svc-ico svg polyline,.svc-ico svg line').forEach((el: any, i) => {
            let len = 300;
            try { len = Math.ceil(el.getTotalLength()) + 4; } catch (e) {}
            el.setAttribute('stroke-dasharray', len);
            el.setAttribute('stroke-dashoffset', len);
            void el.getBoundingClientRect();
            setTimeout(() => {
              el.style.transition = 'stroke-dashoffset 2.2s cubic-bezier(0.16,1,0.3,1)';
              el.setAttribute('stroke-dashoffset', '0');
            }, i * 150);
          });
        });
      });
    }

    setTimeout(() => {
      const sio = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { drawCard(e.target); sio.unobserve(e.target); }
        });
      }, { threshold: 0.3, rootMargin: '0px 0px -60px 0px' });
      cards.forEach(card => {
        card.querySelectorAll('.svc-ico svg path,.svc-ico svg rect,.svc-ico svg circle,.svc-ico svg polyline,.svc-ico svg line').forEach((el: any) => {
          el.setAttribute('fill', 'none');
          el.setAttribute('stroke', '#15803d');
          el.setAttribute('stroke-width', '1.4');
          el.setAttribute('stroke-linecap', 'round');
          el.setAttribute('stroke-linejoin', 'round');
          el.setAttribute('stroke-dasharray', '9999');
          el.setAttribute('stroke-dashoffset', '9999');
          el.style.transition = 'none';
        });
        sio.observe(card);
      });
    }, 400);

    return () => io.disconnect();
  }, []);

  return (
    <section id="services">
      <div className="section-label rv">Services</div>
      <h2 className="section-h2 rv rv1">What we <em>build</em></h2>
      <div className="services-grid rv rv2">
        {servicesData.map((s) => (
          <div className="svc" key={s.n}>
            <div className="svc-n">{s.n}</div>
            <div className="svc-ico">{s.icon ?? <svg viewBox="0 0 32 32"><rect x="4" y="6" width="24" height="20" rx="2" /><path d="M4 14h24" /><path d="M10 22l4-4 3 3 5-6" /></svg>}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <div className="svc-tags">
              {s.tags.map(t => <span className="svc-tag" key={t}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
