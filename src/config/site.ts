import type { Asset, MascotAssets } from '../types';

const placeholder = (name: string, alt: string): Asset => ({ path: `/assets/placeholders/${name}.svg`, alt, width: 800, height: 1000, fit: 'contain' });
const placeholderMascot: MascotAssets = {
  canvas: { width: 800, height: 1000 },
  colour: placeholder('mascot-colour', 'Original template mascot in a flowing teal coat'),
  sketch: placeholder('mascot-sketch', 'Aligned pencil-line version of the template mascot'),
  mask: placeholder('mascot-mask', 'Separate golden mask'),
  rig: {
    sprite: placeholder('mascot-rig', 'Layered mascot artwork'),
    sourceColourPath: '/assets/placeholders/mascot-colour.svg',
    sourceSketchPath: '/assets/placeholders/mascot-sketch.svg',
  },
};
const flow: Asset = { path: '/assets/fest/maincover.png', alt: 'Pravaha festival realm', width: 1086, height: 1448, fit: 'cover' as const };
const flowFallback: Asset = { path: '/assets/placeholders/flow.svg', alt: '', width: 1600, height: 1000, fit: 'cover' as const };
const sceneAsset = (name: string, width = 1600, height = 1000): Asset => ({ path: `/assets/placeholders/${name}.svg`, alt: '', width, height, fit: 'cover' as const });
const wave = { rear: sceneAsset('wave-rear', 2400, 1200), crest: sceneAsset('wave-crest', 2400, 1200), edge: sceneAsset('wave-edge', 2400, 1200) };
const passage = {
  far: { path: '/assets/fest/cover.png', alt: 'Festival palace architecture', width: 1086, height: 1335, fit: 'cover' as const },
  middle: { path: '/assets/fest/clouds2.png', alt: 'Atmospheric festival clouds', width: 1536, height: 1024, fit: 'cover' as const },
  near: { path: '/assets/fest/clouds1.png', alt: 'Floating cloud curtain', width: 2172, height: 724, fit: 'cover' as const },
};
const passageFallback = { far: sceneAsset('passage-far'), middle: sceneAsset('passage-middle'), near: sceneAsset('passage-near') };

export const site = {
  name: 'Pravaha',
  edition: '2k26',
  tagline: 'The Grand Cultural Carnival',
  collegeName: null as string | null,
  date: null as string | null,
  venue: null as string | null,
  email: null as string | null,
  socials: [] as { label: string; url: string }[],
  theme: { midnight: '#071322', deepBlue: '#14263E', teal: '#2B7180', gold: '#E9B85F', ivory: '#FFF2D9', graphite: '#34383D' },
  assets: {
    logo: { path: '/assets/identity/pravaha-logo.jpeg', alt: 'Pravaha — gold and teal wordmark and emblem', width: 1536, height: 1024, fit: 'contain' as const } satisfies Asset,
    logoFallback: { path: '/assets/placeholders/logo.svg', alt: 'Pravaha', width: 800, height: 500, fit: 'contain' as const } satisfies Asset,
    flow,
    flowFallback,
    mascot: { ...placeholderMascot } as MascotAssets,
    mascotFallback: placeholderMascot,
    wave,
    waveFallback: wave,
    passage,
    passageFallback,
    lineupBackdrops: {
      teal: { path: '/assets/fest/maincover.png', alt: 'Pravaha festival realm', width: 1086, height: 1448, fit: 'cover' as const } satisfies Asset,
      gold: { path: '/assets/fest/cover.png', alt: 'Pravaha celestial architecture', width: 1086, height: 1335, fit: 'cover' as const } satisfies Asset,
      guest: { path: '/assets/fest/maincover.png', alt: 'Pravaha grand festival stage', width: 1086, height: 1448, fit: 'cover' as const } satisfies Asset,
    },
  },
  preview: { sponsors: false },
};
