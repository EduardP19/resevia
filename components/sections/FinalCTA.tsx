'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { WaitlistForm } from '@/components/ui/WaitlistForm';
import { SlotCounter } from '@/components/ui/SlotCounter';
import { Reveal } from '@/components/ui/motion';
import { Icon } from '@/components/ui/Icons';
import { LogoMark } from '@/components/ui/Logo';

export function FinalCTA() {
  const [currentSignedUps, setCurrentSignedUps] = useState<number | undefined>(undefined);

  useEffect(() => {
    const signedUpCookie = Cookies.get('resevia_signed_up');
    if (signedUpCookie) {
      const parsed = parseInt(signedUpCookie, 10);
      if (!isNaN(parsed)) setCurrentSignedUps(parsed);
      return;
    }
    const legacySlotsCookie = Cookies.get('resevia_slots');
    if (legacySlotsCookie) {
      const parsedLegacySlots = parseInt(legacySlotsCookie, 10);
      if (!isNaN(parsedLegacySlots)) setCurrentSignedUps(Math.max(0, Math.min(50, 50 - parsedLegacySlots)));
    }
  }, []);

  return (
    <section id="join" className="relative scroll-mt-20 overflow-hidden bg-[#0C0A1D] py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-purple/30 blur-[150px]" />
        <div className="bg-grid-dark mask-radial absolute inset-0" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <LogoMark size={56} />
          <h2 className="mt-8 font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl">
            Stop missing bookings. <span className="text-gold-shimmer">Start with Resevia.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/60">
            Join the waitlist to lock in free setup worth £499 and your first month free. Limited to the first 50 businesses.
          </p>
          <ul className="mt-8 space-y-3">
            {['Free setup worth £499 + first month free', 'Founding member status — priority support', 'No credit card to reserve your spot'].map((t) => (
              <li key={t} className="flex items-center gap-3 text-white/80">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold"><Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} /></span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-8 max-w-sm [&>div]:mx-0">
            <SlotCounter theme="dark" signedUpOverride={currentSignedUps} />
          </div>
          <Link href="#demo" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-brand-gold">
            Not sure yet? Test the agent first <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative rounded-[2rem] bg-gradient-to-b from-brand-gold/60 via-white/10 to-brand-purple/40 p-px">
            <div className="rounded-[calc(2rem-1px)] bg-white p-6 shadow-2xl sm:p-10">
              <p className="mb-1 font-display text-2xl font-bold text-brand-black">Secure your founding spot</p>
              <p className="mb-6 text-sm text-brand-gray">Takes 30 seconds.</p>
              <WaitlistForm onSignupIncrement={setCurrentSignedUps} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
