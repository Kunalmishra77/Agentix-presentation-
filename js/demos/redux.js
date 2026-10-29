/* REDUX demo: Eurobrass bath-fittings restoration platform (website, lead CRM, WhatsApp, surveyor app, quotes, portal, jobs, billing, admin).
   All data is fictional and every send/approve/pay is simulated. */
(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.demos = AX.demos || {};
  var SLUG = "redux", ACCENT = "#0F766E";

  /* ---------- pure helpers ---------- */
  /** Quote totals. lines: [{redux, market}], pct: discount percent. GST 18% on the discounted subtotal. */
  function quoteTotals(lines, pct) {
    var sub = 0, market = 0;
    (lines || []).forEach(function (l) { sub += l.price; market += l.market; });
    var discount = Math.round(sub * (pct || 0) / 100);
    var taxable = sub - discount;
    var gst = Math.round(taxable * 0.18);
    return { subtotal: sub, discount: discount, taxable: taxable, gst: gst, total: taxable + gst, market: market, saves: market - taxable, needsApproval: (pct || 0) > 5 };
  }
  AX.redux = { quoteTotals: quoteTotals };

  /* ---------- styles ---------- */
  function scope(css) {
    var pre = '.ax-app[data-slug="' + SLUG + '"] ', dpre = '.demo-scope[data-slug="' + SLUG + '"] ';
    return css.replace(/(^|[{}])\s*([^{}@]+?)\s*\{/g, function (m, b, sel) {
      if (sel.indexOf(".ax-app") === 0) return m;
      return b + sel.split(",").map(function (s) { return pre + s.trim() + "," + dpre + s.trim(); }).join(",") + "{";
    });
  }
  var CSS = scope([
    ".rx-card{background:#fff;border:1px solid var(--ax-line);border-radius:12px;padding:16px;min-width:0}.rx-card h3{margin:0 0 10px;font:600 14px var(--font-display)}",
    ".rx-btn{appearance:none;font:600 13px var(--font-body);padding:9px 16px;border-radius:999px;border:1px solid var(--ax-line);background:#fff;color:var(--ink);cursor:pointer}.rx-btn.primary{background:var(--ax-accent);border-color:var(--ax-accent);color:#fff}.rx-btn:disabled{opacity:.45;cursor:default}.rx-btn.sm{padding:5px 11px;font-size:12px}",
    ".rx-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.rx-gap{margin-top:14px}.rx-muted{color:var(--ink-3);font-size:13px}",
    ".rx-pill{display:inline-block;font:600 11px var(--font-body);padding:2px 9px;border-radius:999px;background:rgba(11,31,51,.08);color:#2b3a4b;white-space:nowrap}.rx-pill.good{background:#d9f2ec;color:#0b5a50}.rx-pill.warn{background:#fdf0d2;color:#7a4e00}.rx-pill.bad{background:#fbe0de;color:#9c1f19}.rx-pill.info{background:#dcebfb;color:#164a85}",
    ".rx-kv{display:grid;grid-template-columns:120px 1fr;gap:8px 12px;margin:0 0 14px;font-size:14px}.rx-kv dt{color:var(--ink-3);font:500 12px var(--font-mono)}.rx-kv dd{margin:0;overflow-wrap:anywhere}",
    ".rx-sla{display:inline-block;font:600 11px var(--font-mono);padding:2px 8px;border-radius:999px;background:#d9f2ec;color:#0b5a50;margin-top:6px}.rx-sla.soon{background:#fdf0d2;color:#7a4e00}.rx-sla.late{background:#fbe0de;color:#9c1f19}.rx-sla.done{background:rgba(11,31,51,.08);color:#2b3a4b}",
    ".rx-phone{width:340px;max-width:100%;margin:0 auto;border:9px solid #14202b;border-radius:34px;background:#f5f7f7;overflow:hidden;box-shadow:0 18px 40px rgba(7,20,37,.25)}",
    ".rx-phone-top{background:var(--ax-accent);color:#fff;padding:12px 14px}.rx-phone-top b{display:block;font:700 14px var(--font-display)}.rx-phone-top small{opacity:.85;font-size:11px}",
    ".rx-sync{padding:8px 14px;font:600 12px var(--font-body);background:#fdf0d2;color:#7a4e00;display:flex;justify-content:space-between;align-items:center;gap:8px}.rx-sync.ok{background:#d9f2ec;color:#0b5a50}",
    ".rx-phone-body{padding:12px 12px 14px;display:flex;flex-direction:column;gap:10px;max-height:540px;overflow-y:auto}",
    ".rx-tabs{display:flex;gap:6px}.rx-tab{appearance:none;flex:1;font:600 12px var(--font-body);padding:7px 6px;border-radius:10px;border:1px solid var(--ax-line);background:#fff;cursor:pointer;color:var(--ink)}.rx-tab[aria-pressed=true]{background:var(--ax-accent);border-color:var(--ax-accent);color:#fff}",
    ".rx-fit{background:#fff;border:1px solid var(--ax-line);border-radius:12px;padding:10px;font-size:13px}.rx-fit.done{border-color:var(--ax-accent);box-shadow:inset 3px 0 0 var(--ax-accent)}.rx-fit b{display:block}.rx-fit small{color:var(--ink-3)}",
    ".rx-chips{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.rx-chip{appearance:none;font:600 11px var(--font-body);padding:4px 10px;border-radius:999px;border:1px solid var(--ax-line);background:#fff;cursor:pointer;color:var(--ink)}.rx-chip[aria-pressed=true]{background:var(--ink);border-color:var(--ink);color:#fff}",
    ".rx-prices{display:flex;gap:10px;flex-wrap:wrap;font:500 11px var(--font-mono);color:var(--ink-2)}.rx-prices b{display:inline;color:var(--ax-accent)}",
    ".rx-photos{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.rx-photo{appearance:none;aspect-ratio:4/3;border-radius:10px;border:2px dashed var(--ax-line);background:#e9eeee;font:600 12px var(--font-body);cursor:pointer;color:var(--ink-2);display:grid;place-items:center;padding:4px}.rx-photo.got{border:2px solid var(--ax-accent);background:linear-gradient(135deg,#9fd3c9,#4ea99b);color:#fff}",
    ".rx-quote-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:16px}@media(max-width:980px){.rx-quote-grid{grid-template-columns:minmax(0,1fr)}}",
    ".rx-table{width:100%;border-collapse:collapse;font-size:13px}.rx-table th{text-align:left;font:600 11px var(--font-mono);color:var(--ink-3);padding:6px 4px;border-bottom:1px solid var(--ax-line)}.rx-table td{padding:7px 4px;border-bottom:1px solid var(--ax-line);vertical-align:top}.rx-table td.n,.rx-table th.n{text-align:right;white-space:nowrap}",
    ".rx-paper{background:#fff;border:1px solid var(--ax-line);box-shadow:0 6px 20px rgba(7,20,37,.1);border-radius:6px;padding:22px;font-size:13px}.rx-paper h4{margin:0;font:700 17px var(--font-display);color:var(--ax-accent)}",
    ".rx-tot{margin-top:10px;margin-left:auto;max-width:260px;font-size:13px}.rx-tot div{display:flex;justify-content:space-between;padding:3px 0}.rx-tot .g{border-top:2px solid var(--ink);margin-top:4px;padding-top:6px;font-weight:700}.rx-tot .save{color:#0b5a50;font-weight:600}",
    ".rx-in,.rx-sel{font:400 14px var(--font-body);padding:8px 12px;border:1px solid var(--ax-line);border-radius:8px;background:#fff;color:var(--ink);max-width:100%}",
    ".rx-track{list-style:none;margin:0;padding:0}.rx-track li{display:flex;gap:10px;align-items:center;padding:6px 0;font-size:13px;color:var(--ink-3)}.rx-track li i{width:14px;height:14px;border-radius:50%;border:2px solid var(--ax-line);flex:none;background:#fff}.rx-track li.on{color:var(--ink);font-weight:600}.rx-track li.on i{background:var(--ax-accent);border-color:var(--ax-accent)}.rx-track li.cur i{box-shadow:0 0 0 4px rgba(15,118,110,.25)}",
    ".rx-warr{display:flex;justify-content:space-between;gap:8px;align-items:center;border:1px solid var(--ax-line);border-left:4px solid var(--ax-accent);border-radius:10px;padding:10px;background:#fff;font-size:13px;margin-top:8px}",
    ".rx-msg{white-space:pre-wrap;background:#dcf8c6;border-radius:10px 10px 10px 2px;padding:10px 12px;font-size:14px}.rx-btnrow{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.rx-wabtn{font:600 12px var(--font-body);color:#0b6bcb;background:#fff;border:1px solid var(--ax-line);border-radius:8px;padding:5px 12px}",
    ".ax-app[data-slug=redux] .pl-cost{display:none}",
    ".ax-app[data-slug=redux] .bd{overflow-x:auto}"
  ].join("\n"));
  var ROOTCSS = '.ax-app[data-slug="redux"]{--orange:' + ACCENT + ';--ax-accent:' + ACCENT + '}.demo-scope[data-slug="redux"]{--orange:' + ACCENT + ';--ax-accent:' + ACCENT + ';--ax-line:rgba(11,31,51,.12)}';
  try {
    if (typeof document !== "undefined" && document.head && !(document.getElementById && document.getElementById("redux-css"))) {
      var st = document.createElement("style"); st.id = "redux-css"; st.textContent = ROOTCSS + "\n" + CSS; document.head.appendChild(st);
    }
  } catch (e) { /* non-DOM loader */ }

  /* ---------- DOM helpers ---------- */
  function h() { return AX.el.apply(null, arguments); }
  function inr(n) { return AX.fmt.inr(Math.round(n)); }
  function sim(text) { AX.ui.toast(text || AX.ui.SIM_DEFAULT, { kind: "sim" }); }
  function btn(label, fn, cls, attrs) { return h("button", Object.assign({ type: "button", class: "rx-btn " + (cls || ""), on: { click: fn } }, attrs || {}), label); }
  function pill(text, tone) { return h("span", { class: "rx-pill " + (tone || "") }, text); }
  function card(title, body) { return h("section", { class: "rx-card" }, title ? h("h3", {}, title) : null, body); }
  function dl(pairs) { var d = h("dl", { class: "rx-kv" }); pairs.forEach(function (p) { d.appendChild(h("dt", {}, p[0])); d.appendChild(h("dd", {}, p[1] == null ? "" : p[1])); }); return d; }
  function drawer(title, body, actions) { return AX.ui.drawer({ title: title, body: h("div", { class: "demo-scope", "data-slug": SLUG }, body), actions: actions }); }
  var TONE = { Paid: "good", Sent: "info", Overdue: "bad", Draft: "", Scheduled: "info", Low: "bad", OK: "good", Read: "good", Delivered: "info" };
  function statusPill(s) { return pill(s, TONE[s] || ""); }

  /* ---------- shared session state ---------- */
  var seq = 0;
  function S(ctx) {
    if (!ctx.state.get().rx) {
      var d = ctx.data, t0 = Date.now();
      ctx.state.set({ rx: {
        leads: d.leads.map(function (l) { return Object.assign({}, l, { dueAt: l.slaMin == null ? null : t0 + l.slaMin * 60000 }); }),
        outbox: d.outbox.slice(), jobs: d.jobs.map(function (j) { return Object.assign({}, j); }),
        invoices: d.invoices.map(function (i) { return Object.assign({}, i); }), payments: d.payments.slice(),
        campaigns: d.campaigns.map(function (c) { return Object.assign({}, c); }), stock: d.stock.map(function (s) { return Object.assign({}, s); }),
        survey: JSON.parse(JSON.stringify(d.survey)), photos: { b1: [true, true, false, false], b2: [false, false, false, false] },
        queued: 3, done: { f1: true, f2: true, f3: true }, bathroom: "b1",
        quote: { id: "REDUX-Q-1042", status: "sent", pct: 0, discApproved: false, approvedAt: null }, enq: 0
      } });
    }
    return ctx.state.get().rx;
  }
  function post(ctx, m) {
    var rx = S(ctx);
    var row = Object.assign({ id: "OB-n" + (++seq), at: AX.fmt.time(new Date()), channel: "WhatsApp", buttons: [] }, m);
    rx.outbox.unshift(row);
    return row;
  }
  function quoteLines(ctx) {
    var rx = S(ctx), out = [];
    rx.survey.bathrooms.forEach(function (b) {
      b.fittings.forEach(function (f) {
        var r = ctx.data.rc(f.type, f.finish);
        if (!r) return;
        out.push({ id: f.id, room: b.name, type: f.type, finish: f.finish, rec: f.rec, price: f.rec === "Restore" ? r.redux : r.fresh, fresh: r.fresh, market: r.market });
      });
    });
    return out;
  }
  function totals(ctx) { return quoteTotals(quoteLines(ctx), S(ctx).quote.pct); }

  /* ---------- table helper ---------- */
  function tableIn(host, o) { return AX.table.create(host, o); }

  /* ---------- modules ---------- */
  var modules = [];
  function M(group, id, label, icon, view) { modules.push({ id: id, label: label, icon: icon, group: group, view: view }); }

  /* Journey */
  M("Journey", "journey", "Customer journey", "pipeline", {
    type: "pipeline", currency: "₹", gate: "approval",
    stages: [
      { id: "enquiry", label: "Enquiry - Hotel Kesar Palace (website form, Delhi)", ms: 900, log: ["Lead L-2401 created with consent recorded", "WhatsApp: enquiry received"] },
      { id: "assigned", label: "Assigned - city routing to the Delhi care executive, SLA timer 60 min", ms: 900, log: ["Routed by city: Delhi", "SLA timer started"] },
      { id: "survey", label: "Survey - surveyor app captures 7 fittings, 6 photos, works offline", ms: 1100, log: ["Visit SV-1042 checked in", "Synced 3 queued items"] },
      { id: "quote", label: "Quote - REDUX-Q-1042 built from the survey, never retyped", ms: 900, log: ["Quote sent on WhatsApp and portal"] },
      { id: "approval", label: "Customer approval - waits for the hotel in the portal", ms: 900, log: ["Approved in customer portal"] },
      { id: "job", label: "Job - dismantle, restore, quality check, re-fit", ms: 1200, log: ["Job JOB-5209 created"] },
      { id: "invoice", label: "Invoice - GST invoice and payment link", ms: 900, log: ["INV issued, UPI link sent"] },
      { id: "warranty", label: "Warranty - 24 month cards issued to the portal", ms: 900, log: ["Warranty cards issued"] }
    ]
  });

  /* Website */
  M("Front door", "website", "Website", "home", {
    type: "custom",
    render: function (host) {
      AX.embed.create(host, { url: "https://redux-demo-iota.vercel.app/", title: "REDUX website", external: true,
        shots: [{ src: "assets/shots/redux/journey.jpg" }, { src: "assets/shots/redux/quotes.jpg" }] });
    }
  });

  /* Lead CRM board */
  var LCOLS = [{ id: "new", label: "New", tone: "hot" }, { id: "contacted", label: "Contacted" }, { id: "survey", label: "Survey booked" }, { id: "quoted", label: "Quoted" }, { id: "won", label: "Won", tone: "good" }, { id: "lost", label: "Lost", tone: "bad" }];
  function slaText(lead, nowMs) {
    if (lead.col !== "new" || lead.dueAt == null) return { text: lead.col === "lost" ? "Closed" : "Contacted in SLA", cls: "done" };
    var ms = lead.dueAt - nowMs, a = Math.abs(Math.round(ms / 1000)), mm = Math.floor(a / 60), ss = a % 60;
    var t = mm + ":" + (ss < 10 ? "0" : "") + ss;
    if (ms < 0) return { text: "SLA breached " + t, cls: "late" };
    return { text: "SLA " + t + " left", cls: ms < 600000 ? "soon" : "" };
  }
  M("CRM", "leads", "Leads", "board", {
    type: "custom",
    render: function (host, ctx) {
      var rx = S(ctx), board = null, timer = null;
      var bar = h("div", { class: "rx-row" },
        btn("Simulate website enquiry", addEnquiry, "primary", { "data-add-enquiry": "" }),
        h("span", { class: "rx-muted" }, "Cities route to a care executive; each new lead starts a call-back SLA timer."));
      var boardHost = h("div", { class: "rx-gap" });
      host.appendChild(bar); host.appendChild(boardHost);
      function cards() {
        return rx.leads.map(function (l) { return { id: l.id, col: l.col, title: l.title, sub: l.city + " → " + l.exec, meta: l.source + " · " + l.rooms + " rooms", tags: [l.source], lead: l }; });
      }
      function renderCard(c) {
        var l = c.lead, s = slaText(l, Date.now());
        return [h("div", { class: "bd-title" }, c.title), h("div", { class: "bd-sub" }, c.sub), h("div", { class: "bd-meta" }, c.meta),
          h("span", { class: "rx-sla " + s.cls, "data-sla": l.id, "data-due": l.col === "new" && l.dueAt ? String(l.dueAt) : "" }, s.text)];
      }
      board = AX.board.create(boardHost, { columns: LCOLS, cards: cards(), renderCard: renderCard,
        onMove: function (card, col) {
          var l = rx.leads.filter(function (x) { return x.id === card.id; })[0];
          if (!l) return;
          l.col = col;
          if (col === "survey") post(ctx, { to: l.title, template: "Survey confirmed", text: "Your free assessment is booked. Surveyor: " + ctx.data.surveyors[0] + ". We will WhatsApp when they are on the way.", buttons: ["Reschedule"] });
          if (col === "quoted") post(ctx, { to: l.title, template: "Quote sent", text: "Your quotation is ready. View and approve it in your customer portal.", buttons: ["View quote"] });
          if (col === "won") post(ctx, { to: l.title, template: "Welcome aboard", text: "Thank you for choosing REDUX. Your job will be scheduled shortly.", buttons: [] });
          sim("Simulated — " + l.title + " moved to " + col + "; WhatsApp not sent");
          board.setCards(cards());
        },
        onOpen: function (c) {
          var l = rx.leads.filter(function (x) { return x.id === c.id; })[0];
          drawer(l.title, h("div", {}, dl([["Lead", l.id], ["Contact", l.contact + " · " + l.phone], ["City", l.city], ["Care executive", l.exec], ["Source", l.source], ["Rooms", l.rooms], ["Note", l.note], ["SLA", slaText(l, Date.now()).text]]),
            h("div", { class: "rx-row" }, btn("Call now", function () { sim("Simulated — call not placed"); }, "primary"), btn("WhatsApp", function () { sim("Simulated — WhatsApp message not sent"); }))));
        } });
      function tick() {
        var now = Date.now();
        Array.prototype.forEach.call(host.querySelectorAll(".rx-sla[data-due]"), function (n) {
          var due = +n.getAttribute("data-due");
          if (!due) return;
          var s = slaText({ col: "new", dueAt: due }, now);
          n.textContent = s.text; n.className = "rx-sla " + s.cls;
        });
      }
      timer = setInterval(tick, 1000);
      AX.mount(host, function () { clearInterval(timer); });
      function addEnquiry() {
        var d = ctx.data, k = rx.enq++, city = d.cities[k % d.cities.length];
        var p = AX.fake.person("rx-new" + k);
        var lead = { id: "L-" + (2501 + k), col: "new", title: "Hotel " + ["Orchid Bay", "Kadamba Court", "Silk Route Inn", "Palm Residency", "Rose Terrace"][k % 5], contact: p.name, phone: p.phone, city: city, exec: d.routes[city].exec,
          source: "Website", rooms: 20 + k * 7, slaMin: d.routes[city].sla, dueAt: Date.now() + d.routes[city].sla * 60000, note: "Free assessment request from the website form" };
        rx.leads.unshift(lead);
        post(ctx, { to: lead.title, template: "Enquiry received", text: "Hello! Thanks for your enquiry with REDUX by Eurobrass. Your care executive " + lead.exec.split(" ")[0] + " will call you within " + d.routes[city].sla + " minutes.", buttons: ["Call me now"] });
        board.setCards(cards());
        sim("Simulated — enquiry routed to " + city + "; WhatsApp not sent");
      }
    }
  });

  /* WhatsApp inbox */
  M("CRM", "inbox", "WhatsApp inbox", "chat", {
    type: "custom",
    render: function (host, ctx) {
      var d = ctx.data;
      AX.chat.create(host, { threads: d.threads, scripts: d.scripts,
        side: function (t) {
          var lead = S(ctx).leads.filter(function (l) { return l.title === t.name; })[0];
          return h("div", { class: "demo-scope", "data-slug": SLUG }, h("h3", { style: { margin: "0 0 10px", font: "600 14px var(--font-display)" } }, "Linked lead"),
            lead ? dl([["Lead", lead.id], ["City", lead.city], ["Care exec", lead.exec], ["Stage", lead.col]]) : h("p", { class: "rx-muted" }, "No lead linked yet."),
            btn("Send quote link", function () { post(ctx, { to: t.name, template: "Quote sent", text: "Your quotation is ready. View and approve it in your customer portal.", buttons: ["View quote"] }); sim("Simulated — WhatsApp message not sent"); }, "primary sm"));
        } });
    }
  });

  /* Surveyor app */
  M("Field", "survey-app", "Surveyor app", "phone", {
    type: "custom",
    render: function (host, ctx) {
      var rx = S(ctx), d = ctx.data, wrap = h("div", { class: "rx-phone", "data-phone": "" });
      host.appendChild(wrap);
      function bump() { rx.queued += 1; }
      function draw() {
        wrap.textContent = "";
        var bath = rx.survey.bathrooms.filter(function (b) { return b.id === rx.bathroom; })[0];
        var offline = rx.queued > 0;
        wrap.appendChild(h("div", { class: "rx-phone-top" }, h("b", {}, "Visit " + rx.survey.id), h("small", {}, rx.survey.hotel + " · " + rx.survey.surveyor)));
        wrap.appendChild(h("div", { class: "rx-sync" + (offline ? "" : " ok"), "data-sync-banner": offline ? "offline" : "online" },
          h("span", {}, offline ? "Offline — " + rx.queued + " items queued" : "Online — all synced"),
          btn("Sync", function () {
            var n = rx.queued; rx.queued = 0; draw();
            sim("Simulated — " + n + " queued items synced, nothing uploaded");
          }, "sm primary", { "data-sync": "" })));
        var body = h("div", { class: "rx-phone-body" });
        body.appendChild(h("div", { class: "rx-tabs" }, rx.survey.bathrooms.map(function (b) {
          return h("button", { type: "button", class: "rx-tab", "aria-pressed": String(b.id === rx.bathroom), on: { click: function () { rx.bathroom = b.id; draw(); } } }, b.name.replace(" bathroom", ""));
        })));
        bath.fittings.forEach(function (f) {
          var r = d.rc(f.type, f.finish), isDone = !!rx.done[f.id];
          body.appendChild(h("div", { class: "rx-fit" + (isDone ? " done" : ""), "data-fit": f.id },
            h("label", { class: "rx-row", style: { gap: "8px" } },
              h("input", { type: "checkbox", checked: isDone ? "" : null, "aria-label": "Checked " + f.type, on: { change: function (e) { rx.done[f.id] = e.target.checked; bump(); draw(); } } }),
              h("span", {}, h("b", {}, f.type), h("small", {}, f.finish + " · condition " + f.cond))),
            h("div", { class: "rx-chips", role: "group", "aria-label": "Condition" }, ["Good", "Fair", "Poor"].map(function (c) {
              return h("button", { type: "button", class: "rx-chip", "aria-pressed": String(f.cond === c), on: { click: function () { f.cond = c; bump(); draw(); } } }, c);
            })),
            h("div", { class: "rx-chips", role: "group", "aria-label": "Recommendation" }, ["Restore", "Replace"].map(function (c) {
              return h("button", { type: "button", class: "rx-chip", "data-rec": c, "aria-pressed": String(f.rec === c), on: { click: function () { f.rec = c; bump(); draw(); } } }, c);
            })),
            r ? h("div", { class: "rx-prices" }, h("span", {}, "REDUX ", h("b", {}, inr(r.redux))), h("span", {}, "New Eurobrass " + inr(r.fresh)), h("span", {}, "Market " + inr(r.market)), h("span", {}, "Saves " + inr(r.market - (f.rec === "Restore" ? r.redux : r.fresh)))) : null));
        });
        var got = rx.photos[rx.bathroom].filter(Boolean).length;
        body.appendChild(h("div", {}, h("b", { style: { fontSize: "13px" } }, "Photos " + got + "/4 - " + bath.name), h("div", { class: "rx-photos", style: { marginTop: "6px" } }, ["Front", "Side", "Top", "Close-up"].map(function (lab, i) {
          var on = rx.photos[rx.bathroom][i];
          return h("button", { type: "button", class: "rx-photo" + (on ? " got" : ""), "data-photo": String(i), on: { click: function () { rx.photos[rx.bathroom][i] = !on; if (!on) bump(); draw(); } } }, (on ? "✓ " : "+ ") + lab);
        }))));
        body.appendChild(btn("Submit survey", function () { rx.survey.submitted = true; sim("Simulated — survey submitted; quote can now be built"); draw(); }, "primary", { "data-submit": "" }));
        if (rx.survey.submitted) body.appendChild(pill("Submitted - quote REDUX-Q-1042 built from this survey", "good"));
        wrap.appendChild(body);
      }
      draw();
    }
  });

  /* Quote builder + preview */
  M("Sales", "quotes", "Quotes", "file", {
    type: "custom",
    render: function (host, ctx) {
      var rx = S(ctx), d = ctx.data;
      var root = h("div", { class: "rx-quote-grid" });
      host.appendChild(root);
      function draw() {
        root.textContent = "";
        var lines = quoteLines(ctx), t = totals(ctx), q = rx.quote;
        var sel = h("select", { class: "rx-sel", "aria-label": "Discount", on: { change: function (e) { q.pct = +e.target.value; q.discApproved = false; draw(); } } },
          [0, 5, 10, 15].map(function (p) { return h("option", { value: String(p) }, p + "% discount"); }));
        sel.value = String(q.pct);
        var needs = t.needsApproval && !q.discApproved;
        var left = card("Quote builder - " + q.id,
          h("div", {},
            h("p", { class: "rx-muted" }, "Every line comes from the surveyor's fittings. Change a recommendation in the Surveyor app and the quote follows."),
            h("table", { class: "rx-table" }, h("thead", {}, h("tr", {}, h("th", {}, "Fitting"), h("th", {}, "Do"), h("th", { class: "n" }, "Price"))),
              h("tbody", {}, lines.map(function (l) { return h("tr", { "data-line": l.id }, h("td", {}, l.type + " · " + l.finish, h("div", { class: "rx-muted" }, l.room)), h("td", {}, l.rec), h("td", { class: "n" }, inr(l.price))); }))),
            h("div", { class: "rx-row rx-gap" }, sel, t.needsApproval ? pill(q.discApproved ? "Approved by Super Admin" : "Above 5% needs Super Admin approval", q.discApproved ? "good" : "warn") : null),
            h("div", { class: "rx-row rx-gap" },
              needs ? btn("Approve discount (Super Admin)", function () { q.discApproved = true; sim("Simulated — discount approved"); draw(); }, "", { "data-approve-discount": "" }) : null,
              btn("Send quote on WhatsApp", function () {
                q.status = "sent";
                post(ctx, { to: d.customer.hotel, template: "Quote sent", text: "Your quotation " + q.id + " for " + inr(t.total) + " (incl. GST) is ready. View and approve it in your customer portal.", buttons: ["View quote", "Talk to us"] });
                sim("Simulated — quote WhatsApp not sent"); draw();
              }, "primary", { disabled: needs ? "" : null, "data-send-quote": "" }),
              pill("Status: " + q.status, q.status === "approved" ? "good" : "info"))));
        var right = card("Preview", h("div", { class: "rx-paper", "data-quote-preview": "" },
          h("div", { class: "rx-row", style: { justifyContent: "space-between" } }, h("h4", {}, "REDUX by Eurobrass"), h("div", { class: "rx-muted" }, "Quotation " + q.id)),
          h("p", {}, "To: ", h("b", {}, d.customer.hotel), " · " + d.customer.city + " · " + d.customer.rooms + " rooms"),
          h("table", { class: "rx-table" }, h("thead", {}, h("tr", {}, h("th", {}, "Item"), h("th", { class: "n" }, "Market"), h("th", { class: "n" }, "REDUX"))),
            h("tbody", {}, lines.map(function (l) { return h("tr", {}, h("td", {}, l.type + " (" + l.finish + ", " + l.rec.toLowerCase() + ")"), h("td", { class: "n" }, inr(l.market)), h("td", { class: "n" }, inr(l.price))); }))),
          h("div", { class: "rx-tot", "data-quote-totals": String(t.total) },
            h("div", {}, h("span", {}, "Subtotal"), h("span", {}, inr(t.subtotal))),
            t.discount ? h("div", {}, h("span", {}, "Discount " + q.pct + "%"), h("span", {}, "-" + inr(t.discount))) : null,
            h("div", {}, h("span", {}, "GST 18%"), h("span", {}, inr(t.gst))),
            h("div", { class: "g" }, h("span", {}, "Total"), h("span", {}, inr(t.total))),
            h("div", { class: "save" }, h("span", {}, "You save vs market"), h("span", {}, inr(t.saves)))),
          h("p", { class: "rx-muted" }, "Valid for 15 days · 24 month warranty on restored fittings")));
        root.appendChild(left); root.appendChild(right);
      }
      draw();
    }
  });

  /* Customer portal */
  var STEPS = ["Quote approved", "Scheduled", "Dismantled", "In restoration", "Quality check", "Re-fitted", "Handover"];
  var JCOLS = [{ id: "scheduled", label: "Scheduled" }, { id: "dismantled", label: "Dismantled" }, { id: "restoration", label: "In restoration" }, { id: "qc", label: "Quality check" }, { id: "refitted", label: "Re-fitted" }, { id: "handover", label: "Handover", tone: "good" }];
  function kesarJob(rx) { return rx.jobs.filter(function (j) { return j.title === "Hotel Kesar Palace"; })[0]; }
  M("Customer", "portal", "Customer portal", "users", {
    type: "custom",
    render: function (host, ctx) {
      var rx = S(ctx), d = ctx.data, wrap = h("div", { class: "rx-phone", "data-portal": "" });
      host.appendChild(wrap);
      function draw() {
        wrap.textContent = "";
        var q = rx.quote, t = totals(ctx), job = kesarJob(rx);
        var cur = job ? 1 + JCOLS.map(function (c) { return c.id; }).indexOf(job.col) : (q.status === "approved" ? 0 : -1);
        wrap.appendChild(h("div", { class: "rx-phone-top" }, h("b", {}, "REDUX customer portal"), h("small", {}, d.customer.hotel + " · " + d.customer.name)));
        var body = h("div", { class: "rx-phone-body" });
        body.appendChild(card("Quotation " + q.id, h("div", {},
          h("div", { class: "rx-row", style: { justifyContent: "space-between" } }, h("b", {}, inr(t.total) + " incl. GST"), pill(q.status === "approved" ? "Approved" : "Awaiting your approval", q.status === "approved" ? "good" : "warn")),
          h("p", { class: "rx-muted" }, "You save " + inr(t.saves) + " compared with market replacement."),
          q.status === "approved" ? h("p", { class: "rx-muted", "data-approved": "" }, "Approved " + q.approvedAt + ". Your job is scheduled.")
            : btn("Approve quote", function () { approve(); }, "primary", { "data-approve-quote": "" }))));
        body.appendChild(card("Job tracker", h("ol", { class: "rx-track" }, STEPS.map(function (s, i) {
          return h("li", { class: (i <= cur ? "on" : "") + (i === cur ? " cur" : "") }, h("i"), s);
        }))));
        var mine = rx.invoices.filter(function (i) { return i.hotel === d.customer.hotel; });
        body.appendChild(card("Invoices", mine.length ? h("div", {}, mine.map(function (i) { return h("div", { class: "rx-warr", "data-invoice": i.id }, h("span", {}, i.id + " · " + i.kind + " · " + inr(i.amount)), statusPill(i.status)); })) : h("p", { class: "rx-muted" }, "No invoices yet. An advance invoice appears after approval.")));
        body.appendChild(card("Warranty", h("div", {}, d.warranty.map(function (wr) { return h("div", { class: "rx-warr" }, h("span", {}, wr.item), pill(wr.left + "/" + wr.months + " months left", "good")); }))));
        wrap.appendChild(body);
      }
      function approve() {
        var q = rx.quote, t = totals(ctx);
        q.status = "approved"; q.approvedAt = AX.fmt.date(new Date());
        post(ctx, { to: "Care executive " + d.routes.Delhi.exec, channel: "Email", template: "Quote approved (internal)", text: d.customer.hotel + " approved " + q.id + ". Create the job and book the dismantle team." });
        post(ctx, { to: d.customer.hotel, template: "Quote approved", text: "Thank you! Quote " + q.id + " (" + inr(t.total) + ") is approved. Your job is scheduled and an advance invoice is on its way.", buttons: ["View job tracker", "Pay advance"] });
        rx.jobs.unshift({ id: "JOB-5209", col: "scheduled", title: d.customer.hotel, sub: quoteLines(ctx).length + " fittings", meta: "Team A · " + d.today.slice(5), tags: [d.routes.Delhi.exec.split(" ")[0]] });
        rx.invoices.unshift({ id: "INV-7201", hotel: d.customer.hotel, amount: Math.round(t.total / 2), due: d.today, status: "Sent", kind: "Advance 50%" });
        var l = rx.leads.filter(function (x) { return x.id === "L-2401"; })[0]; if (l) l.col = "won";
        sim("Simulated — approval WhatsApp not sent");
        draw();
      }
      draw();
    }
  });

  /* Jobs board */
  M("Operations", "jobs", "Jobs", "board", {
    type: "custom",
    render: function (host, ctx) {
      var rx = S(ctx), board;
      function cards() { return rx.jobs.map(function (j) { return Object.assign({}, j); }); }
      board = AX.board.create(host, { columns: JCOLS, cards: cards(),
        onMove: function (card, col) {
          var j = rx.jobs.filter(function (x) { return x.id === card.id; })[0];
          if (!j) return;
          j.col = col;
          var lab = JCOLS.filter(function (c) { return c.id === col; })[0].label;
          post(ctx, { to: j.title, template: "Job update", text: "Update on " + j.id + ": your fittings are now at '" + lab + "'.", buttons: ["View tracker"] });
          sim("Simulated — job update WhatsApp not sent");
        },
        onOpen: function (c) { drawer(c.title, dl([["Job", c.id], ["Scope", c.sub], ["Team / date", c.meta], ["Stage", c.col]])); } });
    }
  });

  /* Invoices + payments (state-backed) */
  function invCols() {
    return [{ key: "id", label: "Invoice", sortable: true }, { key: "hotel", label: "Hotel", sortable: true }, { key: "kind", label: "Type" }, { key: "amount", label: "Amount", sortable: true, render: function (r) { return inr(r.amount); } },
      { key: "due", label: "Due", sortable: true }, { key: "status", label: "Status", render: function (r) { return statusPill(r.status); } }];
  }
  M("Billing", "invoices", "Invoices", "file", {
    type: "custom",
    render: function (host, ctx) {
      var rx = S(ctx), tbl;
      function rows() { return rx.invoices.map(function (r) { return Object.assign({ name: r.id }, r); }); }
      tbl = tableIn(host, { columns: invCols(), rows: rows(), qKeys: ["id", "hotel"], filters: [{ key: "status", label: "status", options: ["Paid", "Sent", "Overdue"] }], pageSize: 10,
        actions: [{ label: "Mark paid", onClick: function (r) {
          var inv = rx.invoices.filter(function (x) { return x.id === r.id; })[0];
          if (!inv || inv.status === "Paid") { sim("Already paid"); return; }
          inv.status = "Paid";
          rx.payments.unshift({ id: "PAY-n" + (++seq), invoice: inv.id, hotel: inv.hotel, amount: inv.amount, mode: "UPI", date: ctx.data.today, ref: "TXN" + (800000 + seq) });
          post(ctx, { to: inv.hotel, template: "Payment received", text: "We received " + inr(inv.amount) + " against " + inv.id + ". Thank you!", buttons: ["Download receipt"] });
          tbl.setRows(rows()); sim("Simulated — payment recorded, receipt WhatsApp not sent");
        } }],
        onRow: function (r) { drawer(r.id, dl([["Hotel", r.hotel], ["Type", r.kind], ["Amount", inr(r.amount)], ["GST", "Included at 18%"], ["Due", r.due], ["Status", r.status]]), [{ label: "Send reminder", onClick: function () { sim("Simulated — reminder WhatsApp not sent"); } }]); } });
    }
  });
  M("Billing", "payments", "Payments", "wallet", {
    type: "custom",
    render: function (host, ctx) {
      var rx = S(ctx);
      tableIn(host, { columns: [{ key: "id", label: "Payment", sortable: true }, { key: "invoice", label: "Invoice" }, { key: "hotel", label: "Hotel", sortable: true }, { key: "amount", label: "Amount", sortable: true, render: function (r) { return inr(r.amount); } }, { key: "mode", label: "Mode" }, { key: "date", label: "Date", sortable: true }, { key: "ref", label: "Reference" }],
        rows: rx.payments.map(function (r) { return Object.assign({ name: r.id }, r); }), qKeys: ["id", "hotel", "invoice", "ref"], filters: [{ key: "mode", label: "mode", options: ["UPI", "NEFT", "Cheque", "Card"] }], pageSize: 10,
        onRow: function (r) { drawer(r.id, dl([["Invoice", r.invoice], ["Hotel", r.hotel], ["Amount", inr(r.amount)], ["Mode", r.mode], ["Reference", r.ref], ["Date", r.date]])); } });
    }
  });

  /* Campaigns */
  M("Growth", "campaigns", "Campaigns", "mail", {
    type: "custom",
    render: function (host, ctx) {
      var rx = S(ctx), tbl;
      function rows() { return rx.campaigns.map(function (r) { return Object.assign({ rate: Math.round(r.replies / Math.max(1, r.sent) * 100) + "%" }, r); }); }
      tbl = tableIn(host, { columns: [{ key: "name", label: "Campaign", sortable: true }, { key: "channel", label: "Channel" }, { key: "audience", label: "Audience" }, { key: "sent", label: "Sent", sortable: true }, { key: "replies", label: "Replies", sortable: true }, { key: "rate", label: "Reply rate" }, { key: "status", label: "Status", render: function (r) { return statusPill(r.status); } }],
        rows: rows(), qKeys: ["name", "audience"], filters: [{ key: "status", label: "status", options: ["Sent", "Scheduled", "Draft"] }, { key: "channel", label: "channel", options: ["WhatsApp", "Email"] }], pageSize: 10,
        actions: [{ label: "Send now", onClick: function (r) {
          var c = rx.campaigns.filter(function (x) { return x.id === r.id; })[0];
          if (c.status === "Sent") { sim("Campaign already sent"); return; }
          c.status = "Sent"; c.sent = c.sent || 640;
          post(ctx, { to: c.audience, channel: c.channel, template: "Campaign: " + c.name, text: c.name + " sent to " + c.sent + " contacts in '" + c.audience + "'." });
          tbl.setRows(rows()); sim("Simulated — campaign not sent");
        } }],
        onRow: function (r) { drawer(r.name, dl([["Campaign", r.id], ["Channel", r.channel], ["Audience", r.audience], ["Sent", r.sent], ["Replies", r.replies + " (" + r.rate + ")"], ["Status", r.status]])); } });
    }
  });

  /* Admin: rate-card, catalog, stock */
  M("Admin", "rate-card", "Rate card", "table", function (ctx) {
    return { type: "table", rows: ctx.data.rateCard.map(function (r) { return Object.assign({ name: r.type + " - " + r.finish, save: r.market - r.redux }, r); }),
      columns: [{ key: "type", label: "Fitting", sortable: true }, { key: "finish", label: "Finish" }, { key: "redux", label: "REDUX price", sortable: true, render: function (r) { return inr(r.redux); } }, { key: "fresh", label: "New Eurobrass", sortable: true, render: function (r) { return inr(r.fresh); } }, { key: "market", label: "Market replacement", sortable: true, render: function (r) { return inr(r.market); } }, { key: "save", label: "Customer saves", sortable: true, render: function (r) { return inr(r.save); } }],
      qKeys: ["type", "finish"], filters: [{ key: "finish", label: "finish", options: ["Chrome", "Brushed gold", "Matte black", "Antique brass"] }], pageSize: 12,
      drawer: function (r) { return h("div", { class: "demo-scope", "data-slug": SLUG }, dl([["Fitting", r.type], ["Finish", r.finish], ["REDUX price", inr(r.redux)], ["New Eurobrass", inr(r.fresh)], ["Market replacement", inr(r.market)], ["Customer saves", inr(r.save)], ["Warranty", "24 months"]])); } };
  });
  M("Admin", "catalog", "Catalog", "box", function (ctx) {
    return { type: "table", rows: ctx.data.catalog,
      columns: [{ key: "id", label: "SKU", sortable: true }, { key: "name", label: "Product", sortable: true }, { key: "category", label: "Category" }, { key: "finish", label: "Finish" }, { key: "mrp", label: "MRP", sortable: true, render: function (r) { return inr(r.mrp); } }, { key: "warranty", label: "Warranty" }],
      qKeys: ["id", "name"], filters: [{ key: "category", label: "category", options: ["Basin mixers", "Shower systems", "Diverters", "Accessories", "Spares"] }, { key: "finish", label: "finish", options: ["Chrome", "Brushed gold", "Matte black", "Antique brass"] }], pageSize: 12,
      drawer: function (r) { return h("div", { class: "demo-scope", "data-slug": SLUG }, dl([["SKU", r.id], ["Category", r.category], ["Finish", r.finish], ["MRP", inr(r.mrp)], ["Warranty", r.warranty]])); } };
  });
  M("Admin", "stock", "Stock", "box", {
    type: "custom",
    render: function (host, ctx) {
      var rx = S(ctx), tbl;
      function rows() { return rx.stock.map(function (r) { return Object.assign({}, r, { status: r.onHand <= r.reorder ? "Low" : "OK" }); }); }
      tbl = tableIn(host, { columns: [{ key: "id", label: "SKU", sortable: true }, { key: "name", label: "Product", sortable: true }, { key: "finish", label: "Finish" }, { key: "onHand", label: "On hand", sortable: true }, { key: "reorder", label: "Reorder at" }, { key: "location", label: "Location" }, { key: "status", label: "Status", render: function (r) { return statusPill(r.status); } }],
        rows: rows(), qKeys: ["id", "name"], filters: [{ key: "status", label: "status", options: ["Low", "OK"] }, { key: "location", label: "location", options: ["Okhla store", "Jaipur hub", "Mumbai hub"] }], pageSize: 10,
        actions: [{ label: "Reorder", onClick: function (r) {
          var s = rx.stock.filter(function (x) { return x.id === r.id; })[0];
          s.onHand += 50;
          post(ctx, { to: "Supplier desk", channel: "Email", template: "Purchase order", text: "PO raised for 50 x " + s.name + " (" + s.id + ")." });
          tbl.setRows(rows()); sim("Simulated — purchase order not sent");
        } }],
        onRow: function (r) { drawer(r.name, dl([["SKU", r.id], ["On hand", r.onHand], ["Reorder at", r.reorder], ["Location", r.location], ["Status", r.status]])); } });
    }
  });

  /* Outbox */
  M("Admin", "outbox", "Message outbox", "bell", {
    type: "custom",
    render: function (host, ctx) {
      var rx = S(ctx);
      host.appendChild(h("p", { class: "rx-muted" }, "Every WhatsApp and email the platform would send appears here instead of going out. " + rx.outbox.length + " messages logged this session."));
      var box = h("div", {});
      host.appendChild(box);
      tableIn(box, { columns: [{ key: "at", label: "Time" }, { key: "channel", label: "Channel", render: function (r) { return pill(r.channel, r.channel === "WhatsApp" ? "good" : "info"); } }, { key: "to", label: "To", sortable: true }, { key: "template", label: "Template", sortable: true }, { key: "text", label: "Message", render: function (r) { return r.text.length > 70 ? r.text.slice(0, 70) + "…" : r.text; } }],
        rows: rx.outbox.map(function (r) { return Object.assign({ name: r.template }, r); }), qKeys: ["to", "template", "text"], filters: [{ key: "channel", label: "channel", options: ["WhatsApp", "Email"] }], pageSize: 10,
        onRow: function (r) {
          drawer(r.template, h("div", {}, dl([["To", r.to], ["Channel", r.channel], ["Time", r.at]]), h("div", { class: "rx-msg" }, r.text), r.buttons && r.buttons.length ? h("div", { class: "rx-btnrow" }, r.buttons.map(function (b) { return h("span", { class: "rx-wabtn" }, b); })) : null,
            h("p", { class: "rx-muted rx-gap" }, "Simulated — nothing was delivered.")));
        } });
    }
  });

  AX.demos[SLUG] = { brand: { name: "REDUX", accent: ACCENT, logoText: "R" }, start: "journey", modules: modules };
})(window);
