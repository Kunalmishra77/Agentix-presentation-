(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.demos = AX.demos || {};

  /* Pure helpers (no DOM). */
  var DAY = 86400000;
  function parse(s) { var p = String(s).split("-"); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iso(ms) { var d = new Date(ms); return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()); }
  function nightsBetween(a, b) { return Math.round((parse(b) - parse(a)) / DAY); }
  function addDays(s, n) { return iso(parse(s) + n * DAY); }
  /** Pure: why a room cannot be booked for [start, start+nights), or null when free. occupied = [{unit,start,nights,kind,reason}] */
  function unavailableReason(room, occupied, start, nights, adults, children) {
    if (!room.active) return "Closed for the season";
    if (adults > room.maxAdults || children > room.maxChildren) return "Sleeps " + room.maxAdults + " adults, " + room.maxChildren + " children";
    var cand = { unit: room.id, start: start, nights: nights };
    if (!AX.calendar.overlaps(occupied.filter(function (o) { return o.kind === "blocked"; }), cand)) {
      if (!AX.calendar.overlaps(occupied.filter(function (o) { return o.kind === "booking"; }), cand)) return null;
      return "Already booked for these dates";
    }
    var hit = occupied.filter(function (o) { return o.kind === "blocked" && o.unit === room.id && AX.calendar.overlaps([o], cand); })[0];
    return "Blocked: " + (hit && hit.reason || "not available");
  }
  AX.kaaya = { nightsBetween: nightsBetween, addDays: addDays, unavailableReason: unavailableReason };

  if (typeof document === "undefined" || !document.getElementById) return;
  var el = AX.el, SLUG = "kaaya-eco-resort", ACCENT = "#2F5D3A";

  var CSS = [
    '.kz-card{background:#fff;border:1px solid var(--ax-line);border-radius:14px;padding:20px;max-width:880px}',
    '.kz-card h3{margin:0 0 6px;font:700 18px var(--font-display)}.kz-card p.sub{margin:0 0 14px;color:var(--ink-3);font-size:13px}',
    '.kz-steps{display:flex;gap:6px;margin-bottom:14px}.kz-steps span{flex:1;text-align:center;font:600 11px var(--font-mono);padding:6px 0;border-bottom:3px solid #E5E7EB;color:var(--ink-3);text-transform:uppercase}.kz-steps span.on{border-color:var(--ax-accent);color:var(--ax-accent)}',
    '.kz-fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}',
    '.kz-f{display:flex;flex-direction:column;gap:4px;font:600 11px var(--font-mono);color:var(--ink-3);text-transform:uppercase}',
    '.kz-f input,.kz-f select,.kz-f textarea{padding:10px 12px;border:1px solid var(--ax-line);border-radius:8px;font:400 15px var(--font-body);text-transform:none;color:var(--ink);background:#fff}',
    '.kz-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:14px}',
    '.kz-btn{appearance:none;font:700 13px var(--font-body);padding:10px 20px;border-radius:999px;border:1px solid var(--ax-accent);background:var(--ax-accent);color:#fff;cursor:pointer}',
    '.kz-btn.ghost{background:#fff;color:var(--ax-accent)}.kz-btn[disabled]{opacity:.4;cursor:not-allowed}',
    '.kz-err{color:#B42318;font-size:13px;margin-top:8px}',
    '.kz-rooms{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}',
    '.kz-room{border:1.5px solid var(--ax-line);border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:6px;background:#fff}',
    '.kz-room[data-available="false"]{opacity:.62;background:#F7F7F5}.kz-room[data-available="true"]:hover{border-color:var(--ax-accent)}',
    '.kz-room b{font:700 15px var(--font-display)}.kz-room small{color:var(--ink-3);font-size:12px}',
    '.kz-ph{height:70px;border-radius:10px;background:linear-gradient(135deg,#2F5D3A,#8DB48E)}',
    '.kz-tag{display:inline-block;font:700 11px var(--font-mono);padding:2px 8px;border-radius:6px;background:#E8F2EA;color:#2F5D3A;align-self:flex-start}.kz-tag.no{background:#FEE9E7;color:#B42318}',
    '.kz-sum{background:#F5F8F4;border:1px solid #D7E5D9;border-radius:12px;padding:14px;margin-bottom:14px;font-size:14px}.kz-sum div{display:flex;justify-content:space-between;gap:10px;padding:2px 0}.kz-sum .t{border-top:1px solid #D7E5D9;margin-top:6px;padding-top:8px;font-weight:700}',
    '.kz-ref{font:700 30px var(--font-display);letter-spacing:.04em;color:var(--ax-accent);margin:6px 0 12px}',
    '.kz-chip{display:inline-block;font:700 11px var(--font-mono);padding:2px 8px;border-radius:6px;background:#EEF0F3;color:#475467}',
    '.kz-chip.CONFIRMED,.kz-chip.CHECKED_OUT,.kz-chip.approved,.kz-chip.Active{background:#DCFCE7;color:#166534}.kz-chip.PENDING,.kz-chip.unread,.kz-chip.hidden{background:#FEF3D7;color:#8A5A00}.kz-chip.CANCELLED{background:#FEE9E7;color:#B42318}.kz-chip.CHECKED_IN{background:#DBEAFE;color:#1E40AF}',
    '.kz-dl{display:grid;grid-template-columns:120px 1fr;gap:8px 12px;margin:0;font-size:14px}.kz-dl dt{color:var(--ink-3);font:600 12px var(--font-mono);text-transform:uppercase}.kz-dl dd{margin:0}',
    '.kz-gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px}',
    '.kz-tile{border:1px solid var(--ax-line);border-radius:12px;overflow:hidden;background:#fff}.kz-tile[data-active="false"]{opacity:.5}',
    '.kz-img{height:96px;display:grid;place-items:center;color:#fff;font:700 13px var(--font-display);text-transform:uppercase;letter-spacing:.1em}',
    '.kz-tb{padding:10px;display:flex;flex-direction:column;gap:6px;font-size:13px}.kz-tb small{color:var(--ink-3)}',
    '.kz-star{color:#D4A017;letter-spacing:1px}',
    '.kz-blockform{margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;align-items:end}'
  ].join("\n");
  function injectCss() {
    if (document.getElementById("kz-css")) return;
    var s = document.createElement("style"); s.id = "kz-css";
    s.textContent = CSS + '\n.ax-app[data-slug="' + SLUG + '"],.demo-scope[data-slug="' + SLUG + '"]{--orange:' + ACCENT + '}';
    document.head.appendChild(s);
  }
  injectCss();
  function scope() {
    return el("div", { class: "demo-scope", "data-slug": SLUG, style: { "--ax-accent": ACCENT, "--ax-line": "rgba(11,31,51,.12)", "--orange": ACCENT } }, Array.prototype.slice.call(arguments));
  }
  function chip(v, label) { return el("span", { class: "kz-chip " + v }, label || v); }
  function usd(n) { return "$" + AX.fmt.num(Math.round(n)); }
  function field(label, node) { return el("label", { class: "kz-f" }, label, node); }
  function input(attrs, val) { var i = el("input", attrs); if (val != null) i.value = val; return i; }

  /* ---- shared session state: bookings + blocked made during the demo ---- */
  function sessionBookings(ctx) { return ctx.state.get().bookings || []; }
  function allBookings(ctx) { return sessionBookings(ctx).slice().reverse().concat(ctx.data.bookings); }
  function allBlocked(ctx) { return ctx.data.blocked.concat(ctx.state.get().blocked || []); }
  function occupiedList(ctx) {
    var list = [];
    allBlocked(ctx).forEach(function (b) { list.push({ id: b.id, unit: b.unit, start: b.start, nights: b.nights, kind: "blocked", reason: b.reason }); });
    allBookings(ctx).forEach(function (b) { if (b.status !== "CANCELLED") list.push({ id: b.id, unit: b.unit, start: b.start, nights: b.nights, kind: "booking" }); });
    return list;
  }

  function site(host, ctx) {
    injectCss();
    AX.embed.create(host, AX.embed.optsForSlug(SLUG));
  }

  /* ---- booking widget: dates -> rooms -> details -> payment -> confirmation ---- */
  function book(host, ctx) {
    injectCss();
    var d = ctx.data;
    var s = { step: 0, in: "2026-12-10", out: "2026-12-13", adults: 2, children: 0, room: null, name: d.guest.name, email: d.guest.email, phone: d.guest.phone, req: "", ref: null };
    var root = el("div", { class: "kz-card", "data-step": "dates" });
    host.appendChild(root);
    var NAMES = ["Dates", "Rooms", "Guest", "Payment", "Done"];
    function stepper() { return el("div", { class: "kz-steps", "aria-hidden": "true" }, NAMES.map(function (n, i) { return el("span", { class: i <= s.step ? "on" : "" }, n); })); }
    function nights() { return nightsBetween(s.in, s.out); }
    function price() { var sub = nights() * s.room.price, tax = Math.round(sub * d.taxRate); return { sub: sub, tax: tax, total: sub + tax }; }
    function head(title, sub, key) { root.textContent = ""; root.setAttribute("data-step", key); root.appendChild(stepper()); root.appendChild(el("h3", {}, title)); root.appendChild(el("p", { class: "sub" }, sub)); }

    function dates(err) {
      head("Check availability", "Blocked dates and existing bookings are excluded automatically.", "dates");
      var di = input({ type: "date", "aria-label": "Check-in", id: "kz-in" }, s.in), dout = input({ type: "date", "aria-label": "Check-out", id: "kz-out" }, s.out);
      var ad = input({ type: "number", min: "1", max: "6", "aria-label": "Adults" }, s.adults), ch = input({ type: "number", min: "0", max: "4", "aria-label": "Children" }, s.children);
      root.appendChild(el("div", { class: "kz-fields" }, field("Check-in", di), field("Check-out", dout), field("Adults", ad), field("Children", ch)));
      if (err) root.appendChild(el("div", { class: "kz-err", role: "alert" }, err));
      root.appendChild(el("div", { class: "kz-row" }, el("button", { type: "button", class: "kz-btn", "data-act": "search", on: { click: function () {
        s.in = di.value; s.out = dout.value; s.adults = +ad.value || 1; s.children = +ch.value || 0;
        if (!s.in || !s.out || nights() < 1) return dates("Check-out must be after check-in.");
        s.step = 1; rooms();
      } } }, "Search rooms")));
    }
    function rooms() {
      head("Available rooms", s.in + " to " + s.out + " · " + nights() + " night" + (nights() > 1 ? "s" : "") + " · " + s.adults + " adults, " + s.children + " children", "rooms");
      var occ = occupiedList(ctx), grid = el("div", { class: "kz-rooms" }), free = 0;
      d.rooms.filter(function (r) { return r.active; }).forEach(function (r) {
        var why = unavailableReason(r, occ, s.in, nights(), s.adults, s.children), ok = !why;
        if (ok) free++;
        grid.appendChild(el("div", { class: "kz-room", "data-room": r.id, "data-available": String(ok) },
          el("div", { class: "kz-ph", "aria-hidden": "true" }), el("b", {}, r.name), el("small", {}, d.types[r.type] + " · sleeps " + r.maxAdults + " · " + r.amenities.slice(0, 2).join(", ")),
          el("span", { class: "kz-tag" + (ok ? "" : " no") }, ok ? usd(r.price) + " per night" : why),
          ok ? el("small", {}, usd(nights() * r.price) + " for " + nights() + " nights before taxes") : null,
          el("button", { type: "button", class: "kz-btn", "data-select": r.id, disabled: ok ? null : "", on: { click: function () { if (!ok) return; s.room = r; s.step = 2; guest(); } } }, ok ? "Select room" : "Unavailable")));
      });
      root.appendChild(grid);
      root.appendChild(el("p", { class: "sub", style: { marginTop: "10px" } }, free + " of " + d.rooms.filter(function (r) { return r.active; }).length + " rooms available."));
      root.appendChild(el("div", { class: "kz-row" }, el("button", { type: "button", class: "kz-btn ghost", on: { click: function () { s.step = 0; dates(); } } }, "Change dates")));
    }
    function guest(err) {
      head("Guest details", s.room.name + " · " + s.in + " to " + s.out, "guest");
      var nm = input({ type: "text", "aria-label": "Full name" }, s.name), em = input({ type: "email", "aria-label": "Email" }, s.email), ph = input({ type: "tel", "aria-label": "Phone" }, s.phone);
      var rq = el("textarea", { rows: "3", "aria-label": "Special requests" }); rq.value = s.req;
      root.appendChild(el("div", { class: "kz-fields" }, field("Full name", nm), field("Email", em), field("Phone", ph)));
      root.appendChild(el("div", { style: { marginTop: "12px" } }, field("Special requests", rq)));
      if (err) root.appendChild(el("div", { class: "kz-err", role: "alert" }, err));
      root.appendChild(el("div", { class: "kz-row" },
        el("button", { type: "button", class: "kz-btn ghost", on: { click: function () { s.step = 1; rooms(); } } }, "Back"),
        el("button", { type: "button", class: "kz-btn", "data-act": "to-pay", on: { click: function () {
          s.name = nm.value.trim(); s.email = em.value.trim(); s.phone = ph.value.trim(); s.req = rq.value.trim();
          if (s.name.length < 2 || !/@/.test(s.email)) return guest("Enter your name and a valid email.");
          s.step = 3; pay();
        } } }, "Continue to payment")));
    }
    function summary() {
      var p = price();
      return el("div", { class: "kz-sum" },
        el("div", {}, el("span", {}, s.room.name), el("span", {}, s.in + " to " + s.out)),
        el("div", {}, el("span", {}, nights() + " night" + (nights() > 1 ? "s" : "") + " x " + usd(s.room.price)), el("span", {}, usd(p.sub))),
        el("div", {}, el("span", {}, "Taxes and service (12%)"), el("span", {}, usd(p.tax))),
        el("div", { class: "t" }, el("span", {}, "Total"), el("span", {}, usd(p.total))));
    }
    function pay() {
      head("Payment", "Mock payment. No card is charged and nothing is stored.", "payment");
      root.appendChild(summary());
      root.appendChild(el("div", { class: "kz-fields" },
        field("Card number", input({ type: "text", "aria-label": "Card number", inputmode: "numeric" }, "4242 4242 4242 4242")),
        field("Expiry", input({ type: "text", "aria-label": "Expiry" }, "12 / 29")), field("CVC", input({ type: "text", "aria-label": "CVC" }, "123"))));
      root.appendChild(el("div", { class: "kz-row" },
        el("button", { type: "button", class: "kz-btn ghost", on: { click: function () { s.step = 2; guest(); } } }, "Back"),
        el("button", { type: "button", class: "kz-btn", "data-act": "pay", on: { click: function () {
          var seq = 1001 + d.bookings.length + sessionBookings(ctx).length, p = price();
          var b = { id: "KAY-2026-" + seq, unit: s.room.id, roomName: s.room.name, start: s.in, nights: nights(), checkIn: s.in, checkOut: s.out, adults: s.adults, children: s.children,
            guestName: s.name, guestEmail: s.email, guestPhone: s.phone, total: p.total, status: "CONFIRMED", requests: s.req, paid: true, fresh: true };
          ctx.state.set({ bookings: sessionBookings(ctx).concat([b]), lastRef: b.id });
          s.ref = b.id; s.step = 4;
          AX.ui.toast("Simulated — mock payment, booking exists only in this demo", { kind: "sim" });
          done();
        } } }, "Pay " + usd(price().total))));
    }
    function done() {
      head("Booking confirmed", "A confirmation email would go to " + s.email + " (simulated).", "done");
      root.appendChild(el("div", { class: "kz-ref", "data-ref": s.ref }, s.ref));
      root.appendChild(summary());
      root.appendChild(el("div", { class: "kz-row" },
        el("button", { type: "button", class: "kz-btn", "data-act": "view", on: { click: function () { ctx.open("my-bookings"); } } }, "View in My bookings"),
        el("button", { type: "button", class: "kz-btn ghost", on: { click: function () { ctx.open("admin-bookings"); } } }, "See it in Admin"),
        el("button", { type: "button", class: "kz-btn ghost", on: { click: function () { s.step = 0; s.room = null; s.ref = null; s.in = "2026-12-20"; s.out = "2026-12-23"; dates(); } } }, "Book another stay")));
    }
    dates();
  }

  function bookingDrawer(b, ctx, admin) {
    var acts = [];
    if (b.status !== "CANCELLED" && b.status !== "CHECKED_OUT") acts.push(el("button", { type: "button", class: "kz-btn ghost", on: { click: function () { b.status = "CANCELLED"; AX.ui.toast("Simulated — booking cancelled in this demo only", { kind: "sim" }); } } }, "Cancel booking"));
    if (admin && b.status === "CONFIRMED") acts.push(el("button", { type: "button", class: "kz-btn", on: { click: function () { b.status = "CHECKED_IN"; AX.ui.toast("Simulated — guest checked in", { kind: "sim" }); } } }, "Check in"));
    return scope(el("dl", { class: "kz-dl" },
      el("dt", {}, "Reference"), el("dd", {}, b.id), el("dt", {}, "Room"), el("dd", {}, b.roomName), el("dt", {}, "Stay"), el("dd", {}, b.checkIn + " to " + b.checkOut + " (" + b.nights + " nights)"),
      el("dt", {}, "Guests"), el("dd", {}, b.adults + " adults, " + b.children + " children"), el("dt", {}, "Guest"), el("dd", {}, b.guestName + " · " + b.guestEmail),
      el("dt", {}, "Total"), el("dd", {}, usd(b.total) + (b.paid ? " (paid)" : "")), el("dt", {}, "Status"), el("dd", {}, chip(b.status)),
      el("dt", {}, "Requests"), el("dd", {}, b.requests || "None")),
      acts.length ? el("div", { class: "kz-row" }, acts) : null);
  }
  function bookingCols() {
    return [{ key: "id", label: "Reference", sortable: true }, { key: "roomName", label: "Room", sortable: true }, { key: "checkIn", label: "Check-in", sortable: true }, { key: "checkOut", label: "Check-out" },
      { key: "nights", label: "Nights" }, { key: "total", label: "Total", sortable: true, render: function (r) { return usd(r.total); } }, { key: "status", label: "Status", render: function (r) { return chip(r.status); } }];
  }

  function adminBlocked(host, ctx) {
    injectCss();
    var d = ctx.data;
    function events() {
      var ev = [];
      allBlocked(ctx).forEach(function (b) {
        var room = d.rooms.filter(function (r) { return r.id === b.unit; })[0];
        for (var i = 0; i < b.nights; i++) ev.push({ id: b.id + "-" + i, date: addDays(b.start, i), title: room.name.split(" ")[0] + ": " + b.reason, tone: "orange" });
      });
      return ev;
    }
    var calHost = el("div");
    var cal = AX.calendar.month(calHost, { month: "2026-12", events: events() });
    var room = el("select", { "aria-label": "Room" }, d.rooms.map(function (r) { return el("option", { value: r.id }, r.name); }));
    var from = input({ type: "date", "aria-label": "From" }, "2026-12-28"), n = input({ type: "number", min: "1", max: "30", "aria-label": "Nights" }, 2), why = input({ type: "text", "aria-label": "Reason", placeholder: "Reason" }, "Pest control");
    var form = el("div", { class: "kz-blockform" }, field("Room", room), field("From", from), field("Nights", n), field("Reason", why),
      el("button", { type: "button", class: "kz-btn", "data-act": "block", on: { click: function () {
        var cur = ctx.state.get().blocked || [];
        var nb = { id: "BL-" + (10 + cur.length + d.blocked.length), unit: room.value, start: from.value, nights: Math.max(1, +n.value || 1), reason: why.value || "Blocked" };
        ctx.state.set({ blocked: cur.concat([nb]) });
        cal.setEvents(events());
        AX.ui.toast("Simulated — dates blocked in this demo; the booking widget now excludes them", { kind: "sim" });
      } } }, "Block dates"));
    host.appendChild(el("div", {}, el("p", { style: { margin: "0 0 10px", color: "var(--ink-3)", fontSize: "13px" } }, "Blocked dates (maintenance, private functions) are removed from the booking widget. Drag an item to move a day."), calHost, form));
  }

  var HUES = { rooms: "#2F5D3A", safari: "#8A5A2B", dining: "#A8442F", grounds: "#3B7A57", experiences: "#2B5F7A" };
  function adminGallery(host, ctx) {
    injectCss();
    var items = ctx.data.gallery;
    var grid = el("div", { class: "kz-gal" });
    function draw() {
      grid.textContent = "";
      items.slice().sort(function (a, b) { return a.sortOrder - b.sortOrder; }).forEach(function (g, idx, arr) {
        grid.appendChild(el("div", { class: "kz-tile", "data-active": String(g.active), "data-id": g.id },
          el("div", { class: "kz-img", style: { background: "linear-gradient(135deg," + HUES[g.category] + ",#C7D8C9)" } }, g.category),
          el("div", { class: "kz-tb" }, el("b", {}, g.caption), el("small", {}, g.category + " · order " + g.sortOrder),
            el("div", { style: { display: "flex", gap: "6px", flexWrap: "wrap" } },
              el("button", { type: "button", class: "kz-btn ghost", "aria-label": "Move up", disabled: idx === 0 ? "" : null, on: { click: function () { var p = arr[idx - 1], t = p.sortOrder; p.sortOrder = g.sortOrder; g.sortOrder = t; draw(); } } }, "Up"),
              el("button", { type: "button", class: "kz-btn ghost", "aria-label": "Move down", disabled: idx === arr.length - 1 ? "" : null, on: { click: function () { var nx = arr[idx + 1], t = nx.sortOrder; nx.sortOrder = g.sortOrder; g.sortOrder = t; draw(); } } }, "Down"),
              el("button", { type: "button", class: "kz-btn", on: { click: function () { g.active = !g.active; AX.ui.toast("Simulated — " + (g.active ? "published to" : "hidden from") + " the gallery in this demo only", { kind: "sim" }); draw(); } } }, g.active ? "Hide" : "Show")))));
      });
    }
    host.appendChild(el("div", {}, el("div", { class: "kz-row", style: { marginTop: "0", marginBottom: "12px" } },
      el("button", { type: "button", class: "kz-btn", on: { click: function () { AX.ui.toast("Simulated — upload to the image CDN skipped", { kind: "sim" }); } } }, "Upload image"),
      el("span", { style: { color: "var(--ink-3)", fontSize: "13px" } }, items.length + " images · reorder, hide or show")), grid));
    draw();
  }

  AX.demos[SLUG] = {
    brand: { name: "Kaaya Eco Resort", accent: ACCENT, logoText: "K" },
    start: "site",
    modules: [
      { id: "site", label: "Live website", icon: "home", group: "Guest site", view: { type: "custom", render: site } },
      { id: "book", label: "Book a stay", icon: "calendar", group: "Guest site", view: { type: "custom", render: book } },
      { id: "my-bookings", label: "My bookings", icon: "bed", group: "Guest account", view: function (ctx) {
        var g = ctx.data.guest.email;
        var rows = sessionBookings(ctx).slice().reverse().concat(ctx.data.bookings.filter(function (b) { return b.guestEmail === g; }));
        return { type: "table", pageSize: 8, rows: rows, qKeys: ["id", "roomName"], filters: [{ key: "status", label: "status", options: ["CONFIRMED", "PENDING", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"] }], columns: bookingCols(), drawer: function (r, c) { return bookingDrawer(r, c, false); } };
      } },
      { id: "admin-bookings", label: "Bookings", icon: "table", group: "Admin", view: function (ctx) {
        var d = ctx.data;
        return { type: "table", pageSize: 10, rows: allBookings(ctx), qKeys: ["id", "guestName", "guestEmail", "roomName"],
          filters: [{ key: "status", label: "status", options: ["PENDING", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"] }, { key: "roomName", label: "room", options: d.rooms.map(function (r) { return r.name; }) }],
          columns: [{ key: "id", label: "Reference", sortable: true }, { key: "guestName", label: "Guest", sortable: true }].concat(bookingCols().slice(1)), drawer: function (r, c) { return bookingDrawer(r, c, true); } };
      } },
      { id: "admin-blocked", label: "Blocked dates", icon: "calendar", group: "Admin", view: { type: "custom", render: adminBlocked } },
      { id: "admin-rooms", label: "Rooms", icon: "bed", group: "Admin", view: function (ctx) {
        var d = ctx.data;
        return { type: "table", pageSize: 8, rows: d.rooms.map(function (r) { return Object.assign({ typeLabel: d.types[r.type], state: r.active ? "Active" : "Hidden", feat: r.featured ? "Yes" : "No" }, r); }), qKeys: ["name", "typeLabel"],
          filters: [{ key: "typeLabel", label: "type", options: Object.keys(d.types).map(function (k) { return d.types[k]; }) }, { key: "state", label: "state", options: ["Active", "Hidden"] }],
          columns: [{ key: "name", label: "Room", sortable: true }, { key: "typeLabel", label: "Type" }, { key: "price", label: "Per night", sortable: true, render: function (r) { return usd(r.price); } }, { key: "maxAdults", label: "Adults" }, { key: "beds", label: "Beds" },
            { key: "feat", label: "Featured" }, { key: "state", label: "State", render: function (r) { return chip(r.state); } }],
          drawer: function (r) { return scope(el("dl", { class: "kz-dl" }, el("dt", {}, "Type"), el("dd", {}, r.typeLabel), el("dt", {}, "Price"), el("dd", {}, usd(r.price) + " per night"), el("dt", {}, "Sleeps"), el("dd", {}, r.maxAdults + " adults, " + r.maxChildren + " children"), el("dt", {}, "Amenities"), el("dd", {}, r.amenities.join(", "))),
            el("div", { class: "kz-row" }, el("button", { type: "button", class: "kz-btn", on: { click: function () { AX.ui.toast("Simulated — room updated in this demo only", { kind: "sim" }); } } }, "Save changes"))); } };
      } },
      { id: "admin-reviews", label: "Reviews", icon: "star", group: "Admin", view: function (ctx) {
        return { type: "table", pageSize: 8, rows: ctx.data.reviews.map(function (r) { return Object.assign({ name: r.title + " (" + r.guest + ")", state: r.approved ? "approved" : "hidden" }, r); }), qKeys: ["guest", "title", "comment"],
          filters: [{ key: "state", label: "state", options: ["approved", "hidden"] }, { key: "rating", label: "rating", options: ["5", "4", "3"] }],
          columns: [{ key: "guest", label: "Guest", sortable: true }, { key: "rating", label: "Rating", sortable: true, render: function (r) { return el("span", { class: "kz-star" }, "★★★★★".slice(0, r.rating) + "☆☆☆☆☆".slice(0, 5 - r.rating)); } }, { key: "title", label: "Title" },
            { key: "comment", label: "Comment", render: function (r) { return r.comment.slice(0, 60) + "..."; } }, { key: "state", label: "State", render: function (r) { return chip(r.state); } }, { key: "date", label: "Date", sortable: true }],
          drawer: function (r) { return scope(el("p", {}, r.comment), el("div", { class: "kz-row" }, el("button", { type: "button", class: "kz-btn", on: { click: function () { r.approved = !r.approved; AX.ui.toast("Simulated — review " + (r.approved ? "approved" : "hidden") + " in this demo only", { kind: "sim" }); } } }, r.approved ? "Hide review" : "Approve review"))); } };
      } },
      { id: "admin-enquiries", label: "Enquiries", icon: "mail", group: "Admin", view: function (ctx) {
        return { type: "table", pageSize: 8, rows: ctx.data.inquiries.map(function (q) { return Object.assign({ state: q.read ? "read" : "unread" }, q); }), qKeys: ["name", "email", "subject", "message"], filters: [{ key: "state", label: "state", options: ["unread", "read"] }],
          columns: [{ key: "name", label: "From", sortable: true }, { key: "subject", label: "Subject" }, { key: "email", label: "Email" }, { key: "state", label: "State", render: function (r) { return chip(r.state); } }, { key: "date", label: "Received", sortable: true }],
          drawer: function (r) { return scope(el("dl", { class: "kz-dl" }, el("dt", {}, "From"), el("dd", {}, r.name + " · " + r.email + " · " + r.phone), el("dt", {}, "Subject"), el("dd", {}, r.subject), el("dt", {}, "Message"), el("dd", {}, r.message)),
            el("div", { class: "kz-row" }, el("button", { type: "button", class: "kz-btn", on: { click: function () { r.read = true; AX.ui.toast("Simulated — reply not sent", { kind: "sim" }); } } }, "Reply by email"))); } };
      } },
      { id: "admin-gallery", label: "Gallery", icon: "box", group: "Admin", view: { type: "custom", render: adminGallery } }
    ]
  };
})(window);
