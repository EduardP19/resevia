import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <span className="font-display font-bold text-2xl tracking-tight text-brand-black mb-4 block">Resevia</span>
            <p className="text-brand-gray">Your AI receptionist. Always ready.</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-brand-black mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/how-it-works" className="text-brand-gray hover:text-brand-purple text-sm transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/industries" className="text-brand-gray hover:text-brand-purple text-sm transition-colors">
                  Industries
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-brand-gray hover:text-brand-purple text-sm transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-brand-gray hover:text-brand-purple text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-brand-black mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-brand-gray hover:text-brand-purple text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-brand-gray hover:text-brand-purple text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-brand-gray">
          <p>© 2025 Resevia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
