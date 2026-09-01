import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type ScheduledMessagePayload = {
  channel?: "email" | "sms" | "whatsapp";
  template_key?: string;
  campaign_name?: string | null;
  recipient_name?: string | null;
  recipient_email?: string | null;
  recipient_phone?: string | null;
  sending_source?: string | null;
  subject_override?: string | null;
  send_after?: string;
  template_params?: Record<string, string>;
};

export async function GET() {
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("scheduled_messages")
      .select(`
        id,
        created_at,
        updated_at,
        send_after,
        sent_at,
        claimed_at,
        status,
        channel,
        campaign_name,
        recipient_name,
        recipient_email,
        recipient_phone,
        sending_source,
        subject_override,
        template_params,
        attempt_count,
        provider_message_id,
        last_error,
        template_key,
        message_templates!scheduled_messages_template_fkey(name)
      `)
      .order("send_after", { ascending: true })
      .limit(200);

    if (error) {
      throw error;
    }

    return NextResponse.json({ messages: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load scheduled messages";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ScheduledMessagePayload;
    const channel = body.channel;
    const templateKey = body.template_key?.trim();
    const sendAfter = body.send_after;
    const recipientName = body.recipient_name?.trim() || null;
    const recipientEmail = body.recipient_email?.trim() || null;
    const recipientPhone = body.recipient_phone?.trim() || null;
    const sendingSource = body.sending_source?.trim() || null;

    if (!channel || !templateKey || !sendAfter) {
      return NextResponse.json({ error: "Channel, template, and send-after are required" }, { status: 400 });
    }

    if (!sendingSource) {
      return NextResponse.json({ error: "Sending source is required" }, { status: 400 });
    }

    if (channel === "email" && !recipientEmail) {
      return NextResponse.json({ error: "Email campaigns require a recipient email" }, { status: 400 });
    }

    if (channel !== "email" && !recipientPhone) {
      return NextResponse.json({ error: "SMS and WhatsApp campaigns require a recipient phone number" }, { status: 400 });
    }

    const parsedSendAfter = new Date(sendAfter);
    if (Number.isNaN(parsedSendAfter.getTime())) {
      return NextResponse.json({ error: "Invalid send-after timestamp" }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("scheduled_messages")
      .insert([
        {
          channel,
          template_key: templateKey,
          campaign_name: body.campaign_name?.trim() || null,
          recipient_name: recipientName,
          recipient_email: recipientEmail,
          recipient_phone: recipientPhone,
          sending_source: sendingSource,
          subject_override: body.subject_override?.trim() || null,
          send_after: parsedSendAfter.toISOString(),
          template_params: body.template_params ?? {},
        },
      ])
      .select(`
        id,
        created_at,
        updated_at,
        send_after,
        sent_at,
        claimed_at,
        status,
        channel,
        campaign_name,
        recipient_name,
        recipient_email,
        recipient_phone,
        sending_source,
        subject_override,
        template_params,
        attempt_count,
        provider_message_id,
        last_error,
        template_key,
        message_templates!scheduled_messages_template_fkey(name)
      `)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to schedule message";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
