import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type TemplatePayload = {
  template_key?: string | null;
  name?: string;
  channel?: "email" | "sms";
  subject?: string | null;
  body_text?: string | null;
  body_html?: string | null;
  parameter_keys?: string[];
  description?: string | null;
};

function htmlToText(html: string) {
  return html
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .trim();
}

function normalizeTemplateKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export async function GET() {
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("message_templates")
      .select("id, created_at, updated_at, name, channel, subject, body_text, body_html, parameter_keys, description, is_active")
      .order("updated_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ templates: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load templates";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TemplatePayload;
    const templateKey = body.template_key ? normalizeTemplateKey(body.template_key) || null : null;
    const name = body.name?.trim();
    const channel = body.channel;
    const subject = body.subject?.trim() || null;
    const bodyText = body.body_text?.trim() || null;
    const bodyHtml = body.body_html?.trim() || null;
    const description = body.description?.trim() || null;
    const parameterKeys = Array.isArray(body.parameter_keys)
      ? body.parameter_keys.map((value) => value.trim()).filter(Boolean)
      : [];

    if (!name || !channel) {
      return NextResponse.json({ error: "Name and channel are required" }, { status: 400 });
    }

    if (channel === "email" && !subject) {
      return NextResponse.json({ error: "Email templates require a subject" }, { status: 400 });
    }

    if (channel === "sms" && subject) {
      return NextResponse.json({ error: "SMS templates cannot have a subject" }, { status: 400 });
    }

    if (channel === "email" && !bodyHtml && !bodyText) {
      return NextResponse.json({ error: "Email templates need HTML or text content" }, { status: 400 });
    }

    if (channel === "sms" && !bodyText) {
      return NextResponse.json({ error: "SMS templates require text content" }, { status: 400 });
    }

    const resolvedBodyText =
      channel === "email"
        ? bodyText || (bodyHtml ? htmlToText(bodyHtml) : null)
        : bodyText;

    if (!resolvedBodyText) {
      return NextResponse.json({ error: "Could not derive a text version for this template" }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("message_templates")
      .insert([
        {
          template_key: templateKey,
          name,
          channel,
          subject,
          body_text: resolvedBodyText,
          body_html: channel === "email" ? bodyHtml : null,
          parameter_keys: parameterKeys,
          description,
        },
      ])
      .select("id, template_key, created_at, updated_at, name, channel, subject, body_text, body_html, parameter_keys, description, is_active")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ template: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create template";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
