# Part 1: AI Conversational Agents, Content & Social Automation, CRM / Sales / Lead Intelligence

Scope of this part: 11 projects. Portfolio base URL: https://agentix-portfolio.vercel.app/ (planned hosted URL). Portfolio demos are "Safe demo: fictional data, all actions simulated". Interactive walkthrough modules currently exist for AGENTiX, SocialFlow, VoiceCRM, SocialPush and YT-Automation. Riya, Agentix CRM, Eurobrass CRM, LeadForge, Santure AI CRM and Ekatva have a project page (overview, how it works, screens, tech) but no interactive module file in `js/demos/` at the time of writing, so a walkthrough link for them opens the guided tab, not a clickable simulation.

Evidence labels used: **Verified** (seen in code and/or live public page and/or reliable project doc), **Partially verified**, **Unverified**, **Unavailable**.

---

## AI Conversational Agents

### AGENTiX

**Slug:** `agentix` · **Also known as:** AGENTiX app, WhatsApp-Automation (folder name), "the flagship SaaS" · **Category:** AI Conversational Agents / **Subcategory:** WhatsApp + Instagram AI agent with CRM and Google growth tools · **Status:** Live (Verified, public marketing pages loaded; app behind login)
**Client / owner:** AI Agentix (own product, sold to small and medium businesses; also used for agency-managed client workspaces) · **Local folder:** `D:\Agentix Project\WhatsApp-Automation` · **Last activity:** 2026-10-28 (about 769 commits)

#### Spoken introduction
AGENTiX is our flagship product: an AI agent that answers your customers on WhatsApp and Instagram, qualifies them, and drops each one onto a hot, warm or cold board so your team calls the right person first. On top of that it has campaigns, bookings, a Google Business Profile and Google Ads toolkit, and a marketing ROI view. It is sold at flat monthly pricing in rupees, with a three day free trial.

#### Quick overview
AGENTiX is a multi-tenant SaaS built for growing Indian businesses. Each business gets its own workspace with a shared WhatsApp and Instagram inbox, a bundled live AI agent grounded in the business's own knowledge base, and a Kanban CRM that scores every conversation automatically. Around that core sit broadcast campaigns, message templates, a visual flow builder, bookings, a unified lead hub that collects leads from every channel, Google Business Profile management, Google Ads reporting and lead capture, local rank tracking, cross-channel marketing ROI, and a super-admin console for agencies. It solves lost leads from slow replies and the five-tool juggling of chat, CRM, campaigns, Google presence and reporting.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| Main site / app | https://app.aiagentixdev.com/ | Production (real clients), marketing pages are a Public marketing site; app is Login required | Do not perform actions in the app; it holds real client conversations |
| Features | https://app.aiagentixdev.com/features | Public marketing site | Verified loaded |
| Pricing | https://app.aiagentixdev.com/pricing | Public marketing site | Verified loaded |
| Free Google Business Profile report | https://app.aiagentixdev.com/gbp-report | Public marketing site | Free, instant, no signup; health score for a Google Business Profile |
| Security | https://app.aiagentixdev.com/security | Public marketing site | |
| Docs and help | https://app.aiagentixdev.com/docs | Public marketing site | Getting-started and billing help topics |
| Login / signup | https://app.aiagentixdev.com/login (and /signup) | Login required | No credentials in this KB |
| Portfolio demo overview | https://agentix-portfolio.vercel.app/#/demo/agentix/overview | Safe demo | Fictional data |
| Portfolio walkthrough | https://agentix-portfolio.vercel.app/#/demo/agentix/walkthrough | Safe demo | Starts on the Dashboard module |
| Walkthrough: Conversations | https://agentix-portfolio.vercel.app/#/demo/agentix/walkthrough/conversations | Safe demo | AI chat that qualifies and books |
| Walkthrough: CRM | https://agentix-portfolio.vercel.app/#/demo/agentix/walkthrough/crm | Safe demo | Hot/warm/cold Kanban |
| Walkthrough: Flows | https://agentix-portfolio.vercel.app/#/demo/agentix/walkthrough/flows | Safe demo | Flow builder canvas |
| Walkthrough: Campaigns | https://agentix-portfolio.vercel.app/#/demo/agentix/walkthrough/campaigns | Safe demo | |
| Walkthrough: Marketing ROI | https://agentix-portfolio.vercel.app/#/demo/agentix/walkthrough/roi | Safe demo | |

Portfolio demo module ids (from `js/demos/agentix.js`): dashboard, conversations, crm, contacts, leads, campaigns, templates, flows, segments, winback, referrals, bookings, tasks, team, knowledge, ai-revenue, copilot, google-ads, gbp, local-rank, roi, analytics, billing.

#### Target users & business problem
Target users are owners and front-desk teams of local and service businesses in India (clinics, salons, gyms, studios, shops), plus agencies running many such clients. The problem: enquiries arrive on WhatsApp and Instagram at all hours, replies are slow, leads sit in personal phones, follow-up is manual, and ad spend and Google presence are managed in disconnected tools. AGENTiX answers instantly, sorts leads, and ties spend to leads.

#### Features (complete inventory)
Evidence for the feature inventory below: the Next.js route tree (`app/(dashboard)/*`, `app/(admin)/admin/*`, `app/(marketing)/*`, `app/(auth)/*`), API route folders (`app/api/*`), `modules/*`, `lib/*`, docs (`docs/agentix-vs-grexa-comparison.md`, `docs/phase1-unified-lead-hub-spec.md`, `docs/phase2-gbp-spec.md`, `docs/phase4-google-ads-spec.md`, `docs/google-integration-runbook.md`, `docs/platform-backlog.md`), and the live public pages. Status per group is given in each heading.

**Public marketing site (Verified).** Pages: home, features (WhatsApp automation, AI agent, campaigns and broadcasts, CRM with lead temperature, shared team inbox, analytics and reports), pricing, security, docs/help, FAQ, about, contact, integrations, Free GBP Report, referral landing (`/r/[code]`), legal pages (privacy, terms, data deletion). Marketing copy states: 3-day free trial with no card; the AI agent is bundled, not an add-on; no per-agent seats; no per-conversation Meta markup. Evidence: live pages fetched.

**Pricing (Verified from live /pricing page).** Core (WhatsApp) at Rs 2,999 per month excluding 18 percent GST (shown as Rs 3,539 including GST on the monthly term); terms offered: monthly, quarterly, 6-month, yearly. Add-ons: Instagram automation (+Rs 999 per month: auto-reply to DMs, comments and follow-first) and Google Growth (+Rs 999 per month: Business Profile, Ads, Local Rank and reviews). An All-in-One plan at Rs 4,999 is advertised. Core includes: live AI agent, shared inbox, Kanban CRM with automatic hot/warm/cold scoring, campaigns, broadcasts and templates, in-chat Razorpay payment links. Prices on the page can change; quote them as "listed on the pricing page at the time of the check".

**1. Shared inbox and conversations (Verified).** Route `/conversations` and `/conversations/[id]`; API `app/api/conversations`, `messages`, `quick-replies`, `labels`, `inbox-rules`, `sla`. One real-time inbox for WhatsApp and Instagram DMs. Per the comparison doc it supports assignment to team members, statuses, labels, spam and sentiment flags, snooze, internal notes, media and templates, a campaign-scoped chat view, bot pause and human handoff, auto CSAT, auto-resolve and auto-tagging. Inputs: inbound WhatsApp Cloud API and Instagram webhooks (`app/api/webhooks/whatsapp`, `/instagram`, `/meta`). Output: messages stored per workspace and shown live (Supabase realtime plus socket client). Business use: no more juggled phones. Limitation: requires a connected WhatsApp Business number via the official API. Evidence: routes, docs, live features page.

**2. AI agent (auto-reply bot) (Verified).** Code in `lib/ai-reply.ts`, `lib/ai-client.ts`, `lib/ai-router.ts`, `lib/embeddings.ts`, `services/ai`, `app/api/ai`. The agent answers in the business's own persona, grounded in the knowledge base (RAG with pgvector), supports English, Hindi, Hinglish and several Indian languages (per comparison doc), can send interactive buttons, fails over between AI providers, applies business-only guardrails (anti-hallucination prompts), qualifies leads and offers booking slots. Operators can pause the bot on a conversation and take over. The pricing and offer the bot quotes come from the Knowledge Base offer state (an offer needs an end date; see backlog). Evidence: code and docs; behaviour inside real workspaces not observed.

**3. Knowledge base (Verified).** Route `/knowledge-base`; API `knowledge-base`, `vector-kb`, `offer`. Upload services, pricing, policies and offers; documents are embedded and used by the AI. A recent change requires offers to have an end date, and the campaign wizard warns when the bot would quote an expired or not-started offer (backlog entries dated 2026-10-28). Evidence: `docs/platform-backlog.md`, code.

**4. CRM pipeline with hot/warm/cold scoring (Verified).** Route `/crm`; API `leads`, `lead-rules`. Kanban of leads by pipeline stage with AI lead scoring, temperature (hot, warm, cold) and cool-down, assignment and stage history. An internal analysis doc (2026-10-05) describes consolidating three separate classification systems (keyword temperature, AI stage classifier, AI score) into one score-driven engine with per-client thresholds and explainability; treat the unified engine as an in-progress direction, not confirmed shipped. Cron `reclassify-leads` exists. Evidence: code, docs.

**5. Contacts and Contact 360 (Verified).** Route `/contacts`; API `contacts`, `contact-lists`, `custom-fields`. Profiles with conversations, orders, CSAT, lifetime value, tags, temperature, VIP and lifecycle flags, CSV and bulk import, custom fields, and a cross-channel journey timeline.

