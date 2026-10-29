# Part 3 - Multi-Product Platforms, Business Websites, Concept Brands, Infrastructure

Conventions for this part: "Portfolio" means https://agentix-portfolio.vercel.app/ (planned hosted URL). Portfolio demos are "Safe demo - fictional data, all actions simulated". Labels: Verified / Partially verified / Unverified / Unavailable. No credentials, keys or real personal data appear here. Evidence was gathered on 2026-10-28/29 from local source folders and public pages loaded in Chrome (no logins).

---

## Multi-Product Business Platforms

### REDUX Platform (by Eurobrass)
**Slug:** `redux` · **Also known as:** REDUX - Bath Restorations by Eurobrass · **Category:** Multi-Product Business Platforms / B2B restoration operations · **Status:** In development (active build, client demo deployment live) - Verified
**Client / owner:** Eurobrass (New Delhi) · **Local folder:** `D:\Agentix Project\Redux` · **Last activity:** 2026-10-20 (106 commits)

#### Spoken introduction
REDUX is a platform we built for Eurobrass's bathroom-fittings restoration service. It connects a public website, a lead CRM, a staff portal, an offline Android survey app, a customer portal and an admin console, so one hotel's enquiry can be followed all the way from first contact to invoice and warranty. The link we share is a safe demo with sample data.

#### Quick overview
REDUX restores worn hotel and home bath fittings (taps, mixers, showers) instead of replacing them. The platform removes the hand-offs between enquiry, site survey, quotation, approval, job, invoice and after-care by keeping one record from start to finish. It is aimed at the REDUX sales/care team, surveyors, the owner, and the hotel or home-owner customers. The deployed link is a demo deployment: WhatsApp, OTP and payments are simulated.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| Public website | https://redux-demo-iota.vercel.app/ | Safe demo environment | Banner says "Demo - sample data. WhatsApp, OTP and payments are simulated." |
| Demo outbox | https://redux-demo-iota.vercel.app/demo/outbox | Safe demo environment | Shows every simulated WhatsApp message with its buttons |
| Staff login | https://redux-demo-iota.vercel.app/staff/login | Login required (demo personas) | One-click persona cards exist on the demo; credentials not reproduced here |
| Customer portal login | https://redux-demo-iota.vercel.app/portal/login | Login required (demo) | Phone + code; the demo shows the code on screen |
| Book assessment form | https://redux-demo-iota.vercel.app/book-assessment | Safe demo environment | Public enquiry form |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/redux/overview | Safe demo - fictional data | Tabs: /overview /walkthrough /how /screens /tech |
| Portfolio walkthrough | https://agentix-portfolio.vercel.app/#/demo/redux/walkthrough | Safe demo | Modules below |
| Module: journey | https://agentix-portfolio.vercel.app/#/demo/redux/walkthrough/journey | Safe demo | Enquiry to warranty as one animated pipeline |
| Module: leads | https://agentix-portfolio.vercel.app/#/demo/redux/walkthrough/leads | Safe demo | Lead Kanban with city routing |
| Module: survey-app | https://agentix-portfolio.vercel.app/#/demo/redux/walkthrough/survey-app | Safe demo | Mobile surveyor app |
| Module: quotes | https://agentix-portfolio.vercel.app/#/demo/redux/walkthrough/quotes | Safe demo | Quote built from survey |
| Other module ids | website, inbox, portal, jobs, invoices, payments, campaigns, rate-card, catalog, stock, outbox | Safe demo | `/#/demo/redux/walkthrough/<id>` |

#### Target users & business problem
Hotels, home owners and dealers who want fittings restored; and the Eurobrass/REDUX team (care executives, surveyors, super admin). Before, enquiry-to-invoice crossed about five hand-offs in separate tools, so jobs stalled and customers chased for updates.

#### Features (complete inventory)
**1. Public website (Verified).** Home with promise ("Your existing fittings may have more service life ahead"), before/after, three services (restore function, restore finish, improve water efficiency), process, "Why REDUX", pages for hotels, homes, work/case studies, process, how-we-restore, assessment, demo programme, referral programme, dealers/dealer enquiry, products catalogue (Eurobrass 2025 range, about 469 products per DEMO-GUIDE, browsed by type/series/code search, finishes, "Assess this fitting"), contact, legal pages, floating WhatsApp button. Enquiry form records DPDP consent (marketing consent separate and unticked by default). Evidence: live page text and links, `app/(marketing)/*`, DEMO-GUIDE.md.
**2. Lead CRM (Verified in code + guide).** Leads arrive from the website form, and the build includes Meta lead-ads, Google Ads and WhatsApp intake (webhook handlers in `lib/webhooks`, `lib/integrations/meta-graph.ts`; these are simulated in the demo). Leads are routed by city to the right care executive, get a 1-hour call-back SLA timer, call logging with outcomes, and a status flow (New, Contacted, Survey booked, Quoted, Won, Lost). B2B qualification: lead scoring tiers A/B/C with a 150 km service-area rule, tier x distance table and a "test a lead" tool. Evidence: `app/staff/(shell)/leads`, supabase migrations `leads`, `scoring`, `profiling`.
**3. WhatsApp inbox and outbox (Verified, simulated).** Staff inbox with a 24-hour customer-service window; every outbound template message appears in the demo outbox with buttons. Utility templates are not offered for campaigns (they would be billed as marketing). Evidence: DEMO-GUIDE, `app/staff/(shell)/inbox`, `app/demo/outbox`.
**4. Survey booking and surveyor app (Verified).** Care executive finds a free surveyor (same city first, least busy), double-booking in a slot is blocked, customer gets a WhatsApp confirmation. The Android surveyor app (Expo SDK 57, in `mobile/`) lets the surveyor check in with GPS (poor accuracy flagged, not blocked), add rooms and fittings (type, brand, finish, condition), take four mandatory photos (front, side, top, close-up), choose a recommendation and see three prices live (REDUX price, new Eurobrass, market replacement) and "customer saves". It works offline: every write goes through an outbox, and a local photo is deleted only after the server confirms it exists. Evidence: `mobile/src/*`, CLAUDE.md rules 7-8, DEMO-GUIDE Act 3. Limitation: run via Expo Go on a phone in the demo.
**5. Self-assessment (B2B) and demo programme (Verified in guide).** Customers can photograph their own fittings from the portal; staff price it and create a quotation within a 24-hour target. A free single-fitting demo can be proposed, must be approved by the super admin, is scheduled as a no-quotation, never-invoiced demo job, and tracks cost and conversion. Evidence: DEMO-GUIDE section 4, migrations `self_assessment`, `demos`.
**6. Quotations (Verified).** Builder pulls every line from the survey (nothing re-typed), tax split, market total and "You save"; discounts above 5% need super-admin approval; A4 preview and print/PDF (Gotenberg service for PDFs); issuing freezes validity and terms and fingerprints the document; sent on WhatsApp with a "View and approve" button. Rate card is versioned: an active version is frozen and changes create a new version so old quotes never re-price. Evidence: `app/staff/quotes`, `docker/gotenberg`, migration `rate_cards_assessments`, `quotations`.
**7. Customer portal (Verified).** Phone + OTP sign-in (code shown on screen in demo). Pages: quotes (approve with an OTP, which records who/when/which document and converts the prospect into a customer, marks the lead Won and opens a job in one transaction), jobs, invoices (pay now), warranty cards, service requests, fittings, history ("request again"), reports, team, referrals, privacy, self-assessment. Evidence: `app/portal/(app)/*`.
**8. Jobs and operations (Verified).** Job board by room through stages: removal and pickup, at Eurobrass, quality check, refit and test, handover. Each stage sends a WhatsApp update. Rooms can be blocked (for example waiting on civil work) with the delay clock stopped; room board for meetings with the hotel; handover checks (no leaks, operates smoothly, finish as promised) then warranty cards are generated. Evidence: `app/staff/(shell)/jobs`, DEMO-GUIDE Act 6.
**9. Invoices and payments (Verified, simulated payments).** Gap-free GST numbering, CGST/SGST or IGST by place of supply. Above 50,000 rupees the invoice routes to bank transfer (avoids a 2% card fee), below it a payment link. Payments are reconciled against invoices, receipt sent on WhatsApp. Approved quotations, quote approvals and invoices are immutable (versioned or credit-noted). Razorpay is the planned/configured gateway; in the demo payment is simulated. Evidence: CLAUDE.md stack and rules, `lib/actions/invoices.ts`, migration `invoices`.
**10. Service requests and after-care (Verified).** Customer raises a request from a warranty; staff see acknowledge-by and resolve-by clocks (acknowledge, start, resolve).
**11. Accounts, referrals, campaigns (Verified in guide).** Account 360 (lifetime billed, next action, requirements, timeline, work and money, demos, referrals); referral codes and links with pre-approved 5% first-order discount for referred businesses and a credit ledger; campaigns to lost leads only for contacts with marketing consent (the count shown equals the number sent; STOP withdraws consent; scheduler checks every 5 minutes); follow-up cadences per tier. Evidence: migrations `accounts`, `referrals`, `outreach`.
**12. Admin console (Verified).** Dashboard (leads, conversion, quoted value, rooms at factory, cost per won job, leads by source), reports with CSV export (tiers and sources, assessments, demos, people, accounts, referrals, campaigns, products), rate card, catalog import from spreadsheet, stock with low-stock alerts and movement ledger, audit log, privacy (DPDP consent ledger and data requests), integrations health (Meta, WhatsApp, Google Ads, Razorpay), discount approvals, lead scoring settings.

#### Key workflows (end to end)
1. A hotel submits the website form (consent recorded) and a lead appears with an SLA timer for the Delhi care executive; an enquiry WhatsApp goes out.
2. The executive logs the call, books a free survey and picks a surveyor; confirmation WhatsApp sent.
3. The surveyor checks in, records fittings and four photos each, submits (works offline, syncs later).
4. A quotation is created from the survey, discount approval if above 5%, issued and sent.
5. The customer approves with an OTP in the portal; lead becomes Won and a job is created.
6. The job moves through stages with WhatsApp updates; rooms can be blocked and unblocked; handover issues warranty cards.
7. An invoice is raised and issued; the customer pays; receipt and (for referred hotels) referral credit follow.
8. After-care: warranty cards and service requests with SLA clocks.

