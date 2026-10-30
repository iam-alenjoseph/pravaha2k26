import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { site } from '../config/site';
import { safeExternal } from '../lib/policies';
import { Spark, Arrow } from './Shared';

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
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={`site-header ${menuOpen ? 'menu-open' : ''}`}>
      <Link to="/" className="brand" aria-label="Pravaha home"><span className="brand-icon">P<span>·</span></span><span className="brand-name">PRAVAHA<span>2K26</span></span></Link>
      <div className="header-note">A CELEBRATION.<br /><span>A CURRENT. A COLLECTIVE.</span></div>
      <button id="menu-toggle" className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-controls="primary-nav" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
      <nav id="primary-nav" aria-label="Main navigation"><NavLink to="/events">Events <span>↗</span></NavLink><NavLink to="/schedule">Schedule <span>↗</span></NavLink><Link className="nav-cta" to="/#programs">Find your stage <Arrow diagonal /></Link></nav>
    </header>
  </>;
}
export function Footer({ reduced, onToggle }: { reduced: boolean; onToggle: () => void }) {
  return <footer className="site-footer">
    <div className="footer-top"><Link className="footer-wordmark" to="/">pravaha<span>{site.edition}</span></Link><p>Made of us.<br /><em>Remembered by all.</em></p><Spark /></div>
    <div className="footer-bottom"><p>PRAVAHA {site.edition.toUpperCase()}<span>STUDENT-FUNDED · COLLEGE-ONLY</span></p><nav aria-label="Footer"><Link to="/events">Events</Link><Link to="/schedule">Schedule</Link>{site.email && <a href={`mailto:${site.email}`}>Get in touch</a>}{site.socials.filter(s => safeExternal(s.url)).map(s => <a href={safeExternal(s.url)} key={s.label} target="_blank" rel="noopener noreferrer">{s.label}<Arrow diagonal /></a>)}</nav><button className="motion-toggle" aria-pressed={reduced} onClick={onToggle}><span className={`toggle-track ${reduced ? 'on' : ''}`} />Reduce motion <span className="sr-only">{reduced ? 'on' : 'off'}</span></button></div>
  </footer>;
}
