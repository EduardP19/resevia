// Scripted demo agent — a tiny, deterministic stand-in for the real
// Resevia agent, used on the website when the live sandbox isn't the
// right fit (non-salon industries) or isn't reachable. It mirrors the
// real agent's tool names (check_availability, update_booking_state,
// book_direct, …) so the "agent brain" panel shows what production does.

import type { Industry } from '@/lib/industries';

export type ToolEvent = { name: string; detail: string };
export type DemoState = {
  stage: 'idle' | 'service' | 'slot' | 'name' | 'done';
  service?: string;
  slot?: string;
  day?: string;
  name?: string;
};
export type DemoReply = { reply: string; tools: ToolEvent[]; state: DemoState };

export const INITIAL_DEMO_STATE: DemoState = { stage: 'idle' };

const has = (t: string, words: string[]) => words.some((w) => t.includes(w));

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function detectDay(t: string) {
  if (t.includes('today')) return 'today';
  if (t.includes('tomorrow')) return 'tomorrow';
  if (t.includes('weekend')) return 'Saturday';
  const d = DAYS.find((day) => t.includes(day) || t.includes(day.slice(0, 3) + ' '));
  return d ? d[0].toUpperCase() + d.slice(1) : undefined;
}

function detectService(industry: Industry, t: string) {
  const services = industry.demo.services;
  // Match on any meaningful word of the service name.
  for (const s of services) {
    const words = s.name
      .toLowerCase()
      .replace(/[()’'&]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['free', 'session', 'appointment', 'check', 'area'].includes(w));
    if (words.some((w) => t.includes(w))) return s;
  }
  // Friendly aliases.
  const alias: Record<string, string[]> = {
    'Cut & Blow-dry': ['haircut', 'cut', 'trim', 'blow'],
    'Full Colour': ['color', 'dye'],
    'Classic Lash Set': ['lash', 'lashes'],
    'Gel Manicure': ['nails', 'mani'],
    'Brow Lamination': ['brow'],
    'Free Consultation': ['consult', 'filler', 'botox'],
    'Hygienist Clean': ['hygien', 'clean'],
    'New Patient Exam': ['new patient', 'check-up', 'checkup', 'nhs'],
    'Emergency Appointment': ['emergency'],
    'Sports Massage': ['massage'],
    'Physio Assessment': ['physio', 'back'],
    'Annual Vaccination': ['booster', 'vaccin', 'jab'],
    'Free Intro Session': ['try', 'trial', 'intro'],
    'Reformer Pilates': ['pilates', 'class'],
    'Private GP (20 min)': ['gp', 'doctor'],
    'Blood Test Package': ['blood'],
  };
  for (const s of services) {
    if (alias[s.name]?.some((a) => t.includes(a))) return s;
  }
  return undefined;
}

function slotsFor(day: string) {
  const d = day === 'today' ? 'today' : day === 'tomorrow' ? 'tomorrow' : `on ${day}`;
  return { label: d, times: ['10:00', '13:30', '16:15'] };
}

function bookingRef() {
  return 'RSV-' + Math.random().toString(36).slice(2, 7).toUpperCase();
}

function pickTime(t: string, times: string[]) {
  if (has(t, ['first', 'earliest', 'morning', '10'])) return times[0];
  if (has(t, ['second', 'lunch', '1:30', '13:30', '1.30', 'afternoon'])) return times[1];
  if (has(t, ['third', 'last', 'latest', 'evening', '4', '16'])) return times[2];
  return undefined;
}

export function demoRespond(industry: Industry, state: DemoState, raw: string): DemoReply {
  const t = ` ${raw.toLowerCase().trim()} `;
  const d = industry.demo;
  const tools: ToolEvent[] = [];

  // 1. Safety first — guardrails beat everything else.
  if (d.guardrail && has(t, d.guardrail.keywords)) {
    tools.push({ name: 'guardrail', detail: 'Clinical / urgent topic detected — no advice given' });
    tools.push({ name: 'notify_owner', detail: 'Flagged to the team in the dashboard' });
    return { reply: d.guardrail.reply, tools, state };
  }

  // 2. Human handover.
  if (has(t, ['human', 'real person', 'speak to someone', 'manager', 'owner', 'call me'])) {
    tools.push({ name: 'notify_owner', detail: 'Handover requested — owner alerted' });
    return {
      reply: `Of course — I’ve let the team at ${d.business} know and someone will get back to you shortly. Is there anything I can help with in the meantime?`,
      tools,
      state,
    };
  }

  // 3. Mid-booking: waiting for a time.
  if (state.stage === 'slot' && state.service) {
    const time = pickTime(t, ['10:00', '13:30', '16:15']);
    if (time) {
      tools.push({ name: 'update_booking_state', detail: `time = ${time}` });
      return {
        reply: `Perfect, ${time} it is — I’m holding that for you now. What name should I put the booking under?`,
        tools,
        state: { ...state, stage: 'name', slot: time },
      };
    }
  }

  // 4. Mid-booking: waiting for a name.
  if (state.stage === 'name' && state.service && state.slot) {
    const name = raw.replace(/^(it'?s|my name is|i'?m|name is|under)\s+/i, '').trim().split(/\s+/).slice(0, 2).join(' ');
    const clean = name.replace(/[^A-Za-zÀ-ÿ\s'-]/g, '').trim();
    if (clean.length > 1) {
      const nice = clean.replace(/(^|\s)([a-zà-ÿ])/g, (_m, sp, c) => sp + c.toUpperCase());
      const ref = bookingRef();
      tools.push({ name: 'update_client_profile', detail: `name = ${nice}` });
      tools.push({ name: 'book_direct', detail: `${state.service} · ${state.day} ${state.slot} → confirmed` });
      tools.push({ name: 'send_confirmation', detail: 'WhatsApp → SMS fallback' });
      return {
        reply: `You’re all booked, ${nice.split(' ')[0]}! ✅\n\n${state.service}\n${state.day === 'today' || state.day === 'tomorrow' ? state.day[0].toUpperCase() + state.day.slice(1) : state.day} at ${state.slot}\n${d.business}\nRef: ${ref}\n\nI’ll send a reminder the day before. Anything else I can help with?`,
        tools,
        state: { stage: 'done', service: state.service, day: state.day, slot: state.slot, name: nice },
      };
    }
  }

  // 5. Knowledge-base questions.
  if (has(t, ['how much', 'price', 'cost', 'prices', 'expensive', '£', 'charge', 'membership'])) {
    const s = detectService(industry, t);
    tools.push({ name: 'knowledge_base', detail: s ? `price lookup: ${s.name}` : 'price list' });
    if (s) {
      return {
        reply: `${s.name} is ${s.price} and takes about ${s.duration}. Would you like me to check availability?`,
        tools,
        state: { ...state, stage: 'service', service: s.name },
      };
    }
    const list = d.services.map((x) => `• ${x.name} — ${x.price}`).join('\n');
    return { reply: `Here are our most popular options:\n${list}\n\nWhich one can I book for you?`, tools, state: { ...state, stage: 'service' } };
  }

  if (has(t, [' open', 'hours', 'closing', 'close ', 'what time do'])) {
    tools.push({ name: 'knowledge_base', detail: 'opening hours' });
    return { reply: `We’re open ${d.hours} Want me to find you a slot?`, tools, state };
  }

  if (has(t, ['where', 'address', 'parking', 'located', 'directions', 'find you'])) {
    tools.push({ name: 'knowledge_base', detail: 'location' });
    return { reply: `You’ll find us at ${d.address}`, tools, state };
  }

  if (has(t, ['cancel', 'reschedule', 'move my', 'change my'])) {
    const isCancel = t.includes('cancel');
    tools.push({ name: isCancel ? 'cancel_booking' : 'reschedule_booking', detail: 'looked up by phone number' });
    return {
      reply: isCancel
        ? 'I’ve found your booking for Thursday at 14:00. Just to confirm — would you like me to cancel it? We ask for 24 hours’ notice, and you’re well within that 👍'
        : 'No problem — I’ve found your booking for Thursday at 14:00. What day would suit you better?',
      tools,
      state,
    };
  }

  const faqHit = Object.entries(d.faqs).find(([k]) => t.includes(k));
  if (faqHit) {
    tools.push({ name: 'knowledge_base', detail: `FAQ: ${faqHit[0]}` });
    return { reply: faqHit[1], tools, state };
  }

  if (has(t, ['cancellation policy', 'policy', 'deposit', 'last', 'long'])) {
    tools.push({ name: 'knowledge_base', detail: 'policies' });
    return {
      reply: 'We just ask for 24 hours’ notice to cancel or move an appointment — no deposit needed for existing clients. Can I book something in for you?',
      tools,
      state,
    };
  }

  // 6. Booking intent.
  const service = detectService(industry, t) || (state.service && state.stage !== 'done' ? d.services.find((s) => s.name === state.service) : undefined);
  const day = detectDay(t) || (state.stage !== 'done' ? state.day : undefined);
  const wantsBooking = has(t, ['book', 'appointment', 'available', 'availability', 'slot', 'free', 'can i', 'get in', 'come in', 'need', 'want', 'see']) || !!service || !!detectDay(t);

  if (wantsBooking) {
    if (!service) {
      tools.push({ name: 'get_booking_requirements', detail: 'service not chosen yet' });
      const list = d.services.map((x) => x.name).join(', ');
      return { reply: `I’d love to get you booked in! Which would you like — ${list}?`, tools, state: { ...state, stage: 'service', day } };
    }
    const when = day || 'tomorrow';
    const { label, times } = slotsFor(when);
    tools.push({ name: 'update_booking_state', detail: `service = ${service.name}` });
    tools.push({ name: 'check_availability', detail: `${service.name} · ${when} → ${times.length} slots` });
    return {
      reply: `Great choice — ${service.name} (${service.price === 'Free' ? 'free' : service.price}, ${service.duration}). I have ${times.join(', ')} ${label}. Which works best?`,
      tools,
      state: { stage: 'slot', service: service.name, day: when },
    };
  }

  // 7. Greetings / thanks / fallback.
  if (has(t, [' hi ', ' hey', 'hello', 'morning', 'evening', 'hiya'])) {
    return { reply: d.greeting, tools, state };
  }
  if (has(t, ['thank', 'cheers', 'great', 'perfect', 'amazing'])) {
    return { reply: `You’re very welcome! See you soon at ${d.business} 💜`, tools, state };
  }

  tools.push({ name: 'knowledge_base', detail: 'no exact match — offering help' });
  return {
    reply: `Good question! I can help with bookings, prices, opening hours and anything about ${d.business}. If it’s something specific, I can also pass it straight to the team. What would you like to do?`,
    tools,
    state,
  };
}
