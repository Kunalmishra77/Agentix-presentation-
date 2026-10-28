(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.data = AX.data || {};
  var F = AX.fake;

  /* Fictional dataset. Series and finish names mirror the product; every customer, dealer and person is invented. */
  var TODAY = "2026-10-28";
  function day(n) { return new Date(Date.UTC(2026, 9, 28 + n)).toISOString().slice(0, 10); }
  function nm(seed) { return F.person("eb-p-" + seed); }
  function int(seed, a, b) { return F.int("eb-" + seed, a, b); }

  var finishes = [
    { code: "CP", label: "Chrome", swatch: "#C8CCCE" }, { code: "MB", label: "Matte Black", swatch: "#1C1C1C" },
    { code: "BN", label: "Brushed Nickel", swatch: "#8C8477" }, { code: "ANT", label: "Antique Bronze", swatch: "#6B4A2E" },
    { code: "RG", label: "Rose Gold", swatch: "#B76E79" }
  ];
  var series = [
    { id: "pure", name: "Pure", positioning: "Minimal, understated modern luxury." }, { id: "georgian", name: "Georgian", positioning: "Classic, traditional elegance." },
    { id: "studio", name: "Studio", positioning: "Refined simplicity for considered interiors." }, { id: "ivy", name: "Ivy", positioning: "Millennial, urban energy." },
    { id: "sigma", name: "Sigma", positioning: "Classic-contemporary balance." }, { id: "ronda", name: "Ronda", positioning: "Modern curves, soft geometry." },
    { id: "aztech", name: "Aztech", positioning: "West-meets-East minimalist." }, { id: "neo", name: "Neo", positioning: "Sharp lines for the next generation bath." }
  ];
  var TYPES = [["Single Lever Basin Mixer", "Taps & Mixers", 6400], ["Wall Mixer with Diverter", "Taps & Mixers", 9800], ["Pillar Cock", "Taps & Mixers", 3200],
    ["Overhead Shower 200mm", "Showers", 8800], ["Hand Shower Set", "Showers", 3900], ["Towel Rail", "Accessories", 2400]];

  var products = [], inventory = [];
  series.forEach(function (s, si) {
    TYPES.forEach(function (t, ti) {
      var i = products.length, price = Math.round(t[2] * (1 + si * 0.08) / 50) * 50;
      var fin = finishes.filter(function (f, k) { return (k + si + ti) % 5 < 3; }).map(function (f) { return f.label; });
      var id = "P" + ("0" + (i + 1)).slice(-2);
      var p = { id: id, sku: s.name.slice(0, 3).toUpperCase() + " " + (1001 + si * 100 + ti * 7), name: s.name + " " + t[0], series: s.name, cat: t[1], price: price, dealerPrice: Math.round(price * 0.72 / 10) * 10, variants: fin, tags: [s.name] };
      products.push(p);
      var reorder = int("ro" + i, 15, 45);
      var stock = i % 13 === 5 ? 0 : i % 4 === 0 ? int("st" + i, 2, reorder - 1) : int("st" + i, reorder + 10, 220);
      inventory.push({ id: id, sku: p.sku, name: p.name, series: s.name, warehouse: ["Delhi HQ", "Mumbai DC", "Bengaluru DC", "Kolkata DC"][i % 4], onHand: stock, reserved: Math.min(stock, int("rs" + i, 0, 12)), reorder: reorder,
        level: stock === 0 ? "Out of stock" : stock <= reorder ? "Low stock" : "In stock" });
    });
  });

  var CUST = [["Hotel Aranya Grand", "Hotel"], ["Sarovar Heights", "Hotel"], ["Lotus Bay Resorts", "Hotel"], ["Kailash Towers Hospitality", "Hotel"], ["Meridian Court Suites", "Hotel"],
    ["Silverleaf Hospital", "Hospital"], ["CityCare Medical Centre", "Hospital"], ["Orchid Heart Institute", "Hospital"], ["Shreeji Builders", "Builder"], ["Dhruv Constructions", "Builder"],
    ["Anand Infra Projects", "Builder"], ["Studio Anvay Architects", "Architect"], ["Kalpana Design Studio", "Architect"], ["Palmgrove Residency", "Residential"], ["Skyline Metro Offices", "Commercial"],
    ["Verdant Valley Villas", "Residential"], ["Harmony Bay Apartments", "Residential"], ["Crescent Mall Management", "Commercial"], ["Nilgiri Homestays", "Hotel"], ["Ashoka Educational Trust", "Institution"]];
  var customers = CUST.map(function (c, i) {
    var p = nm(100 + i);
    return { id: "CU-" + (3001 + i), name: c[0], type: c[1], contact: p.name, email: p.email, phone: p.phone, city: p.city, gst: "07XXXXX" + ("0000" + (i * 37 % 10000)).slice(-4) + "X1Z5", since: 2019 + i % 7 };
  });

  var DEAL = ["Gupta Sanitary Mart", "Bansal Bath Studio", "Reddy Tiles & Taps", "Chauhan Hardware", "Mehta Sanitaryware", "Nair Building Supplies", "Kapoor Bath Gallery", "Iyer Fittings Hub",
    "Joshi Traders", "Malhotra Sanitary House", "Sethi Plumbing Centre", "Saxena Bath & Kitchen"];
  var dealers = DEAL.map(function (n, i) {
    var p = nm(140 + i), tier = ["Gold", "Silver", "Bronze"][i % 3];
    return { id: "DL-" + (501 + i), name: n, owner: p.name, city: p.city, phone: p.phone, email: p.email, tier: tier, creditLimit: [1500000, 1000000, 600000][i % 3], outstanding: int("out" + i, 4, 60) * 10000, ytd: int("ytd" + i, 12, 90) * 100000 };
  });
  var schemes = [
    { id: "SC-1", name: "Festive Slab", detail: "Extra 3% off on purchases above 5 lakh in October-November.", target: 500000 },
    { id: "SC-2", name: "Series Launch Bonus", detail: "Free display unit on first order of 25 pieces of the Neo series.", target: 25 },
    { id: "SC-3", name: "Quarterly Loyalty", detail: "1.5% credit note on quarterly purchases above 12 lakh.", target: 1200000 }
  ];

  var statuses = ["Confirmed", "In Production", "Dispatched", "Delivered"];
  var orders = [];
  for (var i = 0; i < 18; i++) {
    var c = customers[(i * 3) % customers.length], a = products[(i * 5) % products.length], b = products[(i * 7 + 2) % products.length];
    var qa = int("oqa" + i, 2, 8), qb = int("oqb" + i, 1, 6), sub = a.price * qa + b.price * qb, tot = sub + Math.round(sub * 0.18);
    orders.push({ id: "ORD-2026-" + (1001 + i), customer: c.name, dealerId: i % 3 === 0 ? dealers[i % dealers.length].id : null, date: day(-(60 - i * 3)), items: qa + qb, amount: tot,
      status: statuses[Math.min(3, Math.floor(i / 5))], payment: ["Paid", "Partially Paid", "Unpaid"][i % 3],
      lines: [{ name: a.name, qty: qa, amount: a.price * qa }, { name: b.name, qty: qb, amount: b.price * qb }] });
  }
  /* dealer orders: make sure the first dealers all have a few */
  orders.forEach(function (o, k) { if (!o.dealerId) o.dealerId = dealers[(k * 5 + 1) % 4].id; });

  var qStatus = ["Draft", "Sent", "Approved", "Converted", "Rejected"];
  var quotations = [];
  for (var q = 0; q < 10; q++) {
    var cu = customers[(q * 2 + 1) % customers.length], pr = products[(q * 4 + 3) % products.length], qq = int("qq" + q, 4, 20), s2 = pr.price * qq;
    quotations.push({ id: "QT-2026-" + (101 + q), customer: cu.name, product: pr.name, qty: qq, amount: s2 + Math.round(s2 * 0.18), status: qStatus[q % 5], date: day(-(40 - q * 3)) });
  }

  var L_STAGES = [{ id: "new", label: "New" }, { id: "contacted", label: "Contacted" }, { id: "quoted", label: "Quotation sent" }, { id: "negotiation", label: "Negotiation" }, { id: "won", label: "Won", tone: "good" }];
  var L_NAMES = ["Rivera Court Hotel", "Tara Hospital Wing", "Evergreen Towers Phase 2", "Studio Ishani", "Maple Crest Residency", "Zenith Business Park", "Coral Reef Resort", "Aarav Interiors", "Sunrise Care Clinic",
    "Pinnacle Heights", "Jade Garden Suites", "Bluebell Apartments", "Kiran Architects", "Harbour View Hotel", "Lakeside Villas", "Oakwood Hospital", "Summit Offices"];
  var leads = L_NAMES.map(function (n, i) {
    var p = nm(200 + i);
    return { id: "LD-" + (4001 + i), col: L_STAGES[i % 5].id, company: n, contact: p.name, city: p.city, source: ["Dealer referral", "Website", "Exhibition", "Architect", "Walk-in"][i % 5], value: int("lv" + i, 3, 40) * 50000, owner: "" };
  });

  var TECH_NAMES = [nm(300).name, nm(301).name, nm(302).name, nm(303).name, nm(304).name];
  var ISSUES = ["Cartridge leaking after 8 months", "Overhead shower low pressure", "Finish peeling on spout", "Diverter stuck between modes", "Handle loose on basin mixer", "Pillar cock dripping",
    "Towel rail bracket loose", "Hand shower hose cracked", "Water hammer on angle valve", "Matte finish discoloured", "Aerator clogged", "Wall flange gap after install"];
  var tickets = ISSUES.map(function (is, i) {
    var st = ["open", "open", "open", "assigned", "progress", "resolved"][i % 6];
    return { id: "TKT-" + (7001 + i), col: st, title: is, customer: customers[(i * 4 + 2) % customers.length].name, product: products[(i * 9) % products.length].name, priority: ["High", "Medium", "Low"][i % 3], tech: st === "open" ? "" : TECH_NAMES[i % 5], raised: day(-(i + 1)) };
  });

  var ROLES = ["Administrator", "Sales Manager", "Sales Executive", "Dealer Manager", "Inventory Manager", "Service Technician", "Accountant", "Viewer"];
  var DEPT = { Administrator: "Management", "Sales Manager": "Sales", "Sales Executive": "Sales", "Dealer Manager": "Dealers", "Inventory Manager": "Warehouse", "Service Technician": "Service", Accountant: "Finance", Viewer: "Support" };
  var emp = [];
  var ROLE_FOR = ["Administrator", "Sales Manager", "Sales Executive", "Sales Executive", "Dealer Manager", "Inventory Manager", "Service Technician", "Service Technician", "Service Technician", "Service Technician", "Service Technician", "Accountant", "Viewer", "Sales Executive"];
  ROLE_FOR.forEach(function (r, i) {
    var p = nm(400 + i);
    emp.push({ id: "EMP-" + (2001 + i), name: i >= 6 && i <= 10 ? TECH_NAMES[i - 6] : p.name, role: r, dept: DEPT[r], city: p.city, email: p.email, phone: p.phone, status: i === 12 ? "On leave" : "Active", joined: 2018 + (i % 8) });
  });
  var MODULES = ["Dashboard", "Leads", "Customers", "Dealers", "Products", "Quotations", "Orders", "Service", "Inventory", "Analytics", "Employees", "Settings"];
  var ACCESS = {
    Administrator: "full", "Sales Manager": { Leads: "full", Customers: "full", Quotations: "full", Orders: "edit", Dealers: "view", Products: "view", Analytics: "view", Dashboard: "view" },
    "Sales Executive": { Leads: "edit", Customers: "edit", Quotations: "edit", Orders: "view", Products: "view", Dashboard: "view" },
    "Dealer Manager": { Dealers: "full", Orders: "edit", Products: "view", Quotations: "view", Dashboard: "view" },
    "Inventory Manager": { Inventory: "full", Products: "edit", Orders: "view", Dashboard: "view" },
    "Service Technician": { Service: "edit", Customers: "view", Products: "view", Dashboard: "view" },
    Accountant: { Orders: "edit", Quotations: "view", Analytics: "view", Dashboard: "view", Customers: "view" },
    Viewer: { Dashboard: "view", Products: "view" }
  };
  var roles = ROLES.map(function (r, i) {
    var map = ACCESS[r];
    return { id: "ROLE-" + (1 + i), name: r, users: emp.filter(function (e) { return e.role === r; }).length,
      description: ["Full access, including user and permission management.", "Runs the sales team and approves quotations.", "Works leads and quotations.", "Manages dealers and dealer orders.", "Owns stock and the catalogue.", "Handles service tickets in the field.", "Invoices and payment follow-up.", "Read-only access for support."][i],
      perms: MODULES.map(function (m) { var a = map === "full" ? "full" : (map[m] || "none"); return { module: m, view: a !== "none", create: a === "full", edit: a === "full" || a === "edit", remove: a === "full" }; }) };
  });

  var ACTIONS = [["Created", "Quotations", "QT-2026-1"], ["Updated", "Leads", "LD-40"], ["Converted", "Quotations", "QT-2026-1"], ["Assigned", "Service", "TKT-70"], ["Stock adjusted", "Inventory", "P"], ["Login", "Auth", "session"], ["Exported", "Reports", "monthly-sales"], ["Updated", "Dealers", "DL-5"], ["Created", "Orders", "ORD-2026-10"], ["Changed role", "Employees", "EMP-20"]];
  var audit = [];
  for (var a2 = 0; a2 < 40; a2++) {
    var ac = ACTIONS[a2 % ACTIONS.length], e = emp[(a2 * 3) % emp.length];
    audit.push({ id: "AUD-" + (9001 + a2), at: day(-Math.floor(a2 / 3)) + " " + ("0" + (9 + (a2 * 7) % 9)).slice(-2) + ":" + ("0" + (a2 * 13 % 60)).slice(-2), user: e.name, action: ac[0], module: ac[1],
      record: ac[2] + (ac[2].length < 8 ? ("0" + (a2 % 90)).slice(-2) : ""), ip: "10.0." + (a2 % 6) + ".x" });
  }

  var notifications = [
    { id: "n1", kind: "Stock", text: "Low stock: " + inventory.filter(function (x) { return x.level === "Low stock"; }).length + " SKUs are at or below reorder level.", at: "10 min ago", read: false },
    { id: "n2", kind: "Quotation", text: "Hotel Aranya Grand viewed quotation QT-2026-103.", at: "42 min ago", read: false },
    { id: "n3", kind: "Service", text: "Ticket TKT-7001 is unassigned for 2 days.", at: "2 h ago", read: false },
    { id: "n4", kind: "Dealer", text: "Gupta Sanitary Mart placed a dealer-portal order.", at: "3 h ago", read: true },
    { id: "n5", kind: "Lead", text: "New lead from the Exhibition: Rivera Court Hotel.", at: "Yesterday", read: true },
    { id: "n6", kind: "Payment", text: "Payment received for ORD-2026-1004.", at: "Yesterday", read: true }
  ];

  var MON = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  var sales = { labels: MON, actual: [38, 42, 40, 46, 51, 49, 55, 58, 61, 60, 66, 71].map(function (v) { return v * 100000; }), target: [40, 42, 44, 46, 48, 50, 54, 56, 58, 62, 64, 68].map(function (v) { return v * 100000; }) };

  AX.data["eurobrass-crm"] = { today: TODAY, finishes: finishes, series: series, products: products, inventory: inventory, customers: customers, dealers: dealers, schemes: schemes, orders: orders,
    quotations: quotations, leadStages: L_STAGES, leads: leads, technicians: TECH_NAMES, tickets: tickets, employees: emp, roles: roles, modules: MODULES, audit: audit, notifications: notifications, sales: sales };
})(window);
