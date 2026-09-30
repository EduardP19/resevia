// Industry catalogue — drives the hero word rotator, the industry explorer,
// the /industries page and the scripted demo agent. Add a vertical here and
// it appears everywhere.

export type IndustryService = { name: string; price: string; duration: string };

export type Industry = {
  id: string;
  name: string;
  /** Word used in "Your ___ never misses a booking" style copy. */
  noun: string;
  icon: IconName;
  tagline: string;
  pains: string[];
  wins: string[];
  demo: {
    business: string;
    agent: string;
    greeting: string;
    services: IndustryService[];
    hours: string;
    address: string;
    prompts: string[];
    /** Extra FAQ answers keyed by a lowercase keyword. */
    faqs: Record<string, string>;
    /** Optional safety rule, e.g. clinics never give medical advice. */
    guardrail?: { keywords: string[]; reply: string };
  };
};

export type IconName =
  | 'sparkle'
  | 'scissors'
  | 'syringe'
  | 'tooth'
  | 'leaf'
  | 'paw'
  | 'dumbbell'
  | 'stethoscope'
  | 'grid';

export const INDUSTRIES: Industry[] = [
  {
    id: 'hair',
    name: 'Hair & Barbers',
    noun: 'salon',
    icon: 'scissors',
    tagline: 'Book cuts, colours and consultations while your hands are full.',
    pains: ['Phone rings mid-colour', 'Evening DMs go unanswered', 'Last-minute gaps stay empty'],
    wins: ['Fills cancellations from the waitlist', 'Answers price questions instantly', 'Books straight into the stylist’s diary'],
    demo: {
      business: 'Amo Hair Studio',
      agent: 'Sophia',
      greeting: 'Hi, I’m Sophia at Amo Hair Studio ✂️ How can I help today?',
      services: [
        { name: 'Cut & Blow-dry', price: '£55', duration: '60 min' },
        { name: 'Full Colour', price: '£95', duration: '2 hrs' },
        { name: 'Balayage', price: '£160', duration: '3 hrs' },
        { name: 'Men’s Cut', price: '£28', duration: '30 min' },
      ],
      hours: 'Tue–Sat 9:00–19:00, Thursdays until 20:00. Closed Sunday and Monday.',
      address: '14 Market Street, Hemel Hempstead — free parking behind the building.',
      prompts: ['Can I book a balayage this Saturday?', 'How much is a cut and blow-dry?', 'Are you open Monday?'],
      faqs: {
        patch: 'For any colour service we need a quick patch test at least 48 hours before — I can book that for you too.',
      },
    },
  },
  {
    id: 'beauty',
    name: 'Beauty & Nails',
    noun: 'beauty salon',
    icon: 'sparkle',
    tagline: 'Lashes, brows, nails and facials — booked 24/7 in your brand voice.',
    pains: ['Instagram enquiries at midnight', 'No-shows on long treatments', 'Repeating prices all day'],
    wins: ['Reminders that cut no-shows', 'Upsells add-ons naturally', 'Works across SMS, WhatsApp and calls'],
    demo: {
      business: 'Glow Beauty Lounge',
      agent: 'Ava',
      greeting: 'Hi lovely, I’m Ava at Glow Beauty Lounge ✨ What can I book for you?',
      services: [
        { name: 'Gel Manicure', price: '£32', duration: '45 min' },
        { name: 'Classic Lash Set', price: '£65', duration: '90 min' },
        { name: 'Brow Lamination', price: '£45', duration: '45 min' },
        { name: 'Signature Facial', price: '£70', duration: '60 min' },
      ],
      hours: 'Mon–Sat 9:00–20:00, Sunday 10:00–16:00.',
      address: '3 Queensway, St Albans — two minutes from the station.',
      prompts: ['Do you have a lash appointment tomorrow?', 'How long does brow lamination last?', 'What’s your cancellation policy?'],
      faqs: {
        last: 'Brow lamination usually lasts 6–8 weeks, and lash sets need an infill every 2–3 weeks.',
      },
    },
  },
  {
    id: 'aesthetics',
    name: 'Aesthetic Clinics',
    noun: 'clinic',
    icon: 'syringe',
    tagline: 'Discreet, premium replies for high-value consultations.',
    pains: ['High-value leads go cold fast', 'Same treatment questions every day', 'Consultations booked by phone tag'],
    wins: ['Books consultations, not just enquiries', 'Never gives medical advice', 'Hands complex cases to your practitioner'],
    demo: {
      business: 'Lumière Aesthetics',
      agent: 'Clara',
      greeting: 'Welcome to Lumière Aesthetics, I’m Clara. How may I help you today?',
      services: [
        { name: 'Free Consultation', price: 'Free', duration: '20 min' },
        { name: 'Anti-wrinkle (1 area)', price: '£150', duration: '30 min' },
        { name: 'Lip Filler 0.5ml', price: '£220', duration: '45 min' },
        { name: 'Skin Booster', price: '£250', duration: '45 min' },
      ],
      hours: 'Mon–Fri 10:00–19:00, Saturday 10:00–15:00.',
      address: 'Harley Suite, 22 Wimpole Street, London.',
      prompts: ['I’d like a consultation for lip filler', 'How much is anti-wrinkle?', 'Is filler safe while pregnant?'],
      faqs: {},
      guardrail: {
        keywords: ['safe', 'pregnant', 'pregnancy', 'side effect', 'allergic', 'hurt', 'pain', 'medication'],
        reply:
          'That’s a really important question, and one our practitioner should answer personally — I can’t give medical advice. I can book you a free 20-minute consultation where they’ll go through it with you. Shall I find a time?',
      },
    },
  },
  {
    id: 'dental',
    name: 'Dental Practices',
    noun: 'dental practice',
    icon: 'tooth',
    tagline: 'New patients, check-ups and urgent triage — handled calmly.',
    pains: ['Reception overloaded at 8:30am', 'New patient enquiries lost', 'Emergencies need fast routing'],
    wins: ['Triage flags urgent cases to the team', 'Answers NHS vs private questions', 'Recalls and reminders on autopilot'],
    demo: {
      business: 'Brightside Dental',
      agent: 'Maya',
      greeting: 'Hello, you’re through to Maya at Brightside Dental. How can I help?',
      services: [
        { name: 'New Patient Exam', price: '£65', duration: '40 min' },
        { name: 'Hygienist Clean', price: '£75', duration: '30 min' },
        { name: 'Teeth Whitening Consult', price: 'Free', duration: '20 min' },
        { name: 'Emergency Appointment', price: '£85', duration: '30 min' },
      ],
      hours: 'Mon–Fri 8:00–18:00, Saturday 9:00–13:00.',
      address: '8 Church Road, Watford — step-free access and patient parking.',
      prompts: ['I need a hygienist appointment', 'Are you taking new NHS patients?', 'I have really bad tooth pain'],
      faqs: {
        nhs: 'We’re currently private-only for new patients, but our new patient exam is £65 and includes X-rays.',
      },
      guardrail: {
        keywords: ['pain', 'swelling', 'bleeding', 'broken', 'emergency', 'abscess'],
        reply:
          'I’m sorry you’re in pain. I’ve flagged this as urgent for our team 🚩 We keep emergency slots every morning — the next one is tomorrow at 8:15. If you have swelling that affects breathing or swallowing, please call 999 or go to A&E now. Would you like me to hold the 8:15 slot?',
      },
    },
  },
  {
    id: 'wellness',
    name: 'Physio & Wellness',
    noun: 'studio',
    icon: 'leaf',
    tagline: 'Massage, physio and therapies booked without the back-and-forth.',
    pains: ['Therapists can’t answer mid-session', 'Complex availability across rooms', 'Block bookings done by hand'],
    wins: ['Matches clients to the right therapist', 'Sells packages and follow-ups', 'Keeps every room full'],
    demo: {
      business: 'Stillwater Physio & Spa',
      agent: 'Leo',
      greeting: 'Hi, Leo here from Stillwater Physio & Spa 🌿 How can I help?',
      services: [
        { name: 'Physio Assessment', price: '£60', duration: '45 min' },
        { name: 'Sports Massage', price: '£55', duration: '60 min' },
        { name: 'Hot Stone Massage', price: '£75', duration: '75 min' },
        { name: 'Follow-up Session', price: '£48', duration: '30 min' },
      ],
      hours: 'Mon–Fri 7:00–21:00, weekends 9:00–17:00.',
      address: '51 High Street, Berkhamsted.',
      prompts: ['Can I get a sports massage after work?', 'Do you do physio for back pain?', 'Do you sell gift vouchers?'],
      faqs: {
        voucher: 'Yes! Gift vouchers are available for any amount or treatment — I can text you a link to buy one.',
      },
    },
  },
  {
    id: 'vets',
    name: 'Veterinary',
    noun: 'practice',
    icon: 'paw',
    tagline: 'Routine bookings and FAQs handled so your clinical team can focus.',
    pains: ['Phones ring through consults', 'Repeat prescription requests', 'Out-of-hours worry calls'],
    wins: ['Books vaccinations and check-ups', 'Routes emergencies instantly', 'Takes repeat prescription requests'],
    demo: {
      business: 'Willow Vets',
      agent: 'Poppy',
      greeting: 'Hi, Poppy at Willow Vets 🐾 How can I help you and your pet today?',
      services: [
        { name: 'Annual Vaccination', price: '£58', duration: '15 min' },
        { name: 'Health Check', price: '£45', duration: '20 min' },
        { name: 'Nurse Clinic', price: '£25', duration: '15 min' },
        { name: 'Dental Check', price: '£40', duration: '20 min' },
      ],
      hours: 'Mon–Fri 8:00–19:00, Saturday 9:00–13:00. Out-of-hours cover via VetsNow.',
      address: '120 London Road, Hemel Hempstead.',
      prompts: ['My dog needs his booster', 'Can I order a repeat prescription?', 'My cat ate something toxic'],
      faqs: {
        prescription: 'Of course — tell me your pet’s name and the medication, and the team will have it ready within 48 hours.',
      },
      guardrail: {
        keywords: ['ate', 'toxic', 'poison', 'bleeding', 'collapsed', 'emergency', 'hit by'],
        reply:
          'This could be urgent — please call us straight away on 01442 000 000 so a vet can advise 🚩 I’ve also alerted the team. If we’re closed, our out-of-hours partner VetsNow is open 24/7.',
      },
    },
  },
  {
    id: 'fitness',
    name: 'Gyms & PT',
    noun: 'gym',
    icon: 'dumbbell',
    tagline: 'Class bookings, PT sessions and membership questions on autopilot.',
    pains: ['Trainers answering DMs between sets', 'Trial leads never followed up', 'Class waitlists by hand'],
    wins: ['Books intro sessions instantly', 'Follows up every trial lead', 'Answers membership questions'],
    demo: {
      business: 'Forge Strength Club',
      agent: 'Max',
      greeting: 'Hey! Max from Forge Strength Club 💪 What are you after?',
      services: [
        { name: 'Free Intro Session', price: 'Free', duration: '30 min' },
        { name: '1:1 PT Session', price: '£45', duration: '60 min' },
        { name: 'Reformer Pilates', price: '£18', duration: '50 min' },
        { name: 'Monthly Membership', price: '£49/mo', duration: 'Rolling' },
      ],
      hours: 'Mon–Fri 6:00–22:00, weekends 8:00–18:00.',
      address: 'Unit 4, Maylands Park, Hemel Hempstead.',
      prompts: ['Can I try a free session?', 'How much is membership?', 'Book me into Pilates tomorrow'],
      faqs: {},
    },
  },
  {
    id: 'clinics',
    name: 'Private Clinics',
    noun: 'clinic',
    icon: 'stethoscope',
    tagline: 'GP, physio, podiatry and more — booking without the hold music.',
    pains: ['Patients stuck in phone queues', 'Admin team stretched thin', 'Missed calls = missed revenue'],
    wins: ['Books the right clinician first time', 'Collects pre-appointment details', 'Never offers clinical advice'],
    demo: {
      business: 'Parkside Private Clinic',
      agent: 'Grace',
      greeting: 'Good day, this is Grace at Parkside Private Clinic. How can I help?',
      services: [
        { name: 'Private GP (20 min)', price: '£89', duration: '20 min' },
        { name: 'Podiatry', price: '£55', duration: '30 min' },
        { name: 'Blood Test Package', price: '£120', duration: '15 min' },
        { name: 'Travel Vaccines Consult', price: '£40', duration: '20 min' },
      ],
      hours: 'Mon–Fri 8:00–20:00, Saturday 9:00–14:00.',
      address: '2 Parkside Mews, Harpenden.',
      prompts: ['Can I see a GP today?', 'How much is a blood test?', 'Should I take antibiotics?'],
      faqs: {},
      guardrail: {
        keywords: ['should i take', 'antibiotic', 'dose', 'diagnos', 'symptom', 'medication'],
        reply:
          'I’m not able to give medical advice, but one of our GPs can — the next private GP appointment is today at 16:40. Shall I book it? If it’s urgent, please call 111, or 999 in an emergency.',
      },
    },
  },
];

export const ROTATING_NOUNS = ['salon', 'clinic', 'dental practice', 'spa', 'barbershop', 'studio', 'vet practice'];

export function getIndustry(id: string) {
  return INDUSTRIES.find((i) => i.id === id) || INDUSTRIES[0];
}
