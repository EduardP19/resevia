'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading, Reveal } from '@/components/ui/motion';
import { Icon } from '@/components/ui/Icons';

const STEPS = [
  { icon: 'user', title: 'Tell us about your business', time: '15 minutes', body: 'Services, prices, team, opening hours and booking rules. One simple form — no tech skills needed.' },
  { icon: 'sparkle', title: 'We train your receptionist', time: '24–48 hours', body: 'We set up your agent on your knowledge, tone and calendar. You test it and approve before anything goes live.' },
  { icon: 'bolt', title: 'Go live on every channel', time: 'Same day', body: 'Your number, WhatsApp and calls — answered 24/7. We review real conversations monthly and keep improving.' },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-brand-cream/60 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Live in days, not months"
          title={<>Three steps. <span className="text-purple-gold">We do the heavy lifting.</span></>}
          subtitle="White-glove setup is included. You focus on clients — we handle the tech."
        />

        <div className="relative mt-16 grid gap-6 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-[3.25rem] hidden h-px bg-brand-purple/15 md:block">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
              className="h-full origin-left bg-gradient-to-r from-brand-purple via-brand-purple-light to-brand-gold"
            />
          </div>

          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.15}>
              <div className="group relative h-full rounded-[1.75rem] border border-brand-purple/10 bg-white p-7 text-center transition-all hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(109,40,217,0.35)]">
                <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple-light to-brand-purple text-white shadow-[0_12px_30px_-8px_rgba(109,40,217,0.6)] transition-transform group-hover:rotate-6 group-hover:scale-110">
                  <Icon name={s.icon} className="h-6 w-6" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold text-[11px] font-bold text-brand-black ring-4 ring-white">{i + 1}</span>
                </div>
                <span className="mt-6 inline-block rounded-full bg-brand-light px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-purple">{s.time}</span>
                <h3 className="mt-3 text-xl font-semibold text-brand-black">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-gray">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
