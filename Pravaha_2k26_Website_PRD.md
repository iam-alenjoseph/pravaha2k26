# Pravaha 2k26 — Website Template PRD

Version: 1.0 · 30 October 2026  
Owner: Sooraj Nair / Pravaha organising team  
Deliverable: A working, responsive website template whose artwork, performers, event details, sponsors, and registration links can be replaced through configuration.

## 1. Product intent

Build a premium, illustrated, scroll-driven website for Pravaha 2k26, a student-funded, college-only celebration. The program includes student performances, dance/music/fashion show participation, and a concert or DJ finale. The homepage must feel like a continuous journey through the mascot’s world.

The reference is the scroll choreography of https://www.dhwanicet.com/ and the supplied recording. Study its scene staging, layered movement, and transitions; create an original Pravaha composition using the supplied identity. Do not copy Dhwani’s artwork, character, text, or layout.

**Build the template now. Final artwork and event announcements are not prerequisites.** Every essential transition must work with intentional placeholders, with final assets replaceable without rewriting animation components.

### Confirmed requirements

- The opening is the Pravaha logo.
- A flowing air/water transition reveals the mascot.
- Scrolling zooms toward the mascot while its coloured artwork gradually becomes a pencil sketch. Only the mask remains coloured.
- The zoom passes through an eye opening in the mask into the event programs and concert/DJ sections, including image slots for performers.
- Sponsors are the final main homepage section.
- Timeline and other information belong on supporting pages.
- Competition participation is free. Registration collects student/team details through Google Forms.
- Artists will supply final artwork separately.

### Proposed implementation defaults

These choices are recommendations for the first template, rather than additional requirements from the organiser:

- Use a dark navy opening, teal/gold flowing ribbons, and a warm ivory background as the sketch develops. Provide a configurable dark sketch background alternative; this question remains open and must not block the template.
- Use the dynamic, reaching mascot pose on the left of the supplied character sheet as the art-direction reference.
- Target the masked eye on the viewer’s left. Make the exact position and aperture shape configurable.
- Build with React, TypeScript, Vite, CSS, and GSAP ScrollTrigger. Use native scrolling initially.
- Keep initial sample content limited to Dance, Music, and Fashion Show, with generic announcement states for the concert/DJ. Actual categories remain editable.

## 2. Goals and scope

### Success criteria

1. A visitor can scroll through the full logo → flow → mascot → sketch → eye portal → programs → performers → sponsors journey on a phone and desktop.
2. The organiser can replace art, update content, and add a form URL without editing animation logic.
3. Visitors can jump straight to programs and registration through navigation.
4. Unannounced content is presented honestly and deliberately.
5. The production build works on a static host, with all configured routes directly accessible.

### Initial scope

- Complete animated homepage, responsive navigation, accessible event information, and footer.
- Reusable event listing and event detail templates.
- Schedule page scaffold driven by an editable empty dataset.
- Central content, asset, theme, and motion configuration.
- Placeholder illustration set, image fallbacks, and replacement documentation.
- Free-registration links to external Google Forms.
- Reduced-motion experience and a visible Reduce motion setting.

### Outside initial scope

Payments, login, participant databases, custom registration forms, admin dashboards, judging tools, live results, merchandise checkout, and food-stall booking. Food stalls can be mentioned in event content later but are not an additional homepage scene in this version.

## 3. Approaches considered

| Approach | Advantages | Trade-offs | Decision |
|---|---|---|---|
| Layered images/SVG with a scroll-controlled timeline | Independently adjustable layers; editable content; reusable animation; responsive eye target | Requires matched coloured/sketch assets and careful coordinate calibration | Recommended for the template |
| Scroll-controlled rendered video or image sequence | Can reproduce complex painted animation | Heavier transfers; device-dependent video seeking; expensive revisions when artwork changes | Reserve for a future isolated transition if the artists require it |
| Full 3D mascot/world | Spatial camera movement | Requires 3D assets and more development/performance work | Unnecessary for the described 2D identity |

Do not add multiple animation engines or WebGL to the template without a demonstrated need. Awwwards-style guidance may inform composition, motion, and polish; any named skill is optional tooling rather than a runtime dependency or award guarantee.

## 4. Information architecture and visitor actions

