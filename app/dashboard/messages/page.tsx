"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

type Template = {
  id: string;
  template_key: string;
  name: string;
  channel: "email" | "sms" | "whatsapp";
  parameter_keys: string[];
};

type ScheduledMessage = {
  id: string;
  send_after: string;
  status: string;
  channel: "email" | "sms" | "whatsapp";
  campaign_name: string | null;
  recipient_name: string | null;
  recipient_email: string | null;
  recipient_phone: string | null;
  sending_source: string | null;
  subject_override: string | null;
  template_params: Record<string, string>;
  attempt_count: number;
  last_error: string | null;
  template_key: string;
  message_templates: { name: string } | { name: string }[] | null;
};

const emptyForm = {
  channel: "email" as "email" | "sms" | "whatsapp",
  templateKey: "",
  campaignName: "",
  recipientName: "",
  recipientEmail: "",
  recipientPhone: "",
  sendingSource: "",
  subjectOverride: "",
  sendAfter: "",
  namedParams: '{\n  "name": "",\n  "booking_link": ""\n}',
};

function formatDate(iso: string) {
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? iso : parsed.toLocaleString();
}

function templateName(value: ScheduledMessage["message_templates"]) {
  if (!value) return "Unknown template";
  return Array.isArray(value) ? value[0]?.name ?? "Unknown template" : value.name;
}

