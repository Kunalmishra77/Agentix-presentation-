# Part 2: Healthcare, Hospitality and Fitness projects

Scope of this part: eight AI Agentix projects, grouped under three category headings (Healthcare Systems, Hospitality, Fitness).

Conventions used in every project section below:
- **Safe demo — fictional data, all actions simulated** is the label for the AI Agentix portfolio demos. Portfolio base URL: https://agentix-portfolio.vercel.app/ (planned hosted URL). Project demo: `/#/demo/<slug>`; tabs: `/overview`, `/walkthrough`, `/how`, `/screens`, `/tech`; module deep link: `/#/demo/<slug>/walkthrough/<moduleId>`.
- Status labels: **Verified**, **Partially verified**, **Unverified**, **Unavailable**. An "Evidence:" line follows each feature group.
- No credentials, keys, real people, real patients, members or guests, or real phone numbers appear here. All examples are fictional. Nothing here is medical advice; clinical items describe software features only.
- Live-URL types: Production (real business, do not perform actions), Public site, Safe demo, Login required.

---

## Healthcare Systems

### Agentix HIMS

**Slug:** `agentix-hims` · **Also known as:** Government HIMS, "kailash-hms-prototype" (package name), AI-first Hospital Information Management System · **Category:** Healthcare Systems / state-scale hospital information system · **Status:** Prototype with a public demo deployment (Verified)
**Client / owner:** AI Agentix (own product, aimed at government and multi-hospital health systems) · **Local folder:** `D:\Agentix Project\Gov-HIMS` · **Last activity:** 2026-09-02 (129 commits)

#### Spoken introduction
Agentix HIMS is our AI-first hospital information system, designed for state-scale public health in India. It gives every hospital team, from doctors and nurses to pharmacy, lab, billing and the blood bank, its own role portal, and gives health leaders a live cockpit over the whole state. You can try it in the portfolio demo, where one fictional patient moves from triage to discharge.

#### Quick overview
Agentix HIMS is a Next.js web application with one console per role: more than 24 staff and patient portals covering clinical care, operations, finance, management and support services. A patient record flows between departments, so triage, consultation, lab, pharmacy, billing and discharge stay in sync. AI assists with decision support (triage scoring, early-warning scores, drug-safety checks, sepsis watch), but deterministic safety rules sit underneath it and a human accepts or rejects AI suggestions. Two government cockpits, for the Chief Medical and Health Officer (CMO, district level) and the Health Secretary (state level), roll everything up into district rankings and approvals. It solves the problem of disconnected departments and leadership with no live picture.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| Public landing + role picker | https://government-hims.vercel.app/ | Safe demo environment (public) | The landing says "Demo environment, pick a role to explore". Seeded fictional data. Includes a public patient self check-in kiosk. |
| Role sign-in | https://government-hims.vercel.app/login | Login required (demo) | Launcher cards go to a login per role; the landing page states any credentials work in the demo. No credentials are listed here. |
| Public patient check-in kiosk | https://government-hims.vercel.app/checkin | Public | Self check-in and intake flow, no login. |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/agentix-hims | Safe demo, fictional data, all actions simulated | Interactive tier-A demo. |
| Portfolio walkthrough | https://agentix-portfolio.vercel.app/#/demo/agentix-hims/walkthrough | Safe demo | Module picker. |
| Module: patient journey | https://agentix-portfolio.vercel.app/#/demo/agentix-hims/walkthrough/journey | Safe demo | Triage to discharge for one fictional patient. |
| Module: doctor workspace | https://agentix-portfolio.vercel.app/#/demo/agentix-hims/walkthrough/doctor | Safe demo | |
| Module: Health Secretary cockpit | https://agentix-portfolio.vercel.app/#/demo/agentix-hims/walkthrough/secretary | Safe demo | District ranking view. |
| Module: CMO cockpit | https://agentix-portfolio.vercel.app/#/demo/agentix-hims/walkthrough/cmo | Safe demo | |
Other portfolio module ids: `nurse`, `emergency`, `lab`, `pharmacy`, `beds`, `ot`, `bloodbank`, `billing`, `coo` (Admin command centre), `patient` (Patient portal), `audit` (NABH audit trail).

#### Target users & business problem
Government and large hospital networks where patient journeys stall between disconnected departments, and where state and district leadership lack a live operating picture. Users are clinicians, nurses, pharmacy and lab staff, billing and insurance desks, hospital administrators, and health officials. Patients use a patient portal and a public family-tracking page.

#### Features (complete inventory)
Status for the project: **Partially verified** (source code and public landing seen; staff portals not entered live; docs contain differing counts, see Verification notes).

**1. Role portals and navigation** · Status: Verified · Evidence: `src/app/<role>/*` route tree, `PROJECT-OVERVIEW.md` role table, live landing text "29 role-based consoles".
- What: a launcher shows roles grouped by Clinical (6), Operations (4), Finance (2), Management (7), Support Services (7), Patient (1) and Government (2). Each role has its own layout, dashboard and sidebar. The live landing counts 29 consoles; older docs describe 24 original roles plus a patient portal.
- How the user interacts: pick a role on the landing, sign in (demo: any credentials), and land on that role's dashboard. A role guard prevents opening other roles' pages.
- Dependency: the same patient record and cross-module audit log are used by all portals.

**2. Doctor portal** (`/doctor/*`: dashboard, consultation, schedule, ipd and ipd/[id], online, records, registries, emergencies, inbox, beds, analytics, ai-assistant, settings) · Status: Verified (code)
- OPD workspace, inpatient (IPD) command, online consultation, patient records, disease registries, an inbox, schedule, and analytics.
- AI pre-brief summarises a patient before a consult; drug-safety gating checks allergies and interactions when prescribing; a voice scribe is described in docs; an AI copilot floats on screen (suggestion with confidence, reasoning, accept/modify/reject).
- Limitations: AI services are largely simulated or mock functions in the original prototype (see Technical architecture).

**3. Nursing station** (`/nurse/*`: dashboard, patients, patients/[id], vitals-requests, tasks, rounds, medication, fluid-balance, handover, orders, messages, ai-assistant) · Status: Verified (code)
- Vitals capture, medication administration record (MAR), fluid balance, rounds, shift handover, tasks. Early-warning (NEWS2-style) escalation is a documented feature.

**4. Emergency room** (`/emergency/dashboard, floor, triage`) · Status: Verified (code)
- ER floor board and triage with ESI levels 1 to 5 (the portfolio demo shows an ESI Kanban). Sepsis alerts and trauma tracking are described on the landing and docs.
- Limitation: documentation notes ER triage severity was set manually in the original prototype rather than by the rules engine module.

**5. Laboratory** (`/lab/*`: dashboard, inbox, in-queue, benches, phlebotomy, verify, qc, reflex, microbiology, reports, analyzer-feed) · Status: Verified (code)
- Five-bench routing (haematology, biochemistry, immunology, urine, microbiology), multi-technician claim, QC gating, verification chain, reflex tests, and a multi-day microbiology workflow. A critical-value check exists in the rules engine.

**6. Radiology** (`/radiology/*`: dashboard, orders, arrival, in-queue, bench, reading, verification, critical, distribution, schedule, scans, templates, viewer, reports, analytics, ai-command, inbox) · Status: Verified (code)
- A full RIS-style command centre: orders, scan arrival, reading worklist, templated reports, critical-finding alerts, report distribution, and an image viewer.

**7. Pharmacy** (`/pharmacy/*`: dashboard, queue, inventory, master, narcotics, messages) · Status: Verified (code)
- Unified tagged queue (OPD, IPD, OT, ICU, discharge), claim model, bedside dispense, inventory and drug master, narcotics log. Dispensing checks allergy blocks and drug interactions.

**8. Reception** (`/reception/*`: dashboard, register, opd, queue, appointments, patients, beds, billing, diagnostics, referrals, tpa, ambulance, journey, messages, reports, downloads, setup) · Status: Verified (code)
- Registration, OPD queue, appointments, referrals, TPA, ambulance requests and a journey tracker per patient.

**9. Admission, discharge and OT** (`/admission/dashboard, beds, forecast`; `/discharge/dashboard, summary/[id]`; `/ot/dashboard, schedule, checklist`) · Status: Verified (code)
- Bed allocation and forecast, discharge summaries with human review, OT scheduling with a WHO-style checklist that blocks proceeding while critical items are pending.

**10. Billing and insurance** (`/billing/dashboard, discounts, packages, refunds, patient/[id]`; `/insurance/dashboard, claims, documents, pipeline, preauth`) · Status: Verified (code)
- Patient ledgers, packages, discounts, refunds, and an insurance pipeline with pre-authorisation. The landing and portfolio describe AB-PMJAY (government scheme) handling and ABHA identity as native, with pre-auth shown with a denial-risk score. Real submission to the government platform is not verified.

