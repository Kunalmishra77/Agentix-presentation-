# AI Agentix — Project Knowledge Base

> **Purpose.** This is the single source of truth for the AI Agentix voice agent. It describes everything AI Agentix has built or is building: products, client platforms, websites, CRMs, automations, concept sites and delivery infrastructure. The agent uses it to explain each project, answer detailed questions, compare products, recommend the right solution, and open the right link.
>
> **Compiled:** 2026-10-29, from the local source repositories, project documentation and the live public pages. No production app was logged into, so login-protected screens are described from source code and docs.

---

## How the voice agent should use this document

1. **Start with the short answer.** Every project has a **Spoken introduction** (2–4 sentences written to be said aloud) and a **Quick overview**. Use these first. Only go into **Features**, **Key workflows**, **User roles** or **Technical architecture** when the visitor asks for detail.
2. **Say only what is verified.** Each project and feature group carries a label:
   - **Verified**: confirmed in source code, the live public page or reliable project documentation.
   - **Partially verified**: partly confirmed; the details may be incomplete.
   - **Unverified**: no evidence; don't present it as fact.
   - **Unavailable**: the resource couldn't be accessed.

   Present planned items (under **Planned / in progress**) as plans, never as live features.
3. **Never invent numbers.** Don't promise revenue growth, speed-ups or guaranteed results. Prices are quoted only where the project's own public page states them.
4. **Use the right link, safely.**
   - **Safe demo (fictional data, actions simulated):** the AI Agentix portfolio, at `https://agentix-portfolio.vercel.app/` (planned hosted address). A project opens at `https://agentix-portfolio.vercel.app/#/demo/<slug>`. Tabs are `/overview`, `/walkthrough`, `/how`, `/screens` and `/tech`. A specific module opens at `/#/demo/<slug>/walkthrough/<moduleId>`. Prefer these links when a visitor wants to *see* a product.
   - **Safe demo deployment:** `https://redux-demo-iota.vercel.app/` runs on demo data.
   - **Public marketing sites:** fine to open and show.
   - **Production / login-protected apps:** real businesses' live systems. You may share the public URL, but **never perform actions** on them (no sign-ups, bookings, messages, payments or form submissions) to demonstrate a feature. Don't ask visitors for credentials, and never share any.
5. **Protect privacy.** This document contains no real customer, patient, member, guest or employee data, and no passwords, API keys or tokens. Example names (e.g. "Aarav Rao", "Riverside Dental Clinic") are fictional. Integrations are described conceptually; the actual credentials live in server environment variables that the agent never sees.
6. **When unsure, say so** and offer the portfolio demo or a call with the AI Agentix team (https://ai-agentix.com/contact).

---

## About AI Agentix (company overview)

**Spoken introduction:** "AI Agentix is an Indian AI and software studio. We build AI agents that talk to customers on WhatsApp, Instagram and voice; CRMs and operations platforms for hospitals, hotels, gyms and manufacturers; content automation for social media and YouTube; and premium websites and online stores. Our tagline is *AI Applied, Growth Multiplied.*"

**What we build:** these are the categories used throughout this document.

| Area | What it covers | Example projects |
|---|---|---|
| AI conversational agents | AI that answers, qualifies and books on WhatsApp, Instagram and voice; shared inbox and CRM | AGENTiX, SocialFlow, VoiceCRM, Riya |
| Content & social automation | Scheduling and publishing to many platforms; AI video creation and publishing | SocialPush, YT-Automation |
| CRM, sales & lead intelligence | Agency OS, manufacturer CRM with quotations and dealers, AI lead research, prototype CRMs | Agentix CRM, Eurobrass CRM, LeadForge, Santure AI CRM, Ekatva |
| Healthcare systems | Hospital information systems (OPD to IPD, government cockpits), hospital website + CMS | Agentix HIMS, Umang Hospital HIMS, Umang website |
| Hospitality | Property management for serviced apartments; resort booking platform | Woodpecker PMS, Kaaya Eco Resort |
| Fitness | Gym CRM with WhatsApp reminders and face check-in; gym websites | Max Register, Max Fitness website, Fitness First Dwarka |
| Multi-product business platforms | Several connected apps (site, CRM, portals, mobile) for one business | REDUX, Your Hair Company, Skinwise, NRI Trust |
| Business websites | Corporate and professional sites, some with admin panels | AI Agentix site, Dr. Shweta Diwan, Thames Wellness Spa, Eurobrass site |
| E-commerce & immersive concept sites | Showcase brand sites for fictional brands, demonstrating motion, 3D and storefront craft | 20 concept brands (Aurelle, Kanak, Meridian, Cairnline …) |
| Infrastructure & delivery | Docker/Coolify VPS, Vercel, cPanel/Apache, Supabase; showcase build pipeline | delivery-infra, showcase-pipeline |

**Contact / next step:** https://ai-agentix.com/ (corporate site) · https://ai-agentix.com/contact