| Route / location | Purpose | Initial state |
|---|---|---|
| `/` | Main scroll story, programs, artists, sponsors | Complete template |
| `/#programs` | Direct entry to homepage program section | Active; bypasses the opening story |
| `/#artists` | Direct entry to concert/DJ section | Active |
| `/#sponsors` | Sponsor acknowledgements | Visible when sponsor entries exist |
| `/events` | List competition categories | Sample Dance, Music, Fashion Show entries |
| `/events/:slug` | Rules, category, team limits, venue/time, registration | Data-driven template for each configured event |
| `/schedule` | Event-day timeline | “Schedule to be announced” until verified entries are configured |
| Unknown route | Helpful 404 with Home and Events links | Complete |

Navigation: a small logo/home link, Events, Schedule, and a menu control on narrow screens. Reveal the compact header after the opening logo stage; keep keyboard skip navigation available from the start. Include a persistent way to skip the intro and reach programs. Do not require completion of the animation to access event information.

Use the artwork logo as the hero identity and a concise wordmark in navigation. Dates, college name, venue, contact details, social URLs, artist names, and sponsor names are nullable until confirmed. Do not infer official college identity from previous unrelated events.

## 5. Homepage experience and animation requirements

### 5.1 Overall structure

Use one pinned/sticky visual stage for the opening sequence. As the visitor scrolls, its layers change on a shared timeline. After the portal completes, release naturally into the programs, artist, and sponsor sections in normal document flow. Lower sections can have bounded reveals but must remain easy to read and interact with.

All major transitions must reverse coherently when scrolling upward. Resizing and orientation changes must recompute geometry without duplicated triggers, lost content, or an incorrect eye target. Do not hijack the mouse wheel or touch gestures.

### 5.2 Opening timeline

The following percentages are a starting specification for the opening sequence, not fixed video timestamps. Place them in motion configuration so pacing can be tuned. Start with approximately five viewport-heights of scroll travel, in addition to the pinned viewport. Make the mobile distance independently adjustable. Tune by observed pacing, not by increasing empty scroll space.

| Opening progress | Scene | Required behaviour |
|---|---|---|
| 0–15% | Logo | Logo is immediately visible on a navy stage, with restrained teal/gold atmosphere and a scroll cue. No artificial countdown or mandatory loading screen. |
| 15–30% | Flow and mascot reveal | Ribbons/current cross the screen while the logo leaves and mascot is revealed. Layers overlap so this feels like one transition. |
| 30–45% | Mascot introduction | Show enough of the mascot’s full silhouette to understand its pose. Provide a short visual pause; subtle hair/ribbon motion can establish depth. |
| 45–70% | Sketch transformation | Zoom gradually toward the face. Coloured mascot crossfades or wipes into a spatially aligned pencil drawing. Keep the mask coloured throughout. Background transitions toward the configured sketch surface. |
| 70–95% | Eye approach and portal | Move the camera toward the configured eye aperture. A preview of the next scene is visible through that exact opening and expands with it. Preserve the sketch/mask edges outside the opening. |
| 95–100% | Handoff | The next scene fills the viewport. Remove the mascot stage without a black frame, flash, or visible seam, then release into normal page scrolling. |

Prefer one continuous change in position/scale over a series of unrelated zoom cuts. Use opacity, transforms, and a mask/clip for the main effects. The mascot’s proportions must remain intact.

### 5.3 The pencil effect

- The finished effect uses a genuine, aligned pencil-sketch asset. Grayscale alone does not satisfy it.
- For the template, provide a deliberately simple SVG mascot stand-in with coloured and line-art variants sharing one viewBox. Keep its mask separate and coloured.
- Do not show the complete character reference sheet as if it were the isolated mascot.
- The supplied JPEG sheet remains an art reference; extraction, redrawing, and delivery of finished production layers are separate asset tasks.
- If only the final coloured mascot is supplied later, preserve the working placeholder transition and document the missing sketch asset instead of claiming the final transformation is finished.

### 5.4 Eye portal geometry

Store the target eye as normalised coordinates within a fixed mascot design canvas. Store the aperture as a configurable SVG path using the same coordinate system. The artwork transform, mask overlay, and aperture must share this coordinate space.

Calculate the translation needed to bring the aperture centre to the viewport’s visual centre, then increase scale until the opening covers the viewport. Support separate composition offsets for mobile and desktop; the anatomical eye point stays attached to the art. No fixed screen-pixel eye coordinates embedded in a component.

At high zoom, support an optional aligned face-detail asset. Avoid enormous raster surfaces and blurry artwork enlargement. Use SVG for the stand-in; calibrate final raster detail when the artist supplies it.

