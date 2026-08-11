import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type ScheduledMessagePayload = {
  channel?: "email" | "sms";
  template_id?: string;
  campaign_name?: string | null;
  recipient_name?: string | null;
  recipient_email?: string | null;
  recipient_phone?: string | null;
  sending_source?: string | null;
  send_after?: string;
  param1?: string | null;
  param2?: string | null;
  param3?: string | null;
  param4?: string | null;
  param5?: string | null;
  param6?: string | null;
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
        param1,
        param2,
        param3,
        param4,
        param5,
        param6,
        template_params,
        attempt_count,
        provider_message_id,
        last_error,
        template_id,
        message_templates(name)
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
    const templateId = body.template_id?.trim();
    const sendAfter = body.send_after;
    const recipientName = body.recipient_name?.trim() || null;
    const recipientEmail = body.recipient_email?.trim() || null;
    const recipientPhone = body.recipient_phone?.trim() || null;
    const sendingSource = body.sending_source?.trim() || null;

    if (!channel || !templateId || !sendAfter) {
      return NextResponse.json({ error: "Channel, template, and send-after are required" }, { status: 400 });
    }

    if (!sendingSource) {
      return NextResponse.json({ error: "Sending source is required" }, { status: 400 });
    }

    if (channel === "email" && !recipientEmail) {
      return NextResponse.json({ error: "Email campaigns require a recipient email" }, { status: 400 });
    }

    if (channel === "sms" && !recipientPhone) {
      return NextResponse.json({ error: "SMS campaigns require a recipient phone number" }, { status: 400 });
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
          template_id: templateId,
          campaign_name: body.campaign_name?.trim() || null,
          recipient_name: recipientName,
          recipient_email: recipientEmail,
          recipient_phone: recipientPhone,
          sending_source: sendingSource,
          send_after: parsedSendAfter.toISOString(),
          param1: body.param1?.trim() || null,
          param2: body.param2?.trim() || null,
          param3: body.param3?.trim() || null,
          param4: body.param4?.trim() || null,
          param5: body.param5?.trim() || null,
          param6: body.param6?.trim() || null,
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
        param1,
        param2,
        param3,
        param4,
        param5,
        param6,
        template_params,
        attempt_count,
        provider_message_id,
        last_error,
        template_id,
        message_templates(name)
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
