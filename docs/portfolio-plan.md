# AI Agentix Portfolio — Discovery, Inventory & Build Plan

Status: **APPROVED 2026-10-27 with changes (see §0)** · Prepared 2026-10-27

---

## 0. Approved decisions (from review, 2026-10-27)

1. **Real client names and brands are shown.**
2. **Every product shows its full feature set (A to Z) with demo data.** Interiors are recreated from the codebases with fictional data; no production logins are used. Each demo covers every module the product offers, not just one highlight flow.
3. **Concept brand sites are embedded live** (recommended option), and **the Agentix logo appears on everything**: every card, every demo shell, every embedded site frame ("Built by AGENTiX" badge).
4. **Sources added:**
   - YouTube automation is `E:\YouTube-Automation` (amber-light pipeline + sample renders).
   - Thames Wellness Spa is `D:\monum\Downloads\thameswellnessspa` (static HTML, 20 pages).
   - **All** showcase sites are included, including the four unpublished kit sites: Coral Bay, Tallow & Tape, Vaskaro and Crumb. **Every embedded site must actually load and work.**
5. **Status chips (Live / Active / Prototype / Concept) are shown publicly.**
6. **Design change:** the landing page itself must be as interactive and crafted as our showcase sites, not a simple grid, and **not an all-dark theme**. §4 is rewritten accordingly.

---

## 1. What was audited

| Source | Coverage |
|---|---|
| 31 local folders (D:\Agentix Project\*, E:\*) | All read: README, configs, routes, schemas, git history, status docs |
| 36 live URLs | All loaded in Chrome (Playwright), 1440×900 screenshot + mid-page screenshot + page structure extracted |
| 2 claude.ai artifacts | Read (Santure AI CRM, Ekatva) |
| Brand assets | Agentix logo set (orange brain mark + navy/orange wordmark, tagline "AI Applied, Growth Multiplied") |

Raw screenshots from the sweep are in the session scratchpad and will be re-captured at final quality during the build.

### Discoveries that change the picture
- **"HMS by Agentix" is a hotel PMS (Woodpecker PMS), not a hospital system.** Hospital work is Gov-HIMS + Umang HIMS.
- **"Insta-agent" is the v1 prototype of SocialFlow** (instagram-automation-platform). Merge into one card.
- **auto-posting = SocialPush** (the sslip.io login URL).
- **WhatsApp-Automation = AGENTiX** at app.aiagentixdev.com — the flagship SaaS (749 commits, WhatsApp + Instagram + Google growth).
- **well-known = Dr. Shweta Diwan's site**; **yhc-platform = Your Hair Company**.
- **yt-automation.aiagentixdev.com** (multi-user YT SaaS: connect channel → plan → review → publish) is more advanced than the local `E:\YouTube-Automation\amber-light` pipeline (last commit Jul 2026). The live app's source wasn't among the folders — likely a separate repo.
- **thameswellnessspa.com** has no local folder.
- **Showcase sites are fictional brands** (17 at showcase-build), built with the "Showreel Kit". Five more kit days exist in `E:\triozen` that aren't published (watch brand, Crumb, Coral Bay, Tallow Tape, Vaskaro).
- **No cPanel / hosting-management product exists.** What exists is deployment capability: Coolify VPS + Docker (SocialFlow, LeadForge, Max Fitness, Woodpecker), cPanel/Apache (Umang site, Dr. Shweta, Fitness First), Vercel (most frontends), k8s manifests (SocialPush).

---

## 2. Project inventory (45 entries, 10 categories)

Status key: **LIVE** = in production use · **ACTIVE** = being built/iterated · **PROTO** = complete prototype/demo · **CONCEPT** = showcase build for a fictional brand · **MVP** = early/partial

Demo tier key: **A** = deep interactive app simulation · **B** = guided walkthrough with 2–4 working interactions · **C** = immersive site preview + signature interaction

### Category 1 — AI Conversational Agents (WhatsApp · Instagram · Voice)

