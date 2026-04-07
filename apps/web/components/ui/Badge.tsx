import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span className={twMerge(clsx(
      'inline-flex items-center rounded-full bg-brand-gold/20 px-2.5 py-0.5 text-xs font-semibold text-brand-purple',
      className
    ))}>
      {children}
    </span>
  );
}
