import { ImageResponse } from 'next/og';
import { markSvg } from '@/lib/brand/mark';

// Apple touch icon (home-screen bookmark on iOS / iPadOS).
// iOS rounds the corners itself, so the tile is drawn square.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  const src = `data:image/svg+xml;utf8,${encodeURIComponent(markSvg({ rounded: false }))}`;

  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} width={180} height={180} alt="Resevia" />
    ),
    { ...size }
  );
}
