import type { GuestRecord, LineupRecord } from '../types';
import { site } from '../config/site';

export const guest: GuestRecord = {
  id: 'special-guest',
  role: 'guest',
  enabled: true,
  previewInDevelopment: true,
  name: null,
  announcementLabel: 'LIVE CONCERT',
  performanceType: 'PROSHOW · SPECIAL GUEST',
  copy: 'A special guest appearance at Pravaha 2K26. The name remains a secret for now.',
  state: 'unannounced',
  order: 0,
  treatment: 'guest',
  focalPosition: '50% 40%',
  backdrop: site.assets.lineupBackdrops.guest,
  image: {
    path: '/assets/fest/hiddenartist-cropped.png',
    alt: 'Pravaha Special Guest',
    width: 860,
    height: 990,
    fit: 'contain' as const,
  },
};

// Exactly two initial presentation slots. Confirm a name/state before publishing a booking.
export const artists: [LineupRecord, LineupRecord] = [
  {
    id: 'artist-1',
    role: 'artist',
    name: null,
    announcementLabel: 'LIVE CONCERT · DAY 01',
    performanceType: 'PROSHOW · ARTIST 01',
    copy: 'The first artist for Pravaha 2K26. Announcement coming soon.',
    state: 'unannounced',
    order: 1,
    treatment: 'teal',
    focalPosition: '50% 35%',
    backdrop: site.assets.lineupBackdrops.teal,
    image: {
      path: '/assets/fest/artist1.png',
      alt: 'Pravaha Featured Artist 01',
      width: 600,
      height: 724,
      fit: 'contain' as const,
    },
  },
  {
    id: 'artist-2',
    role: 'artist',
    name: null,
    announcementLabel: 'EDM NIGHT & CONCERT · DAY 02',
    performanceType: 'PROSHOW · ARTIST 02',
    copy: 'The final artist of Pravaha 2K26. Announcement coming soon.',
    state: 'unannounced',
    order: 2,
    treatment: 'gold',
    focalPosition: '50% 35%',
    backdrop: site.assets.lineupBackdrops.gold,
    image: {
      path: '/assets/fest/artist2.png',
      alt: 'Pravaha Featured Artist 02',
      width: 600,
      height: 724,
      fit: 'contain' as const,
    },
  },
];

export function resolveLineup(guestRecord: GuestRecord, artistRecords: readonly [LineupRecord, LineupRecord], development: boolean): LineupRecord[] {
  const showGuest = guestRecord.enabled || (development && guestRecord.previewInDevelopment);
  const orderedArtists = [...artistRecords].sort((a,b) => a.order - b.order);
  return showGuest ? [{ ...guestRecord, previewOnly: !guestRecord.enabled }, ...orderedArtists] : orderedArtists;
}
