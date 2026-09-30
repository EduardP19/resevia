'use client';

import React from 'react';
import { SectionHeading } from '@/components/ui/motion';

const REVIEWS = [
  { name: 'Sarah Jenkins', business: 'Luxe Hair Studio', text: 'Resevia has completely transformed our front desk. We no longer miss calls when we’re busy with clients, and the AI books people straight into our calendar effortlessly.' },
  { name: 'Dr. James Aris', business: 'Aesthetics Medspa', text: 'Having a premium 24/7 receptionist answering FAQs in our brand’s tone of voice is a game changer. We’ve seen a 30% increase in consultation bookings in just two months.' },
  { name: 'Emma Wood', business: 'The Dental Practice', text: 'It’s like having another full-time staff member who works nights and weekends. Our patients absolutely love getting constant and instant replies to their messages.' },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-brand-gold">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 00.95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.75 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.17 0l-2.8 2.03c-.78.57-1.84-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12L2.98 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.69l1.07-3.29z" /></svg>
      ))}
    </div>
  );
}

export function Reviews() {
  const loop = [...REVIEWS, ...REVIEWS, ...REVIEWS];
  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Loved by owners" title={<>The front desk that <span className="text-purple-gold">never clocks out.</span></>} />
      </div>
      <div className="mask-fade-x mt-14 flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee-slow gap-5 pr-5 hover:[animation-play-state:paused]">
          {[...loop, ...loop].map((r, i) => (
            <figure key={i} className="w-[320px] shrink-0 rounded-[1.75rem] border border-brand-purple/10 bg-brand-light/60 p-7 sm:w-[380px]">
              <Stars />
              <blockquote className="mt-5 text-[15px] leading-relaxed text-brand-black/80">“{r.text}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple-light to-brand-purple text-sm font-bold text-white">
                  {r.name.split(' ').map((w) => w[0]).slice(-2).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-black">{r.name}</p>
                  <p className="text-xs font-medium text-brand-purple">{r.business}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
