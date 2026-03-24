import React from 'react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 overflow-visible">
        {/* Purple Dot */}
        <circle cx="8" cy="34" r="4.5" fill="#6D28D9" />

        {/* Inner Gold Swoop */}
        <path d="M 12 29 C 14 22, 20 18, 26 18" stroke="#C9A96E" strokeWidth="3" strokeLinecap="round" />

        {/* Middle Gold Swoop */}
        <path d="M 9 24 C 12 12, 24 8, 36 10" stroke="#C9A96E" strokeWidth="3" strokeLinecap="round" />

        {/* Outer Gold Swoop */}
        <path d="M 6 19 C 10 0, 30 -2, 44 4" stroke="#C9A96E" strokeWidth="3" strokeLinecap="round" />
      </svg>

      <div className="flex flex-col justify-center translate-y-[2px]">
        <span className="font-display font-bold text-[28px] leading-[1] text-[#1C1917] tracking-tight">Resevia</span>
        <span className="text-[9.5px] font-bold text-[#C9A96E] tracking-[0.25em] mt-[3px] leading-none uppercase">Your AI Receptionist</span>
      </div>
    </div>
  );
}
