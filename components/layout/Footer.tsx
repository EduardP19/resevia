import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  return (
    <footer className="bg-[#271549] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-6 transition-opacity hover:opacity-90">
              <Logo theme="dark" />
            </Link>
            <p className="text-white/60">Your AI receptionist. Always ready.</p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/how-it-works" className="text-white/60 hover:text-brand-gold text-sm transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/industries" className="text-white/60 hover:text-brand-gold text-sm transition-colors">
                  Industries
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-white/60 hover:text-brand-gold text-sm transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-brand-gold text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-white/60 hover:text-brand-gold text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-brand-gold text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/40">
          <p>© 2026 Resevia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
