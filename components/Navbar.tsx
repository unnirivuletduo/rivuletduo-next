'use client';
import { useEffect, useState } from 'react';

type NavKey = 'services' | 'work' | 'about' | 'contact';

const LINKS: { key: NavKey; href: string; label: string }[] = [
  { key: 'services', href: '/services', label: 'Services' },
  { key: 'work', href: '/work', label: 'Work' },
  { key: 'about', href: '/about', label: 'About' },
  { key: 'contact', href: '/contact', label: 'Contact' },
];

const openProjectModal = () => window.dispatchEvent(new Event('open-project-modal'));

// The one site header, shared by every page so it looks and behaves the same everywhere.
export default function Navbar({ active }: { active?: NavKey } = {}) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const nav = document.getElementById('main-nav');
    const onScroll = () => nav?.classList.toggle('stuck', window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  return (
    <nav id="main-nav">
      <a href="/" className="nav-logo" aria-label="Rivuletduo home">
        <img src="/rivulet-logo.svg" alt="Rivuletduo" className="brand-logo" />
      </a>
      <ul className="nav-links">
        {LINKS.map((l) => (
          <li key={l.key}><a href={l.href} className={active === l.key ? 'active' : undefined} aria-current={active === l.key ? 'page' : undefined}>{l.label}</a></li>
        ))}
      </ul>
      <button className="nav-btn" onClick={openProjectModal}>Start a Project</button>
      <button className={`nav-toggle ${menuOpen ? 'open' : ''}`} aria-label="Toggle menu" aria-expanded={menuOpen} aria-controls="main-mobile-menu" onClick={() => setMenuOpen((v) => !v)}>
        <span />
        <span />
        <span />
      </button>
      <div id="main-mobile-menu" className={`nav-mobile-menu ${menuOpen ? 'open' : ''}`}>
        {LINKS.map((l) => (
          <a key={l.key} href={l.href} className={active === l.key ? 'active' : undefined} onClick={() => setMenuOpen(false)}>{l.label}</a>
        ))}
        <a href="#project" onClick={(e) => { e.preventDefault(); setMenuOpen(false); openProjectModal(); }}>Start a Project</a>
      </div>
    </nav>
  );
}