| # | Project | Folder | Live URL | Status | What it does | Demo |
|---|---|---|---|---|---|---|
| 1 | **AGENTiX** (flagship SaaS) | D:\…\WhatsApp-Automation | app.aiagentixdev.com | LIVE · last commit 2026-10-26 | Multi-tenant AI agent for WhatsApp + Instagram: shared inbox, hot/warm/cold Kanban CRM, broadcast campaigns, templates, ReactFlow flow builder, bookings, Meta + Google lead hub, Google Business Profile, local rank, Google Ads, marketing ROI, win-back, super-admin (clients, bot health, Meta spend). ₹2,999/mo flat. | **A** — chat simulator where the AI qualifies & books → lead card moves Lead→Hot→Booked on Kanban; flow-builder canvas with trigger/condition/template nodes and a "run" that animates execution; campaign wizard with template preview + simulated delivery stats; ROI dashboard |
| 2 | **SocialFlow** (incl. InstaAgent v1) | D:\…\instagram-automation-platform, D:\…\Insta-agent | social-media.aiagentixdev.com | LIVE · 2026-10-08 | Instagram/Facebook/Telegram automation: unified AI inbox grounded in a knowledge base, comment→DM with follow-gate, keyword rules, sequences, visual flows, content studio + calendar + Fabric.js design editor, reels studio, Profile Score & Post Audit, CRM, bookings, commerce, influencers. | **A** — a comment "PRICE" on a mock post triggers auto-DM + follow-gate; inbox with AI reply from knowledge base; Profile Score gauge; content calendar |
| 3 | **VoiceCRM** | D:\…\Voice-CRM | voice-crm-snowy.vercel.app | PROTO · 2026-09-04 | CRM for an AI voice bot's calls: transcript, AI summary, sentiment, lead score, live-calls board, follow-up tasks, WhatsApp from lead page. Repo already has a seeded mock generator. | **A** — live calls board with streaming transcript; call insight panel; dashboard funnel |
| 4 | **Riya — Fitness First WhatsApp CRM** | D:\…\Fitness First CRM | — | PROTO · 2026-03-01 | Sales dashboard over the "Riya" WhatsApp bot's gym-lead conversations; scoring, sentiment, TrialBooked/Converted/Lost outcomes, follow-up tasks. | **B** — chat replay where Riya books a trial and the lead flips to TrialBooked; KPI dashboard |

### Category 2 — Content & Social Automation

| # | Project | Folder | Live URL | Status | What it does | Demo |
|---|---|---|---|---|---|---|
| 5 | **SocialPush** | D:\…\auto-posting | sslip.io /login | ACTIVE · 2026-10-13 | Write once, publish everywhere: FB, IG, YouTube, Threads, Pinterest, X. Per-platform media crops, scheduling, retrying publish workers, analytics, AI captions. Microservices + BullMQ. | **A** — composer with platform toggles and live per-platform previews → schedule → drag on calendar → watch status go Queued→Publishing→Published |
| 6 | **YT-Automation** | E:\YouTube-Automation (amber-light) + live SaaS | yt-automation.aiagentixdev.com | LIVE (SaaS) / MVP (pipeline) | Idea → AI script → narration (own voice) → AI visuals/motion clips → captions (Hindi/English) → thumbnail & SEO → human approval → publish. Hard cost ceiling per video. | **A** — type a story prompt, watch pipeline stages advance with cost meter; scene keyframe grid; approve → scheduled on calendar; embed one sample render |

### Category 3 — CRM, Sales & Lead Intelligence

