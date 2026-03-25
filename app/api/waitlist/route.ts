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

                <!-- Enhanced Booking Flow -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 32px; background-color: #F9F8FF; border-radius: 12px; padding: 32px;">
                  <tr>
                    <td>
                      <h2 style="margin: 0 0 24px 0; color: #1C1917; font-family: 'Montserrat', Helvetica, sans-serif; font-size: 20px; font-weight: 700; text-align: center;">How Resevia Elevates Your Bookings</h2>
                      
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <!-- Step 1 -->
                        <tr>
                          <td width="40" valign="top" style="padding-bottom: 24px;">
                            <div style="width: 32px; height: 32px; background-color: #6D28D9; border-radius: 16px; color: #FFFFFF; text-align: center; line-height: 32px; font-weight: 700; font-family: 'Montserrat', sans-serif;">1</div>
                          </td>
                          <td style="padding-left: 16px; padding-bottom: 24px;">
                            <p style="margin: 0; color: #1C1917; font-weight: 600; font-size: 16px;">24/7 AI Receptionist</p>
                            <p style="margin: 4px 0 0 0; color: #6B7280; font-size: 14px;">Your AI answers every call instantly, day or night. Never miss another lead to voicemail.</p>
                          </td>
                        </tr>
                        <!-- Step 2 -->
                        <tr>
                          <td width="40" valign="top" style="padding-bottom: 24px;">
                            <div style="width: 32px; height: 32px; background-color: #6D28D9; border-radius: 16px; color: #FFFFFF; text-align: center; line-height: 32px; font-weight: 700; font-family: 'Montserrat', sans-serif;">2</div>
                          </td>
                          <td style="padding-left: 16px; padding-bottom: 24px;">
                            <p style="margin: 0; color: #1C1917; font-weight: 600; font-size: 16px;">Smart Qualification</p>
                            <p style="margin: 4px 0 0 0; color: #6B7280; font-size: 14px;">The AI filters spam and answers FAQs, ensuring only qualified bookings reach your calendar.</p>
                          </td>
                        </tr>
                        <!-- Step 3 -->
                        <tr>
                          <td width="40" valign="top" style="padding-bottom: 24px;">
                            <div style="width: 32px; height: 32px; background-color: #6D28D9; border-radius: 16px; color: #FFFFFF; text-align: center; line-height: 32px; font-weight: 700; font-family: 'Montserrat', sans-serif;">3</div>
                          </td>
                          <td style="padding-left: 16px; padding-bottom: 24px;">
                            <p style="margin: 0; color: #1C1917; font-weight: 600; font-size: 16px;">Seamless Scheduling</p>
                            <p style="margin: 4px 0 0 0; color: #6B7280; font-size: 14px;">Resevia syncs with your calendar to book appointments directly. Clients get instant confirmation.</p>
                          </td>
                        </tr>
                        <!-- Step 4 -->
                        <tr>
                          <td width="40" valign="top">
                            <div style="width: 32px; height: 32px; background-color: #6D28D9; border-radius: 16px; color: #FFFFFF; text-align: center; line-height: 32px; font-weight: 700; font-family: 'Montserrat', sans-serif;">4</div>
                          </td>
                          <td style="padding-left: 16px;">
                            <p style="margin: 0; color: #1C1917; font-weight: 600; font-size: 16px;">Growth Unlocked</p>
                            <p style="margin: 4px 0 0 0; color: #6B7280; font-size: 14px;">Reclaim hours of admin time while your clinic grows on autopilot. Zero friction, maximum results.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <p style="margin: 32px 0 0 0;"><strong style="color: #1C1917;">Need help?</strong></p>
                <p style="margin: 32px 0 0 0;"><strong style="color: #1C1917;">Reply to this email and our team will get in touch.</strong></p>
                <br />
                <p style="margin: 32px 0 0 0;">Warm regards,<br /><strong style="color: #1C1917;">The Resevia Team</strong></p>
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
