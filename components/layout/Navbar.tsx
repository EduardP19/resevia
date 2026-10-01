'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import clsx from 'clsx';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icons';
import { NAV_LINKS } from '@/lib/site';
import { useAnalytics } from '@/components/analytics/AnalyticsProvider';

export function Navbar() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { logEvent } = useAnalytics();

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

  // Close the mobile menu on navigation and lock scroll while it's open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
        <nav
          className={clsx(
            'relative mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border px-3 pl-4 transition-all duration-500 sm:px-4 sm:pl-5',
            scrolled || open
              ? 'border-white/10 bg-[#0C0A1D]/90 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl'
              : 'border-white/[0.08] bg-[#0C0A1D]/85 backdrop-blur-md'
          )}
        >
          <Link href="/" className="flex items-center" aria-label="Resevia home">
            <Logo theme="dark" size={36} />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => {
              const active = l.href === pathname;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={clsx(
                    'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    active ? 'text-white' : 'text-white/60 hover:text-white'
                  )}
                >
                  {active && <motion.span layoutId="nav-active" className="absolute inset-0 -z-10 rounded-full bg-white/10" />}
                  {l.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/#demo"
              onClick={() => logEvent('BUTTON_CLICK', { button_text: 'nav_try_agent' })}
              className="hidden items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-brand-gold/60 hover:text-brand-gold sm:inline-flex"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Test the agent
            </Link>
            <Link
              href="/waitlist"
              onClick={() => logEvent('BUTTON_CLICK', { button_text: 'nav_secure_offer' })}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-gold px-4 py-2.5 text-sm font-bold text-brand-black shadow-[0_0_24px_rgba(201,169,110,0.35)] transition-all hover:bg-[#d8bb84] hover:shadow-[0_0_34px_rgba(201,169,110,0.55)]"
            >
              <span className="hidden sm:inline">Secure my offer</span>
              <span className="sm:hidden">Get offer</span>
            </Link>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white hover:bg-white/10 lg:hidden"
            >
              <Icon name={open ? 'x' : 'menu'} className="h-5 w-5" />
            </button>
          </div>

          <motion.div
            style={{ scaleX: progress }}
            className="absolute inset-x-4 bottom-0 h-px origin-left bg-gradient-to-r from-brand-purple-light via-brand-gold to-brand-gold"
          />
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#0C0A1D]/95 px-5 pb-10 pt-28 backdrop-blur-2xl lg:hidden"
          >
            <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-brand-purple/40 blur-3xl" />
            <nav className="relative flex flex-col">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-white/10 py-5 font-display text-2xl font-semibold text-white"
                  >
                    {l.label}
                    <Icon name="arrowRight" className="h-5 w-5 text-brand-gold" />
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-8 grid gap-3">
                <Link href="/#demo" onClick={() => setOpen(false)} className="rounded-2xl border border-white/15 py-4 text-center font-semibold text-white">
                  Test the agent live
                </Link>
                <Link href="/waitlist" onClick={() => setOpen(false)} className="rounded-2xl bg-brand-gold py-4 text-center font-bold text-brand-black">
                  Secure my founding offer
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
