'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';

interface SlotCounterProps {
  slotsOverride?: number;
  theme?: 'light' | 'dark';
}

export function SlotCounter({ slotsOverride, theme = 'light' }: SlotCounterProps) {
  const [slotsRemaining, setSlotsRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (slotsOverride !== undefined) {
      setSlotsRemaining(slotsOverride);
      return;
    }

    const existingCookie = Cookies.get('resevia_slots');
    if (existingCookie) {
      setSlotsRemaining(parseInt(existingCookie, 10));
    } else {
      const randomSlots = Math.floor(Math.random() * (50 - 30 + 1)) + 30;
      Cookies.set('resevia_slots', randomSlots.toString(), { expires: 365 });
      setSlotsRemaining(randomSlots);
    }
  }, [slotsOverride]);

  if (slotsRemaining === null) return null;

  const filledPercentage = ((50 - slotsRemaining) / 50) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-sm mx-auto mt-4 mb-6"
    >
      <p className={`text-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-brand-black'}`}>
        Only <span className={theme === 'dark' ? 'font-bold text-brand-gold' : 'font-bold text-[#6D28D9]'}>{slotsRemaining}</span> founding member spots remaining
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
