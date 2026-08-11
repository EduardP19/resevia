-- Supabase SQL Schema for Resevia

-- 1. Logs Table (Analytics)
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    event_type TEXT NOT NULL,
    url TEXT,
    stampuser TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS for logs
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for logs
CREATE POLICY "Allow anonymous inserts" ON public.logs
    FOR INSERT WITH CHECK (true);

-- 2. Waitlist Table
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    first_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    industry TEXT NOT NULL,
    appointments_per_week TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS for waitlist
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for waitlist
CREATE POLICY "Allow anonymous signups" ON public.waitlist
    FOR INSERT WITH CHECK (true);

-- 3. Blog Posts Table (Supabase-backed CMS)
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    body TEXT NOT NULL,                       -- markdown
    cover_image TEXT,                         -- optional override; defaults to /blog/<slug>.png
    keywords TEXT[] DEFAULT '{}'::text[],
    author TEXT DEFAULT 'The Resevia Team',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ
);

-- Enable RLS for blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts only. Drafts and writes are restricted to the
-- service role (used by the seed script), which bypasses RLS.
CREATE POLICY "Public can read published posts" ON public.blog_posts
    FOR SELECT USING (status = 'published');

-- 4. Message Templates Table
CREATE TABLE IF NOT EXISTS public.message_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    template_key TEXT UNIQUE,
    name TEXT NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('email', 'sms')),
    subject TEXT,
    body_text TEXT NOT NULL,
    body_html TEXT,
    parameter_keys TEXT[] DEFAULT '{}'::text[],
    description TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    UNIQUE (name, channel),
    UNIQUE (id, channel),
    CONSTRAINT message_templates_subject_check CHECK (
        (channel = 'email' AND subject IS NOT NULL AND btrim(subject) <> '')
        OR (channel = 'sms' AND subject IS NULL)
    )
);

INSERT INTO public.message_templates (
    template_key,
    name,
    channel,
    subject,
    body_text,
    body_html,
    parameter_keys,
    description,
    is_active,
    metadata
)
VALUES (
    'waitlist_signup',
    'Waitlist Signup Confirmation',
    'email',
    'Your Resevia founding spot is confirmed 🎉',
    'Hi {{first_name}},

Your spot is officially reserved. You''re one of the first 50 founding salons to get early access to Resevia — thank you for joining us early.

YOUR FOUNDING MEMBER PERKS (secured):
- Free setup, worth £499
- Your first month free
- Priority support & early access to every new feature

WHAT HAPPENS NEXT
1. Within a few days, a member of our team will email you to learn about your salon and confirm your onboarding date.
2. We set everything up for you — your AI receptionist is trained on your services, prices and opening hours. Nothing for you to build.
3. You go live — every call answered, every booking captured, 24/7. Your first month is on us.

Have a question in the meantime? Just reply to this email — it comes straight to our team.

Warm regards,
The Resevia Team',
    '<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light only" />
    <title>Your Resevia founding spot is confirmed 🎉</title>
    <style>
      @import url(''https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap'');
    </style>
  </head>
  <body
    style="margin: 0; padding: 0; background-color: #F9F8FF; font-family: ''Montserrat'', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;"
  >
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; mso-hide: all;">
      Your spot is reserved — free setup (worth £499) and your first month free. Here is what happens next.
    </div>
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F9F8FF; padding: 40px 0;">
      <tr>
        <td align="center">
          <table
            width="600"
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);"
          >
            <tr>
              <td style="padding: 40px; text-align: center; border-bottom: 1px solid #F3F4F6;">
                <h1
                  style="margin: 0; color: #1C1917; font-family: ''Montserrat'', Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;"
                >
                  Resevia
                </h1>
                <p
                  style="margin: 8px 0 0 0; color: #C9A96E; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;"
                >
                  Your AI Receptionist
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px; color: #6B7280; font-size: 16px; line-height: 1.6;">
                <p style="margin: 0 0 20px 0; color: #1C1917; font-size: 18px; font-weight: 500;">
                  Hi {{first_name}},
                </p>
                <p style="margin: 0 0 24px 0;">
                  Your spot is officially reserved. You''re one of the first 50 founding salons to get early access to Resevia — thank you for joining us early.
                </p>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                  <tr>
                    <td
                      style="background-color: #F9F8FF; border: 1px solid #E5E7EB; border-left: 4px solid #6D28D9; padding: 20px; border-radius: 6px;"
                    >
                      <p style="margin: 0; color: #1C1917; font-weight: 600;">🎁 Your Founding Member Perks (secured)</p>
                      <p style="margin: 8px 0 0 0; font-size: 14px;">
                        Free setup, <strong>worth £499</strong> &nbsp;•&nbsp; Your <strong>first month free</strong> &nbsp;•&nbsp; Priority support &amp; early access to every new feature.
                      </p>
                    </td>
                  </tr>
                </table>
                <h2 style="margin: 32px 0 16px 0; color: #1C1917; font-size: 18px; font-weight: 700;">What happens next</h2>
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="28" valign="top" style="padding-bottom: 16px;">
                      <div style="width: 24px; height: 24px; background-color: #6D28D9; border-radius: 12px; color: #FFFFFF; text-align: center; line-height: 24px; font-weight: 700; font-size: 13px;">1</div>
                    </td>
                    <td style="padding-left: 12px; padding-bottom: 16px; font-size: 14px;">
                      <strong style="color: #1C1917;">Within a few days</strong> — a member of our team will email you to learn about your salon and confirm your onboarding date.
                    </td>
                  </tr>
                  <tr>
                    <td width="28" valign="top" style="padding-bottom: 16px;">
                      <div style="width: 24px; height: 24px; background-color: #6D28D9; border-radius: 12px; color: #FFFFFF; text-align: center; line-height: 24px; font-weight: 700; font-size: 13px;">2</div>
                    </td>
                    <td style="padding-left: 12px; padding-bottom: 16px; font-size: 14px;">
                      <strong style="color: #1C1917;">We set everything up for you</strong> — your AI receptionist is trained on your services, prices and opening hours. Nothing for you to build.
                    </td>
                  </tr>
                  <tr>
                    <td width="28" valign="top">
                      <div style="width: 24px; height: 24px; background-color: #6D28D9; border-radius: 12px; color: #FFFFFF; text-align: center; line-height: 24px; font-weight: 700; font-size: 13px;">3</div>
                    </td>
                    <td style="padding-left: 12px; font-size: 14px;">
                      <strong style="color: #1C1917;">You go live</strong> — every call answered, every booking captured, 24/7. Your first month is on us.
                    </td>
                  </tr>
                </table>
                <p style="margin: 32px 0 0 0;">
                  Have a question in the meantime? Just <strong style="color: #1C1917;">reply to this email</strong> — it comes straight to our team.
                </p>
                <p style="margin: 24px 0 0 0;">Warm regards,<br /><strong style="color: #1C1917;">The Resevia Team</strong></p>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px 40px; background-color: #1C1917; text-align: center;">
                <p style="margin: 0; color: #9CA3AF; font-size: 13px;">&copy; 2026 Resevia. All rights reserved.</p>
                <p style="margin: 8px 0 0 0; color: #6B7280; font-size: 12px;">London, United Kingdom</p>
                <p style="margin: 12px 0 0 0; color: #6B7280; font-size: 12px;">
                  You''re receiving this because you reserved a founding spot at
                  <a href="https://resevia.co.uk" style="color: #C9A96E; text-decoration: none;">resevia.co.uk</a>.
                </p>
              </td>
            </tr>
          </table>
          <table width="600" border="0" cellspacing="0" cellpadding="0">
            <tr><td height="40"></td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>',
    array['first_name'],
    'Waitlist confirmation email used after a new signup.',
    true,
    '{}'::jsonb
)
ON CONFLICT (template_key) DO UPDATE
SET
    updated_at = now(),
    name = excluded.name,
    channel = excluded.channel,
    subject = excluded.subject,
    body_text = excluded.body_text,
    body_html = excluded.body_html,
    parameter_keys = excluded.parameter_keys,
    description = excluded.description,
    is_active = excluded.is_active,
    metadata = excluded.metadata;

