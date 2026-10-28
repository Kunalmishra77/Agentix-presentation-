/* AGENTiX demo: WhatsApp + Instagram AI agent SaaS. Fictional data only (see js/demos/data/agentix.js). */
(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.demos = AX.demos || {};
  var el = AX.el, fmt = AX.fmt;

  var CSS = [
    ".agx-pill{display:inline-block;font:600 11px var(--font-body);padding:2px 9px;border-radius:999px;background:rgba(11,31,51,.08);color:#2b3a4b;white-space:nowrap}",
    ".agx-pill.good{background:#dff3e6;color:#17663b}.agx-pill.warn{background:#fdf0d2;color:#7a4e00}.agx-pill.bad{background:#fbe0de;color:#9c1f19}.agx-pill.hot{background:#fde3d4;color:#a8400b}.agx-pill.info{background:#dcebfb;color:#164a85}",
    ".agx-kv{display:grid;grid-template-columns:110px 1fr;gap:8px 12px;margin:0 0 16px;font-size:14px}.agx-kv dt{color:var(--ink-3);font:500 12px var(--font-mono)}.agx-kv dd{margin:0;overflow-wrap:anywhere}",
    ".agx-card{background:#fff;border:1px solid var(--ax-line);border-radius:12px;padding:16px;min-width:0}.agx-card h3{margin:0 0 8px;font:600 14px var(--font-display)}",
    ".agx-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}",
    ".agx-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.agx-gap{margin-top:16px}",
    ".agx-muted{color:var(--ink-3);font-size:13px}",
    ".agx-meter{height:8px;border-radius:99px;background:rgba(11,31,51,.08);overflow:hidden;margin:6px 0 12px}.agx-meter i{display:block;height:100%;background:var(--ax-accent);border-radius:99px}",
    ".agx-wiz-steps{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}.agx-wiz-steps span{padding:6px 12px;border-radius:99px;border:1px solid var(--ax-line);font:600 12px var(--font-body);color:var(--ink-3)}.agx-wiz-steps span.on{background:var(--ax-accent);border-color:var(--ax-accent);color:#fff}.agx-wiz-steps span.done{color:var(--ink);border-color:var(--ax-accent)}",
    ".agx-opt{display:flex;gap:10px;align-items:flex-start;padding:12px;border:1px solid var(--ax-line);border-radius:10px;background:#fff;cursor:pointer;text-align:left;font:inherit;color:inherit;width:100%}.agx-opt.on{border-color:var(--ax-accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--ax-accent) 25%,transparent)}.agx-opt strong{display:block;font-size:14px}.agx-opt small{color:var(--ink-3)}",
    ".agx-opts{display:grid;gap:8px}",
    ".agx-btn{appearance:none;font:600 13px var(--font-body);padding:9px 16px;border-radius:999px;border:1px solid var(--ax-line);background:#fff;color:var(--ink);cursor:pointer}.agx-btn.primary{background:var(--ax-accent);border-color:var(--ax-accent);color:#fff}.agx-btn:disabled{opacity:.5;cursor:default}",
    ".agx-input,.agx-sel{font:400 14px var(--font-body);padding:8px 12px;border:1px solid var(--ax-line);border-radius:8px;background:#fff;color:var(--ink);max-width:100%}",
    ".agx-chips{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.agx-rule{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:99px;background:color-mix(in srgb,var(--ax-accent) 12%,#fff);border:1px solid color-mix(in srgb,var(--ax-accent) 40%,transparent);font-size:13px}.agx-rule button{appearance:none;border:0;background:transparent;cursor:pointer;font-size:15px;line-height:1;color:var(--ink-2)}",
    ".agx-count{font:700 40px var(--font-display);color:var(--ax-accent)}",
    ".agx-wa{background:#e7ddd0;border-radius:12px;padding:16px}.agx-wa .b{background:#fff;border-radius:0 10px 10px 10px;padding:10px 12px;font-size:14px;max-width:320px;box-shadow:0 1px 1px rgba(0,0,0,.15);white-space:pre-wrap}.agx-wa .t{font-size:10px;color:#667;text-align:right;margin-top:4px}",
    ".agx-sug{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}.agx-sug .agx-card{display:flex;flex-direction:column;gap:8px}.agx-sug p{margin:0;font-size:14px;color:var(--ink-2);flex:1}",
    ".agx-rankgrid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;max-width:420px}.agx-rankgrid div{aspect-ratio:1;border-radius:8px;display:grid;place-items:center;font:700 13px var(--font-display);color:#fff}",
    ".rk-a{background:#1b8a4b}.rk-b{background:#88a52c}.rk-c{background:#c98a0d}.rk-d{background:#d4571c}.rk-e{background:#b3261e}",
    ".agx-docs{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr);gap:16px}@media(max-width:820px){.agx-docs{grid-template-columns:minmax(0,1fr)}}",
    ".agx-doc{display:flex;justify-content:space-between;gap:8px;padding:10px 0;border-bottom:1px solid var(--ax-line);font-size:14px}.agx-doc:last-child{border:0}",
    ".kb-chip{display:inline-block;margin-top:6px;font:600 11px var(--font-mono);padding:3px 8px;border-radius:99px;background:#e8f0fb;color:#164a85;border:1px solid #bcd3f1}",
    ".agx-review{padding:12px 0;border-bottom:1px solid var(--ax-line)}.agx-review:last-child{border:0}.agx-stars{color:#c98a0d;letter-spacing:2px}",
    ".agx-reply{width:100%;margin-top:8px;font:400 14px var(--font-body);padding:8px;border:1px solid var(--ax-line);border-radius:8px}",
    ".agx-ph{display:flex;align-items:center;gap:12px;margin-bottom:12px}.agx-av{width:44px;height:44px;border-radius:50%;background:var(--ax-accent);color:#fff;display:grid;place-items:center;font:700 16px var(--font-display);flex:none}",
    ".agx-side h4{margin:16px 0 6px;font:600 12px var(--font-mono);text-transform:uppercase;color:var(--ink-3)}.agx-side h4:first-child{margin-top:0}"
  ].join("");

  function injectCss() {
    if (document.getElementById("agx-demo-css")) return;
    var s = document.createElement("style"); s.id = "agx-demo-css"; s.textContent = CSS; document.head.appendChild(s);
  }
  injectCss();

  var TONE = { Approved: "good", Pending: "warn", Rejected: "bad", Active: "good", Trial: "info", "Past due": "bad", Open: "bad", "In progress": "warn", Resolved: "good",
    Healthy: "good", Learning: "warn", Limited: "bad", Hot: "hot", Warm: "warn", Cold: "info", Paid: "good", Joined: "info", Booked: "good", Rewarded: "good", Pending2: "warn",
    High: "bad", Medium: "warn", Low: "info", Invited: "warn", Away: "warn" };
  function pill(text, tone) { return el("span", { class: "agx-pill " + (tone || TONE[text] || "") }, text); }
  function kv(pairs) {
    var dl = el("dl", { class: "agx-kv" });
    pairs.forEach(function (p) { dl.appendChild(el("dt", {}, p[0])); dl.appendChild(el("dd", {}, p[1])); });
    return dl;
  }
  function col(key, label, sortable, render) { var c = { key: key, label: label }; if (sortable !== false) c.sortable = true; if (render) c.render = render; return c; }
  function pillCol(key, label) { return col(key, label, true, function (r) { return pill(r[key]); }); }
  function inr(n) { return fmt.inr(n); }
  function simToast(ctx, text) { ctx.toast(text || "Simulated — nothing was sent or saved.", { kind: "sim" }); }
  function sum(a) { return a.reduce(function (s, x) { return s + x; }, 0); }

  function dash(kpis, charts) { return { type: "dashboard", kpis: kpis, charts: charts }; }

  /* "||kb:Doc name" at the end of an AI bubble becomes a cited-source chip. Idempotent. */
  function kbDecorate(root) {
    function run() {
      Array.prototype.forEach.call(root.querySelectorAll(".cht-msg.from-ai:not([data-kb]), .cht-msg.from-agent:not([data-kb])"), function (m) {
        m.setAttribute("data-kb", "1");
        var t = m.querySelector(".cht-text");
        if (!t) return;
        var i = t.textContent.indexOf("||kb:");
        if (i < 0) return;
        var name = t.textContent.slice(i + 5);
        t.textContent = t.textContent.slice(0, i).trim();
        m.appendChild(el("span", { class: "kb-chip" }, "Source: " + name));
      });
    }
    run();
    new MutationObserver(run).observe(root, { childList: true, subtree: true });
  }

  function matchDoc(q, docs) {
    q = q.toLowerCase();
    var best = null, bs = 0;
    docs.forEach(function (d) {
      var words = (d.name + " " + d.answer).toLowerCase().split(/[^a-z0-9₹]+/).filter(function (x) { return x.length > 3; });
      var s = 0;
      words.forEach(function (wd) { if (q.indexOf(wd) >= 0) s++; });
      if (s > bs) { bs = s; best = d; }
    });
    return best;
  }

  /* ---- manifest ---- */
  var D = function (ctx) { return ctx.data; };

  function contactDrawer(r) {
    return el("div", {}, kv([["Phone", r.phone], ["Email", r.email], ["City", r.city], ["Source", r.source], ["Interested in", r.service],
      ["Temperature", pill(r.temp)], ["Tag", r.tag], ["Messages", String(r.msgs)], ["Last seen", r.lastSeen + " days ago"], ["AI score", r.score + " / 100"]]),
      el("p", { class: "agx-muted" }, "Conversation history, notes and bookings for this contact appear here in the live product."));
  }

  var modules = [];
  function M(group, id, label, icon, view, role) { var m = { id: id, label: label, icon: icon, group: group, view: view }; if (role) m.role = role; modules.push(m); }

  /* ---------------- Workspace ---------------- */
  M("Workspace", "dashboard", "Dashboard", "dashboard", function (ctx) {
    var d = D(ctx), s = d.series;
    return dash([
      { label: "Conversations (30d)", value: sum(s.convs), format: "num", delta: 12 },
      { label: "Leads captured", value: sum(s.leads), format: "num", delta: 9 },
      { label: "Bookings", value: sum(s.bookings), format: "num", delta: 18 },
      { label: "Handled by AI", value: "88.4%", delta: 3 },
      { label: "Avg response time", value: "34 s", delta: -22 }
    ], [
      { type: "line", title: "Conversations and leads, last 30 days", wide: true, labels: d.days, series: [{ name: "Conversations", points: s.convs }, { name: "Leads", points: s.leads }] },
      { type: "donut", title: "Leads by source", parts: [{ label: "Meta Lead Ads", value: 412 }, { label: "WhatsApp", value: 338 }, { label: "Instagram", value: 214 }, { label: "Google Ads", value: 176 }, { label: "Website", value: 96 }] },
      { type: "bar", title: "Bookings by week", labels: ["W1", "W2", "W3", "W4"], values: [82, 96, 104, 118] }
    ]);
  });

  M("Workspace", "conversations", "Conversations", "chat", {
    type: "custom",
    render: function (host, ctx) {
      var d = ctx.data, api, chatHost = el("div");
      function booked() { return ctx.state.get().bookedLead; }
      function sideFor(t) {
        var b = t.id === "ritika" ? booked() : null;
        var temp = b ? "Hot" : (t.id === "ritika" ? "Warm" : (t.id === "t3" ? "Hot" : "Warm"));
        return el("div", { class: "agx-side" },
          el("h4", {}, "Contact"),
          el("div", { class: "agx-ph" }, el("span", { class: "agx-av" }, t.name.charAt(0)), el("div", {}, el("strong", {}, t.name), el("div", { class: "agx-muted" }, t.channel === "instagram" ? "Instagram DM" : "WhatsApp"))),
          kv([["Phone", "+91 98xxx x" + ("0000" + (t.name.length * 731 % 10000)).slice(-4)], ["Source", t.id === "ritika" ? "Meta Lead Ads" : "WhatsApp"], ["Owner", "AI agent"]]),
          el("h4", {}, "Lead temperature"), pill(temp),
          el("h4", {}, "Booking"),
          b ? el("div", { class: "agx-card" }, el("strong", {}, "Booked"), el("div", {}, b.slot), el("div", { class: "agx-muted" }, b.service)) : el("div", { class: "agx-muted" }, "No booking yet"));
      }
      var playBtn = el("button", { type: "button", class: "agx-btn primary", "data-action": "play-thread", on: { click: function () { api.play("ritika"); } } }, "Play Ritika's booking thread");
      host.appendChild(el("div", { class: "agx-row", style: { marginBottom: "12px" } }, playBtn, el("span", { class: "agx-muted" }, "Open a thread and chat, or play the scripted lead-to-booking conversation.")));
      host.appendChild(chatHost);
      api = AX.chat.create(chatHost, {
        threads: d.threads, scripts: d.scripts, side: sideFor,
        onEvent: function (ev, t) {
          if (ev !== "booked") return;
          ctx.state.set({ bookedLead: { name: "Ritika S.", slot: "Sat 2 Nov, 11:00 AM", service: "Smile consult", date: "2026-11-02" } });
          var s = chatHost.querySelector(".cht-side");
          if (s) { s.textContent = ""; s.appendChild(sideFor(t)); }
          simToast(ctx, "Simulated — WhatsApp confirmation not sent");
        }
      });
    }
  });

  M("Workspace", "crm", "CRM", "board", function (ctx) {
    var d = ctx.data, b = ctx.state.get().bookedLead;
    var cards = d.board.map(function (c) { return c.id === "ritika" && b ? Object.assign({}, c, { col: "booked", sub: b.service + " · " + b.slot }) : c; });
    return {
      type: "board",
      columns: [{ id: "new", label: "New" }, { id: "warm", label: "Warm" }, { id: "hot", label: "Hot", tone: "hot" }, { id: "booked", label: "Booked", tone: "good" }, { id: "won", label: "Won", tone: "good" }, { id: "lost", label: "Lost", tone: "bad" }],
      cards: cards,
      onMove: function (c, to) { ctx.toast("Simulated — moved " + c.title + " to " + to, { kind: "sim" }); }
    };
  });

  M("Workspace", "contacts", "Contacts", "users", function (ctx) {
    return {
      type: "table", rows: ctx.data.contacts, qKeys: ["name", "phone", "city", "service"], pageSize: 12,
      filters: [{ key: "temp", label: "temperature", options: ctx.data.temps }, { key: "city", label: "city", options: ["Delhi", "Gurugram", "Noida", "Mumbai", "Pune", "Bengaluru", "Hyderabad", "Jaipur", "Lucknow", "Chandigarh", "Kolkata", "Ahmedabad"] }],
      columns: [col("name", "Name"), col("phone", "Phone", false), col("city", "City"), col("source", "Source"), pillCol("temp", "Temperature"), col("score", "AI score"), col("lastSeen", "Last seen (d)")],
      drawer: contactDrawer
    };
  });

  M("Workspace", "leads", "Leads", "users", function (ctx) {
    return {
      type: "table", rows: ctx.data.leads, qKeys: ["name", "interest", "city", "id"], pageSize: 12,
      filters: [{ key: "source", label: "source", options: ctx.data.sources }, { key: "stage", label: "stage", options: ["New", "Warm", "Hot", "Booked", "Won", "Lost"] }],
      columns: [col("id", "Lead"), col("name", "Name"), col("source", "Source"), col("interest", "Interested in"), pillCol("temp", "Temperature"), col("stage", "Stage"), col("value", "Est. value", true, function (r) { return inr(r.value); }), col("created", "Created")],
      drawer: function (r) {
        return el("div", {}, kv([["Phone", r.phone], ["City", r.city], ["Source", r.source], ["Interest", r.interest], ["Stage", r.stage], ["Temperature", pill(r.temp)], ["Est. value", inr(r.value)], ["Owner", r.owner]]),
          el("button", { type: "button", class: "agx-btn primary", on: { click: function () { simToast(ctx, "Simulated — WhatsApp message not sent"); } } }, "Message on WhatsApp"));
      }
    };
  });

  /* ---------------- Engage ---------------- */
  var PRESETS = [
    { id: "hot", label: "Hot leads, last 14 days", test: function (c) { return c.temp === "Hot" && c.lastSeen <= 14; } },
    { id: "cold", label: "Gone cold, 30+ days quiet", test: function (c) { return c.lastSeen >= 30; } },
    { id: "meta", label: "Meta Lead Ads, not yet booked", test: function (c) { return c.source === "Meta Lead Ads" && c.temp !== "Hot"; } }
  ];

  M("Engage", "campaigns", "Campaigns", "mail", {
    type: "custom",
    render: function (host, ctx) {
      var d = ctx.data, st = { step: 0, seg: "hot", tpl: "festive_offer_diwali", when: "now", date: "2026-11-02", time: "10:00", launched: false };
      var approved = d.templates.filter(function (t) { return t.status === "Approved" && t.category !== "Authentication"; });
      var box = el("div", { class: "agx-card" });
      host.appendChild(box);
      function count(p) { return d.contacts.filter(p.test).length * 9 + 14; }
      function seg() { return PRESETS.filter(function (p) { return p.id === st.seg; })[0]; }
      function draw() {
        box.textContent = "";
        var steps = ["1 · Audience segment", "2 · Template", "3 · Schedule"];
        box.appendChild(el("div", { class: "agx-wiz-steps" }, steps.map(function (s, i) { return el("span", { class: (i === st.step ? "on" : i < st.step ? "done" : "") }, s); })));
        if (st.launched) { return drawStats(); }
        var body;
        if (st.step === 0) {
          body = el("div", { class: "agx-opts" }, PRESETS.map(function (p) {
            return el("button", { type: "button", class: "agx-opt" + (st.seg === p.id ? " on" : ""), "data-seg": p.id, on: { click: function () { st.seg = p.id; draw(); } } },
              el("div", {}, el("strong", {}, p.label), el("small", {}, count(p) + " contacts · opted in for WhatsApp")));
          }));
        } else if (st.step === 1) {
          body = el("div", { class: "agx-grid" }, el("div", { class: "agx-opts" }, approved.map(function (t) {
            return el("button", { type: "button", class: "agx-opt" + (st.tpl === t.name ? " on" : ""), "data-tpl": t.name, on: { click: function () { st.tpl = t.name; draw(); } } },
              el("div", {}, el("strong", {}, t.name), el("small", {}, t.category + " · " + t.lang.toUpperCase())));
          })), waPreview((approved.filter(function (t) { return t.name === st.tpl; })[0] || approved[0]).body));
        } else {
          body = el("div", { class: "agx-opts" },
            el("button", { type: "button", class: "agx-opt" + (st.when === "now" ? " on" : ""), on: { click: function () { st.when = "now"; draw(); } } }, el("div", {}, el("strong", {}, "Send now"), el("small", {}, "Starts immediately, rate-limited by Meta tier"))),
            el("button", { type: "button", class: "agx-opt" + (st.when === "later" ? " on" : ""), on: { click: function () { st.when = "later"; draw(); } } }, el("div", {}, el("strong", {}, "Schedule"), el("small", {}, "Pick a date and time (IST)"))),
            st.when === "later" ? el("div", { class: "agx-row" },
              el("input", { type: "date", class: "agx-input", value: st.date, "aria-label": "Date", on: { change: function (e) { st.date = e.target.value; } } }),
              el("input", { type: "time", class: "agx-input", value: st.time, "aria-label": "Time", on: { change: function (e) { st.time = e.target.value; } } })) : null,
            el("p", { class: "agx-muted" }, "Audience: " + seg().label + " (" + count(seg()) + ") · Template: " + st.tpl));
        }
        box.appendChild(body);
        box.appendChild(el("div", { class: "agx-row agx-gap" },
          st.step > 0 ? el("button", { type: "button", class: "agx-btn", "data-action": "wiz-back", on: { click: function () { st.step--; draw(); } } }, "Back") : null,
          st.step < 2 ? el("button", { type: "button", class: "agx-btn primary", "data-action": "wiz-next", on: { click: function () { st.step++; draw(); } } }, "Next")
            : el("button", { type: "button", class: "agx-btn primary", "data-action": "wiz-launch", on: { click: function () { st.launched = true; draw(); simToast(ctx, "Simulated — WhatsApp campaign not sent"); } } }, "Launch campaign")));
      }
      function waPreview(text) {
        return el("div", { class: "agx-wa" }, el("div", { class: "b" }, text.replace(/\{\{1\}\}/g, "Ritika").replace(/\{\{2\}\}/g, "Smile consult").replace(/\{\{3\}\}/g, "9 Nov"), el("div", { class: "t" }, "10:00 AM")));
      }
      function drawStats() {
        var n = count(seg()), sent = n, delivered = Math.round(n * 0.97), read = Math.round(n * 0.78), replied = Math.round(n * 0.31);
        box.appendChild(el("h3", {}, "Delivery stats · " + st.tpl));
        box.appendChild(el("p", { class: "agx-muted" }, "Sent to " + seg().label + (st.when === "later" ? ", scheduled " + st.date + " " + st.time : ", sent now") + "."));
        var slot = el("div", { class: "camp-stats" });
        box.appendChild(slot);
        AX.charts.bar(slot, { labels: ["Sent", "Delivered", "Read", "Replied"], values: [sent, delivered, read, replied] });
        box.appendChild(el("div", { class: "agx-row agx-gap" },
          pill(AX.fmt.pct(delivered / sent * 100) + " delivered", "good"), pill(AX.fmt.pct(read / sent * 100) + " read", "info"), pill(AX.fmt.pct(replied / sent * 100) + " replied", "hot"),
          el("button", { type: "button", class: "agx-btn", on: { click: function () { st.step = 0; st.launched = false; draw(); } } }, "New campaign")));
      }
      draw();
    }
  });

  M("Engage", "templates", "Templates", "file", function (ctx) {
    return {
      type: "table", rows: ctx.data.templates, qKeys: ["name", "category", "body"], pageSize: 12,
      filters: [{ key: "status", label: "status", options: ["Approved", "Pending", "Rejected"] }, { key: "category", label: "category", options: ["Marketing", "Utility", "Authentication"] }],
      columns: [col("name", "Template"), col("category", "Category"), col("lang", "Lang"), pillCol("status", "Meta approval"), col("sent", "Sent", true, function (r) { return fmt.num(r.sent); })],
      drawer: function (r) {
        return el("div", {}, el("div", { class: "agx-wa" }, el("div", { class: "b" }, r.body, el("div", { class: "t" }, "WhatsApp preview"))),
          el("div", { class: "agx-gap" }), kv([["Category", r.category], ["Language", r.lang === "hi" ? "Hindi" : "English"], ["Approval", pill(r.status)], ["Sent (30d)", fmt.num(r.sent)]]),
          r.status === "Rejected" ? el("p", { class: "agx-muted" }, "Rejected by Meta: promotional content in a utility-style body. Edit and resubmit.") : null,
          el("button", { type: "button", class: "agx-btn primary", on: { click: function () { simToast(ctx, "Simulated — submitted to Meta for review"); } } }, r.status === "Rejected" ? "Resubmit for approval" : "Use in campaign"));
      }
    };
  });

  M("Engage", "flows", "Flows", "flow", {
    type: "flow",
    nodes: [
      { id: "n1", kind: "trigger", label: "Ad click", detail: "Click-to-WhatsApp", x: 0, y: 70 },
      { id: "n2", kind: "ai", label: "AI qualify", detail: "Budget · need · timing", x: 220, y: 70 },
      { id: "n3", kind: "condition", label: "Hot lead?", detail: "Score above 70", x: 440, y: 70 },
      { id: "n4", kind: "action", label: "Book slot", detail: "Offer 3 slots", x: 680, y: 0 },
      { id: "n5", kind: "delay", label: "Nurture 3-day", detail: "Day 1, 2, 3 drip", x: 680, y: 140 },
      { id: "n6", kind: "end", label: "Handoff to human", detail: "Assign + notify", x: 920, y: 70 }
    ],
    edges: [["n1", "n2"], ["n2", "n3"], ["n3", "n4", "yes"], ["n3", "n5", "no"], ["n4", "n6"], ["n5", "n6"]]
  });

  M("Engage", "segments", "Segments", "users", {
    type: "custom",
    render: function (host, ctx) {
      var d = ctx.data, F = d.segments.fields, rules = [{ key: "temp", value: "Hot" }];
      var box = el("div", { class: "agx-card" });
      host.appendChild(box);
      function matches() { return d.contacts.filter(function (c) { return rules.every(function (r) { return c[r.key] === r.value; }); }); }
      function draw() {
        box.textContent = "";
        var m = matches();
        var fSel = el("select", { class: "agx-sel", "aria-label": "Field" }, F.map(function (f) { return el("option", { value: f.key }, f.label); }));
        var vSel = el("select", { class: "agx-sel", "aria-label": "Value" });
        function fillV() { vSel.textContent = ""; F.filter(function (f) { return f.key === fSel.value; })[0].options.forEach(function (o) { vSel.appendChild(el("option", { value: o }, o)); }); }
        fSel.addEventListener("change", fillV); fillV();
        box.appendChild(el("h3", {}, "Segment rules (all must match)"));
        box.appendChild(el("div", { class: "agx-chips" }, rules.length ? rules.map(function (r, i) {
          var f = F.filter(function (x) { return x.key === r.key; })[0];
          return el("span", { class: "agx-rule" }, f.label + " = " + r.value, el("button", { type: "button", "aria-label": "Remove rule", on: { click: function () { rules.splice(i, 1); draw(); } } }, "×"));
        }) : el("span", { class: "agx-muted" }, "No rules, everyone matches")));
        box.appendChild(el("div", { class: "agx-row" }, fSel, vSel, el("button", { type: "button", class: "agx-btn", "data-action": "add-rule", on: { click: function () { rules.push({ key: fSel.value, value: vSel.value }); draw(); } } }, "Add rule")));
        box.appendChild(el("div", { class: "agx-gap" }, el("div", { class: "agx-count", "data-live-count": "1" }, String(m.length)), el("div", { class: "agx-muted" }, "of " + d.contacts.length + " contacts match")));
        box.appendChild(el("p", { class: "agx-muted" }, m.slice(0, 5).map(function (c) { return c.name; }).join(", ") + (m.length > 5 ? " and " + (m.length - 5) + " more" : "")));
        box.appendChild(el("button", { type: "button", class: "agx-btn primary", on: { click: function () { simToast(ctx, "Simulated — segment not saved"); } } }, "Save segment"));
      }
      draw();
    }
  });

  M("Engage", "winback", "Win-back", "heart", function (ctx) {
    return {
      type: "form", submit: "Start win-back",
      fields: [
        { key: "segment", label: "Who to win back", type: "select", options: ["Quiet 30+ days", "Quiet 60+ days", "Past customers, no repeat", "No-shows"] },
        { key: "days", label: "Inactive for (days)", type: "number" },
        { key: "template", label: "Template", type: "select", options: ["winback_30d", "no_show_followup", "festive_offer_diwali"] },
        { key: "offer", label: "Offer line", type: "text" },
        { key: "discount", label: "Discount", type: "select", options: ["None", "10%", "15%", "₹500 off"] },
        { key: "followup", label: "Auto follow-up after 3 days", type: "toggle" }
      ],
      onSubmit: function (v) {
        var n = Math.round(ctx.data.contacts.length * (v.days >= 60 ? 1.6 : 2.4)) + 20;
        return el("div", { class: "agx-card" }, el("strong", {}, "Win-back ready"),
          el("p", {}, "Audience " + v.segment + ": " + n + " contacts. Template " + v.template + (v.discount && v.discount !== "None" ? ", " + v.discount + " offer" : "") + (v.followup ? ", with follow-up." : ".")),
          el("p", { class: "agx-muted" }, "Estimated: " + Math.round(n * 0.31) + " replies, " + Math.round(n * 0.09) + " rebookings."));
      }
    };
  });

  M("Engage", "referrals", "Referrals", "star", function (ctx) {
    return {
      type: "table", rows: ctx.data.referrals, qKeys: ["referrer", "referred", "code"], pageSize: 10,
      filters: [{ key: "status", label: "status", options: ["Joined", "Booked", "Rewarded", "Pending"] }],
      columns: [col("referrer", "Referrer"), col("referred", "Referred"), col("code", "Code"), pillCol("status", "Status"), col("reward", "Reward")],
      drawer: function (r) { return kv([["Referrer", r.referrer], ["Referred", r.referred], ["Code", r.code], ["Status", pill(r.status)], ["Reward", r.reward]]); }
    };
  });

  /* ---------------- Operate ---------------- */
  M("Operate", "bookings", "Bookings", "calendar", function (ctx) {
    var b = ctx.state.get().bookedLead;
    var ev = [
      { id: "b1", title: "10:00 Aarav · Whitening", date: "2026-11-03", tone: "teal" }, { id: "b2", title: "11:30 Simran · PRP", date: "2026-11-03", tone: "orange" },
      { id: "b3", title: "15:00 Neel · Consult", date: "2026-11-04", tone: "navy" }, { id: "b4", title: "12:00 Kavya · Implant", date: "2026-11-05", tone: "good" },
      { id: "b5", title: "17:30 Sahil · Laser", date: "2026-11-07", tone: "teal" }, { id: "b6", title: "10:30 Tanya · Facial", date: "2026-11-10", tone: "orange" },
      { id: "b7", title: "14:00 Dev · Contouring", date: "2026-11-12", tone: "navy" }, { id: "b8", title: "16:00 Isha · Root canal", date: "2026-11-14", tone: "good" }
    ];
    if (b) ev.push({ id: "b-ritika", title: "11:00 Ritika · Smile consult", date: b.date, tone: "bad" });
    return { type: "calendar", month: "2026-11", events: ev, onDrop: function () { ctx.toast("Simulated — reminder to the patient not sent", { kind: "sim" }); } };
  });

  M("Operate", "tasks", "Tasks", "board", function (ctx) {
    return {
      type: "board", cards: ctx.data.tasks,
      columns: [{ id: "todo", label: "To do" }, { id: "doing", label: "In progress", tone: "orange" }, { id: "done", label: "Done", tone: "good" }],
      onMove: function (c, to) { ctx.toast("Simulated — task moved to " + to, { kind: "sim" }); }
    };
  });

  M("Operate", "team", "Team", "users", function (ctx) {
    return {
      type: "table", rows: ctx.data.team, qKeys: ["name", "role", "email"], pageSize: 12,
      filters: [{ key: "role", label: "role", options: ["Owner", "Manager", "Sales agent", "Front desk", "Doctor", "Marketing", "Support"] }],
      columns: [col("name", "Name"), col("role", "Role"), col("email", "Email", false), pillCol("status", "Status"), col("handled", "Chats handled"), col("last", "Last active", false)],
      drawer: function (r) {
        return el("div", {}, kv([["Email", r.email], ["Role", r.role], ["Status", pill(r.status)], ["Chats handled (30d)", String(r.handled)]]),
          el("button", { type: "button", class: "agx-btn", on: { click: function () { simToast(ctx, "Simulated — invite not sent"); } } }, "Resend invite"));
      }
    };
  });

  M("Operate", "knowledge", "Knowledge base", "file", {
    type: "custom",
    render: function (host, ctx) {
      var d = ctx.data;
      var list = el("div", { class: "agx-card" }, el("h3", {}, "Documents the agent can cite"),
        d.docs.map(function (x) { return el("div", { class: "agx-doc" }, el("span", {}, x.name), el("span", { class: "agx-muted" }, x.pages + " p · " + x.updated)); }),
        el("button", { type: "button", class: "agx-btn agx-gap", on: { click: function () { simToast(ctx, "Simulated — nothing was uploaded"); } } }, "Upload document"));
      var chatHost = el("div");
      var ask = el("div", { class: "agx-card" }, el("h3", {}, "Ask the agent"), chatHost);
      host.appendChild(el("div", { class: "agx-docs" }, list, ask));
      var api = AX.chat.create(chatHost, { composer: false, threads: [{ id: "kb", name: "Sandbox", channel: "web", preview: "Try: what are your timings?", messages: [{ from: "ai", text: "Ask me anything the clinic documents cover. I answer only from the knowledge base." }] }] });
      kbDecorate(chatHost);
      var input = el("input", { class: "agx-input", placeholder: "e.g. What are your timings on Diwali?", "aria-label": "Ask the agent", style: { flex: "1" } });
      function submit(q) {
        q = String(q || input.value).trim(); if (!q) return; input.value = "";
        api.push("kb", { from: "user", text: q });
        var doc = matchDoc(q, d.docs);
        setTimeout(function () {
          api.push("kb", { from: "ai", text: doc ? doc.answer + "||kb:" + doc.name : "I could not find that in the knowledge base, so I have handed this to a human teammate." });
        }, 250);
      }
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); submit(); } });
      ask.appendChild(el("div", { class: "agx-row agx-gap" }, input, el("button", { type: "button", class: "agx-btn primary", on: { click: function () { submit(); } } }, "Ask")));
      ask.appendChild(el("div", { class: "agx-row agx-gap" }, ["What are your timings on Diwali?", "How much is teeth whitening?", "What is the refund policy?"].map(function (q) {
        return el("button", { type: "button", class: "agx-btn", on: { click: function () { submit(q); } } }, q);
      })));
    }
  });

  /* ---------------- Grow ---------------- */
  M("Grow", "ai-revenue", "AI revenue", "wallet", function (ctx) {
    var s = ctx.data.series;
    return dash([
      { label: "AI-attributed revenue", value: "₹4.82L", delta: 21 }, { label: "Bookings by AI", value: 318, format: "num", delta: 16 },
      { label: "Avg deal value", value: "₹15,160" }, { label: "Cost per AI booking", value: "₹94", delta: -11 }
    ], [
      { type: "line", title: "Revenue influenced by AI (₹ thousand/day)", wide: true, labels: ctx.data.days, series: [{ name: "AI revenue", points: s.revenue }] },
      { type: "bar", title: "Revenue by service (₹ thousand)", horizontal: true, labels: ["Implants", "Whitening", "PRP", "Laser", "Facials"], values: [182, 96, 74, 71, 59] },
      { type: "donut", title: "Booked by", parts: [{ label: "AI agent", value: 318 }, { label: "Human after handoff", value: 92 }] }
    ]);
  });

  M("Grow", "copilot", "Growth Copilot", "star", {
    type: "custom",
    render: function (host, ctx) {
      var applied = {};
      var grid = el("div", { class: "agx-sug" });
      host.appendChild(el("p", { class: "agx-muted" }, "Six suggestions generated from your last 30 days of conversations, ads and bookings."));
      host.appendChild(grid);
      ctx.data.copilot.forEach(function (c) {
        var btn = el("button", { type: "button", class: "agx-btn primary", "data-apply": c.id }, "Apply");
        btn.addEventListener("click", function () {
          if (applied[c.id]) return; applied[c.id] = true; btn.textContent = "Applied"; btn.disabled = true;
          simToast(ctx, "Simulated — suggestion applied (nothing changed)");
        });
        grid.appendChild(el("div", { class: "agx-card" }, el("h3", {}, c.title), el("p", {}, c.body), el("div", { class: "agx-row" }, pill(c.impact, "good"), btn)));
      });
    }
  });

  M("Grow", "google-ads", "Google Ads", "chart", function (ctx) {
    var s = ctx.data.series;
    return dash([
      { label: "Spend (30d)", value: "₹" + fmt.num(sum(s.spend)), delta: 6 }, { label: "Clicks", value: sum(s.clicks), format: "num", delta: 11 },
      { label: "Cost per lead", value: "₹212", delta: -8 }, { label: "Booked from ads", value: 142, format: "num", delta: 14 }
    ], [
      { type: "line", title: "Clicks per day", wide: true, labels: ctx.data.days, series: [{ name: "Clicks", points: s.clicks }] },
      { type: "bar", title: "Leads by keyword", horizontal: true, labels: ["dental implants near me", "teeth whitening cost", "hair prp price", "skin clinic", "laser hair removal"], values: [64, 52, 41, 33, 28] },
      { type: "donut", title: "Spend by campaign type", parts: [{ label: "Search", value: 61 }, { label: "Performance Max", value: 27 }, { label: "Call ads", value: 12 }] }
    ]);
  });

  M("Grow", "gbp", "Google Business", "home", {
    type: "custom",
    render: function (host, ctx) {
      var reviews = ctx.data.reviews;
      host.appendChild(el("div", { class: "agx-card" },
        el("div", { class: "agx-ph" }, el("span", { class: "agx-av" }, "G"), el("div", {}, el("strong", {}, "AGENTiX Demo Dental Clinic"), el("div", { class: "agx-muted" }, "Dental clinic · Gurugram"))),
        el("div", { class: "agx-row" }, pill("4.6 rating", "good"), pill("238 reviews", "info"), pill("Open until 8 PM", "good"), pill("1.2k profile views / mo", "")),
        kv([["Address", "Sector 29, Gurugram, Haryana"], ["Phone", "+91 98xxx x0000"], ["Hours", "Mon-Sat 10-8, Sun 11-4"]])));
      var list = el("div", { class: "agx-card agx-gap" }, el("h3", {}, "Recent reviews"));
      reviews.forEach(function (r) {
        var area = el("textarea", { class: "agx-reply", rows: "3", placeholder: "Write a reply…", "aria-label": "Reply to " + r.who });
        var draft = el("button", { type: "button", class: "agx-btn", "data-draft": r.id }, "Draft AI reply");
        draft.addEventListener("click", function () {
          area.value = r.stars >= 4
            ? "Thank you, " + r.who.split(" ")[0] + "! We are delighted you had a great experience. Our team looks forward to seeing you again."
            : "Hi " + r.who.split(" ")[0] + ", we are sorry about this. We would like to make it right. Please message us on WhatsApp so a senior team member can help.";
        });
        list.appendChild(el("div", { class: "agx-review" }, el("div", { class: "agx-row" }, el("strong", {}, r.who), el("span", { class: "agx-stars" }, "★★★★★".slice(0, r.stars) + "☆☆☆☆☆".slice(0, 5 - r.stars)), el("span", { class: "agx-muted" }, r.when)),
          el("p", {}, r.text), area,
          el("div", { class: "agx-row", style: { marginTop: "8px" } }, draft, el("button", { type: "button", class: "agx-btn primary", on: { click: function () { simToast(ctx, "Simulated — reply not posted to Google"); } } }, "Post reply"))));
      });
      host.appendChild(list);
    }
  });

  M("Grow", "local-rank", "Local rank", "map", {
    type: "custom",
    render: function (host, ctx) {
      var KW = ["dentist near me", "teeth whitening", "dental implants"], cur = 0;
      var out = el("div");
      var sel = el("select", { class: "agx-sel", "aria-label": "Keyword", on: { change: function () { cur = +sel.value; draw(); } } }, KW.map(function (k, i) { return el("option", { value: i }, k); }));
      host.appendChild(el("div", { class: "agx-card" }, el("div", { class: "agx-row" }, el("strong", {}, "Keyword"), sel), out));
      function cls(n) { return n <= 3 ? "rk-a" : n <= 6 ? "rk-b" : n <= 10 ? "rk-c" : n <= 15 ? "rk-d" : "rk-e"; }
      function draw() {
        out.textContent = "";
        var cells = [], total = 0;
        for (var r = 0; r < 7; r++) for (var c = 0; c < 7; c++) {
          var dist = Math.sqrt((r - 3) * (r - 3) + (c - 3) * (c - 3));
          var rank = Math.max(1, Math.min(20, Math.round(1 + dist * (1.4 + cur * 0.8) + AX.fake.int("lr" + cur + "-" + r + "-" + c, 0, 3))));
          total += rank;
          cells.push(el("div", { class: cls(rank), title: "Rank " + rank }, String(rank)));
        }
        out.appendChild(el("div", { class: "agx-gap agx-rankgrid", role: "img", "aria-label": "7 by 7 local rank grid" }, cells));
        out.appendChild(el("div", { class: "agx-row agx-gap" }, pill("Avg rank " + (total / 49).toFixed(1), "info"), el("span", { class: "agx-muted" }, "Centre of the grid is the clinic. Green = top 3, red = beyond 15.")));
      }
      draw();
    }
  });

  M("Grow", "roi", "Marketing ROI", "chart", function () {
    return dash([
      { label: "Marketing spend", value: "₹1.64L" }, { label: "Revenue attributed", value: "₹9.31L", delta: 18 }, { label: "Blended ROAS", value: "5.7x", delta: 9 }, { label: "Cost per booking", value: "₹412", delta: -7 }
    ], [
      { type: "funnel", title: "Meta Ads funnel", steps: [{ label: "Clicks", value: 4200 }, { label: "Chats started", value: 1830 }, { label: "Qualified", value: 760 }, { label: "Booked", value: 298 }] },
      { type: "funnel", title: "Google Ads funnel", steps: [{ label: "Clicks", value: 3100 }, { label: "Chats started", value: 1020 }, { label: "Qualified", value: 540 }, { label: "Booked", value: 211 }] },
      { type: "funnel", title: "Organic and referral funnel", steps: [{ label: "Visits", value: 2600 }, { label: "Chats started", value: 980 }, { label: "Qualified", value: 460 }, { label: "Booked", value: 187 }] },
      { type: "bar", title: "ROAS by channel", labels: ["Meta", "Google", "Organic", "Referral"], values: [4.8, 5.4, 9.2, 11.6] }
    ]);
  });

  M("Grow", "analytics", "Analytics", "chart", function (ctx) {
    var s = ctx.data.series;
    return dash([
      { label: "Resolved without human", value: "88.4%", delta: 3 }, { label: "Avg first response", value: "34 s", delta: -22 }, { label: "CSAT", value: "4.7 / 5" }, { label: "Handoffs", value: 214, format: "num", delta: -9 }
    ], [
      { type: "line", title: "AI-handled share (%) over 30 days", wide: true, labels: ctx.data.days, series: [{ name: "AI handled %", points: s.aiPct }] },
      { type: "gauge", title: "AI resolution rate", value: 88, label: "Resolved by AI" },
      { type: "bar", title: "Messages by hour", labels: ["8", "10", "12", "14", "16", "18", "20", "22"], values: [120, 340, 410, 290, 360, 480, 390, 160] },
      { type: "donut", title: "Channel mix", parts: [{ label: "WhatsApp", value: 72 }, { label: "Instagram", value: 21 }, { label: "Web chat", value: 7 }] }
    ]);
  });

  /* ---------------- Account ---------------- */
  M("Account", "billing", "Billing", "wallet", {
    type: "custom",
    render: function (host, ctx) {
      var meters = [["Conversations", 3420, 5000], ["AI messages", 41200, 60000], ["Team seats", 7, 10], ["Template sends", 8650, 10000]];
      host.appendChild(el("div", { class: "agx-grid" },
        el("div", { class: "agx-card" }, el("h3", {}, "Current plan"), el("div", { class: "agx-count" }, "₹2,999", el("small", { style: { fontSize: "14px", color: "var(--ink-3)" } }, " /mo")),
          el("p", { class: "agx-muted" }, "Growth plan · renews 1 Nov 2026 · GST extra"),
          el("div", { class: "agx-row" }, el("button", { type: "button", class: "agx-btn primary", on: { click: function () { simToast(ctx, "Simulated — plan not changed"); } } }, "Upgrade to Scale"), el("button", { type: "button", class: "agx-btn", on: { click: function () { simToast(ctx, "Simulated — nothing was charged"); } } }, "Update payment method"))),
        el("div", { class: "agx-card" }, el("h3", {}, "Usage this cycle"), meters.map(function (m) {
          return el("div", {}, el("div", { class: "agx-row", style: { justifyContent: "space-between" } }, el("span", {}, m[0]), el("span", { class: "agx-muted" }, fmt.num(m[1]) + " / " + fmt.num(m[2]))),
            el("div", { class: "agx-meter", role: "progressbar", "aria-valuenow": String(Math.round(m[1] / m[2] * 100)), "aria-valuemin": "0", "aria-valuemax": "100" }, el("i", { style: { width: Math.round(m[1] / m[2] * 100) + "%" } })));
        }))));
      var tHost = el("div", { class: "agx-gap" });
      host.appendChild(el("div", { class: "agx-gap" }, el("h3", { style: { font: "600 14px var(--font-display)" } }, "Invoices"), tHost));
      AX.table.create(tHost, {
        rows: ctx.data.invoices, pageSize: 6,
        columns: [col("id", "Invoice"), col("date", "Date"), col("amount", "Amount", true, function (r) { return inr(r.amount); }), pillCol("status", "Status")],
        actions: [{ label: "Download", onClick: function () { simToast(ctx, "Simulated — invoice not downloaded"); } }]
      });
    }
  });

  /* ---------------- Admin console ---------------- */
  var ADM = "Admin console", ROLE = "Super admin";
  M(ADM, "admin-clients", "Clients", "users", function (ctx) {
    return {
      type: "table", rows: ctx.data.clients, qKeys: ["name", "plan", "city"], pageSize: 12,
      filters: [{ key: "plan", label: "plan", options: ["Starter", "Growth", "Scale"] }, { key: "status", label: "status", options: ["Active", "Trial", "Past due"] }],
      columns: [col("name", "Client"), col("plan", "Plan"), col("mrr", "MRR", true, function (r) { return inr(r.mrr); }), pillCol("status", "Status"), col("bots", "Bots"), col("convs", "Conversations (30d)", true, function (r) { return fmt.num(r.convs); })],
      drawer: function (r) {
        return el("div", {}, kv([["City", r.city], ["Plan", r.plan], ["MRR", inr(r.mrr)], ["Status", pill(r.status)], ["Bots", String(r.bots)], ["Conversations", fmt.num(r.convs)]]),
          el("button", { type: "button", class: "agx-btn", on: { click: function () { simToast(ctx, "Simulated — impersonation not started"); } } }, "View as client"));
      }
    };
  }, ROLE);

  M(ADM, "bot-health", "Bot health", "settings", function (ctx) {
    return dash([
      { label: "Uptime (30d)", value: "99.94%" }, { label: "Avg latency", value: "612 ms", delta: -5 }, { label: "Webhook failures", value: 37, format: "num", delta: -31 }, { label: "Bots online", value: "41 / 42" }
    ], [
      { type: "line", title: "Reply latency (ms)", wide: true, labels: ctx.data.days, series: [{ name: "p50 latency", points: ctx.data.series.latency }] },
      { type: "bar", title: "Errors by client (7d)", horizontal: true, labels: ["Glow Dental", "FitNation", "Metro Diag.", "SkinKraft", "Zen Ortho"], values: [14, 11, 9, 6, 3] }
    ]);
  }, ROLE);

  M(ADM, "ai-tokens", "AI tokens", "flask", function (ctx) {
    return dash([
      { label: "Tokens (30d)", value: "24.6M", delta: 8 }, { label: "AI cost", value: "₹18,420", delta: 5 }, { label: "Cost per conversation", value: "₹0.71", delta: -4 }, { label: "Cache hit rate", value: "63%" }
    ], [
      { type: "line", title: "Tokens per day (thousand)", wide: true, labels: ctx.data.days, series: [{ name: "Tokens (k)", points: ctx.data.series.tokens }] },
      { type: "donut", title: "Tokens by workload", parts: [{ label: "Replies", value: 58 }, { label: "Qualification", value: 21 }, { label: "Embeddings", value: 13 }, { label: "Summaries", value: 8 }] }
    ]);
  }, ROLE);

  M(ADM, "meta-spend", "Meta spend", "wallet", function (ctx) {
    return {
      type: "table", rows: ctx.data.metaSpend, qKeys: ["client", "account"], pageSize: 12,
      filters: [{ key: "status", label: "status", options: ["Healthy", "Learning", "Limited"] }],
      columns: [col("client", "Client"), col("account", "Ad account"), col("spend", "Spend (30d)", true, function (r) { return inr(r.spend); }), col("leads", "Leads"), pillCol("status", "Delivery")],
      drawer: function (r) { return kv([["Client", r.client], ["Ad account", r.account], ["Spend", inr(r.spend)], ["Leads", String(r.leads)], ["Cost per lead", inr(Math.round(r.spend / r.leads))], ["Delivery", pill(r.status)]]); }
    };
  }, ROLE);

  M(ADM, "support", "Support", "bell", function (ctx) {
    return {
      type: "table", rows: ctx.data.tickets, qKeys: ["subject", "client", "id"], pageSize: 10,
      filters: [{ key: "status", label: "status", options: ["Open", "In progress", "Resolved"] }, { key: "priority", label: "priority", options: ["High", "Medium", "Low"] }],
      columns: [col("id", "Ticket"), col("subject", "Subject"), col("client", "Client"), pillCol("priority", "Priority"), pillCol("status", "Status"), col("age", "Age")],
      drawer: function (r) {
        return el("div", {}, kv([["Ticket", r.id], ["Client", r.client], ["Priority", pill(r.priority)], ["Status", pill(r.status)], ["Age", r.age]]),
          el("p", { class: "agx-muted" }, "Customer wrote: \"" + r.subject + ". Please help us fix this as soon as possible.\""),
          el("button", { type: "button", class: "agx-btn primary", on: { click: function () { simToast(ctx, "Simulated — reply not sent"); } } }, "Reply to client"));
      }
    };
  }, ROLE);

  AX.demos.agentix = { brand: { name: "AGENTiX", accent: "#EE6A24", logoText: "A" }, start: "dashboard", modules: modules };
})(window);
