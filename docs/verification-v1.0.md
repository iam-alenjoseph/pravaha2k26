# Verification — 30 October 2026

## Verified result

- `npm run build`: TypeScript check, Vite production output, and data-derived static route entrypoints pass.
- `npm test`: **8 tests pass** across registration policy/rendering, per-event configuration overrides, portal camera geometry, schedule filtering/order, and conditional sponsors.
- Browser suite: **14 tests pass** using Playwright with Chromium **140.0.7339.16** on Windows. The environment's existing Chromium was selected with `node scripts/test-browser.mjs --chromium <absolute-path>`; the matching new Playwright browser download was unavailable during QA.
- Responsive inspections: 320, 360, 390, 768, 1024, and 1440 CSS-pixel widths; 844px mobile / 900px desktop viewport heights. No horizontal page overflow in the checked opening, programs, artists, and footer states.
- Additional orientation check: 390 × 844 → 844 × 390 keeps art/aperture transforms aligned.

## Functional evidence

| PRD checks | Evidence |
|---|---|
| A1 | Pinned dependency lockfile, successful build, README install/run commands |
| A2 | Desktop/mobile opening screenshots; identity visible immediately, no loading screen |
| A3–A5 | Browser tests progress through mascot, sketch and portal, reverse to mascot, and compare shared art/aperture transforms; screenshots capture aligned line art and eye preview |
| A6 | Skip intro focuses the visible programs section at the correct offset; direct `/#programs`, `/#artists`, event reload, browser Back, and unknown routes tested |
| A7–A8 | Central manifest, mobile/detail variants, failed-image tests including both failed logo sources; camera calculation tested across sizes/scales; alternate calibration documented in the replacement guide |
| A9 | Policy and rendered-action tests cover valid Google Forms, missing/unsafe URLs, open/soon/closed states and protected external links |
| A10 | Empty section hidden in browser; configured ordered sponsors and explicitly labelled sample slots tested through rendered markup; preview is gated by development mode |
| A11 | System preference and manual persisted toggle tested; reduced mode has no long story wrapper and retains normal content |
| A12 | Six-width browser checks, mobile menu/Escape/focus test, portrait-to-landscape test, desktop/mobile screenshots |
| A13 | Empty schedule, artist announcement, null dates/venues/forms/contacts, empty production sponsors; no fabricated bookings or partnerships |
| A14 | Build results, browser profile and screenshots recorded; repeatable performance data in `performance.json`; remaining limits below |

## Review fixes

Independent code review and failing browser checks identified two substantive motion/navigation defects: refresh could reset the story's rendered progress, and scroll padding could leave Skip intro before the handoff. Rendering now uses ScrollTrigger's actual progress, with an explicit fixed 0→1 playhead; programs navigation uses its exact document offset. Browser regression checks pass after the changes.

Review also caught per-event overrides being overwritten, unused responsive asset paths, fragile regex-based route exports, and an unbounded double-image failure retry. These were corrected. Event overrides and bounded image fallback behavior have focused regression coverage.

## Loading and rendering measurements

`performance.json` contains the latest raw results from a **gzip-enabled local production build**, cold cache, device scale factor 1. Profiles:

- Desktop: 1440 × 900, no network/CPU throttling.
- Simulated mobile: 390 × 844, touch/mobile emulation, 4× CPU slowdown, 150ms latency, 200,000 bytes/s download and 93,750 bytes/s upload.

Initial measured transfer is approximately **342 KB**, below the 1.5 MB placeholder target. The application JavaScript is approximately **136.4 KB gzip**, below the 250 KB target. CLS is below **0.01** in both measured profiles.

**The 2.5-second LCP target is not met on the simulated slow-mobile profile.** Initial diagnostic runs were around 4.8–5.2 seconds, versus about 1.2–1.3 seconds on local desktop. Use the raw JSON for the latest value. The reported LCP candidate is an SVG mascot image, so further investigation should separate actual first-visible logo timing from SVG candidate behavior before optimizing or making a production claim.

The script also samples 150 frames while scrolling through the whole intro. There are occasional long frames on the desktop/browser host; this is not proof of smoothness on a mid-range phone. Final artwork needs its own real-device performance pass.

## Remaining limits

- Final isolated mascot, aligned pencil/mask layers, transparent logo, program art, performers, sponsors, rules, venue/date and form links are not supplied. The template deliberately uses replaceable stand-ins and announcement states.
- The Dhwani website could not be fetched; no recording or mascot character sheet was present. No claim is made to have reproduced its choreography.
- Chromium only: real iOS Safari, Android devices, dynamic browser chrome and physical touch behavior remain to be checked.
- Keyboard and focus behavior received focused checks; this is not a full screen-reader or WCAG conformance audit.
- No production deployment, domain, analytics or real participant submission was created. Static hosting must use the emitted route entrypoints and/or SPA fallback.
- Placeholder performance numbers do not certify final artwork or production hosting.

See `screenshots/desktop-opening.png`, `mobile-opening.png`, `desktop-mascot.png`, `desktop-sketch.png`, `desktop-portal.png`, `mobile-portal.png`, and desktop/mobile programs screenshots for visual evidence.
