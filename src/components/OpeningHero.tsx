import { Link } from 'react-router-dom';
import type { RefObject } from 'react';
import { site } from '../config/site';
import { ArtImage } from './Shared';
import { AnimatedEventLogo } from './AnimatedEventLogo';

export function OpeningHero({ 
  heroRef, 
  onScrollToLineup 
}: { 
  heroRef: RefObject<HTMLDivElement | null>;
  onScrollToLineup?: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="hero landing-cover-hero" ref={heroRef}>
      {/* 
        Layered scene dynamically composed of authentic components from the Components folder:
        - maincover.png (Celestial palace, river, crescent moon & starry sky)
        - maincharacteranimate.mp4 (Wide full-cover video spreading across entire background and blended)
        - clouds1.png & clouds2.png (Atmospheric floating clouds)
      */}
      <div className="landing-layers-stage" aria-hidden="true">
        {/* Layer 1: High-resolution celestial palace & night realm base */}
        <img
          src="/assets/fest/maincover.png"
          className="landing-layer-backdrop"
          alt=""
          loading="eager"
        />

        {/* Layer 2: High-definition animated character video */}
        <video
          src="/assets/fest/maincharacteranimate.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="landing-layer-video-backdrop"
          aria-hidden="true"
        />

        {/* Layer 3: Background celestial floating clouds */}
        <img
          src="/assets/fest/clouds1.png"
          className="landing-layer-cloud landing-cloud-back"
          alt=""
          loading="eager"
        />

        {/* Layer 4: Foreground golden cloud curls draping across the lower frame */}
        <img
          src="/assets/fest/clouds2.png"
          className="landing-layer-cloud landing-cloud-fore"
          alt=""
          loading="eager"
        />
      </div>

      <div className="hero-identity landing-hero-identity">
        <h1 className="sr-only">PRAVAHA {site.edition.toUpperCase()}</h1>
        <AnimatedEventLogo
          variant="hero"
          priority
          className="hero-logo landing-hero-logo"
        />
        <p className="hero-edition">PRAVAHA {site.edition.toUpperCase()}</p>
        {site.date && <p className="hero-date">{site.date}</p>}
      </div>

      <div className="hero-chest-badge" aria-label="Theme: The Annual Cultural Spectacle">
        <span className="hero-theme-pill">THE ANNUAL CULTURAL SPECTACLE</span>
      </div>

      <div className="hero-bottom">
        <Link to="/events" className="hero-explore">
          Events
        </Link>
        <span className="hero-nav-dot" aria-hidden="true">·</span>
        <a href="#lineup" onClick={onScrollToLineup} className="hero-explore hero-lineup-explore" aria-label="Scroll down to pro-show artists">
          Line-up ↓
        </a>
      </div>
    </div>
  );
}
