import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display font-bold text-2xl tracking-tight text-brand-black">Resevia</span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/how-it-works" className="text-sm font-medium text-brand-gray hover:text-brand-purple transition-colors">
              How It Works
            </Link>
            <Link href="/industries" className="text-sm font-medium text-brand-gray hover:text-brand-purple transition-colors">
              Industries
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-brand-gray hover:text-brand-purple transition-colors">
              Pricing
            </Link>
          </div>
          
          <div className="flex items-center">
            <Link href="/waitlist">
              <Button size="md">Join the Waitlist</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
