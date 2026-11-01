import type { EventRecord } from '../types';

export type EventInput = Pick<EventRecord, 'id' | 'slug' | 'title' | 'category' | 'kicker' | 'description' | 'art' | 'accent' | 'order'> & Partial<EventRecord>;

const categories: EventInput[] = [
  {
    id: 'dance',
    slug: 'dance',
    title: 'Dance',
    category: 'Movement',
    kicker: 'Own the floor.',
    description: 'From every beat to every move, bring your style, your energy and your own way of dancing.',
    art: 'dance',
    accent: '#72b4b4',
    order: 1,
  },
  {
    id: 'music',
    slug: 'music',
    title: 'Music',
    category: 'Sound',
    kicker: "It's your voice. It's your moment.",
    description: 'Solo or together, let the music do the talking. Bring your sound to the Pravaha stage.',
    art: 'music',
    accent: '#e9b85f',
    order: 2,
  },
  {
    id: 'fashion',
    slug: 'fashion-show',
    title: 'Fashion Show',
    category: 'Expression',
    kicker: 'Make an entrance. Leave an impression.',
    description: 'Style, creativity and confidence. Take the runway and bring your vision to life.',
    art: 'fashion',
    accent: '#c6a9b9',
    order: 3,
  },
];

export function defineEvents(records: EventInput[]): EventRecord[] {
  return records.map(item => ({
    image: { path: `/assets/placeholders/program-${item.art}.svg`, alt: `Original illustrated ${item.title.toLowerCase()} composition`, width: 600, height: 700, fit: 'cover' },
    eligibility: 'For students of the college. Full eligibility details to be announced.',
    rules: [],
    teamSize: { min: null, max: null },
    startsAt: null,
    venue: null,
    contact: null,
    registrationUrl: null,
    registrationState: 'soon',
    published: true,
    ...item,
  }));
}

export const events = defineEvents(categories);

export const publishedEvents = () => events.filter(event => event.published).sort((a, b) => a.order - b.order);
