---

## Cross-project intelligence

### Product families and ecosystems

| Family | Projects | How they relate |
|---|---|---|
| **AGENTiX messaging family** | AGENTiX → SocialFlow (incl. InstaAgent v1) | AGENTiX is the flagship multi-tenant AI agent for **WhatsApp + Instagram** with a shared inbox, lead-temperature CRM, campaigns, flows and Google growth tools. SocialFlow is a separate **Instagram-first** automation platform: comment→DM with follow-gate, content studio, reels, profile score and post audit. InstaAgent was SocialFlow's single-tenant first version. |
| **WhatsApp bot + CRM pairs** | Riya (Fitness First CRM), VoiceCRM | Both are dashboards that sit on top of an AI bot's conversations. Riya reads a WhatsApp gym bot's chats and tracks trials and conversions. VoiceCRM reads an AI **voice** bot's calls, with transcripts, summaries and sentiment. AGENTiX bundles the bot and the CRM in one product. |
| **Eurobrass group** | Eurobrass corporate site, Eurobrass CRM, REDUX platform | The same manufacturer. The corporate site presents the brass foundry, Eurobrass CRM runs sales (leads, dealers, quotations, orders, service), and REDUX is the separate **bath-fittings restoration** business with its own website, lead CRM, surveyor app, customer portal and admin. |
| **Umang Hospital** | Umang website + CMS, Umang Hospital HIMS, (Agentix HIMS) | The website handles patient acquisition: specialities, doctors, appointment and insurance leads, and an admin CMS. Umang HIMS runs the hospital's OPD journey. Umang HIMS was carved out of **Agentix HIMS**, the larger state-scale system built for government health with 24+ role portals and Secretary/CMO cockpits. |
| **Max Fitness** | Max Fitness website, Max Register | The public bilingual website (plans, sign-up, QR onboarding) and the owner's Hindi-first CRM (members, renewals, reminders, attendance, face check-in kiosk, reports). They share one codebase and database. |
| **Fitness First Dwarka** | Fitness First website, Riya CRM | The marketing site collects leads; the Riya WhatsApp bot and CRM handle lead conversations and trial bookings. |
| **Hospitality** | Woodpecker PMS, Kaaya Eco Resort | Woodpecker is a full multi-property **operations platform**: front desk, folios and GST invoicing, housekeeping, POS, payroll, OTA channels, owner portal, guest booking site. Kaaya is a resort's **website with booking**: rooms, availability, payments, guest accounts and an admin. |
| **D2C health & beauty** | Your Hair Company, Skinwise | Both are consumer brands that combine content with tools. YHC offers a scalp scan, paid video consultations, a doctor portal and a sales CRM. Skinwise offers a skin quiz, photo scan, text assistant, store and consultations. Skinwise no longer has a voice agent (removed 2026-10-28). |
| **Content automation** | SocialPush, YT-Automation, SocialFlow's content studio | SocialPush schedules and publishes **one post to many platforms**. YT-Automation **creates** short videos with AI and publishes them to YouTube after human approval. SocialFlow's studio and calendar are Instagram-focused. |
| **Showcase / concept brands** | 21 concept sites + showcase-pipeline | Fictional brands built to demonstrate design and motion craft, all deployed together on showcase-build-tau.vercel.app by the showcase pipeline tools. |

### Comparison: AI messaging & CRM products

| Need | AGENTiX | SocialFlow | VoiceCRM | Riya CRM |
|---|---|---|---|---|
| Channel | WhatsApp + Instagram | Instagram (+ Facebook, Telegram) | Voice calls (+ WhatsApp follow-up) | WhatsApp |
| AI agent included | Yes, live agent replies and books | Yes, AI DM replies grounded in a knowledge base | Consumes calls from a separate voice bot | Consumes chats from the separate "Riya" bot |
| CRM | Kanban with hot/warm/cold lead temperature | Contacts, leads, bookings | Leads with score, sentiment, tasks | Leads with outcomes and tasks |
| Campaigns / broadcasts | Yes | Yes | No (tasks and follow-ups) | No |
| Visual flow builder | Yes | Yes | No | No |
| Best for | Businesses selling over WhatsApp/IG | Instagram growth and creators | Teams running AI calling | A single gym's WhatsApp lead desk |

### Comparison: operations platforms

