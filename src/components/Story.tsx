import { useRef } from 'react';
import { OpeningHero } from './OpeningHero';
import type { LineupRecord } from '../types';

export default function Story({ reduced, arrival }: { reduced: boolean; arrival: LineupRecord }) {
  const hero = useRef<HTMLDivElement>(null);

  const scrollToLineup = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById('lineup') || document.getElementById('artists');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="story-shell landing-direct-shell" aria-label="The Pravaha story" data-arrival-id={arrival.id}>
      <div className="story-stage landing-direct-stage">
        <OpeningHero heroRef={hero} onScrollToLineup={scrollToLineup} />
      </div>
    </section>
  );
}
