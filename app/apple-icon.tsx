import { ImageResponse } from 'next/og';

// Apple touch icon (home-screen bookmark on iOS / iPadOS)
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// The Resevia mark (spirograph + receptionist glyph) rendered on a soft brand background.
const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6D28D9" />
      <stop offset="100%" stop-color="#C9A96E" />
    </linearGradient>
  </defs>
  <g>
    <ellipse cx="50" cy="50" rx="35" ry="15" fill="none" stroke="url(#g)" stroke-width="3.5" transform="rotate(0 50 50)"/>
    <ellipse cx="50" cy="50" rx="35" ry="15" fill="none" stroke="url(#g)" stroke-width="3.5" transform="rotate(60 50 50)"/>
    <ellipse cx="50" cy="50" rx="35" ry="15" fill="none" stroke="url(#g)" stroke-width="3.5" transform="rotate(120 50 50)"/>
    <ellipse cx="50" cy="50" rx="35" ry="15" fill="none" stroke="url(#g)" stroke-width="3.5" transform="rotate(180 50 50)"/>
    <ellipse cx="50" cy="50" rx="35" ry="15" fill="none" stroke="url(#g)" stroke-width="3.5" transform="rotate(240 50 50)"/>
    <ellipse cx="50" cy="50" rx="35" ry="15" fill="none" stroke="url(#g)" stroke-width="3.5" transform="rotate(300 50 50)"/>
  </g>
  <g transform="translate(50, 52)">
    <circle cx="0" cy="-10" r="8" fill="url(#g)"/>
    <path d="M -15 11 C -15 0, 15 0, 15 11 L 15 16 L -15 16 Z" fill="url(#g)"/>
  </g>
</svg>`;

export default function AppleIcon() {
  const src = `data:image/svg+xml;utf8,${encodeURIComponent(mark)}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F9F8FF',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={150} height={150} alt="Resevia" />
      </div>
    ),
    { ...size }
  );
}
