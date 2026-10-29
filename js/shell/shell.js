(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  var el = AX.el;
  var TAB_LABELS = { overview: "Overview", walkthrough: "Walkthrough", how: "How it works", screens: "Screens", tech: "Tech" };
  var root, cur = { slug: null, tab: null }, pendingRect = null, renderToken = 0, cameFromHome = false, prevFocus = null;
  function demoLoaded(p) { return !p.demo || !!(AX.demos && AX.demos[p.slug]); }

  function reduced() { return w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function project(slug) { return (AX.projects || []).filter(function (p) { return p.slug === slug; })[0]; }
  function catTitle(id) { var c = (AX.categories || []).filter(function (x) { return x.id === id; })[0]; return c ? c.title : id; }

  function section(title, node) { return el("section", { class: "pane-sec" }, el("h3", { class: "pane-h" }, title), node); }

  function paneOverview(p) {
    var groups = p.features.slice().sort(function (a, b) { return a.group.localeCompare(b.group); });
    var grid = el("div", { class: "cap-grid" });
    groups.forEach(function (g) {
      grid.appendChild(el("div", { class: "cap-group" }, el("h4", { class: "cap-title" }, g.group),
        el("ul", { class: "cap-list" }, g.items.map(function (i) { return el("li", null, i); }))));
    });
    return el("div", { class: "pane pane-overview" },
      el("p", { class: "lede" }, p.summary),
      el("div", { class: "two-col" },
        section("The problem", el("p", null, p.problem)),
        section("Outcomes", el("ul", { class: "outcomes" }, p.outcomes.map(function (o) { return el("li", null, o); })))),
      section("Capabilities, A–Z", grid));
  }

  function flow(p) {
    var f = el("ol", { class: "flow" });
    p.workflow.forEach(function (s, i) {
      f.appendChild(el("li", { class: "flow-step" }, el("span", { class: "flow-num" }, String(i + 1)),
        el("h4", { class: "flow-title" }, s.title), el("p", { class: "flow-desc" }, s.desc)));
    });
    return f;
  }
  function paneHow(p) { return el("div", { class: "pane" }, section("How it works", flow(p))); }

  function openLightbox(shots, idx) {
    var img = el("img", { class: "lb-img", alt: "" });
    var cap = el("p", { class: "lb-cap" });
    var removeEsc, box, opener = document.activeElement;
    function show(i) {
      idx = (i + shots.length) % shots.length;
      img.src = shots[idx].src; img.alt = shots[idx].caption || ""; cap.textContent = shots[idx].caption || "";
    }
    function close() {
      removeEsc();
      if (box.parentNode) box.parentNode.removeChild(box);
      if (opener && opener.isConnected && opener.focus) opener.focus();
    }
    function nav(label, cls, ch, d) {
      return shots.length > 1 ? el("button", { class: "lb-nav " + cls, type: "button", "aria-label": label,
        on: { click: function (e) { e.stopPropagation(); show(idx + d); } } }, ch) : null;
    }
    box = el("div", { class: "lightbox", role: "dialog", "aria-modal": "true", "aria-label": "Screenshot viewer", on: { click: close } },
      el("button", { class: "lb-x", type: "button", "aria-label": "Close", on: { click: close } }, "×"),
      nav("Previous", "lb-prev", "‹", -1),
      el("figure", { class: "lb-fig", on: { click: function (e) { e.stopPropagation(); } } }, img, cap),
      nav("Next", "lb-next", "›", 1));
    removeEsc = AX.ui.pushEsc(close, box);
    show(idx);
    root.appendChild(box);
    box.querySelector(".lb-x").focus();
  }

  function paneScreens(p) {
    if (!p.shots || !p.shots.length) return el("div", { class: "pane" }, section("Screens", el("p", { class: "muted" }, "Screenshots for this project are not published yet.")));
    var g = el("div", { class: "shots" });
    p.shots.forEach(function (s, i) {
      var img = el("img", { src: s.src, alt: s.caption || "", loading: "lazy" });
      img.addEventListener("error", function () { img.style.visibility = "hidden"; });
      g.appendChild(el("button", { class: "shot", type: "button", on: { click: function () { openLightbox(p.shots, i); } } },
        img, el("span", { class: "shot-cap" }, s.caption || "")));
    });
    return el("div", { class: "pane" }, section("Screens", g));
  }

  function paneTech(p) {
    return el("div", { class: "pane" }, section("Tech stack",
      el("div", { class: "chips" }, p.stack.map(function (t) { return el("span", { class: "chip-stack" }, t); }))));
  }

  /* Single branching point: Tasks 7-8 fill in AX.appShell / AX.embed. */
  function renderWalkthrough(host, p, route) {
    host.textContent = "";
    var wrap = el("div", { class: "pane pane-walk" });
    host.appendChild(wrap);
    if (p.demo && !demoLoaded(p)) { wrap.appendChild(el("div", { class: "walk-placeholder" }, "Interactive walkthrough loading…")); return; }
    if (p.demo && AX.appShell && AX.appShell.mount) { AX.appShell.mount(wrap, p, route); return; }
    if (p.embed && AX.embed && AX.embed.mount) { AX.embed.mount(wrap, p, route); return; }
    if (!p.demo && !p.embed) { wrap.appendChild(section("How it works", flow(p))); return; }
    wrap.appendChild(el("div", { class: "walk-placeholder" }, "Interactive walkthrough loading…"));
  }

  function ensureDemo(p) {
    if (!p.demo) return Promise.resolve(null);
    AX.demos = AX.demos || {};
    if (AX.demos[p.slug]) return Promise.resolve(AX.demos[p.slug]);
    return AX.load("js/demos/data/" + p.slug + ".js")
      .then(function () { return AX.load("js/demos/" + p.slug + ".js"); })
      .then(function () { return AX.demos[p.slug] || null; });
  }

  function build(p) {
    AX.ui.closeAll();
    root.textContent = "";
    var back = el("a", { class: "back", href: "#/", on: { click: function (e) { e.preventDefault(); close(); } } }, "← All projects");
    var bar = el("header", { class: "shell-bar" },
      el("div", { class: "bar-brand" }, AX.ui.mark("bar-mark"), AX.ui.wordmark({ light: true, cls: "bar-word" })),
      el("div", { class: "bar-title" }, el("h2", { class: "bar-name", tabindex: "-1" }, p.name), el("span", { class: "bar-cat" }, catTitle(p.category))),
      el("div", { class: "bar-meta" }, AX.ui.statusChip(p.status), el("span", { class: "sim-pill" }, "Demo data · Simulated"), AX.ui.agentixBadge({ size: "sm" }), back));
    var tabs = el("nav", { class: "tabs", "aria-label": "Project sections" });
    AX.router.TABS.forEach(function (t) {
      tabs.appendChild(el("button", { class: "tab", type: "button", "data-tab": t,
        on: { click: function () { AX.router.go("#/demo/" + p.slug + (t === "overview" ? "" : "/" + t), { replace: true }); } } }, TAB_LABELS[t]));
    });
    root.appendChild(bar); root.appendChild(tabs);
    root.appendChild(el("div", { class: "shell-note", "aria-live": "polite", hidden: true }));
    root.appendChild(el("main", { class: "shell-body", id: "shell-main" }, el("div", { class: "shell-pane" })));
  }

  function renderTab(p, route) {
    var token = ++renderToken;
    Array.prototype.forEach.call(root.querySelectorAll(".tab"), function (b) {
      var on = b.getAttribute("data-tab") === route.tab;
      if (on) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
      b.classList.toggle("on", on);
    });
    var host = root.querySelector(".shell-pane");
    var note = root.querySelector(".shell-note");
    var panes = { overview: paneOverview, how: paneHow, screens: paneScreens, tech: paneTech };
    if (route.tab === "walkthrough" && p.demo && AX.appShell && AX.appShell.sync && AX.appShell.sync(host, p, route)) return;
    host.textContent = "";
    root.querySelector(".shell-body").scrollTop = 0;
    if (route.tab === "walkthrough") renderWalkthrough(host, p, route);
    else host.appendChild(panes[route.tab](p));
    if (p.demo && !demoLoaded(p)) {
      ensureDemo(p).then(function () {
        if (token !== renderToken) return;
        note.hidden = true;
        if (route.tab === "walkthrough") renderWalkthrough(host, p, route);
      }).catch(function () {
        if (token !== renderToken) return;
        var msg = "The interactive demo could not be loaded. The overview is still available.";
        note.hidden = false;
        note.textContent = msg;
        var ph = host.querySelector(".walk-placeholder");
        if (ph) ph.textContent = msg;
      });
    }
  }

  function animateIn(r) {
    if (reduced() || !root.animate) return;
    var vw = w.innerWidth, vh = w.innerHeight, kf;
    if (r && r.width > 0) {
      root.style.transformOrigin = "0 0";
      kf = [{ transform: "translate(" + r.left + "px," + r.top + "px) scale(" + (r.width / vw) + "," + (r.height / vh) + ")", opacity: 0.4 },
            { transform: "none", opacity: 1 }];
    } else {
      root.style.transformOrigin = "50% 50%";
      kf = [{ transform: "scale(.97)", opacity: 0 }, { transform: "none", opacity: 1 }];
    }
    root.animate(kf, { duration: 420, easing: "cubic-bezier(.2,.7,.2,1)" });
  }

  function show(p, route, rect) {
    var wasHidden = root.hidden;
    if (wasHidden || cur.slug !== p.slug) {
      if (wasHidden) prevFocus = document.activeElement;
      build(p);
      root.hidden = false;
      root.setAttribute("role", "dialog");
      root.setAttribute("aria-modal", "true");
      root.setAttribute("aria-label", p.name);
      var landing = document.getElementById("landing"); if (landing) landing.inert = true;
      document.body.classList.add("shell-open");
      cur.slug = p.slug;
      if (wasHidden) animateIn(rect);
      var title = root.querySelector(".bar-name"); if (title) title.focus({ preventScroll: true });
    }
    cur.tab = route.tab;
    document.title = p.name + " — AI Agentix";
    renderTab(p, route);
  }

  function hide() {
    AX.ui.closeAll();
    if (root.hidden) return;
    root.hidden = true;
    root.removeAttribute("role"); root.removeAttribute("aria-modal"); root.removeAttribute("aria-label");
    var landing = document.getElementById("landing"); if (landing) landing.inert = false;
    root.textContent = "";
    cur = { slug: null, tab: null };
    document.body.classList.remove("shell-open");
    document.title = "AI Agentix — Products & Work";
    var f = prevFocus; prevFocus = null;
    if (f && f.isConnected && f.focus) { try { f.focus(); } catch (e) {} }
  }

  function onRoute(route) {
    var rect = pendingRect; pendingRect = null;
    if (route.view !== "demo") { cameFromHome = true; hide(); return; }
    var p = project(route.slug);
    if (!p) { hide(); AX.router.go("#/", { replace: true }); return; }
    show(p, route, rect);
  }

  function open(slug, tab, module, originRect) {
    pendingRect = originRect || null;
    var path = "#/demo/" + slug + (tab && tab !== "overview" ? "/" + tab + (tab === "walkthrough" && module ? "/" + module : "") : "");
    if (w.location.hash === path) { onRoute(AX.router.parse(path)); pendingRect = null; } else AX.router.go(path);
  }
  function close() {
    if (root.hidden) return;
    if (cameFromHome && w.history.length > 1) w.history.back();
    else AX.router.go("#/", { replace: true });
  }

  function init() {
    root = document.getElementById("shell");
    root.classList.add("shell");
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || root.hidden) return;
      if (!AX.ui.closeTop()) close();
    });
    AX.router.start(onRoute);
  }

  AX.shell = { open: open, close: close, renderWalkthrough: renderWalkthrough, ensureDemo: ensureDemo };
  init();
})(window);
