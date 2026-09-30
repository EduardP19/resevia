import { NextResponse } from 'next/server';

// Server-side proxy to the live Resevia agent sandbox (resevia-agent repo,
// /api/sophia-sandbox/message). Proxying keeps the browser same-origin (the
// agent app sends no CORS headers) and lets us cap abuse before a visitor's
// message reaches Gemini.
//
// The sandbox runs against the demo salon in autonomous mode
// (manualApproval: false) so the visitor gets a reply immediately.

const AGENT_APP_URL = process.env.AGENT_APP_URL || process.env.NEXT_PUBLIC_AGENT_APP_URL || 'https://app.resevia.co.uk';
const MAX_MESSAGE_LENGTH = 500;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 30;
const TIMEOUT_MS = 25_000;

// Best-effort per-instance rate limit. Serverless instances don't share
// memory, so this bounds bursts rather than guaranteeing a global cap.
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const message = typeof body?.message === 'string' ? body.message.replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, MAX_MESSAGE_LENGTH) : '';
  const sessionId = typeof body?.sessionId === 'string' && /^[0-9a-f-]{36}$/i.test(body.sessionId) ? body.sessionId : undefined;

  if (!message) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 });
  }

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${AGENT_APP_URL}/api/sophia-sandbox/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, id: sessionId, manualApproval: false, t: 'website-demo' }),
      signal: controller.signal,
      cache: 'no-store',
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.reply) {
      return NextResponse.json({ error: 'agent_unavailable' }, { status: 502 });
    }

    return NextResponse.json({
      reply: String(data.reply),
      sessionId: data.sessionId,
      agentName: data.agentName,
    });
  } catch {
    return NextResponse.json({ error: 'agent_unavailable' }, { status: 502 });
  } finally {
    clearTimeout(timer);
  }
}
