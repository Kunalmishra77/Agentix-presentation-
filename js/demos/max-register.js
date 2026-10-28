/* Max Register - Hindi-first, phone-first gym CRM demo (fictional members). */
(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.demos = AX.demos || {};
  var SLUG = "max-register";
  var DAY = 86400000;

  /* ---------- pure helpers ---------- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function parse(s) { var p = String(s).split("-"); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }
  function iso(ms) { var d = new Date(ms); return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()); }
  function addDays(s, n) { return iso(parse(s) + n * DAY); }
  function diff(a, b) { return Math.round((parse(a) - parse(b)) / DAY); }
  /** Indian financial year label for a date: 2026-10-27 -> "2026-27"; 2027-02-01 -> "2026-27". */
  function fy(dateIso) {
    var y = +dateIso.slice(0, 4), m = +dateIso.slice(5, 7), s = m >= 4 ? y : y - 1;
    return s + "-" + pad((s + 1) % 100);
  }
  function receiptNo(dateIso, seq) { return "MF/" + fy(dateIso) + "/" + ("000000" + seq).slice(-6); }
  AX.maxRegister = { fy: fy, receiptNo: receiptNo };

  /* ---------- styles ---------- */
  var CSS = [
    '.ax-app[data-slug="max-register"]{--orange:#D7261E;--mx:#D7261E;--mx-d:#a91a14;--mx-g:#1F9E5A;--mx-a:#E39A12}',
    '.ax-app[data-slug="max-register"] .ax-search{display:none}',
    '.ax-app[data-slug="max-register"] .ax-head{gap:8px;flex-wrap:nowrap}',
    '.ax-app[data-slug="max-register"] .ax-title{font-size:.95rem;line-height:1.25}',
    '.ax-app[data-slug="max-register"] .ax-menu-btn{font-size:0;padding:6px 12px}',
    '.ax-app[data-slug="max-register"] .ax-menu-btn::before{content:"\\2630";font-size:1.1rem}',
    '.ax-app[data-slug="max-register"] .ax-main{background:#FAF8F7}',
    '.ax-app[data-slug="max-register"] .ax-card,.ax-app[data-slug="max-register"] .mx-card{border-radius:14px}',
    '@media (min-width:768px){',
    '.ax-app[data-slug="max-register"]{grid-template-columns:minmax(0,1fr);width:392px;max-width:100%;height:calc(100vh - 200px);max-height:780px;min-height:560px;margin:0 auto;border:10px solid #151515;border-radius:42px;box-shadow:0 30px 70px rgba(7,20,37,.35),0 0 0 2px #444}',
    '.ax-app[data-slug="max-register"] .ax-menu-btn{display:inline-flex}',
    '.ax-app[data-slug="max-register"] .ax-head{padding:12px 14px}',
    '.ax-app[data-slug="max-register"] .ax-content{padding:14px}',
    '.ax-app[data-slug="max-register"] .ax-side{display:none;position:absolute;left:0;right:0;bottom:0;z-index:30;max-height:75%;border-right:0;border-top:1px solid var(--ax-line);border-radius:20px 20px 0 0;box-shadow:var(--shadow-3)}',
    '.ax-app[data-slug="max-register"].sheet-open .ax-side{display:flex}',
    '.ax-app[data-slug="max-register"].sheet-open .ax-scrim{display:block;position:absolute;inset:0;z-index:20;background:rgba(7,20,37,.4)}',
    '}',
    '.mx-card{background:#fff;border:1px solid var(--ax-line);border-radius:14px;padding:14px;min-width:0}',
    '.mx-card h3{margin:0 0 10px;font:600 .875rem var(--font-display);color:var(--ink-2)}',
    '.mx-tiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}',
    '.mx-tile{appearance:none;text-align:left;background:#fff;border:1px solid var(--ax-line);border-left:5px solid var(--mx);border-radius:14px;padding:12px;cursor:pointer;font-family:inherit;color:var(--ink)}',
    '.mx-tile.g{border-left-color:var(--mx-g)}.mx-tile.a{border-left-color:var(--mx-a)}.mx-tile.k{border-left-color:#333}',
    '.mx-tile b{display:block;font:700 1.55rem var(--font-display);line-height:1.1}.mx-tile span{font-size:.75rem;color:var(--ink-3)}.mx-tile small{display:block;font-size:.68rem;color:var(--ink-3);margin-top:2px}',
    '.mx-btn{appearance:none;font:600 .8125rem var(--font-body);padding:9px 16px;border-radius:999px;border:1px solid var(--ax-line);background:#fff;color:var(--ink);cursor:pointer}',
    '.mx-btn.primary{background:var(--mx);border-color:var(--mx);color:#fff}.mx-btn.sm{padding:5px 11px;font-size:.75rem}.mx-btn.ok{background:var(--mx-g);border-color:var(--mx-g);color:#fff}',
    '.mx-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}',
    '.mx-av{display:inline-grid;place-items:center;width:36px;height:36px;border-radius:50%;color:#fff;font:700 .8rem var(--font-display);flex:none}',
    '.mx-av.lg{width:56px;height:56px;font-size:1.1rem}',
    '.mx-who{display:flex;gap:10px;align-items:center;min-width:0}.mx-who b{display:block;font-size:.875rem}.mx-who small{color:var(--ink-3);font-size:.72rem}',
    '.mx-band{display:inline-flex;align-items:center;gap:6px;font:600 .75rem var(--font-body);white-space:nowrap}',
    '.mx-band i{display:inline-block;width:6px;height:26px;border-radius:3px;background:var(--mx-g)}',
    '.mx-band.amber i{background:var(--mx-a)}.mx-band.red i{background:var(--mx)}.mx-band.amber{color:#8a5a00}.mx-band.red{color:var(--mx-d)}.mx-band.green{color:#157a43}',
    '.mx-list{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}',
    '.mx-pick{appearance:none;width:100%;text-align:left;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px;border:1.5px solid var(--ax-line);border-radius:12px;background:#fff;cursor:pointer;font:inherit;color:inherit}',
    '.mx-pick:hover,.mx-pick.on{border-color:var(--mx)}.mx-pick.on{background:#FFF3F2}',
    '.mx-steps{display:flex;gap:6px;margin-bottom:12px}.mx-steps span{flex:1;height:5px;border-radius:3px;background:#e6dfdd}.mx-steps span.on{background:var(--mx)}',
    '.mx-plans{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}',
    '.mx-plan{appearance:none;text-align:center;padding:14px 8px;border:1.5px solid var(--ax-line);border-radius:14px;background:#fff;cursor:pointer;font:inherit;color:inherit}.mx-plan:hover{border-color:var(--mx)}.mx-plan b{display:block;font:700 1.1rem var(--font-display)}.mx-plan span{font-size:.75rem;color:var(--ink-3)}',
    '.mx-receipt{background:#fff;border:1px dashed #999;border-radius:12px;padding:16px;font-size:.85rem}.mx-receipt h4{margin:0 0 4px;font:700 1rem var(--font-display);color:var(--mx-d)}',
    '.mx-receipt .no{font:600 .9rem var(--font-mono);letter-spacing:.02em}',
    '.mx-in,.mx-sel{font:400 .875rem var(--font-body);padding:9px 10px;border:1px solid var(--ax-line);border-radius:10px;background:#fff;color:var(--ink);min-width:0;max-width:100%}',
    '.mx-lab{display:flex;flex-direction:column;gap:4px;font:500 .72rem var(--font-mono);color:var(--ink-3)}',
    '.mx-dl{display:grid;grid-template-columns:110px 1fr;gap:6px 10px;margin:0;font-size:.85rem}.mx-dl dt{color:var(--ink-3)}.mx-dl dd{margin:0;font-weight:500}',
    '.mx-sec{margin:16px 0 6px;font:600 .72rem var(--font-mono);text-transform:uppercase;letter-spacing:.06em;color:var(--ink-3)}',
    '.mx-cal{display:grid;grid-template-columns:repeat(10,1fr);gap:4px}.mx-cal i{aspect-ratio:1;border-radius:4px;background:#ece7e5}.mx-cal i.on{background:var(--mx-g)}',
    '.mx-wa{background:#E7F7D9;border-radius:12px 12px 12px 2px;padding:10px 12px;font-size:.85rem;max-width:92%;white-space:pre-wrap}',
    '.mx-rem{display:flex;gap:10px;margin-bottom:12px;opacity:.5}.mx-rem.sent{opacity:1}.mx-rem .dot{width:12px;height:12px;border-radius:50%;background:#bbb;margin-top:6px;flex:none}.mx-rem.sent .dot{background:var(--mx-g)}',
    '.mx-rem small{color:var(--ink-3);font-size:.7rem;display:block;margin-bottom:3px}',
    '.mx-cam{position:relative;height:250px;border-radius:18px;background:radial-gradient(circle at 50% 40%,#2d2d2d,#0c0c0c);overflow:hidden;display:grid;place-items:center}',
    '.mx-cam svg{width:150px;height:190px;opacity:.75}',
    '.mx-scan{position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,transparent,#5BFFA0,transparent);box-shadow:0 0 14px #5BFFA0;display:none}',
    '.mx-cam.scanning .mx-scan{display:block}',
    '@media (prefers-reduced-motion:no-preference){.mx-cam.scanning .mx-scan{animation:mxscan 1.1s ease-in-out infinite alternate}@keyframes mxscan{from{top:8%}to{top:92%}}}',
    '.mx-result{border-radius:14px;padding:16px;text-align:center;margin-top:12px}.mx-result.good{background:#E3F3E7;color:#15683a}.mx-result.warn{background:#FFF0D1;color:#8a5a00}.mx-result.bad{background:#FBE1DE;color:#a91a14;border:2px solid var(--mx)}',
    '.mx-result b{display:block;font:700 1.1rem var(--font-display)}',
    '.mx-selfie{width:84px;height:84px;border-radius:12px;background:linear-gradient(160deg,#cfc6c3,#9d918d);display:grid;place-items:center;flex:none}',
    '.mx-gal{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.mx-tileimg{appearance:none;border:0;border-radius:14px;height:110px;color:#fff;font:600 .8rem var(--font-body);display:flex;align-items:flex-end;padding:10px;text-align:left;cursor:pointer}',
    '.mx-ann{border-left:4px solid var(--mx);padding:8px 10px;background:#fff;border-radius:0 10px 10px 0;margin-bottom:8px;font-size:.85rem}',
    '.ax-app[data-slug="max-register"] .bd{overflow-x:auto}',
    '.ax-app[data-slug="max-register"] .tbl td,.ax-app[data-slug="max-register"] .tbl th{padding:9px 8px}'
  ].join("\n");
  try {
    if (typeof document !== "undefined" && document.head && !(document.getElementById && document.getElementById("mx-css"))) {
      var st = document.createElement("style"); st.id = "mx-css"; st.textContent = CSS; document.head.appendChild(st);
    }
  } catch (e) { /* non-DOM loader */ }

  /* ---------- DOM helpers ---------- */
  function h() { return AX.el.apply(null, arguments); }
  function btn(label, fn, cls) { return h("button", { type: "button", class: "mx-btn " + (cls || ""), on: { click: fn } }, label); }
  function inr(n) { return AX.fmt.inr(Math.round(n)); }
  function sim(text) { AX.ui.toast(text || AX.ui.SIM_DEFAULT, { kind: "sim" }); }
  function card(title, body) { return h("section", { class: "mx-card" }, title ? h("h3", {}, title) : null, body); }
  function lab(text, input) { return h("label", { class: "mx-lab" }, text, input); }
  function sel(options, value, onChange) {
    var s = h("select", { class: "mx-sel" }, options.map(function (o) { var v = typeof o === "object" ? o.value : o, l = typeof o === "object" ? o.label : o; return h("option", { value: v }, l); }));
    if (value != null) s.value = value;
    if (onChange) s.addEventListener("change", function () { onChange(s.value); });
    return s;
  }
  var COLORS = ["#D7261E", "#1F6B6B", "#B8873A", "#3B3B98", "#C2457A", "#2A7A4B", "#7A4E2D", "#4B5D7A"];
  function avatar(name, big) {
    var hsh = 0; for (var i = 0; i < name.length; i++) hsh = (hsh * 31 + name.charCodeAt(i)) >>> 0;
    var parts = name.split(" ");
    return h("span", { class: "mx-av" + (big ? " lg" : ""), style: { background: COLORS[hsh % COLORS.length] }, "aria-hidden": "true" }, (parts[0][0] || "") + ((parts[1] || "")[0] || ""));
  }
  function dl(pairs) {
    var d = h("dl", { class: "mx-dl" });
    pairs.forEach(function (p) { d.appendChild(h("dt", {}, p[0])); d.appendChild(h("dd", {}, p[1] == null ? "" : p[1])); });
    return d;
  }
  function reduced() { try { return !!(w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch (e) { return false; } }

  /* ---------- session state ---------- */
  function S(ctx) {
    if (!ctx.state.get().mx) {
      var d = ctx.data;
      ctx.state.set({ mx: {
        members: d.members.map(function (m) { return Object.assign({}, m, { att: m.att.slice(), pays: m.pays.slice() }); }),
        present: {}, verify: d.verify.slice(), receiptSeq: 123, extraRevenue: 0, renewals: 0, audit: [], announcements: d.announcements.slice(), rem: { day: 0, id: null }, pickRenew: null, wished: {}, gallery: d.gallery.slice(), seq: 1 } });
    }
    return ctx.state.get().mx;
  }
  function logAudit(ctx, action, ref) {
    S(ctx).audit.unshift({ id: "au-n" + Math.random().toString(36).slice(2, 7), at: ctx.data.today + " " + AX.fmt.time(new Date()), user: "Reception (demo)", action: action, ref: ref || "" });
  }
  function left(ctx, m) { return diff(m.paidTill, ctx.data.today); }
  function band(ctx, m) { var l = left(ctx, m); return l > 7 ? "green" : l >= 0 ? "amber" : "red"; }
  function bandText(ctx, m) {
    var l = left(ctx, m), t = ctx.t;
    if (l < 0) return t(-l + " days overdue", -l + " दिन से बाकी");
    if (l === 0) return t("Last day today", "आज आखिरी दिन");
    return t(l + " days left", l + " दिन बाकी");
  }
  function bandNode(ctx, m) { return h("span", { class: "mx-band " + band(ctx, m) }, h("i"), bandText(ctx, m)); }
  function who(m, sub) { return h("span", { class: "mx-who" }, avatar(m.name), h("span", {}, h("b", {}, m.name), h("small", {}, sub || m.phone))); }
  function memberById(ctx, id) { return S(ctx).members.filter(function (m) { return m.id === id; })[0]; }
  function cameToday(ctx, m) { return m.att.indexOf(0) >= 0 || !!S(ctx).present[m.id]; }

  /* ---------- member drawer ---------- */
  function memberDrawer(ctx, m) {
    var t = ctx.t, mx = S(ctx);
    m = memberById(ctx, m.id) || m;
    var cal = h("div", { class: "mx-cal", "aria-label": t("Attendance, last 30 days", "हाज़िरी, पिछले 30 दिन") });
    for (var d = 29; d >= 0; d--) cal.appendChild(h("i", { class: m.att.indexOf(d) >= 0 ? "on" : "", title: d + "d" }));
    var log = ctx.data.messages.filter(function (x) { return x.to === m.name; }).slice(0, 4);
    var body = h("div", {},
      h("div", { class: "mx-row" }, avatar(m.name, true), h("div", {}, h("b", {}, m.name), h("div", {}, bandNode(ctx, m)))),
      h("div", { class: "mx-sec" }, t("Profile", "प्रोफ़ाइल")),
      dl([[t("Member ID", "मेंबर कोड"), m.id], [t("Mobile", "मोबाइल"), m.phone], [t("Plan", "प्लान"), m.plan], [t("Paid till", "फ़ीस कब तक"), AX.fmt.date(m.paidTill, "long")], [t("Joined", "जॉइन किया"), AX.fmt.date(m.joined, "long")],
        [t("Slot", "कब आते हैं"), m.slot === "Morning" ? t("Morning", "सुबह") : m.slot === "Evening" ? t("Evening", "शाम") : t("Both", "दोनों")], [t("Birthday", "जन्मदिन"), AX.fmt.date(m.dob)]]),
      h("div", { class: "mx-sec" }, t("Plan history", "प्लान का इतिहास")),
      h("ul", { class: "mx-list" }, m.pays.map(function (p) { return h("li", {}, p.plan + " · " + AX.fmt.date(p.date, "long")); })),
      h("div", { class: "mx-sec" }, t("Payments", "पेमेंट")),
      h("ul", { class: "mx-list" }, m.pays.map(function (p) { return h("li", {}, inr(p.amount) + " · " + p.mode + " · ", h("span", { style: { fontFamily: "var(--font-mono)", fontSize: ".74rem" } }, p.receipt)); })),
      h("div", { class: "mx-sec" }, t("Attendance - last 30 days", "हाज़िरी - पिछले 30 दिन")), cal,
      h("div", { class: "mx-sec" }, t("Reminder log", "रिमाइंडर लॉग")),
      h("ul", { class: "mx-list" }, (log.length ? log : [{ template: "Welcome", at: AX.fmt.date(m.joined), status: "Read" }]).map(function (x) { return h("li", {}, x.template + " · " + x.status + " · " + x.at); })));
    var dr = AX.ui.drawer({ title: m.name, body: body, actions: [
      { label: t("Take fees", "फीस लें"), primary: true, onClick: function () { mx.pickRenew = m.id; dr.close(); ctx.open("renew"); } },
      { label: t("Call", "कॉल"), onClick: function () { sim(t("Simulated - call not placed", "डेमो - कॉल नहीं लगा")); } },
      { label: "WhatsApp", onClick: function () { sim("Simulated — WhatsApp message not sent"); } }] });
  }

  /* ========== MODULES ========== */
  function todayView(ctx) {
    return { type: "custom", render: function (host) {
      var t = ctx.t, mx = S(ctx), today = ctx.data.today, ms = mx.members;
      var active = ms.filter(function (m) { return left(ctx, m) >= 0; }).length;
      var came = ms.filter(function (m) { return cameToday(ctx, m); }).length;
      var week = ms.filter(function (m) { var l = left(ctx, m); return l >= 0 && l <= 7; });
      var over = ms.filter(function (m) { return left(ctx, m) < 0; }).length;
      var calls = ms.filter(function (m) { return left(ctx, m) <= 3; }).length;
      var bdays = ms.filter(function (m) { return m.dob.slice(5) === today.slice(5); });
      var money = 148500 + mx.extraRevenue;
      function tile(cls, big, label, sub, mod) {
        return h("button", { type: "button", class: "mx-tile " + cls, on: { click: function () { ctx.open(mod); } } }, h("b", {}, big), h("span", {}, label), sub ? h("small", {}, sub) : null);
      }
      host.appendChild(h("div", { class: "mx-card" }, h("div", { style: { font: "700 1.15rem var(--font-display)" } }, t("Namaste, Max Fitness", "नमस्ते, मैक्स फिटनेस")), h("small", { style: { color: "var(--ink-3)" } }, t("Today, ", "आज, ") + AX.fmt.date(today, "long"))));
      host.appendChild(h("div", { class: "mx-tiles", "data-tiles": "" },
        tile("g", String(active), t("Active members", "कुल मेंबर"), t("plan running", "जिनका प्लान चालू है"), "members"),
        tile("g", String(came), t("Came today", "आज आए"), null, "attendance"),
        tile("a", String(week.length), t("Fees due this week", "इस हफ्ते फीस"), inr(week.reduce(function (s, m) { return s + m.price; }, 0)) + t(" expected", " आएगा"), "renew"),
        tile("", String(over), t("Overdue", "फीस बाकी"), t("remind them", "याद दिलाएँ"), "members"),
        tile("a", String(calls), t("Calls to make", "आज के कॉल"), null, "calls"),
        tile("k", String(bdays.length), t("Birthdays today", "आज जन्मदिन"), null, "today"),
        tile("g", inr(money), t("Money this month", "इस महीने जमा"), null, "reports")));
      host.appendChild(card(t("Quick actions", "जल्दी करें"), h("div", { class: "mx-row" },
        btn(t("New member", "नया मेंबर"), function () { ctx.open("new-member"); }, "primary"), btn(t("Take fees", "फीस लें"), function () { ctx.open("renew"); }), btn(t("Mark attendance", "हाज़िरी लगाएँ"), function () { ctx.open("attendance"); }), btn(t("Verify QR members", "QR मेंबर जाँचें"), function () { ctx.open("verify"); }))));
      var counts = [];
      for (var d = 6; d >= 0; d--) counts.push(ms.filter(function (m) { return m.att.indexOf(d) >= 0; }).length);
      var slot = h("div", { class: "chart-slot" });
      host.appendChild(card(t("Last 7 days - members who came", "सात दिन में आना-जाना"), slot));
      AX.charts.bar(slot, { labels: counts.map(function (_, i) { return AX.fmt.date(addDays(today, i - 6)).slice(0, 2); }), values: counts });
      var bl = h("ul", { class: "mx-list" });
      if (!bdays.length) bl.appendChild(h("li", {}, t("No birthdays today", "आज कोई जन्मदिन नहीं")));
      bdays.forEach(function (m) {
        bl.appendChild(h("li", {}, who(m, t("Birthday today", "आज जन्मदिन")), btn(mx.wished[m.id] ? t("Wished", "बधाई भेजी") : t("Send wish", "बधाई भेजें"), function () { mx.wished[m.id] = 1; sim("Simulated — WhatsApp message not sent"); ctx.open("today"); }, "sm")));
      });
      host.appendChild(card(t("Birthdays", "आज जन्मदिन"), bl));
    } };
  }

  function membersView(ctx) {
    var t = ctx.t, mx = S(ctx);
    var G = t("Paid", "जमा"), A = t("Due soon", "जल्द"), R = t("Expired", "खत्म");
    var rows = mx.members.map(function (m) { var b = band(ctx, m); return Object.assign({}, m, { dl: left(ctx, m), band: b === "green" ? G : b === "amber" ? A : R }); });
    return { type: "table", pageSize: 10, qKeys: ["name", "phone", "id"], filters: [{ key: "band", label: t("fee", "फीस"), options: [G, A, R] }],
      sort: { key: "dl", dir: "asc" }, rows: rows,
      columns: [
        { key: "name", label: t("Member", "मेंबर"), sortable: true, render: function (r) { return who(r); } },
        { key: "dl", label: t("Fee", "फीस"), sortable: true, render: function (r) { return bandNode(ctx, r); } },
        { key: "plan", label: t("Plan", "प्लान") }],
      onRow: function (r) { memberDrawer(ctx, r); } };
  }

  function renewView(ctx) {
    return { type: "custom", render: function (host) {
      var t = ctx.t, mx = S(ctx), today = ctx.data.today;
      var st = { member: mx.pickRenew ? memberById(ctx, mx.pickRenew) : null, plan: null, q: "" };
      mx.pickRenew = null;
      var root = h("div", {}); host.appendChild(root);
      function steps(n) { return h("div", { class: "mx-steps" }, [1, 2, 3].map(function (i) { return h("span", { class: i <= n ? "on" : "" }); })); }
      function draw() {
        root.textContent = "";
        if (!st.member) {
          root.appendChild(steps(1));
          var q = h("input", { class: "mx-in", type: "search", placeholder: t("Search name or mobile", "नाम या नंबर खोजें"), "aria-label": "Search", value: st.q, style: { width: "100%", marginBottom: "10px" } });
          var list = h("ul", { class: "mx-list" });
          function fill() {
            list.textContent = "";
            mx.members.filter(function (m) { return !st.q || (m.name + m.phone + m.id).toLowerCase().indexOf(st.q.toLowerCase()) >= 0; }).sort(function (a, b) { return left(ctx, a) - left(ctx, b); }).slice(0, 12).forEach(function (m) {
              list.appendChild(h("li", {}, h("button", { type: "button", class: "mx-pick", "data-member": m.id, on: { click: function () { st.member = m; draw(); } } }, who(m), bandNode(ctx, m))));
            });
          }
          q.addEventListener("input", function () { st.q = q.value; fill(); });
          root.appendChild(card(t("1. Who is paying?", "1. किसकी फीस?"), h("div", {}, q, list))); fill();
        } else if (!st.plan) {
          root.appendChild(steps(2));
          root.appendChild(card(t("2. Choose plan", "2. प्लान चुनें"), h("div", {}, h("div", { class: "mx-row", style: { marginBottom: "10px" } }, who(st.member), bandNode(ctx, st.member)),
            h("div", { class: "mx-plans" }, ctx.data.plans.map(function (p) {
              return h("button", { type: "button", class: "mx-plan", "data-plan": p.id, on: { click: function () { st.plan = p; draw(); } } }, h("b", {}, inr(p.price)), h("span", {}, p.name));
            })), h("div", { style: { marginTop: "10px" } }, btn(t("Change member", "मेंबर बदलें"), function () { st.member = null; draw(); }, "sm")))));
        } else if (!st.done) {
          root.appendChild(steps(3));
          root.appendChild(card(t("3. How did they pay?", "3. पेमेंट कैसे हुआ?"), h("div", {}, h("p", { style: { margin: "0 0 10px" } }, st.member.name + " · " + st.plan.name + " · ", h("b", {}, inr(st.plan.price))),
            h("div", { class: "mx-plans" }, [["Cash", t("Cash", "नकद")], ["UPI", "UPI"], ["Card", t("Card", "कार्ड")]].map(function (md) {
              return h("button", { type: "button", class: "mx-plan", "data-mode": md[0], on: { click: function () { finish(md[0]); } } }, h("b", {}, md[1]));
            })))));
        } else {
          var r = st.done;
          root.appendChild(steps(3));
          root.appendChild(h("div", { class: "mx-receipt", "data-receipt": "", role: "status" }, h("h4", {}, "Max Fitness · " + t("Fee receipt", "फीस रसीद")),
            h("div", { class: "no", "data-receipt-no": "" }, r.no),
            dl([[t("Member", "मेंबर"), r.member.name], [t("Plan", "प्लान"), r.plan.name], [t("Amount", "रकम"), inr(r.plan.price)], [t("Mode", "तरीका"), r.mode], [t("Valid till", "फ़ीस कब तक"), AX.fmt.date(r.member.paidTill, "long")]]),
            h("div", { class: "mx-row", style: { marginTop: "12px" } }, btn(t("Send on WhatsApp", "WhatsApp पर भेजें"), function () { sim("Simulated — WhatsApp message not sent"); }, "primary sm"), btn(t("Take another", "अगली फीस लें"), function () { st = { member: null, plan: null, q: "" }; draw(); }, "sm"))));
        }
      }
      function finish(mode) {
        var m = st.member, p = st.plan;
        var base = left(ctx, m) > 0 ? m.paidTill : today;
        var newTill = addDays(base, p.months * 30);
        var no = receiptNo(today, mx.receiptSeq++);
        m.paidTill = newTill; m.plan = p.name; m.months = p.months; m.price = p.price;
        m.pays.unshift({ date: today, amount: p.price, mode: mode, receipt: no, plan: p.name });
        mx.extraRevenue += p.price; mx.renewals++;
        logAudit(ctx, "Fee collected", m.id + " " + no);
        sim("Simulated — payment not recorded, receipt not sent.");
        st.done = { no: no, member: m, plan: p, mode: mode }; draw();
      }
      draw();
    } };
  }

  function newMemberView(ctx) {
    var t = ctx.t, plans = ctx.data.plans;
    return { type: "form", submit: t("Add member", "मेंबर जोड़ें"),
      fields: [{ key: "name", label: t("Full name", "पूरा नाम") }, { key: "phone", label: t("Mobile number", "मोबाइल नंबर") },
        { key: "gender", label: t("Gender", "लिंग"), type: "select", options: [{ value: "M", label: t("Male", "पुरुष") }, { value: "F", label: t("Female", "महिला") }, { value: "O", label: t("Other", "अन्य") }] },
        { key: "dob", label: t("Date of birth", "जन्म तिथि"), type: "date" },
        { key: "plan", label: t("Plan", "प्लान"), type: "select", options: plans.map(function (p) { return { value: p.id, label: p.name + " · " + inr(p.price) }; }) },
        { key: "slot", label: t("Slot", "कब आते हैं"), type: "select", options: [{ value: "Morning", label: t("Morning", "सुबह") }, { value: "Evening", label: t("Evening", "शाम") }, { value: "Both", label: t("Both", "दोनों") }] },
        { key: "start", label: t("Start date", "शुरू होने की तारीख"), type: "date" }],
      onSubmit: function (v) {
        var mx = S(ctx);
        if (!v.name || !v.phone) { AX.ui.toast(t("Enter name and mobile", "नाम और मोबाइल डालें"), { kind: "err" }); return h("div", { class: "mx-card" }, t("Name and mobile are required.", "नाम और मोबाइल ज़रूरी हैं।")); }
        var p = plans.filter(function (x) { return x.id === v.plan; })[0], start = v.start || ctx.data.today;
        var m = { id: "MF-" + (1100 + mx.seq++), name: v.name, phone: v.phone, gender: v.gender, dob: v.dob || "1995-01-01", months: p.months, plan: p.name, price: p.price, paidTill: addDays(start, p.months * 30), joined: start, slot: v.slot, att: [], pays: [{ date: start, amount: p.price + p.joining, mode: "Cash", receipt: receiptNo(ctx.data.today, mx.receiptSeq++), plan: p.name }], diet: "Veg", goal: "General fitness", kg: 70 };
        mx.members.unshift(m); mx.extraRevenue += p.price + p.joining; logAudit(ctx, "Member added", m.id);
        return h("div", { class: "mx-card", role: "status", "data-new-member": "" }, who(m, m.id), h("p", {}, t("Added. Paid till ", "जोड़ दिया। फ़ीस ") + AX.fmt.date(m.paidTill, "long") + "."), btn(t("Open profile", "प्रोफ़ाइल खोलें"), function () { memberDrawer(ctx, m); }, "sm"));
      } };
  }

  function callsView(ctx) {
    var t = ctx.t, mx = S(ctx);
    var due = mx.members.filter(function (m) { return left(ctx, m) <= 3; }).sort(function (a, b) { return left(ctx, a) - left(ctx, b); });
    var cards = due.map(function (m, i) { return { id: "c-" + m.id, col: i % 5 === 3 ? "called" : i % 5 === 4 ? "promised" : "todo", title: m.name, sub: m.phone, meta: bandText(ctx, m), member: m.id }; });
    return { type: "board", columns: [{ id: "todo", label: t("Call today", "आज कॉल करें") }, { id: "called", label: t("Called", "कॉल किया") }, { id: "promised", label: t("Will pay", "फीस देंगे") }, { id: "noans", label: t("No answer", "नहीं उठाया") }],
      cards: cards,
      renderCard: function (c) {
        var m = memberById(ctx, c.member);
        return [h("div", { class: "mx-who" }, avatar(c.title), h("span", {}, h("b", {}, c.title), h("small", {}, c.sub))), h("div", { style: { margin: "8px 0" } }, m ? bandNode(ctx, m) : c.meta),
          h("div", { class: "mx-row" }, btn(t("Call", "कॉल"), function () { sim(t("Simulated - call not placed", "डेमो - कॉल नहीं लगा")); }, "sm"), btn("WhatsApp", function () { sim("Simulated — WhatsApp message not sent"); }, "sm"))];
      },
      onMove: function (c, col) { AX.ui.toast(c.title + " → " + col, { kind: "ok" }); logAudit(ctx, "Call outcome logged", c.member); } };
  }

  function leadsView(ctx) {
    return { type: "custom", render: function (host) {
      var t = ctx.t, cards = ctx.data.leads.map(function (l) { return Object.assign({}, l); });
      var funnelHost = h("div", { class: "chart-slot", "data-funnel": "" });
      host.appendChild(card(t("Lead funnel", "लीड फ़नल"), funnelHost));
      var boardHost = h("div", {}); host.appendChild(boardHost);
      function counts() {
        var c = function (cols) { return cards.filter(function (x) { return cols.indexOf(x.col) >= 0; }).length; };
        return [{ label: t("Leads", "लीड"), value: cards.length }, { label: t("Called", "कॉल किया"), value: c(["called", "trial", "joined"]) }, { label: t("Trial", "ट्रायल"), value: c(["trial", "joined"]) }, { label: t("Joined", "जॉइन"), value: c(["joined"]) }];
      }
      function drawFunnel() { AX.charts.funnel(funnelHost, { steps: counts() }); }
      drawFunnel();
      AX.board.create(boardHost, { columns: [{ id: "new", label: t("New", "नया") }, { id: "called", label: t("Called", "कॉल किया") }, { id: "trial", label: t("Trial", "ट्रायल") }, { id: "joined", label: t("Joined", "जॉइन") }, { id: "lost", label: t("Lost", "गया") }], cards: cards,
        onMove: function (c, col) { cards = cards.map(function (x) { return x.id === c.id ? Object.assign({}, x, { col: col }) : x; }); drawFunnel(); AX.ui.toast(c.title + " → " + col, { kind: "ok" }); },
        onOpen: function (c) { AX.ui.drawer({ title: c.title, body: dl([[t("Source", "स्रोत"), c.sub], [t("Interest", "रुचि"), c.tags.join(", ")], [t("Note", "नोट"), c.meta]]), actions: [{ label: "WhatsApp", onClick: function () { sim("Simulated — WhatsApp message not sent"); } }] }); } });
    } };
  }

  function verifyView(ctx) {
    return { type: "custom", render: function (host) {
      var t = ctx.t, mx = S(ctx), box = h("div", { class: "mx-list", "data-verify": "" }); host.appendChild(box);
      function draw() {
        box.textContent = "";
        if (!mx.verify.length) { box.appendChild(card(null, h("p", { "data-verify-empty": "", style: { margin: 0 } }, t("All QR sign-ups checked. Nothing waiting.", "सब जाँच लिए। कुछ बाकी नहीं।")))); return; }
        box.appendChild(h("div", { class: "mx-sec" }, mx.verify.length + t(" waiting for review", " जाँच बाकी है")));
        mx.verify.forEach(function (v) {
          box.appendChild(h("section", { class: "mx-card", "data-vcard": v.id },
            h("div", { class: "mx-row", style: { flexWrap: "nowrap", alignItems: "flex-start" } },
              h("div", { class: "mx-selfie", "aria-label": t("Selfie placeholder", "सेल्फ़ी") }, h("div", { html: '<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#fff" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>' })),
              h("div", {}, h("b", {}, v.name), h("div", { style: { fontSize: ".78rem", color: "var(--ink-3)" } }, v.phone + " · " + v.via),
                h("div", { style: { fontSize: ".85rem", marginTop: "4px" } }, t("Declared: ", "बताया: ") + v.plan + " · " + t("started ", "शुरू ") + AX.fmt.date(v.declared, "long")))),
            h("div", { class: "mx-row", style: { marginTop: "10px" } },
              btn(t("Approve", "मंज़ूर"), function () { decide(v, "Approved"); }, "ok sm"), btn(t("Edit", "बदलें"), function () { editDate(v); }, "sm"), btn(t("Reject", "नामंज़ूर"), function () { decide(v, "Rejected"); }, "sm"))));
        });
      }
      function decide(v, what) {
        mx.verify = mx.verify.filter(function (x) { return x.id !== v.id; });
        logAudit(ctx, "Selfie " + what.toLowerCase(), v.id);
        if (what === "Approved") {
          var pl = ctx.data.plans.filter(function (p) { return p.name === v.plan; })[0] || ctx.data.plans[1];
          mx.members.unshift({ id: "MF-" + (1200 + mx.seq++), name: v.name, phone: v.phone, gender: "M", dob: "1994-06-15", months: pl.months, plan: pl.name, price: pl.price, paidTill: addDays(v.declared, pl.months * 30), joined: v.declared, slot: "Both", att: [], pays: [], diet: "Veg", goal: "General fitness", kg: 70 });
        }
        sim(t("Simulated - ", "डेमो - ") + what + " " + v.name); draw();
      }
      function editDate(v) {
        var inp = h("input", { class: "mx-in", type: "date", value: v.declared, "aria-label": "Start date" });
        var m = AX.ui.modal({ title: t("Edit start date", "शुरू की तारीख बदलें"), body: h("div", {}, lab(t("Start date", "तारीख"), inp)), actions: [{ label: t("Save", "सेव"), primary: true, onClick: function () { if (inp.value) v.declared = inp.value; m.close(); draw(); sim(); } }] });
      }
      draw();
    } };
  }

  function attendanceView(ctx) {
    return { type: "custom", render: function (host) {
      var t = ctx.t, mx = S(ctx), today = ctx.data.today;
      var top = h("div", {}); host.appendChild(top);
      function draw() {
        top.textContent = "";
        var here = mx.members.filter(function (m) { return cameToday(ctx, m); });
        var pick = sel(mx.members.filter(function (m) { return !cameToday(ctx, m) && left(ctx, m) >= 0; }).map(function (m) { return { value: m.id, label: m.name }; }));
        pick.setAttribute("aria-label", t("Member", "मेंबर"));
        top.appendChild(card(t("Mark attendance", "हाज़िरी लगाएँ"), h("div", { class: "mx-row" }, pick, btn(t("Mark present", "आज आए"), function () {
          if (!pick.value) return; mx.present[pick.value] = 1; logAudit(ctx, "Attendance marked", pick.value); AX.ui.toast(t("Marked present", "हाज़िरी लग गई"), { kind: "ok" }); draw();
        }, "primary"))));
        var ul = h("ul", { class: "mx-list", "data-here": String(here.length) });
        here.slice(0, 14).forEach(function (m, i) { ul.appendChild(h("li", {}, who(m, (mx.present[m.id] ? AX.fmt.time(new Date()) : (6 + (i % 4)) + ":" + pad((i * 17) % 60) + (i % 3 ? " AM" : " AM"))), bandNode(ctx, m))); });
        top.appendChild(h("div", { style: { marginTop: "12px" } }, card(t("Came today", "आज आए") + " (" + here.length + ")", ul)));
        var counts = [];
        for (var d = 6; d >= 0; d--) counts.push(mx.members.filter(function (m) { return m.att.indexOf(d) >= 0; }).length + (d === 0 ? Object.keys(mx.present).filter(function (id) { var mm = memberById(ctx, id); return mm && mm.att.indexOf(0) < 0; }).length : 0));
        var slot = h("div", { class: "chart-slot" });
        top.appendChild(h("div", { style: { marginTop: "12px" } }, card(t("This week", "इस हफ़्ते"), slot)));
        AX.charts.bar(slot, { labels: counts.map(function (_, i) { return AX.fmt.date(addDays(today, i - 6)).slice(0, 2); }), values: counts });
      }
      draw();
    } };
  }

  function kioskView(ctx) {
    return { type: "custom", render: function (host) {
      var t = ctx.t, mx = S(ctx);
      var opts = mx.members.slice(0, 14).sort(function (a, b) { return left(ctx, b) - left(ctx, a); });
      var pick = sel(opts.map(function (m) { return { value: m.id, label: m.name + " (" + left(ctx, m) + ")" }; }), mx.members[0].id);
      pick.setAttribute("aria-label", t("Who is at the door", "दरवाज़े पर कौन"));
      var cam = h("div", { class: "mx-cam", "data-cam": "" }, h("div", { html: '<svg viewBox="0 0 100 130" fill="none" stroke="#8fd" stroke-width="1.4"><ellipse cx="50" cy="62" rx="34" ry="46"/><path d="M14 20V8h12M86 20V8H74M14 110v12h12M86 110v12H74" stroke="#fff"/></svg>' }), h("div", { class: "mx-scan" }));
      var out = h("div", { "aria-live": "polite" });
      var go = btn(t("Scan face", "चेहरा स्कैन करें"), function () {
        out.textContent = ""; cam.classList.add("scanning"); go.disabled = true;
        setTimeout(function () {
          cam.classList.remove("scanning"); go.disabled = false;
          var m = memberById(ctx, pick.value), l = left(ctx, m), first = m.name.split(" ")[0];
          if (l >= 0) {
            mx.present[m.id] = 1;
            out.appendChild(h("div", { class: "mx-result " + (l <= 7 ? "warn" : "good"), "data-kiosk-result": "good" }, h("b", {}, t("Namaste, " + first + "! " + l + " days left", "नमस्ते, " + first + "! " + l + " दिन बाकी")), h("span", {}, t("Attendance marked", "हाज़िरी लग गई"))));
          } else {
            out.appendChild(h("div", { class: "mx-result bad", role: "alert", "data-kiosk-result": "expired" }, h("b", {}, t("Fees expired - " + first, "फीस खत्म - " + first)), h("span", {}, t(-l + " days overdue. Please see reception.", -l + " दिन से बाकी। रिसेप्शन पर मिलें।")),
              h("div", { style: { marginTop: "10px" } }, btn(t("Take fees", "फीस लें"), function () { mx.pickRenew = m.id; ctx.open("renew"); }, "primary sm"))));
          }
        }, reduced() ? 0 : 1200);
      }, "primary");
      go.setAttribute("data-kiosk-scan", "");
      host.appendChild(card(t("Face check-in kiosk", "चेहरे से हाज़िरी"), h("div", {}, cam, h("div", { class: "mx-row", style: { margin: "12px 0" } }, lab(t("Simulate who walks in", "कौन आया (डेमो)"), pick), go), out)));
    } };
  }

  var REM_SENT = { en: "Receipt for your last renewal has been sent.", hi: "आपकी पिछली फीस की रसीद भेज दी गई है।" };
  function remindersView(ctx) {
    return { type: "custom", render: function (host) {
      var t = ctx.t, mx = S(ctx), today = ctx.data.today;
      var pickId = mx.rem.id || mx.members[2].id;
      var root = h("div", {}); host.appendChild(root);
      function draw() {
        root.textContent = "";
        var m = memberById(ctx, pickId), l = left(ctx, m), first = m.name.split(" ")[0], day = mx.rem.day;
        var evs = [
          { s: -30, tag: t("Receipt", "रसीद"), text: t(REM_SENT.en, REM_SENT.hi) },
          { s: l - 7, tag: t("7 days before expiry", "फीस खत्म होने से 7 दिन पहले"), text: t("Namaste " + first + "! Your Max Fitness fees end on " + AX.fmt.date(m.paidTill) + " (7 days left). Pay at reception or on UPI.", "नमस्ते " + first + "! आपकी मैक्स फिटनेस की फीस " + AX.fmt.date(m.paidTill) + " को खत्म हो रही है (7 दिन बाकी)। रिसेप्शन पर या UPI से जमा करें।") },
          { s: l - 3, tag: t("Last 3 days", "आखिरी 3 दिन"), text: t(first + ", only 3 days left on your plan. Renew now so you don't miss a workout!", first + ", प्लान में सिर्फ़ 3 दिन बाकी हैं। अभी रिन्यू करें, वर्कआउट न छूटे!") },
          { s: l + 1, tag: t("After expiry", "फीस खत्म होने के बाद"), text: t(first + ", your fees expired yesterday. Renew today and keep your streak going.", first + ", आपकी फीस कल खत्म हो गई। आज रिन्यू करें और अपनी लय बनाए रखें।") }];
        var pickSel = sel(mx.members.slice(0, 12).map(function (x) { return { value: x.id, label: x.name + " (" + left(ctx, x) + ")" }; }), pickId, function (v) { pickId = v; mx.rem.id = v; mx.rem.day = 0; draw(); });
        pickSel.setAttribute("aria-label", t("Member", "मेंबर"));
        root.appendChild(card(t("WhatsApp reminders", "WhatsApp रिमाइंडर"), h("div", {},
          h("div", { class: "mx-row", style: { marginBottom: "12px" } }, lab(t("Member", "मेंबर"), pickSel), h("span", {}, bandNode(ctx, m))),
          h("div", { class: "mx-row", style: { marginBottom: "14px" } }, btn(t("Advance 1 day", "1 दिन आगे बढ़ाएँ"), function () { mx.rem.day++; AX.ui.toast(t("Day +" + mx.rem.day + " (" + AX.fmt.date(addDays(today, mx.rem.day)) + ")", "दिन +" + mx.rem.day + " (" + AX.fmt.date(addDays(today, mx.rem.day)) + ")"), { kind: "ok" }); draw(); }, "primary"),
            h("span", { "data-simday": String(day), style: { fontSize: ".8rem", color: "var(--ink-3)" } }, t("Simulated date: ", "डेमो की तारीख: ") + AX.fmt.date(addDays(today, day)) + " (+" + day + ")")),
          h("div", { "data-timeline": "" }, evs.map(function (e) {
            var sent = e.s <= day;
            return h("div", { class: "mx-rem" + (sent ? " sent" : ""), "data-rem": sent ? "sent" : "pending" }, h("span", { class: "dot" }),
              h("div", {}, h("small", {}, e.tag + " · " + (sent ? t("Sent", "भेजा गया") : t("Scheduled in " + (e.s - day) + " day(s)", (e.s - day) + " दिन में जाएगा"))), sent ? h("div", { class: "mx-wa" }, e.text) : null));
          })))));
      }
      draw();
    } };
  }

  function messagesView(ctx) {
    var t = ctx.t;
    return { type: "table", pageSize: 10, qKeys: ["to", "template"], filters: [{ key: "status", label: t("status", "स्थिति"), options: ["Read", "Delivered", "Sent", "Failed"] }],
      rows: ctx.data.messages,
      columns: [{ key: "to", label: t("To", "किसे"), sortable: true, render: function (r) { return h("span", {}, h("b", {}, r.to), h("br"), h("small", { style: { color: "var(--ink-3)" } }, r.template)); } }, { key: "status", label: t("Status", "स्थिति"), render: function (r) { return h("span", { class: "mx-band " + (r.status === "Failed" ? "red" : r.status === "Sent" ? "amber" : "green") }, h("i"), r.status); } },
        { key: "at", label: t("When", "कब"), sortable: true }],
      onRow: function (r) { AX.ui.drawer({ title: r.template, body: dl([[t("To", "किसे"), r.to], [t("Phone", "फोन"), r.phone], [t("Sent", "कब"), r.at], [t("Status", "स्थिति"), r.status]]), actions: [{ label: t("Resend", "दोबारा भेजें"), onClick: function () { sim("Simulated — WhatsApp message not sent"); } }] }); } };
  }

  function reportsView(ctx) {
    var t = ctx.t, mx = S(ctx), counts = {};
    mx.members.forEach(function (m) { counts[m.plan] = (counts[m.plan] || 0) + 1; });
    var lead = [{ label: t("Leads", "लीड"), value: 16 }, { label: t("Called", "कॉल किया"), value: 11 }, { label: t("Trial", "ट्रायल"), value: 7 }, { label: t("Joined", "जॉइन"), value: 4 }];
    return { type: "dashboard",
      kpis: [{ label: t("Active members", "कुल मेंबर"), value: mx.members.filter(function (m) { return left(ctx, m) >= 0; }).length, delta: 5 }, { label: t("Collected this month", "इस महीने जमा"), value: 148500 + mx.extraRevenue, format: "inr", delta: 8 },
        { label: t("Renewals", "रिन्यूअल"), value: 31 + mx.renewals }, { label: t("Retention", "रिटेंशन"), value: "78%", delta: 2 }],
      charts: [
        { type: "bar", title: t("Monthly collections (Rs)", "महीने की जमा रकम"), labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"], values: [118000, 126500, 121000, 139000, 144500, 148500 + mx.extraRevenue] },
        { type: "donut", title: t("Members by plan", "प्लान के हिसाब से"), parts: Object.keys(counts).map(function (k) { return { label: k, value: counts[k] }; }) },
        { type: "funnel", title: t("Lead funnel", "लीड फ़नल"), steps: lead },
        { type: "line", title: t("Daily check-ins - 14 days", "रोज़ की हाज़िरी - 14 दिन"), labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"], series: [{ name: t("Check-ins", "हाज़िरी"), points: AX.fake.series("mx-att", 14, 38, 74) }] }] };
  }

  function dietView(ctx) {
    var t = ctx.t, rows = S(ctx).members.map(function (m) { var kcal = m.goal === "Weight loss" ? 1700 : m.goal === "Muscle gain" ? 2800 : 2200; return Object.assign({}, m, { kcal: kcal, bmi: (m.kg / 2.9).toFixed(1) }); });
    return { type: "table", pageSize: 10, qKeys: ["name", "goal"], filters: [{ key: "diet", label: t("diet", "खाना"), options: ["Veg", "Non-veg", "Egg"] }, { key: "goal", label: t("goal", "लक्ष्य"), options: ["Weight loss", "Muscle gain", "Stamina", "General fitness"] }],
      rows: rows, columns: [{ key: "name", label: t("Member", "मेंबर"), sortable: true, render: function (r) { return who(r, r.goal); } }, { key: "diet", label: t("Diet", "खाना") }, { key: "kcal", label: "kcal", sortable: true }],
      onRow: function (r) {
        var veg = r.diet === "Veg";
        AX.ui.drawer({ title: t("Diet plan - ", "डाइट प्लान - ") + r.name, body: h("div", {}, dl([[t("Goal", "लक्ष्य"), r.goal], [t("Diet", "खाना"), r.diet], [t("Weight", "वज़न"), r.kg + " kg"], ["BMI", r.bmi], [t("Calories", "कैलोरी"), r.kcal + " kcal"]]),
          h("div", { class: "mx-sec" }, t("Sample day", "एक दिन का खाना")), h("ul", { class: "mx-list" }, [t("Breakfast: oats, banana, 4 egg whites", "नाश्ता: ओट्स, केला, " + (veg ? "पनीर भुर्जी" : "4 अंडे का सफ़ेद हिस्सा")), t("Lunch: 2 roti, dal, sabzi, curd", "दोपहर: 2 रोटी, दाल, सब्ज़ी, दही"), t("Snack: roasted chana, green tea", "शाम: भुना चना, ग्रीन टी"), t("Dinner: " + (veg ? "paneer" : "grilled chicken") + ", salad, 1 roti", "रात: " + (veg ? "पनीर" : "ग्रिल्ड चिकन") + ", सलाद, 1 रोटी")].map(function (x) { return h("li", {}, x); }))),
          actions: [{ label: t("Send plan on WhatsApp", "WhatsApp पर भेजें"), onClick: function () { sim("Simulated — WhatsApp message not sent"); } }] });
      } };
  }

  function botView(ctx) {
    return { type: "custom", render: function (host) {
      var t = ctx.t, m = S(ctx).members[0], l = left(ctx, m);
      var threads = [
        { id: "b1", name: t("My fees", "मेरी फीस"), channel: "whatsapp", messages: [{ from: "user", text: t("When do my fees end?", "मेरी फीस कब खत्म होगी?"), at: "9:02" }] },
        { id: "b2", name: t("Gym timings", "जिम का समय"), channel: "whatsapp", messages: [{ from: "user", text: t("What are the gym timings tomorrow?", "कल जिम कितने बजे खुलेगा?"), at: "8:15" }] },
        { id: "b3", name: t("Diet tip", "डाइट सलाह"), channel: "web", messages: [{ from: "user", text: t("Give me a protein tip for vegetarians.", "शाकाहारी के लिए प्रोटीन की सलाह दीजिए।"), at: "7:40" }] }];
      var scripts = {
        b1: [{ from: "ai", text: t("Namaste " + m.name.split(" ")[0] + "! Your fees are paid till " + AX.fmt.date(m.paidTill) + " (" + l + " days left). Want to renew now?", "नमस्ते " + m.name.split(" ")[0] + "! आपकी फीस " + AX.fmt.date(m.paidTill) + " तक जमा है (" + l + " दिन बाकी)। अभी रिन्यू करना है?"), chips: [t("Renew", "रिन्यू करें"), t("Later", "बाद में")] },
          { from: "ai", text: t("Done - I've asked reception to prepare your receipt.", "ठीक है - मैंने रिसेप्शन को रसीद बनाने के लिए कहा है।"), event: "renew" }],
        b2: [{ from: "ai", text: t("Max Fitness is open 5:30 AM - 10:30 AM and 4:30 PM - 10:30 PM. Closed on Diwali.", "मैक्स फिटनेस सुबह 5:30 से 10:30 और शाम 4:30 से रात 10:30 तक खुला रहता है। दिवाली पर बंद।") }],
        b3: [{ from: "ai", text: t("Paneer, soya chunks, sprouts and curd are great. Aim for 1.6 g protein per kg of body weight.", "पनीर, सोया चंक्स, स्प्राउट्स और दही बढ़िया हैं। शरीर के वज़न के हिसाब से 1.6 ग्राम प्रोटीन प्रति किलो लें।") }] };
      var c = AX.chat.create(host, { threads: threads, scripts: scripts, onEvent: function () { AX.ui.toast(t("Request sent to reception", "रिसेप्शन को भेज दिया"), { kind: "ok" }); } });
      host.addEventListener("click", function (e) { var th = e.target.closest && e.target.closest(".cht-thread"); if (th) c.play(th.getAttribute("data-id")); });
      c.play("b1");
    } };
  }

  function galleryView(ctx) {
    return { type: "custom", render: function (host) {
      var t = ctx.t, mx = S(ctx), grid = h("div", { class: "mx-gal", "data-gallery": "" });
      function draw() {
        grid.textContent = "";
        mx.gallery.forEach(function (g) {
          grid.appendChild(h("button", { type: "button", class: "mx-tileimg", style: { background: "linear-gradient(135deg," + g.c1 + "," + g.c2 + ")" }, on: { click: function () {
            var big = h("div", { class: "mx-tileimg", style: { background: "linear-gradient(135deg," + g.c1 + "," + g.c2 + ")", height: "240px", cursor: "default" } }, g.cap);
            var m = AX.ui.modal({ title: g.cap, body: big, actions: [{ label: t("Close", "बंद करें"), primary: true, onClick: function () { m.close(); } }] });
          } } }, g.cap));
        });
      }
      host.appendChild(card(t("Gym gallery", "जिम गैलरी"), h("div", {}, h("div", { class: "mx-row", style: { marginBottom: "12px" } }, btn(t("Upload photo", "फोटो जोड़ें"), function () {
        mx.gallery.unshift({ id: "gn" + Date.now(), cap: t("New photo " + (mx.gallery.length + 1), "नई फोटो " + (mx.gallery.length + 1)), c1: "#E8833A", c2: "#7a1411" }); sim(); draw();
      }, "primary sm")), grid)));
      draw();
    } };
  }

  function announcementsView(ctx) {
    return { type: "custom", render: function (host) {
      var t = ctx.t, mx = S(ctx), list = h("div", { "data-ann": "" });
      var title = h("input", { class: "mx-in", placeholder: t("Title", "शीर्षक"), "aria-label": "Title", style: { width: "100%" } }), body = h("textarea", { class: "mx-in", rows: "3", placeholder: t("Message to members", "मेंबर्स के लिए संदेश"), "aria-label": "Message", style: { width: "100%" } });
      var aud = sel([{ value: "All members", label: t("All members", "सभी मेंबर") }, { value: "Fees due", label: t("Fees due", "फीस बाकी") }, { value: "Morning slot", label: t("Morning slot", "सुबह वाले") }, { value: "Evening slot", label: t("Evening slot", "शाम वाले") }]);
      function draw() { list.textContent = ""; mx.announcements.forEach(function (a) { list.appendChild(h("div", { class: "mx-ann" }, h("b", {}, a.title), h("div", {}, a.body), h("small", { style: { color: "var(--ink-3)" } }, a.aud + " · " + AX.fmt.date(a.at)))); }); }
      host.appendChild(card(t("New announcement", "नई घोषणा"), h("div", { style: { display: "grid", gap: "10px" } }, title, body, lab(t("Send to", "किसे भेजें"), aud), h("div", {}, btn(t("Send to members", "मेंबर्स को भेजें"), function () {
        if (!title.value.trim()) { AX.ui.toast(t("Add a title", "शीर्षक डालें"), { kind: "err" }); return; }
        mx.announcements.unshift({ id: "an" + Date.now(), title: title.value.trim(), body: body.value.trim() || "-", aud: aud.value, at: ctx.data.today });
        title.value = ""; body.value = ""; sim("Simulated — WhatsApp message not sent"); draw();
      }, "primary")))));
      host.appendChild(h("div", { style: { marginTop: "12px" } }, card(t("Sent announcements", "भेजी गई घोषणाएँ"), list)));
      draw();
    } };
  }

  function plansView(ctx) {
    var t = ctx.t, mx = S(ctx);
    var rows = ctx.data.plans.map(function (p) { return Object.assign({}, p, { count: mx.members.filter(function (m) { return m.plan === p.name; }).length, perMonth: Math.round(p.price / p.months) }); });
    return { type: "table", pageSize: 8, rows: rows, qKeys: ["name"],
      columns: [{ key: "name", label: t("Plan", "प्लान"), sortable: true }, { key: "price", label: t("Price", "कीमत"), sortable: true, render: function (r) { return inr(r.price); } }, { key: "perMonth", label: t("Per month", "महीना"), render: function (r) { return inr(r.perMonth); } }, { key: "count", label: t("Members", "मेंबर"), sortable: true }],
      onRow: function (r) { AX.ui.drawer({ title: r.name, body: dl([[t("Duration", "अवधि"), r.months + t(" month(s)", " महीने")], [t("Price", "कीमत"), inr(r.price)], [t("Joining fee", "जॉइनिंग फीस"), inr(r.joining)], [t("Active members", "चालू मेंबर"), r.count]]), actions: [{ label: t("Edit price", "कीमत बदलें"), primary: true, onClick: function () { sim(); } }] }); } };
  }

  function auditView(ctx) {
    var t = ctx.t;
    return { type: "table", pageSize: 10, qKeys: ["user", "action", "ref"], filters: [{ key: "user", label: t("user", "यूज़र"), options: ["Owner", "Reception - Pooja", "Reception - Vikram", "Reception (demo)"] }],
      rows: S(ctx).audit.concat(ctx.data.audit),
      columns: [{ key: "action", label: t("Action", "काम"), sortable: true, render: function (r) { return h("span", {}, h("b", {}, r.action), h("br"), h("small", { style: { color: "var(--ink-3)" } }, r.user + " · " + r.ref)); } }, { key: "at", label: t("When", "कब"), sortable: true }],
      onRow: function (r) { AX.ui.drawer({ title: r.action, body: dl([[t("When", "कब"), r.at], [t("By", "किसने"), r.user], [t("Reference", "संदर्भ"), r.ref]]) }); } };
  }

  AX.demos[SLUG] = {
    brand: { name: "Max Register", accent: "#D7261E", logoText: "M" },
    start: "today",
    lang: { options: ["hi", "en"] },
    modules: [
      { id: "today", label: "आज · Today", icon: "home", group: "Home", view: todayView },
      { id: "members", label: "मेंबर · Members", icon: "users", group: "Members", view: membersView },
      { id: "renew", label: "फीस लें · Renew", icon: "wallet", group: "Members", view: renewView },
      { id: "new-member", label: "नया मेंबर · New member", icon: "form", group: "Members", view: newMemberView },
      { id: "calls", label: "कॉल · Calls", icon: "phone", group: "Follow-up", view: callsView },
      { id: "leads", label: "लीड · Leads", icon: "pipeline", group: "Follow-up", view: leadsView },
      { id: "verify", label: "जाँच · Verify", icon: "star", group: "Follow-up", view: verifyView },
      { id: "attendance", label: "हाज़िरी · Attendance", icon: "calendar", group: "Attendance", view: attendanceView },
      { id: "kiosk", label: "किओस्क · Kiosk", icon: "heart", group: "Attendance", view: kioskView },
      { id: "reminders", label: "रिमाइंडर · Reminders", icon: "bell", group: "Messages", view: remindersView },
      { id: "messages", label: "संदेश · Messages", icon: "mail", group: "Messages", view: messagesView },
      { id: "bot", label: "बॉट · Bot", icon: "chat", group: "Messages", view: botView },
      { id: "announcements", label: "घोषणा · Announcements", icon: "bell", group: "Messages", view: announcementsView },
      { id: "reports", label: "रिपोर्ट · Reports", icon: "chart", group: "Manage", view: reportsView },
      { id: "diet", label: "डाइट · Diet", icon: "heart", group: "Manage", view: dietView },
      { id: "gallery", label: "गैलरी · Gallery", icon: "box", group: "Manage", view: galleryView },
      { id: "plans", label: "प्लान · Plans", icon: "table", group: "Manage", view: plansView },
      { id: "audit", label: "ऑडिट · Audit", icon: "file", group: "Manage", view: auditView }
    ]
  };
})(window);
