# Resevia — Project Specification

## Stack
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- Animations: Framer Motion
- Database: Supabase
- Email: Resend.com
- Deployment: Vercel
- Domain: resevia.co.uk

## Brand Colours
- Background: #FFFFFF
- Primary Purple: #6D28D9 — buttons, links, highlights
- Electric Blue: #2563EB — secondary CTAs, hover states
- Sand Gold: #C9A96E — badges, borders, premium accents
- Section BG: #F9F8FF — alternating sections
- Heading Text: #1C1917
- Body Text: #6B7280

## Typography
- Headings: Montserrat (Google Fonts)
- Body: Inter (Google Fonts)

## Tailwind Config
extend.colors.brand:
  purple: '#6D28D9'
  blue: '#2563EB'
  gold: '#C9A96E'
  black: '#1C1917'
  gray: '#6B7280'
  light: '#F9F8FF'

extend.fontFamily:
  sans: ['Inter', 'sans-serif']
  display: ['Montserrat', 'sans-serif']

## Folder Structure
app/
  layout.tsx
  page.tsx
  how-it-works/page.tsx
  industries/page.tsx
  pricing/page.tsx
  waitlist/page.tsx
  api/waitlist/route.ts

components/
  layout/Navbar.tsx
  layout/Footer.tsx
  sections/Hero.tsx
  sections/ProblemBlock.tsx
  sections/SolutionBlock.tsx
  sections/HowItWorks.tsx
  sections/Industries.tsx
  sections/SocialProof.tsx
  sections/PricingTeaser.tsx
  sections/FinalCTA.tsx
  ui/Button.tsx
  ui/Card.tsx
  ui/Badge.tsx
  ui/WaitlistForm.tsx

lib/
  supabase.ts
  resend.ts

styles/globals.css
public/logo.svg
public/og-image.png
.env.local

## Supabase Schema
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT,
  email TEXT UNIQUE NOT NULL,
  industry TEXT,
  appointments_per_week TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON waitlist
  FOR INSERT TO anon
  WITH CHECK (true);

## Environment Variables
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=