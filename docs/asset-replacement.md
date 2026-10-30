# Artwork and content replacement

All artwork is editable through `src/config/site.ts` or the content records. Components should not need edits for routine replacement. Keep shipped fallback SVGs in `public/assets/placeholders/`.

## v1.2 homepage and motion slots

The homepage is now optional special guest → Artist 1 → Artist 2 → sponsors. Event art and all competition/registration content remain on `/events` and event detail routes. Line-up records live in `src/data/lineup.ts`; the old `artists.ts` has been replaced.

The guest has independent `enabled` (public), `previewInDevelopment`, and `state` fields. Defaults are public off / development preview on / unannounced. A development preview always says the appearance is unconfirmed. Two artists always follow, with honest announcement labels until confirmed. Disabling the guest removes its section and automatically changes the eye arrival and Skip intro destination to Artist 1. `/#lineup` reaches the first resolved scene; `/#artists` reaches Artist 1 in either configuration.

Each record accepts `image`, optional `backdrop`, `focalPosition`, nullable performance/appearance type, and optional short copy. The same presentation component renders the noninteractive arrival copy and the real section. Keep the first scene's backdrop in its record; do not create a second, independently positioned arrival image. Default backdrop assets are in `site.assets.lineupBackdrops`; a failed backdrop falls back to the branded CSS composition. Portrait fit and crop position are respected; source images are lazy-loaded. Preview portraits are only activated near arrival.

### Sliding wave artwork

`site.assets.wave` contains `rear`, `crest`, and `edge` image records, with separate centrally configured fallbacks. The stand-ins are original hand-shaped SVG crests on an **1800 × 1200** canvas. Their dense body extends to the right; the left crest/curl is the transition boundary. The important crest lies roughly in the left **250–1100** design units, with the right body continuously filled across the full height. Keep generous bleed beyond all edges.

The default right-to-left composition overscans the viewport by **3.2× horizontally / 1.5× vertically**. At the swap, the main image is translated **−1.86 viewport widths**, making its body cover even corner samples on phone and landscape. Rear/edge layers travel at staggered offsets. `motion.wave` controls direction, overscan, leading offsets, and start/cover/end positions. Left-to-right mirrors the full composition. The coverage test samples a 3 × 3 alpha grid; rerun it after changing artwork, direction or travel. Do not replace the silhouette with a rectangle.

### Eye passage and arrival

`site.assets.passage` holds `far`, `middle`, and `near` images plus fallback entries. The far field contains a distant light/horizon; middle ribbons establish direction; near currents occlude the view and pass beyond the frame. Suggested art canvas: **1600 × 1000**, travel axis at its centre **(800,500)**. Keep the visual axis consistent across layers.

The template motion SVG roots use `preserveAspectRatio="none"` so their abstract flow fills the intended phone/desktop canvas. Unlike the mascot, these decorative curves can stretch; final painted art may use mobile variants or a safe crop instead. Do not letterbox an SVG inside its own canvas. All passage start scales exceed 1 so clipped file boundaries remain offscreen when the layers appear. Preserve transparency for middle/near layers and extend their shapes beyond the edges. The far field has a matched midnight background.

Depth scales/translation rates, mobile complexity factor, camera acceleration, portrait/text arrival stops, and story distances are in `motion.ts`. The passage remains tied to scroll progress; pauses hold it and reverse scroll reconstructs it. Line-up content is invisible until arrival. No new animation engine or time-based ride is required.

### Exact remaining artwork needs

1. Transparent final logo (current supplied JPEG remains the preview).
2. Existing mascot isolated in colour, true pencil line art, and separate gold mask, aligned on one master canvas; optional aligned face detail and approved eye anchor/aperture. The original template mascot has been preserved, not regenerated.
3. Three matching wave layers: rear, dense crest/body, foam/gold edge, with the safe area above.
4. Three aligned passage-depth layers and first-scene backdrop, with a shared vanishing direction.
5. Two approved artist portraits/cutouts, confirmed names and any performance wording. Optional guest portrait/name/appearance wording **only once the organiser confirms the slot**.
6. Confirmed sponsor logos, and event-page artwork/forms/rules/dates/venue as they become available.

See [before/after clips and checkpoints](recordings/README.md). Final artwork still needs phone/desktop forward/reverse review and a new performance measurement.

## Asset records

```ts
{
  path: '/assets/programs/dance.webp',
  alt: 'A concise description of the supplied artwork',
  width: 1200,
  height: 1400,
  fit: 'cover',
  position: '50% 40%',
  responsive: {
    mobile: '/assets/programs/dance-mobile.webp',
    detail: '/assets/programs/dance-2x.webp',
  },
}
```

