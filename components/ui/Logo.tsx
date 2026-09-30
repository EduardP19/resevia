'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MARK_BUBBLE_PATH, MARK_CHECK_PATH } from '@/lib/brand/mark';

type LogoProps = {
  className?: string;
  theme?: 'light' | 'dark';
  /** Hide the wordmark and show only the icon tile. */
  markOnly?: boolean;
  /** Hide the "AI Receptionist" line under the wordmark. */
  hideTagline?: boolean;
  /** Pixel size of the icon tile. */
  size?: number;
};

// Animated brand mark: the bubble ring draws itself, the tick lands,
// and the gold live-dot keeps pulsing — "always answering".
export function LogoMark({ size = 40, animated = true }: { size?: number; animated?: boolean }) {
  const id = React.useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className="shrink-0" aria-hidden="true">
      <defs>
        <linearGradient id={`tile-${id}`} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8B5CF6" />
          <stop offset="0.55" stopColor="#6D28D9" />
          <stop offset="1" stopColor="#271549" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill={`url(#tile-${id})`} />
      <motion.path
        d={MARK_BUBBLE_PATH}
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinejoin="round"
        initial={animated ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.path
        d={MARK_CHECK_PATH}
        fill="none"
        stroke="#C9A96E"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animated ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.9, ease: 'easeOut' }}
      />
      {animated && (
        <motion.circle
          cx="37.5"
          cy="10.5"
          r="3.4"
          fill="#C9A96E"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          style={{ originX: '37.5px', originY: '10.5px' }}
        />
      )}
      <circle cx="37.5" cy="10.5" r="3.4" fill="#C9A96E" stroke="#fff" strokeWidth="1.4" />
    </svg>
  );
}

export function Logo({ className = '', theme = 'light', markOnly = false, hideTagline = false, size = 40 }: LogoProps) {
  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {!markOnly && (
        <div className="flex flex-col justify-center">
          <span
            className={`font-display text-[1.45rem] font-extrabold leading-none tracking-[-0.03em] ${
              isDark ? 'text-white' : 'text-brand-black'
            }`}
          >
            resevia<span className="text-brand-gold">.</span>
          </span>
          {!hideTagline && (
            <span className="mt-1 text-[8.5px] font-bold uppercase leading-none tracking-[0.3em] text-brand-gold">
              AI Receptionist
            </span>
          )}
        </div>
      )}
    </div>
  );
}
