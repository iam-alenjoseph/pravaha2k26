# Targeted visual polish — 31 October 2026

Completed against PRD v1.2, retaining the current React/GSAP/native-scroll architecture and established navy, teal, gold and pencil-art direction. No runtime dependencies were added. The installed [GSAP/Awwwards skill](C:/Users/black/.codex/skills/awwwards-gsap-scrolltrigger/SKILL.md) guided composition, continuity and visual QA.

## What changed

- **Wave and mascot overlap:** the figure fades in behind the departing curved wave, reaching about 92% opacity at 18.5% story progress. The wave clears at 23%, and the final fade ends at 23.5%. The exit retains its curved silhouette and staggered layers.
- **Visible eye approach:** the approach now spans 58–82% of the story, about 130vh desktop / 110vh phone, compared with 70vh / 59vh before. A single quintic curve progressively accelerates and settles aperture growth. The art and aperture share the same anatomical eye-centered transform. Resize-time measurement of the actual convex opening replaces an excessively large safety scale; only 2% finishing overscan remains. The gold rim is still visible at 76%, and the opening covers all corners at 82% on desktop and phone.
- **Passage depth:** wide opaque foreground strokes became narrow tapered Bezier currents with transparent space and fine gold/teal edges. Far, middle and near layers have distinct scale and travel rates. The distant light remains visible, then drifts toward the first enabled scene's backdrop focus. Portrait position and scale settle before readable copy enters, and the preview matches the normal-flow scene.

The clean opening, fixed face, restrained wrists/sleeves/cloth and their pre-zoom settlement remain. Supporting pages, navigation, asset manifests and reduced-motion behavior remain intact. Public order stays logo → wave → mascot → pencil → eye passage → optional guest → Artist 1 → Artist 2 → sponsors. The tentative guest is disabled in production; empty sponsor data hides the production section. Labelled development previews exercise both optional layouts without claiming bookings or partnerships.

## Validation and visual evidence

- `npm run build`: TypeScript, Vite production bundle and static supporting routes pass.
- `npm test`: **18 unit/rendering checks pass**.
- Production browser suite: **27 checks pass**, including responsive widths 320–1440px, orientation refresh, exact eye alignment, wave coverage/curvature, fixed face and joint motion, sprite/image failure, supporting routes, navigation, reduced-motion preference, pause/reverse and handoff.
- `scripts/verify-guest.mjs`: guest-enabled production fixture passes on desktop and phone; normal production output stays guest-disabled.
- `git diff --check`: passes. Independent read-only source/visual review found no remaining critical or important issues. Its early-rim-clear finding was corrected and covered by a failing-then-passing browser regression.

The original desktop recording was inspected before edits at 6–9s and 16.8–18s. Final QA used actual native scrolling at slow and fast rates, paused midway through wave, pencil, eye and passage, reversed to the logo, and resumed to the lineup. Recorded timestamps are review aids; application animation has no playback-duration mapping.

**Eight complete recordings** cover desktop/phone normal motion, desktop/phone pause/reverse/fast scrolling, desktop/phone reduced motion, and desktop/phone labelled guest/sponsor previews. Production clips continue through both artists and the footer. Guest previews continue through the guest, both artists and sample sponsor slots. Full-resolution checkpoints, progress/state manifests and [recording links](recordings/README.md) are included.

Final recordings were decoded with native FFmpeg and visually inspected as sequential filmstrips, alongside full-size transition frames. This checked the uncovered mascot, sharp sketch and gold mask, sustained foreground rim, clear passage light, thin currents, directional exit and portrait-before-copy arrival. Chromium's in-page VP9 canvas extraction returned blank images during the initial inspection, so it was discarded in favor of native decoding. Development-preview clips include initial Vite compilation and run longer than production captures; their speed is not a product animation duration.

## Comparable mobile performance

The fresh before measurement is [performance-before-polish.json](performance-before-polish.json). The unchanged diagnostic used the same gzip loopback production server, Chromium **140.0.7339.16**, cold cache, **390×844**, device scale **1**, **4× CPU**, **150ms RTT**, **200,000 B/s down** and **93,750 B/s up**. Final samples ran after recording and decoding stopped.

| Metric | Fresh before (1 run) | Final after (median of 3) |
|---|---:|---:|
| Mobile LCP | 3,660 ms | 2,312 ms |
| Mobile LCP range | — | 2,296–2,328 ms |
| Mobile CLS | 0 | 0 |
| First-view transfer | 354,741 bytes | 355,151 bytes |
| Mobile sampled scroll p95 interval | 34.8 ms | 20.9 ms |
| Mobile sampled frames >50ms | 1 / 150 | 0 / 150 |
| Local desktop LCP | 404 ms | 228 ms |

The responsible LCP element in every before/after sample is **`img.hero-logo`**, `/assets/identity/pravaha-logo.jpeg`. Raw final runs: [run 1](performance-polish-run-1.json), [run 2](performance-polish-run-2.json), [run 3 / latest](performance.json). Each has no page errors or failed requests.

These final samples fall below the PRD's 2.5s LCP target under this lab profile. The logo and startup loading strategy were unchanged, so the full timing difference cannot be attributed to the visual polish; host/run variability matters, and a single before sample limits causal comparison. Desktop samples still contain 3–4 intervals over 50ms. This is not a guaranteed 60fps or production-hosting result.

## Remaining assets and limits

- Supply a transparent final logo; aligned colour/pencil/mask/face-detail mascot art and eye calibration; optional separated arm/cloth symbols for final-art articulation; approved wave, passage and arrival artwork; two confirmed artist portraits/names; confirmed optional guest content and sponsor logos. [Exact canvas, focus and replacement requirements](asset-replacement.md) are documented. Existing placeholders remain usable.
- Physical iOS Safari/Android devices, mobile browser chrome and final raster-art performance still need validation. This pass used Chromium desktop and phone emulation, plus media-query/manual reduced motion. It is not a full accessibility audit.
- No new booking, sponsor relationship, event fact or registration URL was invented. No deployment or public release was performed.
