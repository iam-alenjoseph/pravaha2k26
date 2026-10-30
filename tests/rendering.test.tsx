import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Registration } from '../src/components/Shared';
import { Sponsors } from '../src/components/Sponsors';
import { defineEvents, events } from '../src/data/events';

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
