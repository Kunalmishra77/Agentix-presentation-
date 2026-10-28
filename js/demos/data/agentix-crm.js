(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.data = AX.data || {};
  var F = AX.fake;

  /* Fictional dataset. "Today" is pinned so deadline badges are deterministic. */
  var TODAY = "2026-10-28";
  function addDays(n) {
    var d = new Date(Date.UTC(2026, 9, 28 + n));
    return d.toISOString().slice(0, 10);
  }
  function nm(seed) { return F.person("ac-p-" + seed); }

  var team = [
    { id: "u1", name: nm(1).name, role: "Co-founder", type: "founder" },
    { id: "u2", name: nm(2).name, role: "Co-founder", type: "founder" },
    { id: "u3", name: nm(3).name, role: "Project manager", type: "manager" },
    { id: "u4", name: nm(4).name, role: "Full-stack developer", type: "dev" },
    { id: "u5", name: nm(5).name, role: "Designer", type: "dev" },
    { id: "u6", name: nm(6).name, role: "Automation engineer", type: "dev" },
    { id: "u7", name: nm(7).name, role: "Sales executive", type: "sales" }
  ];

  var INDUSTRIES = ["Healthcare", "Hospitality", "Retail", "Education", "Real estate", "Fitness", "Manufacturing", "Travel"];
  var CLIENT_NAMES = ["Brightleaf Dental", "Harbor & Pine Cafe", "Kestrel Logistics", "Nimbus Learning", "Orchid Residency", "Pulse Strength Club",
    "Saffron Table", "Tidewater Resorts", "Urban Loom Retail", "Vantage Realty", "Willow Paediatrics", "Zenith Auto Parts", "Marigold Travels", "Cobalt Fabrication"];
  var STAGES = ["Hot", "Warm", "Warm", "Cold", "Hot", "Warm", "Won", "Hot", "Warm", "Cold", "Won", "Warm", "Hot", "Cold"];
  var OWNERS = [2, 6, 2, 0, 1, 6, 2, 0, 1, 6, 2, 0, 1, 6];
  var clients = CLIENT_NAMES.map(function (name, i) {
    var p = nm(20 + i);
    var exp = F.int("ac-exp-" + i, 6, 40) * 50000;
    return {
      id: "c" + (i + 1), name: name, industry: INDUSTRIES[i % INDUSTRIES.length], stage: STAGES[i],
      owner: team[OWNERS[i]].name,
      expectedRevenue: exp, revenueTotal: Math.round(exp * (F.int("ac-rt-" + i, 25, 90) / 100) / 1000) * 1000,
      contact: p.name, email: p.email, phone: p.phone, city: p.city,
      contractEnd: addDays(40 + i * 23)
    };
  });

  var TITLES = ["Homepage redesign", "WhatsApp booking bot", "Lead capture forms", "CRM dashboard build", "Google Ads landing pages", "Invoice automation",
    "SEO content calendar", "Mobile app QA pass", "Payment gateway integration", "Brand kit refresh", "Analytics events setup", "Email drip sequence",
    "Admin panel permissions", "Review-request automation", "Catalogue import tool"];
  var PRIORITY = ["High", "Medium", "Low", "Medium", "High"];
  var OFFSETS = [-6, 4, 12, -1, 2, 18, 6, 30, -3, 9, 1, 24, 14, 3, 8, 21, 5, -2, 11, 27, 7, 15, 0, 33, 10, 19, 6, 13, 4, 22];
  var stories = [];
  for (var i = 0; i < 30; i++) {
    var done = (i % 10 === 0 || i % 10 === 3 || i % 10 === 7);
    var st = done ? "done" : (i % 3 === 0 ? "todo" : i % 3 === 1 ? "progress" : "review");
    stories.push({
      id: "S-" + (101 + i), clientId: "c" + ((i * 5) % 14 + 1), title: TITLES[i % TITLES.length] + (i >= 15 ? " (phase 2)" : ""),
      status: st, due: addDays(done ? OFFSETS[i] - 8 : OFFSETS[i]), priority: PRIORITY[i % PRIORITY.length],
      assignee: team[3 + (i % 3)].name, hours: 6 + (i * 7) % 34
    });
  }

  var INV_STATUS = ["Paid", "Paid", "Sent", "Overdue", "Draft"];
  var invoices = [];
  clients.forEach(function (c, ci) {
    var n = 3 + (ci % 2);
    for (var k = 0; k < n; k++) {
      var amt = F.int("ac-inv-" + ci + "-" + k, 2, 14) * 10000;
      var status = k === n - 1 ? INV_STATUS[(ci + 2) % 5] : "Paid";
      invoices.push({
        id: "INV-26-" + String(100 + ci * 4 + k), clientId: c.id, amount: amt, issued: addDays(-(150 - k * 45) + ci), status: status,
        note: ["Kick-off milestone", "Design sign-off", "Build milestone", "Go-live balance"][k]
      });
    }
  });

  var comms = [
    ["Call", "Weekly sync. Agreed priorities for the next sprint."], ["Email", "Sent revised scope and timeline."],
    ["WhatsApp", "Client shared brand assets for review."], ["Meeting", "Demo of the staging build; two change requests logged."],
    ["Email", "Invoice reminder sent. Payment promised by Friday."]
  ];

  var lStages = ["New", "Contacted", "Proposal sent", "Negotiation", "Won", "Lost"];
  var SOURCES = ["Referral", "Website", "LinkedIn", "Cold outreach", "Google Ads", "Event"];
  var LEAD_CO = ["Ridgeway Clinics", "Copperline Foods", "Indigo Interiors", "Lumen Opticals", "Sunbeam Schools", "Granite Gym Co.", "Peak Outdoor Gear",
    "Anchor Freight", "Meadow Organics", "Halcyon Spa", "Quill Publishing", "Basil & Thyme", "Crest Motors", "Opal Jewellers", "Banyan Homestays", "Falcon Security",
    "Juniper Pharmacy", "Delta Tutorials", "Zephyr Cycles", "Ember Bakery"];
  var leads = LEAD_CO.map(function (co, i) {
    var p = nm(60 + i);
    return {
      id: "L-" + (201 + i), company: co, contact: p.name, email: p.email, phone: p.phone, source: SOURCES[i % SOURCES.length],
      stage: lStages[(i * 5 + 1) % 6], value: F.int("ac-lv-" + i, 4, 36) * 25000, owner: team[[6, 2, 6, 0, 1][i % 5]].name,
      last: addDays(-(i % 9) - 1)
    };
  });

  var MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  var revenue = {
    labels: MONTHS,
    actual: [4.2, 4.8, 5.1, 4.9, 5.6, 6.0, 5.8, 6.4, 6.9, 7.1, 7.6, 7.9].map(function (v) { return Math.round(v * 100000); }),
    target: [5.0, 5.2, 5.4, 5.6, 5.8, 6.0, 6.3, 6.6, 6.9, 7.2, 7.5, 8.2].map(function (v) { return Math.round(v * 100000); })
  };

  var announcements = [
    { id: "a1", pinned: true, title: "Diwali break: office closed 8-10 Nov", body: "Deliveries due in that window have been moved. Check your stories on the board.", by: team[0].name, at: addDays(-1) },
    { id: "a2", pinned: false, title: "New review rule for design stories", body: "Every design story now needs a second reviewer before it moves to Done.", by: team[1].name, at: addDays(-4) },
    { id: "a3", pinned: false, title: "Q4 targets are live", body: "Revenue target for October is raised to 8.2 lakh. Incentive slabs unchanged.", by: team[0].name, at: addDays(-9) }
  ];

  /* Obviously fictional, round numbers. */
  var salary = team.map(function (t, i) {
    var base = [100000, 100000, 60000, 50000, 40000, 50000, 30000][i];
    var sold = [0, 0, 200000, 0, 0, 0, 400000][i];
    return { id: t.id, name: t.name, role: t.role, base: base, incentive: Math.round(sold * 0.05), sold: sold, month: "October 2026" };
  });

  var investments = [
    { id: "INV-F1", item: "Seed capital (founders)", amount: 1000000, date: "2025-04-01", note: "Fictional" },
    { id: "INV-F2", item: "Laptops and monitors", amount: 300000, date: "2025-05-15", note: "Fictional" },
    { id: "INV-F3", item: "Cloud credits prepaid", amount: 200000, date: "2025-08-01", note: "Fictional" },
    { id: "INV-F4", item: "Co-working deposit", amount: 150000, date: "2025-09-10", note: "Fictional" },
    { id: "INV-F5", item: "Brand and website refresh", amount: 100000, date: "2026-02-20", note: "Fictional" }
  ];

  AX.data["agentix-crm"] = {
    today: TODAY, team: team, clients: clients, stories: stories, invoices: invoices, comms: comms, leads: leads, leadStages: lStages,
    sources: SOURCES, industries: INDUSTRIES, revenue: revenue, announcements: announcements, salary: salary, investments: investments
  };
})(window);
