/* Woodpecker PMS - full interactive demo manifest (fictional guests/properties). */
(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.demos = AX.demos || {};
  var SLUG = "woodpecker-pms";

  /* ---------- pure helpers (no DOM) ---------- */
  AX.woodpecker = AX.woodpecker || {};
  /** GST slab on room tariff per night: up to Rs 7,500 -> 12%, above -> 18%. */
  AX.woodpecker.gstRate = function (tariff) { return tariff <= 7500 ? 0.12 : 0.18; };
  var gstRate = AX.woodpecker.gstRate;
  var DAY = 86400000;
  function parse(s) { var p = String(s).split("-"); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iso(ms) { var d = new Date(ms); return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()); }
  function addDays(s, n) { return iso(parse(s) + n * DAY); }
  function endOf(b) { return addDays(b.start, b.nights); }
  function occupiedOn(b, d) { return b.start <= d && d < endOf(b); }
  function inr(n) { return AX.fmt.inr(Math.round(n)); }
  function r10(n) { return Math.round(n); }

  /* ---------- styles (scoped to this demo) ---------- */
  var CSS = [
    '.ax-app[data-slug="woodpecker-pms"]{--orange:#B8873A;--wp-gold:#B8873A;--wp-gold-d:#8A6322;--wp-bg2:#F4EEE2}',
    '.wp-row{display:flex;gap:12px;flex-wrap:wrap;align-items:center}',
    '.wp-card{background:#fff;border:1px solid var(--ax-line);border-radius:12px;padding:16px;min-width:0}',
    '.wp-card h3{margin:0 0 10px;font:600 .875rem var(--font-display);color:var(--ink-2)}',
    '.wp-grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px}',
    '.wp-chip{display:inline-block;padding:2px 9px;border-radius:999px;font:600 .72rem var(--font-body);background:#eee;color:#444;white-space:nowrap}',
    '.wp-chip.ok,.wp-chip.paid,.wp-chip.clean,.wp-chip.insync,.wp-chip.checked-in{background:#E3F3E7;color:#1F6B3A}',
    '.wp-chip.warn,.wp-chip.low,.wp-chip.delayed,.wp-chip.hold,.wp-chip.pending{background:#FBF0D6;color:#8A6322}',
    '.wp-chip.bad,.wp-chip.error,.wp-chip.reorder{background:#FBE1DE;color:#A22A1E}',
    '.wp-chip.confirmed,.wp-chip.info{background:#E4ECF7;color:#2A4D80}',
    '.wp-btn{appearance:none;font:600 .8125rem var(--font-body);padding:8px 14px;border-radius:999px;border:1px solid var(--ax-line);background:#fff;color:var(--ink);cursor:pointer}',
    '.wp-btn:hover{border-color:var(--wp-gold);color:var(--wp-gold-d)}',
    '.wp-btn.primary{background:var(--wp-gold);border-color:var(--wp-gold);color:#fff}.wp-btn.primary:hover{background:var(--wp-gold-d);color:#fff}',
    '.wp-btn.sm{padding:4px 10px;font-size:.75rem}',
    '.wp-in,.wp-sel{font:400 .875rem var(--font-body);padding:8px 10px;border:1px solid var(--ax-line);border-radius:8px;background:#fff;color:var(--ink);min-width:0}',
    '.wp-lab{display:flex;flex-direction:column;gap:4px;font:500 .72rem var(--font-mono);color:var(--ink-3)}',
    '.wp-dl{display:grid;grid-template-columns:130px 1fr;gap:6px 12px;margin:0;font-size:.875rem}.wp-dl dt{color:var(--ink-3)}.wp-dl dd{margin:0;font-weight:500}',
    '.wp-tbl{width:100%;border-collapse:collapse;font-size:.85rem}.wp-tbl th{text-align:left;font:600 .7rem var(--font-mono);color:var(--ink-3);text-transform:uppercase;padding:6px 8px;border-bottom:1px solid var(--ax-line)}',
    '.wp-tbl td{padding:8px;border-bottom:1px solid var(--ax-line)}.wp-tbl td.r,.wp-tbl th.r{text-align:right}.wp-tbl tr.tot td{font-weight:700;border-top:2px solid var(--ink)}',
    '.wp-list{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}',
    '.wp-list li{display:flex;gap:10px;align-items:center;justify-content:space-between;padding:8px 10px;border:1px solid var(--ax-line);border-radius:8px;flex-wrap:wrap}',
    '.wp-drop{border:2px dashed var(--wp-gold);border-radius:12px;padding:28px;text-align:center;color:var(--wp-gold-d);background:var(--wp-bg2);cursor:pointer;font-weight:600}',
    '.wp-drop.done{border-style:solid;background:#E3F3E7;color:#1F6B3A;border-color:#7CBF92}',
    '.wp-inv{background:#fff;border:1px solid var(--ax-line);padding:20px;border-radius:8px;font-size:.85rem}',
    '.wp-inv h4{margin:0;font:700 1rem var(--font-display)}.wp-inv .meta{color:var(--ink-3);font-size:.75rem}',
    '.wp-slab{display:inline-block;margin-top:2px;font:600 .62rem var(--font-mono);color:var(--wp-gold-d)}',
    '.wp-rates{display:grid;gap:6px;overflow-x:auto}.wp-rates .c{padding:10px 6px;border:1px solid var(--ax-line);border-radius:8px;text-align:center;background:#fff;font-weight:600;min-width:0}',
    '.wp-rates .c.h{display:flex;align-items:center;justify-content:center;background:var(--wp-bg2);font:600 .72rem var(--font-mono);border-color:transparent}.wp-rates .c.we{background:#FBF6EA}',
    '.wp-be{max-width:760px;margin:0 auto;background:#fff;border:1px solid var(--ax-line);border-radius:16px;overflow:hidden;box-shadow:var(--shadow-1)}',
    '.wp-be-hero{background:linear-gradient(135deg,#2B2112,#6B4F1D);color:#fff;padding:22px 24px}.wp-be-hero h3{margin:0;color:#fff;font:700 1.25rem var(--font-display)}.wp-be-hero p{margin:4px 0 0;opacity:.8;font-size:.85rem}',
    '.wp-be-body{padding:20px 24px;display:flex;flex-direction:column;gap:14px}',
    '.wp-ins{border-left:4px solid var(--wp-gold)}.wp-ins.done{opacity:.6;border-left-color:#7CBF92}',
    '.wp-ai-tag{font:600 .65rem var(--font-mono);color:var(--wp-gold-d);text-transform:uppercase;letter-spacing:.06em}',
    '.wp-qty{display:flex;gap:6px;align-items:center}',
    '@media (max-width:600px){.wp-dl{grid-template-columns:100px 1fr}}'
  ].join("\n");
  try {
    if (typeof document !== "undefined" && document.head && !(document.getElementById && document.getElementById("wp-css"))) {
      var st = document.createElement("style"); st.id = "wp-css"; st.textContent = CSS; document.head.appendChild(st);
    }
  } catch (e) { /* non-DOM loader */ }

  /* ---------- DOM helpers ---------- */
  function h() { return AX.el.apply(null, arguments); }
  function chip(text, tone) { return h("span", { class: "wp-chip " + String(tone || text).toLowerCase().replace(/\s+/g, "") }, text); }
  function btn(label, fn, cls) { return h("button", { type: "button", class: "wp-btn " + (cls || ""), on: { click: fn } }, label); }
  function dl(pairs) {
    var d = h("dl", { class: "wp-dl" });
    pairs.forEach(function (p) { d.appendChild(h("dt", {}, p[0])); d.appendChild(h("dd", {}, p[1] == null ? "" : p[1])); });
    return d;
  }
  function sel(options, value, onChange, cls) {
    var s = h("select", { class: "wp-sel " + (cls || "") }, options.map(function (o) {
      var v = typeof o === "object" ? o.value : o, l = typeof o === "object" ? o.label : o;
      return h("option", { value: v }, l);
    }));
    if (value != null) s.value = value;
    if (onChange) s.addEventListener("change", function () { onChange(s.value); });
    return s;
  }
  function labeled(text, input) { return h("label", { class: "wp-lab" }, text, input); }
  function sim(text) { AX.ui.toast(text || AX.ui.SIM_DEFAULT, { kind: "sim" }); }
  function card(title, body, cls) { return h("section", { class: "wp-card " + (cls || "") }, title ? h("h3", {}, title) : null, body); }

  /* ---------- session store (per demo mount) ---------- */
  function S(ctx) {
    var cur = ctx.state.get();
    if (!cur.wp) {
      var d = ctx.data;
      ctx.state.set({ wp: {
        bookings: d.bookings.map(function (b) { return Object.assign({}, b); }),
        folios: {}, invoices: [], audit: [], posTickets: d.posTickets.map(function (t) { return Object.assign({}, t); }),
        insights: {}, checkinPick: null, folioPick: null, seq: 1
      } });
    }
    return ctx.state.get().wp;
  }
  function logAudit(ctx, action, entity, ref) {
    S(ctx).audit.unshift({ id: "aud-n" + (S(ctx).seq++), at: ctx.data.today + " " + AX.fmt.time(new Date()), user: "You (demo)", role: "Front Desk", action: action, entity: entity, ref: ref || "", ip: "10.0.0.xx" });
  }
  function bookingById(ctx, id) { return S(ctx).bookings.filter(function (b) { return b.id === id; })[0]; }
  function unitOf(ctx, id) { return ctx.data.units.filter(function (u) { return u.id === id; })[0]; }
  function propOf(ctx, id) { return ctx.data.props.filter(function (p) { return p.id === id; })[0]; }
  function patchBooking(ctx, id, patch) {
    var wp = S(ctx);
    wp.bookings = wp.bookings.map(function (b) { return b.id === id ? Object.assign({}, b, patch) : b; });
  }
  function statusLabel(s) { return s === "checked-in" ? "Checked in" : s === "checked-out" ? "Checked out" : s === "hold" ? "Hold" : "Confirmed"; }

  /* ---------- metrics ---------- */
  function occupancy(ctx, propId, date) {
    var us = ctx.data.units.filter(function (u) { return !propId || u.prop === propId; });
    var ids = {}; us.forEach(function (u) { ids[u.id] = u; });
    var occ = 0, rev = 0;
    S(ctx).bookings.forEach(function (b) { if (ids[b.unit] && b.status !== "hold" && occupiedOn(b, date)) { occ++; rev += b.tariff; } });
    return { occ: occ, total: us.length, pct: us.length ? occ / us.length * 100 : 0, adr: occ ? rev / occ : 0, revpar: us.length ? rev / us.length : 0 };
  }
  function portfolio(ctx, date) { return occupancy(ctx, null, date); }

  /* ---------- booking drawer ---------- */
  function bookingDrawer(ctx, b) {
    b = bookingById(ctx, b.id) || b;
    var u = unitOf(ctx, b.unit), p = propOf(ctx, b.prop);
    var body = h("div", { class: "wp-list" },
      dl([["Reservation", b.id], ["Guest", b.guest], ["Phone", b.phone], ["Email", b.email], ["Property", p && p.name], ["Unit", u ? u.label + " (" + u.id + ")" : b.unit],
        ["Stay", AX.fmt.date(b.start) + " → " + AX.fmt.date(endOf(b)) + " · " + b.nights + (b.nights === 1 ? " night" : " nights")], ["Tariff / night", inr(b.tariff) + " + " + (gstRate(b.tariff) * 100) + "% GST"],
        ["Source", b.source], ["Status", chip(statusLabel(b.status), b.status)]]));
    var d = AX.ui.drawer({ title: b.guest + " · " + b.id, body: body, actions: [
      { label: "Open folio", primary: true, onClick: function () { S(ctx).folioPick = b.id; d.close(); ctx.open("folio"); } },
      { label: b.status === "confirmed" || b.status === "hold" ? "Check in" : "View", onClick: function () { if (b.status === "confirmed" || b.status === "hold") { S(ctx).checkinPick = b.id; d.close(); ctx.open("checkin"); } else d.close(); } },
      { label: "Cancel booking", onClick: function () { sim("Simulated — reservation " + b.id + " not actually cancelled."); } }
    ] });
  }

  /* ---------- dashboard-ish layout helper ---------- */
  function dashShell(host, kpis, charts) {
    var kh = h("div", { class: "ax-kpis" }); host.appendChild(kh);
    AX.charts.kpis(kh, { items: kpis });
    var grid = h("div", { class: "ax-charts" }); host.appendChild(grid);
    charts.forEach(function (c) {
      var slot = h("div", { class: "chart-slot" });
      grid.appendChild(h("section", { class: "ax-card" + (c.wide ? " wide" : "") }, h("h3", { class: "ax-card-title" }, c.title), slot));
      var rest = {}; Object.keys(c).forEach(function (k) { if (k !== "type" && k !== "title" && k !== "wide") rest[k] = c[k]; });
      AX.charts[c.type](slot, rest);
    });
    return grid;
  }

  /* ========== MODULES ========== */

  function dashboardView(ctx) {
    return { type: "custom", render: function (host) {
      var wp = S(ctx), d = ctx.data, today = d.today;
      var tot = portfolio(ctx, today);
      var arrivals = wp.bookings.filter(function (b) { return b.start === today && b.status !== "checked-out"; });
      var departures = wp.bookings.filter(function (b) { return endOf(b) === today && b.status !== "hold"; });
      var labels = [], vals = [];
      for (var i = -6; i <= 7; i++) { var dt = addDays(today, i); labels.push(String(+dt.slice(8))); vals.push(Math.round(portfolio(ctx, dt).pct)); }
      var per = d.props.map(function (p) { return occupancy(ctx, p.id, today); });
      var grid = dashShell(host, [
        { label: "Occupancy tonight", value: Math.round(tot.pct) + "%", delta: 4 }, { label: "ADR", value: tot.adr, format: "inr", delta: 3 },
        { label: "RevPAR", value: tot.revpar, format: "inr", delta: 6 }, { label: "Arrivals / departures today", value: arrivals.length + " / " + departures.length }
      ], [
        { type: "bar", title: "Occupancy % by property (tonight)", labels: d.props.map(function (p) { return p.short; }), values: per.map(function (o) { return Math.round(o.pct); }) },
        { type: "bar", title: "RevPAR by property (Rs)", labels: d.props.map(function (p) { return p.short; }), values: per.map(function (o) { return Math.round(o.revpar); }) },
        { type: "line", title: "Occupancy % - last 6 days and next 7", wide: true, labels: labels, series: [{ name: "Portfolio", points: vals }] }
      ]);
      function list(title, arr, kind) {
        var ul = h("ul", { class: "wp-list" });
        if (!arr.length) ul.appendChild(h("li", {}, "None today"));
        arr.slice(0, 8).forEach(function (b) {
          ul.appendChild(h("li", {}, h("span", {}, h("strong", {}, b.guest), " · ", b.unit, " · ", b.nights + "n"),
            kind === "in" ? btn(b.status === "checked-in" ? "In house" : "Check in", function () { if (b.status !== "checked-in") { wp.checkinPick = b.id; ctx.open("checkin"); } }, "sm") :
              btn("Folio", function () { wp.folioPick = b.id; ctx.open("folio"); }, "sm")));
        });
        return card(title + " (" + arr.length + ")", ul);
      }
      grid.parentNode.appendChild(h("div", { class: "wp-grid2" }, list("Arrivals", arrivals, "in"), list("Departures", departures, "out")));
    } };
  }

  function tapeView(ctx) {
    var wp = S(ctx), d = ctx.data;
    return { type: "tape", start: addDays(d.today, -2), days: 14,
      units: d.units.map(function (u) { return { id: u.id, label: u.label, group: u.group }; }),
      bookings: wp.bookings.filter(function (b) { return b.status !== "checked-out" || endOf(b) > addDays(d.today, -2); }).map(function (b) { return { id: b.id, unit: b.unit, guest: b.guest, start: b.start, nights: b.nights, status: b.status }; }),
      onChange: function (nb) {
        patchBooking(ctx, nb.id, { unit: nb.unit, start: nb.start, nights: nb.nights });
        logAudit(ctx, "Booking extended / moved", "Reservation", nb.id);
        AX.ui.toast("Updated " + nb.guest + " · " + nb.nights + (nb.nights === 1 ? " night" : " nights") + " in " + nb.unit, { kind: "ok" });
      },
      onOpen: function (b) { bookingDrawer(ctx, b); } };
  }

  function bookingsView(ctx) {
    var d = ctx.data, wp = S(ctx);
    return { type: "table", pageSize: 12, qKeys: ["id", "guest", "unit", "source"],
      filters: [{ key: "status", label: "status", options: ["confirmed", "checked-in", "checked-out", "hold"] }, { key: "prop", label: "property", options: d.props.map(function (p) { return p.id; }) }, { key: "source", label: "source", options: d.sources }],
      sort: { key: "start", dir: "asc" },
      columns: [
        { key: "id", label: "Booking", sortable: true }, { key: "guest", label: "Guest", sortable: true }, { key: "unit", label: "Unit", sortable: true },
        { key: "start", label: "Check-in", sortable: true, render: function (r) { return AX.fmt.date(r.start); } },
        { key: "nights", label: "Nights", sortable: true }, { key: "source", label: "Source" },
        { key: "tariff", label: "Tariff", sortable: true, render: function (r) { return inr(r.tariff); } },
        { key: "status", label: "Status", render: function (r) { return chip(statusLabel(r.status), r.status); } }],
      rows: wp.bookings.slice(), onRow: function (r) { bookingDrawer(ctx, r); } };
  }

  function newBookingView(ctx) {
    var d = ctx.data;
    return { type: "form", submit: "Create reservation",
      fields: [
        { key: "guest", label: "Guest name" }, { key: "phone", label: "Phone" },
        { key: "unit", label: "Unit", type: "select", options: d.units.map(function (u) { return { value: u.id, label: u.id + " · " + u.type + " · " + inr(u.tariff) + "/night" }; }) },
        { key: "start", label: "Check-in date", type: "date" }, { key: "nights", label: "Nights", type: "number" },
        { key: "source", label: "Source", type: "select", options: d.sources }
      ],
      onSubmit: function (v) {
        var wp = S(ctx);
        function msg(text, tone) { return h("div", { class: "wp-card", role: "status" }, chip(tone === "bad" ? "Not created" : "Confirmed", tone), " ", text); }
        if (!v.guest || !v.start || !v.nights || v.nights < 1) { AX.ui.toast("Enter guest, check-in date and nights", { kind: "err" }); return msg("Please fill guest name, check-in date and number of nights.", "bad"); }
        var cand = { unit: v.unit, start: v.start, nights: v.nights };
        if (AX.calendar.overlaps(wp.bookings, cand)) {
          AX.ui.toast("That room is already booked for those nights", { kind: "err" });
          return msg(v.unit + " is not free for " + v.nights + " night(s) from " + AX.fmt.date(v.start) + ". Pick another unit or dates.", "bad");
        }
        var u = unitOf(ctx, v.unit);
        var b = { id: "WP-" + (20000 + wp.seq++), unit: u.id, prop: u.prop, guest: v.guest, phone: v.phone || "+91 98xxx x0000", email: "guest@example.in", city: "", start: v.start, nights: v.nights, status: "confirmed", source: v.source, tariff: u.tariff, adults: 2 };
        wp.bookings.push(b);
        logAudit(ctx, "Booking created", "Reservation", b.id);
        return h("div", { class: "wp-card", role: "status" }, chip("Confirmed", "ok"), " ", h("strong", {}, b.id), " created for " + b.guest + " in " + b.unit + ", " + AX.fmt.date(b.start) + " - " + AX.fmt.date(endOf(b)) + ". ",
          btn("View on tape", function () { ctx.open("tape"); }, "sm"));
      } };
  }

  function checkinView(ctx) {
    return { type: "custom", render: function (host) {
      var wp = S(ctx), d = ctx.data;
      var cands = wp.bookings.filter(function (b) { return b.status === "confirmed" || b.status === "hold"; }).sort(function (a, b) { return a.start < b.start ? -1 : 1; }).slice(0, 25);
      var pick = wp.checkinPick || (cands[0] && cands[0].id);
      var box = h("div", { class: "wp-card" });
      var idDone = false, formC = false;
      function draw() {
        box.textContent = "";
        var b = bookingById(ctx, pick);
        var sl = sel(cands.map(function (c) { return { value: c.id, label: c.guest + " · " + c.unit + " · " + AX.fmt.date(c.start) }; }), pick, function (v) { pick = v; wp.checkinPick = v; idDone = false; draw(); });
        sl.setAttribute("aria-label", "Arrival");
        box.appendChild(h("div", { class: "wp-row" }, labeled("Arrival", sl)));
        if (!b) { box.appendChild(h("p", {}, "No pending arrivals.")); return; }
        box.appendChild(dl([["Guest", b.guest], ["Unit", b.unit], ["Stay", AX.fmt.date(b.start) + " → " + AX.fmt.date(endOf(b))], ["Tariff", inr(b.tariff) + " / night"]]));
        var idType = sel(["Aadhaar", "Passport", "Driving licence", "Voter ID"], "Aadhaar");
        box.appendChild(h("div", { style: { marginTop: "14px" } }, labeled("ID type", idType)));
        var drop = h("div", { class: "wp-drop" + (idDone ? " done" : ""), tabindex: "0", role: "button", "data-idcapture": "",
          on: { click: function () { idDone = true; draw(); AX.ui.toast("ID captured (placeholder image)", { kind: "ok" }); } } },
          idDone ? "ID captured ✓  ·  •••• •••• 4821 (masked)" : "Tap to capture guest ID (camera placeholder)");
        box.appendChild(h("div", { style: { margin: "12px 0" } }, drop));
        var tg = h("input", { type: "checkbox", id: "wp-formc", class: "ax-toggle" }); tg.checked = formC;
        tg.addEventListener("change", function () { formC = tg.checked; draw(); });
        box.appendChild(h("label", { class: "wp-row", style: { margin: "6px 0" } }, tg, h("span", {}, "Foreign national - file Form-C")));
        if (formC) box.appendChild(h("div", { class: "wp-grid2", "data-formc": "" }, labeled("Nationality", h("input", { class: "wp-in", value: "United Kingdom" })), labeled("Passport no.", h("input", { class: "wp-in", value: "X•••••812" })),
          labeled("Visa no.", h("input", { class: "wp-in", value: "V•••••204" })), labeled("Arrived from", h("input", { class: "wp-in", value: "London" }))));
        box.appendChild(h("div", { style: { marginTop: "14px" } }, btn("Complete check-in", function () {
          if (!idDone) { AX.ui.toast("Capture the guest ID first", { kind: "err" }); return; }
          patchBooking(ctx, b.id, { status: "checked-in" });
          logAudit(ctx, "Check-in completed", "Reservation", b.id);
          wp.folioPick = b.id; wp.checkinPick = null;
          sim("Simulated — check-in recorded" + (formC ? ", Form-C not filed." : "."));
          box.textContent = "";
          box.appendChild(h("div", { role: "status" }, chip("Checked in", "ok"), " ", h("strong", {}, b.guest), " is now in " + b.unit + ". ", btn("Open folio", function () { ctx.open("folio"); }, "primary sm")));
        }, "primary")));
      }
      draw();
      host.appendChild(box);
    } };
  }

  function folioCalc(ctx, b, f) {
    var room = b.tariff * b.nights, rate = gstRate(b.tariff);
    var posTotal = f.pos.reduce(function (s, l) { return s + l.price * l.qty; }, 0);
    var roomTax = r10(room * rate), posTax = r10(posTotal * 0.05);
    var total = room + roomTax + posTotal + posTax, paid = f.payments.reduce(function (s, p) { return s + p.amount; }, 0);
    return { room: room, rate: rate, posTotal: posTotal, roomTax: roomTax, posTax: posTax, total: total, paid: paid, due: total - paid };
  }
  function getFolio(ctx, b) {
    var wp = S(ctx);
    if (!wp.folios[b.id]) wp.folios[b.id] = { pos: [], payments: [{ mode: "UPI", amount: Math.round(b.tariff * b.nights * 0.3 / 10) * 10, date: b.start, note: "Advance" }], split: false, invoice: null };
    return wp.folios[b.id];
  }

  function invoiceNode(ctx, b, f, t, invNo) {
    var p = propOf(ctx, b.prop), half = (t.rate * 100) / 2, ra = Math.floor(t.roomTax / 2), ra2 = t.roomTax - ra, pa = Math.floor(t.posTax / 2), pa2 = t.posTax - pa;
    var rows = [h("tr", {}, h("td", {}, "Room tariff · " + b.unit + " · " + b.nights + " night(s) × " + inr(b.tariff)), h("td", { class: "r" }, inr(t.room)))];
    f.pos.forEach(function (l) { rows.push(h("tr", {}, h("td", {}, l.name + " × " + l.qty), h("td", { class: "r" }, inr(l.price * l.qty)))); });
    var taxable = t.room + t.posTotal;
    rows.push(h("tr", {}, h("td", {}, h("strong", {}, "Taxable value")), h("td", { class: "r" }, h("strong", {}, inr(taxable)))));
    rows.push(h("tr", {}, h("td", {}, "CGST @ " + half + "% (room)"), h("td", { class: "r" }, inr(ra))));
    rows.push(h("tr", {}, h("td", {}, "SGST @ " + half + "% (room)"), h("td", { class: "r" }, inr(ra2))));
    if (t.posTotal) {
      rows.push(h("tr", {}, h("td", {}, "CGST @ 2.5% (F&B / services)"), h("td", { class: "r" }, inr(pa))));
      rows.push(h("tr", {}, h("td", {}, "SGST @ 2.5% (F&B / services)"), h("td", { class: "r" }, inr(pa2))));
    }
    rows.push(h("tr", { class: "tot" }, h("td", {}, "Invoice total"), h("td", { class: "r", "data-invoice-total": String(t.total) }, inr(t.total))));
    return h("div", { class: "wp-inv", "data-invoice": "" },
      h("div", { class: "wp-row", style: { justifyContent: "space-between" } }, h("div", {}, h("h4", {}, p.name), h("div", { class: "meta" }, p.city + " · GSTIN " + p.gstin)), h("div", { class: "meta" }, h("strong", {}, "TAX INVOICE"), h("br"), invNo, h("br"), AX.fmt.date(ctx.data.today, "long"))),
      h("p", { class: "meta" }, "Billed to: " + b.guest + " · " + b.phone + " · Stay " + AX.fmt.date(b.start) + " - " + AX.fmt.date(endOf(b))),
      h("table", { class: "wp-tbl" }, h("tbody", {}, rows)),
      h("p", { class: "meta" }, "Room slab: tariff " + (b.tariff <= 7500 ? "up to Rs 7,500 → 12% (6% + 6%)" : "above Rs 7,500 → 18% (9% + 9%)") + ". Demo document - not a real tax invoice."));
  }

  function folioView(ctx) {
    return { type: "custom", render: function (host) {
      var wp = S(ctx), d = ctx.data;
      var list = wp.bookings.filter(function (b) { return b.status === "checked-in"; });
      var pick = wp.folioPick && bookingById(ctx, wp.folioPick) ? wp.folioPick : (list[0] && list[0].id);
      var root = h("div", { class: "wp-card" }); host.appendChild(root);
      function draw() {
        root.textContent = "";
        var b = bookingById(ctx, pick);
        var opts = wp.bookings.filter(function (x) { return x.status === "checked-in" || x.id === pick; }).map(function (x) { return { value: x.id, label: x.guest + " · " + x.unit }; });
        var s = sel(opts, pick, function (v) { pick = v; wp.folioPick = v; draw(); }); s.setAttribute("aria-label", "In-house guest");
        root.appendChild(h("div", { class: "wp-row" }, labeled("Folio for", s)));
        if (!b) { root.appendChild(h("p", {}, "No in-house guests.")); return; }
        var f = getFolio(ctx, b), t = folioCalc(ctx, b, f);
        root.appendChild(dl([["Guest", b.guest], ["Unit", b.unit + " · " + propOf(ctx, b.prop).short], ["Stay", AX.fmt.date(b.start) + " → " + AX.fmt.date(endOf(b))], ["GST slab", (t.rate * 100) + "% on room (tariff " + inr(b.tariff) + ")"]]));
        var rows = [h("tr", {}, h("td", {}, "Room · " + b.nights + " night(s) × " + inr(b.tariff)), h("td", { class: "r" }, inr(t.room)))];
        f.pos.forEach(function (l, i) { rows.push(h("tr", {}, h("td", {}, "POS · " + l.name + " × " + l.qty), h("td", { class: "r" }, inr(l.price * l.qty)))); });
        rows.push(h("tr", {}, h("td", {}, "GST on room (" + (t.rate * 100) + "%)"), h("td", { class: "r" }, inr(t.roomTax))));
        if (t.posTotal) rows.push(h("tr", {}, h("td", {}, "GST on POS (5%)"), h("td", { class: "r" }, inr(t.posTax))));
        rows.push(h("tr", { class: "tot" }, h("td", {}, "Folio total"), h("td", { class: "r", "data-folio-total": String(t.total) }, inr(t.total))));
        f.payments.forEach(function (p) { rows.push(h("tr", {}, h("td", {}, "Payment · " + p.mode + " · " + (p.note || "")), h("td", { class: "r" }, "- " + inr(p.amount)))); });
        rows.push(h("tr", { class: "tot" }, h("td", {}, "Balance due"), h("td", { class: "r", "data-folio-due": String(t.due) }, inr(t.due))));
        root.appendChild(h("div", { style: { marginTop: "14px" } }, h("table", { class: "wp-tbl" }, h("tbody", {}, rows))));

        var amt = h("input", { class: "wp-in", type: "number", placeholder: "Amount", style: { width: "110px" }, "aria-label": "Payment amount" });
        var mode = sel(["UPI", "Card", "Cash", "Bank transfer"], "UPI");
        root.appendChild(h("div", { class: "wp-row", style: { marginTop: "14px" } },
          btn("Add POS charge", function () { posPicker(b, f); }),
          amt, mode, btn("Record payment", function () {
            var a = +amt.value; if (!(a > 0)) { AX.ui.toast("Enter a payment amount", { kind: "err" }); return; }
            f.payments.push({ mode: mode.value, amount: a, date: d.today, note: "Counter" }); logAudit(ctx, "Payment recorded", "Folio", b.id); sim("Simulated — payment not actually collected."); draw();
          }),
          btn(f.split ? "Undo room move" : "Split stay (room move)", function () { f.split = !f.split; draw(); }),
          btn("Generate GST invoice", function () { genInvoice(b, f); }, "primary")));

        if (f.split) {
          var half = Math.ceil(b.nights / 2), alt = d.units.filter(function (u) { return u.prop === b.prop && u.id !== b.unit && u.type === unitOf(ctx, b.unit).type; })[0];
          var seg1 = b.tariff * half * (1 + t.rate), seg2 = b.tariff * (b.nights - half) * (1 + t.rate);
          var p1 = Math.min(t.paid, seg1), p2 = Math.max(0, Math.min(t.paid - seg1, seg2));
          root.appendChild(h("div", { style: { marginTop: "14px" }, "data-split": "" }, h("h3", { class: "ax-card-title" }, "Split-stay dues"),
            h("table", { class: "wp-tbl" }, h("thead", {}, h("tr", {}, h("th", {}, "Segment"), h("th", { class: "r" }, "Amount (incl. GST)"), h("th", { class: "r" }, "Paid"), h("th", { class: "r" }, "Due"))),
              h("tbody", {}, h("tr", {}, h("td", {}, b.unit + " · " + half + " night(s)"), h("td", { class: "r" }, inr(seg1)), h("td", { class: "r" }, inr(p1)), h("td", { class: "r" }, inr(seg1 - p1))),
                h("tr", {}, h("td", {}, (alt ? alt.id : "next unit") + " · " + (b.nights - half) + " night(s)"), h("td", { class: "r" }, inr(seg2)), h("td", { class: "r" }, inr(p2)), h("td", { class: "r" }, inr(seg2 - p2)))))));
        }
      }
      function posPicker(b, f) {
        var body = h("ul", { class: "wp-list", "data-pos-menu": "" });
        d.menu.forEach(function (m) {
          body.appendChild(h("li", {}, h("span", {}, m.name, " · ", inr(m.price)), btn("Add", function () {
            var ex = f.pos.filter(function (l) { return l.id === m.id; })[0];
            if (ex) ex.qty++; else f.pos.push({ id: m.id, name: m.name, price: m.price, qty: 1 });
            wp.posTickets.unshift({ id: "kot-n" + wp.seq + m.id, col: "new", title: "KOT #" + (510 + wp.seq++) + " · " + b.unit, sub: m.name + " x1", meta: "Placed just now", tags: ["Room service"] });
            logAudit(ctx, "Folio charge added", "Folio", b.id);
            AX.ui.toast(m.name + " added to folio", { kind: "ok" }); draw();
          }, "sm")));
        });
        var m = AX.ui.modal({ title: "Add POS charge", body: body, actions: [{ label: "Done", primary: true, onClick: function () { m.close(); } }] });
      }
      function genInvoice(b, f) {
        var t = folioCalc(ctx, b, f);
        var no = "WP/2026-27/" + (1100 + wp.invoices.length + 1);
        f.invoice = no;
        wp.invoices = wp.invoices.filter(function (x) { return x.bookingId !== b.id; });
        wp.invoices.unshift({ id: "inv-" + b.id, bookingId: b.id, no: no, date: d.today, guest: b.guest, property: propOf(ctx, b.prop).short, taxable: t.room + t.posTotal, rate: t.rate, cgst: Math.floor((t.roomTax + t.posTax) / 2), sgst: t.roomTax + t.posTax - Math.floor((t.roomTax + t.posTax) / 2), total: t.total, gstin: "Unregistered" });
        logAudit(ctx, "Invoice generated", "Invoice", no);
        var m = AX.ui.modal({ title: "GST invoice " + no, body: invoiceNode(ctx, b, f, t, no), actions: [
          { label: "Send to guest (WhatsApp)", onClick: function () { sim("Simulated — WhatsApp message not sent"); } },
          { label: "Close", primary: true, onClick: function () { m.close(); } }] });
      }
      draw();
    } };
  }

  function boardOf(id, getCards, cols, onMoveLabel) {
    return function (ctx) {
      return { type: "board", columns: cols, cards: getCards(ctx),
        onMove: function (card, col) {
          logAudit(ctx, onMoveLabel, id, card.title);
          var c = cols.filter(function (x) { return x.id === col; })[0];
          AX.ui.toast(card.title + " → " + (c ? c.label : col), { kind: "ok" });
        },
        onOpen: function (card) {
          AX.ui.drawer({ title: card.title, body: h("div", {}, dl([["Detail", card.sub], ["Notes", card.meta], ["Tags", (card.tags || []).join(", ")]]), h("p", { class: "meta" }, "Drag the card between columns, or press M on it to move.")) });
        } };
    };
  }

  function posView(ctx) {
    var cols = [{ id: "new", label: "New" }, { id: "preparing", label: "Preparing" }, { id: "ready", label: "Ready" }, { id: "served", label: "Served" }];
    return { type: "board", columns: cols, cards: S(ctx).posTickets.slice(),
      renderCard: function (c) { return [h("div", { class: "bd-title" }, c.title), h("div", { class: "bd-sub" }, c.sub), h("div", { class: "bd-meta" }, c.meta), c.tags && c.tags.length ? h("div", { class: "bd-tags" }, c.tags.map(function (t) { return h("span", { class: "bd-tag" }, t); })) : null]; },
      onMove: function (card, col) { AX.ui.toast(card.title + " → " + col, { kind: "ok" }); logAudit(ctx, "KOT status changed", "POS", card.title); } };
  }

  function openKV(title, pairs, actions) { return AX.ui.drawer({ title: title, body: dl(pairs), actions: actions }); }

  function inventoryView(ctx) {
    var d = ctx.data;
    return { type: "table", pageSize: 12, qKeys: ["item", "cat", "vendor"], filters: [{ key: "status", label: "status", options: ["OK", "Low", "Reorder"] }, { key: "cat", label: "category", options: ["Linen", "Amenities", "Consumables", "Mini bar", "Pantry", "Housekeeping", "Maintenance", "Kitchen"] }],
      columns: [{ key: "id", label: "SKU" }, { key: "item", label: "Item", sortable: true }, { key: "cat", label: "Category" }, { key: "stock", label: "Stock", sortable: true, render: function (r) { return r.stock + " " + r.unit; } },
        { key: "par", label: "Par level", sortable: true }, { key: "status", label: "Status", render: function (r) { return chip(r.status); } }, { key: "vendor", label: "Vendor" }],
      rows: d.inventory,
      onRow: function (r) { openKV(r.item, [["SKU", r.id], ["Category", r.cat], ["In stock", r.stock + " " + r.unit], ["Par level", r.par], ["Vendor", r.vendor], ["Location", r.property], ["Status", chip(r.status)]], [{ label: "Raise purchase order", primary: true, onClick: function () { sim("Simulated — purchase order not sent to " + r.vendor + "."); } }]); } };
  }
  function laundryView(ctx) {
    return { type: "table", pageSize: 10, qKeys: ["id", "vendor", "kind", "property"], filters: [{ key: "status", label: "status", options: ["Sent", "Washing", "Returned"] }, { key: "property", label: "property", options: ["Hauz Khas", "Gurgaon", "Noida"] }],
      columns: [{ key: "id", label: "Batch", sortable: true }, { key: "property", label: "Property" }, { key: "kind", label: "Type" }, { key: "items", label: "Pieces", sortable: true }, { key: "vendor", label: "Vendor" },
        { key: "sent", label: "Sent", render: function (r) { return AX.fmt.date(r.sent); } }, { key: "due", label: "Due", render: function (r) { return AX.fmt.date(r.due); } }, { key: "status", label: "Status", render: function (r) { return chip(r.status, r.status === "Returned" ? "ok" : r.status === "Washing" ? "warn" : "info"); } },
        { key: "cost", label: "Cost", sortable: true, render: function (r) { return inr(r.cost); } }],
      rows: ctx.data.laundry,
      onRow: function (r) { openKV("Laundry batch " + r.id, [["Property", r.property], ["Contents", r.kind + " · " + r.items + " pieces"], ["Vendor", r.vendor], ["Sent", AX.fmt.date(r.sent)], ["Due back", AX.fmt.date(r.due)], ["Cost", inr(r.cost)], ["Status", chip(r.status)]], [{ label: "Mark received", primary: true, onClick: function () { sim(); } }]); } };
  }
  function guestsView(ctx) {
    return { type: "table", pageSize: 12, qKeys: ["name", "phone", "city", "id"], filters: [{ key: "tier", label: "tier", options: ["Gold", "Silver", "Member"] }],
      columns: [{ key: "id", label: "Guest ID" }, { key: "name", label: "Name", sortable: true }, { key: "phone", label: "Phone" }, { key: "city", label: "City", sortable: true }, { key: "stays", label: "Stays", sortable: true },
        { key: "spend", label: "Lifetime spend", sortable: true, render: function (r) { return inr(r.spend); } }, { key: "tier", label: "Tier", render: function (r) { return chip(r.tier, r.tier === "Gold" ? "warn" : r.tier === "Silver" ? "info" : ""); } }],
      rows: ctx.data.guests,
      onRow: function (r) { openKV(r.name, [["Guest ID", r.id], ["Phone", r.phone], ["Email", r.email], ["City", r.city], ["Total stays", r.stays], ["Lifetime spend", inr(r.spend)], ["Tier", chip(r.tier)], ["Last stay", AX.fmt.date(r.last)], ["Preferred source", r.source], ["ID on file", "Aadhaar •••• 4821 (masked)"]], [{ label: "Send offer (WhatsApp)", onClick: function () { sim("Simulated — WhatsApp message not sent"); } }]); } };
  }

  function messagesView(ctx) {
    return { type: "custom", render: function (host) {
      var c = AX.chat.create(host, { threads: ctx.data.threads, scripts: ctx.data.scripts, onEvent: function (ev, t) { AX.ui.toast("Guest request logged for " + t.name, { kind: "ok" }); } });
      host.addEventListener("click", function (e) {
        var t = e.target.closest && e.target.closest(".cht-thread");
        if (t) c.play(t.getAttribute("data-id"));
      });
      c.play(ctx.data.threads[0].id);
    } };
  }

  function pricingView(ctx) {
    return { type: "custom", render: function (host) {
      var d = ctx.data, occ = 62, prop = d.props[0];
      var types = [{ t: "Studio", base: 3600 }, { t: "1 BHK", base: 5400 }, { t: "2 BHK", base: 7500 }, { t: "Penthouse", base: 9800 }];
      var out = h("div", { class: "wp-rates", "data-rates": "" });
      var lab = h("strong", { "data-occ": "" }, occ + "%");
      var rng = h("input", { type: "range", min: "30", max: "100", value: String(occ), "aria-label": "Forecast occupancy", style: { width: "260px", maxWidth: "100%" } });
      var psel = sel(d.props.map(function (p) { return { value: p.id, label: p.short }; }), prop.id, function (v) { prop = d.props.filter(function (p) { return p.id === v; })[0]; draw(); });
      function factor(o) { return 0.85 + (o - 30) / 70 * 0.55; }
      function draw() {
        out.textContent = "";
        out.style.gridTemplateColumns = "84px repeat(7,minmax(70px,1fr))";
        out.appendChild(h("div", { class: "c h" }, "Room type"));
        var days = [];
        for (var i = 0; i < 7; i++) { var ds = addDays(d.today, i), dow = new Date(parse(ds)).getUTCDay(); days.push({ ds: ds, we: dow === 5 || dow === 6 }); out.appendChild(h("div", { class: "c h" + (days[i].we ? " we" : "") }, AX.fmt.date(ds))); }
        types.forEach(function (ty) {
          out.appendChild(h("div", { class: "c h" }, ty.t));
          days.forEach(function (dy) {
            var rate = Math.round(ty.base * prop.mult * factor(occ) * (dy.we ? 1.12 : 1) / 50) * 50;
            out.appendChild(h("div", { class: "c" + (dy.we ? " we" : ""), "data-rate": String(rate) }, inr(rate), h("br"), h("span", { class: "wp-slab" }, "GST " + (gstRate(rate) * 100) + "%")));
          });
        });
        lab.textContent = occ + "%";
      }
      rng.addEventListener("input", function () { occ = +rng.value; draw(); });
      host.appendChild(card("Dynamic rate grid", h("div", {},
        h("div", { class: "wp-row", style: { marginBottom: "14px" } }, labeled("Property", psel), labeled("Forecast occupancy", h("span", { class: "wp-row" }, rng, lab)), btn("Push rates to channels", function () { sim("Simulated — rates not pushed to OTAs."); }, "primary")),
        out, h("p", { class: "meta", style: { color: "var(--ink-3)", fontSize: ".78rem" } }, "Rates scale with forecast occupancy, with a weekend uplift. The GST slab flips from 12% to 18% above Rs 7,500."))));
      draw();
    } };
  }

  function channelsView(ctx) {
    return { type: "custom", render: function (host) {
      var rows = ctx.data.channels.map(function (r) { return Object.assign({}, r); });
      var tbl = AX.table.create(host, { pageSize: 12, qKeys: ["ota", "property"], filters: [{ key: "status", label: "status", options: ["In sync", "Delayed", "Error"] }, { key: "property", label: "property", options: ["Hauz Khas", "Gurgaon", "Noida"] }],
        columns: [{ key: "ota", label: "Channel", sortable: true }, { key: "property", label: "Property", sortable: true }, { key: "rooms", label: "Mapped units" }, { key: "res7", label: "Reservations (7d)", sortable: true }, { key: "commission", label: "Commission" },
          { key: "last", label: "Last sync" }, { key: "status", label: "Status", render: function (r) { return chip(r.status); } }],
        rows: rows, actions: [{ label: "Sync now", onClick: function (r) { r.status = "In sync"; r.last = "just now"; r.note = ""; tbl.setRows(rows); sim("Simulated — " + r.ota + " (" + r.property + ") sync not actually run."); } }],
        onRow: function (r) { openKV(r.ota + " · " + r.property, [["Status", chip(r.status)], ["Last sync", r.last], ["Mapped units", r.rooms + " / 12"], ["Commission", r.commission], ["Reservations (7d)", r.res7], ["Note", r.note || "No issues"]]); } });
    } };
  }

  function financeView(ctx) {
    return { type: "dashboard",
      kpis: [{ label: "Revenue (MTD)", value: 2486000, format: "inr", delta: 9 }, { label: "Expenses (MTD)", value: 1342000, format: "inr", delta: -2 }, { label: "GOP margin", value: "46%", delta: 3 }, { label: "Outstanding dues", value: 184500, format: "inr" }],
      charts: [
        { type: "line", title: "Revenue vs expenses (14 days, Rs thousand)", wide: true, labels: ctx.data.occSeries.map(function (_, i) { return String(i + 1); }), series: [{ name: "Revenue", points: ctx.data.revSeries }, { name: "Expenses", points: ctx.data.revSeries.map(function (v) { return Math.round(v * 0.55); }) }] },
        { type: "donut", title: "Revenue by department", parts: [{ label: "Rooms", value: 1820000 }, { label: "F&B", value: 382000 }, { label: "Laundry", value: 96000 }, { label: "Other", value: 188000 }] },
        { type: "bar", title: "Expenses by category (Rs)", labels: ["Payroll", "OTA fees", "Utilities", "Supplies", "Repairs"], values: [520000, 301000, 214000, 163000, 98000] }] };
  }
  function gstView(ctx) {
    return { type: "table", pageSize: 12, qKeys: ["no", "guest", "property"], filters: [{ key: "property", label: "property", options: ["Hauz Khas", "Gurgaon", "Noida"] }],
      rows: S(ctx).invoices.concat(ctx.data.invoices),
      columns: [{ key: "no", label: "Invoice", sortable: true }, { key: "date", label: "Date", sortable: true, render: function (r) { return AX.fmt.date(r.date); } }, { key: "guest", label: "Guest" }, { key: "property", label: "Property" },
        { key: "taxable", label: "Taxable", sortable: true, render: function (r) { return inr(r.taxable); } }, { key: "rate", label: "Slab", render: function (r) { return Math.round(r.rate * 100) + "%"; } },
        { key: "cgst", label: "CGST", render: function (r) { return inr(r.cgst); } }, { key: "sgst", label: "SGST", render: function (r) { return inr(r.sgst); } }, { key: "total", label: "Total", sortable: true, render: function (r) { return inr(r.total); } }],
      onRow: function (r) { openKV("Invoice " + r.no, [["Guest", r.guest], ["Property", r.property], ["Guest GSTIN", r.gstin], ["Taxable value", inr(r.taxable)], ["CGST @ " + (r.rate * 50) + "%", inr(r.cgst)], ["SGST @ " + (r.rate * 50) + "%", inr(r.sgst)], ["Total", inr(r.total)]], [{ label: "Export GSTR-1 (CSV)", onClick: function () { sim(); } }]); } };
  }
  function payrollView(ctx) {
    return { type: "custom", render: function (host) {
      var rows = ctx.data.payroll.map(function (r) { return Object.assign({}, r); });
      var tbl = AX.table.create(host, { pageSize: 12, qKeys: ["name", "id", "dept"], filters: [{ key: "dept", label: "department", options: ["Front desk", "Housekeeping", "Kitchen", "Maintenance", "Security", "Management"] }, { key: "status", label: "status", options: ["Paid", "Pending"] }],
        columns: [{ key: "id", label: "Emp ID" }, { key: "name", label: "Name", sortable: true }, { key: "dept", label: "Department" }, { key: "property", label: "Property" }, { key: "present", label: "Days present", sortable: true },
          { key: "gross", label: "Gross", sortable: true, render: function (r) { return inr(r.gross); } }, { key: "deductions", label: "PF/ESI", render: function (r) { return inr(r.deductions); } }, { key: "net", label: "Net pay", sortable: true, render: function (r) { return inr(r.net); } }, { key: "status", label: "Status", render: function (r) { return chip(r.status, r.status === "Paid" ? "ok" : "warn"); } }],
        rows: rows, actions: [{ label: "Pay", onClick: function (r) { if (r.status === "Paid") { AX.ui.toast("Already paid", { kind: "ok" }); return; } r.status = "Paid"; tbl.setRows(rows); sim("Simulated — salary transfer to " + r.name + " not made."); } }] });
    } };
  }
  function ownerView(ctx) {
    return { type: "custom", render: function (host) {
      var owners = [{ id: "own1", prop: "Hauz Khas", owner: "Kapoor Family Trust", gross: 684000 }, { id: "own2", prop: "Gurgaon", owner: "Mehta Realty LLP", gross: 912000 }, { id: "own3", prop: "Noida", owner: "Bansal Holdings", gross: 538000 }]
        .map(function (o) { o.fee = Math.round(o.gross * 0.12); o.exp = Math.round(o.gross * 0.31); o.net = o.gross - o.fee - o.exp; o.status = "Pending"; return o; });
      var grid = dashShell(host, [{ label: "Gross revenue (month)", value: owners.reduce(function (s, o) { return s + o.gross; }, 0), format: "inr", delta: 7 }, { label: "Management fee (12%)", value: owners.reduce(function (s, o) { return s + o.fee; }, 0), format: "inr" },
        { label: "Property expenses", value: owners.reduce(function (s, o) { return s + o.exp; }, 0), format: "inr" }, { label: "Net owner payout", value: owners.reduce(function (s, o) { return s + o.net; }, 0), format: "inr", delta: 5 }], [
        { type: "bar", title: "Net payout by property (Rs)", labels: owners.map(function (o) { return o.prop; }), values: owners.map(function (o) { return o.net; }) },
        { type: "line", title: "Payout trend - last 6 months (Rs thousand)", labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"], series: [{ name: "Net payout", points: [610, 655, 702, 688, 741, 782] }] }]);
      var wrap = h("div", { style: { marginTop: "0" } }); grid.parentNode.appendChild(wrap);
      var tbl = AX.table.create(wrap, { pageSize: 6, columns: [{ key: "owner", label: "Owner" }, { key: "prop", label: "Property" }, { key: "gross", label: "Gross", render: function (r) { return inr(r.gross); } }, { key: "fee", label: "Mgmt fee", render: function (r) { return inr(r.fee); } },
        { key: "exp", label: "Expenses", render: function (r) { return inr(r.exp); } }, { key: "net", label: "Net payout", render: function (r) { return inr(r.net); } }, { key: "status", label: "Status", render: function (r) { return chip(r.status, r.status === "Released" ? "ok" : "warn"); } }],
        rows: owners, actions: [{ label: "Release payout", onClick: function (r) { r.status = "Released"; tbl.setRows(owners); sim("Simulated — payout of " + inr(r.net) + " not transferred."); } }] });
    } };
  }

  function bookingEngineView(ctx) {
    return { type: "custom", render: function (host) {
      var wp = S(ctx), d = ctx.data;
      var st = { prop: d.props[0].id, start: addDays(d.today, 3), nights: 2, adults: 2, picked: null, done: null };
      var root = h("div", { class: "wp-be" }); host.appendChild(root);
      function freeUnits(type) {
        return d.units.filter(function (u) { return u.prop === st.prop && u.type === type && !AX.calendar.overlaps(wp.bookings, { unit: u.id, start: st.start, nights: st.nights }); });
      }
      function draw() {
        root.textContent = "";
        var p = d.props.filter(function (x) { return x.id === st.prop; })[0];
        root.appendChild(h("div", { class: "wp-be-hero" }, h("h3", {}, "Book direct · " + p.name), h("p", {}, "Best rate guaranteed · Free cancellation up to 48 hours before arrival")));
        var body = h("div", { class: "wp-be-body" }); root.appendChild(body);
        if (st.done) {
          body.appendChild(h("div", { role: "status", "data-be-confirmed": "" }, chip("Booking confirmed", "ok"), h("h3", { style: { margin: "10px 0 4px" } }, "Thank you, " + st.done.guest + "!"),
            h("p", {}, "Reference ", h("strong", {}, st.done.id), " · " + st.done.unit + " · " + AX.fmt.date(st.done.start) + " - " + AX.fmt.date(endOf(st.done)) + " · " + inr(st.done.total) + " incl. GST (paid online, simulated)."),
            h("div", { class: "wp-row" }, btn("See it on the tape chart", function () { ctx.open("tape"); }, "primary"), btn("Make another booking", function () { st.done = null; st.picked = null; draw(); }))));
          return;
        }
        var ci = h("input", { class: "wp-in", type: "date", value: st.start, "aria-label": "Check-in" }); ci.addEventListener("change", function () { if (ci.value) { st.start = ci.value; st.picked = null; draw(); } });
        var ns = h("input", { class: "wp-in", type: "number", min: "1", max: "14", value: String(st.nights), style: { width: "80px" }, "aria-label": "Nights" }); ns.addEventListener("change", function () { st.nights = Math.max(1, +ns.value || 1); st.picked = null; draw(); });
        body.appendChild(h("div", { class: "wp-row" }, labeled("Property", sel(d.props.map(function (x) { return { value: x.id, label: x.short }; }), st.prop, function (v) { st.prop = v; st.picked = null; draw(); })), labeled("Check-in", ci), labeled("Nights", ns),
          labeled("Guests", sel(["1", "2", "3", "4"], String(st.adults), function (v) { st.adults = +v; }))));
        var list = h("ul", { class: "wp-list", "data-be-rooms": "" });
        [["Studio", "Compact studio with kitchenette"], ["1 BHK", "Separate bedroom and living room"], ["2 BHK", "Two bedrooms, ideal for families"], ["Penthouse", "Top floor with terrace"]].forEach(function (r) {
          var fu = freeUnits(r[0]), u = d.units.filter(function (x) { return x.prop === st.prop && x.type === r[0]; })[0], tot = u.tariff * st.nights;
          list.appendChild(h("li", {}, h("span", {}, h("strong", {}, r[0]), " · " + r[1], h("br"), h("span", { style: { color: "var(--ink-3)", fontSize: ".78rem" } }, inr(u.tariff) + " / night + " + (gstRate(u.tariff) * 100) + "% GST · " + (fu.length ? fu.length + " left" : "Sold out"))),
            btn(fu.length ? "Select · " + inr(Math.round(tot * (1 + gstRate(u.tariff)))) : "Sold out", function () { if (fu.length) { st.picked = { type: r[0], unit: fu[0], total: Math.round(tot * (1 + gstRate(u.tariff))) }; draw(); } }, st.picked && st.picked.type === r[0] ? "primary" : "")));
        });
        body.appendChild(list);
        if (st.picked) {
          var nm = h("input", { class: "wp-in", placeholder: "Full name", "aria-label": "Guest name" }), ph = h("input", { class: "wp-in", placeholder: "Mobile", "aria-label": "Mobile" }), em = h("input", { class: "wp-in", placeholder: "Email", "aria-label": "Email" });
          body.appendChild(h("div", { class: "wp-grid2" }, labeled("Full name", nm), labeled("Mobile", ph), labeled("Email", em)));
          body.appendChild(h("div", {}, btn("Confirm & pay " + inr(st.picked.total) + " (simulated)", function () {
            if (!nm.value.trim()) { AX.ui.toast("Please enter your name", { kind: "err" }); return; }
            if (AX.calendar.overlaps(wp.bookings, { unit: st.picked.unit.id, start: st.start, nights: st.nights })) { AX.ui.toast("That room was just taken", { kind: "err" }); st.picked = null; draw(); return; }
            var u = st.picked.unit;
            var b = { id: "WP-" + (30000 + wp.seq++), unit: u.id, prop: u.prop, guest: nm.value.trim(), phone: ph.value || "+91 98xxx x0000", email: em.value || "guest@example.in", city: "", start: st.start, nights: st.nights, status: "confirmed", source: "Direct", tariff: u.tariff, adults: st.adults };
            wp.bookings.push(b); logAudit(ctx, "Booking created (web)", "Reservation", b.id);
            sim("Simulated — payment not charged, confirmation not sent.");
            st.done = Object.assign({}, b, { total: st.picked.total }); draw();
          }, "primary")));
        }
      }
      draw();
    } };
  }

  function aiView(ctx) {
    var cards = [
      { id: "i1", tag: "Pricing", t: "Raise Hauz Khas weekend rates by 8%", b: "Forecast occupancy for Fri-Sat is 91%. Comparable listings nearby are 11% higher. Estimated +Rs 18,400 revenue." , a: "Apply to rate plan" },
      { id: "i2", tag: "Operations", t: "Housekeeping is 3 rooms behind for 2 PM arrivals", b: "Gurgaon has 5 dirty units and 2 arrivals before 2 PM. Reassign Pappu from Noida for 90 minutes.", a: "Reassign staff" },
      { id: "i3", tag: "Risk", t: "3 bookings look like no-shows", b: "Booking.com reservations with no pre-arrival reply and a late-night arrival. Send a confirmation nudge.", a: "Send WhatsApp nudge" },
      { id: "i4", tag: "Revenue", t: "Offer early check-in upsell to 6 guests", b: "Their rooms are clean and ready. A Rs 500 upsell has a 38% acceptance rate for this segment.", a: "Send offers" },
      { id: "i5", tag: "Channels", t: "Expedia sync is failing for Hauz Khas", b: "Penthouse rate plan mapping is missing. Inventory may be out of date on 1 channel.", a: "Open channels" },
      { id: "i6", tag: "Finance", t: "GST slab check: 4 tariffs sit near Rs 7,500", b: "Penthouse rates crossing Rs 7,500 move to the 18% slab. Review 2 BHK promo pricing.", a: "Review pricing" }];
    return { type: "custom", render: function (host) {
      var wp = S(ctx), grid = h("div", { class: "wp-grid2" }); host.appendChild(grid);
      function draw() {
        grid.textContent = "";
        cards.forEach(function (c) {
          var done = wp.insights[c.id];
          grid.appendChild(h("section", { class: "wp-card wp-ins" + (done ? " done" : ""), "data-insight": c.id }, h("div", { class: "wp-ai-tag" }, "AI insight · " + c.tag), h("h3", { style: { fontSize: "1rem", color: "var(--ink)", margin: "6px 0" } }, c.t), h("p", { style: { margin: "0 0 12px", fontSize: ".875rem", color: "var(--ink-2)" } }, c.b),
            done ? chip(done === "applied" ? "Applied" : "Dismissed", "ok") : h("div", { class: "wp-row" }, btn(c.a, function () {
              wp.insights[c.id] = "applied"; sim("Simulated — suggestion not actually applied."); logAudit(ctx, "AI insight applied", "AI", c.id); if (c.id === "i5") ctx.open("channels"); else draw();
            }, "primary sm"), btn("Dismiss", function () { wp.insights[c.id] = "dismissed"; draw(); }, "sm"))));
        });
      }
      draw();
    } };
  }
  function reportsView(ctx) {
    var d = ctx.data;
    var counts = {}; S(ctx).bookings.forEach(function (b) { counts[b.source] = (counts[b.source] || 0) + 1; });
    return { type: "dashboard",
      kpis: [{ label: "Revenue (30 days)", value: 7814000, format: "inr", delta: 8 }, { label: "Avg occupancy", value: "78%", delta: 4 }, { label: "ADR", value: 5920, format: "inr", delta: 2 }, { label: "Cancellation rate", value: "6.4%", delta: -1 }],
      charts: [
        { type: "line", title: "Occupancy % - 14 days", wide: true, labels: d.occSeries.map(function (_, i) { return String(i + 1); }), series: [{ name: "Occupancy", points: d.occSeries }] },
        { type: "donut", title: "Reservations by source", parts: Object.keys(counts).map(function (k) { return { label: k, value: counts[k] }; }) },
        { type: "bar", title: "ADR by property (Rs)", labels: d.props.map(function (p) { return p.short; }), values: [5210, 6140, 4720] },
        { type: "bar", title: "Revenue by property (Rs lakh)", horizontal: true, labels: d.props.map(function (p) { return p.short; }), values: [24, 31, 18] }] };
  }
  function auditView(ctx) {
    return { type: "table", pageSize: 12, qKeys: ["user", "action", "ref", "entity"], filters: [{ key: "entity", label: "entity", options: ["Reservation", "Folio", "Invoice", "Pricing", "Housekeeping", "Channel", "System", "User", "Payment", "POS", "AI", "Maintenance"] }, { key: "role", label: "role", options: ["Front Desk", "Manager", "Accountant", "Housekeeping Lead", "Owner", "System"] }],
      rows: S(ctx).audit.concat(ctx.data.audit),
      columns: [{ key: "at", label: "When", sortable: true }, { key: "user", label: "User" }, { key: "role", label: "Role" }, { key: "action", label: "Action", sortable: true }, { key: "entity", label: "Entity" }, { key: "ref", label: "Reference" }, { key: "ip", label: "IP" }],
      onRow: function (r) { openKV(r.action, [["When", r.at], ["User", r.user + " (" + r.role + ")"], ["Entity", r.entity], ["Reference", r.ref], ["IP", r.ip], ["Change", "Before / after snapshot stored in audit log"]]); } };
  }

  var hkCols = [{ id: "dirty", label: "Dirty" }, { id: "progress", label: "In progress" }, { id: "clean", label: "Clean" }, { id: "inspected", label: "Inspected" }];
  var mtCols = [{ id: "open", label: "Open" }, { id: "assigned", label: "Assigned" }, { id: "progress", label: "In progress" }, { id: "resolved", label: "Resolved" }];

  AX.demos[SLUG] = {
    brand: { name: "Woodpecker PMS", accent: "#B8873A", logoText: "W" },
    start: "dashboard",
    modules: [
      { id: "dashboard", label: "Dashboard", icon: "dashboard", group: "Front desk", view: dashboardView },
      { id: "tape", label: "Tape chart", icon: "calendar", group: "Front desk", view: tapeView },
      { id: "bookings", label: "Bookings", icon: "table", group: "Front desk", view: bookingsView },
      { id: "new-booking", label: "New booking", icon: "form", group: "Front desk", view: newBookingView },
      { id: "checkin", label: "Check-in", icon: "users", group: "Front desk", view: checkinView },
      { id: "folio", label: "Folio & invoice", icon: "wallet", group: "Front desk", view: folioView },
      { id: "housekeeping", label: "Housekeeping", icon: "bed", group: "Operations", view: boardOf("Housekeeping", function (ctx) { return ctx.data.housekeeping.slice(); }, hkCols, "Room status changed") },
      { id: "maintenance", label: "Maintenance", icon: "settings", group: "Operations", view: boardOf("Maintenance", function (ctx) { return ctx.data.maintenance.slice(); }, mtCols, "Ticket status changed") },
      { id: "pos", label: "POS / kitchen", icon: "cart", group: "Operations", view: posView },
      { id: "inventory", label: "Inventory", icon: "box", group: "Operations", view: inventoryView },
      { id: "laundry", label: "Laundry", icon: "flask", group: "Operations", view: laundryView },
      { id: "guests", label: "Guests", icon: "users", group: "Guests", view: guestsView },
      { id: "messages", label: "Messages", icon: "chat", group: "Guests", view: messagesView },
      { id: "pricing", label: "Dynamic pricing", icon: "chart", group: "Revenue", view: pricingView },
      { id: "channels", label: "OTA channels", icon: "flow", group: "Revenue", view: channelsView },
      { id: "booking-engine", label: "Booking engine", icon: "store", group: "Revenue", view: bookingEngineView },
      { id: "ai", label: "AI insights", icon: "star", group: "Revenue", view: aiView },
      { id: "finance", label: "Finance", icon: "wallet", group: "Back office", view: financeView },
      { id: "gst", label: "GST register", icon: "file", group: "Back office", view: gstView },
      { id: "payroll", label: "Payroll", icon: "users", group: "Back office", view: payrollView },
      { id: "owner", label: "Owner portal", icon: "home", group: "Back office", view: ownerView },
      { id: "reports", label: "Reports", icon: "chart", group: "Back office", view: reportsView },
      { id: "audit", label: "Audit log", icon: "bell", group: "Back office", view: auditView }
    ]
  };
})(window);