**11. Management and support services** · Status: Verified (code)
- Admin command centre (`/admin/*`): staff directory and onboarding, credentials and licence expiry, roster and shifts, coverage and sick-call workflow, finance (P&L, reconciliation, disputes), compliance cockpit (NABH, DISHA/DPDP audit, statutory calendar), AI performance dashboard, vendors, payroll, settings.
- Quality and safety (`/quality/*`: dashboard, incidents, NABH), audit officer (`/audit/*`), housekeeping, inventory, HR (`/hr/*`: employees, attendance, leave, recruitment, appraisals, onboarding), vendor manager (`/vendor-manager/*`: contracts, purchase orders, payments, performance).
- Blood bank (donors, inventory, requests), CSSD (instruments, cycles), dietary (plans, orders), bio-medical waste (log, reports), mortuary (records, clearances), ambulance (dispatch, log), feedback (responses, AI insights).

**12. Patient portal and public pages** (`/patient/*` about 25 pages; `/p/[uhid]`, `/family-track/[token]`, `/consent/[token]`, `/journey/[patientId]`, `/discovery`, `/abha`) · Status: Verified (code)
- Patient dashboard, appointments, queue and waiting status, teleconsult, medications, pathology and radiology results, records, billing, insurance, discharge, follow-up, feedback, AI care assistant, health story, downloads. Public pages let families follow a patient and let patients give consent via a tokenised link.

**13. Health Secretary cockpit** (`/secretary/*`: home, districts and districts/[id], ranking, mobilization, cabinet, niti-abdm, ayush, dme, cag-audit, fraud, mch, schemes, supply, surveillance, workforce, approvals, alerts, beds, emergency, quality, communication, ai-assistants, reports, audit-log) · Status: Verified (code, build spec)
- State-wide cockpit; the build spec calls district ranking "the killer feature" and defines five demo-star screens (home, map and district ranking, inter-district mobilisation, cabinet and assembly drafter, NITI Aayog and ABDM dashboard). Hindi labels appear alongside English.
- Limitation: the spec states data for this cockpit is mock.

**14. CMO cockpit** (`/cmo/*`: alerts, approvals, beds, ambulance, communication, disease-programs, emergency, equipment, facilities, field-visits, grievances, mch, postings, quality, reports, schemes, staff, supply, surveillance, ai-assistants, audit-log, profile, settings) · Status: Verified (code, build spec)
- District-level cockpit with 24 menu items: alerts, approvals, bed network, ambulance command, field visits, grievances, surveillance.

**15. AI layer and safety rules** · Status: Verified (docs and code)
- About 40 AI service functions, each returning an envelope with confidence, tier, reasoning and a "requires review" flag. A human-in-the-loop review card (accept, modify, reject with reason) logs every decision to the audit trail; thumbs up/down feedback feeds an AI-performance dashboard.
- Seven deterministic rules modules sit beneath the AI: triage thresholds, drug interactions, allergy block, dosage bounds, critical lab values, OT proceed-gate and billing math. Documentation notes the rules engine was only partly wired into the UI at the time it was written.
- A shadow mode can show suggestions with actions disabled.

**16. Compliance and audit** · Status: Verified (docs and code)
- A single audit fan-in records meaningful actions, mapped to the nine NABH chapters; consent and DPDP/DISHA scoring, BMW (bio-medical waste) logs, and statutory calendar items.

**17. Language support** · Status: Verified. English and Hindi (next-intl), toggle on the landing.

#### Key workflows (end to end)
1. Open the landing page and choose a role (or the patient self check-in kiosk).
2. Registration or kiosk intake creates the patient record (ABHA is shown as a native identity option).
3. Triage scores risk (ESI levels, NEWS2-style warning score) and routes the patient to OPD, emergency or admission.
4. The doctor reviews the AI pre-brief, consults, and orders labs, imaging and medicines. Drug-safety checks gate the prescription.
5. Lab and radiology fulfil orders; critical values raise alerts; results appear on the doctor and patient portals.
6. Pharmacy dispenses with allergy and interaction checks; billing builds the bill or an insurance pre-authorisation.
7. Admission and bed management, nursing rounds, OT checklist, then discharge with a reviewed summary and a follow-up.
8. Every action emits an audit event; outcomes roll up to the CMO and Health Secretary cockpits.
In the portfolio demo, "Patient journey" replays this flow for a fictional cardiac patient with simulated outcomes.

#### User roles & permissions
Roles in code (verified): doctor, nurse, pharmacy, lab, radiology, emergency, reception, bed manager (admission), discharge, OT, billing, insurance, admin (COO), quality, housekeeping, inventory, blood bank, CSSD, dietary, BMW, mortuary, ambulance, audit officer, HR, vendor manager, patient, CMO, Health Secretary (the live landing counts 29). A role guard shows each role only its own portal. Fine-grained permission matrix details were not enumerated beyond the admin RBAC matrix mentioned in the docs.

