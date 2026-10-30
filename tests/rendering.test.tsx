import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Registration } from '../src/components/Shared';
import { Sponsors } from '../src/components/Sponsors';
import { defineEvents, events } from '../src/data/events';
import { guest, artists, resolveLineup } from '../src/data/lineup';
import { LineupPresentation } from '../src/components/Lineup';
import { compatibleMascotRig } from '../src/lib/mascot';
import { site } from '../src/config/site';

describe('editable event contract', () => {
  it('preserves individual art, form, timing, rules and publication overrides', () => {
    const input = { ...events[0], registrationUrl: 'https://forms.gle/example', registrationState: 'open' as const, startsAt: '2027-01-01T10:00:00+05:30', rules: ['Confirmed example rule'], published: false, image: { path: '/custom.svg', alt: 'Custom', width: 900, height: 1000 } };
    expect(defineEvents([input])[0]).toEqual(input);
  });
  it('renders a safe external link for an open form and text for closed or unset forms', () => {
    const open = renderToStaticMarkup(<Registration event={{ ...events[0], registrationUrl: 'https://forms.gle/example', registrationState: 'open' }} />);
    expect(open).toContain('href="https://forms.gle/example"');
    expect(open).toContain('target="_blank"');
    expect(open).toContain('rel="noopener noreferrer"');
    expect(open).toContain('Google Form');
    for (const registrationState of ['soon', 'closed'] as const) {
      const html = renderToStaticMarkup(<Registration event={{ ...events[0], registrationUrl: 'https://forms.gle/example', registrationState }} />);
      expect(html).not.toContain('<a');
    }
  });
});
describe('conditional sponsors', () => {
  it('hides an empty section and shows a clearly labelled layout preview when requested', () => {
    expect(renderToStaticMarkup(<Sponsors records={[]} />)).toBe('');
    expect(renderToStaticMarkup(<Sponsors records={[]} preview />)).toContain('DEVELOPMENT PREVIEW');
  });
  it('publishes configured sponsors in order without requiring a logo or website', () => {
    const html = renderToStaticMarkup(<Sponsors records={[{ id: 'second', name: 'Second example', order: 2 }, { id: 'first', name: 'First example', order: 1, website: 'https://example.com' }]} />);
    expect(html).toContain('id="sponsors"');
    expect(html.indexOf('First example')).toBeLessThan(html.indexOf('Second example'));
    expect(html).toContain('href="https://example.com/"');
    expect(html).not.toContain('Sample logo slot');
  });
});

describe('homepage lineup selection', () => {
  it('accepts configured portrait dimensions, fit, and focal position', () => {
    const html = renderToStaticMarkup(<LineupPresentation entry={{ ...artists[0], focalPosition: '65% 20%', image: { path: '/fixture-portrait.webp', alt: 'Test portrait', width: 900, height: 1200, fit: 'cover' } }} />);
    expect(html).toContain('src="/fixture-portrait.webp"');
    expect(html).toContain('object-fit:cover');
    expect(html).toContain('object-position:65% 20%');
  });
  it('keeps an uncertain guest off production and resolves exactly two artists in order', () => {
    expect(resolveLineup(guest, artists, false).map(entry => entry.id)).toEqual(['artist-1', 'artist-2']);
  });
  it('uses the same guest first for approved production and clearly labelled development previews', () => {
    const preview = resolveLineup({ ...guest, enabled: false, previewInDevelopment: true }, artists, true);
    expect(preview.map(entry => entry.role)).toEqual(['guest', 'artist', 'artist']);
    expect(renderToStaticMarkup(<LineupPresentation entry={preview[0]} />)).toContain('GUEST APPEARANCE UNCONFIRMED');
    const published = resolveLineup({ ...guest, enabled: true }, artists, false);
    expect(published[0].id).toBe(guest.id);
    expect(published[0].previewOnly).toBe(false);
    expect(renderToStaticMarkup(<LineupPresentation entry={published[0]} />)).not.toContain('DEVELOPMENT PREVIEW');
  });
  it('removes the guest without a placeholder record or residual first target', () => {
    expect(resolveLineup({ ...guest, enabled: false, previewInDevelopment: false }, artists, true)[0].id).toBe('artist-1');
  });
});

describe('mascot art replacement', () => {
  it('uses the matching rig but never overrides different mobile or replacement artwork', () => {
    const art = site.assets.mascot;
    expect(compatibleMascotRig(art, false)).toBe(art.rig);
    const mobile = { ...art, colour: { ...art.colour, responsive: { mobile: '/custom-mobile.svg' } } };
    expect(compatibleMascotRig(mobile, true)).toBeNull();
    expect(compatibleMascotRig(mobile, false)).toBe(art.rig);
    expect(compatibleMascotRig({ ...art, colour: { ...art.colour, path: '/final-mascot.svg' } }, false)).toBeNull();
  });
});
