// Cron-triggered worker: claims due rows from public.scheduled_messages and
// sends them through the provider for their channel.
//
// Invoked every 5 minutes by a pg_cron job (see the
// schedule_send_scheduled_messages_cron migration) via pg_net.http_post,
// authenticated with the CRON_SECRET header below. Can also be invoked
// manually (e.g. for testing) with the same header and the project's
// service role key as a Bearer token.
//
// Channel support: email via Resend, sms and whatsapp via Twilio (same
// Twilio REST API for both — whatsapp just prefixes From/To with
// "whatsapp:"). Twilio credentials are optional: if unset, sms/whatsapp
// rows are reverted to pending and skipped rather than failing hard, so
// email-only deployments don't need to configure Twilio.
//
// WhatsApp fallback: if a whatsapp send fails (no active session, recipient
// not on WhatsApp, etc.), it's automatically re-queued as an sms send to the
// same phone number rather than left failed — provided a message_templates
// row exists for the same template_key under channel 'sms'. The whatsapp
// row itself is still marked 'failed' (with a note that it was rerouted) so
// the queue reflects what actually happened on that channel.

import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const CRON_SECRET = Deno.env.get("CRON_SECRET")!;
const EMAIL_FROM = Deno.env.get("SCHEDULED_MESSAGES_FROM") || "Resevia <hello@resevia.co.uk>";

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID") ?? "";
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN") ?? "";
const TWILIO_SMS_FROM = Deno.env.get("TWILIO_SMS_FROM") ?? "";
const TWILIO_WHATSAPP_FROM = Deno.env.get("TWILIO_WHATSAPP_FROM") ?? "";
// Optional: if the sending number is bound to a Twilio Messaging Service
// (Console > Messaging > Services), sms sends must go through it rather
// than the raw From number, or Twilio rejects with error 21663.
const TWILIO_MESSAGING_SERVICE_SID = Deno.env.get("TWILIO_MESSAGING_SERVICE_SID") ?? "";
const TWILIO_CONFIGURED = Boolean(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN);

const BATCH_SIZE = 50;

function renderTemplate(template: string, data: Record<string, string>) {
  return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_match, key: string) => {
    const value = data[key];
    return value === undefined || value === null ? "" : String(value);
  });
}

function buildTemplateData(row: Record<string, unknown>) {
  const named = (row.template_params as Record<string, string> | null) ?? {};
  return {
    ...named,
    recipient_name: (row.recipient_name as string | null) ?? "",
  };
}

async function sendViaTwilio(
  channel: "sms" | "whatsapp",
  row: Record<string, unknown>,
  template: { subject: string | null; body_text: string | null; body_html: string | null; parameter_keys: string[] | null },
  text: string,
) {
  const defaultFrom = channel === "whatsapp" ? TWILIO_WHATSAPP_FROM : TWILIO_SMS_FROM;
  const from = (row.sending_source as string | null) || defaultFrom;
  if (!from && !(channel === "sms" && TWILIO_MESSAGING_SERVICE_SID)) {
    throw new Error(`No sending number configured for channel "${channel}"`);
  }

  const prefix = channel === "whatsapp" ? "whatsapp:" : "";

  // A whatsapp template's body_text holding a Twilio Content SID (HX...)
  // means it's an approved WhatsApp template — those must be sent via
  // ContentSid/ContentVariables, not a freeform Body, or Twilio/Meta will
  // reject it outside an open customer session.
  const rawBody = (template.body_text ?? "").trim();
  const isContentTemplate = channel === "whatsapp" && /^HX[a-f0-9]+$/i.test(rawBody);

  const params = new URLSearchParams({
    To: `${prefix}${row.recipient_phone}`,
  });

  // sms sends prefer a Messaging Service (handles sender-pool routing and
  // regulatory compliance) over a raw From number when one is configured —
  // some numbers are bound to a Messaging Service and reject direct sends
  // (Twilio error 21663). whatsapp always sends from the directly assigned
  // sender number.
  if (channel === "sms" && TWILIO_MESSAGING_SERVICE_SID && !row.sending_source) {
    params.set("MessagingServiceSid", TWILIO_MESSAGING_SERVICE_SID);
  } else {
    params.set("From", `${prefix}${from}`);
  }

  if (isContentTemplate) {
    // Twilio Content templates vary in whether they declare positional
    // variables ("1", "2", ...) or named ones ({{agent}}) — nothing in the
    // send API says which a given ContentSid expects, and getting it wrong
    // doesn't error, it just silently falls back to the template's default
    // text. So send both shapes merged: positional keys built from
    // message_templates.parameter_keys order, and the row's named
    // template_params passed through as-is. Twilio uses whichever keys the
    // template actually declares and ignores the rest.
    const parameterKeys = (template.parameter_keys as string[] | null) ?? [];
    const namedParams = (row.template_params as Record<string, string> | null) ?? {};
    const contentVariables: Record<string, string> = { ...namedParams };
    parameterKeys.forEach((key, index) => {
      if (namedParams[key] !== undefined) {
        contentVariables[String(index + 1)] = namedParams[key];
      }
    });

    params.set("ContentSid", rawBody);
    if (Object.keys(contentVariables).length > 0) {
      params.set("ContentVariables", JSON.stringify(contentVariables));
    }
  } else {
    params.set("Body", text);
  }

  const twilioResponse = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    },
  );

  const twilioData = await twilioResponse.json();

  if (!twilioResponse.ok) {
    throw new Error(twilioData?.message ?? `Twilio responded with ${twilioResponse.status}`);
  }

  return twilioData?.sid ?? null;
}

