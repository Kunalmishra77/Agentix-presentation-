(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.demos = AX.demos || {};
  if (typeof document === "undefined" || !document.getElementById) return;
  var el = AX.el, SLUG = "riya-crm", ACCENT = "#16A34A";

  var CSS = [
    '.rc-chip{display:inline-block;font:600 11px var(--font-body);padding:2px 9px;border-radius:999px;white-space:nowrap}',
    '.rc-chip.New{background:#E6EEF9;color:#26467A}.rc-chip.Qualified{background:#FEF3D7;color:#8A5A00}',
    '.rc-chip.TrialBooked{background:#DCFCE7;color:#166534}.rc-chip.Converted{background:#16A34A;color:#fff}.rc-chip.Lost{background:#FEE9E7;color:#B42318}',
    '.rc-chip.Positive{background:#DCFCE7;color:#166534}.rc-chip.Neutral{background:#EEF0F3;color:#475467}.rc-chip.Negative{background:#FEE9E7;color:#B42318}',
    '.rc-score{display:inline-block;min-width:34px;text-align:center;font:700 12px var(--font-mono);padding:2px 6px;border-radius:6px;background:#F0FDF4;color:#166534}',
    '.rc-score.hot{background:#16A34A;color:#fff}.rc-score.low{background:#F3F4F6;color:#667085}',
    '.rc-bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:10px}',
    '.rc-btn{appearance:none;font:600 13px var(--font-body);padding:8px 16px;border-radius:999px;border:1px solid var(--ax-accent);background:var(--ax-accent);color:#fff;cursor:pointer}',
    '.rc-btn.ghost{background:#fff;color:var(--ax-accent)}',
    '.rc-inbox{display:flex;flex-direction:column;gap:10px}',
    '.rc-side{padding:14px;display:flex;flex-direction:column;gap:10px;font-size:13px}.rc-side h4{margin:0;font:600 12px var(--font-mono);text-transform:uppercase;color:var(--ink-3)}',
    '.rc-side dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:4px 10px}.rc-side dt{color:var(--ink-3)}.rc-side dd{margin:0}',
    '.rc-sec{margin:0 0 14px}.rc-sec h4{margin:0 0 6px;font:600 12px var(--font-mono);text-transform:uppercase;letter-spacing:.06em;color:var(--ink-3)}.rc-sec p{margin:0;font-size:14px;line-height:1.5}',
    '.rc-log{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.rc-log li{font-size:13px;padding:6px 10px;border-left:3px solid var(--ax-accent);background:#F6FBF7;border-radius:0 6px 6px 0}',
    '.rc-export{background:#fff;border:1px solid var(--ax-line);border-radius:12px;padding:20px;display:grid;gap:14px;max-width:720px}',
    '.rc-export label{display:flex;flex-direction:column;gap:4px;font:500 12px var(--font-mono);color:var(--ink-3)}.rc-export select{padding:8px 10px;border:1px solid var(--ax-line);border-radius:8px;font:400 14px var(--font-body)}',
    '.rc-tcard b{display:block;font-size:13px}.rc-tcard small{display:block;color:var(--ink-3);font-size:12px;margin-top:2px}',
    '.rc-ban{background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:10px 14px;font-size:13px;margin-bottom:10px}.rc-ban a{color:#166534;font-weight:600}'
  ].join("\n");
  function injectCss() {
    if (document.getElementById("rc-css")) return;
    var s = document.createElement("style"); s.id = "rc-css";
    s.textContent = CSS + '\n.ax-app[data-slug="' + SLUG + '"],.demo-scope[data-slug="' + SLUG + '"]{--orange:' + ACCENT + '}';
    document.head.appendChild(s);
  }
  injectCss();
  function scope() {
    return el("div", { class: "demo-scope", "data-slug": SLUG, style: { "--ax-accent": ACCENT, "--ax-line": "rgba(11,31,51,.12)", "--orange": ACCENT } }, Array.prototype.slice.call(arguments));
  }
  function chip(v) { return el("span", { class: "rc-chip " + v }, v); }
  function scoreEl(s) { return el("span", { class: "rc-score" + (s >= 75 ? " hot" : s < 40 ? " low" : "") }, String(s)); }
  function sec(t, b) { return el("div", { class: "rc-sec" }, el("h4", {}, t), b); }
  function countBy(rows, k) { var m = {}; rows.forEach(function (r) { m[r[k]] = (m[r[k]] || 0) + 1; }); return m; }

  function csvText(cols, rows) {
    function q(v) { v = v == null ? "" : String(v); if (/^[=+\-@]/.test(v)) v = "'" + v; return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
    return [cols.map(function (c) { return q(c.label); }).join(",")].concat(rows.map(function (r) { return cols.map(function (c) { return q(r[c.key]); }).join(","); })).join("\r\n") + "\r\n";
  }

  function leadDrawer(l, ctx) {
    var log = [
      "Riya answered the first WhatsApp message (" + l.daysAgo + " day" + (l.daysAgo === 1 ? "" : "s") + " ago)",
      "Goal captured: " + l.goal, "Interest in the " + l.plan + " plan"
    ];
    if (l.outcome === "TrialBooked" || l.outcome === "Converted") log.push("Free trial booked by Riya");
    if (l.outcome === "Converted") log.push("Joined after trial — sales desk closed the plan");
    if (l.outcome === "Lost") log.push("Went quiet after price discussion");
    var wa = el("div", { style: { display: "flex", gap: "6px", marginTop: "6px" } },
      el("input", { type: "text", "aria-label": "WhatsApp message", placeholder: "Message " + l.name.split(" ")[0], style: { flex: "1", padding: "8px 10px", border: "1px solid var(--ax-line)", borderRadius: "8px" } }),
      el("button", { type: "button", class: "rc-btn", on: { click: function () { AX.ui.toast("Simulated — WhatsApp message not sent", { kind: "sim" }); } } }, "Send"));
    return scope(
      el("div", { class: "rc-bar" }, chip(l.outcome), chip(l.sentiment), scoreEl(l.score)),
      el("p", { style: { margin: "0 0 12px", color: "var(--ink-3)", fontSize: "13px" } }, l.phone + " · " + l.email + " · via " + l.source + " · owner " + l.owner),
      sec("Last message", el("p", {}, "“" + l.lastMsg + "”")),
      sec("Riya's timeline", el("ul", { class: "rc-log" }, log.map(function (t) { return el("li", {}, t); }))),
      sec("Reply as sales desk", wa));
  }

  function inbox(host, ctx) {
    injectCss();
    var d = ctx.data, booked = false;
    var banner = el("div", { class: "rc-ban", "aria-live": "polite" }, "Open the live thread and press Play: Riya qualifies an enquiry and books a free trial. The lead flips to TrialBooked in Leads.");
    var play = el("button", { type: "button", class: "rc-btn", "data-act": "play" }, "Play Riya's conversation");
    var holder = el("div");
    host.appendChild(el("div", { class: "rc-inbox" }, el("div", { class: "rc-bar" }, play,
      el("button", { type: "button", class: "rc-btn ghost", on: { click: function () { ctx.open("leads"); } } }, "Open Leads")), banner, holder));
    var inst = AX.chat.create(holder, {
      threads: d.threads, scripts: d.scripts, composer: true,
      side: function (t) {
        var lead = d.leads.filter(function (l) { return l.id === t.leadId; })[0] || (t.leadId === "NEW" && ctx.state.get().trialLead) || null;
        return el("div", { class: "rc-side" }, el("h4", {}, "Lead"),
          lead ? el("dl", {}, el("dt", {}, "Name"), el("dd", {}, lead.name), el("dt", {}, "Goal"), el("dd", {}, lead.goal), el("dt", {}, "Score"), el("dd", {}, String(lead.score)), el("dt", {}, "Outcome"), el("dd", {}, lead.outcome))
            : el("p", {}, "No lead yet. Riya creates one once the enquirer shares a goal."));
      },
      onEvent: function (ev, t) {
        if (ev !== "trial" || booked) return;
        booked = true;
        var p = AX.fake.person("riya-new-trial");
        var lead = { id: "L-1033", name: p.name, phone: p.phone, email: p.email, goal: "Weight loss", source: "Instagram ad", score: 82, sentiment: "Positive",
          outcome: "TrialBooked", plan: "3 months", owner: "Sales desk A", lastMsg: "Yes, this Saturday morning.", daysAgo: 0, fresh: true };
        d.leads.unshift(lead);
        d.tasks.unshift({ id: "T-new", col: "todo", title: "Call after trial — " + lead.name, sub: lead.goal + " · " + lead.phone, meta: "Due Saturday · Sales desk A", leadId: lead.id });
        ctx.state.set({ trialLead: lead });
        banner.textContent = "Trial booked by Riya: " + lead.name + " is now TrialBooked in Leads (score " + lead.score + ").";
        banner.setAttribute("data-trial", "booked");
        AX.ui.toast("Simulated — trial booked in the demo CRM (nothing saved)", { kind: "sim" });
        setTimeout(function () { inst.open(t.id); }, 0);
      }
    });
    inst.open("live");
    play.addEventListener("click", function () { inst.play("live"); });
  }

  function exportsView(host, ctx) {
    injectCss();
    var d = ctx.data;
    var sets = {
      "Leads": { cols: [{ key: "id", label: "Lead" }, { key: "name", label: "Name" }, { key: "phone", label: "Phone" }, { key: "goal", label: "Goal" }, { key: "source", label: "Source" }, { key: "score", label: "Score" }, { key: "sentiment", label: "Sentiment" }, { key: "outcome", label: "Outcome" }], rows: function () { return d.leads; } },
      "Follow-up tasks": { cols: [{ key: "id", label: "Task" }, { key: "title", label: "Title" }, { key: "col", label: "Status" }, { key: "meta", label: "Due / owner" }], rows: function () { return d.tasks; } },
      "Trial bookings": { cols: [{ key: "id", label: "Lead" }, { key: "name", label: "Name" }, { key: "plan", label: "Plan interest" }, { key: "owner", label: "Owner" }], rows: function () { return d.leads.filter(function (l) { return l.outcome === "TrialBooked"; }); } }
    };
    var sel = el("select", { "aria-label": "Dataset" }, Object.keys(sets).map(function (k) { return el("option", {}, k); }));
    var prev = el("pre", { style: { margin: "0", maxHeight: "200px", overflow: "auto", fontSize: "12px", background: "#F8FAF9", padding: "10px", borderRadius: "8px", border: "1px solid var(--ax-line)" } });
    function build() { var s = sets[sel.value]; return csvText(s.cols, s.rows()); }
    function refresh() { prev.textContent = build().split("\r\n").slice(0, 6).join("\n"); }
    sel.addEventListener("change", refresh);
    var btn = el("button", { type: "button", class: "rc-btn", on: { click: function () {
      var blob = new Blob([build()], { type: "text/csv" }), a = el("a", { href: URL.createObjectURL(blob), download: "riya-" + sel.value.toLowerCase().replace(/\s+/g, "-") + ".csv" });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      AX.ui.toast("Simulated — CSV built from demo data, nothing was sent", { kind: "sim" });
    } } }, "Export CSV");
    host.appendChild(el("div", { class: "rc-export" }, el("label", {}, "Dataset", sel), btn, el("div", {}, el("h4", { style: { margin: "0 0 6px", font: "600 12px var(--font-mono)", color: "var(--ink-3)", textTransform: "uppercase" } }, "Preview"), prev)));
    refresh();
  }

  AX.demos[SLUG] = {
    brand: { name: "Riya CRM", accent: ACCENT, logoText: "R" },
    start: "dashboard",
    modules: [
      { id: "dashboard", label: "Dashboard", icon: "dashboard", group: "Overview", view: function (ctx) {
        var d = ctx.data, oc = countBy(d.leads, "outcome"), n = d.leads.length;
        var conv = Math.round((oc.Converted || 0) / n * 100);
        return { type: "dashboard",
          kpis: [{ label: "Leads (30d)", value: n, delta: 12, format: "num" }, { label: "Trials booked", value: oc.TrialBooked || 0, delta: 18, format: "num" },
            { label: "Converted", value: oc.Converted || 0, delta: 6, format: "num" }, { label: "Conversion", value: conv + "%", delta: 3 }],
          charts: [
            { type: "line", title: "Leads and trials, last 14 days", wide: true, labels: d.labels14, series: [{ name: "Leads", points: d.leadsPerDay }, { name: "Trials", points: d.trialsPerDay }] },
            { type: "donut", title: "Outcomes", parts: d.outcomes.map(function (k) { return { label: k, value: oc[k] || 0 }; }) },
            { type: "funnel", title: "Enquiry funnel", steps: [{ label: "Enquiries", value: n }, { label: "Qualified", value: (oc.Qualified || 0) + (oc.TrialBooked || 0) + (oc.Converted || 0) }, { label: "Trial booked", value: (oc.TrialBooked || 0) + (oc.Converted || 0) }, { label: "Converted", value: oc.Converted || 0 }] }
          ] };
      } },
      { id: "inbox", label: "Riya inbox", icon: "chat", group: "Conversations", view: { type: "custom", render: inbox } },
      { id: "leads", label: "Leads", icon: "users", group: "Conversations", view: function (ctx) {
        return { type: "table", pageSize: 10, rows: ctx.data.leads, qKeys: ["id", "name", "phone", "goal", "source"],
          filters: [{ key: "outcome", label: "outcome", options: ctx.data.outcomes }, { key: "sentiment", label: "sentiment", options: ctx.data.sentiments }, { key: "goal", label: "goal", options: ctx.data.goals }],
          columns: [{ key: "id", label: "Lead", sortable: true }, { key: "name", label: "Name", sortable: true }, { key: "goal", label: "Goal" }, { key: "source", label: "Source" },
            { key: "score", label: "Score", sortable: true, render: function (r) { return scoreEl(r.score); } },
            { key: "sentiment", label: "Sentiment", render: function (r) { return chip(r.sentiment); } },
            { key: "outcome", label: "Outcome", sortable: true, render: function (r) { return chip(r.outcome); } }],
          drawer: function (r, c) { return leadDrawer(r, c); } };
      } },
      { id: "insights", label: "Insights", icon: "star", group: "Analytics", view: function (ctx) {
        var d = ctx.data, s = countBy(d.leads, "sentiment"), src = countBy(d.leads, "source");
        var buckets = [0, 0, 0, 0]; d.leads.forEach(function (l) { buckets[Math.min(3, Math.floor(l.score / 25))]++; });
        return { type: "dashboard",
          kpis: [{ label: "Avg lead score", value: Math.round(d.leads.reduce(function (a, l) { return a + l.score; }, 0) / d.leads.length), delta: 4, format: "num" },
            { label: "Positive sentiment", value: Math.round((s.Positive || 0) / d.leads.length * 100) + "%", delta: 5 }, { label: "Top source", value: "Instagram" }, { label: "Top objection", value: "Price" }],
          charts: [
            { type: "donut", title: "Sentiment", parts: d.sentiments.map(function (k) { return { label: k, value: s[k] || 0 }; }) },
            { type: "bar", title: "Score bands (0-24, 25-49, 50-74, 75+)", labels: ["Cold", "Cool", "Warm", "Hot"], values: buckets },
            { type: "bar", title: "Objections Riya hears", wide: true, horizontal: true, labels: d.objections, values: d.objectionCounts },
            { type: "bar", title: "Leads by source", labels: d.sources.map(function (x) { return x.split(" ")[0]; }), values: d.sources.map(function (k) { return src[k] || 0; }) }
          ] };
      } },
      { id: "tasks", label: "Follow-up tasks", icon: "board", group: "Sales desk", view: function (ctx) {
        return { type: "board", columns: [{ id: "todo", label: "To do" }, { id: "doing", label: "In progress", tone: "orange" }, { id: "done", label: "Done", tone: "good" }],
          cards: ctx.data.tasks,
          renderCard: function (c) { return el("div", { class: "rc-tcard" }, el("b", {}, c.title), el("small", {}, c.sub), el("small", {}, c.meta)); },
          onMove: function (card, col) { AX.ui.toast("Simulated — task moved to " + col + " (nothing saved)", { kind: "sim" }); } };
      } },
      { id: "reports", label: "Reports", icon: "chart", group: "Analytics", view: function (ctx) {
        var d = ctx.data;
        return { type: "dashboard",
          kpis: [{ label: "Chats handled", value: 1286, delta: 9, format: "num" }, { label: "Answered by Riya", value: "94%", delta: 2 }, { label: "Avg first reply", value: "6s", delta: -12 }, { label: "Trial show-up", value: "68%", delta: 4 }],
          charts: [
            { type: "line", title: "Trials booked per day", wide: true, labels: d.labels14, series: [{ name: "Trials", points: d.trialsPerDay }] },
            { type: "gauge", title: "Trial to member conversion", value: 41, label: "Converted after trial" },
            { type: "bar", title: "Plan interest", labels: d.plans, values: [38, 26, 21, 15] }
          ] };
      } },
      { id: "exports", label: "Exports", icon: "file", group: "Analytics", view: { type: "custom", render: exportsView } }
    ]
  };
})(window);
