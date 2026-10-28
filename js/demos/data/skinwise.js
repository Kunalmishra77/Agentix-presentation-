/* Skinwise demo dataset. Fully fictional customers, orders and consultations; generated with AX.fake (seeded).
   The product catalogue and rules live in js/demos/skinwise.js (AX.skinwise.products) so the recommend() rules can be unit tested. */
(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.data = AX.data || {};
  var F = AX.fake;
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  var now = new Date(), DAY = 86400000;
  function dayIso(o) { var d = new Date(now.getTime() + o * DAY); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }

  var PRICE = { "Anti-Acne Cleanser": 449, "Gentle Hydrating Cleanser": 349, "Depigmentation Cleanser": 499, "Acne Gel": 599, "Azelaic Acid 10% Gel": 699, "Night Retinol Serum": 899, "Skin Lightening Gel": 749, "Eye-Lyte Cream": 649, "Hyaluronic Hydrating Serum": 799, "Barrier Repair Moisturiser": 549, "Oil-Free Gel Moisturiser": 449, "Daily Sunscreen SPF 50": 599 };
  var NAMES = Object.keys(PRICE);
  var CONCERNS = ["Acne", "Pigmentation", "Dark circles", "Dryness", "Ageing", "Dullness"];
  var SOURCES = ["Quiz", "Photo scan", "Dr. Vivek chat", "Consultation form", "Instagram"];

  var leads = [];
  for (var i = 0; i < 22; i++) {
    var p = F.person("sw-l" + i);
    leads.push({ id: "SL-" + (3001 + i), name: p.name, phone: p.phone, email: p.email, concern: F.pick("sw-lc" + i, CONCERNS), source: F.pick("sw-ls" + i, SOURCES), skin: F.pick("sw-sk" + i, ["Oily", "Dry", "Combination", "Normal"]),
      pregnant: i % 9 === 4 ? "Yes" : "No", date: dayIso(-F.int("sw-ld" + i, 0, 25)), status: F.pick("sw-lst" + i, ["New", "Contacted", "Booked", "Converted", "New"]) });
  }

  var orders = [];
  for (var o = 0; o < 20; o++) {
    var op = F.person("sw-o" + o);
    var a = NAMES[F.int("sw-oa" + o, 0, 11)], b = NAMES[F.int("sw-ob" + o, 0, 11)];
    var items = a === b ? [a] : [a, b];
    var total = items.reduce(function (s, n) { return s + PRICE[n]; }, 0);
    total = Math.round(total * 1.18) + (total >= 799 ? 0 : 49);
    orders.push({ id: "SO-" + (7001 + o), customer: op.name, phone: op.phone, items: items.join(", "), count: items.length, total: total, date: dayIso(-F.int("sw-od" + o, 0, 30)), pay: F.pick("sw-op" + o, ["UPI", "Card", "COD", "UPI"]), status: F.pick("sw-os" + o, ["Delivered", "Shipped", "Packed", "Paid", "Delivered"]), city: op.city });
  }

  var consults = [];
  for (var c = 0; c < 16; c++) {
    var cp = F.person("sw-c" + c);
    consults.push({ id: "SC-" + (5001 + c), name: cp.name, phone: cp.phone, concern: F.pick("sw-cc" + c, CONCERNS), mode: F.pick("sw-cm" + c, ["Video call", "Phone call"]), date: dayIso(F.int("sw-cd" + c, -6, 8)), slot: F.pick("sw-cs" + c, ["10:00", "11:30", "15:00", "17:30"]), pregnant: c % 8 === 3 ? "Yes" : "No",
      status: F.pick("sw-cst" + c, ["Requested", "Confirmed", "Completed", "Confirmed"]), note: F.pick("sw-cn" + c, ["Breakouts around chin", "Dark spots after sun", "Dry flaky cheeks", "Uneven tone", "Tired-looking eyes"]) });
  }

  AX.data.skinwise = { today: dayIso(0), leads: leads, orders: orders, consults: consults, concerns: CONCERNS, price: PRICE };
})(window);
