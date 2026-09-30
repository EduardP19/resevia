'use client';

import React from 'react';
import { SectionHeading, Reveal } from '@/components/ui/motion';
import { AgentPlayground } from '@/components/demo/AgentPlayground';

export function DemoSection() {
  return (
    <section id="demo" className="relative scroll-mt-20 overflow-hidden bg-[#0C0A1D] py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-purple-light/60 to-transparent" />
        <div className="absolute left-1/2 top-1/3 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-brand-purple/20 blur-[140px]" />
        <div className="bg-grid-dark mask-fade-y absolute inset-0 opacity-60" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          dark
          eyebrow="Try it yourself"
          title={<>Don’t take our word for it. <span className="text-gold-shimmer">Talk to it.</span></>}
          subtitle="Pick a business, pick a channel, and message the receptionist like a real client would. Hair & Barbers is wired to the real Resevia agent. Watch its reasoning in the live trace."
        />
        <Reveal delay={0.1} className="mt-14">
          <AgentPlayground />
        </Reveal>
      </div>
    </section>
  );
}
