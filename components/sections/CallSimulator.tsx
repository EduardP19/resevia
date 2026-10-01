'use client';

// "What happens when your phone rings?" — mirrors the three real voice modes
// in resevia-agent (business_profiles.voice_mode): reject → text-back,
// forward → your mobile, agent → AI voice receptionist.

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { SectionHeading, Reveal } from '@/components/ui/motion';
import { Icon } from '@/components/ui/Icons';

type Mode = 'textback' | 'agent' | 'forward';

const MODES: { id: Mode; title: string; plan: string; blurb: string; icon: any }[] = [
  { id: 'textback', title: 'Missed-call text-back', plan: 'All plans', blurb: 'Busy? The call is declined politely and the caller gets a WhatsApp — or SMS if WhatsApp isn’t available — within seconds.', icon: 'whatsapp' },
  { id: 'agent', title: 'AI voice receptionist', plan: 'Growth & Custom', blurb: 'A natural-sounding receptionist picks up, answers questions and books the appointment — then texts the confirmation.', icon: 'wave' },
  { id: 'forward', title: 'Forward to you', plan: 'All plans', blurb: 'Prefer to talk? Calls ring straight through to your mobile. Switch modes any time from your dashboard.', icon: 'forward' },
];

const TIMELINES: Record<Mode, { t: string; title: string; detail: string; tone: 'neutral' | 'gold' | 'green' }[]> = {
  textback: [
    { t: '0.0s', title: 'Call comes in', detail: '+44 7••• ••• 482 calls Amo Hair', tone: 'neutral' },
    { t: '0.3s', title: 'Declined politely', detail: 'No voicemail maze, no hold music', tone: 'neutral' },
    { t: '3.8s', title: 'WhatsApp sent', detail: '“Sorry we missed you! I’m Sophia — can I help you book?”', tone: 'gold' },
    { t: '+1m', title: 'Client replies', detail: 'Conversation continues on WhatsApp', tone: 'gold' },
    { t: '+3m', title: 'Booked into your diary', detail: 'Confirmation + reminder scheduled', tone: 'green' },
  ],
  agent: [
    { t: '0.0s', title: 'Call comes in', detail: '+44 7••• ••• 482 calls Brightside Dental', tone: 'neutral' },
    { t: '0.6s', title: 'AI receptionist answers', detail: '“Brightside Dental, this is Maya — how can I help?”', tone: 'gold' },
    { t: '0:40', title: 'Checks the diary live', detail: 'check_availability → 3 slots offered', tone: 'gold' },
    { t: '1:25', title: 'Appointment booked', detail: 'book_direct → Hygienist, Tue 09:30', tone: 'green' },
    { t: '1:31', title: 'Confirmation texted', detail: 'To the number they called from', tone: 'green' },
  ],
  forward: [
    { t: '0.0s', title: 'Call comes in', detail: '+44 7••• ••• 482 calls Forge Strength', tone: 'neutral' },
    { t: '0.2s', title: 'Forwarded to your mobile', detail: 'Rings you directly — agent stays out', tone: 'gold' },
    { t: 'Any time', title: 'Change mode instantly', detail: 'One switch in Settings → Phone Calls', tone: 'neutral' },
  ],
};

