# Resevia — AI Booking Agent for Beauty Salons

**Resevia** is an AI-powered booking agent that handles reservations and customer engagement for beauty salons — starting with salons, with broader service businesses to follow. This repo contains the public-facing marketing website and waitlist funnel, built to validate the product and capture early interest.

> Live site: [resevia.com](https://resevia.com)

---

## What This Is

A conversion-focused marketing site designed to explain the product, build trust, and capture leads via a waitlist. Key sections include:

- **Hero** — value proposition and primary CTA
- **Problem / Solution** — framing the pain restaurants face
- **How It Works** — step-by-step product walkthrough
- **Industries** — target verticals (beauty salons, service businesses)
- **Social Proof & Reviews** — trust-building
- **Pricing Teaser** — tiered plans preview
- **Waitlist** — lead capture with email confirmation via Resend
- **Legal** — Privacy Policy and Terms of Service pages

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Database | Supabase (Postgres) — waitlist storage |
| Email | [Resend](https://resend.com) — transactional email |
| Analytics | Microsoft Clarity, Meta Pixel, custom UTM/event tracking |
| Deployment | Vercel |
| Fonts | Montserrat (headings) + Inter (body) |

---

## How It Was Built — Claude Code as Co-Pilot

This project was built primarily through **natural language prompting with [Claude Code](https://claude.ai/code)** — Anthropic's AI coding agent — rather than writing code by hand.

The approach:

1. **Describe, don't write** — pages, components, and features were specified in plain English. Claude Code generated the implementation, handled wiring (API routes, Supabase schema, email flows), and iterated on design.
2. **Prompt-driven iteration** — UI refinements, branding changes (logo, fonts, animations), and feature additions were all driven by follow-up prompts rather than manual edits.
3. **Agent autonomy** — Claude Code managed file structure, resolved TypeScript errors, installed dependencies, and maintained consistency across components without manual intervention.
4. **Git history as a prompt log** — each commit roughly maps to a prompting session or design direction change, showing how the site evolved from a blank canvas to a polished marketing funnel in a short time.

This workflow demonstrates how a **non-engineering founder or solo developer** can ship a production-quality web product at speed using AI-assisted development — writing minimal raw code while maintaining full ownership of architecture decisions and product direction.

---

## Project Structure

```
/app               # Next.js App Router pages (routes, API endpoints)
  /api/waitlist    # Waitlist form submission → Supabase + Resend
  /pricing         # Pricing page
  /how-it-works    # Feature walkthrough
  /waitlist        # Waitlist landing page
  /privacy-policy  # Legal
  /terms           # Legal
/components        # Reusable UI components
  /layout          # Navbar, Footer
  /sections        # Homepage sections (Hero, HowItWorks, etc.)
/lib               # Utility functions
/public            # Static assets (logo, images)
```

---

## Environment Variables

Sensitive credentials are kept out of the repo via `.env.local` (gitignored). To run locally, create `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
```

---


## What This Demonstrates

- Full-stack Next.js app with server-side API routes
- Supabase integration for persistent data storage
- Transactional email with Resend
- Analytics instrumentation (UTM tracking, custom events, Clarity, Meta Pixel)
- Animated SVG branding and polished UI with Framer Motion
- Production deployment on Vercel
- **AI-assisted development workflow using Claude Code**
