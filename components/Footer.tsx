import { SITE, telHref } from '@/lib/site';

export default function Footer({ id }: { id?: string }) {
  return (
    <footer id={id} className="site-footer">
      <div className="footer-col footer-brand">
        <a href="/" className="flogo" aria-label="Rivuletduo home"><img src="/rivulet-logo.svg" alt="Rivuletduo" className="brand-logo-footer" /></a>
        <p className="footer-caption">Designing and building memorable digital experiences with precision and care.</p>
        <p className="footer-partner">In partnership with <a href="https://brandalchemy.co.nz" target="_blank" rel="noopener">Brand Alchemy</a></p>
        <div className="fcopy">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</div>
      </div>

      <div className="footer-col">
        <div className="fhead">Menu</div>
        <ul className="flinks">
          <li><a href="/about">About</a></li>
          <li><a href="/work">Work</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>

      <div className="footer-col">
        <div className="fhead">Services</div>
        <ul className="flinks">
          <li><a href="/services/webdesign">Web Design</a></li>
          <li><a href="/services/ui">UI/UX Design</a></li>
          <li><a href="/services/webdev">Custom Software</a></li>
          <li><a href="/services/seo">SEO</a></li>
        </ul>
      </div>

      <div className="footer-col">
        <div className="fhead">Contact</div>
        <ul className="flinks">
          <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
          {SITE.phone && <li><a href={telHref(SITE.phone)}>{SITE.phone}</a></li>}
          <li><span className="fmeta">{SITE.location}</span></li>
        </ul>
        <div className="f-socials">
          <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://behance.net" target="_blank" rel="noreferrer">Behance</a>
        </div>
      </div>
    </footer>
  );
}
