'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function HowItWorks() {
  const steps = [
    {
      title: "Connect",
      description: "Tell us about your business. Services, hours, pricing, team. Takes 15 minutes."
    },
    {
      title: "Customise",
      description: "We train your AI receptionist on your business. It learns your tone, your services, your booking flow."
    },
    {
      title: "Go Live",
      description: "Deploy to your website, WhatsApp or phone line. Your AI receptionist starts working immediately."
    }
  ];

  return (
    <section className="bg-brand-light py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-brand-purple font-semibold tracking-wide uppercase text-sm mb-3 block">Simple to set up. Powerful from day one.</span>
          <h2 className="text-4xl font-display font-bold text-brand-black">Live in 3 steps.</h2>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center gap-12 relative">
          <div className="hidden md:block absolute top-[1.5rem] left-[15%] right-[15%] h-[2px] bg-gray-200 z-0"></div>
          {steps.map((step, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1, duration: 0.5 }}
               className="flex-1 relative z-10"
             >
               <div className="text-center px-2">
                 <div className="w-12 h-12 bg-brand-purple rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl border-4 border-brand-light shrink-0">
                    {i + 1}
                 </div>
                 <h3 className="font-semibold text-brand-black text-xl mb-3">Step {i + 1} — {step.title}</h3>
                 <p className="text-brand-gray leading-relaxed">{step.description}</p>
               </div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
