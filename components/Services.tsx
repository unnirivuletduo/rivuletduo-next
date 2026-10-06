'use client';
import { useEffect } from 'react';
import type { ServiceCategory } from '@/lib/cms';

const services = [
  {
    n: '01', title: 'Custom Software Development', href: '/services/webdev',
    desc: 'Web applications, client portals, dashboards and internal tools built around how your business actually works — secure, scalable and easy to maintain.',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    icon: <svg viewBox="0 0 32 32"><polyline points="11,10 5,16 11,22" /><polyline points="21,10 27,16 21,22" /><path d="M18 7l-4 18" /></svg>,
  },
  {
    n: '02', title: 'Website Design & Development', href: '/services/webdesign',
    desc: 'Fast, responsive business websites that look sharp on every screen and turn visitors into enquiries — easy for your team to update.',
    tags: ['Next.js', 'WordPress', 'Responsive'],
    icon: <svg viewBox="0 0 32 32"><rect x="4" y="6" width="24" height="20" rx="2" /><path d="M4 12h24" /><path d="M9 18h9M9 22h6" /></svg>,
  },
  {
    n: '03', title: 'Mobile App Development', href: '/services/mobile',
    desc: 'iOS and Android apps that feel native, perform smoothly and connect cleanly to your existing systems.',
    tags: ['iOS', 'Android', 'React Native'],
    icon: <svg viewBox="0 0 32 32"><rect x="9" y="3" width="14" height="26" rx="2" /><path d="M14 25h4" /></svg>,
  },
  {
    n: '04', title: 'E-Commerce Solutions', href: '/services/ecommerce',
    desc: 'Online stores on Shopify, WooCommerce or fully custom platforms — built to convert, simple to manage and ready to scale.',
    tags: ['Shopify', 'WooCommerce', 'Custom'],
    icon: <svg viewBox="0 0 32 32"><rect x="5" y="12" width="22" height="16" rx="2" /><path d="M11 12V9a5 5 0 0110 0v3" /></svg>,
  },
  {
    n: '05', title: 'SEO & Performance', href: '/services/seo',
    desc: 'Technical SEO, on-page optimisation, local search and Core Web Vitals — so the right customers find you on Google, and your site loads fast when they do.',
    tags: ['Technical SEO', 'Local SEO', 'Analytics'],
    icon: <svg viewBox="0 0 32 32"><circle cx="14" cy="14" r="8" /><path d="M20 20l7 7" /><path d="M10 16l3-3 2 2 3-4" /></svg>,
  },
  {
    n: '06', title: 'UI/UX Design & Branding', href: '/services/ui',
    desc: 'User research, interface design and brand identity that make your product clear, consistent and memorable.',
    tags: ['Figma', 'Prototyping', 'Brand Identity'],
    icon: <svg viewBox="0 0 32 32"><rect x="3" y="6" width="26" height="20" rx="2" /><path d="M10 16l4 4 8-8" /></svg>,
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
      href: service.href,
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
          <a className="svc" href={s.href} key={s.n}>
            <div className="svc-n">{s.n}</div>
            <div className="svc-ico">{s.icon ?? <svg viewBox="0 0 32 32"><rect x="4" y="6" width="24" height="20" rx="2" /><path d="M4 14h24" /><path d="M10 22l4-4 3 3 5-6" /></svg>}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <div className="svc-tags">
              {s.tags.map(t => <span className="svc-tag" key={t}>{t}</span>)}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
