import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import { useAnalytics } from '@/components/analytics/AnalyticsProvider';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  logClick?: boolean;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  onClick,
  logClick = true,
  ...props 
}: ButtonProps) {
  const { logEvent } = useAnalytics();
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-brand-purple text-white hover:bg-brand-purple/90 focus:ring-brand-purple',
    secondary: 'bg-transparent border-2 border-brand-gold text-brand-gold hover:bg-brand-gold/10 focus:ring-brand-gold',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (logClick) {
      const buttonText = typeof children === 'string' ? children : 'unnamed_button';
      logEvent('BUTTON_CLICK', { button_text: buttonText });
    }
    if (onClick) onClick(e);
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
