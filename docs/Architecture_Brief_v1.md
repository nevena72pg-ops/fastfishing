# FishWithLocals Architecture Brief

**Status:** Approved architecture  
**MVP destinations:** Bar and Budva, Montenegro  
**Product model:** Curated introductions between travelers and personally verified local fishing captains  
**Not a booking marketplace**

## 1. Product definition

FishWithLocals helps travelers discover and speak directly with carefully verified local fishing captains. It is built around authentic local experiences, personal trust, human stories, transparent pricing, direct captain communication, responsible fishing, marine conservation, and deliberate quality-led growth.

FishWithLocals introduces people. It does not manage bookings, availability, payments, or the trip itself.

## 2. Product principles

1. People choose captains, not boats.
2. Every published captain is personally verified.
3. Prices, inclusions, and expectations are clear.
4. Travelers speak directly with captains.
5. Captain personality is part of the product.
6. Responsible fishing is integral, not promotional decoration.
7. Local knowledge and real stories take priority over generic tourism content.
8. Administrators preserve editorial and verification quality.
9. Growth must not weaken trust or the platform’s character.
10. Technology supports the human relationship without replacing it.

## 3. Overall architecture

FishWithLocals begins as a modular monolith: one web application, one relational database, one administration area, one file-storage service, transactional email delivery, and clearly separated business modules.

### Public experience

Travelers can explore Bar and Budva as destinations, discover verified captains, learn about their personalities and values, review experiences and transparent prices, read local stories and responsible-fishing guidance, and start a conversation.

Public calls to action use human language:

- **Talk to the Captain**
- **Plan Your Day**
- **Start the Conversation**

“Inquiry” remains an internal operational term.

### Administration and captain participation

The administrator creates and edits profiles, reviews submissions, records verification, manages personality content, curates photography, publishes stories, maintains destinations, reviews inquiries, approves responsible-fishing claims, and publishes or archives profiles.

There is no full Captain Portal in the MVP. Captains may submit information or propose changes, but nothing changes a published profile automatically.

### Architectural qualities

- Server-rendered, mobile-first, and search-engine-friendly
- Privacy-conscious
- Human approval at every publishing boundary
- Auditable verification
- Structured data combined with editorial storytelling
- Operable by a small team
- Able to evolve without premature complexity

## 4. Recommended technology stack

| Layer | Recommendation |
|---|---|
| Application | Next.js App Router with TypeScript |
| Styling | Tailwind CSS with a custom visual system |
| Database | PostgreSQL through Supabase |
| Database access | Supabase client initially; Drizzle ORM optional |
| Administrator authentication | Supabase Auth |
| Images and documents | Supabase Storage |
| Email | Resend with React Email |
| Hosting | Vercel |
| Spam protection | Cloudflare Turnstile |
| Analytics | Plausible |
| Later testing | Vitest and Playwright |
| Source control and automation | GitHub and GitHub Actions |

Drizzle remains recommended for typed database access and migrations, but optional during initial implementation. If it adds complexity to a non-developer-led MVP, the application can use the Supabase client behind a controlled database-access layer.

The initial setup establishes clean boundaries for future tests without adding full testing infrastructure. Basic tests are added after the first captain, destination, and conversation flows work. Full browser testing follows when these journeys stabilize.

No map provider is required initially. Destination and marina pages use external location links. Embedded maps remain optional after user feedback.

Sensitive operations execute server-side. Public and private storage are separated. Verification documents are never publicly accessible. Administrator access uses multi-factor authentication. Forms receive server-side validation, rate limiting, and bot protection. Personal data is collected and retained only when operationally necessary.

## 5. Conceptual folder structure

- public: images, icons, and fonts
- src/app/(public): homepage, captains, destinations, stories, responsible fishing, how it works, become a captain, privacy, and terms
- src/app/(admin): captains, submissions, inquiries, verification, stories, settings, and administrator login
- src/app/api: inquiries, captain submissions, and webhooks
- src/features: captains, captain personality, experiences, destinations, inquiries, submissions, verification, responsible fishing, and stories
- src/components: interface, layout, and genuinely shared components
- src/server: authentication, database, email, storage, validation, and security
- src/emails: captain notification, traveler acknowledgment, and submission notification
- src/config, src/types, and src/styles
- supabase: migrations and initial data
- docs: architecture, voice and tone, content guidelines, verification, responsible fishing, and operations
- tests: introduced after the first working pages

