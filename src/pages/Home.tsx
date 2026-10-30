import { Link } from 'react-router-dom';
import Story from '../components/Story';
import { ArtImage, Arrow, EventCard, ProgramsIntro, Spark } from '../components/Shared';
import { publishedEvents } from '../data/events';
import { artists } from '../data/artists';
import { sponsors } from '../data/sponsors';
import { site } from '../config/site';
import { Sponsors } from '../components/Sponsors';

export default function Home({ reduced }: { reduced: boolean }) {
  const previewSponsors = import.meta.env.DEV && site.preview.sponsors;
  return <>
    <Story reduced={reduced} />
    <section id="programs" className={`programs-section ${reduced ? '' : 'follows-story'}`} tabIndex={-1} aria-label="Programs">
      <ProgramsIntro />
      <div className="programs-body"><div className="section-meta"><span>01 — FIND YOUR STAGE</span><span>FREE PARTICIPATION <span className="tiny-spark">✦</span> COLLEGE STUDENTS ONLY</span></div><div className="events-grid">{publishedEvents().map((event, index) => <EventCard key={event.id} event={event} index={index} />)}</div><div className="programs-closing"><p>You bring the talent.<br /><em>We’ll bring the moment.</em></p><Link to="/events" className="round-link">All events<Arrow diagonal /></Link></div></div>
    </section>
    <section id="artists" className="artists-section" tabIndex={-1} aria-labelledby="artists-title"><div className="section-meta"><span>02 — AFTER THE SPOTLIGHT</span><span>TURN IT UP. STAY A LITTLE LONGER.</span></div><div className="artists-heading"><div><span className="eyebrow">THE GRAND FINALE</span><h2 id="artists-title">One night.<br /><em>Every feeling.</em></h2></div><p>When the performances end,<br />a different energy takes over.</p></div>
      <div className="artist-list">{[...artists].sort((a,b) => a.order - b.order).map(artist => <article className="artist-card" key={artist.id}><div className="artist-visual">{artist.state === 'announced' && artist.image ? <ArtImage asset={artist.image} /> : <div className="abstract-stage" aria-hidden="true"><span className="stage-ring ring-one" /><span className="stage-ring ring-two" /><span className="stage-ring ring-three" /><span className="stage-silhouette" /><div className="stage-rays" /><Spark /></div>}<span className="artist-type">{artist.performanceType}</span></div><div className="artist-caption"><div><span className="eyebrow">{artist.state === 'unannounced' ? 'GOOD THINGS TAKE A LITTLE SUSPENSE.' : artist.performanceType}</span><h3>{artist.state === 'announced' && artist.name ? artist.name : artist.announcementLabel}</h3></div><span className="announcement-stamp">{artist.state === 'unannounced' ? <>THE WAIT<br />WILL BE WORTH IT.</> : 'PRAVAHA 2K26'}<Spark /></span></div></article>)}</div>
    </section>
    <section className="closing-note"><span className="eyebrow">A FESTIVAL BUILT BY US. FOR US.</span><p>Not just a date on the calendar.<br /><em>A feeling we take with us.</em></p><Link to="/schedule" className="text-link">The schedule, when it’s ready <Arrow diagonal /></Link></section>
    <Sponsors records={sponsors} preview={previewSponsors} />
  </>;
}
