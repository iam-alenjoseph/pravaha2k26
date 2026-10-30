import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { site } from '../config/site';
import { motion } from '../config/motion';
import { portalCamera } from '../lib/policies';
import { ArtImage, Arrow, ProgramsIntro, Spark } from './Shared';
import type { MascotAssets } from '../types';

gsap.registerPlugin(ScrollTrigger, useGSAP);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const ramp = (p: number, from: number, to: number) => Math.max(0, Math.min(1, (p - from) / (to - from)));
const smooth = (t: number) => t * t * (3 - 2 * t);

export default function Story({ reduced }: { reduced: boolean }) {
  const shell = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const world = useRef<SVGGElement>(null);
  const camera = useRef<SVGGElement>(null);
  const aperture = useRef<SVGPathElement>(null);
  const paper = useRef<SVGRectElement>(null);
  const colour = useRef<SVGImageElement>(null);
  const sketch = useRef<SVGImageElement>(null);
  const flow = useRef<SVGImageElement>(null);
  const detail = useRef<SVGImageElement>(null);
  const caption = useRef<HTMLDivElement>(null);
  const progressLine = useRef<HTMLSpanElement>(null);
  const portalMask = useRef<SVGMaskElement>(null);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const art: MascotAssets = site.assets.mascot;
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });

  useGSAP(() => {
    const section = shell.current!;
    const destination = document.getElementById('programs');
    if (reduced) {
      destination?.classList.remove('waiting-for-portal');
      if (hero.current) { hero.current.style.opacity = '1'; hero.current.style.visibility = 'visible'; hero.current.style.transform = 'none'; hero.current.inert = false; }
      return;
    }
    const mm = gsap.matchMedia();
    let alive = true;
    mm.add({ mobile: '(max-width: 767px)', desktop: '(min-width: 768px)' }, context => {
      const mobile = !!context.conditions?.mobile;
      const comp = mobile ? motion.composition.mobile : motion.composition.desktop;
      const distance = mobile ? motion.scrollVh.mobile : motion.scrollVh.desktop;
      section.style.setProperty('--story-travel', `${distance}svh`);
      section.classList.add('has-motion');
      let w = 0, h = 0;
      const measure = () => {
        w = stage.current!.clientWidth; h = stage.current!.clientHeight;
        setViewport({ width: w, height: h });
        portalMask.current?.setAttribute('width', String(w));
        portalMask.current?.setAttribute('height', String(h));
      };
      const render = (p: number) => {
        const s = motion.stops;
        const reveal = smooth(ramp(p, s.logo, s.flow));
        const sketchP = smooth(ramp(p, s.mascot, s.sketch));
        const portalP = smooth(ramp(p, s.sketch, s.portal));
        const fit = Math.min(w / art.canvas.width, h / art.canvas.height) * comp.scale;
        const intro = { x: w * comp.x - art.canvas.width * fit / 2, y: h * comp.y - art.canvas.height * fit / 2, scale: fit };
        const face = portalCamera({ width: w, height: h }, motion.eye.centre, art.canvas, fit * 2.8);
        const coverScale = Math.hypot(w / (2 * motion.eye.innerRadius.x), h / (2 * motion.eye.innerRadius.y)) * 1.12;
        const end = portalCamera({ width: w, height: h }, motion.eye.centre, art.canvas, coverScale);
        const x = mix(mix(intro.x, face.x, sketchP), end.x, portalP);
        const y = mix(mix(intro.y + (1 - reveal) * 45, face.y, sketchP), end.y, portalP);
        const scale = mix(mix(intro.scale, face.scale, sketchP), end.scale, portalP);
        const matrix = `translate(${x} ${y}) scale(${scale})`;
        camera.current?.setAttribute('transform', matrix);
        aperture.current?.setAttribute('transform', matrix);
        aperture.current?.setAttribute('opacity', String(ramp(p, s.sketch - 0.005, s.sketch + 0.012)));
        camera.current?.setAttribute('opacity', String(reveal));
        colour.current?.setAttribute('opacity', String(1 - sketchP));
        sketch.current?.setAttribute('opacity', String(sketchP));
        detail.current?.setAttribute('opacity', String(ramp(p, s.sketch - .04, s.sketch)));
        const bg = motion.sketchBackground === 'ivory' ? gsap.utils.interpolate(site.theme.midnight, site.theme.ivory, sketchP) : site.theme.midnight;
        paper.current?.setAttribute('fill', bg);
        flow.current?.setAttribute('opacity', String(1 - sketchP));
        flow.current?.setAttribute('transform', `translate(${mix(-w * .16, w * .15, p)} ${Math.sin(reveal * Math.PI) * -h * .15})`);
        if (hero.current) {
          hero.current.style.opacity = String(1 - smooth(ramp(p, s.logo * .8, s.flow * .85)));
          hero.current.style.visibility = p >= s.flow ? 'hidden' : 'visible';
          hero.current.inert = p > s.logo;
          hero.current.style.transform = `translateY(${-reveal * 80}px)`;
        }
        if (caption.current) {
          caption.current.style.opacity = String(reveal * (1 - ramp(p, s.mascot, s.sketch)));
          caption.current.style.color = sketchP > .5 ? site.theme.graphite : site.theme.ivory;
        }
        if (progressLine.current) progressLine.current.style.transform = `scaleX(${p})`;
        if (world.current) world.current.style.visibility = p >= .999 ? 'hidden' : 'visible';
        destination?.classList.toggle('waiting-for-portal', p < .998);
        section.dataset.scene = p < s.logo ? 'logo' : p < s.flow ? 'flow' : p < s.mascot ? 'mascot' : p < s.sketch ? 'sketch' : p < s.portal ? 'portal' : 'handoff';
        section.dataset.progress = p.toFixed(3);
        document.body.classList.toggle('past-logo', p > s.logo);
      };
      measure();
      const playhead = { progress: 0 };
      const timeline = gsap.timeline({ scrollTrigger: { id: 'pravaha-story', trigger: section, start: 'top top', end: () => `+=${stage.current!.clientHeight * distance / 100}`, scrub: true, onUpdate: self => render(self.progress), onRefresh: self => { measure(); render(self.progress); } } });
      timeline.fromTo(playhead, { progress: 0 }, { progress: 1, duration: 1, ease: 'none', immediateRender: false });
      render(timeline.scrollTrigger?.progress ?? 0);
      document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
      return () => { timeline.scrollTrigger?.kill(); timeline.kill(); };
    });
    return () => {
      alive = false; mm.revert();
      section.classList.remove('has-motion');
      destination?.classList.remove('waiting-for-portal');
      document.body.classList.remove('past-logo');
    };
  }, { scope: shell, dependencies: [reduced], revertOnUpdate: true });

  const skip = () => {
    window.history.replaceState(null, '', '/#programs');
    const programs = document.getElementById('programs');
    if (programs) window.scrollTo(0, window.scrollY + programs.getBoundingClientRect().top);
    ScrollTrigger.update();
    document.getElementById('programs')?.focus({ preventScroll: true });
  };
  return <section ref={shell} className={`story-shell ${reduced ? 'reduced-story' : ''}`} aria-label="The Pravaha story">
    <div ref={stage} className="story-stage">
      {!reduced && <>
        <div className="portal-preview" aria-hidden="true"><ProgramsIntro preview /></div>
        <svg className="story-canvas" width="100%" height="100%" viewBox={`0 0 ${viewport.width} ${viewport.height}`} aria-hidden="true">
          <defs><mask ref={portalMask} id="eye-portal" maskUnits="userSpaceOnUse" x="0" y="0" width={viewport.width} height={viewport.height}><rect width="100%" height="100%" fill="white" /><path ref={aperture} d={motion.eye.aperture} fill="black" opacity="0" /></mask></defs>
          <g ref={world} mask="url(#eye-portal)">
            <rect ref={paper} width="100%" height="100%" fill={site.theme.midnight} />
            <image ref={flow} href={failed.flow ? site.assets.flowFallback.path : (viewport.width < 768 ? site.assets.flow.responsive?.mobile : undefined) ?? site.assets.flow.path} width={viewport.width * 1.3} height={viewport.height} preserveAspectRatio="xMidYMid slice" onError={() => setFailed(previous => ({ ...previous, flow: true }))} />
            <g ref={camera} opacity="0">
              <image ref={colour} href={failed.colour ? site.assets.mascotFallback.colour.path : (viewport.width < 768 ? art.colour.responsive?.mobile : undefined) ?? art.colour.path} width={art.canvas.width} height={art.canvas.height} onError={() => setFailed(previous => ({ ...previous, colour: true }))} onLoad={() => ScrollTrigger.refresh()} />
              <image ref={sketch} href={failed.sketch ? site.assets.mascotFallback.sketch.path : (viewport.width < 768 ? art.sketch.responsive?.mobile : undefined) ?? art.sketch.path} width={art.canvas.width} height={art.canvas.height} opacity="0" style={motion.sketchBackground === 'dark' ? { filter: 'brightness(0) invert(1)' } : undefined} onError={() => setFailed(previous => ({ ...previous, sketch: true }))} onLoad={() => ScrollTrigger.refresh()} />
              <image href={failed.mask ? site.assets.mascotFallback.mask.path : (viewport.width < 768 ? art.mask.responsive?.mobile : undefined) ?? art.mask.path} width={art.canvas.width} height={art.canvas.height} onError={() => setFailed(previous => ({ ...previous, mask: true }))} onLoad={() => ScrollTrigger.refresh()} />
              {art.faceDetail && !failed.faceDetail && <image ref={detail} href={art.faceDetail.path} width={art.canvas.width} height={art.canvas.height} opacity="0" onError={() => setFailed(previous => ({ ...previous, faceDetail: true }))} onLoad={() => ScrollTrigger.refresh()} />}
            </g>
          </g>
        </svg>
        <div ref={caption} className="mascot-caption" aria-hidden="true"><span className="eyebrow">FOLLOW THE CURRENT</span><p>There’s a world<br />behind the <em>mask.</em></p><span className="small-label">AN ORIGINAL PLACEHOLDER CHARACTER<br />A NEW WORLD, TAKING SHAPE.</span></div>
      </>}
      <div className="hero" ref={hero}>
        <div className="hero-topline"><span className="eyebrow"><span className="status-dot" />STUDENT-FUNDED. STUDENT-FELT.</span><span className="small-label">{site.date ?? 'THE 2026 EDITION'}</span></div>
        <div className="hero-side hero-side-left" aria-hidden="true">LET GO.<span>GET LOST.</span></div>
        <div className="hero-side hero-side-right" aria-hidden="true">COME TOGETHER.<span>COME ALIVE.</span></div>
        <span className="hero-orbit orbit-one" aria-hidden="true" /><span className="hero-orbit orbit-two" aria-hidden="true" />
        <Spark className="hero-star star-one" /><Spark className="hero-star star-two" />
        <div className="hero-identity"><p className="hero-pretitle">THE CURRENT IS CALLING.</p><h1 className="sr-only">Pravaha 2k26 — Find your flow.</h1><ArtImage asset={site.assets.logo} fallback={site.assets.logoFallback} className="hero-logo" priority /><p className="hero-tagline">Find your <em>flow.</em></p></div>
        <div className="hero-bottom"><p className="hero-manifesto">Some things can’t<br />be put into words.</p><div className="scroll-cue"><span className="scroll-stem" /><span>SCROLL TO FEEL IT</span></div><Link to="/#programs" className="hero-explore">Explore the events <Arrow diagonal /><span>COLLEGE-ONLY. PARTICIPATION IS FREE.</span></Link></div>
      </div>
      {!reduced && <><button className="skip-intro" onClick={skip}>Skip intro <Arrow /></button><div className="story-progress" aria-hidden="true"><span ref={progressLine} /></div></>}
    </div>
  </section>;
}
