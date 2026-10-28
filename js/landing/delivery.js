/* Delivery strip (deep-navy band): code -> build -> Docker/Coolify, Vercel, cPanel/Apache, Supabase -> live,
   drawn as an animated SVG path. Plus the footer: counters, contact CTA, logo and tagline. */
(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  var el = AX.el;
  var CONTACT = "https://ai-agentix.com/contact";
  var STACK = ["Docker", "Coolify", "Vercel", "cPanel", "Apache", "PHP and MySQL", "Supabase", "PostgreSQL RLS", "pg_cron", "pgvector", "Kubernetes", "Node.js", "BullMQ", "Playwright"];
  var TARGETS = [
    { k: "Docker + Coolify", d: "VPS containers for SocialFlow, LeadForge, Max Fitness, Woodpecker" },
    { k: "Vercel", d: "Most frontends, previews on every push" },
    { k: "cPanel + Apache", d: "PHP and MySQL sites for Umang, Dr. Shweta, Fitness First" },
    { k: "Supabase", d: "Postgres with RLS, pg_cron, pgmq and pgvector" }
  ];
  var strip, footerEl, counters = [];

  // SVG geometry in a 1200 x 380 box
  var X = { code: 90, build: 330, tgt: 640, live: 1100 }, Y = [62, 148, 234, 320], MID = 190;
  function curve(x1, y1, x2, y2) { var mx = (x1 + x2) / 2; return "M" + x1 + " " + y1 + " C" + mx + " " + y1 + " " + mx + " " + y2 + " " + x2 + " " + y2; }
  function paths() {
    var d = ["M" + X.code + " " + MID + " L" + X.build + " " + MID];
    Y.forEach(function (y) { d.push(curve(X.build, MID, X.tgt - 90, y) + " L" + (X.tgt + 90) + " " + y); d.push(curve(X.tgt + 90, y, X.live, MID)); });
    return d;
  }

  function node(label, sub, x, y, cls) {
    return el("div", { class: "pipe-node " + (cls || ""), style: "left:" + (x / 12) + "%;top:" + (y / 3.8) + "%" },
      el("b", null, label), sub ? el("small", null, sub) : null);
  }

  function build(c, list) {
    var svg = '<svg class="pipe-svg" viewBox="0 0 1200 380" preserveAspectRatio="none" aria-hidden="true">' +
      paths().map(function (d) { return '<path class="pipe-base" d="' + d + '"/><path class="pipe-draw" pathLength="1" d="' + d + '"/><path class="pipe-flow" d="' + d + '"/>'; }).join("") + "</svg>";
    var diagram = el("div", { class: "pipe-diagram" }, el("div", { class: "pipe-svgwrap", html: svg }),
      node("Code", "Git, reviews, tests", X.code, MID, "pn-code"),
      node("Build", "CI, images, bundles", X.build, MID, "pn-build"),
      TARGETS.map(function (t, i) { return node(t.k, null, X.tgt, Y[i], "pn-tgt"); }),
      node("Live", "Monitored, backed up", X.live, MID, "pn-live"));
    var steps = el("ol", { class: "pipe-list" },
      el("li", null, el("b", null, "Code"), el("span", null, "Git, reviews and tests")),
      el("li", null, el("b", null, "Build"), el("span", null, "CI, container images and bundles")),
      TARGETS.map(function (t) { return el("li", { class: "pl-tgt" }, el("b", null, t.k), el("span", null, t.d)); }),
      el("li", null, el("b", null, "Live"), el("span", null, "Monitored and backed up")));
    var items = list.map(function (p) {
      return el("a", { class: "pipe-proj", href: "#/demo/" + p.slug, "data-demo": p.slug, on: { click: function (e) {
        if (AX.lx.modified(e)) return;
        e.preventDefault(); AX.shell.open(p.slug, "overview", null, e.currentTarget.getBoundingClientRect());
      } } }, el("b", null, p.name), el("span", null, p.summary), el("span", { class: "pipe-open" }, "How it works →"));
    });
    strip = el("section", { id: "cat-" + c.id, class: "cat cat--pipeline", "data-cat": c.id, "aria-labelledby": "h-" + c.id },
      el("header", { class: "cat-head" },
        el("span", { class: "cat-num" }, c.num),
        el("h2", { class: "cat-title", id: "h-" + c.id }, c.title),
        el("p", { class: "cat-statement" }, c.statement)),
      el("div", { class: "pipe" }, diagram, steps),
      el("div", { class: "pipe-foot" },
        el("ul", { class: "pipe-stack", "aria-label": "Stack" }, STACK.map(function (s) { return el("li", null, s); })),
        el("div", { class: "pipe-projs" }, items)));
    return strip;
  }

  function footer() {
    var P = AX.projects || [], C = AX.categories || [];
    var live = P.filter(function (p) { return p.status === "live"; }).length;
    counters = [[P.length, "projects in this portfolio"], [C.length, "categories, from agents to cinematic sites"], [live, "live in production today"]];
    var nums = counters.map(function (x) {
      // the animated number is decorative; screen readers get the final value at once
      var n = el("span", { class: "ft-num", "data-to": String(x[0]), "aria-hidden": "true" }, String(x[0]));
      return el("div", { class: "ft-stat" }, n, el("span", { class: "sr-only" }, String(x[0]) + " "), el("span", { class: "ft-lbl" }, x[1]));
    });
    footerEl = el("footer", { id: "footer", class: "footer" },
      el("div", { class: "ft-stats" }, nums),
      el("div", { class: "ft-cta-row" },
        el("h2", { class: "ft-h" }, "Have a process that should run itself?"),
        el("div", { class: "ft-cta-side" },
          el("p", null, "Tell us where leads, bookings or paperwork get stuck. We will show you which of these systems fits, and build the rest."),
          el("a", { class: "ft-cta btn-x btn-ink", href: CONTACT, target: "_blank", rel: "noopener" }, "Start a project"))),
      el("div", { class: "ft-base" },
        el("div", { class: "ft-brand" }, AX.ui.mark("ft-mark"), AX.preloader.wordmark("wordmark ft-word")),
        el("p", { class: "ft-tag" }, "AI Applied, Growth Multiplied."),
        el("p", { class: "ft-note" }, "Every demo runs on fictional data. Nothing is sent or saved.")));
    return footerEl;
  }

  function setup(ctx) {
    var gsap = w.gsap, ST = w.ScrollTrigger;
    if (ctx.reduced || !gsap || !ST) { if (strip) strip.classList.add("is-drawn"); return; }
    if (strip) {
      var draws = strip.querySelectorAll(".pipe-draw");
      gsap.set(draws, { strokeDasharray: 1, strokeDashoffset: 1 });
      var tl = gsap.timeline({ scrollTrigger: { trigger: strip.querySelector(".pipe"), start: "top 80%", end: "center 45%", scrub: 0.6,
        onLeave: function () { strip.classList.add("is-drawn"); }, onEnterBack: function () { strip.classList.add("is-drawn"); } } });
      tl.to(draws[0], { strokeDashoffset: 0, duration: 0.3, ease: "none" }, 0);
      Array.prototype.slice.call(draws, 1).forEach(function (d, i) { tl.to(d, { strokeDashoffset: 0, duration: 0.35, ease: "none" }, 0.3 + (i % 2) * 0.35 + Math.floor(i / 2) * 0.04); });
      tl.from(strip.querySelectorAll(".pipe-node"), { opacity: 0, scale: 0.85, duration: 0.15, stagger: 0.1 }, 0);
      // packets only flow while the strip is on screen (CSS also pauses them while the shell is open)
      ST.create({ trigger: strip, start: "top bottom", end: "bottom top", toggleClass: { targets: strip, className: "is-flowing" } });
    }
    if (footerEl) {
      var nums = footerEl.querySelectorAll(".ft-num");
      ST.create({ trigger: footerEl, start: "top 85%", once: true, onEnter: function () {
        Array.prototype.forEach.call(nums, function (n) {
          var to = +n.getAttribute("data-to"), o = { v: 0 };
          gsap.to(o, { v: to, duration: 1.4, ease: "power3.out", onUpdate: function () { n.textContent = String(Math.round(o.v)); }, onComplete: function () { n.textContent = String(to); } });
        });
      } });
      // the counters read 0 until they are reached, then count up
      Array.prototype.forEach.call(nums, function (n) { if (footerEl.getBoundingClientRect().top > w.innerHeight) n.textContent = "0"; });
    }
  }

  AX.delivery = { strip: build, footer: footer, setup: setup };
})(window);
