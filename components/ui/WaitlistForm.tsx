'use client';

import React, { useState } from 'react';
import { Button } from './Button';
import Cookies from 'js-cookie';

interface WaitlistFormProps {
  onSlotDecrement?: (newSlots: number) => void;
}

export function WaitlistForm({ onSlotDecrement }: WaitlistFormProps = {}) {
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

      const existingCookie = Cookies.get('resevia_slots');
      if (existingCookie) {
        let current = parseInt(existingCookie, 10);
        if (!isNaN(current)) {
          const newVal = Math.max(0, current - 1);
          Cookies.set('resevia_slots', newVal.toString(), { expires: 365 });
          if (onSlotDecrement) {
            onSlotDecrement(newVal);
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-brand-light p-6 rounded-xl border border-green-200 text-center">
        <h3 className="text-xl font-display font-semibold text-brand-black mb-2">You're on the list.</h3>
        <p className="text-brand-gray mb-4">We'll be in touch with your early access details.</p>
        <p className="text-sm">Follow us on Instagram for updates.</p>
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
