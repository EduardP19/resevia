'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { SlotCounter } from '@/components/ui/SlotCounter';
import { SectionHeading, Reveal } from '@/components/ui/motion';
import { Icon } from '@/components/ui/Icons';
import { useAnalytics } from '@/components/analytics/AnalyticsProvider';

type Plan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  custom?: boolean;
  badge?: string;
  notIncluded?: string;
};

export const PLANS: Plan[] = [
  {
    name: 'Essentials',
    price: '£69',
    description: 'Perfect for small businesses getting started with AI reception.',
    features: [
      '400 SMS and 2,000 WhatsApp messages / month (≈ 300 client conversations)',
      'Inbound and outbound on both SMS and WhatsApp',
      'Up to 3 outbound WhatsApp message templates',
      'Booking reminders sent by SMS and WhatsApp',
      'Booking confirmation emails sent automatically',
      'Calendar integration — books directly into your existing system',
      'Handles enquiries, FAQs, pricing questions and bookings',
      'Usage dashboard — see exactly what you’ve used, live',
      'Email support',
    ],
    notIncluded: 'Not included: AI voice. Essentials is text only — SMS and WhatsApp.',
  },
  {
    name: 'Growth',
    price: '£179',
    popular: true,
    badge: 'Most Popular',
    description: 'The complete AI reception experience for growing businesses.',
    features: [
      '750 SMS and 4,000 WhatsApp messages / month (≈ 590 client conversations)',
      '500 AI voice minutes / month included',
      'Everything in Essentials',
      'AI voice receptionist — answers phone calls in your brand voice',
      'Unlimited outbound WhatsApp message templates',
      'Direct calendar booking — books straight into your system, no redirects',
      'No-show follow-ups sent automatically',
      'Priority response time',
      'Chat and email support',
    ],
  },
  {
    name: 'Custom',
    price: 'Let’s talk',
    custom: true,
    badge: 'Built Around You',
    description: 'Built around high-volume businesses and multi-location operators.',
    features: [
      'Message and voice allowances set to your actual volume',
      'Everything in Growth',
      'Email marketing — campaigns, newsletters and automated client journeys',
      'CRM — full client records, history and segmentation, or synced with the CRM you already use',
      'Multi-location support — one account, multiple branches',
      'Custom AI personality — fully bespoke tone, name and persona for your brand',
      'Advanced analytics dashboard — conversation volume, booking rates, drop-off points',
      'Monthly strategy call with the Resevia team',
      'Dedicated account manager',
      'SLA-backed 99.9% uptime guarantee',
      'Priority onboarding — live within 24 hours',
      'White-glove setup — we do everything',
    ],
  },
];

