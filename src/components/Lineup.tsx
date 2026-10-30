import { useRef, type CSSProperties } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { motion } from '../config/motion';
import type { LineupRecord } from '../types';
import { ArtImage } from './Shared';

export function LineupPresentation({ entry, preview = false, portraitActive = true }: { entry: LineupRecord; preview?: boolean; portraitActive?: boolean }) {
  const title = entry.state === 'announced' && entry.name ? entry.name : entry.announcementLabel;
  const heading = entry.state === 'announced' && entry.name ? entry.name : entry.role === 'guest' ? 'Special guest' : <>Artist <em>{entry.order.toString().padStart(2, '0')}</em></>;
  return <div className={`lineup-composition treatment-${entry.treatment} ${preview ? 'is-arrival-copy' : ''}`}>
    <div className="lineup-backdrop" aria-hidden="true"><span className="lineup-halo" />{entry.backdrop && portraitActive && <ArtImage asset={entry.backdrop} className="lineup-backdrop-image" />}</div>
    {entry.performanceType && <div className="lineup-meta"><span>{entry.performanceType}</span></div>}
    <div className="lineup-portrait" data-arrival-portrait style={{ '--focal-position': entry.focalPosition ?? '50% 35%' } as CSSProperties}>
      {entry.image && portraitActive ? <ArtImage asset={{ ...entry.image, position: entry.focalPosition ?? entry.image.position }} className="lineup-portrait-image" /> : <div className="lineup-silhouette" aria-hidden="true"><span className="silhouette-head" /><span className="silhouette-body" /><span className="silhouette-outline" /></div>}
      <span className="portrait-rule" aria-hidden="true" />
    </div>
    <div className="lineup-copy" data-arrival-copy>
      {preview ? <div className="lineup-display">{heading}</div> : <h2 className="lineup-display" id={`${entry.id}-title`}>{heading}</h2>}
      {!(entry.state === 'announced' && entry.name) && <p className="lineup-announcement">{title}</p>}
      {entry.copy && <p className="lineup-description">{entry.copy}</p>}
      {entry.previewOnly && <p className="guest-preview-label">DEVELOPMENT PREVIEW · GUEST APPEARANCE UNCONFIRMED</p>}
    </div>
  </div>;
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
