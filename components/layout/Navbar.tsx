'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <motion.nav
      initial={false}
      animate={{
        backgroundColor: scrolled ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 1)",
        backdropFilter: scrolled ? "blur(10px)" : "blur(0px)",
        borderColor: scrolled ? "rgba(201, 169, 110, 0.4)" : "rgba(243, 244, 246, 1)"
      }}
      transition={{ duration: 0.2 }}
      className="fixed top-0 z-50 w-full border-b shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center transition-opacity hover:opacity-90">
              <Logo />
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
    </motion.nav>
  );
}
