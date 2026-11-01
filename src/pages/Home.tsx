import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Story from '../components/Story';
import { LineupSection } from '../components/Lineup';
import { Sponsors } from '../components/Sponsors';
import { guest, artists, resolveLineup } from '../data/lineup';
import { sponsors } from '../data/sponsors';
import { site } from '../config/site';

export default function Home({ reduced }: { reduced: boolean }) {
  const navigate = useNavigate();
  const redirectTimerRef = useRef<number | null>(null);
  const hasRedirectedRef = useRef(false);

  const rawLineup = resolveLineup(guest, artists, import.meta.env.DEV);
  // Order: Artist 01, Artist 02, and Special Guest at the end
  const lineup = [
    ...rawLineup.filter(entry => entry.role === 'artist'),
    ...rawLineup.filter(entry => entry.role === 'guest'),
  ];
  const firstArtist = lineup.find(entry => entry.role === 'artist')!;

  useEffect(() => {
    const clearTimer = () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = null;
      }
    };

    const handleScroll = () => {
      if (hasRedirectedRef.current) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 60; // within 60px of the page bottom

      if (scrollPosition >= threshold) {
        // User reached the bottom of the page: automatically redirect after 3 seconds
        if (!redirectTimerRef.current) {
          redirectTimerRef.current = window.setTimeout(() => {
            hasRedirectedRef.current = true;
            clearTimer();
            navigate('/events');
          }, 3000);
        }
      } else {
        // User scrolled back up away from the bottom: cancel timer
        clearTimer();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimer();
    };
  }, [navigate]);

  return <>
    <Story reduced={reduced} arrival={lineup[0]} />
    <div id="lineup" className="lineup-list" tabIndex={-1} aria-label="Pravaha line-up" data-first-entry={lineup[0].id}>
      {lineup.map((entry, index) => <LineupSection key={entry.id} entry={entry} first={index === 0} firstArtist={entry.id === firstArtist.id} reduced={reduced} />)}
    </div>
    <Sponsors records={sponsors} preview={import.meta.env.DEV && site.preview.sponsors} />
  </>;
}
