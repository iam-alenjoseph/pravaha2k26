import { Link } from 'react-router-dom';
import type { RefObject } from 'react';
import { site } from '../config/site';
import { ArtImage, Arrow, Spark } from './Shared';

export function OpeningHero({ heroRef }: { heroRef: RefObject<HTMLDivElement | null> }) {
  return <div className="hero" ref={heroRef}>
    <div className="hero-topline"><span className="eyebrow"><span className="status-dot" />STUDENT-FUNDED. STUDENT-FELT.</span><span className="small-label">{site.date ?? 'THE 2026 EDITION'}</span></div>
    <div className="hero-side hero-side-left" aria-hidden="true">LET GO.<span>GET LOST.</span></div><div className="hero-side hero-side-right" aria-hidden="true">COME TOGETHER.<span>COME ALIVE.</span></div>
    <span className="hero-orbit orbit-one" aria-hidden="true" /><span className="hero-orbit orbit-two" aria-hidden="true" /><Spark className="hero-star star-one" /><Spark className="hero-star star-two" />
    <div className="hero-identity"><p className="hero-pretitle">THE CURRENT IS CALLING.</p><h1 className="sr-only">Pravaha 2k26 — Find your flow.</h1><ArtImage asset={site.assets.logo} fallback={site.assets.logoFallback} className="hero-logo" priority /><p className="hero-tagline">Find your <em>flow.</em></p></div>
    <div className="hero-bottom"><p className="hero-manifesto">Some things can’t<br />be put into words.</p><div className="scroll-cue"><span className="scroll-stem" /><span>SCROLL TO FEEL IT</span></div><Link to="/events" className="hero-explore">Explore the events <Arrow diagonal /><span>COLLEGE-ONLY. PARTICIPATION IS FREE.</span></Link></div>
  </div>;
}
