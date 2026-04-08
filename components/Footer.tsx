export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-col footer-brand">
        <a href="/" className="flogo" aria-label="Rivuletduo home"><img src="/rivulet-logo.svg" alt="Rivuletduo" className="brand-logo-footer" /></a>
        <p className="footer-caption">Designing and building memorable digital experiences with precision and care.</p>
        <div className="fcopy">© 2026 Rivuletduo. All rights reserved.</div>
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
          <li><a href="/services">Web Design</a></li>
          <li><a href="/services">UI/UX Design</a></li>
          <li><a href="/services">Web Development</a></li>
          <li><a href="/services">SEO</a></li>
        </ul>
      </div>

      <div className="footer-col">
        <div className="fhead">Contact</div>
        <ul className="flinks">
          <li><a href="mailto:hello@rivuletduo.com">hello@rivuletduo.com</a></li>
          <li><a href="tel:+15550000000">+1 (555) 000-0000</a></li>
          <li><span className="fmeta">Kerala, India</span></li>
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