The portal may display a non-interactive visual preview of the programs until completion. Keep actual event controls in the normal-flow content, with no duplicate focusable controls beneath the mascot overlay. On completion, the preview and real section must visually match.

### 5.5 Programs

- Use a reusable illustrated program composition for each category, with title, image/graphic slot, concise description, Details, and Register action.
- Begin with Dance, Music, and Fashion Show as clearly editable categories.
- Event details include category, eligibility, team-size limits, rules, coordinators, time, and venue when known.
- Keep all text as accessible HTML. Program cards must not be flattened posters with embedded essential text.
- Unknown information says “To be announced” or is omitted according to the configured field; never invent specifics.

### 5.6 Concert / DJ / artists

- Provide a dedicated headline composition with image slots, artist name, performance type, and announcement state.
- Support one or multiple performers through data, without separate bespoke components per artist.
- Unannounced state uses an abstract silhouette/graphic and “Line-up to be announced”. No unrelated celebrity photo or fictional booking.
- Full performer photography is optional; fall back to a branded composition without broken image icons.

### 5.7 Sponsors and footer

Sponsors close the homepage’s main content. Support sponsor name, logo, optional website, and optional tier/order. Provide a sponsor layout preview in development with explicitly labelled sample slots. Default production sponsor data is empty; hide the empty heading and section. A preview setting can force placeholder display for layout review.

Adding a real sponsor entry must make the section appear without code changes. Follow with a compact footer containing configured contact/social links and navigation. Do not fabricate sponsors or partnership claims.

## 6. Visual system

The supplied logo and mascot supersede the earlier exploratory cobalt/orange palette. Use these starting tokens, sampled approximately by visual judgement rather than claimed as exact extracted brand values:

| Token | Starting value | Role |
|---|---|---|
| Midnight | `#071322` | Opening, navigation, dark scenes |
| Deep blue | `#14263E` | Supporting depth and panels |
| Teal | `#2B7180` | Flowing layers and secondary accents |
| Gold | `#E9B85F` | Mask, focal accents, primary actions |
| Ivory | `#FFF2D9` | Sketch paper, light text/surfaces |
| Graphite | `#34383D` | Sketch lines and text on ivory |

Adjust foreground/background pairings to meet contrast requirements; the raw gold and teal values are not pre-approved for small text on every surface. Keep metallic texture inside artwork, with clean readable HTML text and controls.

Use at most two complementary, licensed type families. The supplied logo is the display identity; body and event typography should be readable. Choose final fonts during implementation and document them. Build composition, hierarchy, and spacing before adding decorative motion.

Atmosphere should come from flowing ribbons, illustration depth, grain used sparingly, and the mascot’s existing identity. Avoid filling every scene with unrelated particles, excessive glow, or constant movement.

## 7. Content and asset replacement contract

### 7.1 Central configuration

Organise editable values into three files or equally clear equivalents:

- `src/config/site.ts`: identity, nullable dates/venue, contact/social links, theme tokens, asset references, and preview flags.
- `src/data/events.ts`, `artists.ts`, `sponsors.ts`, `schedule.ts`: ordered content records with stable IDs/slugs and publication states.
- `src/config/motion.ts`: progress stops, scroll distances, composition offsets, eye coordinates/aperture, sketch background mode, and reduced-motion behaviour.

The implementer may rename files, but must preserve this separation. Do not scatter file paths, form URLs, performer names, and eye coordinates through UI components.

Each asset record should support: path, alt text, intrinsic width/height, design-canvas dimensions where relevant, object-fit/composition position, and optional responsive/detail variants. Use a dedicated type for the mascot’s shared canvas and anchor geometry.

Each event needs: ID, slug, title, type/category, description, optional image, eligibility/rules, team-size bounds, nullable time/venue/contact, nullable registration URL, registration state, and display order. Each artist needs a stable ID, name or announcement label, performance type, optional image, announcement state, and order. Schedule entries reference event IDs so information does not diverge.

### 7.2 Asset slots and handoff

