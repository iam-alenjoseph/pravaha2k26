import { useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { motion } from '../config/motion';
import type { LineupRecord } from '../types';
import { ArtImage } from './Shared';

export function LineupPresentation({ entry, preview = false, portraitActive = true }: { entry: LineupRecord; preview?: boolean; portraitActive?: boolean }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const title = entry.state === 'announced' && entry.name ? entry.name : entry.announcementLabel;
  const heading = entry.state === 'announced' && entry.name ? entry.name : entry.role === 'guest' ? 'Special Guest' : <>Artist <em>{entry.order.toString().padStart(2, '0')}</em></>;

  // Mascot companion pose for each section (Dhwani CET carnival guardian concept)
  const mascotPose = entry.role === 'guest' 
    ? '/assets/fest/pose1.png'
    : entry.order === 1 
      ? '/assets/fest/pose2.png' 
      : '/assets/fest/pose3.png';

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (preview) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      className={`lineup-composition treatment-${entry.treatment} ${preview ? 'is-arrival-copy' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="lineup-backdrop" aria-hidden="true">
        {/* Animated concentric rings inspired by Dhwani CET */}
        <div className="fest-concentric-rings">
          <span className="ring-pulse ring-pulse-1" />
          <span className="ring-pulse ring-pulse-2" />
          <span className="ring-pulse ring-pulse-3" />
        </div>
        <span className="lineup-halo" />
        {entry.backdrop && portraitActive && <ArtImage asset={entry.backdrop} className="lineup-backdrop-image" />}
        {/* Subtle cloud mist at base */}
        <img src="/assets/fest/clouds1.png" className="lineup-cloud-grounding" alt="" />
      </div>

      {entry.performanceType && (
        <div className="lineup-meta">
          <span>{entry.performanceType}</span>
        </div>
      )}

      {/* Dynamic Mascot Presence (Inspired by Dhwani's Khai accompanying festival acts) */}
      {!preview && portraitActive && (
        <div className={`fest-mascot-guardian fest-mascot-${entry.treatment}`} aria-hidden="true">
          <div className="mascot-aura-halo" />
          <img
            src={mascotPose}
            alt=""
            className="fest-mascot-img"
            loading="lazy"
          />
        </div>
      )}

      <div
        className="lineup-portrait"
        data-arrival-portrait
        style={{
          '--focal-position': entry.focalPosition ?? '50% 35%',
          transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          transition: 'transform 0.15s ease-out',
        } as CSSProperties}
      >
        {entry.image && portraitActive ? (
          <ArtImage asset={{ ...entry.image, position: entry.focalPosition ?? entry.image.position }} className="lineup-portrait-image" />
        ) : (
          <div className="lineup-silhouette fest-mystery-portal" aria-hidden="true">
            {/* Mystery headliner with hiddenartist.png silhouette and glowing radar */}
            <div className="mystery-radar-glow">
              <span className="radar-sweep" />
              <span className="radar-beacon" />
            </div>
            <img
              src="/assets/fest/hiddenartist.png"
              alt=""
              className="mystery-silhouette-art"
            />
            <span className="silhouette-head" />
            <span className="silhouette-body" />
            <span className="silhouette-outline" />
          </div>
        )}
        <span className="portrait-rule" aria-hidden="true" />
      </div>

      <div className="lineup-copy" data-arrival-copy>
        <div className="eyebrow">
          <span className="status-dot" />
          <span>CHAPTER {entry.role === 'guest' ? 'SPECIAL' : `0${entry.order}`} · MAIN STAGE</span>
        </div>
        {preview ? <div className="lineup-display">{heading}</div> : <h2 className="lineup-display" id={`${entry.id}-title`}>{heading}</h2>}
        {entry.copy && <p className="lineup-description">{entry.copy}</p>}
        {!(entry.state === 'announced' && entry.name) && title && <p className="lineup-announcement">{title}</p>}
        {entry.previewOnly && <p className="guest-preview-label">DEVELOPMENT PREVIEW · GUEST APPEARANCE UNCONFIRMED</p>}
      </div>
    </div>
  );
}

export function LineupSection({ entry, first, firstArtist, reduced }: { entry: LineupRecord; first: boolean; firstArtist: boolean; reduced: boolean }) {
  const scope = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (reduced || first) return;
    const timeline = gsap.timeline({ scrollTrigger: { trigger: scope.current, start: 'top 80%', end: 'top 25%', scrub: true } });
    timeline.fromTo('[data-arrival-portrait]', { y: motion.lineup.portraitOffset, opacity: .5 }, { y: 0, opacity: 1, ease: 'none' }, 0)
      .fromTo('[data-arrival-copy]', { y: motion.lineup.textOffset, opacity: .5 }, { y: 0, opacity: 1, ease: 'none' }, .12);
  }, { scope, dependencies: [reduced, first], revertOnUpdate: true });
  return <section ref={scope} className="lineup-section" id={firstArtist ? 'artists' : entry.id} data-lineup-role={entry.role} data-entry-id={entry.id} tabIndex={-1} aria-labelledby={`${entry.id}-title`}><LineupPresentation entry={entry} /></section>;
}