// deno-lint-ignore no-explicit-any
async function requeueAsSms(admin: any, row: Record<string, unknown>) {
  const { data: smsTemplate } = await admin
    .from("message_templates")
    .select("template_key")
    .eq("template_key", row.template_key)
    .eq("channel", "sms")
    .eq("is_active", true)
    .maybeSingle();

  if (!smsTemplate) {
    return null;
  }

  const { data: inserted, error } = await admin
    .from("scheduled_messages")
    .insert([
      {
        channel: "sms",
        template_key: row.template_key,
        campaign_name: row.campaign_name,
        recipient_name: row.recipient_name,
        recipient_phone: row.recipient_phone,
        sending_source: null, // let the sms send pick TWILIO_SMS_FROM / MessagingServiceSid
        send_after: new Date().toISOString(),
        template_params: row.template_params ?? {},
        metadata: { rerouted_from_whatsapp_message_id: row.id },
      },
    ])
    .select("id")
    .single();

  if (error) {
    console.error("Failed to requeue whatsapp send as sms:", error);
    return null;
  }

  return inserted?.id ?? null;
}

Deno.serve(async (req) => {
  if (req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const { data: claimed, error: claimError } = await admin.rpc("claim_due_scheduled_messages", {
    p_batch_size: BATCH_SIZE,
    p_worker: "edge:send-scheduled-messages",
  });

  if (claimError) {
    console.error("Failed to claim scheduled messages:", claimError);
    return new Response(JSON.stringify({ error: claimError.message }), { status: 500 });
  }

  const rows = claimed ?? [];
  const results = { sent: 0, failed: 0, skipped: 0 };

  for (const row of rows) {
    const channel = row.channel as "email" | "sms" | "whatsapp";

    if (channel !== "email" && !TWILIO_CONFIGURED) {
      // No Twilio credentials configured. Revert to pending so it doesn't
      // silently vanish, and don't burn attempt_count on it.
      results.skipped += 1;
      await admin
        .from("scheduled_messages")
        .update({
          status: "pending",
          claimed_at: null,
          claimed_by: null,
          attempt_count: Math.max(0, (row.attempt_count as number) - 1),
        })
        .eq("id", row.id);
      continue;
    }

    try {
      const { data: template, error: templateError } = await admin
        .from("message_templates")
        .select("subject, body_text, body_html, parameter_keys")
        .eq("template_key", row.template_key)
        .eq("channel", channel)
        .maybeSingle();

      if (templateError || !template) {
        throw new Error(templateError?.message ?? "Template not found");
      }

      const templateData = buildTemplateData(row);
      const text = renderTemplate(template.body_text ?? "", templateData);

      let providerMessageId: string | null = null;

      if (channel === "email") {
        const subjectOverride = row.subject_override as string | null;
        const subject = subjectOverride?.trim()
          ? renderTemplate(subjectOverride, templateData)
          : renderTemplate(template.subject ?? "", templateData);
        const html = template.body_html ? renderTemplate(template.body_html, templateData) : undefined;

        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: (row.sending_source as string | null) || EMAIL_FROM,
            to: row.recipient_email,
            subject,
            text,
            ...(html ? { html } : {}),
          }),
        });

        const resendData = await resendResponse.json();

        if (!resendResponse.ok) {
          throw new Error(resendData?.message ?? `Resend responded with ${resendResponse.status}`);
        }

        providerMessageId = resendData?.id ?? null;
      } else {
        try {
          providerMessageId = await sendViaTwilio(channel, row, template, text);
        } catch (twilioErr) {
          // WhatsApp-specific fallback: if the whatsapp send itself failed
          // (no active session, recipient not on WhatsApp, account/number
          // misconfiguration, etc.), re-queue the same content as an sms
          // send to the same number instead of just failing outright.
          if (channel === "whatsapp") {
            const fallbackMessage = twilioErr instanceof Error ? twilioErr.message : String(twilioErr);
            const rerouted = await requeueAsSms(admin, row);
            const note = rerouted
              ? `WhatsApp failed (${fallbackMessage}); re-queued as SMS (id ${rerouted}).`
              : `WhatsApp failed (${fallbackMessage}); SMS fallback also unavailable — no sms template for "${row.template_key}".`;
            await admin
              .from("scheduled_messages")
              .update({ status: "failed", last_error: note })
              .eq("id", row.id);
            results.failed += 1;
            continue;
          }
          throw twilioErr;
        }
      }

      await admin
        .from("scheduled_messages")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          provider_message_id: providerMessageId,
          last_error: null,
        })
        .eq("id", row.id);

      results.sent += 1;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error sending message";
      console.error(`Failed to send scheduled message ${row.id}:`, message);

      await admin
        .from("scheduled_messages")
        .update({
          status: "failed",
          last_error: message,
        })
        .eq("id", row.id);

      results.failed += 1;
    }
  }

  return new Response(JSON.stringify({ claimed: rows.length, ...results }), {
    headers: { "Content-Type": "application/json" },
  });
});