| # | Project | Folder | Live URL | Status | What it does | Demo |
|---|---|---|---|---|---|---|
| 7 | **Agentix CRM** (internal agency OS) | D:\…\KanbanCRM-nodejs | — | LIVE internal · 2026-03 | Clients, project stories on a global Kanban, leads, invoices, revenue targets, Gemini proposal analysis & status emails, salary/incentives, founder-only area. | **A** — drag stories across Kanban; client detail with invoice timeline; revenue vs target insights |
| 8 | **Eurobrass CRM** | D:\…\EuroBrass | eurobrass-seven.vercel.app (/login) | ACTIVE · 2026-09-10 | Bathroom-fittings manufacturer CRM: leads, dealers + dealer portal, product series/finishes, inventory, quotation builder (PDF, simulated send), orders, service tickets & technicians, roles, audit. | **A** — build a quotation from the catalogue → send (simulated) → convert to order; dealer portal view |
| 9 | **LeadForge** | D:\…\lead-research-platform | — | ACTIVE · 2026-10-14 (phase 3 of 11) | Plain-English lead research: "dental clinics in Delhi with a website" → parsed spec → discovery → crawl → dedupe; every field carries source/URL/confidence. | **B** — sentence → parsed criteria chips → progress stream → leads table; click a cell for provenance |
| 10 | **Santure AI CRM** | claude.ai artifact | artifact link | PROTO | Operations platform for every team and brand at Santure AI (interactive prototype, demo data). | **C** — embed/preview of the existing prototype (it's ours and already fake-data) |
| 11 | **Ekatva** | claude.ai artifact | artifact link | PROTO | Relationship & operations platform for insurance and wealth distributors (interactive prototype, fictional data). | **C** — same as above |

### Category 4 — Healthcare Systems

| # | Project | Folder | Live URL | Status | What it does | Demo |
|---|---|---|---|---|---|---|
| 12 | **Agentix HIMS** (state-scale) | D:\…\Gov-HIMS | government-hims.vercel.app | PROTO · 2026-09-02 (129 commits, 261 pages) | AI-first HIMS for UP government health: 24 role portals (doctor, nurse, pharmacy, lab, OT, emergency, billing, blood bank…), patient portal, ABHA/AB-PMJAY, Health Secretary & CMO cockpits, AI triage/NEWS2/drug-safety/sepsis watch, NABH/DISHA audit. | **A** — role picker → follow one fictional patient triage→consult→lab→bill; switch to Secretary cockpit with district ranking |
| 13 | **Umang Hospital HIMS** | E:\Umang Hospital HIMS | umang-hospital-hims.vercel.app | PROTO · 2026-09-07 | Hospital OPD system: registration (form or "Asha" voice agent), reception queue, nurse vitals, doctor consult + Rx, billing, pharmacy; public live visit tracker; English/Hindi. | **A** — patient moves Registered→Vitals→Consult→Rx→Pharmacy ready, with the public tracker updating live |
| 14 | **Umang Hospital website + CMS** | D:\…\Umang2.0 | umanghospitals.in | LIVE · 2026-08-12 | ~70-route hospital website: specialities, doctor search, health checkups, telemedicine, cashless insurance, health library; lead capture; Supabase admin CMS with UTM lead table; Google Ads landing page. | **B** — site preview; doctor search by speciality; appointment form → simulated confirmation; admin leads table |

### Category 5 — Hospitality

| # | Project | Folder | Live URL | Status | What it does | Demo |
|---|---|---|---|---|---|---|
| 15 | **Woodpecker PMS** | D:\…\HMS by Agentix | hotelmanagement.aiagentixdev.com/portal | LIVE · 2026-10-27 (347 commits) | Multi-property serviced-apartment platform: reservations, tape-chart calendar, check-in & Form-C, folios & GST invoices, housekeeping, maintenance, POS/kitchen, inventory/laundry, payroll, OTA channels, dynamic pricing, booking engine, owner portal & payouts, 9 role portals, AI. | **A** — tape chart with fictional rooms (drag to extend stay) → open folio → add POS charge → generate GST invoice; occupancy/ADR/RevPAR dashboard; housekeeping board |

### Category 6 — Fitness

| # | Project | Folder | Live URL | Status | What it does | Demo |
|---|---|---|---|---|---|---|
| 16 | **Max Register** (gym CRM + kiosk) | E:\max-fitness | maxfitnessgym.co.in/crm | LIVE · 2026-10-18 (234 commits) | Hindi-first, phone-first gym CRM: "Today" tiles, members with fee-colour bands, 3-tap renew + receipt, calls list, leads funnel, selfie verify queue, attendance, WhatsApp reminder engine, face-recognition check-in kiosk, diet plans, reports. | **A** — Today dashboard → renew a member in 3 taps → receipt; WhatsApp reminder timeline with "advance time"; face check-in greeting; Hindi/English toggle |
| 17 | **Max Fitness website** | E:\max-fitness (apps/web) | maxfitnessgym.co.in | LIVE | Bilingual gym site, plans, owner story, sign-up/QR onboarding. | **B** (bundled inside #16's demo as the public side) |
| 18 | **Fitness First Dwarka** | D:\…\Fitness First | fitnessfirstdwarka.com | LIVE · 2026-10-23 | Premium gym site: hero video, programs (Les Mills), trainers, membership plans, lead forms → MySQL + email. | **B** — site preview; plan picker; "book free trial" → simulated thank-you |

### Category 7 — Multi-Product Business Platforms

| # | Project | Folder | Live URL | Status | What it does | Demo |
|---|---|---|---|---|---|---|
| 19 | **REDUX Platform** (Eurobrass) | D:\…\Redux | redux-demo-iota.vercel.app | ACTIVE · 2026-10-20 | Six connected products: website, lead CRM (Meta/Google/WhatsApp intake, city routing, SLA timers), care-executive portal, offline Android surveyor app, customer portal (quotes/jobs/invoices/warranty), admin console. | **A** — one hotel from enquiry → assigned lead → mobile survey → quote → customer approval → invoice → WhatsApp in outbox |
| 20 | **Your Hair Company** | D:\…\yhc-platform | yourhaircompany.com | ACTIVE · 2026-10-22 (demo-mode) | Doctor-led hair D2C: 3D scalp scan funnel, ₹500 video consult, doctor portal (calendar, consult room, Rx), sales CRM, WhatsApp refills, money-back guarantee tracking, shop. | **A** — scan funnel → book consult → doctor writes Rx → sales lead created; role switcher |
| 21 | **Skinwise** | D:\…\myskinwise | myskinwise.com | LIVE · 2026-09-04 | Skin-concern D2C: rules-based quiz with safety exclusions, AI photo skin scan, voice/chat assistant "Dr. Vivek", consultations, cart/checkout, admin. | **A** — 5-question quiz → routine with caution flags; mocked scan scorecard; assistant chat |
| 22 | **NRI Trust** | D:…NRI trust | nritrust.co | LIVE · 2026-05-26 | NRI advisory site with 3D globe; risk assessment engine → GREEN/ORANGE/RED persona + prioritised playbook + PDF report; client portal. | **B** — assessment → verdict + action list + mock PDF |

### Category 8 — Business Websites (Real Clients)

| # | Project | Folder | Live URL | Status | What it does | Demo |
|---|---|---|---|---|---|---|
| 23 | **AI Agentix corporate site** | D:\…\AI AGENTIX | ai-agentix.com | LIVE · 2026-07-15 | Agency site with RAG assistant that answers from site content and navigates the visitor. | Used in the portfolio's About/footer, plus **B** — mini assistant demo |
| 24 | **Dr. Shweta Diwan** | D:\…\well-known | drshwetadiwan.com | LIVE · 2026-10-23 | Nutritionist brand site + ~60-page PHP admin (blogs, case studies, orders, invoices). | **C** — site preview + lead form → thank-you |
| 25 | **Thames Wellness Spa** | — (no folder) | thameswellnessspa.com | LIVE | Luxury spa site, therapies & packages. | **C** — site preview + package picker |
| 26 | **Eurobrass corporate site** | (EuroBrass) | eurobrass-seven.vercel.app | LIVE | Brass foundry site: cast→machine→finish process, product lines, dealer login. | **C** |

### Category 9 — E-commerce Experiences (concept brands)

| # | Brand | Source | Live | Signature feature | Demo |
|---|---|---|---|---|---|
| 27 | AURELLE — sarees | E:\aurelle | /aurelle | 17-product catalog, cart & wishlist drawers, frame-sequence hero | **A** — filter by occasion → cart → mock checkout |
| 28 | VĀRA Studio — Gen Z fashion | E:\vara-studio | /vara | Canvas denim physics, filters, bag in localStorage | **B** — browse → bag drawer |
| 29 | DRIFY — streetwear | E:\drift-ecommerce | /drift | 24 products, 3D flip-in scroll | **B** — working cart + quick view |
| 30 | Fruitivo — perfume | E:\perfume-AS | /perfume | Mood selector, scent notes | **B** — mood → recommendation → cart |
| 31 | Kanak Jewels — 22K gold | triozen kit | /kanak | Live gold-rate clock re-pricing every item | **B** — move the gold rate, prices recalc, add to bag |
| 32 | Meridian — watches | triozen kit | /meridian | Exploded movement, configurator | **B** — configurator → bag |
| 33 | Dewlab — serum | triozen kit | /dewlab | Drop travels page, before/after slider | **C** |
| 34 | Melt Theory — ice cream | triozen kit | /melt | Build-a-cone with live receipt | **B** — build cone → order total |
| 35 | Zip EV — e-scooter | triozen kit | /zipev | Trackpad-steered ride with live speed/range | **B** — variant + colour picker → test ride booking |

### Category 10 — Immersive Brand Websites (concept brands)

| # | Brand | Source | Live | Signature feature | Demo |
|---|---|---|---|---|---|
| 36 | Movade — travel | E:\travel-agency | /travel | 3D depth hero, dotted world map | **C** — destination search → fake results |
| 37 | Cairnline Treks | E:\cairnline | /cairnline | Flyover films, altitude chart, departure board | **C** |
| 38 | Saffron & Smoke — restaurant | triozen kit | /saffron | Menu that "cooks" on scroll | **C** — table booking slots |
| 39 | Aurelune — villas | triozen kit | /aurelune | Rooms light up on scroll, cove map | **C** |
| 40 | Halden — smartphone launch | triozen kit | /halden | Scroll-scrubbed product film, colour picker | **C** |
| 41 | Iron Temple — gym | triozen kit | /irontemple | Load-the-bar interaction, timetable | **C** |
| 42 | Marigold Noir — wedding photo | triozen kit | /marigold | Seven-chapter film story, packages | **C** |
| 43 | Moana — cinematic hero | E:\moana | /moana | 181-frame canvas scrub | **C** |
| 43a | Coral Bay — holidays (unpublished) | E:\triozen\day-14-coral-bay | to be exported | Holiday "one scroll away" | **C** |
| 43b | Tallow & Tape — recording studio (unpublished) | E:\triozen\day-22-tallow-tape | to be exported | Studio sessions, tracks | **C** |
| 43c | Vaskaro — mountain motorcycles (unpublished) | E:\triozen\day-23-vaskaro | to be exported | "Mountain roads on a scroll wheel", test rides | **C** |
| 43d | Crumb — bakery (unpublished) | E:\triozen\day-8-Crumb | to be exported | Build-your-own box, cart | **B** — box builder + cart |

Note: Meridian (#32) is `E:\triozen\day-1-watch-brand`. Thames Wellness (#25) source is `D:\monum\Downloads\thameswellnessspa`.

### Category 11 — Infrastructure & Delivery (capability strip, not project cards)

| # | Item | Evidence |
|---|---|---|
| 44 | **Deployment & hosting** | Coolify VPS + Docker (SocialFlow, LeadForge, Max Fitness, Woodpecker, YT), cPanel/Apache + PHP/MySQL (Umang, Dr. Shweta, Fitness First), Vercel (most frontends), k8s manifests (SocialPush), Supabase (RLS, pg_cron, pgmq, pgvector) |
| 45 | **Showcase pipeline** (internal tool) | E:\showcase-tools: static-export packer, landing-card generator, Playwright responsive audit at 7 widths, Vercel deploy with cleanup |

---

## 3. Access & data-safety findings

### Logged-in areas I have NOT entered (need your call — see §6)
| App | Login type | Note |
|---|---|---|
| AGENTiX dashboard (app.aiagentixdev.com) | email/password | Production, real client conversations |
| SocialFlow dashboard | email/password | Production; App Review demo login referenced in docs |
| YT-Automation dashboard | email/password | Production |
| SocialPush | email/password | — |
| VoiceCRM | email/password | — |
| Woodpecker PMS | role logins | **Production with real guests.** Seed files define demo roles, but against live data |
| Max Register CRM | mobile + PIN | **Real gym members — do not screenshot.** Repo has DEMO_MODE + demo data |
| Agentix HIMS / Umang HIMS | role picker / demo accounts | Seeded fictional data; demo accounts in Umang HIMS README |
| REDUX | one-click demo personas | Demo deployment on demo data — safe |
| Eurobrass CRM | cosmetic ("Continue as Demo User") | Safe, but seed uses real hotel/client names (Westin, The Lalit, Medanta, DMRC) — will be replaced |

### Never used in the portfolio
- Committed `.env*` files (Umang2.0, Voice-CRM, WhatsApp-Automation, yhc-platform, KanbanCRM, amber-light, others)
- `well-known/admin/config files/hvrs_db.sql` (DB dump)
- Woodpecker root CSVs/JSON (folio audits, GST backups — real guest data)
- `myskinwise/.admin-credentials.txt`, NRI Trust hardcoded portal users
- Any real phone numbers, names, messages, invoices

---

## 4. Design direction (revised after review)

**Principle.** The landing page is itself a showreel-grade interactive site, built with the same craft as our showcase kit: smooth scrolling, scroll-driven scenes, a preloader, a custom cursor, reveal choreography. It must not read as a grid of links.

**Identity: light, with deep navy moments.** The base canvas is warm daylight paper (≈#F6F4EF) with navy ink (≈#0B1F33) and Agentix orange (≈#EE6A24) as the one accent. A few full-bleed **deep-navy bands** give rhythm and drama: the flagship scene and the demo shells' chrome. The page is not all-dark. Display type is a geometric grotesk echoing the wordmark (*Sora* / *Space Grotesk*); body *Inter*; mono for data and status chips.

**Scroll story (main page):**
1. **Preloader.** The Agentix brain mark draws itself as an SVG stroke, the wordmark letters settle, and a counter ticks 0 → 49 projects.
2. **Hero.** A kinetic headline, "AI Applied, Growth Multiplied.", over a 3D-perspective fan of real product screens that tilts with the cursor and spreads apart as you scroll (pinned). CTAs: *Explore the work* and *Watch an agent close a lead*.
3. **"One lead, every system"** (pinned, deep navy). As you scroll, a single fictional customer's journey plays across our products: a WhatsApp message (AGENTiX), a Kanban card heating up, a booking, a hospital or hotel record, an invoice, a follow-up post scheduled. It shows how our products connect.
4. **Category index.** A large editorial numbered list (01–11). Hovering a row floats that category's screenshots after the cursor; clicking jumps to the section.
5. **Category sections**, each with a different layout so the page never repeats itself:
   - Flagship platforms: sticky-left story copy with a right column of device-framed cards that rise and settle in 3D.
   - Websites: a pinned horizontal rail of browser frames whose screenshots auto-scroll.
   - Concept brands: a masonry "poster wall" with hover video or frames.
   - Healthcare / hospitality: a split-screen "control room" with live-ticking KPI chips.
6. **Delivery & infrastructure.** An animated pipeline (code → build → Docker/Coolify · Vercel · cPanel → live), with logos of the stack.
7. **Numbers + contact.** Animated counters, then a "Start a project" CTA. Footer with the Agentix logo and tagline.

**Agentix branding everywhere.** Every card carries a small "Built by AGENTiX" brain-mark badge; every demo shell shows the Agentix logo top-left; every embedded live site sits in a frame with an Agentix badge on its toolbar.

**Libraries.** This direction needs real scroll choreography, so it uses **GSAP + ScrollTrigger + Lenis**, vendored locally (no CDN dependency at runtime, still no build step). Everything else stays vanilla.

**Navigation.** Sticky top bar: logo · category rail · search (filter by name/industry/tech) · status filter (Live / Active / Prototype / Concept). The category rail is a horizontal pill row on mobile.

**Category sections.** Each category opens with a one-line value statement and a small "what this solves" line, then its cards. Layout varies per category to avoid a repetitive grid:
- Flagship platforms (Cat 1–7): **large "device" cards** — a screenshot inside a stylised app frame with a slow Ken-Burns pan across the full screenshot on hover, status chip, 3 feature tags, "Open demo →".
- Websites (Cat 8): **browser-frame cards** that auto-scroll the full-page screenshot on hover.
- Concept brands (Cat 9–10): **tall poster cards** in a horizontal scroll-snap rail, each with its signature visual; hover plays a short muted loop where a clip exists.
- Infrastructure (Cat 11): an animated diagram strip (code → build → Coolify / Vercel / cPanel → live), not cards.

**Readability.** Every card has a gradient scrim from the bottom, text set on a solid band, never directly on busy imagery.

**Motion.** CSS transitions and IntersectionObserver reveals; `prefers-reduced-motion` respected; no scroll-jacking on the main page.

---

## 5. Demo architecture

### Same-window opening
Hash routing: `#/` (portfolio) and `#/demo/<slug>`. Clicking a card does a shared-element-style transition (the card expands to full screen) and mounts the demo into a full-screen **Demo Shell**. Back button, Esc, and the shell's "← All projects" return to the exact scroll position. Deep links work (`…/#/demo/woodpecker-pms`).

### Demo Shell (consistent across all demos)
- Top bar: project name, category, status chip, **"Simulated — demo data"** badge, tabs.
- Tabs: **Overview** (problem, solution, who it's for, business outcomes) · **Walkthrough** (the interactive simulation) · **How it works** (step-by-step workflow diagram) · **Screens** (gallery of captured/recreated screens with captions) · **Tech** (stack chips).
- Every simulated action shows a toast: "Simulated — no message was sent".

### Reusable demo engines (built once, configured per project)
| Engine | Used by |
|---|---|
| **Chat simulator** (scripted conversation, typing indicator, AI reply, side panel updates) | AGENTiX, SocialFlow, Riya, Skinwise assistant, Agentix site assistant |
| **Board / Kanban** (drag & drop, card detail drawer) | AGENTiX CRM, Agentix CRM, REDUX leads, Max leads funnel |
| **Data table** (search, filters, sort, detail drawer) | VoiceCRM, Eurobrass, LeadForge, Umang admin leads, Max members |
| **Pipeline stepper** (stages advance with logs, cost meter, approve gate) | YT-Automation, SocialPush, LeadForge, REDUX job, HIMS patient journey |
| **Flow canvas** (nodes + edges in SVG, animated run) | AGENTiX flows, SocialFlow automations |
| **Dashboard kit** (KPI tiles, SVG line/bar/funnel/donut charts, date range) | All CRMs, Woodpecker, HIMS cockpits, Max reports |
| **Store kit** (catalog, filters, product drawer, cart, mock checkout) | Aurelle, VĀRA, DRIFY, Fruitivo, Kanak, Meridian, Melt, Zip EV, YHC shop |
| **Site preview** (browser/phone frame, full-page screenshot scroller, hotspots explaining features, form → simulated thank-you) | All websites and concept brands |
| **Calendar / tape chart** | Woodpecker, SocialPush, YT-Automation, YHC doctor calendar |

All demo data lives in per-project JSON-like JS files: fictional names, `+91 98xxx xxxxx` masked numbers, fake invoices. Nothing hits a network except loading static assets.

### Live site embeds (decided)
- **Concept brands (Cat 9–10):** the real site embedded live in an in-page desktop/mobile device frame (toggle), with an Agentix badge on the frame. The 17 published sites come from showcase-build-tau.vercel.app. The 4 unpublished kit sites (Coral Bay, Tallow & Tape, Vaskaro, Crumb) are statically exported with `E:\showcase-tools\add-kit-site.ps1` and added to the same showcase deployment. **Redeploying the showcase is an outward-facing step, so I'll confirm with you at that point.** Each embed has a screenshot/video fallback if it fails to load.
- **Client websites (Cat 8 + public sides of Cat 4–7):** each site is embedded live where it permits framing; every embed is checked for `X-Frame-Options`/CSP. Where framing is blocked, an interactive full-page screenshot scroller with feature hotspots is used instead. Thames Wellness is a plain static site and is bundled locally from its folder.
- The overview and walkthrough tabs still explain each site's features and value around the embed.
- **"Properly working":** the final test pass loads every embed and fails the build on any blank frame, console page error or 4xx/5xx main document.

---

## 6. Screenshot capture plan

1. **Public pages:** Playwright at 1440×900 viewport + full-page captures; also 390×844 mobile for selected cards. Already proven working on all 36 URLs.
2. **App interiors:** captured from **demo/seeded environments only** — REDUX demo, Gov/Umang HIMS seeded data, Eurobrass demo user, Voice-CRM mock mode, Max Fitness DEMO_MODE, YHC `/demo`, Woodpecker seed (run locally, not production). Where only production exists, the screen is **recreated in HTML with fake data** rather than screenshotted.
3. Every capture is reviewed for names, phones, emails and amounts; anything real is replaced or blurred before use.
4. Output: WebP at 1600w (card/hero) + 800w (thumb), lazy-loaded, `srcset`. Target: main page under ~3 MB on first load, demos load their own assets on open.

---

## 7. Technical stack & structure

- **Plain HTML + CSS + vanilla JS, no build step, no backend, no database.** Opens by double-clicking `index.html` *and* deploys to any static host (Vercel/Netlify/cPanel). Classic scripts (not ES modules) so `file://` works.
- **Runtime dependencies: GSAP + ScrollTrigger + Lenis only**, vendored in `vendor/` (needed for the showreel-grade scroll choreography, §4). Charts are hand-rolled SVG; drag-and-drop is native Pointer Events.
- Fonts self-hosted (woff2) so it works offline.

```
Agentix-presentation/
  index.html                 # portfolio shell + demo shell
  css/
    tokens.css               # colours, type, spacing (dark/light)
    portfolio.css            # hero, rail, cards
    demo-shell.css           # shared demo chrome
    engines.css              # chat, board, table, pipeline, store…
  js/
    data/projects.js         # the 45-entry inventory (name, category, status, copy, assets, demo config)
    data/demo/<slug>.js      # fictional data per demo
    core/router.js           # hash routing + transitions + scroll restore
    core/ui.js               # toasts, drawers, modals, "simulated" badge
    engines/chat.js, board.js, table.js, pipeline.js, flow.js, charts.js, store.js, site-preview.js, calendar.js
    demos/<slug>.js          # per-project composition of engines
    portfolio.js             # hero, filters, search, card rendering
  assets/
    brand/                   # Agentix logos
    shots/<slug>/*.webp      # screenshots
    video/                   # a few short muted loops (optional)
  tools/capture.js           # Playwright screenshot script (dev-only)
  docs/portfolio-plan.md
```

**Responsive.** Mobile-first; card rail becomes swipeable; demo shells switch from sidebar layouts to bottom tab bars under 768px; tables collapse to cards.

**Testing (after build).** Playwright pass over every route at 390 / 768 / 1440 widths: console errors, broken images, horizontal overflow, every demo's main interaction clicked through, and the back/forward behaviour.

### Build order (for scoping)
1. Shell, design tokens, portfolio page, all 45 cards, routing — the whole page is browsable early.
2. Engines + Tier A flagship demos (AGENTiX, SocialFlow, Woodpecker, Max Register, Agentix HIMS, Umang HIMS, REDUX, YT-Automation, SocialPush, Eurobrass, Agentix CRM, VoiceCRM, YHC, Skinwise, Aurelle).
3. Tier B and C demos.
4. Screenshot capture/redaction, responsive pass, testing.

---

## 8. Original open questions (answered — see §0)

1. **Client names & logos.** May we show real client brands (Umang Hospital, Fitness First, Max Fitness, Eurobrass/REDUX, Woodpecker, Skinwise, Your Hair Company, Dr. Shweta Diwan, Thames Wellness, NRI Trust)? Or should some be anonymised ("A 150-bed hospital in Gurugram")?
2. **Logged-in screenshots.** For production-only apps (AGENTiX, SocialFlow, YT-Automation, SocialPush, VoiceCRM), choose one:
   - (a) give me a **demo/test account with fictional data only**, and I'll capture from that;
   - (b) I **recreate the interiors** in HTML from the codebase, with no production login (my default).
   For Woodpecker and Max Register I'll use local seeded/DEMO_MODE builds, not production.
3. **Concept brands.** Should they be labelled "Concept" on the page, or presented as "Brand experiences we design"? Embedding via iframe (recommended) or preview only?
4. **cPanel / hosting.** There's no hosting-management product in the folders. Keep the proposed "Infrastructure & Delivery" capability strip, or is there a project I haven't been given?
5. **Missing sources.** Is the live YT-Automation SaaS in another folder? Is there a Thames Wellness folder? Should the five unpublished triozen days be included?
6. **Excluded on purpose:** Santure AI CRM and Ekatva are in as prototypes — confirm they can be shown publicly (they were shared with "anyone with the link").
7. **Ongoing vs completed labelling.** OK to show status chips (Live / Active / Prototype / Concept) publicly?