**6. Unified lead hub (Verified).** Route `/leads` and `/meta-leads`; spec `docs/phase1-unified-lead-hub-spec.md`. Every lead from WhatsApp, Instagram, Meta Lead Ads, Google Ads lead forms, Google Business, website forms, chat widget, campaigns, public API and manual entry in one place, tagged with source/channel and first and last touch, with a source-breakdown chart, filters, export and a Google Sheets sync (`lib/lead-sheet-sync.ts`). Webhooks `google-ads-leads` and Meta lead ads feed it. Evidence: spec and code.

**7. Campaigns and broadcasts (Verified).** Routes `/campaigns`, `/campaigns/[id]`; crons `process-campaign-queue`, `run-scheduled-campaigns`, `sync-campaign-replies`. Template broadcasts to segmented audiences, scheduling, A/B testing, carousel, limited-time offers, media headers, per-recipient delivery/read/reply statistics, reply attribution, one-click retargeting and exports. A review step in the wizard shows what offer the bot will quote.

**8. Templates (Verified).** Route `/templates`; API `templates`, `wa-forms`. Manage WhatsApp message templates, submit to Meta for approval, header media, and native WhatsApp Flows/in-chat forms.

**9. Segments (Verified).** Route `/segments`. Audience filters reused by campaigns.

**10. Flow builder (Verified).** Routes `/flows`, `/flows/[id]`; code `lib/flow-engine.ts`, `lib/flow-nodes`, `lib/flow-validate.ts`; API `flows`, `flows-native`. Visual ReactFlow canvas with trigger, condition and action nodes, templates, validation and a flow session engine with cleanup cron.

**11. Automation (Verified).** API `automation-triggers`, `time-trigger-config`, `sequences`; crons `time-triggers`, `automation-triggers`, `process-follow-up-sequences`, `auto-assign`, `auto-csat`. Inbox rules, time-triggered messages, follow-up sequences, abandoned-cart and Shopify webhook (`webhooks/abandoned-cart`), birthday and re-engagement triggers, auto-assignment.

**12. Win-back (Verified).** Route `/win-back`. Targets leads that went quiet; offered as a campaign type using cool-down data.

**13. Referrals (Verified).** Route `/referrals` and public `/r/[code]`; API `referrals`. Referral codes and landing.

**14. Bookings and Google Calendar (Verified).** Route `/bookings`; API `bookings`, `business-hours`; `lib/google-calendar.ts`. Appointments created by the AI agent or staff, shown with a Google Calendar badge when synced. A runbook notes that a "Connect Google Calendar" button on the Bookings page was a pending UI item for Google's OAuth verification (see Planned).

**15. Tasks (Verified).** Route `/tasks`. Follow-up tasks for the team.

**16. Team and roles (Verified).** Routes `/team`, `/team/[id]`; accept-invite flow; roles and per-member permissions (see roles section); cron `check-sla-breaches`.

**17. AI revenue (Verified).** Route `/ai-revenue`; API `ai`. Lead scoring insights, revenue insights, best-send-hour and hot-lead detection.

**18. Growth Copilot (Partially verified).** Route `/growth-copilot`; API `growth-copilot`. An AI recommendations surface for growth; detailed behaviour not documented in files read.

**19. Google Business Profile (Partially verified: software built; live data gated by Google approval).** Route `/google-business`; API `gbp`, `gbp-report`; spec `docs/phase2-gbp-spec.md`. Connect a Business Profile; manage reviews (AI-drafted reply, human approve, then post), posts (offers, updates, events), Q&A, and performance insights (views, calls, directions). The comparison doc states live GBP data begins once Google approves the Business Profile API access request; the OAuth verification doc says the Business Profile API returns quota 0 until that separate approval, and the GBP connect button was to be hidden until then. Public `/gbp-report` free health-score tool is live.

**20. Google Ads (Partially verified).** Route `/google-ads`; API `google-ads`; spec `docs/phase4-google-ads-spec.md`. Lead capture from Google Ads lead forms works through a webhook into the lead hub; reporting (campaigns, spend, clicks, conversions) appears once the account is connected and running campaigns. Google's OAuth verification of the requested scopes was reported in progress (reply pending as of the doc dated after 2026-09-17).

**21. Local rank tracking (Verified in code).** Route `/local-rank`; `lib/local-rank.ts`. Tracks local search ranking for keywords; relies on a Google Places API key (a backlog item notes the key must be regenerated and restricted).

**22. Marketing ROI (Verified).** Route `/marketing-roi`; `lib/meta-ads-sync.ts`, `lib/google-ads-sync.ts`, `lib/lead-attribution.ts`. Cross-channel view: spend, leads, conversions, cost per lead and conversion rate per channel, joining Google Ads spend and WhatsApp messaging cost with leads.

**23. Analytics and reports (Verified).** Route `/analytics`; API `analytics`, `reports`, `dashboard-stats`; crons for daily, weekly and monthly digests. KPIs, message funnel, delivery/read/reply rates, CSAT, conversations, leads, campaigns, agents; CSV export.

**24. Dashboard (Verified).** Route `/dashboard`. Overview tiles, counts and recent activity.

**25. Billing and subscription (Verified).** Route `/billing`; `lib/billing.ts`, `billing-guard.ts`, `entitlements.ts`; Razorpay subscriptions, checkout, invoices, plans, plus pages `/payment-required` and `/session-limit`. A billing go-live runbook exists (`docs/billing-go-live-runbook.md`).

**26. Settings and onboarding (Verified).** Routes `/settings`, `/settings/profile`, `/onboarding`, `/onboarding/whatsapp`; workspace creation and selection; chat widget (`/widget/[workspaceId]`, API `chat-widgets`, `widget`); catalog and orders (`catalog`, `orders`); QR code (`qr-code`); public REST API (`app/api/v1`) with API keys; audit logs; support tickets.

**27. Super-admin console (Verified in code).** Routes under `/admin`: overview, clients and client detail, bot health, AI tokens, analytics, billing, revenue, Meta spend and Meta billing, communications, inboxes, health, settings and support. Used by AI Agentix staff to run many client workspaces. Crons `tenant-health`, `health-monitor`, `meta-spend-sync`.

#### Key workflows (end to end)
1. A business signs up (3-day trial), creates a workspace, connects a WhatsApp Business number through the official API, and optionally Instagram.
2. It uploads services, pricing, policies and offers to the Knowledge Base and sets the AI persona.
3. A customer messages on WhatsApp or Instagram; the webhook stores the message; the AI replies from the knowledge base, scores the lead and can offer booking slots.
4. The conversation appears in the shared inbox; staff can pause the bot, assign, label or add notes.
5. The lead lands on the Kanban as hot, warm or cold; staff are tasked to follow up; bookings go to the calendar.
6. Campaigns, templates, flows and win-back sequences bring customers back; replies are attributed to campaigns.
7. Meta Lead Ads, Google Ads lead forms and website forms feed the same lead hub; marketing ROI combines spend and leads.
8. Errors and limits: role permissions are enforced server-side (403 when denied), billing guard blocks unpaid workspaces, and session limits apply.

#### User roles & permissions
Roles verified in `types/auth.types.ts`: `super_admin`, `admin`, `manager`, `agent`. Permissions are a named list per role (for example manage workspace, view analytics, billing management); `resolveMemberAccess` also honours configured roles, per-member overrides and page grants. Workspace members can be suspended. A platform-level super admin sees the `/admin` console. Exact permission-by-role matrix beyond these names was not transcribed.

#### Technical architecture & integrations
Frontend: Next.js 16 App Router, React 19, Tailwind, ReactFlow, socket.io client. Backend: Next.js route handlers plus service modules; cron endpoints under `app/api/cron`. Database/auth: Supabase Postgres with row-level security, pgvector for the knowledge base, Supabase Auth with email verification and invites. AI: OpenAI via SDK with a provider router and failover. Integrations: WhatsApp Cloud API, Instagram messaging, Meta Lead Ads, Google Business Profile, Google Ads, Google Calendar, Google Places, Google Sheets, Razorpay, Shopify (abandoned cart). Hosting: Docker on a Coolify VPS (Dockerfile present); public domain app.aiagentixdev.com. Credentials are stored encrypted per workspace (`lib/crypto-vault.ts`) and platform secrets are server environment variables. Evidence: package.json, Dockerfile, code, security page. Limitations noted in docs: GBP API quota pending; Google OAuth verification pending; no SOC 2 or ISO 27001 certification (stated on the security page).

#### Business value & example scenarios
Owners no longer lose leads to slow replies; the team calls hot leads first; campaigns and Google tools sit in one place; the price is flat. Scenario 1: "Riverside Dental Clinic" gets an Instagram DM at 11 pm asking about whitening; the agent answers from the price list, collects a name and preferred slot, books it, and the lead shows as Booked next morning. Scenario 2: the same clinic sends a win-back broadcast to patients quiet for 30 days and sees replies attributed to the campaign.

#### Planned / in progress (not live)
From `docs/platform-backlog.md` (started 2026-10-28): rotating exposed credentials (security hygiene), dashboard warning for lapsed offers, remind-before-offer-lapse, fixing inflated conversation totals under filters, investigating conversations with multiple lead rows. From docs: Google Business Profile live data after Google API approval, Google Ads and Calendar OAuth verification, a "Connect Google Calendar" button on Bookings, unified lead classification engine. Native mobile apps are not built (the comparison doc lists this as a gap versus a competitor).

