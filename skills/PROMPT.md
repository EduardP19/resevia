# Resevia — Agent Build Instructions

Read SPEC.md and COPY.md fully before writing any code.
SPEC.md is your technical source of truth.
COPY.md is your content source of truth.
Never invent copy or colours — use exactly what is defined.

---

## Build Order

### Step 1 — Project Setup
- Init Next.js 14 with App Router and TypeScript
- Install: tailwindcss, framer-motion, @supabase/supabase-js, resend
- Configure tailwind.config.ts with brand colours and fonts from SPEC.md
- Add Inter and Syne from Google Fonts in layout.tsx
- Set up globals.css with base Tailwind directives

### Step 2 — Supabase
- Create lib/supabase.ts with createClient using env variables
- The schema is defined in SPEC.md — do not modify it

### Step 3 — Resend
- Create lib/resend.ts
- Confirmation email from: hello@resevia.co.uk
- Subject: You're on the Resevia waitlist
- Body: confirm signup, mention 30% discount, say we'll be in touch

### Step 4 — API Route
- Create app/api/waitlist/route.ts
- POST handler: validate email, insert to Supabase, send Resend email
- Handle duplicate email with 409 response
- Handle missing email with 400 response

### Step 5 — UI Components
Build in this order:
1. ui/Button.tsx — primary (purple), secondary (outline gold), sizes sm/md/lg
2. ui/Badge.tsx — small pill, gold bg, purple text
3. ui/Card.tsx — white bg, subtle border, rounded-xl, padding
4. ui/WaitlistForm.tsx — email + industry dropdown, calls /api/waitlist,
   shows success/error state, no page reload

### Step 6 — Layout
1. Navbar.tsx — logo left, nav links centre, CTA button right, sticky, white bg
2. Footer.tsx — logo + tagline, links, legal, copyright

### Step 7 — Home Page Sections
Build each as its own component in components/sections/.
Use COPY.md for every word. Use Framer Motion for scroll animations.
Build in this order:

1. Hero.tsx
   - Full width, white bg
   - H1 headline, subheadline, CTA button, supporting text
   - Subtle fade-up animation on load

2. ProblemBlock.tsx
   - Off-white (#F9F8FF) bg
   - Section label, headline, body text
   - 3 pain point cards with icon, title, description

3. SolutionBlock.tsx
   - White bg
   - Label, headline, body
   - 3 benefit cards with checkmark icon

4. HowItWorks.tsx
   - Off-white bg
   - Label, headline
   - 3 steps in horizontal layout (mobile: vertical)
   - Step number in purple circle, title, description

5. Industries.tsx
   - White bg
   - Label, headline
   - 6 industry cards in 3x2 grid (mobile: 2x3)
   - Icon + industry name, gold border on hover

6. SocialProof.tsx
   - Purple (#6D28D9) bg, white text
   - Headline, stat, trust line

7. PricingTeaser.tsx
   - Off-white bg
   - Label, headline
   - 3 pricing cards, Growth card highlighted with purple border
   - Gold badge on Growth: "Most popular"
   - Discount note below cards

8. FinalCTA.tsx
   - White bg
   - Headline, body
   - Inline WaitlistForm component

### Step 8 — Pages
1. app/page.tsx — import and render all sections in order
2. app/how-it-works/page.tsx — use COPY.md How It Works section
3. app/industries/page.tsx — use COPY.md Industries section
4. app/pricing/page.tsx — use COPY.md Pricing section
5. app/waitlist/page.tsx — full waitlist form, use COPY.md Waitlist section

### Step 9 — Metadata
In layout.tsx set:
- title: Resevia — Your AI Receptionist
- description: Resevia handles calls, bookings and enquiries 24/7
- og:image: /og-image.png
- favicon: /logo.svg

### Step 10 — Final Checks
- All pages mobile responsive
- WaitlistForm works end to end
- No hardcoded colours — use Tailwind brand classes only
- No placeholder copy — everything from COPY.md
- Run next build with zero errors before handing back