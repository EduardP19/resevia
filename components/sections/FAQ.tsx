'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { SectionHeading, Reveal } from '@/components/ui/motion';
import { Icon } from '@/components/ui/Icons';

export type FaqItem = { q: string; a: string };

export const HOME_FAQS: FaqItem[] = [
  { q: 'Will clients know they’re talking to AI?', a: 'Your receptionist has its own name and speaks in your brand voice. It’s transparent if a client asks, and hands over to you whenever someone wants a person.' },
  { q: 'Which businesses is Resevia for?', a: 'Any business that runs on appointments — hair and beauty salons, barbers, aesthetic and private clinics, dental practices, physio and wellness, vets, gyms and PT studios, and more.' },
  { q: 'What booking systems does it work with?', a: 'Resevia books directly into your calendar and works alongside tools like Fresha, Treatwell, Timely, Phorest and Google Calendar. Tell us what you use during onboarding.' },
  { q: 'What if a client asks something the AI can’t handle?', a: 'It hands over. You get an alert, the conversation appears in your inbox, and you can take over mid-thread. For clinics it never gives medical advice and flags urgent cases straight away.' },
  { q: 'Can I check replies before they go out?', a: 'Yes. Turn on approval mode and every reply waits as a draft until you approve or edit it. Switch to autonomous whenever you’re comfortable.' },
  { q: 'Do I need to be technical?', a: 'Not at all. Setup is white-glove — you fill in one form and we do the rest. Most businesses are live within 48 hours.' },
  { q: 'Is there a setup fee or contract?', a: 'Setup is normally £499, but it’s free for our first 50 founding businesses — plus your first month free. Plans are monthly and you can cancel anytime.' },
];

export function FAQ({ items = HOME_FAQS, title }: { items?: FaqItem[]; title?: React.ReactNode }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="FAQ"
          title={title || <>Questions, <span className="text-purple-gold">answered.</span></>}
          subtitle={<>Something else? Email <a className="font-semibold text-brand-purple underline-offset-4 hover:underline" href="mailto:hello@resevia.co.uk">hello@resevia.co.uk</a> — a human replies.</>}
          className="lg:sticky lg:top-32 lg:self-start"
        />
        <Reveal delay={0.1}>
          <div className="divide-y divide-brand-purple/10 rounded-[1.75rem] border border-brand-purple/10 bg-brand-light/40">
            {items.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q}>
                  <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left sm:px-7">
                    <span className="font-semibold text-brand-black">{f.q}</span>
                    <span className={clsx('flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all', isOpen ? 'rotate-45 border-brand-purple bg-brand-purple text-white' : 'border-brand-purple/20 text-brand-purple')}>
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                        <p className="px-6 pb-6 leading-relaxed text-brand-gray sm:px-7">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