#### Example visitor questions & answers
- **What does AGENTiX do?** It is an AI agent for WhatsApp and Instagram with a shared inbox, hot/warm/cold CRM, campaigns, bookings and Google growth tools.
- **How much does it cost?** The pricing page lists Core (WhatsApp) at Rs 2,999 per month before 18 percent GST, with Instagram and Google Growth add-ons at Rs 999 each per month and an All-in-One plan at Rs 4,999; there is a 3-day free trial.
- **Is the AI an extra charge?** No, the pricing page says the live AI agent is bundled.
- **Can I see a demo?** Yes, a safe simulated one: https://agentix-portfolio.vercel.app/#/demo/agentix/walkthrough. All data is fictional.
- **Does it replace Google Business Profile tools?** It includes review replies, posts, Q&A and insights; live data depends on Google approving API access.
- **Is my data separated from other businesses?** Yes, each workspace is isolated with row-level security, per the security page.
- **Which languages?** English, Hindi, Hinglish and several Indian languages, according to project docs.

#### Related projects
SocialFlow focuses on Instagram, Facebook and Telegram content and comment-to-DM; AGENTiX is WhatsApp-first with CRM and Google tools. VoiceCRM and Riya are CRMs over voice and WhatsApp bots. Redux and Woodpecker in other parts use similar lead and WhatsApp ideas for specific clients.

#### Verification notes
Checked: full route tree, API folders, docs, package.json, git log count, and live public pages (features, pricing, security, docs, gbp-report). Not verified: any behaviour inside the logged-in app (no production login used); exact permission matrix; live Google data. Missing: demo workspace credentials or screenshots of the dashboard, the final All-in-One feature list on the pricing page, and a statement of how many clients are live.

---

### SocialFlow

**Slug:** `socialflow` · **Also known as:** AGENTiX SocialFlow, AI-Agentix SocialFlow, InstaAgent (v1 prototype in `Insta-agent`) · **Category:** AI Conversational Agents / **Subcategory:** Instagram, Facebook and Telegram social automation · **Status:** Live (Verified, public landing page loaded; app behind login; Meta App Review for Advanced Access in progress per docs)
**Client / owner:** AI Agentix (own product; first onboarded client workspace referenced in docs is a wellness-spa brand) · **Local folder:** `D:\Agentix Project\instagram-automation-platform` (current) and `D:\Agentix Project\Insta-agent` (v1) · **Last activity:** 2026-10-08 (about 99 commits) for the platform; 2026-05-25 (2 commits) for v1

#### Spoken introduction
SocialFlow is our social media operating system: one AI inbox for Instagram, Facebook and Telegram, comment-to-DM automation with a follow check, a content studio with scheduling, and a CRM behind it all. It started as a small Instagram DM bot called InstaAgent and grew into a full multi-tenant platform. You can try a simulated version in the portfolio.

#### Quick overview
SocialFlow lets a business connect its Instagram professional account (and Facebook and Telegram) and have AI answer DMs and comments from a knowledge base and brand persona. Public comments on a post can trigger a private DM, optionally gated on the user following the account. It also has visual automation flows, keyword rules and sequences, a content studio with a calendar and a design editor, a Reels studio, profile and post audits, a CRM with pipeline, bookings, commerce, influencer tracking and ads, and a platform admin console. It addresses DM overload, manual comment replies, missing CRM for Instagram, and inconsistent posting.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| Landing page | https://social-media.aiagentixdev.com/ | Public marketing site (production app behind login) | Verified loaded: features, steps, plans |
| Login | https://social-media.aiagentixdev.com/login | Login required | No credentials in KB |
| Privacy | https://social-media.aiagentixdev.com/privacy | Public site | Needed for Meta review |
| Data deletion | https://social-media.aiagentixdev.com/data-deletion | Public site | |
| Portfolio demo overview | https://agentix-portfolio.vercel.app/#/demo/socialflow/overview | Safe demo | |
| Portfolio walkthrough | https://agentix-portfolio.vercel.app/#/demo/socialflow/walkthrough | Safe demo | Starts on the inbox |
| Walkthrough: Unified inbox | .../walkthrough/inbox | Safe demo | AI reply from knowledge base |
| Walkthrough: Comment to DM | .../walkthrough/comment-dm | Safe demo | Follow-gate flow |
| Walkthrough: Profile score | .../walkthrough/profile-score | Safe demo | |
| Walkthrough: Content calendar | .../walkthrough/calendar | Safe demo | |

