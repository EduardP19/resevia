'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { WaitlistForm } from '@/components/ui/WaitlistForm';
import { SlotCounter } from '@/components/ui/SlotCounter';

export function FinalCTA() {
  const [currentSlots, setCurrentSlots] = useState<number | undefined>(undefined);

  useEffect(() => {
    const cookie = Cookies.get('resevia_slots');
    if (cookie) {
      setCurrentSlots(parseInt(cookie, 10));
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

          <SlotCounter slotsOverride={currentSlots} />

          <div className="bg-brand-light p-8 md:p-12 rounded-2xl border border-gray-100 max-w-xl mx-auto">
            <WaitlistForm onSlotDecrement={setCurrentSlots} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