export function PricingTeaser() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { logEvent } = useAnalytics();

  return (
    <section id="pricing" className="relative scroll-mt-20 overflow-hidden bg-brand-light py-24 sm:py-32">
      <div className="bg-grid-light mask-radial pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Pricing" title={<>Simple, transparent pricing. <span className="text-purple-gold">No surprises.</span></>} subtitle="Less than a day of a receptionist’s wages — for a front desk that works every hour of every day." />

        <div className="mt-10 flex items-center justify-center">
          <div className="relative grid grid-cols-2 rounded-full border border-brand-purple/15 bg-white p-1 shadow-sm">
            {[false, true].map((annual) => (
              <button
                key={String(annual)}
                onClick={() => {
                  setIsAnnual(annual);
                  logEvent('BUTTON_CLICK', { button_text: annual ? 'pricing_yearly' : 'pricing_monthly' });
                }}
                className={clsx('relative z-10 flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors', isAnnual === annual ? 'text-white' : 'text-brand-gray')}
              >
                {isAnnual === annual && <motion.span layoutId="billing-pill" className="absolute inset-0 -z-10 rounded-full bg-brand-purple" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                {annual ? 'Yearly' : 'Monthly'}
                {annual && <span className={clsx('rounded-full px-1.5 py-0.5 text-[10px] font-bold', isAnnual ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700')}>−25%</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl items-start gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => {
            const base = parseInt(plan.price.replace('£', ''));
            const numeric = !Number.isNaN(base);
            const price = numeric ? (isAnnual ? Math.round(base * 0.75) : base) : null;
            const dark = plan.custom;

            return (
              <Reveal key={plan.name} delay={i * 0.08} className={clsx(plan.popular && 'lg:-mt-4')}>
                <div className={clsx('relative rounded-[2rem]', plan.popular && 'bg-gradient-to-b from-brand-gold via-[#F5E6C4] to-brand-gold p-[1.5px] shadow-[0_40px_80px_-30px_rgba(201,169,110,0.6)]')}>
                  <div
                    className={clsx(
                      'relative flex h-full flex-col rounded-[calc(2rem-1.5px)] p-7 sm:p-8',
                      dark ? 'bg-[#0C0A1D] text-white' : 'bg-white',
                      !plan.popular && !dark && 'border border-brand-purple/10'
                    )}
                  >
                    {dark && <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-purple/40 blur-3xl" />}
                    {plan.badge && (
                      <span className={clsx('absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold', plan.popular ? 'bg-brand-black text-brand-gold' : 'bg-brand-gold text-brand-black')}>
                        {plan.badge}
                      </span>
                    )}
                    <div className="relative">
                      <h3 className={clsx('text-xl font-semibold', dark ? 'text-white' : 'text-brand-black')}>{plan.name}</h3>
                      <p className={clsx('mt-1.5 min-h-[40px] text-sm', dark ? 'text-white/55' : 'text-brand-gray')}>{plan.description}</p>
                      <div className="mt-6 flex items-end gap-1.5">
                        {price !== null ? (
                          <>
                            <motion.span key={price} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className={clsx('font-display text-5xl font-bold tracking-tight', dark ? 'text-white' : 'text-brand-black')}>
                              £{price}
                            </motion.span>
                            <span className={clsx('mb-1.5 text-sm', dark ? 'text-white/50' : 'text-brand-gray')}>/mo</span>
                          </>
                        ) : (
                          <span className="font-display text-5xl font-bold tracking-tight">{plan.price}</span>
                        )}
                      </div>
                      <p className={clsx('mt-1 h-4 text-xs', dark ? 'text-white/40' : 'text-brand-gray/70')}>
                        {numeric ? (isAnnual ? 'Billed annually' : 'Billed monthly · cancel anytime') : 'Priced to your setup'}
                      </p>

                      <Link
                        href="/waitlist"
                        onClick={() => logEvent('BUTTON_CLICK', { button_text: `pricing_${plan.name.toLowerCase()}` })}
                        className={clsx(
                          'mt-7 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition-all',
                          plan.popular && 'bg-brand-purple text-white shadow-[0_12px_30px_-10px_rgba(109,40,217,0.7)] hover:bg-brand-purple-mid',
                          dark && 'bg-white text-brand-black hover:bg-brand-cream',
                          !plan.popular && !dark && 'border-2 border-brand-purple/15 text-brand-purple hover:border-brand-purple/40'
                        )}
                      >
                        {dark ? 'Talk to us' : 'Join the waitlist'}
                        <Icon name="arrowRight" className="h-4 w-4" />
                      </Link>

                      <ul className="mt-8 space-y-3.5">
                        {plan.features.map((f) => (
                          <li key={f} className={clsx('flex gap-3 text-sm leading-snug', dark ? 'text-white/75' : 'text-brand-gray')}>
                            <Icon name="check" className={clsx('mt-0.5 h-4 w-4 shrink-0', dark ? 'text-brand-gold' : plan.popular ? 'text-brand-purple' : 'text-emerald-500')} strokeWidth={2.5} />
                            {f}
                          </li>
                        ))}
                      </ul>
                      {plan.notIncluded && <p className="mt-6 border-t border-brand-purple/10 pt-5 text-xs italic text-brand-gray/70">{plan.notIncluded}</p>}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="relative mx-auto mt-14 max-w-4xl overflow-hidden rounded-[2rem] border border-brand-gold/40 bg-gradient-to-br from-brand-cream via-white to-brand-cream p-8 text-center sm:p-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-black px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-gold opacity-70" /><span className="relative inline-flex h-2 w-2 rounded-full bg-brand-gold" /></span>
              Founding business pilot
            </span>
            <p className="mt-5 font-display text-xl font-bold text-brand-black sm:text-2xl">
              First 50 businesses: free setup (worth £499) + first month completely free on any plan.
            </p>
            <p className="mt-2 text-sm text-brand-gray">No credit card to reserve your spot. Cancel anytime during your free month.</p>
            <SlotCounter />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