#### Technical architecture & integrations
- Frontend: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Zustand state stores, Framer Motion, Recharts, next-intl, react-hook-form with Zod. (Verified: package docs.)
- Backend: the original prototype was frontend-only with in-memory stores and mock APIs. A 2026-07-13 architecture document and the repo's `supabase/migrations` show a later move to Supabase (Postgres with row-level security, auth users per role, realtime, API route handlers for OPD queue and orders). The doc itself marks what is "NOW" versus "TARGET". Status: Partially verified.
- Integrations: mock WhatsApp send and webhook routes; ABHA, Aadhaar and AB-PMJAY shown as simulated; voice text-to-speech and an AI completion route exist. External government integrations are not verified as live.
- Hosting: Vercel. Environment configuration (names only): Supabase URL and keys, AI provider key.
- Known limitations (from the project's own CTO review): backend gaps, concurrency control, multi-tenancy and real authentication were listed as target-state items at 2026-06; the marketing badges on the landing (NABH-ready, ABDM/DISHA, ISO 27001, HL7/FHIR) are landing-page claims, not certifications verified by us.

#### Business value & example scenarios
Replaces separate department software and paper with one patient record; reduces re-entry; surfaces risk early; gives officials a district-level view. Scenario 1: a fictional patient "Meera Joshi" arrives with chest pain at a district hospital; triage flags high acuity, the lab confirms a result, the pharmacy catches an interaction, and billing prepares a scheme pre-authorisation. Scenario 2: a fictional Health Secretary opens the district ranking, filters the bottom five districts and drills into one.

#### Planned / in progress (not live)
The architecture review lists multi-hospital tenancy, full real-time, transactions and crore-scale infrastructure as target-state; real government integrations (ABDM, NHA) are not claimed as live.

#### Example visitor questions & answers
- **What is Agentix HIMS?** An AI-first hospital information system with a console per role, plus state and district cockpits.
- **How many roles does it have?** The live landing shows 29 consoles; early docs list 24 roles plus a patient portal.
- **Is it live in a hospital?** No. It is a prototype with a public demo environment and fictional data.
- **Does the AI make clinical decisions?** No. It suggests, shows confidence and reasoning, and a human accepts, modifies or rejects; deterministic safety rules sit underneath.
- **Can I see a demo?** Yes: https://agentix-portfolio.vercel.app/#/demo/agentix-hims (safe demo, fictional data) or the public demo at https://government-hims.vercel.app/.
- **What is the difference from Umang Hospital HIMS?** Umang HIMS is a smaller single-hospital OPD system extracted from this one.
- **Does it support Hindi?** Yes, English and Hindi.
- **Which government schemes does it mention?** ABHA, AB-PMJAY, ABDM and NABH audit mapping, shown as simulated in the demo.

#### Related projects
Umang Hospital HIMS (`umang-hims`) is a single-hospital OPD extraction of this system. Woodpecker PMS is the hospitality sibling in method (role portals, folio billing).

#### Verification notes
Checked: repository structure, PROJECT-OVERVIEW, README, CTO review, 2026-07-13 architecture doc, route tree (about 260 pages), live landing text. Not verified: any signed-in portal on the live site; whether current deployment reads from a live database or in-memory demo data; real integrations. Missing: a current screenshot set and a statement from the owner on whether the deployed demo is database-backed.

---

### Umang Hospital HIMS

**Slug:** `umang-hims` · **Also known as:** Umang OPD system · **Category:** Healthcare Systems / single-hospital OPD system · **Status:** Prototype (Partially verified)
**Client / owner:** Umang Hospital (extracted from Agentix HIMS) · **Local folder:** `E:\Umang Hospital HIMS` · **Last activity:** 2026-09-07 (94 commits)

#### Spoken introduction
Umang Hospital HIMS follows an outpatient visit from registration to pharmacy on one live record. A patient can register by form or by talking to a voice agent called Asha, and anyone can follow the visit status on a public tracker. It works in English and Hindi.

#### Quick overview
It is a Next.js application extracted from the larger Agentix HIMS and trimmed to the outpatient (OPD) journey of a single private hospital: registration, reception queue, nurse vitals, doctor consultation with prescriptions and orders, billing and pharmacy. Six staff and patient consoles are live on the demo. It is backed by a real Postgres database through Supabase rather than a mock. It solves paper slips and unclear waiting by keeping every desk on the same visit record.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| Public landing + role picker | https://umang-hospital-hims.vercel.app/ | Public site, demo; login required for consoles | Landing says six role-based consoles. Demo accounts exist (per the README); credentials are not listed here. |
| Staff/patient sign-in | https://umang-hospital-hims.vercel.app/login | Login required | |
| Patient self check-in kiosk | https://umang-hospital-hims.vercel.app/checkin | Public | |
| Public live visit tracker | https://umang-hospital-hims.vercel.app/p/<UHID> | Public | Needs a visit identifier; no login. |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/umang-hims | Safe demo, fictional data, all actions simulated | |
| Walkthrough | https://agentix-portfolio.vercel.app/#/demo/umang-hims/walkthrough | Safe demo | |
| Module: register | https://agentix-portfolio.vercel.app/#/demo/umang-hims/walkthrough/register | Safe demo | Form or Asha voice agent. |
| Module: public tracker | https://agentix-portfolio.vercel.app/#/demo/umang-hims/walkthrough/tracker | Safe demo | |
| Module: doctor | https://agentix-portfolio.vercel.app/#/demo/umang-hims/walkthrough/doctor | Safe demo | |
Other module ids: `reception`, `nurse`, `billing`, `pharmacy`, `reports`.

#### Target users & business problem
A single private hospital's OPD: reception staff, nurses, doctors, billing and pharmacy counters, and patients and their families.

#### Features (complete inventory)
Status for the project: **Partially verified** (code and README read, public landing seen; signed-in screens not seen).

**1. Registration** (form, kiosk and the "Asha" voice agent) · Status: Verified (code, README) · Evidence: `/checkin`, `/api/intake/turn`, `/api/voice/tts`, `lib/intake`.
- A patient fills a form or talks to Asha, a voice registration agent built with an AI language model and text-to-speech. If the premium voice is unavailable it falls back to the browser voice. Aadhaar verification is mocked; the ABHA flow was removed on 2026-09-07 per git history.

**2. Reception** (`/reception/*`: dashboard, register, queue, opd, appointments, patients, billing, messages, reports, journey, downloads, setup) · Status: Verified (code)
- Walk-in registration, OPD queue and check-in, appointments, reporting. Limitation (README): appointments do not persist to the database and live in browser state only.

**3. Nurse** (`/nurse/*`: dashboard, patients, patients/[id], vitals-requests, tasks, messages, ai-assistant) · Status: Verified (code)
- OPD vitals capture and patient worklist.

**4. Doctor** (`/doctor/*`: dashboard, consultation, schedule, records, inbox, analytics, ai-assistant, settings) · Status: Verified (code)
- Consultation, prescriptions, lab and imaging orders. Limitation (README): lab and radiology fulfilment portals were removed, so orders are created and visible but nothing runs the test. Teleconsult was cut on both sides.

**5. Billing** (`/billing/*`: dashboard, patient/[id], packages, discounts, refunds) · Status: Verified (code)

**6. Pharmacy** (`/pharmacy/*`: dashboard, queue, inventory, master, narcotics, messages) · Status: Verified (code)
- Carries prescriptions through queued, preparing, ready and collected.

**7. Patient portal** (`/patient/*` about 20 pages) and **record claim** (`/claim`) · Status: Verified (code, README)
- A patient claims an existing record by UHID, phone and full name to create a portal account. The README explicitly calls this demo-grade assurance, not identity proofing. Billing is real per README; the dashboard's clinical cards are front-end simulation.

**8. Public live visit tracker** (`/p/[uhid]`) · Status: Verified (code, README) · The status advances Registered, Vitals, Consult, Prescription, Pharmacy ready.

**9. Bilingual UI** (English and Hindi). Status: Verified.

**10. WhatsApp routes** (mock send and webhook). Status: Verified (code); real sending not verified.

#### Key workflows (end to end)
1. Landing page, then registration (form, kiosk or Asha).
2. Reception checks the patient in and places them in the OPD queue.
3. The nurse records vitals.
4. The doctor consults and writes prescriptions and orders.
5. Billing raises the bill; pharmacy dispenses.
6. The patient or family follows each step on the public tracker.
Permission handling: queue access is gated to staff and patients are scoped to their own row (git commit 2026-09-07).

#### User roles & permissions
Reception, nurse, doctor, billing, pharmacy and patient consoles are shipped. An admin role is recognised for seeding and operations scripts but has no UI.

#### Technical architecture & integrations
Next.js 16, React 19, TypeScript, Tailwind v4, Zustand, Supabase (Postgres with row-level security, auth, realtime), AI language model and ElevenLabs text-to-speech for the voice agent (credentials held as server environment variables), next-intl, Vercel. Voice and AI features need paid provider keys to go beyond the fallback.

#### Business value & example scenarios
Fewer paper slips and a patient who can see where they are in the visit. Scenario: fictional patient "Kavita Nair" registers by voice, is queued, has vitals taken, sees the doctor, and her tracker shows "Pharmacy ready".

#### Planned / in progress (not live)
Not documented as planned: lab and radiology fulfilment, teleconsult, appointment persistence, and ABHA verification are deliberately out of this build.

#### Example visitor questions & answers
- **Who is it for?** A single hospital's outpatient department.
- **What is Asha?** A voice registration agent that collects patient details by conversation.
- **Can patients see their progress?** Yes, on a public tracker.
- **Is the data real?** The deployed demo uses seeded demo accounts; the portfolio demo is fictional.
- **Can I see a demo?** https://agentix-portfolio.vercel.app/#/demo/umang-hims (safe demo).
- **How does it differ from Umang's website?** The website is public marketing and a CMS; HIMS is an internal workflow tool.
- **Does it handle labs?** Orders can be created; lab and radiology fulfilment is not part of this build.

#### Related projects
Agentix HIMS (parent, 29 consoles), Umang Hospital website and CMS (`umang-website`).

#### Verification notes
Checked: README, package metadata, route list, git log, live landing. Not verified: signed-in consoles (demo accounts exist but were not used), voice agent behaviour live. Missing: confirmation whether Umang Hospital uses this system day to day (treated as a prototype).

---

### Umang Hospital website + admin CMS

**Slug:** `umang-website` · **Also known as:** umanghospitals.in · **Category:** Healthcare Systems / hospital website with lead capture and CMS · **Status:** Live (Verified)
**Client / owner:** Umang Superspeciality Hospital, Gurugram · **Local folder:** `D:\Agentix Project\Umang2.0` · **Last activity:** 2026-10-28 (149 commits)

#### Spoken introduction
This is the website for Umang Superspeciality Hospital in Gurugram. Patients can browse specialities, find doctors, read health information and request an appointment, and the hospital team manages the content and sees every lead in an admin panel. It also tracks which ad campaigns the enquiries came from.

#### Quick overview
A large React single-page site (roughly 70 routes) served from Apache/cPanel, with a Supabase back end for leads and content. Public pages cover specialities, doctors, infrastructure, services (telemedicine, health checkups, cashless insurance, elder care, home care, lab diagnostics, buy medicines), a health library, patient corner and media centre. Forms store each enquiry with its campaign tags (UTM and click identifier) and email or WhatsApp-notify staff. It replaces a static brochure site and lets staff change content without a developer.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| Main site | https://www.umanghospitals.in/ | Production (real hospital; do not submit forms) | Public site, HTTP 200 checked. |
| Doctor search | https://www.umanghospitals.in/doctors | Production | |
| Specialities | https://www.umanghospitals.in/specialities | Production | |
| Cashless insurance | https://www.umanghospitals.in/cashless-insurance | Production | |
| Admin CMS login | https://www.umanghospitals.in/admin/login | Login required | Staff only. |
| Supabase proxy | https://umang-supabase-proxy.vercel.app | Infrastructure (not a page) | Pass-through used by the browser; see architecture. |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/umang-website | Safe demo, fictional data, all actions simulated | A tier-B site preview. No interactive module file exists yet in the portfolio repo (js/demos/umang-website.js is absent), so only the overview link applies. |

#### Target users & business problem
Patients and families in Gurugram looking for a specialist, checkup, insurance help or a callback; hospital marketing and reception staff who need leads and content in one place; and a team running Google Ads who need to know which campaign produced which enquiry.

#### Features (complete inventory)
Status: **Verified** (code, live homepage load, changelog and developer handoff; admin not entered).

**1. Public site structure** · Evidence: `frontend/src/App.jsx` routes.
- Home with hero slides; About; Infrastructure (ICU units, OT, rooms, radiology, cafeteria, ambulance, help desk, parking); Specialities and per-speciality detail; Doctor search and doctor profile; Team (leadership, nursing, support staff); Careers; Gallery; Contact, emergency contact and an inquiry hub; Terms, privacy policy and a sitemap page.

**2. Services** (`/services/*`) · Telemedicine and consult booking; health checkup and checkup booking; lab diagnostics; buy medicines (categories and prescription upload); emergency; elder care; home care; second opinion; a generic service booking route; cashless insurance. Forms feed the leads table.

**3. Health library and patient corner** · Treatments, technologies and a virtual tour, ailments, knowledge centre, events and event registration, downloads; breakthrough cases, patient stories, blogs, podcasts, patient-information literature; media centre with press releases, coverage, newsletters and media connect. Note: the event registration form was flagged in Supabase notes as unbound inputs at one time.

**4. Lead capture** · Evidence: `src/api/api.js`, `supabase/migrations/0001_leads.sql`.
- Four lead types: callback, appointment, contact, insurance. Each stores name, phone, optional email and message, speciality, source page and an "extra" JSON block that includes campaign tags (utm source, medium, campaign, term, content and gclid) captured from the URL. Status values: new, contacted, converted, closed. A spam guard prevents duplicates and floods. A WhatsApp floating button is on every page.

**5. Google Ads landing page and thank-you pages** · A dedicated landing page (`/book-consultation`) and thank-you pages for conversion tracking; Google Ads tag and a Website Leads conversion were added 2026-08-12.

**6. Lead notifications** · A Supabase Edge Function (`notify-lead`) can send email through Resend and WhatsApp through Twilio on every new lead, if its secrets are set. Whether it is active in production is not confirmed.

**7. Admin CMS** (`/admin`) · Evidence: `frontend/src/admin/*`, `AdminLayout.jsx`.
- Sections: Dashboard (including native page-view analytics), Leads (view and update status, CSV archive then delete of old leads), Offers, Content, Hero Slides, Doctors, Specialities, Services, Testimonials, FAQs, Gallery, Media. Protected route with Supabase admin authentication. Content changes publish without code.

**8. Data retention** · Scheduled database jobs delete leads and page views older than six months (migration `0013_retention`).

**9. SEO and performance** · SEO head component and hospital JSON-LD schema, robots and sitemap, mobile hero image loop instead of video, lazy loading.

#### Key workflows (end to end)
1. A visitor lands (organically or from an ad) on the home or landing page.
2. They search specialities or doctors, or read service pages.
3. They submit a callback, appointment, contact or insurance form.
4. The browser writes the lead to the hospital's database; the campaign tags ride along in the lead.
5. Staff may be notified by email or WhatsApp; staff open `/admin/leads`, review, change status, add notes.
6. Content editors update doctors, offers and hero slides in the admin and the site reflects it.

#### User roles & permissions
Public visitors (can submit forms only); admin users via Supabase auth (database policies let the public insert leads only). Finer admin roles were not seen.

#### Technical architecture & integrations
- Frontend: React 18, Vite, Tailwind, deployed as static files on Apache/cPanel (the developer handoff notes a Vercel config too). A Laravel backend exists in the repo but the handoff states it was not deployed; Supabase is what the live forms and CMS use.
- Database and auth: Supabase Postgres with row-level security, `pg_cron` retention jobs, Edge Function for notifications.
- **Supabase proxy (change dated 2026-10-28):** browser Supabase traffic is routed through https://umang-supabase-proxy.vercel.app because some Indian internet providers hijack DNS for `*.supabase.co`, which caused "Failed to fetch" on admin login, lead forms and CMS content. The proxy is a pass-through rewrite that forwards every path, method and header, holds no secrets, and lives in the `supabase-proxy/` folder. A custom domain such as `api.umanghospitals.in` could replace it later.
- Framing: public pages may be framed by the AI Agentix portfolio (a content-security header allows it); the admin refuses framing.
- Environment names: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (the anon key is public by design, protected by row-level security).

#### Business value & example scenarios
Visibility into which ad produced which enquiry and fewer lost callbacks. Scenario: a fictional visitor "Rohan Verma" clicks a Google Ad for a cardiology consult, submits a callback form, and the reception team sees the lead with the campaign name and calls back within the hour.

#### Planned / in progress (not live)
Per Supabase notes: a patient portal with login and appointments needing a dedicated phase; a Supabase custom domain to replace the proxy. Neither is live.

#### Example visitor questions & answers
- **Is the site live?** Yes, at https://www.umanghospitals.in/.
- **Can I book online?** The site collects appointment and callback requests; staff confirm.
- **Does it support insurance?** There is a cashless insurance page and form.
- **What is the proxy about?** It keeps the site working on networks that block Supabase.
- **Can I see a demo?** The live site is production; the portfolio overview is https://agentix-portfolio.vercel.app/#/demo/umang-website.
- **Who manages content?** Hospital staff through the admin CMS.
- **Does it track ads?** Yes, UTM and click identifiers are stored with each lead.

#### Related projects
Umang Hospital HIMS (internal OPD tool for the same hospital); Agentix HIMS.

#### Verification notes
Checked: site load, source routes, migrations, handoff docs, proxy README, git log. Not verified: admin screens (login-protected), whether email/WhatsApp notifications are active. Missing: admin screenshots or demo credentials for a safe copy; the project listing mentions PHP but the actual front end is React (the PHP backend is Laravel, undeployed).

---

## Hospitality

### Woodpecker PMS

**Slug:** `woodpecker-pms` · **Also known as:** HMS by Agentix, Woodpecker Apartments & Suites platform · **Category:** Hospitality / property management system · **Status:** Live (Verified: public portal and guest site; staff app not entered)
**Client / owner:** Woodpecker Apartments & Suites Pvt. Ltd. · **Local folder:** `D:\Agentix Project\HMS by Agentix` · **Last activity:** 2026-10-28 (353 commits)

#### Spoken introduction
Woodpecker PMS runs a group of serviced apartments end to end: bookings, front desk, billing with GST invoices, housekeeping, maintenance, kitchen and POS, payroll and an owner portal. It has a guest website for direct booking and a role-based staff platform sharing one data core. Note it is a hotel system, not a hospital one.

#### Quick overview
A mobile-first Next.js platform with 28 modules and 9 role portals. A guest site at the root domain handles browsing, direct booking and in-stay services; a staff app (sign-in required) runs the properties. The design rules are strict: money in integer paise, locking availability so double-booking is impossible, append-only folios and gap-free sequential GST invoices. It replaces spreadsheets, OTA extranets and paper folios.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| Public platform portal | https://hotelmanagement.aiagentixdev.com/portal | Public site (marketing and role launcher) | Role cards link to the staff sign-in. |
| Guest website | https://hotelmanagement.aiagentixdev.com/ | Production (real business) | Online booking was marked "opening soon" on the page at check time. |
| Staff sign-in | https://hotelmanagement.aiagentixdev.com/start | Login required (production) | Real guests; do not log in or take screenshots. |
| Guest booking routes | https://hotelmanagement.aiagentixdev.com/book | Production | Per-property pages `/book/<slug>` and manage-booking pages exist. |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/woodpecker-pms | Safe demo, fictional data, all actions simulated | |
| Walkthrough | https://agentix-portfolio.vercel.app/#/demo/woodpecker-pms/walkthrough | Safe demo | |
| Module: tape chart | https://agentix-portfolio.vercel.app/#/demo/woodpecker-pms/walkthrough/tape | Safe demo | |
| Module: folio and invoice | https://agentix-portfolio.vercel.app/#/demo/woodpecker-pms/walkthrough/folio | Safe demo | |
| Module: housekeeping | https://agentix-portfolio.vercel.app/#/demo/woodpecker-pms/walkthrough/housekeeping | Safe demo | |
| Module: owner portal | https://agentix-portfolio.vercel.app/#/demo/woodpecker-pms/walkthrough/owner | Safe demo | |
Other module ids: `dashboard`, `bookings`, `new-booking`, `checkin`, `maintenance`, `pos`, `inventory`, `laundry`, `guests`, `messages`, `pricing`, `channels`, `booking-engine`, `ai`, `finance`, `gst`, `payroll`, `reports`, `audit`.

#### Target users & business problem
Owners and managers of multi-property serviced apartments; reception, accounts, housekeeping, maintenance, POS/kitchen and store staff; property owners (investors); and guests. Problem: overbookings, slow billing and scattered data.

#### Features (complete inventory)
Status: **Partially verified** (code routes, feature folders, integration catalog, demo guide, work report, public portal and guest site read; staff screens not seen).

**1. Property and room setup** (`/properties`, `/rooms`, `/rooms/categories`, `/design`) · Properties, room inventory and status, categories. Evidence: route tree, `src/features/properties`, `rooms`.

**2. Reservations and the tape chart** (`/bookings`, `/bookings/calendar`, `/bookings/new`, `/bookings/new/off-site`, `/bookings/[id]`) · Calendar tape chart, new booking (property first, then room category, with check-availability), group bookings, extend and mid-stay room move; recent commits harden overstay, transfer and extension edge cases. Occupancy is advisory rather than a hard gate (client decision 2026-10-23). Availability enforcement uses a locking transaction per the spec. Status: Verified (code, git log).

**3. Check-in, in-house and Form C** (`/bookings/[id]/check-in`, `/in-house`, `/bookings/form-c`) · Guest details and ID documents; Form C is the Indian foreigner registration form. Status: Verified (route/code).

**4. Folio, billing, GST invoices** (`/bookings/[id]/folio`, `/billing`, `/gst-claims`) · A running folio per stay, split payments (for example part cash, part UPI), extra charges, a "price includes GST" versus "add GST on top" toggle, and tax-invoice PDFs in the client's Tally-style format (company header, GSTIN, CGST/SGST by HSN/SAC, amount in words). Source: work report 2026-09-22 and demo guide. Status: Verified (docs, code).

**5. Guest CRM** (`/guests`, `/guests/[id]`, `/guests/new`) · Guest history, returning-guest matching, multiple ID documents with permission-gated viewing; ID numbers encrypted and masked. Status: Verified (docs, code).

**6. Data entry and import** (`/data-entry`, `/data-import`) · Back-entry of historical stays and bulk import for onboarding. Status: Verified (route, demo guide).

**7. Expenses** (`/expenses`) · Categories, bill photo, multi-item batch entry. Status: Verified (recent commit).

**8. Housekeeping, inspection, maintenance, lost and found** (`/housekeeping`, `/inspection`, `/maintenance`, `/lost-found`, `/requests`) · Room status from a phone, offline-capable for weak Wi-Fi; maintenance jobs and preventive reminders. Status: Verified (route and portal copy).

**9. POS and kitchen** (`/pos`, `/pos/kitchen`, public `/order/[token]`) · Restaurant POS, QR self-ordering and a live kitchen ticket board that settles to the folio. Status: Verified (route).

**10. Inventory and laundry** (`/inventory`, `/inventory/laundry`) · Six stock domains, purchase and issue, laundry reconciliation. Status: Verified (portal copy, route).

**11. People and payroll** (`/people`, `/payroll`, `/payroll/[runId]`, `/staff/field`, `/approvals`) · Staff management, payroll runs, field-staff access. Status: Verified (route).

**12. Channels and pricing** (`/channels`, `/pricing`, `/booking-site`, `/corporate`, `/add-ons`) · OTA channel manager, dynamic pricing suggestions that need approval, direct booking site configuration, corporate CRM, add-ons. **Integration reality:** OTA two-way sync needs certified partnership with each OTA or an aggregator; until then a mock adapter runs. Status: Partially verified (live OTA connection not confirmed).

**13. Communications and guest experience** (`/communications`, `/messages`, `/messages/[reservationId]`, `/notifications`, `/feedback`, `/guest-experience`) · WhatsApp, email and SMS through a provider interface; sandbox by default. Live WhatsApp needs a Meta-approved account and templates; Indian SMS needs DLT registration. Status: Partially verified.

**14. Analytics, finance and accounting** (`/dashboard`, `/overview`, `/overview/[propertyId]`, `/insights`, `/reports`, `/finance`, `/accounting`, `/search`) · Occupancy, ADR, RevPAR, profit per property and consolidated; natural-language search; accounting sync (Tally or Zoho) behind a mock provider until the client connects. Status: Verified (code), live accounting sync Unverified.

**15. Owner portal** (`/owner`, `/owner/documents`, `/owner/payouts`, `/owner/schedule`) · Read-mostly financials, document vault, compliance schedule, payout statements. Status: Verified (route).

**16. AI** (`/ai`) · Guest enquiry chatbot (read-only), natural-language data search, revenue forecast narrative, dynamic rate suggestions, sentiment and segmentation. The model proposes; validated server code executes. Provider-agnostic; mock by default. Status: Partially verified.

**17. Settings and security** (`/settings`, `/settings/users`, `/settings/security`, `/settings/audit`, `/settings/integrations`, `/profile`) · Users and roles, TOTP two-factor, database-backed sessions with revocation, immutable audit trail, integrations. Status: Verified (route, portal copy).

**18. Guest site and guest account** (`/`, `/book/[slug]`, `/book/[slug]/manage`, `/account/*`, `/track/[token]`, `/review/[token]`) · Browse stays, direct booking, self check-in, in-stay orders, rewards account, booking tracking and review links. Status: Verified (public page, route).

**19. Mobile PWA** · Installable on phone, designed phone-first. Status: Verified (manifest, portal copy).

#### Key workflows (end to end)
1. Guest books via the guest site, an OTA (when connected) or the front desk.
2. The reservation lands on the tape chart; availability is locked.
3. At arrival, reception checks the guest in, captures IDs and Form C.
4. During the stay, housekeeping, maintenance and POS operate; charges post to the folio.
5. At check-out, payments are split as needed and a GST tax invoice is generated.
6. Accounts reconciles; accounting sync pushes to Tally or Zoho when connected.
7. Owner and manager dashboards show occupancy, ADR, RevPAR and payout statements.
Access control is enforced server-side per role and property, with audit rows for each change.

#### User roles & permissions
Portal roles on the public page: Super Admin, Manager, Property Owner, Reception, Accounts, Housekeeping, Maintenance, Outlet/POS, Store/Inventory (nine). The database role enum is larger: Administrator, Manager, Assistant Manager, Reception, Accounts, HR, Inventory Manager, Purchase Manager, POS Manager, Housekeeping, Maintenance, Security Supervisor, Laundry Supervisor, Owner. Permissions are checked server-side and scoped to property, deny by default.

#### Technical architecture & integrations
Next.js 15, React, TypeScript, Prisma with PostgreSQL (70-model schema), pg-boss job queue and a separate worker, react-pdf for invoices, exceljs for exports, otplib for two-factor, Docker with Coolify on a VPS. Integrations are interfaces with mock adapters by default: payments (Razorpay or Cashfree), WhatsApp, SMS, email, OTA channel manager, accounting (Tally, Zoho), AI model, S3-compatible storage. Credentials are server environment variables. The README still says "pre-implementation" and is stale; the git history (353 commits) and live sites show the system is built and deployed.

#### Business value & example scenarios
One data core for four-plus properties; no double entry between website and desk; GST invoices in seconds. Scenario: fictional guest "Ishaan Mehta" books a two-night stay, arrives, orders room service through a QR link, and receives a GST invoice at check-out; the owner sees the revenue the same day.

#### Planned / in progress (not live)
Live OTA connectivity, live WhatsApp/SMS templates, accounting connectors and live online payment depend on client accounts and partner approval (integration catalog). The guest site states online booking is opening soon.

#### Example visitor questions & answers
- **Is this a hospital system?** No, it is a hotel and serviced-apartment PMS.
- **How many modules and roles?** 28 modules and 9 role portals.
- **Does it prevent double booking?** Yes by design, through locking availability.
- **Does it connect to Booking.com or MakeMyTrip?** It has a channel manager interface; live connection needs OTA approval and was not confirmed.
- **Does it generate GST invoices?** Yes.
- **Can I see a demo?** https://agentix-portfolio.vercel.app/#/demo/woodpecker-pms (safe demo). The live staff app is production.
- **Is there an owner view?** Yes, the owner portal.
- **Is it mobile friendly?** Yes, it is a mobile-first PWA.

#### Related projects
Kaaya Eco Resort (a resort website with its own simple booking engine, different codebase); Agentix HIMS (similar role-portal approach for hospitals).

#### Verification notes
Checked: CLAUDE.md, README, handover, demo guide, work report, integration catalog, route and feature folders, git log, public portal and guest site text. Deliberately not opened: root audit CSV and JSON files and environment files. Not verified: staff app screens, live integrations, GSTIN or company details. Missing: demo-safe screenshots or a seeded demo login, and confirmation of which integrations run live.

---

### Kaaya Eco Resort

**Slug:** `kaaya-eco-resort` · **Also known as:** kaayaecoresort.com · **Category:** Hospitality / resort website with booking engine · **Status:** Live (Verified: public site and public room data; admin not seen)
**Client / owner:** Kaaya Eco Resort, Yala, Sri Lanka · **Local folder:** `D:\Agentix Project\kaaya eco resort` · **Last activity:** 2026-06-15 (37 commits)

#### Spoken introduction
Kaaya Eco Resort is a luxury eco-resort near Yala National Park in Sri Lanka. Our website lets guests browse rooms, check availability for their dates, create an account and pay by card, and the resort manages bookings, rooms, photos and reviews from an admin dashboard.

#### Quick overview
A React front end with an Express and MySQL back end. Guests see rooms, dining, experiences, groups and events, a gallery and reviews, then book through a three-step flow (choose room, your details, payment). The server checks for overlapping bookings before creating one. An admin area manages bookings and content. It reduces dependence on OTAs and phone bookings.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| Main site | https://kaayaecoresort.com/ | Production (real resort; do not create bookings) | Page title "Your Gateway to Yala's Wild Heart". |
| Rooms | https://kaayaecoresort.com/accommodation | Production | |
| Booking flow | https://kaayaecoresort.com/book | Login required (guest account) | |
| Guest sign-in/register | https://kaayaecoresort.com/login | Login required | |
| Admin | https://kaayaecoresort.com/admin | Login required (staff) | |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/kaaya-eco-resort | Safe demo, fictional data, all actions simulated | No interactive module file exists yet (js/demos/kaaya-eco-resort.js is absent); overview link only. |

#### Target users & business problem
Overseas and local leisure guests, families, groups, and the resort's operators who needed direct bookings without OTA commissions or manual availability.

#### Features (complete inventory)
Status: **Verified** (code and public API; admin and payments not exercised).

**1. Guest pages** · Home, About, Accommodation and room detail, Experiences, Dining, Gallery, Groups and events, Contact. Experiences include safari at Yala, lake experience, cultural immersion, bird watching, resort activities and private resort hire. Dining mentions a bar with a bring-your-own-bottle policy. Group types include family reunions, weddings and honeymoons, corporate retreats, birthdays, wellness retreats and photography tours. Evidence: `client/src/pages/*`.

**2. Rooms and pricing** · Seven rooms were visible via the public rooms endpoint (family rooms with garden or lake view, a family chalet with jacuzzi, and standard chalets), priced in Sri Lankan rupees per night. Room type, capacity, beds and amenities are shown. Evidence: public rooms API, `server/src/routes/rooms.js`.

**3. Availability** · `/api/rooms/:id/availability` and booking checks consider existing bookings (confirmed, pending, checked-in) and blocked dates. Overlapping dates return a conflict.

**4. Booking flow** · Three steps: Choose Room, Your Details, Payment. Guests must be signed in; the server validates dates, adult count against room capacity, and calculates the total as nights times price.

**5. Online payment** · Card payments through Stripe (payment intent plus signed webhook that marks the booking confirmed). Whether it runs in live mode was not verified. Status: Partially verified.

**6. Guest accounts** · Register, sign in, "My bookings", booking detail, a booking success page. Authentication uses signed tokens and hashed passwords.

**7. Reviews** · Guests post reviews; an admin approves them before display.

**8. Enquiries** · A public enquiry form stores inquiries and sends email (nodemailer).

**9. Admin** (`/admin`, tabs) · Overview (stats and analytics), Bookings (view and change status), Rooms (create, edit, delete), Gallery (uploads through Cloudinary), Reviews (approve), Inquiries (mark read), Users (change role). A one-time "claim admin" route exists for the first administrator. Blocked dates are stored in the database (table exists); the UI path for managing them was not confirmed in the admin tabs. Evidence: `server/src/routes/admin.js`, `Admin.jsx`.

#### Key workflows (end to end)
1. Guest explores rooms and picks dates.
2. The site checks availability and blocked dates.
3. Guest signs in or registers, enters details.
4. Stripe takes the card payment; the webhook confirms the booking.
5. The booking appears in admin; the guest sees it in My bookings and later can leave a review.
Rate limiting and security headers are applied on the API.

#### User roles & permissions
Guest user, administrator (role change in admin; first admin claimed by a one-time route). Other roles were not seen.

#### Technical architecture & integrations
React and Vite front end; Express API (helmet, rate limit, compression); MySQL accessed through `mysql2` (a git commit on 2026-06-15 replaced Prisma because the host container restricted its engine); Stripe; Cloudinary; Nodemailer; JWT auth; deployed on a shared host and Vercel config present. Tables (names only): User, Room, Booking, Review, GalleryImage, Inquiry, BlockedDate.

#### Business value & example scenarios
Direct booking without commission and an accurate calendar. Scenario: fictional guest "Anika Fernando" books a lake-view family room for three nights, pays by card, and receives it in My bookings; the resort sees it in the admin overview.

#### Planned / in progress (not live)
None documented.

#### Example visitor questions & answers
- **Can guests book online?** Yes, with an account and card payment.
- **What rooms exist?** Family rooms, a jacuzzi family chalet, and standard chalets.
- **How is double booking prevented?** The server rejects overlapping bookings and honours blocked dates.
- **Who manages content?** The resort via an admin dashboard.
- **Can I see a demo?** The live site (production) or the portfolio overview at https://agentix-portfolio.vercel.app/#/demo/kaaya-eco-resort.
- **What currency?** Prices display in Sri Lankan rupees.
- **How does it differ from Woodpecker PMS?** Kaaya is a single-resort website with simple booking; Woodpecker runs multi-property operations.

#### Related projects
Woodpecker PMS (operations platform); Thames Wellness Spa and other hospitality-adjacent sites (Part elsewhere).

#### Verification notes
Checked: source routes, server routes, public site, public rooms data, git log. The database setup file was inspected for table names only and no environment file was opened. Not verified: payment mode, admin UI, whether blocked-date management has an admin screen. Missing: admin screenshots or confirmation of live payment mode.

---

## Fitness

### Max Register (Max Fitness gym CRM, kiosk and worker)

**Slug:** `max-register` · **Also known as:** Max Fitness Platform CRM, Max Haazri (the attendance kiosk idea) · **Category:** Fitness / gym CRM · **Status:** Live in production with real members (Verified for code and docs; login page seen; app not entered)
**Client / owner:** Max Fitness Gym, Indirapuram, Ghaziabad · **Local folder:** `E:\max-fitness` (`apps/web` `/crm`, `apps/worker`, `apps/face`) · **Last activity:** 2026-10-27 (237 commits)

#### Spoken introduction
Max Register is the gym owner's phone-first, Hindi-first register: who has paid, who is due, who to call, who walked in today. It sends WhatsApp renewal reminders by itself, lets reception renew a member in a few taps with a receipt, and includes a face-recognition check-in page. It is in production at Max Fitness.

#### Quick overview
A Next.js CRM inside the web app (the `/crm` area) with a background worker and a Python face service. Staff log in with a mobile number and a 4 to 6 digit PIN. Members carry a fee state shown by colour (green paid, amber due within seven days, red expired, grey none). The worker schedules WhatsApp reminders and an owner digest. It replaces notebooks and loose WhatsApp follow-ups.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| CRM login | https://maxfitnessgym.co.in/crm | Production, login required | Real members; do not log in or screenshot. Login by mobile or email plus PIN, 30-day sessions on a trusted phone. |
| Check-in kiosk page | https://maxfitnessgym.co.in/checkin | Production | Browser-based face/phone check-in used with the face service. |
| Public renewal link | https://maxfitnessgym.co.in/renew/<token> | Production | Per-member tokenised link. |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/max-register | Safe demo, fictional data, all actions simulated | Tier A. |
| Walkthrough | https://agentix-portfolio.vercel.app/#/demo/max-register/walkthrough | Safe demo | |
| Module: Today | https://agentix-portfolio.vercel.app/#/demo/max-register/walkthrough/today | Safe demo | |
| Module: renew | https://agentix-portfolio.vercel.app/#/demo/max-register/walkthrough/renew | Safe demo | Three-tap renewal and receipt. |
| Module: reminders | https://agentix-portfolio.vercel.app/#/demo/max-register/walkthrough/reminders | Safe demo | |
| Module: kiosk | https://agentix-portfolio.vercel.app/#/demo/max-register/walkthrough/kiosk | Safe demo | |
Other module ids: `members`, `new-member`, `calls`, `leads`, `verify`, `attendance`, `messages`, `bot`, `announcements`, `reports`, `diet`, `gallery`, `plans`, `audit`.

#### Target users & business problem
Gym owners and reception staff (low-tech, Hindi speakers) who track fees in notebooks, miss renewals and lose members. Members receive reminders and renewal links.

#### Features (complete inventory)
Status: **Partially verified**: strong evidence from code, a very detailed progress log and business rules; the signed-in app was not opened because it holds real members.

**1. Today (home)** (`/crm`) · Tiles for who is due, who needs a call, new arrivals and attendance; the starting point each day. Evidence: `crm/(app)/page.tsx`.

**2. Members** (`/crm/members`, `/new`, `/waiting`, `/[id]`, `/[id]/edit`, export) · List with fee colour bands, member profile with payments, attendance and personal training, correcting details, adding a member, a waiting list for pending signups, and a per-member data export. Fee state is derived from the end date (paid more than 7 days left; due soon 0 to 7; expired; none). Status: Verified (business rules, code).

**3. Renew** (`/crm/members/[id]/renew`) · Pick plan and payment mode, confirm; a receipt with a tokenised PDF link is generated and can be shared. Prices are copied onto each membership so later price changes do not alter past records. Evidence: `api/v1/receipts/[token]/pdf`.

**4. Plans and pricing** (`/crm/settings`) · Plans are one, three, six and twelve months, with separate male and female prices; the public website shows current fees. Status: Verified.

**5. Calls** (`/crm/calls`) · Automatic "calls to make" list with reasons (expired but visiting, signup not paid, new lead, verification pending, expired not renewed, due soon with no response, absent seven days, unsubscribed) and outcomes (will renew, call later, no answer, left gym, wrong number, done). A Done tab shows outcome counts.

**6. Leads** (`/crm/leads`) · Funnel from new to contacted, trial booked, visited, converted or lost, with sources (website, WhatsApp, walk-in, phone, Instagram, Google Business Profile, referral) and conversion rate.

**7. Verify** (`/crm/verify`) · Queue of existing customers who self-declared a fee-paid-till date via the reception QR; the owner approves or rejects.

**8. Attendance and kiosk** (`/crm/attendance`, `/crm/settings/kiosk`, public `/checkin`, `api/v1/checkin/*`, `api/v1/kiosk/*`) · Face check-in compares a live frame against the selfie from signup using an open-licence face engine (a separate Python service); fee state drives the greeting (green welcome, amber with days left, red asks to see reception and creates a call task); manual attendance by staff is always allowed; one event per member per cooldown (180 minutes default). Faces are used only with consent. The planned dedicated Android kiosk app folder is empty; the working kiosk is the browser page. Attendance export exists. Status: Verified (code, progress log); no attendance data seen.

**9. WhatsApp reminder engine** (worker `reminders`, `/crm/messages`, `/crm/messages/simulator`, webhooks) · Default rules: seven, three, two and one day before expiry and on the day at 10:00 IST, then daily at 19:00 IST for up to seven days after expiry; eligibility is rechecked at send time (active, opted in, not paused, not already renewed, within quiet hours); idempotent keys prevent duplicates; unsubscribing stops them. Production went live with WhatsApp and Razorpay on 2026-10-16. A message simulator exists for demo mode. Messages screen is an inbox with replies (`api/v1/crm/messages/reply`). Status: Verified (docs, code); live sends not independently observed.

**10. Bot** (`/crm/bot`) · A WhatsApp assistant with owner-configured documents and replies for gym questions. Status: Partially verified (code, progress log).

**11. Announcements** (`/crm/announcements`) · Broadcast notices to audiences.

**12. Diet** (`/crm/diet`, public `/diet/[token]`) · Diet profiles and plans shared through a tokenised page, with follow-ups. Content is operational; not medical advice.

**13. Gallery** (`/crm/gallery`) · Owner-managed photos used on the website.

**14. Reports** (`/crm/reports`, export) · Reports over a day, week, year or custom range; shared period picker.

**15. Import** (`/crm/import`, template) · Bulk member import from a spreadsheet.

**16. Settings, staff, PIN, audit** (`/crm/settings/staff`, `/crm/more/pin`, `/crm/more/audit`) · Staff accounts with roles (owner, reception, trainer, super admin), PIN management, and an audit trail screen of sensitive actions such as voiding a payment.

**17. Online payments and autopay** (`api/v1/checkout/*`, `webhooks/razorpay`) · Razorpay orders and signed webhooks; recurring e-mandate (autopay) was built and deployed 2026-10-05. Demo mode simulates payments.

**18. Offline and PWA** (`/crm/offline`, web manifest) · Installable on the owner's phone.

**19. Languages** · Hindi by default for the CRM, English toggle; website English by default with Hindi.

#### Key workflows (end to end)
1. Reception logs in with mobile and PIN and opens Today.
2. Members arrive; face check-in or manual attendance records the visit.
3. A member nears expiry; the worker sends WhatsApp reminders; the member opens the tokenised renewal link or pays at the desk.
4. Reception renews in a few taps; a receipt is produced; reminders stop.
5. Unpaid or lapsed members appear on the Calls list; outcomes are logged.
6. Website enquiries and QR signups enter Leads or Verify; the owner confirms.
7. The owner reads reports and the nightly digest.
Permissions: staff sign in with PIN; lockouts and rate limits exist (security review noted).

#### User roles & permissions
Owner, reception, trainer, super admin (staff role enum); fine-grained access per role was not enumerated. Members have no CRM login; they use tokenised links and the QR flow.

#### Technical architecture & integrations
Turborepo monorepo: Next.js 16 and React 19 web app with next-intl (Hindi and English), Tailwind 4 and Radix; Prisma 7 on Postgres (Supabase, Mumbai); a pg-boss worker app; a Python face service (OpenCV YuNet and SFace, commercially licensed models); WhatsApp Cloud API; Razorpay; browser-side face detection (MediaPipe); Docker on Coolify. Environment names include demo mode, WhatsApp allowlist, face service token (values never shown). Tests: unit, integration and accessibility suites reported in the progress log. Known open items per the log: end-to-end suite not completed cleanly, a stricter content-security policy untested in browser, and server-to-database distance causing latency.

#### Business value & example scenarios
Fewer missed renewals and less owner time on phone follow-up. Scenario: fictional member "Neha Arora" has seven days left; she gets a WhatsApp reminder, taps the renewal link, pays, and reminders stop; reception sees the receipt.

#### Planned / in progress (not live)
The dedicated Android kiosk app ("Max Haazri" Phase 7) is unbuilt (folder empty per the 2026-10-07 log). A UI refresh branch (`design/crm-refresh`) was prepared for review.

#### Example visitor questions & answers
- **Who uses it?** The gym owner and reception.
- **Does it support Hindi?** Yes, default.
- **How do renewals work?** Three taps in the CRM or a tokenised link; a receipt follows.
- **Does it recognise faces?** A face service compares to the member's signup selfie, with consent.
- **Can I see a demo?** https://agentix-portfolio.vercel.app/#/demo/max-register (safe demo, fictional data).
- **Is the live CRM open?** No, it is login-protected and holds real members.
- **Does it send WhatsApp reminders automatically?** Yes, per documented rules.

#### Related projects
Max Fitness website (`max-website`, the public side of the same app); Fitness First Dwarka (a different gym website).

#### Verification notes
Checked: CLAUDE.md, business rules, progress log, face README, routes, git log, public login page. Not opened: the signed-in CRM and any member data. Missing: sanitized screenshots or a seeded demo-mode instance; confirmation of how many gyms use it (the code is built single-gym).

---

### Max Fitness website

**Slug:** `max-website` · **Also known as:** maxfitnessgym.co.in · **Category:** Fitness / gym website with signup · **Status:** Live (Verified)
**Client / owner:** Max Fitness Gym, Indirapuram, Ghaziabad · **Local folder:** `E:\max-fitness` (`apps/web` public routes) · **Last activity:** 2026-10-27

#### Spoken introduction
This is the public website of Max Fitness Gym in Indirapuram. Visitors can read about the gym, compare fees, request a call back, sign up online with a selfie, or use a reception QR code to register. Everything feeds the gym's Max Register CRM.

#### Quick overview
A bilingual (English and Hindi) Next.js site on the same application as Max Register. It presents the gym (since 2000, owner-coached, Google rating shown), facilities, plans, personal training and supplements, then offers a call-back form, a three-step online sign-up, and a QR page for walk-ins. It turns local searches into members.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| Home (English) | https://maxfitnessgym.co.in/ | Production, public site | |
| Hindi | https://maxfitnessgym.co.in/hi | Public site | |
| Sign up | https://maxfitnessgym.co.in/join | Production | Writes a real member record; do not submit test data. |
| Reception QR | https://maxfitnessgym.co.in/qr | Production | Existing member or new visitor options. |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/max-website | Safe demo, fictional data, all actions simulated | No module file exists yet (js/demos/max-website.js absent); the walkthrough in the Max Register demo covers the public side. |

#### Target users & business problem
People near Indirapuram looking for a gym, and walk-ins at the desk. Problem: local gyms rely on walk-ins and word of mouth.

#### Features (complete inventory)
Status: **Verified** (live pages and code).

**1. Content sections** · About, facilities (strength zone, cardio zone, functional floor, personal training, diet plans, supplements at the counter, lockers, water, parking, air-conditioning), owner story with reviews, working hours, contact. Evidence: live home text.

**2. Plans and fees** · Monthly, three, six and twelve months for men and women, with effective monthly rate and savings, plus personal-training pricing. Prices are on the live page and can change; this guide does not quote them.

**3. Call-back form** · Name, mobile, goal; a hidden honeypot field blocks bots; creates a lead (`api/v1/leads`) in the CRM.

**4. Online sign-up** (`/join`, `/join/plan`, `/join/pay`, `/join/done`) · Step one: details, date of birth, gender, live selfie, consents (terms, WhatsApp updates, optional face use for attendance); then plan selection; then payment. Mobile verification by OTP routes exist. Opens as a modal over the page or as full pages.

**5. Reception QR** (`/qr`, `/qr/existing`, `/qr/new`, `/qr/done/[ref]`) · "I am already a member" sends details and the date fees are paid until for the owner's Verify queue; "I am new here" shows plans and details and pays at reception.

**6. Member links** · Renewal (`/renew/[token]`) and short links (`/r/[token]`), diet plan page (`/diet/[token]`), legal pages (terms, privacy, refund and cancellation).

**7. Language switch and SEO** · Hindi and English with a toggle; Google rating, local-business metadata.

#### Key workflows (end to end)
1. Visitor lands, reads, compares plans.
2. They request a call back, sign up online, or scan the QR at the desk.
3. A lead or pending member appears in Max Register; reception follows up or verifies.
4. Payment (online or desk) activates the membership.

#### User roles & permissions
Public visitors only; staff use the CRM.

#### Technical architecture & integrations
Same Next.js app and Postgres database as Max Register, Razorpay for payments, WhatsApp Cloud API for messages, Coolify hosting; the site can be framed by the AI Agentix portfolio (added 2026-10-27).

#### Business value & example scenarios
More enquiries captured and fewer desk data entries. Scenario: fictional visitor "Riya Sethi" scans the QR, picks "I am new here", fills her details, and reception collects the fee.

#### Planned / in progress (not live)
Ads and assistant content briefs exist as documents (2026-10-27) but are not site features.

#### Example visitor questions & answers
- **Can I join online?** Yes, via /join.
- **Is Hindi supported?** Yes, /hi.
- **What if I am already a member?** Use the reception QR; the owner verifies.
- **Are fees listed?** Yes, on the live page; check there for current prices.
- **Can I see a demo?** https://agentix-portfolio.vercel.app/#/demo/max-website (overview) and the Max Register demo.
- **Does it connect to the CRM?** Yes, same system.

#### Related projects
Max Register (`max-register`).

#### Verification notes
Checked: live English, Hindi, join and QR pages; route list. Not verified: payment completion (production). Missing: none critical; no dedicated portfolio module yet.

---

### Fitness First Dwarka website

**Slug:** `fitness-first` · **Also known as:** Fitness First Dwarka, fitnessfirstdwarka.com · **Category:** Fitness / premium gym website · **Status:** Live (Verified)
**Client / owner:** Fitness First Dwarka, West Delhi · **Local folder:** `D:\Agentix Project\Fitness First` · **Last activity:** no git repository; newest source file dated 2026-08-19

#### Spoken introduction
This is the website for Fitness First Dwarka, a premium gym in West Delhi. It leads with video, lists programmes, trainers and membership plans, and sends every enquiry to the gym by email and into a database, with a "Book Your Free Trial" pop-up.

#### Quick overview
A Next.js site exported as static files and hosted on Apache/cPanel, with PHP form handlers and MySQL. Pages: home, programmes, trainers, membership, FAQs, contact, thank-you and a printable membership application form. It turns visitors into trial bookings and enquiries.

#### Links & access
| Purpose | URL | Type | Notes |
|---|---|---|---|
| Main site | https://fitnessfirstdwarka.com/ | Production public site | Do not submit test enquiries. |
| Programmes | https://fitnessfirstdwarka.com/programs/ | Public site | |
| Membership | https://fitnessfirstdwarka.com/membership/ | Public site | |
| Trainers | https://fitnessfirstdwarka.com/trainers/ | Public site | |
| Portfolio overview | https://agentix-portfolio.vercel.app/#/demo/fitness-first | Safe demo, fictional data, all actions simulated | No module file yet (js/demos/fitness-first.js absent). |

#### Target users & business problem
People in Dwarka considering a premium gym. Problem: match a premium brand and turn browsers into trial bookings.

#### Features (complete inventory)
Status: **Verified** (live pages and source).

**1. Home** · Hero video, offers section (two time-limited offers were shown at check time with dates in August 2026, so they may be outdated), brand pillars (equipment, certified trainers, structured programmes, interiors), member transformation stories, month-on-month membership plans, address, hours, newsletter.

**2. Programmes** · Personal training, HIIT, yoga and meditation, Zumba, strength and conditioning, spin, corporate wellness, fitness certifications. Group classes by an international fitness brand are named only in the page's search description, not as program cards.

**3. Trainers** · Eleven trainer profiles with a know-more detail (per the client's change list).

**4. Membership** · Plan cards and a month-on-month (EMI) structure with an initial bundle and automatic monthly debits set up by the gym through an authorisation link. Amounts are on the live page and change; this guide does not quote them. A downloadable membership application form with health questions and signatures posts to the PHP API.

**5. Lead capture** · Floating "Book Your Free Trial" widget that auto-opens on the home page and sends the lead to a PHP handler, then opens a thank-you page for conversion tracking; enquiry and contact forms post to `submit-form.php`, store in MySQL (table `form_submissions`) and send email via PHPMailer. A WhatsApp widget and click-to-call exist.

**6. Analytics** · Google Tag Manager and Google Ads tags.

**7. FAQs, contact, legal links.** Terms, privacy and refund links are present in the footer.

#### Key workflows (end to end)
1. Visitor watches the hero, reads programmes and trainers.
2. They compare plans and offers.
3. They click Enquire or the free-trial widget.
4. The form is stored and emailed; the visitor lands on a thank-you page.
5. The sales desk follows up.

#### User roles & permissions
Public visitors only; there is no admin in the repo beyond the database and email.

#### Technical architecture & integrations
Next.js 14 (static export), Tailwind, Framer Motion; PHP 8 handlers using PDO and MySQL; PHPMailer; the shared lead-widget (popup form) pattern; Apache/cPanel; GTM and Google Ads. Credentials are in server config files (not read).

#### Business value & example scenarios
Brand-led conversion and traceable enquiries. Scenario: fictional visitor "Devansh Rao" opens the page, watches the video, claims a free trial in the pop-up and receives a call.

#### Planned / in progress (not live)
None documented.

#### Example visitor questions & answers
- **What does the site offer?** Programmes, trainers, plans and a free-trial request.
- **Where do enquiries go?** To the gym's email and a MySQL database.
- **Is there online payment?** No; plans are enquiry-led.
- **Can I see a demo?** Live site, or https://agentix-portfolio.vercel.app/#/demo/fitness-first.
- **How does it differ from Max Fitness?** Fitness First is a marketing site only; Max Fitness has signup, payments and a CRM.

#### Related projects
Max Fitness website and Max Register.

#### Verification notes
Checked: live home and subpages (HTTP 200 for programs, membership, trainers, faqs, contact), source routes, API docs and schema. Not verified: leads actually received, any admin. Missing: git history/last-activity date; the portfolio listing mentions Les Mills programmes, but the site names them only in meta text, so confirm with the client.
