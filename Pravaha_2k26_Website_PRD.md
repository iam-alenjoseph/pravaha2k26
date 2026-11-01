Pravaha 2k26 — Website Template PRD
Version: 1.2 · 30 October 2026
Owner: Sooraj Nair / Pravaha organising team
Deliverable: A working, responsive website template whose artwork, performers, event details, sponsors, and registration links can be replaced through configuration.
1. Product intent
Build a premium, illustrated, scroll-driven website for Pravaha 2k26, a cultural celebration. The program includes student performances, dance/music/fashion show participation, and a concert or DJ finale. The homepage must feel like a continuous journey through the mascot’s world.

The reference is the scroll choreography of https://www.dhwanicet.com/ and the supplied recording. Study its scene staging, layered movement, and transitions; create an original Pravaha composition using the supplied identity. Do not copy Dhwani’s artwork, character, text, or layout.

Motion revision: the organiser reports that the initial template’s core behaviour works but needs stronger visual finishing. The next pass adds a sliding wave-image transition before the mascot and changes the eye entry into a cinematic passage with depth, acceleration, and an arrival reveal. Tathva ’26 (https://tathva.org/) is the organiser’s reference for that entry feeling. Its animation could not be verified in the research browser because the page failed to load after one retry. The cinematic direction below is an original proposal based on the organiser’s description, not an observed reconstruction of Tathva. A short reference clip can refine it later without blocking this pass.

Homepage content revision: continue from the existing working template and motion pass. After the mascot/eye passage, show a celebrity or special guest first, followed by two separate artist sections, then sponsors. Remove competition/program cards, rules, event details, and registration controls from the homepage. Keep those functions on the existing supporting event pages. The celebrity appearance is tentative; keep its slot configurable and avoid announcing an unconfirmed booking.

Continue the existing template now. Final artwork and event announcements are not prerequisites. Preserve completed work and refine it incrementally. Every essential transition must work with intentional placeholders, with final assets replaceable without rewriting animation components.
Confirmed requirements
- The opening is the Pravaha logo.
- A sliding wave-image transition begins with the first scroll and reveals the mascot.
- Scrolling zooms toward the mascot while its coloured artwork gradually becomes a pencil sketch. Only the mask remains coloured.
- The zoom passes through an eye opening in the mask into a short cinematic flow passage, then arrives at the celebrity/special-guest reveal, followed by Artist 1, Artist 2, and sponsors. The eye must convey entering another scene; simply enlarging a cutout that exposes the next section is insufficient.
- The celebrity/special-guest slot is optional because the appearance is not yet confirmed. With that slot disabled, the passage arrives directly at Artist 1. Two artist slots remain part of the template.
- Competition listings, event details, rules, and registration are on supporting pages, accessible from navigation, and are absent from the main homepage content.
- Sponsors are the final main homepage section.
- Timeline and other information belong on supporting pages.
- Competition participation is free. Registration collects student/team details through Google Forms.
- Artists will supply final artwork separately.
Proposed implementation defaults
These choices are recommendations for the first template, rather than additional requirements from the organiser:
- Use a dark navy opening, teal/gold wave artwork, and a warm ivory background as the sketch develops. Provide a configurable dark sketch background alternative; this question remains open and must not block the template.
- Use the dynamic, reaching mascot pose on the left of the supplied character sheet as the art-direction reference.
- Target the masked eye on the viewer’s left. Make the exact position and aperture shape configurable.
- Build with React, TypeScript, Vite, CSS, and GSAP ScrollTrigger. Use native scrolling initially.
- Keep Dance, Music, and Fashion Show as editable sample categories on the separate event pages only. The homepage has an optional celebrity/special-guest slot and exactly two artist presentation slots, all with honest unannounced states until names are confirmed.
2. Goals and scope
Success criteria
1. A visitor can scroll through logo → sliding wave → mascot → sketch → cinematic eye passage → celebrity/special guest (if enabled) → Artist 1 → Artist 2 → sponsors on a phone and desktop.
2. The organiser can replace art, update content, and add a form URL without editing animation logic.
3. Visitors can jump straight to the line-up or open the separate event pages and their registration links through navigation.
4. Unannounced content is presented honestly and deliberately.
5. The production build works on a static host, with all configured routes directly accessible.
Initial scope
- Complete animated homepage with optional celebrity/special guest, two separate artist sections, sponsors, responsive navigation, and footer.
- Reusable event listing and event detail templates.
- Schedule page scaffold driven by an editable empty dataset.
- Central content, asset, theme, and motion configuration.
- Placeholder illustration set, image fallbacks, and replacement documentation.
- Free-registration links to external Google Forms.
- Reduced-motion experience and a visible Reduce motion setting.
Outside initial scope
Payments, login, participant databases, custom registration forms, admin dashboards, judging tools, live results, merchandise checkout, and food-stall booking. Food stalls can be mentioned in event content later but are not an additional homepage scene in this version.
3. Approaches considered
Approach	Advantages	Trade-offs	Decision
Layered images/SVG with a scroll-controlled timeline	Independently adjustable layers; editable content; reusable animation; responsive eye target	Requires matched coloured/sketch assets and careful coordinate calibration	Recommended for the template
Scroll-controlled rendered video or image sequence	Can reproduce complex painted animation	Heavier transfers; device-dependent video seeking; expensive revisions when artwork changes	Reserve for a future isolated transition if the artists require it
Full 3D mascot/world	Spatial camera movement	Requires 3D assets and more development/performance work	Unnecessary for the described 2D identity


Do not add multiple animation engines or WebGL to the template without a demonstrated need. The published Awwwards skill by juliobsz informs this motion pass: make the eye entry the signature moment; keep visual states continuous; compose intentional still frames; give important controls consistent feedback; and use one animation driver. Apply that guidance to the existing project rather than changing its framework. The skill is optional tooling, not a runtime dependency, and consulting its guidance does not mean it has been installed.
4. Information architecture and visitor actions
Route / location	Purpose	Initial state
/	Main scroll story, optional celebrity/special guest, Artist 1, Artist 2, sponsors	Complete template
/#lineup	Direct entry to the first enabled line-up section	Active; bypasses the opening story
/#artists	Direct entry to Artist 1	Active; Artist 2 follows it
/#sponsors	Sponsor acknowledgements	Visible when sponsor entries exist
/events	List competition categories	Sample Dance, Music, Fashion Show entries
/events/:slug	Rules, category, team limits, venue/time, registration	Data-driven template for each configured event
/schedule	Event-day timeline	“Schedule to be announced” until verified entries are configured
Unknown route	Helpful 404 with Home and Events links	Complete


Navigation: a small logo/home link, Line-up, Events, Schedule, and a menu control on narrow screens. Events links to /events; it must not scroll to a removed homepage competition section. Reveal the compact header after the opening logo stage; keep keyboard skip navigation available from the start. Skip intro reaches the first enabled line-up section. Do not require completion of the animation to access event information. Replace old #programs links in the implementation; if legacy links need support, resolve them to /events rather than restoring event cards on the homepage.

Use the artwork logo as the hero identity and a concise wordmark in navigation. Dates, college name, venue, contact details, social URLs, artist names, and sponsor names are nullable until confirmed. Do not infer official college identity from previous unrelated events.
5. Homepage experience and animation requirements
5.1 Overall structure
Use one pinned/sticky visual stage for the opening sequence. As the visitor scrolls, its layers change on a shared timeline. After the portal completes, release naturally into the celebrity/special-guest section (when enabled), Artist 1, Artist 2, then sponsors in normal document flow. Each guest/artist has a distinct full composition rather than being combined into a competition-card grid. Lower sections can have bounded reveals but must remain easy to read and interact with. Do not insert a program/event section between the mascot and the guest/artist reveals.

All major transitions must reverse coherently when scrolling upward. Resizing and orientation changes must recompute geometry without duplicated triggers, lost content, or an incorrect eye target. Do not hijack the mouse wheel or touch gestures.
5.2 Opening timeline
The following percentages are a starting specification for the opening sequence, not fixed video timestamps. Place them in motion configuration so pacing can be tuned. Start with approximately five viewport-heights of scroll travel, in addition to the pinned viewport. Make the mobile distance independently adjustable. Tune by observed pacing, not by increasing empty scroll space.
Opening progress	Scene	Required behaviour
0–4%	Logo and first response	Logo is immediately visible on a navy stage. The first scroll begins the wave movement; retain logo legibility until the wave starts covering it. No artificial countdown or mandatory loading screen.
4–23%	Sliding wave-image wipe	An oversized illustrated crest slides from right to left by default. Its dense body covers the previous composition while the mascot scene is prepared underneath. The trailing edge uncovers the mascot. Direction, travel, overscan, and image slots are configurable.
23–40%	Mascot introduction	Show enough of the mascot’s full silhouette to understand its pose. The wave settles away; background, mascot, and foreground ribbons move at different depths. Include a readable pause before the next zoom.
40–64%	Sketch transformation	Zoom gradually toward the face. Colour drains through a directional reveal into a spatially aligned pencil drawing. Keep the mask coloured, with one restrained travelling glint as a proposed finishing detail. Background transitions toward the configured sketch surface.
64–78%	Eye approach	Frame the masked eye precisely. Start with a deliberate approach and increase perceived forward speed. The eye contains dark navy atmosphere and a distant teal/gold light cue; guest/artist content is not yet visible inside it.
78–93%	Cinematic passage	Pass the gold mask rim and travel through a short layered flow passage. Near ribbons cross the viewport faster than distant layers; light and perspective develop toward an exit. This is a transitional visual space, with no readable cards or clickable controls.
93–100%	Arrival and handoff	The exit opens into the celebrity/special-guest composition when enabled, otherwise Artist 1. Reduce the apparent speed, settle the scene, then bring in the portrait and name/announcement heading. Match the final composition to the real normal-flow section and release the pin without a flash, seam, or camera reset.


Prefer one continuous change in position/scale over a series of unrelated zoom cuts. Use opacity, transforms, and a mask/clip for the main effects. The mascot’s proportions must remain intact.
5.3 The pencil effect
- The finished effect uses a genuine, aligned pencil-sketch asset. Grayscale alone does not satisfy it.
- For the template, provide a deliberately simple SVG mascot stand-in with coloured and line-art variants sharing one viewBox. Keep its mask separate and coloured.
- Do not show the complete character reference sheet as if it were the isolated mascot.
- The supplied JPEG sheet remains an art reference; extraction, redrawing, and delivery of finished production layers are separate asset tasks.
- If only the final coloured mascot is supplied later, preserve the working placeholder transition and document the missing sketch asset instead of claiming the final transformation is finished.
5.4 Cinematic eye entry and geometry
Store the target eye as normalised coordinates within a fixed mascot design canvas. Store the aperture as a configurable SVG path using the same coordinate system. The artwork transform, mask overlay, and aperture must share this coordinate space.

Calculate the translation needed to bring the aperture centre to the viewport’s visual centre, then increase scale until the opening covers the viewport. Support separate composition offsets for mobile and desktop; the anatomical eye point stays attached to the art. No fixed screen-pixel eye coordinates embedded in a component.

At high zoom, support an optional aligned face-detail asset. Avoid enormous raster surfaces and blurry artwork enlargement. Use SVG for the stand-in; calibrate final raster detail when the artist supplies it.

The earlier concept of exposing the next webpage section through the eye is superseded. Use three linked visual spaces: the mascot face, a short flow passage, and the first enabled line-up composition. They share one scroll-progress driver and a consistent travel direction.

Required entry choreography:
1. Approach: align the eye and grow the mask rim while the face moves beyond the frame. Keep line work sharp and the mask’s gold visible as a near foreground edge.
2. Cross the threshold: use the enlarged mask rim as a motivated occluder. Exchange the distant eye atmosphere for the passage layers while that edge crosses the frame. Avoid a visible circular overlay popping into existence.
3. Travel: create perceived camera movement using at least three depth groups: a far horizon/light field, middle flowing ribbons, and a near rim/current. Use different scale/translation rates and purposeful occlusion so details appear to pass the viewer. An enlarged flat texture alone does not satisfy the requirement.
4. Arrive: let the distant light/flow resolve into the first enabled line-up scene’s backdrop. The near flow clears first, followed by the guest/artist image and heading. Text arrives as the apparent camera speed settles, so it is readable. The destination must automatically follow whether the optional guest slot is enabled.
Start with CSS/SVG transforms and perspective across lightweight layers. A short, low-opacity edge streak or vignette can reinforce forward movement. Distortion or WebGL is an optional later enhancement only if the baseline still lacks depth and measured performance can support it. Full-screen blur, strobing, and opaque flashes are not required.

Map the approach, acceleration, crossing, and settling to scroll progress so scrubbing backward reconstructs the sequence. Never start an unskippable time-based ride after a scroll threshold. Keep the idle atmosphere separate from camera progress; pausing scroll must hold the current story position.

Keep any actual line-up links in the normal-flow content, with no duplicate focusable controls beneath the animated stage. Before arrival, show only the transitional atmosphere; at the end, the non-interactive arrival composition and the real section must visually match. Event and registration controls belong to supporting pages. Native scrolling and the existing Skip intro control remain available.
5.4a Sliding wave-image transition
Use replaceable image assets for rear wave, main crest/body, and optional foam/gold edge. A lightweight SVG with a hand-shaped crest is the template fallback. Do not rely on a rectangle sliding across the viewport or generic blobs as the finished placeholder effect.

The crest’s silhouette is the visible transition boundary. Provide enough dense artwork or a matched backing shape to fully cover the outgoing scene at the swap moment. Overscan the layers so phone and landscape layouts never expose empty corners. Use staggered travel across the wave layers rather than adding more scroll distance. The wave should read as a current sweeping away the logo and carrying in the mascot.

The initial movement follows the first scroll input. The mascot is visible behind the trailing edge as the wave leaves. On reverse scroll, the same wave covers the mascot and restores the logo. Document the artwork safe area, approximate crest location, and intended aspect ratio so final images can replace the SVG.
5.5 Celebrity / special guest
- This is the first presentation scene after the cinematic eye passage when the slot is enabled.
- Provide a dedicated portrait/cutout slot, name, optional short role/appearance label, and announcement state. Use the existing navy/teal/gold identity and flowing reveal language.
- The guest appearance is tentative. In development preview, show a clearly identified unconfirmed guest placeholder so its composition can be reviewed. Do not use a real celebrity image or imply a booking without confirmed material.
- Provide a production enabled flag separate from development preview and announcement state. Default it off while the appearance itself is uncertain. Once the organiser confirms that the slot should be public, it may show an approved announcement state until the name is released.
- Disabling the guest slot removes its space and moves the portal arrival and Skip intro target directly to Artist 1, with no empty section, broken anchor, or residual scroll distance.
- Treat this as a guest appearance unless the organiser confirms a performance; do not automatically label the guest a DJ or concert act.
5.6 Artist 1 and Artist 2
- Provide exactly two ordered artist slots in the initial template, each with its own scroll composition: Artist 1, then Artist 2. Keep both data-driven and reuse one adaptable presentation component rather than duplicating animation logic.
- Each slot supports portrait/cutout, confirmed name or announcement label, performance type if known, optional short copy, focal position, and announcement state.
- Until confirmed, use abstract or silhouetted placeholders and “Artist announcement coming soon”; do not use unrelated celebrity photos or fictional bookings.
- Let each image establish the composition, followed by its name and a restrained light/ribbon accent. Coordinate transitions from guest → Artist 1 → Artist 2 while preserving enough stable reading time.
- Full performer photography is optional; use a deliberate branded fallback without broken image icons.
- Keep text as accessible HTML. Give actionable elements consistent hover, keyboard-focus, and pressed states, with essential image/text visible on touch.
- Event category cards, competition rules, team details, event metadata tables, and registration controls are not part of these homepage scenes. Keep them in the existing event-page templates.
5.7 Sponsors and footer
Sponsors close the homepage’s main content. Support sponsor name, logo, optional website, and optional tier/order. Provide a sponsor layout preview in development with explicitly labelled sample slots. Default production sponsor data is empty; hide the empty heading and section. A preview setting can force placeholder display for layout review.

Adding a real sponsor entry must make the section appear without code changes. Follow with a compact footer containing configured contact/social links and navigation. Do not fabricate sponsors or partnership claims.
6. Visual system
The supplied logo and mascot supersede the earlier exploratory cobalt/orange palette. Use these starting tokens, sampled approximately by visual judgement rather than claimed as exact extracted brand values:
Token	Starting value	Role
Midnight	#071322	Opening, navigation, dark scenes
Deep blue	#14263E	Supporting depth and panels
Teal	#2B7180	Flowing layers and secondary accents
Gold	#E9B85F	Mask, focal accents, primary actions
Ivory	#FFF2D9	Sketch paper, light text/surfaces
Graphite	#34383D	Sketch lines and text on ivory


Adjust foreground/background pairings to meet contrast requirements; the raw gold and teal values are not pre-approved for small text on every surface. Keep metallic texture inside artwork, with clean readable HTML text and controls.

Use at most two complementary, licensed type families. The supplied logo is the display identity; body and event typography should be readable. Choose final fonts during implementation and document them. Build composition, hierarchy, and spacing before adding decorative motion.

Atmosphere should come from flowing ribbons, illustration depth, grain used sparingly, and the mascot’s existing identity. Use one consistent movement language: flow, pull forward, and settle.

Proposed finishing details, subordinate to the wave and eye passage:
- Very slow, small background/ribbon drift at rest, confined to the active scene and disabled for reduced motion. Do not bob the entire mascot or essential text.
- Soft separation between far background, mascot, and near ribbons while scrolling.
- One light sweep across the retained gold mask as the sketch completes.
- A directional sketch reveal with a faint paper texture, keeping colour/sketch registration exact.
- Small directional arrow movement and a restrained fill sweep on primary actions, with clear focus-visible and pressed states. Keep hit areas stationary.
- A quieter sponsor arrival that settles into a stable, readable logo arrangement.
Keep the strongest depth and acceleration in the eye passage. Avoid filling every scene with unrelated particles, excessive glow, or constant movement. Evaluate each proposed accent against mobile performance and remove effects that weaken readability or the main composition.
7. Content and asset replacement contract
7.1 Central configuration
Organise editable values into three files or equally clear equivalents:
- src/config/site.ts: identity, nullable dates/venue, contact/social links, theme tokens, asset references, and preview flags.
- src/data/events.ts, lineup.ts (or existing artists.ts), sponsors.ts, schedule.ts: ordered content records with stable IDs/slugs and publication states. Keep event-page data separate from homepage line-up data.
- src/config/motion.ts: progress stops, scroll distances, composition offsets, eye coordinates/aperture, wave direction/travel/overscan, passage depth rates and arrival alignment, sketch background mode, and reduced-motion behaviour.
The implementer may rename files, but must preserve this separation. Do not scatter file paths, form URLs, performer names, and eye coordinates through UI components.

Each asset record should support: path, alt text, intrinsic width/height, design-canvas dimensions where relevant, object-fit/composition position, and optional responsive/detail variants. Use a dedicated type for the mascot’s shared canvas and anchor geometry.

Each supporting-page event needs: ID, slug, title, type/category, description, optional image, eligibility/rules, team-size bounds, nullable time/venue/contact, nullable registration URL, registration state, and display order. Homepage line-up configuration contains one optional guest record and two ordered artists records. Each line-up record needs a stable ID, role (guest or artist), name or announcement label, optional performance/appearance type, optional image, focal position, announcement state, and order. The guest also needs independent enabled and development-preview flags. Derive the first visible line-up target from this configuration for both the portal and Skip intro. Schedule entries reference event IDs so information does not diverge.
7.2 Asset slots and handoff
Slot	Template requirement	Final delivery guidance
Hero logo	Readable text/SVG stand-in; support supplied JPEG as an optional preview	Transparent SVG preferred; otherwise transparent high-resolution PNG/WebP
Mascot colour	Original, simple SVG stand-in	Isolated mascot, transparent background, shared master canvas
Mascot sketch	Line-art version aligned to the stand-in	True pencil/line-art rendering aligned pixel-for-pixel to colour version
Coloured mask	Separate aligned SVG layer	Separate transparent layer in the same master canvas
Eye aperture	Configurable path and centre, plus a separate gold threshold/rim treatment	Artist-approved outline/anchor coordinates
Face detail	Optional slot	Detailed crop with known alignment to the master canvas
Sliding wave	Distinct rear/main/edge SVG image stand-ins with a visible crest silhouette	Independent transparent layers; enough dense body for a full-frame wipe; mobile-safe overscan
Passage far/middle/near layers	Lightweight independent flow layers and a distant exit-light field	Croppable artwork with a consistent travel axis and clean transparency
Arrival backdrop	First enabled line-up background reused for the handoff	Aligned with the guest composition, or Artist 1 when the guest is disabled
Event-page art	Branded category stand-ins, used on /events and event detail pages only	Suggested portrait or square assets; crop positions configurable
Celebrity/special-guest image	One optional, unconfirmed development-preview slot	Approved portrait/cutout and confirmed appearance wording
Artist images	Two separate abstract/silhouette stand-ins in order	Cutouts or photos with focal position; names remain HTML
Sponsor logos	Development-only labelled samples	SVG or transparent PNG/WebP, preserving aspect ratio


Use a documented logical naming scheme under public/assets/, with placeholders in their own folder. Every missing, empty, or failed image path needs a deliberate fallback. Replacing assets must preserve layout dimensions and trigger geometry refresh after image decode.
7.3 Replacement workflow
1. Place a new file in the documented asset folder.
2. Update its manifest entry and dimensions/alt text.
3. For the mascot, ensure colour, sketch, and mask share the same canvas and alignment.
4. Set the eye anchor/path once against that canvas; adjust composition offsets only if needed.
5. Preview the logo, sketch, eye entry, and portal exit on phone and desktop.
6. Update the corresponding publication state and rebuild.
Ordinary image/content replacement must not require changes to the animation timeline source. A changed mascot pose may require anchor recalibration through configuration, which must be documented as expected work.
8. Registration and supporting pages
Registration is an outbound link, with Google Forms collecting all participant data. The Pravaha website does not receive or store participant submissions.
- If a form URL is configured and registration is open, Register opens that HTTPS URL in a new tab with appropriate link protection and a clear external-form label.
- If the URL is missing, display “Registration opening soon”; do not create a clickable dummy link.
- Closed registration has a distinct “Registration closed” state while event details remain accessible.
- The same event configuration powers event-listing and event-detail actions. Do not render registration controls or competition cards on the homepage; its Events navigation leads to /events.
- Allow one shared branched Google Form or different forms per competition. The frontend must not depend on either form structure.
The event listing and event detail templates retain Dance, Music, and Fashion Show as editable sample categories. Category pages support eligibility, team-size limits, rules, coordinators, time, venue, and Google Form registration when supplied. Keep all essential text in accessible HTML and use honest announcement states for unknown information. The schedule page uses real configured entries, grouped and sorted by event date/time in Asia/Kolkata. An empty schedule displays an announcement state, not invented sample timings. Include a README example dataset marked as an example rather than shipping it as official information.
9. Responsive behaviour, accessibility, and loading
- Design for at least 360, 390, 768, 1024, and 1440 CSS-pixel widths; also inspect overflow at 320px.
- Use a stable mobile stage height that handles changing browser chrome. Preserve the mascot face/eye and important controls through portrait/landscape changes.
- Use explicit image dimensions/aspect ratios to avoid layout movement. Load the opening logo first; prioritise nearby mascot assets and defer offscreen performer/sponsor images.
- Essential content must remain readable before animation initialisation and if animation code fails. Provide a basic no-JavaScript identity/information fallback with an Events path or configured registration links.
- Honour prefers-reduced-motion and expose a Reduce motion preference stored locally. Reduced mode removes the long pin, deep zoom, and continuous parallax; it presents the same information in normal reading order.
- Keyboard navigation, visible focus, semantic headings, accessible menu state, labelled links, and touch targets around 44px are required.
- Inactive scene controls must not receive focus or intercept clicks. Respect focus when skipping the intro or changing routes.
- Aim for WCAG AA text contrast. Decorative ribbons are hidden from assistive technology; meaningful images receive alt text.
- No autoplay sound or required hover interactions.
10. Technical architecture and quality targets
Original recommended stack: React + TypeScript + Vite, CSS variables for theme, GSAP + ScrollTrigger for the opening timeline, and lightweight routing for supporting pages. For this continuation, retain the existing project’s framework, router, styling, and animation engine. Do not migrate or scaffold a new project merely to match this recommendation.

Use reusable scene, portal, line-up presentation, sponsor, event-page, and page components. Initialise animation only when required geometry/assets are ready, and clean up listeners/triggers on unmount or route changes. Refresh calculations after resize and relevant image/font loads. The first enabled normal-flow line-up section is the source of truth for the portal handoff. The homepage must not depend on event-card geometry after the old program section is removed.

The website exports a static build, normally dist/. Hosting must support direct access to configured routes through SPA fallback or prerendered route files. Deployment configuration, domain selection, and public launch are separate from completing this template.

Initial engineering targets, to be measured rather than asserted:
- Placeholder build first-view transfer target: at most 1.5 MB including opening assets/fonts.
- Initial compressed application JavaScript target: at most 250 KB; justify any overrun.
- Target LCP at or below 2.5 seconds and CLS at or below 0.1 on a documented mobile test profile.
- Aim for smooth animation on a mid-range phone; inspect and report stutters during the portal zoom. Simplify effects before dropping essential content.
- No uncaught console errors, missing local assets, accidental horizontal page scrolling, or duplicate ScrollTriggers after navigation.
The organiser reports a previous slow-mobile result of 4.8 seconds. Its metric, test profile, and cause have not been independently verified. Before adding costly effects, identify whether that number is LCP, full load, or another measurement. Re-run the same production-build profile after this pass and report comparable before/after figures. Keep the logo immediately visible, lazy-load offscreen art, cap mobile effect complexity, and pause idle effects offscreen or when the document is hidden.

Final artwork can change payload and rendering behaviour. Recheck these targets when production art arrives; do not claim that placeholder measurements certify the final site.

Official implementation references:
- Scroll-controlled animation, pinning, refresh and progress: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Static build/deployment: https://vite.dev/guide/static-deploy.html
- Reduced motion: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
Creative-direction reference consulted for this revision:
- Awwwards skill by juliobsz: https://github.com/juliobsz/skills/blob/main/awwwards/SKILL.md
- Tathva ’26, requested visual reference: https://tathva.org/ — animation inspection pending a playable page or supplied clip; do not describe the proposed passage as a verified copy of its effect.
11. Delivery sequence and acceptance tests
These milestones describe the complete template. For the current continuation, inspect what is already complete and apply only the necessary changes from Sections 5 and 13; do not restart completed foundation work.
Milestone A — Template foundation
Set up layout, theme tokens, data/asset configuration, placeholder artwork, routes, and empty states. All page content must be usable without motion. Deliver a short asset replacement guide.
Milestone B — Signature scroll sequence
Implement logo → sliding wave image → mascot → pencil transformation → masked-eye approach → cinematic flow passage → celebrity/special guest when enabled, otherwise Artist 1. Check the entire sequence forward and backward before adding the subordinate finishing details in Section 6.
Milestone C — Remaining content and registration
Continue through the optional celebrity/special guest → Artist 1 → Artist 2 → conditional sponsors. Preserve event listing/detail pages, schedule scaffold, Google Form link states on supporting pages, and navigation shortcuts. Remove the old homepage competition/program section and update its links and animation triggers.
Milestone D — Verification and handoff
Run a production build, browser-check the supported viewports and reduced motion, verify routes and outgoing links, and provide evidence with known limitations. Do not report browser/performance checks as passed if the environment cannot run them.
ID	Acceptance check
A1	A fresh checkout can install documented dependencies and produce a successful static production build.
A2	The first viewport shows the Pravaha identity without requiring a scroll or artificial wait.
A3	All opening stages appear in the agreed order and reverse without losing alignment.
A4	The mascot becomes recognisable pencil line art while its separate mask remains coloured.
A5	The camera approaches the configured eye, crosses the retained gold mask rim, travels through a distinct layered passage, and arrives at the first enabled line-up scene without a flash, reset, or duplicate interactive controls. Guest/artist content is not readable through the eye before arrival.
A6	Skip intro, line-up/artist anchors, Events navigation, browser Back, and direct route reloads work. No navigation points to a removed homepage competition section.
A7	Changing placeholder logo, guest, artist, or supporting-page event art and content through configuration requires no component edits. Missing paths show fallbacks.
A8	A different documented eye anchor/path changes the portal origin without editing timeline code.
A9	A configured form opens correctly; unset and closed states do not navigate to fake URLs.
A10	No empty production sponsor section appears. Adding a configured sponsor displays it last before the footer. Development previews are visibly labelled.
A11	Reduced mode contains the same information with ordinary scrolling and no long empty pin space.
A12	Phone, tablet, and desktop layouts preserve the intended composition, readable text, and accessible controls without page overflow.
A13	Schedule and artist announcement states contain no invented dates, people, bookings, or partnerships.
A14	Build/browser checks and measured performance results are recorded with the tested viewport/profile and any unresolved limits.
A15	First scroll moves an actual wave-image/SVG silhouette; its body fully covers the outgoing composition before the mascot is revealed. The wipe has no exposed corners on phone or landscape layouts.
A16	Passage far, middle, and near groups move at visibly different rates, with foreground occlusion supporting a sense of travelling through space. A static circular reveal alone fails this check.
A17	Slow forward scroll, reverse scroll, a quick flick across the transition, and stopping inside the passage all leave a coherent visual state with no autoplay camera continuation.
A18	Screenshot checkpoints and a short scroll recording demonstrate the wave cover, full mascot, sketch/mask separation, eye approach, threshold crossing, passage midpoint, and stable arrival on desktop and phone.
A19	With the guest enabled, the post-mascot homepage order is celebrity/special guest → Artist 1 → Artist 2 → sponsors. With the guest disabled, the portal and Skip intro lead directly to Artist 1 with no gap.
A20	The homepage contains no competition/program cards, rules, event-detail blocks, or competition registration buttons. /events and /events/:slug retain those functions and remain accessible from navigation.


Use focused automated checks for routing, configuration states, and registration-link behaviour where useful. Use browser inspection for scene alignment, real scrolling, reverse progression, viewport changes, and focus behaviour; unit tests alone cannot verify these visual requirements.
12. Handoff and decisions that may arrive later
The implementer delivers source, production build instructions, editable content/asset/motion configuration, a working placeholder set, the replacement guide, and verification notes. Document which visual effects use temporary stand-ins.

The following must remain editable and do not block starting: final isolated mascot/sketch/mask, face-detail export, logo cutout, sliding wave images, passage layers, tentative guest appearance and its enabled state, two artist names/photos, sponsor list, event dates/venue, college wording, rules/team limits, coordinators, form URLs, exact flow material, and sketch background choice.

The builder can choose minor component boundaries, accessible font pairing, exact ribbon paths, easing within stages, and folder naming. Preserve the specified story and replacement contract. Ask the organiser only when a change would alter that story or introduce a new product feature.
Starting instruction for the developer
Continue the existing placeholder-driven website using this PRD. Preserve its completed foundation and supporting pages. Refine the logo-to-mascot reveal, aligned pencil transformation, and cinematic mask-eye passage, then use the revised homepage order: optional celebrity/special guest → Artist 1 → Artist 2 → sponsors. Keep every unknown fact in an honest announcement state and leave all art/content replaceable as final material arrives. Do not restart or scaffold a separate website.
13. Instruction for the next pass on the existing template
The core template has already been built in the organiser’s local project. This is a continuation of that work and the v1.1 motion pass, not a request to restart or scaffold another website. Inspect its README, asset-replacement guide, scene components, motion configuration, and current checks before changing anything. Preserve the working event routes, navigation, registration states, asset replacement structure, and reduced-motion experience.

Change the post-mascot destination and homepage content to: celebrity/special guest → Artist 1 → Artist 2 → sponsors. Make the guest optional and provide two distinct artist slots. Move the existing competition/program presentation off the homepage while retaining its event listing/detail pages. Update the portal arrival scene, Skip intro destination, anchors, trigger end states, and reduced-motion reading order to the new structure. The existing cinematic passage must arrive at whichever line-up scene is enabled first; it must not reveal the removed program layout.

Implement the sliding wave-image wipe first, then the eye approach/passage/arrival sequence, then the subordinate finishing details. Reuse the existing animation engine; introduce additional libraries only for a concrete unmet requirement. Keep all new art replaceable through the asset manifest and all pacing/geometry in configuration.

Read the installed Awwwards skill if available; otherwise consult the linked published guidance. Apply its composition, continuity, signature-moment, interaction-feedback, and visual-review principles within Pravaha’s established story and existing stack. Do not substitute a new visual concept or regenerate the mascot merely to add spectacle.

Inspect the production build in real scrolling, including intermediate frames. Re-run the existing checks and add only targeted checks for the new behaviour. Give the organiser a short before/after scroll recording and the exact remaining asset needs. Report unresolved reference access or performance problems honestly. This document changes the requirements; it does not claim that the organiser’s local code has already been modified or visually verified here.