/* Woodpecker PMS demo dataset. Fully fictional; every person comes from AX.fake (seeded). */
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

  var PROPS = [
    { id: "HK", name: "Woodpecker Residency Hauz Khas", short: "Hauz Khas", city: "New Delhi", mult: 1.0, gstin: "07AAAFW1001A1ZX" },
    { id: "GG", name: "Woodpecker Suites Gurgaon", short: "Gurgaon", city: "Gurugram", mult: 1.15, gstin: "06AAAFW1002B1ZY" },
    { id: "ND", name: "Woodpecker Stays Noida", short: "Noida", city: "Noida", mult: 0.9, gstin: "09AAAFW1003C1ZZ" }
  ];
  var TYPES = [{ t: "Studio", base: 3600, n: 4 }, { t: "1 BHK", base: 5400, n: 4 }, { t: "2 BHK", base: 7500, n: 2 }, { t: "Penthouse", base: 9800, n: 2 }];

  var units = [];
  PROPS.forEach(function (p) {
    TYPES.forEach(function (ty, ti) {
      for (var i = 0; i < ty.n; i++) {
        var num = (ti + 1) * 100 + i + 1;
        units.push({ id: p.id + "-" + num, label: num + " · " + ty.t, group: p.name, prop: p.id, type: ty.t, tariff: Math.round(ty.base * p.mult / 50) * 50 });
      }
    });
  });

  var SOURCES = ["Direct", "Booking.com", "MakeMyTrip", "Airbnb", "Agoda", "Corporate", "Walk-in"];
  var bookings = [], n = 0;
  function person(seed) { return F.person(seed); }
  function add(unit, start, nights, status, src, seed) {
    var p = person(seed);
    n++;
    bookings.push({ id: "WP-" + (10000 + n), unit: unit.id, prop: unit.prop, guest: p.name, phone: p.phone, email: p.email, city: p.city,
      start: start, nights: nights, status: status, source: src, tariff: unit.tariff, adults: 1 + F.int(seed + "a", 0, 2) });
  }
  function statusFor(start, nights) {
    var end = addDays(start, nights);
    if (end <= TODAY) return "checked-out";
    if (start <= TODAY) return "checked-in";
    return "confirmed";
  }
  units.forEach(function (u, ui) {
    if (u.id === "HK-101") {
      add(u, addDays(TODAY, -3), 3, "checked-in", "Direct", "wp-hk101-c");
      add(u, addDays(TODAY, 1), 2, "confirmed", "Booking.com", "wp-hk101-a");
      add(u, addDays(TODAY, 4), 3, "confirmed", "MakeMyTrip", "wp-hk101-b");
      return;
    }
    var cursor = addDays(TODAY, -F.int("wp-c" + ui, 0, 5));
    var k = 0;
    while (parse(cursor) < parse(addDays(TODAY, 18)) && k < 6) {
      var nights = F.int("wp-n" + ui + "-" + k, 1, 6);
      var st = statusFor(cursor, nights);
      if (st === "confirmed" && F.int("wp-h" + ui + "-" + k, 0, 9) === 0) st = "hold";
      add(u, cursor, nights, st, F.pick("wp-s" + ui + "-" + k, SOURCES), "wp-g" + ui + "-" + k);
      cursor = addDays(cursor, nights + F.int("wp-gap" + ui + "-" + k, 0, 3));
      k++;
    }
  });

  var guests = [];
  var seen = {};
  bookings.forEach(function (b, i) {
    if (seen[b.guest]) return; seen[b.guest] = 1;
    var stays = F.int("wp-st" + i, 1, 9);
    guests.push({ id: "G-" + (2000 + guests.length), name: b.guest, phone: b.phone, email: b.email, city: b.city, stays: stays,
      spend: stays * F.int("wp-sp" + i, 6000, 22000), tier: stays >= 6 ? "Gold" : stays >= 3 ? "Silver" : "Member", last: b.start, source: b.source });
  });

  var HK_STATES = ["dirty", "progress", "clean", "inspected"];
  var HK_STAFF = ["Sunita", "Ramesh", "Geeta", "Pappu", "Lata", "Mohan"];
  var housekeeping = [];
  units.filter(function (u, i) { return i % 3 !== 2; }).forEach(function (u, i) {
    housekeeping.push({ id: "hk-" + u.id, col: F.pick("wp-hk" + i, HK_STATES), title: u.id.replace("-", " "), sub: u.type + " · " + u.group.replace("Woodpecker ", ""),
      meta: "Assigned: " + F.pick("wp-hks" + i, HK_STAFF), tags: [F.pick("wp-hkt" + i, ["Checkout clean", "Stay-over", "Deep clean", "Turn-down"])], unit: u.id });
  });

  var MT = ["AC not cooling", "Geyser tripping", "Bathroom tap leak", "TV remote missing", "Wi-Fi router reset", "Balcony door latch", "Chimney exhaust noise", "Induction cooktop fault", "Ceiling fan wobble", "Water purifier filter", "Lift sensor alarm", "Wardrobe hinge"];
  var maintenance = MT.map(function (t, i) {
    var u = units[(i * 3) % units.length];
    return { id: "mt-" + (i + 1), col: ["open", "assigned", "progress", "resolved"][i % 4], title: t, sub: u.id + " · " + u.group.replace("Woodpecker ", ""),
      meta: F.pick("wp-mt" + i, ["Plumber · Ravi", "Electrician · Imran", "AC tech · Sanjay", "Carpenter · Bholu", "IT vendor"]), tags: [F.pick("wp-mp" + i, ["Low", "Medium", "High"])] };
  });

  var menu = [
    { id: "m1", name: "Masala Chai", price: 60 }, { id: "m2", name: "Veg Club Sandwich", price: 220 }, { id: "m3", name: "Paneer Butter Masala + 2 Roti", price: 340 },
    { id: "m4", name: "Chicken Biryani", price: 380 }, { id: "m5", name: "Dal Makhani + Rice", price: 290 }, { id: "m6", name: "Cold Coffee", price: 150 },
    { id: "m7", name: "Aloo Paratha Breakfast", price: 180 }, { id: "m8", name: "Fresh Lime Soda", price: 90 }, { id: "m9", name: "Laundry (per piece)", price: 70 },
    { id: "m10", name: "Mini Bar: Water + Snacks", price: 250 }
  ];
  var posTickets = [
    { id: "kot-501", col: "new", title: "KOT #501 · HK-102", sub: "Paneer Butter Masala x1, Roti x2", meta: "Placed 12:40", tags: ["Room service"] },
    { id: "kot-502", col: "new", title: "KOT #502 · GG-203", sub: "Veg Club Sandwich x2, Cold Coffee x2", meta: "Placed 12:44", tags: ["Room service"] },
    { id: "kot-503", col: "preparing", title: "KOT #503 · ND-104", sub: "Chicken Biryani x2", meta: "Placed 12:31", tags: ["Room service"] },
    { id: "kot-504", col: "preparing", title: "KOT #504 · Cafe Table 3", sub: "Masala Chai x3, Aloo Paratha x3", meta: "Placed 12:35", tags: ["Dine-in"] },
    { id: "kot-505", col: "ready", title: "KOT #505 · HK-204", sub: "Dal Makhani + Rice x1", meta: "Ready 12:28", tags: ["Room service"] },
    { id: "kot-506", col: "served", title: "KOT #506 · GG-301", sub: "Fresh Lime Soda x2", meta: "Served 12:10", tags: ["Room service"] }
  ];

  var inv = [["Bath towels", "Linen", 140, 120, "pcs"], ["Bed sheets (queen)", "Linen", 96, 100, "pcs"], ["Pillow covers", "Linen", 180, 150, "pcs"], ["Shampoo sachets", "Amenities", 420, 500, "pcs"],
    ["Bath soap", "Amenities", 610, 500, "pcs"], ["Toilet rolls", "Consumables", 88, 120, "rolls"], ["Mineral water 500ml", "Mini bar", 260, 240, "btl"], ["Coffee capsules", "Pantry", 70, 100, "pcs"],
    ["Tea bags", "Pantry", 520, 300, "pcs"], ["Floor cleaner 5L", "Housekeeping", 14, 10, "can"], ["Glass cleaner", "Housekeeping", 9, 12, "btl"], ["Garbage bags L", "Housekeeping", 300, 200, "pcs"],
    ["LED bulbs 9W", "Maintenance", 26, 30, "pcs"], ["AC filters", "Maintenance", 12, 12, "pcs"], ["Slippers", "Amenities", 210, 200, "pairs"], ["Room freshener", "Housekeeping", 18, 20, "btl"],
    ["Hand wash refill", "Amenities", 34, 30, "btl"], ["Kitchen oil 15L", "Kitchen", 3, 4, "tin"]].map(function (r, i) {
    return { id: "INV-" + (300 + i), item: r[0], cat: r[1], stock: r[2], par: r[3], unit: r[4], status: r[2] < r[3] * 0.8 ? "Reorder" : r[2] < r[3] ? "Low" : "OK",
      vendor: F.pick("wp-v" + i, ["Shree Linen Co.", "Metro Hospitality Supplies", "FreshKart B2B", "Delhi Housekeeping Mart"]), property: F.pick("wp-ip" + i, ["All properties", "Hauz Khas", "Gurgaon", "Noida"]) };
  });

  var laundry = [];
  for (var li = 0; li < 14; li++) {
    var items = F.int("wp-l" + li, 18, 90), sentOff = F.int("wp-ls" + li, 0, 5);
    laundry.push({ id: "LDY-" + (700 + li), property: PROPS[li % 3].short, vendor: F.pick("wp-lv" + li, ["Clean Cart Laundry", "Whitewash Dhobi Co.", "In-house"]), items: items,
      kind: F.pick("wp-lk" + li, ["Bed linen", "Towels", "Curtains", "Uniforms", "Mixed"]), sent: addDays(TODAY, -sentOff), due: addDays(TODAY, 2 - sentOff + 1),
      status: sentOff === 0 ? "Sent" : sentOff < 3 ? "Washing" : "Returned", cost: items * 18 });
  }

  var channels = [];
  var OTAS = [["Booking.com", 1], ["MakeMyTrip", 1], ["Goibibo", 1], ["Airbnb", 1], ["Agoda", 1], ["Expedia", 0]];
  PROPS.forEach(function (p, pi) {
    OTAS.forEach(function (o, oi) {
      var st = (pi + oi) % 7 === 3 ? "Error" : (pi + oi) % 5 === 2 ? "Delayed" : "In sync";
      channels.push({ id: "ch-" + pi + oi, ota: o[0], property: p.short, rooms: 12 - ((pi + oi) % 3), status: st, last: st === "In sync" ? (2 + oi) + " min ago" : st === "Delayed" ? "41 min ago" : "3 h ago",
        res7: F.int("wp-c7" + pi + oi, 2, 19), commission: o[0] === "Airbnb" ? "3%" : o[0] === "Booking.com" ? "15%" : "18%" , note: st === "Error" ? "Rate plan mapping missing for Penthouse" : "" });
    });
  });

  var DEPTS = ["Front desk", "Housekeeping", "Kitchen", "Maintenance", "Security", "Management"];
  var payroll = [];
  for (var pi2 = 0; pi2 < 18; pi2++) {
    var pr = F.person("wp-staff" + pi2), dept = DEPTS[pi2 % DEPTS.length], gross = F.int("wp-pay" + pi2, 14, 52) * 1000, present = F.int("wp-pd" + pi2, 22, 30);
    var earned = Math.round(gross * present / 30);
    var ded = Math.round(earned * 0.12);
    payroll.push({ id: "EMP-" + (100 + pi2), name: pr.name, dept: dept, property: PROPS[pi2 % 3].short, present: present, gross: earned, deductions: ded, net: earned - ded, status: pi2 % 4 === 0 ? "Paid" : "Pending" });
  }

  var invoices = [];
  for (var ii = 0; ii < 16; ii++) {
    var tar = [3600, 4800, 5400, 7500, 8625, 9800, 6750, 11270][ii % 8], nts = F.int("wp-in" + ii, 1, 5), taxable = tar * nts;
    var rate = tar <= 7500 ? 0.12 : 0.18, tax = Math.round(taxable * rate);
    invoices.push({ id: "inv-" + ii, no: "WP/2026-27/" + (1040 + ii), date: addDays(TODAY, -ii * 2), guest: F.person("wp-iv" + ii).name, property: PROPS[ii % 3].short,
      taxable: taxable, rate: rate, cgst: tax / 2, sgst: tax / 2, total: taxable + tax, gstin: ii % 3 === 0 ? "07AABCX" + (1000 + ii) + "Q1Z" + (ii % 9) : "Unregistered" });
  }

  var audit = [];
  var ACTS = [["Booking created", "Reservation"], ["Check-in completed", "Reservation"], ["Folio charge added", "Folio"], ["Invoice generated", "Invoice"], ["Rate plan changed", "Pricing"], ["Room status changed", "Housekeeping"],
    ["Payment recorded", "Folio"], ["Channel sync triggered", "Channel"], ["Night audit run", "System"], ["User role updated", "User"], ["Booking extended", "Reservation"], ["Refund approved", "Payment"]];
  var ROLES = ["Front Desk", "Manager", "Accountant", "Housekeeping Lead", "Owner", "System"];
  for (var ai = 0; ai < 26; ai++) {
    var ac = ACTS[ai % ACTS.length];
    audit.push({ id: "aud-" + (900 - ai), at: addDays(TODAY, -Math.floor(ai / 5)) + " " + pad(8 + (ai * 7) % 14) + ":" + pad((ai * 13) % 60), user: F.person("wp-au" + (ai % 7)).name, role: ROLES[ai % 6],
      action: ac[0], entity: ac[1], ref: "WP-" + (10001 + ai), ip: "10.0." + (ai % 4) + ".xx" });
  }

  var threads = [
    { id: "t1", name: "Aarav Sharma", channel: "whatsapp", preview: "Early check-in possible tomorrow?", messages: [{ from: "user", text: "Hi, I'm arriving tomorrow at 9 AM. Early check-in possible?", at: "10:02" }] },
    { id: "t2", name: "Ananya Iyer", channel: "web", preview: "Need extra towels and a baby cot", messages: [{ from: "user", text: "Please send extra towels and a baby cot to room GG-203.", at: "11:15" }] },
    { id: "t3", name: "Rohan Khanna", channel: "whatsapp", preview: "Invoice with company GSTIN", messages: [{ from: "user", text: "Can you issue the invoice in my company name with GSTIN?", at: "09:40" }] },
    { id: "t4", name: "Meera Nair", channel: "instagram", preview: "Do you allow pets?", messages: [{ from: "user", text: "Do the Noida apartments allow small pets?", at: "08:22" }] }
  ];
  var scripts = {
    t1: [{ from: "ai", text: "Good morning Mr. Sharma! 1 BHK 104 will be ready by 10:30 AM. Early check-in from 10:30 is complimentary; 9 AM would be a Rs 1,500 half-day charge.", chips: ["10:30 works", "Need 9 AM"] },
      { from: "agent", text: "Done - I've noted early check-in at 10:30 on your reservation. See you tomorrow!", event: "noted" }],
    t2: [{ from: "ai", text: "On it! Housekeeping will bring 4 towels and a baby cot to GG-203 within 15 minutes. A request has been logged.", event: "request" }],
    t3: [{ from: "ai", text: "Certainly. Please share the company name and 15-character GSTIN. We'll issue the tax invoice with CGST/SGST at check-out.", chips: ["Share GSTIN"] }],
    t4: [{ from: "ai", text: "Yes, Woodpecker Stays Noida is pet-friendly for pets under 10 kg (Rs 500/night cleaning fee). Shall I block a ground-floor unit?" }]
  };

  var series = F.series("wp-occ", 14, 52, 94);
  AX.data["woodpecker-pms"] = {
    today: TODAY, props: PROPS, units: units, bookings: bookings, guests: guests, housekeeping: housekeeping, maintenance: maintenance, menu: menu,
    posTickets: posTickets, inventory: inv, laundry: laundry, channels: channels, payroll: payroll, invoices: invoices, audit: audit, threads: threads, scripts: scripts,
    occSeries: series, revSeries: F.series("wp-rev", 14, 180, 420), sources: SOURCES
  };
})(window);
