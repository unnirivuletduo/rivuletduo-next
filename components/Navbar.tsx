'use client';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const nav = document.getElementById('main-nav');
    const onScroll = () => nav?.classList.toggle('stuck', window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  return (
    <nav id="main-nav">
      <a href="#" className="nav-logo">Rivuletduo</a>
      <ul className="nav-links">
        <li><a href="/services">Services</a></li>
        <li><a href="/work">Work</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
      <button className="nav-btn">Start a Project</button>
      <button className={`nav-toggle ${menuOpen ? 'open' : ''}`} aria-label="Toggle menu" aria-expanded={menuOpen} aria-controls="main-mobile-menu" onClick={() => setMenuOpen((v) => !v)}>
        <span />
        <span />
        <span />
      </button>
      <div id="main-mobile-menu" className={`nav-mobile-menu ${menuOpen ? 'open' : ''}`}>
        <a href="/services" onClick={() => setMenuOpen(false)}>Services</a>
        <a href="/work" onClick={() => setMenuOpen(false)}>Work</a>
        <a href="/about" onClick={() => setMenuOpen(false)}>About</a>
        <a href="/contact" onClick={() => setMenuOpen(false)}>Contact</a>
        <a href="/contact" onClick={() => setMenuOpen(false)}>Start a Project</a>
      </div>
    </nav>
  );
}
