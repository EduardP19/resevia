import React from 'react';

// Dark header band for inner pages, matching the homepage hero.
export function PageHero({ eyebrow, title, subtitle, children }: { eyebrow: string; title: React.ReactNode; subtitle?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-[#0C0A1D] pb-20 pt-36 sm:pt-44">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] animate-aurora rounded-full bg-brand-purple/40 blur-[120px]" />
        <div className="absolute -right-32 top-10 h-[26rem] w-[26rem] animate-aurora rounded-full bg-brand-gold/15 blur-[120px] [animation-delay:-8s]" />
        <div className="bg-grid-dark mask-radial absolute inset-0" />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <span className="eyebrow-dark">{eyebrow}</span>
        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
