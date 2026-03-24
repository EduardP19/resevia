import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { resend } from '@/lib/resend';

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

    // Send confirmation email
    const htmlTemplate = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap');
    </style>
  </head>
  <body
    style="margin: 0; padding: 0; background-color: #F9F8FF; font-family: 'Montserrat', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;"
  >
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
            <!-- Header -->
            <tr>
              <td style="padding: 40px; text-align: center; border-bottom: 1px solid #F3F4F6;">
                <h1
                  style="margin: 0; color: #1C1917; font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;"
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

            <!-- Body -->
            <tr>
              <td style="padding: 40px; color: #6B7280; font-size: 16px; line-height: 1.6;">
                <p style="margin: 0 0 20px 0; color: #1C1917; font-size: 18px; font-weight: 500;">
                  Hi ${first_name || 'there'},
                </p>

                <p style="margin: 0 0 24px 0;">
                  You're officially on the waitlist for Resevia. We are excited to have you join our exclusive early
                  access group.
                </p>

                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                  <tr>
                    <td
                      style="background-color: #F9F8FF; border: 1px solid #E5E7EB; border-left: 4px solid #6D28D9; padding: 20px; border-radius: 6px;"
                    >
                      <p style="margin: 0; color: #1C1917; font-weight: 500;">🎁 Founding Member Perks</p>
                      <p style="margin: 8px 0 0 0; font-size: 14px;">
                        As one of our first 50 members, you've secured <strong>free setup (worth £499)</strong> and your <strong>first month free</strong>.
                      </p>
                    </td>
                  </tr>
                </table>

                <p style="margin: 0 0 24px 0;">
                  Keep an eye on this inbox. We will be in touch shortly with your onboarding details so you can start
                  reclaiming your time and booking more clients.
                </p>

                <p style="margin: 0;">Warm regards,<br /><strong style="color: #1C1917;">The Resevia Team</strong></p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 30px 40px; background-color: #1C1917; text-align: center;">
                <p style="margin: 0; color: #9CA3AF; font-size: 13px;">&copy; 2026 Resevia. All rights reserved.</p>
                <p style="margin: 8px 0 0 0; color: #6B7280; font-size: 12px;">London, United Kingdom</p>
              </td>
            </tr>
          </table>

          <!-- Bottom spacing -->
          <table width="600" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td height="40"></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'hello@resevia.co.uk',
      to: email,
      subject: "You're on the Resevia waitlist",
      html: htmlTemplate
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
