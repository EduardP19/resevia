'use client';

import React, { useState } from 'react';
import { Button } from './Button';
import Cookies from 'js-cookie';
import { useAnalytics } from '@/components/analytics/AnalyticsProvider';
import {
  TOTAL_FOUNDER_SPOTS,
  SIGNED_UP_COOKIE_KEY,
  LEGACY_SLOTS_COOKIE_KEY,
} from '@/lib/founderOffer';

interface WaitlistFormProps {
  onSignupIncrement?: (newSignedUpCount: number) => void;
}

export function WaitlistForm({ onSignupIncrement }: WaitlistFormProps = {}) {
  const { logEvent } = useAnalytics();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      first_name: formData.get('first_name'),
      email: formData.get('email'),
      industry: formData.get('industry'),
      appointments_per_week: formData.get('appointments_per_week'),
    };
    const analyticsMetadata = {
      form_name: 'waitlist',
      industry: data.industry,
      appointments_per_week: data.appointments_per_week,
    };

    logEvent('WEBSITE_FORM_SUBMIT', analyticsMetadata);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      setSuccess(true);

      // Trigger Meta Pixel "Lead" event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead');
      }

      const signedUpCookie = Cookies.get(SIGNED_UP_COOKIE_KEY);
      const legacySlotsCookie = Cookies.get(LEGACY_SLOTS_COOKIE_KEY);

      let currentSignedUps = 0;

      if (signedUpCookie) {
        const parsedSignedUps = parseInt(signedUpCookie, 10);
        if (!isNaN(parsedSignedUps)) {
          currentSignedUps = parsedSignedUps;
        }
      } else if (legacySlotsCookie) {
        const parsedLegacySlots = parseInt(legacySlotsCookie, 10);
        if (!isNaN(parsedLegacySlots)) {
          currentSignedUps = Math.max(0, Math.min(TOTAL_FOUNDER_SPOTS, TOTAL_FOUNDER_SPOTS - parsedLegacySlots));
        }
      }

      const newSignedUpCount = Math.min(TOTAL_FOUNDER_SPOTS, currentSignedUps + 1);
      const newSlotsRemaining = Math.max(0, TOTAL_FOUNDER_SPOTS - newSignedUpCount);

      Cookies.set(SIGNED_UP_COOKIE_KEY, newSignedUpCount.toString(), { expires: 365 });
      Cookies.set(LEGACY_SLOTS_COOKIE_KEY, newSlotsRemaining.toString(), { expires: 365 });

      if (onSignupIncrement) {
        onSignupIncrement(newSignedUpCount);
      }
    } catch (err: any) {
      logEvent('WEBSITE_FORM_SUBMIT_ERROR', {
        ...analyticsMetadata,
        error_message: err.message,
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-brand-purple/5 p-8 rounded-2xl border border-brand-purple/20 text-center shadow-lg">
        <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(201,169,110,0.5)]">
          <svg className="w-8 h-8 text-brand-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-display font-bold text-brand-black mb-3">You're on the list!</h3>
        <p className="text-lg text-brand-purple font-semibold mb-4">✨ Golden Offer Secured ✨</p>
        <p className="text-brand-gray mb-6 leading-relaxed">
          We've reserved your spot for <strong>£0 Setup + First Month Free</strong>. We'll be in touch soon with your early access details.
        </p>
        <div className="pt-6 border-t border-brand-purple/10">
          <p className="text-sm text-brand-gray font-medium">Follow us for updates:</p>
          <p className="text-brand-purple font-bold mt-1">@resevia.ai</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto text-left">
      <div>
        <label htmlFor="first_name" className="block text-sm font-medium text-brand-black mb-1">First Name *</label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          placeholder="First Name"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-brand-black mb-1">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          placeholder="hello@example.com"
        />
      </div>
      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-brand-black mb-1">Your Industry *</label>
        <select
          id="industry"
          name="industry"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple bg-white"
        >
          <option value="">Select an industry</option>
          <option value="Beauty/Hair Salon">Beauty / Hair Salon</option>
          <option value="Dental Clinic">Dental Clinic</option>
          <option value="Private Clinic/Medspa">Private Clinic / Medspa</option>
          <option value="Gym/PT">Gym & PT Studios</option>
          <option value="Veterinary">Veterinary Practices</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="appointments_per_week" className="block text-sm font-medium text-brand-black mb-1">Appointments per week *</label>
        <select
          id="appointments_per_week"
          name="appointments_per_week"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple bg-white"
        >
          <option value="">Select volume</option>
          <option value="0-50">0 - 50</option>
          <option value="51-150">51 - 150</option>
          <option value="151-300">151 - 300</option>
          <option value="300+">300+</option>
        </select>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? 'Submitting...' : 'Secure My Spot'}
      </Button>
      <p className="text-center text-xs text-brand-gray mt-2">No spam. No credit card. Just early access.</p>
    </form>
  );
}