(Walkthrough links are under https://agentix-portfolio.vercel.app/#/demo/socialflow/. Module ids from `js/demos/socialflow.js`: inbox, comment-dm, rules, sequences, flows, health, contacts, leads, bookings, campaigns, products, orders, influencers, ads, studio, calendar, approvals, design, reels, profile-score, post-audit, analytics, knowledge, team, channels.)

#### Target users & business problem
Brands, creators, and agencies that sell through Instagram and receive hundreds of DMs and comments but can answer only a fraction. The platform automates the volume and leaves relationships to humans, while staying inside Meta's 24-hour messaging window rules.

#### Features (complete inventory)
Evidence: route tree in `instagram-automation-platform/app`, 29 numbered design docs in `docs/` (vision, architecture, multi-tenant, schema, inbox, AI, content studio, campaigns, workflows, CRM, analytics, influencer, commerce, ads, advanced AI, collaboration, PWA, security, API, background services, DevOps, roadmap, platform admin, multi-channel, content intelligence), the Meta App Review pack, and the live landing page. The design docs describe intended scope; the routes show what pages exist. Each group is labelled accordingly.

**Landing page (Verified).** Claims: unified AI inbox, comment-to-DM with follow-gate, visual automations, AI trained on your knowledge base and persona, content and scheduling, CRM and leads, analytics and reports, secure isolated tenants. Works across Instagram, Facebook, Telegram, LinkedIn and YouTube is displayed as a platform strip; only Instagram, Facebook and Telegram are described as connectable now (the multi-channel design doc says LinkedIn, YouTube and others are phased; treat those as planned). Plans shown on the landing page: Starter Rs 999 per month (1 social account, AI auto-reply, inbox and CRM, 5,000 messages), Pro Rs 2,999 (3 accounts, AI chatbot and comment-to-DM, campaigns and content scheduling, workflow automation, 25,000 messages), Enterprise Rs 7,999 (10 accounts, influencer, commerce and ads, priority support, 100,000 messages). Plans can change.

**Unified inbox (Verified in code and docs).** Route `/conversations`. DMs, story replies, story mentions and post comments; assignment, roles, 24-hour window countdown and guard, templates for re-engagement. Inputs: Instagram webhooks (HMAC-verified). Output: conversation threads in realtime.

**AI auto-reply (Verified).** Docs `07-ai-automation.md`; route `/knowledge-base`; settings brand and voice. Replies grounded in the knowledge base (pgvector) and a persona; human handoff. Brand voice settings (sample posts, positions, proof, never-say words, keyword CTA) feed every prompt.

**Comment to DM with follow-gate (Verified in design and landing; mechanics in code).** Keyword-triggered auto-DM and public comment reply; optional auto-like and a follow check before delivering the item. Routes under `/automation/rules`.

**Automation: rules, sequences, flows, health (Verified).** `/automation/rules` (keyword rules), `/automation/sequences` (timed message sequences), `/automation/flows` and `/automation/flows/[id]` (visual trigger, condition, action builder), `/automation/health` (account and automation health).

**Contacts, leads and CRM (Verified).** `/contacts`, `/contacts/[id]`, `/leads`. Every DM contact becomes a CRM record with lead score, temperature and pipeline stage; notes, tags, follow-ups.

**Bookings, commerce, influencers, ads (Verified as pages).** `/bookings`, `/commerce/products`, `/commerce/orders`, `/influencers`, `/ads`. Influencer CRM with deliverables, product and order management, Meta ads lead sync (design docs 13 to 15). The extent of commerce and ads integrations beyond pages is Partially verified.

**Campaigns (Verified).** `/campaigns`, `/campaigns/[id]`. Window-compliant broadcasts only (contacts with an active window), with policy violation guard at send time.

**Content studio and calendar (Verified).** `/content`, `/content/studio` (AI studio: captions, hooks, hashtags), `/content/plans` (auto-pilot content plans), `/content/design` (design canvas built on Fabric.js), `/content/reels` (Reels studio: idea to scored hooks to script to beat sheet to draft), approval queue, and a cron that publishes approved scheduled posts. Caption Coach lints captions live (hashtag cap of five, first 125 characters, humanizer removing stock AI phrases).

**Growth: Profile Score and Post Audit (Verified).** `/growth/profile` scores an account against a 12-item, 100-point rubric with fix-first rewrites and history; `/growth/audit` ranks the account's own posts by outlier multiple and explains why. Reach/views/saves need the `instagram_business_manage_insights` permission, enabled only after Meta approval.

**Analytics (Verified).** `/analytics`. KPI overview, agent performance, campaign funnels; exports.

**Settings (Verified).** Brand, channels (connect Instagram via Business Login; Telegram connect form), billing, API keys; team and invites; notifications; help center; setup wizard; onboarding by tokenised link (`/onboard/[token]`); embeddable chat widget.

**Platform admin (Verified in routes).** `/platform-admin`: workspaces, admins, AI, analytics, approvals, audit, automation, communication, feature flags, health, integrations, Meta, onboarding, payments, plans, reports, revenue, search, security and 2FA, settings, support tickets.

**InstaAgent v1 (Verified, small).** `Insta-agent`: Next.js app with a single dashboard page, webhook route receiving Instagram DMs, AI replies through OpenRouter with a model fallback chain, conversation and send routes, Supabase storage; privacy policy, terms and user-data-deletion documents. It was the proof of concept before SocialFlow.

#### Key workflows (end to end)
1. Agency creates a workspace (or sends a tokenised onboarding link); client logs in and connects Instagram with "Connect with Instagram" (one central Meta app model recommended; per-client Meta app is an alternative).
2. Add knowledge base and brand persona.
3. Create a comment-to-DM rule for a post keyword; a commenter triggers a public reply and a private DM, optionally after a follow check.
4. AI answers DMs; leads are created in the CRM; humans take over when needed.
5. Plan content in the studio, approve, schedule; the cron publishes at the scheduled time.
6. Review Profile Score and Post Audit; run window-compliant campaigns.

#### User roles & permissions
Roles in code: `super_admin`, `admin`, `manager`, `agent` (workspace); platform admins separately with 2FA. Exact permission matrix not transcribed.

#### Technical architecture & integrations
Next.js 16, React 19, Supabase (Postgres with RLS, pgvector, cron-driven background routes), Fabric.js for the design editor, Instagram Business Login and Graph API, Telegram Bot API, OpenAI-compatible AI providers. Docker deployment on Coolify (DEPLOYMENT.md, Dockerfile). Evidence: package.json, docs, route tree.

#### Business value & example scenarios
Replies to most DMs automatically, turns comments into leads, keeps a consistent posting schedule, and gives agencies one multi-tenant console. Scenario: "Lumen Skin Studio" runs a post saying "comment PRICE for the rate card"; each commenter gets a public thank-you and a DM; those who follow receive the rate card and appear as leads.

#### Planned / in progress (not live)
Meta App Review resubmission for Advanced Access (five Instagram permissions: basic, manage messages, manage comments, content publish, Human Agent), after earlier rejections for vague descriptions and incomplete screencasts; until approved each client's Instagram account must be added as a tester. Multi-channel expansion (LinkedIn, YouTube, X, TikTok, Pinterest) is a design, not live. Insights-based audit metrics wait on permission approval. No automated outreach DMs or scraping by design.

#### Example visitor questions & answers
- **Is SocialFlow the same as InstaAgent?** InstaAgent was the first small prototype; SocialFlow is the full platform.
- **Does it work on Instagram comments?** Yes, the comment-to-DM flow with optional follow check is a core feature.
- **Which platforms?** Instagram and Facebook and Telegram are the connectable channels now; others are planned.
- **Can I see a demo?** https://agentix-portfolio.vercel.app/#/demo/socialflow/walkthrough, simulated with fictional data.
- **What does it cost?** The landing page lists Starter Rs 999, Pro Rs 2,999 and Enterprise Rs 7,999 per month.
- **Will Meta ban my account for bulk DMs?** The design only allows window-compliant messages and avoids scraping or unsolicited outreach.

#### Related projects
AGENTiX is the WhatsApp equivalent; SocialPush publishes posts to many platforms but does not run inbox automation; YT-Automation does YouTube video production.

#### Verification notes
Checked: route tree, docs index, Meta review pack, landing page, v1 source tree. Not verified: logged-in dashboard, live Meta approval state today, actual client counts. Missing: demo login or screenshots of the dashboard, and the current outcome of the Meta App Review.

---

### VoiceCRM

**Slug:** `voicecrm` · **Also known as:** Voice-CRM, WhatsApp CRM (Supabase powered) in its README · **Category:** AI Conversational Agents / **Subcategory:** CRM for an AI voice bot's calls · **Status:** Prototype (Partially verified; login page reached, interior not seen)
**Client / owner:** AI Agentix (voice-bot sales calling for the team) · **Local folder:** `D:\Agentix Project\Voice-CRM` · **Last activity:** 2026-09-04 (about 102 commits)

#### Spoken introduction
VoiceCRM is the control room for an AI calling bot. It shows live calls, transcripts, summaries, sentiment and lead scores, and turns outcomes into follow-up tasks for the human team. It is a working prototype with a demo in the portfolio.

#### Quick overview
An AI voice bot places and receives sales calls and records results into a Google Sheet and Supabase. VoiceCRM reads that data and gives managers a dashboard, a live calls board, a call list with recordings, per-call insights, a lead explorer with detail pages, follow-up tasks, reports, exports and team management, and lets staff message a lead on WhatsApp from the lead page. Admins see everything; callers, validators and field agents see role-specific navigation.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| App | https://voice-crm-snowy.vercel.app/ | Login required | Title "VoiceCRM, AI-Powered Lead Management"; login page only |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/voicecrm/overview | Safe demo | |
| Portfolio walkthrough | https://agentix-portfolio.vercel.app/#/demo/voicecrm/walkthrough | Safe demo | |
| Live calls | .../walkthrough/live-calls | Safe demo | |
| Call insights | .../walkthrough/insights | Safe demo | |
| Leads | .../walkthrough/leads | Safe demo | |
| Follow-up tasks | .../walkthrough/tasks | Safe demo | |

(Base for relative links: https://agentix-portfolio.vercel.app/#/demo/voicecrm/. Module ids: dashboard, live-calls, calls, insights, leads, tasks, reports, exports, employees.)

#### Target users & business problem
Sales managers and callers who use an AI voice bot to dial leads and need to see what happened on each call, who is hot, and what to do next. Problem: call outcomes live in spreadsheets and nobody follows up consistently.

#### Features (complete inventory)
Evidence: `frontend/src/app/routes.tsx`, pages under `frontend/src/pages`, `backend/src/routes.ts`, `frontend/src/data/types.ts`, README, a seeded mock provider in `frontend/src/mock`.

**Dashboard (Verified).** Route `/`. KPIs with a date-range picker (presets and custom) persisted locally; funnel and sentiment trend charts; hot-lead tracking.

**Live calls (Verified, admin only).** Route `/live-calls`; API `/live/activity`. Board of calls by status (To Call, Calling, Done, Missed, Demo Booked, Callback), summary counts for today, active, recent completed and failed calls, duration and sentiment (Hot, Warm, Cold), auto-refresh interval selectable.

**Calls (Verified, admin only).** Route `/calls`. Call history with recordings; `/recordings/download` proxies audio downloads.

**Call insights (Verified, admin only).** Route `/call-insights`. Transcript, AI summary, sentiment, score per call.

**Leads explorer and lead detail (Verified, all roles).** Routes `/leads`, `/leads/:id`. Search and filters, status updates, activity timeline, pipeline stage log, outcomes (Converted, Lost, No Response, Follow-up Needed, Reschedule), and WhatsApp messages and templates sent from the lead page (WhatsApp Cloud API webhook and send endpoints).

**Tasks and follow-ups (Verified, all roles).** Route `/tasks`. Create, bulk-create, update and delete tasks; stats; employees see their own.

**Reports (Verified, admin).** Route `/reports`. Conversion ratio, sentiment split, agent performance.

**Exports (Verified, admin).** Route `/exports`. CSV export with a history list of export jobs.

**Settings, profile, team (Verified).** `/settings` (theme, alert preferences for hot leads, completed calls and due tasks, refresh interval, data status including database and Google Sheet sync), `/profile`, employees management API.

**Login (Verified).** `/login`; protected routes; backend `/auth/login`; admin-only user management.

#### Key workflows (end to end)
1. The voice bot calls leads from a Google Sheet queue; call results (status, sentiment, recording URL, duration) land in Supabase.
2. Manager opens the dashboard and live board to watch calls in progress.
3. After a call ends, insights show summary and score; hot leads raise an alert.
4. Staff open the lead, review activity, send a WhatsApp follow-up, and create a task.
5. Outcomes are recorded and reports and exports are generated.

#### User roles & permissions
Roles in code: admin, employee, caller, validator, field_agent. Admin sees Calls, Live calls, Insights, Reports, Exports and Settings; all roles see Leads, Tasks (own tasks for non-admin) and Profile; each role has its own sidebar. Evidence: `routes.tsx` (AdminRoute guard), `Sidebar.tsx`.

#### Technical architecture & integrations
Frontend: Vite, React, TypeScript, TanStack Query, Tailwind, Framer Motion. Backend: Express (TypeScript) with Zod, deployed on Vercel (vercel.json). Database: Supabase Postgres. Data source: AI voice bot via Google Sheet and Supabase tables; WhatsApp Cloud API for messaging. Auth: backend login with API key header. The data provider is forced to the real backend in code (mock provider exists for demos).

#### Business value & example scenarios
One screen to see every call and act on it. Scenario: "Meera" a caller sees a Hot lead flagged after a demo-interested call, opens the lead, sends a WhatsApp brochure, and sets a follow-up task for tomorrow.

#### Planned / in progress (not live)
No roadmap file found. The repository README is partly generic and still describes a WhatsApp CRM, which indicates the product evolved from a WhatsApp CRM codebase.

#### Example visitor questions & answers
- **Does VoiceCRM make the calls?** No, an AI voice bot makes the calls; VoiceCRM is the CRM and monitoring layer.
- **What does it show about a call?** Transcript, summary, sentiment, score and recording.
- **Can I see a demo?** https://agentix-portfolio.vercel.app/#/demo/voicecrm/walkthrough with fictional data.
- **Who can use which screens?** Admins see everything; other roles see leads and tasks.
- **Can staff message leads on WhatsApp?** Yes, from the lead detail page.

#### Related projects
Riya CRM is the WhatsApp-bot version of the same idea for a gym; AGENTiX is the general WhatsApp and Instagram agent.

#### Verification notes
Checked: routes, page list, backend routes, types, live login page. Not verified: logged-in app, the exact voice-bot vendor, transcript source. Missing: demo credentials or screenshots, the name of the voice platform feeding the sheet.

---

### Riya, Fitness First WhatsApp CRM

**Slug:** `riya-crm` · **Also known as:** Fitness First CRM, Fitness First Dwarka WhatsApp CRM · **Category:** AI Conversational Agents / **Subcategory:** CRM dashboard over a WhatsApp sales bot · **Status:** Prototype (Verified in code and architecture doc; no public URL)
**Client / owner:** Fitness First Dwarka (a gym) · **Local folder:** `D:\Agentix Project\Fitness First CRM` · **Last activity:** 2026-03-01 (about 13 commits)

#### Spoken introduction
Riya is the WhatsApp assistant that talks to gym leads for Fitness First, and this project is the sales dashboard behind her. It replaces a Google Sheet with a live view of leads, conversations, tasks and trial bookings.

#### Quick overview
The bot "Riya" handles inbound enquiries on WhatsApp and logs each message to Supabase. The CRM turns those rows into leads, scores them, shows sentiment, and lets sales staff record outcomes (Trial Booked, Converted, Lost, Callback) and follow-up tasks. It is an internal dashboard without login, designed for a trusted network.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| Public app | None | n/a | No deployment found |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/riya-crm/overview | Safe demo | Guided tab |
| Portfolio walkthrough | https://agentix-portfolio.vercel.app/#/demo/riya-crm/walkthrough | Safe demo | Chat replay and KPI dashboard (tier B) |

#### Target users & business problem
Gym sales agents who follow up WhatsApp leads. Problem: lead tracking lived in a Google Sheet with no scoring, tasks or outcome tracking.

#### Features (complete inventory)
Evidence: `ARCHITECTURE.md` (generated 2026-04-11), `frontend/src/pages`, `backend/src/routes.ts`.

**Dashboard (Verified).** Route `/`. KPIs: total leads, today's counts, hot leads.
**Leads explorer and lead detail (Verified).** `/leads` with hot/warm/cold bucket filter, `/leads/:id` (id is the phone number). Notes, assignment to an agent, conversation history.
**Conversations (Verified).** `/conversations`: session list and message thread (Riya's responses and the lead's messages, with conversation stage: Initial Contact, Inquiry, Solution Provided, Conversion Attempt).
**Live inbox (Verified).** `/live-inbox`: polls every 30 seconds.
**Lead insights (Verified).** `/lead-insights`: bot performance analytics.
**Outcomes (Verified).** Mark TrialBooked, Converted, Lost, Callback.
**Tasks and follow-ups (Verified).** `/tasks` with a create form; statuses; overdue not auto-detected.
**Reports and exports (Verified).** `/reports` CSV downloads, `/exports` multi-format page; the xlsx format is stubbed.
**Settings (Partially verified).** Theme toggle; save button is a UI stub.
**Bot webhook (Verified).** `POST /webhook/whatsapp` lets the bot (an n8n workflow per the doc) insert conversation rows.

#### Key workflows (end to end)
1. A lead messages the gym on WhatsApp; Riya replies and each exchange is written to the conversation table with a session id and AI summary.
2. The CRM groups rows by phone into leads and scores them.
3. A sales agent reviews hot leads, adds notes, assigns the lead, creates a follow-up task.
4. The agent records an outcome (trial booked, converted, lost).
5. Reports export to CSV.

#### User roles & permissions
None implemented: no frontend login; backend uses a static API key header that can be disabled. The doc lists "CRM Agent" and "Bot" as actors.

#### Technical architecture & integrations
React 19, Vite, TanStack Query and Table, Recharts, Tailwind v4; Express backend with Zod; Supabase Postgres (four tables with permissive RLS). No deployment files. Known gaps from the architecture doc: no auth, scoring keywords copied from a grain CRM, export filename leftover, no tests.

#### Business value & example scenarios
Gives the front desk a priority list. Scenario: a hot lead asks about Les Mills classes; Riya answers; the agent sees it flagged and books a trial call.

#### Planned / in progress (not live)
Gap list in the architecture doc: authentication, database-level filtering, automated overdue tasks, realtime updates, xlsx export.

#### Example visitor questions & answers
- **Who is Riya?** The WhatsApp bot for Fitness First Dwarka.
- **Is the dashboard live?** No public URL; it is an internal prototype.
- **What outcomes does it track?** Trial Booked, Converted, Lost, Callback.
- **Can I see a demo?** https://agentix-portfolio.vercel.app/#/demo/riya-crm/walkthrough (fictional).

#### Related projects
VoiceCRM (same codebase lineage, voice calls); Fitness First Dwarka website and Max Register gym CRM in other parts.

#### Verification notes
Checked: README, ARCHITECTURE.md, route files, folder. Not verified: bot behaviour (lives in an n8n workflow outside the folder). Missing: live deployment or screenshots, and confirmation of whether the CRM is in daily use.

---

## Content & Social Automation

### SocialPush

**Slug:** `socialpush` · **Also known as:** Social Studio, auto-posting (folder name) · **Category:** Content & Social Automation / **Subcategory:** multi-platform scheduling and publishing · **Status:** In development, deployed login page (Partially verified)
**Client / owner:** AI Agentix · **Local folder:** `D:\Agentix Project\auto-posting` · **Last activity:** 2026-10-13 (about 32 commits)

#### Spoken introduction
SocialPush is write once, publish everywhere. You connect your social accounts, write a post with an image or video, pick the platforms, and publish now or schedule it. Background workers do the publishing and report back.

#### Quick overview
A scheduling and publishing tool for Facebook Pages, Instagram business accounts, YouTube, Threads, Pinterest and X (Twitter). Media is cropped per platform, scheduling is done through a queue with retries, analytics are synced back, and an AI assistant helps with captions. It is built as microservices with a Next.js dashboard.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| App login | https://pwolpx2j8r3vh5di5q1e0gdn.76.13.250.173.sslip.io/login | Login required | Verified: "Social Studio, Welcome back, Log in to manage your posts and channels", with links to About, Privacy, Terms |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/socialpush/overview | Safe demo | |
| Portfolio walkthrough | https://agentix-portfolio.vercel.app/#/demo/socialpush/walkthrough | Safe demo | |
| Composer | .../walkthrough/composer | Safe demo | Platform toggles and previews |
| Calendar | .../walkthrough/calendar | Safe demo | |
| Posts | .../walkthrough/posts | Safe demo | Queued, Publishing, Published |

(Base: https://agentix-portfolio.vercel.app/#/demo/socialpush/. Module ids: overview, accounts, composer, posts, calendar, analytics, comments, assistant, team.)

#### Target users & business problem
Small teams and agencies who post the same content to several networks and want one composer, a calendar and reliable scheduled publishing.

#### Features (complete inventory)
Evidence: `README.md`, `docs/CURRENT_STATE.md` (snapshot 2026-09-21), `docs/KNOWN_ISSUES.md`, Next.js page tree, services folder.

**Accounts (Verified).** `/dashboard/accounts`. OAuth connect for Twitter/X, Facebook Pages, Instagram business, YouTube, Pinterest and Threads; LinkedIn is link-only and TikTok is a stub in the code per the state doc. Facebook uses the first Page, Instagram the first linked account (no picker).
**Composer and previews (Verified).** `/dashboard/posts`: text, media upload with transcoded preview, per-platform preview cards (Instagram, TikTok, Pinterest, generic), reel toggle, platform selection, publish now or schedule.
**Media processing (Verified).** media-service uses sharp for images and ffmpeg for video with per-platform aspect ratios (reels 9:16).
**Scheduling and queue (Verified).** scheduling-service plus BullMQ on Redis; one delayed job per platform; the worker retries transient failures up to three times (fixed 2026-09-22).
**Publishing adapters (Verified).** Facebook (text, photo, reel), Instagram (image, reel), YouTube (resumable chunked upload, Shorts), Threads (text, image, video), Pinterest (boards import and create), X (text only).
**Calendar (Verified).** `/dashboard/calendar`: FullCalendar month and week view with aggregate status including Partially Published, platform chips. Reschedule is not done.
**Analytics (Partially verified).** `/dashboard/analytics`: backend sync for YouTube, Pinterest and Threads; the state doc flagged the UI display of new data as broken.
**Comments (Partially verified).** `/dashboard/comments` page exists; depth not confirmed.
**AI assistant (Verified as a page and package).** `/dashboard/ai-assistant`; `packages/ai` with generate, classify and quota modules for captions.
**Overview, settings, team (Verified).** `/dashboard/overview`, `/dashboard/settings`, team-service with invites and basic roles.
**Notifications (Partially verified).** In-app via realtime; email mocked.
**Billing (Partially verified).** Plan toggle only, mocked.
**Legal pages (Verified).** About, privacy, terms, data deletion.

#### Key workflows (end to end)
1. Log in; connect accounts through OAuth.
2. Compose a post, upload media, choose platforms and view each preview.
3. Publish now or pick a time; scheduling-service creates delayed queue jobs per platform.
4. At the time, the worker calls publishing-service, which uses the platform adapter; the result updates post status and notifies the user.
5. Analytics sync periodically; the calendar shows queued, publishing and published states.

#### User roles & permissions
Teams with roles (auto-team on first login, invite existing users, role checks). No member removal or role editing yet.

#### Technical architecture & integrations
Next.js App Router, React, Tailwind, FullCalendar; Node/Express microservices (account, analytics, media, notification, post, publishing, scheduling, team, worker); Supabase Postgres/Auth/Storage; Redis and BullMQ; sharp and ffmpeg; Docker compose for Redis, k8s manifests present but marked as referencing nonexistent images. Frontend on Vercel earlier; the sslip.io URL suggests a VPS deployment. Evidence: package.json, docs. Known limits (KNOWN_ISSUES.md): no backend authentication on internal services at the time of the snapshot, a hardcoded fallback encryption key, tokens (other than YouTube) never refresh, localhost URLs in the frontend at that time, platform OAuth works for test users until app review.

#### Business value & example scenarios
One composer for six networks. Scenario: "Harbor Coffee" schedules a reel for Friday 6 pm to Instagram, Facebook and YouTube Shorts in one action.

#### Planned / in progress (not live)
Calendar steps beyond read-only (drag to reschedule), cancel/edit scheduled posts, token refresh for Meta and Pinterest, real billing, LinkedIn and TikTok connectors, Threads analytics scope, security hardening. Note: the 2026-10-13 commits state a security hardening and publishing fix, so parts of the older issue list may be resolved.

#### Example visitor questions & answers
- **Which platforms?** Facebook Pages, Instagram, YouTube, Threads, Pinterest and X; LinkedIn and TikTok are not real yet.
- **Can I schedule?** Yes, through a queue with retries.
- **Can I see a demo?** https://agentix-portfolio.vercel.app/#/demo/socialpush/walkthrough (simulated).
- **Is it production?** It is in active development; the login page is public.

#### Related projects
SocialFlow (inbox automation and content on Instagram), YT-Automation (YouTube video creation and approval).

#### Verification notes
Checked: README, state and known-issues docs, route tree, services, live login page. The state doc is a 2026-09-21 snapshot; later commits exist. Missing: logged-in screenshots, current fix status of known issues, whether platform app reviews are approved.

---

### YT-Automation

**Slug:** `yt-automation` · **Also known as:** Amber Light Stories pipeline (first tenant), amber-light · **Category:** Content & Social Automation / **Subcategory:** AI YouTube video production SaaS · **Status:** Live SaaS (Partially verified: public pages seen) and local pipeline/dashboard source (Verified in code)
**Client / owner:** AI Agentix product; "Amber Light Stories" is only the first tenant channel · **Local folder:** `E:\YouTube-Automation\amber-light` · **Last activity:** 2026-07-26 (about 165 commits)

Label note: the live SaaS at yt-automation.aiagentixdev.com was reviewed only through its public pages. The local folder contains a Python pipeline and a Next.js web app (`web/`) with pages that match a multi-tenant dashboard. Whether the deployed SaaS is built from exactly this web app was not confirmed.

#### Spoken introduction
YT-Automation turns an idea into a finished vertical video with AI visuals, a narrated voice and captions in Hindi or English, then waits for a human to approve it before uploading to YouTube. It has a hard cost cap per video. It is invite-only.

#### Quick overview
A multi-tenant SaaS for creators and agencies. Each client workspace brings its own provider keys, connects a YouTube channel, sets a content plan and brand, and reviews generated videos. The pipeline runs research, script, storyboard, scene breakdown, character assignment, keyframe images, motion clips, voice, music and effects, subtitles, render, thumbnail, metadata, human review, schedule and publish.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| Welcome page | https://yt-automation.aiagentixdev.com/welcome | Public marketing site | Verified |
| Privacy | https://yt-automation.aiagentixdev.com/privacy | Public | Last updated 24 July 2026 |
| Terms | https://yt-automation.aiagentixdev.com/terms | Public | |
| App | https://yt-automation.aiagentixdev.com/ | Login required | Invite-only |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/yt-automation/overview | Safe demo | |
| Portfolio walkthrough | https://agentix-portfolio.vercel.app/#/demo/yt-automation/walkthrough | Safe demo | |
| Generate | .../walkthrough/generate | Safe demo | Pipeline stages with a cost meter |
| Scenes | .../walkthrough/scenes | Safe demo | Keyframe grid |
| Approvals | .../walkthrough/approvals | Safe demo | |
| Calendar | .../walkthrough/calendar | Safe demo | |

(Base: https://agentix-portfolio.vercel.app/#/demo/yt-automation/. Module ids: generate, pipeline, scenes, characters, approvals, calendar, library, analytics, brand, prompts, api, logs, health.)

#### Target users & business problem
Creators, agencies and brands that publish daily short-form video and want it produced by AI without losing control or overspending.

#### Features (complete inventory)
Evidence for public claims: welcome, privacy and terms pages (live). Evidence for the rest: `web/src/app` route tree, `docs/PRODUCT-VISION.md`, `docs/product-bible/PART-*`, `pipeline/*.py`, `docs/PRODUCTION_DEPLOYMENT.md`.

**Live public claims (Verified).** Real AI video, not slideshows: each scene gets an AI keyframe animated into a clip, assembled into a 1080 by 1920 vertical video. Narration with ElevenLabs. Hindi and English burned-in captions that render Devanagari. Bring-your-own provider keys (OpenAI, Gemini, ElevenLabs, fal.ai), stored encrypted per workspace. A per-video budget ceiling with fallback to cheaper rendering. Nothing publishes without approval. Four steps: connect channel, set content plan, review, publish and track. Analytics flow back from YouTube.

**Client workspace screens (Verified in code).** analytics, api-management, approvals, assets, automation, billing, brand, calendar, characters, developer, generate, health, library, logs, manual mode, notifications, operations, pipeline, planner, profile, prompts, publishing, rendering, review (with stage review), roles, scenes, schedule, security, settings and model settings, stories (and story detail), strategy, style, support, team, uploads, usage, videos, voices, workers, workspace, youtube. Authentication pages: login, forgot and reset password, change password, onboarding by tokenised link with a waiting screen.

**Platform admin screens (Verified in code).** admin: clients and client detail, onboarding, plans, flags, gateway (AI gateway), routing, pipeline, queue and jobs, observability, health, maintenance, usage, reports, security, API, announcements, theme. Platform and workspace are deliberately separate systems.

**Pipeline (Verified).** Stage list in `pipeline/persist.py`: topic, research, script, storyboard, scene breakdown, character assignment, scene prompt generation, keyframe images, motion clips, voice, background music, sound effects, subtitles, transitions, render, thumbnail, metadata, human review, schedule, publish. Cost governor enforces a per-video budget and downgrades models; a model routing and asset library module reuse assets before generating; local motion fallback; FFmpeg render worker. Manual mode pauses at every stage; automatic mode proceeds.

**Phase 1 channel pipeline (Verified).** The README describes the original single-channel version: one video per day generated at 03:00 US Eastern, QA gate, published at 09:00, Gmail confirmation, QA API bound to localhost.

#### Key workflows (end to end)
1. Super admin creates a client; the client opens an onboarding link, changes password, and lands in its workspace.
2. Client adds provider keys, connects YouTube, defines brand, characters and content plan.
3. A story or idea is generated; the pipeline produces scenes, voice, captions and thumbnail with a live cost meter.
4. Reviewer approves, requests changes or rejects.
5. Approved videos are scheduled and uploaded; analytics return to the dashboard.

#### User roles & permissions
Design docs define a platform plane (Super Admin and operators) and a tenant plane (owner, admin, editor, reviewer, analyst, viewer and others, with custom roles planned); the two planes are disjoint. Exact implemented roles not transcribed.

#### Technical architecture & integrations
Next.js web app on Vercel (control plane) and a Python render worker with FFmpeg on an always-on host; Supabase (Postgres, Vault for per-tenant keys, a durable jobs table, cron drains); OpenAI and Gemini for text, fal.ai for images and video motion, ElevenLabs for voice, YouTube Data and Analytics APIs, Gmail for notifications. The live SaaS domain runs under aiagentixdev.com.

#### Business value & example scenarios
Cuts per-video production effort and keeps cost bounded. Scenario: "Little Lanterns" channel submits a bedtime story brief; the pipeline produces a 60-second Hindi short; the owner approves it and it is scheduled for 9 am.

#### Planned / in progress (not live)
The product bible describes white-label, enterprise and ecosystem parts and a migration backlog; the deployment doc lists unset values for a dedicated Web OAuth client for tenant YouTube connect at the time of writing. Treat these as roadmap.

#### Example visitor questions & answers
- **Does it publish automatically?** No, every video waits for your approval.
- **What does it cost to generate a video?** The pipeline enforces a per-video ceiling; the portfolio demo shows a sample cost breakdown, which is illustrative.
- **Can I sign up?** It is invite-only; accounts are created by a manager.
- **Hindi supported?** Yes, captions in Hindi and English.
- **Can I see a demo?** https://agentix-portfolio.vercel.app/#/demo/yt-automation/walkthrough.

#### Related projects
SocialPush publishes created content to other networks; SocialFlow covers Instagram.

#### Verification notes
Checked: public pages, local route tree, docs, pipeline files, git log. Not verified: logged-in SaaS, whether deployed code equals the local web folder, actual tenants. Missing: demo login, deployed commit or repo link.

---

## CRM, Sales & Lead Intelligence

### Agentix CRM

**Slug:** `agentix-crm` · **Also known as:** KanbanCRM, KanbanCRM-nodejs · **Category:** CRM, Sales & Lead Intelligence / **Subcategory:** internal agency operating system · **Status:** Internal (Verified in code; no public URL)
**Client / owner:** AI Agentix (internal) · **Local folder:** `D:\Agentix Project\KanbanCRM-nodejs` · **Last activity:** 2026-03-17 (about 89 commits)

#### Spoken introduction
Agentix CRM is the system we run our own agency on: clients, project tasks on a Kanban board, leads, invoices, revenue targets, announcements, and HR records, with AI help for proposals and status emails.

#### Quick overview
A desktop-first CRM with an Apple-style glass look. Teams manage clients, break work into stories on a global Kanban, discuss in comments, track invoices and revenue, and capture leads. Google Gemini analyzes uploaded proposals into tasks and drafts status emails. There is a founder-only internal area and HR-restricted salary and incentive pages.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| App | None | Internal | Not public |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/agentix-crm/overview | Safe demo | Fictional data |
| Portfolio walkthrough | https://agentix-portfolio.vercel.app/#/demo/agentix-crm/walkthrough | Safe demo | Kanban, client detail, insights |

#### Target users & business problem
Agency founders, managers and employees who need one place for clients, delivery and money. Problem: scattered spreadsheets and chats for projects, invoices and incentives.

#### Features (complete inventory)
Evidence: `client/src/App.tsx` routes, `server/routes.ts`, `shared/schema.ts`, `replit.md`.

**Dashboard (Verified).** `/`.
**Global Kanban (Verified).** `/global-kanban`; stories with status (default To Do), priority, assignee, estimated and actual hours, due date, progress percent, tags; drag and drop; threaded comments; activity log; notifications; cron deadline reminders by email.
**Clients (Verified).** `/clients`, `/clients/:id`: company, owner, industry, stage, expected revenue, contract end date, contact details, proposal file, average progress, communications log, invoices with attachments.
**Proposal analysis (Verified).** `POST /api/analyze-proposal` (Gemini) extracts a summary and tasks; `create-tasks-from-proposal` converts to stories.
**Status emails (Verified).** `generate-email` with Gemini, saved in a sent-emails table.
**Leads (Verified).** `/leads`: contact, industry, stage, estimated value, owner, assignee.
**Insights (Verified).** `/insights/revenue`, `/insights/clients`, `/insights/stories`, `/insights/completion`; revenue targets endpoint.
**Announcements (Verified).** `/announcements`.
**Internal (Verified).** `/internal`: founder investments (with file attachments), internal documents, shareholding per co-founder; co-founder only.
**Salary and incentives (Verified).** `/salary`: salary records and incentives, restricted to owner or HR.
**Settings and login (Verified).** `/settings`, `/auth` (Google sign-in).

#### Key workflows (end to end)
1. Sign in with Google; the user type is co-founder, HR or employee based on configured emails.
2. Create a client and upload a proposal; Gemini turns it into tasks on the board.
3. Move stories across Kanban columns; comments and activity are logged; deadline reminders send.
4. Raise invoices against a client; revenue totals roll up into insights against targets.
5. Owner or HR manages salary and incentives; founders manage the internal area.

#### User roles & permissions
Roles: admin, editor, viewer, plus HR; user types: co-founder, employee, HR. Owner/HR guard on salary and incentive APIs (403 otherwise). Co-founder access to the internal area.

#### Technical architecture & integrations
React 18, Vite, Wouter, TanStack Query, Radix and shadcn/ui, Tailwind v4; Express with Passport Google OAuth and sessions in Postgres; Drizzle ORM on Postgres/Supabase; Gemini 2.0 Flash; email service; deployment scripts for a VPS and Hostinger; a Laravel migration plan exists but is a plan.

#### Business value & example scenarios
Single internal source of truth. Scenario: a signed proposal for "Bluebird Realty" is uploaded; fifteen tasks appear on the board; the first invoice moves revenue toward the monthly target.

#### Planned / in progress (not live)
Laravel/MySQL migration plan for shared hosting (plan only).

#### Example visitor questions & answers
- **Is this a product I can buy?** No, it is our internal tool; the portfolio shows a simulated version.
- **Does it use AI?** Yes, Gemini analyzes proposals and drafts emails.
- **Can I see a demo?** https://agentix-portfolio.vercel.app/#/demo/agentix-crm/walkthrough.

#### Related projects
Santure AI CRM is a larger operations concept; LeadForge could feed leads.

#### Verification notes
Checked: schema, routes, pages, replit.md. Not run live. Missing: current production URL (not public), screenshots.

---

### Eurobrass CRM

**Slug:** `eurobrass-crm` · **Also known as:** EuroBrass CRM, Eurobrass portal · **Category:** CRM, Sales & Lead Intelligence / **Subcategory:** manufacturer and dealer CRM · **Status:** In development (Verified code; public corporate site and demo login verified)
**Client / owner:** Eurobrass (brass fittings manufacturer) · **Local folder:** `D:\Agentix Project\EuroBrass` · **Last activity:** 2026-09-10 (about 110 commits)

Safety note: the project's seed data contained real client names; this KB uses none. Use only fictional examples.

#### Spoken introduction
The Eurobrass CRM runs sales for a brass fittings manufacturer: leads, dealers, a product catalogue, quotations, orders, inventory and service tickets. The public site presents the foundry and has a demo login.

#### Quick overview
It started as a frontend-only click-through demo and is moving to a real Supabase-backed system. Modules cover leads on a Kanban, customers by segment, a dealer network with a dealer portal view, products with series and finishes, a quotation builder with GST math and simulated send, orders, inventory, service tickets and technicians, employees, roles and permissions, audit log, analytics and reports.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| Corporate site | https://eurobrass-seven.vercel.app/ | Public site | Verified: "Precision Brass Foundry and Machine Works, Est. 1974", process cast, machine, finish; six product lines |
| Login | https://eurobrass-seven.vercel.app/login | Safe demo environment | "Sign in to the CRM" with a "Continue as Demo User" button |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/eurobrass-crm/overview | Safe demo | |
| Portfolio walkthrough | https://agentix-portfolio.vercel.app/#/demo/eurobrass-crm/walkthrough | Safe demo | Quotation to order |

#### Target users & business problem
Sales managers, executives, dealers, service technicians and auditors of a manufacturer who sells through dealers and projects. Problem: quotes, orders, dealers and service tracked in spreadsheets.

#### Features (complete inventory)
Evidence: `app/(app)/*` routes, `features/*`, `types/*`, design specs in `docs/superpowers/specs`.

**Dashboard (Verified).** `/dashboard`. **Analytics (Verified).** `/analytics`. **Reports (Verified).** `/reports` with date range filters (today, week, month, quarter, year, custom).
**Leads (Verified).** `/leads` Kanban with stages New, Contacted, Quoted, Negotiation, Won, Lost; create and edit manually; card and form dialogs.
**Customers (Verified).** `/customers`, `/customers/[id]`: segments (Architects, Builders, Hotels, Hospitals, OEM), order value, remarks, billing details, history.
**Dealers (Verified).** `/dealers`: business-model classification (Factory OEM, Channel OEM and others), create and edit. **Dealer portal (Verified).** `/dealer-portal`: portal-style view.
**Products (Verified).** `/products`, `/products/[id]`: series, finishes, SKUs; CSV product import with tests.
**Quotations (Verified).** `/quotations`, `/quotations/new`, `/quotations/[id]`: line items, GST math, statuses Draft, Sent, Approved, Converted, Rejected, simulated send by email, WhatsApp or PDF.
**Orders (Verified).** `/orders`: statuses Confirmed, In Production, Dispatched, Delivered; payment status Unpaid, Partially Paid, Paid; views by client, category and dealer.
**Inventory (Verified).** `/inventory`. **Service (Verified).** `/service`: tickets Open, Assigned, In Progress, Resolved, Closed and technicians.
**Employees, roles, audit, notifications, settings (Verified).** `/employees`, `/roles` (permission matrix per module: view, create, edit, remove), `/audit`, `/notifications`, `/settings`.

#### Key workflows (end to end)
1. Enter through the demo gate or real login.
2. Capture a lead, qualify it, assign it, move it through stages.
3. Build a quotation from the catalogue with GST; send (simulated) by email, WhatsApp or PDF.
4. Convert an approved quotation to an order; track production, dispatch and payment.
5. Raise service tickets for installed products and assign technicians.
6. Review dashboards and audit log.

#### User roles & permissions
Seeded roles: Administrator, Sales Manager, Sales Executive, Service Technician, Dealer, Auditor (read-only), each with a per-module permission matrix. Enforcement is planned (see below).

#### Technical architecture & integrations
Next.js App Router, React, TypeScript, Tailwind, shadcn/ui, Framer Motion, Zustand with localStorage persistence, Recharts, React Hook Form and zod, Vitest tests. Supabase foundation (migrations 0001 to 0005 for reference data, customers, sales, operations) with a mapping layer and product import was added in September 2026. Hosted on Vercel.

#### Business value & example scenarios
Faster quoting and one view of dealers and orders. Scenario: a dealer in "Northfield Hardware" requests a quote for a polished valve series; the sales executive builds it, sends it, and converts it to an order after approval.

#### Planned / in progress (not live)
Per the 2026-09-09 spec: Supabase server components migration (1b), enforced roles with region scoping (2), write-side gaps like product management, deletes, direct orders, employee CRUD and working audit log (3), cross-CRM search, tasks, file attachments (4). The Projects module was removed.

#### Example visitor questions & answers
- **Can I try the CRM?** The login page has a demo user button; the portfolio has a safe simulated version.
- **Does it send real quotations?** Sending is simulated in the demo.
- **Who are the roles?** Admin, sales manager, sales executive, technician, dealer, auditor.

#### Related projects
REDUX platform for the same client (another part) is a broader multi-product system; Agentix CRM is internal.

#### Verification notes
Checked: public site and login page, route tree, specs, types. Not verified: whether the live login uses real Supabase auth or the demo gate today. Missing: confirmation of which data the live deployment holds.

---

### LeadForge

**Slug:** `leadforge` · **Also known as:** lead-research-platform · **Category:** CRM, Sales & Lead Intelligence / **Subcategory:** AI lead research with provenance · **Status:** In development, phase 3 of 11 (Verified from PROGRESS.md and PHASES.md; no public URL)
**Client / owner:** AI Agentix · **Local folder:** `D:\Agentix Project\lead-research-platform` · **Last activity:** 2026-10-14 (about 130 commits)

#### Spoken introduction
LeadForge turns a plain-English request like "dental clinics in Delhi with a website" into a researched, deduplicated list of businesses, where every value shows its source and confidence. It is under active development and not yet public.

#### Quick overview
Describe the leads you need; the system compiles an editable research spec, discovers candidates from open and licensed sources, crawls their websites politely, extracts contact data, merges duplicates, and stores each field with provenance. The long-term product exports to Sheets, Excel, CSV or CRMs and bills in credits in INR.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| App | None | n/a | In development, internal |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/leadforge/overview | Safe demo | |
| Portfolio walkthrough | https://agentix-portfolio.vercel.app/#/demo/leadforge/walkthrough | Safe demo | Sentence to criteria chips to progress to leads table |

#### Target users & business problem
Indian SMB sales teams, agencies, consultants and founders prospecting local businesses, SaaS or hiring-signal leads. Problem: static databases are stale and unsourced.

#### Features (complete inventory)
Evidence: `docs/00-PRODUCT-BRIEF.md`, `phases/PHASES.md`, `PROGRESS.md`, `apps/web` pages, `services/workers`, `DEMO.md`.

**Built (Verified).**
- Sign up, login and onboarding; app pages: dashboard, new research, research history, research job detail.
- Natural-language research compiled into a ResearchSpec; job runs with live progress.
- Discovery from an open dataset (Overture Maps release on local disk, per decision ADR-0017) rather than paid APIs; a Delhi run returned 225 unique candidates with 13,663 values and no provenance gaps in about six minutes at zero credits.
- Crawling and extraction (phase 3 in progress): polite crawler, sitemap handling, raw page store with retention, JSON-LD and text extractors, phone normalisation, email validation and MX lookup, best-value selection, and a golden corpus of 50 labelled sites with 95.2 percent recall and zero false positives (2026-10-14).
- Provenance: every field value carries source URL, time and confidence; lead drawer shows grouped fields including technology.
- Admin area: connectors health, jobs and job detail, orgs, users, crawl health panel with metrics.
- Credits model: free plan with 50 credits, a standard lead costs 3 credits, quick depth 1 (per DEMO.md).

**Planned (not live):** see below.

#### Key workflows (end to end)
1. Sign in; type a request.
2. Review the parsed spec and credit estimate; start the job.
3. Watch discovery, crawl and extraction stream results into a table.
4. Open a lead and see source, time and confidence per value.

#### User roles & permissions
Customer users and organisations; a staff-only admin area gated by an audited function. Further roles not documented in detail.

#### Technical architecture & integrations
Monorepo (pnpm, Turbo): Next.js web app, API service, Python workers (crawl, extraction), Supabase Postgres with RLS and pg_cron, Redis, contract package. Deployed via Docker compose on a VPS. External: Overture Maps data, DNS lookups; Google Places is optional and was not funded.

#### Business value & example scenarios
Fast sourced prospect lists. Scenario: a marketing agency asks for gyms in Pune with a website and gets a list where each phone number links to the page it came from.

#### Planned / in progress (not live)
Phases 4 to 11: lead database and verification, enrichment, AI research and scoring, export and Sheets and billing for paid beta, automation and public API, CRM integrations (including Zoho), scaling, commercial launch. Phase 3 remaining: browser fetcher, page classifier, LLM extraction.

#### Example visitor questions & answers
- **Is LeadForge available?** Not yet; it is in development at phase 3 of 11.
- **What makes it different?** Every value shows where it came from and how sure we are.
- **Does it scrape social networks?** No; it avoids logged-in or protected views by policy.
- **Can I see a demo?** https://agentix-portfolio.vercel.app/#/demo/leadforge/walkthrough (simulated).

#### Related projects
Could feed Agentix CRM, AGENTiX leads and campaigns.

#### Verification notes
Checked: briefs, phases, progress log, web page tree. Not run. Missing: any deployed URL or recording.

---

### Santure AI CRM

**Slug:** `santure-crm` · **Also known as:** Santure AI operations platform · **Category:** CRM, Sales & Lead Intelligence / **Subcategory:** multi-brand operations prototype · **Status:** Prototype (Partially verified: page description and bundle strings read; not interactively run)
**Client / owner:** Santure AI (internal group) · **Local folder:** none (Claude artifact) · **Last activity:** artifact version 1793019894 (about late 2026)

#### Spoken introduction
Santure AI CRM is an interactive prototype of one operations platform for every team and brand at Santure AI, covering sales calling, orders, dispatch, inventory, accounts and agency delivery, all with demo data.

#### Quick overview
The page description reads: "one operations platform for every team and brand at Santure AI. Interactive prototype with demo data." The bundle shows a call-centre-style sales funnel for several D2C brands plus back-office and agency modules.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| Prototype | https://claude.ai/artifact/1aWGMS5ETqSCp4f1SV5JLD | Safe demo environment | Claude artifact; demo data |
| Portfolio | https://agentix-portfolio.vercel.app/#/demo/santure-crm/overview | Safe demo | Embed or preview (tier C) |

#### Target users & business problem
Founders, sales callers, dispatch, accounts, HR and agency managers across several brands. Problem: each team and brand uses separate sheets and tools.

#### Features (complete inventory)
Evidence: strings extracted from the artifact's JavaScript bundle (Partially verified; labels only, behaviour not exercised).
- **Lead center and lead funnel:** sources listed as a WhatsApp automation platform, Meta lead ads, Google Ads lead forms, Shopify store, website forms, Google Sheets and CSV upload; funnel states from leads received through assigned, call attempted, connected, not interested, follow-ups, interested, orders created, confirmed by dispatch, delivered (verified) and fully paid.
- **Distribution and reshuffle:** allocate fresh leads to callers, caller load, lead rules.
- **Callers:** checkpoint reminders at 12, 2, 4 and 6, end-of-day report, follow-ups, my orders, my day.
- **Orders, dispatch, inventory and packing:** confirm orders, courier AWB and pickup, stock, production, handover.
- **Accounts:** invoices, to-pay, collections, budgets, compliance reminders, CA pack.
- **Reports and AI daily summary:** "Written by AI from today's numbers".
- **HR and people:** attendance from portal check-ins, appraisals.
- **Agency delivery:** proposals, pipeline, campaigns, approvals, dev board, deployments, freelancers, client changes, team board, tasks.
- **Voice agents:** a voice-agent page exists.
- **Brand pages:** per-brand views for a set of AI Agentix client brands.
- **Automations list:** attempt-limit rule, checkpoint reminders, low-stock alert, overdue follow-up nudge, approval reminder, courier status sync, incentive on delivered orders.
All people names in the bundle are demo data and are not reproduced here.

#### Key workflows (end to end)
Inferred: lead arrives, distribution assigns a caller, caller attempts and records status, order is created, dispatch confirms and ships, delivery is verified, accounts reconcile.

#### User roles & permissions
Role-oriented views (founder, callers, dispatch, accounts) appear in the bundle; exact permission model not verified.

#### Technical architecture & integrations
React single-page app bundled with Vite inside a Claude artifact; no backend; demo data only. Integrations named are illustrative (courier sync, Meta, Google).

#### Business value & example scenarios
Shows how one platform could replace scattered sheets. Scenario: a Meta lead for "Brand A" is auto-assigned, called at the 12 o'clock checkpoint, ordered, and dispatched.

#### Planned / in progress (not live)
Prototype only, not a deployed product.

#### Example visitor questions & answers
- **Is it a real product?** It is a clickable prototype with demo data.
- **What teams does it cover?** Sales calling, dispatch, inventory, accounts, HR and agency delivery.
- **Where is it?** The Claude artifact link above.

#### Related projects
Agentix CRM (real internal tool), Ekatva (sector-specific prototype).

#### Verification notes
Checked: artifact metadata and bundle strings. Not verified: screens visually, data model. Missing: screenshots or a run-through.

---

### Ekatva

**Slug:** `ekatva` · **Also known as:** Ekatva Prototype · **Category:** CRM, Sales & Lead Intelligence / **Subcategory:** insurance and wealth distributor platform · **Status:** Prototype (Partially verified: description and bundle module names read)
**Client / owner:** Ekatva (concept/prospect) · **Local folder:** none (Claude artifact) · **Last activity:** artifact version 1792356201

#### Spoken introduction
Ekatva is an interactive prototype of a relationship and operations platform for insurance and wealth distributors, built with fictional data. It covers households, policies, renewals, wealth products, service and more.

#### Quick overview
Per the page description: "relationship and operations platform for insurance and wealth distributors. Interactive prototype with fictional demo data." The code is split into role homes and about thirty pages.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| Prototype | https://claude.ai/artifact/SPtLCBo9RcGfjE1FMAdwiw | Safe demo environment | Claude artifact; fictional data |
| Portfolio | https://agentix-portfolio.vercel.app/#/demo/ekatva/overview | Safe demo | tier C |

#### Target users & business problem
Insurance and wealth distribution firms: relationship managers, service desks, policy operations, renewals and accounts teams. Problem: client relationships, policies, renewals and servicing are scattered.

#### Features (complete inventory)
Evidence: code chunk names in the artifact bundle (Partially verified; names only).
- **Role homes:** operations, service desk, life insurance, wealth, mutual fund service, relationship manager, renewals, policy operations, service, quality, accounts, front office (with business card scan) and field (with route map and My Day).
- **Pages:** households and Household 360, leads and lead detail, opportunities, reviews, policies (new policy, policy detail), renewals, quotations and quotation builder, service, wealth, inbox, campaigns, calendar, calls, documents, approvals, team, office, reports, automations, client portal preview, settings, loans, work log, events, insights, bot flows, front desk, field, finance, referrals, performance, client health, feedback, status.
- **Other:** checkup booking, wallets, renewal modals and policy utilities.
Behaviour of each page was not exercised.

#### Key workflows (end to end)
Inferred only: lead to quotation to policy to renewal tracking, with households as the central record.

#### User roles & permissions
Role-based home screens (see above). Exact permissions not verified.

#### Technical architecture & integrations
React (Vite) single-page app inside a Claude artifact, about 263 published files, code-split by page; fictional data; no backend.

#### Business value & example scenarios
Gives distributors one household-centred view. Scenario: a renewal due in 30 days for a fictional household "Rao family" triggers a reminder and a quotation for upgrade.

#### Planned / in progress (not live)
Prototype only.

#### Example visitor questions & answers
- **What is Ekatva?** A prototype platform for insurance and wealth distributors.
- **Is the data real?** No, fictional demo data.
- **Where can I try it?** The Claude artifact link above.

#### Related projects
Santure AI CRM, Agentix CRM, Eurobrass CRM (other CRM builds).

#### Verification notes
Checked: artifact metadata and bundle structure. Not verified: UI, data, flows. Missing: screenshots or a run-through, and whether Ekatva is a real client or a concept.
