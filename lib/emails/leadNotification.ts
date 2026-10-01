// Internal notification for lead-magnet form submissions (e.g. the free
// WhatsApp automation audit). Built in code so it never depends on a DB row.

export interface LeadDetails {
  source: string;
  first_name: string;
  email: string;
  business_name: string;
  industry: string;
  whatsapp_setup: string;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildLeadNotificationEmail(lead: LeadDetails) {
  const submittedAt = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Europe/London',
  }).format(new Date());

  const subjectSafe = (v: string) => v.replace(/[\u0000-\u001F\u007F]/g, ' ').trim();
  const subject = `New lead (${subjectSafe(lead.source)}): ${subjectSafe(lead.first_name)}${lead.business_name ? ` — ${subjectSafe(lead.business_name)}` : ''}`;

  const rows: Array<[string, string]> = [
    ['Source', lead.source],
    ['Name', lead.first_name],
    ['Email', lead.email],
    ['Business', lead.business_name || '—'],
    ['Industry', lead.industry],
    ['Current WhatsApp setup', lead.whatsapp_setup],
    ['Submitted', `${submittedAt} (UK time)`],
  ];

  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:24px;background:#F9F8FF;font-family:Helvetica,Arial,sans-serif;color:#1C1917;">
  <table width="560" align="center" cellspacing="0" cellpadding="0" style="background:#fff;border:1px solid #E5E7EB;border-radius:12px;">
    <tr><td style="padding:24px 28px;border-bottom:1px solid #F3F4F6;">
      <p style="margin:0;color:#6D28D9;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">New lead</p>
      <h1 style="margin:6px 0 0;font-size:22px;">${escapeHtml(lead.first_name)}</h1>
    </td></tr>
    <tr><td style="padding:8px 28px 24px;">
      <table width="100%" cellspacing="0" cellpadding="0" style="font-size:15px;">
        ${rows
          .map(
            ([l, v]) =>
              `<tr><td style="padding:12px 0;border-bottom:1px solid #F3F4F6;color:#6B7280;width:200px;vertical-align:top;">${escapeHtml(l)}</td><td style="padding:12px 0;border-bottom:1px solid #F3F4F6;font-weight:600;">${escapeHtml(v)}</td></tr>`
          )
          .join('')}
      </table>
      <p style="margin:24px 0 0;font-size:14px;color:#6B7280;">Reply to this email to reach ${escapeHtml(lead.first_name)} directly.</p>
    </td></tr>
  </table>
</body></html>`;

  const text = `NEW LEAD\n\n${rows.map(([l, v]) => `${l}: ${v}`).join('\n')}\n\nReply to this email to reach ${lead.first_name} directly.`;
  return { subject, html, text };
}

export function buildLeadConfirmationEmail(firstName: string) {
  const name = escapeHtml(firstName);
  const subject = 'Your free WhatsApp automation audit — we’re on it';
  const text = `Hi ${firstName},\n\nThanks for requesting your free WhatsApp automation audit. We’ll review the details you sent and come back to you by email with a personalised plan for your business within 2 working days.\n\nIf you want to add anything in the meantime, just reply to this email.\n\nThe Resevia team\nhello@resevia.co.uk`;
  const html = `<!DOCTYPE html>
<html lang="en"><body style="margin:0;padding:24px;background:#F9F8FF;font-family:Helvetica,Arial,sans-serif;color:#1C1917;">
  <table width="560" align="center" cellspacing="0" cellpadding="0" style="background:#fff;border:1px solid #E5E7EB;border-radius:12px;">
    <tr><td style="padding:28px;">
      <p style="margin:0 0 16px;font-size:16px;">Hi ${name},</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Thanks for requesting your free WhatsApp automation audit. We’ll review the details you sent and come back to you by email with a personalised plan for your business within 2 working days.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">If you want to add anything in the meantime, just reply to this email.</p>
      <p style="margin:0;font-size:16px;">The Resevia team<br /><a href="mailto:hello@resevia.co.uk" style="color:#6D28D9;">hello@resevia.co.uk</a></p>
    </td></tr>
  </table>
</body></html>`;
  return { subject, text, html };
}
