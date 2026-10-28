/* Your Hair Company demo dataset. Fully fictional patients, orders and doctors; generated with AX.fake (seeded). */
(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.data = AX.data || {};
  var F = AX.fake;
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  var now = new Date();
  var DAY = 86400000;
  function iso(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function dayIso(o) { return iso(new Date(now.getTime() + o * DAY)); }
  var TODAY = dayIso(0);
  var MONTH = TODAY.slice(0, 7);

  var doctor = { name: "Dr. " + F.person("yhc-doc").name, reg: "DMC/DR/00000 (demo)", fee: 500 };
  var persona = F.person("yhc-customer");

  var TIMES = ["10:00", "10:30", "11:00", "11:30", "12:00", "15:00", "15:30", "16:00", "16:30", "17:00"];
  var days = [];
  for (var d = 1; d <= 6; d++) {
    var di = dayIso(d), booked = {};
    TIMES.forEach(function (t, i) { if (F.int("yhc-sl" + di + t, 0, 4) === 0) booked[t] = true; });
    days.push({ date: di, booked: booked });
  }

  var STAGES = ["Stage 2", "Stage 3", "Stage 3A", "Stage 4", "Stage 4A", "Stage 5"];
  var PLANS = ["Starter 3-month", "Regrowth 6-month", "Maintenance", "Advanced 6-month"];
  var patients = [];
  for (var i = 0; i < 18; i++) {
    var p = F.person("yhc-p" + i);
    var st = F.pick("yhc-st" + i, STAGES);
    patients.push({ id: "PT-" + (1001 + i), name: p.name, phone: p.phone, age: F.int("yhc-age" + i, 22, 46), city: p.city, stage: st, density: F.int("yhc-den" + i, 38, 82),
      plan: F.pick("yhc-pl" + i, PLANS), since: dayIso(-F.int("yhc-sn" + i, 5, 160)), goal: F.pick("yhc-goal" + i, ["Stop receding hairline", "Thicker crown", "Reduce shedding", "Regrow temples"]), history: F.pick("yhc-his" + i, ["Paternal family history", "Stress and poor sleep", "Post-viral shedding", "No known cause", "Maternal family history"]) });
  }

  var events = [];
  for (var e = 0; e < 11; e++) {
    var off = e < 3 ? e : F.int("yhc-eo" + e, -9, 12);
    var pt = patients[e % patients.length];
    var tm = TIMES[F.int("yhc-et" + e, 0, TIMES.length - 1)];
    var dt = dayIso(off);
    if (dt.slice(0, 7) !== MONTH) dt = MONTH + "-" + pad(Math.min(28, 3 + e * 2));
    events.push({ id: "AP-" + (900 + e), title: tm + " " + pt.name, date: dt, tone: off < 0 ? "navy" : "orange", patient: pt.id, time: tm });
  }

  var followups = [];
  var FT = ["Day 7 check-in", "Day 14 side-effect check", "Month 1 photo review", "Refill reminder", "Month 3 density review", "Guarantee checkpoint"];
  for (var f = 0; f < 16; f++) {
    var fp = patients[f % patients.length];
    followups.push({ id: "FU-" + (3001 + f), patient: fp.name, type: F.pick("yhc-ft" + f, FT), due: dayIso(F.int("yhc-fd" + f, -3, 14)), channel: F.pick("yhc-fc" + f, ["WhatsApp", "Call", "Video"]), status: f % 5 === 0 ? "Overdue" : f % 3 === 0 ? "Done" : "Scheduled", owner: doctor.name });
  }

  var leads = [];
  var LCOL = ["new", "booked", "done", "plan", "bought", "lost"];
  for (var l = 0; l < 14; l++) {
    var lp = F.person("yhc-lead" + l);
    leads.push({ id: "YL-" + (601 + l), col: LCOL[l % 6 === 5 ? 5 : l % 5], title: lp.name, sub: F.pick("yhc-ls" + l, ["Scan funnel", "Instagram", "Google search", "Referral", "Shop visitor"]) + " · " + lp.phone,
      meta: F.pick("yhc-lm" + l, ["Stage 3 scan, asked about price", "Booked Saturday slot", "Wants plan for 6 months", "Compared with clinic quote", "Needs EMI"]), tags: [F.pick("yhc-lt" + l, ["Hot", "Warm", "Follow up"])] });
  }

  var products = [
    { id: "p1", name: "Minoxidil 5% Solution (60 ml)", cat: "Treatment", price: 799, mrp: 999, tags: ["Doctor approved"] },
    { id: "p2", name: "DHT-Defence Serum", cat: "Treatment", price: 1199, mrp: 1499, tags: ["Best seller"] },
    { id: "p3", name: "Biotin + Zinc Capsules (60)", cat: "Supplements", price: 649, mrp: 799, tags: [] },
    { id: "p4", name: "Marine Collagen Sachets (30)", cat: "Supplements", price: 1499, mrp: 1799, tags: [] },
    { id: "p5", name: "Ketoconazole 2% Anti-Dandruff Shampoo", cat: "Care", price: 449, mrp: 549, tags: ["Scalp"] },
    { id: "p6", name: "Scalp Nourish Shampoo", cat: "Care", price: 599, mrp: 699, tags: [] },
    { id: "p7", name: "Derma Roller 0.5 mm", cat: "Devices", price: 899, mrp: 1099, tags: ["Pairs with serum"] },
    { id: "p8", name: "Red Light Therapy Cap", cat: "Devices", price: 14999, mrp: 17999, tags: ["Premium"] },
    { id: "p9", name: "Starter Kit - 3 months", cat: "Kits", price: 3299, mrp: 4099, tags: ["Money-back guarantee"] },
    { id: "p10", name: "Regrowth Kit - 6 months", cat: "Kits", price: 5999, mrp: 7499, tags: ["Money-back guarantee", "Best value"] }
  ];

  var orders = [];
  for (var o = 0; o < 22; o++) {
    var op = patients[o % patients.length];
    var prod = products[o % products.length];
    orders.push({ id: "YO-" + (8001 + o), customer: op.name, item: prod.name, amount: prod.price, date: dayIso(-F.int("yhc-od" + o, 0, 40)), status: F.pick("yhc-os" + o, ["Delivered", "Shipped", "Packed", "Paid", "Delivered", "Delivered"]), pay: F.pick("yhc-op" + o, ["UPI", "Card", "EMI", "UPI"]) });
  }

  var guarantee = [];
  for (var g = 0; g < 16; g++) {
    var gp = patients[g];
    var day = F.int("yhc-gd" + g, 8, 170);
    var photos = Math.min(3, Math.floor(day / 45));
    var adh = F.int("yhc-ga" + g, 52, 99);
    guarantee.push({ id: "GR-" + (201 + g), patient: gp.name, plan: gp.plan, start: dayIso(-day), day: day, photos: photos + "/3", adherence: adh, status: adh < 65 ? "At risk" : day > 150 && adh > 85 ? "Claim review" : "On track" });
  }

  var audit = [];
  var ACT = ["Prescription signed", "Plan sent to patient", "Refund approved", "Catalog price changed", "Doctor slot opened", "Role changed: Sales", "Lead reassigned", "Order marked shipped"];
  for (var a = 0; a < 18; a++) {
    audit.push({ id: "AU-" + (500 + a), at: dayIso(-Math.floor(a / 3)) + " " + pad(9 + (a % 8)) + ":" + pad((a * 7) % 60), user: F.pick("yhc-au" + a, [doctor.name, "Sales desk", "Admin (demo)", "System"]), action: ACT[a % ACT.length], ref: "REF-" + (7000 + a * 13) });
  }

  var months = [], consultRev = [], shopRev = [], consults = [];
  for (var m = 5; m >= 0; m--) {
    var md = new Date(now.getFullYear(), now.getMonth() - m, 1);
    months.push(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][md.getMonth()]);
  }
  consults = F.series("yhc-cons", 6, 60, 190);
  consultRev = consults.map(function (c) { return c * 500; });
  shopRev = F.series("yhc-shop", 6, 90, 310).map(function (v) { return v * 1000; });

  var careSeq = [
    { id: "d0", label: "Day 0 - plan purchased: welcome message and how-to-apply video" },
    { id: "d10", label: "Day 10 - week-1 check-in: any irritation or questions?" },
    { id: "d20", label: "Day 20 - refill reminder with one-tap reorder link" },
    { id: "d28", label: "Day 28 - running low: refill confirmation (customer taps Yes)" },
    { id: "d30", label: "Day 30 - refill order created and dispatched" },
    { id: "d45", label: "Day 45 - progress photo request for the guarantee tracker" }
  ];

  AX.data.yhc = { today: TODAY, month: MONTH, doctor: doctor, persona: { name: persona.name, phone: persona.phone, email: persona.email }, days: days, times: TIMES, patients: patients, events: events, followups: followups,
    leads: leads, products: products, orders: orders, guarantee: guarantee, audit: audit, care: careSeq, revenue: { months: months, consults: consults, consultRev: consultRev, shopRev: shopRev } };
})(window);
