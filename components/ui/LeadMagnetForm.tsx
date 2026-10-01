'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { useAnalytics } from '@/components/analytics/AnalyticsProvider';

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[16px] text-brand-black transition-shadow focus:border-brand-purple focus:outline-none focus:ring-4 focus:ring-brand-purple/15 sm:text-sm';

interface LeadMagnetFormProps {
  source: string;
  submitLabel?: string;
}

export function LeadMagnetForm({ source, submitLabel = 'Get my free audit' }: LeadMagnetFormProps) {
  const { logEvent } = useAnalytics();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const data = {
      source,
      first_name: fd.get('first_name'),
      email: fd.get('email'),
      business_name: fd.get('business_name'),
      industry: fd.get('industry'),
      whatsapp_setup: fd.get('whatsapp_setup'),
      website: fd.get('website'), // honeypot
    };
    const meta = { form_name: source, industry: data.industry, whatsapp_setup: data.whatsapp_setup };
    logEvent('WEBSITE_FORM_SUBMIT', meta);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Something went wrong');

      setSuccess(true);
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead');
      }
    } catch (err: any) {
      logEvent('WEBSITE_FORM_SUBMIT_ERROR', { ...meta, error_message: err.message });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-brand-purple/20 bg-brand-purple/5 p-8 text-center shadow-lg">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold shadow-[0_0_20px_rgba(201,169,110,0.5)]">
          <svg className="h-7 w-7 text-brand-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-bold text-brand-black">Request received</h3>
        <p className="mt-3 text-brand-gray">
          Thanks! We&apos;ll review your details and email your personalised WhatsApp automation audit within 2 working days. Check your inbox for a confirmation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-4 text-left">
      <div>
        <label htmlFor="first_name" className="mb-1 block text-sm font-medium text-brand-black">First name *</label>
        <input id="first_name" name="first_name" type="text" required autoComplete="given-name" className={inputClass} placeholder="First name" />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-brand-black">Email address *</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} placeholder="hello@example.com" />
      </div>
      <div>
        <label htmlFor="business_name" className="mb-1 block text-sm font-medium text-brand-black">Business name</label>
        <input id="business_name" name="business_name" type="text" autoComplete="organization" className={inputClass} placeholder="Your business" />
      </div>
      <div>
        <label htmlFor="industry" className="mb-1 block text-sm font-medium text-brand-black">Your industry *</label>
        <select id="industry" name="industry" required className={inputClass} defaultValue="">
          <option value="" disabled>Select an industry</option>
          <option value="Beauty/Hair Salon">Beauty / Hair Salon</option>
          <option value="Barbershop">Barbershop</option>
          <option value="Aesthetic Clinic">Aesthetic Clinic</option>
          <option value="Dental Clinic">Dental Clinic</option>
          <option value="Private Clinic/Medspa">Private Clinic / Medspa</option>
          <option value="Physio/Wellness/Spa">Physio, Wellness &amp; Spa</option>
          <option value="Gym/PT">Gym &amp; PT Studios</option>
          <option value="Veterinary">Veterinary Practices</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="whatsapp_setup" className="mb-1 block text-sm font-medium text-brand-black">How do you use WhatsApp today? *</label>
        <select id="whatsapp_setup" name="whatsapp_setup" required className={inputClass} defaultValue="">
          <option value="" disabled>Select one</option>
          <option value="Not using WhatsApp yet">Not using WhatsApp yet</option>
          <option value="Personal WhatsApp">Personal WhatsApp</option>
          <option value="WhatsApp Business app">WhatsApp Business app</option>
          <option value="WhatsApp Business API">WhatsApp Business API / platform</option>
        </select>
      </div>

      {/* Honeypot — hidden from people and assistive tech; bots fill it in. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" size="lg" disabled={loading} className="w-full rounded-xl py-4 font-bold shadow-[0_12px_30px_-10px_rgba(109,40,217,0.7)]">
        {loading ? 'Sending...' : submitLabel}
      </Button>
      <p className="text-center text-xs text-brand-gray">
        Free, no obligation. We&apos;ll only use your details to send your audit. See our{' '}
        <Link href="/privacy-policy" className="underline">privacy policy</Link>.
      </p>
    </form>
  );
}
