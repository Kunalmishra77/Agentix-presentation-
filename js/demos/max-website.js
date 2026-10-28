(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.demos = AX.demos || {};
  if (typeof document === "undefined" || !document.getElementById) return;
  var el = AX.el, SLUG = "max-website", ACCENT = "#D7261E";

  var CSS = [
    '.mw-card{background:#fff;border:1px solid var(--ax-line);border-radius:14px;padding:20px;max-width:760px}',
    '.mw-card h3{margin:0 0 6px;font:700 18px var(--font-display)}.mw-card p{margin:0 0 12px;color:var(--ink-3);font-size:14px}',
    '.mw-qr{display:inline-block;padding:12px;background:#fff;border:2px solid #111;border-radius:10px}',
    '.mw-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:12px}',
    '.mw-btn{appearance:none;font:700 13px var(--font-body);padding:10px 20px;border-radius:999px;border:1px solid var(--ax-accent);background:var(--ax-accent);color:#fff;cursor:pointer}',
    '.mw-btn.ghost{background:#fff;color:var(--ax-accent)}',
    '.mw-choice{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:10px}',
    '.mw-pick{appearance:none;text-align:left;border:2px solid var(--ax-line);background:#fff;border-radius:14px;padding:18px;cursor:pointer;font:inherit;color:var(--ink)}',
    '.mw-pick:hover,.mw-pick:focus-visible{border-color:var(--ax-accent)}.mw-pick b{display:block;font:700 16px var(--font-display);margin-bottom:4px}',
    '.mw-pick[aria-pressed="true"]{border-color:var(--ax-accent);background:#FEF2F2}',
    '.mw-field{display:flex;flex-direction:column;gap:4px;margin-bottom:10px;font:600 12px var(--font-mono);color:var(--ink-3);text-transform:uppercase}',
    '.mw-field input,.mw-field select{padding:10px 12px;border:1px solid var(--ax-line);border-radius:8px;font:400 15px var(--font-body);text-transform:none;color:var(--ink)}',
    '.mw-id{background:linear-gradient(135deg,#111,#7F1D1D);color:#fff;border-radius:16px;padding:20px;max-width:340px}.mw-id small{color:#FCA5A5;font:600 11px var(--font-mono);text-transform:uppercase}.mw-id b{display:block;font:700 20px var(--font-display);margin:4px 0}',
    '.mw-steps{display:flex;gap:6px;margin-bottom:14px}.mw-steps i{flex:1;height:5px;border-radius:3px;background:#E5E7EB}.mw-steps i.on{background:var(--ax-accent)}'
  ].join("\n");
  function injectCss() {
    if (document.getElementById("mw-css")) return;
    var s = document.createElement("style"); s.id = "mw-css";
    s.textContent = CSS + '\n.ax-app[data-slug="' + SLUG + '"],.demo-scope[data-slug="' + SLUG + '"]{--orange:' + ACCENT + '}';
    document.head.appendChild(s);
  }
  injectCss();

  function site(host, ctx) {
    injectCss();
    AX.embed.create(host, AX.embed.optsForSlug(SLUG));
  }

  var NS = "http://www.w3.org/2000/svg";
  function qr() {
    var n = 25, cells = "", seed = "max-qr";
    function finder(x, y) { return (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7); }
    function inFinder(x, y) {
      var fx = x < 7 ? x : x - (n - 7), fy = y < 7 ? y : y - (n - 7);
      return fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4);
    }
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      var on = finder(x, y) ? inFinder(x, y) : AX.fake.int(seed + x + "-" + y, 0, 99) < 48;
      if (on) cells += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
    }
    return '<svg xmlns="' + NS + '" viewBox="-1 -1 ' + (n + 2) + " " + (n + 2) + '" width="180" height="180" fill="#111" shape-rendering="crispEdges" role="img" aria-label="Sample QR code">' + cells + "</svg>";
  }

  function join(host, ctx) {
    injectCss();
    var d = ctx.data, t = ctx.t, mode = null, step = 0;
    var root = el("div", { class: "mw-card", "data-step": "scan" });
    host.appendChild(root);
    function steps(n) { return el("div", { class: "mw-steps", "aria-hidden": "true" }, [0, 1, 2].map(function (i) { return el("i", { class: i <= n ? "on" : "" }); })); }
    function planName(p) { return ctx.lang === "hi" ? p.hi : p.en; }

    function restart() { return el("div", { class: "mw-row" }, el("button", { type: "button", class: "mw-btn ghost", "data-act": "restart", on: { click: scan } }, t("Start over", "फिर से शुरू करें"))); }
    function scan() {
      root.textContent = ""; root.setAttribute("data-step", "scan");
      root.appendChild(steps(0));
      root.appendChild(el("h3", {}, t("Scan the QR at the gym door", "जिम के दरवाज़े पर QR स्कैन करें")));
      root.appendChild(el("p", {}, t("Members and new joiners use the same code. Your phone opens the onboarding page.", "सदस्य और नए लोग एक ही कोड का उपयोग करते हैं।")));
      root.appendChild(el("div", { class: "mw-qr", html: qr() }));
      root.appendChild(el("div", { class: "mw-row" }, el("button", { type: "button", class: "mw-btn", "data-act": "scan", on: { click: choose } }, t("Simulate scan", "स्कैन करें"))));
    }
    function choose() {
      root.textContent = ""; root.setAttribute("data-step", "choose");
      root.appendChild(steps(1));
      root.appendChild(el("h3", {}, t("Welcome to Max Fitness", "मैक्स फिटनेस में आपका स्वागत है")));
      root.appendChild(el("p", {}, t("Are you already a member?", "क्या आप पहले से सदस्य हैं?")));
      root.appendChild(el("div", { class: "mw-choice" },
        el("button", { type: "button", class: "mw-pick", "data-mode": "existing", on: { click: function () { mode = "existing"; existing(); } } }, el("b", {}, t("I'm already a member", "मैं पहले से सदस्य हूँ")), el("span", {}, t("Check in, see your plan and renew", "चेक-इन करें, प्लान देखें और रिन्यू करें"))),
        el("button", { type: "button", class: "mw-pick", "data-mode": "new", on: { click: function () { mode = "new"; fresh(); } } }, el("b", {}, t("I'm new here", "मैं नया हूँ")), el("span", {}, t("Join in two minutes from your phone", "फ़ोन से दो मिनट में जुड़ें")))));
    }
    function existing() {
      root.textContent = ""; root.setAttribute("data-step", "existing");
      root.appendChild(steps(2));
      root.appendChild(el("h3", {}, t("Welcome back", "वापसी पर स्वागत है")));
      var sel = el("select", { "aria-label": t("Your member ID", "आपकी सदस्य आईडी") }, d.members.map(function (m) { return el("option", { value: m.id }, m.id + " · " + m.phone); }));
      var out = el("div", { "aria-live": "polite" });
      root.appendChild(el("label", { class: "mw-field" }, t("Your registered phone", "आपका पंजीकृत फ़ोन"), sel));
      root.appendChild(el("div", { class: "mw-row" }, el("button", { type: "button", class: "mw-btn", "data-act": "lookup", on: { click: function () {
        var m = d.members.filter(function (x) { return x.id === sel.value; })[0];
        out.textContent = "";
        out.appendChild(el("div", { class: "mw-id", "data-member": m.id },
          el("small", {}, t("Checked in", "चेक-इन हो गया")), el("b", {}, m.name), el("span", {}, m.plan + " · " + t("valid till ", "वैध: ") + m.expires), el("div", { style: { marginTop: "8px", fontSize: "13px" } }, m.visits + " " + t("visits so far", "विज़िट अब तक"))));
        out.appendChild(el("div", { class: "mw-row" }, el("button", { type: "button", class: "mw-btn ghost", on: { click: function () { AX.ui.toast("Simulated — renewal not charged", { kind: "sim" }); } } }, t("Renew plan", "प्लान रिन्यू करें"))));
        AX.ui.toast("Simulated — check-in not recorded", { kind: "sim" });
      } } }, t("Check in", "चेक-इन"))));
      root.appendChild(out);
      root.appendChild(restart());
    }
    function fresh() {
      root.textContent = ""; root.setAttribute("data-step", "new");
      root.appendChild(steps(2));
      root.appendChild(el("h3", {}, t("Join Max Fitness", "मैक्स फिटनेस से जुड़ें")));
      var name = el("input", { type: "text", "aria-label": t("Full name", "पूरा नाम"), placeholder: t("Full name", "पूरा नाम") });
      var phone = el("input", { type: "tel", "aria-label": t("Mobile number", "मोबाइल नंबर"), placeholder: "+91 98xxx x0000" });
      var chosen = d.plans[1].id;
      var picks = el("div", { class: "mw-choice" });
      function drawPicks() {
        picks.textContent = "";
        d.plans.forEach(function (p) { picks.appendChild(el("button", { type: "button", class: "mw-pick", "data-plan": p.id, "aria-pressed": String(p.id === chosen), on: { click: function () { chosen = p.id; drawPicks(); } } }, el("b", {}, planName(p)), el("span", {}, AX.fmt.inr(p.price)))); });
      }
      drawPicks();
      var out = el("div", { "aria-live": "polite" });
      root.appendChild(el("label", { class: "mw-field" }, t("Full name", "पूरा नाम"), name));
      root.appendChild(el("label", { class: "mw-field" }, t("Mobile number", "मोबाइल नंबर"), phone));
      root.appendChild(el("p", { class: "mw-field", style: { margin: "6px 0" } }, t("Choose a plan", "प्लान चुनें")));
      root.appendChild(picks);
      root.appendChild(el("div", { class: "mw-row" }, el("button", { type: "button", class: "mw-btn", "data-act": "pay", on: { click: function () {
        var p = d.plans.filter(function (x) { return x.id === chosen; })[0], nm = name.value.trim() || t("New member", "नया सदस्य");
        out.textContent = "";
        out.appendChild(el("div", { class: "mw-id", "data-member": "new" }, el("small", {}, t("Welcome aboard", "स्वागत है")), el("b", {}, nm), el("span", {}, planName(p) + " · " + AX.fmt.inr(p.price) + " · ID MF-3" + (200 + d.members.length)), el("div", { style: { marginTop: "8px", fontSize: "13px" } }, t("Show this card at the front desk.", "यह कार्ड फ्रंट डेस्क पर दिखाएँ।"))));
        AX.ui.toast("Simulated — payment not charged, member not created", { kind: "sim" });
      } } }, t("Pay and join", "भुगतान करें और जुड़ें"))));
      root.appendChild(out);
      root.appendChild(restart());
    }
    scan();
  }

  AX.demos[SLUG] = {
    brand: { name: "Max Fitness", accent: ACCENT, logoText: "M" },
    start: "site",
    lang: { options: ["en", "hi"] },
    modules: [
      { id: "site", label: "Live website", icon: "home", group: "Public site", view: { type: "custom", render: site } },
      { id: "join", label: "QR onboarding", icon: "users", group: "Public site", view: { type: "custom", render: join } }
    ]
  };
})(window);
