import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { resend } from '@/lib/resend';
import { renderHtmlTemplate, renderTextTemplate } from '@/lib/emails/renderTemplate';

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

    const admin = getSupabaseAdmin();
    const { data: template, error: templateError } = await admin
      .from('message_templates')
      .select('subject, body_text, body_html')
      .eq('template_key', 'waitlist_signup')
      .eq('channel', 'email')
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      console.error('Waitlist template error:', templateError);
      return NextResponse.json({ error: 'Waitlist email template not found' }, { status: 500 });
    }

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
      // We don't want to fail the waitlist signup just because the email failed
    }

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
