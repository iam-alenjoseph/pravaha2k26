export const motion = {
  stops: { logo: 0.15, flow: 0.30, mascot: 0.45, sketch: 0.70, portal: 0.95, handoff: 1 },
  scrollVh: { desktop: 500, mobile: 420 },
  composition: {
    desktop: { x: 0.56, y: 0.53, scale: 0.86 },
    mobile: { x: 0.50, y: 0.57, scale: 0.94 },
  },
  eye: {
    centre: { x: 0.45625, y: 0.262 },
    aperture: 'M 342 262 Q 365 244 389 262 Q 366 280 342 262 Z',
    // Conservative inner ellipse radii, in shared design-canvas units.
    innerRadius: { x: 19, y: 7 },
  },
  sketchBackground: 'ivory' as 'ivory' | 'dark',
  reducedMotion: { storageKey: 'pravaha-reduce-motion', removePin: true },
};
