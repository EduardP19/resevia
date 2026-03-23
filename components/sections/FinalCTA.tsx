'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { WaitlistForm } from '@/components/ui/WaitlistForm';

export function FinalCTA() {
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
            Join the waitlist today and be first to access Resevia when we launch. Free early access for the first 100 businesses.
          </p>
          
          <div className="bg-brand-light p-8 md:p-12 rounded-2xl border border-gray-100 max-w-xl mx-auto">
            <WaitlistForm />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
