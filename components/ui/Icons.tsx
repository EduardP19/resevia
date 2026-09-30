// Line icons (24px grid, currentColor). Kept local so the site needs no icon library.

import React from 'react';
import type { IconName } from '@/lib/industries';

type P = React.SVGProps<SVGSVGElement>;
const base = (props: P) => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...props,
});

const PATHS: Record<string, React.ReactNode> = {
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 16l.7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7L19 16z" />,
  scissors: <><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M8.1 8.1L20 20M8.1 15.9L20 4" /></>,
  syringe: <path d="M18 2l4 4M15 5l4 4M17 7l-9.5 9.5M11 7l6 6M3 21l3.5-3.5M9.5 9.5l-5 5 5 5 5-5M12 12l2 2" />,
  tooth: <path d="M7 3c-2.5 0-4 2-4 4.5 0 3 1.5 4.5 2 7.5.4 2.7 1 6 2.5 6s1.5-4 2-5.5c.3-1 .9-1.5 2.5-1.5s2.2.5 2.5 1.5c.5 1.5.5 5.5 2 5.5s2.1-3.3 2.5-6c.5-3 2-4.5 2-7.5C21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3z" />,
  leaf: <path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10zM2 21c0-3 1.9-5.4 5.1-6" />,
  paw: <><circle cx="11" cy="4" r="2" /><circle cx="18" cy="8" r="2" /><circle cx="20" cy="16" r="2" /><path d="M9 10a5 5 0 015 5v3.5a3.5 3.5 0 01-6.8 1.1l-.5-1.4A3 3 0 005 16.3 3.5 3.5 0 019 10z" /><circle cx="4" cy="8" r="2" /></>,
  dumbbell: <path d="M6.5 6.5l11 11M21 21l-1-1M3 3l1 1M18 22l4-4M2 6l4-4M3 10l7-7M14 21l7-7" />,
  stethoscope: <><path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6 6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" /><path d="M8 15v1a6 6 0 006 6 6 6 0 006-6v-4" /><circle cx="20" cy="10" r="2" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  phone: <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z" />,
  phoneMissed: <><path d="M22 2l-6 6M16 2l6 6" /><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z" /></>,
  chat: <path d="M21 11.5a8.4 8.4 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.4 8.4 0 013.8-.9h.5a8.5 8.5 0 018 8v.5z" />,
  whatsapp: <path d="M3 21l1.65-3.8a9 9 0 113.4 2.9L3 21zM9 10a.5.5 0 001 0V9a.5.5 0 00-1 0v1zm0 0a5 5 0 005 5m0 0h1a.5.5 0 000-1h-1a.5.5 0 000 1z" />,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" /></>,
  bell: <path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 003.4 0" />,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4" />,
  book: <path d="M4 19.5A2.5 2.5 0 016.5 17H20V2H6.5A2.5 2.5 0 004 4.5v15zM4 19.5A2.5 2.5 0 006.5 22H20v-5" />,
  chart: <path d="M3 3v18h18M7 16l4-4 4 4 6-6" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" /></>,
  hand: <path d="M18 11V6a2 2 0 00-4 0v5M14 10V4a2 2 0 00-4 0v6M10 10.5V6a2 2 0 00-4 0v8a8 8 0 008 8h2a8 8 0 008-8v-3a2 2 0 00-4 0" />,
  mic: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v3" /></>,
  send: <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />,
  check: <path d="M20 6L9 17l-5-5" />,
  x: <path d="M18 6L6 18M6 6l12 12" />,
  arrowRight: <path d="M5 12h14M12 5l7 7-7 7" />,
  play: <path d="M6 4l14 8-14 8V4z" />,
  bolt: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" /></>,
  forward: <path d="M15 10l5 5-5 5M4 4v7a4 4 0 004 4h12" />,
  wave: <path d="M2 12h2M6 8v8M10 5v14M14 8v8M18 10v4M22 12h0" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  refresh: <path d="M21 12a9 9 0 01-15.5 6.2L3 16M3 12a9 9 0 0115.5-6.2L21 8M21 3v5h-5M3 21v-5h5" />,
  volume: <path d="M11 5L6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 010 7M19 5a10 10 0 010 14" />,
  volumeOff: <path d="M11 5L6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6" />,
  pound: <path d="M18 7a4 4 0 00-7.7-1.5C9.7 7 10 9 10 11v2c0 3-1 5-4 6h12M6 13h8" />,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  inbox: <path d="M22 12h-6l-2 3h-4l-2-3H2M5.5 5.1L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.5-6.9A2 2 0 0016.8 4H7.2a2 2 0 00-1.7 1.1z" />,
};

export function Icon({ name, ...props }: { name: IconName | keyof typeof PATHS } & P) {
  return <svg {...base(props)}>{PATHS[name as string]}</svg>;
}
