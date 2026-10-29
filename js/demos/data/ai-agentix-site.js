(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.data = AX.data || {};

  /* The agency site's sections (summaries) and the six questions the RAG assistant answers from them. */
  var sections = [
    { id: "services", title: "Services", blurb: "AI agents, websites, CRMs and automation, designed, built and run end to end.", items: ["Conversational AI agents (chat, WhatsApp, voice)", "Business websites and web apps", "CRM and operations platforms", "Content and social automation"] },
    { id: "work", title: "Case studies", blurb: "Live products for hospitals, gyms, hotels and platforms.", items: ["Hospital HIMS and website with a CMS", "Gym CRM with a WhatsApp sales bot", "Hotel property management system", "Skin and hair care platforms"] },
    { id: "process", title: "How we work", blurb: "Discovery, design, build, launch, then run and improve.", items: ["Week 1: discovery and scope", "Weeks 2-4: design and first build", "Launch with training and handover", "Monthly improvement and support"] },
    { id: "agents", title: "AI agents", blurb: "Assistants that answer from your content, book appointments and hand over to people.", items: ["Website and WhatsApp chat assistants", "Voice agents for inbound calls", "RAG over your own documents", "Human handover with full context"] },
    { id: "pricing", title: "Engagement and pricing", blurb: "Fixed-scope projects or a monthly retainer. Quotes are shared after a short discovery call.", items: ["Starter websites from a fixed price", "AI agent pilots in a few weeks", "Retainers for ongoing work", "Free discovery call"] },
    { id: "contact", title: "Contact", blurb: "Talk to the team by form, email or WhatsApp.", items: ["Enquiry form on every page", "hello@example.in (demo address)", "WhatsApp chat during business hours", "Discovery calls booked online"] }
  ];
  var faqs = [
    { id: "q1", q: "What services do you offer?", keys: ["service", "offer", "do you do", "what do you"], section: "services", a: "AI Agentix designs and builds conversational AI agents, business websites, CRM and operations platforms, and content automation, then runs them for you." },
    { id: "q2", q: "Show me work in healthcare", keys: ["health", "hospital", "case", "work", "portfolio", "clients", "example"], section: "work", a: "In healthcare we have built a hospital information system and a hospital website with a lead-tracking CMS. Other case studies cover gyms, hotels and care platforms." },
    { id: "q3", q: "How does a project run?", keys: ["process", "how does", "timeline", "steps", "project run", "how long"], section: "process", a: "Projects start with discovery, move to design and a first build within weeks, launch with training, and continue with monthly improvement." },
    { id: "q4", q: "Do you build AI chatbots and voice agents?", keys: ["chatbot", "voice", "agent", "whatsapp", "bot", "ai"], section: "agents", a: "Yes. We build chat assistants for websites and WhatsApp, and voice agents for inbound calls, grounded in your own content with handover to your team." },
    { id: "q5", q: "How much does a website cost?", keys: ["cost", "price", "pricing", "how much", "budget", "quote"], section: "pricing", a: "Websites and agent pilots are scoped as fixed projects, and ongoing work runs as a retainer. A short discovery call gives you a firm quote." },
    { id: "q6", q: "How do I contact the team?", keys: ["contact", "reach", "email", "call", "talk", "book"], section: "contact", a: "Use the enquiry form on any page, email the team or message on WhatsApp. You can also book a free discovery call." }
  ];
  AX.data["ai-agentix-site"] = { sections: sections, faqs: faqs };
})(window);
