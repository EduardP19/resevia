-- Message templates for reusable email and SMS copy.
create table if not exists public.message_templates (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    template_key text unique,
    name text not null,
    channel text not null check (channel in ('email', 'sms')),
    subject text,
    body_text text not null,
    body_html text,
    parameter_keys text[] default '{}'::text[],
    description text,
    is_active boolean default true not null,
    metadata jsonb default '{}'::jsonb not null,
    unique (name, channel),
    unique (id, channel),
    constraint message_templates_subject_check check (
        (channel = 'email' and subject is not null and btrim(subject) <> '')
        or (channel = 'sms' and subject is null)
    )
);

insert into public.message_templates (
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
values (
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
2. We set everything up for you — your AI receptionist is trained on your services, prices and opening hours.
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
                  <a href="https://www.resevia.co.uk" style="color: #C9A96E; text-decoration: none;">resevia.co.uk</a>.
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
on conflict (template_key) do update
set
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

-- Scheduled queue for future sends.
create table if not exists public.scheduled_messages (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    send_after timestamptz not null,
    sent_at timestamptz,
    claimed_at timestamptz,
    status text default 'pending' not null check (status in ('pending', 'processing', 'sent', 'failed', 'cancelled')),
    channel text not null check (channel in ('email', 'sms')),
    template_id uuid not null,
    campaign_name text,
    recipient_name text,
    recipient_email text,
    recipient_phone text,
    param1 text,
    param2 text,
    param3 text,
    param4 text,
    param5 text,
    param6 text,
    template_params jsonb default '{}'::jsonb not null,
    attempt_count integer default 0 not null check (attempt_count >= 0),
    claimed_by text,
    provider_message_id text,
    last_error text,
    metadata jsonb default '{}'::jsonb not null,
    constraint scheduled_messages_template_fkey
        foreign key (template_id, channel)
        references public.message_templates(id, channel)
        on delete restrict,
    constraint scheduled_messages_recipient_check check (
        (channel = 'email' and recipient_email is not null and btrim(recipient_email) <> '')
        or (channel = 'sms' and recipient_phone is not null and btrim(recipient_phone) <> '')
    )
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_message_templates_updated_at on public.message_templates;
create trigger set_message_templates_updated_at
    before update on public.message_templates
    for each row
    execute function public.set_updated_at();

drop trigger if exists set_scheduled_messages_updated_at on public.scheduled_messages;
create trigger set_scheduled_messages_updated_at
    before update on public.scheduled_messages
    for each row
    execute function public.set_updated_at();

create or replace function public.claim_due_scheduled_messages(
    p_batch_size integer default 50,
    p_worker text default null
)
returns setof public.scheduled_messages
language plpgsql
as $$
begin
    return query
    with due as (
        select sm.id
        from public.scheduled_messages sm
        where sm.status = 'pending'
          and sm.send_after <= now()
        order by sm.send_after, sm.id
        limit greatest(coalesce(p_batch_size, 50), 1)
        for update skip locked
    )
    update public.scheduled_messages sm
    set status = 'processing',
        claimed_at = now(),
        claimed_by = coalesce(p_worker, sm.claimed_by),
        attempt_count = sm.attempt_count + 1,
        updated_at = now()
    from due
    where sm.id = due.id
    returning sm.*;
end;
$$;

alter table public.message_templates enable row level security;
alter table public.scheduled_messages enable row level security;

create index if not exists idx_message_templates_channel_active
    on public.message_templates(channel, is_active);

create index if not exists idx_scheduled_messages_due_pending
    on public.scheduled_messages(send_after, id)
    where status = 'pending';

create index if not exists idx_scheduled_messages_template_id
    on public.scheduled_messages(template_id);
