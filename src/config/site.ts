import type { Asset, MascotAssets } from '../types';

const placeholder = (name: string, alt: string): Asset => ({ path: `/assets/placeholders/${name}.svg`, alt, width: 800, height: 1000, fit: 'contain' });
const placeholderMascot: MascotAssets = {
  canvas: { width: 800, height: 1000 },
  colour: placeholder('mascot-colour', 'Original template mascot in a flowing teal coat'),
  sketch: placeholder('mascot-sketch', 'Aligned pencil-line version of the template mascot'),
  mask: placeholder('mascot-mask', 'Separate golden mask'),
};
const flow: Asset = { path: '/assets/placeholders/flow.svg', alt: '', width: 1600, height: 1000 };

export const site = {
  name: 'Pravaha',
  edition: '2k26',
  tagline: 'Find your flow.',
  collegeName: null as string | null,
  date: null as string | null,
  venue: null as string | null,
  email: null as string | null,
  socials: [] as { label: string; url: string }[],
  theme: { midnight: '#071322', deepBlue: '#14263E', teal: '#2B7180', gold: '#E9B85F', ivory: '#FFF2D9', graphite: '#34383D' },
  assets: {
    logo: { path: '/assets/identity/pravaha-logo.jpeg', alt: 'Pravaha — gold and teal wordmark and emblem', width: 1254, height: 1254, fit: 'contain' } satisfies Asset,
    logoFallback: { path: '/assets/placeholders/logo.svg', alt: 'Pravaha', width: 800, height: 500 } satisfies Asset,
    flow,
    flowFallback: flow,
    mascot: { ...placeholderMascot } as MascotAssets,
    mascotFallback: placeholderMascot,
  },
  preview: { sponsors: false },
};
