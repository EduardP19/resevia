import { SOLUTIONS } from '@/content/solutions';

const SITE_URL = 'https://resevia.co.uk';

export const dynamic = 'force-static';

export function GET() {
  const body = `# Resevia

> Resevia is an AI receptionist for UK beauty salons, aesthetic clinics, dental practices and other appointment-based businesses. It answers calls, WhatsApp, SMS and website chat 24/7, books appointments into your calendar, sends reminders and follows up no-shows.

## Solutions
${SOLUTIONS.map((s) => `- [${s.name}](${SITE_URL}/solutions/${s.slug}): ${s.summary}`).join('\n')}

## Key pages
- [Solutions overview](${SITE_URL}/solutions): everything Resevia automates
- [How it works](${SITE_URL}/how-it-works): setup in 24–48 hours, go live on your channels
- [Industries](${SITE_URL}/industries): salons, dental clinics, medspas, gyms, vets
- [Pricing](${SITE_URL}/pricing): Essentials, Growth and Custom plans
- [Blog](${SITE_URL}/blog): guides for appointment-based businesses
- [Waitlist](${SITE_URL}/waitlist): founding-member offer for the first 50 businesses

## Contact
hello@resevia.co.uk
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
