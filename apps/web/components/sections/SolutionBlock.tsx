'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

export function SolutionBlock() {
  const benefits = [
    "Answers calls and messages instantly — day or night",
    "Books appointments directly into your calendar",
    "Sends reminders to reduce no-shows"
  ];

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-purple font-semibold tracking-wide uppercase text-sm mb-3 block">Meet Resevia</span>
          <h2 className="text-4xl font-display font-bold text-brand-black mb-6">A receptionist that never sleeps, never misses a call, never takes a day off.</h2>
          <p className="text-lg text-brand-gray">
            Resevia is an AI receptionist trained specifically for your business. It answers calls, responds to messages, books appointments and follows up with clients — automatically, around the clock. No extra staff. No extra hours. Just more bookings.
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
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <Card className="h-full text-center py-10 px-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-brand-black font-medium text-lg">{benefit}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
