import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { buildLeadConfirmationEmail, buildLeadNotificationEmail } from '@/lib/emails/leadNotification';

const NOTIFICATION_RECIPIENT = process.env.WAITLIST_NOTIFICATION_EMAIL || 'eduard@ezwebone.co.uk';

const MAX_FIELD_LENGTH = 200;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_SOURCES = new Set(['whatsapp-automation-audit']);

// Public form input: strings only, control characters stripped (they can forge
// email headers) and length capped before anything is sent.
function cleanField(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, MAX_FIELD_LENGTH);
}

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const raw = (body ?? {}) as Record<string, unknown>;

    // Honeypot: real users never fill this hidden field. Pretend success.
    if (cleanField(raw.website)) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const source = cleanField(raw.source);
    const first_name = cleanField(raw.first_name);
    const email = cleanField(raw.email).toLowerCase();
    const business_name = cleanField(raw.business_name);
    const industry = cleanField(raw.industry);
    const whatsapp_setup = cleanField(raw.whatsapp_setup);

    if (!ALLOWED_SOURCES.has(source)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    if (!first_name || !email || !industry || !whatsapp_setup) {
      return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 });
    }
    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    // The team notification is the system of record for this lead, so a
    // failure here is reported rather than swallowed.
    const notification = buildLeadNotificationEmail({ source, first_name, email, business_name, industry, whatsapp_setup });
    const { error: notificationError } = await resend.emails.send({
      from: 'Resevia <hello@resevia.co.uk>',
      to: NOTIFICATION_RECIPIENT,
      replyTo: email,
      subject: notification.subject,
      text: notification.text,
      html: notification.html,
    });
    if (notificationError) {
      console.error('Lead notification error:', notificationError);
      return NextResponse.json({ error: 'Could not send your request. Please try again.' }, { status: 500 });
    }

    // Confirmation to the lead is best-effort.
    try {
      const confirmation = buildLeadConfirmationEmail(first_name);
      const { error } = await resend.emails.send({
        from: 'Resevia <hello@resevia.co.uk>',
        to: email,
        replyTo: 'hello@resevia.co.uk',
        subject: confirmation.subject,
        text: confirmation.text,
        html: confirmation.html,
        headers: { 'List-Unsubscribe': '<mailto:hello@resevia.co.uk?subject=unsubscribe>' },
      });
      if (error) console.error('Lead confirmation error:', error);
    } catch (e) {
      console.error('Lead confirmation exception:', e);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Leads API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
