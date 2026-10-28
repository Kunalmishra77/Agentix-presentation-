/* AGENTiX demo dataset. Every record is fictional and generated with AX.fake (seeded, deterministic). */
(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.data = AX.data || {};
  var F = AX.fake;

  function P(i) { return F.person("agx-" + i); }
  function days(n) {
    var out = [], d = new Date(Date.UTC(2026, 9, 28));
    for (var i = n - 1; i >= 0; i--) { var x = new Date(d.getTime() - i * 86400000); out.push(x.getUTCDate() + " " + ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][x.getUTCMonth()]); }
    return out;
  }
  var SOURCES = ["Meta Lead Ads", "Google Ads", "WhatsApp", "Instagram", "Website"];
  var TEMPS = ["Cold", "Warm", "Hot"];
  var SERVICES = ["Teeth whitening", "Hair PRP session", "Skin consult", "Dental implants", "Laser hair removal", "Body contouring", "Facial treatment", "Root canal"];
  var STAGES = ["New", "Warm", "Hot", "Booked", "Won", "Lost"];
  var TAGS = ["Ad lead", "Repeat", "Referral", "VIP", "Festive offer"];

  var contacts = [];
  for (var i = 0; i < 32; i++) {
    var p = P(i);
    contacts.push({
      id: "c" + (i + 1), name: p.name, phone: p.phone, email: p.email, city: p.city,
      source: F.pick("src" + i, SOURCES), temp: F.pick("tmp" + i, TEMPS),
      tag: F.pick("tag" + i, TAGS), service: F.pick("svc" + i, SERVICES),
      lastSeen: F.int("ls" + i, 0, 40), msgs: F.int("mg" + i, 2, 48), score: F.int("sc" + i, 22, 96)
    });
  }

  var leads = [];
  for (var j = 0; j < 30; j++) {
    var q = P(100 + j);
    leads.push({
      id: "L" + (2400 + j), name: q.name, phone: q.phone, city: q.city,
      source: F.pick("lsrc" + j, SOURCES), interest: F.pick("lsvc" + j, SERVICES),
      stage: F.pick("lst" + j, STAGES), temp: F.pick("ltmp" + j, TEMPS),
      value: F.int("lval" + j, 8, 85) * 100, owner: F.pick("lown" + j, ["Meera", "Rohit", "AI agent"]),
      created: (1 + F.int("ld" + j, 0, 27)) + " Oct"
    });
  }

  var board = [
    ["k1", "Aarav Bhatia", "Teeth whitening", "New"], ["k2", "Simran Das", "Hair PRP session", "New"],
    ["k3", "Neel Joshi", "Skin consult", "New"], ["k4", "Kavya Menon", "Dental implants", "Warm"],
    ["ritika", "Ritika S.", "Smile consult", "Warm"], ["k6", "Sahil Rao", "Laser hair removal", "Warm"],
    ["k7", "Tanya Arora", "Facial treatment", "Hot"], ["k8", "Dev Saxena", "Body contouring", "Hot"],
    ["k9", "Isha Nair", "Root canal", "Booked"], ["k10", "Manav Sethi", "Skin consult", "Booked"],
    ["k11", "Pooja Iyer", "Dental implants", "Won"], ["k12", "Karan Reddy", "Teeth whitening", "Won"],
    ["k13", "Anika Verma", "Hair PRP session", "Lost"]
  ].map(function (r, n) {
    return { id: r[0], title: r[1], sub: r[2], col: r[3].toLowerCase(), tags: [F.pick("bs" + n, SOURCES)], meta: "₹" + F.int("bv" + n, 6, 60) * 100 };
  });

  var threads = [
    { id: "ritika", name: "Ritika S.", channel: "whatsapp", preview: "Hi, saw your whitening ad…", messages: [] },
    { id: "t2", name: "Aman Verma", channel: "whatsapp", preview: "Do you have a Sunday slot?",
      messages: [{ from: "user", text: "Do you have a Sunday slot?", at: "10:12" }, { from: "ai", text: "Yes! Sunday has 11:00 AM and 4:30 PM open. Which suits you?", at: "10:12" }] },
    { id: "t3", name: "Neha Khanna", channel: "instagram", preview: "price for PRP?",
      messages: [{ from: "user", text: "price for PRP?", at: "09:40" }, { from: "ai", text: "A single PRP session is ₹4,500; the 4-session pack is ₹15,999. Want me to hold a consult slot?", at: "09:40" }] },
    { id: "t4", name: "Rohan Gupta", channel: "whatsapp", preview: "Thanks, will confirm tomorrow",
      messages: [{ from: "ai", text: "Reminder: your consult is tomorrow at 5 PM.", at: "Yesterday" }, { from: "user", text: "Thanks, will confirm tomorrow", at: "Yesterday" }] },
    { id: "t5", name: "Diya Malhotra", channel: "instagram", preview: "Is the clinic open on Diwali?",
      messages: [{ from: "user", text: "Is the clinic open on Diwali?", at: "Mon" }, { from: "agent", text: "We are open 10 AM to 2 PM on Diwali day. Shall I book you in?", at: "Mon" }] },
    { id: "t6", name: "Karan Chauhan", channel: "whatsapp", preview: "Send me the brochure",
      messages: [{ from: "user", text: "Send me the brochure", at: "Mon" }, { from: "ai", text: "Sure, sharing our treatment brochure now. (simulated attachment)", at: "Mon" }] },
    { id: "t7", name: "Anika Bansal", channel: "whatsapp", preview: "Need to reschedule",
      messages: [{ from: "user", text: "Need to reschedule", at: "Sun" }, { from: "ai", text: "No problem. I can move you to Thursday 12:30 PM or Friday 5 PM.", at: "Sun" }] },
    { id: "t8", name: "Vivaan Mehta", channel: "instagram", preview: "Collab enquiry",
      messages: [{ from: "user", text: "Hi, we are a wellness creator. Collab possible?", at: "Sat" }, { from: "ai", text: "Thanks for reaching out! I have flagged this for our marketing team.", at: "Sat" }] }
  ];

  var scripts = {
    ritika: [
      { from: "user", text: "Hi, saw your teeth whitening ad on Instagram. What does it cost?" },
      { from: "ai", text: "Hi Ritika! Our whitening session is ₹6,500 right now (festive offer, usually ₹8,500). It takes about 45 minutes. Are you looking for yourself?", chips: ["Yes, for me", "For my sister"] },
      { from: "user", text: "Yes, for me. Any slot this Saturday?" },
      { from: "ai", text: "Saturday 2 Nov has 11:00 AM, 1:30 PM and 4:00 PM open. Which would you like?", chips: ["11:00 AM", "1:30 PM"] },
      { from: "user", text: "11:00 AM works" },
      { from: "ai", text: "Booked. Sat 2 Nov, 11:00 AM, Smile consult at AGENTiX Demo Dental. A reminder will reach you on WhatsApp the day before.", event: "booked" }
    ],
    t2: [{ from: "ai", text: "I have noted that. Anything else I can help with?" }],
    t3: [{ from: "ai", text: "Great, I have held Thursday 5 PM for you." }]
  };

  var segments = {
    fields: [
      { key: "source", label: "Source", options: SOURCES },
      { key: "temp", label: "Lead temperature", options: TEMPS },
      { key: "city", label: "City", options: ["Delhi", "Gurugram", "Noida", "Mumbai", "Pune", "Bengaluru", "Hyderabad", "Jaipur"] },
      { key: "service", label: "Interested in", options: SERVICES },
      { key: "tag", label: "Tag", options: TAGS }
    ]
  };

  var templates = [
    ["appointment_reminder", "Utility", "en", "Approved", "Hi {{1}}, a reminder: your {{2}} at AGENTiX Demo Clinic is tomorrow at {{3}}. Reply 1 to confirm or 2 to reschedule."],
    ["festive_offer_diwali", "Marketing", "en", "Approved", "Hi {{1}}, this Diwali enjoy 25% off on {{2}}. Offer valid till {{3}}. Reply BOOK to grab a slot."],
    ["winback_30d", "Marketing", "en", "Approved", "We miss you, {{1}}! It has been a while. Here is a complimentary check-up when you book this week."],
    ["review_request", "Utility", "en", "Approved", "Thanks for visiting, {{1}}. Would you share your experience? It takes 20 seconds: {{2}}"],
    ["lead_welcome_hi", "Marketing", "hi", "Approved", "नमस्ते {{1}}, AGENTiX Demo Clinic में आपका स्वागत है। आप किस ट्रीटमेंट के बारे में जानना चाहते हैं?"],
    ["payment_link", "Utility", "en", "Pending", "Hi {{1}}, here is your secure payment link for {{2}}: {{3}}"],
    ["new_year_pack", "Marketing", "en", "Pending", "Start {{1}} fresh! Our new-year skin pack is now open for booking."],
    ["referral_invite", "Marketing", "en", "Rejected", "Refer a friend and both of you get ₹500 off. Share code {{1}}."],
    ["post_visit_care", "Utility", "en", "Approved", "Hi {{1}}, after-care tips for your {{2}}: avoid direct sun for 24 hours and stay hydrated."],
    ["no_show_followup", "Utility", "en", "Approved", "Hi {{1}}, we missed you today. Would you like to rebook for {{2}}?"],
    ["otp_login", "Authentication", "en", "Approved", "{{1}} is your verification code. It expires in 10 minutes."],
    ["birthday_wish", "Marketing", "en", "Pending", "Happy birthday, {{1}}! Enjoy a complimentary add-on on your next visit this month."]
  ].map(function (r, n) {
    return { id: "tp" + n, name: r[0], category: r[1], lang: r[2], status: r[3], body: r[4], sent: F.int("tps" + n, 0, 38) * 100 + 40 };
  });

  var referrals = [];
  for (var r = 0; r < 18; r++) {
    var a = P(200 + r), b = P(300 + r);
    referrals.push({ id: "R" + (r + 1), referrer: a.name, referred: b.name, code: "AGX" + (1000 + F.int("rc" + r, 0, 899)),
      status: F.pick("rs" + r, ["Joined", "Booked", "Rewarded", "Pending"]), reward: "₹" + F.pick("rw" + r, [250, 500, 500, 750]) });
  }

  var team = [
    ["Meera Kapoor", "Owner", "Active"], ["Rohit Menon", "Manager", "Active"], ["Pooja Joshi", "Sales agent", "Active"],
    ["Sahil Arora", "Sales agent", "Active"], ["Nisha Gupta", "Front desk", "Active"], ["Dr. Kavya Rao", "Doctor", "Active"],
    ["Aditya Sethi", "Marketing", "Invited"], ["Isha Bhatia", "Sales agent", "Away"], ["Tanya Das", "Front desk", "Active"], ["Neel Reddy", "Support", "Active"]
  ].map(function (t, n) {
    return { id: "m" + n, name: t[0], role: t[1], status: t[2], email: t[0].toLowerCase().replace(/[^a-z ]/g, "").replace(/ /g, ".") + "@example.in", handled: F.int("th" + n, 12, 160), last: F.pick("tl" + n, ["2 min ago", "14 min ago", "1 h ago", "Yesterday"]) };
  });

  var tasks = [
    ["Call back Kavya Menon about implants", "todo", "Rohit"], ["Send brochure to Karan Chauhan", "todo", "Pooja"], ["Verify new_year_pack template", "todo", "Aditya"],
    ["Follow up: 7 hot leads from Meta", "doing", "Sahil"], ["Review AI handoffs from yesterday", "doing", "Meera"], ["Update Diwali timings in knowledge base", "doing", "Nisha"],
    ["Reply to 3 Google reviews", "done", "Meera"], ["Reschedule Anika Bansal", "done", "Nisha"], ["Export October bookings", "done", "Rohit"]
  ].map(function (t, n) { return { id: "tk" + n, title: t[0], col: t[1], sub: t[2], tags: [F.pick("tt" + n, ["Sales", "Ops", "Marketing"])] }; });

  var docs = [
    { id: "d1", name: "Treatment price list 2026.pdf", pages: 6, updated: "12 Oct", answer: "Teeth whitening is ₹6,500 (festive) and a single PRP session is ₹4,500. Implants start at ₹28,000 per tooth." },
    { id: "d2", name: "Clinic timings and holidays.docx", pages: 2, updated: "21 Oct", answer: "We are open Monday to Saturday, 10 AM to 8 PM, and Sunday 11 AM to 4 PM. On Diwali we are open 10 AM to 2 PM." },
    { id: "d3", name: "Cancellation and refund policy.pdf", pages: 3, updated: "02 Sep", answer: "Appointments can be rescheduled free up to 4 hours before. Advance amounts are refundable within 7 days if unused." },
    { id: "d4", name: "Doctor profiles.pdf", pages: 5, updated: "30 Sep", answer: "Dr. Kavya Rao leads dental care (12 years); Dr. Arjun Menon handles skin and hair treatments." },
    { id: "d5", name: "FAQ: after-care.md", pages: 1, updated: "18 Oct", answer: "After whitening avoid coffee, tea and dark foods for 24 hours. Use a soft brush and stay hydrated." }
  ];

  var copilot = [
    ["Reply faster to Instagram DMs", "Median reply time on Instagram is 9 min vs 40 s on WhatsApp. Turn on AI auto-reply for Instagram.", "+14 leads/mo"],
    ["Re-engage 126 cold leads", "126 leads went quiet for 30+ days. A win-back template could revive about 12%.", "+15 bookings"],
    ["Add Hindi flow to Meta ads", "38% of ad clicks come from Hindi-speaking users but the flow is English only.", "+9% conversion"],
    ["Cap Google Ads on low-intent keywords", "3 keywords spent ₹7,800 with zero bookings. Pause or lower bids.", "Save ₹7.8k"],
    ["Ask for reviews after visits", "Only 11% of completed visits are asked for a Google review. Automate a review_request message.", "+22 reviews"],
    ["Send reminders 2 h before visits", "No-shows are 14% today. A second reminder cuts this to about 8%.", "-6% no-shows"]
  ].map(function (c, n) { return { id: "cp" + n, title: c[0], body: c[1], impact: c[2] }; });

  var reviews = [
    { id: "rv1", who: "Aarti P.", stars: 5, when: "2 days ago", text: "Very professional staff and the whitening results are great. Booking over WhatsApp was effortless." },
    { id: "rv2", who: "Mohit K.", stars: 4, when: "5 days ago", text: "Good service, but I waited 20 minutes beyond my slot." },
    { id: "rv3", who: "Sunita R.", stars: 2, when: "1 week ago", text: "Price was higher than what the ad showed. Staff explained later but I felt misled." },
    { id: "rv4", who: "Deepak V.", stars: 5, when: "2 weeks ago", text: "Dr. Rao is gentle and explains everything. Highly recommend the clinic." }
  ];

  var invoices = [
    ["INV-2610", "01 Oct 2026", 2999, "Paid"], ["INV-2609", "01 Sep 2026", 2999, "Paid"], ["INV-2608", "01 Aug 2026", 2999, "Paid"],
    ["INV-2607", "01 Jul 2026", 2999, "Paid"], ["INV-2606", "01 Jun 2026", 2999, "Paid"]
  ].map(function (v) { return { id: v[0], date: v[1], amount: v[2], status: v[3] }; });

  var clients = [];
  var CLINICS = ["Glow Dental Studio", "SkinKraft Clinic", "Urban Roots Salon", "FitNation Gym", "Noor Wellness", "Prime Realty Desk", "Bloom Fertility", "Zen Ortho Care", "Sparkle Smiles", "Cityline Academy", "Aura Hair Lab", "Nest Interiors", "Peak Physio", "Kids Kingdom School", "Lotus Spa", "Metro Diagnostics", "Spark Coaching", "VitalCare Pharmacy"];
  CLINICS.forEach(function (n, k) {
    clients.push({ id: "cl" + k, name: n, plan: F.pick("cp" + k, ["Starter", "Growth", "Growth", "Scale"]), mrr: F.pick("cm" + k, [1499, 2999, 2999, 5999]),
      status: F.pick("cs" + k, ["Active", "Active", "Active", "Trial", "Past due"]), bots: F.int("cb" + k, 1, 3), convs: F.int("cv" + k, 120, 4800), city: P(400 + k).city });
  });

  var metaSpend = clients.slice(0, 16).map(function (c, k) {
    var spend = F.int("ms" + k, 8, 90) * 500;
    return { id: "ms" + k, client: c.name, spend: spend, leads: Math.round(spend / F.int("mc" + k, 90, 260)), status: F.pick("mst" + k, ["Healthy", "Healthy", "Learning", "Limited"]), account: "act_" + (4100000 + k * 137) };
  });

  var tickets = [
    ["WhatsApp template rejected", "Glow Dental Studio", "High", "Open"], ["Instagram token expired", "SkinKraft Clinic", "High", "Open"],
    ["Need Hindi flow", "Zen Ortho Care", "Medium", "In progress"], ["Invoice GST details", "Prime Realty Desk", "Low", "Resolved"],
    ["Bot not replying after 8 PM", "FitNation Gym", "High", "In progress"], ["Add second number", "Aura Hair Lab", "Medium", "Open"],
    ["Export contacts CSV", "Noor Wellness", "Low", "Resolved"], ["Calendar sync delay", "Peak Physio", "Medium", "Open"],
    ["Change plan to Scale", "Sparkle Smiles", "Low", "Resolved"], ["Webhook failing", "Metro Diagnostics", "High", "Open"]
  ].map(function (t, n) { return { id: "TK-" + (310 + n), subject: t[0], client: t[1], priority: t[2], status: t[3], age: F.int("ta" + n, 1, 9) + "d" }; });

  AX.data.agentix = {
    days: days(30), contacts: contacts, leads: leads, board: board, threads: threads, scripts: scripts, segments: segments,
    templates: templates, referrals: referrals, team: team, tasks: tasks, docs: docs, copilot: copilot, reviews: reviews,
    invoices: invoices, clients: clients, metaSpend: metaSpend, tickets: tickets, sources: SOURCES, temps: TEMPS,
    series: {
      convs: F.series("agx-convs", 30, 120, 260), leads: F.series("agx-leads", 30, 24, 70), bookings: F.series("agx-book", 30, 6, 24),
      aiPct: F.series("agx-ai", 30, 78, 94), resp: F.series("agx-resp", 30, 18, 60), revenue: F.series("agx-rev", 30, 30, 90),
      spend: F.series("agx-gsp", 30, 600, 1800), clicks: F.series("agx-clk", 30, 90, 260), latency: F.series("agx-lat", 30, 380, 900),
      tokens: F.series("agx-tok", 30, 400, 1200)
    }
  };
})(window);
