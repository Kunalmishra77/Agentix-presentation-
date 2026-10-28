/* Landing orchestrator: builds nav + scenes, wires Lenis to ScrollTrigger, the custom cursor,
   live search / status filter, and scroll restore around the demo shell. */
(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  var el = AX.el;
  var CONTACT = "https://ai-agentix.com/contact";
  var STATUSES = [["", "All"], ["live", "Live"], ["active", "In development"], ["proto", "Prototype"], ["concept", "Concept"]];
  var ctx = { reduced: false, lenis: null };
  var nav, filterState = { q: "", status: "" }, savedY = null, inited = false;

  function navH() { return nav ? nav.offsetHeight : 0; }

  function resolve(t) {
    if (typeof t === "number") return t;
    var n = typeof t === "string" ? document.querySelector(t) : t;
    return n || null;
  }

  /** Scroll the page to a y offset, selector or element (Lenis when active, native otherwise). */
  function scrollTo(target, o) {
    o = o || {};
    var t = resolve(target);
    if (t == null) return;
    var offset = o.offset != null ? o.offset : (typeof t === "number" ? 0 : -navH() + 1);
    if (ctx.lenis) {
      ctx.lenis.scrollTo(t, { offset: offset, immediate: !!o.immediate, duration: o.duration || 1.3, force: true, lock: false });
      return;
    }
    var y = typeof t === "number" ? t : t.getBoundingClientRect().top + (w.scrollY || 0) + offset;
    w.scrollTo(0, Math.max(0, y));
  }

  /* --- nav ---------------------------------------------------------------- */
  function buildMenu() {
    var list = el("ol", { class: "menu-list" }, (AX.categories || []).map(function (c) {
      var n = AX.lx.inCat(c.id).length;
      return el("li", null, el("a", { href: "#cat-" + c.id, class: "menu-link", on: { click: function (e) {
        e.preventDefault(); closeMenu(); scrollTo("#cat-" + c.id);
      } } }, el("span", { class: "menu-num" }, c.num), el("span", { class: "menu-title" }, c.title), el("span", { class: "menu-n" }, String(n))));
    }));
    return el("div", { id: "nav-menu", class: "nav-menu", hidden: true }, list);
  }
  var menuEsc = null;
  function closeMenu() {
    var m = document.getElementById("nav-menu"), b = nav && nav.querySelector(".nav-cats");
    if (!m || m.hidden) return;
    m.hidden = true; if (b) b.setAttribute("aria-expanded", "false");
    if (menuEsc) { menuEsc(); menuEsc = null; }
  }
  function toggleMenu() {
    var m = document.getElementById("nav-menu"), b = nav.querySelector(".nav-cats");
    if (!m.hidden) { closeMenu(); return; }
    m.hidden = false; b.setAttribute("aria-expanded", "true");
    var f = m.querySelector("a"); if (f) f.focus({ preventScroll: true });
  }

  function buildNav() {
    var q = el("input", { id: "q", class: "nav-q", type: "search", placeholder: "Search by name, client or industry", "aria-label": "Search projects", autocomplete: "off" });
    q.addEventListener("input", function () { filterState.q = q.value; applyFilter(); });
    var status = el("div", { class: "nav-status", role: "group", "aria-label": "Filter by status" }, STATUSES.map(function (s) {
      return el("button", { type: "button", class: "st-btn" + (s[0] ? " st-" + s[0] : ""), "data-status": s[0], "aria-pressed": s[0] === "" ? "true" : "false",
        on: { click: function () { setStatus(s[0]); } } }, s[1]);
    }));
    var count = el("button", { type: "button", class: "nav-count", hidden: true, on: { click: jumpToResults } });
    var findToggle = el("button", { type: "button", class: "nav-findtoggle", "aria-expanded": "false", "aria-controls": "nav-find",
      on: { click: function () {
        var on = nav.classList.toggle("is-finding");
        findToggle.setAttribute("aria-expanded", on ? "true" : "false");
        if (on) q.focus();
      } } }, "Search");
    nav = el("header", { id: "nav", class: "nav" },
      el("div", { class: "nav-row" },
        el("a", { class: "nav-logo", href: "#/", "aria-label": "AI Agentix, back to top", on: { click: function (e) { e.preventDefault(); scrollTo(0); } } },
          AX.ui.mark("nav-mark"), AX.preloader.wordmark("wordmark nav-word")),
        el("button", { type: "button", class: "nav-cats", "aria-expanded": "false", "aria-controls": "nav-menu", on: { click: toggleMenu } }, "Categories"),
        el("div", { id: "nav-find", class: "nav-find" }, el("label", { class: "nav-qwrap" }, el("span", { class: "nav-qicon", "aria-hidden": "true" }), q), status, count),
        findToggle,
        el("a", { class: "nav-cta", href: CONTACT, target: "_blank", rel: "noopener" }, "Start a project")),
      buildMenu());
    document.addEventListener("click", function (e) {
      var m = document.getElementById("nav-menu");
      if (m && !m.hidden && !e.target.closest(".nav-menu") && !e.target.closest(".nav-cats")) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.getElementById("nav-menu") && !document.getElementById("nav-menu").hidden) { closeMenu(); nav.querySelector(".nav-cats").focus(); }
    });
    return nav;
  }

  function setStatus(s) {
    filterState.status = s;
    Array.prototype.forEach.call(nav.querySelectorAll(".st-btn"), function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-status") === s ? "true" : "false"); });
    applyFilter();
  }

  var refreshT = null;
  function applyFilter() {
    var res = AX.sections && AX.sections.filter ? AX.sections.filter(filterState) : null;
    var count = nav.querySelector(".nav-count");
    var active = !!(filterState.q.trim() || filterState.status);
    if (res && active) {
      count.hidden = false;
      count.textContent = res.shown ? "Show " + res.shown + " of " + res.total : "No matches";
      count.disabled = !res.shown;
    } else count.hidden = true;
    document.documentElement.classList.toggle("is-filtering", active);
    clearTimeout(refreshT);
    refreshT = setTimeout(function () { if (w.ScrollTrigger) w.ScrollTrigger.refresh(); }, 140);
  }
  function jumpToResults() {
    var first = document.querySelector("#work .pcard:not([hidden])");
    if (first) scrollTo(first.closest(".cat") || first, { offset: -navH() - 8 });
  }

  /* --- custom cursor -------------------------------------------------------- */
  function cursor() {
    if (ctx.reduced || !AX.lx.finePointer() || !w.gsap) return;
    var c = el("div", { id: "cursor", class: "cursor", "aria-hidden": "true" }, el("span", { class: "cursor-label" }, "Open demo"));
    document.body.appendChild(c);
    var gx = w.gsap.quickTo(c, "x", { duration: 0.35, ease: "power3.out" }), gy = w.gsap.quickTo(c, "y", { duration: 0.35, ease: "power3.out" });
    w.addEventListener("pointermove", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      c.classList.add("is-on"); gx(e.clientX); gy(e.clientY);
    }, { passive: true });
    document.addEventListener("pointerover", function (e) {
      var t = e.target.closest && e.target.closest("[data-demo]");
      c.classList.toggle("is-demo", !!t && !document.body.classList.contains("shell-open"));
    });
    document.documentElement.addEventListener("pointerleave", function () { c.classList.remove("is-on"); });
  }

  /* --- scroll + shell -------------------------------------------------------- */
  function onRoute(r) {
    if (r.view === "demo") {
      if (savedY == null && inited) savedY = w.scrollY || 0;
      if (ctx.lenis) ctx.lenis.stop();
      return;
    }
    if (ctx.lenis) ctx.lenis.start();
    if (savedY != null) {
      var y = savedY; savedY = null;
      scrollTo(y, { immediate: true });
      if (w.ScrollTrigger) w.ScrollTrigger.refresh();
      if (Math.abs((w.scrollY || 0) - y) > 2) scrollTo(y, { immediate: true });
    }
  }

  function navScroll() {
    var on = (w.scrollY || 0) > 24;
    if (on !== nav.classList.contains("is-scrolled")) nav.classList.toggle("is-scrolled", on);
  }

  function init() {
    if (inited) return;
    var host = document.getElementById("landing");
    if (!host) return;
    ctx.reduced = AX.lx.reduced();
    var html = document.documentElement;
    html.classList.add(ctx.reduced ? "ax-reduced" : "ax-motion");
    try { if ("scrollRestoration" in w.history) w.history.scrollRestoration = "manual"; } catch (e) {}
    var gsap = w.gsap, ST = w.ScrollTrigger;
    if (gsap && ST) gsap.registerPlugin(ST);

    var modules = [AX.hero, AX.onelead, AX.indexList, AX.sections, AX.delivery].filter(function (m) { return m && m.build; });
    host.appendChild(buildNav());
    var main = el("main", { id: "main", class: "landing-main" });
    modules.forEach(function (m) { var n = m.build(ctx); if (n) main.appendChild(n); });
    host.appendChild(main);
    if (AX.delivery && AX.delivery.footer) host.appendChild(AX.delivery.footer(ctx));

    if (!ctx.reduced && w.Lenis && gsap && ST) {
      ctx.lenis = new w.Lenis({
        lerp: 0.11, smoothWheel: true, allowNestedScroll: true,
        prevent: function (n) { return n.id === "shell" || n.id === "nav-menu" || (n.classList && n.classList.contains("ov")); }
      });
      ctx.lenis.on("scroll", ST.update);
      gsap.ticker.add(function (t) { if (ctx.lenis) ctx.lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    AX.landing.lenis = ctx.lenis;
    var shellEl = document.getElementById("shell"); if (shellEl) shellEl.setAttribute("data-lenis-prevent", "");

    modules.forEach(function (m) { if (m.setup) m.setup(ctx); });
    cursor();
    w.addEventListener("scroll", navScroll, { passive: true });
    navScroll();
    inited = true;
    if (AX.router) AX.router.start(onRoute);

    var startedDemo = AX.router && AX.router.current().view === "demo";
    if (ctx.lenis && !startedDemo) ctx.lenis.stop();
    if (!startedDemo) scrollTo(0, { immediate: true });
    AX.preloader.run(ctx).then(function () {
      if (ctx.lenis && !document.body.classList.contains("shell-open")) ctx.lenis.start();
      modules.forEach(function (m) { if (m.intro) m.intro(ctx); });
      html.classList.add("ax-ready");
      var fonts = document.fonts && document.fonts.ready;
      (fonts || Promise.resolve()).then(function () { if (ST) ST.refresh(); });
    });
  }

  AX.landing = { init: init, lenis: null, scrollTo: scrollTo, ctx: ctx, applyFilter: function () { if (nav) applyFilter(); } };
  init();
})(window);