| Slot | Template requirement | Final delivery guidance |
|---|---|---|
| Hero logo | Readable text/SVG stand-in; support supplied JPEG as an optional preview | Transparent SVG preferred; otherwise transparent high-resolution PNG/WebP |
| Mascot colour | Original, simple SVG stand-in | Isolated mascot, transparent background, shared master canvas |
| Mascot sketch | Line-art version aligned to the stand-in | True pencil/line-art rendering aligned pixel-for-pixel to colour version |
| Coloured mask | Separate aligned SVG layer | Separate transparent layer in the same master canvas |
| Eye aperture | Configurable path and centre | Artist-approved outline/anchor coordinates |
| Face detail | Optional slot | Detailed crop with known alignment to the master canvas |
| Flow foreground/background | Lightweight SVG curves/ribbons | Independent transparent layers; mobile-safe composition |
| Program art | Branded category stand-ins | Suggested portrait or square assets; crop positions configurable |
| Performer images | Abstract announced/unannounced stand-ins | Cutouts or photos with focal position; names remain HTML |
| Sponsor logos | Development-only labelled samples | SVG or transparent PNG/WebP, preserving aspect ratio |

Use a documented logical naming scheme under `public/assets/`, with placeholders in their own folder. Every missing, empty, or failed image path needs a deliberate fallback. Replacing assets must preserve layout dimensions and trigger geometry refresh after image decode.

### 7.3 Replacement workflow

1. Place a new file in the documented asset folder.
2. Update its manifest entry and dimensions/alt text.
3. For the mascot, ensure colour, sketch, and mask share the same canvas and alignment.
4. Set the eye anchor/path once against that canvas; adjust composition offsets only if needed.
5. Preview the logo, sketch, eye entry, and portal exit on phone and desktop.
6. Update the corresponding publication state and rebuild.

Ordinary image/content replacement must not require changes to the animation timeline source. A changed mascot pose may require anchor recalibration through configuration, which must be documented as expected work.

## 8. Registration and supporting pages

Registration is an outbound link, with Google Forms collecting all participant data. The Pravaha website does not receive or store participant submissions.

- If a form URL is configured and registration is open, Register opens that HTTPS URL in a new tab with appropriate link protection and a clear external-form label.
- If the URL is missing, display “Registration opening soon”; do not create a clickable dummy link.
- Closed registration has a distinct “Registration closed” state while event details remain accessible.
- The same configuration powers homepage and event-detail actions.
- Allow one shared branched Google Form or different forms per competition. The frontend must not depend on either form structure.

The event detail template must handle unknown rules/times gracefully. The schedule page uses real configured entries, grouped and sorted by event date/time in `Asia/Kolkata`. An empty schedule displays an announcement state, not invented sample timings. Include a README example dataset marked as an example rather than shipping it as official information.

## 9. Responsive behaviour, accessibility, and loading

- Design for at least 360, 390, 768, 1024, and 1440 CSS-pixel widths; also inspect overflow at 320px.
- Use a stable mobile stage height that handles changing browser chrome. Preserve the mascot face/eye and important controls through portrait/landscape changes.
- Use explicit image dimensions/aspect ratios to avoid layout movement. Load the opening logo first; prioritise nearby mascot assets and defer offscreen performer/sponsor images.
- Essential content must remain readable before animation initialisation and if animation code fails. Provide a basic no-JavaScript identity/information fallback with an Events path or configured registration links.
- Honour `prefers-reduced-motion` and expose a Reduce motion preference stored locally. Reduced mode removes the long pin, deep zoom, and continuous parallax; it presents the same information in normal reading order.
- Keyboard navigation, visible focus, semantic headings, accessible menu state, labelled links, and touch targets around 44px are required.
- Inactive scene controls must not receive focus or intercept clicks. Respect focus when skipping the intro or changing routes.
- Aim for WCAG AA text contrast. Decorative ribbons are hidden from assistive technology; meaningful images receive alt text.
- No autoplay sound or required hover interactions.

## 10. Technical architecture and quality targets

Recommended stack: React + TypeScript + Vite, CSS variables for theme, GSAP + ScrollTrigger for the opening timeline, and lightweight routing for supporting pages. Pin current compatible dependency versions when implementing; preserve an existing project’s stack if one is provided later.

Use reusable scene, portal, program, artist, sponsor, and page components. Initialise animation only when required geometry/assets are ready, and clean up listeners/triggers on unmount or route changes. Refresh calculations after resize and relevant image/font loads. The normal-flow destination section is the source of truth for the portal handoff.

The website exports a static build, normally `dist/`. Hosting must support direct access to configured routes through SPA fallback or prerendered route files. Deployment configuration, domain selection, and public launch are separate from completing this template.

