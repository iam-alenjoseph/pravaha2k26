import type { GuestRecord, LineupRecord } from '../types';
import { site } from '../config/site';

export const guest: GuestRecord = {
  id: 'special-guest', role: 'guest', enabled: false, previewInDevelopment: true,
  name: null, announcementLabel: 'A special presence.', performanceType: null,
  copy: 'Something to look forward to. Details will be shared once confirmed.',
  state: 'unannounced', order: 0, treatment: 'guest', focalPosition: '50% 35%',
  backdrop: site.assets.lineupBackdrops.guest,
};

// Exactly two initial presentation slots. Confirm a name/state before publishing a booking.
export const artists: [LineupRecord, LineupRecord] = [
  { id: 'artist-1', role: 'artist', name: null, announcementLabel: 'Artist announcement coming soon', performanceType: null, copy: 'A room full of strangers. A feeling we share.', state: 'unannounced', order: 1, treatment: 'teal', focalPosition: '50% 35%', backdrop: site.assets.lineupBackdrops.teal },
  { id: 'artist-2', role: 'artist', name: null, announcementLabel: 'Artist announcement coming soon', performanceType: null, copy: 'Stay for the moments that stay with you.', state: 'unannounced', order: 2, treatment: 'gold', focalPosition: '50% 35%', backdrop: site.assets.lineupBackdrops.gold },
];

export function resolveLineup(guestRecord: GuestRecord, artistRecords: readonly [LineupRecord, LineupRecord], development: boolean): LineupRecord[] {
  const showGuest = guestRecord.enabled || (development && guestRecord.previewInDevelopment);
  const orderedArtists = [...artistRecords].sort((a,b) => a.order - b.order);
  return showGuest ? [{ ...guestRecord, previewOnly: !guestRecord.enabled }, ...orderedArtists] : orderedArtists;
}