| Need | Woodpecker PMS | Agentix HIMS | Umang HIMS | Max Register | Eurobrass CRM |
|---|---|---|---|---|---|
| Industry | Serviced apartments / hotels | Government hospitals, state health | Single hospital OPD | Neighbourhood gym | Fittings manufacturer |
| Core loop | Booking → check-in → folio → GST invoice | Triage → consult → lab → pharmacy → billing → discharge | Registration → vitals → consult → billing → pharmacy | Member → fee due → reminder → renew → receipt | Lead → quotation → order → service |
| Distinctive | Tape chart, owner portal, OTA channels, payroll | Role portals, NEWS2, AB-PMJAY/ABHA, Secretary/CMO cockpits | Voice registration agent "Asha", public visit tracker, Hindi | Hindi-first, face check-in kiosk, WhatsApp reminder engine | Dealer portal, quotation PDF, technician tickets |

### Which project to mention for a requirement

| Visitor says… | Point to | Why |
|---|---|---|
| "I want an AI to reply to WhatsApp/Instagram leads and book appointments" | **AGENTiX** (`#/demo/agentix/walkthrough/conversations`) | Live AI agent, shared inbox, CRM and bookings in one product |
| "Instagram comments → DMs, follow-gate, content planning" | **SocialFlow** | Comment-to-DM automation, follow-gate, studio, profile score |
| "Post the same content to all my social accounts" | **SocialPush** | One composer, many platforms, scheduling, retries, analytics |
| "Faceless YouTube channel / AI shorts" | **YT-Automation** | Idea → script → voice → visuals → captions → human QA → publish, with a cost ceiling |
| "We use an AI calling bot and need a CRM for the calls" | **VoiceCRM** | Transcripts, summaries, sentiment, scoring, tasks |
| "Hotel / serviced apartments software" | **Woodpecker PMS**; for a resort website with booking, **Kaaya** | Full PMS vs website-plus-booking |
| "Hospital management / HIMS" | **Agentix HIMS** (multi-hospital or government scale) or **Umang HIMS** (single-hospital OPD) | Scale and scope differ |
| "Gym software" | **Max Register** (+ Max Fitness website) | Members, renewals, WhatsApp reminders, face check-in |
| "Sales CRM with quotations and dealers" | **Eurobrass CRM** | Quotation builder with GST, dealer portal, orders, service |
| "Find B2B leads from a plain-English request" | **LeadForge** (in development) | Sentence → research plan → businesses with sourced contact data |
| "Field-service business with surveys, quotes and a customer portal" | **REDUX** | Lead CRM, offline surveyor app, quotes, portal, invoices |
| "Doctor-led D2C with consultations" | **Your Hair Company** | Scan funnel, paid consults, doctor portal, sales CRM |
| "Skincare quiz and recommendations" | **Skinwise** | Rules-based quiz with safety cautions, photo scan, store |
| "NRI financial/property protection advisory" | **NRI Trust** | Risk assessment → persona → playbook → PDF report |
| "A premium, animated brand website or online store" | Concept brands, e.g. **Aurelle** (store), **Meridian** (configurator), **Cairnline** (immersive story) | Show design and motion craft |
| "Internal agency/project tracking" | **Agentix CRM** | Kanban stories, clients, invoices, revenue insights |

### Shared technology (verified across repos; see "How AI Agentix builds")
- **Next.js / React** with **Tailwind** for most web apps; **Supabase** (Postgres, auth, storage, RLS) is the most common backend; **Prisma + Postgres** is used for Woodpecker and Max.
- **Meta WhatsApp Cloud API / Instagram Graph API** for AGENTiX, SocialFlow, REDUX and Max; **Razorpay** for payments in India; **OpenAI / OpenRouter / Gemini** for AI features; **ElevenLabs** for the voices in YT-Automation and Umang HIMS's "Asha".
- Hosting: **Coolify on a VPS (Docker)** for AGENTiX, SocialFlow, Woodpecker, Max and Skinwise; **Vercel** for many frontends and demos; **Apache/cPanel or DirectAdmin** for Umang, Fitness First and Dr. Shweta Diwan.

---

## Coverage checklist

Verification levels below are taken from each project's own **Verification notes**. "Missing" lists exactly what would let the documentation be completed.

