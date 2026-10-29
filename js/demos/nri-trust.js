(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.demos = AX.demos || {};

  /* ---------- pure helpers (unit-tested; no DOM) ---------- */
  var PLAYBOOK = [
    { id: "poa", cat: "Legal", title: "Register a Power of Attorney", why: "Nobody can act for you in India without one.", when: "within 30 days", weight: 3, needs: function (a) { return a.poa === "no"; } },
    { id: "nominee", cat: "Asset", title: "Update nominees on every account", why: "Banks release funds only to nominees without a court order.", when: "within 30 days", weight: 3, needs: function (a) { return a.nominee === "no"; } },
    { id: "will", cat: "Legal", title: "Draft and register a Will", why: "Property succession needs a clear, registered document.", when: "within 60 days", weight: 2, needs: function (a) { return a.will === "no"; } },
    { id: "insurance", cat: "Health", title: "Buy a cashless family floater", why: "Medical shocks drain savings fastest.", when: "within 45 days", weight: 2, needs: function (a) { return a.insurance === "no"; } },
    { id: "liquidity", cat: "Health", title: "Set up an emergency fund account in India", why: "24-hour access to money for hospital deposits.", when: "within 45 days", weight: 1, needs: function (a) { return a.liquidity === "no"; } },
    { id: "property", cat: "Asset", title: "Get a property title and tax check", why: "Unverified titles and unpaid dues surface at the worst time.", when: "within 90 days", weight: 2, needs: function (a) { return a.property === "india"; } },
    { id: "review", cat: "Coordination", title: "Annual family document review", why: "Keeps every instrument aligned as life changes.", when: "every year", weight: 0, needs: function () { return true; } }
  ];

  /** Pure. answers {parentAge, residency, property, poa, nominee, will, insurance, liquidity} -> risk points. */
  function points(a) {
    a = a || {};
    var p = 0;
    if (a.poa === "no") p += 3;
    if (a.nominee === "no") p += 3;
    if (a.will === "no") p += 2;
    if (a.insurance === "no") p += 2;
    if (a.liquidity === "no") p += 1;
    if (a.property === "india" && a.poa === "no") p += 2;
    if (a.parentAge === "55_65") p += 1;
    if (a.parentAge === "65_plus") p += 2;
    return p;
  }
  /** Pure. -> "GREEN" | "ORANGE" | "RED". No POA + no nominee + property in India is always RED. */
  function persona(a) {
    a = a || {};
    if (a.poa === "no" && a.nominee === "no" && a.property === "india") return "RED";
    var p = points(a);
    if (p >= 9) return "RED";
    if (p >= 4) return "ORANGE";
    return "GREEN";
  }
  /** Pure. Failure matrix rows [{cat, check, status: Pass|Watch|Fail, note}]. */
  function matrix(a) {
    a = a || {};
    function row(cat, check, bad, watch, failNote, passNote) {
      var st = bad ? "Fail" : watch ? "Watch" : "Pass";
      return { cat: cat, check: check, status: st, note: st === "Pass" ? passNote : failNote };
    }
    return [
      row("Legal", "Power of Attorney", a.poa === "no", false, "No one can act for you in India.", "A registered POA is in place."),
      row("Legal", "Will", a.will === "no", false, "Succession would go through court.", "A registered Will covers the assets."),
      row("Asset", "Nominees", a.nominee === "no", false, "Funds are locked for months after an emergency.", "All accounts have nominees."),
      row("Asset", "Property exposure", a.property === "india" && a.poa === "no", a.property === "india", "Property in India with nobody authorised to act.", "No exposure, or property is covered."),
      row("Health", "Health cover", a.insurance === "no", false, "No cashless cover for the family.", "Cashless cover exists."),
      row("Health", "Emergency liquidity", a.liquidity === "no", false, "Hospital deposits cannot be paid in time.", "Funds reachable within 24 hours."),
      row("Coordination", "Elder age band", a.parentAge === "65_plus", a.parentAge === "55_65", "Age 65+ makes every gap urgent.", "Younger band gives time to plan.")
    ];
  }
  /** Pure. Prioritised playbook (highest weight first). */
  function playbook(a) {
    return PLAYBOOK.filter(function (x) { return x.needs(a || {}); })
      .sort(function (x, y) { return y.weight - x.weight; })
      .map(function (x, i) { return { n: i + 1, id: x.id, cat: x.cat, title: x.title, why: x.why, when: x.when, priority: x.weight >= 3 ? "P1" : x.weight === 2 ? "P2" : "P3" }; });
  }
  /** Pure. Minimal valid single-page PDF 1.4 (Helvetica, hand-written objects). Returns a string of ASCII only. */
  function pdf(title, lines) {
    function esc(t) { return String(t).replace(/[^\x20-\x7E]/g, "-").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)"); }
    var wrapped = [];
    (lines || []).forEach(function (l) {
      l = String(l);
      while (l.length > 88) { var cut = l.lastIndexOf(" ", 88); if (cut < 40) cut = 88; wrapped.push(l.slice(0, cut)); l = l.slice(cut).replace(/^\s+/, ""); }
      wrapped.push(l);
    });
    var content = "BT /F1 18 Tf 50 790 Td (" + esc(title) + ") Tj ET\n";
    var y = 762;
    wrapped.slice(0, 46).forEach(function (l) { content += "BT /F1 10 Tf 50 " + y + " Td (" + esc(l) + ") Tj ET\n"; y -= 15; });
    var objs = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 5 0 R /Resources << /Font << /F1 4 0 R >> >> >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
      "<< /Length " + content.length + " >>\nstream\n" + content + "endstream"
    ];
    var out = "%PDF-1.4\n", offs = [];
    objs.forEach(function (o, i) { offs.push(out.length); out += (i + 1) + " 0 obj\n" + o + "\nendobj\n"; });
    var xref = out.length;
    out += "xref\n0 " + (objs.length + 1) + "\n0000000000 65535 f \n";
    offs.forEach(function (o) { out += ("0000000000" + o).slice(-10) + " 00000 n \n"; });
    out += "trailer\n<< /Size " + (objs.length + 1) + " /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF\n";
    return out;
  }
  AX.nri = { persona: persona, points: points, matrix: matrix, playbook: playbook, pdf: pdf };

  if (typeof document === "undefined" || !document.getElementById) return;
  var el = AX.el, SLUG = "nri-trust", ACCENT = "#B8860B";
  var COL = { GREEN: "#16A34A", ORANGE: "#EA7A12", RED: "#DC2626" };
  var LABEL = { GREEN: "Plan ahead", ORANGE: "Plan now", RED: "Act immediately" };
  var SUMMARY = {
    GREEN: "Your family's Indian affairs are in good shape. Keep documents current and review once a year.",
    ORANGE: "There are structural gaps that need closing in the next few months before they turn into a crisis.",
    RED: "Critical gaps leave your family and assets exposed. These actions should start this week."
  };

  var CSS = [
    '.nt-card{background:#fff;border:1px solid var(--ax-line);border-radius:14px;padding:20px;max-width:860px}',
    '.nt-card h3{margin:0 0 6px;font:600 17px var(--font-display)}.nt-help{margin:0 0 14px;color:var(--ink-3);font-size:13px}',
    '.nt-prog{height:6px;background:#EEE9DC;border-radius:3px;margin-bottom:16px;overflow:hidden}.nt-prog i{display:block;height:100%;background:var(--ax-accent);transition:width .25s}',
    '.nt-opts{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}',
    '.nt-opt{appearance:none;text-align:left;padding:14px;border:1.5px solid var(--ax-line);border-radius:12px;background:#fff;font:500 14px var(--font-body);color:var(--ink);cursor:pointer}',
    '.nt-opt:hover,.nt-opt:focus-visible{border-color:var(--ax-accent);background:#FFFBEF}',
    '.nt-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:14px}',
    '.nt-btn{appearance:none;font:600 13px var(--font-body);padding:9px 18px;border-radius:999px;border:1px solid var(--ax-accent);background:var(--ax-accent);color:#fff;cursor:pointer}',
    '.nt-btn.ghost{background:#fff;color:#8A6508}',
    '.nt-verdict{display:flex;gap:16px;align-items:center;flex-wrap:wrap;padding:18px;border-radius:14px;color:#fff;margin-bottom:16px}',
    '.nt-verdict b{font:700 34px var(--font-display);letter-spacing:.02em}.nt-verdict span{font-size:14px;max-width:46ch}',
    '.nt-tbl{width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px}.nt-tbl th,.nt-tbl td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--ax-line)}.nt-tbl th{font:600 11px var(--font-mono);text-transform:uppercase;color:var(--ink-3)}',
    '.nt-st{display:inline-block;font:700 11px var(--font-mono);padding:2px 8px;border-radius:6px}.nt-st.Fail{background:#FEE2E2;color:#B91C1C}.nt-st.Watch{background:#FEF3C7;color:#92400E}.nt-st.Pass{background:#DCFCE7;color:#166534}',
    '.nt-play{list-style:none;margin:0 0 16px;padding:0;display:flex;flex-direction:column;gap:8px}.nt-play li{display:flex;gap:12px;align-items:flex-start;padding:10px 12px;border:1px solid var(--ax-line);border-radius:10px;background:#FFFEFA}',
    '.nt-pri{flex:none;font:700 12px var(--font-mono);padding:3px 8px;border-radius:6px;background:#1F2937;color:#fff}.nt-pri.P1{background:#DC2626}.nt-pri.P2{background:#EA7A12}.nt-pri.P3{background:#6B7280}',
    '.nt-play b{display:block;font-size:14px}.nt-play small{color:var(--ink-3);font-size:12px}',
    '.nt-h{margin:0 0 8px;font:600 12px var(--font-mono);text-transform:uppercase;letter-spacing:.06em;color:var(--ink-3)}',
    '.nt-portal{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px}.nt-portal .nt-card{max-width:none}',
    '.nt-doc{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid var(--ax-line);font-size:13px}',
    '.nt-msgs{display:flex;flex-direction:column;gap:8px;max-height:220px;overflow:auto;margin-bottom:10px}.nt-m{padding:8px 12px;border-radius:12px;background:#F6F1E2;font-size:13px;max-width:85%;align-self:flex-start}.nt-m.me{background:#FFF3C4;align-self:flex-end}',
    '.nt-task{display:flex;gap:8px;align-items:center;padding:6px 0;font-size:13px}'
  ].join("\n");
  function injectCss() {
    if (document.getElementById("nt-css")) return;
    var s = document.createElement("style"); s.id = "nt-css";
    s.textContent = CSS + '\n.ax-app[data-slug="' + SLUG + '"],.demo-scope[data-slug="' + SLUG + '"]{--orange:' + ACCENT + '}';
    document.head.appendChild(s);
  }
  injectCss();

  function site(host, ctx) {
    injectCss();
    AX.embed.create(host, AX.embed.optsForSlug(SLUG));
  }

  function report(answers, per) {
    var m = matrix(answers), pb = playbook(answers);
    var lines = ["SAMPLE REPORT - generated from demo answers, not legal or financial advice", "", "Verdict: " + per + " (" + LABEL[per] + ")", SUMMARY[per], "", "FAILURE MATRIX"];
    m.forEach(function (r) { lines.push(r.cat + " / " + r.check + ": " + r.status + " - " + r.note); });
    lines.push("", "PRIORITISED PLAYBOOK");
    pb.forEach(function (x) { lines.push(x.n + ". [" + x.priority + "] " + x.title + " (" + x.when + ") - " + x.why); });
    lines.push("", "Prepared by NRI Trust (demo). Nothing was sent or saved.");
    return pdf("NRI Trust - Family Risk Report (SAMPLE)", lines);
  }

  function assessment(host, ctx) {
    injectCss();
    var qs = ctx.data.questions, answers = {}, step = 0;
    var root = el("div", { class: "nt-card", "data-step": "0" });
    host.appendChild(root);

    function drawQ() {
      var q = qs[step];
      root.textContent = "";
      root.setAttribute("data-step", String(step));
      root.appendChild(el("div", { class: "nt-prog", "aria-hidden": "true" }, el("i", { style: { width: Math.round(step / qs.length * 100) + "%" } })));
      root.appendChild(el("p", { class: "nt-h" }, "Question " + (step + 1) + " of " + qs.length + " · " + q.cat));
      root.appendChild(el("h3", {}, q.q));
      root.appendChild(el("p", { class: "nt-help" }, q.help));
      root.appendChild(el("div", { class: "nt-opts" }, q.options.map(function (o) {
        return el("button", { type: "button", class: "nt-opt", "data-q": q.id, "data-v": o.v, on: { click: function () {
          answers[q.id] = o.v;
          if (step < qs.length - 1) { step++; drawQ(); } else drawResult();
        } } }, o.l);
      })));
      if (step > 0) root.appendChild(el("div", { class: "nt-row" }, el("button", { type: "button", class: "nt-btn ghost", on: { click: function () { step--; drawQ(); } } }, "Back")));
    }

    function drawResult() {
      var per = persona(answers), m = matrix(answers), pb = playbook(answers);
      ctx.state.set({ answers: answers, persona: per });
      root.textContent = "";
      root.setAttribute("data-step", "done");
      root.setAttribute("data-verdict", per);
      root.appendChild(el("div", { class: "nt-verdict", style: { background: COL[per] }, "data-verdict-badge": per },
        el("b", {}, per), el("span", {}, LABEL[per] + ". " + SUMMARY[per])));
      root.appendChild(el("p", { class: "nt-h" }, "Failure matrix"));
      root.appendChild(el("div", { style: { overflowX: "auto" } }, el("table", { class: "nt-tbl" },
        el("thead", {}, el("tr", {}, ["Area", "Check", "Status", "What it means"].map(function (h) { return el("th", { scope: "col" }, h); }))),
        el("tbody", {}, m.map(function (r) {
          return el("tr", {}, el("td", {}, r.cat), el("td", {}, r.check), el("td", {}, el("span", { class: "nt-st " + r.status }, r.status)), el("td", {}, r.note));
        })))));
      root.appendChild(el("p", { class: "nt-h" }, "Prioritised playbook"));
      root.appendChild(el("ol", { class: "nt-play", "data-playbook": String(pb.length) }, pb.map(function (x) {
        return el("li", {}, el("span", { class: "nt-pri " + x.priority }, x.priority), el("div", {}, el("b", {}, x.n + ". " + x.title), el("small", {}, x.why + " Target: " + x.when + ".")));
      })));
      root.appendChild(el("div", { class: "nt-row" },
        el("button", { type: "button", class: "nt-btn", "data-act": "pdf", on: { click: function () {
          var text = report(answers, per);
          var blob = new Blob([text], { type: "application/pdf" });
          var url = URL.createObjectURL(blob);
          var a = el("a", { href: url, download: "nri-trust-sample-report-" + per.toLowerCase() + ".pdf" });
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
          document.dispatchEvent(new CustomEvent("ax:nri-pdf", { detail: { size: blob.size, header: text.slice(0, 8), persona: per } }));
          AX.ui.toast("Simulated — sample PDF generated locally from demo answers", { kind: "sim" });
        } } }, "Download PDF (sample)"),
        el("button", { type: "button", class: "nt-btn ghost", on: { click: function () { ctx.open("portal"); } } }, "Open client portal"),
        el("button", { type: "button", class: "nt-btn ghost", "data-act": "retake", on: { click: function () { answers = {}; step = 0; drawQ(); } } }, "Retake")));
    }
    drawQ();
  }

  function portal(host, ctx) {
    injectCss();
    var d = ctx.data, st = ctx.state.get(), per = st.persona, pb = st.answers ? playbook(st.answers) : playbook({ poa: "no", will: "no", insurance: "no" });
    var done = {};
    var prog = el("p", { class: "nt-help" });
    var tasks = el("div");
    function drawTasks() {
      tasks.textContent = "";
      var n = 0;
      pb.forEach(function (x) {
        var cb = el("input", { type: "checkbox", id: "nt-t-" + x.id, on: { change: function () { done[x.id] = cb.checked; drawProg(); } } });
        if (done[x.id]) cb.checked = true;
        tasks.appendChild(el("label", { class: "nt-task", for: "nt-t-" + x.id }, cb, el("span", {}, x.title + " (" + x.when + ")")));
      });
      drawProg();
    }
    function drawProg() { var n = Object.keys(done).filter(function (k) { return done[k]; }).length; prog.textContent = n + " of " + pb.length + " actions complete"; }
    var msgs = el("div", { class: "nt-msgs", role: "log" }, d.messages.map(function (m) { return el("div", { class: "nt-m" + (m.from === "You" ? " me" : "") }, el("small", {}, m.from + " · " + m.at), el("div", {}, m.text)); }));
    var inp = el("input", { type: "text", "aria-label": "Message your advisor", placeholder: "Message your advisor", style: { flex: "1", padding: "8px 10px", border: "1px solid var(--ax-line)", borderRadius: "8px" } });
    function send() {
      var v = inp.value.trim(); if (!v) return;
      msgs.appendChild(el("div", { class: "nt-m me" }, el("small", {}, "You · now"), el("div", {}, v)));
      inp.value = ""; msgs.scrollTop = msgs.scrollHeight;
      AX.ui.toast("Simulated — message not sent to an advisor", { kind: "sim" });
    }
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter") send(); });
    var docs = el("div", {}, d.docs.map(function (x) { return el("div", { class: "nt-doc" }, el("span", {}, x.name), el("span", { style: { color: "var(--ink-3)" } }, x.status + (x.date !== "-" ? " · " + x.date : ""))); }));
    host.appendChild(el("div", {},
      el("p", { style: { margin: "0 0 12px", fontSize: "14px" } }, "Signed in as ", el("b", {}, d.client.name), " · " + d.client.city + " · member since " + d.client.since),
      el("div", { class: "nt-portal" },
        el("div", { class: "nt-card" }, el("p", { class: "nt-h" }, "Risk profile"),
          per ? el("div", { class: "nt-verdict", style: { background: COL[per], marginBottom: "0" } }, el("b", {}, per), el("span", {}, LABEL[per])) : el("p", { class: "nt-help" }, "No assessment yet."),
          per ? null : el("div", { class: "nt-row" }, el("button", { type: "button", class: "nt-btn", on: { click: function () { ctx.open("assessment"); } } }, "Take the assessment"))),
        el("div", { class: "nt-card" }, el("p", { class: "nt-h" }, "Action plan"), prog, tasks),
        el("div", { class: "nt-card" }, el("p", { class: "nt-h" }, "Document vault"), docs,
          el("div", { class: "nt-row" }, el("button", { type: "button", class: "nt-btn ghost", on: { click: function () { AX.ui.toast("Simulated — upload not stored", { kind: "sim" }); } } }, "Upload a document"))),
        el("div", { class: "nt-card" }, el("p", { class: "nt-h" }, "Advisor messages"), msgs,
          el("div", { style: { display: "flex", gap: "6px" } }, inp, el("button", { type: "button", class: "nt-btn", on: { click: send } }, "Send"))))));
    drawTasks();
  }

  AX.demos[SLUG] = {
    brand: { name: "NRI Trust", accent: ACCENT, logoText: "N" },
    start: "assessment",
    modules: [
      { id: "site", label: "Live site", icon: "home", group: "Experience", view: { type: "custom", render: site } },
      { id: "assessment", label: "Risk assessment", icon: "form", group: "Experience", view: { type: "custom", render: assessment } },
      { id: "portal", label: "Client portal", icon: "users", group: "Clients", view: { type: "custom", render: portal } }
    ]
  };
})(window);
