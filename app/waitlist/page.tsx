'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WaitlistForm } from '@/components/ui/WaitlistForm';
import { SlotCounter } from '@/components/ui/SlotCounter';
import { Icon } from '@/components/ui/Icons';
import { Reveal } from '@/components/ui/motion';

export default function WaitlistPage() {
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
    <div className="flex min-h-screen flex-col bg-[#0C0A1D]">
      <Navbar />
      <main className="relative flex-grow overflow-hidden pb-24 pt-32 sm:pt-40">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[36rem] w-[36rem] animate-aurora rounded-full bg-brand-purple/40 blur-[120px]" />
          <div className="absolute -right-32 bottom-0 h-[30rem] w-[30rem] animate-aurora rounded-full bg-brand-gold/15 blur-[120px] [animation-delay:-6s]" />
          <div className="bg-grid-dark mask-radial absolute inset-0" />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <span className="eyebrow-dark">Founding business offer</span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl">
              Get early access to <span className="text-gold-shimmer">Resevia.</span>
            </h1>
            <p className="mt-6 text-lg text-white/60">We’re onboarding our first 50 businesses. Join the waitlist to:</p>
            <ul className="mt-6 space-y-4">
              {[
                ['Free setup worth £499 + first month free', 'check'],
                ['Founding member status — priority support', 'check'],
                ['Limited to the first 50 businesses only', 'clock'],
              ].map(([t, icon]) => (
                <li key={t} className="flex items-center gap-3 text-lg font-medium text-white">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                    <Icon name={icon as any} className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 max-w-sm [&>div]:mx-0">
              <SlotCounter theme="dark" signedUpOverride={currentSignedUps} />
            </div>
            <Link href="/#demo" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold">
              Want to see it first? Test the agent live <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[2rem] bg-gradient-to-b from-brand-gold/60 via-white/10 to-brand-purple/40 p-px">
              <div className="rounded-[calc(2rem-1px)] bg-white p-6 shadow-2xl sm:p-10">
                <p className="mb-1 font-display text-2xl font-bold text-brand-black">Secure your spot</p>
                <p className="mb-6 text-sm text-brand-gray">No spam. No credit card. Just early access.</p>
                <WaitlistForm onSignupIncrement={setCurrentSignedUps} />
              </div>
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
    </div>
  );
}
