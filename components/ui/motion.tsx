'use client';

// Small motion primitives shared by every section.

import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import clsx from 'clsx';

// Fade + rise into view once.
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Number that counts up when scrolled into view, and re-animates when `value` changes.
export function CountUp({
  value,
  prefix = '',
  suffix = '',
  duration = 1.2,
  decimals = 0,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(current.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        current.current = v;
        setDisplay(v);
      },
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  const formatted = display.toLocaleString('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={clsx('tabular-nums', className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

// Card with a cursor-following glow and a subtle 3D tilt (disabled on touch).
export function SpotlightCard({
  children,
  className,
  glow = 'rgba(201,169,110,0.18)',
  tilt = true,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: string;
  tilt?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const rx = useSpring(0, { stiffness: 150, damping: 18 });
  const ry = useSpring(0, { stiffness: 150, damping: 18 });
  const background = useTransform([mx, my], ([x, y]) =>
    `radial-gradient(420px circle at ${x}px ${y}px, ${glow}, transparent 45%)`
  );

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    mx.set(x);
    my.set(y);
    if (tilt) {
      rx.set(((y / r.height) - 0.5) * -6);
      ry.set(((x / r.width) - 0.5) * 6);
    }
  }
  function onLeave() {
    mx.set(-400);
    my.set(-400);
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className={clsx('group relative overflow-hidden', className)}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

// Wrapper that pulls its child toward the cursor a little.
export function Magnetic({ children, strength = 0.25 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 15 });
  const y = useSpring(0, { stiffness: 200, damping: 15 });
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className="inline-block"
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

// Section title block used across the site.
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  dark = false,
  align = 'center',
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  dark?: boolean;
  align?: 'center' | 'left';
  className?: string;
}) {
  return (
    <Reveal
      className={clsx(
        'max-w-3xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {eyebrow && <span className={dark ? 'eyebrow-dark' : 'eyebrow-light'}>{eyebrow}</span>}
      <h2
        className={clsx(
          'mt-5 font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] sm:text-5xl',
          dark ? 'text-white' : 'text-brand-black'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={clsx('mt-5 text-base leading-relaxed sm:text-lg', dark ? 'text-white/60' : 'text-brand-gray')}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
