import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { resend } from '@/lib/resend';
import { buildWaitlistConfirmationEmail } from '@/lib/emails/waitlistConfirmation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { first_name, email, industry, appointments_per_week } = body;

    if (!first_name || !email || !industry || !appointments_per_week) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
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
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Send branded confirmation email (HTML + plain-text for deliverability)
    const { subject, html, text } = buildWaitlistConfirmationEmail(first_name);

    const { error: emailError } = await resend.emails.send({
      from: 'Resevia <hello@resevia.co.uk>',
      to: email,
      replyTo: 'hello@resevia.co.uk',
      subject,
      html,
      text,
      headers: {
        'List-Unsubscribe': '<mailto:hello@resevia.co.uk?subject=unsubscribe>',
      },
    });

    if (emailError) {
      console.error('Failed to send email:', emailError);
      // We don't want to fail the waitlist signup just because the email failed
    }

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
