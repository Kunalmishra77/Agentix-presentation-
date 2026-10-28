/* Max Register demo dataset. Fully fictional members/leads; everything generated with AX.fake (seeded). */
(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.data = AX.data || {};
  var F = AX.fake;
  var DAY = 86400000;
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function isoOf(ms) { var d = new Date(ms); return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()); }
  function parse(s) { var p = s.split("-"); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }
  function addDays(s, n) { return isoOf(parse(s) + n * DAY); }
  var now = new Date();
  var TODAY = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
  var MD = TODAY.slice(5);

  var plans = [
    { id: "p1", name: "1 Month", months: 1, price: 1800, joining: 500 },
    { id: "p3", name: "3 Months", months: 3, price: 4800, joining: 0 },
    { id: "p6", name: "6 Months", months: 6, price: 8500, joining: 0 },
    { id: "p12", name: "12 Months", months: 12, price: 15000, joining: 0 }
  ];
  var MODES = ["Cash", "UPI", "Card"];
  var SLOTS = ["Morning", "Evening", "Both"];

  var members = [];
  for (var i = 0; i < 36; i++) {
    var p = F.person("mx-m" + i);
    var months = F.pick("mx-pl" + i, [1, 1, 3, 3, 6, 12]);
    var left;
    if (i === 0) left = 12; else if (i === 1) left = 5; else if (i === 2) left = 10; else if (i === 6) left = -5;
    else if (i % 6 === 0) left = -F.int("mx-ex" + i, 1, 25);
    else if (i % 6 === 1) left = F.int("mx-du" + i, 0, 7);
    else left = F.int("mx-ok" + i, 8, Math.max(9, months * 30));
    var paidTill = addDays(TODAY, left);
    var joined = addDays(TODAY, -F.int("mx-j" + i, 40, 520));
    var att = [];
    for (var d = 0; d < 30; d++) if (left >= -3 && F.int("mx-a" + i + "-" + d, 0, 9) < 6) att.push(d);
    if (i === 0 || i === 2) { if (att.indexOf(0) < 0) att.unshift(0); }
    if (left < 0) att = att.filter(function (x) { return x > -left; });
    var plan = months === 1 ? plans[0] : months === 3 ? plans[1] : months === 6 ? plans[2] : plans[3];
    var pays = [], pd = addDays(paidTill, -months * 30);
    for (var k = 0; k < 3; k++) {
      pays.push({ date: addDays(pd, -k * months * 30), amount: plan.price, mode: F.pick("mx-pm" + i + k, MODES), receipt: "MF/2025-26/" + ("000000" + (10 + i * 3 + (3 - k))).slice(-6), plan: plan.name });
    }
    var dob = (i === 3 || i === 9) ? (1990 + i) + "-" + MD : (1984 + F.int("mx-dob" + i, 0, 20)) + "-" + pad(F.int("mx-dm" + i, 1, 12)) + "-" + pad(F.int("mx-dd" + i, 1, 28));
    if (i !== 3 && i !== 9 && dob.slice(5) === MD) dob = dob.slice(0, 5) + "01-02";
    members.push({ id: "MF-" + (1001 + i), name: p.name, phone: p.phone, gender: i % 3 === 1 ? "F" : "M", dob: dob, months: months, plan: plan.name, price: plan.price, paidTill: paidTill, joined: joined,
      slot: F.pick("mx-sl" + i, SLOTS), att: att, pays: pays, diet: F.pick("mx-dt" + i, ["Veg", "Non-veg", "Egg", "Veg"]), goal: F.pick("mx-g" + i, ["Weight loss", "Muscle gain", "Stamina", "General fitness"]), kg: F.int("mx-kg" + i, 52, 96) });
  }

  var STAGES = ["new", "called", "trial", "joined", "lost"];
  var leads = [];
  for (var li = 0; li < 16; li++) {
    var lp = F.person("mx-l" + li);
    leads.push({ id: "L-" + (501 + li), col: li < 5 ? "new" : li < 9 ? "called" : li < 12 ? "trial" : li < 14 ? "joined" : "lost", title: lp.name, sub: F.pick("mx-ls" + li, ["Walk-in", "Instagram", "Reference", "Justdial", "WhatsApp ad"]) + " · " + lp.phone,
      meta: F.pick("mx-li" + li, ["Wants 3 months", "Asked about weight loss", "Evening slot", "Wants 12 months, discount?", "Trial booked", "Ladies batch"]), tags: [F.pick("mx-lt" + li, ["1 Month", "3 Months", "6 Months"])] });
  }

  var verify = [];
  for (var vi = 0; vi < 5; vi++) {
    var vp = F.person("mx-v" + vi);
    verify.push({ id: "V-" + (71 + vi), name: vp.name, phone: vp.phone, plan: plans[1 + (vi % 3)].name, declared: addDays(TODAY, -F.int("mx-vd" + vi, 5, 60)), via: "QR sign-up" });
  }

  var messages = [];
  var TPL = ["Fee reminder - 7 days", "Fee reminder - last 3 days", "Fee expired", "Receipt", "Birthday wish", "Welcome"];
  for (var mi = 0; mi < 26; mi++) {
    var mm = members[(mi * 5) % members.length];
    messages.push({ id: "msg-" + (900 - mi), to: mm.name, phone: mm.phone, template: TPL[mi % TPL.length], at: addDays(TODAY, -Math.floor(mi / 3)) + " " + pad(9 + (mi * 3) % 11) + ":" + pad((mi * 17) % 60),
      status: ["Read", "Delivered", "Read", "Sent", "Failed"][mi % 5] });
  }

  var audit = [];
  var ACT = ["Member added", "Fee collected", "Receipt sent", "Attendance marked", "Selfie approved", "Plan changed", "Reminder sent", "Lead moved"];
  for (var ai = 0; ai < 24; ai++) {
    audit.push({ id: "au-" + (400 - ai), at: addDays(TODAY, -Math.floor(ai / 4)) + " " + pad(7 + (ai * 5) % 14) + ":" + pad((ai * 11) % 60), user: ["Owner", "Reception - Pooja", "Reception - Vikram"][ai % 3], action: ACT[ai % ACT.length], ref: members[(ai * 7) % members.length].id });
  }

  var gallery = [
    ["New cardio zone", "#D7261E", "#7a1411"], ["Zumba morning batch", "#E8833A", "#a24a12"], ["Free-weights floor", "#2B2B2B", "#555"], ["Transformation: 12 weeks", "#1F6B6B", "#0e3d3d"],
    ["Diwali challenge winners", "#B8873A", "#6b4f1d"], ["Yoga Sunday", "#5B7DB1", "#2a3f63"], ["Ladies batch opening", "#C2457A", "#6e1f45"], ["Powerlifting meet", "#3B3B98", "#1b1b55"]
  ].map(function (g, i) { return { id: "g" + i, cap: g[0], c1: g[1], c2: g[2] }; });

  var announcements = [
    { id: "a1", title: "Gym closed on Diwali", body: "Max Fitness will remain closed on Diwali day. Regular timings resume next morning.", aud: "All members", at: addDays(TODAY, -2) },
    { id: "a2", title: "New Zumba batch 7 AM", body: "Zumba with Coach Neha starts Monday, 7 AM. Free for 6 and 12 month members.", aud: "Morning slot", at: addDays(TODAY, -6) },
    { id: "a3", title: "Fee reminder: pay before month end", body: "Pay renewals before the 30th and get a free protein shake.", aud: "Fees due", at: addDays(TODAY, -11) }
  ];

  AX.data["max-register"] = { today: TODAY, plans: plans, members: members, leads: leads, stages: STAGES, verify: verify, messages: messages, audit: audit, gallery: gallery, announcements: announcements, modes: MODES };
})(window);
