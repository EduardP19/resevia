'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function PricingTeaser() {
  const plans = [
    {
      name: "Starter",
      price: "£99",
      features: [
        "AI receptionist on your website",
        "Handles enquiries and FAQs",
        "Email booking notifications",
        "Up to 500 conversations/mo"
      ]
    },
    {
      name: "Growth",
      price: "£199",
      popular: true,
      features: [
        "Everything in Starter",
        "Direct calendar booking integration",
        "WhatsApp + phone line support",
        "Automated appointment reminders",
        "Up to 2,000 conversations/mo"
      ]
    },
    {
      name: "Pro",
      price: "£349",
      features: [
        "Everything in Growth",
        "Custom AI personality & tone",
        "Multi-location support",
        "Priority onboarding & support",
        "Unlimited conversations"
      ]
    }
  ];

  return (
    <section className="bg-brand-light py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-purple font-semibold tracking-wide uppercase text-sm mb-3 block">Pricing</span>
          <h2 className="text-4xl font-display font-bold text-brand-black">Simple, transparent pricing. No surprises.</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-10">
          {plans.map((plan, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1, duration: 0.5 }}
               className={plan.popular ? 'transform md:-translate-y-4' : ''}
             >
               <Card className={`h-full flex flex-col p-8 ${plan.popular ? 'border-2 border-brand-purple shadow-lg relative' : ''}`}>
                 {plan.popular && (
                   <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                     <Badge className="px-3 py-1 bg-brand-gold text-white tracking-wide uppercase">Most popular</Badge>
                   </div>
                 )}
                 <h3 className="font-semibold text-brand-black text-xl mb-4">{plan.name}</h3>
                 <div className="mb-6">
                   <span className="text-4xl font-display font-bold text-brand-black block">{plan.price}</span>
                   <span className="text-brand-gray text-sm">/mo</span>
                 </div>
                 
                 <ul className="space-y-4 mb-8 flex-1">
                   {plan.features.map((feature, idx) => (
                     <li key={idx} className="flex items-start text-brand-gray text-sm">
                       <svg className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                       </svg>
                       {feature}
                     </li>
                   ))}
                 </ul>
                 
                 <Link href="/waitlist" className="block mt-auto w-full">
                   <Button variant={plan.popular ? 'primary' : 'secondary'} className="w-full">
                     Join the Waitlist
                   </Button>
                 </Link>
               </Card>
             </motion.div>
          ))}
        </div>
        
        <div className="text-center">
          <p className="text-brand-black font-medium">Note: Waitlist members get 30% off their first 3 months.</p>
        </div>
      </div>
    </section>
  );
}
