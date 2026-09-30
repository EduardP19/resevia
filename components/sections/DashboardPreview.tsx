'use client';

// Illustrative preview of the owner dashboard (inbox, approvals, usage).
// Sample data only — labelled as such on the page.

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { SectionHeading, Reveal } from '@/components/ui/motion';
import { Icon } from '@/components/ui/Icons';

type Tab = 'inbox' | 'approvals' | 'usage';

const THREADS = [
  { name: 'Chloe M.', ch: 'whatsapp', last: 'Booked ✅ Balayage · Sat 13:30', status: 'Booked', tone: 'green', time: '2m' },
  { name: '+44 7••• ••• 219', ch: 'voice', last: 'Call · asked about parking, booked hygienist', status: 'Booked', tone: 'green', time: '14m' },
  { name: 'Priya S.', ch: 'sms', last: 'Do you do gel removal only?', status: 'Active', tone: 'gold', time: '21m' },
  { name: 'Tom R.', ch: 'whatsapp', last: 'Can I speak to someone?', status: 'Handover', tone: 'rose', time: '1h' },
  { name: 'Hannah L.', ch: 'sms', last: 'Reminder confirmed 👍', status: 'Completed', tone: 'muted', time: '3h' },
];

const USAGE = [
  { label: 'WhatsApp', used: 1240, total: 4000 },
  { label: 'SMS', used: 318, total: 750 },
  { label: 'Voice minutes', used: 142, total: 500 },
];

const BARS = [18, 26, 22, 31, 28, 40, 36, 44, 38, 52, 47, 58, 55, 63];

