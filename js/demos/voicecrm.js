(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.demos = AX.demos || {};

  /* Pure helper (unit-tested): RFC-4180 style CSV text from column defs + rows. */
  function toCsv(cols, rows) {
    function q(v, raw) {
      var isText = typeof v === "string";
      v = v == null ? "" : String(v);
      if (isText && !raw && /^[\r=+\-@]/.test(v)) v = "'" + v;   // spreadsheet formula-injection guard
      return /[",\r\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    }
    return [cols.map(function (c) { return q(c.label); }).join(",")].concat(rows.map(function (r) {
      return cols.map(function (c) { return q(typeof c.get === "function" ? c.get(r) : r[c.key], c.raw); }).join(",");
    })).join("\r\n") + "\r\n";
  }
  AX.voicecrm = { toCsv: toCsv };

  if (typeof document === "undefined" || !document.getElementById) return;
  var el = AX.el;

  var CSS = [
    ".vc-chip{display:inline-block;font:600 11px var(--font-body);padding:2px 9px;border-radius:999px;border:1px solid transparent;white-space:nowrap}",
    ".vc-chip.Hot,.vc-chip.Negative,.vc-chip.Unconverted,.vc-chip.high{background:#FEE9E7;color:#B42318}",
    ".vc-chip.Warm,.vc-chip.Neutral,.vc-chip.Pending,.vc-chip.med{background:#FEF3D7;color:#8A5A00}",
    ".vc-chip.Cold,.vc-chip.low{background:#E6EEF9;color:#26467A}",
    ".vc-chip.Positive,.vc-chip.Converted,.vc-chip.Active{background:#DDF5E7;color:#116B3A}",
    ".vc-chip.Away{background:#EEE;color:#555}",
    ".vc-live{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:16px}",
    ".vc-call{background:#fff;border:1px solid var(--ax-line);border-radius:12px;display:flex;flex-direction:column;min-width:0;overflow:hidden}",
    ".vc-call-h{display:flex;gap:10px;align-items:center;padding:12px 14px;border-bottom:1px solid var(--ax-line)}",
    ".vc-pulse{width:10px;height:10px;border-radius:50%;background:#E0392B;box-shadow:0 0 0 0 rgba(224,57,43,.5);flex:none}",
    "@media (prefers-reduced-motion:no-preference){.vc-pulse{animation:vcp 1.6s infinite}@keyframes vcp{70%{box-shadow:0 0 0 8px rgba(224,57,43,0)}100%{box-shadow:0 0 0 0 rgba(224,57,43,0)}}}",
    ".vc-call-h b{display:block;font:600 14px var(--font-display)}.vc-call-h small{color:var(--ink-3);font-size:12px}",
    ".vc-timer{margin-left:auto;font:500 12px var(--font-mono);color:var(--ink-2)}",
    ".vc-lines{height:250px;overflow-y:auto;padding:12px 14px;display:flex;flex-direction:column;gap:8px;background:#FBFAF7}",
    ".vc-line{max-width:88%;padding:7px 11px;border-radius:12px;font-size:13px;line-height:1.4}",
    ".vc-line.bot{background:color-mix(in srgb,var(--ax-accent) 12%,#fff);align-self:flex-start;border-bottom-left-radius:3px}",
    ".vc-line.customer{background:#fff;border:1px solid var(--ax-line);align-self:flex-end;border-bottom-right-radius:3px}",
    ".vc-line small{display:block;font:500 10px var(--font-mono);color:var(--ink-3);margin-bottom:2px;text-transform:uppercase}",
    ".vc-call-f{display:flex;gap:8px;align-items:center;padding:10px 14px;border-top:1px solid var(--ax-line);font-size:12px;color:var(--ink-2);flex-wrap:wrap}",
    ".vc-sec{margin:0 0 16px}.vc-sec h4{margin:0 0 6px;font:600 12px var(--font-mono);text-transform:uppercase;letter-spacing:.06em;color:var(--ink-3)}",
    ".vc-sec p{margin:0;font-size:14px;line-height:1.5}",
    ".vc-meta{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}",
    ".vc-transcript{display:flex;flex-direction:column;gap:6px;max-height:300px;overflow:auto;border:1px solid var(--ax-line);border-radius:10px;padding:10px;background:#FBFAF7}",
    ".vc-tl{font-size:13px;line-height:1.4}.vc-tl b{font:600 11px var(--font-mono);color:var(--ax-accent);margin-right:6px;text-transform:uppercase}.vc-tl i{font:500 10px var(--font-mono);color:var(--ink-3);margin-right:6px;font-style:normal}",
    ".vc-wave{display:flex;align-items:center;gap:2px;height:34px;margin-bottom:14px;padding:0 10px;border:1px solid var(--ax-line);border-radius:10px;background:#fff}",
    ".vc-wave i{flex:1;background:var(--ax-accent);opacity:.55;border-radius:2px;min-width:2px}",
    ".vc-stepper{display:flex;list-style:none;margin:0 0 18px;padding:0;gap:4px}",
    ".vc-stepper li{flex:1;text-align:center;font:600 11px var(--font-body);color:var(--ink-3);position:relative;padding-top:20px}",
    ".vc-stepper li::before{content:'';position:absolute;top:4px;left:50%;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:#D8DEE6;z-index:1}",
    ".vc-stepper li::after{content:'';position:absolute;top:9px;left:-50%;right:50%;height:2px;background:#D8DEE6}",
    ".vc-stepper li:first-child::after{display:none}",
    ".vc-stepper li.on{color:var(--ink)}.vc-stepper li.on::before,.vc-stepper li.on::after{background:var(--ax-accent)}",
    ".vc-stepper li.cur::before{box-shadow:0 0 0 4px color-mix(in srgb,var(--ax-accent) 25%,transparent)}",
    ".vc-act{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.vc-act li{font-size:13px;padding-left:12px;border-left:2px solid var(--ax-line)}.vc-act small{display:block;color:var(--ink-3);font:500 11px var(--font-mono)}",
    ".vc-wa{border:1px solid var(--ax-line);border-radius:12px;overflow:hidden;margin-top:6px}",
    ".vc-wa-h{background:#128C7E;color:#fff;padding:8px 12px;font:600 13px var(--font-body)}",
    ".vc-wa-log{background:#ECE5DD;padding:10px;display:flex;flex-direction:column;gap:6px;max-height:180px;overflow:auto;min-height:60px}",
    ".vc-wa-log p{margin:0;max-width:85%;padding:6px 10px;border-radius:8px;font-size:13px;background:#fff;align-self:flex-start}",
    ".vc-wa-log p.me{background:#DCF8C6;align-self:flex-end}",
    ".vc-wa-f{display:flex;gap:6px;padding:8px;background:#F0F0F0}.vc-wa-f input{flex:1;min-width:0;padding:8px 10px;border:1px solid var(--ax-line);border-radius:999px;font:400 13px var(--font-body)}",
    ".vc-btn{appearance:none;font:600 13px var(--font-body);padding:8px 16px;border-radius:999px;border:1px solid var(--ax-accent);background:var(--ax-accent);color:#fff;cursor:pointer}",
    ".vc-btn.ghost{background:#fff;color:var(--ax-accent)}",
    ".vc-export-box{background:#fff;border:1px solid var(--ax-line);border-radius:12px;padding:20px;display:grid;gap:14px;max-width:760px}",
    ".vc-export-box .row{display:flex;flex-wrap:wrap;gap:12px;align-items:end}.vc-export-box label{display:flex;flex-direction:column;gap:4px;font:500 12px var(--font-mono);color:var(--ink-3)}",
    ".vc-export-box select{padding:8px 10px;border:1px solid var(--ax-line);border-radius:8px;font:400 14px var(--font-body);background:#FBFAF7}",
    ".vc-prev{overflow:auto;border:1px solid var(--ax-line);border-radius:8px}.vc-prev table{border-collapse:collapse;font-size:12px;width:100%}.vc-prev th,.vc-prev td{padding:6px 10px;border-bottom:1px solid var(--ax-line);text-align:left;white-space:nowrap}",
    ".vc-tcard{display:flex;flex-direction:column;gap:4px}.vc-tcard b{font-size:13px}.vc-tcard small{color:var(--ink-3);font-size:12px}"
  ].join("\n");
  var ACCENT = "#4F46E5";
  function injectCss() {
    if (document.getElementById("vc-css")) return;
    var s = document.createElement("style"); s.id = "vc-css";
    s.textContent = CSS + '\n.ax-app[data-slug="voicecrm"],.demo-scope[data-slug="voicecrm"]{--orange:' + ACCENT + '}';
    document.head.appendChild(s);
  }
  injectCss();
  /* Drawers and modals mount outside .ax-app, so they carry their own scoped tokens. */
  function scope() {
    return el("div", { class: "demo-scope", "data-slug": "voicecrm", style: { "--ax-accent": ACCENT, "--ax-line": "rgba(11,31,51,.12)", "--orange": ACCENT } }, Array.prototype.slice.call(arguments));
  }

  function chip(v, cls) { return el("span", { class: "vc-chip " + (cls || v) }, v); }
  function mmss(s) { return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
  function count(rows, key) { var m = {}; rows.forEach(function (r) { m[r[key]] = (m[r[key]] || 0) + 1; }); return m; }
  function sec(title, body) { return el("div", { class: "vc-sec" }, el("h4", {}, title), body); }

  function callDrawer(c) {
    var wave = [];
    for (var i = 0; i < 48; i++) wave.push(el("i", { style: { height: (8 + AX.fake.int(c.id + i, 2, 26)) + "px" } }));
    return el("div", { class: "vc-drawer" },
      el("div", { class: "vc-meta" }, chip(c.bucket + " · " + c.score, c.bucket), chip(c.sentiment), chip(c.outcome), el("span", { class: "vc-chip Cold" }, mmss(c.duration))),
      el("p", { style: { margin: "0 0 14px", color: "var(--ink-3)", fontSize: "13px" } }, c.customer + " · " + c.phone + " · " + c.started + " · handled by " + c.agent),
      el("div", { class: "vc-wave", "aria-label": "Recording waveform (simulated)" }, wave),
      sec("AI summary", el("p", {}, c.summary)),
      sec("Sentiment", el("p", {}, c.sentiment + " overall")),
      sec("Concern", el("p", {}, c.concern)),
      sec("Outcome", el("p", {}, c.outcome + (c.reason ? " — " + c.reason : ""))),
      sec("Action to take", el("p", {}, c.action)),
      c.missing.length ? sec("Missing info", el("p", {}, c.missing.join(", "))) : null,
      sec("Transcript", el("div", { class: "vc-transcript" }, c.transcript.map(function (l) {
        return el("div", { class: "vc-tl" }, el("i", {}, l.ts), el("b", {}, l.who === "bot" ? "Aria" : "Customer"), l.text);
      }))));
  }

  var STEPS = ["New", "In progress", "Follow-up", "Visit done", "Converted"];
  function leadDrawer(l, ctx) {
    var cur = l.stageIx;
    var log = el("div", { class: "vc-wa-log" }, l.wa.map(function (m) { return el("p", { class: m.from === "me" ? "me" : "" }, m.text); }));
    var input = el("input", { class: "vc-wa-input", type: "text", "aria-label": "WhatsApp message", placeholder: "Type a WhatsApp message" });
    input.value = "Hi " + l.name.split(" ")[0] + ", thanks for your interest in " + ctx.data.project + ". Can we schedule a visit?";
    function send() {
      var v = input.value.trim();
      if (!v) return;
      log.appendChild(el("p", { class: "me" }, v));
      log.scrollTop = log.scrollHeight;
      input.value = "";
      AX.ui.toast("Simulated — WhatsApp message not sent", { kind: "sim" });
    }
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") send(); });
    return el("div", {},
      el("div", { class: "vc-meta" }, chip(l.bucket + " · " + l.score, l.bucket), chip(l.stageLabel, l.stage === "Converted" ? "Converted" : l.stage === "NotInterested" ? "Unconverted" : "Pending")),
      el("p", { style: { margin: "0 0 14px", color: "var(--ink-3)", fontSize: "13px" } }, l.phone + " · " + l.email + " · " + l.city + " · owner " + l.owner),
      sec("Pipeline", el("ol", { class: "vc-stepper", "aria-label": "Lead pipeline" }, STEPS.map(function (s, i) {
        return el("li", { class: (i <= cur ? "on" : "") + (i === cur ? " cur" : "") }, s);
      }))),
      sec("Concern", el("p", {}, l.concern + " · " + l.calls + " call" + (l.calls > 1 ? "s" : ""))),
      sec("Activity", el("ul", { class: "vc-act" }, l.activity.map(function (a) { return el("li", {}, el("small", {}, a.at), a.text); }))),
      sec("WhatsApp", el("div", { class: "vc-wa" },
        el("div", { class: "vc-wa-h" }, l.name + " · WhatsApp"), log,
        el("div", { class: "vc-wa-f" }, input, el("button", { type: "button", class: "vc-btn vc-wa-send", on: { click: send } }, "Send")))));
  }

  /* ---- live calls ---- */
  function liveCalls(host, ctx) {
    injectCss();
    var timers = [], boxes = [];
    var wrap = el("div", { class: "vc-live" });
    host.appendChild(wrap);
    ctx.data.live.forEach(function (call, ci) {
      var st = { n: 0, secs: 74 + ci * 41 };
      var lines = el("div", { class: "vc-lines", role: "log", "aria-live": "off" });
      var sent = el("span", { class: "vc-sent vc-chip Neutral" }, "Neutral");
      var timer = el("span", { class: "vc-timer" }, mmss(st.secs));
      var score = el("span", { class: "vc-chip Warm" }, "Warm");
      function add() {
        var l = call.lines[st.n % call.lines.length];
        st.n++;
        lines.appendChild(el("div", { class: "vc-line " + l.who }, el("small", {}, l.who === "bot" ? "Aria" : "Customer"), l.text));
        lines.scrollTop = lines.scrollHeight;
        sent.className = "vc-sent vc-chip " + l.sent; sent.textContent = l.sent;
        score.className = "vc-chip " + (l.sent === "Positive" ? "Hot" : l.sent === "Negative" ? "Cold" : "Warm");
        score.textContent = l.sent === "Positive" ? "Hot" : l.sent === "Negative" ? "Cold" : "Warm";
        if (lines.children.length > 14) lines.removeChild(lines.firstChild);
      }
      add(); add();
      wrap.appendChild(el("article", { class: "vc-call", "data-call": call.id },
        el("div", { class: "vc-call-h" }, el("i", { class: "vc-pulse", "aria-hidden": "true" }),
          el("div", {}, el("b", {}, call.customer), el("small", {}, call.phone + " · " + call.concern)), timer),
        lines,
        el("div", { class: "vc-call-f" }, "Live sentiment", sent, "Lead score", score, el("span", { style: { marginLeft: "auto" } }, "Aria is speaking"))));
      timers.push(setInterval(add, 1200));
      timers.push(setInterval(function () { st.secs++; timer.textContent = mmss(st.secs); }, 1000));
    });
    AX.mount(host, function () { timers.forEach(clearInterval); timers = []; });
  }

  /* ---- export ---- */
  var DATASETS = {
    Calls: { file: "voicecrm-calls", rows: function (d) { return d.calls; }, cols: [
      { key: "id", label: "call_id" }, { key: "customer", label: "customer_name" }, { key: "phone", label: "phone_number", raw: true }, { key: "started", label: "started_at" },
      { get: function (r) { return r.duration; }, label: "duration_sec" }, { key: "agent", label: "agent" }, { key: "sentiment", label: "sentiment" },
      { key: "bucket", label: "lead_bucket" }, { key: "score", label: "lead_score" }, { key: "concern", label: "concern" }, { key: "outcome", label: "outcome" }] },
    Leads: { file: "voicecrm-leads", rows: function (d) { return d.leads; }, cols: [
      { key: "id", label: "lead_id" }, { key: "name", label: "name" }, { key: "phone", label: "phone_number", raw: true }, { key: "email", label: "email" }, { key: "city", label: "city" },
      { key: "stageLabel", label: "stage" }, { key: "bucket", label: "bucket" }, { key: "score", label: "score" }, { key: "owner", label: "owner" }] },
    Tasks: { file: "voicecrm-tasks", rows: function (d) { return d.tasks; }, cols: [
      { key: "id", label: "task_id" }, { key: "title", label: "title" }, { key: "sub", label: "lead" }, { key: "col", label: "status" }, { key: "prio", label: "priority" }, { key: "meta", label: "due_owner" }] }
  };
  function exportsView(host, ctx) {
    injectCss();
    var sel = el("select", { "aria-label": "Dataset" }, Object.keys(DATASETS).map(function (k) { return el("option", { value: k }, k); }));
    var prevBox = el("div", { class: "vc-prev" });
    function ds() { return DATASETS[sel.value]; }
    function preview() {
      var d = ds(), rows = d.rows(ctx.data).slice(0, 5);
      prevBox.textContent = "";
      prevBox.appendChild(el("table", {}, el("thead", {}, el("tr", {}, d.cols.map(function (c) { return el("th", {}, c.label); }))),
        el("tbody", {}, rows.map(function (r) { return el("tr", {}, d.cols.map(function (c) { return el("td", {}, String(typeof c.get === "function" ? c.get(r) : r[c.key])); })); }))));
    }
    sel.addEventListener("change", preview);
    function download() {
      var d = ds(), rows = d.rows(ctx.data);
      var blob = new Blob(["﻿" + toCsv(d.cols, rows)], { type: "text/csv;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = el("a", { href: url, download: d.file + "-2026-10-27.csv" });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      AX.ui.toast("Exported " + rows.length + " rows (fictional data) to CSV", { kind: "ok" });
    }
    preview();
    host.appendChild(el("div", { class: "vc-export-box" },
      el("div", {}, el("h3", { style: { margin: "0 0 4px", font: "600 16px var(--font-display)" } }, "Export data"), el("p", { style: { margin: 0, color: "var(--ink-3)", fontSize: "13px" } }, "Download the fictional demo records as a CSV file you can open in Excel or Sheets.")),
      el("div", { class: "row" }, el("label", {}, "Dataset", sel),
        el("label", {}, "Range", el("select", { "aria-label": "Range" }, ["Last 14 days", "Last 30 days", "This quarter"].map(function (r) { return el("option", {}, r); }))),
        el("button", { type: "button", class: "vc-btn vc-export", on: { click: download } }, "Export CSV")),
      el("div", {}, el("h4", { style: { margin: "0 0 6px", font: "600 12px var(--font-mono)", color: "var(--ink-3)", textTransform: "uppercase" } }, "Preview (first 5 rows)"), prevBox)));
  }

  function build() {
    return {
      brand: { name: "VoiceCRM", accent: "#4F46E5", logoText: "V" },
      start: "dashboard",
      modules: [
        { id: "dashboard", label: "Dashboard", icon: "dashboard", group: "Overview", view: function (ctx) {
          injectCss();
          var d = ctx.data, o = count(d.calls, "outcome"), hot = d.calls.filter(function (c) { return c.bucket === "Hot"; }).length;
          return { type: "dashboard",
            kpis: [{ label: "Calls today", value: 38, delta: 12, format: "num" }, { label: "Avg handle time", value: "3m 12s", delta: -4 },
              { label: "Hot leads", value: hot, delta: 8, format: "num" }, { label: "Conversion", value: "17.6%", delta: 2 }],
            charts: [
              { type: "line", title: "Calls per day (last 14 days)", wide: true, labels: d.labels14, series: [{ name: "Calls", points: d.callsPerDay }] },
              { type: "donut", title: "Call outcomes", parts: [{ label: "Converted", value: o.Converted || 0 }, { label: "Pending", value: o.Pending || 0 }, { label: "Unconverted", value: o.Unconverted || 0 }] },
              { type: "funnel", title: "Enquiry funnel", steps: [{ label: "Calls", value: 412 }, { label: "Qualified", value: 238 }, { label: "Site visit", value: 121 }, { label: "Booked", value: 47 }] }
            ] };
        } },
        { id: "live-calls", label: "Live calls", icon: "phone", group: "Calls", view: { type: "custom", render: liveCalls } },
        { id: "calls", label: "Calls", icon: "table", group: "Calls", view: function (ctx) {
          return { type: "table", pageSize: 10, rows: ctx.data.calls, qKeys: ["id", "customer", "phone", "concern", "agent"],
            filters: [{ key: "bucket", label: "score", options: ["Hot", "Warm", "Cold"] }, { key: "sentiment", label: "sentiment", options: ["Positive", "Neutral", "Negative"] }, { key: "outcome", label: "outcome", options: ["Converted", "Pending", "Unconverted"] }],
            columns: [
              { key: "id", label: "Call", sortable: true }, { key: "customer", label: "Customer", sortable: true }, { key: "started", label: "Started", sortable: true },
              { key: "duration", label: "Duration", sortable: true, render: function (r) { return mmss(r.duration); } },
              { key: "sentiment", label: "Sentiment", render: function (r) { return chip(r.sentiment); } },
              { key: "score", label: "Score", sortable: true, render: function (r) { return chip(r.bucket + " · " + r.score, r.bucket); } },
              { key: "concern", label: "Concern" }, { key: "outcome", label: "Outcome", render: function (r) { return chip(r.outcome); } }],
            drawer: function (r) { return scope(callDrawer(r)); } };
        } },
        { id: "insights", label: "Call insights", icon: "star", group: "Calls", view: function (ctx) {
          var d = ctx.data, s = count(d.calls, "sentiment"), b = count(d.calls, "bucket"), cn = count(d.calls, "concern");
          var avg = Math.round(d.calls.reduce(function (a, c) { return a + c.score; }, 0) / d.calls.length);
          return { type: "dashboard",
            kpis: [{ label: "Avg lead score", value: avg, delta: 3, format: "num" }, { label: "Positive calls", value: Math.round((s.Positive || 0) / d.calls.length * 100) + "%", delta: 5 },
              { label: "Missed calls", value: 1, delta: -50, format: "num" }, { label: "Top concern", value: "Price" }],
            charts: [
              { type: "donut", title: "Sentiment", parts: ["Positive", "Neutral", "Negative"].map(function (k) { return { label: k, value: s[k] || 0 }; }) },
              { type: "bar", title: "Lead score bucket", labels: ["Hot", "Warm", "Cold"], values: [b.Hot || 0, b.Warm || 0, b.Cold || 0] },
              { type: "bar", title: "What callers ask about", wide: true, horizontal: true, labels: d.concerns, values: d.concerns.map(function (k) { return cn[k] || 0; }) }
            ] };
        } },
        { id: "leads", label: "Leads", icon: "users", group: "Sales", view: function (ctx) {
          return { type: "table", pageSize: 10, rows: ctx.data.leads, qKeys: ["id", "name", "phone", "email", "concern"],
            filters: [{ key: "bucket", label: "score", options: ["Hot", "Warm", "Cold"] }, { key: "stageLabel", label: "stage", options: ["New", "In progress", "Follow-up scheduled", "Converted", "Not interested"] }],
            columns: [
              { key: "name", label: "Lead", sortable: true }, { key: "phone", label: "Phone" },
              { key: "stageLabel", label: "Stage", sortable: true }, { key: "score", label: "Score", sortable: true, render: function (r) { return chip(r.bucket + " · " + r.score, r.bucket); } },
              { key: "concern", label: "Concern" }, { key: "calls", label: "Calls", sortable: true }, { key: "owner", label: "Owner" }],
            drawer: function (r, c) { return scope(leadDrawer(r, c)); } };
        } },
        { id: "tasks", label: "Follow-up tasks", icon: "board", group: "Sales", view: function (ctx) {
          return { type: "board",
            columns: [{ id: "todo", label: "To do" }, { id: "doing", label: "In progress" }, { id: "done", label: "Done", tone: "good" }],
            cards: ctx.data.tasks,
            renderCard: function (c) { return el("div", { class: "vc-tcard" }, el("b", {}, c.title), el("small", {}, c.sub), el("div", {}, chip(c.prio === "high" ? "High" : c.prio === "med" ? "Medium" : "Low", c.prio)), el("small", {}, c.meta)); },
            onMove: function (card, col) { AX.ui.toast("Simulated — task moved to " + col + " (nothing saved)", { kind: "sim" }); } };
        } },
        { id: "reports", label: "Reports", icon: "chart", group: "Insights", view: function (ctx) {
          var d = ctx.data;
          return { type: "dashboard",
            kpis: [{ label: "Calls (30d)", value: 1184, delta: 9, format: "num" }, { label: "Answered by AI", value: "96%", delta: 1 }, { label: "Avg score", value: 58, delta: 2, format: "num" }, { label: "Bookings", value: 47, delta: 14, format: "num" }],
            charts: [
              { type: "line", title: "Conversion rate trend (%)", wide: true, labels: d.labels14, series: [{ name: "Conversion %", points: d.convPerDay }, { name: "Qualified %", points: d.convPerDay.map(function (v, i) { return v + 18 + (i % 3); }) }] },
              { type: "bar", title: "Leads handled per executive", labels: ["Rhea", "Tarun", "Mansi", "Simran", "Dev"], values: [72, 60, 68, 56, 36] },
              { type: "gauge", title: "AI answer rate", value: 96, label: "Answered" }
            ] };
        } },
        { id: "exports", label: "Exports", icon: "file", group: "Insights", view: { type: "custom", render: exportsView } },
        { id: "employees", label: "Team", icon: "settings", group: "Admin", view: function (ctx) {
          return { type: "table", pageSize: 10, rows: ctx.data.employees, qKeys: ["name", "role", "email"],
            filters: [{ key: "status", label: "status", options: ["Active", "Away"] }],
            columns: [{ key: "name", label: "Name", sortable: true }, { key: "role", label: "Role" }, { key: "handled", label: "Calls handled", sortable: true },
              { key: "conversion", label: "Conversion %", sortable: true }, { key: "avgScore", label: "Avg lead score", sortable: true }, { key: "status", label: "Status", render: function (r) { return chip(r.status); } }],
            drawer: function (r) {
              return scope(el("div", {}, el("div", { class: "vc-meta" }, chip(r.status), el("span", { class: "vc-chip Cold" }, r.role)),
                sec("Contact", el("p", {}, r.email)), sec("This month", el("p", {}, r.handled + " calls handled · " + r.conversion + "% conversion · avg score " + r.avgScore)),
                sec("Permissions", el("p", {}, r.role === "Voice agent" ? "Inbound calls, auto-summaries, WhatsApp brochure send" : "Calls, leads, tasks, WhatsApp, exports"))));
            } };
        } }
      ]
    };
  }
  AX.demos.voicecrm = build();
})(window);
