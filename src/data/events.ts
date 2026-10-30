import type { EventRecord } from '../types';

export type EventInput = Pick<EventRecord, 'id' | 'slug' | 'title' | 'category' | 'kicker' | 'description' | 'art' | 'accent' | 'order'> & Partial<EventRecord>;

const categories: EventInput[] = [
  { id: 'dance', slug: 'dance', title: 'Dance', category: 'Movement', kicker: 'Let the rhythm take over.', description: 'Every beat, a beginning. Every move, a story. Bring your energy to the floor and make the moment yours.', art: 'dance', accent: '#72b4b4', order: 1 },
  { id: 'music', slug: 'music', title: 'Music', category: 'Sound', kicker: 'Make yourself heard.', description: 'For the voices that stay with us and the melodies that bring us together. Find your sound. Let it fill the room.', art: 'music', accent: '#e9b85f', order: 2 },
  { id: 'fashion', slug: 'fashion-show', title: 'Fashion Show', category: 'Expression', kicker: 'Walk your own story.', description: 'A little attitude. A lot of imagination. Step into the spotlight with a style that speaks entirely for itself.', art: 'fashion', accent: '#c6a9b9', order: 3 },
];

export function defineEvents(records: EventInput[]): EventRecord[] { return records.map(item => ({
  image: { path: `/assets/placeholders/program-${item.art}.svg`, alt: `Original illustrated ${item.title.toLowerCase()} composition`, width: 600, height: 700, fit: 'cover' },
  eligibility: 'For students of the college. Full eligibility details to be announced.',
  rules: [], teamSize: { min: null, max: null }, startsAt: null, venue: null, contact: null,
  registrationUrl: null, registrationState: 'soon', published: true,
  ...item,
})); }

export const events = defineEvents(categories);

export const publishedEvents = () => events.filter(event => event.published).sort((a, b) => a.order - b.order);