-- 5. Scheduled Messages Queue
CREATE TABLE IF NOT EXISTS public.scheduled_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    send_after TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    claimed_at TIMESTAMPTZ,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'cancelled')),
    channel TEXT NOT NULL CHECK (channel IN ('email', 'sms')),
    template_id UUID NOT NULL,
    campaign_name TEXT,
    recipient_name TEXT,
    recipient_email TEXT,
    recipient_phone TEXT,
    sending_source TEXT,
    param1 TEXT,
    param2 TEXT,
    param3 TEXT,
    param4 TEXT,
    param5 TEXT,
    param6 TEXT,
    template_params JSONB DEFAULT '{}'::jsonb NOT NULL,
    attempt_count INTEGER DEFAULT 0 NOT NULL CHECK (attempt_count >= 0),
    claimed_by TEXT,
    provider_message_id TEXT,
    last_error TEXT,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    CONSTRAINT scheduled_messages_template_fkey
        FOREIGN KEY (template_id, channel)
        REFERENCES public.message_templates(id, channel)
        ON DELETE RESTRICT,
    CONSTRAINT scheduled_messages_recipient_check CHECK (
        (channel = 'email' AND recipient_email IS NOT NULL AND btrim(recipient_email) <> '')
        OR (channel = 'sms' AND recipient_phone IS NOT NULL AND btrim(recipient_phone) <> '')
    )
);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_message_templates_updated_at ON public.message_templates;
CREATE TRIGGER set_message_templates_updated_at
    BEFORE UPDATE ON public.message_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_scheduled_messages_updated_at ON public.scheduled_messages;
CREATE TRIGGER set_scheduled_messages_updated_at
    BEFORE UPDATE ON public.scheduled_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.claim_due_scheduled_messages(
    p_batch_size INTEGER DEFAULT 50,
    p_worker TEXT DEFAULT NULL
)
RETURNS SETOF public.scheduled_messages
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH due AS (
        SELECT sm.id
        FROM public.scheduled_messages sm
        WHERE sm.status = 'pending'
          AND sm.send_after <= now()
        ORDER BY sm.send_after, sm.id
        LIMIT GREATEST(COALESCE(p_batch_size, 50), 1)
        FOR UPDATE SKIP LOCKED
    )
    UPDATE public.scheduled_messages sm
    SET status = 'processing',
        claimed_at = now(),
        claimed_by = COALESCE(p_worker, sm.claimed_by),
        attempt_count = sm.attempt_count + 1,
        updated_at = now()
    FROM due
    WHERE sm.id = due.id
    RETURNING sm.*;
END;
$$;

-- Enable RLS for private messaging tables. Service role bypasses RLS; add
-- explicit policies later if these need to be managed from a client session.
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_messages ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_logs_event_type ON public.logs(event_type);
CREATE INDEX IF NOT EXISTS idx_logs_stampuser ON public.logs(stampuser);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published_at ON public.blog_posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_message_templates_channel_active ON public.message_templates(channel, is_active);
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_due_pending
    ON public.scheduled_messages(send_after, id)
    WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_template_id ON public.scheduled_messages(template_id);
