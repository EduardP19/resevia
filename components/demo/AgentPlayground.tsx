'use client';

// The interactive "test the agent" experience.
// - Hair & Barbers can talk to the *real* Resevia agent (Gemini + Cal.com
//   demo salon) through /api/agent-demo.
// - Every other industry runs the scripted demo agent in lib/demo-agent.ts,
//   which uses the same tool names as production.
// - Channel switch restyles the phone as SMS, WhatsApp or a live voice call
//   (voice uses the browser's speech synthesis / recognition when present).

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { INDUSTRIES, type Industry } from '@/lib/industries';
import { demoRespond, INITIAL_DEMO_STATE, type DemoState, type ToolEvent } from '@/lib/demo-agent';
import { Icon } from '@/components/ui/Icons';
import { useAnalytics } from '@/components/analytics/AnalyticsProvider';
import { AGENT_SANDBOX_URL } from '@/lib/site';

type Channel = 'sms' | 'whatsapp' | 'voice';
type Msg = { id: number; role: 'user' | 'agent'; text: string };
type BrainEvent = ToolEvent & { id: number; at: number };

const LIVE_INDUSTRY = 'hair';
let seq = 0;

function nowTime() {
  return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function AgentPlayground({ compact = false }: { compact?: boolean }) {
  const { logEvent } = useAnalytics();
  const [industryId, setIndustryId] = useState(INDUSTRIES[0].id);
  const industry = useMemo(() => INDUSTRIES.find((i) => i.id === industryId) as Industry, [industryId]);
  const [channel, setChannel] = useState<Channel>('whatsapp');
  const [liveWanted, setLiveWanted] = useState(true);
  const [liveFailed, setLiveFailed] = useState(false);
  const isLive = industry.id === LIVE_INDUSTRY && liveWanted && !liveFailed;

  const [messages, setMessages] = useState<Msg[]>([]);
  const [events, setEvents] = useState<BrainEvent[]>([]);
  const [state, setState] = useState<DemoState>(INITIAL_DEMO_STATE);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [liveSession, setLiveSession] = useState<string | undefined>();
  const [latency, setLatency] = useState<number | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [listening, setListening] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const agentName = industry.demo.agent;
  // Read through a ref so a mid-chat live→simulation fallback doesn't wipe the thread.
  const isLiveRef = useRef(isLive);
  isLiveRef.current = isLive;

  // Reset the conversation whenever the business or the live/sim mode changes.
  const reset = useCallback(() => {
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
    setMessages([{ id: ++seq, role: 'agent', text: industry.demo.greeting }]);
    setEvents([{ id: ++seq, at: Date.now(), name: 'session_started', detail: `${industry.demo.business} · ${isLiveRef.current ? 'live agent' : 'simulation'}` }]);
    setState(INITIAL_DEMO_STATE);
    setLiveSession(undefined);
    setLatency(null);
    setTyping(false);
    setCallSeconds(0);
  }, [industry]);

  useEffect(() => {
    reset();
  }, [reset, liveWanted]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  // Call timer for the voice channel.
  useEffect(() => {
    if (channel !== 'voice') return;
    const t = setInterval(() => setCallSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [channel]);

  const speak = useCallback(
    (text: string) => {
      if (channel !== 'voice' || muted || typeof window === 'undefined' || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/RSV-\w+/, '').replace(/[^\x20-\x7E£’\n]/g, ' '));
      u.lang = 'en-GB';
      u.rate = 1.03;
      const voice = window.speechSynthesis.getVoices().find((v) => v.lang === 'en-GB' && /female|libby|sonia|serena|kate|google uk english female/i.test(v.name))
        || window.speechSynthesis.getVoices().find((v) => v.lang === 'en-GB');
      if (voice) u.voice = voice;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    },
    [channel, muted]
  );

  const pushEvents = (tools: ToolEvent[]) => {
    const at = Date.now();
    setEvents((e) => [...e, ...tools.map((tool, i) => ({ ...tool, id: ++seq, at: at + i }))].slice(-40));
  };

  async function send(textArg?: string) {
    const text = (textArg ?? input).trim();
    if (!text || typing) return;
    setInput('');
    setMessages((m) => [...m, { id: ++seq, role: 'user', text }]);
    setTyping(true);
    logEvent('DEMO_MESSAGE', { industry: industry.id, channel, live: isLive });

    const started = performance.now();

    if (isLive) {
      pushEvents([{ name: 'inbound_message', detail: `${channel.toUpperCase()} → Resevia agent` }]);
      try {
        const res = await fetch('/api/agent-demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, sessionId: liveSession }),
        });
        const data = await res.json();
        if (!res.ok || !data.reply) throw new Error(data.error || 'agent_unavailable');
        const ms = Math.round(performance.now() - started);
        setLatency(ms);
        setLiveSession(data.sessionId);
        pushEvents([{ name: 'gemini_reply', detail: `Live model · ${(ms / 1000).toFixed(1)}s round trip` }]);
        setMessages((m) => [...m, { id: ++seq, role: 'agent', text: data.reply }]);
        speak(data.reply);
      } catch {
        // Fall back to the simulator so the visitor is never left hanging.
        setLiveFailed(true);
        const r = demoRespond(industry, state, text);
        pushEvents([{ name: 'fallback', detail: 'Live agent busy — switched to simulation' }, ...r.tools]);
        setState(r.state);
        setMessages((m) => [...m, { id: ++seq, role: 'agent', text: r.reply }]);
        speak(r.reply);
      } finally {
        setTyping(false);
      }
      return;
    }

    const r = demoRespond(industry, state, text);
    // Realistic "thinking" delay that scales with reply length.
    const delay = 700 + Math.min(1600, r.reply.length * 9);
    r.tools.forEach((tool, i) => setTimeout(() => pushEvents([tool]), 250 + i * 280));
    setTimeout(() => {
      setState(r.state);
      setMessages((m) => [...m, { id: ++seq, role: 'agent', text: r.reply }]);
      setLatency(Math.round(delay));
      setTyping(false);
      speak(r.reply);
    }, delay);
  }

  function listen() {
    const SR = typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    if (!SR) {
      inputRef.current?.focus();
      return;
    }
    const rec = new SR();
    rec.lang = 'en-GB';
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = (e: any) => {
      const said = e.results?.[0]?.[0]?.transcript;
      if (said) send(said);
    };
    window.speechSynthesis?.cancel();
    rec.start();
  }

  const booked = events.some((e) => e.name === 'book_direct');

  return (
    <div className={clsx('grid grid-cols-1 gap-6 lg:gap-8', compact ? 'lg:grid-cols-[1fr_1.1fr]' : 'lg:grid-cols-[0.95fr_1.05fr_0.95fr]')}>
      {/* ——— Controls ——— */}
      <div className={clsx('order-1 flex min-w-0 flex-col gap-5', compact && 'lg:col-span-2')}>
        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">1 · Pick a business</p>
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind.id}
                onClick={() => setIndustryId(ind.id)}
                className={clsx(
                  'flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-all',
                  ind.id === industryId
                    ? 'border-brand-gold bg-brand-gold text-brand-black shadow-[0_0_24px_rgba(201,169,110,0.35)]'
                    : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:text-white'
                )}
              >
                <Icon name={ind.icon} className="h-4 w-4" />
                {ind.name}
                {ind.id === LIVE_INDUSTRY && (
                  <span className={clsx('rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider', ind.id === industryId ? 'bg-brand-black/15' : 'bg-emerald-400/15 text-emerald-300')}>
                    Live
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">2 · Choose a channel</p>
          <div className="relative grid grid-cols-3 rounded-2xl border border-white/10 bg-white/[0.03] p-1">
            {(['sms', 'whatsapp', 'voice'] as Channel[]).map((c) => (
              <button
                key={c}
                onClick={() => {
                  setChannel(c);
                  if (c !== 'voice') window.speechSynthesis?.cancel();
                }}
                className={clsx('relative z-10 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors', channel === c ? 'text-brand-black' : 'text-white/60 hover:text-white')}
              >
                {channel === c && (
                  <motion.span layoutId="channel-pill" className="absolute inset-0 -z-10 rounded-xl bg-white" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                )}
                <Icon name={c === 'sms' ? 'chat' : c === 'whatsapp' ? 'whatsapp' : 'phone'} className="h-4 w-4" />
                {c === 'sms' ? 'SMS' : c === 'whatsapp' ? 'WhatsApp' : 'Voice'}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={clsx('relative flex h-2.5 w-2.5')}>
                <span className={clsx('absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', isLive ? 'bg-emerald-400' : 'bg-brand-gold')} />
                <span className={clsx('relative inline-flex h-2.5 w-2.5 rounded-full', isLive ? 'bg-emerald-400' : 'bg-brand-gold')} />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{isLive ? 'Live AI agent' : 'Interactive simulation'}</p>
                <p className="text-xs text-white/45">
                  {isLive
                    ? 'The real Resevia agent, on our demo salon.'
                    : industry.id === LIVE_INDUSTRY
                      ? liveFailed ? 'Live agent is busy — simulating.' : 'Scripted with the real tool set.'
                      : 'Scripted with the real tool set.'}
                </p>
              </div>
            </div>
            {industry.id === LIVE_INDUSTRY && (
              <button
                onClick={() => {
                  setLiveFailed(false);
                  setLiveWanted((v) => !v);
                }}
                aria-label="Toggle live agent"
                className={clsx('relative h-6 w-11 shrink-0 rounded-full transition-colors', isLive ? 'bg-emerald-500' : 'bg-white/15')}
              >
                <motion.span layout className={clsx('absolute top-1 h-4 w-4 rounded-full bg-white', isLive ? 'right-1' : 'left-1')} />
              </button>
            )}
          </div>
        </div>

        <div className="hidden lg:block">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">3 · Try saying</p>
          <div className="flex flex-col gap-2">
            {industry.demo.prompts.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                disabled={typing}
                className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left text-sm text-white/75 transition-all hover:border-brand-gold/50 hover:bg-brand-gold/5 hover:text-white disabled:opacity-50"
              >
                “{p}”
                <Icon name="arrowRight" className="h-4 w-4 shrink-0 text-brand-gold opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ——— Phone ——— */}
      <div className="order-2 flex min-w-0 justify-center">
        <div className="relative w-full max-w-[380px]">
          <div className="absolute -inset-10 -z-10 rounded-full bg-brand-purple/30 blur-3xl" />
          <div className="rounded-[2.75rem] border border-white/15 bg-gradient-to-b from-[#1b1530] to-[#0b0917] p-2.5 shadow-[0_40px_120px_-20px_rgba(109,40,217,0.55)]">
            <div className="relative flex h-[600px] flex-col overflow-hidden rounded-[2.2rem] sm:h-[620px]">
              <PhoneHeader channel={channel} industry={industry} isLive={isLive} speaking={speaking} typing={typing} callSeconds={callSeconds} muted={muted} onToggleMute={() => { setMuted((m) => !m); window.speechSynthesis?.cancel(); }} onReset={reset} />

              {channel === 'voice' && <VoiceOrb speaking={speaking} listening={listening} typing={typing} />}

              <div
                ref={scrollRef}
                className={clsx(
                  'flex-1 space-y-2.5 overflow-y-auto px-3.5 py-4',
                  channel === 'sms' && 'bg-white',
                  channel === 'whatsapp' && 'bg-[#EFE7DE]',
                  channel === 'voice' && 'bg-gradient-to-b from-[#1a1233] to-[#0c0a1d] [mask-image:linear-gradient(to_bottom,transparent,black_24px)]'
                )}
                style={channel === 'whatsapp' ? { backgroundImage: 'radial-gradient(rgba(0,0,0,0.035) 1px, transparent 1px)', backgroundSize: '14px 14px' } : undefined}
              >
                {channel === 'whatsapp' && (
                  <div className="mx-auto mb-2 w-fit rounded-lg bg-[#FFF3C4] px-3 py-1.5 text-center text-[10.5px] leading-snug text-[#54656F] shadow-sm">
                    🔒 Messages are end-to-end encrypted.
                  </div>
                )}
                <AnimatePresence initial={false}>
                  {messages.map((m) => (
                    <Bubble key={m.id} msg={m} channel={channel} />
                  ))}
                </AnimatePresence>
                {typing && <TypingBubble channel={channel} name={agentName} />}
              </div>

              {/* Mobile suggestions */}
              <div className={clsx('no-scrollbar flex gap-2 overflow-x-auto px-3 py-2 lg:hidden', channel === 'whatsapp' ? 'bg-[#EFE7DE]' : channel === 'sms' ? 'bg-white' : 'bg-[#0c0a1d]')}>
                {industry.demo.prompts.map((p) => (
                  <button key={p} onClick={() => send(p)} disabled={typing} className={clsx('shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium', channel === 'voice' ? 'border-white/15 text-white/80' : 'border-brand-purple/20 bg-white text-brand-purple')}>
                    {p}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className={clsx('flex items-center gap-2 px-3 pb-4 pt-2', channel === 'whatsapp' ? 'bg-[#EFE7DE]' : channel === 'sms' ? 'border-t border-gray-100 bg-white' : 'bg-[#0c0a1d]')}
              >
                {channel === 'voice' && (
                  <button type="button" onClick={listen} aria-label="Speak" className={clsx('flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all', listening ? 'scale-110 bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20')}>
                    <Icon name="mic" className="h-5 w-5" />
                  </button>
                )}
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={500}
                  placeholder={channel === 'voice' ? (listening ? 'Listening…' : 'Tap the mic or type…') : 'Message'}
                  className={clsx(
                    'min-w-0 flex-1 rounded-full px-4 py-2.5 text-[16px] outline-none sm:text-sm',
                    channel === 'sms' && 'border border-gray-200 bg-gray-50 text-brand-black',
                    channel === 'whatsapp' && 'bg-white text-brand-black shadow-sm',
                    channel === 'voice' && 'border border-white/10 bg-white/5 text-white placeholder:text-white/40'
                  )}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  aria-label="Send"
                  className={clsx(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-all disabled:opacity-40',
                    channel === 'whatsapp' ? 'bg-[#00A884]' : channel === 'sms' ? 'bg-brand-purple' : 'bg-brand-gold text-brand-black'
                  )}
                >
                  <Icon name="send" className="h-[18px] w-[18px]" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ——— Agent brain ——— */}
      {!compact && (
        <div className="order-3 flex min-w-0 flex-col gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Agent brain · live trace</p>
              {latency !== null && <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/50">{(latency / 1000).toFixed(1)}s</span>}
            </div>
            <div className="no-scrollbar h-[260px] space-y-2 overflow-y-auto font-mono text-[12px] lg:h-[330px]">
              <AnimatePresence initial={false}>
                {events.map((e) => (
                  <motion.div
                    key={e.id}
                    layout
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-2.5 rounded-lg border border-white/5 bg-black/20 px-3 py-2"
                  >
                    <span className={clsx('mt-1 h-1.5 w-1.5 shrink-0 rounded-full', toolColor(e.name))} />
                    <div className="min-w-0">
                      <p className="text-white/90">{e.name}()</p>
                      <p className="truncate text-white/45">{e.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className={clsx('rounded-2xl border p-5 transition-colors duration-500', booked ? 'border-emerald-400/40 bg-emerald-400/[0.06]' : 'border-white/10 bg-white/[0.03]')}>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Booking state</p>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Service', state.service || '—'],
                ['Day', state.day ? state.day[0].toUpperCase() + state.day.slice(1) : '—'],
                ['Time', state.slot || '—'],
                ['Status', booked ? 'Booked ✓' : state.stage === 'idle' ? 'Listening' : 'In progress'],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[11px] text-white/40">{k}</dt>
                  <dd className={clsx('truncate font-medium', booked && k === 'Status' ? 'text-emerald-300' : 'text-white')}>{v}</dd>
                </div>
              ))}
            </dl>
            {isLive && (
              <p className="mt-4 text-xs text-white/40">Live mode tracks booking state server-side. The trace shows each round trip.</p>
            )}
          </div>

          <a href={AGENT_SANDBOX_URL} target="_blank" rel="noreferrer" className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white/70 transition-colors hover:border-brand-gold/40 hover:text-white">
            Open the full sandbox (with approval mode)
            <Icon name="arrowRight" className="h-4 w-4 text-brand-gold transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      )}
    </div>
  );
}

function toolColor(name: string) {
  if (name.startsWith('book') || name === 'send_confirmation') return 'bg-emerald-400';
  if (name === 'guardrail' || name === 'notify_owner' || name === 'fallback') return 'bg-rose-400';
  if (name === 'check_availability' || name === 'gemini_reply') return 'bg-brand-purple-light';
  return 'bg-brand-gold';
}

function PhoneHeader({
  channel, industry, isLive, speaking, typing, callSeconds, muted, onToggleMute, onReset,
}: {
  channel: Channel; industry: Industry; isLive: boolean; speaking: boolean; typing: boolean; callSeconds: number; muted: boolean; onToggleMute: () => void; onReset: () => void;
}) {
  const initials = industry.demo.business.split(' ').map((w) => w[0]).slice(0, 2).join('');
  const status = typing ? 'typing…' : isLive ? 'online · AI receptionist' : 'online';

  if (channel === 'voice') {
    const mm = String(Math.floor(callSeconds / 60)).padStart(2, '0');
    const ss = String(callSeconds % 60).padStart(2, '0');
    return (
      <div className="bg-[#1a1233] px-5 pb-3 pt-5 text-center text-white">
        <div className="mb-1 flex items-center justify-between text-[11px] text-white/50">
          <button onClick={onReset} className="flex items-center gap-1 hover:text-white"><Icon name="refresh" className="h-3.5 w-3.5" /> Restart</button>
          <span className="font-mono">{mm}:{ss}</span>
          <button onClick={onToggleMute} className="flex items-center gap-1 hover:text-white" aria-label={muted ? 'Unmute voice' : 'Mute voice'}>
            <Icon name={muted ? 'volumeOff' : 'volume'} className="h-3.5 w-3.5" /> {muted ? 'Muted' : 'Sound'}
          </button>
        </div>
        <p className="font-display text-lg font-semibold">{industry.demo.business}</p>
        <p className="text-xs text-emerald-300">{speaking ? `${industry.demo.agent} is speaking…` : typing ? 'Thinking…' : 'Connected · AI voice receptionist'}</p>
      </div>
    );
  }

  if (channel === 'whatsapp') {
    return (
      <div className="flex items-center gap-3 bg-[#075E54] px-4 pb-3 pt-5 text-white">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold text-xs font-bold text-brand-black">{initials}</div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 truncate text-sm font-semibold">
            {industry.demo.business}
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[#25D366]" fill="currentColor"><path d="M12 2l2.4 2.1 3.1-.4.9 3 2.8 1.5-1 3 1 3-2.8 1.5-.9 3-3.1-.4L12 22l-2.4-2.1-3.1.4-.9-3L2.8 15.8l1-3-1-3 2.8-1.5.9-3 3.1.4z" /><path d="M8 12l3 3 5-6" stroke="#075E54" strokeWidth="2" fill="none" /></svg>
          </p>
          <p className="truncate text-[11px] text-white/70">{status}</p>
        </div>
        <button onClick={onReset} aria-label="Restart" className="text-white/70 hover:text-white"><Icon name="refresh" className="h-4 w-4" /></button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center border-b border-gray-100 bg-[#F7F7F8] px-4 pb-2.5 pt-5">
      <div className="relative w-full text-center">
        <button onClick={onReset} aria-label="Restart" className="absolute left-0 top-2 text-brand-purple/70 hover:text-brand-purple"><Icon name="refresh" className="h-4 w-4" /></button>
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple-light to-brand-purple text-xs font-bold text-white">{initials}</div>
        <p className="mt-1 text-[11px] font-medium text-brand-black">{industry.demo.business} ›</p>
        <p className="text-[10px] text-gray-400">Text Message · {status}</p>
      </div>
    </div>
  );
}

function Bubble({ msg, channel }: { msg: Msg; channel: Channel }) {
  const mine = msg.role === 'user';
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
      className={clsx('flex', mine ? 'justify-end' : 'justify-start')}
    >
      <div
        className={clsx(
          'max-w-[82%] whitespace-pre-line px-3.5 py-2 text-[14px] leading-snug',
          channel === 'sms' && (mine ? 'rounded-[20px] rounded-br-md bg-brand-purple text-white' : 'rounded-[20px] rounded-bl-md bg-[#E9E9EB] text-brand-black'),
          channel === 'whatsapp' && (mine ? 'rounded-lg rounded-tr-none bg-[#D9FDD3] text-[#111B21] shadow-sm' : 'rounded-lg rounded-tl-none bg-white text-[#111B21] shadow-sm'),
          channel === 'voice' && (mine ? 'rounded-2xl bg-white/10 text-white/90' : 'rounded-2xl border border-brand-gold/25 bg-brand-gold/10 text-white')
        )}
      >
        {channel === 'voice' && <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider opacity-50">{mine ? 'You said' : 'Agent'}</span>}
        {msg.text}
        {channel === 'whatsapp' && (
          <span className="ml-2 inline-flex translate-y-1 items-center gap-0.5 text-[10px] text-[#667781]">
            {nowTime()}
            {mine && <span className="text-[#53BDEB]">✓✓</span>}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function TypingBubble({ channel, name }: { channel: Channel; name: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
      <div className={clsx('flex items-center gap-1 rounded-2xl px-4 py-3', channel === 'sms' && 'bg-[#E9E9EB]', channel === 'whatsapp' && 'bg-white shadow-sm', channel === 'voice' && 'bg-white/5')}>
        {[0, 1, 2].map((i) => (
          <motion.span key={i} className={clsx('h-1.5 w-1.5 rounded-full', channel === 'voice' ? 'bg-brand-gold' : 'bg-gray-400')} animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
        ))}
        <span className="sr-only">{name} is typing</span>
      </div>
    </motion.div>
  );
}

function VoiceOrb({ speaking, listening, typing }: { speaking: boolean; listening: boolean; typing: boolean }) {
  const active = speaking || listening || typing;
  return (
    <div className="flex h-32 shrink-0 items-center justify-center bg-[#1a1233]">
      <div className="relative flex h-24 w-24 items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className={clsx('absolute inset-0 rounded-full border', listening ? 'border-red-400/50' : 'border-brand-gold/40')}
            animate={active ? { scale: [1, 1.6], opacity: [0.7, 0] } : { scale: 1, opacity: 0.25 }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }}
          />
        ))}
        <div className="flex h-20 w-20 items-center justify-center gap-[3px] rounded-full bg-gradient-to-br from-brand-purple-light via-brand-purple to-brand-deep shadow-[0_0_40px_rgba(139,92,246,0.6)]">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full bg-white"
              animate={{ height: active ? [6, 22 - Math.abs(2 - i) * 4, 8, 18 - Math.abs(2 - i) * 3, 6] : 6 }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.08 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
