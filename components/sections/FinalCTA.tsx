'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { WaitlistForm } from '@/components/ui/WaitlistForm';
import { SlotCounter } from '@/components/ui/SlotCounter';

export function FinalCTA() {
  const [currentSignedUps, setCurrentSignedUps] = useState<number | undefined>(undefined);

  useEffect(() => {
    const signedUpCookie = Cookies.get('resevia_signed_up');
    if (signedUpCookie) {
      const parsedSignedUps = parseInt(signedUpCookie, 10);
      if (!isNaN(parsedSignedUps)) {
        setCurrentSignedUps(parsedSignedUps);
      }
      return;
    }

    const legacySlotsCookie = Cookies.get('resevia_slots');
    if (legacySlotsCookie) {
      const parsedLegacySlots = parseInt(legacySlotsCookie, 10);
      if (!isNaN(parsedLegacySlots)) {
        setCurrentSignedUps(Math.max(0, Math.min(50, 50 - parsedLegacySlots)));
      }
    }
  }, []);
  return (
    <section className="bg-white py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-display font-bold text-brand-black mb-6">Stop missing bookings. Start with Resevia.</h2>
          <p className="text-lg text-brand-gray mb-12 max-w-2xl mx-auto">
            Join the waitlist today to secure free setup worth £499 and your first month free. Limited to the first 50 businesses.
          </p>

          <SlotCounter signedUpOverride={currentSignedUps} />

          <div className="bg-brand-light p-8 md:p-12 rounded-2xl border border-gray-100 max-w-xl mx-auto">
            <WaitlistForm onSignupIncrement={setCurrentSignedUps} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
