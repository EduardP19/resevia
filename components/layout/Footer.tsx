import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { AGENT_SANDBOX_URL } from '@/lib/site';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/#demo', label: 'Live demo' },
      { href: '/how-it-works', label: 'How it works' },
      { href: '/solutions', label: 'Solutions' },
      { href: '/pricing', label: 'Pricing' },
      { href: AGENT_SANDBOX_URL, label: 'Agent sandbox', external: true },
    ],
  },
  {
    title: 'Industries',
    links: [
      { href: '/industries/hair-salons-barbers', label: 'Hair & barbers' },
      { href: '/industries/beauty-salons-nail-bars', label: 'Beauty & nails' },
      { href: '/industries/aesthetic-clinics', label: 'Aesthetic clinics' },
      { href: '/industries/dental-practices', label: 'Dental practices' },
      { href: '/industries', label: 'All industries' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/blog', label: 'Blog' },
      { href: '/waitlist', label: 'Founding offer' },
      { href: 'mailto:hello@resevia.co.uk', label: 'Contact', external: true },
      { href: '/privacy-policy', label: 'Privacy policy' },
      { href: '/terms', label: 'Terms of service' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0C0A1D] pt-20">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-brand-purple/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="inline-block transition-opacity hover:opacity-90">
              <Logo theme="dark" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/50">
              The AI receptionist for salons, clinics and every business that runs on bookings. Every call answered. Every booking captured.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="https://www.instagram.com/resevia.ai" target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 transition-colors hover:border-brand-gold/50 hover:text-brand-gold">
                Instagram
              </a>
              <a href="mailto:hello@resevia.co.uk" className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 transition-colors hover:border-brand-gold/50 hover:text-brand-gold">
                hello@resevia.co.uk
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="text-sm text-white/50 transition-colors hover:text-brand-gold">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="text-sm text-white/50 transition-colors hover:text-brand-gold">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Oversized wordmark. The inner overlap lines (variable-font contours showing through the stroke) are intentional — keep. */}
        <div aria-hidden className="pointer-events-none mt-16 select-none text-center font-display text-[22vw] font-extrabold leading-[0.8] tracking-[-0.06em] text-transparent md:text-[13rem]" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.08)' }}>
          resevia
        </div>

        <div className="relative border-t border-white/10 py-8 text-center text-xs leading-relaxed text-white/35">
          <p>© {new Date().getFullYear()} Resevia, a trading name of EMAGF LTD, registered in England &amp; Wales, company no. 12437054. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
