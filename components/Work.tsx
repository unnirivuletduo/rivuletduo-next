'use client';
import { useEffect } from 'react';
import type { WorkListItem } from '@/lib/cms';

const ArrowIcon = () => (
  <svg viewBox="0 0 12 12"><path d="M1 11L11 1M1 1h10v10" /></svg>
);

// Card backgrounds: brand gradients until project screenshots are added (set `image`).
const projects: { num: string; tag: string; title: string; href: string; image?: string; gradient: string }[] = [
  {
    num: '01', tag: 'Car Rental · Booking Platform', title: 'Grab A Rental Car', href: '/work/grab-a-rental-car',
    image: '/work/grab-a-rental-car/home.webp',
    gradient: 'linear-gradient(135deg, #052e16 0%, #166534 55%, #4ade80 140%)',
  },
  {
    num: '02', tag: 'LED Screen Hire · WooCommerce', title: 'Event Display', href: '/work/event-display',
    image: '/work/event-display/home.webp',
    gradient: 'linear-gradient(135deg, #052e16 0%, #166534 50%, #6ee7b7 150%)',
  },
  {
    num: '03', tag: 'E-Commerce · WooCommerce', title: 'Baby Cart', href: '/work/baby-cart',
    image: '/work/baby-cart/home.webp',
    gradient: 'linear-gradient(135deg, #14532d 0%, #15803d 50%, #86efac 140%)',
  },
  {
    num: '04', tag: 'Outdoor Living · Product Showcase', title: 'Bworth', href: '/work/bworth',
    image: '/work/bworth/home.webp',
    gradient: 'linear-gradient(135deg, #052e16 0%, #15803d 60%, #bbf7d0 150%)',
  },
  {
    num: '05', tag: 'Creative Agency · Next.js', title: 'Brand Alchemy', href: '/work/brand-alchemy',
    image: '/work/brand-alchemy/home.webp',
    gradient: 'linear-gradient(135deg, #14532d 0%, #166534 45%, #a7f3d0 150%)',
  },
  {
    num: '06', tag: 'Blinds & Outdoor Living · WordPress', title: 'Craft Shed', href: '/work/craft-shed',
    image: '/work/craft-shed/home.webp',
    gradient: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #86efac 160%)',
  },
  {
    num: '07', tag: 'Eco Products · WordPress', title: 'Earthy', href: '/work/earthy',
    image: '/work/earthy/home.webp',
    gradient: 'linear-gradient(135deg, #14532d 0%, #15803d 55%, #d9f99d 160%)',
  },
  {
    num: '08', tag: 'Accounting Firm · WordPress', title: 'Unicorn Accounting', href: '/work/unicorn-accounting',
    image: '/work/unicorn-accounting/home.webp',
    gradient: 'linear-gradient(135deg, #052e16 0%, #166534 55%, #bbf7d0 150%)',
  },
  {
    num: '09', tag: 'Architecture Studio · WordPress', title: 'The Concreator', href: '/work/the-concreator',
    gradient: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #a7f3d0 160%)',
  },
  {
    num: '10', tag: 'Transport & Logistics · WordPress', title: 'NZ Motorcycle Movers', href: '/work/nz-motorcycle-movers',
    image: '/work/nz-motorcycle-movers/home.webp',
    gradient: 'linear-gradient(135deg, #052e16 0%, #15803d 55%, #bbf7d0 150%)',
  },
  {
    num: '11', tag: 'Removals · Custom PHP', title: 'Unique Movers', href: '/work/unique-movers',
    image: '/work/unique-movers/home.webp',
    gradient: 'linear-gradient(135deg, #14532d 0%, #15803d 50%, #86efac 150%)',
  },
];

type WorkProps = {
  items?: WorkListItem[];
};

// Projects featured on the home page, in display order. The Work page lists every project.
const HOME_PROJECTS = [
  '/work/grab-a-rental-car',
  '/work/baby-cart',
  '/work/event-display',
  '/work/craft-shed',
  '/work/unicorn-accounting',
];

export default function Work({ items }: WorkProps = {}) {
  const source = items && items.length > 0
    ? items.map((item, idx) => ({
      num: item.num,
      tag: item.tag,
      title: item.title,
      href: item.href,
      image: projects.find((p) => p.href === item.href)?.image,
      gradient: projects[idx % projects.length].gradient,
    }))
    : projects;
  const projectsData = HOME_PROJECTS
    .map((href) => source.find((p) => p.href === href))
    .filter((p): p is (typeof source)[number] => Boolean(p))
    .map((p, idx) => ({ ...p, num: String(idx + 1).padStart(2, '0') }));

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
          <a href={p.href} className={`wcard rv rv${(i % 2) + 1}`} key={p.num}>
            <div className="wcard-bg" style={{ backgroundImage: p.image ? `url(${p.image})` : p.gradient }} />
            <span className="wcard-num">{p.num}</span>
            <div className="wtag">{p.tag}</div>
            <h3>{p.title}</h3>
            <div className="warr"><ArrowIcon /></div>
          </a>
        ))}
      </div>
      <div className="work-more rv"><a href="/work" className="btn-ghost">View all work</a></div>
    </section>
  );
}
