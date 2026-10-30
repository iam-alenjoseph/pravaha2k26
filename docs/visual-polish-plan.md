# Targeted visual polish — 31 October 2026

Continue PRD v1.2 and the existing stack, configurations, pages and reduced mode. Preserve the clean opening and fixed-head hand rig. No runtime dependencies.

Inspected the current desktop WebM using native FFmpeg frame decoding at 6, 7.5, 9, 16.8, 17.1, 17.7 and 18 seconds before product edits. Chromium 140's in-page video decoding returned blank frames, so that path was rejected; native frames show the actual recording. Confirmed the late fade, compressed final eye zoom and opaque near shapes.

1. Fade starts behind the covered wave; reach substantial visibility before the trailing curl exposes the face, then finish within 1% progress of wave exit.
2. Redistribute opening stops: mascot/pencil transition at 38%, pencil complete/eye approach at 58%, threshold at 82%, passage resolves at 91%, handoff at 100%. Use 540vh desktop / 460vh phone travel. Approach has ~130vh desktop scroll, versus 70vh before. Use one smooth acceleration/deceleration curve on perceived aperture growth, replacing accelerated exponential scaling.
3. Replace broad middle/near strokes with tapered transparent currents, preserve a clear central light, stagger depth rates, then carry the exit light toward the first resolved scene's background focus. Settle the portrait before readable text enters.
4. Verify slow/fast/reverse/paused states and actual camera alignment. Capture complete production homepage through both artists/footer and a labelled development preview with guest/sponsor slots. Keep empty sponsors and tentative guest off public production.
5. Fresh baseline is `performance-before-polish.json`: same gzip server, cold cache, Chromium 140, 390×844, 4× CPU, 150ms RTT, 200000 B/s down and 93750 B/s up. Hero-logo LCP 3660ms. Repeat unchanged profile after final build and report element/timing differences candidly.

Review correction: the previous conservative ellipse safety bound caused the actual gold rim to clear before the nominal approach ended. Measure the real convex aperture's viewport coverage only on resize, retain the ellipse as a fallback, and use 2% finishing overscan. A browser regression now checks visible rim at 76% and complete opening coverage at 82%, in addition to camera matrix pacing.

Recordings and still frames are visual evidence; tests alone are not the acceptance gate. Final assets remain replaceable SVG stand-ins.
