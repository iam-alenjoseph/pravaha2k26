import { describe, expect, it } from 'vitest';
import { registrationAction, orderedSchedule, portalCamera } from '../src/lib/policies';
import { motion } from '../src/config/motion';
import { smoothCameraProgress, revealBeforeUncover, apertureCoverage } from '../src/lib/story-motion';

describe('visual pacing requirements', () => {
  it('finishes the mascot reveal shortly after the trailing wave clears', () => {
    expect(motion.mascot.fade.end).toBeLessThanOrEqual(motion.stops.waveEnd + .01);
  });
  it('gives the final approach at least 1.1 desktop viewports of scroll', () => {
    expect((motion.stops.threshold - motion.stops.sketch) * motion.scrollVh.desktop).toBeGreaterThanOrEqual(110);
  });
  it('unmasks a substantial figure and leaves little fade after the wave', () => {
    const opacity = (p: number) => revealBeforeUncover((p - motion.mascot.fade.start) / (motion.mascot.fade.end - motion.mascot.fade.start));
    expect(opacity(.185)).toBeGreaterThan(.85);
    expect(opacity(motion.stops.waveEnd)).toBeGreaterThan(.98);
  });
  it('spreads the eye growth through the approach and settles both ends', () => {
    const points = [0, .25, .5, .75, 1].map(smoothCameraProgress);
    expect(points[4] - points[3]).toBeLessThan(.2);
    expect(points[1]).toBeGreaterThan(.08);
    expect(points[2]).toBeCloseTo(.5);
    const slope = (t: number) => smoothCameraProgress(t + .001) - smoothCameraProgress(t);
    expect(slope(.05)).toBeLessThan(slope(.4));
    expect(slope(.95)).toBeLessThan(slope(.6));
  });
});

describe('registration', () => {
  it('never links missing, closed, unsafe, or non-HTTPS forms', () => {
    for (const url of [null, '', 'javascript:alert(1)', 'http://forms.gle/example', 'https://example.com']) {
      expect(registrationAction('open', url).href).toBeNull();
    }
    expect(registrationAction('closed', 'https://forms.gle/example')).toEqual({ label: 'Registration closed', href: null });
  });
  it('opens configured Google Forms only when registration is open', () => {
    expect(registrationAction('open', 'https://forms.gle/example').href).toBe('https://forms.gle/example');
    expect(registrationAction('soon', 'https://forms.gle/example').href).toBeNull();
    expect(registrationAction('open', 'https://docs.google.com/forms/d/e/example/viewform').href).toContain('docs.google.com');
  });
});
describe('portal geometry', () => {
  it('measures visible aperture coverage rather than retaining an oversized safety target', () => {
    const contains = (x: number, y: number) => x * x / 400 + y * y / 64 <= 1;
    expect(apertureCoverage(1440,900,{x:0,y:0},contains,100)).toBeCloseTo(Math.hypot(720/20,450/8),3);
  });
  it('keeps the configured anatomical eye at the visual centre at every scale', () => {
    for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
      for (const scale of [1, 4, 60]) {
        const camera = portalCamera(viewport, { x: 0.46, y: 0.26 }, { width: 800, height: 1000 }, scale);
        expect(camera.x + 0.46 * 800 * scale).toBeCloseTo(viewport.width / 2);
        expect(camera.y + 0.26 * 1000 * scale).toBeCloseTo(viewport.height / 2);
      }
    }
  });
});
describe('schedule', () => {
  it('sorts by the absolute timestamp and omits unpublished or invalid entries', () => {
    const records = [
      { id: 'b', eventId: 'music', startsAt: '2026-11-01T20:00:00+05:30', published: true },
      { id: 'a', eventId: 'dance', startsAt: '2026-11-01T10:00:00+05:30', published: true },
      { id: 'draft', eventId: 'dance', startsAt: '2026-11-01T09:00:00+05:30', published: false },
      { id: 'bad', eventId: 'dance', startsAt: 'unknown', published: true },
    ];
    expect(orderedSchedule(records).map(x => x.id)).toEqual(['a', 'b']);
    expect(orderedSchedule([])).toEqual([]);
  });
});
