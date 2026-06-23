// Version-controlled seed content for the Supabase-backed blog.
// Run `npm run seed:blog` (or POST /api/blog/seed) to upsert these into the
// blog_posts table. Supabase is the source of truth after seeding; this file is
// the initial content + a backup. Cover images: drop /public/blog/<slug>.png.

export interface SeedPost {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  author: string;
  publishedAt: string; // ISO date
  body: string; // markdown
}

const AUTHOR = 'The Resevia Team';

export const seedPosts: SeedPost[] = [
  {
    slug: 'ai-receptionist-for-hair-salons',
    title: 'AI Receptionist for Hair Salons: What It Is and Why It Pays for Itself',
    description:
      'A plain-English guide to AI receptionists for hair salons — what they do, how they book clients, and why they cost less than the bookings you currently miss.',
    keywords: [
      'ai receptionist for hair salons',
      'salon ai receptionist',
      'hair salon booking software',
      'virtual receptionist salon',
    ],
    author: AUTHOR,
    publishedAt: '2026-05-12T09:00:00.000Z',
    body: `If you run a hair salon, you already know the problem: the phone rings while you've got colour developing, both hands in someone's hair, and a client in the chair who has your full attention. You can't stop. So the call goes to voicemail — and most people who reach a salon's voicemail simply hang up and call the next salon on the list.

An **AI receptionist** fixes exactly this. Here's what it is, what it does, and how to think about whether it's worth it.

## What is an AI receptionist?

An AI receptionist is software that answers your salon's calls and messages automatically, in natural language, 24 hours a day. Think of it as a front-desk team member who never takes a break, never calls in sick, and can talk to ten people at once.

For a hair salon, a good AI receptionist will:

- **Answer the phone** when you can't, in a warm, on-brand voice
- **Reply to texts and WhatsApp messages** about availability and prices
- **Book appointments** straight into your existing calendar
- **Answer FAQs** — opening hours, parking, whether you do balayage, how long a treatment takes
- **Send reminders** so clients actually show up

## Why it pays for itself

The maths is simpler than most owners expect. Say your average client is worth £60 a visit and comes back six times a year — that's £360 a year, and far more over their lifetime. If your salon misses even a handful of new-client calls a week and half of those would have booked, you're losing thousands of pounds a year to unanswered calls alone.

An AI receptionist costs a fraction of that, and unlike a part-time receptionist it covers evenings, weekends and your busiest in-chair hours — the exact times calls go unanswered.

## "Will it sound like a robot?"

This is the number-one worry, and a fair one. Modern AI receptionists are trained on your services, your tone and your prices, so they sound like a polished member of your team rather than a generic phone tree. Clients get answers instantly instead of waiting on hold — which most people actually prefer.

## Getting started

You don't need to rip out your current booking system. The best setups sit on top of what you already use, capture the calls and messages you're currently missing, and book them in automatically.

If you'd like to see how it works for your salon, [join the Resevia founding-salon pilot](/waitlist) — free setup and your first month free.`,
  },
  {
    slug: 'how-to-never-miss-a-salon-booking-again',
    title: 'How to Never Miss a Salon Booking Again',
    description:
      'Missed calls are missed money. Here are seven practical ways salons can capture every booking — from text-back to 24/7 AI reception.',
    keywords: [
      'never miss a salon booking',
      'salon missed calls',
      'capture salon bookings',
      'salon phone system',
    ],
    author: AUTHOR,
    publishedAt: '2026-05-19T09:00:00.000Z',
    body: `Every missed call at a salon is a small, invisible loss. You never see the client who rang, got voicemail, and quietly booked somewhere else. Here's a practical checklist to make sure that stops happening.

## 1. Track how many calls you actually miss

You can't fix what you don't measure. Ask your phone provider for missed-call data, or just keep a tally for a week. Most owners are shocked — it's usually far more than they think, and it spikes during your busiest hours.

## 2. Set up missed-call text-back

The single highest-impact change. When a call goes unanswered, an automatic text fires back within seconds: *"Sorry we missed you! This is [Salon]. Can we help you book in?"* It turns a dead end into a live conversation and recovers bookings you'd otherwise lose.

## 3. Take bookings by text and WhatsApp

A huge share of clients would rather text than call — especially younger clients and anyone booking on a lunch break. If the only way to reach you is a phone call during opening hours, you're filtering out willing customers.

## 4. Be bookable after hours

People decide to book in the evening, on the sofa, scrolling their phone. If your line is dead until 9am, that impulse is gone by morning. After-hours booking captures it while it's hot.

## 5. Answer the common questions instantly

"How much is a full head of highlights?" "Do you have anything Saturday?" If these get a fast answer, they convert. If they sit unread for hours, they don't.

## 6. Reduce no-shows with reminders

Capturing the booking is only half the job — automated reminders make sure the client turns up, protecting the revenue you worked to win.

## 7. Let an AI receptionist handle all of the above

Doing each of these manually is a lot of admin. An AI receptionist does them automatically: answering calls and texts 24/7, replying to FAQs, booking into your calendar and sending reminders — without you lifting a finger.

That's exactly what Resevia does. [Join the founding-salon pilot](/waitlist) and never lose a booking to an unanswered phone again.`,
  },
  {
    slug: 'what-happens-when-salons-miss-calls',
    title: 'What Happens When Salons Miss Calls (The Real Cost)',
    description:
      "A missed call feels harmless in the moment. Here's what it actually costs your salon over a week, a month and a year — and how to plug the leak.",
    keywords: [
      'salon missed calls cost',
      'missed call revenue loss',
      'salon lost bookings',
      'why salons miss calls',
    ],
    author: AUTHOR,
    publishedAt: '2026-05-26T09:00:00.000Z',
    body: `A missed call doesn't feel like much. The phone rings, you're busy, it stops. No drama. But missed calls are the quietest, most expensive leak in most salons — and because you never meet the caller, the cost stays invisible.

Let's make it visible.

## What the caller does next

When someone rings a salon and gets voicemail, most don't leave a message. They hang up and call the next salon. Booking is an impulse, and a competitor is one tap away. The moment you miss the call, you're usually out of the running.

## The cost of a single missed booking

Run your own numbers, but here's a typical example:

- Average new-client visit: **£60**
- Times they return per year: **6**
- First-year value of one new client: **£360**

So a single missed new-client call isn't a £60 loss — it's closer to a £360 loss, and far more over that client's lifetime if they would have stayed with you.

## Scaling it up

Say you miss just **5 callable new clients a week**, and half of them would have booked:

- ~2.5 lost new clients per week
- ~10 per month
- ~120 per year

At £360 first-year value each, that's potentially **tens of thousands of pounds a year** walking out the door — silently.

## Why salons miss calls (it's not your fault)

You miss calls because you're doing your actual job: you're with a client, your hands are busy, you're mid-treatment. Hiring a full-time receptionist to cover every hour is expensive and often overkill for a small team. So the calls slip.

## How to plug the leak

You don't need a bigger team — you need the calls answered. The fastest fix is an AI receptionist that:

- Answers every call and message instantly, 24/7
- Texts back missed callers automatically
- Books clients straight into your calendar

That turns your biggest invisible leak into booked revenue. [See how Resevia does it](/waitlist) — founding salons get free setup and their first month free.`,
  },
  {
    slug: 'missed-call-text-back-for-salons',
    title: 'Missed-Call Text-Back for Salons: Turn Voicemails into Bookings',
    description:
      'Missed-call text-back is the simplest, highest-ROI tool a salon can add. Here is how it works and why it converts so well.',
    keywords: [
      'missed call text back',
      'salon text back',
      'missed call automation salon',
      'sms booking salon',
    ],
    author: AUTHOR,
    publishedAt: '2026-06-02T09:00:00.000Z',
    body: `If you only fix one thing about how your salon handles calls, make it this: **missed-call text-back**. It's cheap, it's automatic, and it recovers bookings you're currently losing without you doing anything.

## What is missed-call text-back?

It's a simple automation. When someone calls your salon and you can't pick up, the system instantly sends them a friendly text:

> *"Hi, sorry we missed your call! This is [Salon Name]. How can we help — are you looking to book in?"*

The caller can reply by text and carry on the conversation, even though no one was free to answer the phone.

## Why it works so well

- **Speed beats everything.** The text arrives within seconds, while the client is still holding their phone and still in booking mode.
- **Texting is low-friction.** Plenty of people would rather tap out a message than make a call. You're meeting them where they're comfortable.
- **It catches your busiest moments.** The calls you miss are usually during your busiest hours — exactly when you'd most like to capture the work.
- **It feels personal.** A prompt, warm reply signals a salon that's on the ball.

## Text-back alone vs. an AI receptionist

Basic text-back just sends a canned message and leaves you to reply manually later — better than nothing, but you're still doing the work, and slow replies still lose bookings.

A smarter setup uses an **AI receptionist** to actually hold the conversation: it answers the client's questions, checks availability, and books them in — automatically, day or night. You wake up to filled slots instead of a list of people to call back.

## The bottom line

Missed-call text-back is the closest thing to free money in salon operations: you're simply recovering demand you already generated. Pair it with an AI receptionist that can finish the booking, and almost no enquiry slips through.

[Resevia](/waitlist) does both out of the box — founding salons get free setup and their first month free.`,
  },
  {
    slug: 'how-to-reduce-no-shows-at-your-salon',
    title: 'How to Reduce No-Shows at Your Salon',
    description:
      'No-shows quietly drain salon revenue. Here are proven, low-effort ways to cut them — from smart reminders to easy rescheduling.',
    keywords: [
      'reduce salon no shows',
      'salon no show policy',
      'appointment reminders salon',
      'salon cancellations',
    ],
    author: AUTHOR,
    publishedAt: '2026-06-09T09:00:00.000Z',
    body: `A no-show is worse than a missed call. You've already won the booking, blocked out the time, maybe turned other clients away — and then no one walks in. The slot is gone and so is the money. Here's how to bring your no-show rate down.

## 1. Send reminders that actually get read

Email reminders get buried. Text and WhatsApp reminders get opened almost every time. A short, friendly reminder 24 hours before — plus a nudge on the morning of the appointment — dramatically cuts forgetfulness, which is the most common cause of no-shows.

## 2. Make rescheduling effortless

Many no-shows are really *un-rescheduled cancellations*. The client's plans changed, but cancelling felt awkward or fiddly, so they just didn't show. Give them a one-tap way to move their appointment and you'll convert silent no-shows into kept (rebooked) bookings.

## 3. Confirm with a quick reply

A reminder that asks for a simple *"Reply YES to confirm"* gets the client to actively commit. The small act of confirming makes them far more likely to turn up — and flags the ones who won't, so you can fill the slot.

## 4. Have a clear, fair deposit or cancellation policy

For high-value or long treatments, a small deposit aligns incentives without scaring clients off. State the policy kindly and clearly at the time of booking so there are no surprises.

## 5. Fill the gaps automatically

Even with all this, some cancellations will happen. The faster you know, the faster you can offer the slot to a waitlist or a recent enquiry — turning a hole in the day back into revenue.

## Let it run on autopilot

Doing reminders, confirmations and rescheduling by hand is exactly the admin that gets dropped on a busy day. An AI receptionist handles it automatically: it sends the reminders, takes the confirmations, manages reschedules and follows up on no-shows — protecting the bookings you've already earned.

[Resevia](/waitlist) does this for you 24/7. Founding salons get free setup and their first month free.`,
  },
  {
    slug: '24-7-booking-for-beauty-salons',
    title: '24/7 Booking for Beauty Salons: Capture After-Hours Clients',
    description:
      'Most booking decisions happen after you close. Here is why 24/7 booking matters for beauty salons and how to offer it without working nights.',
    keywords: [
      '24/7 salon booking',
      'after hours booking salon',
      'online booking beauty salon',
      'book salon anytime',
    ],
    author: AUTHOR,
    publishedAt: '2026-06-16T09:00:00.000Z',
    body: `Here's a pattern every salon owner should know: a large share of booking decisions happen in the evening — after dinner, on the sofa, phone in hand. By the time you open at 9am, that impulse has cooled, and the client has either booked elsewhere or forgotten entirely.

If your salon can only be booked during opening hours, you're missing your customers at the exact moment they want to book.

## Why after-hours matters more than you think

- **Evenings are prime booking time.** People sort out their week once the day's done — and that's when your line is dead.
- **Weekends drive demand.** Clients plan ahead on Sundays for the week. If you're closed, the booking goes to whoever *is* reachable.
- **Impulse fades fast.** "I should book my colour" is a fleeting thought. Capture it instantly or lose it.

## "But I can't answer the phone at 10pm"

You shouldn't have to. The point of 24/7 booking isn't that *you* are awake — it's that your salon is always *bookable*. There are a few ways to offer it:

- **Online booking pages** let clients self-serve, but only if they find the link and your availability is accurate.
- **An AI receptionist** goes further: it actually *talks* to clients over call, text and WhatsApp at any hour, answers their questions, and books them in — just like a great receptionist would, except at 10pm on a Sunday.

## What 24/7 reception looks like in practice

A client texts at 9:40pm: *"Do you have anything for a trim this Saturday?"* Instead of silence until morning, they get an instant, friendly reply, see the open slots, and book — all before they've put their phone down. You see the appointment in your calendar when you wake up.

## The takeaway

Being closed shouldn't mean being unbookable. Offering 24/7 booking captures the after-hours demand you're currently sleeping through — without you working a single extra hour.

[Resevia](/waitlist) keeps your front desk on 24/7. Founding salons get free setup and their first month free.`,
  },
];
