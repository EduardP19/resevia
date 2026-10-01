'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import clsx from 'clsx';
import { SlotCounter } from '@/components/ui/SlotCounter';
import { Icon } from '@/components/ui/Icons';
import { Magnetic } from '@/components/ui/motion';
import { ROTATING_NOUNS } from '@/lib/industries';
import { useAnalytics } from '@/components/analytics/AnalyticsProvider';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${sx}px ${sy}px, rgba(139,92,246,0.18), transparent 70%)`;
  const { logEvent } = useAnalytics();

  return (
    <section
      ref={ref}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      className="relative overflow-hidden bg-[#0C0A1D] pb-16 pt-32 sm:pt-36 lg:pb-24 lg:pt-44"
    >
      {/* Backdrop: aurora + grid + cursor spotlight */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[36rem] w-[36rem] animate-aurora rounded-full bg-brand-purple/40 blur-[120px]" />
        <div className="absolute -right-32 top-20 h-[30rem] w-[30rem] animate-aurora rounded-full bg-brand-gold/20 blur-[120px] [animation-delay:-6s]" />
        <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] animate-aurora rounded-full bg-brand-purple-light/25 blur-[120px] [animation-delay:-12s]" />
        <div className="bg-grid-dark mask-radial absolute inset-0" />
      </div>
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: spotlight }} />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:px-8">
        <div className="text-center lg:text-left">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link
              href="/waitlist"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-1.5 pr-4 text-xs font-medium text-white/80 backdrop-blur-md transition-colors hover:border-brand-gold/40 sm:text-sm"
            >
              <span className="rounded-full bg-brand-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-black">New</span>
              Now onboarding 50 founding businesses
              <Icon name="arrowRight" className="h-3.5 w-3.5 text-brand-gold transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 font-display text-[2.6rem] font-bold leading-[1.02] tracking-[-0.035em] text-white sm:text-6xl lg:text-[4.6rem]"
          >
            Every call answered.
            <br />
            <span className="text-gold-shimmer">Every booking captured.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/60 sm:text-xl lg:mx-0"
          >
            <span className="block">
              The AI receptionist for your <RotatingWord words={ROTATING_NOUNS.map((w) => `${w}.`)} />
            </span>
            <span className="mt-1 block">It answers calls, replies on SMS and WhatsApp, and books clients straight into your diary — 24/7.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start"
          >
            <Magnetic>
              <Link
                href="#demo"
                onClick={() => logEvent('BUTTON_CLICK', { button_text: 'hero_test_agent' })}
                className="group relative flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-brand-gold px-7 py-4 text-base font-bold text-brand-black shadow-[0_0_40px_rgba(201,169,110,0.4)] transition-shadow hover:shadow-[0_0_60px_rgba(201,169,110,0.6)]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <Icon name="play" className="h-4 w-4" />
                Test the agent live
              </Link>
            </Magnetic>
            <Link
              href="/waitlist"
              onClick={() => logEvent('BUTTON_CLICK', { button_text: 'hero_waitlist' })}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.03] px-7 py-4 text-base font-semibold text-white backdrop-blur-md transition-colors hover:border-white/30 hover:bg-white/[0.06]"
            >
              Get first month free
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mx-auto mt-6 max-w-sm lg:mx-0 [&>div]:mx-0 [&>div]:max-w-none">
            <p className="text-center text-sm font-medium text-brand-gold lg:text-left">🎁 £0 setup (worth £499) + first month free</p>
            <SlotCounter theme="dark" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[360px]"
        >
          <HeroPhone />
        </motion.div>
      </div>

      <ChannelStrip />
    </section>
  );
}

function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % words.length), 2200);
    return () => clearInterval(t);
  }, [words.length]);
  // Every word is stacked invisibly in the same grid cell, so the slot is
  // always as wide as the longest word. The paragraph never re-wraps when
  // the word changes, so nothing below it jumps.
  return (
    <span className="relative inline-grid whitespace-nowrap align-bottom">
      {words.map((w) => (
        <span key={w} aria-hidden className="invisible col-start-1 row-start-1 font-semibold">
          {w}
        </span>
      ))}
      <span className="col-start-1 row-start-1 overflow-hidden text-center lg:text-left">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={words[i]}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block font-semibold text-white"
          >
            {words[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

// Looping story: a missed call becomes a WhatsApp conversation becomes a booking.
const STORY = [
  { kind: 'call', ms: 2200 },
  { kind: 'missed', ms: 1400 },
  { kind: 'msg', from: 'agent', text: 'Hi Chloe, sorry we missed your call! I’m Sophia at Amo Hair 💜 Can I help you book?', ms: 1900 },
  { kind: 'msg', from: 'client', text: 'Yes please! Balayage this Saturday?', ms: 1500 },
  { kind: 'msg', from: 'agent', text: 'I have 10:00 or 13:30 on Saturday with Mia ✨ Which suits?', ms: 1600 },
  { kind: 'msg', from: 'client', text: '13:30 🙌', ms: 1300 },
  { kind: 'msg', from: 'agent', text: 'Booked ✅ Balayage · Sat 13:30 · Amo Hair. Reminder coming Friday!', ms: 1500 },
  { kind: 'won', ms: 3200 },
] as const;

function HeroPhone() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setStep((s) => (s + 1) % STORY.length), STORY[step].ms);
    return () => clearTimeout(t);
  }, [step]);

  const calling = step === 0;
  const msgs = STORY.slice(0, step + 1).filter((s) => s.kind === 'msg') as unknown as { from: string; text: string }[];
  const showMissed = step >= 1;
  const won = step === STORY.length - 1;

  return (
    <div className="relative">
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-brand-purple/40 via-transparent to-brand-gold/25 blur-2xl" />

      {/* Floating chips */}
      <motion.div
        className="absolute -left-4 top-24 z-[9999] hidden rounded-2xl border border-white/10 bg-[#171230]/90 px-4 py-3 shadow-2xl backdrop-blur-xl sm:block lg:-left-16"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Replied in</p>
        <p className="font-display text-xl font-bold text-white">4 sec</p>
      </motion.div>
      <motion.div
        className="absolute -right-4 bottom-32 z-[9999] hidden rounded-2xl border border-emerald-400/30 bg-[#0f2a22]/90 px-4 py-3 shadow-2xl backdrop-blur-xl sm:block lg:-right-14"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/70">Booked into</p>
        <p className="flex items-center gap-1.5 text-sm font-semibold text-white">
          <Icon name="calendar" className="h-4 w-4 text-emerald-300" /> Your calendar
        </p>
      </motion.div>

      <div className="rounded-[2.8rem] border border-white/15 bg-gradient-to-b from-[#221a3d] to-[#0b0917] p-2.5 shadow-[0_50px_120px_-20px_rgba(109,40,217,0.6)]">
        <div className="relative isolate h-[500px] overflow-hidden rounded-[2.3rem] sm:h-[560px] bg-[#EFE7DE]">
          <div className="absolute left-1/2 top-2.5 z-30 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

          {/* WhatsApp chrome */}
          <div className="flex items-center gap-3 bg-[#075E54] px-4 pb-3 pt-11 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold text-xs font-bold text-brand-black">AH</div>
            <div>
              <p className="text-sm font-semibold">Amo Hair Studio</p>
              <p className="text-[11px] text-white/70">{step >= 2 && !won ? 'typing…' : 'online'}</p>
            </div>
          </div>

          <div className="space-y-2 px-3 py-4" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.035) 1px, transparent 1px)', backgroundSize: '14px 14px' }}>
            {showMissed && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto flex w-fit items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[11px] text-rose-500 shadow-sm">
                <Icon name="phoneMissed" className="h-3.5 w-3.5" /> Missed voice call · 14:02
              </motion.div>
            )}
            <AnimatePresence>
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  className={clsx('flex', m.from === 'client' ? 'justify-end' : 'justify-start')}
                >
                  <div className={clsx('max-w-[80%] rounded-lg px-3 py-2 text-[13px] leading-snug text-[#111B21] shadow-sm', m.from === 'client' ? 'rounded-tr-none bg-[#D9FDD3]' : 'rounded-tl-none bg-white')}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Incoming call overlay */}
          <AnimatePresence>
            {calling && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-between bg-gradient-to-b from-[#2a1d4f] to-[#0c0a1d] pb-16 pt-24 text-white"
              >
                <div className="text-center">
                  <p className="text-sm text-white/50">Incoming call…</p>
                  <p className="mt-2 font-display text-3xl font-semibold">Chloe M.</p>
                  <p className="text-sm text-white/50">Mobile · 07••• ••• 482</p>
                </div>
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <span className="absolute inset-0 animate-ring rounded-full bg-emerald-400/40" />
                  <span className="absolute inset-0 animate-ring rounded-full bg-emerald-400/30 [animation-delay:0.5s]" />
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500">
                    <Icon name="phone" className="h-7 w-7" />
                  </div>
                </div>
                <p className="px-8 text-center text-xs text-white/40">You’re mid-appointment. Resevia’s got it.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Win toast */}
          <AnimatePresence>
            {won && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="absolute inset-x-3 bottom-4 z-20 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0C0A1D]/95 p-3.5 text-white shadow-2xl backdrop-blur-xl"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                  <Icon name="check" className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Missed call → booking</p>
                  <p className="text-xs text-white/50">Balayage · Saturday 13:30</p>
                </div>
                <p className="font-display text-lg font-bold text-brand-gold">£160</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ChannelStrip() {
  const items = ['SMS', 'WhatsApp', 'AI Voice', 'Google Calendar', 'Cal.com', 'Fresha', 'Timely', 'Phorest', 'Missed-call text-back', 'Reminders', 'Owner alerts'];
  return (
    <div className="relative mt-20 border-y border-white/[0.06] bg-white/[0.015] py-5">
      <p className="sr-only">Channels and integrations</p>
      <div className="mask-fade-x flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
          {[...items, ...items].map((t, i) => (
            <span key={i} className="flex shrink-0 items-center gap-3 whitespace-nowrap font-display text-sm font-semibold uppercase tracking-[0.18em] text-white/35">
              <span className="h-1 w-1 rounded-full bg-brand-gold/60" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
