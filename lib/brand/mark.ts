// The Resevia mark as raw SVG — single source for the favicon, the Apple
// touch icon and the static /logo.svg. The React <Logo /> draws the same
// geometry so the animated and static versions never drift apart.
//
// Concept: a speech bubble drawn as an almost-closed ring ("always on"),
// holding a gold tick ("booking captured"), with a gold live-dot in the
// corner ("someone is always answering").

export const MARK_BUBBLE_PATH =
  'M24 11A12 12 0 1 1 16.6 32.46L12.5 35.5L12.72 27.1A12 12 0 0 1 24 11Z';
export const MARK_CHECK_PATH = 'M18.6 23.4l3.8 3.8 7.4-7.6';

export function markSvg({ rounded = true }: { rounded?: boolean } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <defs>
    <linearGradient id="rv-tile" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#8B5CF6"/>
      <stop offset="0.55" stop-color="#6D28D9"/>
      <stop offset="1" stop-color="#271549"/>
    </linearGradient>
  </defs>
  <rect width="48" height="48" rx="${rounded ? 14 : 0}" fill="url(#rv-tile)"/>
  <path d="${MARK_BUBBLE_PATH}" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/>
  <path d="${MARK_CHECK_PATH}" fill="none" stroke="#C9A96E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="37.5" cy="10.5" r="3.4" fill="#C9A96E" stroke="#fff" stroke-width="1.4"/>
</svg>`;
}
