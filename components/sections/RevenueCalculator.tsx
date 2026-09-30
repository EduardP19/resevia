'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CountUp, Reveal, SectionHeading } from '@/components/ui/motion';
import { Icon } from '@/components/ui/Icons';

// "Sound familiar?" + an interactive missed-revenue estimate.
// Every number is driven by the visitor's own inputs; assumptions are shown.

const PAINS = [
  { icon: 'phoneMissed', title: 'Missed calls mid-appointment', body: 'You’re with a client. The phone rings out. They book elsewhere.' },
  { icon: 'clock', title: 'Enquiries after closing', body: 'Evening DMs and texts sit until morning — by then the lead is cold.' },
  { icon: 'calendar', title: 'No-shows with no warning', body: 'Empty chairs you’ve already turned other clients away for.' },
] as const;

function Slider({
  label, value, min, max, step = 1, onChange, format,
}: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; format: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="block">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <span className="text-sm text-white/60">{label}</span>
        <span className="font-display text-xl font-bold tabular-nums text-white">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-gold"
        style={{ background: `linear-gradient(90deg, #C9A96E ${pct}%, rgba(255,255,255,0.1) ${pct}%)`, borderRadius: 999, height: 6 }}
      />
    </label>
  );
}

export function RevenueCalculator() {
  const [calls, setCalls] = useState(12);
  const [value, setValue] = useState(65);
  const [lostShare, setLostShare] = useState(60);

  const { monthlyLost, yearlyLost, recovered } = useMemo(() => {
    const weeklyLost = calls * value * (lostShare / 100);
    const monthlyLost = Math.round(weeklyLost * 4.33);
    const yearlyLost = Math.round(weeklyLost * 52);
    // Assume Resevia wins back ~70% of those callers with an instant reply.
    const recovered = Math.round(monthlyLost * 0.7);
    return { monthlyLost, yearlyLost, recovered };
  }, [calls, value, lostShare]);

  const paysFor = Math.max(0, Math.round(recovered / 179));

  return (
    <section className="relative overflow-hidden bg-brand-light py-24 sm:py-32">
      <div className="bg-grid-light mask-radial pointer-events-none absolute inset-0 opacity-70" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Sound familiar?"
          title={<>Every missed call is a <span className="text-purple-gold">missed booking.</span></>}
          subtitle="You’re skilled at what you do — not at answering the phone with your hands full. Here’s what that silence costs."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {PAINS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="group h-full rounded-3xl border border-brand-purple/10 bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(109,40,217,0.25)]">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 transition-transform group-hover:scale-110">
                  <Icon name={p.icon} className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-brand-black">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-gray">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="relative mt-8 overflow-hidden rounded-[2rem] bg-[#0C0A1D] p-6 shadow-[0_40px_100px_-30px_rgba(39,21,73,0.7)] sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-purple/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-brand-gold/15 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <span className="eyebrow-dark">Missed-revenue calculator</span>
                <h3 className="mt-5 font-display text-2xl font-bold text-white sm:text-3xl">What is your phone costing you?</h3>
                <div className="mt-8 space-y-8">
                  <Slider label="Calls & messages you miss per week" value={calls} min={1} max={60} onChange={setCalls} format={(v) => `${v}`} />
                  <Slider label="Average booking value" value={value} min={15} max={400} step={5} onChange={setValue} format={(v) => `£${v}`} />
                  <Slider label="Of those, how many book elsewhere" value={lostShare} min={10} max={100} step={5} onChange={setLostShare} format={(v) => `${v}%`} />
                </div>
                <p className="mt-6 text-xs leading-relaxed text-white/35">
                  Your estimate, from your numbers. Recovery assumes an instant reply wins back ~70% of those clients.
                </p>
              </div>

              <div className="flex flex-col justify-between gap-6">
                <div className="rounded-3xl border border-rose-400/20 bg-rose-400/[0.06] p-6">
                  <p className="text-sm text-rose-200/70">You could be losing</p>
                  <p className="mt-1 font-display text-5xl font-bold tracking-tight text-white sm:text-6xl">
                    <CountUp value={yearlyLost} prefix="£" duration={0.8} />
                  </p>
                  <p className="mt-1 text-sm text-white/50">a year · <CountUp value={monthlyLost} prefix="£" duration={0.8} /> a month</p>
                </div>

                <div className="rounded-3xl border border-brand-gold/30 bg-gradient-to-br from-brand-gold/15 to-transparent p-6">
                  <p className="text-sm text-brand-gold/80">Resevia could win back</p>
                  <p className="mt-1 font-display text-4xl font-bold tracking-tight text-brand-gold sm:text-5xl">
                    <CountUp value={recovered} prefix="£" suffix="/mo" duration={0.8} />
                  </p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-brand-gold to-[#F5E6C4]"
                      animate={{ width: `${Math.min(100, (paysFor / 20) * 100)}%` }}
                      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-white/60">
                    That’s <span className="font-semibold text-white">{paysFor}×</span> the cost of the Growth plan.
                  </p>
                </div>

                <Link href="#demo" className="group flex items-center justify-center gap-2 rounded-2xl bg-white py-4 font-semibold text-brand-black transition-colors hover:bg-brand-cream">
                  See how it wins them back
                  <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
