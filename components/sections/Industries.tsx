'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

export function Industries() {
  const industries = [
    { name: "Beauty Salons", icon: "✨" },
    { name: "Hair Salons", icon: "✂️" },
    { name: "Dental Clinics", icon: "🦷" },
    { name: "Private Clinics", icon: "⚕️" },
    { name: "Gyms & PT Studios", icon: "🏋️" },
    { name: "Veterinary Practices", icon: "🐾" },
  ];

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-purple font-semibold tracking-wide uppercase text-sm mb-3 block">Built for businesses that run on bookings.</span>
          <h2 className="text-4xl font-display font-bold text-brand-black">Your industry. Your workflow. Your AI.</h2>
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
        >
          {industries.map((ind, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <Card className="h-full text-center hover:border-brand-gold transition-colors cursor-default py-8 px-4 flex flex-col items-center justify-center gap-3">
                <div className="text-3xl">{ind.icon}</div>
                <h3 className="font-semibold text-brand-black">{ind.name}</h3>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center">
          <p className="text-brand-gray text-sm">
            Don't see your industry? We're expanding fast.<br />
            <Link href="/waitlist" className="text-brand-purple hover:underline font-medium">Join the waitlist and tell us what you need.</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