HTML image slots use the mobile path at widths below 768px. Optional `detail` supplies a 2× desktop image candidate. An empty, missing, or failed image becomes branded fallback art; the logo also has a shipped SVG fallback. Explicit intrinsic dimensions reserve image space. Image decoding refreshes the story geometry.

Suggested folders: `identity/`, `mascot/`, `flow/`, `programs/`, `artists/`, `sponsors/`. Use lowercase stable filenames. SVG is preferred for logo/line art; transparent WebP/PNG is suitable for painted layers. Supply alt text independently of any text painted into art; all essential event information remains HTML.

## Mascot — the shared canvas is essential

The template uses **800 × 1000** design units. Colour, pencil sketch, and gold mask are three independent SVGs with exactly this canvas. The SVG stand-in is vector-based so a close eye zoom stays sharp. The mask contains real eye cutouts.

1. Deliver an isolated transparent mascot, a **true aligned pencil/line-art version**, and an independent coloured mask. Preserve canvas, pose, scale, and position across all three.
2. Store the files under `public/assets/mascot/`; update `site.assets.mascot.colour`, `.sketch`, and `.mask`.
3. Set `site.assets.mascot.canvas` and all asset dimensions to the shared master canvas. Retain the fallback manifest separately.
4. Measure the viewer-left eye’s centre on that canvas. Set normalised `{ x: measuredX / canvasWidth, y: measuredY / canvasHeight }` in `motion.eye.centre`.
5. Trace the aperture as an SVG path in those **same canvas coordinates**, and set `motion.eye.aperture`. Set conservative `innerRadius` values for an ellipse fully inside the opening; the coverage calculation uses these to fill the viewport safely.
6. Adjust mobile/desktop composition offsets independently. These place the art within the screen; they do not change the anatomical eye point.
7. Preview at 390 × 844 and 1440 × 900, including reverse scrolling, breakpoint/orientation changes, and the portal handoff.

Current calibration: centre `(365,262)` = `(.45625,.262)`, aperture `M342 262 Q365 244 389 262 Q366 280 342 262 Z`, conservative inner ellipse radii `(19,7)`.

Example **alternative calibration** for a replacement pose (not interchangeable with current artwork): eye centre `(400,280)` gives `{x:.5,y:.28}`; aperture `M376 280 Q400 260 424 280 Q400 300 376 280 Z`; inner radii `(19,8)`. Change both anchor and path together. No timeline changes are needed.

Mobile mascot variants must preserve the master canvas and anchor. A different crop is not a valid aligned variant. Optional `faceDetail` must likewise be transparent, registered to the **full master canvas**, and contain the final sketch plus coloured mask detail. It fades in near the eye approach; a failed detail layer is omitted. Artist-provided detail crops must be placed on the master canvas before delivery; the template does not guess their alignment.

If a final colour asset arrives alone, keep the working stand-in set until matching sketch/mask layers are supplied. Crossfading unrelated poses is not a completed pencil transition. The root JPEG is a logo preview, not isolated mascot art.

## Logo, ribbons, programs, artists, sponsors

- Logo: use transparent SVG/WebP when available. The supplied JPEG is currently softened at its edges to blend into midnight; a transparent logo can retain this slot or have its own safe surrounding canvas. Adjust intrinsic dimensions in the manifest.
- Flow: independent lightweight SVG ribbons. The flow fallback is configured centrally. Keep the composition uncluttered.
- Programs: update the event’s `image`, alt, fit/position and optional responsive variants. Existing prose and actions remain accessible.
- Artists/guest: update `lineup.ts` records, confirmed names, announcement state, optional portraits/backdrops, focal positions and the independent guest flags. Announced records with no image still get branded graphic art.
- Sponsors: add confirmed records only. Empty production data hides the entire section. Logos preserve their aspect ratio; failed logos retain the sponsor’s name.

Set `motion.sketchBackground` to `dark` for a dark alternative. The template line art is inverted for readability; final art may need a purpose-made light pencil export. Retest contrast after replacing it. Tune `stops`, `scrollVh` and composition through configuration. Changes to a mascot pose require recalibration; ordinary matched-asset replacement does not require animation edits.

## Before marking a replacement ready

Build, verify direct routes, check form states, inspect artwork forward/backward at phone/tablet/desktop widths, check the motion toggle, and rerun loading diagnostics. Final raster artwork can materially change transfer size, sharpness, and rendering cost; placeholder measurements do not certify it.
