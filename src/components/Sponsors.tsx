import type { SponsorRecord } from '../types';
import { ArtImage } from './Shared';
import { safeExternal } from '../lib/policies';

export function Sponsors({ records, preview = false }: { records: SponsorRecord[]; preview?: boolean }) {
  if (!records.length && !preview) return null;
  return <section id="sponsors" className="sponsors-section" tabIndex={-1}>
    <div className="section-meta"><span>03 — THE PEOPLE BEHIND THE POSSIBILITIES</span>{preview && <strong>DEVELOPMENT PREVIEW — SAMPLE SLOTS</strong>}</div>
    <h2>In good <em>company.</em></h2>
    <div className="sponsors-grid">{records.length ? [...records].sort((a,b) => a.order - b.order).map(sponsor => {
      const content = <>{sponsor.logo ? <ArtImage asset={sponsor.logo} fallbackLabel={sponsor.name} /> : <span>{sponsor.name}</span>}{sponsor.tier && <small>{sponsor.tier}</small>}</>;
      const url = safeExternal(sponsor.website);
      return url ? <a key={sponsor.id} href={url} target="_blank" rel="noopener noreferrer" aria-label={sponsor.name}>{content}</a> : <div key={sponsor.id}>{content}</div>;
    }) : ['Sample logo slot 01', 'Sample logo slot 02', 'Sample logo slot 03'].map(label => <div key={label}>{label}</div>)}</div>
  </section>;
}
