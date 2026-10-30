# Verification — PRD v1.2, 30 October 2026

This pass continues the existing template. Earlier notes are preserved in `verification-v1.0.md`; the current implementation is governed by the root v1.2 PRD.

## Result and checks

- Production build passes: TypeScript, Vite, and content-derived static route files.
- **19 Chromium browser checks pass**, covering all prior supported routes and new v1.2 behavior. Viewports: 320, 360, 390, 768, 1024, 1440px; portrait-to-landscape resize also checked.
- **12 unit/contract checks pass**, covering registration policy and markup, event overrides, eye camera geometry, schedule sorting, sponsors, portrait fit/focal position, and guest resolution.
- A separate **guest-enabled production build fixture** passes on 1440 × 900 and 390 × 844, verifying guest → Artist 1 → Artist 2 order, matching arrival target, Skip intro focus, direct Artist 1 anchor, and absence of a development-warning label. Normal production is guest-disabled.
- One independent code/visual review completed; its actionable findings were fixed and re-inspected. Two production visual passes were captured.

Browser: Chromium **140.0.7339.16**, Playwright on Windows, selected through the documented custom executable argument. Playwright's FFmpeg v1013 was installed for local recording. No runtime dependency or framework migration was introduced.

## New behavior verified

| PRD check | Evidence |
|---|---|
| A2–A4 | Immediate logo, wave, full mascot, directional line-art wipe and independent gold mask in desktop/phone checkpoints |
| A5 / A16 | Configured eye stays centred; camera and aperture share a transform; threshold enters three moving depth groups; page text is hidden until arrival |
| A6 / A20 | `/#lineup`, `/#artists`, Skip intro, Events navigation, event reload/Back and 404 pass; legacy `/#programs` redirects to `/events`; homepage has no competition cards or registration controls |
| A7–A9 | Central wave/passage/portrait/backdrop manifests and event forms; failed-image checks; content/registration contract tests retained |
| A10 | Empty sponsors hidden; configured ordering and labelled development preview covered by existing rendered-markup tests; sponsors remain last before footer |
| A11–A12 | Reduced mode has ordinary content and no long stage; preference persistence, keyboard/menu/Escape, six widths and orientation refresh pass |
| A13 | Guest default off in production; both artists unannounced; dates, venue, forms and sponsors remain unknown/empty rather than invented |
| A15 | Actual crest image moves from first scroll; 3 × 3 alpha sampling verifies full main-wave coverage at phone, landscape and desktop swap points |
| A17 | Three depth transforms differ, stay unchanged while paused, and return to the same values after a quick forward/reverse jump |
| A18 | Before/after desktop and phone WebM clips, plus wave/full-mascot/sketch/eye/threshold/passage/arrival checkpoints in `recordings/` |
| A19 | Default guest-disabled build and separate public-guest-enabled fixture both verified; the shared selector supplies the arrival and normal-flow first entry |

The arrival preview has no links or focusable controls. Actual line-up content is held out of focus while the stage is active and receives focus when the intro is skipped. No wheel/touch interception, autoplay audio or automatic camera continuation is used.

## Review fixes

- Expanded wave overlap at the swap after the new alpha-grid check found one exposed main-crest corner.
- Started every passage layer outside viewport bounds and removed internal SVG letterboxing; updated threshold frames show full-stage flow rather than a cropped floating panel.
- Matched mobile portrait opacity between the arrival copy and normal-flow composition.
- Preserved configured portrait fit and focal position; empty image paths receive a deliberate fallback.

## Comparable performance

The previous reported 4.8 seconds was **LCP**, not full load. Its original record used the same profile below, but current host speed differs. A fresh pre-change baseline was captured and preserved as `performance-before-v1.2.json`; the after result is `performance.json`.

Both use the same gzip-enabled local production server, Chromium version, cold cache, device scale 1, and mobile viewport **390 × 844**, **4× CPU slowdown**, **150ms latency**, **200,000 bytes/s download**, **93,750 bytes/s upload**. Performance runs were kept separate from the browser/recording workload.

| Metric | Fresh before | After |
|---|---:|---:|
| Simulated mobile LCP | 2,716 ms | 2,692 ms |
| Simulated mobile CLS | 0.00836 | 0.00440 |
| First-view transfer | 342,079 bytes | 350,133 bytes |
| Compressed application JS | ~136.4 KB | ~138.2 KB |
| Mobile sampled scroll p95 interval | 7.1 ms | 13.9 ms |
| Mobile sampled frames >50ms | 0 / 150 | 0 / 150 |
| Local desktop LCP | 464 ms | 488 ms |

Treat the 24ms LCP difference as **effectively unchanged**, not a meaningful improvement. The **2.5-second LCP target remains unmet by about 0.19 seconds** on this profile. Payload and CLS are within the PRD targets. The reported LCP candidate remains the SVG mascot; the template does not yet isolate visible-logo paint from SVG candidate behavior. Further startup investigation is still appropriate.

The desktop sample has three frames over 50ms; mobile has none in this synthetic run. The host display is high-refresh and this is not a real mid-range-phone measurement. Retest final raster art on physical devices before making a smoothness or production-performance claim.

## Limits and handoff

- Tathva's HTML was reachable, but its live motion was not inspected; Dhwani could not be accessed by the research tool. No reference clip was supplied. This is an original motion refinement, not a verified recreation of either reference.
- Mascot, wave, passage, silhouettes and arrival backdrops remain intentional stand-ins. The mascot identity was preserved. [Exact replacement needs](asset-replacement.md) and [before/after clips](recordings/README.md) are included.
- Real iOS Safari/Android hardware, changing mobile browser chrome, screen-reader behavior and a full WCAG audit remain outside this Chromium pass.
- No confirmed guest/artist/sponsor booking, event date/venue or form URL was fabricated. No deployment or public launch was performed.

Run `npm run dev` for the working template. Development deliberately previews the unconfirmed guest; `npm run build` / `npm run preview` show the normal public guest-disabled configuration.
