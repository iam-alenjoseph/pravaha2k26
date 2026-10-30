import Story from '../components/Story';
import { LineupSection } from '../components/Lineup';
import { Sponsors } from '../components/Sponsors';
import { guest, artists, resolveLineup } from '../data/lineup';
import { sponsors } from '../data/sponsors';
import { site } from '../config/site';

export default function Home({ reduced }: { reduced: boolean }) {
  const lineup = resolveLineup(guest, artists, import.meta.env.DEV);
  const firstArtist = lineup.find(entry => entry.role === 'artist')!;
  return <>
    <Story reduced={reduced} arrival={lineup[0]} />
    <div id="lineup" className={`lineup-list ${reduced ? '' : 'follows-story'}`} tabIndex={-1} aria-label="Pravaha line-up" data-first-entry={lineup[0].id}>
      {lineup.map((entry, index) => <LineupSection key={entry.id} entry={entry} first={index === 0} firstArtist={entry.id === firstArtist.id} reduced={reduced} />)}
    </div>
    <Sponsors records={sponsors} preview={import.meta.env.DEV && site.preview.sponsors} />
  </>;
}