export function CallSimulator() {
  const [mode, setMode] = useState<Mode>('textback');
  const [running, setRunning] = useState(false);
  const [shown, setShown] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const steps = TIMELINES[mode];

  function clear() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function run() {
    clear();
    setShown(0);
    setRunning(true);
    steps.forEach((_, i) => {
      timers.current.push(setTimeout(() => setShown(i + 1), 500 + i * 1000));
    });
    timers.current.push(setTimeout(() => setRunning(false), 500 + steps.length * 1000));
  }

  useEffect(() => {
    clear();
    setShown(0);
    setRunning(false);
    return clear;
  }, [mode]);

  const active = MODES.find((m) => m.id === mode)!;

  return (
    <section className="relative overflow-hidden bg-[#0C0A1D] py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-20 h-[30rem] w-[30rem] rounded-full bg-brand-purple/25 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          dark
          eyebrow="Phone calls, handled"
          title={<>What happens when your <span className="text-gold-shimmer">phone rings?</span></>}
          subtitle="Choose how Resevia handles every call. Then press ring and watch."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <div className="flex flex-col gap-3">
            {MODES.map((m, i) => (
              <Reveal key={m.id} delay={i * 0.06}>
                <button
                  onClick={() => setMode(m.id)}
                  className={clsx(
                    'group w-full rounded-3xl border p-5 text-left transition-all sm:p-6',
                    mode === m.id ? 'border-brand-gold/50 bg-brand-gold/[0.07] shadow-[0_0_40px_-10px_rgba(201,169,110,0.4)]' : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={clsx('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors', mode === m.id ? 'bg-brand-gold text-brand-black' : 'bg-white/5 text-white/60')}>
                      <Icon name={m.icon} className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-lg font-semibold text-white">{m.title}</h3>
                        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">{m.plan}</span>
                      </div>
                      <AnimatePresence initial={false}>
                        {mode === m.id && (
                          <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden text-sm leading-relaxed text-white/55">
                            <span className="block pt-2">{m.blurb}</span>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Live simulation</p>
                  <p className="mt-1 font-display text-xl font-semibold text-white">{active.title}</p>
                </div>
                <button
                  onClick={run}
                  disabled={running}
                  className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-transform hover:scale-105 disabled:cursor-wait"
                  aria-label="Simulate a call"
                >
                  {running && <span className="absolute inset-0 animate-ring rounded-full bg-emerald-400/50" />}
                  <motion.span animate={running ? { rotate: [0, -15, 15, -15, 0] } : {}} transition={{ duration: 0.5, repeat: running ? Infinity : 0 }}>
                    <Icon name="phone" className="h-6 w-6" />
                  </motion.span>
                </button>
              </div>

              <div className="relative mt-8">
                {/* Track runs centre-to-centre of the first and last circle (h-10 → 20px inset). */}
                <div className="absolute bottom-5 left-[19px] top-5 w-px bg-white/10" />
                <motion.div
                  className="absolute left-[19px] top-5 w-px bg-gradient-to-b from-brand-gold to-emerald-400"
                  animate={{ height: shown > 1 ? `calc(${((shown - 1) / Math.max(1, steps.length - 1)) * 100}% - ${((shown - 1) / Math.max(1, steps.length - 1)) * 40}px)` : 0 }}
                  transition={{ duration: 0.6 }}
                />
                <ol className="space-y-5">
                  {steps.map((s, i) => {
                    const on = i < shown;
                    return (
                      <li key={s.title} className="relative flex gap-4">
                        {/* Opaque base so the track never shows through the tinted circle. */}
                        <div className="relative z-10 h-10 w-10 shrink-0 rounded-full bg-[#15111f]">
                        <motion.div
                          animate={{ scale: on ? 1 : 0.85, opacity: on ? 1 : 0.35 }}
                          className={clsx(
                            'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold',
                            on && s.tone === 'green' && 'border-emerald-400/60 bg-emerald-400/15 text-emerald-300',
                            on && s.tone === 'gold' && 'border-brand-gold/60 bg-brand-gold/15 text-brand-gold',
                            on && s.tone === 'neutral' && 'border-white/30 bg-white/10 text-white',
                            !on && 'border-white/10 bg-[#15111f] text-white/40'
                          )}
                        >
                          {on && s.tone === 'green' ? <Icon name="check" className="h-4 w-4" /> : i + 1}
                        </motion.div>
                        </div>
                        <motion.div animate={{ opacity: on ? 1 : 0.3, x: on ? 0 : -6 }} className="min-w-0 pt-1">
                          <p className="flex flex-wrap items-center gap-2 font-semibold text-white">
                            {s.title}
                            <span className="rounded-md bg-white/5 px-1.5 py-0.5 font-mono text-[10px] font-normal text-white/45">{s.t}</span>
                          </p>
                          <p className="mt-0.5 text-sm text-white/50">{s.detail}</p>
                        </motion.div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {!running && shown === 0 && (
                <p className="mt-8 text-center text-sm text-white/40">Press the green button to ring the business ☎️</p>
              )}
              {!running && shown === steps.length && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-center text-sm font-medium text-emerald-200">
                  {mode === 'forward' ? 'You stay in control — Resevia steps in whenever you want it to.' : 'Zero missed opportunities. You didn’t lift a finger.'}
                </motion.p>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