| # | Project (slug) | Level | What is missing |
|---|---|---|---|
| 1 | AGENTiX (`agentix`) | Verified (code, docs, public pages) | Logged-in app not viewed; exact per-role permission matrix; current Meta App Review / Google OAuth / GBP API approval status; "All-in-One" plan feature list |
| 2 | SocialFlow (`socialflow`) | Verified (code, docs, landing) | Logged-in app not viewed; per-role permissions; Meta Advanced Access status |
| 3 | VoiceCRM (`voicecrm`) | Partially verified | Logged-in app; which voice-bot platform feeds it |
| 4 | Riya — Fitness First CRM (`riya-crm`) | Verified (code, docs) | Whether it is in daily production use |
| 5 | SocialPush (`socialpush`) | Partially verified | Logged-in app; status of known issues (X media, Pinterest video, Meta test-users) after 2026-09-21 |
| 6 | YT-Automation (`yt-automation`) | Partially verified | Whether the live SaaS runs the local `web/` code; logged-in app |
| 7 | Agentix CRM (`agentix-crm`) | Verified (code) | None for features; internal tool, no public URL |
| 8 | Eurobrass CRM (`eurobrass-crm`) | Verified | Whether the live login uses Supabase auth or the demo gate |
| 9 | LeadForge (`leadforge`) | Verified (docs, code tree) | In development; phases 4–11 not built |
| 10 | Santure AI CRM (`santure-crm`) | Partially verified | Prototype run-through; also available as a local mirror in the portfolio |
| 11 | Ekatva (`ekatva`) | Partially verified | Whether it is a real client or a concept; prototype run-through |
| 12 | Agentix HIMS (`agentix-hims`) | Partially verified | Staff portals not entered; whether the demo reads a live DB; role count (landing says 29, older docs 24) |
| 13 | Umang Hospital HIMS (`umang-hims`) | Partially verified | Signed-in screens (demo accounts exist; not used) |
| 14 | Umang website + CMS (`umang-website`) | Verified | Admin CMS not entered; whether the notify-lead email/WhatsApp function is active |
| 15 | Woodpecker PMS (`woodpecker-pms`) | Partially verified | Staff app not entered; which integrations (payments, WhatsApp, OTA, accounting) are live vs mock |
| 16 | Kaaya Eco Resort (`kaaya-eco-resort`) | Verified (site + code) | Whether Stripe is in live mode; whether blocked dates have an admin screen; admin not entered |
| 17 | Max Register (`max-register`) | Partially verified | Production CRM (real members) deliberately not entered |
| 18 | Max Fitness website (`max-website`) | Verified | None |
| 19 | Fitness First website (`fitness-first`) | Verified | No git history; Les Mills mention only in page metadata (needs client confirmation); seasonal offers may be outdated |
| 20 | REDUX (`redux`) | Verified (code, demo) | Which integrations are live outside the demo; staff/portal screens not viewed |
| 21 | Your Hair Company (`yhc`) | Partially verified | Whether production runs demo mode or the real backend; `/demo` and `/account` not probed |
| 22 | Skinwise (`skinwise`) | Verified | Admin not accessed; which AI provider is active in production |
| 23 | NRI Trust (`nri-trust`) | Partially verified | Portal appears client-side only; production host; portal screens |
| 24 | AI Agentix corporate site (`ai-agentix-site`) | Verified | None |
| 25 | Dr. Shweta Diwan (`dr-shweta-diwan`) | Partially verified | Admin deliberately not opened (database, roles, billing unverified); no git history |
| 26 | Thames Wellness Spa (`thames-spa`) | Verified | Hosting provider; package prices |
| 27 | Eurobrass corporate site (`eurobrass-site`) | Verified | None |
| 28–48 | 21 concept brands (`aurelle`, `vara`, `drify`, `fruitivo`, `kanak`, `meridian`, `dewlab`, `melt`, `zipev`, `crumb`, `movade`, `cairnline`, `saffron`, `aurelune`, `halden`, `irontemple`, `marigold`, `moana`, `coralbay`, `tallow-tape`, `vaskaro`) | Verified (live pages + source) | None for documentation. Note that Moana is a fan concept based on a third-party film property (see its entry). |
| 49 | Deployment & hosting (`delivery-infra`) | Partially verified | Current host of each production site; whether the SocialPush k8s manifests are in use |
| 50 | Showcase pipeline (`showcase-pipeline`) | Verified | None |

**Totals:** 50 projects documented. 37 are Verified (including the 21 concept brands), and 13 are Partially verified, mostly because their logged-in production screens were intentionally not accessed. 0 projects are blocked entirely.

**To complete the partially verified entries**, the owner can provide safe demo logins or screenshots containing only demo data for:
- AGENTiX, SocialFlow, VoiceCRM, SocialPush and the YT-Automation app
- the Woodpecker staff app and the Max Register CRM (with demo members)
- the Umang HIMS / Umang CMS admin, the Kaaya admin, the Dr. Shweta Diwan admin and the NRI Trust portal

They can also confirm which integrations are live in production.

### Safety audit of this document
- No passwords, API keys, tokens, database URLs or `.env` values are included. Integrations are named and described conceptually.
- No real customer, patient, member, guest or employee records are included. All example names are fictional.
- Production systems are labelled. The voice agent must not perform actions on them, and should use the portfolio demo (fictional data, simulated actions) to show functionality.
