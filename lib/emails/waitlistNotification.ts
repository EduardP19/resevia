// Internal notification sent to the team whenever someone reserves a founding
// spot via the waitlist form. Unlike the customer-facing confirmation, this one
// is built in code rather than pulled from message_templates — it is never
// edited from the dashboard and must not depend on a DB row being present.

export interface WaitlistNotificationEmail {
  subject: string;
  html: string;
  text: string;
}

export interface WaitlistSignupDetails {
  first_name: string;
  email: string;
  industry: string;
  appointments_per_week: string | number;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildWaitlistNotificationEmail(
  details: WaitlistSignupDetails
): WaitlistNotificationEmail {
  const { first_name, email, industry, appointments_per_week } = details;

  const submittedAt = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Europe/London',
  }).format(new Date());

  // Defence in depth: callers are expected to have sanitised already, but a
  // newline reaching a subject header is how header injection happens.
  const subjectSafe = (value: string) => value.replace(/[\u0000-\u001F\u007F]/g, ' ').trim();
  const subject = `New waitlist signup: ${subjectSafe(first_name)} (${subjectSafe(industry)})`;

  const rows: Array<[string, string]> = [
    ['Name', first_name],
    ['Email', email],
    ['Industry', industry],
    ['Appointments / week', String(appointments_per_week)],
    ['Submitted', `${submittedAt} (UK time)`],
  ];

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light only" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin: 0; padding: 24px; background-color: #F9F8FF; font-family: Helvetica, Arial, sans-serif; color: #1C1917;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table width="560" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E5E7EB;">
            <tr>
              <td style="padding: 24px 28px; border-bottom: 1px solid #F3F4F6;">
                <p style="margin: 0; color: #6D28D9; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">New waitlist signup</p>
                <h1 style="margin: 6px 0 0 0; font-size: 22px; font-weight: 700;">${escapeHtml(first_name)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 28px 24px 28px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 15px;">
                  ${rows
                    .map(
                      ([label, value]) => `<tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #F3F4F6; color: #6B7280; width: 180px; vertical-align: top;">${escapeHtml(label)}</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #F3F4F6; color: #1C1917; font-weight: 600;">${escapeHtml(value)}</td>
                  </tr>`
                    )
                    .join('\n                  ')}
                </table>
                <p style="margin: 24px 0 0 0; font-size: 14px; color: #6B7280;">
                  Reply to this email to reach ${escapeHtml(first_name)} directly &mdash; the reply-to is set to their address.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `NEW WAITLIST SIGNUP

${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}

Reply to this email to reach ${first_name} directly — the reply-to is set to their address.`;

  return { subject, html, text };
}