Routes remain thin. Business rules belong to feature and server modules. Database access stays behind one boundary so the Supabase client and Drizzle can be exchanged without rewriting the application.

## 6. Database model

### Destinations and marinas

Bar and Budva are editorial destinations, not map coordinates. Each contains its story, fishing character and seasonality, marina guidance, practical visitor information, responsible-fishing context, SEO information, and publication state.

Each marina or departure point has a destination, name, description, access guidance, external location link, optional future coordinates, and practical notes.

### Captains

The central entity contains identity, public profile name, portrait, introduction, personal story, experience, local knowledge, languages, destinations, private contact details, public contact preference, verification status, publication status, and last verified date.

Suggested lifecycle: **Draft → Under review → Verified → Published → Archived**

### Captain personality

A one-to-one structured personality area contains:

- Coffee ritual
- Music on board
- Sense of humour
- Cooking or food interests
- Favourite fish
- Favourite season
- What happens when the fish are not biting
- What happens if no fish are caught that day
- One thing the captain wants guests to remember

The first no-catch question reveals how the captain adapts during a slow day. The second reinforces that the value lies in the sea, learning, conversation, food, place, and shared experience—not only the catch. Answers come from real interviews and are presented conversationally.

### Captain destinations and experiences

Captain destinations connect captains to Bar, Budva, or both and record the primary destination, local knowledge, typical departure marina, and active state.

Each non-bookable experience contains a title, plain-language description, duration, group-size guidance, price, currency, pricing unit, inclusions, exclusions, fishing methods, typical species, season guidance, departure point, responsible-fishing notes, and publication status.

Every experience includes **Who is this experience for?**, such as beginners, families, experienced anglers, couples, or kids welcome.

Prices are stored as integer minor units with an explicit currency. There are no availability, reservation, or checkout records.

### Supporting entities

- Vessels: name, type, length, capacity, safety summary, registration verification, description, and photography. A vessel supports the captain profile and is never the primary discovery object.
- Languages: reference list and captain-language relationships.
- Responsible-fishing practices: platform principles, captain commitments, review status, verification dates, and private notes.
- Verification checks: private append-only identity, interview, reputation, credentials, vessel, safety, insurance, and responsible-fishing records.
- Media: file reference, alt text, caption, credit, order, cover status, and publication permission.
- Stories: local people, fishing culture, conservation, food, places, and responsible fishing, related to multiple captains and destinations.
- Inquiries: captain, optional experience, traveler contact information, approximate period, group size, experience level, message, consent, delivery state, and retention dates.
- Captain submissions: new-captain or proposed-change information, consent, review state, and administrator notes; never applied automatically.
- Email delivery: provider identifiers, recipients, states, failures, and timestamps.
- Administrator audit log: publishing, verification, responsible-practice approval, private-document access, and inquiry access or deletion.

Internal inquiry lifecycle: **Received → Delivered → Acknowledged → Closed**. These are never shown as booking states.

## 7. Development roadmap

### Phase 0: Product and operating foundations

Verification criteria, responsible-fishing standards, captain interview and personality questionnaire, Voice & Tone Guide, photography and publication consent, inquiry procedure, privacy and retention rules, initial captain selection, and real content for the first captain and destination.

### Phase 1: Content model and visual direction

Define the brand, mobile navigation, homepage, destination and captain profiles, personality presentation, experiences, pricing, responsible fishing, conversation flow, and administration workflow. The design must communicate “choose a person, not a boat” without resembling a booking marketplace.

### Phase 2: First working public pages

Build the homepage, Bar destination, one complete captain, experience descriptions, responsible-fishing page, how it works, marina links, essential legal pages, and mobile accessibility. Basic tests begin after this vertical slice works.

### Phase 3: Database and administration

