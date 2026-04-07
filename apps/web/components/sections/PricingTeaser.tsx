'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SlotCounter } from '@/components/ui/SlotCounter';

export function PricingTeaser() {
  const [isAnnual, setIsAnnual] = useState(false);
  const plans = [
    {
      name: "Essentials",
      price: "£79",
      description: "Perfect for small businesses getting started with AI reception.",
      features: [
        "Calendar integration — books directly into your existing system.",
        "AI receptionist on your website chat",
        "Handles enquiries, FAQs and pricing questions",
        "Text-based conversations only",
        "Booking link sharing (directs clients to your existing booking page)",
        "Email notifications for new enquiries",
        "SMS booking notifications",
        "Up to 500 conversations per month",
        "Standard response time",
        "Email support"
      ],
      notIncluded: "Not included: AI voice calls, WhatsApp bookings, reminders"
    },
    {
      name: "Growth",
      price: "£169",
      popular: true,
      badge: "Most Popular",
      description: "The complete AI reception experience for growing businesses.",
      features: [
        "Calendar integration — books directly into your existing system.",
        "Everything in Essentials",
        "AI voice receptionist — answers phone calls in your brand voice",
        "WhatsApp Business integration — clients can book via WhatsApp",
        "Direct calendar booking — books straight into your system, no redirects",
        "Automated appointment reminders via SMS and WhatsApp",
        "No-show follow-ups sent automatically",
        "Up to 2,000 conversations per month",
        "Priority response time",
        "Chat and email support"
      ]
    },
    {
      name: "Elite",
      price: "£499",
      elite: true,
      badge: "For Power Users",
      description: "Maximum capability for high-volume businesses and multi-location operators.",
      features: [
        "Calendar integration — books directly into your existing system.",
        "Everything in Growth",
        "Unlimited conversations",
        "Multi-location support — one account, multiple branches",
        "Custom AI personality — fully bespoke tone, name and persona for your brand",
        "CRM integration — syncs client data with your existing CRM",
        "Advanced analytics dashboard — conversation volume, booking rates, drop-off points",
        "Monthly strategy call with the Resevia team",
        "Dedicated account manager",
        "SLA-backed 99.9% uptime guarantee",
        "Priority onboarding — live within 24 hours",
        "White-glove setup — we do everything"
      ]
    }
  ];

  return (
    <section className="bg-brand-light py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-brand-purple font-semibold tracking-wide uppercase text-sm mb-3 block">Pricing</span>
          <h2 className="text-4xl font-display font-bold text-brand-black">Simple, transparent pricing. No surprises.</h2>
        </div>

        <div className="flex justify-center items-center gap-4 mb-12">
          <span className={`text-sm font-medium ${!isAnnual ? 'text-brand-black font-semibold' : 'text-brand-gray'}`}>Monthly</span>
          <button
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative inline-flex h-7 w-14 items-center rounded-full bg-brand-purple transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2"
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-8' : 'translate-x-1'}`} />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${isAnnual ? 'text-brand-black font-semibold' : 'text-brand-gray'}`}>Yearly</span>
            <Badge className="bg-green-100 text-green-700 border-none px-2 py-0.5 text-xs font-bold uppercase tracking-wider">Save 25%</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-10">
          {plans.map((plan, i) => {
            const isPopular = plan.popular;
            const isElite = (plan as any).elite;

            const basePrice = parseInt(plan.price.replace('£', ''));
            const displayPrice = isAnnual ? `£${Math.round(basePrice * 0.75)}` : plan.price;

            const cardContent = (
              <>
                {(isPopular || isElite) && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-max max-w-full">
                    <Badge className="px-4 py-1.5 bg-brand-gold text-brand-black tracking-wide font-bold shadow-md rounded-full border-none">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                <h3 className={`font-semibold text-xl mb-2 ${isElite ? 'text-white' : 'text-brand-black'}`}>{plan.name}</h3>
                <p className={`text-sm mb-4 flex-none h-10 ${isElite ? 'text-gray-300' : 'text-brand-gray'}`}>{plan.description}</p>

                <div className="mb-6">
                  <span className={`text-4xl font-display font-bold block ${isElite ? 'text-white' : 'text-brand-black'}`}>{displayPrice}</span>
                  <span className={`text-sm ${isElite ? 'text-gray-300' : 'text-brand-gray'}`}>/mo</span>
                  {isAnnual && (
                    <span className={`text-xs block mt-1 ${isElite ? 'text-gray-400' : 'text-gray-400'}`}>Billed annually</span>
                  )}
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className={`flex items-start text-sm ${isElite ? 'text-gray-200' : 'text-brand-gray'}`}>
                      <svg className={`w-5 h-5 mr-3 shrink-0 mt-0.5 ${isElite ? 'text-brand-gold' : 'text-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                  {(plan as any).notIncluded && (
                    <li className={`flex items-start text-sm italic mt-6 border-t pt-6 ${isElite ? 'text-gray-400 border-white/20' : 'text-gray-400 border-gray-100'}`}>
                      {(plan as any).notIncluded}
                    </li>
                  )}
                </ul>

                <Link href="/waitlist" className="block mt-auto w-full relative z-20">
                  <Button variant={isPopular ? 'primary' : isElite ? 'secondary' : 'secondary'} className={`w-full ${isElite ? 'bg-white text-brand-purple hover:bg-gray-100 border-none' : ''}`}>
                    Join the Waitlist
                  </Button>
                </Link>
              </>
            );

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={isPopular ? 'transform md:-translate-y-2 h-full relative z-10' : 'h-full flex'}
              >
                {isPopular ? (
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="relative p-[2px] rounded-2xl overflow-visible h-full flex flex-col bg-transparent w-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold via-yellow-200 to-brand-gold rounded-2xl -z-10" />
                    <Card
                      whileHover={{}}
                      className="h-full flex flex-col relative z-10 border-transparent rounded-[14px]"
                    >
                      {cardContent}
                    </Card>
                  </motion.div>
                ) : (
                  <Card
                    whileHover={{ y: -4, borderColor: "rgba(201,169,110,1)" }}
                    className={`h-full flex flex-col relative w-full rounded-2xl ${isElite ? 'bg-[#6D28D9] border-transparent shadow-[0_10px_40px_rgba(109,40,217,0.3)]' : ''}`}
                  >
                    {cardContent}
                  </Card>
                )}
              </motion.div>
            );
          })}
        </div>
        <div className="text-center bg-brand-gold/10 border border-brand-gold/30 p-8 rounded-2xl max-w-4xl mx-auto backdrop-blur-sm shadow-inner">
          <Badge className="bg-brand-gold text-brand-black mb-4 px-4 py-1.5 font-bold animate-bounce">LIMITED TIME: GOLDEN OFFER</Badge>
          <p className="text-brand-black font-display font-bold text-xl mb-4">First 50 businesses get free setup (worth £499) + first month free on any plan.</p>
          <SlotCounter />
        </div>
      </div>
    </section>
  );
}
