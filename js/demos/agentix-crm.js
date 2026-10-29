(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.demos = AX.demos || {};
  AX.crm = AX.crm || {};
  var SLUG = "agentix-crm";
  var ACCENT = "#0B1F33";

  /* ============ pure helpers (no DOM) ============ */
  function dayNum(iso) { var p = String(iso).split("-"); return Math.round(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000); }
  /** red: overdue or due within `red` days; amber: within `amber` days; else green. Done stories are always green. */
  function deadlineKind(due, today, th, status) {
    if (status === "done") return "green";
    th = th || { red: 2, amber: 7 };
    var d = dayNum(due) - dayNum(today);
    return d <= th.red ? "red" : d <= th.amber ? "amber" : "green";
  }
  function daysLeft(due, today) { return dayNum(due) - dayNum(today); }

  function sentences(t) { return String(t || "").split(/(?<=[.!?])\s+|\n+/).map(function (s) { return s.trim(); }).filter(Boolean); }
  var VERB = /\b(build|design|redesign|develop|integrat|automat|launch|set ?up|deliver|migrat|implement|create|scope)/i;
  function analyseProposal(text, budget) {
    var ss = sentences(text);
    var scope = ss.filter(function (s) { return VERB.test(s); }).slice(0, 5);
    if (!scope.length) scope = ss.slice(0, 3);
    var t = String(text || ""), risks = [];
    if (/unlimited/i.test(t)) risks.push({ title: "Unlimited revisions", detail: "No cap on revision rounds. Agree a limit (for example 2 rounds) and bill extras." });
    if (/asap|urgent|rush|within\s+\d+\s+(day|week)/i.test(t)) risks.push({ title: "Aggressive timeline", detail: "Delivery window looks tight for the scope. Add buffer or phase the work." });
    if (!/payment|milestone|advance|invoice/i.test(t)) risks.push({ title: "No payment milestones", detail: "Proposal does not say when invoices are raised. Add an advance and milestone schedule." });
    if (/integrat|api|third[- ]party|gateway/i.test(t)) risks.push({ title: "Third-party dependency", detail: "Integrations depend on vendor access and sandboxes. Confirm credentials early." });
    if (/migrat|import|legacy/i.test(t)) risks.push({ title: "Data migration", detail: "Existing data quality is unknown. Budget a clean-up pass." });
    if (!risks.length) risks.push({ title: "No major risks found", detail: "Scope, timeline and payment terms look reasonable." });
    var hours = 30 + scope.length * 22 + (risks[0].title.indexOf("No major") === 0 ? 0 : risks.length * 12);
    var rate = 1200, estimate = hours * rate;
    var b = Number(budget) > 0 ? Number(budget) : null;
    var verdict = b == null ? "No budget given - estimate only." : b < estimate * 0.85 ? "Budget is below the estimate. Re-scope or raise the price." : b > estimate * 1.15 ? "Budget is comfortably above the estimate." : "Budget is in line with the estimate.";
    var gap = b == null ? null : Math.round((b - estimate) / estimate * 100);
    return { scope: scope, risks: risks, price: { hours: hours, rate: rate, estimate: estimate, budget: b, gapPct: gap, verdict: verdict } };
  }
  var TONE = {
    "On track": "Good news: the project is progressing as planned and we expect to hit the agreed dates.",
    "At risk": "I want to flag early that a few items could put the agreed dates at risk if we do not resolve them this week.",
    "Delayed": "I am sorry to share that the project is delayed against the agreed schedule. Here is what happened and how we will recover.",
    "Completed": "I am happy to confirm the project has been completed and handed over."
  };
  function draftEmail(o) {
    o = o || {};
    var status = TONE[o.status] ? o.status : "On track";
    var subject = "[" + status + "] " + (o.project || "Project update") + " - " + (o.client || "your team");
    var body = "Hi " + (o.client || "team") + ",\n\n" + TONE[status] + "\n\n" +
      (o.note ? "Update: " + o.note + "\n\n" : "") +
      (status === "Delayed" || status === "At risk" ? "Next step: we will share a revised timeline within 24 hours and agree it on a short call.\n\n" : "Next step: we will keep you posted in the weekly sync.\n\n") +
      "Regards,\n" + (o.sender || "The AGENTiX team");
    return { subject: subject, body: body };
  }
  AX.crm.deadlineKind = deadlineKind;
  AX.crm.daysLeft = daysLeft;
  AX.crm.analyseProposal = analyseProposal;
  AX.crm.draftEmail = draftEmail;

  if (typeof document === "undefined" || !AX.el) return;   /* unit-test context stops here */

  /* ============ scoped styles ============ */
  var RULES = [
    "&{--orange:#EE6A24}",
    ".ac-grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))}",
    ".ac-card{background:#fff;border:1px solid rgba(11,31,51,.12);border-radius:12px;padding:16px;min-width:0}",
    ".ac-card h3{margin:0 0 10px;font:600 .92rem var(--font-display)}",
    ".ac-due{display:inline-block;font:600 .7rem var(--font-mono);padding:2px 8px;border-radius:999px;white-space:nowrap}",
    ".ac-due.red{background:rgba(192,50,43,.14);color:#A32620}.ac-due.amber{background:rgba(224,168,0,.2);color:#7A5B00}.ac-due.green{background:rgba(15,122,61,.12);color:#0F7A3D}",
    ".ac-row{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:8px}",
    ".ac-pill{display:inline-block;font:600 .72rem var(--font-body);padding:2px 9px;border-radius:999px;background:rgba(11,31,51,.08);color:#334}",
    ".ac-pill.hot,.ac-pill.Overdue{background:rgba(192,50,43,.14);color:#A32620}.ac-pill.warm,.ac-pill.Sent{background:rgba(238,106,36,.16);color:#A8430C}.ac-pill.won,.ac-pill.Paid{background:rgba(15,122,61,.12);color:#0F7A3D}.ac-pill.cold,.ac-pill.Draft{background:rgba(11,31,51,.08)}",
    ".ac-bar{height:8px;border-radius:99px;background:rgba(11,31,51,.1);overflow:hidden;min-width:70px}.ac-bar i{display:block;height:100%;background:var(--orange);border-radius:99px}",
    ".ac-tl{list-style:none;margin:0;padding:0 0 0 16px;border-left:2px solid rgba(11,31,51,.2);display:grid;gap:12px}",
    ".ac-tl li{position:relative;font-size:.85rem}.ac-tl li::before{content:'';position:absolute;left:-23px;top:4px;width:12px;height:12px;border-radius:50%;background:var(--orange);border:2px solid #fff}",
    ".ac-tl small{display:block;color:#5a6676;font:500 .72rem var(--font-mono)}",
    ".ac-h{margin:18px 0 8px;font:600 .8rem var(--font-mono);text-transform:uppercase;color:#5a6676}",
    ".ac-story{display:flex;justify-content:space-between;gap:8px;align-items:center;padding:8px 10px;border:1px solid rgba(11,31,51,.1);border-radius:8px;margin-bottom:6px;font-size:.84rem}",
    ".ac-kv{display:grid;grid-template-columns:110px minmax(0,1fr);gap:6px 12px;font-size:.85rem;margin:0}.ac-kv dt{color:#5a6676;font:500 .72rem var(--font-mono);text-transform:uppercase}.ac-kv dd{margin:0;overflow-wrap:anywhere}",
    ".ac-note{font:500 .75rem var(--font-mono);color:#5a6676;background:rgba(238,106,36,.08);border:1px dashed rgba(238,106,36,.45);border-radius:8px;padding:6px 10px;margin-bottom:12px}",
    ".ac-out{margin-top:16px;border:1px solid rgba(11,31,51,.14);border-radius:12px;padding:16px;background:#FBFAF7;display:grid;gap:10px}",
    ".ac-out h4{margin:6px 0 2px;font:600 .85rem var(--font-display)}.ac-out ul{margin:0;padding-left:18px;font-size:.86rem;display:grid;gap:4px}",
    ".ac-tag{display:inline-block;font:700 .68rem var(--font-mono);background:#0B1F33;color:#fff;border-radius:6px;padding:3px 8px;justify-self:start}",
    ".ac-email{margin-top:16px;border:1px solid rgba(11,31,51,.14);border-radius:12px;background:#fff;overflow:hidden}.ac-email header{padding:10px 14px;background:#0B1F33;color:#fff;font:600 .85rem var(--font-body)}.ac-email pre{margin:0;padding:14px;white-space:pre-wrap;font:400 .86rem var(--font-body)}",
    ".ac-btn{appearance:none;font:600 .85rem var(--font-body);padding:9px 16px;border-radius:999px;border:1px solid rgba(11,31,51,.2);background:#fff;color:#0B1F33;cursor:pointer}.ac-btn.primary{background:var(--ax-accent);border-color:var(--ax-accent);color:#fff}.ac-btn.orange{background:#EE6A24;border-color:#EE6A24;color:#fff}",
    ".ac-in,.ac-form select,.ac-form textarea{font:400 .86rem var(--font-body);padding:8px 10px;border:1px solid rgba(11,31,51,.2);border-radius:8px;background:#fff;width:100%;box-sizing:border-box}",
    ".ac-form{display:grid;gap:10px}.ac-form label{display:grid;gap:4px;font:500 .74rem var(--font-mono);color:#5a6676}",
    ".ac-ann{border-left:4px solid rgba(11,31,51,.25);padding:10px 14px;background:#fff;border-radius:0 10px 10px 0;margin-bottom:10px}.ac-ann.pinned{border-left-color:#EE6A24}.ac-ann h4{margin:0 0 4px;font:600 .95rem var(--font-display)}.ac-ann p{margin:0 0 6px;font-size:.86rem}.ac-ann small{color:#5a6676;font:500 .72rem var(--font-mono)}",
    ".ac-lock{max-width:460px;margin:30px auto;text-align:center;background:#fff;border:1px solid rgba(11,31,51,.14);border-radius:16px;padding:32px 24px;display:grid;gap:12px;justify-items:center}.ac-lock .ic{width:56px;height:56px;border-radius:50%;background:#0B1F33;color:#fff;display:grid;place-items:center;font-size:1.5rem}.ac-lock h3{margin:0;font:700 1.2rem var(--font-display)}.ac-lock p{margin:0;color:#5a6676;font-size:.88rem}",
    ".ac-sec{margin-bottom:16px}",
    ".ac-toggle{display:flex;gap:10px;align-items:center;font-size:.88rem;padding:6px 0}"
  ];
  function scopeCss() {
    var pre = ['.ax-app[data-slug="' + SLUG + '"]', '.demo-scope[data-slug="' + SLUG + '"]'];
    function sc(css) {
      return css.replace(/([^{}]+)\{([^{}]*)\}/g, function (m, sels, body) {
        return sels.split(",").map(function (s) {
          s = s.trim();
          return s === "&" ? pre[0] + "," + pre[1] : pre.map(function (p) { return p + " " + s; }).join(",");
        }).join(",") + "{" + body + "}";
      });
    }
    var media = [], base = RULES.join("\n").replace(/(@media[^{]*)\{((?:[^{}]*\{[^{}]*\})*)\}/g, function (m, h, inner) { media.push(h + "{" + sc(inner) + "}"); return ""; });
    return sc(base) + "\n" + media.join("\n") + '\n@media(min-width:768px){.ax-app[data-slug="' + SLUG + '"] .bd-col{flex:1 1 0;min-width:150px}}';
  }
  function ensureCss() {
    if (document.getElementById(SLUG + "-css")) return;
    var s = document.createElement("style");
    s.id = SLUG + "-css"; s.textContent = scopeCss(); document.head.appendChild(s);
  }

  /* ============ shared helpers ============ */
  function E() { return AX.el.apply(null, arguments); }
  function D(ctx) { return ctx.data; }
  function scope(children) { ensureCss(); return E("div", { class: "demo-scope", "data-slug": SLUG, style: { "--ax-accent": ACCENT, "--ax-line": "rgba(11,31,51,.12)" } }, children); }
  function stories(ctx) {
    var s = ctx.state.get();
    if (!s.stories) { ctx.state.set({ stories: D(ctx).stories.map(function (x) { return Object.assign({}, x); }) }); s = ctx.state.get(); }
    return s.stories;
  }
  function setStatus(ctx, id, status) {
    ctx.state.set({ stories: stories(ctx).map(function (x) { return x.id === id ? Object.assign({}, x, { status: status }) : x; }) });
  }
  function thresholds(ctx) { return ctx.state.get().thresholds || { red: 2, amber: 7 }; }
  function clientOf(ctx, id) { return D(ctx).clients.filter(function (c) { return c.id === id; })[0]; }
  function completion(ctx) {
    var s = stories(ctx), d = s.filter(function (x) { return x.status === "done"; }).length;
    return Math.round(d / s.length * 1000) / 10;
  }
  /* Change vs a week ago: stories in the seed data that were done and due before today-7 count as the baseline. */
  function completionDelta(ctx) {
    var d = D(ctx), base = d.stories.filter(function (x) { return x.status === "done" && daysLeft(x.due, d.today) <= -7; }).length;
    return Math.round(completion(ctx) - base / d.stories.length * 100);
  }
  function dueBadge(ctx, st) {
    var kind = deadlineKind(st.due, D(ctx).today, thresholds(ctx), st.status), n = daysLeft(st.due, D(ctx).today);
    var label = st.status === "done" ? "Done" : n < 0 ? "Overdue " + (-n) + "d" : n === 0 ? "Due today" : "Due in " + n + "d";
    return E("span", { class: "ac-due " + kind, "data-kind": kind, title: "Due " + st.due }, label);
  }
  function pill(text, cls) { return E("span", { class: "ac-pill " + (cls || String(text).toLowerCase()) }, text); }
  function bar(pct) { return E("div", { class: "ac-bar", title: pct + "%" }, E("i", { style: { width: pct + "%" } })); }
  function kv(pairs) {
    var dl = E("dl", { class: "ac-kv" });
    pairs.forEach(function (p) { dl.appendChild(E("dt", {}, p[0])); dl.appendChild(E("dd", {}, p[1])); });
    return dl;
  }
  function clientProgress(ctx, c) {
    var mine = stories(ctx).filter(function (s) { return s.clientId === c.id; });
    return mine.length ? Math.round(mine.filter(function (s) { return s.status === "done"; }).length / mine.length * 100) : 0;
  }
  var COLS = [{ id: "todo", label: "To Do" }, { id: "progress", label: "In Progress" }, { id: "review", label: "In Review" }, { id: "done", label: "Done", tone: "good" }];
  var STATUS_LABEL = { todo: "To Do", progress: "In Progress", review: "In Review", done: "Done" };

  /* ============ modules ============ */
  var mods = [];

  mods.push({ id: "dashboard", label: "Dashboard", icon: "dashboard", group: "Overview", view: function (ctx) {
    ensureCss();
    var d = D(ctx), s = stories(ctx), th = thresholds(ctx);
    var open = s.filter(function (x) { return x.status !== "done"; });
    var overdue = open.filter(function (x) { return deadlineKind(x.due, d.today, th) === "red"; }).length;
    var rev = d.revenue, last = rev.actual.length - 1;
    var by = function (k) { return s.filter(function (x) { return x.status === k; }).length; };
    return {
      type: "dashboard",
      kpis: [
        { label: "Active clients", value: d.clients.length },
        { label: "Completion", value: completion(ctx), format: "pct", delta: completionDelta(ctx) },
        { label: "Revenue (Oct)", value: rev.actual[last], format: "inr", delta: Math.round((rev.actual[last] / rev.actual[last - 1] - 1) * 100) },
        { label: "Due soon / overdue", value: overdue }
      ],
      charts: [
        { type: "line", title: "Revenue vs target (₹, last 12 months)", wide: true, labels: rev.labels, series: [{ name: "Actual", points: rev.actual }, { name: "Target", points: rev.target }] },
        { type: "donut", title: "Stories by status", parts: COLS.map(function (c) { return { label: c.label, value: by(c.id) }; }) },
        { type: "gauge", title: "Delivery completion", value: completion(ctx), label: "Stories done" },
        { type: "funnel", title: "Lead pipeline", steps: ["New", "Contacted", "Proposal sent", "Negotiation", "Won"].map(function (st, i) {
          return { label: st, value: d.leads.filter(function (l) { return d.leadStages.indexOf(l.stage) >= i && l.stage !== "Lost"; }).length };
        }) }
      ]
    };
  } });

  mods.push({ id: "kanban", label: "Global Kanban", icon: "board", group: "Delivery", view: function (ctx) {
    ensureCss();
    function openStory(card) {
      var st = stories(ctx).filter(function (x) { return x.id === card.id; })[0], c = clientOf(ctx, st.clientId);
      AX.ui.drawer({ title: st.title, body: scope([
        kv([["Story", st.id], ["Client", c.name], ["Status", STATUS_LABEL[st.status]], ["Due", st.due], ["Priority", st.priority], ["Assignee", st.assignee], ["Estimate", st.hours + " h"]]),
        E("div", { class: "ac-row" }, dueBadge(ctx, st), pill(st.priority, st.priority === "High" ? "hot" : st.priority === "Medium" ? "warm" : "cold"))
      ]) });
    }
    return {
      type: "board", columns: COLS,
      cards: stories(ctx).map(function (st) { return { id: st.id, col: st.status, title: st.title, client: clientOf(ctx, st.clientId).name, st: st }; }),
      renderCard: function (card) {
        var st = stories(ctx).filter(function (x) { return x.id === card.id; })[0] || card.st;
        return [E("div", { class: "bd-title" }, card.title), E("div", { class: "bd-sub" }, card.client),
          E("div", { class: "ac-row" }, dueBadge(ctx, Object.assign({}, st, { status: card.col })), E("span", { class: "bd-tag" }, st.assignee.split(" ")[0]))];
      },
      onMove: function (card, col) { setStatus(ctx, card.id, col); },
      onOpen: openStory
    };
  } });

  mods.push({ id: "clients", label: "Clients", icon: "users", group: "Delivery", view: function (ctx) {
    ensureCss();
    var d = D(ctx);
    return {
      type: "table", pageSize: 10, qKeys: ["name", "industry", "owner"],
      filters: [{ key: "stage", label: "Stage", options: ["Hot", "Warm", "Cold", "Won"] }, { key: "industry", label: "Industry", options: d.industries }],
      columns: [
        { key: "name", label: "Client", sortable: true },
        { key: "industry", label: "Industry", sortable: true },
        { key: "stage", label: "Stage", render: function (r) { return pill(r.stage); } },
        { key: "owner", label: "Owner" },
        { key: "progress", label: "Progress", sortable: true, render: function (r) { return E("div", { class: "ac-row" }, bar(r.progress), E("small", {}, r.progress + "%")); } },
        { key: "revenueTotal", label: "Revenue", sortable: true, render: function (r) { return AX.fmt.inr(r.revenueTotal); } }
      ],
      rows: d.clients.map(function (c) { return Object.assign({}, c, { progress: clientProgress(ctx, c) }); }),
      drawer: function (row) {
        var inv = d.invoices.filter(function (i) { return i.clientId === row.id; });
        var idx = d.clients.indexOf(clientOf(ctx, row.id));
        var cm = [0, 1, 2].map(function (k) { return d.comms[(idx + k) % d.comms.length]; });
        var mine = stories(ctx).filter(function (s) { return s.clientId === row.id; });
        return scope([
          kv([["Contact", row.contact], ["Email", row.email], ["Phone", row.phone], ["City", row.city], ["Owner", row.owner], ["Expected", AX.fmt.inr(row.expectedRevenue)], ["Contract ends", row.contractEnd]]),
          E("div", { class: "ac-h" }, "Invoice timeline"),
          E("ul", { class: "ac-tl" }, inv.map(function (i) {
            return E("li", {}, E("strong", {}, i.id + " · " + AX.fmt.inr(i.amount)), " ", pill(i.status), E("small", {}, i.issued + " · " + i.note));
          })),
          E("div", { class: "ac-h" }, "Communications"),
          E("ul", { class: "ac-tl" }, cm.map(function (c, k) { return E("li", {}, E("strong", {}, c[0]), E("small", {}, (k + 1) * 3 + " days ago"), c[1]); })),
          E("div", { class: "ac-h" }, "Stories"),
          mine.map(function (s) { return E("div", { class: "ac-story" }, E("span", {}, s.title + " · " + STATUS_LABEL[s.status]), dueBadge(ctx, s)); })
        ]);
      }
    };
  } });

  mods.push({ id: "leads", label: "Leads", icon: "star", group: "Sales", view: function (ctx) {
    ensureCss();
    var d = D(ctx);
    return {
      type: "table", pageSize: 10, qKeys: ["company", "contact", "owner"],
      filters: [{ key: "stage", label: "Stage", options: d.leadStages }, { key: "source", label: "Source", options: d.sources }],
      columns: [
        { key: "company", label: "Company", sortable: true }, { key: "contact", label: "Contact" },
        { key: "source", label: "Source" },
        { key: "stage", label: "Stage", render: function (r) { return pill(r.stage, r.stage === "Won" ? "won" : r.stage === "Lost" ? "hot" : "warm"); } },
        { key: "value", label: "Value", sortable: true, render: function (r) { return AX.fmt.inr(r.value); } },
        { key: "owner", label: "Owner" }
      ],
      rows: d.leads,
      drawer: function (row) {
        return scope([
          kv([["Contact", row.contact], ["Email", row.email], ["Phone", row.phone], ["Source", row.source], ["Stage", row.stage], ["Deal value", AX.fmt.inr(row.value)], ["Owner", row.owner], ["Last contact", row.last]]),
          E("div", { class: "ac-row", style: { marginTop: "16px" } },
            E("button", { type: "button", class: "ac-btn primary", on: { click: function () { AX.ui.toast("Simulated — lead " + row.id + " not moved to the next stage.", { kind: "sim" }); } } }, "Advance stage"),
            E("button", { type: "button", class: "ac-btn", on: { click: function () { AX.ui.toast("Simulated — proposal not sent.", { kind: "sim" }); } } }, "Send proposal"))
        ]);
      }
    };
  } });

  mods.push({ id: "insights-revenue", label: "Revenue", icon: "chart", group: "Insights", view: function (ctx) {
    var d = D(ctx), rev = d.revenue, tot = rev.actual.reduce(function (a, b) { return a + b; }, 0), tt = rev.target.reduce(function (a, b) { return a + b; }, 0);
    var top = d.clients.slice().sort(function (a, b) { return b.revenueTotal - a.revenueTotal; }).slice(0, 6);
    return {
      type: "dashboard",
      kpis: [{ label: "Revenue (12 months)", value: tot, format: "inr" }, { label: "Target (12 months)", value: tt, format: "inr" },
        { label: "Attainment", value: tot / tt * 100, format: "pct" }, { label: "Outstanding invoices", value: d.invoices.filter(function (i) { return i.status === "Sent" || i.status === "Overdue"; }).reduce(function (a, i) { return a + i.amount; }, 0), format: "inr" }],
      charts: [
        { type: "line", title: "Revenue vs target (₹)", wide: true, labels: rev.labels, series: [{ name: "Actual", points: rev.actual }, { name: "Target", points: rev.target }] },
        { type: "bar", title: "Top clients by revenue (₹)", horizontal: true, labels: top.map(function (c) { return c.name.split(" ")[0]; }), values: top.map(function (c) { return c.revenueTotal; }) }
      ]
    };
  } });

  mods.push({ id: "insights-clients", label: "Client mix", icon: "users", group: "Insights", view: function (ctx) {
    var d = D(ctx), cnt = function (k, v) { return d.clients.filter(function (c) { return c[k] === v; }).length; };
    var byInd = d.industries.map(function (i) { return { label: i, value: d.clients.filter(function (c) { return c.industry === i; }).reduce(function (a, c) { return a + c.revenueTotal; }, 0) }; });
    return {
      type: "dashboard",
      kpis: [{ label: "Clients", value: d.clients.length }, { label: "Hot", value: cnt("stage", "Hot") }, { label: "Won", value: cnt("stage", "Won") }, { label: "Expected revenue", value: d.clients.reduce(function (a, c) { return a + c.expectedRevenue; }, 0), format: "inr" }],
      charts: [
        { type: "donut", title: "Clients by stage", parts: ["Hot", "Warm", "Cold", "Won"].map(function (s) { return { label: s, value: cnt("stage", s) }; }) },
        { type: "bar", title: "Revenue by industry (₹)", horizontal: true, labels: byInd.map(function (x) { return x.label; }), values: byInd.map(function (x) { return x.value; }) }
      ]
    };
  } });

  mods.push({ id: "insights-stories", label: "Stories", icon: "board", group: "Insights", view: function (ctx) {
    var d = D(ctx), s = stories(ctx), th = thresholds(ctx);
    var people = d.team.slice(3, 6);
    var kinds = ["red", "amber", "green"].map(function (k) { return { label: k === "red" ? "Overdue / critical" : k === "amber" ? "Due this week" : "On schedule", value: s.filter(function (x) { return x.status !== "done" && deadlineKind(x.due, d.today, th) === k; }).length }; });
    return {
      type: "dashboard",
      kpis: [{ label: "Total stories", value: s.length }, { label: "In progress", value: s.filter(function (x) { return x.status === "progress"; }).length }, { label: "In review", value: s.filter(function (x) { return x.status === "review"; }).length }, { label: "Hours estimated", value: s.reduce(function (a, x) { return a + x.hours; }, 0) }],
      charts: [
        { type: "bar", title: "Open stories per person", labels: people.map(function (p) { return p.name.split(" ")[0]; }), values: people.map(function (p) { return s.filter(function (x) { return x.assignee === p.name && x.status !== "done"; }).length; }) },
        { type: "donut", title: "Deadline health", parts: kinds }
      ]
    };
  } });

  mods.push({ id: "insights-completion", label: "Completion", icon: "chart", group: "Insights", view: function (ctx) {
    var d = D(ctx);
    return {
      type: "dashboard",
      kpis: [{ label: "Overall completion", value: completion(ctx), format: "pct" }, { label: "Done", value: stories(ctx).filter(function (x) { return x.status === "done"; }).length }, { label: "Remaining", value: stories(ctx).filter(function (x) { return x.status !== "done"; }).length }],
      charts: [
        { type: "gauge", title: "Overall delivery", value: completion(ctx), label: "Done" },
        { type: "bar", title: "Completion % by client", horizontal: true, wide: true, labels: d.clients.slice(0, 8).map(function (c) { return c.name.split(" ")[0]; }), values: d.clients.slice(0, 8).map(function (c) { return clientProgress(ctx, c); }) }
      ]
    };
  } });

  mods.push({ id: "proposal-ai", label: "Proposal analysis", icon: "file", group: "AI tools", view: function (ctx) {
    ensureCss();
    return {
      type: "form", submit: "Analyse proposal",
      fields: [{ key: "client", label: "Client", type: "text" }, { key: "text", label: "Paste the proposal text", type: "textarea" }, { key: "budget", label: "Client budget (₹)", type: "number" }],
      onSubmit: function (v) {
        var text = v.text && v.text.trim() ? v.text : "Redesign the marketing website and build a lead-capture form. Integrate a payment gateway. Delivery ASAP.";
        var r = analyseProposal(text, v.budget), p = r.price;
        return scope(E("div", { class: "ac-out" },
          E("span", { class: "ac-tag" }, "AI output (simulated)"),
          E("h4", {}, "Scope"), E("ul", {}, r.scope.map(function (s) { return E("li", {}, s); })),
          E("h4", {}, "Risks"), E("ul", {}, r.risks.map(function (k) { return E("li", {}, E("strong", {}, k.title), " - " + k.detail); })),
          E("h4", {}, "Price check"),
          E("p", { style: { margin: 0, fontSize: ".86rem" } }, "Estimated effort " + p.hours + " h at " + AX.fmt.inr(p.rate) + "/h = " + AX.fmt.inr(p.estimate) + ". " +
            (p.budget != null ? "Client budget " + AX.fmt.inr(p.budget) + " (" + (p.gapPct >= 0 ? "+" : "") + p.gapPct + "% vs estimate). " : "") + p.verdict)));
      }
    };
  } });

  mods.push({ id: "status-email", label: "Status email", icon: "mail", group: "AI tools", view: function (ctx) {
    ensureCss();
    return {
      type: "form", submit: "Draft email",
      fields: [{ key: "client", label: "Client", type: "select", options: D(ctx).clients.map(function (c) { return c.name; }) },
        { key: "project", label: "Project", type: "text" },
        { key: "status", label: "Status", type: "select", options: ["On track", "At risk", "Delayed", "Completed"] },
        { key: "note", label: "Note for the client", type: "textarea" }],
      onSubmit: function (v) {
        var m = draftEmail({ client: v.client, project: v.project || "Website build", status: v.status, note: v.note, sender: D(ctx).team[2].name });
        return scope(E("div", { class: "ac-email" }, E("header", {}, "Draft (simulated Gemini) · Subject: " + m.subject), E("pre", {}, m.body)));
      }
    };
  } });

  mods.push({ id: "announcements", label: "Announcements", icon: "bell", group: "Team", view: { type: "custom", render: function (host, ctx) {
    ensureCss();
    var list = E("div", {});
    function items() { return ctx.state.get().announcements || D(ctx).announcements; }
    function draw() {
      list.textContent = "";
      items().forEach(function (a) {
        list.appendChild(E("article", { class: "ac-ann" + (a.pinned ? " pinned" : "") }, E("h4", {}, (a.pinned ? "Pinned · " : "") + a.title), E("p", {}, a.body), E("small", {}, a.by + " · " + a.at)));
      });
    }
    var title = E("input", { class: "ac-in", type: "text", "aria-label": "Title", placeholder: "Announcement title" });
    var body = E("textarea", { rows: "2", "aria-label": "Message", placeholder: "Message to the team" });
    var form = E("form", { class: "ac-form ac-card ac-sec", on: { submit: function (e) {
      e.preventDefault();
      if (!title.value.trim()) return;
      ctx.state.set({ announcements: [{ id: "n" + items().length, pinned: false, title: title.value.trim(), body: body.value.trim() || "(no details)", by: D(ctx).team[0].name, at: D(ctx).today }].concat(items()) });
      title.value = ""; body.value = "";
      draw();
      AX.ui.toast("Simulated — announcement not sent to the team.", { kind: "sim" });
    } } }, E("h3", {}, "New announcement"), title, body, E("button", { type: "submit", class: "ac-btn primary", style: { justifySelf: "start" } }, "Post"));
    host.appendChild(scope([form, list]));
    draw();
  } } });

  mods.push({ id: "salary", label: "Salary & incentives", icon: "wallet", group: "Team", view: { type: "custom", render: function (host, ctx) {
    ensureCss();
    var d = D(ctx), rows = d.salary.map(function (r) { return Object.assign({}, r, { total: r.base + r.incentive }); });
    var kp = E("div", {}), ch = E("div", { class: "ac-card ac-sec" }, E("h3", {}, "Payroll by person (₹)")), chSlot = E("div", {}), tb = E("div", {});
    ch.appendChild(chSlot);
    host.appendChild(scope([
      E("div", { class: "ac-note" }, "Fictional round numbers for demonstration. Incentive = 5% of the revenue a person closed this month."),
      kp, ch, tb]));
    AX.charts.kpis(kp, { items: [
      { label: "Monthly payroll", value: rows.reduce(function (a, r) { return a + r.total; }, 0), format: "inr" },
      { label: "Incentives paid", value: rows.reduce(function (a, r) { return a + r.incentive; }, 0), format: "inr" },
      { label: "Revenue closed", value: rows.reduce(function (a, r) { return a + r.sold; }, 0), format: "inr" }].map(lakhify) });
    AX.charts.bar(chSlot, { labels: rows.map(function (r) { return r.name.split(" ")[0]; }), values: rows.map(function (r) { return r.total; }) });
    AX.table.create(tb, {
      qKeys: ["name", "role"], pageSize: 10,
      columns: [{ key: "name", label: "Person", sortable: true }, { key: "role", label: "Role" },
        { key: "base", label: "Base salary", sortable: true, render: function (r) { return AX.fmt.inr(r.base); } },
        { key: "sold", label: "Revenue closed", render: function (r) { return AX.fmt.inr(r.sold); } },
        { key: "incentive", label: "Incentive", sortable: true, render: function (r) { return AX.fmt.inr(r.incentive); } },
        { key: "total", label: "Total", sortable: true, render: function (r) { return AX.fmt.inr(r.total); } }],
      rows: rows
    });
  } } });

  mods.push({ id: "internal", label: "Internal", icon: "settings", group: "Founders", view: { type: "custom", render: function (host, ctx) {
    ensureCss();
    var wrap = E("div", {});
    function lock() {
      wrap.textContent = "";
      wrap.appendChild(E("div", { class: "ac-lock" }, E("div", { class: "ic", "aria-hidden": "true" }, "🔒"), E("h3", {}, "Co-founders only"),
        E("p", {}, "This area holds company investments and shareholding. In the real product it is restricted to co-founder accounts."),
        E("button", { type: "button", class: "ac-btn orange", on: { click: unlock } }, "Unlock demo")));
    }
    function unlock() {
      wrap.textContent = "";
      var d = D(ctx), total = d.investments.reduce(function (a, i) { return a + i.amount; }, 0);
      var top = E("div", { class: "ac-row ac-sec" }, E("div", {}, E("strong", {}, "Company investments"), E("div", { class: "ac-note", style: { margin: "6px 0 0" } }, "Fictional figures · total " + AX.fmt.inr(total))),
        E("button", { type: "button", class: "ac-btn", on: { click: lock } }, "Lock again"));
      var tb = E("div", {});
      wrap.appendChild(top); wrap.appendChild(tb);
      AX.table.create(tb, { qKeys: ["item"], pageSize: 10, columns: [
        { key: "id", label: "Ref" }, { key: "item", label: "Investment", sortable: true },
        { key: "amount", label: "Amount", sortable: true, render: function (r) { return AX.fmt.inr(r.amount); } },
        { key: "date", label: "Date", sortable: true }, { key: "note", label: "Note" }], rows: d.investments });
    }
    host.appendChild(scope(wrap));
    lock();
  } } });

  mods.push({ id: "settings", label: "Settings", icon: "settings", group: "Founders", view: { type: "custom", render: function (host, ctx) {
    ensureCss();
    var th = thresholds(ctx);
    var red = E("input", { class: "ac-in", type: "number", value: String(th.red), "aria-label": "Red threshold days" });
    var amber = E("input", { class: "ac-in", type: "number", value: String(th.amber), "aria-label": "Amber threshold days" });
    var name = E("input", { class: "ac-in", type: "text", value: "AGENTiX", "aria-label": "Workspace name" });
    function toggle(label, on) { return E("label", { class: "ac-toggle" }, E("input", { type: "checkbox", checked: on ? "" : null }), label); }
    host.appendChild(scope(E("div", { class: "ac-grid" },
      E("form", { class: "ac-card ac-form", on: { submit: function (e) {
        e.preventDefault();
        ctx.state.set({ thresholds: { red: Math.max(0, +red.value || 0), amber: Math.max(+red.value || 0, +amber.value || 0) } });
        AX.ui.toast("Simulated — settings not saved to a server (thresholds applied to this demo session).", { kind: "sim" });
      } } }, E("h3", {}, "Workspace"), E("label", {}, "Workspace name", name),
        E("label", {}, "Red badge when due within (days)", red), E("label", {}, "Amber badge when due within (days)", amber),
        E("button", { type: "submit", class: "ac-btn primary", style: { justifySelf: "start" } }, "Save settings")),
      E("div", { class: "ac-card" }, E("h3", {}, "Notifications"), toggle("Email me when a story becomes overdue", true), toggle("Weekly revenue digest", true), toggle("Slack alerts for new leads", false)),
      E("div", { class: "ac-card" }, E("h3", {}, "Demo data"), E("p", { style: { fontSize: ".86rem" } }, "Move stories on the Kanban and watch completion change. Reset to start over."),
        E("button", { type: "button", class: "ac-btn", on: { click: function () { ctx.state.set({ stories: null, thresholds: null }); AX.ui.toast("Demo data reset.", { kind: "ok" }); } } }, "Reset demo data")))));
  } } });


  /* Compact rupee KPIs ("₹7.9L") so large figures never wrap inside a narrow card. */
  function lakhify(it) {
    if (it.format !== "inr" || typeof it.value !== "number" || it.value < 100000) return it;
    var v = it.value, s = v >= 1e7 ? "₹" + (v / 1e7).toFixed(2) + " Cr" : "₹" + (v / 1e5).toFixed(1) + " L";
    return Object.assign({}, it, { value: s, format: null });
  }
  mods.forEach(function (m) {
    if (typeof m.view !== "function") return;
    var v = m.view;
    m.view = function (ctx) { var r = v(ctx); if (r && r.kpis && r.kpis.map) r.kpis = r.kpis.map(lakhify); return r; };
  });

  AX.demos[SLUG] = {
    brand: { name: "Agentix CRM", accent: "#0B1F33", logoText: "A" },
    start: "dashboard",
    modules: mods
  };
})(window);
