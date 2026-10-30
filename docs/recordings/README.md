# Before / after scroll review

## Latest targeted visual polish — 31 October 2026

[Desktop complete](polish/desktop-complete.webm) · [Phone complete](polish/phone-complete.webm) · [Desktop pause/reverse/fast scroll](polish/desktop-scrubbing.webm) · [Phone pause/reverse/fast scroll](polish/phone-scrubbing.webm).

[Desktop reduced motion](polish/desktop-reduced.webm) · [Phone reduced motion](polish/phone-reduced.webm) · [Guest and sponsors preview, desktop](polish/guest-sponsors-preview.webm) · [Guest and sponsors preview, phone](polish/guest-sponsors-phone-preview.webm).

These clips continue through Artist 2 and the footer. Public production has no configured sponsors and keeps the tentative guest disabled. The separately labelled development clips exercise guest → Artist 1 → Artist 2 → sample sponsor slots without modifying source data or the production build.

Full-size checkpoint PNGs and `states.json` are inside each matching folder in `polish/`. Key frames: `03` wave uncover; `08–10` eye approach; `12` flowing passage; `13–14` exit direction/backdrop; `15` settled portrait before copy; `16` finished arrival. Reduced clips skip the pinned story. Scrubbing clips hold midway through wave, pencil, eye and passage, reverse to the logo, then test rapid forward/reverse jumps.

Native FFmpeg decoded the recordings for visual inspection: [desktop filmstrip](polish/desktop-filmstrip.png), [phone filmstrip](polish/phone-filmstrip.png), [eye sequence](polish/eye-sequence.png), [scrubbing sequence](polish/scrubbing-filmstrip.png). These supplement the full-resolution browser screenshots. The older opening refinement is the **before** reference for this pass.

Reproduce after building:

```sh
node scripts/capture-polish.mjs "ABSOLUTE_PATH_TO_CHROME"
node scripts/create-polish-filmstrips.mjs
```

An optional third argument selects comma-separated case names. Playwright's FFmpeg records WebM; system `ffmpeg`/`ffprobe` decode review frames with `scripts/inspect-recording.mjs CLIP OUTPUT_FOLDER SECONDS...`. QA recording speeds are illustrative; application camera motion remains controlled by native scroll progress.

## Latest opening refinement

[Desktop clip](refinement/desktop.webm) · [Phone clip](refinement/phone.webm). These supersede the v1.2 opening below: slogans are removed, the wave has a curved trailing edge, and the mascot fades in with moving wrists, sleeves and cloth. The recordings pause during the mascot introduction to show the idle gesture, then continue through sketch and eye entry.

Refinement checkpoints `00` = clean logo; `01` = incoming crest; `02` = full cover; `03–06` = curled exit and fade; `07–09` = full mascot; `10` = sketch; `11` = eye; `12` = passage; `13` = normal-flow artist scene. Original v1.2 comparison clips remain below for history.

## v1.2 comparison

Production-build captures, Chromium 140.0.7339.16, desktop 1440 × 900 and phone 390 × 844. Desktop videos are encoded at 960 × 600; still frames retain full viewport resolution. Captures use native scroll positions driven by the QA script; there is no time-based camera animation in the application.

| View | Before | After |
|---|---|---|
| Desktop | [Before clip](before/desktop.webm) | [After clip](after/desktop.webm) |
| Phone | [Before clip](before/phone.webm) | [After clip](after/phone.webm) |

After checkpoints (both `desktop-XX.png` and `phone-XX.png`):

| Frame | Progress | Scene |
|---|---|---|
| 00 | 0% | Immediately visible logo |
| 01 | 12% | Dense wave cover |
| 02 | 32% | Full mascot |
| 03 | 57% | Directional sketch / gold mask separation |
| 04 | 70% | Eye approach with distant light, no webpage content |
| 05 | 78% | Threshold crossing into a full-stage passage |
| 06 | 86% | Passage midpoint with foreground occlusion |
| 07 | 98.5% | Arrival settling and portrait/text reveal |
| 08 | 100% | Matching normal-flow line-up |

Each clip also briefly reverses into the passage and uses Skip intro. `guest-enabled-1440.png` and `guest-enabled-390.png` show the separately checked guest-enabled production fixture; the normal production configuration remains guest-disabled.

The second review pass corrected passage letterboxing/crop boundaries at the threshold and synchronized portrait opacity across the handoff. These after clips contain those fixes. Final artist portraits, wave painting, and detailed mascot art remain replacement tasks; clips demonstrate the working template, not final festival art.
