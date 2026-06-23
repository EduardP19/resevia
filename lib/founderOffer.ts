// Single source of truth for the founding-member offer + the cookie-based
// signup counter shared by SlotCounter and WaitlistForm.

export const TOTAL_FOUNDER_SPOTS = 50;

// Believable baseline so the social-proof counter never reads "0 signed up" for
// a fresh visitor. The cookie only ever stores this browser's *real* increments;
// the baseline is added at display time (see displayedSignups).
export const BASELINE_SIGNUPS = 11;

export const SIGNED_UP_COOKIE_KEY = 'resevia_signed_up';
export const LEGACY_SLOTS_COOKIE_KEY = 'resevia_slots';

// Convert a raw stored increment count into the number shown to the visitor.
export function displayedSignups(rawCount: number): number {
  const safe = Number.isFinite(rawCount) && rawCount > 0 ? rawCount : 0;
  return Math.min(TOTAL_FOUNDER_SPOTS, BASELINE_SIGNUPS + safe);
}
