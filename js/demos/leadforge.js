(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.demos = AX.demos || {};

  /** Pure: plain-English sentence -> criteria chips [{key,label,value}]. "dental clinics in Delhi with a website". */
  function parse(sentence) {
    var s = String(sentence || "").trim().replace(/\s+/g, " ");
    var out = [];
    if (!s) return out;
    var m = /^(.*?)\s+(?:in|near|around|across)\s+(.+?)(?:\s+(?:with|that|who|having)\s+(.+))?$/i.exec(s);
    var cat = m ? m[1] : s, loc = m ? m[2] : "", rest = m && m[3] ? m[3] : "";
    out.push({ key: "category", label: "Business type", value: cat.toLowerCase() });
    if (loc) out.push({ key: "location", label: "Location", value: loc.replace(/\b\w/g, function (c) { return c.toUpperCase(); }) });
    if (/web\s?site/i.test(rest)) out.push({ key: "website", label: "Must have", value: "A website" });
    if (/instagram/i.test(rest)) out.push({ key: "instagram", label: "Must have", value: "Instagram profile" });
    if (/phone|contact|number/i.test(rest)) out.push({ key: "phone", label: "Must have", value: "Phone number" });
    var n = /(\d+)\+?\s*(?:students|members|staff|reviews)/i.exec(rest);
    if (n) out.push({ key: "size", label: "Size", value: n[1] + "+ " + /students|members|staff|reviews/i.exec(rest)[0].toLowerCase() });
    var cnt = /(\d+)\s*(?:leads|results|businesses)/i.exec(s);
    out.push({ key: "count", label: "Target count", value: cnt ? cnt[1] : "40" });
    return out;
  }
  AX.leadforge = { parse: parse };

  if (typeof document === "undefined" || !document.getElementById) return;
  var el = AX.el, SLUG = "leadforge", ACCENT = "#7C3AED";

  var CSS = [
    '.lf-card{background:#fff;border:1px solid var(--ax-line);border-radius:12px;padding:18px;max-width:820px}',
    '.lf-card h3{margin:0 0 6px;font:600 16px var(--font-display)}.lf-card p{margin:0 0 12px;color:var(--ink-3);font-size:13px}',
    '.lf-card textarea{width:100%;box-sizing:border-box;min-height:70px;padding:10px 12px;border:1px solid var(--ax-line);border-radius:10px;font:400 15px var(--font-body);resize:vertical}',
    '.lf-btn{appearance:none;font:600 13px var(--font-body);padding:9px 18px;border-radius:999px;border:1px solid var(--ax-accent);background:var(--ax-accent);color:#fff;cursor:pointer}',
    '.lf-btn.ghost{background:#fff;color:var(--ax-accent)}.lf-btn[disabled]{opacity:.45;cursor:not-allowed}',
    '.lf-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:12px}',
    '.lf-chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}',
    '.lf-crit{display:inline-flex;flex-direction:column;background:#F5F0FF;border:1px solid #DDD0FB;border-radius:10px;padding:6px 12px}',
    '.lf-crit small{font:600 10px var(--font-mono);text-transform:uppercase;color:#6D28D9}.lf-crit b{font-size:14px}',
    '.ax-app[data-slug="leadforge"] .tbl td{white-space:nowrap}',
    '.lf-cell{appearance:none;background:none;border:0;border-bottom:1px dashed #A78BFA;padding:0;font:inherit;color:inherit;cursor:pointer;text-align:left}',
    '.lf-cell:hover,.lf-cell:focus-visible{color:#6D28D9}',
    '.lf-conf{display:inline-block;font:700 11px var(--font-mono);padding:2px 7px;border-radius:6px;background:#EDE9FE;color:#5B21B6}',
    '.lf-conf.hi{background:#DCFCE7;color:#166534}.lf-conf.lo{background:#FEF3D7;color:#8A5A00}',
    '.lf-dl{display:grid;grid-template-columns:110px 1fr;gap:8px 12px;margin:0;font-size:14px}.lf-dl dt{color:var(--ink-3);font:600 12px var(--font-mono);text-transform:uppercase}.lf-dl dd{margin:0;word-break:break-all}',
    '.lf-bar{height:8px;background:#EEE;border-radius:4px;overflow:hidden;margin:4px 0 14px}.lf-bar i{display:block;height:100%;background:var(--ax-accent)}',
    '.lf-chip{display:inline-block;font:600 11px var(--font-body);padding:2px 9px;border-radius:999px;background:#EEF0F3;color:#475467}.lf-chip.Complete,.lf-chip.Active{background:#DCFCE7;color:#166534}.lf-chip.Needs{background:#FEF3D7;color:#8A5A00}.lf-chip.Failed{background:#FEE9E7;color:#B42318}',
    '.lf-done{margin-bottom:10px;padding:10px 14px;background:#F5F0FF;border:1px solid #DDD0FB;border-radius:10px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;font-size:13px}'
  ].join("\n");
  function injectCss() {
    if (document.getElementById("lf-css")) return;
    var s = document.createElement("style"); s.id = "lf-css";
    s.textContent = CSS + '\n.ax-app[data-slug="' + SLUG + '"],.demo-scope[data-slug="' + SLUG + '"]{--orange:' + ACCENT + '}';
    document.head.appendChild(s);
  }
  injectCss();
  function scope() {
    return el("div", { class: "demo-scope", "data-slug": SLUG, style: { "--ax-accent": ACCENT, "--ax-line": "rgba(11,31,51,.12)", "--orange": ACCENT } }, Array.prototype.slice.call(arguments));
  }
  function confEl(n) { return el("span", { class: "lf-conf " + (n >= 90 ? "hi" : n < 75 ? "lo" : "") }, n + "%"); }
  function statusChip(s) { return el("span", { class: "lf-chip " + s.split(" ")[0] }, s); }

  var DEFAULT_Q = "dental clinics in Delhi with a website";

  function newSearch(host, ctx) {
    injectCss();
    var ta = el("textarea", { "aria-label": "Describe the leads you want", placeholder: "e.g. dental clinics in Delhi with a website" });
    ta.value = (ctx.state.get().query) || DEFAULT_Q;
    var chips = el("div", { class: "lf-chips", "aria-live": "polite" });
    var go = el("button", { type: "button", class: "lf-btn", disabled: "", "data-act": "run" }, "Run research");
    var understand = el("button", { type: "button", class: "lf-btn ghost", "data-act": "understand", on: { click: function () {
      var c = parse(ta.value);
      chips.textContent = "";
      if (!c.length) { chips.appendChild(el("span", { class: "lf-chip" }, "Describe the audience first")); return; }
      c.forEach(function (x) { chips.appendChild(el("span", { class: "lf-crit", "data-key": x.key }, el("small", {}, x.label), el("b", {}, x.value))); });
      go.removeAttribute("disabled");
      ctx.state.set({ query: ta.value, criteria: c });
    } } }, "Understand this");
    go.addEventListener("click", function () { ctx.open("run"); });
    host.appendChild(el("div", { class: "lf-card" },
      el("h3", {}, "What leads do you need?"),
      el("p", {}, "Describe the audience in plain English. LeadForge turns it into a structured spec, then discovers, crawls, normalizes and dedupes."),
      ta, el("div", { class: "lf-row" }, understand, go), chips));
  }

  function runView(host, ctx) {
    injectCss();
    var q = ctx.state.get().query || DEFAULT_Q;
    var done = el("div", { class: "lf-done", hidden: "" });
    var open = el("button", { type: "button", class: "lf-btn", on: { click: function () { ctx.open("results"); } } }, "View 40 results");
    var holder = el("div");
    host.appendChild(el("div", {}, el("p", { style: { margin: "0 0 10px", fontSize: "14px" } }, "Query: ", el("b", {}, q)), done, holder));
    var inst = AX.pipeline.create(holder, {
      currency: "$", cap: 2,
      stages: [
        { id: "plan", label: "Plan", ms: 700, cost: 0.02, log: ["Parsed the sentence into a search spec", "Chose 3 source families"] },
        { id: "discover", label: "Discover", ms: 900, cost: 0.11, log: ["Queried map listings: 58 candidates", "Queried local directories: 41 candidates"] },
        { id: "crawl", label: "Crawl", ms: 1100, cost: 0.46, log: ["Fetched 52 business sites", "Extracted contact pages", "7 sites blocked crawling and were skipped"] },
        { id: "normalize", label: "Normalize", ms: 700, cost: 0.08, log: ["Normalised phones to +91 format", "Standardised addresses"] },
        { id: "dedupe", label: "Dedupe", ms: 600, cost: 0.03, log: ["Merged 19 duplicates", "Kept 40 leads with confidence above 60%"] }
      ]
    });
    var tmr = setInterval(function () {
      var s = inst.state();
      if (s && s.stages.every(function (x) { return x.status === "done"; })) {
        clearInterval(tmr);
        done.removeAttribute("hidden"); done.setAttribute("data-run", "complete");
        done.textContent = "";
        done.appendChild(el("span", {}, "Research complete: 40 leads, cost $" + s.cost.toFixed(2)));
        done.appendChild(open);
        ctx.state.set({ ran: true });
      }
    }, 200);
    AX.mount(host, function () { clearInterval(tmr); });
    setTimeout(function () { inst.start(); }, 0);
  }

  function provDrawer(row, field, label) {
    var f = row.fields[field];
    var val = field === "website" ? row.website : row[field];
    return scope(
      el("p", { style: { margin: "0 0 12px", color: "var(--ink-3)", fontSize: "13px" } }, row.name + " · " + label),
      el("dl", { class: "lf-dl" },
        el("dt", {}, "Value"), el("dd", {}, String(val)),
        el("dt", {}, "Source"), el("dd", {}, f.source),
        el("dt", {}, "URL"), el("dd", {}, f.url),
        el("dt", {}, "Method"), el("dd", {}, f.method),
        el("dt", {}, "Confidence"), el("dd", {}, confEl(f.confidence)),
        el("dt", {}, "Fetched"), el("dd", {}, f.fetched)),
      el("div", { class: "lf-bar", "aria-hidden": "true" }, el("i", { style: { width: f.confidence + "%" } })),
      el("p", { style: { fontSize: "12px", color: "var(--ink-3)" } }, "Every field in LeadForge keeps its source, URL, extraction method and confidence so you can trust or re-check it."));
  }

  function cellBtn(row, field, label, text) {
    return el("button", { type: "button", class: "lf-cell", "data-field": field, "aria-label": label + " provenance for " + row.name,
      on: { click: function () { AX.ui.drawer({ title: row.name + " — " + label, body: provDrawer(row, field, label) }); } } }, text);
  }

  AX.demos[SLUG] = {
    brand: { name: "LeadForge", accent: ACCENT, logoText: "L" },
    start: "new",
    modules: [
      { id: "new", label: "New research", icon: "flask", group: "Research", view: { type: "custom", render: newSearch } },
      { id: "run", label: "Run", icon: "pipeline", group: "Research", view: { type: "custom", render: runView } },
      { id: "results", label: "Results", icon: "table", group: "Research", view: function (ctx) {
        injectCss();
        return { type: "table", pageSize: 10, rows: ctx.data.rows, qKeys: ["name", "area", "phone", "email"],
          filters: [{ key: "area", label: "area", options: ctx.data.rows.map(function (r) { return r.area; }).filter(function (v, i, a) { return a.indexOf(v) === i; }) }],
          columns: [
            { key: "name", label: "Business", sortable: true },
            { key: "area", label: "Area", sortable: true },
            { key: "phone", label: "Phone", render: function (r) { return cellBtn(r, "phone", "Phone", r.phone); } },
            { key: "email", label: "Email", render: function (r) { return cellBtn(r, "email", "Email", r.email); } },
            { key: "website", label: "Website", render: function (r) { return cellBtn(r, "website", "Website", r.website); } },
            { key: "address", label: "Address", render: function (r) { return cellBtn(r, "address", "Address", r.address); } },
            { key: "confidence", label: "Confidence", sortable: true, render: function (r) { return confEl(r.confidence); } }
          ] };
      } },
      { id: "history", label: "History", icon: "file", group: "Library", view: function (ctx) {
        return { type: "table", pageSize: 10, rows: ctx.data.history, qKeys: ["id", "query", "owner"],
          filters: [{ key: "status", label: "status", options: ["Complete", "Needs review", "Failed (rate limit)"] }],
          columns: [{ key: "id", label: "Run", sortable: true }, { key: "query", label: "Query" }, { key: "results", label: "Leads", sortable: true }, { key: "cost", label: "Cost" },
            { key: "status", label: "Status", render: function (r) { return statusChip(r.status); } }, { key: "when", label: "Date", sortable: true }, { key: "owner", label: "By" }],
          drawer: function (r) { return scope(el("dl", { class: "lf-dl" }, el("dt", {}, "Query"), el("dd", {}, r.query), el("dt", {}, "Leads"), el("dd", {}, String(r.results)), el("dt", {}, "Cost"), el("dd", {}, r.cost), el("dt", {}, "Status"), el("dd", {}, r.status), el("dt", {}, "Run by"), el("dd", {}, r.owner))); } };
      } },
      { id: "admin", label: "Admin", icon: "settings", group: "Workspace", view: function (ctx) {
        return { type: "table", pageSize: 10, rows: ctx.data.admin, qKeys: ["name", "email", "role"],
          filters: [{ key: "role", label: "role", options: ["Owner", "Analyst", "Viewer"] }, { key: "status", label: "status", options: ["Active", "Invited"] }],
          columns: [{ key: "name", label: "Member", sortable: true }, { key: "email", label: "Email" }, { key: "role", label: "Role", sortable: true }, { key: "runs", label: "Runs", sortable: true }, { key: "credits", label: "Credits left", sortable: true }, { key: "status", label: "Status", render: function (r) { return statusChip(r.status); } }],
          actions: [{ label: "Reset credits", onClick: function () { AX.ui.toast("Simulated — credits reset (nothing saved)", { kind: "sim" }); } }] };
      } }
    ]
  };
})(window);
