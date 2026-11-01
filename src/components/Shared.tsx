import { useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { site } from '../config/site';
import { registrationAction } from '../lib/policies';
import type { Asset, EventRecord } from '../types';
import { useMobile } from '../lib/media';
import { AnimatedEventArt } from './AnimatedEventArt';

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" /></svg>;
}
export function Spark({ className = '' }: { className?: string }) {
  return <svg className={className} width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 0c2 16 4 18 20 20-16 2-18 4-20 20C18 24 16 22 0 20 16 18 18 16 20 0Z" fill="currentColor" /></svg>;
}
export function ArtImage({ asset, fallback, fallbackLabel, className = '', priority = false }: { asset: Asset; fallback?: Asset; fallbackLabel?: string; className?: string; priority?: boolean }) {
  const mobile = useMobile();
  const key = `${asset.path}:${mobile}`;
  const [failure, setFailure] = useState({ key, count: 0 });
  const count = failure.key === key ? failure.count : 0;
  const selected = count > 0 || !asset.path.trim() ? fallback : asset;
  if (!selected || count > 1) return <div className={`art-fallback ${className}`} role="img" aria-label={asset.alt} style={{ aspectRatio: `${asset.width}/${asset.height}` }}><Spark /><span>{fallbackLabel ?? `Pravaha ${site.edition}`}</span></div>;
  const source = mobile && selected.responsive?.mobile ? selected.responsive.mobile : selected.path;
  const detail = !mobile ? selected.responsive?.detail : undefined;
  return <img className={className} src={source} srcSet={detail ? `${source} 1x, ${detail} 2x` : undefined} alt={selected.alt} width={selected.width} height={selected.height} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" style={{ objectFit: selected.fit, objectPosition: selected.position } as CSSProperties} onLoad={() => ScrollTrigger.refresh()} onError={() => setFailure({ key, count: count + 1 })} />;
}
export function Registration({ event }: { event: EventRecord }) {
  const action = registrationAction(event.registrationState, event.registrationUrl);
  return action.href
    ? <a className="registration-link" href={action.href} target="_blank" rel="noopener noreferrer">{action.label}<Arrow diagonal /></a>
    : <span className={`registration-state ${event.registrationState}`}><span className="status-dot" />{action.label}</span>;
}
export function EventCard({ event, index }: { event: EventRecord; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  return <article 
    className={`event-card ${event.art}`} 
    style={{ '--event-accent': event.accent } as CSSProperties}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    <Link className="event-art-link" to={`/events/${event.slug}`} aria-label={`Explore ${event.title}`}>
      <AnimatedEventArt
        eventId={event.id}
        alt={`Pravaha ${event.title}`}
        className="event-art"
        isParentHovered={isHovered}
        staggerIndex={index}
      />
      <span className="art-number">0{index + 1} · {event.category.toUpperCase()}</span>
      <span className="art-action"><Arrow diagonal /></span>
    </Link>
    <div className="event-card-heading"><h3><Link to={`/events/${event.slug}`}>{event.title}</Link></h3><span>0{index + 1}</span></div>
    <p className="event-kicker">{event.kicker}</p><p className="event-description">{event.description}</p>
    <div className="event-card-actions"><Link to={`/events/${event.slug}`} className="text-link">Explore {event.title} <Arrow /></Link><Registration event={event} /></div>
  </article>;
}