Initial engineering targets, to be measured rather than asserted:

- Placeholder build first-view transfer target: at most 1.5 MB including opening assets/fonts.
- Initial compressed application JavaScript target: at most 250 KB; justify any overrun.
- Target LCP at or below 2.5 seconds and CLS at or below 0.1 on a documented mobile test profile.
- Aim for smooth animation on a mid-range phone; inspect and report stutters during the portal zoom. Simplify effects before dropping essential content.
- No uncaught console errors, missing local assets, accidental horizontal page scrolling, or duplicate ScrollTriggers after navigation.

Final artwork can change payload and rendering behaviour. Recheck these targets when production art arrives; do not claim that placeholder measurements certify the final site.

Official implementation references:

- Scroll-controlled animation, pinning, refresh and progress: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Static build/deployment: https://vite.dev/guide/static-deploy.html
- Reduced motion: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion

## 11. Delivery sequence and acceptance tests

### Milestone A — Template foundation

Set up layout, theme tokens, data/asset configuration, placeholder artwork, routes, and empty states. All page content must be usable without motion. Deliver a short asset replacement guide.

### Milestone B — Signature scroll sequence

Implement logo → flowing reveal → mascot → pencil transformation → masked-eye portal → programs. Check the entire sequence forward and backward before adding decorative polish.

### Milestone C — Remaining content and registration

Complete programs, artist announcements, conditional sponsors, event details, schedule scaffold, Google Form link states, and navigation shortcuts.

### Milestone D — Verification and handoff

Run a production build, browser-check the supported viewports and reduced motion, verify routes and outgoing links, and provide evidence with known limitations. Do not report browser/performance checks as passed if the environment cannot run them.

| ID | Acceptance check |
|---|---|
| A1 | A fresh checkout can install documented dependencies and produce a successful static production build. |
| A2 | The first viewport shows the Pravaha identity without requiring a scroll or artificial wait. |
| A3 | All opening stages appear in the agreed order and reverse without losing alignment. |
| A4 | The mascot becomes recognisable pencil line art while its separate mask remains coloured. |
| A5 | The portal grows from the configured eye opening, covers the viewport, and joins the real programs section without a flash or duplicate interactive controls. |
| A6 | Skip intro, direct program anchors, browser Back, and direct route reloads work. |
| A7 | Changing a placeholder logo/program/artist path and content through configuration requires no component edits. Missing paths show fallbacks. |
| A8 | A different documented eye anchor/path changes the portal origin without editing timeline code. |
| A9 | A configured form opens correctly; unset and closed states do not navigate to fake URLs. |
| A10 | No empty production sponsor section appears. Adding a configured sponsor displays it last before the footer. Development previews are visibly labelled. |
| A11 | Reduced mode contains the same information with ordinary scrolling and no long empty pin space. |
| A12 | Phone, tablet, and desktop layouts preserve the intended composition, readable text, and accessible controls without page overflow. |
| A13 | Schedule and artist announcement states contain no invented dates, people, bookings, or partnerships. |
| A14 | Build/browser checks and measured performance results are recorded with the tested viewport/profile and any unresolved limits. |

Use focused automated checks for routing, configuration states, and registration-link behaviour where useful. Use browser inspection for scene alignment, real scrolling, reverse progression, viewport changes, and focus behaviour; unit tests alone cannot verify these visual requirements.

## 12. Handoff and decisions that may arrive later

The implementer delivers source, production build instructions, editable content/asset/motion configuration, a working placeholder set, the replacement guide, and verification notes. Document which visual effects use temporary stand-ins.

The following must remain editable and do not block starting: final isolated mascot/sketch/mask, face-detail export, logo cutout, artist names/photos, sponsor list, event dates/venue, college wording, rules/team limits, coordinators, form URLs, exact flow material, and sketch background choice.

The builder can choose minor component boundaries, accessible font pairing, exact ribbon paths, easing within stages, and folder naming. Preserve the specified story and replacement contract. Ask the organiser only when a change would alter that story or introduce a new product feature.

### Starting instruction for the developer

Implement this PRD as a complete placeholder-driven website template. Begin with the usable static composition and central configuration, then build and verify the signature scroll sequence. Keep every unknown fact in an honest announcement state. Prioritise the logo-to-mascot reveal, aligned pencil transformation, and mask-eye portal. Deliver a template that the organiser can populate incrementally as artists and event coordinators provide final material.
