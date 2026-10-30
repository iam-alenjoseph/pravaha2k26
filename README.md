# Pravaha 2k26

A responsive, configuration-driven festival template built from [the PRD](Pravaha_2k26_Website_PRD.md). React, TypeScript, Vite, GSAP ScrollTrigger, native scrolling. Final artwork and event announcements can arrive later.

## Run locally

Requires Node.js 22.12+ and npm. Dependencies are pinned in `package.json` and `package-lock.json`.

```sh
npm ci
npm run dev
```

Open the printed local URL (normally http://127.0.0.1:5173).

```sh
npm test
npm run build
npm run preview
```

`dist/` is the production output. The build emits physical entrypoints for `/events`, `/schedule`, and every published event slug, plus `404.html`. Hosts that support SPA rewrites can use the supplied `_redirects`; configure other hosts to serve `index.html` for unknown application routes. Public deployment and domain setup are deliberately separate.

## What is built

- Logo → sliding illustrated wave → mascot → directional pencil reveal → accelerated masked-eye approach → layered flow passage → line-up arrival.
- Reversible GSAP progression in a single native-scroll sticky stage, responsive geometry and refresh cleanup.
- Dance, Music, and Fashion Show listing/detail templates; configurable free Google Forms registration.
- Optional guest (production off), then two separate artist compositions, then conditional sponsors. Honest artist and schedule announcement states.
- Keyboard skip navigation, Skip intro, direct anchors, mobile menu, 404, system reduced motion, and a persistent Reduce motion toggle in the footer.
- Original replaceable SVG wave/passage layers, preserved mascot stand-in, and deliberate failed-image fallbacks. Competition cards and registration live on supporting pages only.

The only supplied artwork was the root JPEG logo. The mascot and program art are original **temporary SVG stand-ins**, not the organiser’s final character. The pencil asset is genuine aligned line art with hatching, not a grayscale filter. See [asset replacement](docs/asset-replacement.md).

## Edit content

| File | Edit here |
|---|---|
| `src/config/site.ts` | Logo/asset manifest, nullable date/college/venue/contact/social links, theme, sponsor preview |
| `src/config/motion.ts` | Stage timings, wave direction/travel/overscan, mobile/desktop composition, eye geometry, passage depth rates, arrival pacing |
| `src/data/events.ts` | Categories, art, rules, team limits, eligibility, venue/time/contact, registration and publication |
| `src/data/lineup.ts` | Optional guest, exactly two ordered artists, portrait/backdrop slots, focal positions and announcement states |
| `src/data/sponsors.ts` | Real confirmed sponsors, optional logos/websites/tiers/order |
| `src/data/schedule.ts` | Published schedule records referencing event IDs |

Each event’s record accepts overrides for all event fields. Defaults fill only missing fields. Registration states are `soon`, `open`, `closed`. To open an event, add `registrationState: 'open'` and `registrationUrl: 'https://forms.gle/…'` to that event record. HTTPS `forms.gle` and `docs.google.com/forms/…` URLs are supported. Unknown, invalid, missing, or closed forms produce a non-clickable state. Website code never receives submissions.

Artists: set `state: 'announced'`, a confirmed name, and optionally an `image`; `focalPosition` and asset `fit` control framing. Unannounced slots use “Artist announcement coming soon”. The guest has independent `enabled`, `previewInDevelopment`, and announcement state fields. Production defaults to **guest disabled**; `npm run dev` shows a clearly labelled unconfirmed guest preview. Enable the public guest slot only when the organiser approves its presence. The shared selector powers the arrival and actual section, so disabling it goes directly to Artist 1.

Navigation: `/#lineup` skips to the first enabled presentation, `/#artists` reaches Artist 1, and Events opens `/events`. Legacy `/#programs` redirects to `/events`. Sponsors are empty by default. Add a real record and the final section appears automatically; `site.preview.sponsors = true` exposes labelled sample slots **only in development**.

Example schedule dataset, **illustrative only — not official event information**:

```ts
export const schedule: ScheduleRecord[] = [
  {
    id: 'example-dance-slot',
    eventId: 'dance',
    startsAt: '2027-01-01T10:00:00+05:30',
    endsAt: '2027-01-01T11:00:00+05:30',
    venue: 'Example venue — replace before publication',
    published: true,
  },
];
```

Dates are grouped and times displayed in `Asia/Kolkata`. Drafts and invalid timestamps are omitted. Never add unconfirmed sample times to production data.

## Browser verification

```sh
npx playwright install chromium
npm run build
npm run test:browser
```

To use an existing Chromium installation instead of downloading one:

```sh
node scripts/test-browser.mjs --chromium "ABSOLUTE_PATH_TO_CHROME"
```

The tests launch the production preview on port 4173, capture selected screenshots in `docs/screenshots/`, and retain failure traces under ignored `test-results/`. [Verification notes](docs/verification.md) distinguish browser checks from real-device and production checks.

The optional guest-enabled production fixture can be checked without changing source or the production `dist/`:

```sh
node scripts/verify-guest.mjs "ABSOLUTE_PATH_TO_CHROME"
```

Before/after scroll clips and intermediate frames are in [`docs/recordings/`](docs/recordings/README.md). To capture a new version after building, run `node scripts/record-story.mjs after "ABSOLUTE_PATH_TO_CHROME"`. Playwright video recording needs its FFmpeg binary (`npx playwright install ffmpeg`).

For repeatable local payload/LCP/CLS and scroll-frame diagnostics after a build:

```sh
node scripts/measure-performance.mjs "ABSOLUTE_PATH_TO_CHROME"
```

This starts and stops its own gzip-enabled loopback server and writes `docs/performance.json`. It is a laboratory diagnostic, not a claim about production hosting or real phone performance.

## Fonts and references

Manrope Variable and Cormorant Garamond (500 regular/italic), self-hosted through Fontsource; both use the SIL Open Font License. License copies ship under `public/licenses/`.

Motion implementation follows [GSAP ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/). The installed [GSAP skill](https://github.com/menervatripolska/awwwards-gsap-scrolltrigger-skill) and consulted [juliobsz Awwwards guidance](https://github.com/juliobsz/skills/blob/main/awwwards/SKILL.md) informed continuity, composition and feedback. The latter was consulted, not installed. Neither adds runtime dependencies. Tathva's HTML was accessible; its live animation was not independently inspected. Dhwani remained inaccessible. No reference recording or mascot sheet was present; this is an original refinement of the existing mascot and brand.
