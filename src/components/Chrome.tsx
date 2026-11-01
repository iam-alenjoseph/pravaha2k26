import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { site } from '../config/site';
import { safeExternal } from '../lib/policies';
import { Arrow } from './Shared';
import { AnimatedEventLogo } from './AnimatedEventLogo';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => { setMenuOpen(false); }, [location]);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMenuOpen(false); document.getElementById('menu-toggle')?.focus(); } };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);

  if (location.pathname === '/') return null;

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={`site-header ${location.pathname === '/' ? 'on-home' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <Link to="/" className="brand" aria-label="Pravaha home">
        <AnimatedEventLogo variant="header" className="brand-logo-animated" />
        <div className="brand-header-copy">
          <span className="brand-header-title">PRAVAHA {site.edition.toUpperCase()}</span>
        </div>
      </Link>
      <button id="menu-toggle" className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-controls="primary-nav" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
      <nav id="primary-nav" aria-label="Main navigation">
        <Link className="nav-cta" to="/#lineup">Line-up</Link>
        <span className="nav-separator" aria-hidden="true"> · </span>
        <NavLink to="/events">Events</NavLink>
        <span className="nav-separator" aria-hidden="true"> · </span>
        <NavLink to="/schedule">Schedule</NavLink>
      </nav>
    </header>
  </>;
}
export function Footer({ reduced, onToggle }: { reduced: boolean; onToggle: () => void }) {
  return <footer className="site-footer">
    <div className="footer-top"><Link className="footer-wordmark" to="/" aria-label="Pravaha home"><AnimatedEventLogo variant="footer" className="footer-logo-animated" /></Link></div>
    <div className="footer-bottom"><p>PRAVAHA {site.edition.toUpperCase()}<span>STUDENT-FUNDED · COLLEGE-ONLY</span></p><nav aria-label="Footer"><Link to="/events">Events</Link><span className="footer-nav-dot" aria-hidden="true"> · </span><Link to="/schedule">Schedule</Link>{site.email && <a href={`mailto:${site.email}`}>Get in touch</a>}{site.socials.filter(s => safeExternal(s.url)).map(s => <a href={safeExternal(s.url)} key={s.label} target="_blank" rel="noopener noreferrer">{s.label}<Arrow diagonal /></a>)}</nav></div>
  </footer>;
}
