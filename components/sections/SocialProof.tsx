'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export function SocialProof() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = 200;
      const duration = 1500; // 1.5s
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView]);

  return (
    <section className="bg-brand-purple py-20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5 }}
           className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-display font-bold mb-8">Join the businesses already on the waitlist.</h2>
          <div ref={ref} className="text-5xl md:text-7xl font-bold font-display text-brand-gold mb-8">
            {count}+
          </div>
          <p className="text-xl font-medium mb-4">businesses waiting for early access</p>
          <p className="text-brand-light/80">
            Launching in the UK — built for small business owners who want more bookings without more work.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
