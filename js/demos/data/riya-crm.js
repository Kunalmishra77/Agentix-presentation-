(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.data = AX.data || {};
  var F = AX.fake;

  /* Fictional dataset: Riya, a WhatsApp bot, talks to gym enquiries; the CRM scores, tracks outcomes and queues follow-ups. */
  var GOALS = ["Weight loss", "Muscle gain", "General fitness", "Les Mills classes", "Personal training", "Post-injury rehab"];
  var SOURCES = ["Instagram ad", "Google search", "Walk-in referral", "Website form", "Facebook ad"];
  var OUTCOMES = ["New", "Qualified", "TrialBooked", "Converted", "Lost"];
  var SENT = ["Positive", "Neutral", "Negative"];
  var OWNERS = ["Sales desk A", "Sales desk B", "Front desk"];
  var PLANS = ["Monthly", "3 months", "6 months", "12 months"];
  var MSGS = [
    "What are your membership prices?", "Do you have Les Mills classes in the evening?", "Is there a trainer for weight loss?",
    "Can I try for a day before joining?", "What are the gym timings on Sunday?", "Do you have a ladies batch?"
  ];

  var leads = [];
  for (var i = 0; i < 32; i++) {
    var p = F.person("riya-lead-" + i);
    var oc = i < 4 ? "New" : OUTCOMES[F.int("riya-oc-" + i, 0, 4)];
    leads.push({
      id: "L-" + (1001 + i), name: p.name, phone: p.phone, email: p.email,
      goal: F.pick("riya-goal-" + i, GOALS), source: F.pick("riya-src-" + i, SOURCES),
      score: F.int("riya-score-" + i, 22, 96), sentiment: F.pick("riya-sent-" + i, SENT),
      outcome: oc, plan: F.pick("riya-plan-" + i, PLANS), owner: F.pick("riya-own-" + i, OWNERS),
      lastMsg: F.pick("riya-msg-" + i, MSGS), daysAgo: F.int("riya-days-" + i, 0, 13), fresh: false
    });
  }

  var tasks = [];
  var TT = ["Call after trial", "Send Les Mills timetable", "Share 6-month offer", "Confirm trial slot", "Re-engage cold lead", "Collect feedback"];
  for (var t = 0; t < 14; t++) {
    var l = leads[t + 2];
    tasks.push({ id: "T-" + (t + 1), col: t < 5 ? "todo" : t < 10 ? "doing" : "done", title: F.pick("riya-tt-" + t, TT) + " — " + l.name,
      sub: l.goal + " · " + l.phone, meta: "Due " + (t % 4 === 0 ? "today" : "in " + (1 + t % 3) + " days") + " · " + l.owner, leadId: l.id });
  }

  /* Pre-recorded conversations + one live scripted thread where Riya books a trial. */
  var threads = [
    { id: "live", name: "New enquiry (live demo)", channel: "whatsapp", preview: "Press Play to watch Riya book a trial", leadId: "NEW", messages: [] },
    { id: "c1", name: leads[5].name, channel: "whatsapp", leadId: leads[5].id, messages: [
      { from: "user", text: "Hi, what are the membership prices?" },
      { from: "ai", text: "Hi! I'm Riya from Fitness First. Plans start at ₹2,499 a month, with 3, 6 and 12-month options that cost less per month. What is your goal?" },
      { from: "user", text: "Weight loss mainly." },
      { from: "ai", text: "Great. Our Les Mills classes plus a trainer-led plan work well for that. Want to try a free day pass?" }] },
    { id: "c2", name: leads[9].name, channel: "whatsapp", leadId: leads[9].id, messages: [
      { from: "user", text: "Do you have an evening ladies batch?" },
      { from: "ai", text: "Yes, there is a ladies-only batch at 6 PM on weekdays. Shall I book you a trial for tomorrow?" },
      { from: "user", text: "Too expensive for me right now." },
      { from: "ai", text: "I understand. The 12-month plan brings it down to about ₹1,500 a month. I'll note this for the sales desk." }] },
    { id: "c3", name: leads[14].name, channel: "whatsapp", leadId: leads[14].id, messages: [
      { from: "user", text: "Can I pay in instalments?" },
      { from: "ai", text: "We offer no-cost EMI on 6 and 12-month plans. The front desk will explain the options when you visit." }] }
  ];
  var scripts = {
    live: [
      { from: "user", text: "Hi, I saw your Instagram ad. I want to start working out." },
      { from: "ai", text: "Hi! I'm Riya from Fitness First Dwarka. What is your main goal: weight loss, muscle gain or general fitness?", chips: ["Weight loss", "Muscle gain"] },
      { from: "user", text: "Weight loss. I've never been to a gym." },
      { from: "ai", text: "That's a great start. Beginners usually begin with a guided Les Mills class plus a trainer orientation. Would you like a free trial session?", chips: ["Yes, book a trial"] },
      { from: "user", text: "Yes, this Saturday morning." },
      { from: "ai", text: "Booked: Saturday, 8:00 AM, free trial with a trainer orientation. I have sent the location pin and what to bring.", event: "trial" },
      { from: "ai", text: "Our sales desk will call you after the trial. See you Saturday!" }
    ]
  };

  var counts = { leads: [8, 11, 9, 14, 12, 7, 10, 15, 13, 11, 17, 12, 14, 18], trials: [2, 3, 2, 5, 4, 2, 3, 6, 5, 4, 7, 4, 5, 8] };
  var labels14 = [];
  for (var d = 13; d >= 0; d--) labels14.push(d === 0 ? "Today" : "-" + d + "d");

  AX.data["riya-crm"] = {
    brandLine: "Fitness First Dwarka", goals: GOALS, sources: SOURCES, outcomes: OUTCOMES, sentiments: SENT, plans: PLANS,
    leads: leads, tasks: tasks, threads: threads, scripts: scripts, leadsPerDay: counts.leads, trialsPerDay: counts.trials, labels14: labels14,
    objections: ["Price", "Timings", "Distance", "Need to ask family", "Already member elsewhere", "Injury concern"],
    objectionCounts: [34, 21, 14, 12, 9, 6]
  };
})(window);
