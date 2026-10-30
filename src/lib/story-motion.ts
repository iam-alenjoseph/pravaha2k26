export function smoothCameraProgress(value: number): number {
  const t = Math.max(0, Math.min(1, value));
  // Bounded acceleration and deceleration in aperture size, not an exponent of an exponent.
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function revealBeforeUncover(value: number): number {
  const t = Math.max(0, Math.min(1, value));
  return 1 - Math.pow(1 - t, 3);
}

/** Minimum scale covering the viewport inside a convex eye opening, measured only on resize. */
export function apertureCoverage(
  width: number, height: number, eye: { x: number; y: number },
  contains: (x: number, y: number) => boolean, safeScale: number,
): number {
  const covered = (scale: number) => [-1, 1].every(x => [-1, 1].every(y =>
    contains(eye.x + x * width / (2 * scale), eye.y + y * height / (2 * scale))));
  if (!covered(safeScale)) return safeScale;
  let lower = 0, upper = safeScale;
  for (let i = 0; i < 20; i++) {
    const candidate = (lower + upper) / 2;
    if (covered(candidate)) upper = candidate; else lower = candidate;
  }
  return upper;
}