#### User roles & permissions
Verified enum in code: `super_admin`, `cc_exec` (care executive), `surveyor`, `customer`. Super admin approves discounts and demos and sees admin settings; care executives own leads, calls, surveys, follow-ups and service requests (demo personas: one Delhi, one Gurugram executive); surveyors use the web (and the Android app) for their visits and quotations; customers see only their own quotes, jobs, invoices and warranty (row-level security on every table).

#### Technical architecture & integrations
Next.js 16 App Router and React 19, Tailwind v4, shadcn/ui, TanStack Table/Query, react-hook-form + Zod. Supabase (Postgres, Auth, Storage; Mumbai region) with row-level security on every table, pgmq + pg_cron queue, a separate worker process (`worker/` with notification, webhook and CAPI processors), Gotenberg for PDFs, Expo SDK 57 Android app, Razorpay and Meta Cloud API (direct, no BSP) and MSG91 for OTP SMS as the intended integrations. Production target: Docker on a Mumbai VPS via Coolify; the demo is on Vercel (`vercel.json` region bom1). Env config is in `.env.local` (names only; never in the repo). Webhook rule: verify raw body, persist, return 200 fast, process in the queue; Google Ads webhook must never get a 4XX. Money is stored as numeric and shown in Indian grouping. Evidence: CLAUDE.md, package.json, migrations (33 files), `worker/`, `mobile/`. Not confirmed: whether live Meta/WhatsApp/Razorpay are connected in any production environment (the tracker's phase 0 shows Meta App Review, WABA, DLT and Razorpay KYC still TODO).

#### Business value & example scenarios
Removes re-typing between survey, quote, job and invoice; makes SLA, discount and approval rules enforceable; gives customers self-service visibility. Scenario: "Riverside Heritage Hotel" in Delhi enquires on the website, is surveyed on site by an offline app, receives a quote that shows it saves money versus replacing, approves with an OTP, and sees its rooms progress on a board.

#### Planned / in progress (not live)
Per the task tracker (last updated 2026-09-29) Phase 0 mobilisation items are open: Meta Business Verification and App Review, WhatsApp number/WABA, DLT registration, Razorpay KYC, production Supabase project, VPS/Coolify, Sentry/uptime, blueprint sign-off. Branch protection on main is blocked. The client site uses the Eurobrass office phone and email temporarily and some imagery is generated and labelled illustrative.

#### Example visitor questions & answers
- **What is REDUX?** A restoration service by Eurobrass; our platform connects the website, lead CRM, staff portal, surveyor app, customer portal and admin.
- **Can I see a demo?** Yes: https://redux-demo-iota.vercel.app/ (safe demo) or the portfolio walkthrough https://agentix-portfolio.vercel.app/#/demo/redux/walkthrough.
- **Are messages and payments real?** No. In the demo, WhatsApp, OTP and payments are simulated; messages show in the demo outbox.
- **Does the surveyor app work without internet?** Yes, writes are queued and photos are only deleted locally after the server confirms them.
- **How are leads routed?** By city to a care executive, with a 1-hour call-back timer.
- **How does the customer approve a quote?** In the customer portal with a one-time code; this records the evidence and opens the job.
- **Who sees what?** Four roles: super admin, care executive, surveyor, customer, enforced with database row-level security.

#### Related projects
Eurobrass CRM (`eurobrass-crm`) is a separate dealer/manufacturing CRM for the same company; REDUX is the restoration service. Eurobrass corporate site (`eurobrass-site`) is the foundry brand page.

#### Verification notes
Verified: DEMO-GUIDE.md, CLAUDE.md, tracker, package.json, folder structure, migrations list, live homepage text and links. Not logged into the demo staff or portal. Not verified: live third-party integrations, number of catalog products on the live demo (taken from guide). Missing: confirmation which integrations are live outside the demo.

---

### Your Hair Company (YHC)
**Slug:** `yhc` · **Also known as:** YHC · **Category:** Multi-Product Business Platforms / doctor-led hair D2C · **Status:** Live site; platform backend in development (demo-mode prototype) - Partially verified
**Client / owner:** Your Hair Company (a product of Santure AI Private Limited, per site footer) · **Local folder:** `D:\Agentix Project\yhc-platform` · **Last activity:** 2026-10-27 (39 commits)

#### Spoken introduction
Your Hair Company is a doctor-led hair care brand. Visitors take a free guided 3D scalp scan with their phone, book a 30-minute video consult with a dermatologist for 500 rupees, and a doctor decides whether a treatment plan is needed. We built the website, shop, doctor portal, sales CRM and guarantee tracking around that journey.

#### Quick overview
The brand's rule is "scalp first, medicine only if it helps". The platform covers a cinematic public site, a scan-to-booking funnel, a doctor portal, a sales CRM, a customer account with plan progress, an admin area, and a tracked money-back guarantee. The code currently runs in an in-memory DEMO_MODE with a role-switcher at `/demo`; the production phases (real database, payments, messaging) are logged as not yet built.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| Website | https://yourhaircompany.com/ | Production (real business - do not submit forms or book) | Public marketing site |
| Plans | https://yourhaircompany.com/plans | Production | 1, 2, 3 month plans |
| Guarantee | https://yourhaircompany.com/guarantee | Production | Conditions listed |
| Doctor | https://yourhaircompany.com/doctor-tyagi | Production | Doctor profile |
| Customer account | https://yourhaircompany.com/account | Login required | Not accessed |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/yhc/overview | Safe demo - fictional data | |
| Portfolio walkthrough | https://agentix-portfolio.vercel.app/#/demo/yhc/walkthrough | Safe demo | |
| Module: scan | https://agentix-portfolio.vercel.app/#/demo/yhc/walkthrough/scan | Safe demo | Scan funnel |
| Module: book | https://agentix-portfolio.vercel.app/#/demo/yhc/walkthrough/book | Safe demo | Slot and payment |
| Module: consult | https://agentix-portfolio.vercel.app/#/demo/yhc/walkthrough/consult | Safe demo | Doctor writes prescription |
| Module: sales-leads | https://agentix-portfolio.vercel.app/#/demo/yhc/walkthrough/sales-leads | Safe demo | Sales Kanban |
| Other module ids | site, account, shop, doctor-calendar, patients, followups, revenue, care, guarantee, admin-orders, catalog, audit | Safe demo | `/#/demo/yhc/walkthrough/<id>` |

#### Target users & business problem
People with hair loss who distrust generic products and want a doctor, a plan and follow-through; plus the doctor, sales/care team and admins. The platform replaces scattered booking, prescribing, sales follow-up and guarantee spreadsheets.

#### Features (complete inventory)
**1. Public site (Verified live).** Cinematic scroll-story home (Lenis smooth scroll, pinned hero, scroll-scrubbed films, WebGL light per PROGRESS), pages: Science, How it works, Results, Plans, Guarantee, Doctor (Dr. Anil Tyagi, dermatologist), FAQs, hair concerns (receding hairline, crown thinning, dandruff/scalp), products, journal/blog, about, contact, and legal pages (privacy, terms, refund, shipping, guarantee, medical disclaimer, grievance officer).
**2. Free 3D scalp scan funnel (Verified).** Name + mobile + consent, then up to 7 guided photos (hairline left/right, top, parting, crown, back) with on-screen guidance, result with reasons, and "a first check, not a diagnosis - the doctor decides". Evidence: live text; `src/components/journey/scan`; PROGRESS 2026-10-10 (7 guided zones). Limitation: in demo mode the scan result is simulated.
**3. Consultation booking (Verified).** Journey: details, scan, assessment, health form, slot selection and 500-rupee payment ("Razorpay (demo)" in demo), then portal and consult room route `/consult/[appointmentId]`. Availability engine in `src/lib/domain`.
**4. Plans and products (Verified live).** Three products, each in men's and women's packs: Hair Regrowth Solution (prescription only), Hair Nourishing Tablets, Hair Regrowth Capsules. Plans chosen after consultation: 1 month 5,999, 2 months 10,999, 3 months 14,999 (prices include GST per site); 500-rupee consult fee credited if bought within 7 days; the 3-month plan carries the guarantee. Prices are as printed on the live site and may change.
**5. Money-back guarantee (Verified live + code).** Conditions: use the prescribed plan for 3+ months without a break, reply to 75% of weekly check-ins, send monthly photos, join the follow-up consult, claim within 30 days of finishing; a doctor checks. Guarantee tracking pages exist for doctor, sales and admin (`src/app/doctor/guarantee`, `admin/guarantee`).
**6. Doctor portal (Verified in code, demo).** Availability, calendar, consult room, patients (profiles), prescriptions/plan, follow-ups, guarantee, revenue. Doctor and admin roles require MFA (aal2) at the database level.
**7. Sales CRM (Verified in code, demo).** Leads Kanban (new, contacted, interested, consult suggested, link sent and so on), tasks, care queue, performance; lead created automatically from scan/booking.
**8. Customer account (Verified in code).** Consultations, orders, plan progress, progress photos, scan, guarantee, support, profile.
**9. Admin (Verified in code).** Appointments, catalog, content, customers, guarantee, jobs, messaging templates, orders, settings, users, audit.
**10. WhatsApp/refills (Partially verified).** WhatsApp templates and reorder/refill logic exist in docs (`08_Messaging_Templates.md`) and domain code (reorder guard); live WhatsApp sending is not confirmed.

#### Key workflows (end to end)
1. Visitor starts the free scan, takes guided photos and sees a first result. 2. Books a 30-minute video consult and pays 500 rupees. 3. Doctor reviews history and photos, consults, and prescribes only if treatment can help. 4. Plan sent on WhatsApp, customer buys (consult fee credited within 7 days). 5. A sales lead is created and tracked; care follow-ups and weekly check-ins are scheduled. 6. Guarantee eligibility is tracked; claims are reviewed by a doctor. 7. Refills prompted before the plan ends.

#### User roles & permissions
Verified enum: `customer`, `doctor`, `sales`, `ops`, `admin`. Doctor and admin need MFA. Staff roles are granted by an admin (new auth users default to customer).

#### Technical architecture & integrations
Next.js 16.3 App Router, React 19, Tailwind 4, shadcn/ui, Lenis, Framer-style scroll scenes, Supabase (hosted `yhc-dev`, Mumbai) schema with RLS (single migration), Zod, pino logging, Vercel hosting. Intended integrations per README/TRD: Razorpay, WhatsApp (BSP/Meta Cloud API), MSG91, Resend, LiveKit (video), Google Calendar, Shiprocket. The demo store is in memory (single process; not suitable for serverless; resets on restart); demo access gate and signed sessions exist. Evidence: README, PROGRESS.md, package.json.

#### Business value & example scenarios
Turns a cold visitor into a booked, paid consult and a tracked plan with fewer manual follow-ups. Scenario: "Aarav Rao" scans his hairline at home, books a consult, receives a 3-month plan, and sees his day-30 photo check due in his account.

#### Planned / in progress (not live)
PROGRESS.md marks phases 01-12 (data layer, OTP/catalog/checkout, booking, doctor portal, recommendation, CRM, messaging, fulfilment, account, admin, hardening) as not started as production work; open client inputs include guarantee terms, product regulatory categories, refund rules, WhatsApp provider, Razorpay keys, doctor photos/registration number.

#### Example visitor questions & answers
- **How does it work?** Free scan, doctor consult, plan only if it helps.
- **How much is a consult?** 500 rupees for 30 minutes on video (per the site).
- **Is there a guarantee?** Yes for the 3-month plan, with listed conditions.
- **Can I see a demo?** https://agentix-portfolio.vercel.app/#/demo/yhc/walkthrough (the live site is a real business; please do not submit forms).
- **Is the scan a diagnosis?** No, the site says it is a first check and the doctor decides.
- **Who is the doctor?** The site presents Dr. Anil Tyagi, a dermatologist.

#### Related projects
Skinwise (`skinwise`) is a similar D2C concept for skin with an AI scan; YHC is doctor-led with video consults.

#### Verification notes
Verified: PROGRESS, README, package.json, folder structure, live public pages. Not accessed: `/demo` role switcher on production (not probed), account area. Unclear: whether the live site is running demo mode or real backends. Missing: confirmation of production data backend status and WhatsApp integration.

---

### Skinwise
**Slug:** `skinwise` · **Also known as:** myskinwise.com · **Category:** Multi-Product Business Platforms / skin-concern D2C · **Status:** Live - Verified
**Client / owner:** Skinwise (site footer: Razorbill Private Limited) · **Local folder:** `D:\Agentix Project\myskinwise` · **Last activity:** 2026-10-28

#### Spoken introduction
Skinwise is a skincare brand whose site lets you answer a guided skin check, upload a photo for an AI skin scan, or chat with a text assistant called Dr. Vivek. Every routine is reviewed by a real Skinwise expert. Note that the voice agent was removed from the site on 28 October 2026, so the assistant is text-only now.

#### Quick overview
Skinwise guides visitors from concern to a safe routine: a rules-based quiz and recommendation engine with safety exclusions, an AI photo scan, a grounded text assistant in 12 Indian languages, expert consultations, and a catalogue with orders placed through WhatsApp. An internal workspace lets experts review scans, leads and consultations.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| Home | https://myskinwise.com/ | Production (real business) | Hindi/English toggle |
| Skin Check | https://myskinwise.com/skin-check | Production | Guided questions |
| Skin Analyzer | https://myskinwise.com/skin-check/analyzer | Production | Photo upload, needs consent |
| Assistant | https://myskinwise.com/assistant | Production | Text chat; /voice redirects here (301) |
| Formulations | https://myskinwise.com/products | Production | 13 products listed live |
| Consultation lookup | https://myskinwise.com/consultation | Production | Reference + phone |
| Admin | https://myskinwise.com/admin/login | Login required | Not accessed |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/skinwise/overview | Safe demo - fictional data | No voice module by design |
| Module: quiz | https://agentix-portfolio.vercel.app/#/demo/skinwise/walkthrough/quiz | Safe demo | Routine with caution flags |
| Module: scan | https://agentix-portfolio.vercel.app/#/demo/skinwise/walkthrough/scan | Safe demo | Mocked scan scorecard |
| Module: assistant | https://agentix-portfolio.vercel.app/#/demo/skinwise/walkthrough/assistant | Safe demo | Chat with Dr. Vivek |
| Other module ids | site, products, consultation, admin-leads, admin-orders, admin-consults | Safe demo | |

#### Target users & business problem
Shoppers overwhelmed by skincare choice or worried a product will not suit them (acne, pigmentation, dark circles, dryness, oily skin, scars). The brand team gets structured leads instead of loose chats.

#### Features (complete inventory)
**1. Concern pages and content (Verified).** Pigmentation, acne, acne scars, dark circles, oily skin, dry skin, other issues, plus concerns, skin types, ingredients, learn, about, contact, legal pages. English and Hindi.
**2. Skin Check quiz (Verified).** One question per screen (17 questions migrated from three older quizzes), required "why we ask" explainer, server-side validation, rules-based recommendation engine over the brand's real catalogue, never an LLM. Hard safety exclusions (pregnancy, sensitive skin) and doctor escalation; result is explicitly non-diagnostic with WhatsApp hand-off. Evidence: `docs/status/stage-2-completion.md`, `lib/assessment`, `lib/recommend/engine.ts`.
**3. AI Skin Analyzer (Verified).** Camera/photo upload with explicit AI-analysis consent, quality check, MediaPipe face geometry on the client for marker placement, and an AI vision observation (currently an OpenAI vision call) marking visible features like shine, redness, tone, texture on the face; always labelled a starting point reviewed by an expert; photos retained 90 days then purged by a daily cron. A deterministic Python service (`skin-cv-service`, OpenCV/MediaPipe/ONNX, FastAPI) and a `/skin-check/scan` route exist but its docs say the OpenAI-based scan stays live until the new engine passes acceptance (Phase 1 scaffold). Evidence: `docs/REMOVAL_AUDIT.md`, `skin-cv-service/README.md`, `vercel.json` cron.
**4. Text assistant "Dr. Vivek"/Skinwise AI (Verified).** Grounded in product knowledge and the recommendation engine so it never invents products; supports 12 conversation languages (English, Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese); rate-limited; can be personalised with a consultation reference + phone; uses an OpenAI or Anthropic model depending on configured key. **Voice is no longer offered**: commit 7a6d463 on 2026-10-28 deleted the /voice route, API, STT/TTS/ElevenLabs code and every voice entry point; `/voice` permanently redirects to `/assistant`; microphone permission is disabled (camera kept for the scan).
**5. Formulations/products (Verified live).** 13 customised formulations across Cleanse, Treat, Eye care, Moisturise, Protect (for example anti-acne cleanser, depigmentation cream, acne gel, skin lightening gel, pigmentation serum, eye cream, day care cream, SPF-30, D-Tan pack) with real packaging and ingredient lists, product detail pages.
**6. Cart and checkout (Verified in code).** Review, contact details, then "Place order" opens WhatsApp with the order summary; there is no online payment by design. (The portfolio demo's "payments gateway" tag does not describe the live site.)
**7. Consultations (Verified).** Skin Check results create a consultation with a reference; customers look it up by reference + mobile; experts publish a reviewed routine.
**8. Expert workspace (Verified in code).** Login per expert (signed httpOnly session, HMAC cookie checked at the edge), leads, consultations, review queue of AI scans, orders, audit log of who acted.
**9. Analytics (Verified).** Event logging (events table, GA-style) in `lib/analytics.ts`.

#### Key workflows (end to end)
1. Visitor picks a concern or starts the Skin Check. 2. Answers guided questions; safety rules apply. 3. Optionally uploads a photo for the Skin Analyzer. 4. Result and a routine appear with caution flags; lead stored. 5. Expert reviews and publishes; customer looks up the consultation. 6. Customer places an order via WhatsApp.

#### User roles & permissions
Visitor (public); expert/admin accounts for the internal workspace. Admin pages are protected by middleware-verified signed sessions.

#### Technical architecture & integrations
Next.js 16, React 19, TypeScript strict, Tailwind v4, Framer Motion, Supabase (Postgres, private `skin-photos` bucket; 7 migrations), Zod; MediaPipe tasks-vision in browser; OpenAI vision and chat, optional Anthropic Claude Haiku for chat; Vercel (daily purge cron) or self-hosted via Dockerfile (standalone output) on Coolify; skin-cv-service Docker on Coolify. Secrets live in server environment variables.

#### Business value & example scenarios
Replaces generic product browsing with a guided, safe, expert-reviewed path. Scenario: "Meera" with breakouts completes the Skin Check, is steered away from a strong retinoid because she mentions pregnancy, and gets an expert-reviewed routine.

#### Planned / in progress (not live)
Deterministic skin-cv-service replacing the vision-LLM scan (Phase 1 scaffold); voice has been removed and is not planned.

#### Example visitor questions & answers
- **Does Skinwise have a voice agent?** No. It was removed on 28 October 2026; the text assistant is at /assistant.
- **Can I see a demo?** https://agentix-portfolio.vercel.app/#/demo/skinwise/walkthrough (fictional data).
- **Is the scan a diagnosis?** No, it is a starting point reviewed by an expert.
- **Can I pay online?** The live checkout places the order through WhatsApp; there is no online payment.
- **Which languages?** Site in English and Hindi; the chat in 12 languages.
- **How are photos handled?** Consent is required, stored privately and deleted after 90 days.

#### Related projects
YHC (doctor-led hair D2C), Dr. Shweta Diwan site (nutrition).

#### Verification notes
Verified: git log and removal commit, source, docs, live pages. Not accessed: admin. Note the root README.md is outdated (describes only the first static phase). Unconfirmed: which AI provider is active in production.

---

### NRI Trust
**Slug:** `nri-trust` · **Category:** Multi-Product Business Platforms / advisory · **Status:** Live - Partially verified
**Client / owner:** NRI Trust · **Local folder:** `D:\Agentix Project\NRI trust` · **Last activity:** 2026-05-26

#### Spoken introduction
NRI Trust is an advisory firm website for non-resident Indians who want to protect their parents' financial and legal life in India. We built a 3D globe experience, a risk-assessment engine that returns a GREEN, ORANGE or RED verdict with a prioritised action playbook and a PDF brief, and a client portal.

#### Quick overview
The firm manages insurance, bank accounts and KYC, property and tenancy, legal succession and emergency access for families abroad. The site funnels visitors by parent age group into zone pages and an assessment, captures leads, and emails the advisor.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| Website | https://nritrust.co/ | Production (real business) | Preloader first |
| Pricing | https://nritrust.co/pricing | Production | |
| Services | https://nritrust.co/services | Production | Five practice areas |
| Client portal | https://nritrust.co/portal | Login required | Not accessed |
| Zone pages | https://nritrust.co/zone/green (also /orange, /red) | Production | |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/nri-trust/overview | Safe demo - fictional data | No interactive module file exists; overview only |

#### Target users & business problem
NRIs with ageing parents in India facing scattered accounts, unclear nominees and no emergency plan.

#### Features (complete inventory)
**1. Marketing site (Verified live).** Home with age-group selector (parents 55-65 planning zone, 65-75 active watch, 75+ critical care), problem cards, promise steps, how-it-works (discovery, diagnosis, onboarding, governance; 4-step process), pricing, services (banking, legal, property, insurance, emergency access), emergency response, resources, success stories, contact, terms, privacy, cookies. Plans shown: Essential Care 12,000 per month, Comprehensive 24,000, Premium Legacy 36,000 (retainer, as printed on the site). Evidence: live pages, `client/src/pages`.
**2. 3D globe and scroll motion (Verified in code).** three.js scenes (`Global3DScene`, `UnifiedGlobe`), GSAP, Framer Motion.
**3. Risk assessment engine (Verified in code).** Version 2.0 question bank by persona; the parent age bracket picks the persona (under 55 GREEN "Plan Ahead", 55-65 ORANGE "Plan Now", 65+ RED "Act Immediately"); answers score points and raise flags (for example nomination gap, health exposure, liquidity trap); score under 30 CRITICAL urgency, under 60 MODERATE; outputs persona, score, per-category risk (legal, health, asset, financial; status Protected/At risk/Review), a prioritised action playbook (CRITICAL/HIGH/MEDIUM) and a narrative summary. Playbook content was sourced from three advisory spreadsheets. Evidence: `shared/assessment-engine.ts`, `api/assessment-engine.ts`.
**4. Assessment submission, PDF and email (Verified in code).** `POST /api/assessment` stores the result in a MySQL table, emails the user a confirmation and the advisor a lead alert via Brevo, and returns a PDF link (`GET /api/assessment/:id/pdf`, generated with pdfkit). Contact form `POST /api/contact`.
**5. Client portal (Partially verified).** Tabs: dashboard, my services, document vault, upcoming deadlines, my manager, plus onboarding steps. In the code the portal user and data are client-side (no server fetch found in the auth context), so it appears to be a front-end prototype rather than a backed portal. Evidence: `AuthContext.tsx`, `PortalDashboard.tsx`.

#### Key workflows (end to end)
Visitor selects an age group, reads the zone page, completes the assessment, receives a verdict and playbook with a PDF, advisor gets an email lead, free consultation is booked, tier recommended, onboarding.

#### User roles & permissions
Visitor and portal client only (no staff roles in code).

#### Technical architecture & integrations
React 18 + Vite, wouter, Tailwind, Radix UI, TanStack Query, three.js, GSAP, Framer Motion; Express server (`server.ts`, `infra/`) and serverless `api/index.ts` on Vercel (`vercel.json` rewrites); Drizzle and MySQL driver; Brevo transactional email; pdfkit; `web.config` present (Windows/IIS style hosting file). Env: database URL, Brevo key, advisor email (names only). Not confirmed: which host serves production.

#### Business value & example scenarios
Gives a vague worry a measurable score and a to-do list. Scenario: "Nisha" in Toronto answers questions about her father (68) and gets a RED verdict with critical actions on Will, nominations and health cover.

#### Planned / in progress (not live)
A real authenticated portal backend is not evidenced.

#### Example visitor questions & answers
- **What do GREEN, ORANGE, RED mean?** Planning, urgent-planning and act-immediately zones based on parents' age and answers.
- **Is the assessment free?** The site offers a free consultation; assessment output includes a PDF brief.
- **Does it give legal advice?** The site describes the services as financial and legal, non-medical; advice itself comes from the firm.
- **Can I see a demo?** Portfolio overview: https://agentix-portfolio.vercel.app/#/demo/nri-trust/overview.
- **What does it cost?** Plans on the site range from 12,000 to 36,000 per month.

#### Related projects
Ekatva (relationship platform for insurance/wealth distributors).

#### Verification notes
Verified: code, engine, endpoints, live public pages. Not verified: portal real backend, hosting provider. Site statistics (families protected, assets managed) are marketing copy and differ between pages (500+ vs 200+ families); not independently verified. Missing: portal demo credentials or screenshots; production hosting.

---

## Business Websites

### AI Agentix corporate website
**Slug:** `ai-agentix-site` · **Category:** Business Websites · **Status:** Live - Verified
**Client / owner:** AI Agentix (AGENTiX) · **Local folder:** `D:\Agentix Project\AI AGENTIX` · **Last activity:** 2026-10-28

#### Spoken introduction
This is our own agency website. It presents our services, solutions, industries and case studies, captures leads through five forms, and has an "Ask AI" assistant that answers from the site's content and takes visitors to the right page, in English, Hinglish or Hindi.

#### Quick overview
A React single-page site with an Express API that handles leads and the assistant. The assistant uses retrieval over a site knowledge base and falls back to a rule-based mode if no language model is available.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| Website | https://ai-agentix.com/ | Public marketing site | |
| Solutions | https://ai-agentix.com/solutions | Public site | 10 solutions |
| Technology | https://ai-agentix.com/technology | Public site | Eight-agent fleet |
| AI Studio | https://ai-agentix.com/ai-studio | Public site | Content studio |
| Contact | https://ai-agentix.com/contact | Public site | Audit, demo, partnership forms |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/ai-agentix-site/overview | Safe demo | No interactive module file; overview only |

#### Target users & business problem
Indian businesses evaluating AI automation. Problem: visitors skim and leave, and earlier forms lost leads.

#### Features (complete inventory)
**1. Pages (Verified).** Home, About, Solutions plus detail pages (sales, marketing, HRMS, operations, supply chain, finance, AI voice and chat, manufacturing), Industries plus detail pages (real estate, healthcare, education, hospitality, retail, manufacturing, logistics), Technology plus agent detail pages, Case Studies, AI Studio, legal pages, thank-you.
**2. Lead capture (Verified).** Five forms (Free AI Audit, Book a Demo, Partnership, floating consultation widget, newsletter) post to `/api/leads`; the lead is saved first on the server, then emailed and added to a Google Sheet, with automatic retry; origin check, honeypot, rate limit; DPDP consent stored; visitors reach the thank-you page only after the server confirms. Evidence: `WEBSITE_FIXES_COMPLETION_REPORT.md`, `server/src/leads.mjs`.
**3. RAG assistant "Ask AI" (Verified).** `POST /api/chat` with same-origin check and rate limit; retrieves from `knowledge.json` chunks using cosine similarity over embeddings (text-embedding-3-small) or a lexical fallback; model defaults to gpt-4o-mini; replies carry a navigate action so the page opens; intent answers work with no model key (free rule-based mode) and a daily cap applies to AI use; replies in English, Hinglish and Hindi. Evidence: `server/src/rag.mjs`, `app.mjs`, `intents.mjs`.
**4. Analytics and consent (Verified).** GA4 behind a cookie-consent banner; `generate_lead` conversion.
**5. SEO (Verified).** Prerendered meta, sitemap, compressed assets.

#### Key workflows (end to end)
Visitor asks a question, assistant retrieves, answers and navigates; visitor submits a form, lead is stored, emailed and sheeted, then thank-you page.

#### User roles & permissions
Public visitors only.

#### Technical architecture & integrations
React 18 + Vite + Tailwind + Framer Motion + react-router + helmet; Express 4 API (Node 20+); OpenAI SDK; Nodemailer (Gmail SMTP app password); Google Apps Script web app for Sheet; deployed on a VPS with nginx and pm2 (`deploy/deploy.sh` does a zero-downtime swap with rollback to `dist-prev`). Env names live in `server/.env` (not documented here).

#### Business value & example scenarios
No lead loss and answers around the clock. Scenario: a clinic owner asks "do you do WhatsApp automation for hospitals?" and is taken to the healthcare industry page.

#### Planned / in progress (not live)
None evidenced.

#### Example visitor questions & answers
- **Does the website have an AI assistant?** Yes, Ask AI, grounded on site content.
- **Which languages?** English, Hinglish, Hindi.
- **What happens when I submit a form?** The lead is saved, emailed to the team, added to a sheet, and a thank-you page appears.
- **Can I see a demo?** Visit https://ai-agentix.com/ directly.

#### Related projects
All AI Agentix products; the site itself markets them.

#### Verification notes
Verified: code, deployment docs, live pages. The performance claims on the live site (for example "340% more qualified meetings", "98% task automation") are marketing copy and not independently verified. Missing: nothing material.

---

### Dr. Shweta Diwan website and PHP admin
**Slug:** `dr-shweta-diwan` · **Category:** Business Websites · **Status:** Live - Partially verified
**Client / owner:** Dr. Shweta Diwan (nutritionist, emotional wellness coach) · **Local folder:** `D:\Agentix Project\well-known` (no git history) · **Last activity:** about 2026-10-23 (an update package in the folder is dated that day; `index.php` modified 2026-10-07)

#### Spoken introduction
This is the website for Dr. Shweta Diwan, a nutritionist and disease-reversal and emotional-wellness expert in Delhi. It has service pages, brain-wave analysis, blogs, transformations, calculators and an appointment form, plus a PHP admin panel that the team uses to manage content, orders and invoices.

#### Quick overview
A PHP and MySQL site where almost every page section is editable from an admin panel. It serves lead capture for Google Ads with a floating appointment form and a thank-you page for conversion tracking.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| Website | https://drshwetadiwan.com/ | Production (real business) | |
| Blogs | https://drshwetadiwan.com/blogs | Production | 8 posts listed |
| Transformation | https://drshwetadiwan.com/transformation | Production | Before/after gallery |
| Contact | https://drshwetadiwan.com/contact | Production | |
| Admin | not documented here | Login required | Never opened |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/dr-shweta-diwan/overview | Safe demo | Overview only; no module file |

#### Target users & business problem
Clients aged 5 to 95 seeking nutrition and wellness plans; the clinic needs credibility, lead capture and content/billing control without a developer.

#### Features (complete inventory)
**1. Public site (Verified live + code).** Home (services: emotional wellness counselling, clinical nutrition support, disease reversal plans, sports nutrition, personalised fat-loss plans, brain analysis), "Book Your Brain Wave Scan", BMI calculator and calorie calculator forms on the home page, why-choose, media and awards, blogs (for example gut health, blood sugar, immune booster, brain waves), transformation before/after gallery, contact, privacy, terms, `llms.txt`, sitemap. Several service route names return pages (disease-reversal, fat-loss, sports-nutrition, brain).
**2. Lead widget (Verified in code).** Floating "Book an Appointment" form with thank-you page, as built with the lead-widget kit; GTM container present.
**3. Admin panel (Verified by file names only; contents not opened).** About 119 PHP files: banner, blogs, case studies, certificates, clients, expertise, gallery, health pages, team, testimonials, videos, quick links, breadcrumb, shipping, discount, orders (all, pending, success, details), invoice generation, users, profile, plus delete/ajax helpers. This indicates content management plus order/invoice handling. Anything about login, roles or data is Unverified.

#### Key workflows (end to end)
Visitor reads, submits the appointment form, reaches the thank-you page (conversion event); staff edit content in admin; orders and invoices are handled in admin (inferred from file names).

#### User roles & permissions
Unverified (admin not inspected).

#### Technical architecture & integrations
PHP (page templates plus shared `inc/`), MySQL (inferred from the admin and schema file existence; not inspected), Apache, cPanel-style hosting, PHPMailer mail folder, Google Tag Manager. Secrets and config deliberately not read.

#### Business value & example scenarios
A self-managed brand site. Scenario: the team publishes a new blog post from admin and the post appears on /blogs without a developer.

#### Planned / in progress (not live)
None evidenced.

#### Example visitor questions & answers
- **What does the site offer?** Nutrition, disease reversal, emotional wellness, sports nutrition, fat loss, brain wave analysis.
- **Is there an admin?** Yes, a PHP admin for the team; it is login-protected.
- **Can I see a demo?** The live site is public: https://drshwetadiwan.com/ (do not submit the form).

#### Related projects
Thames Wellness Spa (same lead-widget approach).

#### Verification notes
Verified: public pages, file layout. Not verified, by design: admin functionality, database, credentials. The stated "8K success stories" and "15 years" are the site's claims. `/services` returns a 404 on the live site. Missing: admin screenshots or demo login to describe screens.

---

### Thames Wellness Spa
**Slug:** `thames-spa` · **Category:** Business Websites · **Status:** Live - Verified
**Client / owner:** Thames Wellness Spa, Pimple Saudagar, Pune · **Local folder:** `D:\monum\Downloads\thameswellnessspa` (static HTML, 29 entries) · **Last activity:** 2026-10-26 (file dates; no git)

#### Spoken introduction
Thames Wellness Spa is a luxury spa in Pune. We built a calm static website with therapies, signature packages, a gallery, a franchise enquiry form and a floating appointment form.

#### Quick overview
A static HTML/CSS/JS site with a PHP mail handler, themed on the River Thames and five water elements (Tide, Drift, Ripple, Mist, Shell). It supports enquiries and franchise leads, with Google Ads and analytics tags.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| Website | https://thameswellnessspa.com/ | Production (real business) | |
| Services | https://thameswellnessspa.com/services.html | Public site | |
| Packages | https://thameswellnessspa.com/signature-wellness-packages.html | Public site | |
| Franchise enquiry | https://thameswellnessspa.com/franchise-enquiry.html | Public site | |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/thames-spa/overview | Safe demo | Overview only |

#### Target users & business problem
Guests in Pune and prospective franchisees; a generic site fails to convey atmosphere or capture enquiries.

#### Features (complete inventory)
**1. Therapy pages (Verified).** Thames Wellness Voyage packages, traditional wellness therapies, modern wellness therapies, exfoliation and glow, targeted therapies, signature facials, luxury add-ons, gallery, testimonials, about.
**2. Signature packages (Verified).** For example Thames Signature (60 min Balinese plus 30 min head, neck, shoulder), Deep Sleep (60 min deep tissue plus 30 min back), Blissful Home Maker (60 min Swedish plus 30 min foot), Aromatic Radiance, Radiance and Sole, Couple's Package (90 min). Prices were not captured.
**3. Franchise enquiry (Verified).** Form with state, investment capacity (30-40 lakh to 50 lakh and above), start timeline, consent.
**4. Contact and floating appointment widget (Verified in code).** Widget auto-shows on the home page, posts to a lead endpoint and opens a thank-you page; contact and franchise forms go through `mail.php` (PHPMailer, reCAPTCHA-capable; settings come from a config file or server environment, not stored in the file).
**5. SEO and tracking (Verified).** Schema.org DaySpa JSON-LD, GTM and Google Ads tags, sitemap and robots.

#### Key workflows (end to end)
Guest browses therapies and packages, calls/WhatsApps or fills the form, the team calls to book.

#### User roles & permissions
Public only.

#### Technical architecture & integrations
Static HTML, Bootstrap, jQuery, GSAP, Swiper, Isotope; PHP/PHPMailer for mail; `web.config` (IIS-style hosting config) and `.user.ini` present; hosting provider not confirmed.

#### Business value & example scenarios
Fast static pages that rank locally and route every enquiry to the team. Scenario: a guest picks the Couple's Package and sends a callback request.

#### Planned / in progress (not live)
None.

#### Example visitor questions & answers
- **Where is it?** Pimple Saudagar, Pune (as printed on the site).
- **Can I buy a package online?** No online checkout; enquiries and calls.
- **Is there a franchise?** Yes, an enquiry form exists.
- **Can I see a demo?** Visit the live site.

#### Related projects
Dr. Shweta Diwan site.

#### Verification notes
Verified: folder and live pages. Not verified: hosting provider; package prices. Phone and email are on the public site (not repeated here).

---

### Eurobrass corporate site
**Slug:** `eurobrass-site` · **Category:** Business Websites · **Status:** Live - Verified
**Client / owner:** Eurobrass · **Local folder:** `D:\Agentix Project\EuroBrass` (landing part: `app/page.tsx`, `features/landing/*`) · **Last activity:** 2026-09-10

#### Spoken introduction
This is the Eurobrass brand landing page: a dark, crafted page that explains how a brass fitting is made, from cast to machine to finish, shows six product lines, and leads dealers to the dealer portal login.

#### Quick overview
The landing is the front door of the same Next.js app that hosts the Eurobrass CRM and dealer portal; the root path shows the marketing page and "Dealer login" opens the app.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| Landing | https://eurobrass-seven.vercel.app/ | Public marketing site | |
| Dealer login | https://eurobrass-seven.vercel.app/login | Login required | CRM; not accessed |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/eurobrass-site/overview | Safe demo | Overview only |
| CRM demo | https://agentix-portfolio.vercel.app/#/demo/eurobrass-crm/overview | Safe demo | Separate project |

#### Target users & business problem
Dealers and buyers who need to see craft and capacity and find their way to the portal.

#### Features (complete inventory)
**1. Landing sections (Verified).** Nav (Process, What we make, Dealer login), hero ("Solid brass, machined to the thread") with facts (finish: polished/satin/antique, alloy CuZn39Pb3, network, reach), process (Cast, Machine, Finish), six product lines (valves and cocks, pipe fittings, architectural hardware, sanitaryware, cable glands, custom machining), footer CTA to the portal.

#### Key workflows (end to end)
Visitor scrolls the process, browses lines, clicks Enter the Portal to /login.

#### User roles & permissions
Landing is public; the CRM has roles (see CRM entry).

#### Technical architecture & integrations
Next.js 16, React 19, Tailwind, Framer Motion; Vercel. The same app includes Supabase-related folders, zustand and Recharts for the CRM.

#### Business value & example scenarios
Gives a manufacturer a credible web presence tied to its dealer system.

#### Planned / in progress (not live)
None.

#### Example visitor questions & answers
- **What does Eurobrass make?** Six lines per the site: valves and cocks, pipe fittings, architectural hardware, sanitaryware, cable glands, custom machining.
- **Where do dealers log in?** /login.

#### Related projects
`eurobrass-crm` (the portal behind the login) and `redux` (restoration service).

#### Verification notes
Verified: landing code and live page. The site's "est. 1974" and "240+ dealers across Europe and South Asia" are page copy; the REDUX site separately says "50 years of Eurobrass". Not independently verified.

---
## E-commerce Experiences (concept brands)

**Important for every entry in this section and the next:** these brands are FICTIONAL. AI Agentix built them as showcase/concept websites to demonstrate design and interaction craft. They are not real shops; prices are sample prices, carts and bookings are simulated in the browser (no server calls were found in the source), and nothing can actually be bought or reserved. All are hosted under https://showcase-build-tau.vercel.app/<path>/ and are embedded in the portfolio. Portfolio link pattern: https://agentix-portfolio.vercel.app/#/demo/<slug>/overview (overview only; these concept sites have no interactive demo-module files). Type for every URL: Concept site (public, safe to explore). Status: Concept. All verified by loading the live page in Chrome and checking the source folder.

Common tech (Verified in each package.json unless noted): Next.js static export (React 19, Tailwind 4) using the in-house "Showreel Kit" engine: GSAP with ScrollTrigger, Lenis smooth scroll, custom cursor, loaders, reveal animations, and a "record mode" for filming; most kit sites also include three.js via React Three Fiber. Exceptions are called out.

### Fruitivo (perfume)
**Slug:** `fruitivo` · **Path:** `/perfume/` · **URL:** https://showcase-build-tau.vercel.app/perfume/ · **Source:** `E:\perfume-AS` · **Last activity:** 2026-09-27
**Spoken intro:** Fruitivo is a fictional organic perfume brand we made to show a mood-led way of choosing a fragrance. You click a mood such as The Romantic or The Rebel and discover a scent.
**Overview:** A single-page store with best sellers, offers (a sample code FRUITIVO20), and a "Find your fragrance mood" selector with seven moods, reviews and a refer-a-friend block. Verified (live text and `MoodSelector.jsx`).
**Signature features:** Mood selector (Verified); four signature scents Ruby Oud, Lavender, Blue Wave, Oud Wood with buy-now buttons (Verified); offers strip and testimonials (Verified). Checkout is not real.
**Tech stack:** React 19 + Vite 7, GSAP, Lenis, Framer Motion (Verified; not Next.js).
**Q&A:** Is Fruitivo real? No, concept brand. What is special? The mood selector. Can I see it? Link above or portfolio overview `/#/demo/fruitivo/overview`.
**Related:** Dewlab, Aurelle (other product-led concepts).

### DRIFY (streetwear)
**Slug:** `drify` · **Path:** `/drift/` · **URL:** https://showcase-build-tau.vercel.app/drift/ · **Source:** `E:\drift-ecommerce` · **Last activity:** 2026-09-27
**Spoken intro:** DRIFY is a fictional streetwear store with a drop-style hero and a product page you can quick-view and add to cart.
**Overview:** Home with new-drop banner, popular picks, categories (new arrivals, outerwear, activewear), a product viewer with size and colour pickers and ratings, and a cart. Verified. The product data file lists about 24 products (Verified by name count in `data/products.js`).
**Signature features:** Scroll-driven hero with canvas and two videos (Verified), product view with sizes XS-XL and add to cart (Verified), search box and categories (Verified).
**Tech stack:** Next.js 14, React 18, Tailwind 3, GSAP, Lenis (Verified).
**Q&A:** How many products? About 24 in the data file. Is checkout real? No.
**Related:** VARA Studio (fashion).

### Moana (cinematic fan concept)
**Slug:** `moana` · **Path:** `/moana/` · **URL:** https://showcase-build-tau.vercel.app/moana/ · **Source:** `E:\moana` · **Last activity:** 2026-09-27
**Spoken intro:** Moana is a cinematic scroll-driven tribute page built to show how a film-quality hero can run on 181 images without video weight.
**Overview:** Uses the Disney film's title and characters as a fan-style showcase, credited "Designed and developed by Indresh Mishra"; it is not an official Disney site and should be described as a design experiment, not a brand. Verified (live text).
**Signature features:** 181-frame canvas scrub driven by scroll (Verified: `FRAME_COUNT = 181`), Home/Journey/Gallery/Characters menu, trailer button (Verified).
**Tech stack:** Next.js 16, React 19, Tailwind 4, GSAP (Verified).
**Q&A:** Is it official Disney? No. What is the trick? A canvas that scrubs a pre-rendered image sequence.
**Related:** Aurelle (frame-sequence hero).

### Movade (travel)
**Slug:** `movade` · **Path:** `/travel/` · **URL:** https://showcase-build-tau.vercel.app/travel/ · **Source:** `E:\travel-agency` · **Last activity:** 2026-08-12
**Spoken intro:** Movade is a fictional travel agency site with a 3D depth hero, a property search bar and a popular-destinations section.
**Overview:** Hero "Explore the World, One Journey at a Time", search with location, dates, participants and type filters (All, Hotel, Apartment, Villa), coastal/water/cultural/mountain categories, popular destination cards with sample fares, how-it-works steps, testimonials. Verified (live).
**Signature features:** 3D depth scene (React Three Fiber) and scroll canvas hero (Verified in `components/3d`, `hero-scroll-canvas.tsx`); search form Verified, fake results not exercised.
**Tech stack:** Next.js 14, React 18, three.js with React Three Fiber and drei, GSAP, Lenis, Framer Motion (Verified).
**Q&A:** Are the fares real? No. Does it book trips? No.
**Related:** Cairnline Treks, Coral Bay.

### AURELLE (sarees)
**Slug:** `aurelle` · **Path:** `/aurelle/` · **URL:** https://showcase-build-tau.vercel.app/aurelle/ · **Source:** `E:\aurelle` · **Last activity:** 2026-10-08
**Spoken intro:** AURELLE is a fictional saree house with a cinematic hero, six mood-based edits and a cart drawer.
**Overview:** Hero "More than a Saree", six moods (for example Bridal red), new arrivals, best sellers, bridal collection, seasonal edit, trend sections, promo ribbon (free shipping, 7-day returns). Verified live. 17 products in `lib/products.ts` (Verified).
**Signature features:** Frame-sequence hero that loads an image sequence progressively and scrubs on scroll (Verified in `Hero.tsx`); cart drawer with checkout component (Verified `CartDrawer.tsx`); search and many interactive controls (live page).
**Tech stack:** Next.js 14, React 18, Tailwind 3, GSAP, Lenis, Framer Motion (Verified).
**Q&A:** How many products? 17. Real checkout? No.
**Related:** VARA Studio, Kanak Jewels.

### VARA Studio (fashion)
**Slug:** `vara` · **Path:** `/vara/` · **URL:** https://showcase-build-tau.vercel.app/vara/ · **Source:** `E:\vara-studio` (static `dist/`) · **Last activity:** not captured (no git date)
**Spoken intro:** VARA Studio is a fictional Gen Z fashion label with a canvas-drawn denim drape and a drag-to-select looks carousel.
**Overview:** "Eight looks, zero rules" with edits (denim, tailoring, going out, essentials), collection, product view, bag. Rupee sample prices. Verified (live and README). It began as a saree concept and was relaunched as fashion (README note).
**Signature features:** Canvas denim drape art and confetti/sparkle ornaments (Verified in `denim-art.js`, `ornaments.js`); collection search/sort, wishlist; bag drawer saved in browser localStorage (Verified in `app.js`); custom motion engine and fabric loupe (README).
**Tech stack:** Vanilla HTML, CSS and ES modules (no framework, no build), custom scroll engine (Verified; differs from the kit). Photos and fonts are not committed to the repo.
**Q&A:** Is the bag saved? Yes, in the browser only.
**Related:** DRIFY, Aurelle.

### Kanak Jewels
**Slug:** `kanak` · **Path:** `/kanak/` · **URL:** https://showcase-build-tau.vercel.app/kanak/ · **Source:** `E:\triozen\day-16-kanak` · **Last activity:** 2026-10-10
**Spoken intro:** Kanak Jewels is a fictional 22K gold jeweller where every price is itemised into gold value, making charge and GST.
**Overview:** Bridal, temple, daily wear and gifting collections; hero piece Mayuri Haar; "a piece for every hour" daily-wear clock; hallmark ring; reviews; bag. Verified live.
**Signature features:** Itemised price: sample rate 7,240 per gram for 22K (5,930 for 18K), 12% making, 3% GST, with a 22K/18K toggle that swaps the piece image (Verified in `content.ts`). The rate is a fixed sample constant labelled "Sample rate - concept site"; no moving live feed was found, so do not claim the rate updates in real time. Try-on view on a plain bust; Add to bag (Verified).
**Tech stack:** Next.js 16, React 19, Tailwind 4, GSAP, Lenis, three.js (Verified).
**Q&A:** Does the price move with the gold rate? The price is computed from a sample rate and itemised; the rate is fixed in code.
**Related:** Meridian, Aurelle.

### Meridian (watches)
**Slug:** `meridian` · **Path:** `/meridian/` · **URL:** https://showcase-build-tau.vercel.app/meridian/ · **Source:** `E:\triozen\day-1-watch-brand` · **Last activity:** 2026-10-14
**Spoken intro:** Meridian is a fictional luxury watch brand that takes a skeleton tourbillon apart layer by layer and lets you configure a dial and strap.
**Overview:** Hero "Time, taken apart", anatomy in five layers, collection of four featured references (fourteen claimed), configurator, workshop story, boutiques, care FAQ, bag. Sample prices in rupees. Verified live.
**Signature features:** Exploded anatomy on scroll (live text, `PlateHero`, `Specsheet`); Dial Studio configurator with dials and straps (Verified in `DialStudio.tsx`); reserve buttons and bag count (Verified).
**Tech stack:** Next.js 16, React 19, Tailwind 4, GSAP, Lenis (no three.js) (Verified).
**Q&A:** Can I buy? No; reserve is simulated.
**Related:** Halden, Kanak Jewels.

### Dewlab (skincare)
**Slug:** `dewlab` · **Path:** `/dewlab/` · **URL:** https://showcase-build-tau.vercel.app/dewlab/ · **Source:** `E:\triozen\day-12-dewlab` · **Last activity:** 2026-10-07
**Spoken intro:** Dewlab is a fictional serum brand where a single drop travels down the page and a Day 1 versus Day 28 slider shows results.
**Overview:** "Dew. Drop. Glow." with four actives (triple hyaluronic, niacinamide, apricot-kernel peptides, petal water), morning and night ritual, results panel, shop with add button. Verified live.
**Signature features:** Drop that travels the page (`DropTraveller`, `Drop`, `BeadLoop`), before/after slider (`BeforeAfter`), animated counters, ritual steps (Verified). Results figures are sample copy on a concept brand.
**Tech stack:** Next.js 16, React 19, GSAP, Lenis, three.js (Verified).
**Q&A:** Are the results real? No, concept copy.
**Related:** Fruitivo, Melt Theory.

### Melt Theory (ice cream)
**Slug:** `melt` · **Path:** `/melt/` · **URL:** https://showcase-build-tau.vercel.app/melt/ · **Source:** `E:\triozen\day-3-melt` · **Last activity:** 2026-10-05
**Spoken intro:** Melt Theory is a fictional Hyderabad ice-cream parlour with a scoop stacker that adds up the price as you build.
**Overview:** Small-batch hand-churned story, flavour of the week, today's six flavours, build your cone, treats, deals, parlours, order counter. Verified live.
**Signature features:** Scoop stacker with a running total (Verified: total from scoop prices in `ScoopStacker.tsx`; the portfolio's "live receipt" wording is not confirmed literally), flavour wave marquee, drip edge animation (Verified components).
**Tech stack:** Next.js 16, React 19, Tailwind 4, GSAP, Lenis (no three.js) (Verified).
**Q&A:** Can I order? No, simulated.
**Related:** Crumb & Co.

### Zip EV (e-scooter)
**Slug:** `zipev` · **Path:** `/zipev/` · **URL:** https://showcase-build-tau.vercel.app/zipev/ · **Source:** `E:\triozen\day-13-zip-ev` · **Last activity:** 2026-10-08
**Spoken intro:** Zip EV is a fictional electric-scooter brand where you ride through the city with your trackpad and watch range and speed change.
**Overview:** Hero "Ride through the city with your trackpad", true range (City 151 km, Eco 172 km, Sport 118 km), charging options, corner light, four colours at one price, rider notes, pick-your-model section with EMI note, test-ride CTA, shop row. All sample numbers. Verified live.
**Signature features:** Throttle ride scene (`ThrottleRide`), count-up spec rows, battery swap, colour picker (`ColourPicker`), test-ride tunnel and a "Jump to" command palette (Verified components and text); test-ride booking confirmation is simulated.
**Tech stack:** Next.js 16, React 19, GSAP, Lenis, three.js (Verified).
**Q&A:** Are specs real? No, sample specs. Can I book a test ride? The form is simulated.
**Related:** Vaskaro.

### Crumb & Co (bakery)
**Slug:** `crumb` · **Path:** `/crumb/` · **URL:** https://showcase-build-tau.vercel.app/crumb/ · **Source:** `E:\triozen\day-8-Crumb` · **Last activity:** 2026-10-05
**Spoken intro:** Crumb and Co is a fictional Hyderabad bakery where you build a cake base by scrolling and then build your own cake with live pricing.
**Overview:** "Build a base by scrolling" with seven layers, today's counter (Chocolate Crown, Vanilla Cloud, Pistachio Rose, Strawberry Shortcake, priced per kg), add-ons, build-your-own, visit, pickup and delivery. Verified live.
**Signature features:** Build Your Own cake with shape, sponge, finish and size chips and a live rupee total (from 525; Verified in `BuildYourOwn.tsx`); scroll-built layered cake; "Just ordered" strip (Verified). The live page is a cake builder, not a box builder as the portfolio card says.
**Tech stack:** Next.js 16, React 19, GSAP, Lenis, three.js (Verified).
**Q&A:** Can I order? No, simulated.
**Related:** Melt Theory.

---

## Immersive Brand Websites (concept brands)

(Same notes as above: fictional brands, simulated actions, sample prices.)

### Cairnline Treks
**Slug:** `cairnline` · **Path:** `/cairnline/` · **URL:** https://showcase-build-tau.vercel.app/cairnline/ · **Source:** `E:\cairnline` · **Last activity:** 2026-10-12
**Spoken intro:** Cairnline Treks is a fictional Himalayan trekking company whose home page lets you fly over a route before you book.
**Overview:** Six sample treks (Everest Base Camp 12 days, Annapurna Circuit 16, Markha Valley 9, Valley of Flowers 6, Kedarkantha 5, Goecha La 11) with altitude, best months and sample prices; scroll-linked altitude chart, when to go, stays, next departures, trip bag. Verified live.
**Signature features:** Flyover films with an Everest/Annapurna/Ladakh switcher; altitude climb with temperatures per stage; departures board; trip bag (Verified). It is the Showreel Kit v2 reference (README: one showcase site a day).
**Tech stack:** Next.js 16, React 19, Tailwind 4, GSAP, Lenis, three.js with React Three Fiber (Verified).
**Q&A:** Are the prices real? Sample.
**Related:** Movade, Vaskaro.

### Saffron & Smoke
**Slug:** `saffron` · **Path:** `/saffron/` · **URL:** https://showcase-build-tau.vercel.app/saffron/ · **Source:** `E:\triozen\day-10-saffron` · **Last activity:** 2026-10-06
**Spoken intro:** Saffron and Smoke is a fictional fire-kitchen restaurant whose tasting menu cooks as you scroll.
**Overview:** Nine-course tasting at a sample 7,500 per guest, course plating scenes, tandoor facts (480 degrees, lit at five), the 14-hour shank signature, pairings, reservation section. Verified live.
**Signature features:** Scroll-cooked course rail (`CourseRail`, `TandoorFire`), animated numbers, pairing sheet, reserve-a-table component (`ReserveTable`, simulated) (Verified).
**Tech stack:** Next.js 16, React 19, GSAP, Lenis, three.js (Verified).
**Q&A:** Can I reserve? The booking is simulated.
**Related:** Crumb & Co, Coral Bay.

### Aurelune Residences
**Slug:** `aurelune` · **Path:** `/aurelune/` · **URL:** https://showcase-build-tau.vercel.app/aurelune/ · **Source:** `E:\triozen\day-21-aurelune` · **Last activity:** 2026-10-15
**Spoken intro:** Aurelune is a fictional coastal villa development where rooms light up as you scroll and a map shows the four coves.
**Overview:** Three villas (Lunessa available, Aldevar reserved, Cassiane coming soon) with room-by-room views and sample prices in crore; amenities; four coves with travel times. It is a residences brand, not a hotel. Verified live.
**Signature features:** Room-by-room lighting, villa detail (`VillaDetail`), locations map (`Locations`), booking component (simulated) (Verified).
**Tech stack:** Next.js 16, React 19, GSAP, Lenis, three.js (Verified).
**Related:** Coral Bay.

### Halden (smartphone launch)
**Slug:** `halden` · **Path:** `/halden/` · **URL:** https://showcase-build-tau.vercel.app/halden/ · **Source:** `E:\triozen\day-19-halden-phone` · **Last activity:** 2026-10-15
**Spoken intro:** Halden is a fictional phone launch page where a product film is scrubbed by your scroll through layers, camera, display and finishes.
**Overview:** Nav of Layers, Camera, Display, Finishes and "Where to buy?"; from a sample price 49,900. Initial text is minimal because content builds with the film. Verified live (partial text).
**Signature features:** Scroll-scrubbed film (`Film`); finishes section where the active finish follows the film (a click colour picker was not confirmed); prices (`HaldenPrices`) (Verified in components).
**Tech stack:** Next.js 16, React 19, GSAP, Lenis, three.js (Verified).
**Related:** Meridian.

### Iron Temple
**Slug:** `irontemple` · **Path:** `/irontemple/` · **URL:** https://showcase-build-tau.vercel.app/irontemple/ · **Source:** `E:\triozen\day-11-iron-temple` · **Last activity:** 2026-10-06
**Spoken intro:** Iron Temple is a fictional strength gym where you load the bar plate by plate and see a live rep counter.
**Overview:** "Lift heavy. Rest. Repeat.", floor facts, house rules, four programmes (strength, Olympic lifting, hypertrophy, conditioning), coaches, memberships, weekly floor schedule, book a trial. Verified live.
**Signature features:** Load-the-bar interaction (`LoadTheBar`, `Plates`), split-flap board (`FlapBoard`), floor plan and plan list (Verified).
**Tech stack:** Next.js 16, React 19, GSAP, Lenis, three.js (Verified).
**Related:** Vaskaro.

### Marigold Noir
**Slug:** `marigold` · **Path:** `/marigold/` · **URL:** https://showcase-build-tau.vercel.app/marigold/ · **Source:** `E:\triozen\day-24-marigold-noir` · **Last activity:** 2026-10-19
**Spoken intro:** Marigold Noir is a fictional wedding photographer whose site tells four functions and seven ceremony rounds as a film.
**Overview:** Haldi, Mehendi, Sangeet and Wedding chapters; seven rounds; details; portfolio; three packages (sample 95,000, 240,000, 480,000); album option; FAQ; hold-your-date enquiry. The portfolio calls it a seven-chapter film; the live structure is four functions plus a seven-round ceremony. Verified live.
**Signature features:** Chapters, album viewer (`Album`), packages (`Packages`), booking enquiry (simulated) (Verified).
**Tech stack:** Next.js 16, React 19, GSAP, Lenis, three.js (Verified).

### Coral Bay
**Slug:** `coralbay` · **Path:** `/coralbay/` · **URL:** https://showcase-build-tau.vercel.app/coralbay/ · **Source:** `E:\triozen\day-14-coral-bay` · **Last activity:** 2026-10-08
**Spoken intro:** Coral Bay is a fictional South Goa villa resort whose home page puts the holiday one scroll away, with a stay planner.
**Overview:** 24 villas on a quiet bay; four villa types with nightly sample rates (16,500 to 58,000); dining (The Deck, Laterite, Sunset Bar); spa menu; a day-at-the-bay triptych; guest notes; a local-conditions strip. Verified live.
**Signature features:** Check-in/out and villa planner (`StayPlanner`, simulated availability), villa postcards, dining index, spa pebble (Verified).
**Tech stack:** Next.js 16, React 19, GSAP, Lenis, three.js (Verified).

### Tallow & Tape
**Slug:** `tallow-tape` · **Path:** `/tallow/` · **URL:** https://showcase-build-tau.vercel.app/tallow/ · **Source:** `E:\triozen\day-22-tallow-tape` · **Last activity:** 2026-10-16
**Spoken intro:** Tallow and Tape is a fictional recording and rehearsal studio with a record-light loader and a booking section.
**Overview:** Three rooms (control room, live room, vocal booth), four services (recording, mixing, mastering, rehearsal) with sample starting prices, gear list, session log, book-a-day. Verified live. No audio-track player was confirmed (the portfolio mention of tracks is unverified).
**Signature features:** Hover-a-room panels, session rail, shutter and wipe transitions, booking (simulated) (Verified components).
**Tech stack:** Next.js 16, React 19, GSAP, Lenis, three.js (Verified).

### Vaskaro
**Slug:** `vaskaro` · **Path:** `/vaskaro/` · **URL:** https://showcase-build-tau.vercel.app/vaskaro/ · **Source:** `E:\triozen\day-23-vaskaro` · **Last activity:** 2026-10-16
**Spoken intro:** Vaskaro is a fictional mountain motorcycle brand where scrolling shifts gears up a mountain pass.
**Overview:** Passo 650 (sample 6.9 lakh), six chapters, engine spec counters, gear shop (jacket, helmet, gloves, tank bag with add to cart), five road routes with bend counts, test-ride booking. Verified live.
**Signature features:** Scroll-as-gear dial, roads section, gear shop cart, booking (`Booking`, simulated) (Verified).
**Tech stack:** Next.js 16, React 19, GSAP, Lenis, three.js (Verified).

---

## Infrastructure & Delivery

### Deployment and hosting capabilities (delivery-infra)
**Slug:** `delivery-infra` · **Category:** Delivery · **Status:** Live capability (not a product) - Partially verified
There is no cPanel or hosting-management product at AI Agentix. What exists is deployment capability shown across repos. Portfolio: https://agentix-portfolio.vercel.app/#/demo/delivery-infra/overview.

#### Spoken introduction
We deploy on whatever suits the client: Vercel for fast front ends, a Docker-based VPS managed with Coolify for apps that need background workers, classic Apache/cPanel hosting for PHP and static sites, Supabase for database and storage, and Kubernetes manifests for our SocialPush microservices.

#### Capabilities and evidence
- **Coolify VPS plus Docker (Verified).** Dockerfiles and docs exist for SocialFlow, AGENTiX, Woodpecker PMS (production image; a second worker resource runs `npm run worker`), LeadForge (`deploy/docker-compose.yml`: Redis, workers, API and web, with Postgres on Supabase), SocialPush (compose file notes Coolify routing), Max Fitness (`docs/09-operations/coolify-setup.md`: web and worker built from Dockerfiles so the reminder worker can run), REDUX (production target Docker on a Mumbai VPS via Coolify per CLAUDE.md) and Skinwise (standalone Dockerfile; the CV service on Coolify). The recurring reason in the docs: Vercel cannot hold long-running workers.
- **Vercel (Verified).** `vercel.json` in Umang, Kaaya, Voice-CRM, NRI Trust, Redux, YHC, Skinwise (with a cron) and others; the showcase is a Vercel project.
- **cPanel / Apache / PHP and MySQL (Verified in part).** The Umang hospital frontend is documented as deployed on "Apache/cPanel hosting"; the Dr. Shweta Diwan site is PHP; Thames Wellness Spa uses a PHP mail handler plus static pages (its `web.config` hints at IIS). DirectAdmin was not found in any document and is unverified. The Fitness First Dwarka `.htaccess` is also Apache but that project is outside this part.
- **VPS with nginx and pm2 (Verified).** The AI Agentix corporate site deploys by script to a VPS (nginx security headers, pm2, zero-downtime swap with rollback to `dist-prev`).
- **Supabase (Verified).** Postgres, auth and storage for many projects; a `supabase-proxy` folder exists in Umang and SocialPush.
- **Kubernetes (Verified).** `auto-posting/k8s/deployments.yaml` defines a secret plus deployments and services for account-service (2 replicas), post-service (2) and bullmq-worker (3); `docker-compose.yml` runs the stack on a single host.
- **Hostinger (Partially verified).** Agentix CRM has a `deploy_hostinger/.htaccess` folder.

#### Example Q&A
- Do you offer hosting management? There is no product for that; we deploy and operate each project on the right host.
- Do you use cPanel? Yes, for PHP and static client sites.
- Why not Vercel for everything? Apps with background workers (queues, reminders) need a long-running process, so those go on Docker/Coolify.

#### Verification notes
Verified from files. Not verified: the current live host of each production site; DirectAdmin; whether the k8s manifests are running anywhere.

### Showcase pipeline (showcase-pipeline)
**Slug:** `showcase-pipeline` · **Category:** Delivery · **Status:** Internal tooling, active - Verified
**Local folder:** `E:\showcase-tools` (changed 2026-10-21/22). Portfolio: https://agentix-portfolio.vercel.app/#/demo/showcase-pipeline/overview.

#### Spoken introduction
Behind the concept sites is a small internal pipeline that builds each kit site, adds it to one combined showcase, audits it at seven screen widths, and deploys it.

#### What the scripts do (Verified)
- `add-kit-site.ps1`: patches the site's `next.config.ts` for a sub-path static export (only when `SHOWCASE_BASE` is set), installs dependencies, builds, copies only the site pages and its public assets into `E:\showcase-build\<slug>`, refuses to overwrite assets owned by another site, and runs sanity scans for broken base paths.
- `add-card.py`: adds or replaces the site's card on the showcase landing page and updates the site count text.
- `check-site.js`: loads a site in Chrome via Playwright, scrolls it, and reports title, page height and every console error, page error, failed request and HTTP 400 or higher.
- `audit.js`: responsive audit at 320, 390, 768, 1024, 1366, 1920 and 2560 pixels, reporting horizontal overflow, elements sticking out of the viewport, page errors, and six screenshots per width.
- `sheet.py`: makes a contact sheet of the audit screenshots.
- `deploy.sh`: deploys `E:\showcase-build` to Vercel production (project `showcase-build`), removes older deployments to save storage, and checks the live site returns 200.
- Showreel Kit v2 (README in `E:\cairnline`): one showcase site a day on a shared engine (smooth scroll, scroll-driven video, loader, cursor, reveals, record mode) with a new design each time.

#### Example Q&A
- How are concept sites tested? Automatically at seven widths plus a console-error check.
- Where are they hosted? All on one Vercel project, each under its own path.

#### Verification notes
Verified from script source. Not verified: the content of `runs/` (36 output entries, not opened).

---

## How AI Agentix builds

Patterns verified from package.json files and source across the repos. "Verified" means a dependency or API call was found in code; marketing copy is not counted.

- **Next.js and React (App Router):** AGENTiX, SocialFlow, Redux, YHC, Skinwise, Eurobrass CRM and site, Gov-HIMS, Umang HIMS, Woodpecker PMS, Max Fitness, LeadForge, SocialPush web, and all kit concept sites. Vite + React: Voice-CRM, Riya CRM, Agentix CRM, NRI Trust, AI Agentix site, Umang website, Kaaya, Fruitivo.
- **Supabase (Postgres, Auth, Storage, RLS):** AGENTiX, SocialFlow, Redux (RLS on every table), YHC, Skinwise, Umang, LeadForge, Gov-HIMS, Umang HIMS, SocialPush. **Prisma/Postgres:** Woodpecker PMS, Max Fitness; Kaaya uses Prisma with MySQL. **Drizzle:** Agentix CRM, NRI Trust. **PHP/MySQL:** Dr. Shweta Diwan site.
- **Queues and workers:** BullMQ with Redis (SocialPush, LeadForge), pg-boss (Woodpecker, Max Fitness), pgmq with pg_cron (Redux).
- **Meta APIs (WhatsApp Cloud, Instagram, Facebook Graph):** AGENTiX, SocialFlow, SocialPush, Redux (integration modules), Max Fitness (partial). **Google Ads, Business Profile and Maps:** AGENTiX.
- **Payments:** Razorpay in AGENTiX, SocialFlow, Max Fitness, Woodpecker and Redux (simulated in its demo); Stripe is a dependency in Kaaya.
- **LLMs:** OpenAI (AI Agentix site assistant and embeddings, AGENTiX, Skinwise scan and chat), Anthropic Claude (optional Skinwise chat model; also found in AGENTiX, LeadForge, Woodpecker, Gov-HIMS code), Gemini (Agentix CRM, SocialPush), OpenRouter (AGENTiX, SocialFlow), Groq and Whisper (AGENTiX; Whisper also LeadForge). RAG with embeddings: AI Agentix site. Deterministic rule engines beside the LLMs: Skinwise recommendations, NRI Trust assessment.
- **Voice:** ElevenLabs speech-to-text/text-to-speech was used in the Skinwise voice agent until its removal on 2026-10-28 (per the removal commit) and appears in Gov-HIMS code; Deepgram appears in Gov-HIMS. The portfolio's voice product is VoiceCRM (another part).
- **Face and vision:** MediaPipe tasks-vision (Skinwise, Max Fitness check-in); OpenCV/ONNX Python service (Skinwise CV service).
- **Motion and 3D:** GSAP with ScrollTrigger and Lenis (kit concept sites, YHC, NRI Trust, Umang website), three.js and React Three Fiber (most kit sites, NRI Trust globe, Movade), Framer Motion widely, Fabric.js (SocialFlow design editor), ReactFlow (AGENTiX flow builder), Recharts for dashboards.
- **Documents and email:** pdfkit (NRI Trust), Gotenberg (Redux PDFs), Nodemailer, PHPMailer, Brevo and Resend for email.
- **Mobile:** Expo SDK 57 Android app (Redux surveyor).
- **Quality and process:** Vitest, Playwright, pgTAP database tests (Redux), CI gates, written decision records and business-rule IDs in code (Redux), responsive audits (showcase pipeline).
- **Hosting:** see Deployment and hosting capabilities above.

#### Example Q&A
- What stack do you usually use? Next.js/React front ends, Supabase or Postgres, and queue workers for background jobs; Meta, Razorpay and LLM APIs where the product needs them.
- Do you build with AI models? Yes; models are used where they help and plain rules where safety matters, as in Skinwise.

#### Verification notes
Package.json scans covered 20 repos; the source keyword scan did not finish for every repo before the session limit (Skinwise, YHC, NRI, Redux, AI Agentix site, Umang HIMS, YouTube Automation results were not collected by script, so those integrations rely on the per-project checks above). Absences, such as no integrations found for Voice-CRM or Riya CRM beyond Supabase, are unconfirmed rather than disproved.
