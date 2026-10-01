// SEO copy for the per-industry landing pages (/industries/[slug]).
// Pains, wins and example services come from lib/industries.ts via `id`.

import type { FaqItem } from '@/components/sections/FAQ';

export interface IndustryPage {
  /** Matches an id in lib/industries.ts */
  id: string;
  slug: string;
  /** SEO title without the brand suffix */
  title: string;
  description: string;
  /** Plain-text H1 lead and the gold-highlighted tail */
  h1: { lead: string; highlight: string };
  intro: string;
  problem: { heading: string; body: string };
  faqs: FaqItem[];
  /** Solution slugs to cross-link */
  related: string[];
}

export const INDUSTRY_PAGES: IndustryPage[] = [
  {
    id: 'hair',
    slug: 'hair-salons-barbers',
    title: 'AI Receptionist for Hair Salons & Barbers',
    description:
      'Resevia answers calls, WhatsApp and SMS for hair salons and barbers, books cuts and colours into your diary 24/7, and sends reminders so chairs stay full.',
    h1: { lead: 'The AI receptionist for', highlight: 'hair salons & barbers.' },
    intro:
      'Your hands are full of colour and the phone is ringing. Resevia answers every call and message, quotes your prices, books into the right stylist’s diary and reminds clients before they arrive.',
    problem: {
      heading: 'Most bookings arrive while you are mid-appointment',
      body: 'Clients enquire in the evening, on Sundays and while you are halfway through a colour. If nobody replies quickly, they book with the next salon. Resevia replies in seconds, in your brand voice, so the booking stays with you.',
    },
    faqs: [
      { q: 'Can it book colour services that need a patch test?', a: 'Yes. We set your booking rules up front, so it can ask for and schedule a patch test before a colour appointment.' },
      { q: 'Does it book into individual stylists’ diaries?', a: 'Yes. Services, durations and team members are configured during onboarding, and it books against real availability.' },
      { q: 'Can it fill last-minute gaps?', a: 'It can offer free slots to clients who ask, and reminders with an easy reschedule option free up cancelled slots earlier.' },
      { q: 'Does it work with Fresha, Phorest or Timely?', a: 'Resevia works alongside tools like Fresha, Phorest, Timely and Google Calendar. Tell us what you use during onboarding.' },
    ],
    related: ['whatsapp-booking', 'missed-call-text-back', 'appointment-reminders'],
  },
  {
    id: 'beauty',
    slug: 'beauty-salons-nail-bars',
    title: 'AI Receptionist for Beauty Salons & Nail Bars',
    description:
      'Resevia handles lash, brow, nail and facial enquiries on WhatsApp, SMS, Instagram-driven chats and calls, books appointments 24/7 and cuts no-shows with reminders.',
    h1: { lead: 'The AI receptionist for', highlight: 'beauty salons & nail bars.' },
    intro:
      'Instagram enquiries at midnight, the same price questions all day, and no-shows on long treatments. Resevia replies instantly, books the treatment and sends the reminders for you.',
    problem: {
      heading: 'Beauty clients message first and book with whoever replies',
      body: 'Treatments are often booked on impulse, outside opening hours. A fast, friendly reply with prices and available slots turns those enquiries into appointments instead of unread messages.',
    },
    faqs: [
      { q: 'Can it answer treatment and price questions?', a: 'Yes. We load your services, prices and durations, so it answers accurately and consistently in your tone.' },
      { q: 'Can it suggest add-ons?', a: 'It can mention relevant add-ons naturally during a booking, based on the services you set up.' },
      { q: 'Will it help with no-shows on long treatments?', a: 'Reminders by SMS or WhatsApp let clients confirm, reschedule or cancel with a reply, which frees slots earlier.' },
      { q: 'Which channels does it cover?', a: 'WhatsApp, SMS, website chat and AI voice for calls. AI voice starts on the Growth plan.' },
    ],
    related: ['whatsapp-automation', 'appointment-reminders', 'website-chat-booking'],
  },
  {
    id: 'aesthetics',
    slug: 'aesthetic-clinics',
    title: 'AI Receptionist for Aesthetic Clinics',
    description:
      'A discreet, premium AI receptionist for aesthetic clinics. Resevia answers enquiries 24/7, books consultations and hands complex cases to your practitioner. It never gives medical advice.',
    h1: { lead: 'The AI receptionist for', highlight: 'aesthetic clinics.' },
    intro:
      'High-value enquiries go cold fast. Resevia replies promptly and professionally, answers common treatment questions and books consultations, and passes anything clinical to your practitioner.',
    problem: {
      heading: 'A slow reply costs you a consultation',
      body: 'People researching treatments contact several clinics at once, and the first helpful reply often wins. Resevia answers straight away, in a tone that suits a premium brand, and books the consultation.',
    },
    faqs: [
      { q: 'Does the AI give medical advice?', a: 'No. It is set up not to give medical advice and to hand clinical questions to your practitioner.' },
      { q: 'Can it book free consultations rather than just treatments?', a: 'Yes. Consultations are set up as their own service, with the duration and booking rules you choose.' },
      { q: 'Can I review replies before they are sent?', a: 'Yes. Approval mode holds every reply as a draft until you approve or edit it. You can switch to autonomous when you are comfortable.' },
      { q: 'Is it suitable for a premium brand voice?', a: 'We match your tone before anything goes live, and you review and approve it first.' },
    ],
    related: ['ai-receptionist', 'whatsapp-booking', 'ai-phone-answering'],
  },
  {
    id: 'dental',
    slug: 'dental-practices',
    title: 'AI Receptionist for Dental Practices',
    description:
      'Resevia answers new patient enquiries, books check-ups and flags urgent cases for dental practices, by phone, WhatsApp and SMS, 24/7. Reduces reception overload at peak times.',
    h1: { lead: 'The AI receptionist for', highlight: 'dental practices.' },
    intro:
      'Reception is overloaded at 8:30am and new patient enquiries slip through. Resevia handles the routine calls and messages, books appointments and flags urgent cases to your team.',
    problem: {
      heading: 'Your front desk cannot answer everyone at once',
      body: 'Morning rushes, patients at the desk and ringing phones all compete for the same people. Resevia takes the repeat enquiries so your team can focus on the patients in front of them.',
    },
    faqs: [
      { q: 'Can it handle NHS versus private questions?', a: 'Yes. We set out how your practice works, such as whether you take NHS or private patients, so it answers consistently.' },
      { q: 'What about dental emergencies?', a: 'It is set up to recognise urgent requests and flag them to your team quickly rather than treating them like routine bookings.' },
      { q: 'Does it give clinical advice?', a: 'No. Clinical questions are handed to your team.' },
      { q: 'Can it send recall and appointment reminders?', a: 'Yes. Reminders go by SMS or WhatsApp, and clients can confirm, reschedule or cancel with a reply.' },
    ],
    related: ['ai-phone-answering', 'appointment-reminders', 'ai-receptionist'],
  },
  {
    id: 'wellness',
    slug: 'physio-wellness-studios',
    title: 'AI Receptionist for Physio, Massage & Wellness Studios',
    description:
      'Resevia books massage, physio and therapy appointments across therapists and rooms, answers client questions 24/7 and sends reminders by SMS and WhatsApp.',
    h1: { lead: 'The AI receptionist for', highlight: 'physio & wellness studios.' },
    intro:
      'Therapists cannot answer the phone mid-session. Resevia answers for them, matches clients to the right therapist and treatment, and keeps your diary moving.',
    problem: {
      heading: 'Availability across rooms and therapists is hard to juggle by hand',
      body: 'Different therapists, treatment lengths and rooms mean booking by message is slow. Resevia checks real availability and books the right slot, then follows up with reminders.',
    },
    faqs: [
      { q: 'Can it match clients to the right therapist?', a: 'Yes. We configure your services, team and booking rules so it can offer the right therapist and treatment length.' },
      { q: 'Can it handle follow-up sessions and packages?', a: 'It can book follow-up sessions, and we can set up how packages are offered during onboarding.' },
      { q: 'Does it answer questions about gift vouchers?', a: 'Yes, if you offer them, we add the details so it can answer and point clients to your voucher link.' },
      { q: 'Does it offer medical advice?', a: 'No. Clinical questions are passed to your team.' },
    ],
    related: ['whatsapp-booking', 'appointment-reminders', 'ai-receptionist'],
  },
  {
    id: 'vets',
    slug: 'veterinary-practices',
    title: 'AI Receptionist for Veterinary Practices',
    description:
      'Resevia handles routine bookings, vaccination reminders and common questions for vets, and routes emergencies straight to your team, so clinical staff are not fielding calls all day.',
    h1: { lead: 'The AI receptionist for', highlight: 'veterinary practices.' },
    intro:
      'Phones ring through consultations and repeat prescription requests pile up. Resevia handles routine bookings and questions, takes prescription requests and routes emergencies to your team.',
    problem: {
      heading: 'Routine calls pull your clinical team away from animals',
      body: 'Vaccination bookings, health checks and prescription requests are predictable, and they take up much of the day. Automating them frees your nurses and vets for the work only they can do.',
    },
    faqs: [
      { q: 'How does it handle emergencies?', a: 'It is set up to recognise urgent situations and route them to your team or your out-of-hours provider straight away.' },
      { q: 'Can it take repeat prescription requests?', a: 'Yes. It collects the pet’s name and medication so your team can prepare it, following your turnaround time.' },
      { q: 'Does it give veterinary advice?', a: 'No. Clinical and medical questions are handed to your team.' },
      { q: 'Can it book vaccinations and check-ups?', a: 'Yes. Appointment types and durations are configured up front.' },
    ],
    related: ['ai-phone-answering', 'appointment-reminders', 'missed-call-text-back'],
  },
  {
    id: 'fitness',
    slug: 'gyms-personal-trainers',
    title: 'AI Receptionist for Gyms & Personal Trainers',
    description:
      'Resevia handles class and PT bookings, membership enquiries and reminders for gyms and personal trainers over WhatsApp, SMS and phone, without picking up the phone.',
    h1: { lead: 'The AI receptionist for', highlight: 'gyms & personal trainers.' },
    intro:
      'Trainers are on the floor, not on the phone. Resevia answers membership and class questions, books PT sessions and keeps clients turning up.',
    problem: {
      heading: 'Leads and bookings arrive when you are coaching',
      body: 'Membership enquiries and session bookings come in through the day and evening. A quick answer and an easy booking keep prospects warm instead of letting them drift to another gym.',
    },
    faqs: [
      { q: 'Can it book PT sessions and classes?', a: 'Yes. Sessions, durations and trainers are set up during onboarding, and it books against real availability.' },
      { q: 'Can it answer membership questions?', a: 'Yes. We load your membership options, prices and policies so it answers consistently.' },
      { q: 'Does it reduce no-shows?', a: 'Reminders by SMS or WhatsApp with a reply to reschedule or cancel help free spots earlier.' },
      { q: 'Can I use it for a single trainer rather than a gym?', a: 'Yes. It works for independent personal trainers and for larger gyms.' },
    ],
    related: ['whatsapp-automation', 'appointment-reminders', 'missed-call-text-back'],
  },
  {
    id: 'clinics',
    slug: 'private-clinics',
    title: 'AI Receptionist for Private Clinics',
    description:
      'Resevia answers enquiries, books appointments and escalates clinical questions for private clinics, by phone, WhatsApp and SMS, 24/7 and in your brand voice.',
    h1: { lead: 'The AI receptionist for', highlight: 'private clinics.' },
    intro:
      'Private patients expect quick, professional responses. Resevia answers every enquiry, books appointments and hands clinical questions to your team.',
    problem: {
      heading: 'Patients expect an answer today, not next week',
      body: 'Out-of-hours enquiries and busy front desks leave messages waiting. Resevia replies straight away and keeps your diary organised, while your clinicians stay in control of anything clinical.',
    },
    faqs: [
      { q: 'Does it give medical advice?', a: 'No. It is set up not to give medical advice and hands clinical questions to your team.' },
      { q: 'Can it work across several clinicians and services?', a: 'Yes. Services, clinicians and booking rules are configured during onboarding.' },
      { q: 'Can I approve replies before they go out?', a: 'Yes. Approval mode holds each reply as a draft until you approve it.' },
      { q: 'Which channels are supported?', a: 'WhatsApp, SMS, website chat and AI voice for calls. AI voice starts on the Growth plan.' },
    ],
    related: ['ai-receptionist', 'ai-phone-answering', 'whatsapp-booking'],
  },
];

export function getIndustryPage(slug: string) {
  return INDUSTRY_PAGES.find((p) => p.slug === slug);
}

export function industryPageHref(id: string) {
  const page = INDUSTRY_PAGES.find((p) => p.id === id);
  return page ? `/industries/${page.slug}` : '/industries';
}
