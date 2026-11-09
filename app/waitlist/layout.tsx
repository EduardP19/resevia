import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join the Resevia Waitlist: Free Setup for Founding Members',
  description: 'Join the waitlist for Resevia, the AI receptionist for salons and clinics. First 50 businesses get free setup worth £499 and their first month free.',
  alternates: { canonical: 'https://resevia.co.uk/waitlist' },
  openGraph: { title: 'Join the Resevia Waitlist: Free Setup for Founding Members', description: 'Join the waitlist for Resevia, the AI receptionist for salons and clinics. First 50 businesses get free setup worth £499 and their first month free.', url: 'https://resevia.co.uk/waitlist', type: 'website' },
};

export default function WaitlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
