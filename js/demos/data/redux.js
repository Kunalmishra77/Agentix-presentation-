/* REDUX demo dataset (Eurobrass bath-fittings restoration). Fully fictional hotels, people and numbers; generated with AX.fake (seeded). */
(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.data = AX.data || {};
  var F = AX.fake;
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  var now = new Date();
  var TODAY = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
  var DAY = 86400000;
  function dayIso(offset) { var d = new Date(now.getTime() + offset * DAY); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }

  /* City routing: each city has a care executive and an SLA (minutes to first call-back). */
  var routes = {
    "Delhi": { exec: F.person("rx-exec-delhi").name, sla: 60 },
    "Gurugram": { exec: F.person("rx-exec-ggn").name, sla: 60 },
    "Noida": { exec: F.person("rx-exec-noida").name, sla: 90 },
    "Jaipur": { exec: F.person("rx-exec-jaipur").name, sla: 120 },
    "Mumbai": { exec: F.person("rx-exec-mumbai").name, sla: 120 },
    "Pune": { exec: F.person("rx-exec-pune").name, sla: 120 }
  };
  var cities = Object.keys(routes);
  var surveyors = [F.person("rx-sv-1").name, F.person("rx-sv-2").name, F.person("rx-sv-3").name];

  var HOTELS = ["Hotel Kesar Palace", "The Saffron Courtyard", "Lotus Grove Residency", "Hotel Marigold Inn", "Sandalwood Suites", "The Banyan Retreat", "Hotel Silver Birch", "Jasmine Court Hotel", "Amber Fort View Hotel", "Hotel Peacock Bay", "The Mango Tree Lodge", "Coral Reef Residency", "Hotel Neem House", "Opal Crest Hotel", "Hotel Rangoli Palace", "The Cedar Gate", "Willow Park Suites", "Hotel Tulsi Heights", "Mist Valley Resort", "Hotel Monsoon Bay"];
  var SOURCES = ["Meta Ads", "Google Ads", "WhatsApp", "Website", "Referral"];
  var COLS = ["new", "contacted", "survey", "quoted", "won", "lost"];

  var leads = [];
  for (var i = 0; i < 18; i++) {
    var p = F.person("rx-lead" + i);
    var city = i === 0 ? "Delhi" : F.pick("rx-city" + i, cities);
    var col = i === 0 ? "quoted" : i < 5 ? "new" : i < 8 ? "contacted" : i < 11 ? "survey" : i < 14 ? "quoted" : i < 16 ? "won" : "lost";
    var slaMin = col === "new" ? (i === 1 ? -14 : F.int("rx-sla" + i, 6, 55)) : null;
    leads.push({
      id: "L-" + (2401 + i), col: col, title: HOTELS[i], contact: p.name, phone: p.phone, city: city, exec: routes[city].exec,
      source: i === 0 ? "Website" : F.pick("rx-src" + i, SOURCES), rooms: F.int("rx-rooms" + i, 18, 140),
      slaMin: slaMin, note: F.pick("rx-note" + i, ["Chrome finish dull in 40 rooms", "Corroded shower arms, wants a pilot", "Leaking diverters on 3 floors", "Renovating by March", "Wants quote before board meeting"])
    });
  }

  var threads = [
    { id: "wa-1", name: "Hotel Kesar Palace", channel: "whatsapp", preview: "Please share the quote copy",
      messages: [
        { from: "user", text: "Hello, we filled the form for a free assessment. 62 rooms, shower mixers are all tarnished.", at: "10:02" },
        { from: "agent", text: "Namaste! This is REDUX by Eurobrass. Your care executive will call you within the hour. Which city is the property in?", at: "10:03" },
        { from: "user", text: "Delhi, Karol Bagh.", at: "10:04" },
        { from: "agent", text: "Noted. Survey slot is booked for tomorrow 11 AM. Our surveyor will message when on the way.", at: "10:08" },
        { from: "user", text: "Please share the quote copy once ready.", at: "10:09" }
      ] }
  ];
  for (var t = 1; t < 5; t++) {
    var tp = F.person("rx-thr" + t);
    threads.push({ id: "wa-" + (t + 1), name: HOTELS[t + 2], channel: "whatsapp",
      preview: ["Can you do rose gold finish?", "What is the warranty period?", "Send photos of earlier work", "Survey tomorrow confirmed"][t - 1],
      messages: [
        { from: "user", text: ["Can you do rose gold finish?", "What is the warranty period?", "Send photos of earlier work", "Survey tomorrow confirmed"][t - 1], at: "0" + (8 + t) + ":1" + t },
        { from: "agent", text: "Thanks " + tp.name.split(" ")[0] + ", checking and replying shortly.", at: "0" + (8 + t) + ":2" + t }
      ] });
  }
  var scripts = {
    "wa-1": [
      { from: "agent", text: "Sure. Your quotation REDUX-Q-1042 is ready; we are sending the PDF and a portal link now.", delay: 700 },
      { from: "agent", text: "You can approve it online from the portal. Warranty on restored fittings is 24 months.", delay: 700 }
    ]
  };

  /* Survey: bathrooms and fittings captured by the surveyor app. */
  var FIN = ["Chrome", "Brushed gold", "Matte black", "Antique brass"];
  var rateCard = [
    { id: "RC-01", type: "Basin mixer", finish: "Chrome", fresh: 6200, market: 7400, redux: 2100 },
    { id: "RC-02", type: "Basin mixer", finish: "Brushed gold", fresh: 9800, market: 11200, redux: 3300 },
    { id: "RC-03", type: "Wall mixer with diverter", finish: "Chrome", fresh: 11400, market: 13500, redux: 3900 },
    { id: "RC-04", type: "Wall mixer with diverter", finish: "Matte black", fresh: 15800, market: 17900, redux: 5200 },
    { id: "RC-05", type: "Overhead shower 8 inch", finish: "Chrome", fresh: 7600, market: 9200, redux: 2400 },
    { id: "RC-06", type: "Overhead shower 8 inch", finish: "Brushed gold", fresh: 12800, market: 14800, redux: 4100 },
    { id: "RC-07", type: "Hand shower set", finish: "Chrome", fresh: 3400, market: 4300, redux: 1200 },
    { id: "RC-08", type: "Health faucet", finish: "Chrome", fresh: 1900, market: 2500, redux: 700 },
    { id: "RC-09", type: "Angle cock", finish: "Chrome", fresh: 850, market: 1100, redux: 320 },
    { id: "RC-10", type: "Pillar cock", finish: "Antique brass", fresh: 4200, market: 5100, redux: 1500 },
    { id: "RC-11", type: "Towel rail 24 inch", finish: "Chrome", fresh: 3900, market: 4800, redux: 1300 },
    { id: "RC-12", type: "Soap dispenser", finish: "Matte black", fresh: 3100, market: 3900, redux: 1100 }
  ];
  function rc(type, finish) { return rateCard.filter(function (r) { return r.type === type && r.finish === finish; })[0]; }
  var survey = {
    id: "SV-1042", hotel: "Hotel Kesar Palace", surveyor: surveyors[0], date: TODAY,
    bathrooms: [
      { id: "b1", name: "Room 101 bathroom", fittings: [
        { id: "f1", type: "Basin mixer", finish: "Chrome", cond: "Fair", rec: "Restore" },
        { id: "f2", type: "Wall mixer with diverter", finish: "Chrome", cond: "Fair", rec: "Restore" },
        { id: "f3", type: "Overhead shower 8 inch", finish: "Chrome", cond: "Poor", rec: "Restore" },
        { id: "f4", type: "Health faucet", finish: "Chrome", cond: "Good", rec: "Restore" }
      ] },
      { id: "b2", name: "Room 102 bathroom", fittings: [
        { id: "f5", type: "Basin mixer", finish: "Brushed gold", cond: "Fair", rec: "Restore" },
        { id: "f6", type: "Wall mixer with diverter", finish: "Matte black", cond: "Poor", rec: "Restore" },
        { id: "f7", type: "Hand shower set", finish: "Chrome", cond: "Fair", rec: "Restore" }
      ] }
    ],
    rooms: 62
  };

  var catalog = [], cat = ["Basin mixers", "Shower systems", "Diverters", "Accessories", "Spares"];
  var names = ["Aurum", "Verde", "Linea", "Onyx", "Halo", "Cascade", "Nimbus", "Arc", "Prism", "Terra"];
  for (var c = 0; c < 22; c++) {
    var cc = cat[c % 5];
    catalog.push({ id: "SKU-" + (4001 + c), name: names[c % 10] + " " + ["basin mixer", "shower arm set", "wall diverter", "towel rail", "cartridge 35 mm"][c % 5], category: cc, finish: FIN[c % 4], mrp: F.int("rx-mrp" + c, 8, 160) * 100 - 1, warranty: cc === "Spares" ? "12 months" : "24 months" });
  }
  var stock = catalog.map(function (s, k) {
    var onHand = F.int("rx-stk" + k, 2, 90), reorder = F.int("rx-ro" + k, 10, 30);
    return { id: s.id, name: s.name, finish: s.finish, onHand: onHand, reorder: reorder, location: F.pick("rx-loc" + k, ["Okhla store", "Jaipur hub", "Mumbai hub"]), status: onHand <= reorder ? "Low" : "OK" };
  });

  var campaigns = [];
  var camp = ["Diwali refurbishment offer", "Hotel GM intro sequence", "Warranty expiry reminder", "Before/after case study", "Pilot room invitation", "Summer occupancy low-season", "Referral credit nudge", "Google lead follow-up", "Meta lead nurture", "Banquet-hall bathrooms", "Festival-season booking push", "Resort owners intro", "Hospital guest-house outreach", "Pilot room case study", "Churned lead win-back", "GST invoice explainer"];
  camp.forEach(function (n, k) {
    campaigns.push({ id: "CP-" + (301 + k), name: n, channel: k % 3 === 0 ? "Email" : "WhatsApp", audience: F.pick("rx-aud" + k, ["Hotels - Delhi NCR", "Hotels - Jaipur", "Past customers", "Open leads", "Warranty < 60 days"]), sent: F.int("rx-snt" + k, 120, 2400), replies: F.int("rx-rep" + k, 8, 190), status: k < 9 ? "Sent" : k < 12 ? "Scheduled" : "Draft" });
  });

  var invoices = [], payments = [];
  for (var v = 0; v < 20; v++) {
    var amt = F.int("rx-inv" + v, 18, 260) * 1000;
    var paid = v % 3 !== 0;
    invoices.push({ id: "INV-" + (7101 + v), hotel: HOTELS[(v + 4) % 20], amount: amt, due: dayIso(paid ? -v * 3 : 6 - v), status: paid ? "Paid" : v % 2 ? "Overdue" : "Sent", kind: v % 2 ? "Final" : "Advance 50%" });
    if (paid) payments.push({ id: "PAY-" + (9101 + v), invoice: "INV-" + (7101 + v), hotel: HOTELS[(v + 4) % 20], amount: amt, mode: F.pick("rx-pm" + v, ["UPI", "NEFT", "Cheque", "Card"]), date: dayIso(-v * 3), ref: "TXN" + F.int("rx-ref" + v, 100000, 999999) });
  }

  var jobs = [];
  var JS = ["scheduled", "dismantled", "restoration", "qc", "refitted", "handover"];
  for (var j = 0; j < 8; j++) {
    jobs.push({ id: "JOB-" + (5201 + j), col: JS[j % 6], title: HOTELS[(j + 6) % 20], sub: F.int("rx-jf" + j, 18, 120) + " fittings", meta: "Team " + ["A", "B", "C"][j % 3] + " · " + dayIso(j - 3).slice(5), tags: [routes[cities[j % 6]].exec.split(" ")[0]] });
  }

  var outbox = [
    { id: "OB-1", at: "09:58", channel: "WhatsApp", to: "Hotel Kesar Palace", template: "Enquiry received", text: "Hello! Thanks for your enquiry with REDUX by Eurobrass. Your care executive will call you within 1 hour.", buttons: ["Call me now", "Change time"] },
    { id: "OB-2", at: "10:12", channel: "WhatsApp", to: "Hotel Kesar Palace", template: "Survey confirmed", text: "Your free assessment is booked for tomorrow, 11:00 AM. Surveyor: " + surveyors[0] + ".", buttons: ["Reschedule"] },
    { id: "OB-3", at: "10:15", channel: "Email", to: "Hotel Kesar Palace", template: "Survey confirmation", text: "Survey confirmation email with address, slot and surveyor contact.", buttons: [] }
  ];
  var OBT = [["Enquiry received", "WhatsApp", "Thanks for your enquiry. Your care executive will call you shortly.", ["Call me now"]], ["Survey confirmed", "WhatsApp", "Your free assessment is booked. The surveyor will message when on the way.", ["Reschedule"]],
    ["Quote sent", "WhatsApp", "Your quotation is ready. View and approve it in your customer portal.", ["View quote"]], ["Job update", "WhatsApp", "Your fittings are now in restoration. Expected completion in 3 days.", ["View tracker"]],
    ["Invoice sent", "Email", "Your GST invoice is attached with a UPI payment link.", []], ["Warranty issued", "WhatsApp", "Your 24 month warranty cards are now in the customer portal.", ["Open portal"]]];
  for (var ob = 0; ob < 12; ob++) {
    var ot = OBT[ob % OBT.length];
    outbox.push({ id: "OB-" + (4 + ob), at: pad(8 + (ob % 3)) + ":" + pad((ob * 11) % 60), channel: ot[1], to: HOTELS[(ob + 5) % 20], template: ot[0], text: ot[2], buttons: ot[3] });
  }

  var warranty = [
    { id: "WR-11", item: "Basin mixer - Chrome (Room 301)", months: 24, left: 21 },
    { id: "WR-12", item: "Wall mixer - Matte black (Room 305)", months: 24, left: 21 },
    { id: "WR-13", item: "Overhead shower - Chrome (Room 302)", months: 24, left: 21 }
  ];
  var contact = F.person("rx-kesar");

  AX.data.redux = {
    today: TODAY, routes: routes, cities: cities, surveyors: surveyors, leads: leads, threads: threads, scripts: scripts, survey: survey,
    rateCard: rateCard, rc: rc, catalog: catalog, stock: stock, campaigns: campaigns, invoices: invoices, payments: payments, jobs: jobs,
    outbox: outbox, warranty: warranty, customer: { hotel: "Hotel Kesar Palace", name: contact.name, phone: contact.phone, city: "Delhi", rooms: 62 }, hotels: HOTELS, sources: SOURCES
  };
})(window);
