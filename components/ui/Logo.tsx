'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function Logo({ className = '', theme = 'light' }: { className?: string, theme?: 'light' | 'dark' }) {
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-brand-black';
  const subtitleColor = '#C9A96E'; // Gold color for subtitle

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Intricate Geometric Icon */}
      <div className="relative w-12 h-12 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6D28D9" />
              <stop offset="100%" stopColor="#C9A96E" />
            </linearGradient>
          </defs>
          
          {/* Spirograph Pattern - 6 Overlapping ellipses */}
          {[0, 60, 120, 180, 240, 300].map((rotate, i) => (
            <motion.ellipse
              key={i}
              cx="50" cy="50" rx="35" ry="15"
              fill="none"
              stroke="url(#logo-gradient)"
              strokeWidth="1.5"
              initial={{ rotate }}
              style={{ originX: 0.5, originY: 0.5 }}
              animate={{
                rotate: [rotate, rotate + 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
          
          {/* Inner details to match the complexity */}
          {[30, 90, 150, 210, 270, 330].map((rotate, i) => (
            <motion.ellipse
              key={`inner-${i}`}
              cx="50" cy="50" rx="20" ry="8"
              fill="none"
              stroke="url(#logo-gradient)"
              strokeWidth="1"
              opacity={0.6}
              initial={{ rotate }}
              style={{ originX: "50px", originY: "50px" }}
            />
          ))}
          
          <circle cx="50" cy="50" r="42" fill="none" stroke="url(#logo-gradient)" strokeWidth="0.5" opacity={0.3} />
        </svg>
      </div>

      <div className="flex flex-col justify-center">
        <span className={`text-2xl font-bold font-display leading-tight ${textColor} tracking-tight`}>
          Resevia
        </span>
        <span 
          className="text-[8px] font-bold tracking-[0.25em] uppercase leading-none"
          style={{ color: subtitleColor }}
        >
          Your AI Receptionist
        </span>
      </div>
    </div>
  );
}
