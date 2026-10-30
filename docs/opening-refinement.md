# Opening refinement — 30 October 2026

Requested changes: remove filler text, give the wave a natural exit, fade in the mascot, and add hand movement.

- Opening now uses the logo, edition, Events link, Scroll cue and Skip intro. Removed promotional top/side labels, tagline, manifesto and extra decorative badges.
- Removed the mascot's text overlay and the homepage's generic poetic artist headings/paragraphs. Artist names or clear slot labels and honest announcement states remain. The footer keeps its identity and useful information.
- Wave artwork now has leading and trailing curls, with aligned rear/crest/foam layers. The dense middle still covers the logo swap. The new exit boundary is visibly curved at phone and desktop widths.
- Mascot opacity rises progressively as the trailing current clears. Its wrists, sleeves and cloth move using one matching colour/sketch sprite. Head, mask and eye anchor stay fixed; gestures settle before the sketch zoom.
- Idle movement pauses in hidden tabs and outside the introduction. Reduced motion stays static and skips the sprite preload. Missing sprite or mismatched replacement/mobile artwork falls back to the complete normal artwork.
- Deep zoom uses the aligned full-art images once the hands have settled, reducing the rendering cost of magnified articulated parts.
- Kept the pulled change that omits the homepage header, plus supporting events, registration, schedule, line-up, sponsors and navigation behavior.

Watch the [desktop](recordings/refinement/desktop.webm) or [phone](recordings/refinement/phone.webm) clip. Artwork remains a replaceable SVG stand-in; a final dynamic mascot needs matching separated parts. [Asset guide](asset-replacement.md) includes current canvas sizes, wave safe areas and sprite/joint configuration.

Validation covers full-frame wave coverage, a curved exit, progressive opacity, moving wrists with a stationary camera, settling before sketch, failed-sprite fallback, reduced-motion Events access, existing routes, resize, reverse scrolling and line-up handoff. Production screenshots were reviewed on phone and desktop. See the current build/test output and performance data for measured results; physical iOS/Android testing remains outstanding.

Production build, **13 unit/contract tests**, and **24 Chromium browser tests** pass. Independent visual/source review found no outstanding actionable issues after fixing mobile-art rig selection and keeping its joint registry current through resize/fallback. Performance output is saved in `performance.json`; the preceding v1.2 run is preserved as `performance-before-refinement.json` and is historical, not a fresh same-host baseline.

Latest cold-cache gzip measurement (Chromium 140): first-view transfer **354,741 bytes**, application JavaScript **138.5 KB gzip**. Desktop LCP **376ms**; simulated mobile LCP **3,692ms**, CLS **0**. The mobile profile remains 390 × 844, 4× CPU slowdown, 150ms latency and 200,000 bytes/s download. The measured LCP candidate is now the visible hero logo. The **2.5s mobile loading target remains unmet**; do not treat the historical measurement of a different SVG candidate as a clean before/after comparison.

After moving articulated SVG rendering out of the deep zoom, the latest synthetic scroll sample has **2/150 mobile** and **8/150 desktop** frames over 50ms. This remains a laboratory sample with occasional long frames, not certification of smoothness on real phones. Physical-device performance and final artwork still need a further pass before launch. No console errors or failed requests occurred in this measurement.
