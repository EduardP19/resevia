"use client";

import { FormEvent, useEffect, useState } from "react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

type Template = {
  id: string;
  name: string;
  channel: "email" | "sms";
  subject: string | null;
  body_text: string;
  body_html: string | null;
  parameter_keys: string[];
  description: string | null;
  is_active: boolean;
  updated_at: string;
};

const emptyForm = {
  name: "",
  channel: "email" as "email" | "sms",
  subject: "",
  parameterKeys: "name,email,phone",
  description: "",
  bodyText: "",
  bodyHtml: "",
};

function formatDate(iso: string) {
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? iso : parsed.toLocaleString();
}

export default function DashboardTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function loadTemplates() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/dashboard-messaging/templates", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to load templates");
      }
      setTemplates(Array.isArray(data.templates) ? data.templates : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load templates");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTemplates();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/dashboard-messaging/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          channel: form.channel,
          subject: form.channel === "email" ? form.subject : null,
          body_text: form.bodyText,
          body_html: form.channel === "email" ? form.bodyHtml : null,
          description: form.description,
          parameter_keys: form.parameterKeys
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to create template");
      }

      setForm(emptyForm);
      await loadTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create template");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-brand-light px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 font-display text-3xl font-bold text-brand-black">Message Templates</h1>
        <p className="mb-6 max-w-3xl text-sm text-brand-gray">
          Create reusable SMS and email templates with placeholders. Email templates can store both text and HTML for later sending through Resend.
        </p>
        <DashboardNav />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 text-lg font-semibold text-brand-black">New Template</h2>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-brand-gray">
                  <span className="mb-1 block">Template name</span>
                  <input
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-brand-black outline-none focus:border-brand-black"
                    placeholder="Welcome follow-up"
                    required
                  />
                </label>
                <label className="text-sm text-brand-gray">
                  <span className="mb-1 block">Channel</span>
                  <select
                    value={form.channel}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        channel: event.target.value as "email" | "sms",
                        subject: event.target.value === "sms" ? "" : current.subject,
                        bodyHtml: event.target.value === "sms" ? "" : current.bodyHtml,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-brand-black outline-none focus:border-brand-black"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                  </select>
                </label>
              </div>

              {form.channel === "email" ? (
                <label className="block text-sm text-brand-gray">
                  <span className="mb-1 block">Subject</span>
                  <input
                    value={form.subject}
                    onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-brand-black outline-none focus:border-brand-black"
                    placeholder="Your consultation is confirmed"
                    required
                  />
                </label>
              ) : null}

              <label className="block text-sm text-brand-gray">
                <span className="mb-1 block">Placeholder keys</span>
                <input
                  value={form.parameterKeys}
                  onChange={(event) => setForm((current) => ({ ...current, parameterKeys: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-brand-black outline-none focus:border-brand-black"
                  placeholder="name, email, booking_link"
                />
              </label>

              <label className="block text-sm text-brand-gray">
                <span className="mb-1 block">Description</span>
                <input
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-brand-black outline-none focus:border-brand-black"
                  placeholder="Used after a missed call"
                />
              </label>

              <label className="block text-sm text-brand-gray">
                <span className="mb-1 block">Text body</span>
                <textarea
                  value={form.bodyText}
                  onChange={(event) => setForm((current) => ({ ...current, bodyText: event.target.value }))}
                  className="min-h-40 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-brand-black outline-none focus:border-brand-black"
                  placeholder={"Hi {{name}},\nThanks for your enquiry..."}
                  required
                />
              </label>

              {form.channel === "email" ? (
                <label className="block text-sm text-brand-gray">
                  <span className="mb-1 block">HTML body</span>
                  <textarea
                    value={form.bodyHtml}
                    onChange={(event) => setForm((current) => ({ ...current, bodyHtml: event.target.value }))}
                    className="min-h-40 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-sm text-brand-black outline-none focus:border-brand-black"
                    placeholder={"<p>Hi {{name}},</p><p>Thanks for your enquiry...</p>"}
                  />
                </label>
              ) : null}

              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-brand-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Create template"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-brand-black">Template Library</h2>
              <span className="text-xs text-brand-gray">{templates.length} templates</span>
            </div>
            {error ? <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
            {loading ? <p className="text-sm text-brand-gray">Loading templates...</p> : null}
            {!loading && templates.length === 0 ? (
              <p className="text-sm text-brand-gray">No templates yet.</p>
            ) : null}
            <div className="space-y-4">
              {templates.map((template) => (
                <article key={template.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-brand-black">{template.name}</h3>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-slate-700">
                      {template.channel}
                    </span>
                    {template.is_active ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">Active</span>
                    ) : null}
                  </div>
                  {template.subject ? <p className="mb-2 text-sm text-brand-black">Subject: {template.subject}</p> : null}
                  {template.description ? <p className="mb-2 text-sm text-brand-gray">{template.description}</p> : null}
                  <p className="mb-3 text-xs text-brand-gray">Updated {formatDate(template.updated_at)}</p>
                  {template.parameter_keys.length > 0 ? (
                    <p className="mb-3 text-xs text-brand-gray">Params: {template.parameter_keys.join(", ")}</p>
                  ) : null}
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-gray">Text</p>
                      <pre className="whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-brand-black">{template.body_text}</pre>
                    </div>
                    {template.channel === "email" ? (
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-gray">HTML</p>
                        <pre className="whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-brand-black">
                          {template.body_html || "No HTML version yet"}
                        </pre>
                      </div>
                    ) : null}
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
