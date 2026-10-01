'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { SectionHeading, Reveal, SpotlightCard } from '@/components/ui/motion';
import { Icon } from '@/components/ui/Icons';

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <SpotlightCard
      glow="rgba(139,92,246,0.12)"
      className={clsx('h-full rounded-[1.75rem] border border-brand-purple/10 bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_30px_60px_-30px_rgba(109,40,217,0.3)] sm:p-7', className)}
    >
      {children}
    </SpotlightCard>
  );
}

function Title({ icon, title, body }: { icon: any; title: string; body: string }) {
  return (
    <>
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-purple/10 text-brand-purple">
        <Icon name={icon} className="h-5 w-5" />
      </div>
      <h3 className="text-xl font-semibold text-brand-black">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-brand-gray">{body}</p>
    </>
  );
}

// Clickable approval-mode mini demo.
function ApprovalDemo() {
  const [state, setState] = useState<'draft' | 'sent'>('draft');
  useEffect(() => {
    if (state !== 'sent') return;
    const t = setTimeout(() => setState('draft'), 3500);
    return () => clearTimeout(t);
  }, [state]);
  return (
    <div className="mt-6 rounded-2xl border border-brand-purple/10 bg-brand-light p-4">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-brand-black">Draft reply · Chloe M.</span>
        <span className={clsx('rounded-full px-2 py-0.5 font-semibold', state === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700')}>
          {state === 'draft' ? 'Needs approval' : 'Sent ✓'}
        </span>
      </div>
      <p className="mt-2 text-sm text-brand-black/80">“We have 13:30 on Saturday with Mia — shall I book it for you?”</p>
      <div className="mt-3 flex gap-2">
        <button onClick={() => setState('sent')} disabled={state === 'sent'} className="flex-1 rounded-xl bg-brand-purple py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-40">
          Approve & send
        </button>
        <button disabled={state === 'sent'} className="rounded-xl border border-brand-purple/20 px-4 py-2 text-sm font-semibold text-brand-purple disabled:opacity-40">
          Edit
        </button>
      </div>
    </div>
  );
}

function CalendarDemo() {
  const [filled, setFilled] = useState<number[]>([1, 4]);
  useEffect(() => {
    const t = setInterval(() => {
      setFilled((f) => {
        const free = [0, 1, 2, 3, 4, 5, 6, 7].filter((n) => !f.includes(n));
        if (!free.length) return [1, 4];
        return [...f, free[Math.floor(Math.random() * free.length)]];
      });
    }, 1400);
    return () => clearInterval(t);
  }, []);
  const slots = ['09:00', '10:00', '11:30', '13:00', '13:30', '15:00', '16:15', '17:30'];
  return (
    <div className="mt-6 grid grid-cols-4 gap-2">
      {slots.map((s, i) => {
        const on = filled.includes(i);
        return (
          <motion.div
            key={s}
            layout
            animate={{ scale: on ? [1, 1.08, 1] : 1 }}
            className={clsx('rounded-xl border px-2 py-2.5 text-center text-xs font-semibold transition-colors duration-500', on ? 'border-brand-purple bg-brand-purple text-white' : 'border-dashed border-brand-purple/20 text-brand-purple/50')}
          >
            {s}
            <span className="block text-[9px] font-medium opacity-70">{on ? 'Booked' : 'Free'}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

function ReminderStack() {
  const items = [
    { t: 'Reminder sent', d: 'Tomorrow 10:00 · Gel manicure', c: 'text-brand-purple' },
    { t: 'Client confirmed', d: '“See you then! 💅”', c: 'text-emerald-600' },
    { t: 'Rescheduled', d: 'Moved to Fri 14:00 automatically', c: 'text-brand-gold' },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % items.length), 2200);
    return () => clearInterval(t);
  }, [items.length]);
  return (
    <div className="relative mt-6 h-[74px]">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="absolute inset-x-0 flex items-center gap-3 rounded-2xl border border-brand-purple/10 bg-white p-3.5 shadow-lg"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light">
            <Icon name="bell" className={clsx('h-4 w-4', items[i].c)} />
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-black">{items[i].t}</p>
            <p className="text-xs text-brand-gray">{items[i].d}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ChannelOrbit() {
  return (
    <div className="relative mx-auto mt-8 flex h-44 w-44 items-center justify-center">
      <div className="absolute inset-0 rounded-full border border-dashed border-brand-purple/20" />
      <div className="absolute inset-6 rounded-full border border-brand-purple/10" />
      <div className="absolute inset-0 animate-spin-slow">
        {[
          { icon: 'chat', pos: 'left-1/2 -top-5 -translate-x-1/2', label: 'SMS' },
          { icon: 'whatsapp', pos: '-left-5 bottom-3', label: 'WhatsApp' },
          { icon: 'phone', pos: '-right-5 bottom-3', label: 'Voice' },
        ].map((c) => (
          <div key={c.label} className={clsx('absolute flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-purple/10 bg-white text-brand-purple shadow-lg', c.pos)}>
            <div className="animate-spin-slow [animation-direction:reverse]">
              <Icon name={c.icon} className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-purple-light to-brand-deep shadow-[0_20px_40px_-10px_rgba(109,40,217,0.6)]">
        <svg viewBox="0 0 48 48" className="h-12 w-12"><path d="M24 11A12 12 0 1 1 16.6 32.46L12.5 35.5L12.72 27.1A12 12 0 0 1 24 11Z" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinejoin="round" /><path d="M18.6 23.4l3.8 3.8 7.4-7.6" fill="none" stroke="#C9A96E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Everything a front desk does"
          title={<>A full reception team. <span className="text-purple-gold">Without the payroll.</span></>}
          subtitle="Resevia isn’t a generic chatbot. It’s trained on your services, prices and rules — and it knows when to hand over to you."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-6">
          <Reveal className="md:col-span-3 lg:col-span-2 lg:row-span-2">
            <Card className="bg-gradient-to-b from-white to-brand-light">
              <Title icon="globe" title="One agent. Every channel." body="The same receptionist, with the same knowledge, on SMS, WhatsApp and phone calls. Clients reply on whatever they used." />
              <ChannelOrbit />
            </Card>
          </Reveal>
          <Reveal className="md:col-span-3 lg:col-span-2" delay={0.05}>
            <Card>
              <Title icon="calendar" title="Books straight into your diary" body="Live availability, the right staff member, no double-bookings." />
              <CalendarDemo />
            </Card>
          </Reveal>
          <Reveal className="md:col-span-3 lg:col-span-2" delay={0.1}>
            <Card>
              <Title icon="hand" title="You stay in control" body="Switch on approval mode and every reply waits for your OK. Try it →" />
              <ApprovalDemo />
            </Card>
          </Reveal>
          <Reveal className="md:col-span-3 lg:col-span-2" delay={0.15}>
            <Card>
              <Title icon="bell" title="Reminders that cut no-shows" body="Confirmations and reminders on WhatsApp, with SMS as the fallback." />
              <ReminderStack />
            </Card>
          </Reveal>
          <Reveal className="md:col-span-2" delay={0.2}>
            <Card>
              <Title icon="shield" title="Safe by design" body="Never gives medical advice. Urgent cases are flagged to your team instantly, with emergency guidance for the client." />
            </Card>
          </Reveal>
          <Reveal className="md:col-span-2 lg:col-span-3" delay={0.25}>
            <Card>
              <Title icon="book" title="Knows your business" body="Services, prices, staff, hours, parking, policies — answered accurately from your own knowledge base." />
            </Card>
          </Reveal>
          <Reveal className="md:col-span-2 lg:col-span-3" delay={0.3}>
            <Card>
              <Title icon="inbox" title="Take over any time" body="Every conversation in one inbox. Jump in mid-thread and the agent steps aside." />
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
