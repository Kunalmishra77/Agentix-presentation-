(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  var SHOWCASE = "https://showcase-build-tau.vercel.app/";

  function shots(slug, withMid) {
    var out = [{ src: "assets/shots/" + slug + "/hero.png", caption: "Landing page, first screen" }];
    if (withMid) out.push({ src: "assets/shots/" + slug + "/mid.png", caption: "Landing page, mid-scroll" });
    return out;
  }
  function F(group) { return { group: group, items: Array.prototype.slice.call(arguments, 1) }; }
  function W(title, desc) { return { title: title, desc: desc }; }

  // Concept brand helper: fictional brand, embedded live from the showcase deployment.
  function concept(o) {
    return {
      slug: o.slug, name: o.name, client: "Concept brand by AGENTiX", category: o.category, status: "concept",
      tier: o.tier || "C", year: o.year || 2026,
      summary: o.summary, problem: o.problem, outcomes: o.outcomes, features: o.features, workflow: o.workflow,
      stack: o.stack || ["HTML", "CSS", "JavaScript", "GSAP", "ScrollTrigger", "Lenis"],
      liveUrl: SHOWCASE + o.path + "/",
      embed: { url: SHOWCASE + o.path + "/", mode: "iframe" },
      shots: o.noShots ? [] : shots(o.slug, o.mid !== false), demo: false
    };
  }

  AX.projects = [
    /* ---------------- 01 AI Conversational Agents ---------------- */
    {
      slug: "agentix", name: "AGENTiX", client: "AGENTiX", category: "agents", status: "live", tier: "A", year: 2026,
      summary: "A multi-tenant AI agent for WhatsApp and Instagram that answers customers, qualifies leads and books appointments, with a full CRM, campaigns and growth tools behind it.",
      problem: "Small businesses lose leads on slow replies and scattered chats, and juggle five tools to follow up, advertise and measure what works.",
      outcomes: ["Every enquiry gets an instant, on-brand reply at any hour", "Hot, warm and cold leads sorted automatically on one board", "Campaigns, bookings and Google presence managed in one place", "Flat monthly pricing with no per-seat surprises"],
      features: [
        F("Conversations", "Shared WhatsApp and Instagram inbox", "AI agent that qualifies and books", "Message templates"),
        F("CRM & Pipeline", "Hot / warm / cold Kanban CRM", "Bookings and appointments", "Win-back campaigns"),
        F("Automation", "ReactFlow flow builder", "Broadcast campaigns with delivery stats"),
        F("Growth Hub", "Meta and Google lead hub", "Google Business Profile management", "Local rank tracking", "Google Ads", "Marketing ROI dashboard"),
        F("Super Admin", "Client management", "Bot health monitoring", "Meta spend tracking")
      ],
      workflow: [
        W("Customer messages", "A prospect writes on WhatsApp or Instagram."),
        W("AI replies and qualifies", "The agent answers from the business knowledge and scores the lead."),
        W("Lead lands on the board", "The card appears on the Kanban as hot, warm or cold."),
        W("Booking confirmed", "The agent offers slots and books the appointment."),
        W("Follow-up and campaigns", "Templates and broadcasts bring the customer back."),
        W("ROI reporting", "Spend and conversions roll up into the marketing dashboard.")
      ],
      stack: ["React", "Node.js", "PostgreSQL", "WhatsApp Cloud API", "Meta Graph API", "ReactFlow", "Docker", "Coolify"],
      liveUrl: "https://app.aiagentixdev.com/", embed: { url: "https://app.aiagentixdev.com/", mode: "iframe" },
      shots: shots("agentix", true), demo: true
    },
    {
      slug: "socialflow", name: "SocialFlow", client: "AGENTiX", category: "agents", status: "live", tier: "A", year: 2026,
      summary: "Grown from the InstaAgent v1 prototype, a single-tenant Instagram DM agent with follow-gate, into Instagram, Facebook and Telegram automation with a knowledge-grounded AI inbox, comment-to-DM funnels, a design studio and a profile audit in one workspace.",
      problem: "Brands spend hours replying to comments and DMs, then lose followers who never get the link they asked for.",
      outcomes: ["Comment keywords trigger instant DMs with follow-gate checks", "AI replies stay grounded in the brand's own knowledge base", "Content, calendar and reels planned in one studio", "Profile Score shows exactly what to fix next"],
      features: [
        F("Inbox & AI", "Unified AI inbox grounded in a knowledge base", "Keyword rules", "Sequences"),
        F("Automation", "Comment-to-DM with follow-gate", "Visual flows"),
        F("Content", "Content studio and calendar", "Fabric.js design editor", "Reels studio"),
        F("Insights", "Profile Score", "Post Audit"),
        F("Business", "CRM", "Bookings", "Commerce", "Influencers"),
        F("Origins", "Evolved from InstaAgent v1: single-tenant Instagram DM agent with follow-gate")
      ],
      workflow: [
        W("Post goes live", "A reel or post invites people to comment a keyword."),
        W("Comment detected", "The rule engine matches the keyword in real time."),
        W("Follow-gate", "The bot checks the follower follows before sending."),
        W("DM delivered", "The link or offer lands in the inbox automatically."),
        W("AI continues", "The knowledge-grounded agent handles the follow-up chat."),
        W("Lead captured", "The contact flows into the CRM with its source.")
      ],
      stack: ["React", "Node.js", "Meta Graph API", "Telegram Bot API", "Fabric.js", "PostgreSQL", "Docker", "Coolify"],
      liveUrl: "https://social-media.aiagentixdev.com/", embed: { url: "https://social-media.aiagentixdev.com/", mode: "iframe" },
      shots: shots("socialflow", true), demo: true
    },
    {
      slug: "voicecrm", name: "VoiceCRM", client: "AGENTiX", category: "agents", status: "proto", tier: "A", year: 2026,
      summary: "A CRM built around an AI voice bot's calls, with transcripts, summaries, sentiment, lead scores and follow-up tasks on every conversation.",
      problem: "Voice bots generate hundreds of calls, but nobody has time to listen to them, so hot leads go cold.",
      outcomes: ["Every call summarised and scored automatically", "Live calls board shows what the bot is doing right now", "Follow-up tasks created without manual notes", "One tap to continue the conversation on WhatsApp"],
      features: [
        F("Call Intelligence", "Full transcript", "AI summary", "Sentiment", "Lead score"),
        F("Live Operations", "Live-calls board"),
        F("Follow-up", "Follow-up tasks", "WhatsApp from the lead page"),
        F("Analytics", "Dashboard and conversion funnel")
      ],
      workflow: [
        W("Bot takes the call", "The AI voice agent speaks with the caller."),
        W("Transcript streams in", "Words appear on the live board as they are spoken."),
        W("AI analyses", "Summary, sentiment and a lead score are generated."),
        W("Lead card created", "The contact is saved with the call attached."),
        W("Task assigned", "A follow-up task is queued for the sales team."),
        W("WhatsApp follow-up", "One tap opens the chat from the lead page.")
      ],
      stack: ["React", "Vercel", "Speech-to-text", "LLM summarisation", "Chart components"],
      liveUrl: "https://voice-crm-snowy.vercel.app/", embed: { url: "https://voice-crm-snowy.vercel.app/", mode: "iframe" },
      shots: [], demo: true
    },
    {
      slug: "riya-crm", name: "Riya, Fitness First WhatsApp CRM", client: "Fitness First", category: "agents", status: "proto", tier: "B", year: 2026,
      summary: "A sales dashboard over Riya, the WhatsApp bot that talks to gym leads, scores them and tracks every trial, conversion and loss.",
      problem: "Gym sales teams cannot see which WhatsApp conversations are worth a call, so trials slip away unnoticed.",
      outcomes: ["Every bot conversation scored and sorted", "Outcomes tracked from trial booked to converted or lost", "Daily follow-up list ready for the sales desk", "Sentiment makes unhappy leads visible early"],
      features: [
        F("Conversations", "Riya chat replay", "Sentiment analysis"),
        F("Pipeline", "Lead scoring", "TrialBooked / Converted / Lost outcomes"),
        F("Sales Desk", "Follow-up tasks", "KPI dashboard")
      ],
      workflow: [
        W("Lead messages Riya", "A prospect asks about memberships on WhatsApp."),
        W("Riya qualifies", "The bot learns goals and budget in chat."),
        W("Trial booked", "A free trial slot is confirmed in the conversation."),
        W("Dashboard updates", "The lead flips to TrialBooked and gets a score."),
        W("Sales follow-up", "A task reminds the team to call after the trial.")
      ],
      stack: ["Node.js", "WhatsApp Cloud API", "LLM", "React", "MySQL"],
      shots: [], demo: true
    },

    /* ---------------- 02 Content & Social Automation ---------------- */
    {
      slug: "socialpush", name: "SocialPush", client: "AGENTiX", category: "content", status: "active", tier: "A", year: 2026,
      summary: "Write once and publish everywhere: Facebook, Instagram, YouTube, Threads, Pinterest and X, with the right crop, caption and schedule for each.",
      problem: "Posting the same idea to six platforms by hand means six formats, six logins and plenty of missed slots.",
      outcomes: ["One composer drives every platform", "Per-platform media crops are prepared automatically", "Failed posts retry on their own", "Analytics show what actually performed"],
      features: [
        F("Publishing", "Six-platform composer: Facebook, Instagram, YouTube, Threads, Pinterest, X", "Per-platform media crops", "AI captions"),
        F("Scheduling", "Drag-and-drop calendar", "Retrying publish workers"),
        F("Insights", "Analytics across platforms")
      ],
      workflow: [
        W("Compose once", "Write the post and attach media."),
        W("Pick platforms", "Toggle networks and see live previews of each."),
        W("Schedule", "Choose a slot or drag it on the calendar."),
        W("Queued", "The job enters the BullMQ queue."),
        W("Publishing", "Workers post to each network and retry on failure."),
        W("Published and measured", "Status turns green and analytics begin.")
      ],
      stack: ["Node.js", "BullMQ", "Redis", "PostgreSQL", "Microservices", "Kubernetes", "Docker"],
      shots: [], demo: true
    },
    {
      slug: "yt-automation", name: "YT-Automation", client: "AGENTiX", category: "content", status: "live", tier: "A", year: 2026,
      summary: "A multi-user YouTube studio that takes an idea to a published video: script, narration, visuals, captions, thumbnail and SEO, with a human approval gate.",
      problem: "Producing consistent video takes a crew, and AI shortcuts cost money without guardrails.",
      outcomes: ["Idea to publish-ready video in one pipeline", "Hindi and English captions included", "A hard cost ceiling stops runaway spend", "Nothing goes live without human approval"],
      features: [
        F("Creation", "Idea and AI script", "Narration in your own voice", "AI visuals and motion clips"),
        F("Polish", "Captions in Hindi and English", "Thumbnail and SEO"),
        F("Control", "Human approval gate", "Cost ceiling per video", "Publish scheduling")
      ],
      workflow: [
        W("Story idea", "Type a prompt or pick a planned topic."),
        W("Script and narration", "AI writes the script and voices it."),
        W("Visuals and motion", "Scenes are generated and animated."),
        W("Captions, thumbnail, SEO", "Hindi or English subtitles and metadata are prepared."),
        W("Review and approve", "A human checks the render and cost."),
        W("Publish", "The video is scheduled to the connected channel.")
      ],
      stack: ["Node.js", "Python", "LLM", "Text-to-speech", "Video generation", "FFmpeg", "YouTube API"],
      liveUrl: "https://yt-automation.aiagentixdev.com/", embed: { url: "https://yt-automation.aiagentixdev.com/", mode: "iframe" },
      shots: shots("yt-automation", true), demo: true
    },

    /* ---------------- 03 CRM, Sales & Lead Intelligence ---------------- */
    {
      slug: "agentix-crm", name: "Agentix CRM", client: "AGENTiX (internal)", category: "crm", status: "live", tier: "A", year: 2026,
      summary: "The internal agency operating system: clients, project stories on a global Kanban, leads, invoices, targets and AI-assisted proposals in one place.",
      problem: "Agencies run clients, projects and billing across spreadsheets, so nobody sees the true state of the business.",
      outcomes: ["One board for every project story across all clients", "Invoices and revenue tracked against targets", "AI helps analyse proposals and draft status emails", "Founders get a private view of the whole business"],
      features: [
        F("Delivery", "Clients", "Project stories on a global Kanban"),
        F("Sales", "Leads", "Gemini proposal analysis", "Gemini status emails"),
        F("Finance", "Invoices", "Revenue targets", "Salary and incentives"),
        F("Leadership", "Founder-only area")
      ],
      workflow: [
        W("Lead enters", "A new enquiry is logged with its source."),
        W("Proposal analysed", "AI reviews the proposal and flags gaps."),
        W("Client onboarded", "The client record and projects are created."),
        W("Stories on the board", "Work moves across the global Kanban."),
        W("Invoice raised", "Billing follows milestones."),
        W("Targets reviewed", "Revenue is compared with the plan.")
      ],
      stack: ["Node.js", "Express", "MongoDB", "Gemini API", "EJS"],
      shots: [], demo: true
    },
    {
      slug: "eurobrass-crm", name: "Eurobrass CRM", client: "Eurobrass", category: "crm", status: "active", tier: "A", year: 2026,
      summary: "A complete CRM for a bathroom-fittings manufacturer: leads, dealers, catalogue, quotations, orders, service tickets and a dealer portal.",
      problem: "Leads, quotes and dealer orders lived in separate files, making follow-up and service slow and error-prone.",
      outcomes: ["Quotations built from the live catalogue in minutes", "Dealers get their own portal for orders", "Service tickets and technicians tracked end to end", "Roles and audit trail keep data controlled"],
      features: [
        F("Sales", "Leads", "Quotation builder with PDF", "Orders"),
        F("Dealers", "Dealer management", "Dealer portal"),
        F("Catalogue & Stock", "Product series and finishes", "Inventory"),
        F("After-sales", "Service tickets", "Technician assignment"),
        F("Governance", "Roles and permissions", "Audit log")
      ],
      workflow: [
        W("Lead captured", "An enquiry arrives from a dealer or customer."),
        W("Catalogue selection", "Products, series and finishes are chosen."),
        W("Quotation sent", "A PDF quote is generated and sent."),
        W("Converted to order", "Accepted quotes become orders."),
        W("Dispatch and stock", "Inventory is updated."),
        W("Service follow-up", "Tickets and technicians handle after-sales.")
      ],
      stack: ["React", "Vercel", "Node.js", "PDF generation"],
      liveUrl: "https://eurobrass-seven.vercel.app/", embed: { url: "https://eurobrass-seven.vercel.app/", mode: "iframe" },
      shots: [], demo: true
    },
    {
      slug: "leadforge", name: "LeadForge", client: "AGENTiX", category: "crm", status: "active", tier: "B", year: 2026,
      summary: "Lead research in plain English: describe the audience and LeadForge discovers, crawls and dedupes leads, with the source of every field shown.",
      problem: "Buying lead lists is expensive and stale, and manual research does not scale.",
      outcomes: ["Type a sentence, get a structured lead list", "Every field carries its source, URL and confidence", "Duplicates removed automatically", "Trust in the data because provenance is visible"],
      features: [
        F("Research", "Plain-English query parsing", "Discovery", "Crawl"),
        F("Quality", "Dedupe", "Provenance: source, URL, confidence on every field"),
        F("Output", "Leads table", "Progress stream")
      ],
      workflow: [
        W("Describe the audience", "Write the target in a sentence."),
        W("Spec parsed", "The sentence becomes structured criteria."),
        W("Discovery", "Sources are searched for matching businesses."),
        W("Crawl", "Sites are read to extract contact and detail fields."),
        W("Dedupe and score", "Duplicates merge and confidence is set."),
        W("Leads delivered", "A table with provenance for each cell.")
      ],
      stack: ["Node.js", "TypeScript", "PostgreSQL", "Playwright", "LLM", "Docker", "Coolify"],
      shots: [], demo: true
    },
    {
      slug: "santure-crm", name: "Santure AI CRM", client: "Santure AI", category: "crm", status: "proto", tier: "C", year: 2026,
      summary: "An interactive prototype of an operations platform for every team and brand at Santure AI, built with demo data.",
      problem: "Multi-brand teams need one place to run operations, but off-the-shelf tools never match their structure.",
      outcomes: ["One workspace across teams and brands", "Clickable prototype validates the idea before build", "Demo data keeps the review safe", "Clear path from prototype to production"],
      features: [
        F("Operations Platform", "Team workspaces", "Brand-level views", "Interactive prototype with demo data")
      ],
      workflow: [
        W("Define teams and brands", "Map how the organisation works."),
        W("Prototype the screens", "Build the key views as an interactive prototype."),
        W("Review with stakeholders", "Click through with demo data."),
        W("Refine", "Adjust flows before development."),
        W("Plan the build", "Turn the prototype into a delivery plan.")
      ],
      stack: ["Claude artifact", "HTML", "JavaScript"],
      shots: [], demo: true
    },
    {
      slug: "ekatva", name: "Ekatva", client: "Ekatva", category: "crm", status: "proto", tier: "C", year: 2026,
      summary: "A relationship and operations platform prototype for insurance and wealth distributors, with fictional data throughout.",
      problem: "Distributors manage clients, policies and renewals across disconnected tools and memory.",
      outcomes: ["Client relationships in one view", "Renewals and reviews surfaced on time", "Operations tracked alongside sales", "Prototype proves the workflow quickly"],
      features: [
        F("Relationship Management", "Client profiles", "Policy and portfolio overview"),
        F("Operations", "Renewal and review tracking", "Interactive prototype with fictional data")
      ],
      workflow: [
        W("Onboard the client", "Create the relationship record."),
        W("Capture policies and portfolio", "Attach what the client holds."),
        W("Track renewals", "Dates and reviews are surfaced."),
        W("Engage", "Reach out at the right moment."),
        W("Review operations", "See the book of business at a glance.")
      ],
      stack: ["Claude artifact", "HTML", "JavaScript"],
      shots: [], demo: true
    },

    /* ---------------- 04 Healthcare ---------------- */
    {
      slug: "agentix-hims", name: "Agentix HIMS", client: "AGENTiX", category: "health", status: "proto", tier: "A", year: 2026,
      summary: "An AI-first hospital information system at state scale: 24 role portals, a patient portal and cockpits for health leadership.",
      problem: "Government hospitals run on disconnected departments, so patient journeys stall and leadership lacks a live picture.",
      outcomes: ["One patient record across every department", "Role portals show each person only what they need", "AI flags risk early: triage, NEWS2, sepsis, drug safety", "Leadership sees district performance live"],
      features: [
        F("Clinical Portals", "Doctor", "Nurse", "Pharmacy", "Lab", "OT", "Emergency", "Blood bank"),
        F("Operations & Finance", "Billing", "24 role-based portals in total"),
        F("Patients", "Patient portal", "ABHA and AB-PMJAY integration"),
        F("Leadership", "Health Secretary cockpit", "CMO cockpit", "District ranking"),
        F("AI & Compliance", "AI triage", "NEWS2 scoring", "Drug-safety checks", "Sepsis watch", "NABH and DISHA audit")
      ],
      workflow: [
        W("Patient arrives", "Registered through ABHA or the front desk."),
        W("AI triage", "Risk is scored and routed."),
        W("Consultation", "The doctor sees history and AI alerts."),
        W("Lab and pharmacy", "Orders flow to the departments."),
        W("Billing and schemes", "Charges or AB-PMJAY claims are settled."),
        W("Cockpit view", "Outcomes roll up to the Secretary and CMO.")
      ],
      stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Zustand", "Recharts", "Framer Motion", "next-intl", "react-hook-form + Zod", "Supabase (RLS)", "Vitest"],
      liveUrl: "https://government-hims.vercel.app/", embed: { url: "https://government-hims.vercel.app/", mode: "iframe" },
      shots: shots("agentix-hims", true), demo: true
    },
    {
      slug: "umang-hims", name: "Umang Hospital HIMS", client: "Umang Hospital", category: "health", status: "proto", tier: "A", year: 2026,
      summary: "A single-hospital OPD system that follows the patient from registration to pharmacy, with a public live visit tracker in English and Hindi.",
      problem: "OPD visits bounce between desks with paper slips, leaving patients waiting without knowing why.",
      outcomes: ["Registration by form or voice agent", "Every desk sees the same live visit", "Patients follow their own progress on a public tracker", "Bilingual from the first screen"],
      features: [
        F("Front Desk", "Registration by form or Asha voice agent", "Reception queue"),
        F("Clinical", "Nurse vitals", "Doctor consultation and prescription"),
        F("Billing & Pharmacy", "Billing", "Pharmacy"),
        F("Patient Experience", "Public live visit tracker", "English and Hindi")
      ],
      workflow: [
        W("Registration", "Form or Asha voice agent captures the patient."),
        W("Reception queue", "The visit joins the waiting list."),
        W("Vitals", "The nurse records measurements."),
        W("Consult and prescription", "The doctor examines and prescribes."),
        W("Billing", "The bill is raised at the counter."),
        W("Pharmacy ready", "The tracker shows medicines are ready.")
      ],
      stack: ["React", "TypeScript", "Vercel", "Voice agent", "i18n"],
      liveUrl: "https://umang-hospital-hims.vercel.app/", embed: { url: "https://umang-hospital-hims.vercel.app/", mode: "iframe" },
      shots: shots("umang-hims", true), demo: true
    },
    {
      slug: "umang-website", name: "Umang Hospital website and CMS", client: "Umang Hospital", category: "health", status: "live", tier: "B", year: 2026,
      summary: "A 70-route hospital website with doctor search, telemedicine, insurance help and a Supabase-powered admin that tracks every lead and campaign source.",
      problem: "Patients struggle to find the right doctor, and the hospital cannot tell which ads bring enquiries.",
      outcomes: ["Patients find specialists and book from any page", "UTM-tagged leads show which campaigns work", "Staff update content without a developer", "Dedicated landing page for Google Ads"],
      features: [
        F("Patient Journey", "Specialities", "Doctor search", "Health checkups", "Telemedicine", "Cashless insurance", "Health library"),
        F("Lead Capture", "Appointment and enquiry forms", "Google Ads landing page"),
        F("Admin CMS", "Supabase admin CMS", "UTM lead table")
      ],
      workflow: [
        W("Visitor searches", "A patient looks for a speciality or doctor."),
        W("Reads and trusts", "Service, insurance and checkup pages answer questions."),
        W("Books", "The appointment form is submitted."),
        W("Lead stored", "The enquiry is saved with its UTM source."),
        W("Team follows up", "Staff review the leads table in the admin."),
        W("Content updated", "The CMS publishes changes instantly.")
      ],
      stack: ["PHP", "Apache", "cPanel", "Supabase", "JavaScript"],
      liveUrl: "https://www.umanghospitals.in/", embed: { url: "https://www.umanghospitals.in/", mode: "iframe" },
      shots: [], demo: true
    },

    /* ---------------- 05 Hospitality ---------------- */
    {
      slug: "woodpecker-pms", name: "Woodpecker PMS", client: "Woodpecker", category: "hospitality", status: "live", tier: "A", year: 2026,
      summary: "A multi-property serviced-apartment platform covering reservations, billing, housekeeping, payroll, OTA channels and an owner portal in one system.",
      problem: "Property teams juggle spreadsheets, OTA extranets and paper folios, which causes overbookings and slow billing.",
      outcomes: ["Overbookings prevented by design", "GST invoices generated from the guest folio", "Nine role portals for every team", "Owners see occupancy and payouts live"],
      features: [
        F("Front Office", "Reservations", "Tape-chart calendar", "Check-in and Form-C", "Folios and GST invoices"),
        F("Operations", "Housekeeping", "Maintenance", "POS and kitchen", "Inventory and laundry", "Payroll"),
        F("Revenue", "OTA channels", "Dynamic pricing", "Booking engine"),
        F("Owners & Access", "Owner portal and payouts", "9 role portals", "AI assistance")
      ],
      workflow: [
        W("Booking arrives", "From the engine or an OTA channel."),
        W("Tape-chart allocation", "A room is assigned on the calendar."),
        W("Check-in", "Details and Form-C are captured."),
        W("Stay operations", "Housekeeping, POS and maintenance run."),
        W("Folio and invoice", "Charges post and a GST invoice is produced."),
        W("Owner reporting", "Occupancy, ADR and payouts are published.")
      ],
      stack: ["React", "Node.js", "PostgreSQL", "Docker", "Coolify"],
      liveUrl: "https://hotelmanagement.aiagentixdev.com/portal", embed: { url: "https://hotelmanagement.aiagentixdev.com/portal", mode: "iframe" },
      shots: shots("woodpecker-pms", true), demo: true
    },
    {
      slug: "kaaya-eco-resort", name: "Kaaya Eco Resort", client: "Kaaya Eco Resort (Yala, Sri Lanka)", category: "hospitality", status: "live", tier: "B", year: 2026,
      summary: "A luxury eco-resort website and booking platform for Yala, with live availability, online payments, guest accounts and a full admin.",
      problem: "A remote resort needed direct bookings without paying heavy OTA commissions or managing availability by phone.",
      outcomes: ["Guests check availability and book directly", "Blocked dates keep the calendar accurate", "Guest accounts show past and upcoming stays", "Admin manages everything without a developer"],
      features: [
        F("Guest Site", "Rooms and room detail", "Dining", "Experiences", "Groups", "Gallery", "Reviews", "Enquiries"),
        F("Booking", "Availability with blocked dates", "Online booking and payments"),
        F("Guest Accounts", "Register and sign in", "My bookings"),
        F("Admin", "Bookings", "Rooms", "Blocked dates", "Gallery", "Reviews", "Enquiries")
      ],
      workflow: [
        W("Guest explores", "Browses rooms, dining and experiences."),
        W("Checks availability", "Dates are matched against blocked days."),
        W("Enters details", "Guest details are captured."),
        W("Pays", "The booking is confirmed online."),
        W("Admin notified", "The booking appears in the dashboard."),
        W("Stay and review", "Guests manage bookings and leave reviews.")
      ],
      stack: ["React", "Express", "MySQL", "Prisma", "Payments gateway"],
      liveUrl: "https://kaayaecoresort.com/", embed: { url: "https://kaayaecoresort.com/", mode: "iframe" },
      shots: [], demo: true
    },

    /* ---------------- 06 Fitness ---------------- */
    {
      slug: "max-register", name: "Max Register", client: "Max Fitness", category: "fitness", status: "live", tier: "A", year: 2026,
      summary: "A Hindi-first, phone-first gym CRM with three-tap renewals, WhatsApp reminders and a face-recognition check-in kiosk.",
      problem: "Gym owners track fees in notebooks, so renewals are missed and members drift away.",
      outcomes: ["Renew a member in three taps with a receipt", "Fee colour bands show who is due at a glance", "WhatsApp reminders run on their own", "Hindi or English at the flip of a switch"],
      features: [
        F("Daily Desk", "Today tiles", "Members with fee-colour bands", "3-tap renew and receipt"),
        F("Engagement", "Calls list", "WhatsApp reminder engine", "Diet plans"),
        F("Growth", "Leads funnel", "Selfie verify queue"),
        F("Attendance", "Attendance", "Face-recognition check-in kiosk"),
        F("Insight", "Reports")
      ],
      workflow: [
        W("Open Today", "See who is due, who called, who joined."),
        W("Member found", "Colour bands show fee status."),
        W("Renew in three taps", "Plan, payment mode, confirm."),
        W("Receipt issued", "A receipt is generated and shared."),
        W("Reminders scheduled", "The WhatsApp engine queues the next ones."),
        W("Check-in and reports", "Kiosk attendance feeds the reports.")
      ],
      stack: ["Next.js 16", "React 19", "next-intl (EN/HI)", "Tailwind 4", "Radix", "Prisma 7", "Postgres (Supabase)", "pg-boss", "WhatsApp Cloud API", "Razorpay", "MediaPipe", "Python YuNet face service", "Turborepo"],
      liveUrl: "https://maxfitnessgym.co.in/crm", shots: [], demo: true
    },
    {
      slug: "max-website", name: "Max Fitness website", client: "Max Fitness", category: "fitness", status: "live", tier: "B", year: 2026,
      summary: "A bilingual gym website with plans, the owner's story and sign-up through QR onboarding.",
      problem: "Local gyms depend on walk-ins and word of mouth, with no easy way to sign up online.",
      outcomes: ["Plans and facilities clear in two languages", "Call-back and sign-up in a few taps", "QR onboarding for walk-in members", "Public site feeds the gym CRM"],
      features: [
        F("Content", "Bilingual pages", "Plans", "Owner story"),
        F("Conversion", "Sign-up", "QR onboarding")
      ],
      workflow: [
        W("Visitor lands", "Sees the gym, facilities and reviews."),
        W("Compares plans", "Reads plans in Hindi or English."),
        W("Requests call back", "Leaves a name and number."),
        W("Signs up", "Completes sign-up or scans the QR."),
        W("Enters the CRM", "The member appears in Max Register.")
      ],
      stack: ["React", "Node.js", "i18n"],
      liveUrl: "https://maxfitnessgym.co.in/", embed: { url: "https://maxfitnessgym.co.in/", mode: "iframe" },
      shots: [], demo: true
    },
    {
      slug: "fitness-first", name: "Fitness First Dwarka", client: "Fitness First", category: "fitness", status: "live", tier: "B", year: 2026,
      summary: "A premium gym website with hero video, Les Mills programs, trainer profiles, membership plans and enquiry forms that reach the sales desk.",
      problem: "A premium gym needed a site that matched its brand and turned browsers into trial bookings.",
      outcomes: ["Brand-quality video-led first impression", "Programs, trainers and plans easy to compare", "Enquiries stored and emailed instantly", "Clear path to a free trial"],
      features: [
        F("Experience", "Hero video", "Programs (Les Mills)", "Trainers"),
        F("Conversion", "Membership plans", "Lead forms to MySQL and email")
      ],
      workflow: [
        W("Visitor arrives", "Hero video sets the tone."),
        W("Explores programs", "Classes and trainers are reviewed."),
        W("Picks a plan", "Membership options are compared."),
        W("Books a free trial", "The enquiry form is submitted."),
        W("Sales notified", "Lead stored and emailed for follow-up.")
      ],
      stack: ["PHP", "MySQL", "Apache", "cPanel", "JavaScript"],
      liveUrl: "https://fitnessfirstdwarka.com/", embed: { url: "https://fitnessfirstdwarka.com/", mode: "iframe" },
      shots: [], demo: true
    },

    /* ---------------- 07 Platforms ---------------- */
    {
      slug: "redux", name: "REDUX Platform", client: "Eurobrass", category: "platforms", status: "active", tier: "A", year: 2026,
      summary: "Six connected products in one: website, lead CRM, care-executive portal, offline surveyor app, customer portal and admin console.",
      problem: "Enquiry to invoice crossed five hand-offs, each in a different tool, so jobs stalled and customers chased for updates.",
      outcomes: ["One thread from enquiry to invoice", "SLA timers keep leads moving", "Surveyors work offline in the field", "Customers see quotes, jobs and warranty themselves"],
      features: [
        F("Front Door", "Website"),
        F("Lead CRM", "Meta, Google and WhatsApp intake", "City routing", "SLA timers"),
        F("Field & Service", "Care-executive portal", "Offline Android surveyor app"),
        F("Customer", "Customer portal: quotes, jobs, invoices, warranty"),
        F("Control", "Admin console")
      ],
      workflow: [
        W("Enquiry in", "A lead arrives from Meta, Google or WhatsApp."),
        W("Assigned by city", "Routing and SLA timers start."),
        W("Survey", "The surveyor captures the site on a mobile app."),
        W("Quote", "A quote is prepared from the survey."),
        W("Customer approves", "Approval happens in the customer portal."),
        W("Invoice and warranty", "Invoice goes out and warranty is logged."),
        W("WhatsApp update", "The customer is notified in the outbox.")
      ],
      stack: ["React", "Node.js", "Android", "PostgreSQL", "WhatsApp Cloud API", "Vercel"],
      liveUrl: "https://redux-demo-iota.vercel.app/", embed: { url: "https://redux-demo-iota.vercel.app/", mode: "iframe" },
      shots: shots("redux", true), demo: true
    },
    {
      slug: "yhc", name: "Your Hair Company", client: "Your Hair Company", category: "platforms", status: "active", tier: "A", year: 2026,
      summary: "A doctor-led hair care brand platform: 3D scalp scan funnel, video consults, doctor portal, sales CRM, refills and a shop.",
      problem: "Hair-loss customers do not trust generic products and need a doctor, a plan and follow-through.",
      outcomes: ["Scan funnel turns visitors into booked consults", "Doctors prescribe in a purpose-built portal", "Sales team gets qualified leads automatically", "Refills and guarantees tracked without chasing"],
      features: [
        F("Acquisition", "3D scalp scan funnel", "Shop"),
        F("Consultation", "Video consult booking", "Doctor portal: calendar, consult room, prescriptions"),
        F("Sales", "Sales CRM"),
        F("Retention", "WhatsApp refills", "Money-back guarantee tracking")
      ],
      workflow: [
        W("Scan funnel", "The visitor completes a 3D scalp scan."),
        W("Book a consult", "A video consult is booked and paid."),
        W("Doctor consults", "The doctor writes a prescription."),
        W("Lead created", "Sales receives the qualified lead."),
        W("Shop and refills", "Products ship and refills are prompted on WhatsApp."),
        W("Guarantee tracked", "Progress is monitored for the money-back promise.")
      ],
      stack: ["Next.js", "React", "Node.js", "Three.js", "PostgreSQL", "WhatsApp Cloud API"],
      liveUrl: "https://yourhaircompany.com/", embed: { url: "https://yourhaircompany.com/", mode: "iframe" },
      shots: shots("yhc", false), demo: true
    },
    {
      slug: "skinwise", name: "Skinwise", client: "Skinwise", category: "platforms", status: "live", tier: "A", year: 2026,
      summary: "A skin-concern brand with a safety-aware quiz, AI photo skin scan, voice and chat assistant, consultations and a full store.",
      problem: "Skincare shoppers are overwhelmed by choice and worried about products that do not suit them.",
      outcomes: ["Quiz builds a routine with caution flags", "Photo scan gives an objective starting point", "Assistant answers questions in chat or voice", "Checkout and admin in the same platform"],
      features: [
        F("Discovery", "Rules-based quiz with safety exclusions", "AI photo skin scan"),
        F("Guidance", "Voice and chat assistant Dr. Vivek", "Consultations"),
        F("Commerce", "Cart and checkout", "Admin")
      ],
      workflow: [
        W("Take the quiz", "Concerns and sensitivities are captured."),
        W("Safety rules apply", "Unsuitable ingredients are excluded."),
        W("Scan the skin", "A photo is analysed by AI."),
        W("Ask the assistant", "Questions are answered by voice or chat."),
        W("Build the routine", "Products are suggested with cautions."),
        W("Checkout", "The order is placed and tracked in admin.")
      ],
      stack: ["Next.js", "React", "Node.js", "Computer vision", "LLM", "Payments gateway"],
      liveUrl: "https://myskinwise.com/", embed: { url: "https://myskinwise.com/", mode: "iframe" },
      shots: shots("skinwise", false), demo: true
    },
    {
      slug: "nri-trust", name: "NRI Trust", client: "NRI Trust", category: "platforms", status: "live", tier: "B", year: 2026,
      summary: "An NRI advisory platform with a 3D globe, a risk assessment engine that returns a clear verdict, a prioritised playbook and a client portal.",
      problem: "NRIs managing assets in India face scattered advice and no clear picture of their risk.",
      outcomes: ["Risk assessed in a few minutes", "A GREEN, ORANGE or RED verdict anyone can understand", "A prioritised action playbook", "PDF report and portal for ongoing work"],
      features: [
        F("Experience", "3D globe"),
        F("Assessment", "Risk assessment engine", "GREEN / ORANGE / RED persona"),
        F("Output", "Prioritised playbook", "PDF report"),
        F("Clients", "Client portal")
      ],
      workflow: [
        W("Start the assessment", "Answer guided questions."),
        W("Engine scores risk", "Responses map to a persona."),
        W("Verdict shown", "GREEN, ORANGE or RED with reasons."),
        W("Playbook built", "Actions are ordered by priority."),
        W("Report generated", "A PDF is prepared for the client."),
        W("Portal access", "Clients continue inside the portal.")
      ],
      stack: ["Next.js", "React", "Three.js", "Node.js", "PDF generation"],
      liveUrl: "https://nritrust.co/", embed: { url: "https://nritrust.co/", mode: "iframe" },
      shots: shots("nri-trust", false), demo: true
    },

    /* ---------------- 08 Business Websites ---------------- */
    {
      slug: "ai-agentix-site", name: "AI Agentix corporate site", client: "AGENTiX", category: "websites", status: "live", tier: "B", year: 2026,
      summary: "The agency's own website, with a RAG assistant that answers from site content and guides visitors to the right page.",
      problem: "Visitors skim, leave and never find the service they came for.",
      outcomes: ["Questions answered from real site content", "Visitors navigated to the right page", "Clear services and proof in one scroll", "Enquiries captured from any page"],
      features: [
        F("Website", "Services and case studies", "Agency story"),
        F("Assistant", "RAG assistant answering from site content", "In-page navigation help")
      ],
      workflow: [
        W("Visitor lands", "Sees services and proof."),
        W("Asks a question", "Types in the assistant."),
        W("Retrieves context", "The assistant searches site content."),
        W("Answers and navigates", "Replies and links to the page."),
        W("Enquires", "Starts a conversation with the team.")
      ],
      stack: ["HTML", "JavaScript", "Node.js", "Vector search", "LLM"],
      liveUrl: "https://ai-agentix.com/", embed: { url: "https://ai-agentix.com/", mode: "iframe" },
      shots: shots("ai-agentix-site", false), demo: true
    },
    {
      slug: "dr-shweta-diwan", name: "Dr. Shweta Diwan", client: "Dr. Shweta Diwan", category: "websites", status: "live", tier: "C", year: 2026,
      summary: "A nutritionist's brand website with a 60-page PHP admin for blogs, case studies, orders and invoices.",
      problem: "A growing practice needed a credible site and a way to run content and billing without a developer.",
      outcomes: ["Authority built through blogs and case studies", "Booking and enquiry paths on every page", "Orders and invoices handled in admin", "Content updated by the team"],
      features: [
        F("Website", "Brand pages", "Blogs", "Case studies", "Lead form with thank-you"),
        F("Admin", "Blog management", "Case study management", "Orders", "Invoices")
      ],
      workflow: [
        W("Visitor reads", "Blogs and case studies build trust."),
        W("Books a session", "The lead form is submitted."),
        W("Thank-you and tracking", "Conversion is recorded."),
        W("Admin handles the order", "Orders are created."),
        W("Invoice issued", "Billing is generated from admin.")
      ],
      stack: ["PHP", "MySQL", "Apache", "cPanel", "JavaScript"],
      liveUrl: "https://drshwetadiwan.com/", embed: { url: "https://drshwetadiwan.com/", mode: "iframe" },
      shots: [], demo: false
    },
    {
      slug: "thames-spa", name: "Thames Wellness Spa", client: "Thames Wellness Spa", category: "websites", status: "live", tier: "C", year: 2026,
      summary: "A luxury spa website presenting therapies and packages in a calm, premium design.",
      problem: "Spas sell an atmosphere, and a generic site fails to convey it or to guide guests to a package.",
      outcomes: ["Premium look that matches the experience", "Therapies and packages easy to browse", "Franchise and contact enquiries captured", "Fast static pages that rank well"],
      features: [
        F("Website", "Therapies", "Packages", "Gallery", "Franchise enquiry", "Contact")
      ],
      workflow: [
        W("Guest arrives", "A calm hero sets the tone."),
        W("Explores therapies", "Services are browsed."),
        W("Chooses a package", "Packages are compared."),
        W("Enquires", "Contact or franchise form is submitted."),
        W("Spa follows up", "The team confirms the booking.")
      ],
      stack: ["HTML", "CSS", "JavaScript"],
      liveUrl: "https://thameswellnessspa.com/", embed: { url: "https://thameswellnessspa.com/", mode: "iframe" },
      shots: [], demo: false
    },
    {
      slug: "eurobrass-site", name: "Eurobrass corporate site", client: "Eurobrass", category: "websites", status: "live", tier: "C", year: 2026,
      summary: "A brass foundry website that tells the story from cast to machine to finish, with product lines and dealer sign-in.",
      problem: "A manufacturer needed to show craft and scale, and give dealers a clear way in.",
      outcomes: ["Process told visually: cast, machine, finish", "Product lines presented clearly", "Dealers reach their login in one click", "Brand credibility for new buyers"],
      features: [
        F("Website", "Cast, machine, finish process story", "Product lines", "Dealer login")
      ],
      workflow: [
        W("Visitor lands", "Sees the foundry craft."),
        W("Follows the process", "Cast, machine and finish are shown."),
        W("Browses products", "Product lines are explored."),
        W("Dealers sign in", "The dealer login opens the portal."),
        W("Enquiry", "Buyers contact the sales team.")
      ],
      stack: ["React", "Vercel", "CSS"],
      liveUrl: "https://eurobrass-seven.vercel.app/", embed: { url: "https://eurobrass-seven.vercel.app/", mode: "iframe" },
      shots: shots("eurobrass-site", false), demo: false
    },

    /* ---------------- 09 E-commerce concept brands ---------------- */
    concept({
      slug: "aurelle", name: "AURELLE", path: "aurelle", category: "ecommerce", tier: "B",
      summary: "A saree brand with a 17-product catalogue, cart and wishlist drawers and a frame-sequence hero.",
      problem: "Premium sarees need a store that feels as rich as the fabric while keeping browsing fast.",
      outcomes: ["Cinematic frame-sequence hero", "Occasion filters that guide shoppers", "Cart and wishlist without leaving the page", "Smooth mock checkout"],
      features: [F("Catalogue", "17-product catalogue", "Occasion filters"), F("Shopping", "Cart drawer", "Wishlist drawer", "Mock checkout"), F("Showpiece", "Frame-sequence hero")],
      workflow: [W("Hero plays", "Frames scrub with scroll."), W("Filter by occasion", "Narrow the catalogue."), W("Add to cart or wishlist", "Drawers update instantly."), W("Review the cart", "Totals shown."), W("Mock checkout", "Order confirmation shown.")]
    }),
    concept({
      slug: "vara", name: "VARA Studio", path: "vara", category: "ecommerce",
      summary: "A Gen Z fashion store with canvas denim physics, filters and a bag that remembers.",
      problem: "Young shoppers expect play, not another static grid.",
      outcomes: ["Memorable physics-driven hero", "Quick filters to find a fit", "Bag saved in the browser", "Playful, brand-led feel"],
      features: [F("Showpiece", "Canvas denim physics"), F("Shopping", "Filters", "Bag drawer saved in localStorage")],
      workflow: [W("Play with the hero", "Denim reacts to the cursor."), W("Browse and filter", "Find a style."), W("Add to bag", "Bag opens."), W("Bag persists", "Saved in the browser.")]
    }),
    concept({
      slug: "drify", name: "DRIFY", path: "drift", category: "ecommerce",
      summary: "A streetwear store with 24 products and a 3D flip-in scroll.",
      problem: "Streetwear drops need hype and speed, not a slow catalogue.",
      outcomes: ["Products flip in on scroll", "Quick view without losing place", "Working cart", "Drop-style energy"],
      features: [F("Catalogue", "24 products", "Quick view"), F("Shopping", "Working cart"), F("Showpiece", "3D flip-in scroll")],
      workflow: [W("Scroll the drop", "Products flip in."), W("Quick view", "Open details in place."), W("Add to cart", "Cart updates."), W("Review order", "Totals shown.")]
    }),
    concept({
      slug: "fruitivo", name: "Fruitivo", path: "perfume", category: "ecommerce",
      summary: "A perfume brand with a mood selector that recommends a scent, plus note breakdowns.",
      problem: "Choosing a fragrance online is guesswork without a smell to guide it.",
      outcomes: ["Mood-led discovery", "Scent notes explained", "Direct path to cart", "Brand story through motion"],
      features: [F("Discovery", "Mood selector", "Recommendation"), F("Product", "Scent notes"), F("Shopping", "Cart")],
      workflow: [W("Choose a mood", "Select how you want to feel."), W("Get a recommendation", "A scent is suggested."), W("Read the notes", "Top, heart and base."), W("Add to cart", "Checkout path begins.")]
    }),
    concept({
      slug: "kanak", name: "Kanak Jewels", path: "kanak", category: "ecommerce",
      summary: "A 22K gold jeweller whose live gold-rate clock re-prices every item as the rate moves.",
      problem: "Gold prices change daily, so static price tags are always wrong.",
      outcomes: ["Prices follow the gold rate", "Transparent making charges", "Add to bag with the live total", "Trust through clarity"],
      features: [F("Pricing", "Live gold-rate clock", "Re-pricing every item"), F("Shopping", "Bag")],
      workflow: [W("Check the rate", "The gold clock shows today's price."), W("Move the rate", "Prices recalculate."), W("Pick a piece", "See weight and price."), W("Add to bag", "Total reflects the rate.")]
    }),
    concept({
      slug: "meridian", name: "Meridian", path: "meridian", category: "ecommerce",
      summary: "A watch brand with an exploded movement view and a configurator.",
      problem: "Luxury watches sell on craft that photos rarely show.",
      outcomes: ["Movement explained visually", "Configure case, dial and strap", "Bag with the chosen build", "Story-led selling"],
      features: [F("Showpiece", "Exploded movement"), F("Configurator", "Case, dial and strap options"), F("Shopping", "Bag")],
      workflow: [W("Explore the movement", "Parts separate on scroll."), W("Configure", "Choose finishes."), W("Preview", "See the build."), W("Add to bag", "Selection saved.")]
    }),
    concept({
      slug: "dewlab", name: "Dewlab", path: "dewlab", category: "ecommerce", tier: "C",
      summary: "A serum brand where a drop travels the page and a before-and-after slider shows the result.",
      problem: "Skincare claims need proof, not adjectives.",
      outcomes: ["A drop that guides the scroll", "Before-and-after proof", "Ingredient clarity", "Calm premium look"],
      features: [F("Showpiece", "Drop travels the page"), F("Proof", "Before and after slider")],
      workflow: [W("Follow the drop", "It leads down the page."), W("See ingredients", "Benefits explained."), W("Compare results", "Drag the slider."), W("Shop", "Call to action.")]
    }),
    concept({
      slug: "melt", name: "Melt Theory", path: "melt", category: "ecommerce",
      summary: "An ice cream brand where you build a cone and watch a live receipt.",
      problem: "Playful brands need ordering that is itself fun.",
      outcomes: ["Interactive cone builder", "Live receipt as you build", "Clear order total", "Memorable first visit"],
      features: [F("Builder", "Build-a-cone", "Flavours and toppings"), F("Ordering", "Live receipt", "Order total")],
      workflow: [W("Pick a cone", "Start the build."), W("Add flavours", "Scoops stack up."), W("Toppings", "Finish the cone."), W("Receipt updates", "Live total."), W("Order", "Confirmation shown.")]
    }),
    concept({
      slug: "zipev", name: "Zip EV", path: "zipev", category: "ecommerce",
      summary: "An e-scooter brand with a trackpad-steered ride showing live speed and range.",
      problem: "Electric scooters are hard to judge from specs alone.",
      outcomes: ["Feel the ride before buying", "Live speed and range", "Variant and colour picker", "Test ride booking"],
      features: [F("Showpiece", "Trackpad-steered ride", "Live speed and range"), F("Configurator", "Variant picker", "Colour picker"), F("Conversion", "Test ride booking")],
      workflow: [W("Ride the page", "Steer with the trackpad."), W("Watch range", "Speed and range update."), W("Pick variant and colour", "Configure the scooter."), W("Book a test ride", "Slot confirmed.")]
    }),
    concept({
      slug: "crumb", name: "Crumb", path: "crumb", category: "ecommerce", tier: "B", noShots: true,
      summary: "A bakery with a build-your-own box and a cart that adds it up.",
      problem: "Gifting boxes need choice without a complicated order form.",
      outcomes: ["Box builder with live count", "Cart with totals", "Warm, appetising brand", "Easy gifting"],
      features: [F("Builder", "Build-your-own box"), F("Shopping", "Cart")],
      workflow: [W("Choose a box size", "Start the build."), W("Fill with bakes", "Pick items."), W("Add to cart", "Box added."), W("Checkout", "Order total shown.")]
    }),

    /* ---------------- 10 Immersive concept brands ---------------- */
    concept({
      slug: "movade", name: "Movade", path: "travel", category: "immersive",
      summary: "A travel brand with a 3D depth hero and a dotted world map.",
      problem: "Travel sites look alike and rarely inspire.",
      outcomes: ["Depth hero that pulls you in", "Destination search with fake results", "Map-led discovery", "Distinctive brand feel"],
      features: [F("Showpiece", "3D depth hero", "Dotted world map"), F("Discovery", "Destination search")],
      workflow: [W("Enter the hero", "Depth responds to motion."), W("Explore the map", "Dots mark destinations."), W("Search", "Fake results appear."), W("Plan", "Call to action.")]
    }),
    concept({
      slug: "cairnline", name: "Cairnline Treks", path: "cairnline", category: "immersive",
      summary: "A trekking company with flyover films, an altitude chart and a departure board.",
      problem: "Trek buyers need to feel the terrain and trust the logistics.",
      outcomes: ["Flyover films show the route", "Altitude chart sets expectations", "Departure board for dates", "Adventure brand credibility"],
      features: [F("Showpiece", "Flyover films"), F("Information", "Altitude chart", "Departure board")],
      workflow: [W("Watch the flyover", "See the route."), W("Read the altitude", "Understand the climb."), W("Check departures", "Pick a date."), W("Enquire", "Contact the team.")]
    }),
    concept({
      slug: "saffron", name: "Saffron & Smoke", path: "saffron", category: "immersive",
      summary: "A restaurant whose menu cooks as you scroll, with table booking slots.",
      problem: "Menus rarely sell the experience of the kitchen.",
      outcomes: ["Menu that comes alive on scroll", "Table slots to book", "Brand mood through motion", "Appetite-first design"],
      features: [F("Showpiece", "Menu that cooks on scroll"), F("Conversion", "Table booking slots")],
      workflow: [W("Scroll the menu", "Dishes cook."), W("Choose a dish", "Details revealed."), W("Pick a slot", "Table time chosen."), W("Book", "Confirmation shown.")]
    }),
    concept({
      slug: "aurelune", name: "Aurelune", path: "aurelune", category: "immersive",
      summary: "A villa resort where rooms light up on scroll and a cove map shows the property.",
      problem: "Luxury stays are sold on atmosphere, which photos alone cannot carry.",
      outcomes: ["Rooms revealed with light", "Cove map to orient guests", "Slow, premium pacing", "Strong first impression"],
      features: [F("Showpiece", "Rooms light up on scroll", "Cove map")],
      workflow: [W("Arrive", "Evening hero."), W("Scroll the rooms", "Lights come on."), W("Explore the cove", "Map shows the layout."), W("Enquire", "Reserve.")]
    }),
    concept({
      slug: "halden", name: "Halden", path: "halden", category: "immersive",
      summary: "A smartphone launch site with a scroll-scrubbed product film and a colour picker.",
      problem: "Product launches need spectacle that still explains the device.",
      outcomes: ["Film scrubbed by scroll", "Colour picker", "Feature storytelling", "Launch-day impact"],
      features: [F("Showpiece", "Scroll-scrubbed product film"), F("Product", "Colour picker")],
      workflow: [W("Scroll the film", "The phone assembles."), W("Read features", "Specs unfold."), W("Choose a colour", "Preview updates."), W("Pre-order", "Call to action.")]
    }),
    concept({
      slug: "irontemple", name: "Iron Temple", path: "irontemple", category: "immersive",
      summary: "A gym brand with a load-the-bar interaction and a class timetable.",
      problem: "Gym sites look generic and bury the timetable.",
      outcomes: ["Interactive bar loading", "Clear timetable", "Strong brand attitude", "Easy trial enquiry"],
      features: [F("Showpiece", "Load-the-bar interaction"), F("Information", "Timetable")],
      workflow: [W("Load the bar", "Add plates."), W("Feel the weight", "Visual feedback."), W("Check the timetable", "Find a class."), W("Join", "Enquire.")]
    }),
    concept({
      slug: "marigold", name: "Marigold Noir", path: "marigold", category: "immersive",
      summary: "A wedding photographer's site told as a seven-chapter film, with packages.",
      problem: "Wedding photographers sell emotion, and thumbnails do not carry it.",
      outcomes: ["Story told in chapters", "Packages clearly shown", "Emotion before price", "Enquiry-ready"],
      features: [F("Showpiece", "Seven-chapter film story"), F("Offer", "Packages")],
      workflow: [W("Begin chapter one", "The story opens."), W("Progress through chapters", "Seven scenes."), W("See packages", "Options listed."), W("Enquire", "Date check.")]
    }),
    concept({
      slug: "moana", name: "Moana", path: "moana", category: "immersive",
      summary: "A cinematic hero experience driven by a 181-frame canvas scrub.",
      problem: "A hero shot needs to feel like film without video weight.",
      outcomes: ["Film-quality scroll hero", "Smooth frame scrubbing", "Light on bandwidth", "Reusable pattern"],
      features: [F("Showpiece", "181-frame canvas scrub")],
      workflow: [W("Load frames", "Preload the sequence."), W("Scroll", "Frames scrub."), W("Story beats", "Text enters."), W("Finish", "Closing call to action.")],
      mid: false
    }),
    concept({
      slug: "coralbay", name: "Coral Bay", path: "coralbay", category: "immersive", noShots: true,
      summary: "A holiday brand where the destination is one scroll away.",
      problem: "Holiday sites show lists, not the feeling of arriving.",
      outcomes: ["Arrival feel through scroll", "Destination highlights", "Simple enquiry", "Fresh visual identity"],
      features: [F("Showpiece", "Holiday one scroll away")],
      workflow: [W("Start the scroll", "Leave the city."), W("Arrive", "Beach reveals."), W("See highlights", "Activities shown."), W("Enquire", "Plan the trip.")]
    }),
    concept({
      slug: "tallow-tape", name: "Tallow & Tape", path: "tallow", category: "immersive", noShots: true,
      summary: "A recording studio site with sessions and tracks.",
      problem: "Studios need to sound as good as they look online.",
      outcomes: ["Sessions showcased", "Tracks to preview", "A studio brand that looks as good as it sounds", "Easy booking enquiry"],
      features: [F("Showpiece", "Studio sessions", "Tracks")],
      workflow: [W("Enter the studio", "Warm hero."), W("Listen", "Tracks play."), W("Browse sessions", "Recent sessions shown."), W("Book", "Session enquiry.")]
    }),
    concept({
      slug: "vaskaro", name: "Vaskaro", path: "vaskaro", category: "immersive", noShots: true,
      summary: "A mountain motorcycle brand: mountain roads on a scroll wheel, with test rides.",
      problem: "Motorcycles are about the road, which a spec sheet cannot show.",
      outcomes: ["Road felt through scroll", "Model highlights", "Test ride booking", "Adventure brand identity"],
      features: [F("Showpiece", "Mountain roads on a scroll wheel"), F("Conversion", "Test rides")],
      workflow: [W("Start the ride", "Scroll to move."), W("Climb", "Terrain changes."), W("See the bike", "Features shown."), W("Book a test ride", "Slot chosen.")]
    }),

    /* ---------------- 11 Infrastructure & Delivery ---------------- */
    {
      slug: "delivery-infra", name: "Deployment & hosting", client: "AGENTiX", category: "delivery", status: "live", tier: "C", year: 2026,
      summary: "Every product shipped and hosted across Coolify with Docker, Vercel, cPanel and Apache, Kubernetes and Supabase.",
      problem: "Projects stall when nobody owns getting code to a reliable live address.",
      outcomes: ["The right host for every workload", "Repeatable deploys", "Databases and queues managed", "Clients go live without surprises"],
      features: [
        F("Hosting", "Coolify VPS with Docker", "Vercel", "cPanel and Apache with PHP and MySQL"),
        F("Orchestration", "Kubernetes manifests"),
        F("Data", "Supabase: RLS, pg_cron, pgmq, pgvector")
      ],
      workflow: [W("Code", "Committed to Git."), W("Build", "Containers or static bundles built."), W("Deploy", "Coolify, Vercel or cPanel."), W("Verify", "Smoke checks."), W("Live", "Domain and TLS.")],
      stack: ["Docker", "Coolify", "Vercel", "cPanel", "Apache", "Kubernetes", "Supabase"],
      shots: [], demo: false
    },
    {
      slug: "showcase-pipeline", name: "Showcase pipeline", client: "AGENTiX (internal)", category: "delivery", status: "active", tier: "C", year: 2026,
      summary: "An internal tool that packs static exports, generates landing cards, audits responsive layouts and deploys to Vercel with cleanup.",
      problem: "Publishing dozens of showcase sites by hand is slow and inconsistent.",
      outcomes: ["One command from export to deploy", "Responsive checks at seven widths", "Landing cards generated automatically", "Old deployments cleaned up"],
      features: [
        F("Packaging", "Static-export packer"),
        F("Presentation", "Landing-card generator"),
        F("Quality", "Playwright responsive audit at 7 widths"),
        F("Release", "Vercel deploy with cleanup")
      ],
      workflow: [W("Export", "Build the static site."), W("Pack", "Add it to the showcase."), W("Card", "Generate the landing card."), W("Audit", "Check seven widths."), W("Deploy", "Push to Vercel and clean up.")],
      stack: ["Node.js", "PowerShell", "Playwright", "Vercel CLI"],
      shots: [], demo: false
    }
  ];
})(window);
