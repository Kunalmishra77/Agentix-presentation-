# Knowledge-base writing guide (for agents writing docs/kb/part-*.md)

Audience: an AI VOICE AGENT that answers visitors' questions about AI Agentix's work and navigates to links. Write so it can (a) give a short spoken intro, (b) answer detailed "how does X work / what features / which roles / which integrations / can I see a demo / difference between X and Y" questions accurately.

## Evidence rules (mandatory)
- Inspect the actual source (local folder: README, docs/, routes/pages, models/schemas, config, package.json, PROGRESS/STATUS docs, git log) and the LIVE PUBLIC pages (fetch/Playwright: E:/travel-agency/node_modules/playwright, channel "chrome"). Do NOT log into any production app.
- Label every project's overall status AND each feature group with one of: **Verified** (seen in code AND/OR live public page or reliable project doc), **Partially verified**, **Unverified**, **Unavailable** (could not access). Say what the evidence was in a short "Evidence:" line per feature group (e.g. "Evidence: src/app/(dashboard)/campaigns/*, docs/billing.md").
- Never present planned/roadmap items as implemented — put them under "Planned / in progress (not live)".
- NEVER include passwords, API keys, tokens, DB URLs, .env values, credentials, real customer/patient/member/guest/employee data, real phone numbers or private emails. Never open .env*, *.sql dumps, audit CSVs, .admin-credentials.txt. Describe integrations conceptually ("uses the Meta WhatsApp Cloud API; credentials are stored as server environment variables").
- Business contact info printed on a client's public website may be referenced generally ("the site has a call/WhatsApp button") but don't copy numbers.
- Fictional examples only (e.g. "Riverside Dental Clinic", "Aarav Rao").
- No invented metrics, revenue claims or guarantees. No marketing fluff; be specific.

## Portfolio navigation (use these exact patterns)
- Portfolio (planned hosted URL): https://agentix-portfolio.vercel.app/ — project demo: https://agentix-portfolio.vercel.app/#/demo/<slug> ; tabs: /overview, /walkthrough, /how, /screens, /tech ; specific module: /#/demo/<slug>/walkthrough/<moduleId>. Slugs are in D:\Agentix Project\Agentix-presentation\js\data\projects.js. Module ids for interactive demos are in js/demos/<slug>.js (the `id` of each module). Mark the portfolio demo as "Safe demo — fictional data, all actions simulated".
- Mark every live URL as one of: Production (real business — don't perform actions), Public marketing site, Safe demo environment (e.g. redux-demo-iota.vercel.app is a demo deployment), Login-protected.

## Per-project template (use exactly these headings; '###' level inside your part)
### <Project name>
**Slug:** `<slug>` · **Also known as:** … · **Category:** … / **Subcategory:** … · **Status:** Live | In development | Prototype | Concept | Internal — (Verified/Partially verified)
**Client / owner:** … · **Local folder:** `…` · **Last activity:** <date from git>

#### Spoken introduction
2–4 natural conversational sentences, easy to say aloud.

#### Quick overview
3–5 sentences: what it is, who it's for, the problem it solves.

#### Links & access
Table: Purpose | URL | Type (Production / Public site / Safe demo / Login required) | Notes. Include main site, app, login URL (no credentials), important module URLs (public ones), portfolio demo deep links (overview + walkthrough + 2–4 key modules).

#### Target users & business problem

#### Features (complete inventory)
Nested by module/screen. For EACH feature: what it does · why it exists · how it works · how the user interacts · inputs → outputs · dependencies/workflow links · business use case · limitations/prerequisites · status label + Evidence line. Be exhaustive for real modules (e.g. a CRM's leads, contacts, campaigns, templates, reports, settings each separately).

#### Key workflows (end to end)
Numbered steps: access/login → main navigation → core operations → how data moves between modules → automations/triggers → expected results → permission/error handling (where verified).

#### User roles & permissions
Only roles verified in code/docs, with what each can see/do.

#### Technical architecture & integrations
Frontend, backend, database/storage, auth, hosting/deployment, external APIs/services, automation/job mechanisms, environment configuration (names/purposes only, no values), known limitations. Mark verified vs unconfirmed.

#### Business value & example scenarios
Who can use it, manual work it removes, processes automated, 1–2 fictional scenarios.

#### Planned / in progress (not live)

#### Example visitor questions & answers
5–8 Q&A pairs grounded in the facts above (include "Can I see a demo?" with the right link).

#### Related projects
Cross-references with how they differ/complement.

#### Verification notes
What was checked, what could not be verified and EXACTLY what's missing (e.g. "admin dashboard behind login — need demo credentials or screenshots").