Add Supabase, administrator authentication, captain and personality management, destinations, marinas, experiences, prices, verification, media permissions, publishing states, and basic auditing.

### Phase 4: Conversation and submission workflows

Add traveler and captain forms, validation, spam protection, persistence before email, notifications, delivery tracking, administrator review, consent, retention, and direct communication handoff.

### Phase 5: Complete Bar and Budva

Complete both destinations, selected captains, marina guidance, personality interviews, original photography, transparent prices, responsible-fishing reviews, and stories about local people, fishing culture, food, places, conservation, and responsible fishing.

### Phase 6: Quality and launch preparation

Review devices, browsers, accessibility, email, administration, security, permissions, private documents, SEO, performance, backups, analytics, monitoring, privacy, legal requirements, production email, and the domain.

### Phase 7: Friends & Family

Invite a very small number of trusted people to use the platform naturally and provide brutally honest feedback. Resolve important confusion and trust problems before public exposure.

### Phase 8: Controlled pilot

Invite a limited audience, monitor inquiry relevance, speak with captains, check pricing comprehension and response reliability, monitor spam and delivery failures, and improve weak content and procedures.

### Phase 9: Post-pilot decisions

Evaluate additional captains, maps, a limited Captain Portal, multilingual content, saved captains, advanced inquiry management, and more Montenegrin destinations only with evidence.

Expansion must be driven by trust quality, operational capacity, and preserving the character of the platform—not by signup or listing volume.

## 8. MVP inclusions

- Mobile-first public website
- Bar and Budva destination pages
- Carefully verified captain profiles and personality profiles
- Experience descriptions, transparent pricing, and “Who is this experience for?” guidance
- Vessel and safety summaries
- Responsible-fishing principles and commitments
- Human calls to start a captain conversation
- Captain submission and change-request forms
- Protected manual administration
- Verification records and private document storage
- Destination, marina, story, and media management
- Email delivery tracking
- Voice and tone documentation
- Privacy, security, consent, and retention controls
- Privacy-friendly analytics
- Friends & Family testing and controlled pilot

A sensible target is **2–4 excellent captains per destination**, but this is not a quota. Fewer complete, trusted profiles are better than diluted standards.

## 9. MVP exclusions

The MVP excludes:

- Reservations, availability, payments, deposits, refunds, commissions, dynamic pricing, discounts, and booking language
- Ratings, reviews, rankings, popularity signals, sponsored placement, price-first sorting, artificial urgency, and algorithmic recommendations
- Traveler accounts, captain accounts, a full Captain Portal, self-publishing, and automated onboarding
- Live chat, internal messaging, chatbots, automated negotiation, and messaging automation
- Destinations outside Bar and Budva and thin destination pages
- Embedded maps initially, radius search, geolocation, advanced search, complex filtering, and boat-first discovery
- Automatic publication, invented or AI-generated captain stories, scraped content, generic copy, and unverified claims
- Catch or weather guarantees, real-time marine-safety advice, claims that verification removes all risk, and exposed private data
- Forums, comments, social feeds, traveler galleries, a separate CMS, and newsletters without editorial capacity
- Microservices, a separate backend, GraphQL, Redis, event streaming, Kubernetes, native apps, premature testing complexity, premature Drizzle adoption, and recommendation engines
- Advertising pixels, cross-site tracking, traveler profiling, default session replay, behavioral-data sharing, and metrics designed to maximize screen time

## 10. MVP success criteria

The MVP succeeds if travelers choose captains based on character, trust, and fit; prices and expectations are understood; travelers start relevant conversations; captains receive useful introductions and respond reliably; personality improves confidence; responsible fishing feels inseparable from the experience; the administrator preserves quality without operational strain; Bar and Budva feel specific and authentic; and the platform retains its character as it grows.

## Final principle: Intentional simplicity

FishWithLocals follows the principle of **intentional simplicity**.

Every new feature must answer two questions before it is accepted:

1. Does it make the guest’s day better?
2. Does it help preserve the character of FishWithLocals?

If the answer to either question is no, the feature belongs in the **Icebox** until proven otherwise.
