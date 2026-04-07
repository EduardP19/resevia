## Resevia Platform

This repository now uses a platform-style layout so the web and agent work can be separated
cleanly over time.

## Structure

```text
resevia/
  apps/
    web/      public website and waitlist app
    agent/    future home of the agent runtime and internal app
```

Current status:

- `apps/web` is the active Next.js website.
- `apps/agent` is a placeholder workspace so the repo shape is ready for the agent migration.
- A nested `resevia-agent/` directory is ignored here to avoid mixing the old layout into this
  repo during the transition.

## Commands

Run these from the repository root:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Right now those root commands target `apps/web`.

## Web Environment

The website environment file now lives under `apps/web`.

Copy `apps/web/.env.example` to `apps/web/.env.local` and provide:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_CLARITY_PROJECT_ID`
- `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`
- `NEXT_PUBLIC_RESEVIA_APP_URL`

Current app route assumptions used by the website:

- `https://app.resevia.co.uk/dashboard` for the internal dashboard
- `https://app.resevia.co.uk/test` for the Twilio-bypass test flow
