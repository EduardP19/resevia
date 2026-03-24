'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

export function Reviews() {
  const reviews = [
    {
      name: "Sarah Jenkins",
      business: "Luxe Hair Studio",
      text: "Resevia has completely transformed our front desk. We no longer miss calls when we're busy with clients, and the AI books people straight into our calendar effortlessly.",
      rating: 5,
    },
    {
      name: "Dr. James Aris",
      business: "Aesthetics Medspa",
      text: "Having a premium 24/7 receptionist answering FAQs in our brand's tone of voice is a game changer. We've seen a 30% increase in consultation bookings in just two months.",
      rating: 5,
    },
    {
      name: "Emma Wood",
      business: "The Dental Practice",
      text: "It's like having another full-time staff member who works nights and weekends. Our patients absolutely love getting constant and instant replies to their messages.",
      rating: 5,
    }
  ];

  return (
    <section className="bg-white py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-purple font-semibold tracking-wide uppercase text-sm mb-3 block">Trusted by Professionals</span>
          <h2 className="text-4xl font-display font-bold text-brand-black">Don't just take our word for it.</h2>
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
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="h-full"
            >
              <Card className="h-full flex flex-col p-8 bg-brand-light border-transparent shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="flex text-brand-gold mb-6">
                  {[...Array(review.rating)].map((_, idx) => (
                    <svg key={idx} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-brand-gray text-lg italic mb-8 flex-grow leading-relaxed">"{review.text}"</p>
                <div>
                  <p className="font-semibold text-brand-black text-lg">{review.name}</p>
                  <p className="text-sm text-brand-purple font-medium">{review.business}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
