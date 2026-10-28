(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.data = AX.data || {};
  var F = AX.fake;

  /* Fictional dataset: an AI voice bot ("Aria") answers enquiry calls for a residential project and hands warm leads to the sales team. */
  var PROJECT = "Skyline Residences";
  var CONCERNS = ["Price & payment plan", "Site visit booking", "Home-loan eligibility", "Possession date", "Location & connectivity", "Amenities", "Unit availability"];
  var STAGES = ["New", "InProgress", "FollowUpScheduled", "Converted", "NotInterested", "Closed"];
  var STAGE_LABEL = { New: "New", InProgress: "In progress", FollowUpScheduled: "Follow-up scheduled", Converted: "Converted", NotInterested: "Not interested", Closed: "Closed" };
  var AGENTS = ["Aria (AI voice bot)", "Rhea Kapoor", "Tarun Pillai", "Mansi Verma"];

  var CUST = {
    "Price & payment plan": [
      ["Hello, I saw your ad. What is the price of the 3 BHK?", "The 3 BHK units start at 1.42 crore all-inclusive, with a construction-linked payment plan. Should I share the breakup?"],
      ["Yes, and is there any discount on booking this month?", "There is a limited festive offer: waiver of the parking charge on bookings this month. Would you like a site visit to see the sample flat?"],
      ["Maybe. The price feels a little high compared to nearby projects.", "I understand. Many buyers compare on carpet area; ours is 8 percent larger per rupee. I can send a comparison on WhatsApp."]
    ],
    "Site visit booking": [
      ["I want to visit the site this weekend. Is that possible?", "Absolutely. We have slots on Saturday at 11 AM and 4 PM, and Sunday at 12 noon. Which suits you?"],
      ["Saturday 4 PM works. Will someone show us the sample flat?", "Yes, a sales executive will walk you through the sample flat and the tower. I will confirm on WhatsApp right now."],
      ["Great, please also send the location pin.", "Done. You will get the pin, the brochure and the visit confirmation in a minute."]
    ],
    "Home-loan eligibility": [
      ["Do you tie up with banks? I need a home loan of about eighty lakh.", "Yes, we have approved-project status with five major banks. Your eligibility depends on income and existing EMIs."],
      ["My monthly income is around two lakh. Is that enough?", "That is typically comfortable for the amount you mentioned. A loan partner can give an in-principle approval within a day."],
      ["Okay, can they call me tomorrow?", "Of course. I will schedule a call from our loan desk for tomorrow morning."]
    ],
    "Possession date": [
      ["When will possession be given? I am tired of delays.", "Possession for Tower A is committed for December next year, and the project is registered under RERA."],
      ["Can you show me the construction progress?", "Yes, the latest drone footage and progress report are on our site. I can send the link now."],
      ["Hmm, I will think. Send it over.", "Sure. Shall I check back with you in two days after you have seen it?"]
    ],
    "Location & connectivity": [
      ["How far is the project from the metro station?", "It is about 1.8 kilometres from the nearest metro station, with a feeder bus every ten minutes."],
      ["And schools nearby?", "There are three CBSE schools within three kilometres and a hospital within two."],
      ["Good. What about the highway access?", "The expressway entry is five minutes away. I will send a map with travel times on WhatsApp."]
    ],
    "Amenities": [
      ["What amenities do you have? Do you have a swimming pool?", "Yes, a clubhouse, a 25 metre pool, gym, kids play area, and a jogging track around the central lawn."],
      ["Is there any monthly maintenance fee?", "Maintenance is two rupees fifty per square foot per month, which covers security, power backup for common areas and housekeeping."],
      ["Okay, that sounds reasonable.", "Wonderful. Would you like me to book a visit so you can see the amenities in person?"]
    ],
    "Unit availability": [
      ["Which floors are still available in the 2 BHK?", "Right now there are 2 BHK units on floors 4, 9 and 14 in Tower B, east facing."],
      ["Is the 14th floor garden facing?", "Yes, 14B faces the central garden. It is priced slightly higher. Should I hold it for you for 48 hours?"],
      ["Please hold it. I will bring my wife to see it.", "Done. I have noted a 48 hour hold and will remind you before it expires."]
    ]
  };
  var OPEN = "Hello, this is Aria from " + PROJECT + ". How can I help you today?";
  var CLOSE_POS = ["Thank you for your time. A sales executive will call you shortly. Have a great day!", "Lovely. I have noted everything. You will hear from us soon."];
  var CLOSE_NEG = ["No problem at all. I will keep your details in case anything changes.", "Understood, thank you for your time. Goodbye!"];

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function ts(sec) { return pad(Math.floor(sec / 60)) + ":" + pad(sec % 60); }
  function iso(dayOffset, h, m) { var d = new Date(Date.UTC(2026, 9, 27 - dayOffset, h, m)); return d.toISOString().slice(0, 16).replace("T", " "); }

  function transcript(concern, i) {
    var t = CUST[concern], out = [{ ts: "00:00", who: "bot", text: OPEN }], s = 6;
    t.forEach(function (pair, k) {
      out.push({ ts: ts(s), who: "customer", text: pair[0] }); s += F.int("tc" + i + k, 6, 12);
      out.push({ ts: ts(s), who: "bot", text: pair[1] }); s += F.int("tb" + i + k, 8, 15);
    });
    return out;
  }

  var calls = [];
  for (var i = 0; i < 34; i++) {
    var p = F.person("call" + i);
    var concern = CONCERNS[i % CONCERNS.length];
    var score = F.int("score" + i, 12, 96);
    var bucket = score >= 70 ? "Hot" : score >= 40 ? "Warm" : "Cold";
    var sentiment = score >= 65 ? "Positive" : score >= 35 ? "Neutral" : "Negative";
    var outcome = score >= 82 ? "Converted" : score < 30 ? "Unconverted" : "Pending";
    var dur = F.int("dur" + i, 74, 392);
    var tr = transcript(concern, i);
    tr.push({ ts: ts(dur - 6), who: "bot", text: (bucket === "Cold" ? CLOSE_NEG : CLOSE_POS)[i % 2] });
    calls.push({
      id: "CL-" + (4210 + i), name: "CL-" + (4210 + i) + " · " + p.name, customer: p.name, phone: p.phone, email: p.email, city: p.city,
      started: iso(Math.floor(i / 4), 9 + (i * 5) % 10, (i * 13) % 60), duration: dur,
      agent: AGENTS[i % 4 === 0 ? 1 : i % 4 === 1 ? 0 : i % 4 === 2 ? 0 : 3] || AGENTS[0],
      status: i === 7 ? "missed" : "ended",
      sentiment: sentiment, bucket: bucket, score: score, concern: concern, outcome: outcome,
      reason: outcome === "Unconverted" ? F.pick("reason" + i, ["Budget mismatch", "Wants a different location", "Already booked elsewhere", "Not ready to buy yet"]) : "",
      stage: outcome === "Converted" ? "Converted" : bucket === "Cold" ? "NotInterested" : bucket === "Hot" ? "FollowUpScheduled" : "InProgress",
      summary: p.name.split(" ")[0] + " called about " + concern.toLowerCase() + " for " + PROJECT + ". " +
        (bucket === "Hot" ? "Strong buying intent; asked for next steps and a visit." : bucket === "Warm" ? "Interested but comparing options; wants more information." : "Low intent; mostly exploring the market."),
      action: bucket === "Hot" ? "Call back within 2 hours and confirm the site visit." : bucket === "Warm" ? "Send brochure and price comparison on WhatsApp; follow up in 2 days." : "Add to monthly nurture list.",
      missing: bucket === "Cold" ? ["Budget", "Timeline"] : bucket === "Warm" ? ["Budget"] : [],
      transcript: tr
    });
  }

  var leads = [];
  var seen = {};
  for (var j = 0; j < 26; j++) {
    var c = calls[j];
    if (seen[c.phone]) continue;
    seen[c.phone] = 1;
    var stage = c.stage;
    var stageIx = { New: 0, InProgress: 1, FollowUpScheduled: 2, Converted: 4, NotInterested: 3, Closed: 3 }[stage];
    leads.push({
      id: "LD-" + (900 + j), name: c.customer, phone: c.phone, email: c.email, city: c.city,
      stage: stage, stageLabel: STAGE_LABEL[stage], bucket: c.bucket, score: c.score, concern: c.concern,
      calls: 1 + (j % 3), lastCall: c.started, owner: AGENTS[1 + (j % 3)], stageIx: stageIx,
      activity: [
        { at: c.started, text: "Inbound call handled by Aria (" + ts(c.duration) + ")" },
        { at: c.started, text: "AI summary and score generated: " + c.bucket + " (" + c.score + ")" },
        { at: iso(Math.floor(j / 4), 18, 5), text: "Follow-up task created for " + AGENTS[1 + (j % 3)] },
        { at: iso(Math.floor(j / 4), 18, 40), text: "WhatsApp brochure sent" }
      ],
      wa: [{ from: "bot", text: "Hi " + c.customer.split(" ")[0] + ", thanks for calling " + PROJECT + ". Here is the brochure you asked for.", at: "10:42" }]
    });
  }

  var TASK_TITLES = [
    ["Call back about site visit", "high"], ["Send price comparison on WhatsApp", "med"], ["Confirm Saturday 4 PM visit", "high"],
    ["Loan desk call-back", "med"], ["Share construction progress video", "low"], ["Hold 14B for 48 hours", "high"],
    ["Follow up: comparing projects", "med"], ["Update lead stage after visit", "low"], ["Send RERA documents", "med"],
    ["Call missed enquiry", "high"], ["Nurture list: cold leads", "low"], ["Schedule second visit with family", "med"],
    ["Share booking-amount details", "high"], ["Collect KYC documents", "med"]
  ];
  var tasks = TASK_TITLES.map(function (t, k) {
    var lead = leads[k % leads.length];
    return { id: "T-" + (100 + k), col: k < 6 ? "todo" : k < 10 ? "doing" : "done", title: t[0], sub: lead.name, tags: [t[1] === "high" ? "High" : t[1] === "med" ? "Medium" : "Low"], meta: "Due " + (28 + (k % 4)) + " Oct · " + lead.owner, prio: t[1], leadId: lead.id };
  });

  var employees = [
    ["Rhea Kapoor", "Sales lead", 18, 41], ["Tarun Pillai", "Sales executive", 15, 33], ["Mansi Verma", "Sales executive", 17, 38],
    ["Dev Saxena", "Loan desk", 9, 52], ["Tanya Joshi", "Site-visit coordinator", 12, 47], ["Neel Menon", "CRM admin", 0, 0],
    ["Aria (AI voice bot)", "Voice agent", 212, 19], ["Simran Rao", "Sales executive", 14, 36]
  ].map(function (e, k) {
    return { id: "EM-" + (10 + k), name: e[0], role: e[1], handled: e[2] * 4 + k, conversion: e[3], avgScore: F.int("em" + k, 52, 78), status: k === 5 ? "Away" : "Active", email: e[0].split(" ")[0].toLowerCase() + "@example.in" };
  });

  /* Three scripted live calls: lines stream in every 1.2 s. sent = sentiment after that line. */
  function L(who, text, sent) { return { who: who, text: text, sent: sent }; }
  var live = [
    { id: "LV-1", customer: F.person("live1").name, phone: F.person("live1").phone, concern: "Site visit booking", lines: [
      L("bot", OPEN, "Neutral"), L("customer", "Hi, I want to see the sample flat this weekend.", "Positive"), L("bot", "Wonderful, I can offer Saturday 11 AM or 4 PM.", "Positive"),
      L("customer", "Saturday 4 PM please. Can I bring my parents?", "Positive"), L("bot", "Of course. I will confirm on WhatsApp and share the location pin.", "Positive"),
      L("customer", "Do you have parking for visitors?", "Neutral"), L("bot", "Yes, visitor parking is right at the gate.", "Positive"), L("customer", "Perfect, see you then.", "Positive")] },
    { id: "LV-2", customer: F.person("live2").name, phone: F.person("live2").phone, concern: "Price & payment plan", lines: [
      L("bot", OPEN, "Neutral"), L("customer", "Your price is higher than the project next door.", "Negative"), L("bot", "I understand. Our carpet area is larger; may I share a per-sq-ft comparison?", "Neutral"),
      L("customer", "Hmm, what discount can you give?", "Neutral"), L("bot", "A parking waiver this month, plus a flexible payment plan.", "Neutral"),
      L("customer", "Parking waiver is useful actually.", "Positive"), L("bot", "Shall I hold a 3 BHK for 48 hours while you decide?", "Positive"), L("customer", "Yes, hold it please.", "Positive")] },
    { id: "LV-3", customer: F.person("live3").name, phone: F.person("live3").phone, concern: "Possession date", lines: [
      L("bot", OPEN, "Neutral"), L("customer", "My last builder delayed by two years. When is possession here?", "Negative"), L("bot", "Tower A is committed for December next year and registered under RERA.", "Neutral"),
      L("customer", "Commitments are easy to make.", "Negative"), L("bot", "Fair point. I can share the drone progress report and RERA filing.", "Neutral"),
      L("customer", "Okay, send both.", "Neutral"), L("bot", "Sending on WhatsApp now. May I follow up in two days?", "Positive"), L("customer", "Sure, call me Thursday.", "Positive")] }
  ];

  function days(n, seed) { return F.series(seed, n, 14, 52); }
  var labels14 = [];
  for (var d = 13; d >= 0; d--) labels14.push(String(27 - d > 0 ? 27 - d : 31 + 27 - d) + (27 - d > 0 ? " Oct" : " Sep"));

  AX.data.voicecrm = {
    project: PROJECT, concerns: CONCERNS, stages: STAGES, stageLabel: STAGE_LABEL,
    calls: calls, leads: leads, tasks: tasks, employees: employees, live: live,
    labels14: labels14, callsPerDay: days(14, "cpd"), convPerDay: F.series("cvd", 14, 6, 19)
  };
})(window);
