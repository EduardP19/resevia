'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

export function ProblemBlock() {
  const problems = [
    { title: "Missed calls after hours", description: "→ lost bookings" },
    { title: "No-shows with no warning", description: "→ empty chairs" },
    { title: "Enquiries left unanswered", description: "→ clients go elsewhere" }
  ];

  return (
    <section className="bg-brand-light py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-purple font-semibold tracking-wide uppercase text-sm mb-3 block">Sound familiar?</span>
          <h2 className="text-4xl font-display font-bold text-brand-black mb-6">Every missed call is a missed booking.</h2>
          <p className="text-lg text-brand-gray">
            You're with a client. Your phone rings. You can't answer. By the time you call back — they've already booked somewhere else. The average UK salon loses 10–20% of revenue every week to missed calls and no-shows. That's a full day's work, gone.
          </p>
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {problems.map((prob, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <Card className="h-full text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="font-semibold text-brand-black text-lg mb-2">{prob.title}</h3>
                <p className="text-brand-purple font-medium">{prob.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
