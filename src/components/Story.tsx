import { useCallback, useEffect, useRef, useState, type RefCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { site } from '../config/site';
import { motion } from '../config/motion';
import { portalCamera } from '../lib/policies';
import { compatibleMascotRig } from '../lib/mascot';
import { smoothCameraProgress, revealBeforeUncover, apertureCoverage } from '../lib/story-motion';
import { Arrow } from './Shared';
import { OpeningHero } from './OpeningHero';
import { LineupPresentation } from './Lineup';
import { MascotRig } from './MascotRig';
import type { Asset, LineupRecord } from '../types';

gsap.registerPlugin(ScrollTrigger, useGSAP);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const ramp = (p: number, from: number, to: number) => Math.max(0, Math.min(1, (p - from) / (to - from)));
const smooth = (t: number) => t * t * (3 - 2 * t);

export default function Story({ reduced, arrival }: { reduced: boolean; arrival: LineupRecord }) {
  const shell = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const world = useRef<SVGGElement>(null);
  const camera = useRef<SVGGElement>(null);
  const rigArtwork = useRef<SVGGElement>(null);
  const flatArtwork = useRef<SVGGElement>(null);
  const introActive = useRef(true);
  const aperture = useRef<SVGPathElement>(null);
  const paper = useRef<SVGRectElement>(null);
  const sketchClip = useRef<SVGRectElement>(null);
  const colourClip = useRef<SVGRectElement>(null);
  const flow = useRef<SVGImageElement>(null);
  const detail = useRef<SVGImageElement>(null);
  const glint = useRef<SVGRectElement>(null);
  const progressLine = useRef<HTMLSpanElement>(null);
  const portalMask = useRef<SVGMaskElement>(null);
  const rearWave = useRef<SVGGElement>(null);
  const mainWave = useRef<SVGGElement>(null);
  const edgeWave = useRef<SVGGElement>(null);
  const waves = useRef<SVGSVGElement>(null);
  const passage = useRef<SVGSVGElement>(null);
  const far = useRef<SVGGElement>(null);
  const middle = useRef<SVGGElement>(null);
  const near = useRef<SVGGElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const arrivalLoaded = useRef(false);
  const jointNodes = useRef(new Set<SVGGElement>());
  const registerJoint: RefCallback<SVGGElement> = useCallback(joint => {
    if (!joint) return;
    jointNodes.current.add(joint);
    return () => { jointNodes.current.delete(joint); };
  }, []);
  const [portraitActive, setPortraitActive] = useState(false);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });
  const art = site.assets.mascot;
  const rig = !failed.rig ? compatibleMascotRig(art, viewport.width < 768) : null;
  const source = (key: string, asset: Asset, fallback: Asset) => failed[key] ? fallback.path : (viewport.width < 768 ? asset.responsive?.mobile : undefined) ?? asset.path;
  const fail = (key: string) => () => setFailed(previous => previous[key] ? previous : { ...previous, [key]: true });
  const refresh = () => ScrollTrigger.refresh();
  useEffect(() => {
    if (reduced || !rig) return;
    const image = new Image();
    image.onload = refresh;
    image.onerror = () => setFailed(previous => ({ ...previous, rig: true }));
    image.src = rig.sprite.path;
    return () => { image.onload = null; image.onerror = null; };
  }, [reduced, rig?.sprite.path]);

  useGSAP(() => {
    const section = shell.current!;
    const destination = document.getElementById('lineup');
    if (reduced) {
      destination?.classList.remove('waiting-for-portal');
      if (hero.current) { hero.current.style.opacity = '1'; hero.current.style.visibility = 'visible'; hero.current.inert = false; }
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
      const previewPortrait = preview.current?.querySelector<HTMLElement>('[data-arrival-portrait]');
      const previewCopy = preview.current?.querySelector<HTMLElement>('[data-arrival-copy]');
      const previewMeta = preview.current?.querySelector<HTMLElement>('.lineup-meta');
      const previewFoot = preview.current?.querySelector<HTMLElement>('.lineup-foot');
      let w = 0, h = 0, coverage = 1;
      let idleSeconds = 0, idleWeight = 0, previousWeight = 0;
      const joints = jointNodes.current;
      const applyPose = () => {
        for (const joint of joints) {
          const settings = motion.mascot.joints[joint.dataset.mascotJoint as keyof typeof motion.mascot.joints];
          const angle = Math.sin(idleSeconds * Math.PI * 2 / motion.mascot.idle.period + settings.phase) * settings.degrees * idleWeight;
          joint.setAttribute('transform', `rotate(${angle.toFixed(4)} ${settings.x * art.canvas.width} ${settings.y * art.canvas.height})`);
        }
      };
      const tick = (_time: number, delta: number) => {
        if (!idleWeight || document.hidden || !joints.size) return;
        idleSeconds += Math.min(delta, 64) / 1000;
        applyPose();
      };
      const measure = () => {
        w = stage.current!.clientWidth; h = stage.current!.clientHeight;
        const safeScale = Math.hypot(w / (2 * motion.eye.innerRadius.x), h / (2 * motion.eye.innerRadius.y));
        const opening = aperture.current;
        coverage = (opening?.isPointInFill ? apertureCoverage(w, h,
          { x: motion.eye.centre.x * art.canvas.width, y: motion.eye.centre.y * art.canvas.height },
          (x, y) => opening.isPointInFill(new DOMPoint(x, y)), safeScale) : safeScale) * motion.camera.coverage;
        setViewport(previous => previous.width === w && previous.height === h ? previous : { width: w, height: h });
        portalMask.current?.setAttribute('width', String(w)); portalMask.current?.setAttribute('height', String(h));
      };
      const render = (p: number) => {
        const s = motion.stops;
        const reveal = revealBeforeUncover(ramp(p, motion.mascot.fade.start, motion.mascot.fade.end));
        const logoGone = p >= s.waveCover;
        idleWeight = reveal * (1 - smooth(ramp(p, motion.mascot.idle.settleStart, motion.mascot.idle.settleEnd)));
        if (idleWeight || previousWeight) applyPose();
        previousWeight = idleWeight;
        introActive.current = p < motion.mascot.idle.settleEnd;
        const useRig = !!rigArtwork.current && introActive.current;
        rigArtwork.current?.setAttribute('display', useRig ? 'inline' : 'none');
        flatArtwork.current?.setAttribute('display', useRig ? 'none' : 'inline');
        const sketchP = smooth(ramp(p, s.mascot, s.sketch));
        const eyeP = smoothCameraProgress(ramp(p, s.sketch, s.threshold));
        const travelP = smoothCameraProgress(ramp(p, motion.passage.travel.start, motion.passage.travel.end));
        const settle = smoothCameraProgress(ramp(p, s.passage, s.arrival));
        const fit = Math.min(w / art.canvas.width, h / art.canvas.height) * comp.scale;
        const intro = { x: w * comp.x - art.canvas.width * fit / 2, y: h * comp.y - art.canvas.height * fit / 2, scale: fit };
        const face = portalCamera({ width: w, height: h }, motion.eye.centre, art.canvas, fit * motion.camera.faceZoom);
        // One continuous camera; the aperture and all art use exactly the same transform.
        const baseScale = mix(intro.scale, face.scale, sketchP);
        const scale = mix(baseScale, coverage, eyeP);
        const eyeCamera = portalCamera({ width: w, height: h }, motion.eye.centre, art.canvas, scale);
        const matrix = `translate(${p >= s.sketch ? eyeCamera.x : mix(intro.x, face.x, sketchP)} ${p >= s.sketch ? eyeCamera.y : mix(intro.y, face.y, sketchP)}) scale(${scale})`;
        camera.current?.setAttribute('transform', matrix);
        aperture.current?.setAttribute('transform', matrix);
        aperture.current?.setAttribute('opacity', String(smooth(ramp(p, s.sketch, s.sketch + .018))));
        camera.current?.setAttribute('opacity', String(reveal));
        sketchClip.current?.setAttribute('width', String(art.canvas.width * sketchP));
        colourClip.current?.setAttribute('x', String(art.canvas.width * sketchP));
        colourClip.current?.setAttribute('width', String(art.canvas.width * (1 - sketchP)));
        detail.current?.setAttribute('opacity', String(ramp(p, s.sketch, s.sketch + .025)));
        const glintP = ramp(p, s.sketch - .07, s.sketch);
        glint.current?.setAttribute('x', String(mix(300, 470, glintP)));
        glint.current?.setAttribute('opacity', String(Math.sin(glintP * Math.PI) * .6));
        paper.current?.setAttribute('fill', motion.sketchBackground === 'ivory' ? gsap.utils.interpolate(site.theme.midnight, site.theme.ivory, sketchP) : site.theme.midnight);
        flow.current?.setAttribute('opacity', String(1 - sketchP));
        flow.current?.setAttribute('transform', `translate(${mix(-w * .16, w * .12, p)} ${-h * ramp(p, s.waveEnd, s.mascot) * .05})`);
        if (hero.current) { hero.current.style.opacity = logoGone ? '0' : '1'; hero.current.style.visibility = logoGone ? 'hidden' : 'visible'; hero.current.inert = logoGone; }
        const waveTravel = p <= s.waveCover ? mix(motion.wave.travel.start, motion.wave.travel.cover, ramp(p, 0, s.waveCover)) : mix(motion.wave.travel.cover, motion.wave.travel.end, ramp(p, s.waveCover, s.waveEnd));
        rearWave.current?.setAttribute('transform', `translate(${w * (waveTravel - motion.wave.rearLead)} ${-h * .25})`);
        mainWave.current?.setAttribute('transform', `translate(${w * waveTravel} ${-h * .25})`);
        edgeWave.current?.setAttribute('transform', `translate(${w * (waveTravel - motion.wave.edgeLead)} ${-h * .25})`);
        if (waves.current) waves.current.style.visibility = p > s.waveEnd ? 'hidden' : 'visible';
        const focus = motion.passage.arrivalFocus[arrival.treatment];
        const focusP = smoothCameraProgress(ramp(p, motion.passage.focusTravel.start, motion.passage.focusTravel.end));
        for (const [ref, settings] of [[far, motion.passage.far], [middle, motion.passage.middle], [near, motion.passage.near]] as const) {
          const depthFactor = mobile ? motion.passage.mobileDepthFactor : 1;
          const scaleDepth = mix(settings.startScale, settings.endScale, travelP * depthFactor);
          ref.current?.setAttribute('transform', `translate(${w / 2 + w * settings.shiftX * travelP + w * (focus.x - .5) * focusP} ${h / 2 + h * settings.shiftY * travelP + h * (focus.y - .5) * focusP}) scale(${scaleDepth}) translate(${-w / 2} ${-h / 2})`);
        }
        middle.current?.setAttribute('opacity', String(smooth(ramp(p, motion.passage.travel.middleVisible, s.threshold))));
        near.current?.setAttribute('opacity', String(smooth(ramp(p, motion.passage.travel.nearVisible, s.threshold + .025))));
        if (passage.current) passage.current.style.opacity = String(1 - smooth(ramp(p, s.passage, motion.passage.backdropClear)));
        if (world.current) world.current.style.visibility = p >= motion.camera.rimClearAt ? 'hidden' : 'visible';
        if (preview.current) preview.current.style.visibility = p >= s.passage ? 'visible' : 'hidden';
        const portraitP = smooth(ramp(p, motion.passage.arrivalPortrait, motion.passage.portraitSettled));
        const textP = smooth(ramp(p, motion.passage.arrivalText, motion.passage.textSettled));
        if (previewPortrait) { previewPortrait.style.opacity = String(portraitP); previewPortrait.style.transform = `translateY(${(1 - portraitP) * motion.lineup.portraitOffset}px) scale(${mix(1.025, 1, settle)})`; }
        for (const el of [previewCopy, previewMeta, previewFoot]) if (el) { el.style.opacity = String(textP); el.style.transform = `translateY(${(1 - textP) * motion.lineup.textOffset}px)`; }
        if (p >= s.passage - .035 && !arrivalLoaded.current) { arrivalLoaded.current = true; setPortraitActive(true); }
        if (progressLine.current) progressLine.current.style.transform = `scaleX(${p})`;
        destination?.classList.toggle('waiting-for-portal', p < .9999);
        section.dataset.scene = p < s.logo ? 'logo' : p < s.waveEnd ? 'wave' : p < s.mascot ? 'mascot' : p < s.sketch ? 'sketch' : p < s.threshold ? 'eye' : p < s.passage ? 'passage' : p < s.handoff ? 'arrival' : 'handoff';
        section.dataset.progress = p.toFixed(4);
        document.body.classList.toggle('past-logo', p > s.logo);
      };
      measure();
      const playhead = { progress: 0 };
      const timeline = gsap.timeline({ scrollTrigger: { id: 'pravaha-story', trigger: section, start: 'top top', end: () => `+=${stage.current!.clientHeight * distance / 100}`, scrub: true, onUpdate: self => render(self.progress), onRefresh: self => { measure(); render(self.progress); } } });
      timeline.fromTo(playhead, { progress: 0 }, { progress: 1, duration: 1, ease: 'none', immediateRender: false });
      render(timeline.scrollTrigger?.progress ?? 0);
      gsap.ticker.add(tick);
      document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
      return () => { gsap.ticker.remove(tick); timeline.scrollTrigger?.kill(); timeline.kill(); };
    });
    return () => { alive = false; mm.revert(); section.classList.remove('has-motion'); destination?.classList.remove('waiting-for-portal'); document.body.classList.remove('past-logo'); };
  }, { scope: shell, dependencies: [reduced, arrival.id], revertOnUpdate: true });

  const skip = () => {
    window.history.replaceState(null, '', '/#lineup');
    const target = document.getElementById('lineup');
    if (target) window.scrollTo(0, window.scrollY + target.getBoundingClientRect().top);
    ScrollTrigger.update(); target?.focus({ preventScroll: true });
  };
  const waveImage = (key: 'rear' | 'crest' | 'edge') => <image href={source(`wave-${key}`, site.assets.wave[key], site.assets.waveFallback[key])} width={viewport.width * motion.wave.overscan.x} height={viewport.height * motion.wave.overscan.y} preserveAspectRatio="none" onError={fail(`wave-${key}`)} onLoad={refresh} />;
  const passageImage = (key: 'far' | 'middle' | 'near') => <image href={source(`passage-${key}`, site.assets.passage[key], site.assets.passageFallback[key])} width={viewport.width} height={viewport.height} preserveAspectRatio="xMidYMid slice" onError={fail(`passage-${key}`)} onLoad={refresh} />;
  return <section ref={shell} className={`story-shell ${reduced ? 'reduced-story' : ''}`} aria-label="The Pravaha story" data-arrival-id={arrival.id}>
    <div ref={stage} className="story-stage">
      {!reduced && <>
        <div ref={preview} className="arrival-preview" aria-hidden="true"><LineupPresentation entry={arrival} preview portraitActive={portraitActive} /></div>
        <svg ref={passage} className="passage-canvas" width="100%" height="100%" viewBox={`0 0 ${viewport.width} ${viewport.height}`} aria-hidden="true"><g ref={far} data-depth="far">{passageImage('far')}</g><g ref={middle} data-depth="middle" opacity="0">{passageImage('middle')}</g><g ref={near} data-depth="near" opacity="0">{passageImage('near')}</g></svg>
        <svg className="story-canvas" width="100%" height="100%" viewBox={`0 0 ${viewport.width} ${viewport.height}`} aria-hidden="true">
          <defs>
            <mask ref={portalMask} id="eye-portal" maskUnits="userSpaceOnUse" x="0" y="0" width={viewport.width} height={viewport.height}><rect width="100%" height="100%" fill="white" /><path ref={aperture} d={motion.eye.aperture} fill="black" opacity="0" /></mask>
            <clipPath id="sketch-wipe"><rect ref={sketchClip} width="0" height={art.canvas.height} /></clipPath>
            <clipPath id="colour-wipe"><rect ref={colourClip} width={art.canvas.width} height={art.canvas.height} /></clipPath>
            <mask id="gold-surface" maskUnits="userSpaceOnUse" x="0" y="0" width={art.canvas.width} height={art.canvas.height} style={{ maskType: 'alpha' }}><image href={source('mask', art.mask, site.assets.mascotFallback.mask)} width={art.canvas.width} height={art.canvas.height} /></mask>
          </defs>
          <g ref={world} mask="url(#eye-portal)">
            <rect ref={paper} width="100%" height="100%" fill={site.theme.midnight} />
            <image ref={flow} href={source('flow', site.assets.flow, site.assets.flowFallback)} width={viewport.width * 1.3} height={viewport.height} preserveAspectRatio="xMidYMid slice" onError={fail('flow')} />
            <g ref={camera} opacity="0" data-mascot-camera>
              {rig && <g ref={rigArtwork} display={introActive.current ? 'inline' : 'none'}><g clipPath="url(#colour-wipe)"><MascotRig sprite={rig.sprite} variant="colour" canvas={art.canvas} registerJoint={registerJoint} /></g><g clipPath="url(#sketch-wipe)" style={motion.sketchBackground === 'dark' ? { filter: 'brightness(0) invert(1)' } : undefined}><MascotRig sprite={rig.sprite} variant="sketch" canvas={art.canvas} registerJoint={registerJoint} /></g></g>}
              <g ref={flatArtwork} display={rig && introActive.current ? 'none' : 'inline'}><image href={source('colour', art.colour, site.assets.mascotFallback.colour)} width={art.canvas.width} height={art.canvas.height} clipPath="url(#colour-wipe)" onError={fail('colour')} onLoad={refresh} /><image href={source('sketch', art.sketch, site.assets.mascotFallback.sketch)} width={art.canvas.width} height={art.canvas.height} clipPath="url(#sketch-wipe)" style={motion.sketchBackground === 'dark' ? { filter: 'brightness(0) invert(1)' } : undefined} onError={fail('sketch')} onLoad={refresh} /></g>
              <image href={source('mask', art.mask, site.assets.mascotFallback.mask)} width={art.canvas.width} height={art.canvas.height} onError={fail('mask')} onLoad={refresh} />
              <g mask="url(#gold-surface)"><rect ref={glint} x="300" y="210" width="16" height="100" fill={site.theme.ivory} opacity="0" /></g>
              {art.faceDetail && !failed.detail && <image ref={detail} href={art.faceDetail.path} width={art.canvas.width} height={art.canvas.height} opacity="0" onError={fail('detail')} onLoad={refresh} />}
            </g>
          </g>
        </svg>
      </>}
      <OpeningHero heroRef={hero} />
      {!reduced && <>
        <svg ref={waves} className="wave-canvas" width="100%" height="100%" viewBox={`0 0 ${viewport.width} ${viewport.height}`} aria-hidden="true"><g transform={motion.wave.direction === 'left-to-right' ? `translate(${viewport.width} 0) scale(-1 1)` : undefined}><g ref={rearWave}>{waveImage('rear')}</g><g ref={mainWave} data-wave-crest>{waveImage('crest')}</g><g ref={edgeWave}>{waveImage('edge')}</g></g></svg>
        <button className="skip-intro" onClick={skip}>Skip intro <Arrow /></button><div className="story-progress" aria-hidden="true"><span ref={progressLine} /></div>
      </>}
    </div>
  </section>;
}
