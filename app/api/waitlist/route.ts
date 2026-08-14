import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { resend } from '@/lib/resend';
import { renderHtmlTemplate, renderTextTemplate } from '@/lib/emails/renderTemplate';
import { buildWaitlistNotificationEmail } from '@/lib/emails/waitlistNotification';

const NOTIFICATION_RECIPIENT = process.env.WAITLIST_NOTIFICATION_EMAIL || 'eduard@ezwebone.co.uk';

const MAX_FIELD_LENGTH = 200;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Public form input: accept strings only, strip control characters (they can
// forge headers once a value reaches an email subject), and cap the length
// before anything is stored or sent.
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
    const first_name = cleanField(raw.first_name);
    const email = cleanField(raw.email).toLowerCase();
    const industry = cleanField(raw.industry);
    const appointments_per_week = cleanField(raw.appointments_per_week);

    if (!first_name || !email || !industry || !appointments_per_week) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    // Insert into Supabase
    const { error: dbError } = await supabase
      .from('waitlist')
      .insert([
        { first_name, email, industry, appointments_per_week }
      ]);

    if (dbError) {
      if (dbError.code === '23505') { // Unique violation
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      }
      console.error('Waitlist insert error:', dbError);
      return NextResponse.json({ error: 'Could not save your signup. Please try again.' }, { status: 500 });
    }

    // Notify the team first, so a lead is never lost to a problem with the
    // customer-facing confirmation further down. Failures here are swallowed —
    // the signup itself has already succeeded.
    try {
      const notification = buildWaitlistNotificationEmail({
        first_name,
        email,
        industry,
        appointments_per_week,
      });

      const { error: notificationError } = await resend.emails.send({
        from: 'Resevia <hello@resevia.co.uk>',
        to: NOTIFICATION_RECIPIENT,
        replyTo: email,
        subject: notification.subject,
        text: notification.text,
        html: notification.html,
      });

      if (notificationError) {
        console.error('Failed to send waitlist notification:', notificationError);
      }
    } catch (notificationException) {
      console.error('Waitlist notification error:', notificationException);
    }

    // The signup is already saved, so everything below is best-effort: a
    // problem sending the confirmation must never be reported to someone whose
    // spot was reserved successfully, or they retry and hit the duplicate 409.
    try {
      const admin = getSupabaseAdmin();
      const { data: template, error: templateError } = await admin
        .from('message_templates')
        .select('subject, body_text, body_html')
        .eq('template_key', 'waitlist_signup')
        .eq('channel', 'email')
        .eq('is_active', true)
        .maybeSingle();

      if (templateError || !template) {
        console.error('Waitlist template error:', templateError ?? 'template not found');
      } else {
        const subject = renderTextTemplate(template.subject || '', { first_name });
        const text = renderTextTemplate(template.body_text || '', { first_name });
        const html = template.body_html ? renderHtmlTemplate(template.body_html, { first_name }) : null;
        const { data: businessProfile, error: businessProfileError } = await admin
          .from('business_profiles')
          .select('email')
          .limit(1)
          .maybeSingle();

        if (businessProfileError) {
          console.error('Business profile email error:', businessProfileError);
        }

        const replyTo = businessProfile?.email || 'hello@resevia.co.uk';

        const { error: emailError } = await resend.emails.send({
          from: 'Resevia <hello@resevia.co.uk>',
          to: email,
          replyTo,
          subject,
          text,
          ...(html ? { html } : {}),
          headers: {
            'List-Unsubscribe': '<mailto:hello@resevia.co.uk?subject=unsubscribe>',
          },
        });

        if (emailError) {
          console.error('Failed to send email:', emailError);
        }
      }
    } catch (confirmationException) {
      console.error('Waitlist confirmation error:', confirmationException);
    }

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
