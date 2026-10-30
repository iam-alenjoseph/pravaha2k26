export const motion = {
  stops: { logo: 0.04, waveCover: 0.115, waveEnd: 0.23, mascot: 0.40, sketch: 0.64, threshold: 0.78, passage: 0.93, arrival: 0.965, handoff: 1 },
  scrollVh: { desktop: 500, mobile: 420 },
  composition: {
    desktop: { x: 0.56, y: 0.53, scale: 0.86 },
    mobile: { x: 0.50, y: 0.57, scale: 0.94 },
  },
  wave: {
    direction: 'right-to-left' as 'right-to-left' | 'left-to-right',
    overscan: { x: 3.2, y: 1.5 },
    travel: { start: 1.06, cover: -1.86, end: -3.6 },
    rearLead: 0.11,
    edgeLead: 0.005,
  },
  camera: { faceZoom: 2.8, acceleration: 2.5, coverage: 1.12 },
  passage: {
    far: { startScale: 1.06, endScale: 1.18, shiftX: -0.015, shiftY: -0.015 },
    middle: { startScale: 1.16, endScale: 3.2, shiftX: 0.08, shiftY: -0.08 },
    near: { startScale: 1.25, endScale: 6.5, shiftX: -0.2, shiftY: 0.14 },
    mobileDepthFactor: 0.82,
    arrivalPortrait: 0.955,
    arrivalText: 0.973,
  },
  lineup: { portraitOffset: 42, textOffset: 24 },
  eye: {
    centre: { x: 0.45625, y: 0.262 },
    aperture: 'M 342 262 Q 365 244 389 262 Q 366 280 342 262 Z',
    // Conservative inner ellipse radii, in shared design-canvas units.
    innerRadius: { x: 19, y: 7 },
  },
  sketchBackground: 'ivory' as 'ivory' | 'dark',
  reducedMotion: { storageKey: 'pravaha-reduce-motion', removePin: true },
};