export default function DashboardMessagesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const channelTemplates = useMemo(
    () => templates.filter((template) => template.channel === form.channel),
    [form.channel, templates]
  );

  useEffect(() => {
    if (!form.templateKey && channelTemplates[0]) {
      setForm((current) => ({ ...current, templateKey: channelTemplates[0].template_key }));
    }
  }, [channelTemplates, form.templateKey]);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [templatesResponse, messagesResponse] = await Promise.all([
        fetch("/api/dashboard-messaging/templates", { cache: "no-store" }),
        fetch("/api/dashboard-messaging/scheduled-messages", { cache: "no-store" }),
      ]);

      const templatesData = await templatesResponse.json();
      const messagesData = await messagesResponse.json();

      if (!templatesResponse.ok) {
        throw new Error(templatesData?.error ?? "Failed to load templates");
      }
      if (!messagesResponse.ok) {
        throw new Error(messagesData?.error ?? "Failed to load scheduled messages");
      }

      setTemplates(Array.isArray(templatesData.templates) ? templatesData.templates : []);
      setMessages(Array.isArray(messagesData.messages) ? messagesData.messages : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messaging dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const parsedParams = JSON.parse(form.namedParams) as Record<string, string>;
      const response = await fetch("/api/dashboard-messaging/scheduled-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: form.channel,
          template_key: form.templateKey,
          campaign_name: form.campaignName,
          recipient_name: form.recipientName,
          recipient_email: form.recipientEmail,
          recipient_phone: form.recipientPhone,
          sending_source: form.sendingSource,
          subject_override: form.subjectOverride,
          send_after: new Date(form.sendAfter).toISOString(),
          template_params: parsedParams,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to schedule message");
      }

      setForm((current) => ({
        ...emptyForm,
        channel: current.channel,
        templateKey: channelTemplates[0]?.template_key ?? "",
      }));
      await loadData();
    } catch (err) {
      const message =
        err instanceof SyntaxError
          ? "Named params must be valid JSON"
          : err instanceof Error
            ? err.message
            : "Failed to schedule message";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-brand-light px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 font-display text-3xl font-bold text-brand-black">Scheduled Messages</h1>
        <p className="mb-6 max-w-3xl text-sm text-brand-gray">
          Queue future email, SMS, and WhatsApp sends against your templates. The cron worker can claim due rows in batches of 50 and send them through the appropriate provider.
        </p>
        <DashboardNav />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 text-lg font-semibold text-brand-black">Add to Campaign Queue</h2>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-brand-gray">
                  <span className="mb-1 block">Channel</span>
                  <select
                    value={form.channel}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        channel: event.target.value as "email" | "sms" | "whatsapp",
                        templateKey: "",
                        recipientEmail: event.target.value === "email" ? current.recipientEmail : "",
                        recipientPhone: event.target.value === "email" ? "" : current.recipientPhone,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-brand-black outline-none focus:border-brand-black"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </label>
                <label className="text-sm text-brand-gray">
                  <span className="mb-1 block">Template</span>
                  <select
                    value={form.templateKey}
                    onChange={(event) => setForm((current) => ({ ...current, templateKey: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-brand-black outline-none focus:border-brand-black"
                    required
                  >
                    <option value="">Select template</option>
                    {channelTemplates.map((template) => (
                      <option key={template.id} value={template.template_key}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block text-sm text-brand-gray">
                <span className="mb-1 block">Campaign name</span>
                <input
                  value={form.campaignName}
                  onChange={(event) => setForm((current) => ({ ...current, campaignName: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-brand-black outline-none focus:border-brand-black"
                  placeholder="June missed-call recovery"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-brand-gray">
                  <span className="mb-1 block">Recipient name</span>
                  <input
                    value={form.recipientName}
                    onChange={(event) => setForm((current) => ({ ...current, recipientName: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-brand-black outline-none focus:border-brand-black"
                    placeholder="Jane Smith"
                  />
                </label>
                <label className="text-sm text-brand-gray">
                  <span className="mb-1 block">Send after</span>
                  <input
                    type="datetime-local"
                    value={form.sendAfter}
                    onChange={(event) => setForm((current) => ({ ...current, sendAfter: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-brand-black outline-none focus:border-brand-black"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-brand-gray">
                  <span className="mb-1 block">Recipient email</span>
                  <input
                    type="email"
                    value={form.recipientEmail}
                    onChange={(event) => setForm((current) => ({ ...current, recipientEmail: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-brand-black outline-none focus:border-brand-black"
                    placeholder="jane@example.com"
                  />
                </label>
                <label className="text-sm text-brand-gray">
                  <span className="mb-1 block">Recipient phone</span>
                  <input
                    value={form.recipientPhone}
                    onChange={(event) => setForm((current) => ({ ...current, recipientPhone: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-brand-black outline-none focus:border-brand-black"
                    placeholder="+447700900123"
                  />
                </label>
              </div>

              <label className="block text-sm text-brand-gray">
                <span className="mb-1 block">Sending source</span>
                <input
                  value={form.sendingSource}
                  onChange={(event) => setForm((current) => ({ ...current, sendingSource: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-brand-black outline-none focus:border-brand-black"
                  placeholder={
                    form.channel === "email"
                      ? "notifications@resevia.co.uk"
                      : form.channel === "whatsapp"
                        ? "+447886083430 (Twilio WhatsApp sender)"
                        : "+447886083430"
                  }
                  required
                />
              </label>

              {form.channel === "email" ? (
                <label className="block text-sm text-brand-gray">
                  <span className="mb-1 block">Subject override (optional)</span>
                  <input
                    value={form.subjectOverride}
                    onChange={(event) => setForm((current) => ({ ...current, subjectOverride: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-brand-black outline-none focus:border-brand-black"
                    placeholder="Leave blank to use the template's subject"
                  />
                </label>
              ) : null}

              <label className="block text-sm text-brand-gray">
                <span className="mb-1 block">Template params JSON</span>
                <textarea
                  value={form.namedParams}
                  onChange={(event) => setForm((current) => ({ ...current, namedParams: event.target.value }))}
                  className="min-h-36 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-sm text-brand-black outline-none focus:border-brand-black"
                />
              </label>

              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-brand-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Queueing..." : "Queue message"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-brand-black">Queued Sends</h2>
              <span className="text-xs text-brand-gray">{messages.length} rows</span>
            </div>
            {error ? <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
            {loading ? <p className="text-sm text-brand-gray">Loading queued messages...</p> : null}
            {!loading && messages.length === 0 ? (
              <p className="text-sm text-brand-gray">No scheduled messages yet.</p>
            ) : null}
            <div className="space-y-4">
              {messages.map((message) => (
                <article key={message.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-brand-black">{message.campaign_name || "Untitled campaign"}</h3>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-slate-700">
                      {message.channel}
                    </span>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                      {message.status}
                    </span>
                  </div>
                  <p className="text-sm text-brand-black">Template: {templateName(message.message_templates)}</p>
                  <p className="text-sm text-brand-gray">
                    Recipient: {message.recipient_name || "Unknown"} / {message.recipient_email || message.recipient_phone || "No destination"}
                  </p>
                  <p className="text-sm text-brand-gray">Source: {message.sending_source || "Not set"}</p>
                  {message.subject_override ? (
                    <p className="text-sm text-brand-gray">Subject override: {message.subject_override}</p>
                  ) : null}
                  <p className="text-sm text-brand-gray">Send after: {formatDate(message.send_after)}</p>
                  <p className="text-xs text-brand-gray">Attempts: {message.attempt_count}</p>
                  {message.last_error ? <p className="mt-2 text-sm text-red-700">Last error: {message.last_error}</p> : null}
                  <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-brand-gray">
                    <p className="mb-2 font-semibold uppercase tracking-wide">Template params</p>
                    <pre className="whitespace-pre-wrap">{JSON.stringify(message.template_params ?? {}, null, 2)}</pre>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