export function DashboardPreview() {
  const [tab, setTab] = useState<Tab>('inbox');
  const [approved, setApproved] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#0C0A1D] py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute right-0 top-40 h-[30rem] w-[30rem] rounded-full bg-brand-gold/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          dark
          eyebrow="Your command centre"
          title={<>See every conversation. <span className="text-gold-shimmer">Step in any time.</span></>}
          subtitle="One dashboard for every channel — inbox, approvals and live usage. Click around."
        />

        <Reveal delay={0.1} className="mt-14">
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#120e24] shadow-[0_60px_140px_-40px_rgba(109,40,217,0.6)]">
            {/* Window chrome */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="mx-auto hidden rounded-lg bg-white/5 px-4 py-1 font-mono text-xs text-white/40 sm:block">app.resevia.co.uk/dashboard</div>
              <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/40 sm:ml-0">Sample data</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[210px_1fr] [&>*]:min-w-0">
              {/* Sidebar */}
              <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-white/10 p-3 md:flex-col md:border-b-0 md:border-r">
                {([
                  ['inbox', 'Inbox', 'inbox'],
                  ['approvals', 'Approvals', 'hand'],
                  ['usage', 'Usage', 'chart'],
                ] as [Tab, string, any][]).map(([id, label, icon]) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={clsx('relative flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors', tab === id ? 'text-white' : 'text-white/50 hover:text-white')}
                  >
                    {tab === id && <motion.span layoutId="dash-tab" className="absolute inset-0 -z-0 rounded-xl bg-white/10" />}
                    <Icon name={icon} className="relative h-4 w-4" />
                    <span className="relative">{label}</span>
                    {id === 'approvals' && !approved && <span className="relative ml-auto rounded-full bg-brand-gold px-1.5 text-[10px] font-bold text-brand-black">1</span>}
                  </button>
                ))}
              </div>

              <div className="min-h-[420px] p-4 sm:p-6">
                <AnimatePresence mode="wait">
                  {tab === 'inbox' && (
                    <motion.div key="inbox" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
                      <div className="mb-4 grid grid-cols-3 gap-3">
                        {[
                          ['Conversations', '38', 'today'],
                          ['Booked', '17', 'by the agent'],
                          ['Handovers', '1', 'need you'],
                        ].map(([k, v, s]) => (
                          <div key={k} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4">
                            <p className="text-[10px] uppercase tracking-wider text-white/40 sm:text-[11px]">{k}</p>
                            <p className="mt-1 font-display text-2xl font-bold text-white">{v}</p>
                            <p className="text-[10px] text-white/35 sm:text-xs">{s}</p>
                          </div>
                        ))}
                      </div>
                      {THREADS.map((t, i) => (
                        <motion.div
                          key={t.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3 transition-colors hover:border-white/15 hover:bg-white/[0.05]"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70">
                            <Icon name={t.ch === 'whatsapp' ? 'whatsapp' : t.ch === 'voice' ? 'phone' : 'chat'} className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-white">{t.name}</p>
                            <p className="truncate text-xs text-white/45">{t.last}</p>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-1">
                            <span className={clsx('rounded-full px-2 py-0.5 text-[10px] font-semibold', {
                              'bg-emerald-400/15 text-emerald-300': t.tone === 'green',
                              'bg-brand-gold/15 text-brand-gold': t.tone === 'gold',
                              'bg-rose-400/15 text-rose-300': t.tone === 'rose',
                              'bg-white/5 text-white/40': t.tone === 'muted',
                            })}>{t.status}</span>
                            <span className="text-[10px] text-white/30">{t.time}</span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {tab === 'approvals' && (
                    <motion.div key="approvals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mx-auto max-w-xl">
                      <p className="text-sm text-white/50">With approval mode on, the agent drafts — you decide.</p>
                      <div className="mt-5 space-y-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                        <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-white/10 px-3.5 py-2 text-sm text-white">Hi, can I bring my daughter for a trim at the same time as my colour?</div>
                        <div className={clsx('w-fit max-w-[88%] rounded-2xl rounded-bl-md border px-3.5 py-2 text-sm transition-colors', approved ? 'border-emerald-400/30 bg-emerald-400/10 text-white' : 'border-dashed border-brand-gold/50 bg-brand-gold/5 text-white/85')}>
                          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-brand-gold">{approved ? 'Sent ✓' : 'Draft · waiting for you'}</span>
                          Of course! I can book Mia for your colour at 13:30 and Jess for a junior trim at 14:00, side by side. Shall I lock both in?
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button onClick={() => setApproved(true)} disabled={approved} className="flex-1 rounded-xl bg-brand-gold py-3 text-sm font-bold text-brand-black transition-opacity disabled:opacity-40">
                          {approved ? 'Approved & sent' : 'Approve & send'}
                        </button>
                        <button onClick={() => setApproved(false)} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/80">
                          {approved ? 'Reset' : 'Edit'}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {tab === 'usage' && (
                    <motion.div key="usage" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {USAGE.map((u, i) => (
                          <div key={u.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                            <p className="text-xs text-white/45">{u.label}</p>
                            <p className="mt-1 font-display text-2xl font-bold text-white">
                              {u.used.toLocaleString('en-GB')}
                              <span className="text-sm font-normal text-white/35"> / {u.total.toLocaleString('en-GB')}</span>
                            </p>
                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${(u.used / u.total) * 100}%` }} transition={{ delay: 0.1 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="h-full rounded-full bg-gradient-to-r from-brand-purple-light to-brand-gold" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="mb-4 flex items-center justify-between">
                          <p className="text-sm font-semibold text-white">Bookings by the agent</p>
                          <span className="text-xs text-emerald-300">Last 14 days</span>
                        </div>
                        <div className="flex h-36 items-end gap-1.5 sm:gap-2">
                          {BARS.map((h, i) => (
                            <motion.div
                              key={i}
                              initial={{ height: 0 }}
                              animate={{ height: `${(h / 63) * 100}%` }}
                              transition={{ delay: i * 0.03, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                              className={clsx('flex-1 rounded-t-md', i === BARS.length - 1 ? 'bg-brand-gold' : 'bg-brand-purple-light/60 hover:bg-brand-purple-light')}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
