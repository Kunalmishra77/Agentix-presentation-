/* Hero: split-line headline, a 3D fan of seven product screens that tilts toward the cursor,
   then (pinned for 120vh) spreads into a grid and fades. Reduced motion: a static grid. */
(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  var el = AX.el;
  var FAN = ["agentix", "woodpecker-pms", "agentix-hims", "max-register", "socialflow", "aurelle", "yt-automation"];
  var LINES = ["AI Applied,", "Growth Multiplied."];
  // The three lightest fan screenshots (measured 115-132 KB) load eagerly; the rest (incl. the 1 MB aurelle PNG) stay lazy.
  var EAGER = ["socialflow", "yt-automation", "agentix-hims"];
  var root, fan, stage, cards = [];

  function fanCard(p, eager) {
    var face = el("div", { class: "fan-face" },
      el("div", { class: "fan-bar", "aria-hidden": "true" }, el("i"), el("i"), el("i"), el("span", { class: "fan-url" }, p.slug.replace(/-/g, "") + ".app")),
      AX.lx.media(p, { eager: eager, sizes: "(max-width: 768px) 60vw, 26vw" }),
      el("div", { class: "fan-label" }, el("span", { class: "fan-name" }, p.name), AX.ui.statusChip(p.status)));
    var a = el("a", { class: "fan-card", href: "#/demo/" + p.slug, "data-demo": p.slug, "aria-label": "Open " + p.name },
      el("div", { class: "fan-deal" }, face));
    a.addEventListener("click", function (e) {
      if (AX.lx.modified(e)) return;
      e.preventDefault();
      AX.shell.open(p.slug, "overview", null, face.getBoundingClientRect());
    });
    return a;
  }

  function build() {
    var n = (AX.projects || []).length;
    cards = FAN.map(function (slug) {
      var p = AX.lx.project(slug);
      if (!p) return null;
      return fanCard(p, EAGER.indexOf(slug) >= 0 && !!(p.shots && p.shots.length));
    }).filter(Boolean);
    fan = el("div", { class: "fan" }, cards);
    stage = el("div", { class: "fan-stage" }, fan);

    var explore = el("a", { class: "btn-x btn-ink", href: "#index", on: { click: function (e) {
      e.preventDefault(); AX.landing.scrollTo(document.getElementById("index") ? "#index" : "#work");
    } } }, "Explore the work");
    var watch = el("a", { class: "btn-x btn-line", href: "#/demo/agentix/walkthrough/conversations", "data-demo": "agentix", on: { click: function (e) {
      if (AX.lx.modified(e)) return;
      e.preventDefault(); AX.router.go("#/demo/agentix/walkthrough/conversations");
    } } }, el("span", { class: "btn-pulse", "aria-hidden": "true" }), "Watch an agent close a lead");

    root = el("section", { id: "hero", class: "hero", "aria-label": "Introduction" },
      el("div", { class: "hero-copy" },
        el("h1", { class: "hero-title" }, LINES.map(function (t) {
          return el("span", { class: "line" }, el("span", { class: "line-in" }, t));
        })),
        el("div", { class: "hero-row" },
          el("p", { class: "hero-sub" }, n + " products, platforms and websites — built by AI Agentix. Open any of them and try it."),
          el("div", { class: "hero-ctas" }, explore, watch))),
      stage);
    return root;
  }

  /* --- fan geometry ------------------------------------------------------ */
  function cardW() { return cards[0] ? cards[0].offsetWidth : 300; }
  function fanState(i) {
    var d = i - (cards.length - 1) / 2, wd = cardW();
    return { x: d * wd * 0.6, y: d * d * wd * 0.05, rotation: d * 7, scale: 1, opacity: 1 };
  }
  /* Same state with x/y as functions, so invalidateOnRefresh recomputes them after a resize. */
  function fanVars(i) {
    return { x: function () { return fanState(i).x; }, y: function () { return fanState(i).y; }, rotation: fanState(i).rotation, scale: 1, opacity: 1 };
  }
  function gridState(i) {
    var wd = cardW(), s = 0.62, cw = wd * s, ch = cw * 0.7, gap = wd * 0.08;
    var row = i < 4 ? 0 : 1, col = row ? i - 4 : i, cols = row ? cards.length - 4 : 4;
    return { x: (col - (cols - 1) / 2) * (cw + gap), y: (row - 0.5) * (ch + gap), rotation: 0, scale: s };
  }
  /* Vertical lift that brings the fan from its bleed position to the viewport centre. */
  function lift() {
    if (!stage) return 0; // offsetTop ignores transforms, so this is stable across refreshes
    return w.innerHeight * 0.52 - (stage.offsetTop + stage.offsetHeight * 0.5);
  }

  function setup(ctx) {
    var gsap = w.gsap;
    if (ctx.reduced || !gsap) { fan.classList.add("is-grid"); return; }
    cards.forEach(function (c, i) { gsap.set(c, fanVars(i)); });

    // Hidden until the intro plays.
    gsap.set(root.querySelectorAll(".line-in"), { yPercent: 115 });
    gsap.set(root.querySelectorAll(".hero-sub, .hero-ctas"), { opacity: 0, y: 24 });
    gsap.set(root.querySelectorAll(".fan-deal"), { y: function () { return w.innerHeight * 0.7; }, opacity: 0 });

    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { id: "hero", trigger: root, start: "top top", end: "+=120%", pin: true, scrub: 0.6, invalidateOnRefresh: true }
    });
    cards.forEach(function (c, i) {
      tl.fromTo(c, fanVars(i), Object.assign(gridState(i), { duration: 0.7, ease: "power2.inOut",
        x: function () { return gridState(i).x; }, y: function () { return gridState(i).y; } }), 0);
      tl.to(c, { opacity: 0, duration: 0.3, ease: "power1.in" }, 0.62 + i * 0.012);
    });
    tl.to(stage, { y: lift, duration: 0.7, ease: "power2.inOut" }, 0)
      .to(root.querySelector(".hero-copy"), { y: function () { return -w.innerHeight * 0.18; }, opacity: 0, duration: 0.55 }, 0.1);

    // Cursor tilt, max 8 degrees, pointer devices only.
    if (AX.lx.finePointer()) {
      var rx = gsap.quickTo(fan, "rotationX", { duration: 0.8, ease: "power3.out" });
      var ry = gsap.quickTo(fan, "rotationY", { duration: 0.8, ease: "power3.out" });
      root.addEventListener("pointermove", function (e) {
        var b = root.getBoundingClientRect();
        var dx = (e.clientX - b.left) / b.width - 0.5, dy = (e.clientY - b.top) / b.height - 0.5;
        ry(Math.max(-8, Math.min(8, dx * 16))); rx(Math.max(-8, Math.min(8, -dy * 16)));
      });
      root.addEventListener("pointerleave", function () { rx(0); ry(0); });
    }
  }

  function intro(ctx) {
    var gsap = w.gsap;
    if (ctx.reduced || !gsap) return;
    var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.to(root.querySelectorAll(".line-in"), { yPercent: 0, duration: 1.1, stagger: 0.12 }, 0)
      .to(root.querySelectorAll(".fan-deal"), { y: 0, opacity: 1, duration: 1.2, stagger: { each: 0.06, from: "center" }, ease: "expo.out" }, 0.15)
      .to(root.querySelectorAll(".hero-sub, .hero-ctas"), { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.45);
  }

  AX.hero = { build: build, setup: setup, intro: intro, FAN: FAN };
})(window);
