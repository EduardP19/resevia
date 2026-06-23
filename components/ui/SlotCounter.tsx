'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import {
  TOTAL_FOUNDER_SPOTS,
  SIGNED_UP_COOKIE_KEY,
  LEGACY_SLOTS_COOKIE_KEY,
  displayedSignups,
} from '@/lib/founderOffer';

interface SlotCounterProps {
  signedUpOverride?: number;
  theme?: 'light' | 'dark';
}

export function SlotCounter({ signedUpOverride, theme = 'light' }: SlotCounterProps) {
  const [signedUpCount, setSignedUpCount] = useState<number | null>(null);

  useEffect(() => {
    if (signedUpOverride !== undefined) {
      setSignedUpCount(signedUpOverride);
      return;
    }

    const signedUpCookie = Cookies.get(SIGNED_UP_COOKIE_KEY);
    if (signedUpCookie) {
      const parsed = parseInt(signedUpCookie, 10);
      if (!isNaN(parsed)) {
        setSignedUpCount(parsed);
        return;
      }
    }

    const legacySlotsCookie = Cookies.get(LEGACY_SLOTS_COOKIE_KEY);
    if (legacySlotsCookie) {
      const parsedSlots = parseInt(legacySlotsCookie, 10);
      if (!isNaN(parsedSlots)) {
        const migratedSignedUps = Math.max(0, Math.min(TOTAL_FOUNDER_SPOTS, TOTAL_FOUNDER_SPOTS - parsedSlots));
        Cookies.set(SIGNED_UP_COOKIE_KEY, migratedSignedUps.toString(), { expires: 365 });
        setSignedUpCount(migratedSignedUps);
        return;
      }
    }

    Cookies.set(SIGNED_UP_COOKIE_KEY, '0', { expires: 365 });
    Cookies.set(LEGACY_SLOTS_COOKIE_KEY, TOTAL_FOUNDER_SPOTS.toString(), { expires: 365 });
    setSignedUpCount(0);
  }, [signedUpOverride]);

  if (signedUpCount === null) return null;

  const displayedCount = displayedSignups(signedUpCount);
  const slotsRemaining = Math.max(0, TOTAL_FOUNDER_SPOTS - displayedCount);
  const filledPercentage = (displayedCount / TOTAL_FOUNDER_SPOTS) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-sm mx-auto mt-4 mb-6"
    >
      <p className={`text-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-brand-black'}`}>
        <span className={theme === 'dark' ? 'font-bold text-brand-gold' : 'font-bold text-[#6D28D9]'}>{displayedCount}</span> businesses have signed up so far ({slotsRemaining} spots left)
      </p>
      <div className={`w-full h-1 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/10' : 'bg-[#FBF5E9]'}`}>
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${filledPercentage}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
          className={`h-full rounded-full ${theme === 'dark' ? 'bg-brand-gold' : 'bg-[#6D28D9]'}`}
        />
      </div>
    </motion.div>
  );
}
