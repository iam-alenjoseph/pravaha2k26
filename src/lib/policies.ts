import type { RegistrationState, ScheduleRecord } from '../types';

export function registrationAction(state: RegistrationState, url: string | null): { label: string; href: string | null } {
  if (state === 'closed') return { label: 'Registration closed', href: null };
  let safe = false;
  try {
    const parsed = new URL(url ?? '');
    safe = parsed.protocol === 'https:' && (parsed.hostname === 'forms.gle' || (parsed.hostname === 'docs.google.com' && parsed.pathname.startsWith('/forms/')));
  } catch { /* Missing or malformed forms stay in the announcement state. */ }
  return state === 'open' && safe
    ? { label: 'Register · Google Form', href: url }
    : { label: 'Registration opening soon', href: null };
}

export function portalCamera(viewport: { width: number; height: number }, eye: { x: number; y: number }, canvas: { width: number; height: number }, scale: number) {
  return { x: viewport.width / 2 - eye.x * canvas.width * scale, y: viewport.height / 2 - eye.y * canvas.height * scale, scale };
}

export function orderedSchedule<T extends ScheduleRecord>(records: T[]): T[] {
  return records.filter(record => record.published && Number.isFinite(Date.parse(record.startsAt))).sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
}

export function safeExternal(url: string | undefined | null): string | undefined {
  try { const parsed = new URL(url ?? ''); return ['https:', 'mailto:', 'tel:'].includes(parsed.protocol) ? parsed.href : undefined; } catch { return undefined; }
}
