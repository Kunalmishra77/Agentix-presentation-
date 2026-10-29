/* Your Hair Company demo: doctor-led hair D2C (scan funnel, consult booking, doctor portal, sales CRM, refills, guarantee).
   Fictional data only; every payment, WhatsApp and prescription is simulated. */
(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.demos = AX.demos || {};
  var SLUG = "yhc", ACCENT = "#1E3A5F", GOLD = "#B8892B";

  /* ---------- pure scan logic ---------- */
  var QUESTIONS = [
    { key: "pattern", q: "Where do you notice the loss most?", opts: ["Overall slight shedding", "Temples / receding hairline", "Crown / vertex", "Both hairline and crown"] },
    { key: "duration", q: "How long has it been happening?", opts: ["Under 6 months", "6 to 24 months", "More than 2 years"] },
    { key: "family", q: "Any family history of hair loss?", opts: ["None that I know of", "Maternal side", "Paternal side", "Both sides"] },
    { key: "lifestyle", q: "How would you describe sleep and stress?", opts: ["Balanced", "Stressful but regular sleep", "High stress and poor sleep"] }
  ];
  /** answers: {pattern, duration, family, lifestyle} as option indexes. Deterministic: same answers -> same result. */
  function scanResult(a) {
    a = a || {};
    var pts = (a.pattern || 0) + (a.duration || 0) + (a.family || 0) + (a.lifestyle || 0);   // 0..10
    var stage = Math.min(7, 1 + Math.round(pts * 0.6));
    var density = Math.max(38, 96 - pts * 5);
    var zone = ["Diffuse", "Frontal", "Vertex", "Frontal and vertex"][a.pattern || 0];
    var advice = stage <= 2 ? "Early stage. A routine plus a doctor review can stop progression." : stage <= 4 ? "Active thinning. A prescribed plan with 6-month tracking gives the best result." : "Advanced thinning. Doctor-led treatment and realistic goals are important.";
    return { stage: stage, label: "Stage " + stage, density: density, zone: zone, advice: advice, pts: pts };
  }
  AX.yhc = { scanResult: scanResult, QUESTIONS: QUESTIONS };

  /* ---------- styles ---------- */
  function scope(css) {
    var pre = '.ax-app[data-slug="' + SLUG + '"] ', dpre = '.demo-scope[data-slug="' + SLUG + '"] ';
    return css.replace(/(^|[{}])\s*([^{}@]+?)\s*\{/g, function (m, b, sel) {
      if (sel.indexOf(".ax-app") === 0) return m;
      return b + sel.split(",").map(function (s) { return pre + s.trim() + "," + dpre + s.trim(); }).join(",") + "{";
    });
  }
  var CSS = scope([
    ".yh-card{background:#fff;border:1px solid var(--ax-line);border-radius:12px;padding:16px;min-width:0}.yh-card h3{margin:0 0 10px;font:600 14px var(--font-display)}",
    ".yh-btn{appearance:none;font:600 13px var(--font-body);padding:10px 18px;border-radius:999px;border:1px solid var(--ax-line);background:#fff;color:var(--ink);cursor:pointer}.yh-btn.primary{background:var(--ax-accent);border-color:var(--ax-accent);color:#fff}.yh-btn.gold{background:#B8892B;border-color:#B8892B;color:#fff}.yh-btn:disabled{opacity:.45;cursor:default}.yh-btn.sm{padding:5px 11px;font-size:12px}",
    ".yh-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.yh-gap{margin-top:14px}.yh-muted{color:var(--ink-3);font-size:13px}",
    ".yh-pill{display:inline-block;font:600 11px var(--font-body);padding:2px 9px;border-radius:999px;background:rgba(11,31,51,.08);color:#2b3a4b;white-space:nowrap}.yh-pill.good{background:#dff3e6;color:#17663b}.yh-pill.warn{background:#fdf0d2;color:#7a4e00}.yh-pill.bad{background:#fbe0de;color:#9c1f19}.yh-pill.info{background:#dcebfb;color:#164a85}",
    ".yh-kv{display:grid;grid-template-columns:120px 1fr;gap:8px 12px;margin:0 0 14px;font-size:14px}.yh-kv dt{color:var(--ink-3);font:500 12px var(--font-mono)}.yh-kv dd{margin:0;overflow-wrap:anywhere}",
    ".yh-in,.yh-sel,.yh-ta{font:400 14px var(--font-body);padding:9px 12px;border:1px solid var(--ax-line);border-radius:8px;background:#fff;color:var(--ink);max-width:100%;width:100%}.yh-lab{display:flex;flex-direction:column;gap:4px;font:500 12px var(--font-mono);color:var(--ink-3)}",
    ".yh-steps{display:flex;gap:6px;margin-bottom:14px}.yh-steps span{flex:1;height:5px;border-radius:3px;background:rgba(11,31,51,.1)}.yh-steps span.on{background:var(--ax-accent)}",
    ".yh-opt{appearance:none;width:100%;text-align:left;padding:12px 14px;margin-top:8px;border:1.5px solid var(--ax-line);border-radius:12px;background:#fff;cursor:pointer;font:500 14px var(--font-body);color:var(--ink)}.yh-opt:hover,.yh-opt:focus-visible{border-color:var(--ax-accent);background:#EEF3F9}",
    ".yh-scan{display:grid;grid-template-columns:minmax(0,320px) minmax(0,1fr);gap:20px;align-items:center}@media(max-width:760px){.yh-scan{grid-template-columns:minmax(0,1fr)}}",
    ".yh-canvas{width:100%;aspect-ratio:1;border-radius:16px;background:radial-gradient(circle at 50% 40%,#17335a,#07111f);display:block}",
    ".yh-prog{height:10px;border-radius:99px;background:rgba(11,31,51,.1);overflow:hidden;margin:10px 0}.yh-prog i{display:block;height:100%;width:0;background:linear-gradient(90deg,#1E3A5F,#B8892B);border-radius:99px}",
    ".yh-stage{display:flex;gap:20px;align-items:center;flex-wrap:wrap}.yh-big{font:700 2.4rem var(--font-display);color:var(--ax-accent);line-height:1}.yh-big small{display:block;font:500 12px var(--font-mono);color:var(--ink-3);margin-top:4px}",
    ".yh-slots{display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:8px}.yh-slot{appearance:none;padding:9px 6px;border:1.5px solid var(--ax-line);border-radius:10px;background:#fff;font:600 13px var(--font-mono);cursor:pointer;color:var(--ink)}.yh-slot[aria-pressed=true]{background:var(--ax-accent);border-color:var(--ax-accent);color:#fff}.yh-slot:disabled{text-decoration:line-through;opacity:.4;cursor:default}",
    ".yh-days{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px}.yh-day{appearance:none;flex:none;padding:8px 14px;border:1.5px solid var(--ax-line);border-radius:12px;background:#fff;font:600 13px var(--font-body);cursor:pointer;color:var(--ink);text-align:center}.yh-day[aria-pressed=true]{border-color:var(--ax-accent);background:#EEF3F9}",
    ".yh-grid2{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:16px}@media(max-width:900px){.yh-grid2{grid-template-columns:minmax(0,1fr)}}",
    ".yh-video{position:relative;aspect-ratio:16/9;border-radius:14px;background:linear-gradient(135deg,#0d1b2d,#1d3a5e);color:#fff;display:grid;place-items:center;text-align:center;padding:14px;overflow:hidden}.yh-video b{display:block;font:700 1.1rem var(--font-display)}.yh-video small{opacity:.8}",
    ".yh-self{position:absolute;right:10px;bottom:10px;width:84px;aspect-ratio:4/3;border-radius:8px;background:#34567f;border:2px solid rgba(255,255,255,.5);display:grid;place-items:center;font-size:11px}",
    "@media(max-width:560px){.yh-self{display:none}}",
    ".yh-live{display:inline-block;width:8px;height:8px;border-radius:50%;background:#ff5a4f;margin-right:6px}",
    ".yh-rx label.yh-chk{display:flex;gap:8px;align-items:flex-start;padding:7px 0;border-bottom:1px solid var(--ax-line);font-size:13px}",
    ".yh-photos{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.yh-photo{aspect-ratio:3/4;border-radius:12px;display:flex;align-items:flex-end;padding:8px;color:#fff;font:600 12px var(--font-body)}",
    ".yh-meter{height:12px;border-radius:99px;background:rgba(11,31,51,.1);overflow:hidden}.yh-meter i{display:block;height:100%;background:var(--ax-accent)}",
    ".yh-tl{list-style:none;margin:0;padding:0}.yh-tl li{padding:8px 0 8px 18px;border-left:2px solid var(--ax-line);position:relative;font-size:13px}.yh-tl li::before{content:'';position:absolute;left:-6px;top:12px;width:10px;height:10px;border-radius:50%;background:var(--ax-accent)}",
    ".yh-calnav{display:flex;align-items:center;gap:10px;margin-bottom:10px}.yh-calnav b{font:600 14px var(--font-display);min-width:120px;text-align:center}",
    ".ax-app[data-slug=yhc] .pl-cost{display:none}.ax-app[data-slug=yhc] .bd{overflow-x:auto}"
  ].join("\n"));
  var ROOTCSS = '.ax-app[data-slug="yhc"]{--orange:' + ACCENT + ';--ax-accent:' + ACCENT + '}.demo-scope[data-slug="yhc"]{--orange:' + ACCENT + ';--ax-accent:' + ACCENT + ';--ax-line:rgba(11,31,51,.12)}';
  try {
    if (typeof document !== "undefined" && document.head && !(document.getElementById && document.getElementById("yhc-css"))) {
      var st = document.createElement("style"); st.id = "yhc-css"; st.textContent = ROOTCSS + "\n" + CSS; document.head.appendChild(st);
    }
  } catch (e) { /* non-DOM loader */ }

  /* ---------- DOM helpers ---------- */
  function h() { return AX.el.apply(null, arguments); }
  function inr(n) { return AX.fmt.inr(Math.round(n)); }
  function sim(text) { AX.ui.toast(text || AX.ui.SIM_DEFAULT, { kind: "sim" }); }
  function btn(label, fn, cls, attrs) { return h("button", Object.assign({ type: "button", class: "yh-btn " + (cls || ""), on: { click: fn } }, attrs || {}), label); }
  function pill(text, tone) { return h("span", { class: "yh-pill " + (tone || "") }, text); }
  function card(title, body) { return h("section", { class: "yh-card" }, title ? h("h3", {}, title) : null, body); }
  function dl(pairs) { var d = h("dl", { class: "yh-kv" }); pairs.forEach(function (p) { d.appendChild(h("dt", {}, p[0])); d.appendChild(h("dd", {}, p[1] == null ? "" : p[1])); }); return d; }
  function lab(text, node) { return h("label", { class: "yh-lab" }, text, node); }
  function drawer(title, body, actions) { return AX.ui.drawer({ title: title, body: h("div", { class: "demo-scope", "data-slug": SLUG }, body), actions: actions }); }
  var TONE = { Booked: "info", "Plan sent": "good", Completed: "good", Delivered: "good", Shipped: "info", Packed: "info", Paid: "info", "Awaiting payment": "warn", Overdue: "bad", Done: "good", Scheduled: "info", "On track": "good", "At risk": "bad", "Claim review": "warn" };
  function statusPill(s) { return pill(s, TONE[s] || ""); }
  function reduced() { try { return !!(w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch (e) { return false; } }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function dayName(iso) { var p = iso.split("-"); return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(+p[0], +p[1] - 1, +p[2]).getDay()] + " " + (+p[2]) + " " + ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][+p[1] - 1]; }

  /* ---------- shared state ---------- */
  var seq = 0;
  function Y(ctx) {
    if (!ctx.state.get().yhc) {
      var d = ctx.data;
      var seedBook = [0, 1, 2].map(function (i) {
        var p = d.patients[i], ev = d.events[i];
        return { id: "YHC-B-" + (1101 + i), seed: true, name: p.name, phone: p.phone, age: p.age, date: ev.date, time: ev.time, status: "Booked", scan: { stage: +p.stage.replace(/\D/g, "")[0] || 3, label: p.stage, density: p.density, zone: "Frontal and vertex" }, goal: p.goal, history: p.history, paid: 500 };
      });
      ctx.state.set({ yhc: {
        bookings: seedBook, patients: d.patients.map(function (p) { return Object.assign({}, p); }), leads: d.leads.map(function (l) { return Object.assign({}, l); }),
        followups: d.followups.map(function (f) { return Object.assign({}, f); }), orders: d.orders.map(function (o) { return Object.assign({}, o); }), audit: d.audit.map(function (a) { return Object.assign({}, a); }),
        events: d.events.map(function (e) { return Object.assign({}, e); }), scanAnswers: {}, scan: null, activeId: seedBook[0].id, calMonth: d.month, slot: null
      } });
    }
    return ctx.state.get().yhc;
  }
  function audit(ctx, action, ref) {
    var y = Y(ctx);
    y.audit.unshift({ id: "AU-n" + (++seq), at: ctx.data.today + " " + AX.fmt.time(new Date()), user: "Demo user", action: action, ref: ref || "" });
  }
  function bookingEvents(ctx) {
    var y = Y(ctx);
    return y.events.concat(y.bookings.filter(function (b) { return !b.seed; }).map(function (b) { return { id: b.id, title: b.time + " " + b.name, date: b.date, tone: "orange", booking: b.id }; }));
  }

  /* ---------- modules ---------- */
  var modules = [];
  function M(role, id, label, icon, view) { modules.push({ id: id, label: label, icon: icon, group: role, role: role, view: view }); }

  M("Customer", "site", "Website", "home", {
    type: "custom",
    render: function (host) {
      AX.embed.create(host, { url: "https://yourhaircompany.com/", title: "Your Hair Company", external: true,
        allowedOrigins: ["https://agentix-portfolio.vercel.app", "https://ai-agentix.com", "https://*.ai-agentix.com"],
        shots: [{ src: "assets/shots/yhc/hero.jpg" }] });
    }
  });

  /* ----- 3D scalp scan funnel ----- */
  function drawMesh(c, angle, prog) {
    var g = c.getContext("2d"), W = c.width, H = c.height, cx = W / 2, cy = H / 2 + 6, R = W * 0.34;
    g.clearRect(0, 0, W, H);
    function pt(lat, lon) {
      var x = Math.cos(lat) * Math.cos(lon + angle), y = Math.sin(lat) * 1.12, z = Math.cos(lat) * Math.sin(lon + angle);
      var s = 1 / (1.6 - z * 0.35);
      return { x: cx + x * R * s * 1.5, y: cy - y * R * s * 1.5, z: z };
    }
    g.lineWidth = 1;
    for (var la = -3; la <= 3; la++) {
      g.beginPath();
      for (var k = 0; k <= 48; k++) { var p = pt(la * 0.4, k / 48 * Math.PI * 2); if (k) g.lineTo(p.x, p.y); else g.moveTo(p.x, p.y); }
      g.strokeStyle = "rgba(120,170,230,.45)"; g.stroke();
    }
    for (var lo = 0; lo < 12; lo++) {
      g.beginPath();
      for (var j = 0; j <= 30; j++) { var q = pt(-1.2 + j / 30 * 2.4, lo / 12 * Math.PI * 2); if (j) g.lineTo(q.x, q.y); else g.moveTo(q.x, q.y); }
      g.strokeStyle = "rgba(120,170,230,.3)"; g.stroke();
    }
    var scanY = cy + R * 1.5 - (prog / 100) * R * 3;
    for (var a = 0; a < 90; a++) {
      var lat = ((a * 37) % 100) / 100 * 2.2 - 1.1, lon = (a * 2.399) % (Math.PI * 2), pp = pt(lat, lon);
      if (pp.z < -0.1) continue;
      var lit = pp.y > scanY;
      g.fillStyle = lit ? "rgba(184,137,43,.95)" : "rgba(160,200,255,.5)";
      g.beginPath(); g.arc(pp.x, pp.y, lit ? 2.6 : 1.8, 0, 7); g.fill();
    }
    g.fillStyle = "rgba(184,137,43,.9)"; g.fillRect(cx - R * 1.3, scanY, R * 2.6, 2);
  }
  M("Customer", "scan", "3D scalp scan", "heart", {
    type: "custom",
    render: function (host, ctx) {
      var y = Y(ctx), step = 0, raf = null, tmr = null, alive = true;
      var root = h("div", { class: "yh-card", "data-scan-root": "" });
      host.appendChild(root);
      AX.mount(host, function () { alive = false; if (raf) cancelAnimationFrame(raf); if (tmr) clearInterval(tmr); });
      function stop() { if (raf) cancelAnimationFrame(raf); raf = null; if (tmr) clearInterval(tmr); tmr = null; }
      function question() {
        stop(); root.textContent = "";
        var qn = QUESTIONS[step];
        root.appendChild(h("div", { class: "yh-steps" }, QUESTIONS.map(function (_, i) { return h("span", { class: i <= step ? "on" : "" }); })));
        root.appendChild(h("h3", {}, "Free hair assessment - question " + (step + 1) + " of 4"));
        root.appendChild(h("p", { "data-scan-q": String(step), style: { font: "600 17px var(--font-display)", margin: "0 0 4px" } }, qn.q));
        qn.opts.forEach(function (o, i) {
          root.appendChild(h("button", { type: "button", class: "yh-opt", "data-opt": String(i), on: { click: function () {
            y.scanAnswers[qn.key] = i;
            if (step < QUESTIONS.length - 1) { step++; question(); } else scanning();
          } } }, o));
        });
      }
      function scanning() {
        stop(); root.textContent = "";
        var canvas = h("canvas", { class: "yh-canvas", width: "640", height: "640", "aria-label": "3D scalp scan mesh" });
        var bar = h("i"), pct = h("b", { "data-scan-progress": "0" }, "0%");
        root.appendChild(h("div", { class: "yh-scan" }, canvas, h("div", {},
          h("h3", {}, "Scanning your scalp in 3D"),
          h("p", { class: "yh-muted" }, "Mapping hairline, crown and density across 4,096 sample points (simulated)."),
          h("div", { class: "yh-prog" }, bar), pct)));
        var prog = 0, angle = 0, quick = reduced();
        function frame() { if (!alive) return; angle += 0.03; drawMesh(canvas, angle, prog); if (!quick) raf = requestAnimationFrame(frame); }
        drawMesh(canvas, 0.6, 0);
        if (!quick) raf = requestAnimationFrame(frame);
        tmr = setInterval(function () {
          if (!alive) return;
          prog = Math.min(100, prog + (quick ? 25 : 2));
          bar.style.width = prog + "%"; pct.textContent = prog + "%"; pct.setAttribute("data-scan-progress", String(prog));
          if (quick) drawMesh(canvas, 0.6, prog);
          if (prog >= 100) { stop(); result(); }
        }, quick ? 20 : 60);
      }
      function result() {
        root.textContent = "";
        var r = scanResult(y.scanAnswers);
        y.scan = r;
        root.appendChild(h("div", { "data-scan-result": r.label, "data-density": String(r.density) },
          h("h3", {}, "Your scan result"),
          h("div", { class: "yh-stage" },
            h("div", { class: "yh-big" }, r.label, h("small", {}, "Norwood-style stage")),
            h("div", { class: "yh-big" }, r.density + "%", h("small", {}, "Estimated density")),
            h("div", {}, h("b", {}, r.zone + " thinning"), h("p", { class: "yh-muted", style: { maxWidth: "380px" } }, r.advice))),
          h("div", { class: "yh-meter yh-gap", "aria-label": "Density" }, h("i", { style: { width: r.density + "%" } })),
          h("p", { class: "yh-muted" }, "Simulated analysis - a doctor confirms your stage in the video consult."),
          h("div", { class: "yh-row yh-gap" }, btn("Book a ₹500 video consult", function () { ctx.open("book"); }, "primary", { "data-goto-book": "" }), btn("Retake the scan", function () { step = 0; y.scanAnswers = {}; question(); }))));
      }
      question();
    }
  });

  /* ----- booking + mock payment ----- */
  M("Customer", "book", "Book consult", "calendar", {
    type: "custom",
    render: function (host, ctx) {
      var y = Y(ctx), d = ctx.data, day = d.days[0].date, slot = null, method = "UPI";
      var root = h("div", { class: "yh-grid2" });
      host.appendChild(root);
      var nameIn = h("input", { class: "yh-in", "data-book-name": "", value: d.persona.name, "aria-label": "Your name" });
      var phoneIn = h("input", { class: "yh-in", "data-book-phone": "", value: d.persona.phone, "aria-label": "Phone" });
      function draw() {
        var nameVal = nameIn.value, phoneVal = phoneIn.value;
        root.textContent = "";
        var dayRec = d.days.filter(function (x) { return x.date === day; })[0];
        var left = card("1. Choose a slot with " + d.doctor.name,
          h("div", {},
            h("div", { class: "yh-days", role: "group", "aria-label": "Day" }, d.days.map(function (x) { return h("button", { type: "button", class: "yh-day", "data-day": x.date, "aria-pressed": String(x.date === day), on: { click: function () { day = x.date; slot = null; draw(); } } }, dayName(x.date)); })),
            h("div", { class: "yh-slots yh-gap" }, d.times.map(function (t) {
              var taken = !!dayRec.booked[t];
              return h("button", { type: "button", class: "yh-slot", "data-slot": day + " " + t, disabled: taken ? "" : null, "aria-pressed": String(slot === t), on: { click: function () { slot = t; draw(); } } }, t);
            })),
            h("p", { class: "yh-muted yh-gap" }, "25-minute video consult. Free reschedule up to 2 hours before.")));
        nameIn.value = nameVal; phoneIn.value = phoneVal;
        var pay = card("2. Your details and payment",
          h("div", { class: "yh-rx" },
            lab("Name", nameIn), h("div", { class: "yh-gap" }, lab("Phone", phoneIn)),
            h("div", { class: "yh-gap yh-row", role: "group", "aria-label": "Payment method" }, ["UPI", "Card", "Netbanking"].map(function (m) { return h("button", { type: "button", class: "yh-day", "aria-pressed": String(method === m), on: { click: function () { method = m; draw(); } } }, m); })),
            h("div", { class: "yh-gap" }, dl([["Consultation", inr(500)], ["Slot", slot ? dayName(day) + ", " + slot : "Pick a slot"], ["Scan", y.scan ? y.scan.label + " · " + y.scan.density + "%" : "Not taken (optional)"]])),
            btn("Pay ₹500 (mock " + method + ")", confirm, "gold", { disabled: slot ? null : "", "data-pay": "" })));
        root.appendChild(left); root.appendChild(pay);
      }
      function confirm() {
        var name = nameIn.value.trim() || d.persona.name;
        var id = "YHC-B-" + (2001 + (++seq));
        var b = { id: id, name: name, phone: phoneIn.value, age: 31, date: day, time: slot, status: "Booked", scan: y.scan || scanResult({ pattern: 1, duration: 1, family: 2, lifestyle: 1 }), goal: "Stop receding hairline", history: "Paternal family history", paid: 500 };
        y.bookings.unshift(b);
        y.activeId = id;
        y.leads.unshift({ id: "YL-n" + seq, col: "booked", title: name, sub: "Scan funnel · " + b.phone, meta: "Consult " + dayName(day) + " " + slot, tags: ["Hot"], bookingId: id });
        audit(ctx, "Consult booked and ₹500 paid", id);
        root.textContent = "";
        root.appendChild(card("Booking confirmed", h("div", { "data-booking-confirmed": id },
          h("p", { style: { font: "700 20px var(--font-display)", margin: "0 0 8px" } }, "You're booked, " + name.split(" ")[0] + "."),
          dl([["Booking ID", id], ["Doctor", d.doctor.name], ["When", dayName(day) + ", " + slot], ["Paid", inr(500) + " (mock " + method + ")"], ["Video link", "Sent on WhatsApp 15 minutes before"]]),
          h("div", { class: "yh-row" }, btn("See in my account", function () { ctx.open("account"); }, "primary"), btn("Book another", function () { slot = null; draw(); })))));
        sim("Simulated — payment not charged, WhatsApp confirmation not sent");
      }
      draw();
    }
  });

  /* ----- customer account ----- */
  M("Customer", "account", "My account", "users", {
    type: "custom",
    render: function (host, ctx) {
      var y = Y(ctx), d = ctx.data;
      var mine = y.bookings.filter(function (b) { return !b.seed; });
      var cur = mine[0];
      var grid = h("div", { class: "yh-grid2" });
      host.appendChild(h("p", { class: "yh-muted" }, "Signed in as " + (cur ? cur.name : d.persona.name) + " (demo customer)"));
      host.appendChild(grid);
      grid.appendChild(card("Consultations", mine.length ? h("div", {}, mine.map(function (b) {
        return h("div", { class: "yh-row", "data-consult": b.id, style: { justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--ax-line)" } },
          h("span", {}, h("b", {}, dayName(b.date) + " " + b.time), h("div", { class: "yh-muted" }, b.id + " · " + d.doctor.name)), statusPill(b.status));
      })) : h("div", {}, h("p", { class: "yh-muted" }, "No consultations yet."), btn("Take the scan", function () { ctx.open("scan"); }, "primary sm"))));
      var planB = mine.filter(function (b) { return b.plan; })[0];
      grid.appendChild(card("Your plan", planB ? h("div", { "data-plan": "" }, dl([["Doctor", d.doctor.name], ["Treatment", planB.plan.meds.join(", ")], ["Duration", planB.plan.months + " months"], ["Kit", planB.plan.kit]]), pill("Plan ready - pay to start the guarantee clock", "good")) : h("p", { class: "yh-muted" }, "Your doctor's plan appears here after the consult.")));
      var orders = y.orders.filter(function (o) { return o.customer === (cur ? cur.name : "") }).concat(y.orders.slice(0, 3));
      grid.appendChild(card("Orders", h("div", {}, orders.slice(0, 5).map(function (o) { return h("div", { class: "yh-row", style: { justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--ax-line)", fontSize: "13px" } }, h("span", {}, o.id + " · " + o.item), h("span", {}, inr(o.amount) + " "), statusPill(o.status)); }))));
      grid.appendChild(card("Money-back guarantee", h("div", { "data-guarantee": "" },
        h("div", { class: "yh-row", style: { justifyContent: "space-between" } }, h("b", {}, "Day " + (planB ? 1 : 42) + " of 180"), pill("On track", "good")),
        h("div", { class: "yh-meter yh-gap" }, h("i", { style: { width: Math.round((planB ? 1 : 42) / 180 * 100) + "%" } })),
        h("p", { class: "yh-muted" }, "Upload progress photos at day 45, 90 and 135. Follow the routine and if there is no visible improvement at day 180 you can claim a refund."))));
      var tl = card("Progress photos", h("div", { class: "yh-photos" }, [["Day 0", "#3b5f8f"], ["Day 45", "#2c6a8a"], ["Day 90 (due)", "#8a8f98"]].map(function (p) { return h("div", { class: "yh-photo", style: { background: "linear-gradient(160deg," + p[1] + ",#16283f)" } }, p[0]); })));
      tl.style.gridColumn = "1 / -1";
      grid.appendChild(tl);
    }
  });

  /* ----- shop ----- */
  M("Customer", "shop", "Shop", "store", function (ctx) {
    return { type: "store", products: ctx.data.products, categories: ["Treatment", "Supplements", "Care", "Devices", "Kits"], gstRate: 0.18, shipping: 79, freeOver: 999, coupons: [{ code: "HAIR10", pct: 10 }] };
  });

  /* ----- doctor calendar ----- */
  M("Doctor", "doctor-calendar", "Calendar", "calendar", {
    type: "custom",
    render: function (host, ctx) {
      var y = Y(ctx), d = ctx.data;
      var calHost = h("div", {});
      host.appendChild(h("p", { class: "yh-muted" }, d.doctor.name + " - new bookings appear here automatically. Drag a booking to reschedule, click it to open the consult room."));
      host.appendChild(calHost);
      function draw() {
        AX.calendar.month(calHost, { month: d.month, events: bookingEvents(ctx),
          onDrop: function (id, date) {
            var b = y.bookings.filter(function (x) { return x.id === id; })[0];
            if (b) b.date = date; else { var e = y.events.filter(function (x) { return x.id === id; })[0]; if (e) e.date = date; }
            audit(ctx, "Consult rescheduled to " + date, id);
            sim("Simulated — patient notified on WhatsApp of the new date");
          },
          onOpen: function (ev) {
            var b = ev.booking ? y.bookings.filter(function (x) { return x.id === ev.booking; })[0] : null;
            var pt = !b ? y.patients.filter(function (x) { return x.id === ev.patient; })[0] : null;
            var who = b || pt || {};
            var body = h("div", {}, dl([["Patient", who.name], ["When", dayName(ev.date) + " " + (ev.time || (b && b.time) || "")], ["Scan", b ? b.scan.label + " · " + b.scan.density + "%" : (pt ? pt.stage + " · " + pt.density + "%" : "")], ["Goal", who.goal || ""], ["Status", b ? b.status : "Scheduled"]]));
            var dr = drawer(ev.title, body, [{ label: "Open consult room", primary: true, onClick: function () { if (b) y.activeId = b.id; dr.close(); ctx.open("consult"); } }]);
          } });
      }
      draw();
    }
  });

  /* ----- consult room + Rx ----- */
  var MEDS = [
    { id: "mnx", name: "Minoxidil 5% topical, twice daily", price: 799 },
    { id: "bio", name: "Biotin 10,000 mcg + zinc, once daily", price: 649 },
    { id: "ket", name: "Ketoconazole 2% shampoo, twice weekly", price: 449 },
    { id: "dht", name: "DHT-Defence serum, at night", price: 1199 },
    { id: "fin", name: "Finasteride 1 mg, once daily (Rx, men only)", price: 560 }
  ];
  M("Doctor", "consult", "Consult room", "phone", {
    type: "custom",
    render: function (host, ctx) {
      var y = Y(ctx), d = ctx.data, live = false, sel = {};
      function active() { return y.bookings.filter(function (b) { return b.id === y.activeId; })[0] || y.bookings[0]; }
      var root = h("div", {});
      host.appendChild(root);
      function draw() {
        root.textContent = "";
        var b = active();
        var pick = h("select", { class: "yh-sel", "aria-label": "Patient", on: { change: function (e) { y.activeId = e.target.value; sel = {}; draw(); } } },
          y.bookings.map(function (x) { return h("option", { value: x.id }, x.name + " · " + x.date + " " + x.time + " · " + x.status); }));
        pick.value = b.id;
        root.appendChild(h("div", { class: "yh-row", style: { marginBottom: "12px" } }, h("div", { style: { minWidth: "280px", flex: "1" } }, lab("Patient in consult", pick)), statusPill(b.status)));
        var video = h("div", { class: "yh-video", "data-video": live ? "live" : "waiting" },
          h("div", {}, live ? h("b", {}, h("span", { class: "yh-live" }), "Live - " + b.name) : h("b", {}, "Waiting room"), h("small", {}, live ? "Video consult in progress (placeholder)" : b.name + " joins at " + b.time)),
          h("div", { class: "yh-self" }, "You"));
        var intake = card("Intake summary", dl([["Patient", b.name + ", " + b.age], ["Phone", b.phone], ["AI scan", b.scan.label + " · density " + b.scan.density + "% · " + (b.scan.zone || "")], ["Goal", b.goal || "Stop hair fall"], ["History", b.history || "None noted"], ["Paid", inr(b.paid) + " consult fee"]]));
        var rxBody = h("div", { class: "yh-rx" });
        MEDS.forEach(function (m) {
          rxBody.appendChild(h("label", { class: "yh-chk" }, h("input", { type: "checkbox", "data-med": m.id, checked: sel[m.id] ? "" : null, on: { change: function (e) { sel[m.id] = e.target.checked; } } }), h("span", {}, m.name)));
        });
        var months = h("select", { class: "yh-sel", "aria-label": "Duration" }, [3, 6].map(function (n) { return h("option", { value: String(n) }, n + " months"); }));
        var notes = h("textarea", { class: "yh-ta", rows: "3", "aria-label": "Notes", placeholder: "Notes to patient: avoid hot showers, take photos monthly..." });
        rxBody.appendChild(h("div", { class: "yh-gap" }, lab("Duration", months)));
        rxBody.appendChild(h("div", { class: "yh-gap" }, lab("Notes", notes)));
        var done = b.status === "Plan sent";
        rxBody.appendChild(h("div", { class: "yh-row yh-gap" },
          btn(done ? "Plan sent" : "Send plan", function () {
            var meds = MEDS.filter(function (m) { return sel[m.id]; });
            if (!meds.length) { AX.ui.toast("Select at least one item for the prescription", { kind: "err" }); return; }
            sendPlan(ctx, b, meds, +months.value, notes.value);
            draw();
          }, "primary", { disabled: done ? "" : null, "data-send-plan": "" }),
          done ? pill("Plan delivered via WhatsApp and the patient account", "good") : null));
        var left = h("div", { style: { display: "grid", gap: "16px" } }, card("Video consult", h("div", {}, video, h("div", { class: "yh-row yh-gap" }, btn(live ? "End call" : "Join video", function () { live = !live; draw(); }, live ? "" : "primary", { "data-join": "" }), btn("Mute", function (e) { e.target.textContent = e.target.textContent === "Mute" ? "Unmute" : "Mute"; }, "sm"), btn("Camera", function (e) { e.target.textContent = e.target.textContent === "Camera" ? "Camera off" : "Camera"; }, "sm")))), intake);
        root.appendChild(h("div", { class: "yh-grid2" }, left, card("Prescription (Rx)", rxBody)));
      }
      draw();
    }
  });
  function sendPlan(ctx, b, meds, months, notes) {
    var y = Y(ctx), d = ctx.data;
    var kit = months === 6 ? "Regrowth Kit - 6 months" : "Starter Kit - 3 months";
    var amount = months === 6 ? 5999 : 3299;
    b.status = "Plan sent";
    b.plan = { meds: meds.map(function (m) { return m.name.split(",")[0]; }), months: months, kit: kit, notes: notes };
    var lead = y.leads.filter(function (l) { return l.bookingId === b.id; })[0];
    if (lead) { lead.col = "plan"; lead.meta = "Plan sent: " + kit; }
    else y.leads.unshift({ id: "YL-n" + (++seq), col: "plan", title: b.name, sub: "Consult · " + b.phone, meta: "Plan sent: " + kit, tags: ["Hot"], bookingId: b.id });
    if (!y.patients.some(function (p) { return p.bookingId === b.id; })) {
      y.patients.unshift({ id: "PT-n" + (++seq), bookingId: b.id, name: b.name, phone: b.phone, age: b.age, city: "Delhi", stage: b.scan.label, density: b.scan.density, plan: kit, since: d.today, goal: b.goal, history: b.history });
    }
    y.followups.unshift({ id: "FU-n" + (++seq), patient: b.name, type: "Day 7 check-in", due: d.today, channel: "WhatsApp", status: "Scheduled", owner: d.doctor.name });
    y.followups.unshift({ id: "FU-n" + (++seq), patient: b.name, type: "Month 1 photo review", due: d.today, channel: "Video", status: "Scheduled", owner: d.doctor.name });
    y.orders.unshift({ id: "YO-n" + (++seq), customer: b.name, item: kit, amount: amount, date: d.today, status: "Awaiting payment", pay: "UPI" });
    audit(ctx, "Prescription signed and plan sent", b.id);
    sim("Simulated — plan WhatsApp not sent, no order charged");
  }

  /* ----- patients, follow-ups ----- */
  M("Doctor", "patients", "Patients", "users", {
    type: "custom",
    render: function (host, ctx) {
      var y = Y(ctx);
      AX.table.create(host, { columns: [{ key: "id", label: "ID", sortable: true }, { key: "name", label: "Patient", sortable: true }, { key: "age", label: "Age", sortable: true }, { key: "stage", label: "Stage" }, { key: "density", label: "Density", sortable: true, render: function (r) { return r.density + "%"; } }, { key: "plan", label: "Plan" }, { key: "since", label: "Since", sortable: true }],
        rows: y.patients, qKeys: ["name", "id", "plan"], filters: [{ key: "plan", label: "plan", options: ["Starter 3-month", "Regrowth 6-month", "Maintenance", "Advanced 6-month"] }], pageSize: 10,
        onRow: function (r) { drawer(r.name, dl([["Patient ID", r.id], ["Phone", r.phone], ["Age", r.age], ["City", r.city], ["Scan stage", r.stage + " · density " + r.density + "%"], ["Plan", r.plan], ["Goal", r.goal], ["History", r.history], ["Since", r.since]]), [{ label: "Message on WhatsApp", onClick: function () { sim("Simulated — WhatsApp message not sent"); } }]); } });
    }
  });
  M("Doctor", "followups", "Follow-ups", "bell", {
    type: "custom",
    render: function (host, ctx) {
      var y = Y(ctx), tbl;
      function rows() { return y.followups.map(function (r) { return Object.assign({ name: r.type }, r); }); }
      tbl = AX.table.create(host, { columns: [{ key: "patient", label: "Patient", sortable: true }, { key: "type", label: "Follow-up", sortable: true }, { key: "due", label: "Due", sortable: true }, { key: "channel", label: "Channel" }, { key: "status", label: "Status", render: function (r) { return statusPill(r.status); } }],
        rows: rows(), qKeys: ["patient", "type"], filters: [{ key: "status", label: "status", options: ["Scheduled", "Done", "Overdue"] }, { key: "channel", label: "channel", options: ["WhatsApp", "Call", "Video"] }], pageSize: 10,
        actions: [{ label: "Mark done", onClick: function (r) { var f = y.followups.filter(function (x) { return x.id === r.id; })[0]; f.status = "Done"; tbl.setRows(rows()); sim("Simulated — follow-up closed, patient thanked on WhatsApp"); } }],
        onRow: function (r) { drawer(r.type, dl([["Patient", r.patient], ["Due", r.due], ["Channel", r.channel], ["Owner", r.owner], ["Status", r.status]])); } });
    }
  });

  /* ----- revenue ----- */
  M("Doctor", "revenue", "Revenue", "chart", function (ctx) {
    var r = ctx.data.revenue, y = Y(ctx), extra = y.bookings.filter(function (b) { return !b.seed; }).length;
    var consultNow = r.consults[5] + extra, shopNow = r.shopRev[5];
    return { type: "dashboard",
      kpis: [{ label: "Consults this month", value: consultNow, delta: 12 }, { label: "Consult revenue", value: consultNow * 500, format: "inr", delta: 12 }, { label: "Shop revenue", value: "₹" + (shopNow / 100000).toFixed(2) + " L", delta: 8 }, { label: "Plans sent", value: 41 + y.bookings.filter(function (b) { return b.plan; }).length, delta: 5 }],
      charts: [
        { type: "line", title: "Consults per month", labels: r.months, series: [{ name: "Consults", points: r.consults }] },
        { type: "bar", title: "Shop revenue by month (₹)", labels: r.months, values: r.shopRev },
        { type: "donut", title: "Revenue mix", parts: [{ label: "Video consults", value: consultNow * 500 }, { label: "Treatment kits", value: Math.round(shopNow * 0.62) }, { label: "Supplements", value: Math.round(shopNow * 0.24) }, { label: "Devices", value: Math.round(shopNow * 0.14) }] }
      ] };
  });

  /* ----- sales CRM ----- */
  var SCOLS = [{ id: "new", label: "New", tone: "hot" }, { id: "booked", label: "Consult booked" }, { id: "done", label: "Consult done" }, { id: "plan", label: "Plan sent" }, { id: "bought", label: "Purchased", tone: "good" }, { id: "lost", label: "Lost", tone: "bad" }];
  M("Sales", "sales-leads", "Sales leads", "board", {
    type: "custom",
    render: function (host, ctx) {
      var y = Y(ctx), board;
      function cards() { return y.leads.map(function (l) { return Object.assign({}, l); }); }
      board = AX.board.create(host, { columns: SCOLS, cards: cards(),
        onMove: function (card, col) {
          var l = y.leads.filter(function (x) { return x.id === card.id; })[0];
          if (l) { l.col = col; audit(ctx, "Lead moved to " + col, l.id); }
          sim("Simulated — lead stage updated, no message sent");
        },
        onOpen: function (c) { drawer(c.title, dl([["Lead", c.id], ["Source", c.sub], ["Note", c.meta], ["Stage", c.col]]), [{ label: "Call", primary: true, onClick: function () { sim("Simulated — call not placed"); } }]); } });
    }
  });

  /* ----- care pipeline (refill WhatsApp sequence) ----- */
  M("Sales", "care", "Refill care sequence", "pipeline", function (ctx) {
    return { type: "pipeline", currency: "₹", gate: "d28", stages: ctx.data.care.map(function (s) { return { id: s.id, label: s.label, ms: 800, log: ["WhatsApp template queued: " + s.id.toUpperCase()] }; }) };
  });

  /* ----- admin ----- */
  M("Admin", "guarantee", "Guarantee tracker", "star", {
    type: "custom",
    render: function (host, ctx) {
      var y = Y(ctx), d = ctx.data;
      var rows = d.guarantee.map(function (g) { return Object.assign({ name: g.patient }, g); });
      y.bookings.filter(function (b) { return b.plan; }).forEach(function (b, i) { rows.unshift({ id: "GR-n" + i, name: b.name, patient: b.name, plan: b.plan.kit, start: d.today, day: 1, photos: "0/3", adherence: 100, status: "On track" }); });
      AX.table.create(host, { columns: [{ key: "patient", label: "Patient", sortable: true }, { key: "plan", label: "Plan" }, { key: "start", label: "Started", sortable: true }, { key: "day", label: "Day (of 180)", sortable: true }, { key: "photos", label: "Photo check-ins" }, { key: "adherence", label: "Adherence", sortable: true, render: function (r) { return r.adherence + "%"; } }, { key: "status", label: "Status", render: function (r) { return statusPill(r.status); } }],
        rows: rows, qKeys: ["patient", "plan"], filters: [{ key: "status", label: "status", options: ["On track", "At risk", "Claim review"] }], pageSize: 10,
        actions: [{ label: "Send nudge", onClick: function () { sim("Simulated — photo reminder WhatsApp not sent"); } }],
        onRow: function (r) { drawer(r.patient, dl([["Plan", r.plan], ["Started", r.start], ["Day", r.day + " of 180"], ["Photo check-ins", r.photos], ["Adherence", r.adherence + "%"], ["Status", r.status], ["Rule", "Refund if no visible improvement at day 180 and adherence is 80% or more"]])); } });
    }
  });
  M("Admin", "admin-orders", "Orders", "cart", {
    type: "custom",
    render: function (host, ctx) {
      var y = Y(ctx), tbl;
      function rows() { return y.orders.map(function (r) { return Object.assign({ name: r.id }, r); }); }
      tbl = AX.table.create(host, { columns: [{ key: "id", label: "Order", sortable: true }, { key: "customer", label: "Customer", sortable: true }, { key: "item", label: "Item" }, { key: "amount", label: "Amount", sortable: true, render: function (r) { return inr(r.amount); } }, { key: "date", label: "Date", sortable: true }, { key: "pay", label: "Pay" }, { key: "status", label: "Status", render: function (r) { return statusPill(r.status); } }],
        rows: rows(), qKeys: ["id", "customer", "item"], filters: [{ key: "status", label: "status", options: ["Awaiting payment", "Paid", "Packed", "Shipped", "Delivered"] }], pageSize: 10,
        actions: [{ label: "Advance", onClick: function (r) {
          var flow = ["Awaiting payment", "Paid", "Packed", "Shipped", "Delivered"], o = y.orders.filter(function (x) { return x.id === r.id; })[0], i = flow.indexOf(o.status);
          if (i >= 0 && i < flow.length - 1) { o.status = flow[i + 1]; audit(ctx, "Order marked " + o.status.toLowerCase(), o.id); tbl.setRows(rows()); sim("Simulated — customer notified on WhatsApp"); }
        } }],
        onRow: function (r) { drawer(r.id, dl([["Customer", r.customer], ["Item", r.item], ["Amount", inr(r.amount) + " incl. GST"], ["Payment", r.pay], ["Date", r.date], ["Status", r.status]])); } });
    }
  });
  M("Admin", "catalog", "Catalog", "box", function (ctx) {
    return { type: "table", rows: ctx.data.products.map(function (p) { return Object.assign({ discount: Math.round((1 - p.price / p.mrp) * 100) + "%", sku: "YHC-" + p.id.toUpperCase() }, p); }),
      columns: [{ key: "sku", label: "SKU" }, { key: "name", label: "Product", sortable: true }, { key: "cat", label: "Category" }, { key: "price", label: "Price", sortable: true, render: function (r) { return inr(r.price); } }, { key: "mrp", label: "MRP", render: function (r) { return inr(r.mrp); } }, { key: "discount", label: "Off" }],
      qKeys: ["name", "sku"], filters: [{ key: "cat", label: "category", options: ["Treatment", "Supplements", "Care", "Devices", "Kits"] }], pageSize: 12,
      drawer: function (r) { return h("div", { class: "demo-scope", "data-slug": SLUG }, dl([["SKU", r.sku], ["Category", r.cat], ["Price", inr(r.price)], ["MRP", inr(r.mrp)], ["Tags", (r.tags || []).join(", ") || "None"]])); } };
  });
  M("Admin", "audit", "Audit log", "file", {
    type: "custom",
    render: function (host, ctx) {
      var y = Y(ctx);
      AX.table.create(host, { columns: [{ key: "at", label: "When", sortable: true }, { key: "user", label: "User", sortable: true }, { key: "action", label: "Action", sortable: true }, { key: "ref", label: "Reference" }],
        rows: y.audit.map(function (r) { return Object.assign({ name: r.action }, r); }), qKeys: ["user", "action", "ref"], pageSize: 12,
        onRow: function (r) { drawer(r.action, dl([["When", r.at], ["User", r.user], ["Reference", r.ref], ["IP", "10.0.0.x (masked)"]])); } });
    }
  });

  AX.demos[SLUG] = { brand: { name: "Your Hair Company", accent: ACCENT, logoText: "Y" }, start: "scan", modules: modules };
})(window);
