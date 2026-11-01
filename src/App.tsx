import { useEffect, useLayoutEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header, Footer } from './components/Chrome';
import Home from './pages/Home';
import { EventsPage, EventDetail, SchedulePage, NotFound } from './pages/Supporting';
import { AtmosphereCanvas } from './components/AtmosphereCanvas';
import { CursorGlow } from './components/CursorGlow';
import { motion } from './config/motion';
import { site } from './config/site';

function initialReduced() {
  try { const stored = localStorage.getItem(motion.reducedMotion.storageKey); if (stored !== null) return stored === 'true'; } catch { /* Storage may be blocked. */ }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function ScrollAndTitle() {
  const location = useLocation();
  const navigate = useNavigate();
  useLayoutEffect(() => {
    if (location.pathname === '/' && location.hash === '#programs') { navigate('/events', { replace: true }); return; }
    let first = 0, second = 0;
    first = requestAnimationFrame(() => { second = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
      if (target) {
        if (target.id === 'lineup' || target.id === 'artists') window.scrollTo(0, window.scrollY + target.getBoundingClientRect().top);
        else target.scrollIntoView();
        ScrollTrigger.update(); target.focus({ preventScroll: true });
      }
      else { window.scrollTo(0, 0); if (location.pathname !== '/') document.getElementById('main')?.focus({ preventScroll: true }); }
    }); });
    const prefix = location.pathname === '/schedule' ? 'Schedule' : location.pathname.startsWith('/events') ? 'Events' : '';
    document.title = `${prefix ? `${prefix} · ` : ''}Pravaha 2k26 — Find your flow.`;
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [location, navigate]);
  return null;
}
function SiteApp() {
  const [reduced, setReduced] = useState(initialReduced);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => {
      try { if (localStorage.getItem(motion.reducedMotion.storageKey) !== null) return; } catch { /* Use system preference. */ }
      setReduced(media.matches);
    };
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
    for (const [token,value] of Object.entries(site.theme)) document.documentElement.style.setProperty(`--${token.replace(/[A-Z]/g, x => `-${x.toLowerCase()}`)}`, value);
  }, [reduced]);
  return (
    <>
      <ScrollAndTitle />
      <AtmosphereCanvas reduced={reduced} />
      <CursorGlow reduced={reduced} />
      <div className="fest-halftone-grain" aria-hidden="true" />
      <Header />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home reduced={reduced} />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:slug" element={<EventDetail />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer
        reduced={reduced}
        onToggle={() => {
          const next = !reduced;
          setReduced(next);
          try { localStorage.setItem(motion.reducedMotion.storageKey, String(next)); } catch { /* Still works for this visit. */ }
        }}
      />
    </>
  );
}
export default function App() { return <BrowserRouter><SiteApp /></BrowserRouter>; }
