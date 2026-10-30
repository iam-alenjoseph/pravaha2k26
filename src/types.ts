export interface Asset {
  path: string;
  alt: string;
  width: number;
  height: number;
  fit?: 'cover' | 'contain';
  position?: string;
  responsive?: { mobile?: string; detail?: string };
}
export interface MascotAssets {
  canvas: { width: number; height: number };
  colour: Asset;
  sketch: Asset;
  mask: Asset;
  faceDetail?: Asset;
}
export type RegistrationState = 'soon' | 'open' | 'closed';
export interface EventRecord {
  id: string;
  slug: string;
  title: string;
  category: string;
  kicker: string;
  description: string;
  image?: Asset;
  eligibility: string;
  rules: string[];
  teamSize: { min: number | null; max: number | null };
  startsAt: string | null;
  venue: string | null;
  contact: { name: string; email?: string; phone?: string } | null;
  registrationUrl: string | null;
  registrationState: RegistrationState;
  order: number;
  published: boolean;
  accent: string;
  art: 'dance' | 'music' | 'fashion';
}
export interface LineupRecord {
  id: string;
  role: 'guest' | 'artist';
  name: string | null;
  announcementLabel: string;
  performanceType: string | null;
  copy: string | null;
  image?: Asset;
  backdrop?: Asset;
  focalPosition?: string;
  state: 'unannounced' | 'announced';
  order: number;
  treatment: 'teal' | 'gold' | 'guest';
  previewOnly?: boolean;
}
export interface GuestRecord extends LineupRecord {
  role: 'guest';
  enabled: boolean;
  previewInDevelopment: boolean;
}
export interface SponsorRecord {
  id: string;
  name: string;
  logo?: Asset;
  website?: string;
  tier?: string;
  order: number;
}
export interface ScheduleRecord {
  id: string;
  eventId: string;
  startsAt: string;
  endsAt?: string;
  venue?: string;
  published: boolean;
}
