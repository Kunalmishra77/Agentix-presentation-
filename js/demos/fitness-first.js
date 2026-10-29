(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.demos = AX.demos || {};
  if (typeof document === "undefined" || !document.getElementById) return;
  var el = AX.el, SLUG = "fitness-first", ACCENT = "#DC2626";

  var CSS = [
    '.ff-site{background:#0F0F10;color:#fff;border-radius:14px;overflow:hidden}',
    '.ff-hero{padding:56px 28px;background:linear-gradient(120deg,#0F0F10 30%,#7F1D1D 100%);position:relative}',
    '.ff-hero h2{margin:0 0 10px;font:700 clamp(28px,5vw,48px) var(--font-display);line-height:1.05;max-width:16ch}',
    '.ff-hero p{margin:0 0 20px;max-width:46ch;color:#E5E5E5}',
    '.ff-btn{appearance:none;font:700 13px var(--font-body);padding:11px 22px;border-radius:999px;border:1px solid var(--ax-accent);background:var(--ax-accent);color:#fff;cursor:pointer;text-decoration:none;display:inline-block}',
    '.ff-btn.ghost{background:transparent;color:#fff;border-color:#fff}.ff-btn.dark{background:#fff;color:#111;border-color:#fff}',
    '.ff-sec{padding:26px 28px}.ff-sec h3{margin:0 0 14px;font:700 20px var(--font-display)}',
    '.ff-progs{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px}',
    '.ff-prog{background:#1A1A1C;border:1px solid #2B2B2E;border-radius:12px;padding:14px}.ff-prog b{display:block;font:700 15px var(--font-display);color:#fff;margin-bottom:4px}.ff-prog p{margin:0 0 8px;color:#BDBDBD;font-size:13px}.ff-prog small{color:#F87171;font:600 11px var(--font-mono)}',
    '.ff-trainers{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px}',
    '.ff-tr{background:#1A1A1C;border-radius:12px;padding:14px;text-align:center}.ff-tr i{display:grid;place-items:center;width:56px;height:56px;border-radius:50%;background:var(--ax-accent);margin:0 auto 8px;font:700 16px var(--font-display);font-style:normal}.ff-tr b{display:block;font-size:14px}.ff-tr small{color:#BDBDBD}',
    '.ff-strip{display:flex;gap:10px;flex-wrap:wrap;padding:14px 28px;background:#18181A;font-size:13px;align-items:center;justify-content:space-between}',
    '.ff-plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px}',
    '.ff-plan{appearance:none;text-align:left;background:#fff;border:2px solid var(--ax-line);border-radius:14px;padding:16px;cursor:pointer;font:inherit;color:var(--ink);display:flex;flex-direction:column;gap:6px}',
    '.ff-plan[aria-pressed="true"]{border-color:var(--ax-accent);background:#FEF2F2;box-shadow:0 6px 20px rgba(220,38,38,.18)}',
    '.ff-plan b{font:700 15px var(--font-display)}.ff-plan .was{text-decoration:line-through;color:var(--ink-3);font-size:13px}.ff-plan .now{font:700 24px var(--font-display);color:var(--ax-accent)}',
    '.ff-plan ul{margin:6px 0 0;padding-left:16px;font-size:12px;color:var(--ink-2)}',
    '.ff-save{display:inline-block;font:700 11px var(--font-mono);padding:2px 8px;border-radius:6px;background:#16A34A;color:#fff;align-self:flex-start}',
    '.ff-sum{margin-top:16px;padding:14px 16px;border-radius:12px;background:#111;color:#fff;display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap}',
    '.ff-thanks{margin-top:14px;padding:16px;border-radius:12px;background:#F0FDF4;border:1px solid #BBF7D0;font-size:14px;line-height:1.5}.ff-thanks a{color:#B91C1C;font-weight:600}'
  ].join("\n");
  function injectCss() {
    if (document.getElementById("ff-css")) return;
    var s = document.createElement("style"); s.id = "ff-css";
    s.textContent = CSS + '\n.ax-app[data-slug="' + SLUG + '"],.demo-scope[data-slug="' + SLUG + '"]{--orange:' + ACCENT + '}';
    document.head.appendChild(s);
  }
  injectCss();
  var RIYA = "#/demo/riya-crm/walkthrough/inbox";
  function money(n) { return AX.fmt.inr(n); }

  function site(host, ctx) {
    injectCss();
    var d = ctx.data;
    host.appendChild(el("div", { class: "ff-site", "data-site": "fitness-first" },
      el("div", { class: "ff-hero" }, el("h2", {}, "Train where Dwarka trains."),
        el("p", {}, "Group programs, certified trainers and a floor built for results. Walk in for a free trial."),
        el("div", { style: { display: "flex", gap: "10px", flexWrap: "wrap" } },
          el("button", { type: "button", class: "ff-btn", "data-act": "trial", on: { click: function () { ctx.open("trial"); } } }, "Book a free trial"),
          el("button", { type: "button", class: "ff-btn ghost", on: { click: function () { ctx.open("plans"); } } }, "See membership plans"))),
      el("div", { class: "ff-sec" }, el("h3", {}, "Group programs"),
        el("div", { class: "ff-progs" }, d.programs.map(function (p) { return el("div", { class: "ff-prog" }, el("b", {}, p.name), el("p", {}, p.blurb), el("small", {}, p.mins + " min · " + p.level)); }))),
      el("div", { class: "ff-sec" }, el("h3", {}, "Trainers"),
        el("div", { class: "ff-trainers" }, d.trainers.map(function (t) { return el("div", { class: "ff-tr" }, el("i", {}, t.initials), el("b", {}, t.name), el("small", {}, t.speciality + " · " + t.years + " yrs")); }))),
      el("div", { class: "ff-strip" },
        el("span", {}, "A guided tour of the site's sections with sample content. The real site is under Live website."),
        el("span", { style: { display: "flex", gap: "10px", flexWrap: "wrap" } },
          el("a", { class: "ff-btn dark", href: "https://fitnessfirstdwarka.com/", target: "_blank", rel: "noopener" }, "Open live site ↗"),
          el("a", { class: "ff-btn ghost", href: RIYA, "data-link": "riya-crm" }, "See Riya, the WhatsApp CRM →")))));
  }

  function live(host) {
    injectCss();
    AX.embed.create(host, AX.embed.optsForSlug(SLUG));
  }

  function plans(host, ctx) {
    injectCss();
    var d = ctx.data, sel = ctx.state.get().plan || "m6";
    var grid = el("div", { class: "ff-plans", role: "group", "aria-label": "Membership duration" });
    var sum = el("div", { class: "ff-sum", "aria-live": "polite" });
    function draw() {
      grid.textContent = "";
      d.plans.forEach(function (p) {
        var save = Math.round((1 - p.offer / p.base) * 100);
        grid.appendChild(el("button", { type: "button", class: "ff-plan", "data-plan": p.id, "aria-pressed": String(p.id === sel), on: { click: function () { sel = p.id; ctx.state.set({ plan: p.id }); draw(); } } },
          el("b", {}, p.label), el("span", { class: "was" }, money(p.base)), el("span", { class: "now" }, money(p.offer)),
          el("span", { class: "ff-save" }, "Save " + save + "%"), el("small", {}, money(Math.round(p.offer / p.months)) + " per month"),
          el("ul", {}, p.perks.map(function (x) { return el("li", {}, x); }))));
      });
      var cur = d.plans.filter(function (p) { return p.id === sel; })[0];
      sum.textContent = "";
      sum.setAttribute("data-selected", cur.id);
      sum.appendChild(el("span", {}, "Selected: ", el("b", {}, cur.label + " at " + money(cur.offer)), " (offer price, inclusive of GST)"));
      sum.appendChild(el("button", { type: "button", class: "ff-btn", "data-act": "choose", on: { click: function () { ctx.open("trial"); } } }, "Start with a free trial"));
    }
    host.appendChild(el("div", {}, el("p", { style: { margin: "0 0 12px", fontSize: "14px" } }, "Pick a duration. Longer plans cost less per month."), grid, sum));
    draw();
  }

  AX.demos[SLUG] = {
    brand: { name: "Fitness First", accent: ACCENT, logoText: "FF" },
    start: "site",
    modules: [
      { id: "site", label: "Live website", icon: "home", group: "Public site", view: { type: "custom", render: live } },
      { id: "tour", label: "Website tour", icon: "layout", group: "Public site", view: { type: "custom", render: site } },
      { id: "plans", label: "Membership plans", icon: "wallet", group: "Public site", view: { type: "custom", render: plans } },
      { id: "trial", label: "Free trial", icon: "form", group: "Public site", view: function (ctx) {
        var d = ctx.data, plan = ctx.state.get().plan;
        var labels = d.plans.map(function (p) { return p.label + " - " + AX.fmt.inr(p.offer); });
        if (plan) { var i = d.plans.map(function (p) { return p.id; }).indexOf(plan); if (i > 0) labels = [labels[i]].concat(labels.filter(function (x, k) { return k !== i; })); }
        return { type: "form", submit: "Book my free trial",
          fields: [{ key: "name", label: "Your name" }, { key: "phone", label: "Mobile number" }, { key: "goal", label: "Main goal", type: "select", options: d.goals },
            { key: "time", label: "Preferred time", type: "select", options: d.times }, { key: "plan", label: "Plan you are considering", type: "select", options: labels }],
          onSubmit: function (v) {
            var first = (v.name || "there").split(" ")[0];
            return el("div", { class: "ff-thanks", "data-state": "thank-you" },
              el("b", {}, "Thank you, " + first + "!"),
              el("p", { style: { margin: "6px 0" } }, "Your free trial request is in. Riya, our WhatsApp assistant, will message you to confirm a " + v.time.split(" ")[0].toLowerCase() + " slot. Nothing was actually sent in this demo."),
              el("a", { href: RIYA, "data-link": "riya-crm" }, "See how Riya follows up →"));
          } };
      } }
    ]
  };
})(window);
