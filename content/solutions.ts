export interface SolutionFaq {
  q: string;
  a: string;
}

export interface Solution {
  slug: string;
  /** Short label used in nav cards and breadcrumbs */
  name: string;
  /** SEO title (without the brand suffix) */
  title: string;
  description: string;
  h1: string;
  intro: string;
  /** One-line summary used on the hub page cards */
  summary: string;
  problem: { heading: string; body: string };
  benefits: { title: string; body: string }[];
  steps: { title: string; body: string }[];
  useCases: string[];
  faqs: SolutionFaq[];
  /** Slugs of related spokes, used for internal linking */
  related: string[];
  /** When set, the page ends with a lead-capture form instead of the waitlist CTA */
  leadMagnet?: {
    /** Identifies the form in /api/leads and analytics */
    source: string;
    eyebrow: string;
    heading: string;
    body: string;
    bullets: string[];
    cta: string;
  };
}

export const SOLUTIONS: Solution[] = [
  {
    slug: 'ai-receptionist',
    name: 'AI Receptionist',
    title: 'AI Receptionist for Salons & Clinics',
    description:
      'Resevia is an AI receptionist for UK salons, aesthetic clinics and dental practices. It answers calls and messages 24/7, books appointments and sends reminders.',
    h1: 'The AI receptionist that never misses a booking',
    intro:
      'Resevia answers enquiries across phone, WhatsApp, SMS and website chat, checks your calendar and books the appointment — day or night, in your brand voice.',
    summary: 'One AI receptionist covering calls, WhatsApp, SMS and web chat, 24/7.',
    problem: {
      heading: 'Your front desk can only be in one place',
      body: 'When you are mid-treatment, the phone rings out and the WhatsApp sits unread. Most of those people book with whoever replies first. An AI receptionist makes sure that is always you.',
    },
    benefits: [
      { title: 'Always on', body: 'Replies instantly at 7am, 9pm and on bank holidays, so enquiries are never left waiting.' },
      { title: 'Books straight into your calendar', body: 'Checks real availability and confirms the appointment in the conversation.' },
      { title: 'Sounds like your business', body: 'We match your tone, services, pricing and booking rules before anything goes live.' },
      { title: 'Hands over when it should', body: 'Anything it cannot handle is escalated to you with a notification and the full conversation.' },
    ],
    steps: [
      { title: 'Tell us about your business', body: 'Services, prices, team, opening hours and booking rules via a short onboarding form.' },
      { title: 'We build and train it', body: 'We configure your receptionist in 24–48 hours. You review and approve it first.' },
      { title: 'Go live on your channels', body: 'Switch on WhatsApp, SMS, phone and website chat. We monitor and improve it monthly.' },
    ],
    useCases: ['Beauty and hair salons', 'Aesthetic clinics and medspas', 'Dental practices', 'Gyms and personal trainers', 'Veterinary practices'],
    faqs: [
      { q: 'What is an AI receptionist?', a: 'An AI receptionist is software that answers customer calls and messages, answers questions about your services and books appointments automatically, around the clock.' },
      { q: 'Will it replace my front-of-house team?', a: 'No. It handles repetitive enquiries and out-of-hours messages so your team can focus on the clients in front of them.' },
      { q: 'Which channels does it cover?', a: 'WhatsApp, SMS, website chat and AI voice for phone calls. AI voice is available from the Growth plan.' },
      { q: 'What happens if it does not know the answer?', a: 'It escalates to you by notification rather than guessing, and the client is told you will come back to them.' },
    ],
    related: ['ai-phone-answering', 'whatsapp-booking', 'missed-call-text-back'],
  },
  {
    slug: 'whatsapp-automation',
    name: 'WhatsApp Automation',
    title: 'WhatsApp Automation for Appointment-Based Businesses',
    description:
      'Automate WhatsApp for your salon or clinic: instant replies, bookings, reminders and follow-ups on WhatsApp Business, handled by an AI trained on your business.',
    h1: 'WhatsApp automation for busy salons and clinics',
    intro:
      'Your clients already message you on WhatsApp. Resevia replies instantly, answers questions, books appointments and sends reminders, without you touching your phone.',
    summary: 'Instant WhatsApp replies, reminders and follow-ups on autopilot.',
    problem: {
      heading: 'WhatsApp is where clients are, and where messages get lost',
      body: 'Replying by hand between appointments means slow responses and forgotten follow-ups. Automating WhatsApp keeps every conversation moving.',
    },
    benefits: [
      { title: 'Instant replies', body: 'Every new message gets an answer in seconds, including outside opening hours.' },
      { title: 'Pre-approved templates', body: 'Reminders, confirmations and follow-ups are sent as WhatsApp-approved templates, so they are delivered reliably.' },
      { title: 'Conversations that make sense', body: 'The AI keeps context across the chat, so clients are not asked the same thing twice.' },
      { title: 'Full visibility', body: 'See every conversation and message count in your dashboard.' },
    ],
    steps: [
      { title: 'Connect WhatsApp Business', body: 'We set up your WhatsApp Business number and templates for you.' },
      { title: 'Train it on your business', body: 'Services, pricing, FAQs and tone are loaded in and approved by you.' },
      { title: 'Automate', body: 'Replies, reminders and follow-ups run automatically. You step in only when needed.' },
    ],
    useCases: ['Answering price and availability questions', 'Booking confirmations', 'Appointment reminders', 'Rebooking and review requests'],
    faqs: [
      { q: 'Do I need WhatsApp Business?', a: 'Yes, automation runs through the WhatsApp Business platform. We handle the setup during onboarding.' },
      { q: 'What are WhatsApp templates?', a: 'Templates are pre-approved messages WhatsApp requires for anything a business sends first, such as reminders. Replies inside an open conversation are not templated.' },
      { q: 'Can clients tell it is automated?', a: 'It writes in your brand voice and you can hand any conversation over to a human at any time.' },
      { q: 'How many WhatsApp messages are included?', a: 'Essentials includes 2,000 WhatsApp messages a month and Growth includes 4,000. See the pricing page for details.' },
    ],
    related: ['whatsapp-booking', 'appointment-reminders', 'ai-receptionist'],
    leadMagnet: {
      source: 'whatsapp-automation-audit',
      eyebrow: 'Free WhatsApp automation audit',
      heading: 'Get a free WhatsApp automation plan for your business',
      body: 'Tell us how you use WhatsApp today. We’ll review it and email you a personalised plan within 2 working days. No cost, no obligation.',
      bullets: [
        'Which of your enquiries can be automated, and which should stay human',
        'Which WhatsApp templates you need for reminders, confirmations and follow-ups',
        'A suggested booking flow for your services and calendar',
      ],
      cta: 'Get my free audit',
    },
  },
  {
    slug: 'whatsapp-booking',
    name: 'WhatsApp Booking',
    title: 'WhatsApp Booking System for Salons & Clinics',
    description:
      'Let clients book appointments on WhatsApp. Resevia checks availability, confirms the slot and syncs with Google Calendar, Fresha, Timely and more.',
    h1: 'Take bookings on WhatsApp, automatically',
    intro:
      'A client messages "can I get in on Thursday?" and Resevia finds a slot, books it and confirms, all inside the chat.',
    summary: 'Clients book, change and cancel appointments inside WhatsApp.',
    problem: {
      heading: 'Booking links lose people',
      body: 'Sending clients to a form or app adds friction. Booking in the same chat they started in is faster, and more of them follow through.',
    },
    benefits: [
      { title: 'Real availability', body: 'Slots come from your live calendar, so there are no double bookings.' },
      { title: 'Reschedule and cancel in chat', body: 'Clients move or cancel appointments by message, and your calendar updates.' },
      { title: 'Works with your tools', body: 'Resevia works alongside Fresha, Timely, Phorest, Cal.com and Google Calendar.' },
      { title: 'Instant confirmation', body: 'A confirmation lands on WhatsApp the moment the booking is made.' },
    ],
    steps: [
      { title: 'Client sends a message', body: 'Any enquiry, from "how much is a facial?" to "any slots Friday?".' },
      { title: 'Resevia offers real slots', body: 'It checks your calendar, matches the right service and team member.' },
      { title: 'Booked and confirmed', body: 'The appointment is created and the client gets a confirmation, then reminders.' },
    ],
    useCases: ['Hair and beauty appointments', 'Aesthetic consultations', 'Dental check-ups', 'PT sessions and classes'],
    faqs: [
      { q: 'Which calendars and booking systems does it work with?', a: 'Resevia books into your calendar and works alongside Fresha, Timely, Phorest, Cal.com and Google Calendar. Tell us what you use during onboarding.' },
      { q: 'Can clients cancel or reschedule?', a: 'Yes, they can do it in the same WhatsApp conversation.' },
      { q: 'Does it take deposits?', a: 'Deposit handling depends on your setup. Ask us during onboarding and we will confirm what is possible for your business.' },
      { q: 'Can it handle several team members and services?', a: 'Yes. Services, durations, team members and booking rules are configured up front.' },
    ],
    related: ['whatsapp-automation', 'appointment-reminders', 'ai-receptionist'],
  },
  {
    slug: 'ai-phone-answering',
    name: 'AI Phone Answering',
    title: 'AI Voice Receptionist & Phone Answering',
    description:
      'An AI voice receptionist that answers your phone 24/7, answers questions and books appointments. Never send a client to voicemail again.',
    h1: 'AI phone answering that books while you work',
    intro:
      'Resevia picks up when you cannot. It talks naturally, answers common questions, books the appointment and texts the client a confirmation.',
    summary: 'A natural-sounding AI voice that answers and books over the phone.',
    problem: {
      heading: 'Voicemail is where bookings go to die',
      body: 'Most callers who reach voicemail do not leave a message, they ring the next business. Answering every call changes that.',
    },
    benefits: [
      { title: 'Every call answered', body: 'No more ringing out during treatments, lunch breaks or after closing.' },
      { title: 'Books during the call', body: 'Checks availability and books while the caller is still on the line.' },
      { title: 'Confirmation by text', body: 'The caller receives an SMS or WhatsApp confirmation straight away.' },
      { title: 'Escalates when needed', body: 'You are notified about anything urgent or outside what the AI should handle.' },
    ],
    steps: [
      { title: 'Divert or give a number', body: 'Forward calls when busy, or use a dedicated number.' },
      { title: 'AI answers', body: 'It greets callers in your brand voice and helps with their request.' },
      { title: 'You get the summary', body: 'Booking made, details captured and you are alerted if something needs you.' },
    ],
    useCases: ['After-hours calls', 'Calls while mid-treatment', 'Busy Saturday phone lines', 'New patient enquiries'],
    faqs: [
      { q: 'Is AI voice included in every plan?', a: 'AI voice starts on the Growth plan, which includes 500 voice minutes a month. Essentials is SMS and WhatsApp only.' },
      { q: 'Can I keep my existing phone number?', a: 'Yes. You can forward calls from your current number, or use a dedicated number.' },
      { q: 'Does it sound robotic?', a: 'It is designed to sound natural and is tuned to your tone during setup. Try the live demo from our homepage.' },
      { q: 'What if the caller wants a person?', a: 'It can take a message and notify you straight away.' },
    ],
    related: ['ai-receptionist', 'missed-call-text-back', 'whatsapp-booking'],
  },
  {
    slug: 'missed-call-text-back',
    name: 'Missed-Call Text-Back',
    title: 'Missed-Call Text-Back for Salons & Clinics',
    description:
      'Automatically text every missed caller within seconds and turn them into a booking. Missed-call text-back by Resevia for UK appointment businesses.',
    h1: 'Turn missed calls into booked appointments',
    intro:
      'When a call goes unanswered, Resevia texts the caller within seconds, picks up the conversation and books them in.',
    summary: 'Text every missed caller instantly and win the booking back.',
    problem: {
      heading: 'A missed call is a lost client, unless you reply fast',
      body: 'People rarely wait. A quick, friendly text while they are still looking at their phone keeps the booking with you.',
    },
    benefits: [
      { title: 'Seconds, not hours', body: 'The text goes out as soon as the call is missed.' },
      { title: 'Not just a canned message', body: 'The AI continues the conversation, answers questions and books.' },
      { title: 'Zero effort', body: 'No one has to remember to call back.' },
      { title: 'Owner alerts', body: 'You are notified about new bookings and anything that needs a human.' },
    ],
    steps: [
      { title: 'Call is missed', body: 'The call rings out or you are busy.' },
      { title: 'Text goes out', body: 'The caller receives a message in your brand voice.' },
      { title: 'Booking captured', body: 'Resevia handles the replies and books the appointment.' },
    ],
    useCases: ['Busy treatment rooms', 'After-hours calls', 'Lunch and holiday cover'],
    faqs: [
      { q: 'Does it work with my existing number?', a: 'Yes. We set it up against the number your clients already call.' },
      { q: 'Will callers be annoyed by a text?', a: 'Messages are short and helpful, written in your tone, and respond to what the caller actually wants.' },
      { q: 'Is it available on all plans?', a: 'Missed-call text-back runs over SMS and WhatsApp, which are included on every plan.' },
    ],
    related: ['ai-phone-answering', 'ai-receptionist', 'whatsapp-automation'],
  },
  {
    slug: 'appointment-reminders',
    name: 'Appointment Reminders',
    title: 'Automated Appointment Reminders by SMS & WhatsApp',
    description:
      'Reduce no-shows with automatic appointment reminders and follow-ups by SMS and WhatsApp. Clients can confirm, reschedule or cancel by reply.',
    h1: 'Appointment reminders that cut no-shows',
    intro:
      'Resevia sends reminders by SMS or WhatsApp at the right time and lets clients confirm, reschedule or cancel with a quick reply.',
    summary: 'SMS and WhatsApp reminders that reduce no-shows and fill gaps.',
    problem: {
      heading: 'Every no-show is an empty chair',
      body: 'A timely reminder with an easy way to change plans means fewer empty slots and more chances to rebook the ones that do cancel.',
    },
    benefits: [
      { title: 'Right channel, right time', body: 'Reminders go by SMS or WhatsApp ahead of the appointment.' },
      { title: 'Reply to reschedule', body: 'Clients move or cancel with a message, freeing the slot early.' },
      { title: 'No-show follow-ups', body: 'Missed appointments get a friendly follow-up to rebook.' },
      { title: 'Review requests', body: 'Follow up after a visit to ask for feedback.' },
    ],
    steps: [
      { title: 'Booking made', body: 'Via Resevia or your existing booking system.' },
      { title: 'Reminder sent', body: 'The client gets a reminder and a way to confirm or change.' },
      { title: 'Calendar stays accurate', body: 'Changes update your diary and you are alerted.' },
    ],
    useCases: ['Treatment reminders', 'Consultation confirmations', 'Recall and rebooking'],
    faqs: [
      { q: 'How much do no-shows cost?', a: 'It varies by business, but every missed appointment is lost revenue. Reminders are one of the simplest ways to reduce that.' },
      { q: 'Can I customise the reminder wording?', a: 'Yes. We match your tone and set the timing with you.' },
      { q: 'Do reminders count towards my message allowance?', a: 'Yes, each SMS or WhatsApp message sent counts. Your dashboard tracks usage live.' },
    ],
    related: ['whatsapp-automation', 'whatsapp-booking', 'ai-receptionist'],
  },
  {
    slug: 'website-chat-booking',
    name: 'Website Chat Booking',
    title: 'AI Website Chat for Booking Appointments',
    description:
      'Add an AI chat to your website that answers questions and books appointments 24/7, trained on your services, prices and availability.',
    h1: 'A website chat that actually books appointments',
    intro:
      'Visitors ask a question, get an accurate answer and book without leaving your site, whenever they are browsing.',
    summary: 'AI chat on your site that answers questions and books clients.',
    problem: {
      heading: 'Most visitors leave without enquiring',
      body: 'If answers are slow or hard to find, people bounce. A chat that responds instantly captures them while they are interested.',
    },
    benefits: [
      { title: 'Instant answers', body: 'Pricing, treatments, aftercare and availability, in your tone.' },
      { title: 'Books in the chat', body: 'Checks your calendar and confirms the appointment.' },
      { title: 'Captures leads', body: 'Contact details are collected so you can follow up.' },
      { title: 'Same brain as WhatsApp', body: 'One AI across web, WhatsApp, SMS and phone.' },
    ],
    steps: [
      { title: 'Add the chat', body: 'We install it on your website for you.' },
      { title: 'Visitors ask', body: 'The AI answers from what you told us about your business.' },
      { title: 'Booking made', body: 'The appointment lands in your calendar.' },
    ],
    useCases: ['Treatment price enquiries', 'New patient registrations', 'Out-of-hours browsing'],
    faqs: [
      { q: 'Do I need a developer?', a: 'No, we handle the installation.' },
      { q: 'Will it work on my website platform?', a: 'It works on most websites. Tell us what you use during onboarding.' },
      { q: 'Can it hand over to WhatsApp?', a: 'Yes. The same AI can continue a conversation across channels.' },
    ],
    related: ['ai-receptionist', 'whatsapp-booking', 'missed-call-text-back'],
  },
];

export function getSolution(slug: string) {
  return SOLUTIONS.find((s) => s.slug === slug);
}
