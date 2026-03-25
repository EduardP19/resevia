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
              strokeWidth="1.2"
              initial={{ rotate }}
              style={{ originX: 0.5, originY: 0.5 }}
              animate={{
                rotate: [rotate, rotate + 360],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
          
          {/* Central Human Silhouette (Head and Shoulders) */}
          <g transform="translate(50, 52)">
            {/* Head */}
            <circle 
              cx="0" cy="-10" r="6" 
              fill="url(#logo-gradient)" 
            />
            {/* Shoulders/Body */}
            <path 
              d="M -12 8 C -12 0, 12 0, 12 8 L 12 12 L -12 12 Z" 
              fill="url(#logo-gradient)" 
            />
          </g>
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
