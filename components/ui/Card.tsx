import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div 
      className={twMerge(clsx('bg-white rounded-xl border border-gray-100 p-6 shadow-sm', className))}
      {...props}
    >
      {children}
    </div>
  );
}
