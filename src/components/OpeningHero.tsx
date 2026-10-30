import { Link } from 'react-router-dom';
import type { RefObject } from 'react';
import { site } from '../config/site';
import { ArtImage, Arrow } from './Shared';

export function OpeningHero({ heroRef }: { heroRef: RefObject<HTMLDivElement | null> }) {
  return <div className="hero" ref={heroRef}>
    <div className="hero-identity"><h1 className="sr-only">Pravaha {site.edition}</h1><ArtImage asset={site.assets.logo} fallback={site.assets.logoFallback} className="hero-logo" priority /><p className="hero-edition">{site.edition.toUpperCase()}</p>{site.date && <p className="hero-date">{site.date}</p>}</div>
    <div className="hero-bottom"><Link to="/events" className="hero-explore">Events <Arrow diagonal /></Link><div className="scroll-cue"><span className="scroll-stem" /><span>Scroll</span></div></div>
  </div>;
}
