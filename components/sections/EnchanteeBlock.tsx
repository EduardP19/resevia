"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="mt-1 h-[18px] w-[18px] text-brand-gold">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function EnchanteeBlock() {
  const features = [
    "Answers missed calls and messages instantly, day or night.",
    "Books appointments directly into your workflow.",
    "Keeps your brand voice consistent in every conversation.",
    "Reduces no-shows with clear confirmations and follow-ups.",
    "Gives your team more time for clients instead of admin.",
  ];

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#0a0a0f_0%,#120d20_100%)] py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(109,40,217,0.22),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(201,169,110,0.14),transparent_32%)]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="inline-flex rounded-full border border-[rgba(201,169,110,0.28)] bg-[rgba(201,169,110,0.1)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
         ✦︎ Enchante
          </span>

          <h2 className="mt-6 text-4xl font-display font-bold tracking-tight text-white md:text-6xl">
            Meet Resevia
          </h2>
          <p className="mt-3 text-lg text-brand-gold">
            The AI receptionist built for UK service businesses
          </p>

          <p className="mt-6 text-lg leading-8 text-white/70">
            Resevia answers missed calls, handles enquiries, and books appointments around the
            clock, so your business keeps converting even when your team is busy.
          </p>

          <ul className="mt-8 space-y-4">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-white">
                <IconCheck />
                <span className="leading-7 text-white/75">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <a href="https://app.resevia.co.uk/test-ui" target="_blank" rel="noreferrer">
              <Button
                size="lg"
                className="bg-brand-gold text-brand-black hover:bg-yellow-400 focus:ring-yellow-400 border-none shadow-[0_0_30px_rgba(201,169,110,0.24)]"
              >
                Try it free
              </Button>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="relative"
        >
          <div className="absolute -left-8 top-10 h-24 w-24 rounded-full bg-brand-gold/10 blur-2xl" />
          <div className="mx-auto w-full max-w-[22rem] rounded-[2.2rem] border border-white/10 bg-[#09090f] p-3 shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
            <div className="mb-3 flex justify-center">
              <div className="h-1.5 w-20 rounded-full bg-white/10" />
            </div>

            <div className="rounded-[1.65rem] border border-white/6 bg-[linear-gradient(180deg,#111118,#171727)] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/10">
                    <Logo className="scale-[0.72] [&>div:last-child]:hidden" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Sophia</p>
                    <p className="text-xs text-white/55">Resevia AI receptionist</p>
                  </div>
                </div>
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
              </div>

              <div className="space-y-3 text-sm leading-6">
                <div className="mr-8 rounded-2xl rounded-bl-md border border-[rgba(201,169,110,0.45)] bg-[rgba(201,169,110,0.18)] px-4 py-3 text-white shadow-[0_8px_24px_rgba(201,169,110,0.14)]">
                  Hi, I&apos;d like to book a cut and colour for Saturday.
                </div>

                <div className="ml-8 rounded-2xl rounded-br-md bg-[rgba(109,40,217,0.9)] px-4 py-3 text-white">
                  Hi! I have availability at 10:00, 13:30, or 15:00 on Saturday. Which works best
                  for you?
                </div>

                <div className="mr-16 rounded-2xl rounded-bl-md border border-[rgba(201,169,110,0.45)] bg-[rgba(201,169,110,0.18)] px-4 py-3 text-white shadow-[0_8px_24px_rgba(201,169,110,0.14)]">
                  13:30 please.
                </div>

                <div className="ml-10 rounded-2xl rounded-br-md bg-[rgba(109,40,217,0.9)] px-4 py-3 text-white">
                  You&apos;re all booked in for Saturday at 13:30 with Amo Salon. See you then! ✓
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
