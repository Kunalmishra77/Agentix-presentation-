(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.demos = AX.demos || {};
  AX.hims = AX.hims || {};

  /* ============ NEWS2 (Royal College of Physicians, NEWS2 chart, SpO2 scale 1) — pure, no DOM ============ */
  function num(v) { v = Number(v); return isFinite(v) ? v : NaN; }
  function band(v, table) {            /* table: [[maxInclusive, score], ...] ascending, last = Infinity */
    for (var i = 0; i < table.length; i++) if (v <= table[i][0]) return table[i][1];
    return 0;
  }
  function news2Detail(v) {
    v = v || {};
    var rr = num(v.rr), sp = num(v.spo2), t = num(v.temp), sb = num(v.sbp), hr = num(v.hr);
    var av = String(v.avpu != null ? v.avpu : (v.consciousness != null ? v.consciousness : "A")).trim().toLowerCase();
    var alert = av === "a" || av === "alert";
    var parts = {
      rr: isNaN(rr) ? 0 : band(rr, [[8, 3], [11, 1], [20, 0], [24, 2], [Infinity, 3]]),
      spo2: isNaN(sp) ? 0 : band(sp, [[91, 3], [93, 2], [95, 1], [Infinity, 0]]),
      o2: (v.o2 === true || String(v.o2).toLowerCase() === "oxygen") ? 2 : 0,
      sbp: isNaN(sb) ? 0 : band(sb, [[90, 3], [100, 2], [110, 1], [219, 0], [Infinity, 3]]),
      hr: isNaN(hr) ? 0 : band(hr, [[40, 3], [50, 1], [90, 0], [110, 1], [130, 2], [Infinity, 3]]),
      avpu: alert ? 0 : 3,
      temp: isNaN(t) ? 0 : (t <= 35.0 ? 3 : t <= 36.0 ? 1 : t <= 38.0 ? 0 : t <= 39.0 ? 1 : 2)
    };
    var total = 0, single3 = false;
    Object.keys(parts).forEach(function (k) { total += parts[k]; if (parts[k] === 3) single3 = true; });
    var level = total >= 7 ? "high" : total >= 5 ? "medium" : single3 ? "low-medium" : "low";
    var response = {
      "high": "Emergency response: continuous monitoring, immediate review by critical-care team.",
      "medium": "Urgent response: urgent review by a clinician, consider critical-care outreach.",
      "low-medium": "Urgent ward-based response: single red score, nurse to inform the doctor now.",
      "low": total === 0 ? "Routine monitoring: minimum 12-hourly." : "Ward-based monitoring: minimum 4-6 hourly."
    }[level];
    return { total: total, parts: parts, level: level, response: response };
  }
  AX.hims.news2Detail = news2Detail;
  AX.hims.news2 = function (vitals) { return news2Detail(vitals).total; };

  /* ============ styles (scoped hx-) ============ */
  var CSS = [
    ".hx-note{font:500 .75rem var(--font-mono);color:var(--ink-3);background:rgba(14,124,134,.08);border:1px dashed rgba(14,124,134,.35);border-radius:8px;padding:6px 10px}",
    ".hx-badge{display:inline-block;font:600 .75rem var(--font-body);padding:2px 9px;border-radius:999px;background:rgba(11,31,51,.08);color:var(--ink-2);white-space:nowrap}",
    ".hx-badge.good{background:rgba(15,122,61,.12);color:#0F7A3D}.hx-badge.warn{background:rgba(224,168,0,.18);color:#7A5B00}.hx-badge.orange{background:rgba(238,106,36,.16);color:#A8430C}.hx-badge.bad{background:rgba(192,50,43,.14);color:#A32620}.hx-badge.info{background:rgba(14,124,134,.14);color:#0A5A62}",
    ".news2-badge{display:inline-grid;place-items:center;min-width:34px;height:26px;padding:0 8px;border-radius:8px;font:700 .85rem var(--font-display);color:#fff;background:#0F7A3D}",
    ".news2-badge.lm{background:#E0A800;color:#3b2c00}.news2-badge.med{background:#EE6A24}.news2-badge.high{background:#C0322B}",
    ".hx-grid{display:grid;gap:16px;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr)}",
    "@media(max-width:900px){.hx-grid{grid-template-columns:minmax(0,1fr)}}",
    ".hx-card{background:#fff;border:1px solid var(--ax-line,rgba(11,31,51,.12));border-radius:12px;padding:16px;min-width:0}",
    ".hx-card h3{margin:0 0 10px;font:600 .9rem var(--font-display);color:var(--ink-2)}",
    ".hx-pt{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}",
    ".hx-pt button,.hx-chip{appearance:none;font:600 .8rem var(--font-body);padding:7px 12px;border-radius:999px;border:1px solid var(--ax-line,rgba(11,31,51,.14));background:#fff;color:var(--ink);cursor:pointer}",
    ".hx-pt button[aria-pressed=true]{background:var(--ax-accent);border-color:var(--ax-accent);color:#fff}",
    ".hx-kv{display:grid;grid-template-columns:110px minmax(0,1fr);gap:6px 12px;font-size:.85rem;margin:0}.hx-kv dt{color:var(--ink-3);font:500 .72rem var(--font-mono);text-transform:uppercase;padding-top:2px}.hx-kv dd{margin:0;overflow-wrap:anywhere}",
    ".hx-alert{border:1px solid #C0322B;background:rgba(192,50,43,.08);border-radius:10px;padding:10px 12px;font-size:.85rem;display:flex;gap:10px;align-items:flex-start;margin-bottom:12px}.hx-alert strong{color:#A32620}.hx-alert.ok{border-color:#0F7A3D;background:rgba(15,122,61,.08)}.hx-alert.ok strong{color:#0F7A3D}",
    ".hx-bar{height:8px;border-radius:99px;background:rgba(11,31,51,.08);overflow:hidden;margin-top:4px}.hx-bar i{display:block;height:100%;background:var(--ax-accent);border-radius:99px}",
    ".hx-ddx{display:grid;gap:10px;margin:0;padding:0;list-style:none;font-size:.85rem}.hx-ddx span{display:flex;justify-content:space-between;gap:8px}",
    ".hx-row{display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end}.hx-row label{display:flex;flex-direction:column;gap:3px;font:500 .72rem var(--font-mono);color:var(--ink-3)}.hx-row select,.hx-row input,.hx-card textarea,.hx-in{font:400 .85rem var(--font-body);padding:8px 10px;border:1px solid var(--ax-line,rgba(11,31,51,.14));border-radius:8px;background:#FBFAF7;color:var(--ink);min-width:0}",
    ".hx-btn{appearance:none;font:600 .85rem var(--font-body);padding:9px 16px;border-radius:999px;border:1px solid var(--ax-line,rgba(11,31,51,.14));background:#fff;color:var(--ink);cursor:pointer}.hx-btn.primary{background:var(--ax-accent);border-color:var(--ax-accent);color:#fff}.hx-btn[disabled]{opacity:.55;cursor:default}",
    ".hx-rx{list-style:none;margin:12px 0;padding:0;display:grid;gap:6px}.hx-rx li{display:flex;justify-content:space-between;gap:8px;align-items:center;font-size:.85rem;padding:8px 10px;background:#FBFAF7;border:1px solid var(--ax-line,rgba(11,31,51,.1));border-radius:8px}",
    ".hx-rx li button{appearance:none;border:0;background:none;color:var(--ink-3);cursor:pointer;font-size:1.1rem}",
    ".hx-esi{border-left:5px solid var(--c);padding-left:8px;display:grid;gap:4px}.hx-esi .bd-title{font-size:.85rem}",
    ".hx-beds{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(86px,1fr))}",
    ".hx-bed{appearance:none;text-align:left;border-radius:10px;padding:8px;border:1.5px solid var(--bc);background:var(--bg);color:var(--ink);cursor:pointer;display:grid;gap:2px;min-height:62px;font:inherit}.hx-bed b{font:700 .78rem var(--font-mono)}.hx-bed span{font-size:.7rem;color:var(--ink-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".hx-bed.occupied{--bc:#C0322B;--bg:rgba(192,50,43,.1)}.hx-bed.vacant{--bc:#0F7A3D;--bg:rgba(15,122,61,.1)}.hx-bed.cleaning{--bc:#E0A800;--bg:rgba(224,168,0,.16)}.hx-bed.reserved{--bc:#2D6CDF;--bg:rgba(45,108,223,.1)}.hx-bed.maintenance{--bc:#6B7888;--bg:rgba(107,120,136,.14)}",
    ".hx-legend{display:flex;gap:14px;flex-wrap:wrap;font-size:.78rem;color:var(--ink-2)}.hx-legend i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:5px;vertical-align:-1px;border:1.5px solid}",
    ".hx-tl{list-style:none;margin:0;padding:0 0 0 16px;border-left:2px solid rgba(14,124,134,.35);display:grid;gap:14px}.hx-tl li{position:relative;font-size:.86rem}.hx-tl li::before{content:'';position:absolute;left:-23px;top:4px;width:12px;height:12px;border-radius:50%;background:var(--ax-accent);border:2px solid #fff}.hx-tl small{display:block;color:var(--ink-3);font:500 .72rem var(--font-mono)}",
    ".hx-abha{border-radius:16px;padding:18px;color:#fff;background:linear-gradient(135deg,#0E7C86,#0B4A66);display:grid;gap:10px;max-width:420px;box-shadow:var(--shadow-2)}.hx-abha h4{margin:0;font:700 1.05rem var(--font-display)}.hx-abha small{opacity:.8;font:500 .7rem var(--font-mono);text-transform:uppercase}.hx-abha .no{font:700 1.15rem var(--font-mono);letter-spacing:.06em}",
    ".hx-fraud{list-style:none;margin:0;padding:0;display:grid;gap:10px}.hx-fraud li{display:grid;gap:4px;padding:10px 12px;border:1px solid var(--ax-line,rgba(11,31,51,.12));border-radius:10px;background:#fff;font-size:.84rem}.hx-fraud .top{display:flex;gap:8px;align-items:center;justify-content:space-between}",
    ".hx-pt-head{display:flex;gap:16px;flex-wrap:wrap;align-items:center;background:#fff;border:1px solid var(--ax-line,rgba(11,31,51,.12));border-radius:12px;padding:14px 16px}.hx-pt-head h3{margin:0;font:700 1.1rem var(--font-display)}",
    ".hx-risk{display:flex;align-items:center;gap:8px;min-width:120px}.hx-risk .hx-bar{flex:1;margin:0}.hx-risk b{font:600 .8rem var(--font-mono);min-width:34px}",
    ".hx-reply{font-size:.84rem;background:#FBFAF7;border:1px solid var(--ax-line,rgba(11,31,51,.1));border-radius:10px;padding:10px 12px;margin-top:10px;min-height:44px}",
    ".hx-fields{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(100px,1fr))}"
  ].join("\n");
  function ensureCss() {
    if (typeof document === "undefined" || document.getElementById("hx-css")) return;
    var s = document.createElement("style");
    s.id = "hx-css"; s.textContent = CSS; document.head.appendChild(s);
  }

  /* ============ helpers ============ */
  function E() { return AX.el.apply(null, arguments); }
  function mkNote() { return E("div", { class: "hx-note" }, "Fictional demo data — not medical advice"); }
  /* Table/board/dashboard views cannot carry a header node, so prepend the note right after the view renders. */
  function noteSoon() {
    ensureCss();
    setTimeout(function () {
      var m = document.querySelector(".ax-module");
      if (m && !m.querySelector(":scope > .hx-note")) m.insertBefore(mkNote(), m.firstChild);
    }, 0);
  }
  /* AX.table handle is not exposed by the AppShell: re-run the table's own draw() through its search box. */
  function refreshTable() {
    var s = document.querySelector(".ax-module .tbl-search");
    if (s) s.dispatchEvent(new Event("input", { bubbles: true }));
  }
  function badge(text, kind) { return E("span", { class: "hx-badge " + (kind || "") }, text); }
  function news2Node(v) {
    var d = news2Detail(v);
    var cls = d.total >= 7 ? "high" : d.total >= 5 ? "med" : d.level === "low-medium" ? "lm" : "";
    return E("span", { class: "news2-badge " + cls, "data-news2": String(d.total), title: d.response }, String(d.total));
  }
  function kv(pairs) {
    var dl = E("dl", { class: "hx-kv" });
    pairs.forEach(function (p) { dl.appendChild(E("dt", {}, p[0])); dl.appendChild(E("dd", {}, p[1])); });
    return dl;
  }
  function D(ctx) { return ctx.data; }
  function simToast(text) { AX.ui.toast(text, { kind: "sim" }); }
  function statusKind(s) {
    return /Reported|Dispensed|Approved|Paid|Verified|Cross-matched|Issued/.test(s) ? "good" : /hold|Denied|Critical/i.test(s) ? "bad" : /Ready|analysis|Preparing|Submitted|collected/i.test(s) ? "info" : /pending|Awaiting|Queued|Requested|Draft/i.test(s) ? "warn" : "";
  }
  function riskCell(r) {
    var color = r.risk >= 55 ? "#C0322B" : r.risk >= 25 ? "#E0A800" : "#0F7A3D";
    return E("div", { class: "hx-risk" }, E("b", {}, r.risk + "%"), E("div", { class: "hx-bar" }, E("i", { style: { width: r.risk + "%", background: color } })));
  }

  /* ============ modules ============ */
  var mods = [];

  /* ---- Journey: pipeline for Ramesh K. ---- */
  mods.push({ id: "journey", label: "Patient journey", icon: "pipeline", group: "Overview", view: {
    type: "custom", render: function (el, ctx) {
      ensureCss();
      var p = D(ctx).vitals[0], d = news2Detail(p);
      el.appendChild(mkNote());
      el.appendChild(E("div", { class: "hx-pt-head" },
        E("div", {}, E("h3", {}, "Ramesh K., 58 M"), E("small", { style: { color: "var(--ink-3)" } }, "UHID " + p.uhid + " · ABHA 91-2204-8837-5516")),
        badge("NSTEMI", "bad"), badge("AB-PMJAY", "info"), badge("CCU-04", ""),
        E("span", {}, "NEWS2 ", news2Node(p)),
        E("small", { style: { color: "var(--ink-2)", flex: "1 1 220px" } }, d.response)));
      var host = E("div", { "data-journey": "" });
      el.appendChild(host);
      AX.pipeline.create(host, {
        currency: "₹", gate: "billing",
        stages: [
          { id: "triage", label: "Triage (AI ESI 2)", ms: 700, cost: 0, log: ["ECG in 6 min: ST depression V4-V6", "hs-Troponin I 2.84 ng/mL"] },
          { id: "opd", label: "OPD consult (Cardiology)", ms: 700, cost: 600, log: ["Dr. Mathur reviews AI copilot summary", "Plan: dual antiplatelet + angiography"] },
          { id: "lab", label: "Lab (Immuno, Biochem)", ms: 700, cost: 4200, log: ["Troponin verified by Tech. Alok"] },
          { id: "pharmacy", label: "Pharmacy", ms: 700, cost: 2840, log: ["Interaction caught: omeprazole swapped to pantoprazole"] },
          { id: "billing", label: "Billing (AB-PMJAY pre-auth)", ms: 700, cost: 0, log: ["Package: Coronary angioplasty (PCI) - 1 stent", "Denial risk 34% - documents attached"] },
          { id: "discharge", label: "Discharge", ms: 700, cost: 0, log: ["Discharge summary signed", "Follow-up booked in 7 days (e-Sanjeevani)"] }
        ]
      });
    } } });

  /* ---- Doctor: summary + AI copilot + Rx ---- */
  var KNOWN_PAIRS = [["Clopidogrel", "Omeprazole", "Clopidogrel + Omeprazole: omeprazole inhibits CYP2C19 and can reduce clopidogrel activation. Consider pantoprazole 40 mg."],
    ["Glimepiride", "Aspirin", "Glimepiride + Aspirin: possible additive hypoglycaemia. Monitor glucose."]];
  mods.push({ id: "doctor", label: "Doctor workspace", icon: "heart", group: "Clinical", role: "Doctor", view: {
    type: "custom", render: function (el, ctx) {
      ensureCss();
      var pts = D(ctx).doctorPatients, sel = 0, rx = {}, signed = {}, reply = "";
      pts.forEach(function (p) { rx[p.id] = p.meds.map(function (m) { return m; }); });
      var root = E("div", { class: "hx-doc" });
      el.appendChild(root);
      function interactions(p) {
        var names = rx[p.id].join(" | ").toLowerCase(), out = [];
        KNOWN_PAIRS.forEach(function (k) { if (names.indexOf(k[0].toLowerCase()) >= 0 && names.indexOf(k[1].toLowerCase()) >= 0) out.push(k); });
        return out;
      }
      var ANSWERS = {
        "Summarise history": function (p) { return p.name + ", " + p.age + p.sex + ": " + p.cc + ". Background: " + p.hx.join(", ") + ". Allergy: " + p.allergy + "."; },
        "Suggest orders": function (p) { return p.id === "D0" ? "Serial hs-troponin at 3 h, repeat ECG, echocardiogram, lipid profile, renal function before contrast. Cardiology review for early invasive strategy." : "CBC, CRP, chest X-ray if not done, review hydration and oxygen need."; },
        "Discharge checklist": function (p) { return "Discharge summary with ICD-10, medication reconciliation, follow-up in 7 days, diet and activity advice, ABHA record sync for " + p.name + "."; }
      };
      function draw() {
        var p = pts[sel], ints = interactions(p);
        root.textContent = "";
        root.appendChild(mkNote());
        root.appendChild(E("div", { class: "hx-pt", style: { marginTop: "12px" } }, pts.map(function (q, i) {
          return E("button", { type: "button", "data-patient": q.id, "aria-pressed": String(i === sel), on: { click: function () { sel = i; reply = ""; draw(); } } }, q.name + " · " + q.dx);
        })));
        var left = E("div", { class: "hx-card" }, E("h3", {}, "Patient summary"),
          kv([["Patient", p.name + ", " + p.age + " " + p.sex + " · " + p.uhid], ["Diagnosis", p.dx], ["Complaint", p.cc], ["History", p.hx.join("; ")], ["Allergy", p.allergy], ["Vitals", p.vit], ["Results", p.labs.join("; ")]]));
        var right = E("div", { class: "hx-card" }, E("h3", {}, "AI copilot"));
        if (ints.length) ints.forEach(function (k) {
          right.appendChild(E("div", { class: "hx-alert", role: "alert", "data-interaction": "" }, E("span", {}, "⚠"), E("div", {}, E("strong", {}, "Drug interaction — " + k[0] + " + " + k[1]), E("div", {}, k[2]))));
        }); else right.appendChild(E("div", { class: "hx-alert ok" }, E("span", {}, "✓"), E("div", {}, E("strong", {}, "No interactions in current prescription"))));
        right.appendChild(E("strong", { style: { fontSize: ".8rem" } }, "Suggested differentials"));
        right.appendChild(E("ul", { class: "hx-ddx" }, p.ddx.map(function (d) {
          return E("li", {}, E("span", {}, E("span", {}, d[0]), E("b", {}, d[1] + "%")), E("div", { class: "hx-bar" }, E("i", { style: { width: d[1] + "%" } })));
        })));
        right.appendChild(E("div", { class: "hx-row", style: { marginTop: "12px" } }, Object.keys(ANSWERS).map(function (k) {
          return E("button", { type: "button", class: "hx-chip", on: { click: function () { reply = ANSWERS[k](p); draw(); } } }, k);
        })));
        right.appendChild(E("div", { class: "hx-reply", "aria-live": "polite" }, reply || "Ask the copilot for a summary, suggested orders or a discharge checklist."));

        var drugSel = E("select", { "aria-label": "Drug" }, D(ctx).drugList.map(function (d) { return E("option", { value: d }, d); }));
        var freq = E("select", { "aria-label": "Frequency" }, ["OD", "BD", "TDS", "QID", "SOS"].map(function (f) { return E("option", { value: f }, f); }));
        var days = E("input", { type: "number", value: "7", min: "1", max: "90", "aria-label": "Days", style: { width: "70px" } });
        var rxCard = E("div", { class: "hx-card", style: { gridColumn: "1 / -1" } }, E("h3", {}, "Prescription"),
          E("div", { class: "hx-row" },
            E("label", {}, "Drug", drugSel), E("label", {}, "Frequency", freq), E("label", {}, "Days", days),
            E("button", { type: "button", class: "hx-btn", "data-add": "", on: { click: function () {
              rx[p.id].push(drugSel.value + " " + freq.value + " x " + days.value + "d"); signed[p.id] = false; draw();
            } } }, "Add to Rx")),
          E("ul", { class: "hx-rx" }, rx[p.id].map(function (m, i) {
            return E("li", {}, E("span", {}, m), E("button", { type: "button", "aria-label": "Remove " + m, on: { click: function () { rx[p.id].splice(i, 1); signed[p.id] = false; draw(); } } }, "×"));
          })),
          E("div", { class: "hx-row" },
            ints.length && /Omeprazole/i.test(rx[p.id].join()) ? E("button", { type: "button", class: "hx-btn", "data-swap": "", on: { click: function () {
              rx[p.id] = rx[p.id].map(function (m) { return /Omeprazole/i.test(m) ? "Pantoprazole 40 mg" : m; }); draw();
            } } }, "Swap Omeprazole → Pantoprazole") : null,
            E("button", { type: "button", class: "hx-btn primary", "data-sign": "", disabled: signed[p.id] || !rx[p.id].length ? "" : null, on: { click: function () {
              signed[p.id] = true; ctx.state.set({ rxSigned: p.name }); draw();
              simToast("Simulated — prescription signed for " + p.name + "; nothing was sent or saved.");
            } } }, signed[p.id] ? "Signed ✓" : "Sign prescription")));
        root.appendChild(E("div", { class: "hx-grid" }, left, right, rxCard));
      }
      draw();
    } } });

  /* ---- Nurse: vitals + NEWS2 ---- */
  mods.push({ id: "nurse", label: "Nurse vitals", icon: "table", group: "Clinical", role: "Nurse", view: {
    type: "table", pageSize: 12, qKeys: ["name", "uhid", "ward", "dx"],
    filters: [{ key: "ward", label: "Wards", options: ["CCU", "Medicine A", "Medicine B", "Surgery", "ICU", "Paeds", "Maternity"] }],
    columns: [
      { key: "name", label: "Patient", sortable: true, render: function (r) { return E("span", {}, E("strong", {}, r.name), E("small", { style: { display: "block", color: "var(--ink-3)" } }, r.age + r.sex + " · " + r.dx)); } },
      { key: "bed", label: "Bed", sortable: true, render: function (r) { return E("span", { style: { whiteSpace: "nowrap" } }, r.bed); } },
      { key: "rr", label: "RR", sortable: true }, { key: "spo2", label: "SpO2", sortable: true, render: function (r) { return r.spo2 + "%"; } },
      { key: "temp", label: "Temp", sortable: true, render: function (r) { return r.temp.toFixed(1) + "°C"; } },
      { key: "sbp", label: "SBP", sortable: true }, { key: "hr", label: "HR", sortable: true }, { key: "avpu", label: "AVPU" },
      { key: "news2", label: "NEWS2", sortable: true, render: function (r) { return news2Node(r); } },
      { key: "at", label: "Taken", sortable: true }
    ],
    rows: function (ctx) { noteSoon(); return D(ctx).vitals.map(function (r) { r.news2 = AX.hims.news2(r); return r; }); },
    drawerTitle: function (r) { return r.name + " · " + r.bed; },
    drawer: function (r, ctx) {
      var wrap = E("div", { style: { display: "grid", gap: "14px" } });
      var out = E("div");
      var fields = {};
      var form = E("div", { class: "hx-fields" });
      [["rr", "RR"], ["spo2", "SpO2"], ["temp", "Temp"], ["sbp", "SBP"], ["hr", "HR"]].forEach(function (f) {
        var i = E("input", { type: "number", step: f[0] === "temp" ? "0.1" : "1", value: String(r[f[0]]), "aria-label": f[1], class: "hx-in", on: { input: recompute } });
        fields[f[0]] = i; form.appendChild(E("label", { style: { display: "grid", gap: "3px", font: "500 .72rem var(--font-mono)", color: "var(--ink-3)" } }, f[1], i));
      });
      var avpu = E("select", { class: "hx-in", "aria-label": "AVPU", on: { change: recompute } }, ["A", "V", "P", "U"].map(function (a) { return E("option", { value: a }, a); }));
      avpu.value = r.avpu;
      form.appendChild(E("label", { style: { display: "grid", gap: "3px", font: "500 .72rem var(--font-mono)", color: "var(--ink-3)" } }, "AVPU", avpu));
      function cur() {
        return { rr: +fields.rr.value, spo2: +fields.spo2.value, temp: +fields.temp.value, sbp: +fields.sbp.value, hr: +fields.hr.value, avpu: avpu.value, o2: r.o2 };
      }
      function recompute() {
        var v = cur(), d = news2Detail(v);
        out.textContent = "";
        out.appendChild(E("div", { style: { display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" } }, E("strong", {}, "NEWS2"), news2Node(v), badge(d.level, d.total >= 7 ? "bad" : d.total >= 5 ? "orange" : d.level === "low-medium" ? "warn" : "good")));
        out.appendChild(E("p", { style: { margin: "0 0 8px", fontSize: ".85rem" } }, d.response));
        out.appendChild(kv([["Resp. rate", "+" + d.parts.rr], ["SpO2 (scale 1)", "+" + d.parts.spo2], ["Supplemental O2", "+" + d.parts.o2], ["Systolic BP", "+" + d.parts.sbp], ["Pulse", "+" + d.parts.hr], ["Consciousness", "+" + d.parts.avpu], ["Temperature", "+" + d.parts.temp]]));
      }
      wrap.appendChild(mkNote());
      wrap.appendChild(E("p", { style: { margin: 0, fontSize: ".85rem", color: "var(--ink-2)" } }, r.dx + " · " + r.ward + " · recorded " + r.at + " by " + r.nurse + ". Edit a value to re-score."));
      wrap.appendChild(form); wrap.appendChild(out);
      wrap.appendChild(E("div", { class: "hx-row" },
        E("button", { type: "button", class: "hx-btn", on: { click: function () {
          var v = cur(); Object.assign(r, v); r.news2 = news2Detail(v).total; refreshTable();
          simToast("Simulated — vitals recorded; nothing was sent or saved.");
        } } }, "Record vitals"),
        E("button", { type: "button", class: "hx-btn primary", on: { click: function () {
          simToast("Simulated — rapid response team paged for " + r.bed + ".");
        } } }, "Escalate (rapid response)")));
      recompute();
      return wrap;
    }
  } });

  /* ---- Emergency board ---- */
  var ESI = { esi1: "#C0322B", esi2: "#EE6A24", esi3: "#E0A800", esi4: "#0F7A3D", esi5: "#2D6CDF" };
  mods.push({ id: "emergency", label: "Emergency triage", icon: "bell", group: "Clinical", role: "Emergency", view: {
    type: "board",
    columns: [{ id: "esi1", label: "ESI 1 · Resuscitation", tone: "bad" }, { id: "esi2", label: "ESI 2 · Emergent", tone: "hot" }, { id: "esi3", label: "ESI 3 · Urgent" }, { id: "esi4", label: "ESI 4 · Less urgent", tone: "good" }, { id: "esi5", label: "ESI 5 · Non-urgent" }],
    cards: function (ctx) { noteSoon(); return D(ctx).emergency; },
    renderCard: function (c) {
      return E("div", { class: "hx-esi", style: { "--c": ESI[c.col] } },
        E("div", { class: "bd-title" }, c.title), c.sub ? E("div", { class: "bd-sub" }, c.sub) : null,
        c.tags ? E("div", { class: "bd-tags" }, c.tags.map(function (t) { return E("span", { class: "bd-tag" }, t); })) : null,
        E("div", { class: "bd-meta" }, c.meta));
    },
    onMove: function (card, col) { simToast("Simulated — re-triaged to " + col.toUpperCase().replace("ESI", "ESI ") + "; nothing was sent or saved."); },
    onOpen: function (c) {
      AX.ui.drawer({ title: c.title, body: E("div", { style: { display: "grid", gap: "12px" } }, mkNote(), kv([["Triage", c.col.toUpperCase().replace("ESI", "ESI ")], ["Findings", c.sub || ""], ["Routing", (c.tags || []).join(", ")], ["Status", c.meta]]),
        E("p", { style: { margin: 0, fontSize: ".85rem" } }, "AI ESI triage proposes the level from chief complaint and vitals; the triage nurse can drag the card to override.")),
        actions: [{ label: "Activate code team", onClick: function () { simToast("Simulated — code team paged."); } }, { label: "Assign bay", primary: true, onClick: function () { simToast("Simulated — bay assigned."); } }] });
    }
  } });

  /* ---- Lab ---- */
  mods.push({ id: "lab", label: "Laboratory", icon: "flask", group: "Clinical", role: "Lab", view: {
    type: "table", qKeys: ["id", "test", "patient", "uhid"], pageSize: 12,
    filters: [{ key: "bench", label: "Benches", options: ["Hema", "Biochem", "Immuno", "Urine", "Micro"] }, { key: "status", label: "Status", options: ["Ordered", "Sample collected", "In analysis", "QC hold", "Awaiting verification", "Reported"] }],
    columns: [
      { key: "id", label: "Order", sortable: true }, { key: "test", label: "Test", sortable: true, render: function (r) { return E("span", {}, r.test, r.critical ? badge("Critical", "bad") : null); } },
      { key: "patient", label: "Patient", sortable: true }, { key: "bench", label: "Bench", sortable: true }, { key: "source", label: "From" },
      { key: "priority", label: "Priority", render: function (r) { return badge(r.priority, r.priority === "STAT" ? "bad" : r.priority === "Urgent" ? "orange" : ""); } },
      { key: "status", label: "Status", sortable: true, render: function (r) { return badge(r.status, statusKind(r.status)); } },
      { key: "tat", label: "TAT (min)", sortable: true }
    ],
    rows: function (ctx) { noteSoon(); return D(ctx).lab; },
    drawerTitle: function (r) { return r.id + " · " + r.test; },
    drawer: function (r) {
      var st = E("span", {}, badge(r.status, statusKind(r.status)));
      var body = E("div", { style: { display: "grid", gap: "12px" } }, mkNote(),
        kv([["Patient", r.patient + " · " + r.uhid], ["Bench", r.bench + " (" + r.tech + ")"], ["Priority", r.priority], ["Result", r.result], ["TAT", r.tat + " min"]]),
        E("div", {}, "Status: ", st),
        E("p", { style: { margin: 0, fontSize: ".85rem", color: "var(--ink-2)" } }, "Verification chain: tech result → QC gate → pathologist verification → report released to doctor and patient portal."));
      body.appendChild(E("div", { class: "hx-row" },
        E("button", { type: "button", class: "hx-btn primary", on: { click: function () {
          r.status = "Reported"; if (r.result === "Pending") r.result = "Within reference range"; st.textContent = ""; st.appendChild(badge("Reported", "good")); refreshTable();
          simToast("Simulated — result verified and released; nothing was sent or saved.");
        } } }, "Verify & release")));
      return body;
    } } });

  /* ---- Pharmacy ---- */
  mods.push({ id: "pharmacy", label: "Pharmacy queue", icon: "box", group: "Clinical", role: "Pharmacy", view: {
    type: "table", qKeys: ["id", "patient", "uhid", "doctor"], pageSize: 12,
    filters: [{ key: "tag", label: "Tags", options: ["OPD", "IPD", "OT", "ICU", "Discharge"] }, { key: "status", label: "Status", options: ["Queued", "Preparing", "Ready", "Dispensed"] }],
    columns: [
      { key: "id", label: "Rx", sortable: true }, { key: "patient", label: "Patient", sortable: true }, { key: "tag", label: "Tag", render: function (r) { return badge(r.tag, r.tag === "ICU" ? "bad" : r.tag === "Discharge" ? "info" : ""); } },
      { key: "count", label: "Items", sortable: true }, { key: "doctor", label: "Prescriber" },
      { key: "status", label: "Status", sortable: true, render: function (r) { return badge(r.status, statusKind(r.status)); } }
    ],
    rows: function (ctx) { noteSoon(); return D(ctx).pharmacy; },
    drawerTitle: function (r) { return r.id + " · " + r.patient; },
    drawer: function (r) {
      var next = { Queued: "Preparing", Preparing: "Ready", Ready: "Dispensed" };
      var st = E("span", {}, badge(r.status, statusKind(r.status)));
      var btn = E("button", { type: "button", class: "hx-btn primary", disabled: next[r.status] ? null : "", on: { click: function () {
        r.status = next[r.status]; st.textContent = ""; st.appendChild(badge(r.status, statusKind(r.status)));
        btn.textContent = next[r.status] ? "Mark " + next[r.status].toLowerCase() : "Dispensed ✓"; if (!next[r.status]) btn.disabled = true; refreshTable();
        simToast("Simulated — " + r.id + " is now " + r.status + "; nothing was sent or saved.");
      } } }, next[r.status] ? "Mark " + next[r.status].toLowerCase() : "Dispensed ✓");
      return E("div", { style: { display: "grid", gap: "12px" } }, mkNote(),
        kv([["Patient", r.patient + ", " + r.age + " y · " + r.uhid], ["Prescriber", r.doctor], ["Queue tag", r.tag]]),
        E("ul", { class: "hx-rx" }, r.items.map(function (i) { return E("li", {}, E("span", {}, i)); })),
        r.alert ? E("div", { class: "hx-alert ok" }, E("span", {}, "✓"), E("div", {}, E("strong", {}, "Drug-safety"), E("div", {}, r.alert))) : null,
        E("div", {}, "Status: ", st), btn);
    } } });

  /* ---- Beds ---- */
  mods.push({ id: "beds", label: "Bed management", icon: "bed", group: "Operations", role: "Admission", view: {
    type: "custom", render: function (el, ctx) {
      ensureCss();
      var beds = D(ctx).beds, filter = "All";
      var root = E("div", { style: { display: "grid", gap: "16px" } });
      el.appendChild(root);
      var COL = { occupied: "Occupied", vacant: "Vacant", cleaning: "Cleaning", reserved: "Reserved", maintenance: "Maintenance" };
      function openBed(b) {
        var h;
        function act(label, fn, msg) { return { label: label, primary: true, onClick: function () { fn(); h.close(); simToast("Simulated — " + msg + "; nothing was sent or saved."); draw(); } }; }
        var actions = b.state === "vacant" ? [act("Admit patient", function () { b.state = "occupied"; b.patient = "New admission"; b.los = 0; b.news2 = 1; }, "patient admitted to " + b.id)] :
          b.state === "occupied" ? [act("Discharge & release", function () { b.state = "cleaning"; b.patient = ""; b.news2 = null; }, "discharge initiated for " + b.id)] :
          b.state === "cleaning" ? [act("Mark clean", function () { b.state = "vacant"; }, b.id + " marked clean")] : [];
        h = AX.ui.drawer({ title: "Bed " + b.id, body: E("div", { style: { display: "grid", gap: "12px" } }, mkNote(),
          kv([["Ward", b.ward], ["State", COL[b.state]], ["Patient", b.patient || "—"], ["Stay", b.state === "occupied" ? b.los + " day(s)" : "—"], ["NEWS2", b.news2 != null ? String(b.news2) : "—"]])), actions: actions });
      }
      function draw() {
        root.textContent = "";
        var vis = beds.filter(function (b) { return filter === "All" || b.ward === filter; });
        var occ = beds.filter(function (b) { return b.state === "occupied"; }).length;
        var wards = []; beds.forEach(function (b) { if (wards.indexOf(b.ward) < 0) wards.push(b.ward); });
        root.appendChild(mkNote());
        root.appendChild(E("div", { class: "hx-row" },
          E("strong", { "data-occupancy": "" }, "Occupancy " + Math.round(occ / beds.length * 100) + "% (" + occ + "/" + beds.length + ")"),
          E("select", { "aria-label": "Ward", on: { change: function (e) { filter = e.target.value; draw(); } } }, ["All"].concat(wards).map(function (wd) { var o = E("option", { value: wd }, wd === "All" ? "All wards" : wd); if (wd === filter) o.selected = true; return o; })),
          E("div", { class: "hx-legend" }, Object.keys(COL).map(function (k) { return E("span", {}, E("i", { style: { borderColor: { occupied: "#C0322B", vacant: "#0F7A3D", cleaning: "#E0A800", reserved: "#2D6CDF", maintenance: "#6B7888" }[k] } }), COL[k]); }))));
        wards.forEach(function (wd) {
          var list = vis.filter(function (b) { return b.ward === wd; });
          if (!list.length) return;
          root.appendChild(E("section", { class: "hx-card" }, E("h3", {}, wd + " · " + list.filter(function (b) { return b.state === "occupied"; }).length + "/" + list.length + " occupied"),
            E("div", { class: "hx-beds" }, list.map(function (b) {
              return E("button", { type: "button", class: "hx-bed " + b.state, "data-bed": b.id, "aria-label": b.id + " " + COL[b.state], on: { click: function () { openBed(b); } } },
                E("b", {}, b.id), E("span", {}, b.patient || COL[b.state]), b.news2 != null ? E("span", {}, "NEWS2 " + b.news2) : null);
            }))));
        });
      }
      draw();
    } } });

  /* ---- OT calendar ---- */
  mods.push({ id: "ot", label: "OT schedule", icon: "calendar", group: "Operations", role: "OT", view: {
    type: "calendar", month: "2026-10",
    events: function (ctx) { noteSoon(); return D(ctx).ot; },
    onOpen: function (ev) {
      AX.ui.drawer({ title: ev.title, body: E("div", { style: { display: "grid", gap: "12px" } }, mkNote(),
        kv([["Date", ev.date], ["Theatre", ev.theatre], ["Surgeon", ev.surgeon], ["Patient", ev.patient]]),
        E("ul", { class: "hx-rx" }, ev.checklist.map(function (c) { return E("li", {}, E("span", {}, "✓ " + c)); })),
        E("p", { style: { margin: 0, fontSize: ".82rem", color: "var(--ink-3)" } }, "Drag cases between days on the calendar to reschedule.")),
        actions: [{ label: "Start WHO checklist", primary: true, onClick: function () { simToast("Simulated — checklist started."); } }] });
    },
    onDrop: function (id, date) { simToast("Simulated — case moved to " + date + "; nothing was sent or saved."); }
  } });

  /* ---- Blood bank ---- */
  mods.push({ id: "bloodbank", label: "Blood bank", icon: "heart", group: "Operations", role: "Blood bank", view: {
    type: "dashboard",
    kpis: function (ctx) {
      noteSoon(); var d = D(ctx).blood;
      return [{ label: "Units in stock", value: d.units.reduce(function (a, b) { return a + b; }, 0), format: "num", delta: 4 }, { label: "Expiring in 7 days", value: 4, delta: -12 }, { label: "Open requests", value: d.requests.length }, { label: "Donors today", value: 23, delta: 9 }];
    },
    charts: [
      { type: "bar", title: "Units by blood group (critical: O-, B-, AB-)", labels: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], values: [48, 9, 62, 11, 71, 14, 19, 4] },
      { type: "donut", title: "Component mix", parts: [{ label: "PRBC", value: 168 }, { label: "Platelets", value: 42 }, { label: "FFP", value: 21 }, { label: "Cryo", value: 7 }] },
      { type: "line", title: "Units issued, last 12 days", wide: true, labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], series: [{ name: "Issued", points: [18, 22, 19, 25, 31, 24, 20, 27, 29, 23, 26, 30] }, { name: "Collected", points: [20, 17, 24, 21, 19, 28, 22, 25, 21, 27, 24, 23] }] }
    ] } });

  /* ---- Billing & insurance ---- */
  mods.push({ id: "billing", label: "Billing & claims", icon: "wallet", group: "Finance", role: "Billing & insurance", view: {
    type: "table", qKeys: ["id", "patient", "pkg"], pageSize: 12,
    filters: [{ key: "scheme", label: "Schemes", options: ["AB-PMJAY", "CGHS", "ESIC", "Cash", "Private TPA", "State scheme"] }, { key: "status", label: "Status", options: ["Draft", "Pre-auth pending", "Submitted", "Approved", "Denied", "Paid"] }],
    columns: [
      { key: "id", label: "Claim", sortable: true }, { key: "patient", label: "Patient", sortable: true }, { key: "scheme", label: "Scheme", sortable: true },
      { key: "pkg", label: "Package" }, { key: "amount", label: "Amount", sortable: true, render: function (r) { return AX.fmt.inr(r.amount); } },
      { key: "status", label: "Status", sortable: true, render: function (r) { return badge(r.status, statusKind(r.status)); } },
      { key: "risk", label: "Denial risk", sortable: true, render: riskCell }
    ],
    rows: function (ctx) { noteSoon(); return D(ctx).claims; },
    drawerTitle: function (r) { return r.id + " · " + r.patient; },
    drawer: function (r) {
      var risk = E("div", {}, riskCell(r)), list = E("ul", { class: "hx-rx" });
      function reasons() { list.textContent = ""; r.reasons.forEach(function (x) { list.appendChild(E("li", {}, E("span", {}, x))); }); }
      reasons();
      return E("div", { style: { display: "grid", gap: "12px" } }, mkNote(),
        kv([["Scheme", r.scheme], ["Package", r.pkg], ["Amount", AX.fmt.inr(r.amount)], ["Status", r.status], ["Submitted", r.submitted]]),
        E("strong", { style: { fontSize: ".85rem" } }, "AI denial-risk score"), risk,
        E("strong", { style: { fontSize: ".85rem" } }, "Why"), list,
        E("div", { class: "hx-row" }, E("button", { type: "button", class: "hx-btn primary", on: { click: function () {
          r.risk = Math.min(r.risk, 7); r.reasons = ["All mandatory documents attached"]; risk.textContent = ""; risk.appendChild(riskCell(r)); reasons(); refreshTable();
          simToast("Simulated — AI fixes applied and claim resubmitted; nothing was sent.");
        } } }, "Apply AI fixes & submit")));
    } } });

  /* ---- Admin (COO) ---- */
  mods.push({ id: "coo", label: "Admin command centre", icon: "dashboard", group: "Leadership", role: "Admin (COO)", view: {
    type: "dashboard",
    kpis: function (ctx) { noteSoon(); return [{ label: "Roster coverage", value: "91%", delta: 2 }, { label: "Revenue today", value: "₹19.6L", delta: 6 }, { label: "NABH readiness", value: "86%", delta: 3 }, { label: "Bed occupancy", value: "78%", delta: -1 }]; },
    charts: [
      { type: "line", title: "Roster coverage % (last 7 days)", labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], series: [{ name: "Coverage", points: [96, 94, 91, 95, 88, 82, 79] }] },
      { type: "bar", title: "Revenue (₹ lakh per day)", labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], values: [18.4, 19.1, 17.8, 20.2, 19.6, 14.3, 11.9] },
      { type: "bar", title: "NABH chapter readiness %", wide: true, horizontal: true, labels: ["AAC", "COP", "MOM", "HIC", "PRE", "IMS", "CQI", "ROM", "HRM"], values: [92, 88, 84, 90, 86, 81, 78, 89, 87] }
    ] } });

  /* ---- Health Secretary cockpit ---- */
  mods.push({ id: "secretary", label: "Health Secretary cockpit", icon: "star", group: "Leadership", role: "Health Secretary", view: {
    type: "custom", render: function (el, ctx) {
      ensureCss();
      var dist = D(ctx).districts, fraud = D(ctx).fraud.slice();
      el.appendChild(mkNote());
      var kp = E("div"); el.appendChild(kp);
      AX.charts.kpis(kp, { items: [{ label: "Districts reporting", value: dist.length + " / 75" }, { label: "OPD today (state)", value: dist.reduce(function (a, d) { return a + d.opd; }, 0), format: "num", delta: 3 }, { label: "Avg bed occupancy", value: Math.round(dist.reduce(function (a, d) { return a + d.occupancy; }, 0) / dist.length) + "%" }, { label: "Open fraud alerts", value: fraud.length }] });
      var top = dist.slice(0, 10);
      var chartSlot = E("div");
      el.appendChild(E("section", { class: "hx-card" }, E("h3", {}, "District ranking (composite score)"), E("div", { "data-secretary-table": "" })));
      el.appendChild(E("section", { class: "hx-card" }, E("h3", {}, "Top 10 districts by score"), chartSlot));
      AX.table.create(el.querySelector("[data-secretary-table]"), {
        pageSize: 16, qKeys: ["district"],
        columns: [
          { key: "rank", label: "#", sortable: true }, { key: "district", label: "District", sortable: true }, { key: "score", label: "Score", sortable: true },
          { key: "opd", label: "OPD/day", sortable: true, render: function (r) { return AX.fmt.num(r.opd); } },
          { key: "occupancy", label: "Occupancy", sortable: true, render: function (r) { return r.occupancy + "%"; } },
          { key: "anc", label: "ANC 4+", sortable: true, render: function (r) { return r.anc + "%"; } },
          { key: "stockout", label: "Stock-outs", sortable: true }
        ],
        rows: dist,
        onRow: function (r) {
          AX.ui.drawer({ title: r.district + " · rank " + r.rank, body: E("div", { style: { display: "grid", gap: "12px" } }, kv([["Composite score", String(r.score)], ["OPD per day", AX.fmt.num(r.opd)], ["Bed occupancy", r.occupancy + "%"], ["ANC 4+ coverage", r.anc + "%"], ["Essential-drug stock-outs", String(r.stockout)], ["Grievance TAT", r.tat + " h"], ["NABH-ready facilities", r.nabh + "%"]])),
            actions: [{ label: "Send review note to CMO", primary: true, onClick: function () { simToast("Simulated — review note to the CMO of " + r.district + " not sent."); } }] });
        }
      });
      AX.charts.bar(chartSlot, { horizontal: true, labels: top.map(function (d) { return d.district; }), values: top.map(function (d) { return d.score; }) });
      var fl = E("ul", { class: "hx-fraud", "aria-label": "Fraud alerts" });
      var fcard = E("section", { class: "hx-card" }, E("h3", {}, "AB-PMJAY fraud alerts"), fl);
      el.appendChild(fcard);
      function drawFraud() {
        fl.textContent = "";
        if (!fraud.length) fl.appendChild(E("li", {}, "No open alerts."));
        fraud.forEach(function (f) {
          fl.appendChild(E("li", { "data-fraud": f.id }, E("div", { class: "top" }, E("strong", {}, f.title), badge(f.sev, f.sev === "High" ? "bad" : f.sev === "Medium" ? "orange" : "warn")),
            E("span", { style: { color: "var(--ink-2)" } }, f.detail + " (" + f.district + ")"),
            E("div", { class: "hx-row" }, E("button", { type: "button", class: "hx-btn primary", on: { click: function () { simToast("Simulated — case referred to the State Anti-Fraud Unit; nothing was sent."); } } }, "Refer to SAFU"),
              E("button", { type: "button", class: "hx-btn", on: { click: function () { fraud = fraud.filter(function (x) { return x.id !== f.id; }); drawFraud(); } } }, "Dismiss"))));
        });
      }
      drawFraud();
    } } });

  /* ---- CMO cockpit ---- */
  mods.push({ id: "cmo", label: "CMO cockpit", icon: "chart", group: "Leadership", role: "CMO", view: {
    type: "dashboard",
    kpis: function (ctx) { noteSoon(); return [{ label: "Institutional deliveries", value: "92.4%", delta: 1.8 }, { label: "ANC 4+ visits", value: "78%", delta: 2.1 }, { label: "Full immunisation", value: "84%", delta: 3.4 }, { label: "AB-PMJAY claims settled", value: "5,240", delta: 7 }]; },
    charts: [
      { type: "line", title: "Maternal & child health: ANC registrations vs deliveries (12 months)", wide: true, labels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        series: [{ name: "ANC registrations", points: AX.fake ? AX.fake.series("cmo-anc", 12, 8200, 11800) : [9000] }, { name: "Deliveries", points: AX.fake ? AX.fake.series("cmo-del", 12, 5200, 7600) : [6000] }] },
      { type: "bar", title: "Immunisation coverage % by antigen", wide: true, horizontal: true, labels: ["BCG", "OPV-3", "Penta-3", "MR-1", "MR-2/DPT-B", "Full"], values: [96, 91, 89, 87, 79, 84] },
      { type: "donut", title: "Scheme utilisation (this month)", parts: [{ label: "AB-PMJAY", value: 5240 }, { label: "JSY", value: 3120 }, { label: "RBSK", value: 1480 }, { label: "e-Sanjeevani", value: 2210 }, { label: "Free drugs/diag.", value: 4150 }] }
    ] } });

  /* ---- Patient portal ---- */
  mods.push({ id: "patient", label: "Patient portal", icon: "users", group: "Patient", role: "Patient", view: {
    type: "custom", render: function (el, ctx) {
      ensureCss();
      var p = D(ctx).patient, shared = false;
      el.appendChild(mkNote());
      var share = E("button", { type: "button", class: "hx-btn", on: { click: function () {
        shared = !shared; share.textContent = shared ? "Records shared with Dr. Mathur ✓" : "Share records with my doctor";
        simToast("Simulated — ABDM consent " + (shared ? "granted" : "revoked") + "; nothing was sent or saved.");
      } } }, "Share records with my doctor");
      var qr = ""; for (var i = 0; i < 49; i++) qr += ((i * 7 + (i >> 3) * 3) % 5 < 2 || i % 8 === 0 || i < 8) ? '<rect x="' + (i % 7) * 6 + '" y="' + Math.floor(i / 7) * 6 + '" width="5" height="5" fill="#0B1F33"/>' : "";
      var card = E("div", { class: "hx-abha", "data-abha": "" },
        E("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, E("small", {}, "Ayushman Bharat Health Account"), E("span", { class: "hx-badge", style: { background: "rgba(255,255,255,.2)", color: "#fff" } }, "ABHA")),
        E("h4", {}, p.name + ", " + p.age + " Y · M"), E("div", { class: "no" }, p.abha),
        E("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "12px" } },
          E("div", { style: { fontSize: ".8rem" } }, E("div", {}, "ABHA address: " + p.abhaAddress), E("div", {}, "Blood group " + p.blood + " · " + p.scheme)),
          E("span", { style: { background: "#fff", borderRadius: "8px", padding: "4px", lineHeight: 0 }, html: '<svg width="52" height="52" viewBox="0 0 42 42" role="img" aria-label="ABHA QR (decorative)">' + qr + "</svg>" })));
      var tl = E("ol", { class: "hx-tl", "aria-label": "Health story" }, p.timeline.map(function (t) { return E("li", {}, E("small", {}, t[0] + " · " + t[2]), t[1]); }));
      el.appendChild(E("div", { class: "hx-grid" },
        E("div", { style: { display: "grid", gap: "16px", alignContent: "start" } }, card, share,
          E("section", { class: "hx-card" }, E("h3", {}, "Current medicines"), E("ul", { class: "hx-rx" }, p.meds.map(function (m) { return E("li", {}, E("span", {}, m)); }))),
          E("section", { class: "hx-card" }, E("h3", {}, "Reports"), E("ul", { class: "hx-rx" }, p.reports.map(function (r) {
            return E("li", {}, E("span", {}, r), E("button", { type: "button", "aria-label": "Download " + r, on: { click: function () { simToast("Simulated — report download not started."); } } }, "↓"));
          })))),
        E("section", { class: "hx-card" }, E("h3", {}, "My health story"), tl)));
    } } });

  /* ---- Audit ---- */
  mods.push({ id: "audit", label: "Audit trail (NABH)", icon: "file", group: "Compliance", view: {
    type: "table", qKeys: ["id", "action", "user", "ref"], pageSize: 14,
    filters: [{ key: "role", label: "Roles", options: ["Doctor", "Pharmacy", "Nurse", "Lab", "Billing", "Admission", "Blood bank", "Admin", "Emergency", "OT", "CMO"] }, { key: "chapter", label: "NABH", options: ["AAC", "COP", "MOM", "HIC", "PRE", "IMS", "CQI", "ROM", "HRM"] }],
    columns: [
      { key: "time", label: "Time", sortable: true }, { key: "role", label: "Role", sortable: true }, { key: "user", label: "User" }, { key: "action", label: "Action" },
      { key: "ref", label: "Ref" }, { key: "chapter", label: "NABH", render: function (r) { return badge(r.chapter, "info"); } },
      { key: "ai", label: "By AI", render: function (r) { return r.ai ? badge("AI", "orange") : ""; } }
    ],
    rows: function (ctx) { noteSoon(); return D(ctx).audit; },
    drawerTitle: function (r) { return r.id; },
    drawer: function (r) {
      return E("div", { style: { display: "grid", gap: "12px" } }, kv([["Time", r.time], ["Role", r.role], ["User", r.user], ["Action", r.action], ["Entity", r.entity + " " + r.ref], ["NABH chapter", r.chapter], ["Initiated by", r.ai ? "AI agent (human-approved)" : "Human"]]),
        E("p", { style: { margin: 0, fontSize: ".82rem", color: "var(--ink-3)" } }, "Audit events are append-only and mapped to NABH chapters; this view is a fictional sample."));
    } } });

  AX.demos["agentix-hims"] = { brand: { name: "Agentix HIMS", accent: "#0E7C86", logoText: "H" }, start: "journey", modules: mods };
})(window);
