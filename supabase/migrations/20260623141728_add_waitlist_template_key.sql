alter table public.message_templates
add column if not exists template_key text;

create unique index if not exists idx_message_templates_template_key_unique
    on public.message_templates(template_key);

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
