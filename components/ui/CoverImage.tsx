'use client';

import React, { useState } from 'react';

interface CoverImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

// Renders a post's local cover image (/blog/<slug>.png) and, if that file isn't
// present yet, falls back to an on-brand gradient placeholder with the wordmark —
// so the blog never shows a broken image.
export function CoverImage({ src, alt, className = '' }: CoverImageProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-tr from-brand-purple via-[#7c3aed] to-brand-gold ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="font-display font-bold text-white/90 text-2xl tracking-tight">Resevia</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}
